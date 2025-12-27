
import React from 'react';
import { TeachingMode } from '../types';

interface ModeCardProps {
  mode: TeachingMode;
  isActive: boolean;
  duration: number;
  onClick: () => void;
  disabled: boolean;
}

const formatDuration = (s: number) => {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const ModeCard: React.FC<ModeCardProps> = ({ mode, isActive, duration, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative h-32 border-4 transition-all overflow-hidden flex flex-col justify-between p-4 group
        ${isActive 
          ? 'bg-cyan-400 text-black border-cyan-400 shadow-[8px_8px_0px_#0066ff]' 
          : 'bg-black border-cyan-400 text-cyan-400 hover:bg-cyan-900/20 shadow-[4px_4px_0px_#004466]'
        }
        ${disabled ? 'opacity-30 cursor-not-allowed border-gray-800' : 'cursor-pointer'}
      `}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 halftone-dots pointer-events-none 
        ${isActive ? 'text-cyan-600 opacity-40' : 'text-cyan-900 opacity-20'}
      `} />

      <span className={`text-lg font-black tracking-tighter uppercase leading-none z-10`}>
        {mode}
      </span>

      <div className="flex flex-col items-start z-10">
        <span className={`text-3xl font-black font-orbitron tabular-nums leading-none ${isActive ? 'text-black' : 'text-cyan-400'}`}>
          {formatDuration(duration)}
        </span>
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-80`}>
          Session Time
        </span>
      </div>

      {isActive && (
        <div className="absolute top-2 right-2 flex gap-1">
          <div className="w-2 h-2 bg-black rounded-none animate-ping" />
        </div>
      )}
    </button>
  );
};

export default ModeCard;
