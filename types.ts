
export type TeachingMode = '講述教學' | '小組討論' | '實作/演算' | '數位運用' | '教師回饋' | '教師巡視';

export type TeachingAction = '正向鼓勵' | '糾正規範' | '開放提問' | '封閉提問' | '巡視走動';

export type EngagementLevel = 'high' | 'medium' | 'low';

export interface LogEntry {
  id: string;
  timestamp: number;
  type: 'mode' | 'action' | 'engagement' | 'note';
  name: string;
  value?: string | number;
  duration?: number;
}

export interface ObservationState {
  isSessionActive: boolean;
  startTime: number | null;
  endTime: number | null;
  currentMode: TeachingMode | null;
  modeDurations: Record<TeachingMode, number>;
  actionCounts: Record<TeachingAction, number>;
  logs: LogEntry[];
  lastInteractionTime: number;
}
