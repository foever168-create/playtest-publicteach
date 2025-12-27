
import React from 'react';
import { TeachingAction } from '../types';

interface ActionButtonProps {
  action: TeachingAction;
  count: number;
  onClick: () => void;
  disabled: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ action, count, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-4 border-4 flex items-center gap-4 transition-all active:translate-x-1 active:translate-y-1
        ${disabled 
          ? 'opacity-20 border-gray-800 bg-transparent' 
          : 'border-cyan-400 bg-black hover:bg-cyan-400 hover:text-black shadow-[4px_4px_0px_#0066ff] group'
        }
      `}
    >
      <div className={`w-10 h-10 border-2 border-current flex items-center justify-center text-xl font-black font-orbitron`}>
        {count}
      </div>
      <span className="text-lg font-black uppercase tracking-tighter">{action}</span>
    </button>
  );
};

export default ActionButton;
