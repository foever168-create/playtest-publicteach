
import React, { useState } from 'react';
import { EngagementLevel } from '../types';

interface FooterProps {
  onEngagement: (level: EngagementLevel) => void;
  onNote: (note: string) => void;
  isSessionActive: boolean;
  isReminderActive: boolean;
}

const Footer: React.FC<FooterProps> = ({ onEngagement, onNote, isSessionActive, isReminderActive }) => {
  const [noteText, setNoteText] = useState('');

  const handleSendNote = () => {
    if (noteText.trim()) {
      onNote(noteText.trim());
      setNoteText('');
    }
  };

  return (
    <footer className={`glass p-6 border-t-4 border-cyan-400 transition-all z-40 ${isReminderActive ? 'pulse-reminder' : ''}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-center">
        
        {/* Engagement Control */}
        <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
          <label className="text-xs font-black uppercase tracking-widest text-cyan-600">Engagement Level</label>
          <div className="flex bg-black p-1 gap-2">
            {(['high', 'medium', 'low'] as const).map((level) => {
              const colors = {
                high: 'text-cyan-400 border-cyan-400 hover:bg-cyan-400',
                medium: 'text-yellow-400 border-yellow-400 hover:bg-yellow-400',
                low: 'text-red-500 border-red-500 hover:bg-red-500'
              };
              const labels = { high: 'HIGH', medium: 'MID', low: 'LOW' };
              return (
                <button 
                  key={level}
                  onClick={() => onEngagement(level)}
                  disabled={!isSessionActive}
                  className={`flex-1 md:flex-none px-6 py-2 border-2 font-black text-sm transition-all hover:text-black disabled:opacity-20 ${colors[level]}`}
                >
                  {labels[level]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Qualitative Input */}
        <div className="flex-1 w-full relative">
          <input 
            type="text" 
            placeholder={isSessionActive ? "ENTER OBSERVATION DATA..." : "SYSTEM OFFLINE"}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            disabled={!isSessionActive}
            onKeyDown={(e) => e.key === 'Enter' && handleSendNote()}
            className="w-full bg-black border-4 border-cyan-400 px-6 py-4 text-sm font-bold focus:shadow-[0_0_15px_#00f2ff] focus:outline-none transition-all placeholder:text-cyan-900 text-cyan-400 uppercase tracking-widest"
          />
          <button 
            onClick={handleSendNote}
            disabled={!isSessionActive || !noteText.trim()}
            className="absolute right-3 top-2 bottom-2 px-4 bg-cyan-400 text-black font-black hover:bg-white disabled:bg-gray-800 disabled:text-gray-600 transition-colors uppercase italic"
          >
            SEND
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
