import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, composerSessionsTable, composerPatternsTable } from "@workspace/db";
import {
  GetComposerSessionResponse,
  UpdateComposerSessionBody,
  UpdateComposerSessionResponse,
  ListComposerPatternsResponse,
  CreateComposerPatternBody,
  DeleteComposerPatternParams,
  ActivateComposerPatternParams,
  ActivateComposerPatternResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function getOrCreateSession() {
  const [existing] = await db.select().from(composerSessionsTable).limit(1);
  if (existing) return existing;
  const [created] = await db
    .insert(composerSessionsTable)
    .values({ bpm: 120, quantize: "1/16", activePads: [], bluePads: [] })
    .returning();
  return created;
}

function serializeSession(s: typeof composerSessionsTable.$inferSelect) {
  return {
    ...s,
    activePads: Array.isArray(s.activePads) ? (s.activePads as number[]) : [],
    bluePads: Array.isArray(s.bluePads) ? (s.bluePads as number[]) : [],
    updatedAt: s.updatedAt instanceof Date ? s.updatedAt.toISOString() : String(s.updatedAt),
  };
}

function serializePattern(p: typeof composerPatternsTable.$inferSelect) {
  return {
    ...p,
    activePads: Array.isArray(p.activePads) ? (p.activePads as number[]) : [],
    bluePads: Array.isArray(p.bluePads) ? (p.bluePads as number[]) : [],
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
    updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : String(p.updatedAt),
  };
}

router.get("/composer/session", async (req, res): Promise<void> => {
  const session = await getOrCreateSession();
  res.json(GetComposerSessionResponse.parse(serializeSession(session)));
});

router.put("/composer/session", async (req, res): Promise<void> => {
  const parsed = UpdateComposerSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const session = await getOrCreateSession();
  const [updated] = await db
    .update(composerSessionsTable)
    .set({
      ...(parsed.data.bpm != null && { bpm: parsed.data.bpm }),
      ...(parsed.data.quantize != null && { quantize: parsed.data.quantize }),
      ...(parsed.data.activePads != null && { activePads: parsed.data.activePads }),
      ...(parsed.data.bluePads != null && { bluePads: parsed.data.bluePads }),
    })
    .where(eq(composerSessionsTable.id, session.id))
    .returning();

  res.json(UpdateComposerSessionResponse.parse(serializeSession(updated)));
});

router.get("/composer/patterns", async (_req, res): Promise<void> => {
  const patterns = await db
    .select()
    .from(composerPatternsTable)
    .orderBy(composerPatternsTable.createdAt);
  res.json(ListComposerPatternsResponse.parse(patterns.map(serializePattern)));
});

router.post("/composer/patterns", async (req, res): Promise<void> => {
  const parsed = CreateComposerPatternBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [pattern] = await db
    .insert(composerPatternsTable)
    .values({
      name: parsed.data.name,
      bpm: parsed.data.bpm,
      quantize: parsed.data.quantize,
      activePads: parsed.data.activePads,
      bluePads: parsed.data.bluePads,
    })
    .returning();

  res.status(201).json(serializePattern(pattern));
});

router.delete("/composer/patterns/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteComposerPatternParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(composerPatternsTable)
    .where(eq(composerPatternsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Pattern not found" });
    return;
  }

  res.sendStatus(204);
});

router.post("/composer/patterns/:id/activate", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = ActivateComposerPatternParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [pattern] = await db
    .select()
    .from(composerPatternsTable)
    .where(eq(composerPatternsTable.id, params.data.id));

  if (!pattern) {
    res.status(404).json({ error: "Pattern not found" });
    return;
  }

  const session = await getOrCreateSession();
  const [updated] = await db
    .update(composerSessionsTable)
    .set({
      bpm: pattern.bpm,
      quantize: pattern.quantize,
      activePads: pattern.activePads,
      bluePads: pattern.bluePads,
    })
    .where(eq(composerSessionsTable.id, session.id))
    .returning();

  res.json(ActivateComposerPatternResponse.parse(serializeSession(updated)));
});

export default router;
