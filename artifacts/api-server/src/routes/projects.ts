import { Router, type IRouter } from "express";
import { eq, isNull, desc } from "drizzle-orm";
import {
  db,
  projectsTable,
  projectCompositionsTable,
  compositionVersionsTable,
  compositionsTable,
} from "@workspace/db";
import {
  CreateProjectBody,
  UpdateProjectBody,
  SaveProjectVersionBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeProject(p: typeof projectsTable.$inferSelect) {
  return {
    id: p.id,
    name: p.name,
    tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
    version: p.version,
    deletedAt: p.deletedAt instanceof Date ? p.deletedAt.toISOString() : p.deletedAt ?? null,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
    updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : String(p.updatedAt),
  };
}

function serializeComposition(row: typeof compositionsTable.$inferSelect) {
  return {
    id: row.id,
    key: row.key,
    bpm: row.bpm,
    timeSignature: row.timeSignature,
    genre: row.genre,
    mood: row.mood,
    prompt: row.prompt,
    harmony: row.harmonyData,
    melodies: [row.melodyData],
    drums: row.drumData,
    styleMatch: Number(row.styleMatch),
    lowConfidence: row.lowConfidence,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
  };
}

router.get("/projects", async (_req, res): Promise<void> => {
  const projects = await db
    .select()
    .from(projectsTable)
    .where(isNull(projectsTable.deletedAt))
    .orderBy(desc(projectsTable.updatedAt));
  res.json(projects.map(serializeProject));
});

router.post("/projects", async (req, res): Promise<void> => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "INVALID_REQUEST", message: parsed.error.message } });
    return;
  }

  const { name, tags, compositionId } = parsed.data;
  const [project] = await db.insert(projectsTable).values({ name, tags: tags ?? [] }).returning();

  if (compositionId) {
    await db.insert(projectCompositionsTable).values({ projectId: project.id, compositionId, isActive: true });
  }

  res.status(201).json(serializeProject(project));
});

router.get("/projects/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id as string));
  if (!project || project.deletedAt) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Project not found" } });
    return;
  }

  const [activeLink] = await db
    .select()
    .from(projectCompositionsTable)
    .where(eq(projectCompositionsTable.projectId, id as string));

  let latestComposition = null;
  if (activeLink) {
    const [comp] = await db.select().from(compositionsTable).where(eq(compositionsTable.id, activeLink.compositionId));
    if (comp) latestComposition = serializeComposition(comp);
  }

  res.json({ project: serializeProject(project), latestComposition });
});

router.patch("/projects/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "INVALID_REQUEST", message: parsed.error.message } });
    return;
  }

  const [project] = await db
    .update(projectsTable)
    .set({
      ...(parsed.data.name != null && { name: parsed.data.name }),
      ...(parsed.data.tags != null && { tags: parsed.data.tags }),
    })
    .where(eq(projectsTable.id, id as string))
    .returning();

  if (!project) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Project not found" } });
    return;
  }
  res.json(serializeProject(project));
});

router.delete("/projects/:id", async (req, res): Promise<void> => {
  const { id } = req.params;
  const [project] = await db
    .update(projectsTable)
    .set({ deletedAt: new Date() })
    .where(eq(projectsTable.id, id as string))
    .returning();

  if (!project) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Project not found" } });
    return;
  }
  res.json({ projectId: project.id, deletedAt: project.deletedAt instanceof Date ? project.deletedAt.toISOString() : String(project.deletedAt) });
});

router.post("/projects/:id/save", async (req, res): Promise<void> => {
  const { id } = req.params;
  const parsed = SaveProjectVersionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "INVALID_REQUEST", message: parsed.error.message } });
    return;
  }

  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id as string));
  if (!project) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Project not found" } });
    return;
  }

  const [comp] = await db.select().from(compositionsTable).where(eq(compositionsTable.id, parsed.data.compositionId));
  if (!comp) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Composition not found" } });
    return;
  }

  // Get next version number
  const existingVersions = await db
    .select()
    .from(compositionVersionsTable)
    .where(eq(compositionVersionsTable.projectId, id as string))
    .orderBy(desc(compositionVersionsTable.versionNumber));

  const nextNum = (existingVersions[0]?.versionNumber ?? 0) + 1;

  const [version] = await db.insert(compositionVersionsTable).values({
    projectId: id as string,
    compositionId: comp.id,
    versionNumber: nextNum,
    label: parsed.data.label ?? null,
    snapshot: { project: { id: project.id, name: project.name }, composition: comp },
  }).returning();

  // Upsert the project_compositions link
  await db.delete(projectCompositionsTable).where(eq(projectCompositionsTable.projectId, id as string));
  await db.insert(projectCompositionsTable).values({ projectId: id as string, compositionId: comp.id, isActive: true });

  res.json({
    versionId: version.id,
    versionNumber: version.versionNumber,
    savedAt: version.createdAt instanceof Date ? version.createdAt.toISOString() : String(version.createdAt),
  });
});

router.get("/projects/:id/versions", async (req, res): Promise<void> => {
  const { id } = req.params;
  const versions = await db
    .select()
    .from(compositionVersionsTable)
    .where(eq(compositionVersionsTable.projectId, id as string))
    .orderBy(desc(compositionVersionsTable.versionNumber));

  res.json(versions.map((v) => ({
    id: v.id,
    versionNumber: v.versionNumber,
    label: v.label ?? null,
    compositionId: v.compositionId,
    createdAt: v.createdAt instanceof Date ? v.createdAt.toISOString() : String(v.createdAt),
  })));
});

export default router;
