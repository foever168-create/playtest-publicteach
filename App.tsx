
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import ModeCard from './components/ModeCard';
import ActionButton from './components/ActionButton';
import LogStream from './components/LogStream';
import Footer from './components/Footer';
import ReportModal from './components/ReportModal';
import { TeachingMode, TeachingAction, LogEntry, ObservationState, EngagementLevel } from './types';

const INITIAL_STATE: ObservationState = {
  isSessionActive: false,
  startTime: null,
  endTime: null,
  currentMode: null,
  modeDurations: {
    '講述教學': 0,
    '小組討論': 0,
    '實作/演算': 0,
    '數位運用': 0,
    '教師回饋': 0,
    '教師巡視': 0,
  },
  actionCounts: {
    '正向鼓勵': 0,
    '糾正規範': 0,
    '開放提問': 0,
    '封閉提問': 0,
    '巡視走動': 0,
  },
  logs: [],
  lastInteractionTime: Date.now(),
};

const App: React.FC = () => {
  const [state, setState] = useState<ObservationState>(INITIAL_STATE);
  const [subject, setSubject] = useState<string>('國文');
  const [showReport, setShowReport] = useState(false);
  const [isReminderActive, setIsReminderActive] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (state.isSessionActive && now - state.lastInteractionTime > 300000) {
        setIsReminderActive(true);
      } else {
        setIsReminderActive(false);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [state.isSessionActive, state.lastInteractionTime]);

  useEffect(() => {
    if (state.isSessionActive && state.currentMode) {
      timerRef.current = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          modeDurations: {
            ...prev.modeDurations,
            [prev.currentMode!]: prev.modeDurations[prev.currentMode!] + 1,
          }
        }));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isSessionActive, state.currentMode]);

  const toggleSession = () => {
    if (!state.isSessionActive) {
      setState(prev => ({
        ...prev,
        isSessionActive: true,
        startTime: Date.now(),
        lastInteractionTime: Date.now(),
        logs: [{
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          type: 'note',
          name: '開始觀課',
          value: subject
        }, ...prev.logs]
      }));
    } else {
      setState(prev => ({
        ...prev,
        isSessionActive: false,
        endTime: Date.now(),
        currentMode: null,
      }));
      setShowReport(true);
    }
  };

  const addLog = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const now = Date.now();
    setState(prev => ({
      ...prev,
      lastInteractionTime: now,
      logs: [{
        id: Math.random().toString(36).substr(2, 9),
        timestamp: now,
        ...entry
      }, ...prev.logs]
    }));
  };

  const handleModeToggle = (mode: TeachingMode) => {
    if (!state.isSessionActive) return;
    setState(prev => ({
      ...prev,
      currentMode: prev.currentMode === mode ? null : mode,
      lastInteractionTime: Date.now()
    }));
    addLog({
      type: 'mode',
      name: state.currentMode === mode ? `結束 ${mode}` : `切換至 ${mode}`
    });
  };

  const handleAction = (action: TeachingAction) => {
    if (!state.isSessionActive) return;
    setState(prev => ({
      ...prev,
      actionCounts: {
        ...prev.actionCounts,
        [action]: prev.actionCounts[action] + 1
      },
      lastInteractionTime: Date.now()
    }));
    addLog({
      type: 'action',
      name: action
    });
  };

  const handleEngagement = (level: EngagementLevel) => {
    if (!state.isSessionActive) return;
    const label = level === 'high' ? '高' : level === 'medium' ? '中' : '低';
    addLog({
      type: 'engagement',
      name: `專注度: ${label}`,
      value: level
    });
    setIsReminderActive(false);
  };

  const handleNote = (note: string) => {
    if (!state.isSessionActive) return;
    addLog({
      type: 'note',
      name: '質性筆記',
      value: note
    });
  };

  const resetSession = () => {
    setState(INITIAL_STATE);
    setShowReport(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-cyan-400 overflow-hidden">
      <Header 
        isSessionActive={state.isSessionActive}
        onToggleSession={toggleSession}
        subject={subject}
        setSubject={setSubject}
      />

      <main className="flex-1 flex flex-col md:flex-row p-4 gap-6 overflow-hidden">
        {/* Left: Teaching Modes */}
        <section className="flex-1 space-y-6">
          <h2 className="text-cyan-400 font-black text-2xl uppercase tracking-tighter flex items-center gap-3 neon-text">
            <div className="w-8 h-8 bg-cyan-400 rounded-sm transform rotate-45" />
            教學模式 STATES
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {(['講述教學', '小組討論', '實作/演算', '數位運用', '教師回饋', '教師巡視'] as TeachingMode[]).map(mode => (
              <ModeCard 
                key={mode}
                mode={mode}
                isActive={state.currentMode === mode}
                duration={state.modeDurations[mode]}
                onClick={() => handleModeToggle(mode)}
                disabled={!state.isSessionActive}
              />
            ))}
          </div>
          
          <div className="mt-12">
             <h2 className="text-cyan-400 font-black text-2xl uppercase tracking-tighter flex items-center gap-3 mb-6 neon-text">
              <div className="w-8 h-8 border-4 border-cyan-400 rounded-full" />
              教學行為 ACTIONS
            </h2>
            <div className="flex flex-wrap gap-4">
              {(['正向鼓勵', '糾正規範', '開放提問', '封閉提問', '巡視走動'] as TeachingAction[]).map(action => (
                <ActionButton 
                  key={action}
                  action={action}
                  count={state.actionCounts[action]}
                  onClick={() => handleAction(action)}
                  disabled={!state.isSessionActive}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Right: Log Stream */}
        <section className="flex-1 md:max-w-md h-full flex flex-col space-y-4">
          <h2 className="text-cyan-400 font-black text-2xl uppercase tracking-tighter flex items-center gap-3 neon-text">
             <div className="w-8 h-2 bg-cyan-400" />
             即時紀錄 LOG
          </h2>
          <div className="flex-1 glass rounded-none border-4 border-cyan-400 overflow-hidden relative">
            <div className="absolute inset-0 halftone-dots pointer-events-none text-cyan-900" />
            <LogStream logs={state.logs} />
          </div>
        </section>
      </main>

      <Footer 
        onEngagement={handleEngagement}
        onNote={handleNote}
        isSessionActive={state.isSessionActive}
        isReminderActive={isReminderActive}
      />

      {showReport && (
        <ReportModal 
          state={state} 
          subject={subject}
          onClose={() => setShowReport(false)}
          onReset={resetSession}
        />
      )}
    </div>
  );
};

export default App;
