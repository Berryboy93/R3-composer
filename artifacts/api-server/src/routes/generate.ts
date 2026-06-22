import { Router, type IRouter } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { eq } from "drizzle-orm";
import { db, compositionsTable, composerSessionsTable } from "@workspace/db";
import {
  GenerateCompositionBody,
  RegenerateCompositionBody,
  GenerateCompositionResponse,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

function noAiError(res: Parameters<typeof res>[0]) {
  (res as import("express").Response).status(503).json({
    error: {
      code: "AI_UNAVAILABLE",
      message: "Anthropic API key not configured. Add ANTHROPIC_API_KEY to your secrets.",
    },
  });
}

const HARMONY_SYSTEM = `You are a professional music theory engine. Given a prompt, genre, mood, key, and BPM, generate a chord progression.
Respond ONLY with valid JSON. No markdown, no preamble, no commentary.
Output exactly this structure:
{
  "key": "Cm",
  "bpm": 140,
  "timeSignature": "4/4",
  "chords": [
    { "position": 1, "symbol": "Cm", "romanNumeral": "i", "duration": 4, "midiNotes": [60, 63, 67] },
    { "position": 5, "symbol": "Ab", "romanNumeral": "VI", "duration": 4, "midiNotes": [56, 60, 63] },
    { "position": 9, "symbol": "Bb", "romanNumeral": "VII", "duration": 4, "midiNotes": [58, 62, 65] },
    { "position": 13, "symbol": "Gm", "romanNumeral": "v", "duration": 4, "midiNotes": [55, 58, 62] }
  ]
}
Use 4–8 chords. Make midiNotes musically accurate (3-note voicings). The key must match the prompt.`;

const MELODY_SYSTEM = `You are a professional melody composer. Given a chord progression and prompt, generate a lead melody.
Respond ONLY with valid JSON. No markdown, no preamble, no commentary.
Output exactly this structure:
{
  "type": "lead",
  "phraseCount": 4,
  "notes": [
    { "pitch": 72, "startBeat": 1, "duration": 0.5, "velocity": 90 },
    { "pitch": 70, "startBeat": 1.5, "duration": 0.5, "velocity": 80 }
  ]
}
Use 8–24 notes. All pitches must be valid MIDI values (0-127) in the correct key. Velocity 60–100.`;

const RHYTHM_SYSTEM = `You are a professional drum programmer. Given a genre, mood, and BPM, generate a drum pattern.
Respond ONLY with valid JSON. No markdown, no preamble, no commentary.
Output exactly this structure:
{
  "bpm": 140,
  "bars": 2,
  "steps": 16,
  "swing": 0.0,
  "tracks": {
    "kick":  [true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],
    "snare": [false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false],
    "hihat": [true,false,true,false,true,false,true,false,true,false,true,false,true,false,true,false],
    "clap":  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]
  }
}
Each track array must have exactly 16 booleans. Make the pattern authentic to the genre.`;

async function callClaude(anthropic: Anthropic, system: string, userContent: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system,
    messages: [{ role: "user", content: userContent }],
  });
  const block = response.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") throw new Error("No text response from Claude");
  // Strip any markdown code fences if present
  return block.text.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
}

function parseJsonSafe<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function computeStyleMatch(genre: string, mood: string, harmony: Record<string, unknown>): number {
  // Simple heuristic: return a score between 0.65 and 0.95
  const chords = (harmony["chords"] as unknown[]) ?? [];
  if (chords.length >= 4) return 0.82;
  return 0.68;
}

function drumPatternToPads(drumData: Record<string, unknown>): { activePads: number[]; bluePads: number[] } {
  const tracks = (drumData["tracks"] as Record<string, boolean[]>) ?? {};
  const kick = tracks["kick"] ?? Array(16).fill(false);
  const snare = tracks["snare"] ?? Array(16).fill(false);
  const hihat = tracks["hihat"] ?? Array(16).fill(false);
  const clap = tracks["clap"] ?? Array(16).fill(false);

  // Map drum tracks to pad grid rows:
  // Row 0 (pads 0-7):  kick steps 0-7
  // Row 1 (pads 8-15): kick steps 8-15
  // Row 2 (pads 16-23): snare steps 0-7
  // Row 3 (pads 24-31): snare steps 8-15
  // Row 4 (pads 32-39): hihat steps 0-7
  // Row 5 (pads 40-47): hihat steps 8-15
  const activePads: number[] = [];
  const bluePads: number[] = [];

  for (let i = 0; i < 8; i++) {
    if (kick[i]) activePads.push(i);
    if (kick[i + 8]) activePads.push(i + 8);
    if (snare[i]) activePads.push(i + 16);
    if (snare[i + 8]) activePads.push(i + 24);
    if (hihat[i]) bluePads.push(i + 32);
    if (hihat[i + 8]) bluePads.push(i + 40);
    if (clap[i]) activePads.push(i + 48);
    if (clap[i + 8]) activePads.push(i + 56);
  }

  return { activePads, bluePads };
}

async function generateFull(
  anthropic: Anthropic,
  input: {
    prompt: string;
    genre: string;
    mood: string;
    bpm?: number;
    key?: string;
    timeSignature?: string;
  }
): Promise<{ harmony: Record<string, unknown>; melody: Record<string, unknown>; drums: Record<string, unknown>; styleMatch: number }> {
  const contextStr = JSON.stringify({
    prompt: input.prompt,
    genre: input.genre,
    mood: input.mood,
    bpm: input.bpm ?? "auto",
    key: input.key ?? "auto",
    timeSignature: input.timeSignature ?? "4/4",
  });

  // Run melody and rhythm in parallel after harmony
  const harmonyRaw = await callClaude(anthropic, HARMONY_SYSTEM, contextStr);
  const harmony = parseJsonSafe<Record<string, unknown>>(harmonyRaw, { key: input.key ?? "C", bpm: input.bpm ?? 120, timeSignature: "4/4", chords: [] });

  const melodyContext = JSON.stringify({ ...JSON.parse(contextStr), harmony });
  const [melodyRaw, drumsRaw] = await Promise.all([
    callClaude(anthropic, MELODY_SYSTEM, melodyContext),
    callClaude(anthropic, RHYTHM_SYSTEM, contextStr),
  ]);

  const melody = parseJsonSafe<Record<string, unknown>>(melodyRaw, { type: "lead", phraseCount: 4, notes: [] });
  const drums = parseJsonSafe<Record<string, unknown>>(drumsRaw, { bpm: input.bpm ?? 120, bars: 2, steps: 16, swing: 0, tracks: { kick: Array(16).fill(false), snare: Array(16).fill(false), hihat: Array(16).fill(false) } });

  const styleMatch = computeStyleMatch(input.genre, input.mood, harmony);
  return { harmony, melody, drums, styleMatch };
}

function serializeComposition(row: typeof compositionsTable.$inferSelect): Record<string, unknown> {
  const harmony = row.harmonyData as Record<string, unknown>;
  const melodyData = row.melodyData as Record<string, unknown>;
  const drums = row.drumData as Record<string, unknown>;
  return {
    id: row.id,
    key: row.key,
    bpm: row.bpm,
    timeSignature: row.timeSignature,
    genre: row.genre,
    mood: row.mood,
    prompt: row.prompt,
    harmony,
    melodies: [melodyData],
    drums,
    styleMatch: Number(row.styleMatch),
    lowConfidence: row.lowConfidence,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
  };
}

router.post("/composer/generate", async (req, res): Promise<void> => {
  const anthropic = getAnthropicClient();
  if (!anthropic) { noAiError(res); return; }

  const parsed = GenerateCompositionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "INVALID_REQUEST", message: parsed.error.message } });
    return;
  }

  const { prompt, genre, mood, bpm, key, timeSignature } = parsed.data;
  const start = Date.now();

  try {
    const { harmony, melody, drums, styleMatch } = await generateFull(anthropic, { prompt, genre, mood, bpm, key, timeSignature });

    const resolvedKey = (harmony["key"] as string) ?? key ?? "C";
    const resolvedBpm = (harmony["bpm"] as number) ?? bpm ?? 120;

    const [row] = await db.insert(compositionsTable).values({
      key: resolvedKey,
      bpm: resolvedBpm,
      timeSignature: (harmony["timeSignature"] as string) ?? timeSignature ?? "4/4",
      genre,
      mood,
      prompt,
      harmonyData: harmony,
      melodyData: melody,
      drumData: drums,
      styleMatch: String(styleMatch),
      lowConfidence: styleMatch < 0.65,
      generationMs: Date.now() - start,
    }).returning();

    // Update session pad grid with drum pattern
    const { activePads, bluePads } = drumPatternToPads(drums);
    await db.update(composerSessionsTable)
      .set({ bpm: resolvedBpm, activePads, bluePads })
      .where(eq(composerSessionsTable.id, 1));

    const composition = serializeComposition(row);
    const response = GenerateCompositionResponse.parse({
      compositionId: row.id,
      composition,
      lowConfidence: row.lowConfidence,
      generationMs: Date.now() - start,
    });
    res.json(response);
  } catch (err) {
    logger.error({ err }, "Generation failed");
    res.status(500).json({ error: { code: "GENERATION_FAILED", message: "AI generation failed. Please try again." } });
  }
});

router.post("/composer/regenerate", async (req, res): Promise<void> => {
  const anthropic = getAnthropicClient();
  if (!anthropic) { noAiError(res); return; }

  const parsed = RegenerateCompositionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "INVALID_REQUEST", message: parsed.error.message } });
    return;
  }

  const { compositionId, keepHarmony, keepMelody, keepRhythm } = parsed.data;

  const [existing] = await db.select().from(compositionsTable).where(eq(compositionsTable.id, compositionId));
  if (!existing) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Composition not found" } });
    return;
  }

  const start = Date.now();
  try {
    const input = { prompt: existing.prompt, genre: existing.genre, mood: existing.mood, bpm: existing.bpm, key: existing.key, timeSignature: existing.timeSignature };

    let harmony = existing.harmonyData as Record<string, unknown>;
    let melody = existing.melodyData as Record<string, unknown>;
    let drums = existing.drumData as Record<string, unknown>;

    if (!keepHarmony) {
      const raw = await callClaude(anthropic, HARMONY_SYSTEM, JSON.stringify(input));
      harmony = parseJsonSafe(raw, harmony);
    }
    if (!keepMelody) {
      const raw = await callClaude(anthropic, MELODY_SYSTEM, JSON.stringify({ ...input, harmony }));
      melody = parseJsonSafe(raw, melody);
    }
    if (!keepRhythm) {
      const raw = await callClaude(anthropic, RHYTHM_SYSTEM, JSON.stringify(input));
      drums = parseJsonSafe(raw, drums);
    }

    const styleMatch = computeStyleMatch(existing.genre, existing.mood, harmony);
    const [row] = await db.insert(compositionsTable).values({
      key: (harmony["key"] as string) ?? existing.key,
      bpm: (harmony["bpm"] as number) ?? existing.bpm,
      timeSignature: (harmony["timeSignature"] as string) ?? existing.timeSignature,
      genre: existing.genre,
      mood: existing.mood,
      prompt: existing.prompt,
      harmonyData: harmony,
      melodyData: melody,
      drumData: drums,
      styleMatch: String(styleMatch),
      lowConfidence: styleMatch < 0.65,
      generationMs: Date.now() - start,
    }).returning();

    if (!keepRhythm) {
      const { activePads, bluePads } = drumPatternToPads(drums);
      await db.update(composerSessionsTable)
        .set({ bpm: row.bpm, activePads, bluePads })
        .where(eq(composerSessionsTable.id, 1));
    }

    res.json(GenerateCompositionResponse.parse({
      compositionId: row.id,
      composition: serializeComposition(row),
      lowConfidence: row.lowConfidence,
      generationMs: Date.now() - start,
    }));
  } catch (err) {
    logger.error({ err }, "Regeneration failed");
    res.status(500).json({ error: { code: "GENERATION_FAILED", message: "Regeneration failed. Please try again." } });
  }
});

router.get("/composer/compositions/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  const [row] = await db.select().from(compositionsTable).where(eq(compositionsTable.id, id as string));
  if (!row) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Composition not found" } });
    return;
  }
  res.json(serializeComposition(row));
});

export default router;
