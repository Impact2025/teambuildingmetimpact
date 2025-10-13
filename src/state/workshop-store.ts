import { create } from "zustand";

import type { SyncMessage, TimerPhase, WorkshopLiveState } from "@/types/workshop";

type WorkshopStoreState = {
  state: WorkshopLiveState | null;
  setState: (next: WorkshopLiveState) => void;
  updateFromMessage: (message: SyncMessage) => void;
  patchState: (partial: Partial<WorkshopLiveState>) => void;
  reset: () => void;
  publisher: ((message: SyncMessage) => void) | null;
  setPublisher: (publisher: ((message: SyncMessage) => void) | null) => void;
};

export const useWorkshopStore = create<WorkshopStoreState>((set, get) => ({
  state: null,
  publisher: null,
  setState: (next) => set({ state: next }),
  patchState: (partial) => {
    const current = get().state;
    if (!current) return;
    set({ state: { ...current, ...partial, updatedAt: Date.now() } });
  },
  updateFromMessage: (message) => {
    set({ state: { ...message.payload, updatedAt: Date.now() } });
  },
  reset: () => set({ state: null }),
  setPublisher: (publisher) => set({ publisher }),
}));

export const derivePhaseLabel = (phase: TimerPhase) => {
  switch (phase) {
    case "build":
      return "Bouwen";
    case "discuss":
      return "Bespreken";
    case "pause":
      return "Pauze";
    case "transition":
      return "Overgang";
    case "complete":
      return "Afgerond";
    default:
      return "Wachten";
  }
};
