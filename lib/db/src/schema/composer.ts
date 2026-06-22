import { pgTable, serial, text, integer, jsonb, timestamp, uuid, smallint, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
import { z } from "zod/v4";

// ── Existing tables ──────────────────────────────────────────────────────────

export const composerSessionsTable = pgTable("composer_sessions", {
  id: serial("id").primaryKey(),
  bpm: integer("bpm").notNull().default(120),
  quantize: text("quantize").notNull().default("1/16"),
  activePads: jsonb("active_pads").notNull().default([]),
  bluePads: jsonb("blue_pads").notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertComposerSessionSchema = createInsertSchema(composerSessionsTable).omit({ id: true, updatedAt: true });
export type InsertComposerSession = z.infer<typeof insertComposerSessionSchema>;
export type ComposerSession = typeof composerSessionsTable.$inferSelect;

export const composerPatternsTable = pgTable("composer_patterns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bpm: integer("bpm").notNull().default(120),
  quantize: text("quantize").notNull().default("1/16"),
  activePads: jsonb("active_pads").notNull().default([]),
  bluePads: jsonb("blue_pads").notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertComposerPatternSchema = createInsertSchema(composerPatternsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertComposerPattern = z.infer<typeof insertComposerPatternSchema>;
export type ComposerPattern = typeof composerPatternsTable.$inferSelect;

// ── New tables ───────────────────────────────────────────────────────────────

const id = () => uuid("id").primaryKey().default(sql`gen_random_uuid()`);
const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () => timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date());

export const compositionsTable = pgTable("compositions", {
  id: id(),
  key: text("key").notNull(),
  bpm: smallint("bpm").notNull(),
  timeSignature: text("time_signature").notNull().default("4/4"),
  genre: text("genre").notNull(),
  mood: text("mood").notNull(),
  prompt: text("prompt").notNull(),
  harmonyData: jsonb("harmony_data").notNull(),
  melodyData: jsonb("melody_data").notNull(),
  drumData: jsonb("drum_data").notNull(),
  styleMatch: numeric("style_match", { precision: 4, scale: 3 }).notNull().default("0.75"),
  lowConfidence: boolean("low_confidence").notNull().default(false),
  schemaVersion: smallint("schema_version").notNull().default(1),
  generationMs: integer("generation_ms").notNull().default(0),
  createdAt: createdAt(),
});

export type Composition = typeof compositionsTable.$inferSelect;

export const projectsTable = pgTable("projects", {
  id: id(),
  name: text("name").notNull(),
  tags: jsonb("tags").notNull().default([]),
  version: integer("version").notNull().default(1),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export type Project = typeof projectsTable.$inferSelect;

export const projectCompositionsTable = pgTable("project_compositions", {
  id: id(),
  projectId: uuid("project_id").notNull().references(() => projectsTable.id, { onDelete: "cascade" }),
  compositionId: uuid("composition_id").notNull().references(() => compositionsTable.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: createdAt(),
});

export type ProjectComposition = typeof projectCompositionsTable.$inferSelect;

export const compositionVersionsTable = pgTable("composition_versions", {
  id: id(),
  projectId: uuid("project_id").notNull().references(() => projectsTable.id, { onDelete: "cascade" }),
  compositionId: uuid("composition_id").notNull().references(() => compositionsTable.id),
  versionNumber: integer("version_number").notNull(),
  label: text("label"),
  snapshot: jsonb("snapshot").notNull(),
  createdAt: createdAt(),
});

export type CompositionVersion = typeof compositionVersionsTable.$inferSelect;

export const exportsTable = pgTable("exports", {
  id: id(),
  compositionId: uuid("composition_id").notNull().references(() => compositionsTable.id),
  exportType: text("export_type").notNull(),
  fileName: text("file_name").notNull(),
  midiBase64: text("midi_base64").notNull(),
  fileSizeBytes: integer("file_size_bytes").notNull(),
  createdAt: createdAt(),
});

export type Export = typeof exportsTable.$inferSelect;
