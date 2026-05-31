import React, { useState } from 'react';
import { 
  Headphones, BarChart2, Monitor, Menu, Lock, 
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, 
  Play, Square, Circle, Triangle, Plus, Minus 
} from 'lucide-react';

export function ComposerPage() {
  const [activePads, setActivePads] = useState<Set<number>>(new Set([0, 7, 19, 49, 56, 60, 62]));
  const [bluePads, setBluePads] = useState<Set<number>>(new Set([37, 63]));
  const [selectedQuantize, setSelectedQuantize] = useState("1/16");

  const togglePad = (idx: number) => {
    if (bluePads.has(idx)) {
      const next = new Set(bluePads);
      next.delete(idx);
      setBluePads(next);
    } else if (activePads.has(idx)) {
      const next = new Set(activePads);
      next.delete(idx);
      setActivePads(next);
    } else {
      const next = new Set(activePads);
      next.add(idx);
      setActivePads(next);
    }
  };

  const btnStyle = {
    background: '#2a2a2c',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#aaa',
    fontSize: '11px',
    padding: '4px 10px',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const sidebarBtnStyle = {
    background: '#252527',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#ccc',
    fontSize: '11px',
    fontWeight: 500,
    borderRadius: '5px',
    cursor: 'pointer',
    padding: '4px 8px',
    textAlign: 'left' as const,
    display: 'flex',
    alignItems: 'center'
  };

  const quantizeOptions = ["1/32", "1/16t", "1/16", "1/8t", "1/8", "1/4t", "1/4", "1/2", "1 Bar"];
  const tracks = [
    { name: "Drums", color: "#e8a020" },
    { name: "Bass", color: "#cc3020" },
    { name: "Keys", color: "#30c040" },
    { name: "Pads", color: "#20c0c0" },
    { name: "Vocal", color: "#30c040" },
    { name: "Guitar", color: "#888" },
    { name: "FX", color: "#c0b010" },
    { name: "Master", color: "#9030c0" }
  ];

  return (
    <div className="min-h-screen bg-[#2a2a2c] flex items-center justify-center p-6 font-[Inter,system-ui,sans-serif] select-none">
      <div style={{
        background: '#1a1a1c',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '12px',
        width: '960px',
        position: 'relative',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.5)'
      }}>
        
        {/* Section 1 — Top Encoder Row */}
        <div className="flex justify-center gap-[52px] pb-3 mb-3 border-b border-white/5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 38% 35%, #3a3a3c, #111)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.06)',
              position: 'relative'
            }}>
              <div style={{
                width: '2px',
                height: '8px',
                background: '#ccc',
                borderRadius: '1px',
                position: 'absolute',
                top: '5px',
                left: '50%',
                transform: 'translateX(-50%) rotate(-30deg)',
                transformOrigin: 'bottom center'
              }} />
            </div>
          ))}
        </div>

        {/* Section 2 — Control Row */}
        <div className="flex items-start justify-between mb-2">
          
          {/* Left Controls */}
          <div className="flex flex-col gap-2 w-[180px]">
            <div className="flex gap-2">
              <button style={btnStyle}>Undo</button>
              <button style={btnStyle}>Save</button>
              <button style={{...btnStyle, padding: '4px'}}>
                <Lock className="w-3.5 h-3.5 text-[#aaa]" />
              </button>
            </div>
            
            <div className="flex justify-center my-1">
              <div style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 40% 38%, #2c2c2e, #0d0d0f)',
                border: '2px solid rgba(255,255,255,0.08)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)',
                position: 'relative'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: '#1a1a1c',
                  borderRadius: '50%',
                  position: 'absolute',
                  inset: 0,
                  margin: 'auto'
                }} />
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <button style={btnStyle}>Tap Tempo</button>
              <button style={btnStyle}>Quantize</button>
            </div>
          </div>

          {/* Center Display Screen */}
          <div className="flex-1 mx-4" style={{
            background: '#0a0a0c',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            padding: '6px',
            height: '120px',
            display: 'flex',
            flexDirection: 'col'
          }}>
            <div className="flex flex-col h-full w-full">
              {/* Screen Top Row: Tracks */}
              <div className="flex flex-1 gap-1">
                {tracks.map((track, i) => (
                  <div key={i} className="flex-1 flex flex-col gap-1 items-center">
                    <div style={{ color: track.color, fontSize: '10px', fontWeight: 600, fontFamily: 'monospace' }}>
                      {track.name}
                    </div>
                    <div className="flex-1 w-full bg-white/5 rounded-sm p-[2px] flex flex-col-reverse gap-1">
                      <div style={{ height: '30%', backgroundColor: track.color, opacity: 0.8, borderRadius: '1px' }}></div>
                      <div style={{ height: '40%', backgroundColor: track.color, opacity: 0.5, borderRadius: '1px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Screen Bottom Row: Parameters */}
              <div style={{
                fontFamily: 'monospace',
                fontSize: '9px',
                color: '#888',
                marginTop: '8px',
                paddingTop: '6px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Filter /⋀</span>
                <span>Frequency: 22.0 kHz</span>
                <span>Resonance: 0.71</span>
                <span>Drive: 32%</span>
                <span>LFO Amount: 23%</span>
                <span>LFO Rate: 1/8</span>
                <span>Volume: 0.0 dB</span>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex flex-col gap-3 w-[180px] items-end">
            <div className="flex gap-2">
              <button style={{...btnStyle, padding: '4px'}}><Headphones className="w-3.5 h-3.5" /></button>
              <button style={{...btnStyle, padding: '4px'}}><BarChart2 className="w-3.5 h-3.5" /></button>
              <button style={{...btnStyle, padding: '4px'}}><Monitor className="w-3.5 h-3.5" /></button>
              <button style={{...btnStyle, padding: '4px'}}><Menu className="w-3.5 h-3.5" /></button>
            </div>
            
            <div className="flex gap-2 justify-end w-full">
               <button style={{...btnStyle, padding: '4px 12px'}}><Plus className="w-3.5 h-3.5" /></button>
               <button style={{...btnStyle, padding: '4px 12px'}}><Minus className="w-3.5 h-3.5" /></button>
            </div>

            <div className="flex justify-center w-full my-1">
              <div style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 40% 38%, #2c2c2e, #0d0d0f)',
                border: '2px solid rgba(255,255,255,0.08)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)',
                position: 'relative'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: '#1a1a1c',
                  borderRadius: '50%',
                  position: 'absolute',
                  inset: 0,
                  margin: 'auto'
                }} />
              </div>
            </div>
          </div>

        </div>

        {/* Section 3 — Track Color Indicator Row */}
        <div className="flex gap-1" style={{ marginTop: '4px', marginBottom: '8px' }}>
          {tracks.map((track, i) => (
            <div key={i} style={{
              height: '4px',
              flex: 1,
              borderRadius: '2px',
              backgroundColor: track.color
            }} />
          ))}
        </div>

        {/* Section 4 — Main Area */}
        <div className="flex items-stretch justify-between mt-4">
          
          {/* Left Sidebar */}
          <div className="flex flex-col gap-4 w-[90px]">
            <div className="flex gap-1">
               <button className="hover:bg-[#303032]" style={{...sidebarBtnStyle, width: '28px', height: '28px', justifyContent: 'center'}}><div className="w-2.5 h-2.5 border border-current rotate-45" /></button>
               <button className="hover:bg-[#303032]" style={{...sidebarBtnStyle, width: '28px', height: '28px', justifyContent: 'center'}}><Square className="w-3.5 h-3.5" /></button>
               <button className="hover:bg-[#303032]" style={{...sidebarBtnStyle, width: '28px', height: '28px', justifyContent: 'center'}}>←</button>
            </div>
            
            <div className="flex flex-col gap-1">
              <button className="hover:bg-[#303032]" style={{...sidebarBtnStyle, height: '30px'}}>
                <span className="w-2 h-2 rounded-full bg-[#f0c020] inline-block mr-2"/> Play
              </button>
              <button className="hover:bg-[#303032]" style={{...sidebarBtnStyle, height: '30px'}}>
                <span className="w-2 h-2 rounded-full bg-[#e03020] inline-block mr-2"/> Stop
              </button>
              <button className="hover:bg-[#303032]" style={{...sidebarBtnStyle, height: '30px'}}>
                <span className="w-2 h-2 rounded-full bg-[#e03020] inline-block mr-2"/> Record
              </button>
            </div>

            <div className="flex flex-col gap-1 mt-auto">
              <button className="hover:bg-[#303032]" style={sidebarBtnStyle}>Fixed Length</button>
              <button className="hover:bg-[#303032]" style={{...sidebarBtnStyle, color: '#e03020'}}>Automate</button>
            </div>
            
            <div className="flex flex-col gap-1">
              <button className="hover:bg-[#303032]" style={sidebarBtnStyle}>New</button>
              <button className="hover:bg-[#303032]" style={{...sidebarBtnStyle, justifyContent: 'center'}}>...</button>
              <button className="hover:bg-[#303032]" style={{...sidebarBtnStyle, justifyContent: 'center'}}>
                <div style={{width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #555'}} />
              </button>
              <button className="hover:bg-[#303032]" style={{...sidebarBtnStyle, justifyContent: 'center', color: '#30c040'}}>
                <Triangle className="w-4 h-4 fill-current rotate-90" />
              </button>
            </div>
          </div>

          {/* Left Dot Strip */}
          <div className="w-[12px] flex flex-col justify-between py-3">
             {Array.from({length: 8}).map((_, i) => (
               <div key={i} style={{
                 width: '4px', height: '4px', borderRadius: '50%', 
                 background: i === 0 ? '#555' : '#333',
                 margin: '0 auto'
               }} />
             ))}
          </div>

          {/* 8x8 Pad Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: '6px',
            padding: '12px',
            background: '#111',
            borderRadius: '8px',
            flex: 1,
            margin: '0 8px'
          }}>
            {Array.from({ length: 64 }).map((_, i) => {
              const isPurple = activePads.has(i);
              const isBlue = bluePads.has(i);
              
              let padStyle = {
                borderRadius: '8px',
                aspectRatio: '1',
                position: 'relative' as const,
                cursor: 'pointer',
                transition: 'transform 0.05s, box-shadow 0.05s',
                background: 'linear-gradient(145deg, #d8d8e0, #c0c0cc)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.4), 0 0 12px rgba(200,200,220,0.15)',
                border: '1px solid rgba(255,255,255,0.15)'
              };

              if (isPurple) {
                padStyle = {
                  ...padStyle,
                  background: 'linear-gradient(145deg, #c060f0, #9030c0)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 20px rgba(180,80,240,0.7), 0 0 40px rgba(150,50,200,0.4)',
                  border: '1px solid rgba(200,100,255,0.5)'
                };
              } else if (isBlue) {
                padStyle = {
                  ...padStyle,
                  background: 'linear-gradient(145deg, #60c8f0, #30a0e0)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 20px rgba(80,180,240,0.7), 0 0 40px rgba(50,150,220,0.4)',
                  border: '1px solid rgba(100,200,255,0.5)'
                };
              }

              return (
                <div 
                  key={i} 
                  style={padStyle}
                  onClick={() => togglePad(i)}
                  className="active:scale-95"
                />
              );
            })}
          </div>

          {/* Right Dot Strip */}
          <div className="w-[12px] flex flex-col justify-between py-3">
             {Array.from({length: 8}).map((_, i) => (
               <div key={i} style={{
                 width: '4px', height: '4px', borderRadius: '50%', 
                 background: '#333',
                 margin: '0 auto'
               }} />
             ))}
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-4 w-[160px] pl-2">
            
            {/* Nav Arrows */}
            <div className="flex flex-col items-center gap-1">
              <button className="hover:bg-[#303032]" style={{...sidebarBtnStyle, width: '28px', height: '28px', justifyContent: 'center'}}><ChevronUp className="w-4 h-4" /></button>
              <div className="flex gap-1">
                <button className="hover:bg-[#303032]" style={{...sidebarBtnStyle, width: '28px', height: '28px', justifyContent: 'center'}}><ChevronLeft className="w-4 h-4" /></button>
                <button className="hover:bg-[#303032]" style={{...sidebarBtnStyle, width: '28px', height: '28px', justifyContent: 'center'}}><ChevronDown className="w-4 h-4" /></button>
                <button className="hover:bg-[#303032]" style={{...sidebarBtnStyle, width: '28px', height: '28px', justifyContent: 'center'}}><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              {/* Quantize List */}
              <div className="flex flex-col gap-1 w-[40px]">
                {quantizeOptions.map(q => (
                  <button 
                    key={q}
                    onClick={() => setSelectedQuantize(q)}
                    style={{
                      fontSize: '10px',
                      color: selectedQuantize === q ? '#fff' : '#aaa',
                      padding: '3px 0',
                      borderRadius: '4px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: selectedQuantize === q ? '#353537' : '#252527',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                    className="hover:bg-[#303032]"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Function Buttons Grid */}
              <div className="flex-1 flex flex-col gap-1">
                 <div className="flex gap-1">
                    <button className="flex-1 hover:bg-[#303032]" style={sidebarBtnStyle}>Select</button>
                    <div className="flex-1"></div>
                 </div>
                 <div className="flex gap-1">
                    <button className="flex-1 hover:bg-[#303032]" style={sidebarBtnStyle}>Scale</button>
                    <button className="flex-1 hover:bg-[#303032]" style={sidebarBtnStyle}>Layout</button>
                 </div>
                 <div className="flex gap-1">
                    <button className="flex-1 hover:bg-[#303032]" style={sidebarBtnStyle}>Repeat</button>
                    <button className="flex-1 hover:bg-[#303032]" style={sidebarBtnStyle}>Accent</button>
                 </div>
                 <div className="flex gap-1">
                    <button className="flex-1 hover:bg-[#303032]" style={{...sidebarBtnStyle, fontSize: '9px', padding: '4px 2px'}}>Double Loop</button>
                    <button className="flex-1 hover:bg-[#303032]" style={{...sidebarBtnStyle, fontSize: '9px', padding: '4px 2px'}}>Duplicate</button>
                 </div>
                 <div className="flex gap-1">
                    <button className="flex-1 hover:bg-[#303032]" style={sidebarBtnStyle}>Convert</button>
                    <button className="flex-1 hover:bg-[#303032]" style={sidebarBtnStyle}>Delete</button>
                 </div>
                 <div className="flex gap-1">
                    <button className="flex-1 hover:bg-[#303032]" style={sidebarBtnStyle}>Octave ↑</button>
                    <div className="flex-1"></div>
                 </div>
                 <div className="flex gap-1">
                    <button className="flex-1 hover:bg-[#303032]" style={sidebarBtnStyle}>Octave ↓</button>
                    <div className="flex-1"></div>
                 </div>
                 <div className="flex gap-1 mt-auto">
                    <button className="flex-1 hover:bg-[#303032]" style={sidebarBtnStyle}>Shift</button>
                    <button className="flex-1 hover:bg-[#303032]" style={sidebarBtnStyle}>Settings</button>
                 </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
