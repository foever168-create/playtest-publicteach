
import React from 'react';
import { ObservationState, TeachingMode, TeachingAction } from '../types';

interface ReportModalProps {
  state: ObservationState;
  subject: string;
  onClose: () => void;
  onReset: () => void;
}

const formatDuration = (s: number) => {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}M ${secs}S`;
};

const ReportModal: React.FC<ReportModalProps> = ({ state, subject, onClose, onReset }) => {
  
  const generateFormattedText = () => {
    let text = `[ CHRONOS OBSERVATION REPORT ]\n`;
    text += `SUBJECT: ${subject}\n`;
    text += `START: ${new Date(state.startTime!).toLocaleString()}\n`;
    text += `END: ${new Date(state.endTime!).toLocaleString()}\n`;
    text += `==================================\n`;
    text += `[ MODES ]\n`;
    (Object.entries(state.modeDurations) as [TeachingMode, number][]).forEach(([mode, dur]) => {
      text += `${mode}: ${formatDuration(dur)}\n`;
    });
    text += `\n[ ACTIONS ]\n`;
    (Object.entries(state.actionCounts) as [TeachingAction, number][]).forEach(([act, count]) => {
      text += `${act}: ${count}\n`;
    });
    return text;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateFormattedText());
    alert('DATA COPIED TO CLIPBOARD');
  };

  const downloadTxt = () => {
    const text = generateFormattedText();
    const blob = new Blob(["\uFEFF" + text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LOG_${subject}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-black w-full max-w-2xl max-h-[90vh] rounded-none border-8 border-cyan-400 flex flex-col shadow-[20px_20px_0px_#0066ff]">
        <div className="p-8 border-b-4 border-cyan-400 flex justify-between items-center bg-cyan-400">
          <div>
            <h2 className="text-4xl font-black text-black italic tracking-tighter">MISSION COMPLETE</h2>
            <p className="text-xs text-black font-bold uppercase tracking-widest">Post-Observation Analytics</p>
          </div>
          <button onClick={onClose} className="p-2 text-black hover:rotate-90 transition-transform">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 relative">
          <div className="absolute inset-0 halftone-dots pointer-events-none text-cyan-900/10" />
          
          <div className="grid grid-cols-2 gap-6 relative z-10">
            <div className="bg-black p-6 border-4 border-cyan-400 shadow-[6px_6px_0px_#0066ff]">
              <span className="text-xs font-black text-cyan-600 uppercase tracking-widest">Total Duration</span>
              <p className="text-4xl font-black font-orbitron text-cyan-400 mt-2">
                {formatDuration(Math.floor((state.endTime! - state.startTime!) / 1000))}
              </p>
            </div>
            <div className="bg-black p-6 border-4 border-cyan-400 shadow-[6px_6px_0px_#0066ff]">
              <span className="text-xs font-black text-cyan-600 uppercase tracking-widest">Subject</span>
              <p className="text-4xl font-black text-white mt-2">{subject}</p>
            </div>
          </div>

          <div className="relative z-10">
             <h3 className="text-xl font-black text-cyan-400 mb-4 flex items-center gap-3">
                <div className="w-4 h-4 bg-cyan-400" /> Mode Analytics
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {(Object.entries(state.modeDurations) as [TeachingMode, number][]).map(([mode, dur]) => (
                 <div key={mode} className="flex items-center justify-between p-3 border-2 border-cyan-900 bg-cyan-950/20">
                   <span className="text-cyan-700 font-bold uppercase text-xs">{mode}</span>
                   <span className="font-black font-orbitron text-cyan-400">{formatDuration(dur)}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>

        <div className="p-8 bg-black border-t-4 border-cyan-400 flex flex-wrap gap-4 relative z-10">
          <button 
            onClick={copyToClipboard}
            className="flex-1 min-w-[150px] py-4 px-6 border-4 border-cyan-400 text-cyan-400 font-black text-lg hover:bg-cyan-400 hover:text-black transition-all shadow-[6px_6px_0px_#0066ff] active:translate-x-1 active:translate-y-1"
          >
            COPY DATA
          </button>
          <button 
            onClick={downloadTxt}
            className="flex-1 min-w-[150px] py-4 px-6 bg-cyan-400 text-black font-black text-lg hover:bg-white transition-all shadow-[6px_6px_0px_#0066ff] active:translate-x-1 active:translate-y-1"
          >
            DOWNLOAD LOG
          </button>
          <button 
            onClick={onReset}
            className="w-full py-4 px-6 border-4 border-red-500 text-red-500 font-black text-lg hover:bg-red-500 hover:text-black transition-all shadow-[6px_6px_0px_#7f1d1d] active:translate-x-1 active:translate-y-1"
          >
            NEW MISSION
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
