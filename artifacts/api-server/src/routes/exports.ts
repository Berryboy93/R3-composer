import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, compositionsTable, exportsTable } from "@workspace/db";
import { ExportMidiBody } from "@workspace/api-zod";

const router: IRouter = Router();

// ── Minimal MIDI 1.0 serializer ──────────────────────────────────────────────

function writeUint32BE(val: number): number[] {
  return [(val >>> 24) & 0xff, (val >>> 16) & 0xff, (val >>> 8) & 0xff, val & 0xff];
}

function writeUint16BE(val: number): number[] {
  return [(val >>> 8) & 0xff, val & 0xff];
}

function writeVariableLength(val: number): number[] {
  const bytes: number[] = [];
  bytes.unshift(val & 0x7f);
  val >>= 7;
  while (val > 0) {
    bytes.unshift((val & 0x7f) | 0x80);
    val >>= 7;
  }
  return bytes;
}

interface MidiEvent {
  tick: number;
  data: number[];
}

function buildTrack(events: MidiEvent[], bpm: number, includeTempo = false): number[] {
  // Sort by tick
  events.sort((a, b) => a.tick - b.tick);

  const trackData: number[] = [];

  if (includeTempo) {
    const mpqn = Math.round(60_000_000 / bpm);
    trackData.push(...writeVariableLength(0)); // delta time 0
    trackData.push(0xff, 0x51, 0x03, (mpqn >>> 16) & 0xff, (mpqn >>> 8) & 0xff, mpqn & 0xff);
  }

  let prevTick = 0;
  for (const evt of events) {
    const delta = evt.tick - prevTick;
    prevTick = evt.tick;
    trackData.push(...writeVariableLength(delta));
    trackData.push(...evt.data);
  }

  // End of track
  trackData.push(...writeVariableLength(0), 0xff, 0x2f, 0x00);

  return trackData;
}

function buildMidiFile(tracks: number[][], ppq = 480): Uint8Array {
  const bytes: number[] = [];

  // MThd header
  bytes.push(0x4d, 0x54, 0x68, 0x64); // "MThd"
  bytes.push(...writeUint32BE(6));        // header length
  bytes.push(...writeUint16BE(1));        // format 1 (multi-track)
  bytes.push(...writeUint16BE(tracks.length));
  bytes.push(...writeUint16BE(ppq));

  for (const track of tracks) {
    bytes.push(0x4d, 0x54, 0x72, 0x6b); // "MTrk"
    bytes.push(...writeUint32BE(track.length));
    bytes.push(...track);
  }

  return new Uint8Array(bytes);
}

function beatsToTicks(beats: number, ppq = 480): number {
  return Math.round(beats * ppq);
}

function stepsToTicks(step: number, steps: number, bars: number, ppq = 480): number {
  const beatsPerBar = 4;
  const totalBeats = bars * beatsPerBar;
  const beatsPerStep = totalBeats / steps;
  return beatsToTicks(step * beatsPerStep, ppq);
}

function serializeMelodyTrack(melody: Record<string, unknown>, channel = 0, ppq = 480): number[] {
  const notes = (melody["notes"] as Array<{ pitch: number; startBeat: number; duration: number; velocity: number }>) ?? [];
  const events: MidiEvent[] = [];

  for (const note of notes) {
    const pitch = Math.max(0, Math.min(127, note.pitch));
    const vel = Math.max(1, Math.min(127, note.velocity));
    const startTick = beatsToTicks(note.startBeat - 1, ppq);
    const endTick = startTick + beatsToTicks(note.duration, ppq);
    events.push({ tick: startTick, data: [0x90 | channel, pitch, vel] });
    events.push({ tick: endTick, data: [0x80 | channel, pitch, 0] });
  }

  return buildTrack(events);
}

function serializeChordsTrack(harmony: Record<string, unknown>, channel = 1, ppq = 480): number[] {
  const chords = (harmony["chords"] as Array<{ position: number; duration: number; midiNotes: number[] }>) ?? [];
  const events: MidiEvent[] = [];

  for (const chord of chords) {
    const startTick = beatsToTicks(chord.position - 1, ppq);
    const endTick = startTick + beatsToTicks(chord.duration, ppq);
    for (const pitch of chord.midiNotes) {
      const p = Math.max(0, Math.min(127, pitch));
      events.push({ tick: startTick, data: [0x90 | channel, p, 80] });
      events.push({ tick: endTick, data: [0x80 | channel, p, 0] });
    }
  }

  return buildTrack(events);
}

const GM_DRUM_MAP: Record<string, number> = {
  kick: 36,
  snare: 38,
  hihat: 42,
  openHH: 46,
  clap: 39,
};

function serializeDrumsTrack(drums: Record<string, unknown>, ppq = 480): number[] {
  const tracks = (drums["tracks"] as Record<string, boolean[]>) ?? {};
  const bars = (drums["bars"] as number) ?? 2;
  const steps = (drums["steps"] as number) ?? 16;
  const events: MidiEvent[] = [];

  for (const [name, pattern] of Object.entries(tracks)) {
    const pitch = GM_DRUM_MAP[name];
    if (!pitch || !Array.isArray(pattern)) continue;
    for (let i = 0; i < pattern.length; i++) {
      if (!pattern[i]) continue;
      const tick = stepsToTicks(i, steps, bars, ppq);
      events.push({ tick, data: [0x99, pitch, 100] }); // channel 10 (index 9)
      events.push({ tick: tick + beatsToTicks(0.125, ppq), data: [0x89, pitch, 0] });
    }
  }

  return buildTrack(events);
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

router.post("/exports/midi", async (req, res): Promise<void> => {
  const parsed = ExportMidiBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: { code: "INVALID_REQUEST", message: parsed.error.message } });
    return;
  }

  const { compositionId, exportType } = parsed.data;
  const [comp] = await db.select().from(compositionsTable).where(eq(compositionsTable.id, compositionId));
  if (!comp) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Composition not found" } });
    return;
  }

  const harmony = comp.harmonyData as Record<string, unknown>;
  const melody = comp.melodyData as Record<string, unknown>;
  const drums = comp.drumData as Record<string, unknown>;
  const bpm = comp.bpm;
  const ppq = 480;

  // Tempo track (always first in format 1)
  const mpqn = Math.round(60_000_000 / bpm);
  const tempoTrack = buildTrack([], bpm, true);

  let midiTracks: number[][];

  if (exportType === "melody") {
    midiTracks = [tempoTrack, serializeMelodyTrack(melody, 0, ppq)];
  } else if (exportType === "chords") {
    midiTracks = [tempoTrack, serializeChordsTrack(harmony, 1, ppq)];
  } else if (exportType === "drums") {
    midiTracks = [tempoTrack, serializeDrumsTrack(drums, ppq)];
  } else {
    // full
    midiTracks = [
      tempoTrack,
      serializeMelodyTrack(melody, 0, ppq),
      serializeChordsTrack(harmony, 1, ppq),
      serializeDrumsTrack(drums, ppq),
    ];
  }

  const midiBytes = buildMidiFile(midiTracks, ppq);
  const midiBase64 = Buffer.from(midiBytes).toString("base64");
  const fileName = `r3-${slugify(comp.prompt.slice(0, 30))}-${exportType}.mid`;

  const [exportRow] = await db.insert(exportsTable).values({
    compositionId: comp.id,
    exportType,
    fileName,
    midiBase64,
    fileSizeBytes: midiBytes.length,
  }).returning();

  res.json({
    exportId: exportRow.id,
    exportType: exportRow.exportType,
    fileName: exportRow.fileName,
    midiBase64: exportRow.midiBase64,
    fileSizeBytes: exportRow.fileSizeBytes,
    createdAt: exportRow.createdAt instanceof Date ? exportRow.createdAt.toISOString() : String(exportRow.createdAt),
  });
});

router.get("/exports", async (_req, res): Promise<void> => {
  const exports = await db.select().from(exportsTable).orderBy(desc(exportsTable.createdAt)).limit(50);
  res.json(exports.map((e) => ({
    id: e.id,
    compositionId: e.compositionId,
    exportType: e.exportType,
    fileName: e.fileName,
    fileSizeBytes: e.fileSizeBytes,
    createdAt: e.createdAt instanceof Date ? e.createdAt.toISOString() : String(e.createdAt),
  })));
});

export default router;
