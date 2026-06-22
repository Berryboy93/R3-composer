# R3 Intelligent Composer + Virtual Composer Machine (VCM)
## Product Requirements Document (PRD) · v3.0

**Engineering-Audited, Gap-Resolved, Production-Ready Specification**

|Field         |Value                                                                            |
|--------------|---------------------------------------------------------------------------------|
|Status        |**Approved for Production Development (Post-Audit)**                             |
|Product Owner |R3 Native                                                                        |
|Version       |3.0 — VCM Integration + Engineering Excellence                                  |
|Target Release|12 Weeks (Phase 1: Weeks 1–8 Composer / Phase 2: Weeks 9–12 VCM)                |
|Supersedes    |PRD v2.0, PRD Enhancement Pack                                                  |
|Last Updated  |2026-06-21                                                                       |
|Audit Review  |Complete; 20 gaps identified and resolved                                       |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision](#2-product-vision)
3. [Problem Statement](#3-problem-statement)
4. [Product Goals](#4-product-goals)
5. [Success Metrics & KPIs](#5-success-metrics--kpis)
6. [User Personas](#6-user-personas)
7. [User Stories](#7-user-stories)
8. [Functional Requirements — Intelligent Composer](#8-functional-requirements--intelligent-composer)
9. [Functional Requirements — Virtual Composer Machine](#9-functional-requirements--virtual-composer-machine)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Latency Budget & Performance](#11-latency-budget--performance)
12. [Data Architecture & Persistence](#12-data-architecture--persistence)
13. [Offline-First & Sync Strategy](#13-offline-first--sync-strategy)
14. [AI Requirements & Fallback Strategy](#14-ai-requirements--fallback-strategy)
15. [Audio Engine Requirements](#15-audio-engine-requirements)
16. [MIDI Requirements](#16-midi-requirements)
17. [Analytics & Observability](#17-analytics--observability)
18. [Error Handling & Recovery](#18-error-handling--recovery)
19. [Testing Strategy](#19-testing-strategy)
20. [Security Requirements](#20-security-requirements)
21. [Accessibility Requirements](#21-accessibility-requirements)
22. [System Architecture](#22-system-architecture)
23. [AI Agent Mesh](#23-ai-agent-mesh)
24. [Composition Graph Engine](#24-composition-graph-engine)
25. [Real-Time Collaboration Architecture](#25-real-time-collaboration-architecture)
26. [Developer Platform & APIs](#26-developer-platform--apis)
27. [Infrastructure & Operations](#27-infrastructure--operations)
28. [Deployment & Release Strategy](#28-deployment--release-strategy)
29. [Monetization Strategy](#29-monetization-strategy)
30. [Competitive Analysis](#30-competitive-analysis)
31. [Release Scope](#31-release-scope)
32. [Risks & Mitigations](#32-risks--mitigations)
33. [Definition of Done](#33-definition-of-done)
34. [Future Roadmap](#34-future-roadmap)
35. [Appendix A — Grid Mode Reference](#35-appendix-a--grid-mode-reference)
36. [Appendix B — Complete Agent Output Schemas](#36-appendix-b--complete-agent-output-schemas)
37. [Appendix C — Latency Budget Breakdown](#37-appendix-c--latency-budget-breakdown)
38. [Appendix D — Service Timeout Strategy](#38-appendix-d--service-timeout-strategy)
39. [Appendix E — Browser Compatibility Matrix](#39-appendix-e--browser-compatibility-matrix)

---

## 1. Executive Summary

**R3 Intelligent Composer** is an AI-assisted music composition platform integrated into R3 Native, backed by a real-time performance surface: the **Virtual Composer Machine (VCM)** — a software-only rendition of a hardware controller (Ableton Push, Native Instruments Maschine), running entirely in the browser at zero hardware cost.

Together they form a unified product:
- **Generate** musical ideas through natural language prompts
- **Perform** ideas on a tactile 8×8 grid with <10ms latency
- **Refine** in a multi-section timeline
- **Collaborate** in real-time with other creators (Version 3)
- **Export** as industry-standard MIDI, stems, or full arrangements

### What Ships in MVP (Phase 1 + 2)

| Capability | Phase | Status |
|-----------|-------|--------|
| Chord Progression Generation | 1 | ✅ Harmonically coherent progressions from prompt |
| Melody Generation | 1 | ✅ Lead and hook melodies in key/tempo |
| Bass Line Generation | 1 | ✅ Root-motion and melodic bass |
| Drum Pattern Generation | 1 | ✅ Kick, snare, hi-hat, clap at BPM |
| Arrangement Generation | 1 | ✅ Intro/Verse/Hook/Bridge/Outro structure |
| Composition Analysis | 1 | ✅ Structural scoring & recommendations |
| MIDI Export | 1 | ✅ Per-track and full-composition |
| Project Management | 1 | ✅ Save, load, version, manage |
| Producer Copilot | 1 | ✅ AI feedback and iteration |
| AI Fallback Engine | 1 | ✨ **NEW**: Deterministic fallback when AI times out |
| 8×8 Performance Grid | 2 | ✅ 64 RGB pads: Piano, Drum, Chord, Scale, Session, Sequencer modes |
| Smart Touch Encoders | 2 | ✅ 8 virtual knobs + encoder acceleration |
| Timeline Engine | 2 | ✅ Drag-and-drop section arrangement |
| AI Performance Mode | 2 | ✅ Variations without destroying originals |
| AI Jam Mode | 2 | ✅ Real-time AI accompaniment |
| Chord Memory | 2 | ✅ One-pad full chord playback |
| Smart Scale Mode | 2 | ✅ Wrong note correction locked to key |
| MIDI I/O | 2 | ✅ MIDI input, output, learn, export |
| Service Worker Persistence | 2 | ✨ **NEW**: Offline composition editing & sync queue |
| Rate Limiting & Quotas | 2 | ✨ **NEW**: Free/Pro/Studio tier enforcement |
| Composition Versioning | 2 | ✨ **NEW**: Client-side undo/redo with server sync |

### The Long View

R3 Native becomes a **Music Operating System**: single environment where a creator generates ideas with AI, performs them on a virtual surface, edits in a timeline, collaborates with others, and exports to any format — all in the browser, all offline-capable, all with <10ms latency.

---

## 2. Product Vision

### Vision Statement

R3 Intelligent Composer + VCM becomes the **central intelligence and performance layer** inside R3 Native, functioning simultaneously as:
- **Composer** (AI generation)
- **Producer** (arrangement & mixing suggestions)
- **Performer** (grid-based real-time playback)
- **Arranger** (timeline management)
- **Creative Assistant** (feedback & iteration)

...all within a single unified surface, offline-capable, collaborative, and production-ready.

### Vision Pillars

| Pillar | Definition |
|--------|-----------|
| **Speed** | A creator with no theory knowledge should have a complete, playable musical foundation within 60 seconds of opening the product. |
| **Control** | All generated content is editable, performable, and non-destructive. The AI proposes; the creator decides. |
| **Depth** | The system grows with the creator. Beginners get Smart Scale Mode; professionals get MIDI Learn and granular automation. |
| **Performance** | <10ms pad-to-audio latency. Grid renders at 120 FPS. Encoders control parameters in real-time with zero audible stepping. |
| **Integration** | All output is industry-standard MIDI. Import cleanly into Ableton, FL Studio, Logic, Studio One. Hardware MIDI works. |
| **Intelligence** | AI is context-aware: knows key, tempo, genre, arrangement section, and user's pad activity. Suggestions are coherent. |
| **Resilience** | Works offline. Generates fallback compositions when AI is unavailable. Syncs when reconnected. No data loss. |
| **Collaboration** | Real-time multi-user editing with conflict-free resolution. Compose together in one VCM session. |

### What R3 Replaces

| Traditional Workflow | R3 Native Replacement | Benefit |
|---------------------|----------------------|---------|
| Hardware controller (Push, Maschine) + DAW | VCM + R3 Native (browser) | Zero hardware cost; always available |
| Melody sketching tools | Melody Agent + Piano Mode grid | Faster idea generation |
| Manual drum programming | Drum Rack Mode + Rhythm Agent | Faster beat creation |
| Theory books / chord charts | Chord Mode + Smart Scale Mode | Instant harmonic reference |
| A&R consultation | Producer Copilot + Arrangement Agent | Real-time arrangement feedback |
| Multi-session DAW arrangements | Timeline Engine in-browser | Single unified environment |
| Backup and undo management | Service Worker + composition versioning | Offline safety; no data loss |

---

## 3. Problem Statement

### Creator Pain Points (Updated)

| Pain Point | Severity | Impact | R3 Solution |
|-----------|----------|--------|-------------|
| Writer's block | Critical | Sessions start and stall | Chord/Melody Agent |
| Slow composition workflows | High | Time spent on mechanics, not creativity | 60-second foundation |
| Repetitive production tasks | High | Fatigue; reduced output quality | Arrangement Agent |
| Blank canvas paralysis | Critical | High abandonment rate | AI-generated starting point |
| Difficulty arranging full songs | High | Many producers have loops, not songs | Timeline Engine + Arrangement AI |
| Hardware barrier to entry | High | $400–$800 controllers needed | VCM: zero hardware cost |
| Theory knowledge gap | Medium | Limits harmonic/melodic complexity | Copilot + Smart Scale Mode |
| DAW switching friction | Medium | Exporting, reformatting wastes momentum | Single browser environment |
| No feedback during creation | Medium | Creators don't know if idea is working | Producer Copilot real-time feedback |
| Live performance gap | High | DAW projects can't be performed | VCM + MIDI I/O for live play |
| Work lost on crashes | High | Session data disappears | Service Worker + IndexedDB persistence |
| Collaboration friction | Medium | No real-time co-creation tools | Real-time CRDT-based collaboration |
| Browser tab refresh loses state | High | Manual re-setup required | Session resumption on reconnect |

### Market Gap

AI music tools currently fall into three silos with no overlap:

1. **Full audio generators** (Suno, Udio) — Generate complete audio. No creator agency. Non-editable output.
2. **MIDI loop generators** (isolated) — Generate single 8–16 bar loops. No context, arrangement, or iteration.
3. **DAW AI assistants** (iZotope, etc.) — Mix-and-master only. Require pre-existing material.

**R3 Intelligent Composer + VCM is the first to:**
- ✅ Generate initial composition (not just loops)
- ✅ Provide interactive performance surface (not just audio)
- ✅ Enable arrangement in timeline (not just single sections)
- ✅ Support real-time collaboration (not solo-only)
- ✅ Work offline and sync when reconnected (not cloud-dependent)
- ✅ Export standard MIDI (not proprietary formats)

---

## 4. Product Goals

### Primary Goals (Phase 1 + 2)

| Goal | Owner | Success Criteria | Timeline |
|------|-------|------------------|----------|
| Enable composition in <60 seconds | Product | 80% of beta users create 4-bar loop in first minute | Week 4 |
| Ship performable VCM with <10ms latency | Engineering | Pad-to-audio P95 < 10ms on i5/8GB machine | Week 12 |
| Achieve 80% composition success rate | AI | 80% of generations produce valid, playable arrangements | Week 8 |
| Support 100 concurrent DAW compositions | Ops | Load test passes at 100 concurrent exports | Week 10 |
| Enable offline composition editing | Engineering | Compositions editable without network; sync on reconnect | Week 11 |
| Enforce tier-based quotas (Free/Pro/Studio) | Product | Rate limiting blocks free tier at 25 generations/month | Week 12 |
| Real-time collaboration ready | Engineering | CRDT-based multi-user editing without conflicts | Version 3 |

### Secondary Goals (Future)

- Replace hardware controller market (Version 3+)
- Become defacto music DAW for emerging markets
- Establish marketplace for styles/presets/drum kits
- Ship iOS/Android touch-native VCM

---

## 5. Success Metrics & KPIs

### User Engagement KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to First Composition | 60 seconds | Analytics: session creation → first export |
| Composition Completion Rate | 80% | Compositions started → compositions saved |
| Daily Active Users (DAU) | 50K (Month 6) | Unique users who generate ≥1 composition/day |
| Weekly Active Users (WAU) | 150K (Month 6) | Unique users who use VCM ≥1 time/week |
| Monthly Active Users (MAU) | 300K (Month 12) | Unique users who use product ≥1 time/month |
| Average Session Length | 25 minutes | Total session time; includes generation + performance |
| Generations per User/Month | 8 (Free), Unlimited (Pro) | Total generations; enforce via quota system |
| Export Rate | 40% | Compositions saved → MIDI/project exports |
| Retention (7-day) | 35% | Users active again within 7 days |
| Retention (30-day) | 15% | Users active again within 30 days |

### Product Quality KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| P95 Generation Latency | 10 seconds | Prompt → valid arrangement playable on grid |
| P95 Pad-to-Audio Latency | 10ms | Pad press → audible note (measured) |
| Grid Render Frame Rate | ≥120 FPS | Chrome DevTools; i5/8GB baseline |
| Composition Success Rate | ≥80% | Generated arrangements play without errors |
| MIDI Export Validity | 100% | Exports import cleanly in 4 target DAWs |
| Type Coverage | ≥95% | TypeScript: no implicit `any`; tsc --noEmit passes |
| Test Coverage | ≥80% | Unit tests; E2E tests; integration tests |
| Uptime | ≥99.5% | Backend availability (excluding scheduled maintenance) |
| Error Rate | <0.5% | Requests ending in 5xx or unhandled exceptions |

### Monetization KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Conversion Rate (Free → Paid) | 5% | Free users → Pro subscription |
| ARPU (Average Revenue Per User) | $4.50/month | Total MRR ÷ active users |
| Churn Rate (Monthly) | <8% | Paid users who cancel ÷ total paid |
| LTV:CAC Ratio | ≥3:1 | User lifetime value ÷ customer acquisition cost |
| NPS (Net Promoter Score) | ≥50 | Survey: likelihood to recommend |

---

## 6. User Personas

### Persona A: Maya — Emerging Beat Maker (Primary)

**Profile:**
- Age: 22–32
- Music background: Self-taught; bedroom producer
- Location: Nigeria, Brazil, Indonesia (emerging markets)
- Budget: $0–$10/month
- Device: Mid-range laptop or Chromebook

**Motivations:**
- Publish beats on SoundCloud, TikTok
- Build a catalog quickly
- Learn music theory through experimentation
- Avoid $800 hardware investment

**Pain Points:**
- No budget for controllers or DAWs
- Limited theory knowledge
- Session setup friction
- Paralysis on blank canvas

**Needs:**
- Fast idea generation (60 seconds)
- Affordable or free tool
- Browser-based (no install)
- Tactile performance surface
- Real-time feedback

**VCM Usage Pattern:**
1. Open R3 Native (takes 2 seconds)
2. Prompt Composer: "acid techno, G minor, 120 BPM, energy ramp"
3. Generated 4-bar loop appears in grid
4. Perform on 8×8 pads; record variation
5. Arrange into 2-minute track on timeline
6. Export MIDI; load into trial DAW or record audio
7. Publish to SoundCloud

---

### Persona B: James — Professional Producer (Secondary)

**Profile:**
- Age: 35–50
- Music background: 15+ years; working in multiple DAWs
- Location: US, UK, Germany
- Budget: $50–$200/month
- Device: MacBook Pro or high-end Windows PC

**Motivations:**
- Accelerate iterative workflow in existing DAW
- Overcome creative block fast
- Collaborate with remote producers
- Explore new genres without learning curve

**Pain Points:**
- DAW context switching friction
- Time spent on repetitive arrangement tasks
- Limited real-time collaboration tools
- Need for professional sound quality

**Needs:**
- Integration with Ableton Live, Logic Pro
- AI that respects professional taste
- Low-latency performance surface
- Multi-user editing
- Stem export

**VCM Usage Pattern:**
1. Open R3 Composer in browser
2. Collaborate with 2 remote producers in real-time (shared VCM session)
3. Each tweaks arrangement section in timeline
4. Export stems; import into Ableton for mixing
5. Push final mix back to shared project
6. Publish coordinated release

---

### Persona C: Sofia — Music Teacher (Tertiary)

**Profile:**
- Age: 40–55
- Music background: Formal training; college music instructor
- Location: US, Canada, Australia
- Budget: $20–$50/month
- Device: iPad Pro or desktop

**Motivations:**
- Teach music theory through experimentation
- Demonstrate composition to students
- Create backing tracks for lessons
- Enable students to compose without hardware

**Pain Points:**
- No budget for classroom controllers/DAWs
- Need for scalable teaching solution
- Difficulty making theory tangible
- Student engagement on abstract concepts

**Needs:**
- Educational pricing (≤$10/student/month)
- Easy classroom setup
- Theory-driven suggestions
- Clear modal/harmonic explanation
- Shareable session links

**VCM Usage Pattern:**
1. Create composition in R3 Composer
2. Share link with 20 students
3. Each student performs variations in their own VCM session
4. Teacher views all submissions in class dashboard
5. Play back student variations to class
6. Use Copilot feedback to discuss harmonic choices

---

## 7. User Stories

### Epic A: AI-Powered Composition (Phase 1)

```gherkin
Feature: Users can generate complete compositions from natural language prompts

  Scenario: Generate chord progression from genre + mood
    Given I'm in R3 Composer
    When I enter prompt "upbeat synthwave, E major, 110 BPM, nostalgic"
    Then within 8 seconds a 4-chord progression appears in Chord Mode
    And chords are audible when I press the grid
    And I can adjust key/tempo without regenerating
    And I can prompt variations: "add modal interchange" or "use sus chords"

  Scenario: Generate melody over existing chords
    Given a chord progression is already on timeline
    When I prompt "bright hook, 2 bars, call-and-response"
    Then a melody generates within 5 seconds
    And melody notes stay in key
    And melody plays in unison with chords when I press grid
    And I can adjust octave/velocity without regenerating

  Scenario: Generate full arrangement with intro/verse/hook/outro
    Given a chord + melody exist
    When I request "auto-arrange into 2-minute song"
    Then within 10 seconds an arrangement appears:
      - Intro (8 bars, light instrumentation)
      - Verse 1 (8 bars, bass + chords + melody)
      - Pre-Hook (4 bars, energy ramp)
      - Hook (8 bars, full energy)
      - Bridge (4 bars, contrast)
      - Outro (4 bars, wind-down)
    And I can edit each section independently in timeline
    And timeline shows bar numbers and section boundaries
```

### Epic B: Virtual Composer Machine Performance (Phase 2)

```gherkin
Feature: Users perform compositions on an 8×8 grid with <10ms latency

  Scenario: Play Piano Mode with <10ms latency
    Given I'm in Piano Mode on the 8×8 grid
    When I press any pad with velocity 100
    Then audible note plays within 10ms
    And note sustains while pad is held
    And note release is smooth when pad is lifted
    And multiple simultaneous pads create polyphony

  Scenario: Switch modes on-the-fly without audio glitching
    Given I'm in Piano Mode playing notes
    When I press the "Chord Mode" button
    Then grid relabels to chord names within 500ms
    And existing notes sustain smoothly
    And next pad press triggers a chord
    And no audio clicks or pops occur

  Scenario: Record grid performance to timeline
    Given a 4-bar loop is in the timeline
    And I've set metronome to play
    When I press "Record" and perform on grid for 2 bars
    Then captured MIDI notes appear as a new track
    And timing quantizes to nearest 16th note (configurable)
    And I can undo/redo the recording
    And recording aligns with original composition

  Scenario: Real-time AI Jam Mode
    Given I'm in Piano Mode with an empty grid
    And a chord progression exists on timeline
    When I press "AI Jam ON"
    And I play 4 notes: C, E, G, C
    Then within 200ms the AI plays complementary bass line
    And AI respects the chord progression
    And AI plays a counter-melody on next beat
    And I can guide AI by the notes I choose
    And rhythm is humanized (slight swing/groove)
```

### Epic C: Offline Composition & Sync (Phase 2)

```gherkin
Feature: Users can compose offline and sync when reconnected

  Scenario: Continue composing when internet drops
    Given I have R3 Composer open with an active composition
    When internet disconnects
    Then grid, timeline, and Copilot remain functional
    And "Offline Mode" indicator appears in UI
    And AI generation prompts queue locally
    And I can perform on grid, edit timeline, save variations

  Scenario: Sync queued generations when reconnected
    Given I queued 5 composition generation requests while offline
    When internet reconnects
    Then queued requests begin processing in background
    And new generations appear in UI as they complete
    And existing offline compositions merge with server versions
    And no data loss occurs

  Scenario: Compose collaboratively offline, sync with conflicts
    Given I and a colleague both edit the same composition offline
    And we add different variations to the timeline
    When we both reconnect
    Then the system detects conflict via CRDT
    And presents both variations in timeline
    And allows me to cherry-pick changes from both versions
    And final merged timeline is valid and playable
```

### Epic D: Monetization & Rate Limiting (Phase 2)

```gherkin
Feature: Free tier has 25 generations/month; Pro/Studio tiers unlimited

  Scenario: Free user hits generation quota
    Given I'm a free user with 24 generations used this month
    When I request the 25th generation
    Then it succeeds
    And when I request a 26th generation
    Then it fails with error: "You've reached 25 generations this month. Upgrade to Pro."
    And upgrade CTA appears
    And my existing compositions remain editable

  Scenario: Pro user has unlimited generations
    Given I have a Pro subscription (paid)
    When I request 100+ generations in a month
    Then all succeed without rate limiting
    And I see "Unlimited generations" in my account settings

  Scenario: Studio user can share quota with team
    Given I have a Studio subscription with a 10-person team
    When a team member generates a composition
    Then it counts toward the team's shared quota (not individual)
    And team member can see usage in team dashboard
```

---

## 8. Functional Requirements — Intelligent Composer

### FR-001: Chord Progression Generation

**Description:** System generates harmonically coherent 4–8 chord progressions from user prompts.

**Acceptance Criteria:**
- User provides prompt: "genre, key, tempo, mood" (min. 3 required)
- AI generates 4–8 chords within **8 seconds**
- Chords are valid, diatonic to the key (or modal if specified)
- System suggests variations: "add borrowed chords", "use secondary dominants", "modal interchange"
- User can request regeneration without affecting melody/bass
- Output schema is validated against `HarmonyResultSchema` (Appendix B)
- Chords are immediately playable in Chord Mode grid

**Implementation Notes:**
- Use Harmonic Agent (Agent Mesh, Section 23)
- Store progression in Composition Graph (Section 24)
- If AI times out (>10s), fall back to deterministic progression (Section 14)
- Validation: Zod schema + music theory checks

---

### FR-002: Melody Generation

**Description:** System generates lead or hook melodies in-key, in-tempo, aligned with chords.

**Acceptance Criteria:**
- User provides: "tone (bright, dark, soulful), length (1–4 bars), call-or-response"
- AI generates melody within **6 seconds**
- All notes are in key (or chromatic passing tones if specified)
- Melody avoids dissonance with chord roots
- User can request variations: "higher octave", "add rests", "swing feel"
- Melody is playable in Piano Mode; audible when performed with chords
- Output validated against `MelodyResultSchema`

**Implementation Notes:**
- Use Melody Agent (Section 23)
- Constraint melody to chord tones + passing tones
- Support multiple melody lines (lead + hook)
- Generate with randomness (temperature/seed configurable for reproducibility)

---

### FR-003: Bass Line Generation

**Description:** System generates rhythmic bass lines aligned with chords and drums.

**Acceptance Criteria:**
- User provides: "style (root-motion, melodic, synth), energy (sparse, groovy, locked)"
- AI generates bass within **5 seconds**
- Bass respects root motion of chord progression
- Bass syncs rhythmically with drum pattern (quantized to same grid)
- User can adjust: "accent pattern", "note range", "syncopation"
- Bass is playable in Piano Mode on channel 3
- Output validated against `BassResultSchema`

---

### FR-004: Drum Pattern Generation

**Description:** System generates kick, snare, hi-hat, clap patterns in-tempo.

**Acceptance Criteria:**
- User provides: "genre, BPM, energy (low/med/high), swing%"
- AI generates 4 drum patterns (kick, snare, hi-hat, clap) within **4 seconds**
- Patterns are musically coherent and rhythmically locked
- Patterns use standard MIDI drum map (channel 10)
- User can adjust: "note density", "humanization", "swing feel"
- Drum patterns are playable in Drum Rack Mode (16-pad grid)
- Output validated against `DrumPatternSchema`

---

### FR-005: Arrangement Generation

**Description:** System generates multi-section arrangements: intro/verse/hook/bridge/outro.

**Acceptance Criteria:**
- User provides: "total duration (1–4 minutes), energy curve, structural pattern"
- AI generates arrangement within **10 seconds**
- Arrangement follows standard pop/electronic structure:
  - Intro (4–8 bars, sparse instrumentation)
  - Verse 1 (8 bars, medium energy)
  - Hook (8 bars, peak energy)
  - Verse 2 (8 bars, medium energy)
  - Hook (8 bars, peak energy)
  - Bridge (4–8 bars, contrast)
  - Outro (4 bars, wind-down)
- Each section includes instrumentation hints (e.g., "add bass in Verse 2")
- User can customize arrangement in timeline (drag sections, adjust lengths)
- Arrangement is non-destructive (original clips remain unchanged)
- Output validated against `ArrangementSchema`

---

### FR-006: Producer Copilot (Real-Time Feedback)

**Description:** AI assistant provides feedback on compositions in real-time.

**Acceptance Criteria:**
- As user generates or edits composition, Copilot provides suggestions:
  - Harmonic feedback: "Chord IV → V creates tension; consider VI for resolution"
  - Melodic feedback: "Melody starts on chord tone; add passing tone in bar 2 for interest"
  - Arrangement feedback: "Energy dips in verse 2; consider adding drum hi-hat layer"
  - Structural feedback: "Hook is 4 bars; extend to 8 for listener recall"
- Suggestions appear in sidebar; user can accept, reject, or ask follow-up question
- Copilot learns user preferences (stored in Composer Memory, Section 30)
- Response latency <2 seconds
- Suggestions are never applied without explicit user action

---

### FR-007: Composition Analysis & Scoring

**Description:** System analyzes composition and provides musicological breakdown.

**Acceptance Criteria:**
- User clicks "Analyze" on any composition
- System returns within 5 seconds:
  - **Harmonic Analysis**: Roman numeral notation, function (T/D/S), voice leading quality
  - **Melodic Analysis**: contour, highest/lowest notes, interval distribution
  - **Rhythmic Analysis**: polyrhythms, syncopation, quantization
  - **Arrangement Analysis**: instrumentation summary, energy curve, bar count
  - **Overall Score**: 0–100 (combines harmonic coherence, melodic interest, structural balance)
- Analysis is educational (shows Roman numerals, interval names, etc.)
- User can request explanations: "Why is this chord sequence common?" → Copilot explains

---

### FR-008: MIDI Export

**Description:** User can export composition as standard MIDI file(s).

**Acceptance Criteria:**
- Export options:
  - **Full Composition**: 1 MIDI file with all tracks (melody, chords, bass, drums, arrangement)
  - **Per-Track**: Separate MIDI files for each instrument
  - **Arrangement Only**: MIDI with section markers (Arrangement as program changes)
- MIDI export:
  - Uses standard note-on/note-off messages
  - Maps tracks to MIDI channels (melody=1, chords=2, bass=3, drums=10)
  - Includes tempo (tempo track), time signature, key signature (via markers)
  - All notes quantized to nearest 16th (user configurable)
  - Sustain mapped to MIDI CC 64
- Exported MIDI imports cleanly into:
  - Ableton Live 11+
  - FL Studio 21+
  - Logic Pro 12+
  - Studio One 6+
- File names: `{composition_name}_{timestamp}.mid`
- File size <500 KB for typical 2-minute composition

---

### FR-009: Project Management (Save, Load, Version)

**Description:** User can save, load, and version compositions locally and on server.

**Acceptance Criteria:**
- **Save**: One-click save to server; composition stored with metadata (name, bpm, key, genre, created_at, modified_at)
- **Load**: Browse list of saved compositions; filter by date, genre, key, BPM
- **Version Control**:
  - User can create named snapshot: "v1_original", "v2_with_hook"
  - System stores up to 20 versions per composition
  - User can restore any previous version with one click
  - Undo/redo available within active session (local IndexedDB, Section 12)
- **Collaboration**:
  - User can share composition via link (invite-only)
  - Shared compositions allow view-only or edit access (configurable)
  - Change log visible to all collaborators

---

### FR-010: Compositional Memory & Personalization (NEW)

**Description:** System learns user preferences and applies them to future generations.

**Acceptance Criteria:**
- **Learned Preferences**:
  - Favorite genres (detected from composition history)
  - Preferred BPMs
  - Favored keys
  - Arrangement tendencies (e.g., prefers 4-bar phrases over 8-bar)
  - Harmonic preferences (e.g., tends toward sus chords, borrowed chords, etc.)
  - Melodic tendencies (e.g., stepwise motion vs. leaps)
- **Personalized Generation**:
  - Next generation prompts are auto-populated with user's preferred genre/key/BPM
  - AI variations respect learned preferences (e.g., if user favors modal chords, suggestions include mode interchange)
- **Memory Storage**:
  - Stored in `composer_profile` table (PostgreSQL)
  - Synced to client via IndexedDB for offline access
  - User can reset preferences: "Forget my style" button

---

## 9. Functional Requirements — Virtual Composer Machine

### FR-011: 8×8 Performance Grid with <10ms Latency

**Description:** 64 RGB pads render on-screen; pad press triggers note within <10ms.

**Acceptance Criteria:**
- **Rendering**:
  - 8×8 grid renders in Canvas or WebGL (performance priority)
  - Each pad is 50×50px; 10px gap; responsive layout
  - Pad colors: white keys = light gray, black keys = dark gray, active = accent color (pulse)
  - Grid renders at ≥120 FPS on reference machine (Intel i5, 8GB RAM, Chrome 120+)
- **Responsiveness**:
  - Pad press → MIDI note-on sent within **10ms** (P95 latency measured)
  - Pad held → note sustains
  - Pad release → MIDI note-off sent within 5ms
  - Velocity mapping: pressure/duration → MIDI velocity 1–127
- **Multi-Touch**:
  - Support simultaneous 10+ pad presses
  - No audio glitching on chord playback
- **Modes**:
  - **Piano Mode**: 8 octaves of chromatic notes (see Appendix A)
  - **Chord Mode**: Chord names (adjusts per key)
  - **Scale Mode**: Notes locked to selected scale (Smart Scale Mode, FR-017)
  - **Drum Rack Mode**: 16 drum sounds (kick, snare, hi-hat, etc.)
  - **Sequencer Mode**: 8 rows of 16-step sequencers
  - **Session Mode**: 8 clips/rows playable on grid
- **LED Feedback**:
  - Active pads pulse with accent color at 120 BPM pace
  - Currently playing note: bright; off-grid notes: dim
  - Mode indicator at top of grid (text or color)

**Implementation Notes:**
- Use WebAudio API for audio rendering (Section 15)
- Use Canvas2D or Three.js for grid rendering (not DOM)
- Use requestAnimationFrame for 120 FPS target
- Latency measurement: Date.now() on press → audio buffer sample count

---

### FR-012: Smart Touch Encoders (8 Virtual Knobs)

**Description:** 8 virtual encoders control audio parameters and composition attributes.

**Acceptance Criteria:**
- **Encoder Assignments** (customizable):
  1. Volume (0–127)
  2. Pan (L/R)
  3. Filter Cutoff (20–20,000 Hz)
  4. Reverb Wet (0–100%)
  5. Delay Feedback (0–100%)
  6. AI Variation Intensity (0–100%)
  7. Quantization Grid (off, 8th, 16th, 32nd)
  8. Macro Parameter (user-defined; e.g., melody note density)
- **Interaction**:
  - Rotate encoder via mouse drag or touch swipe
  - Visual feedback: value displayed + gauge fill
  - Parameter change occurs in real-time; no audio stepping artifacts
  - Acceleration: slow drag = fine adjustment, fast drag = large jumps
- **MIDI Learn**:
  - User can learn encoders to MIDI CC messages from hardware controller
  - Once learned, hardware knobs control R3 encoders
  - Bidirectional: R3 encoder rotation also sends MIDI CC out
- **Latency**: Parameter change → audio effect <50ms

---

### FR-013: Timeline Engine (Arrangement)

**Description:** Multi-section timeline for arranging intro/verse/hook/bridge/outro.

**Acceptance Criteria:**
- **Timeline View**:
  - Horizontal timeline showing 1–4 minute composition (bars visible)
  - Rows for each instrument track (melody, chords, bass, drums, automation)
  - Sections color-coded: Intro (blue), Verse (green), Hook (red), Bridge (yellow), Outro (gray)
- **Editing**:
  - Drag-and-drop sections to reorder or resize
  - Right-click context menu: duplicate, delete, mute, solo
  - Snap to grid: bar-level (default), 1/2 bar, or free
  - Time signature changes mid-composition supported
- **Playback**:
  - Play button starts playback from cursor position
  - Playhead advances left-to-right; loops on composition end
  - BPM adjustable in real-time (playback continues)
  - Metronome click on beat 1 of each bar
- **Non-Destructive Editing**:
  - Original loops remain in library; timeline uses references
  - Changing a loop on timeline doesn't affect original
  - Undo/redo available for all timeline operations
- **Auto-Arrange**:
  - User clicks "Auto-Arrange" → system generates full timeline from 4-bar loop
  - Generates 1–4 minute arrangement automatically
  - User can customize after generation

---

### FR-014: AI Performance Mode (Variations)

**Description:** Generate variations on any loop without destructing original.

**Acceptance Criteria:**
- User right-clicks on a timeline clip and selects "Generate Variation"
- Variation options:
  - "Higher energy version"
  - "Lower energy version"
  - "Add modal interchange"
  - "Change instrumentation"
  - "Transpose up/down 1 half-step"
  - "Add polyrhythm"
- AI generates variation within 5 seconds
- Variation appears as a new track below original (non-destructive)
- User can A/B compare original and variation in real-time
- Variation is fully editable/movable on timeline

---

### FR-015: AI Jam Mode (Real-Time Accompaniment)

**Description:** Real-time AI response to user's grid performance.

**Acceptance Criteria:**
- **Enable Jam Mode**: Toggle "AI Jam" button; mode indicator lights up
- **User Plays Notes**: User presses pads in Piano Mode
- **AI Responds** within 200ms:
  - Generates complementary bass line
  - Generates counter-melody
  - Follows chord progression (if one exists)
  - Respects user's rhythmic feel (quantizes to user's timing)
- **Humanization**:
  - AI output includes subtle swing (5–15% timing offset per note)
  - Velocity variation (±10% around base velocity)
  - Occasional rests (not every beat filled)
- **Stop Jam**: User disables "AI Jam"; performance returns to solo grid
- **Recording**:
  - All AI accompaniment is recorded as MIDI during jam session
  - User can save jam as new track on timeline

**Implementation Notes:**
- Jam Mode requires low-latency inference
- Use inference cache / prompt caching to reduce latency
- Consider local model (ONNX or TensorFlow.js) for <200ms guarantee

---

### FR-016: Chord Memory (One-Pad Full Voicing)

**Description:** One pad triggers full-voiced chord with intelligent voicing.

**Acceptance Criteria:**
- In Chord Mode, each pad represents a chord (Cmaj, Dm, Em, etc.)
- User presses pad → chord plays with intelligent voicing:
  - Voicing respects voice-leading best practices (smooth voice leading)
  - Voicing favors middle register (avoids extreme highs/lows)
  - Same chord pressed twice uses different voicing (variation)
- User can customize voicing:
  - "Close voicing" (all notes close together)
  - "Wide voicing" (spread across octaves)
  - "Rootless voicing" (chord without root; for harmonic blend)
- Chord sustains while pad is held; releases on pad release
- User can add chord variations: "add 7th", "add 9th", "drop 2 voicing"

---

### FR-017: Smart Scale Mode (Wrong Note Prevention)

**Description:** Grid constrains playable notes to selected scale; impossible to play wrong notes.

**Acceptance Criteria:**
- **Enable Scale Mode**: Toggle "Smart Scale" button
- **Scale Selection**: Dropdown menu with 20+ scales:
  - Major, minor, harmonic minor, melodic minor
  - Dorian, Phrygian, Lydian, Mixolydian
  - Pentatonic major/minor
  - Blues scales
  - Whole-tone, diminished, augmented
- **Grid Remapping**: Grid relabels to show only in-scale notes
  - Out-of-scale pads are grayed out / disabled
  - In-scale pads are highlighted
  - Scale adjusts automatically when key changes
- **Playback**: All notes pressed are guaranteed in-key
- **Beginner Benefit**: Novices can play melodies fearlessly without theory knowledge
- **Professional Benefit**: Can still press disabled pad to see out-of-scale note (optional)

---

### FR-018: MIDI Input & Output (Hardware Integration)

**Description:** VCM can receive MIDI from hardware controller and send MIDI to external synths.

**Acceptance Criteria:**
- **MIDI Input**:
  - User selects hardware MIDI device from dropdown
  - MIDI notes from hardware appear on VCM grid (visual feedback)
  - MIDI CC messages from hardware control VCM parameters (e.g., CC7 = volume)
  - MIDI program change switches VCM modes
- **MIDI Output**:
  - All grid performance is sent to selected MIDI output device
  - External synthesizer/sampler plays R3's audio engine output
  - User can record external synth performance back into R3
- **MIDI Learn**:
  - User can assign any hardware knob/button to any VCM parameter
  - Long-press "Learn Mode" → user twists hardware knob → parameter assigned
  - Bidirectional: R3 parameter changes also update hardware display
- **MIDI Latency**: <30ms round-trip (measured)

**Implementation Notes:**
- Use Web MIDI API
- Browser must have Web MIDI permission granted
- Test with:
  - Ableton Push 2/3
  - Native Instruments Maschine+
  - Novation Launchpad
  - Generic USB MIDI controller

---

## 10. Non-Functional Requirements

### NFR-001: Performance

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| Pad-to-audio latency (P95) | <10ms | Real instrument feel; professional standard |
| Grid render frame rate | ≥120 FPS | Smooth interaction; no jank |
| Generation latency (P95) | <10s | Fast iteration; creative momentum |
| Jam Mode response time (P95) | <200ms | Real-time conversation feel |
| Page load time (DOM interactive) | <3s | User activation threshold |
| Initial composition load from DB | <2s | Perceived responsiveness |
| MIDI export generation | <5s | Non-blocking; shows progress |
| Bandwidth per session | <5 MB/hour | Emerging market mobile compatibility |

### NFR-002: Scalability

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| Concurrent compositions | 100 concurrent exports | Peak load (1000 users × 10% exporting) |
| Concurrent DAW sessions | 50 simultaneous collaborators | Version 3 multi-user feature |
| Compositions per user | 1,000+ (no degradation) | Long-term power user |
| Composition size | <5 MB MIDI (10,000 notes) | Professional project size |
| Database query latency (P95) | <100ms | Page responsiveness |
| Inference queue depth | <30 requests | Auto-scaling trigger |

### NFR-003: Availability & Reliability

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| Uptime (excluding maintenance) | ≥99.5% | SLA commitment |
| MTTR (Mean Time To Recovery) | <30 minutes | RTO target |
| Composition save durability | ≥99.99% | Zero data loss |
| Inference success rate | ≥95% | AI fallback for 5% failures |
| MIDI export success rate | 100% | Critical user path |

### NFR-004: Security

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| Data encryption at rest | AES-256 | GDPR + SOC2 compliance |
| Data encryption in transit | TLS 1.3 | Network security |
| Authentication method | JWT (RS256) | Stateless, industry standard |
| Session timeout | 30 days (persistent) | UX vs. security balance |
| RBAC enforcement | Per-composition (view/edit/share) | Fine-grained access control |

### NFR-005: Compatibility

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| Browser support | Chrome 120+, Firefox 115+, Safari 17+ | 90%+ user coverage |
| OS support | Windows 10+, macOS 12+, iOS 15+, Android 12+ | Cross-platform reach |
| Screen resolution | 1024×768 minimum | Older devices in emerging markets |
| Network connectivity | Works offline; syncs online | Key differentiator |
| Audio latency on Safari | <50ms (with fallback UI notice) | Known limitation; documented |

### NFR-006: Usability

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| Time to first composition | <60 seconds | Engagement KPI |
| Learning curve (untrained user) | 10 minutes to competency | Accessibility |
| Keyboard accessibility | WCAG 2.1 AA | Legal + ethical requirement |
| Mobile responsiveness | Fully functional on iPad | Secondary platform |
| Onboarding tutorial | <3 minutes | Activation metric |

---

## 11. Latency Budget & Performance

### Comprehensive Latency Budget

See **Appendix C** for detailed breakdown.

**Quick Reference:**

| Component | Budget | Allocation | Notes |
|-----------|--------|-----------|-------|
| User input → Audio output | 10ms | Industry standard for instruments |
| Pad press detection | 2ms | Touch/click event → JS handler |
| Audio context scheduling | 3ms | WebAudio buffer ahead |
| Network latency (AI request) | 5s | 5s timeout; fallback if exceeded |
| Melody generation | 6s | 6s timeout; fallback if exceeded |
| Chord generation | 8s | 8s timeout; fallback if exceeded |
| Grid rendering | 8ms | 120 FPS target = 8.33ms per frame |
| Composition load from DB | 2s | Including decompression |

### Performance Optimization Strategy

1. **Client-Side Caching**:
   - IndexedDB cache for last 20 compositions
   - LocalStorage for user preferences
   - Service Worker caching for static assets

2. **Lazy Loading**:
   - Grid renders first; timeline loads after paint
   - Agents load on-demand (don't preload all 5)

3. **Offloading to Workers**:
   - Composition parsing → WebWorker
   - Schema validation → WebWorker
   - MIDI file writing → WebWorker

4. **WebAudio Pre-warming**:
   - AudioContext created on app startup (not first pad press)
   - Audio buffer pre-allocated
   - Reduces first-note latency from 200ms → 10ms

5. **Inference Optimization**:
   - Prompt caching (Anthropic API feature)
   - Batch inference (multiple requests in single API call)
   - Local fallback model (ONNX) for <200ms Jam Mode

---

## 12. Data Architecture & Persistence

### Database Schema (PostgreSQL)

```sql
-- Users & Auth
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  tier ENUM('free', 'pro', 'studio') DEFAULT 'free',
  generations_used INT DEFAULT 0,
  generations_reset_date TIMESTAMP
);

-- Compositions (Core)
CREATE TABLE compositions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  key VARCHAR(10) NOT NULL,
  bpm INT NOT NULL,
  time_signature VARCHAR(5) DEFAULT '4/4',
  genre VARCHAR(50),
  harmony JSONB,
  melodies JSONB[],
  bass JSONB,
  drums JSONB,
  arrangement JSONB,
  schema_version INT DEFAULT 1,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

-- Composition Versions
CREATE TABLE composition_versions (
  id UUID PRIMARY KEY,
  composition_id UUID REFERENCES compositions(id),
  version_number INT,
  label VARCHAR(100),
  data JSONB,
  created_at TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- Collaborations
CREATE TABLE collaborations (
  id UUID PRIMARY KEY,
  composition_id UUID REFERENCES compositions(id),
  user_id UUID REFERENCES users(id),
  access_level ENUM('view', 'edit') DEFAULT 'view',
  shared_at TIMESTAMP
);

-- Composer Memory
CREATE TABLE composer_profile (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  preferred_genres JSONB,
  preferred_bpms JSONB,
  preferred_keys JSONB,
  arrangement_tendencies JSONB,
  harmonic_preferences JSONB,
  melodic_tendencies JSONB,
  updated_at TIMESTAMP
);

-- Analytics Events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  event_type VARCHAR(100),
  event_data JSONB,
  timestamp TIMESTAMP,
  INDEX idx_user_timestamp (user_id, timestamp)
);

-- Audit Log (for security & debugging)
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100),
  resource_type VARCHAR(50),
  resource_id UUID,
  old_value JSONB,
  new_value JSONB,
  timestamp TIMESTAMP
);
```

### Client-Side Storage (IndexedDB)

```javascript
// Store composition for offline access
const compositionStore = {
  key: 'compositions',
  keyPath: 'id',
  indexes: [
    { name: 'userId', keyPath: 'userId' },
    { name: 'createdAt', keyPath: 'createdAt' }
  ]
};

// Store user preferences
const preferencesStore = {
  key: 'preferences',
  keyPath: 'userId',
  data: {
    userId: string,
    theme: 'dark' | 'light',
    defaultKey: string,
    defaultBPM: number,
    enableMetronome: boolean,
    enableAutoSave: boolean,
    encoderAssignments: { [encoderIndex]: parameterName }
  }
};

// Store offline queue for failed requests
const syncQueueStore = {
  key: 'syncQueue',
  keyPath: 'id',
  data: {
    id: string,
    action: 'generate' | 'save' | 'export',
    payload: any,
    timestamp: number,
    retries: number
  }
};
```

### Data Flow

```
User Input
  ↓
Client State (React + Zustand)
  ↓
Local IndexedDB (offline persistence)
  ↓
Network Request (with retry logic)
  ↓
Server API (Express + TypeScript)
  ↓
PostgreSQL (durability)
  ↓
Response → Client
  ↓
IndexedDB Update
  ↓
UI Re-render
```

---

## 13. Offline-First & Sync Strategy

### Offline Capabilities

**While Offline:**
- ✅ View all previously downloaded compositions
- ✅ Create new compositions (stored locally)
- ✅ Edit timeline, grid, parameters
- ✅ Queue AI generation requests (will process when online)
- ✅ Preview MIDI export (doesn't require network)
- ❌ Generate new compositions via AI (queued for later)
- ❌ Share with collaborators (queued for later)
- ❌ Access new collaborator changes (will sync when online)

### Sync Strategy (CRDT-Based)

**Offline Conflict Resolution:**

When user goes offline and makes edits while collaborator edits same composition:

1. **Local Changes Recorded** (client A):
   - Melody added to bar 5
   - Timestamp: 1708000000
   - Client ID: "client-a-xyz"

2. **Remote Changes Recorded** (client B):
   - Bass changed in bar 3
   - Timestamp: 1708000050
   - Client ID: "client-b-abc"

3. **On Reconnect**:
   - Client A detects both versions
   - CRDT algorithm merges non-conflicting edits
   - Both melody + bass changes appear in timeline
   - User sees "Merged 2 collaborator changes" notification

4. **Conflict Resolution** (if same bar edited):
   - "Last write wins" is default
   - User can select "Keep mine", "Keep theirs", or "Merge"
   - Version history shows both versions

**Implementation:**
- Use Automerge or Yjs library (CRDT standard)
- Store operation log in `composition_versions` table
- Replay operations from last sync point

### Service Worker Strategy

```typescript
// Service Worker (service-worker.ts)
self.addEventListener('install', (event) => {
  // Cache critical assets on install
  event.waitUntil(
    caches.open('r3-v1').then((cache) =>
      cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js',
        '/audio-worklet.js'
      ])
    )
  );
});

self.addEventListener('fetch', (event) => {
  // Network-first for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const cache = caches.open('r3-api-v1');
            cache.then((c) => c.put(event.request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(event.request);
        })
    );
  } else {
    // Cache-first for static assets
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});

// Background Sync for queued requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-queue') {
    event.waitUntil(syncQueuedRequests());
  }
});

async function syncQueuedRequests() {
  const db = await openIndexedDB();
  const queue = await db.getAll('syncQueue');
  
  for (const item of queue) {
    try {
      const response = await fetch(`/api/${item.action}`, {
        method: 'POST',
        body: JSON.stringify(item.payload)
      });
      if (response.ok) {
        await db.delete('syncQueue', item.id);
      }
    } catch (err) {
      // Retry later
      console.error('Sync failed; will retry', err);
    }
  }
}
```

---

## 14. AI Requirements & Fallback Strategy

### AI Service Dependencies

| Service | Purpose | Timeout | Fallback |
|---------|---------|---------|----------|
| Harmonic Agent | Chord progression generation | 8s | Deterministic progression |
| Melody Agent | Melody generation | 6s | Pentatonic scale arpeggio |
| Drum Agent | Drum pattern generation | 4s | 4-on-floor kick + snare pattern |
| Bass Agent | Bass line generation | 5s | Root-motion bass |
| Arrangement Agent | Section arrangement | 10s | Standard 8/8/8/4/4 structure |
| Melody Copilot | Real-time feedback | 2s | Silent (no feedback) |

### Fallback Compositions (Deterministic)

**When AI times out or fails, fallback to:**

```typescript
const fallbackComposition = {
  key: userSelectedKey || 'C',
  bpm: userSelectedBPM || 120,
  timeSignature: '4/4',
  
  // Harmonic fallback: I-V-vi-IV (very common)
  harmony: [
    { root: 'C', type: 'maj7' },
    { root: 'G', type: '7' },
    { root: 'A', type: 'min7' },
    { root: 'F', type: 'maj7' }
  ],
  
  // Melodic fallback: pentatonic arpeggio
  melodies: [{
    notes: [0, 2, 4, 7, 9, 12], // Pentatonic scale degrees
    rhythm: 'quarter notes'
  }],
  
  // Bass fallback: root motion
  bass: {
    notes: [0, 7, 9, 5], // Root, 5th, 6th, 4th
    rhythm: 'quarter notes'
  },
  
  // Drum fallback: 4-on-floor
  drums: {
    kick: [0, 2, 4, 6, 8, 10, 12, 14],
    snare: [2, 6, 10, 14],
    hihat: [0, 1, 2, 3, 4, 5, 6, 7] // Every 8th note
  },
  
  // Arrangement fallback: standard structure
  arrangement: {
    sections: [
      { type: 'intro', bars: 8, instruments: ['drums', 'bass'] },
      { type: 'verse', bars: 8, instruments: ['melody', 'chords', 'bass', 'drums'] },
      { type: 'hook', bars: 8, instruments: ['melody', 'chords', 'bass', 'drums'] },
      { type: 'outro', bars: 4, instruments: ['bass', 'drums'] }
    ]
  }
};
```

### Error Handling for AI

```typescript
// Service: composers/ai.service.ts

async function generateComposition(prompt, userContext) {
  try {
    // 1. Request with timeout
    const composition = await Promise.race([
      callAIGenerationAPI(prompt, userContext),
      timeout(10000) // 10-second global timeout
    ]);
    
    // 2. Validate composition schema
    const validated = CompositionSchema.parse(composition);
    
    return validated;
    
  } catch (error) {
    if (error.code === 'TIMEOUT') {
      // Log timeout for monitoring
      logger.warn('AI generation timeout', { prompt, userContext });
      
      // Return fallback composition
      return createFallbackComposition(userContext);
      
    } else if (error.code === 'VALIDATION') {
      // Composition failed schema validation
      logger.error('Invalid composition schema', { composition, error });
      
      // Return fallback composition
      return createFallbackComposition(userContext);
      
    } else {
      // Other errors (network, auth, etc.)
      logger.error('AI generation error', { error, prompt });
      throw error; // Will be caught by UI error boundary
    }
  }
}
```

### Monitoring & Alerting

| Alert | Threshold | Action |
|-------|-----------|--------|
| AI timeout rate | >5% of requests | Page ops; investigate service |
| Fallback usage rate | >10% of requests | Investigate model quality |
| Schema validation failure | Any | Page ops immediately; revert deployment |
| Inference queue depth | >100 requests | Auto-scale inference workers |

---

## 15. Audio Engine Requirements

### WebAudio Architecture

```typescript
// services/audio-engine.service.ts

class AudioEngine {
  private audioContext: AudioContext;
  private masterGain: GainNode;
  private compressor: DynamicsCompressorNode;
  private analyzer: AnalyserNode;
  private oscCache: Map<number, OscillatorNode> = new Map();
  
  constructor() {
    // Initialize on demand (user gesture required for autoplay policy)
    this.initializeAudioContext();
  }
  
  private initializeAudioContext() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 48000, // Professional audio rate
      latencyHint: 'interactive' // Minimize latency
    });
    
    // Master chain: oscillators → gain → compressor → analyzer → destination
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.7;
    
    this.compressor = this.audioContext.createDynamicsCompressor();
    this.compressor.threshold.value = -50;
    this.compressor.ratio.value = 4;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.25;
    
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.fftSize = 2048;
    
    // Connect chain
    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.analyzer);
    this.analyzer.connect(this.audioContext.destination);
  }
  
  // Schedule note on
  noteOn(midiNote: number, velocity: number, when?: number) {
    const frequency = midiToFrequency(midiNote);
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'triangle'; // Soft sound
    osc.frequency.value = frequency;
    
    // Velocity → gain (1–127 maps to 0.1–1.0)
    const gainValue = 0.1 + (velocity / 127) * 0.9;
    gain.gain.setValueAtTime(gainValue, when || this.audioContext.currentTime);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(when || this.audioContext.currentTime);
    
    // Store for later note-off
    this.oscCache.set(midiNote, { osc, gain });
  }
  
  // Schedule note off with ADSR envelope
  noteOff(midiNote: number, when?: number) {
    const entry = this.oscCache.get(midiNote);
    if (!entry) return;
    
    const { osc, gain } = entry;
    const now = when || this.audioContext.currentTime;
    
    // Release (250ms envelope)
    gain.gain.setTargetAtTime(0, now, 0.05);
    
    osc.stop(now + 0.25);
    this.oscCache.delete(midiNote);
  }
  
  // Set master volume (0–1)
  setMasterVolume(level: number) {
    this.masterGain.gain.setTargetAtTime(level, this.audioContext.currentTime, 0.01);
  }
  
  // Get audio level (for visualization)
  getAudioLevel(): number {
    const dataArray = new Uint8Array(this.analyzer.frequencyBinCount);
    this.analyzer.getByteFrequencyData(dataArray);
    return dataArray.reduce((a, b) => a + b) / dataArray.length / 255;
  }
}

// Utility: MIDI note number to frequency (Hz)
function midiToFrequency(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}
```

### AudioWorklet for MIDI Rendering (Future Optimization)

```typescript
// audio-worklet.js
class MidiProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.activeNotes = new Map();
    
    this.port.onmessage = (event) => {
      if (event.data.type === 'noteOn') {
        this.playNote(event.data.midiNote, event.data.velocity);
      } else if (event.data.type === 'noteOff') {
        this.stopNote(event.data.midiNote);
      }
    };
  }
  
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const channelData = output[0];
    
    // Generate audio for all active notes
    channelData.fill(0);
    for (const [midiNote, osc] of this.activeNotes) {
      // Generate sine wave for this note
      for (let i = 0; i < channelData.length; i++) {
        const frequency = midiToFrequency(midiNote);
        const sample = Math.sin(2 * Math.PI * frequency * (this.index + i) / sampleRate);
        channelData[i] += sample * 0.1; // Mix notes
      }
    }
    
    this.index += channelData.length;
    return true;
  }
  
  playNote(midiNote, velocity) {
    this.activeNotes.set(midiNote, { startTime: this.index });
  }
  
  stopNote(midiNote) {
    this.activeNotes.delete(midiNote);
  }
}

registerProcessor('midi-processor', MidiProcessor);
```

---

## 16. MIDI Requirements

### MIDI Mapping

```typescript
// MIDI Channel Assignments
const MIDI_CHANNELS = {
  melody: 0,    // Channel 1
  chords: 1,    // Channel 2
  bass: 2,      // Channel 3
  drums: 9      // Channel 10 (standard drum channel)
};

// MIDI Drum Map (General MIDI Standard)
const DRUM_MAP = {
  36: 'Kick',
  38: 'Snare',
  42: 'Hi-Hat Closed',
  46: 'Hi-Hat Open',
  41: 'Tom 1',
  43: 'Tom 2',
  45: 'Tom 3',
  49: 'Crash',
  52: 'Ride',
  51: 'Ride (Bell)',
  50: 'Clap',
  48: 'Rim Shot'
};

// MIDI CC Assignments
const CC_ASSIGNMENTS = {
  7: 'Volume',
  10: 'Pan',
  11: 'Expression',
  64: 'Sustain',
  91: 'Reverb',
  93: 'Delay'
};
```

### MIDI Export Format

**When exporting MIDI:**

1. **File Header**:
   - Format: Type 1 (multiple tracks)
   - Tempo: User's BPM → microseconds per beat
   - Time signature: User's time signature (default 4/4)

2. **Track Data**:
   - Track 0: Tempo track + markers
   - Track 1: Melody notes (channel 1)
   - Track 2: Chord notes (channel 2)
   - Track 3: Bass notes (channel 3)
   - Track 4: Drum notes (channel 10)

3. **Note Quantization**:
   - All notes quantized to nearest 16th note (configurable)
   - No microtonal frequencies; all standard 12-TET

4. **Metadata**:
   - Track names included (e.g., "Melody", "Bass", "Drums")
   - Copyright included (if composition has license)
   - Markers for section boundaries (Intro, Verse, Hook, etc.)

---

## 17. Analytics & Observability

### Event Taxonomy

```typescript
// Event schema (sent to analytics backend)
interface AnalyticsEvent {
  // Core
  event_id: string; // UUID
  user_id: string;
  session_id: string;
  timestamp: number; // milliseconds since epoch
  
  // Event-specific
  event_type: string; // see below
  event_data: any;
  
  // Context
  client_version: string;
  browser: string;
  os: string;
  network_type: '4g' | '3g' | 'wifi' | 'offline';
}

// Event Types
const EVENT_TYPES = {
  // Session events
  'session.start': { sessionSource: 'new' | 'resume' },
  'session.end': { duration: number },
  
  // Composer events
  'composer.prompt_submitted': { 
    prompt: string,
    userTier: 'free' | 'pro' | 'studio'
  },
  'composer.generation_completed': {
    duration_ms: number,
    success: boolean,
    used_fallback: boolean,
    composition_id: string
  },
  'composer.generation_failed': {
    error_code: string,
    error_message: string
  },
  
  // VCM events
  'vcm.mode_switched': { from: string, to: string },
  'vcm.pad_pressed': {
    pad_index: number,
    velocity: number,
    mode: string
  },
  'vcm.encoder_adjusted': {
    encoder_index: number,
    value: number,
    parameter: string
  },
  
  // Timeline events
  'timeline.section_edited': {
    section_type: string,
    action: 'created' | 'deleted' | 'moved' | 'resized'
  },
  
  // Export events
  'export.initiated': { export_type: 'midi' | 'stems' | 'project' },
  'export.completed': {
    export_type: string,
    duration_ms: number,
    file_size_bytes: number
  },
  
  // Monetization events
  'subscription.upgraded': { from: string, to: string },
  'subscription.downgraded': { from: string, to: string },
  'generation.quota_exceeded': { quota: number, current: number }
};
```

### Observability Stack

| Component | Tool | Purpose |
|-----------|------|---------|
| Logging | CloudWatch / Loki | Request logs, errors, traces |
| Metrics | Prometheus / DataDog | Latency, throughput, errors |
| Traces | OpenTelemetry / Jaeger | Distributed tracing |
| Frontend Monitoring | Sentry | Client-side errors |
| Dashboards | Grafana | Real-time metrics visualization |

### Key Metrics Dashboard

```
┌─────────────────────────────────────────────────────────┐
│ R3 Composer + VCM — Operations Dashboard                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Real-time (Past 1 hour)                                │
│ ├─ Active Users: 1,234                                 │
│ ├─ Compositions Generated: 456                         │
│ ├─ Avg Generation Latency: 4.2s (P95: 7.8s)           │
│ ├─ Grid Latency (P95): 8.2ms                           │
│ ├─ Error Rate: 0.23%                                   │
│ └─ Fallback Usage: 1.8%                                │
│                                                         │
│ Service Health                                          │
│ ├─ API: ✅ Healthy (99.7% uptime, 24h)                │
│ ├─ AI Inference: ✅ Healthy (queue: 12 / 100)         │
│ ├─ Database: ✅ Healthy (latency: 45ms P95)           │
│ ├─ Audio Engine: ✅ Healthy (120 FPS)                 │
│ └─ Cache Hit Rate: 67%                                 │
│                                                         │
│ Alerts (Past 24h)                                       │
│ ├─ ⚠️  AI Timeout Rate Spike (4.2% @ 14:32)            │
│ ├─ ⚠️  Database Query Slowdown (avg 180ms @ 12:45)     │
│ └─ ✅ All other systems nominal                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 18. Error Handling & Recovery

### Error Classification

| Error Type | User Impact | Handling |
|-----------|-------------|----------|
| **Generation Timeout** | Composition not generated; quota still charged | Fallback composition; refund quota; retry queue |
| **MIDI Export Failure** | Export doesn't complete | Show error message; offer download retry |
| **Database Error** | Composition not saved | Queued in Service Worker; retries on reconnect |
| **Authentication Failure** | User logged out; can't save | Redirect to login; recover session on re-auth |
| **Network Error** | Request fails; offline mode activates | Automatic retry; queue for sync |
| **Schema Validation** | Composition appears broken | Attempt recovery via migration; fallback if not possible |
| **Audio Playback Error** | No sound; pads don't work | Suggest browser restart; check audio permissions |

### User-Facing Error Messages

```typescript
// Error message hierarchy (user perspective)

const ERROR_MESSAGES = {
  // Generation errors
  AI_TIMEOUT: {
    title: 'Generation took too long',
    message: 'We\'ve created a fallback composition for you while we investigate. Your generation quota has been refunded.',
    action: 'Try Again' | 'Use Fallback'
  },
  
  INVALID_PROMPT: {
    title: 'Couldn\'t understand your prompt',
    message: 'Please include at least a genre, key, and BPM. Example: "techno, G minor, 120 BPM"',
    action: 'Edit Prompt'
  },
  
  // Export errors
  EXPORT_FAILED: {
    title: 'Export didn\'t complete',
    message: 'We\'ve saved your composition. Try exporting again or contact support.',
    action: 'Retry Export' | 'View Composition'
  },
  
  // Network errors
  NO_INTERNET: {
    title: 'You\'re offline',
    message: 'You can still compose, edit, and perform. Changes will sync when you\'re back online.',
    action: 'Got It'
  },
  
  // Quota errors
  QUOTA_EXCEEDED: {
    title: 'You\'ve reached your monthly limit',
    message: 'Free users get 25 generations per month. Upgrade to Pro for unlimited.',
    action: 'View Plans' | 'Go Back'
  }
};
```

### Recovery Strategies

**Strategy A: Automatic Retry with Exponential Backoff**

```typescript
async function retryWithBackoff(fn, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const delayMs = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      await sleep(delayMs);
    }
  }
  
  throw lastError;
}
```

**Strategy B: Graceful Degradation**

```typescript
// If AI inference unavailable, use fallback
try {
  composition = await generateViaAI(prompt);
} catch {
  composition = createFallbackComposition(prompt);
  showNotification('Using fallback composition while we work on the issue');
}
```

**Strategy C: Data Recovery**

```typescript
// On schema validation failure, attempt migration
try {
  const validated = CompositionSchema.parse(composition);
  return validated;
} catch (validationError) {
  // Attempt to migrate composition to latest schema
  const migrated = migrateCompositionSchema(composition, validationError);
  
  if (migrated) {
    // Successfully migrated; use migrated version
    return migrated;
  } else {
    // Can't migrate; use fallback + notify user
    sendAlert('Composition structure corrupted; recovered with fallback');
    return createFallbackComposition();
  }
}
```

---

## 19. Testing Strategy

### Test Pyramid

```
        ▲
       /│\
      / │ \  E2E Tests (10%)
     /  │  \  • Full user workflows
    /────────\
   /   │     \ Integration Tests (30%)
  /    │      \ • API + DB + Workers
 /─────────────\
/ Acceptance   \
/ User Stories  \ Unit Tests (60%)
 \ (acceptance/  \ • Functions, classes,
  \ .ts)         \ components
   ─────────────
```

### Test Categories

| Test Type | Count | Coverage | Tools |
|-----------|-------|----------|-------|
| Unit Tests (functions, components) | 400+ | 80%+ | Vitest, Testing Library |
| Integration Tests (API, DB, workers) | 150+ | 50%+ | Vitest, supertest |
| Acceptance Tests (user stories) | 50+ | Critical paths | Cucumber / Gherkin |
| E2E Tests (full workflows) | 30+ | Critical paths | Playwright |
| Performance Tests (latency) | 5+ | Key metrics | Artillery, Lighthouse |
| Security Tests (OWASP) | 20+ | Vulnerability coverage | OWASP ZAP, Snyk |
| Load Tests (concurrent users) | 2 | Peak load | Artillery, k6 |
| Browser Compatibility Tests | 20+ | Chrome, Firefox, Safari | BrowserStack |

### Critical Test Scenarios

```gherkin
# Scenario 1: Complete Composition Workflow
Scenario: User generates, performs, and exports composition in <2 minutes
  Given user opens R3 Composer
  When user submits prompt "house, F major, 128 BPM, energetic"
  Then composition generates within 8 seconds
  And composition appears on grid and timeline
  And user can press pads and hear notes
  And latency is <10ms
  And user can export to MIDI
  And MIDI imports cleanly into Ableton Live
  And session takes <2 minutes total

# Scenario 2: Offline Sync Conflict Resolution
Scenario: Two users edit same composition offline; changes merge without data loss
  Given user A and user B have shared composition
  And both go offline
  And user A adds melody to verse
  And user B adds bass to verse
  When both reconnect
  Then both changes appear in timeline
  And composition remains playable
  And version history shows both edits
  
# Scenario 3: Quota Enforcement
Scenario: Free user hits 25-generation limit
  Given user is on free tier with 24 generations used
  When user requests 25th generation
  Then it succeeds
  When user requests 26th generation
  Then request fails with clear message
  And upgrade CTA appears
  And no generation quota is consumed
```

---

## 20. Security Requirements

### Data Security

| Layer | Requirement | Implementation |
|-------|-------------|-----------------|
| At Rest | AES-256 encryption | PostgreSQL pgcrypto extension |
| In Transit | TLS 1.3 minimum | HTTPS; HSTS header |
| API Keys | No hardcoded secrets | Use AWS Secrets Manager / Vault |
| Sensitive Data | Never log passwords/tokens | Implement log masking |

### Authentication & Authorization

| Requirement | Implementation |
|-------------|-----------------|
| Authentication | JWT (RS256) with RS private key |
| Session Management | Stateless (JWT in localStorage) |
| Token Expiry | Access: 1 hour, Refresh: 30 days |
| RBAC | Per-composition (owner, editor, viewer) |
| MFA | Optional; TOTP-based |

### API Security

```typescript
// Middleware stack (Express)

// 1. Input validation
app.use(express.json({ limit: '10mb' }));
app.use(validate()); // Joi/Zod schema validation

// 2. Rate limiting
app.use(rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  keyGenerator: (req) => req.user.id || req.ip
}));

// 3. Authentication
app.use(authenticateJWT);

// 4. Authorization
app.use(authorizeComposition);

// 5. Logging
app.use(logRequest);

// 6. CORS
app.use(cors({
  origin: ['https://r3native.com', 'https://app.r3native.com'],
  credentials: true
}));

// 7. Security headers
app.use(helmet());

// 8. CSRF protection
app.use(csrf());
```

### Audit Logging

```typescript
// Log all sensitive operations

const auditLog = async (userId, action, resource, changes) => {
  await db.insert('audit_log', {
    user_id: userId,
    action: action, // 'create', 'update', 'delete', 'export', etc.
    resource_type: resource.type, // 'composition', 'user', etc.
    resource_id: resource.id,
    old_value: changes.before,
    new_value: changes.after,
    timestamp: new Date(),
    ip_address: req.ip,
    user_agent: req.get('user-agent')
  });
};

// Usage
auditLog(userId, 'export', { type: 'composition', id: compId }, {
  before: null,
  after: { format: 'midi', file_size: 15000 }
});
```

---

## 21. Accessibility Requirements

### WCAG 2.1 Level AA Compliance

| Requirement | Implementation |
|-------------|-----------------|
| Keyboard Navigation | Tab order; skip links; no keyboard traps |
| Screen Reader Support | ARIA labels; semantic HTML |
| Color Contrast | 4.5:1 for text; 3:1 for UI components |
| Motion / Animation | Respect `prefers-reduced-motion` |
| Focus Indicators | Visible outline on all interactive elements |
| Text Sizing | Support up to 200% zoom without loss of function |
| Form Labels | All inputs have associated labels |

### Keyboard Navigation

```typescript
// Grid keyboard controls
const KEYBOARD_MAP = {
  'ArrowUp': () => focusPadAbove(),
  'ArrowDown': () => focusPadBelow(),
  'ArrowLeft': () => focusPadLeft(),
  'ArrowRight': () => focusPadRight(),
  'Enter': () => pressFocusedPad(),
  ' ': () => pressFocusedPad(), // Space bar
  
  // Mode switching
  'P': () => switchMode('piano'),
  'C': () => switchMode('chord'),
  'D': () => switchMode('drums'),
  'S': () => switchMode('scale'),
  
  // Timeline
  'Ctrl+Z': () => undo(),
  'Ctrl+Shift+Z': () => redo(),
  'Space': () => playToggle(), // In timeline context
};
```

---

## 22. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────┐  ┌──────────┐  ┌────────────┐            │
│  │  React UI  │  │WebAudio  │  │Service     │            │
│  │Components  │  │Engine    │  │Worker     │            │
│  └────────────┘  └──────────┘  └────────────┘            │
│        ↓              ↓               ↓                    │
│  ┌──────────────────────────────────────────┐             │
│  │   Zustand (Client State) + IndexedDB     │             │
│  └──────────────────────────────────────────┘             │
│        ↓                                                   │
│  ┌──────────────────────────────────────────┐             │
│  │   Fetch API + Service Worker (Offline)   │             │
│  └──────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
                         ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Node.js + Express)               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Auth/JWT  │  │Composer  │  │Export    │  │Analytics│   │
│  │Service   │  │Service   │  │Service   │  │Service   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│        ↓              ↓             ↓            ↓          │
│  ┌──────────────────────────────────────────┐             │
│  │   AI Agent Service (Anthropic API)       │             │
│  │   ├─ Harmony Agent                       │             │
│  │   ├─ Melody Agent                        │             │
│  │   ├─ Drum Agent                          │             │
│  │   └─ Arrangement Agent                   │             │
│  └──────────────────────────────────────────┘             │
│        ↓                                                   │
│  ┌──────────────────────────────────────────┐             │
│  │   PostgreSQL (Persistence)               │             │
│  │   ├─ Compositions                        │             │
│  │   ├─ Users & Auth                        │             │
│  │   ├─ Audit Log                           │             │
│  │   └─ Analytics Events                    │             │
│  └──────────────────────────────────────────┘             │
│        ↓                                                   │
│  ┌──────────────────────────────────────────┐             │
│  │   S3 / R2 (File Storage)                 │             │
│  │   ├─ MIDI files                          │             │
│  │   ├─ Stems                               │             │
│  │   └─ Project exports                     │             │
│  └──────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│            External Services & Infrastructure               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐│
│  │Anthropic API   │  │Stripe Payments │  │SendGrid Email  ││
│  │(AI Generation) │  │(Subscriptions) │  │(Notifications) ││
│  └────────────────┘  └────────────────┘  └────────────────┘│
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐│
│  │Sentry Error    │  │DataDog Metrics │  │Loki Logs       ││
│  │Tracking        │  │(Observability) │  │(Aggregation)   ││
│  └────────────────┘  └────────────────┘  └────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Core Services

**Composer Service**
- Composition CRUD
- Calls Harmony/Melody/Drum/Arrangement Agents
- Validates composition schema
- Handles versioning

**Export Service**
- Generates MIDI files
- Exports stems (future)
- Generates project files (future)
- Stores files in S3/R2

**Analytics Service**
- Receives events from client
- Batches and stores in PostgreSQL
- Computes daily aggregates
- Dashboards via Grafana

**Auth Service**
- JWT generation/validation
- Password hashing (bcrypt)
- Session management
- Rate limiting per user

---

## 23. AI Agent Mesh

### Agent Specifications

**Harmony Agent**
- Input: Key, BPM, genre, mood
- Output: 4–8 chords (HarmonyResultSchema)
- Constraints: Diatonic to key; functional harmony
- Latency target: 8s (timeout fallback)

**Melody Agent**
- Input: Chords, length, tone, style
- Output: Melody notes + rhythm (MelodyResultSchema)
- Constraints: In-key; no dissonance with chord root
- Latency target: 6s

**Drum Agent**
- Input: BPM, genre, energy, swing%
- Output: 4 drum patterns (kick, snare, hi-hat, clap)
- Constraints: Locked to BPM; standard MIDI drum map
- Latency target: 4s

**Bass Agent**
- Input: Chords, style, energy
- Output: Bass notes + rhythm (BassResultSchema)
- Constraints: Root motion; no crossing chord root
- Latency target: 5s

**Arrangement Agent**
- Input: Chords + melodies + drums, duration, structure template
- Output: Arrangement with sections (ArrangementSchema)
- Constraints: Standard 4/8/8/4/8 structure; energy curve
- Latency target: 10s

**Copilot Agent (Real-Time Feedback)**
- Input: Current composition + user edit
- Output: Suggestions (text + musical reasoning)
- Constraints: <2s response; never intrusive
- Latency target: 2s

---

## 24. Composition Graph Engine

**Graph Structure**

```typescript
interface CompositionGraph {
  nodes: {
    chords: ChordNode[];
    notes: NoteNode[];
    sections: SectionNode[];
    motifs: MotifNode[];
  };
  edges: {
    harmonic: Edge[];
    rhythmic: Edge[];
    arrangement: Edge[];
  };
}

// Benefits
- Regenerate any section without affecting others
- Style transfer (apply one section's style to another)
- Motif extraction (find & develop recurring patterns)
- AI editing (suggest improvements with reasoning)
```

---

## 25. Real-Time Collaboration Architecture

### CRDT-Based Approach (Yjs / Automerge)

**Conflict-Free Merging:**
1. Each operation tagged with client ID + timestamp
2. Operations stored in operation log
3. When merging: apply all operations in canonical order
4. Result: identical state on all clients without explicit conflict resolution

**Example:**

```typescript
// Client A: Offline
composition.timeline.addSection('Verse 2', { bars: 8 });
// → Op log: { id: 'client-a', op: 'add_section', ...}

// Client B: Offline
composition.harmony.changeChord(3, 'Dm');
// → Op log: { id: 'client-b', op: 'change_chord', ...}

// Both reconnect
// Yjs merges: both ops applied to final composition
// Result: Verse 2 added + Dm chord set (no conflict)
```

---

## 26. Developer Platform & APIs

### REST API Endpoints

```
POST   /api/compositions               # Create composition
GET    /api/compositions               # List user's compositions
GET    /api/compositions/:id           # Get single composition
PATCH  /api/compositions/:id           # Update composition
DELETE /api/compositions/:id           # Delete composition
POST   /api/compositions/:id/versions  # Create version snapshot
GET    /api/compositions/:id/versions  # List versions
POST   /api/compositions/:id/export    # Export to MIDI/stems/project

POST   /api/generate/harmony           # Generate chords
POST   /api/generate/melody            # Generate melody
POST   /api/generate/drums             # Generate drum pattern
POST   /api/generate/arrangement       # Generate arrangement

POST   /api/collaborations             # Share composition
GET    /api/collaborations             # List shared compositions
PATCH  /api/collaborations/:id         # Update access level
DELETE /api/collaborations/:id         # Revoke access

POST   /api/analyze                    # Analyze composition (theory)

GET    /api/profile                    # Get user profile
PATCH  /api/profile                    # Update profile
GET    /api/profile/preferences        # Get user preferences
PATCH  /api/profile/preferences        # Update preferences

GET    /api/account/usage              # Get generation quota usage
POST   /api/account/upgrade            # Upgrade subscription
```

### SDK (JavaScript)

```typescript
// Installation
npm install @r3native/composer-sdk

// Usage
import { R3Composer } from '@r3native/composer-sdk';

const composer = new R3Composer({
  apiKey: 'pk_live_xxx',
  baseURL: 'https://api.r3native.com'
});

// Generate composition
const composition = await composer.generateComposition({
  prompt: 'house, F major, 128 BPM, energetic',
  genre: 'house',
  key: 'F',
  bpm: 128
});

// Export to MIDI
const midiUrl = await composer.exportMIDI(composition.id);

// Real-time collaboration
const session = await composer.createCollaborativeSession(composition.id);
session.onRemoteChange((change) => {
  console.log('Collaborator changed:', change);
});
```

---

## 27. Infrastructure & Operations

### Deployment Architecture

```
CloudFlare (CDN + DDoS Protection)
        ↓
AWS Application Load Balancer (ALB)
        ↓
┌───────────────────────────────────┐
│  ECS (Fargate Containers)         │
│  ├─ API Service (4 tasks, auto-scale)
│  ├─ Worker Service (inference queue)
│  └─ Scheduler Service (background jobs)
└───────────────────────────────────┘
        ↓
┌───────────────────────────────────┐
│  Database Tier                    │
│  ├─ RDS PostgreSQL (primary)      │
│  ├─ RDS Replica (read-only)       │
│  └─ Redis Cache (session/rate limit)
└───────────────────────────────────┘
        ↓
┌───────────────────────────────────┐
│  Storage Tier                     │
│  ├─ S3 (MIDI files, exports)      │
│  ├─ CloudFront (CDN for files)    │
│  └─ Backup (cross-region replica) │
└───────────────────────────────────┘
```

### Monitoring & Alerting

**Metrics Captured:**

- P50/P95/P99 latency per endpoint
- Error rate (4xx, 5xx)
- Database query latency
- Cache hit ratio
- Inference queue depth
- Active user count
- Compositions generated/hour
- MIDI export success rate

**Alert Thresholds:**

| Alert | Threshold | Action |
|-------|-----------|--------|
| P95 API latency | >2s | Page ops; investigate |
| Error rate | >1% | Page ops; investigate |
| Database latency | >500ms | Check query performance |
| Inference queue | >100 | Auto-scale workers |
| Cache hit ratio | <60% | Review cache strategy |

---

## 28. Deployment & Release Strategy

### Release Process

**Phase 1: Staging (1 day)**
- Deploy to staging environment
- Run full test suite
- Performance benchmarks
- Security scan

**Phase 2: Canary (1 day)**
- Deploy to 5% of production traffic
- Monitor error rate, latency
- Collect user feedback
- Roll back if issues

**Phase 3: Gradual Rollout (3 days)**
- Deploy to 25% of traffic
- Monitor for 24h
- Deploy to 50%
- Monitor for 24h
- Deploy to 100%

**Phase 4: Monitoring (7 days)**
- Intensive monitoring for 1 week
- Quick rollback capability
- Gradual confidence increase

---

## 29. Monetization Strategy

### Pricing Tiers

| Tier | Price | Generations/Month | Features |
|------|-------|------------------|----------|
| Free | $0 | 25 | All core Composer + VCM features |
| Pro | $9.99 | Unlimited | + Advanced export, early access to beta |
| Studio | $49.99 | Unlimited | + Team collaboration, white-label API, custom branding |
| Enterprise | Custom | Custom | + SLA, dedicated support, onboarding |

### Revenue Streams

1. **Subscription**: Primary (MRR target: $50K/month @ 10K Pro users)
2. **Marketplace** (Version 3): Sell preset packs, drum kits, chord charts (30% rev share)
3. **API Usage** (Version 3): Per-request billing for developers ($0.01/generation)
4. **White-Label** (Studio tier): Custom branding, embed in partners' apps

---

## 30. Competitive Analysis

| Competitor | Strength | Weakness | R3 Advantage |
|-----------|----------|----------|--------------|
| Suno | Full audio generation | No editing; copyright unclear | MIDI export; performance grid |
| Udio | Good audio quality | Same as Suno | Grid control; offline |
| FL Studio | Industry-standard DAW | Requires purchase; desktop-only | Browser-based; zero cost |
| Ableton | Highly customizable | Expensive ($99); steep learning curve | Free tier; AI-assisted |
| AIVA | AI composition | Output quality; limited editing | Interactive performance |
| Orb Producer | Chord suggestion | No full generation; UI friction | Integrated end-to-end |

**R3's Market Position:**
- Only tool with **interactive performance grid + AI generation + MIDI export**
- Only tool with **offline-first + real-time collaboration**
- Zero hardware requirement (vs. Push/Maschine)
- Zero software purchase required (vs. FL/Ableton)
- Emerging market pricing (free tier)

---

## 31. Release Scope

### Phase 1 (Weeks 1–8): Intelligent Composer

**Deliverables:**
- ✅ Core Composer with 5 agents (harmony, melody, bass, drums, arrangement)
- ✅ MIDI export
- ✅ Project management (save/load/version)
- ✅ Producer Copilot (feedback)
- ✅ Composition analysis

**Not Included:**
- ❌ VCM grid (Phase 2)
- ❌ Real-time collaboration (Version 3)
- ❌ Offline support (Phase 2)
- ❌ Audio rendering (Version 4)

### Phase 2 (Weeks 9–12): Virtual Composer Machine

**Deliverables:**
- ✅ 8×8 grid with <10ms latency
- ✅ 6 grid modes (Piano, Chord, Scale, Drum, Sequencer, Session)
- ✅ Smart Touch Encoders
- ✅ Timeline engine
- ✅ AI Performance & Jam modes
- ✅ MIDI I/O
- ✅ Service Worker + offline support
- ✅ Rate limiting & quotas

**Not Included:**
- ❌ Collaboration (Version 3)
- ❌ Mobile app (Version 3)
- ❌ Audio stem rendering (Version 4)

---

## 32. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| AI inference latency exceeds 10s | Blocks user workflow | Medium | Fallback engine; local inference |
| WebAudio latency >10ms on Safari | Unusable on iOS | High | Documented limitation; fallback UI |
| CRDT merge complexity | Collaboration bugs | Medium | Thorough testing; staged rollout |
| Service Worker sync failures | Data loss | Low | Comprehensive retry logic; audit log |
| Zod schema validation performance | Blocking UI | Low | Lazy validation; async parsing |
| Inference queue backlog | User wait time | Medium | Auto-scaling; priority queue |
| Hardware MIDI compatibility issues | Limited MIDI I/O | Medium | Test with 5+ controllers; docs |
| Browser security sandbox | Can't export files | Low | Use `download` attribute; pre-signed S3 URLs |

---

## 33. Definition of Done

### Phase 1 Complete When

- [ ] All FR-001 through FR-010 acceptance criteria pass
- [ ] Copilot provides feedback <2s in 95% of cases
- [ ] Composition success rate ≥80% (valid, playable arrangements)
- [ ] MIDI export valid in Ableton, FL Studio, Logic, Studio One
- [ ] Test coverage ≥80% (unit + integration)
- [ ] TypeScript: `tsc --noEmit` passes; no implicit `any`
- [ ] Security review: zero Critical, zero High findings
- [ ] Performance: P95 generation ≤10s at 100 concurrent users
- [ ] 5 beta users complete prompt → generate → export workflow independently
- [ ] Documentation: API reference, user guide, deployment runbook complete
- [ ] Monitoring enabled for all P0/P1 metrics

### Phase 2 Complete When

- [ ] All FR-011 through FR-018 acceptance criteria pass
- [ ] Grid renders ≥120 FPS on reference machine (i5/8GB/Chrome 120+)
- [ ] Pad-to-audio latency P95 <10ms (measured on same machine)
- [ ] All 6 grid modes tested on Chrome, Firefox, Safari (latest 2 versions)
- [ ] MIDI input/output validated with Ableton Push, Maschine, LaunchPad, generic controller
- [ ] AI Jam Mode response <200ms (P95)
- [ ] Service Worker sync validated offline → online with no data loss
- [ ] Rate limiting enforces Free/Pro/Studio quotas correctly
- [ ] Composition versioning: undo/redo works; all versions recoverable
- [ ] 5 additional beta users complete full VCM workflow (jam → record → arrange → export)
- [ ] Web Audio latency warning displays on Safari; no hard crashes

---

## 34. Future Roadmap

### Version 2 — Expanded Intelligence (Months 4–9)

- Voice-to-MIDI (hum/sing → MIDI notes)
- Style learning (Copilot learns user's genre/style over time)
- Genre-specific arrangement templates
- Stem separation (import external audio)
- Mobile-optimized VCM
- Personalized composition memory

### Version 3 — Social & Ecosystem (Months 10–18)

- Real-time collaboration (multi-user VCM sessions)
- Marketplace (sell/buy presets, drum kits, chord sets)
- VST/AU plugin wrapper (embed R3 in DAWs)
- iOS & Android apps (native touch; haptic feedback)
- Export to Ableton Live (.als) and FL Studio (.flp)
- Multi-agent orchestration (autonomous jam sessions)

### Version 4 — Audio Layer (Months 18–30)

- Audio rendering (export as .wav/.mp3)
- Stem export per instrument
- AI mixing (level balancing, EQ, compression)
- Vocal processing (pitch correction, de-essing, reverb)
- Sample import (drag .wav files onto drum pads)

### Version 5 — Music Operating System (Year 3+)

- Personalized composer models (trained on user's history)
- Autonomous agent ecosystem (multi-agent jam sessions)
- Ableton Link integration (sync with external devices)
- Live streaming (broadcast VCM performance to Twitch/YouTube)
- R3 as full Music OS (replace DAW + hardware + distribution)

---

## 35. Appendix A — Grid Mode Reference

### Piano Mode (8×8 Chromatic)

```
Row 8: C6  D6  E6  F6  G6  A6  B6  C7
Row 7: F5  G5  A5  B♭5 C6  D6  E6  F6
Row 6: C5  D5  E5  F5  G5  A5  B5  C6
Row 5: G4  A4  B4  C5  D5  E5  F5  G5
Row 4: C4  D4  E4  F4  G4  A4  B4  C5
Row 3: G3  A3  B3  C4  D4  E4  F4  G4
Row 2: C3  D3  E3  F3  G3  A3  B3  C4
Row 1: G2  A2  B2  C3  D3  E3  F3  G3
```

Colors: White keys = light gray; Black keys = dark gray; Active = accent color pulse

### Chord Mode (Key-Dependent)

```
// Default: C Major
Row 8: Cmaj9  Dm9    Em7   Fmaj9  G9     Am9    Bm7♭5  Cmaj7
Row 7: Csus2  Dsus2  Esus4 Fsus2  Gsus4  Asus2  Bsus4  Csus4
Row 6: C6     Dm6    Em    Fmaj7  G7     Am7    Bdim   Cadd9
Row 5: Cmaj   Dm     Em    Fmaj   Gmaj   Am     Bdim   Cmaj (oct)

// Adjusts automatically when key changes to G Major:
Row 8: Gmaj9  Am9    Bm7   Cmaj9  D9     Em9    F♯m7♭5 Gmaj7
...
```

### Drum Rack Mode (16 Pads)

```
Row 2: Open HH | Ride    | Crash  | Perc1  | Perc2  | Perc3  | Tom1   | Tom2
Row 1: Kick    | Snare   | Cl.HH  | Clap   | Rim    | Cowbel | Shaker | Tamb
```

Banks 2–4 (rows 3–8) extend to 64 assignable drum slots.

### Scale Mode (Adjusts with Key)

```
// C Major scale: C D E F G A B
Disabled pads: C♯, D♯, F♯, G♯, A♯
Enabled pads: C, D, E, F, G, A, B

// E Dorian scale: E F♯ G A B C♯ D
Enabled pads: E, F♯, G, A, B, C♯, D
Disabled pads: C, D♯, F, G♯
```

### Sequencer Mode (16-Step)

```
Row 8: Melody   (16 steps, Ch. 1, current scale)
Row 7: Hook     (16 steps, Ch. 1)
Row 6: Bass     (16 steps, Ch. 3)
Row 5: Chord    (16 steps, Ch. 2)
Row 4: Kick     (16 steps, Ch. 10)
Row 3: Snare    (16 steps, Ch. 10)
Row 2: Hi-Hat   (16 steps, Ch. 10)
Row 1: Open HH  (16 steps, Ch. 10)

Playhead advances left-to-right (illuminated green).
Active steps: accent color. Inactive: dim.
```

---

## 36. Appendix B — Complete Agent Output Schemas

### HarmonyResultSchema (Chord Progression)

```typescript
import { z } from 'zod';

export const ChordSchema = z.object({
  root: z.enum([
    'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'
  ]),
  type: z.enum([
    'maj', 'min', 'maj7', 'min7', '7', 'maj9', 'min9', 'sus2', 'sus4', 'dim', 'aug', 'maj7♯11'
  ]),
  inversion: z.enum(['root', 'first', 'second']).optional(),
  voicing: z.enum(['close', 'wide', 'rootless']).optional(),
  durationBeats: z.number().int().min(1).max(8),
});

export const HarmonyResultSchema = z.object({
  schemaVersion: z.literal(1),
  key: z.string(),
  chords: z.array(ChordSchema).min(1).max(8),
  analysis: z.object({
    romanNumerals: z.array(z.string()), // e.g., ["I", "V", "vi", "IV"]
    functions: z.array(z.enum(['tonic', 'dominant', 'subdominant'])),
    voiceLeadingQuality: z.number().min(0).max(100), // 0–100 score
    commonHarmonyPattern: z.string().optional(),
  }),
  confidence: z.number().min(0).max(1),
});
```

### MelodyResultSchema (Melody Notes)

```typescript
export const MelodyNoteSchema = z.object({
  pitchClass: z.number().int().min(0).max(11), // 0 = C, 1 = C♯, etc.
  octave: z.number().int().min(1).max(8),
  durationBeats: z.number().positive(),
  velocity: z.number().int().min(1).max(127),
  isRest: z.boolean().default(false),
});

export const MelodyResultSchema = z.object({
  schemaVersion: z.literal(1),
  name: z.enum(['melody', 'hook']),
  key: z.string(),
  scale: z.string(), // 'major', 'minor', 'dorian', etc.
  notes: z.array(MelodyNoteSchema).min(1),
  analysis: z.object({
    contour: z.enum(['ascending', 'descending', 'arch', 'valley']),
    intervalMean: z.number(), // Average interval
    leapsCount: z.number(), // Number of intervals >5 semitones
    restRatio: z.number().min(0).max(1), // % of time resting
  }),
  confidence: z.number().min(0).max(1),
});
```

### BassResultSchema (Bass Line)

```typescript
export const BassResultSchema = z.object({
  schemaVersion: z.literal(1),
  style: z.enum(['rootMotion', 'melodic', 'synth', 'electronic']),
  energy: z.enum(['sparse', 'groovy', 'locked']),
  notes: z.array(MelodyNoteSchema),
  analysis: z.object({
    rootMotionQuality: z.number().min(0).max(100),
    polyrhythmicComplexity: z.number().min(0).max(100),
  }),
  confidence: z.number().min(0).max(1),
});
```

### DrumPatternSchema (Drum Patterns)

```typescript
export const DrumHitSchema = z.object({
  drumType: z.enum([
    'kick', 'snare', 'clap', 'hiHat', 'openHiHat', 'tom1', 'tom2', 'tom3',
    'ride', 'crash', 'cowbell', 'shaker', 'perc1', 'perc2'
  ]),
  beatPosition: z.number().min(0).max(3.9375), // 16th-note granularity
  velocity: z.number().int().min(40).max(127),
  duration: z.enum(['click', 'short', 'medium', 'long']),
});

export const DrumPatternSchema = z.object({
  schemaVersion: z.literal(1),
  bpm: z.number().int().min(60).max(200),
  swing: z.number().min(0).max(100), // 0 = straight, 100 = max swing
  humanization: z.number().min(0).max(100), // Timing variation
  hits: z.array(DrumHitSchema),
  analysis: z.object({
    groove: z.enum(['4onfloor', 'swung', 'syncopated', 'minimal']),
    complexity: z.number().min(1).max(10),
    fillPattern: z.boolean(),
  }),
  confidence: z.number().min(0).max(1),
});
```

### ArrangementSchema (Arrangement Structure)

```typescript
export const SectionSchema = z.object({
  type: z.enum(['intro', 'verse', 'hook', 'bridge', 'outro']),
  barCount: z.number().int().min(1).max(32),
  energyLevel: z.number().min(0).max(100),
  instruments: z.array(z.enum(['melody', 'chords', 'bass', 'drums', 'pads'])),
  arrangement: z.object({
    melodyContinues: z.boolean(),
    bassAdded: z.boolean(),
    drumsAdded: z.boolean(),
    drumFillPresent: z.boolean(),
  }),
});

export const ArrangementSchema = z.object({
  schemaVersion: z.literal(1),
  totalDuration: z.object({
    bars: z.number().int(),
    seconds: z.number(),
  }),
  sections: z.array(SectionSchema).min(3).max(10),
  energyCurve: z.array(z.number().min(0).max(100)),
  analysis: z.object({
    structurePattern: z.string(), // 'pop', 'edm', 'classical', etc.
    repetitionRatio: z.number().min(0).max(1),
    noveltyRatio: z.number().min(0).max(1),
  }),
  confidence: z.number().min(0).max(1),
});
```

### CompositionSchema (Full Composition)

```typescript
export const CompositionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1).max(255),
  key: z.string(),
  bpm: z.number().int().min(60).max(200),
  timeSignature: z.enum(['4/4', '3/4', '6/8', '2/4']),
  genre: z.string().optional(),
  
  // Composition content
  harmony: HarmonyResultSchema,
  melodies: z.array(MelodyResultSchema).min(1),
  bass: BassResultSchema,
  drums: DrumPatternSchema,
  arrangement: ArrangementSchema,
  
  // Metadata
  schemaVersion: z.literal(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable().optional(),
});
```

---

## 37. Appendix C — Latency Budget Breakdown

### End-to-End: Prompt to Playable Composition (<10s total)

| Component | Budget | Description | Notes |
|-----------|--------|-------------|-------|
| **User Input → Backend** | 100ms | Network latency + JSON serialization | Typical: 50–150ms |
| **Backend Validation** | 50ms | Input schema check | Zod validation |
| **AI Inference Dispatch** | 100ms | Queue + request setup | Parallel agent calls |
| **Harmony Agent** | 6000ms | Chord progression generation | If timeout >8s, use fallback |
| **Melody Agent** | 5000ms | Melody generation | Parallel; max 6s |
| **Drum Agent** | 4000ms | Drum pattern generation | Parallel; max 4s |
| **Bass Agent** | 4000ms | Bass line generation | Parallel; max 5s |
| **Arrangement Agent** | 8000ms | Section arrangement | Sequential after other agents |
| **Schema Validation** | 100ms | Zod validation of outputs | All agent outputs validated |
| **Response Serialization** | 50ms | JSON stringify + compression | Gzip compression |
| **Backend → Client** | 100ms | Network latency | Typical: 50–150ms |
| **Client Parsing** | 50ms | JSON parse + state update | IndexedDB write |
| **Grid Rendering** | 50ms | React re-render + Canvas draw | Next frame |
| **Audio Initialization** | 100ms | AudioContext scheduling | Pre-warmed reduces to 10ms |
| **TOTAL (Parallel Agents)** | **~8.5s** | Critical path: Arrangement Agent | P95: 10s (timeout fallback) |

### Pad Press to Audio (Real-Time Latency)

| Component | Budget | Description |
|-----------|--------|-------------|
| Touch/click event | 2ms | OS dispatch latency |
| JS event handler | 1ms | React event delegation |
| MIDI note-on generation | 1ms | In-memory operation |
| WebAudio scheduling | 3ms | AudioContext.currentTime + scheduling |
| Oscillator start | 2ms | Audio buffer ahead scheduling |
| Browser audio processing | 3ms | ~1024 samples @ 48kHz ≈ 21ms hop, but we target <10ms |
| Speaker output | <1ms | Negligible |
| **TOTAL** | **~10ms** | P95 target; typical 5–8ms |

### Grid Rendering (Frame Time Budget)

| Component | Budget | 120 FPS Target |
|-----------|--------|-----------------|
| Input polling (mouse/touch) | 1ms | Sub-frame |
| State update (Zustand) | 2ms | Fast; in-memory |
| Component render (React) | 2ms | Minimal re-renders |
| Canvas drawing | 3ms | 64 pads + playhead |
| **Frame Time** | **~8.3ms** | 1000ms ÷ 120 FPS |

---

## 38. Appendix D — Service Timeout Strategy

### Timeout Thresholds

| Service | Timeout | Fallback | Action |
|---------|---------|----------|--------|
| Harmony Agent | 8s | Deterministic progression (I-V-vi-IV) | Log timeout; alert if >5% |
| Melody Agent | 6s | Pentatonic scale arpeggio | Log timeout; alert if >5% |
| Drum Agent | 4s | 4-on-floor kick + snare | Log timeout; alert if >10% |
| Bass Agent | 5s | Root-motion bass | Log timeout; alert if >10% |
| Arrangement Agent | 10s | Standard 8/8/8/4/4 structure | Log timeout; alert if >3% |
| Copilot Feedback | 2s | Silent (no feedback) | No alert; acceptable latency |
| Database Query | 2s | Cached value (if available) | Alert if >20% queries timeout |
| Export (MIDI) | 30s | Partial export (first 100 bars) | User notification + retry |

### Fallback Composition (Details)

**Harmony Fallback:**
```typescript
const fallbackHarmony = [
  { root: 'C', type: 'maj7', durationBeats: 4 },
  { root: 'G', type: '7', durationBeats: 4 },
  { root: 'A', type: 'min7', durationBeats: 4 },
  { root: 'F', type: 'maj7', durationBeats: 4 }
];
```

**Melody Fallback:**
```typescript
// Pentatonic arpeggio in current key
const fallbackMelody = [
  { pitchClass: 0, octave: 4, durationBeats: 1, velocity: 80 },  // C
  { pitchClass: 2, octave: 4, durationBeats: 1, velocity: 80 },  // D
  { pitchClass: 4, octave: 4, durationBeats: 1, velocity: 80 },  // E
  { pitchClass: 7, octave: 4, durationBeats: 1, velocity: 80 },  // G
  { pitchClass: 9, octave: 4, durationBeats: 1, velocity: 80 },  // A
  { pitchClass: 0, octave: 5, durationBeats: 2, velocity: 90 }   // C (octave up)
];
```

**Arrangement Fallback:**
```typescript
const fallbackArrangement = {
  sections: [
    { type: 'intro', barCount: 8, energyLevel: 20, instruments: ['kick', 'bass'] },
    { type: 'verse', barCount: 8, energyLevel: 50, instruments: ['melody', 'bass', 'drums'] },
    { type: 'hook', barCount: 8, energyLevel: 80, instruments: ['melody', 'chords', 'bass', 'drums'] },
    { type: 'outro', barCount: 4, energyLevel: 10, instruments: ['kick'] }
  ]
};
```

---

## 39. Appendix E — Browser Compatibility Matrix

### Supported Platforms

| Browser | Min Version | WebAudio | MIDI | Service Worker | IndexedDB |
|---------|-------------|----------|------|-----------------|-----------|
| Chrome | 120 | ✅ | ✅ | ✅ | ✅ |
| Firefox | 115 | ✅ | ⚠️ (limited) | ✅ | ✅ |
| Safari | 17 | ✅ | ❌ | ✅ | ✅ |
| Edge | 120 | ✅ | ✅ | ✅ | ✅ |
| Opera | 106 | ✅ | ✅ | ✅ | ✅ |

### Known Limitations

| Platform | Issue | Workaround |
|----------|-------|-----------|
| Safari 17+ | WebAudio latency 30–50ms (not <10ms) | Documented in UI; fallback message |
| Firefox | Web MIDI API not supported | MIDI I/O disabled; alert shown |
| iOS Safari | AudioContext requires user gesture | Auto-play policy enforced |
| Android Firefox | Reduced performance on budget devices | Graceful degradation; lower FPS |

### Feature Flags

```typescript
const BROWSER_CAPABILITIES = {
  webAudio: supported && minimumVersion,
  webMidi: supported && !isFirefox && !isSafari,
  serviceWorker: supported && isSecureContext,
  indexedDB: supported && isSecureContext,
  canvas: supported,
  webWorkers: supported,
  audioWorklet: supported && Chrome >= 120,
};

// Usage
if (!BROWSER_CAPABILITIES.webMidi) {
  showAlert('Web MIDI not supported on this browser. MIDI input/output disabled.');
  disableMIDIFeature();
}
```

---

## Final Notes

This PRD v3.0 represents a complete, production-ready specification for R3 Intelligent Composer + VCM, incorporating:

✅ **Comprehensive coverage** of all user requirements  
✅ **Gap analysis** addressing offline support, rate limiting, error handling, monitoring  
✅ **Expert engineering** with latency budgets, fallback strategies, observability  
✅ **Real-world architecture** with scalability, security, and reliability built-in  
✅ **Complete schemas** for all data structures  
✅ **Clear success criteria** with measurable KPIs and DoD  

**Next Steps:**
1. Review with stakeholders (Product, Engineering, Design)
2. Identify any remaining gaps
3. Create detailed sprint plans for Phase 1 (Weeks 1–8)
4. Begin development with this spec as the source of truth

---

**Status:** ✅ Ready for Implementation  
**Last Updated:** June 21, 2026  
**Maintained By:** V4 + Engineering Audit Team
