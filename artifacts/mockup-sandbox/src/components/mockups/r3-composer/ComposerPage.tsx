import React, { useState } from "react";
import { 
  Play, Pause, Settings, Layers, Lock, Unlock, 
  ChevronDown, Save, Download, RefreshCw, Sparkles,
  Music, Volume2, Cpu, Mic2, LayoutGrid, Clock, ListMusic,
  Maximize2
} from "lucide-react";

export function ComposerPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [prompt, setPrompt] = useState("Dark trap beat with an eerie minor melody and heavy 808 bass");
  const [bpmLocked, setBpmLocked] = useState(false);
  
  return (
    <div className="dark min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-indigo-500/30 flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-white/5 bg-[#09090b] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <Cpu className="w-5 h-5" />
            <span className="font-semibold text-sm tracking-wide uppercase">R3 Composer</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-md hover:bg-white/10 cursor-pointer transition-colors">
            <span className="text-xs font-medium text-zinc-100">Project: Midnight Run</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </div>
        </div>
        
        <nav className="flex items-center gap-1">
          <button className="px-4 py-2 text-xs font-medium text-white bg-white/10 rounded-md">Composer</button>
          <button className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">Projects</button>
          <button className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Copilot
          </button>
        </nav>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            Engine Ready
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-400 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Prompt Panel */}
        <aside className="w-80 border-r border-white/5 bg-[#0a0a0c] flex flex-col shrink-0">
          <div className="p-4 flex flex-col h-full">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Mic2 className="w-3.5 h-3.5" /> Generation Parameters
            </h2>
            
            <div className="space-y-5 flex-1 overflow-y-auto pr-2 scrollbar-thin">
              <div className="space-y-2">
                <label className="text-xs text-zinc-400 font-medium">Prompt</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none transition-all placeholder:text-zinc-600"
                  placeholder="Describe the music you want to generate..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Genre</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-md py-2 px-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer">
                    <option>Trap</option>
                    <option>Hip-Hop</option>
                    <option>R&B</option>
                    <option>Afrobeats</option>
                    <option>House</option>
                    <option>Techno</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Mood</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-md py-2 px-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer">
                    <option>Dark</option>
                    <option>Energetic</option>
                    <option>Melancholic</option>
                    <option>Euphoric</option>
                    <option>Aggressive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Key</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-md py-2 px-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer text-center font-['JetBrains_Mono']">
                    <option>Cm</option>
                    <option>C</option>
                    <option>C#</option>
                    <option>Dm</option>
                    <option>D</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">BPM</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      defaultValue={140}
                      className="w-full bg-black/40 border border-white/10 rounded-md py-2 px-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 text-center font-['JetBrains_Mono']"
                    />
                    <button 
                      onClick={() => setBpmLocked(!bpmLocked)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      {bpmLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-medium">Time</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-md py-2 px-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer text-center font-['JetBrains_Mono']">
                    <option>4/4</option>
                    <option>3/4</option>
                    <option>6/8</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-auto border-t border-white/5">
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2 group">
                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Generate Composition
              </button>
            </div>
          </div>
        </aside>

        {/* Center - Result Panel */}
        <section className="flex-1 flex flex-col min-w-0 bg-[#0c0c0e]">
          {/* Chord Progression */}
          <div className="h-40 border-b border-white/5 p-4 flex flex-col shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" /> Harmony
              </h3>
              <div className="text-xs text-zinc-500 font-['JetBrains_Mono']">Bar 1-4</div>
            </div>
            
            <div className="flex gap-3 h-full pb-2 overflow-x-auto">
              {[
                { chord: 'Cm', num: 'i', beats: 4, active: true },
                { chord: 'Ab', num: 'VI', beats: 4, active: false },
                { chord: 'Bb', num: 'VII', beats: 4, active: false },
                { chord: 'Gm', num: 'v', beats: 4, active: false }
              ].map((c, i) => (
                <div key={i} className={`flex-1 min-w-[120px] rounded-lg border flex flex-col relative group transition-colors ${c.active ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-black/20 border-white/5 hover:border-white/20'}`}>
                  <div className="p-3 pb-0 flex justify-between items-start">
                    <span className="text-xl font-bold text-white tracking-tight">{c.chord}</span>
                    <button className="text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Lock className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="px-3 text-xs text-indigo-400 font-medium mb-auto">{c.num}</div>
                  <div className="px-3 pb-3 mt-2 flex items-end justify-between">
                    <div className="flex gap-1">
                      {/* Mock midi voicing dots */}
                      <div className="w-1 h-1 bg-white/20 rounded-full" />
                      <div className="w-1 h-1 bg-white/40 rounded-full" />
                      <div className="w-1 h-1 bg-white/60 rounded-full" />
                      <div className="w-1 h-1 bg-white/80 rounded-full" />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-['JetBrains_Mono']">{c.beats} beats</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Melody Piano Roll */}
          <div className="flex-1 border-b border-white/5 p-4 flex flex-col min-h-[200px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <Music className="w-3.5 h-3.5" /> Melody
              </h3>
              <div className="flex items-center gap-3">
                <button className="text-zinc-500 hover:text-white"><Maximize2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            
            <div className="flex-1 bg-[#050505] rounded-lg border border-white/5 relative overflow-hidden flex">
              {/* Piano keys left sidebar */}
              <div className="w-10 bg-black/40 border-r border-white/5 flex flex-col text-[8px] font-['JetBrains_Mono'] text-zinc-600 justify-between py-2 items-center">
                <span>C6</span>
                <span>B5</span>
                <span>A5</span>
                <span>G5</span>
                <span>F5</span>
                <span>E5</span>
                <span>D5</span>
                <span>C5</span>
              </div>
              
              {/* Grid area */}
              <div className="flex-1 relative bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:25%_12.5%]">
                {/* Playhead */}
                <div className="absolute top-0 bottom-0 left-[25%] w-px bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] z-10" />
                
                {/* Mock Notes */}
                <div className="absolute top-[12.5%] left-[0%] w-[12.5%] h-[12.5%] bg-indigo-500/80 rounded-sm shadow-[0_0_8px_rgba(99,102,241,0.5)] border border-indigo-400/50" />
                <div className="absolute top-[37.5%] left-[12.5%] w-[6.25%] h-[12.5%] bg-indigo-500/80 rounded-sm shadow-[0_0_8px_rgba(99,102,241,0.5)] border border-indigo-400/50" />
                <div className="absolute top-[50%] left-[18.75%] w-[6.25%] h-[12.5%] bg-indigo-500/80 rounded-sm shadow-[0_0_8px_rgba(99,102,241,0.5)] border border-indigo-400/50" />
                <div className="absolute top-[25%] left-[25%] w-[25%] h-[12.5%] bg-indigo-500/80 rounded-sm shadow-[0_0_8px_rgba(99,102,241,0.5)] border border-indigo-400/50" />
                <div className="absolute top-[62.5%] left-[50%] w-[12.5%] h-[12.5%] bg-indigo-500/80 rounded-sm shadow-[0_0_8px_rgba(99,102,241,0.5)] border border-indigo-400/50" />
                <div className="absolute top-[87.5%] left-[62.5%] w-[12.5%] h-[12.5%] bg-indigo-500/80 rounded-sm shadow-[0_0_8px_rgba(99,102,241,0.5)] border border-indigo-400/50" />
                <div className="absolute top-[50%] left-[75%] w-[25%] h-[12.5%] bg-indigo-500/80 rounded-sm shadow-[0_0_8px_rgba(99,102,241,0.5)] border border-indigo-400/50" />
              </div>
            </div>
          </div>

          {/* Drum Step Sequencer */}
          <div className="h-48 p-4 flex flex-col shrink-0">
             <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <LayoutGrid className="w-3.5 h-3.5" /> Rhythm
              </h3>
              <div className="text-xs text-zinc-500 font-['JetBrains_Mono'] flex items-center gap-4">
                <span>140 BPM</span>
                <span>2 Bars</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-2">
              {/* Step indicator */}
              <div className="flex pl-16">
                {Array.from({length: 16}).map((_, i) => (
                  <div key={i} className="flex-1 flex justify-center">
                    {i === 2 ? <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> : <div className="w-1 h-1 rounded-full bg-white/10" />}
                  </div>
                ))}
              </div>
              
              {/* Tracks */}
              {[
                { name: 'KICK', pattern: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0], color: 'bg-emerald-500' },
                { name: 'SNARE', pattern: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0], color: 'bg-rose-500' },
                { name: 'HIHAT', pattern: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], color: 'bg-amber-500' }
              ].map((track, i) => (
                <div key={i} className="flex items-center gap-2 h-8">
                  <div className="w-14 text-[10px] font-bold text-zinc-400 tracking-wider">{track.name}</div>
                  <div className="flex-1 flex gap-1 h-full">
                    {track.pattern.map((active, step) => (
                      <div 
                        key={step} 
                        className={`flex-1 rounded-sm cursor-pointer transition-colors ${
                          active ? `${track.color} opacity-80 shadow-[0_0_8px_currentColor]` : 'bg-white/5 hover:bg-white/10'
                        } ${step % 4 === 0 && !active ? 'bg-white/10' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Action Bar (Footer) */}
      <footer className="h-16 border-t border-white/5 bg-[#0a0a0c] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-1" />}
          </button>
          
          <div className="flex items-center gap-2 text-xs font-['JetBrains_Mono']">
            <span className="text-zinc-500">00:00:00</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">00:00:15</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
            <span className="text-xs font-medium text-emerald-400">87% Style Match</span>
          </div>
          <span className="text-xs text-zinc-600 font-['JetBrains_Mono']">Gen: 4.2s</span>
          
          <div className="h-6 w-px bg-white/10 mx-2" />
          
          <button className="flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white transition-colors px-3 py-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Regenerate
          </button>
          
          <div className="flex bg-white/5 rounded-md p-1">
            <button className="px-2 py-1 text-[10px] uppercase font-bold text-zinc-400 hover:text-white rounded bg-white/5">All</button>
            <button className="px-2 py-1 text-[10px] uppercase font-bold text-zinc-400 hover:text-white rounded">Melody</button>
            <button className="px-2 py-1 text-[10px] uppercase font-bold text-zinc-400 hover:text-white rounded">Chords</button>
            <button className="px-2 py-1 text-[10px] uppercase font-bold text-zinc-400 hover:text-white rounded">Rhythm</button>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <button className="flex items-center gap-2 text-xs font-medium bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-md transition-colors border border-white/5">
              <Download className="w-3.5 h-3.5" /> Export MIDI
            </button>
            <button className="flex items-center gap-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md transition-colors shadow-[0_0_10px_rgba(79,70,229,0.2)]">
              <Save className="w-3.5 h-3.5" /> Save Project
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
