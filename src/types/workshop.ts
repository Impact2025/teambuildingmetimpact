export type TimerPhase =
  | "idle"
  | "build"
  | "discuss"
  | "transition"
  | "pause"
  | "complete";

export type SlideKind =
  | "intro:who"
  | "intro:lsp"
  | "intro:house"
  | "session"
  | "pause"
  | "summary";

export type SlideDescriptor = {
  id: string;
  kind: SlideKind;
  sessionId?: string;
  title: string;
  subtitle?: string;
  description?: string;
};

export type AlarmStatus = {
  active: boolean;
  muted: boolean;
  snoozeUntil?: number | null;
};

export type WorkshopLiveState = {
  workshopId: string;
  activeSlideIndex: number;
  slides: SlideDescriptor[];
  activeSessionId?: string | null;
  phase: TimerPhase;
  remainingSeconds: number;
  totalSeconds: number;
  timerRunning: boolean;
  lastTickAt?: number;
  displayMode: "standard" | "focus" | "pause";
  alarm: AlarmStatus;
  updatedAt: number;
};

export type SyncMessage = {
  type:
    | "STATE_SYNC"
    | "SLIDE_CHANGE"
    | "TIMER_UPDATE"
    | "TIMER_CONTROL"
    | "ALARM"
    | "FOCUS_MODE";
  payload: WorkshopLiveState;
};
