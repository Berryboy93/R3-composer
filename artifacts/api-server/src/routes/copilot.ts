import { Router, type IRouter } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { eq } from "drizzle-orm";
import { db, compositionsTable } from "@workspace/db";
import { AnalyzeCompositionBody, GetSuggestionsBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

function noAiError(res: import("express").Response) {
  res.status(503).json({
    error: {
      code: "AI_UNAVAILABLE",
      message: "Anthropic API key not configured. Add ANTHROPIC_API_KEY to your secrets.",
    },
  });
}

const ANALYSIS_SYSTEM = `You are a professional music producer and arranger. Analyze the provided composition and return structured feedback.
Respond ONLY with valid JSON. No markdown, no preamble.

Output exactly this structure:
{
  "overallScore": 74,
  "dimensionScores": {
    "melody": 82,
    "harmony": 78,
    "rhythm": 70,
    "structure": 65
  },
  "styleMatch": 0.88,
  "recommendations": [
    {
      "dimension": "structure",
      "severity": "suggestion",
      "message": "...",
      "action": null
    }
  ]
}

Severity values: "info" | "suggestion" | "warning"
Dimension values: "melody" | "harmony" | "rhythm" | "structure"
All scores 0-100. styleMatch 0.0-1.0. Include 3-5 recommendations.`;

const SUGGESTIONS_SYSTEM = `You are a professional music producer. Given a composition and a follow-up question, provide 3 actionable suggestions.
Respond ONLY with valid JSON. No markdown, no preamble.

Output exactly this structure:
{
  "suggestions": [
    { "type": "text", "content": "..." },
    { "type": "text", "content": "..." },
    { "type": "chord_suggestion", "content": "..." }
  ]
}

Type values: "text" | "chord_suggestion" | "rhythm_suggestion"`;

router.post("/copilot/analyze", async (req, res): Promise<void> => {
  const anthropic = getAnthropicClient();
  if (!anthropic) { noAiError(res); return; }

  const parsed = AnalyzeCompositionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "INVALID_REQUEST", message: parsed.error.message } });
    return;
  }

  const [comp] = await db.select().from(compositionsTable).where(eq(compositionsTable.id, parsed.data.compositionId));
  if (!comp) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Composition not found" } });
    return;
  }

  const start = Date.now();

  try {
    const context = JSON.stringify({
      genre: comp.genre,
      mood: comp.mood,
      key: comp.key,
      bpm: comp.bpm,
      prompt: comp.prompt,
      chordCount: (comp.harmonyData as { chords?: unknown[] })?.chords?.length ?? 0,
      melodyNoteCount: (comp.melodyData as { notes?: unknown[] })?.notes?.length ?? 0,
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: ANALYSIS_SYSTEM,
      messages: [{ role: "user", content: context }],
    });

    const block = response.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") throw new Error("No text response");

    const raw = block.text.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
    const analysis = JSON.parse(raw);

    res.json({
      analysisId: `analysis-${Date.now()}`,
      analysis,
      analysisMs: Date.now() - start,
    });
  } catch (err) {
    logger.error({ err }, "Copilot analysis failed");
    res.status(500).json({ error: { code: "ANALYSIS_FAILED", message: "Analysis failed. Please try again." } });
  }
});

router.post("/copilot/suggestions", async (req, res): Promise<void> => {
  const anthropic = getAnthropicClient();
  if (!anthropic) { noAiError(res); return; }

  const parsed = GetSuggestionsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "INVALID_REQUEST", message: parsed.error.message } });
    return;
  }

  const [comp] = await db.select().from(compositionsTable).where(eq(compositionsTable.id, parsed.data.compositionId));
  if (!comp) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Composition not found" } });
    return;
  }

  try {
    const context = JSON.stringify({
      question: parsed.data.question,
      genre: comp.genre,
      mood: comp.mood,
      key: comp.key,
      bpm: comp.bpm,
      prompt: comp.prompt,
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: SUGGESTIONS_SYSTEM,
      messages: [{ role: "user", content: context }],
    });

    const block = response.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") throw new Error("No text response");

    const raw = block.text.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
    const result = JSON.parse(raw);

    res.json(result);
  } catch (err) {
    logger.error({ err }, "Copilot suggestions failed");
    res.status(500).json({ error: { code: "SUGGESTIONS_FAILED", message: "Failed to generate suggestions." } });
  }
});

export default router;
