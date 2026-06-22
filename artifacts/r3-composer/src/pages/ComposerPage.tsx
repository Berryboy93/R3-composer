import { useState, useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Headphones, BarChart2, Monitor, Menu, Lock, Unlock,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Square, Triangle, Plus, Minus, Trash2, Sparkles,
  Music, Download, MessageSquare, RefreshCw, FolderOpen, Save,
  X, Loader2, AlertCircle, CheckCircle2
} from 'lucide-react';
import {
  useGetComposerSession,
  getGetComposerSessionQueryKey,
  useUpdateComposerSession,
  useListComposerPatterns,
  getListComposerPatternsQueryKey,
  useCreateComposerPattern,
  useDeleteComposerPattern,
  useActivateComposerPattern,
  useGenerateComposition,
  useRegenerateComposition,
  useAnalyzeComposition,
  useGetSuggestions,
  useExportMidi,
  useListProjects,
  useCreateProject,
} from '@workspace/api-client-react';

const PURPLE_PADS = new Set([0, 7, 19, 27, 49, 56, 60, 62]);
const BLUE_PADS   = new Set([37, 55, 63]);

const TRACKS = [
  { name: 'Drums',  color: '#e8960e', clips: [0.9, 0.6, 0.85, 0.4, 0.7] },
  { name: 'Bass',   color: '#cc3218', clips: [0.5, 0.9, 0.3, 0.75, 0.6] },
  { name: 'Keys',   color: '#28b83a', clips: [0.7, 0.45, 0.9, 0.55, 0.8] },
  { name: 'Pads',   color: '#18b8b8', clips: [0.85, 0.7, 0.5, 0.9, 0.35] },
  { name: 'Vocal',  color: '#28b83a', clips: [0.4, 0.6, 0.75, 0.5, 0.9] },
  { name: 'Guitar', color: '#777',    clips: [0.3, 0.7, 0.5, 0.4, 0.6] },
  { name: 'FX',     color: '#b8a810', clips: [0.6, 0.8, 0.4, 0.7, 0.55] },
  { name: 'Master', color: '#9028c0', clips: [0.95, 0.7, 0.85, 0.6, 0.9] },
];

const QUANTIZE = ['1/32', '1/16t', '1/16', '1/8t', '1/8', '1/4t', '1/4', '1/2', '1 Bar'];

const FUNC_BTNS: [string, string][] = [
  ['Select', ''],
  ['Scale', 'Layout'],
  ['Repeat', 'Accent'],
  ['D.Loop', 'Duplicate'],
  ['Convert', 'Delete'],
  ['Octave ↑', ''],
  ['Octave ↓', ''],
  ['Shift', 'Settings'],
];

const GENRES = ['Hip-Hop', 'Lo-Fi', 'Trap', 'House', 'Ambient', 'Jazz', 'R&B', 'Pop', 'Drill', 'Afrobeats'];
const MOODS  = ['Chill', 'Dark', 'Euphoric', 'Melancholic', 'Aggressive', 'Uplifting', 'Mysterious', 'Romantic'];

const BODY_BG     = '#1e1e1e';
const BTN_BG      = '#2c2c2e';
const BTN_BORDER  = 'rgba(255,255,255,0.11)';
const BTN_COLOR   = '#b8b8be';
const SCREEN_BG   = '#070710';
const PANEL_BG    = '#131316';

type ActivePanel = 'none' | 'ai' | 'copilot' | 'projects' | 'patterns';

interface CompositionData {
  id: string;
  key: string;
  bpm: number;
  genre: string;
  mood: string;
  prompt: string;
  harmony: { chords?: Array<{ symbol: string; romanNumeral: string }> };
  styleMatch: number;
  lowConfidence?: boolean;
}

/* ─── Sub-components ───────────────────────────────────────────────────────── */

function Knob({ offset = 0 }: { offset?: number }) {
  return (
    <div style={{
      width: 44, height: 44, borderRadius: '50%', position: 'relative',
      background: 'radial-gradient(circle at 37% 33%, #393939, #101010)',
      boxShadow: '0 5px 12px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.6)',
      border: '1px solid rgba(255,255,255,0.07)',
      flexShrink: 0,
    }}>
      <div style={{
        width: 2, height: 9, borderRadius: 2,
        background: 'linear-gradient(to bottom, #e0e0e0, #aaa)',
        position: 'absolute', top: 4, left: '50%',
        transform: `translateX(-50%) rotate(${offset}deg)`,
        transformOrigin: '50% 100%',
      }} />
      <div style={{
        width: 16, height: 16, borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 40%, #2a2a2a, #0e0e0e)',
        border: '1px solid rgba(255,255,255,0.06)',
        position: 'absolute', inset: 0, margin: 'auto',
      }} />
    </div>
  );
}

function JogWheel() {
  return (
    <div style={{
      width: 78, height: 78, borderRadius: '50%', position: 'relative',
      background: 'radial-gradient(circle at 38% 35%, #2e2e30, #0a0a0c)',
      border: '2px solid rgba(255,255,255,0.09)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -2px 4px rgba(0,0,0,0.5)',
    }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', width: 3, height: 6, borderRadius: 2,
          background: 'rgba(255,255,255,0.06)',
          top: '50%', left: '50%',
          transformOrigin: '0 -31px',
          transform: `rotate(${i * 30}deg) translateX(-1.5px)`,
        }} />
      ))}
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 38%, #232325, #0d0d0f)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
        position: 'absolute', inset: 0, margin: 'auto',
      }} />
    </div>
  );
}

function SmallBtn({ children, style = {}, onClick, active }: { children: React.ReactNode, style?: React.CSSProperties, onClick?: () => void, active?: boolean }) {
  return (
    <button onClick={onClick} style={{
      background: active ? 'rgba(162,34,255,0.2)' : BTN_BG,
      border: `1px solid ${active ? 'rgba(162,34,255,0.5)' : BTN_BORDER}`,
      color: active ? '#cc6eff' : BTN_COLOR,
      fontSize: 11,
      borderRadius: 5,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px 9px',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 3px rgba(0,0,0,0.5)',
      ...style,
    }}>{children}</button>
  );
}

function SideBtn({
  children, color, style = {}, onClick, active
}: { children: React.ReactNode; color?: string; style?: React.CSSProperties; onClick?: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} style={{
      background: active ? '#252540' : '#252527',
      border: `1px solid ${active ? 'rgba(100,100,255,0.3)' : BTN_BORDER}`,
      color: color || BTN_COLOR,
      fontSize: 11,
      fontWeight: 500,
      borderRadius: 5,
      cursor: 'pointer',
      padding: '5px 7px',
      display: 'flex',
      alignItems: 'center',
      textAlign: 'left',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.45)',
      whiteSpace: 'nowrap',
      ...style,
    }}>{children}</button>
  );
}

function Led({ color }: { color: string }) {
  return (
    <span style={{
      width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginRight: 7,
      background: color,
      boxShadow: `0 0 5px ${color}, 0 0 10px ${color}55`,
      display: 'inline-block',
    }} />
  );
}

function Screen({ bpm, composition }: { bpm: number; composition: CompositionData | null }) {
  const chords = composition?.harmony?.chords ?? [];
  return (
    <div style={{
      background: SCREEN_BG,
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 5,
      padding: '6px 8px 5px',
      flex: 1,
      overflow: 'hidden',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,0,0,0.4)',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: 6, right: 8, color: '#e8960e', fontSize: 10, fontFamily: 'monospace', opacity: 0.8 }}>
        {bpm} BPM
      </div>
      {composition ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 4 }}>
          {/* Composition info row */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: '#cc6eff', fontSize: 10, fontFamily: 'monospace', fontWeight: 700 }}>
              {composition.key}
            </span>
            <span style={{ color: '#28b83a', fontSize: 9, fontFamily: 'monospace' }}>
              {composition.genre}
            </span>
            <span style={{ color: '#18b8b8', fontSize: 9, fontFamily: 'monospace' }}>
              {composition.mood}
            </span>
            <span style={{ color: '#e8960e', fontSize: 9, fontFamily: 'monospace', marginLeft: 'auto', marginRight: 60 }}>
              {Math.round((composition.styleMatch ?? 0) * 100)}% match
            </span>
          </div>
          {/* Chord progression */}
          {chords.length > 0 && (
            <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {chords.slice(0, 8).map((c: { symbol: string; romanNumeral: string }, i: number) => (
                <div key={i} style={{
                  background: 'rgba(162,34,255,0.15)',
                  border: '1px solid rgba(162,34,255,0.3)',
                  borderRadius: 3, padding: '2px 5px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}>
                  <span style={{ color: '#cc6eff', fontSize: 10, fontFamily: 'monospace', fontWeight: 700 }}>{c.symbol}</span>
                  <span style={{ color: '#888', fontSize: 8, fontFamily: 'monospace' }}>{c.romanNumeral}</span>
                </div>
              ))}
            </div>
          )}
          {/* Prompt text */}
          <div style={{ color: '#555', fontSize: 9, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {composition.prompt}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 3, height: 68, marginBottom: 5 }}>
          {TRACKS.map((t, ti) => (
            <div key={ti} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{
                color: t.color, fontSize: 9, fontWeight: 700,
                fontFamily: 'monospace', letterSpacing: 0.3,
                textShadow: `0 0 6px ${t.color}88`,
              }}>{t.name}</div>
              {[0, 1].map(row => (
                <div key={row} style={{
                  flex: 1, background: 'rgba(255,255,255,0.03)',
                  borderRadius: 2, overflow: 'hidden', position: 'relative',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}>
                  {t.clips.slice(0, row === 0 ? 3 : 2).map((w, ci) => (
                    <div key={ci} style={{
                      position: 'absolute',
                      top: 1, bottom: 1,
                      left: ci === 0 ? 1 : `${ci * 32 + 2}%`,
                      width: `${w * 28}%`,
                      background: t.color,
                      opacity: row === 0 ? 0.85 : 0.55,
                      borderRadius: 1,
                      boxShadow: `0 0 4px ${t.color}66`,
                    }} />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingTop: 4,
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'monospace',
        fontSize: 8.5,
        color: '#666',
        letterSpacing: 0.2,
      }}>
        {['Filter /⋀', 'Freq: 22.0kHz', 'Res: 0.71', 'Drive: 32%', 'LFO Amt: 23%', 'Rate: 1/8', 'Vol: 0.0dB'].map((p, i) => (
          <span key={i} style={{ color: i === 0 ? '#e8960e' : '#666' }}>{p}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────────── */

export default function ComposerPage() {
  const queryClient = useQueryClient();
  const { data: session, isLoading: isSessionLoading } = useGetComposerSession();
  const updateSession = useUpdateComposerSession();
  const { data: patterns = [] } = useListComposerPatterns();
  const createPattern = useCreateComposerPattern();
  const deletePattern = useDeleteComposerPattern();
  const activatePattern = useActivateComposerPattern();

  // AI hooks
  const generateComposition = useGenerateComposition();
  const regenerateComposition = useRegenerateComposition();
  const analyzeComposition = useAnalyzeComposition();
  const getSuggestions = useGetSuggestions();
  const exportMidi = useExportMidi();
  const { data: projects = [] } = useListProjects();
  const createProject = useCreateProject();

  // Grid state
  const [activePads, setActivePads] = useState<Set<number>>(new Set(PURPLE_PADS));
  const [bluePads, setBluePads]     = useState<Set<number>>(new Set(BLUE_PADS));
  const [selectedQ, setSelectedQ]   = useState('1/16');
  const [bpm, setBpm]               = useState(120);
  const [playing, setPlaying]       = useState(false);
  const [showSavedFlash, setShowSavedFlash] = useState(false);

  // Panel state
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  const [showPatterns, setShowPatterns] = useState(false);
  const [newPatternName, setNewPatternName] = useState('');
  const [isSavingPattern, setIsSavingPattern] = useState(false);

  // AI state
  const [composition, setComposition] = useState<CompositionData | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenre, setAiGenre] = useState('Hip-Hop');
  const [aiMood, setAiMood] = useState('Chill');
  const [aiBpm, setAiBpm] = useState<number | ''>('');
  const [aiKey, setAiKey] = useState('');
  const [lockHarmony, setLockHarmony] = useState(false);
  const [lockMelody, setLockMelody] = useState(false);
  const [lockRhythm, setLockRhythm] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Copilot state
  const [copilotQuestion, setCopilotQuestion] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([]);
  const [analysis, setAnalysis] = useState<{
    overallScore: number;
    dimensionScores: { melody: number; harmony: number; rhythm: number; structure: number };
    recommendations: Array<{ dimension: string; severity: string; message: string }>;
    styleMatch: number;
  } | null>(null);

  // Projects state
  const [newProjectName, setNewProjectName] = useState('');
  const [projectSaveStatus, setProjectSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const initRef = useRef<number | null>(null);
  const lastSavedRef = useRef({ bpm: 120, quantize: '1/16', activePads: Array.from(PURPLE_PADS), bluePads: Array.from(BLUE_PADS) });
  const updateMutateRef = useRef(updateSession.mutate);
  updateMutateRef.current = updateSession.mutate;

  // Init state from session
  useEffect(() => {
    if (session && initRef.current !== session.id) {
      initRef.current = session.id;
      setActivePads(new Set(session.activePads));
      setBluePads(new Set(session.bluePads));
      setSelectedQ(session.quantize);
      setBpm(session.bpm);
      lastSavedRef.current = {
        bpm: session.bpm,
        quantize: session.quantize,
        activePads: session.activePads,
        bluePads: session.bluePads
      };
    }
  }, [session]);

  // Debounced auto-save
  useEffect(() => {
    if (!initRef.current) return;
    const currentActive = Array.from(activePads);
    const currentBlue = Array.from(bluePads);
    const hasChanged =
      bpm !== lastSavedRef.current.bpm ||
      selectedQ !== lastSavedRef.current.quantize ||
      JSON.stringify(currentActive) !== JSON.stringify(lastSavedRef.current.activePads) ||
      JSON.stringify(currentBlue) !== JSON.stringify(lastSavedRef.current.bluePads);

    if (hasChanged) {
      const timer = setTimeout(() => {
        updateMutateRef.current({
          data: { bpm, quantize: selectedQ, activePads: currentActive, bluePads: currentBlue }
        }, {
          onSuccess: (updatedData) => {
            lastSavedRef.current = {
              bpm: updatedData.bpm, quantize: updatedData.quantize,
              activePads: updatedData.activePads, bluePads: updatedData.bluePads
            };
            queryClient.setQueryData(getGetComposerSessionQueryKey(), updatedData);
            setShowSavedFlash(true);
            setTimeout(() => setShowSavedFlash(false), 800);
          }
        });
      }, 800);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [bpm, selectedQ, activePads, bluePads, queryClient]);

  const togglePad = (i: number) => {
    if (bluePads.has(i)) {
      setBluePads(s => { const n = new Set(s); n.delete(i); return n; });
    } else if (activePads.has(i)) {
      setActivePads(s => { const n = new Set(s); n.delete(i); return n; });
    } else {
      setActivePads(s => new Set(s).add(i));
    }
  };

  const togglePanel = (panel: ActivePanel) => {
    setActivePanel(p => p === panel ? 'none' : panel);
  };

  // ── AI Generate ──
  const handleGenerate = useCallback(() => {
    if (!aiPrompt.trim()) return;
    setAiError(null);
    generateComposition.mutate({
      data: {
        prompt: aiPrompt,
        genre: aiGenre,
        mood: aiMood,
        ...(aiBpm !== '' && { bpm: Number(aiBpm) }),
        ...(aiKey && { key: aiKey }),
      }
    }, {
      onSuccess: (data) => {
        const comp = data.composition as unknown as CompositionData;
        setComposition(comp);
        setBpm(comp.bpm);
        if (data.lowConfidence) {
          setAiError('Low confidence: the style match is below 65%. Try a more specific prompt.');
        }
      },
      onError: (err: unknown) => {
        const e = err as { response?: { data?: { error?: { message?: string } } } };
        setAiError(e?.response?.data?.error?.message ?? 'Generation failed. Please try again.');
      }
    });
  }, [aiPrompt, aiGenre, aiMood, aiBpm, aiKey, generateComposition]);

  const handleRegenerate = useCallback(() => {
    if (!composition) return;
    setAiError(null);
    regenerateComposition.mutate({
      data: {
        compositionId: composition.id,
        keepHarmony: lockHarmony,
        keepMelody: lockMelody,
        keepRhythm: lockRhythm,
      }
    }, {
      onSuccess: (data) => {
        const comp = data.composition as unknown as CompositionData;
        setComposition(comp);
        setBpm(comp.bpm);
      },
      onError: (err: unknown) => {
        const e = err as { response?: { data?: { error?: { message?: string } } } };
        setAiError(e?.response?.data?.error?.message ?? 'Regeneration failed.');
      }
    });
  }, [composition, lockHarmony, lockMelody, lockRhythm, regenerateComposition]);

  // ── Copilot ──
  const handleAnalyze = useCallback(() => {
    if (!composition) return;
    analyzeComposition.mutate({
      data: { compositionId: composition.id }
    }, {
      onSuccess: (data) => {
        setAnalysis(data.analysis as typeof analysis);
        setActivePanel('copilot');
      }
    });
  }, [composition, analyzeComposition]);

  const handleAskCopilot = useCallback(() => {
    if (!composition || !copilotQuestion.trim()) return;
    const q = copilotQuestion.trim();
    setCopilotMessages(m => [...m, { role: 'user', content: q }]);
    setCopilotQuestion('');
    getSuggestions.mutate({
      data: { compositionId: composition.id, question: q }
    }, {
      onSuccess: (data) => {
        const suggestions = data.suggestions as Array<{ content: string }>;
        const reply = suggestions.map(s => s.content).join('\n\n');
        setCopilotMessages(m => [...m, { role: 'ai', content: reply }]);
      },
      onError: () => {
        setCopilotMessages(m => [...m, { role: 'ai', content: 'Sorry, I could not generate suggestions right now.' }]);
      }
    });
  }, [composition, copilotQuestion, getSuggestions]);

  // ── Export ──
  const handleExport = useCallback((type: string) => {
    if (!composition) return;
    exportMidi.mutate({
      data: { compositionId: composition.id, exportType: type }
    }, {
      onSuccess: (data) => {
        const bytes = Uint8Array.from(atob(data.midiBase64 as string), c => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: 'audio/midi' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.fileName as string;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  }, [composition, exportMidi]);

  // ── Projects ──
  const handleSaveProject = useCallback(() => {
    if (!newProjectName.trim() || !composition) return;
    setProjectSaveStatus('saving');
    createProject.mutate({
      data: { name: newProjectName, compositionId: composition.id }
    }, {
      onSuccess: () => {
        setProjectSaveStatus('saved');
        setNewProjectName('');
        queryClient.invalidateQueries({ queryKey: ['listProjects'] });
        setTimeout(() => setProjectSaveStatus('idle'), 2000);
      },
      onError: () => setProjectSaveStatus('idle')
    });
  }, [newProjectName, composition, createProject, queryClient]);

  // ── Patterns ──
  const handleCreatePattern = () => {
    if (!newPatternName.trim()) return;
    createPattern.mutate({
      data: { name: newPatternName, bpm, quantize: selectedQ, activePads: Array.from(activePads), bluePads: Array.from(bluePads) }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListComposerPatternsQueryKey() });
        setIsSavingPattern(false);
        setNewPatternName('');
      }
    });
  };

  const handleDeletePattern = (id: number) => {
    deletePattern.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListComposerPatternsQueryKey() })
    });
  };

  const handleActivatePattern = (id: number) => {
    activatePattern.mutate({ id }, {
      onSuccess: (newSession) => {
        queryClient.invalidateQueries({ queryKey: getGetComposerSessionQueryKey() });
        setActivePads(new Set(newSession.activePads));
        setBluePads(new Set(newSession.bluePads));
        setSelectedQ(newSession.quantize);
        setBpm(newSession.bpm);
        lastSavedRef.current = {
          bpm: newSession.bpm, quantize: newSession.quantize,
          activePads: newSession.activePads, bluePads: newSession.bluePads
        };
        initRef.current = newSession.id;
      }
    });
  };

  const isGenerating = generateComposition.isPending;
  const isRegenerating = regenerateComposition.isPending;
  const isAnalyzing = analyzeComposition.isPending;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#242426',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 24px 24px 24px',
      fontFamily: "'Inter', system-ui, sans-serif",
      userSelect: 'none',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* ── Slide-out Patterns Panel ── */}
      <div style={{
        position: 'absolute',
        top: 0, bottom: 0, left: showPatterns ? 0 : -320,
        width: 320,
        background: PANEL_BG,
        borderRight: '1px solid rgba(255,255,255,0.05)',
        boxShadow: showPatterns ? '20px 0 40px rgba(0,0,0,0.5)' : 'none',
        transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 50,
        display: 'flex', flexDirection: 'column', padding: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>Saved Patterns</h2>
          <button onClick={() => setShowPatterns(false)} style={{ color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>Close</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto' }}>
          {patterns.map(p => (
            <div key={p.id} style={{ background: '#1c1c1e', borderRadius: 8, padding: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ color: '#ddd', fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => handleActivatePattern(p.id)} style={{ background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: 10, cursor: 'pointer' }}>Load</button>
                  <button onClick={() => handleDeletePattern(p.id)} style={{ background: 'none', color: '#a33', border: 'none', cursor: 'pointer', padding: 4 }}><Trash2 size={12} /></button>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: p.activePads.includes(i) ? '#a2f' : p.bluePads.includes(i) ? '#28f' : '#444'
                  }} />
                ))}
              </div>
            </div>
          ))}
        </div>
        {isSavingPattern ? (
          <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
            <input
              autoFocus placeholder="Pattern name..."
              value={newPatternName} onChange={e => setNewPatternName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreatePattern()}
              style={{ flex: 1, background: '#111', border: '1px solid #333', color: '#fff', padding: '6px 10px', borderRadius: 4, fontSize: 12 }}
            />
            <button onClick={handleCreatePattern} style={{ background: '#4a2', color: '#fff', border: 'none', borderRadius: 4, padding: '0 12px', fontSize: 12, cursor: 'pointer' }}>Save</button>
            <button onClick={() => setIsSavingPattern(false)} style={{ background: '#333', color: '#fff', border: 'none', borderRadius: 4, padding: '0 12px', fontSize: 12, cursor: 'pointer' }}>✕</button>
          </div>
        ) : (
          <button onClick={() => setIsSavingPattern(true)} style={{ marginTop: 24, background: '#333', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            Save Current as Pattern
          </button>
        )}
      </div>

      {/* ── Right AI / Copilot / Projects Panel ── */}
      <div style={{
        position: 'absolute',
        top: 0, bottom: 0, right: activePanel !== 'none' ? 0 : -400,
        width: 400,
        background: PANEL_BG,
        borderLeft: '1px solid rgba(255,255,255,0.05)',
        boxShadow: activePanel !== 'none' ? '-20px 0 40px rgba(0,0,0,0.5)' : 'none',
        transition: 'right 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 50,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Panel tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          {(['ai', 'copilot', 'projects'] as const).map(tab => (
            <button key={tab} onClick={() => setActivePanel(tab)} style={{
              flex: 1, padding: '12px 0',
              background: activePanel === tab ? 'rgba(162,34,255,0.15)' : 'transparent',
              border: 'none',
              borderBottom: activePanel === tab ? '2px solid #cc6eff' : '2px solid transparent',
              color: activePanel === tab ? '#cc6eff' : '#666',
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: 1,
            }}>
              {tab === 'ai' ? '✦ Generate' : tab === 'copilot' ? '💬 Copilot' : '📁 Projects'}
            </button>
          ))}
          <button onClick={() => setActivePanel('none')} style={{ padding: '12px 16px', background: 'transparent', border: 'none', color: '#555', cursor: 'pointer' }}>
            <X size={14} />
          </button>
        </div>

        {/* ── AI Generate Panel ── */}
        {activePanel === 'ai' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ color: '#888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Prompt</label>
              <textarea
                placeholder="e.g. dark trap beat with melancholic chords and hard 808s..."
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                rows={3}
                style={{
                  background: '#0e0e12', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', borderRadius: 6, padding: '10px 12px', fontSize: 12,
                  resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5,
                  outline: 'none', width: '100%', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ color: '#888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Genre</label>
                <select value={aiGenre} onChange={e => setAiGenre(e.target.value)} style={{
                  background: '#0e0e12', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', borderRadius: 5, padding: '7px 10px', fontSize: 12, cursor: 'pointer',
                }}>
                  {GENRES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ color: '#888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Mood</label>
                <select value={aiMood} onChange={e => setAiMood(e.target.value)} style={{
                  background: '#0e0e12', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff', borderRadius: 5, padding: '7px 10px', fontSize: 12, cursor: 'pointer',
                }}>
                  {MOODS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ color: '#888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>BPM (opt.)</label>
                <input
                  type="number" min="60" max="200" placeholder="auto"
                  value={aiBpm} onChange={e => setAiBpm(e.target.value === '' ? '' : Number(e.target.value))}
                  style={{ background: '#0e0e12', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 5, padding: '7px 10px', fontSize: 12 }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ color: '#888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Key (opt.)</label>
                <input
                  placeholder="e.g. Cm, F#"
                  value={aiKey} onChange={e => setAiKey(e.target.value)}
                  style={{ background: '#0e0e12', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 5, padding: '7px 10px', fontSize: 12 }}
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!aiPrompt.trim() || isGenerating}
              style={{
                background: !aiPrompt.trim() || isGenerating ? '#222' : 'linear-gradient(135deg, #9922dd, #cc3cff)',
                color: !aiPrompt.trim() || isGenerating ? '#555' : '#fff',
                border: 'none', borderRadius: 8, padding: '12px',
                fontSize: 13, fontWeight: 700, cursor: !aiPrompt.trim() || isGenerating ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: !aiPrompt.trim() || isGenerating ? 'none' : '0 4px 20px rgba(162,34,255,0.4)',
                transition: 'all 0.2s',
              }}
            >
              {isGenerating ? <><Loader2 size={14} className="spin" /> Generating...</> : <><Sparkles size={14} /> Generate Composition</>}
            </button>

            {aiError && (
              <div style={{ background: 'rgba(255,100,50,0.1)', border: '1px solid rgba(255,100,50,0.3)', borderRadius: 6, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <AlertCircle size={14} color="#f64" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ color: '#f86', fontSize: 12 }}>{aiError}</span>
              </div>
            )}

            {composition && (
              <>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Last Composition</span>
                    <span style={{
                      background: composition.lowConfidence ? 'rgba(255,180,0,0.15)' : 'rgba(40,184,58,0.15)',
                      color: composition.lowConfidence ? '#fb0' : '#28b83a',
                      border: `1px solid ${composition.lowConfidence ? 'rgba(255,180,0,0.3)' : 'rgba(40,184,58,0.3)'}`,
                      borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 700,
                    }}>
                      {Math.round((composition.styleMatch ?? 0) * 100)}% match
                    </span>
                  </div>

                  <div style={{ background: '#0e0e12', borderRadius: 8, padding: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                      <span style={{ background: 'rgba(162,34,255,0.2)', color: '#cc6eff', borderRadius: 4, padding: '2px 7px', fontSize: 11, fontWeight: 700 }}>{composition.key}</span>
                      <span style={{ background: 'rgba(40,184,58,0.15)', color: '#28b83a', borderRadius: 4, padding: '2px 7px', fontSize: 11 }}>{composition.genre}</span>
                      <span style={{ background: 'rgba(24,184,184,0.15)', color: '#18b8b8', borderRadius: 4, padding: '2px 7px', fontSize: 11 }}>{composition.mood}</span>
                      <span style={{ background: 'rgba(232,150,14,0.15)', color: '#e8960e', borderRadius: 4, padding: '2px 7px', fontSize: 11 }}>{composition.bpm} BPM</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {(composition.harmony?.chords ?? []).slice(0, 8).map((c: { symbol: string; romanNumeral: string }, i: number) => (
                        <div key={i} style={{ background: 'rgba(162,34,255,0.1)', border: '1px solid rgba(162,34,255,0.25)', borderRadius: 4, padding: '3px 7px', textAlign: 'center' }}>
                          <div style={{ color: '#cc6eff', fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>{c.symbol}</div>
                          <div style={{ color: '#666', fontSize: 9, fontFamily: 'monospace' }}>{c.romanNumeral}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Locks + Regenerate */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span style={{ color: '#888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Regenerate</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[
                        { label: 'Harmony', state: lockHarmony, set: setLockHarmony },
                        { label: 'Melody', state: lockMelody, set: setLockMelody },
                        { label: 'Rhythm', state: lockRhythm, set: setLockRhythm },
                      ].map(({ label, state, set }) => (
                        <button
                          key={label}
                          onClick={() => set(s => !s)}
                          style={{
                            flex: 1, padding: '7px 4px',
                            background: state ? 'rgba(232,150,14,0.2)' : '#0e0e12',
                            border: `1px solid ${state ? 'rgba(232,150,14,0.5)' : 'rgba(255,255,255,0.08)'}`,
                            color: state ? '#e8960e' : '#555', borderRadius: 6, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                            fontSize: 11, fontWeight: 500,
                          }}
                        >
                          {state ? <Lock size={11} /> : <Unlock size={11} />}
                          {label}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleRegenerate}
                      disabled={isRegenerating}
                      style={{
                        background: isRegenerating ? '#222' : 'rgba(40,184,58,0.15)',
                        border: '1px solid rgba(40,184,58,0.3)', color: isRegenerating ? '#555' : '#28b83a',
                        borderRadius: 6, padding: '9px', fontSize: 12, fontWeight: 600, cursor: isRegenerating ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}
                    >
                      {isRegenerating ? <Loader2 size={13} /> : <RefreshCw size={13} />}
                      {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                    </button>
                  </div>

                  {/* Export */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span style={{ color: '#888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Export MIDI</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      {['full', 'melody', 'chords', 'drums'].map(type => (
                        <button
                          key={type}
                          onClick={() => handleExport(type)}
                          disabled={exportMidi.isPending}
                          style={{
                            background: '#0e0e12', border: '1px solid rgba(255,255,255,0.08)',
                            color: '#aaa', borderRadius: 5, padding: '7px', fontSize: 11, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                          }}
                        >
                          <Download size={11} />
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Analyze */}
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    style={{
                      background: 'rgba(24,184,184,0.1)', border: '1px solid rgba(24,184,184,0.3)',
                      color: isAnalyzing ? '#555' : '#18b8b8', borderRadius: 6, padding: '9px',
                      fontSize: 12, fontWeight: 600, cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    {isAnalyzing ? <Loader2 size={13} /> : <BarChart2 size={13} />}
                    {isAnalyzing ? 'Analyzing...' : 'Analyze with Copilot'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Copilot Panel ── */}
        {activePanel === 'copilot' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {!composition ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, color: '#555' }}>
                <Music size={32} />
                <span style={{ fontSize: 14, textAlign: 'center' }}>Generate a composition first to use the Producer Copilot.</span>
              </div>
            ) : (
              <>
                {/* Analysis scores */}
                {analysis && (
                  <div style={{ padding: '16px 20px 0', flexShrink: 0 }}>
                    <div style={{ background: '#0e0e12', borderRadius: 8, padding: 14, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ color: '#888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Score</span>
                        <span style={{ color: '#cc6eff', fontSize: 18, fontWeight: 800 }}>{analysis.overallScore}<span style={{ fontSize: 11, color: '#666' }}>/100</span></span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {Object.entries(analysis.dimensionScores).map(([dim, score]) => (
                          <div key={dim}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                              <span style={{ color: '#888', fontSize: 10, textTransform: 'capitalize' }}>{dim}</span>
                              <span style={{ color: '#ccc', fontSize: 10, fontWeight: 700 }}>{score}</span>
                            </div>
                            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${score}%`, background: 'linear-gradient(to right, #9922dd, #cc6eff)', borderRadius: 2 }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      {analysis.recommendations.length > 0 && (
                        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {analysis.recommendations.slice(0, 3).map((r, i) => (
                            <div key={i} style={{
                              background: r.severity === 'warning' ? 'rgba(255,100,50,0.08)' : 'rgba(255,255,255,0.04)',
                              borderRadius: 5, padding: '6px 9px', fontSize: 11, color: '#aaa',
                              borderLeft: `2px solid ${r.severity === 'warning' ? '#f64' : r.severity === 'suggestion' ? '#cc6eff' : '#28b83a'}`,
                            }}>
                              <span style={{ fontWeight: 600, textTransform: 'capitalize', color: '#ddd' }}>{r.dimension}</span>: {r.message}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Chat messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {copilotMessages.length === 0 && !analysis && (
                    <div style={{ color: '#555', fontSize: 13, textAlign: 'center', marginTop: 40 }}>
                      Ask me anything about your composition — chord choices, structure, how to improve it.
                    </div>
                  )}
                  {copilotMessages.map((m, i) => (
                    <div key={i} style={{
                      alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                      background: m.role === 'user' ? 'rgba(162,34,255,0.2)' : '#1c1c1e',
                      border: `1px solid ${m.role === 'user' ? 'rgba(162,34,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      padding: '9px 12px', maxWidth: '85%',
                      color: m.role === 'user' ? '#cc6eff' : '#ccc',
                      fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap',
                    }}>
                      {m.content}
                    </div>
                  ))}
                  {getSuggestions.isPending && (
                    <div style={{ alignSelf: 'flex-start', color: '#555', fontSize: 12, padding: '4px 0' }}>
                      <Loader2 size={12} style={{ display: 'inline', marginRight: 6 }} /> Thinking...
                    </div>
                  )}
                </div>

                {/* Ask input */}
                <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, display: 'flex', gap: 8 }}>
                  <input
                    placeholder="Ask about your composition..."
                    value={copilotQuestion}
                    onChange={e => setCopilotQuestion(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAskCopilot()}
                    style={{
                      flex: 1, background: '#0e0e12', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff', borderRadius: 6, padding: '9px 12px', fontSize: 12, outline: 'none',
                    }}
                  />
                  <button
                    onClick={handleAskCopilot}
                    disabled={!copilotQuestion.trim() || getSuggestions.isPending}
                    style={{
                      background: 'rgba(162,34,255,0.2)', border: '1px solid rgba(162,34,255,0.4)',
                      color: '#cc6eff', borderRadius: 6, padding: '0 14px', cursor: 'pointer', fontSize: 12,
                    }}
                  >
                    Ask
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Projects Panel ── */}
        {activePanel === 'projects' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Save current composition as project */}
            {composition && (
              <div style={{ background: '#0e0e12', borderRadius: 8, padding: 14, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ color: '#888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Save Current</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    placeholder="Project name..."
                    value={newProjectName}
                    onChange={e => setNewProjectName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSaveProject()}
                    style={{ flex: 1, background: '#171720', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 5, padding: '8px 10px', fontSize: 12 }}
                  />
                  <button
                    onClick={handleSaveProject}
                    disabled={!newProjectName.trim() || projectSaveStatus !== 'idle'}
                    style={{
                      background: projectSaveStatus === 'saved' ? 'rgba(40,184,58,0.2)' : 'rgba(162,34,255,0.2)',
                      border: `1px solid ${projectSaveStatus === 'saved' ? 'rgba(40,184,58,0.4)' : 'rgba(162,34,255,0.4)'}`,
                      color: projectSaveStatus === 'saved' ? '#28b83a' : '#cc6eff',
                      borderRadius: 5, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}
                  >
                    {projectSaveStatus === 'saving' ? <Loader2 size={12} /> : projectSaveStatus === 'saved' ? <CheckCircle2 size={12} /> : <Save size={12} />}
                    {projectSaveStatus === 'saved' ? 'Saved!' : 'Save'}
                  </button>
                </div>
              </div>
            )}

            {/* Projects list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ color: '#888', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Projects ({projects.length})
              </span>
              {projects.length === 0 ? (
                <div style={{ color: '#555', fontSize: 12, textAlign: 'center', padding: '24px 0' }}>
                  No projects yet. Generate a composition and save it.
                </div>
              ) : (
                projects.map((p: { id: string; name: string; tags?: string[]; updatedAt?: string }) => (
                  <div key={p.id} style={{
                    background: '#0e0e12', borderRadius: 8, padding: 12,
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ color: '#ddd', fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                      {p.updatedAt && (
                        <div style={{ color: '#555', fontSize: 10, marginTop: 2 }}>
                          {new Date(p.updatedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <FolderOpen size={14} color="#555" />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Device body ── */}
      <div style={{
        background: `linear-gradient(175deg, ${BODY_BG} 0%, #181818 100%)`,
        borderRadius: 22,
        border: '1px solid rgba(255,255,255,0.09)',
        padding: '14px 14px 16px',
        width: 960,
        position: 'relative',
        boxShadow: [
          'inset 0 1px 0 rgba(255,255,255,0.07)',
          'inset 0 -1px 0 rgba(0,0,0,0.6)',
          '0 24px 60px rgba(0,0,0,0.8)',
          '0 2px 4px rgba(0,0,0,0.5)',
        ].join(', '),
        opacity: isSessionLoading ? 0.4 : 1,
        transition: 'opacity 0.3s ease',
        animation: isSessionLoading ? 'pulse 2s infinite' : 'none'
      }}>

        {showSavedFlash && (
          <div style={{
            position: 'absolute', top: 20, right: 30, background: 'rgba(40, 180, 58, 0.2)',
            color: '#28b83a', border: '1px solid rgba(40, 180, 58, 0.4)', borderRadius: 4,
            padding: '4px 8px', fontSize: 10, fontWeight: 600, pointerEvents: 'none', zIndex: 10
          }}>
            SAVED
          </div>
        )}

        {/* ── TOP ENCODER ROW ── */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 50,
          paddingBottom: 12, marginBottom: 12,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Knob key={i} offset={-20 + i * 8} />
          ))}
        </div>

        {/* ── CONTROL ROW ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>

          {/* left controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 156, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 5 }}>
              <SmallBtn>Undo</SmallBtn>
              <SmallBtn>Save</SmallBtn>
              <SmallBtn style={{ padding: '4px 6px' }}><Lock size={13} /></SmallBtn>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <JogWheel />
              <div style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', color: '#fff', fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold' }}>
                BPM<br/>
                <span style={{color: '#888'}}>{bpm}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
              <SmallBtn style={{ fontSize: 10 }}>Tap Tempo</SmallBtn>
              <SmallBtn style={{ fontSize: 10 }}>Quantize</SmallBtn>
            </div>
          </div>

          {/* display screen */}
          <Screen bpm={bpm} composition={composition} />

          {/* right controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 156, flexShrink: 0, alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {/* AI Generate */}
              <SmallBtn style={{ padding: '4px 6px' }} active={activePanel === 'ai'} onClick={() => togglePanel('ai')}>
                <Sparkles size={13} />
              </SmallBtn>
              {/* Analyze / Copilot */}
              <SmallBtn style={{ padding: '4px 6px' }} active={activePanel === 'copilot'} onClick={() => togglePanel('copilot')}>
                <MessageSquare size={13} />
              </SmallBtn>
              {/* Projects */}
              <SmallBtn style={{ padding: '4px 6px' }} active={activePanel === 'projects'} onClick={() => togglePanel('projects')}>
                <FolderOpen size={13} />
              </SmallBtn>
              {/* Monitor */}
              <SmallBtn style={{ padding: '4px 6px' }}><Monitor size={13} /></SmallBtn>
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              <SmallBtn onClick={() => setBpm(b => b + 1)} style={{ padding: '4px 14px' }}><Plus size={13} /></SmallBtn>
              <SmallBtn onClick={() => setBpm(b => Math.max(30, b - 1))} style={{ padding: '4px 14px' }}><Minus size={13} /></SmallBtn>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <JogWheel />
            </div>
          </div>
        </div>

        {/* ── TRACK COLOR STRIP ── */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 10, marginTop: 2, padding: '0 2px' }}>
          {TRACKS.map((t, i) => (
            <div key={i} style={{
              flex: 1, height: 5, borderRadius: 3,
              background: t.color,
              boxShadow: `0 0 8px ${t.color}88`,
              opacity: 0.9,
            }} />
          ))}
        </div>

        {/* ── MAIN AREA ── */}
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>

          {/* ── LEFT SIDEBAR ── */}
          <div style={{ width: 96, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 0, paddingRight: 8 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
              {[
                <div key="rhombus" style={{ width: 10, height: 10, border: '1.5px solid currentColor', transform: 'rotate(45deg)' }} />,
                <Square key="square" size={12} />,
                <span key="arrow" style={{ fontSize: 13, lineHeight: 1 }}>←</span>,
              ].map((icon, i) => (
                <SideBtn key={i} style={{ width: 28, height: 28, padding: 0, justifyContent: 'center', flexShrink: 0 }}>{icon}</SideBtn>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 10 }}>
              {[
                { label: 'Play',   led: '#f0c020', active: playing,  onClick: () => setPlaying(p => !p) },
                { label: 'Stop',   led: '#e03020', active: false,    onClick: () => setPlaying(false) },
                { label: 'Record', led: '#e03020', active: false,    onClick: () => {} },
              ].map(b => (
                <SideBtn key={b.label} onClick={b.onClick} style={{ width: '100%' }} color={b.active ? '#fff' : undefined}>
                  <Led color={b.label === 'Play' && playing ? '#f0c020' : b.led} />
                  {b.label}
                </SideBtn>
              ))}
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 8 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 10 }}>
              <SideBtn style={{ width: '100%' }}>Fixed Length</SideBtn>
              <SideBtn style={{ width: '100%' }} color="#d83020">Automate</SideBtn>
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 8 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <SideBtn onClick={() => setShowPatterns(p => !p)} style={{ width: '100%' }} color={showPatterns ? '#a2f' : undefined}>Patterns</SideBtn>
              <SideBtn style={{ width: '100%', justifyContent: 'center', letterSpacing: 3 }}>···</SideBtn>
              <SideBtn style={{ width: '100%', justifyContent: 'center' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.25)' }} />
              </SideBtn>
            </div>
          </div>

          {/* ── LEFT DOT STRIP ── */}
          <div style={{ width: 14, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', padding: '4px 0' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                width: 4, height: 4, borderRadius: '50%',
                background: i < 2 ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.1)',
                boxShadow: i < 2 ? '0 0 3px rgba(255,255,255,0.2)' : 'none',
              }} />
            ))}
          </div>

          {/* ── PAD GRID ── */}
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: 7,
            padding: 12,
            background: '#0e0e0e',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.7)',
            margin: '0 6px',
            position: 'relative',
          }}>
            {isGenerating && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 10,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 12, zIndex: 5,
              }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#cc6eff',
                      animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                      opacity: 0.8,
                    }} />
                  ))}
                </div>
                <span style={{ color: '#cc6eff', fontSize: 12, fontWeight: 600, letterSpacing: 2 }}>COMPOSING...</span>
              </div>
            )}
            {Array.from({ length: 64 }).map((_, i) => {
              const isPurple = activePads.has(i);
              const isBlue   = bluePads.has(i);
              const base: React.CSSProperties = {
                borderRadius: 9, aspectRatio: '1', cursor: 'pointer',
                transition: 'transform 0.04s, box-shadow 0.04s', position: 'relative',
              };
              let style: React.CSSProperties;
              if (isPurple) {
                style = {
                  ...base,
                  background: 'linear-gradient(145deg, #cc6eff 0%, #9922dd 55%, #6a12a8 100%)',
                  border: '1px solid rgba(210,130,255,0.55)',
                  boxShadow: ['0 3px 6px rgba(0,0,0,0.7)', 'inset 0 1px 0 rgba(255,255,255,0.35)', 'inset 0 -2px 4px rgba(80,0,120,0.6)', '0 0 16px rgba(180,60,255,0.75)', '0 0 40px rgba(150,30,220,0.45)', '0 0 70px rgba(120,20,200,0.2)'].join(', '),
                };
              } else if (isBlue) {
                style = {
                  ...base,
                  background: 'linear-gradient(145deg, #70d8ff 0%, #28a8e8 55%, #1478c0 100%)',
                  border: '1px solid rgba(120,210,255,0.55)',
                  boxShadow: ['0 3px 6px rgba(0,0,0,0.7)', 'inset 0 1px 0 rgba(255,255,255,0.35)', 'inset 0 -2px 4px rgba(0,60,120,0.6)', '0 0 16px rgba(60,180,255,0.75)', '0 0 40px rgba(30,140,240,0.45)', '0 0 70px rgba(20,110,210,0.2)'].join(', '),
                };
              } else {
                style = {
                  ...base,
                  background: 'linear-gradient(145deg, #d4d4de 0%, #b8b8c8 50%, #a8a8bc 100%)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  boxShadow: ['0 4px 8px rgba(0,0,0,0.65)', 'inset 0 1px 0 rgba(255,255,255,0.5)', 'inset 0 -3px 5px rgba(0,0,0,0.25)', '0 0 6px rgba(180,180,210,0.1)'].join(', '),
                };
              }
              return (
                <div key={i} style={style}
                  onClick={() => togglePad(i)}
                  onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.93)')}
                  onMouseUp={e => (e.currentTarget.style.transform = '')}
                  onMouseLeave={e => (e.currentTarget.style.transform = '')}
                />
              );
            })}
          </div>

          {/* ── RIGHT DOT STRIP ── */}
          <div style={{ width: 14, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', padding: '4px 0' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div style={{ width: 168, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <SideBtn style={{ width: 28, height: 28, justifyContent: 'center', padding: 0 }}><ChevronUp size={14} /></SideBtn>
              <div style={{ display: 'flex', gap: 3 }}>
                <SideBtn style={{ width: 28, height: 28, justifyContent: 'center', padding: 0 }}><ChevronLeft size={14} /></SideBtn>
                <SideBtn style={{ width: 28, height: 28, justifyContent: 'center', padding: 0 }}><ChevronDown size={14} /></SideBtn>
                <SideBtn style={{ width: 28, height: 28, justifyContent: 'center', padding: 0 }}><ChevronRight size={14} /></SideBtn>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 5, flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: 42 }}>
                {QUANTIZE.map(q => (
                  <button key={q} onClick={() => setSelectedQ(q)} style={{
                    fontSize: 10,
                    color: selectedQ === q ? '#fff' : '#888',
                    padding: '3px 4px', borderRadius: 4,
                    border: `1px solid ${selectedQ === q ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`,
                    background: selectedQ === q ? '#363638' : '#222224',
                    textAlign: 'center', cursor: 'pointer',
                    fontWeight: selectedQ === q ? 600 : 400,
                    boxShadow: selectedQ === q ? '0 0 6px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.08)' : 'none',
                    transition: 'all 0.1s',
                  }}>{q}</button>
                ))}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {FUNC_BTNS.map(([a, b], i) => (
                  <div key={i} style={{ display: 'flex', gap: 2 }}>
                    <SideBtn style={{ flex: 1, fontSize: b ? 10 : 11, padding: '4px 4px' }}>{a}</SideBtn>
                    {b ? <SideBtn style={{ flex: 1, fontSize: 10, padding: '4px 4px' }}>{b}</SideBtn> : <div style={{ flex: 1 }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.6; } }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        select option { background: #1a1a1e; color: #fff; }
        textarea, input, select { outline: none; }
        textarea::placeholder, input::placeholder { color: #444; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}} />
    </div>
  );
}
