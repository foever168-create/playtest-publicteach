
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  isSessionActive: boolean;
  onToggleSession: () => void;
  subject: string;
  setSubject: (s: string) => void;
}

const Header: React.FC<HeaderProps> = ({ isSessionActive, onToggleSession, subject, setSubject }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString('zh-TW', { hour12: false }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('zh-TW', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b-4 border-cyan-400">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black italic tracking-tighter text-cyan-400 neon-text font-orbitron">
             CHRONOS
          </h1>
          <p className="text-cyan-400 text-[10px] font-bold tracking-[0.3em] uppercase">DIGITAL OBSERVATION v2.0</p>
        </div>
        
        <div className="hidden lg:block h-12 w-1 bg-cyan-400 transform skew-x-12" />
        
        <div className="relative">
          <select 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={isSessionActive}
            className="bg-black border-2 border-cyan-400 rounded-none px-6 py-2 text-sm font-bold outline-none focus:bg-cyan-900/20 transition-all text-cyan-400 uppercase tracking-widest"
          >
            {['國文', '英文', '數學', '自然', '社會', '體育', '藝術', '數位應用'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-3xl font-black text-cyan-400 tabular-nums font-orbitron neon-text">{time}</span>
          <span className="text-[10px] text-cyan-600 font-black uppercase tracking-widest">Live Sync</span>
        </div>

        <button 
          onClick={onToggleSession}
          className="relative group active:scale-90 transition-transform"
        >
          {isSessionActive ? (
            <div className="flex items-center gap-4 bg-black border-4 border-red-500 px-8 py-3 rounded-none text-red-500 hover:bg-red-500 hover:text-black transition-all font-black uppercase tracking-tighter shadow-[5px_5px_0px_#7f1d1d]">
               <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                  <rect x="4" y="4" width="16" height="16" />
               </svg>
               <span className="text-xl">Stop Observation</span>
            </div>
          ) : (
            <div className="flex items-center gap-4 bg-black border-4 border-cyan-400 px-8 py-3 rounded-none text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all font-black uppercase tracking-tighter shadow-[5px_5px_0px_#0066ff]">
               <div className="relative w-6 h-6 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="absolute animate-rotate-slow stroke-current fill-none">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" strokeDasharray="4 2" />
                  </svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" className="fill-current">
                    <path d="M5 3L21 12L5 21V3Z" />
                  </svg>
               </div>
               <span className="text-xl">Start Mission</span>
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
