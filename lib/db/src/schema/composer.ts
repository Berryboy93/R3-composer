import { pgTable, serial, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

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
