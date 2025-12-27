
import React from 'react';
import { LogEntry } from '../types';

interface LogStreamProps {
  logs: LogEntry[];
}

const LogStream: React.FC<LogStreamProps> = ({ logs }) => {
  return (
    <div className="flex flex-col h-full bg-black">
      <div className="bg-cyan-400 p-2 text-xs text-black font-black uppercase tracking-widest flex justify-between">
        <span>Timeline</span>
        <span>Observation Event</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-cyan-900">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40">
              <rect x="3" y="4" width="18" height="18" rx="2" strokeDasharray="4 2" />
              <path d="M8 12h8m-8 4h4" />
            </svg>
            <p className="mt-4 font-black text-sm uppercase italic">Waiting for Input...</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-4 group items-start border-l-2 border-cyan-900 pl-4 hover:border-cyan-400 transition-colors">
              <span className="text-xs font-black font-orbitron text-cyan-700 pt-1 shrink-0 tabular-nums">
                {new Date(log.timestamp).toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <div className="flex flex-col min-w-0">
                <span className={`text-sm font-black uppercase tracking-tighter ${
                  log.type === 'action' ? 'text-white' : 
                  log.type === 'mode' ? 'text-cyan-400' : 
                  log.type === 'engagement' ? 'text-magenta-500' : 'text-cyan-200'
                }`}>
                  {log.name}
                </span>
                {log.value && (
                  <span className="text-xs text-cyan-800 font-bold uppercase truncate mt-1">
                    >> {log.value}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #00f2ff; border: 2px solid #000; }
      `}</style>
    </div>
  );
};

export default LogStream;
