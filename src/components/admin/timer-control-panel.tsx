"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  completePhaseAction,
  setActiveSlideAction,
  setDisplayModeAction,
  snoozeTimerAction,
  startPhaseAction,
  updateTimerProgressAction,
  toggleAlarmMuteAction,
} from "@/actions/timer";
import { useCountdownTimer } from "@/hooks/use-countdown-timer";
import { useWorkshopStore, derivePhaseLabel } from "@/state/workshop-store";
import type { SlideDescriptor, WorkshopLiveState } from "@/types/workshop";

type SessionInfo = {
  id: string;
  title: string;
  order: number;
  buildDurationSec: number;
  discussDurationSec: number;
};

type TimerControlPanelProps = {
  workshopId: string;
  sessions: SessionInfo[];
  slides: SlideDescriptor[];
};

function formatClock(value: number) {
  const minutes = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function TimerControlPanel({
  workshopId,
  sessions,
  slides,
}: TimerControlPanelProps) {
  const workshopState = useWorkshopStore((state) => state.state);
  const publisher = useWorkshopStore((state) => state.publisher);
  const setStoreState = useWorkshopStore((state) => state.setState);
  const [error, setError] = useState<string | null>(null);

  const alarmMuted = workshopState?.alarm.muted ?? false;

  const activeSession = useMemo(() => {
    if (!workshopState?.activeSessionId) {
      return null;
    }
    return sessions.find((session) => session.id === workshopState.activeSessionId) ?? null;
  }, [sessions, workshopState?.activeSessionId]);

  const countdownSeconds = useCountdownTimer(
    workshopState?.remainingSeconds ?? 0,
    workshopState?.timerRunning ?? false,
    workshopState?.lastTickAt
  );

  useEffect(() => {
    if (workshopState?.timerRunning && countdownSeconds === 0 && activeSession) {
      completePhaseAction(workshopId, activeSession.id).then((next) => {
        if (publisher) {
          publisher({ type: "TIMER_UPDATE", payload: next });
        } else {
          setStoreState(next);
        }
      });
    }
  }, [activeSession, countdownSeconds, publisher, setStoreState, workshopId, workshopState?.timerRunning]);

  const syncState = useCallback(
    (state: WorkshopLiveState) => {
      if (publisher) {
        publisher({ type: "STATE_SYNC", payload: state });
      } else {
        setStoreState(state);
      }
    },
    [publisher, setStoreState]
  );

  const handleStartPhase = useCallback(
    async (sessionId: string, phase: "build" | "discuss") => {
      try {
        const next = await startPhaseAction(workshopId, sessionId, phase);
        syncState(next);
        setError(null);
      } catch (err) {
        setError("Kon timer niet starten. Probeer het opnieuw.");
      }
    },
    [syncState, workshopId]
  );

  const handlePause = useCallback(async () => {
    if (!activeSession) return;
    try {
      const next = await updateTimerProgressAction(
        workshopId,
        activeSession.id,
        countdownSeconds,
        false
      );
      syncState(next);
    } catch (err) {
      setError("Kon timer niet pauzeren.");
    }
  }, [activeSession, countdownSeconds, syncState, workshopId]);

  const handleResume = useCallback(async () => {
    if (!activeSession) return;
    try {
      const next = await updateTimerProgressAction(
        workshopId,
        activeSession.id,
        countdownSeconds,
        true
      );
      syncState(next);
    } catch (err) {
      setError("Kon timer niet hervatten.");
    }
  }, [activeSession, countdownSeconds, syncState, workshopId]);

  const handleSnooze = useCallback(
    async (seconds: number) => {
      if (!activeSession) return;
      try {
        const next = await snoozeTimerAction(workshopId, activeSession.id, seconds);
        syncState(next);
      } catch (err) {
        setError("Kon snooze niet toepassen.");
      }
    },
    [activeSession, syncState, workshopId]
  );

  const handleToggleMute = useCallback(async () => {
    if (!activeSession) return;
    try {
      const next = await toggleAlarmMuteAction(
        workshopId,
        activeSession.id,
        !alarmMuted
      );
      syncState(next);
    } catch (err) {
      setError("Kon alarm niet wijzigen.");
    }
  }, [activeSession, alarmMuted, syncState, workshopId]);

  const handleSlideChange = useCallback(
    async (index: number) => {
      try {
        const next = await setActiveSlideAction(workshopId, index);
        syncState(next);
        setError(null);
      } catch (err) {
        setError("Kon slide niet wijzigen.");
      }
    },
    [syncState, workshopId]
  );

  const handleDisplayMode = useCallback(
    async (mode: "standard" | "focus" | "pause") => {
      try {
        const next = await setDisplayModeAction(workshopId, mode);
        syncState(next);
      } catch (err) {
        setError("Kon weergave niet aanpassen.");
      }
    },
    [syncState, workshopId]
  );

  const activeSlideIndex = workshopState?.activeSlideIndex ?? 0;
  const phaseLabel = derivePhaseLabel(workshopState?.phase ?? "idle");
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        if (workshopState?.timerRunning) {
          handlePause();
        } else {
          handleResume();
        }
      }

      if (event.key === "n" || event.key === "N") {
        event.preventDefault();
        handleSlideChange(Math.min(activeSlideIndex + 1, slides.length - 1));
      }

      if (event.key === "p" || event.key === "P") {
        event.preventDefault();
        handleSlideChange(Math.max(activeSlideIndex - 1, 0));
      }

      if (event.key === "s" || event.key === "S") {
        event.preventDefault();
        handleSnooze(60);
      }

      if (event.key === "m" || event.key === "M") {
        event.preventDefault();
        handleToggleMute();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    activeSlideIndex,
    handlePause,
    handleResume,
    handleSlideChange,
    handleSnooze,
    handleToggleMute,
    slides.length,
    workshopState?.timerRunning,
  ]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Actieve slide
            </p>
            <h2 className="text-xl font-semibold text-neutral-900">
              {slides[activeSlideIndex]?.title ?? "Geen slide"}
            </h2>
            <p className="text-sm text-neutral-500">
              {phaseLabel} — {activeSession?.title ?? "Nog geen sessie"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleDisplayMode("standard")}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600 hover:border-neutral-400"
            >
              Standaard
            </button>
            <button
              type="button"
              onClick={() => handleDisplayMode("focus")}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600 hover:border-neutral-400"
            >
              Focus modus
            </button>
            <button
              type="button"
              onClick={() => handleDisplayMode("pause")}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600 hover:border-neutral-400"
            >
              Pauze slide
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col items-center justify-center rounded-3xl bg-neutral-900 px-10 py-12 text-white shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              Hoofdtimer
            </p>
            <div className="mt-6 text-[5rem] font-semibold tabular-nums leading-none">
              {formatClock(countdownSeconds)}
            </div>
            <div className="mt-4 flex gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              <span>Fase: {phaseLabel}</span>
              <span>Status: {workshopState?.timerRunning ? "Lopend" : "Gepauzeerd"}</span>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => activeSession && handleStartPhase(activeSession.id, "build")}
                className="rounded-full bg-white px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-neutral-900 shadow-sm"
              >
                Start bouwfase
              </button>
              <button
                type="button"
                onClick={() => activeSession && handleStartPhase(activeSession.id, "discuss")}
                className="rounded-full bg-white/20 px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white"
              >
                Start bespreekfase
              </button>
              {workshopState?.timerRunning ? (
                <button
                  type="button"
                  onClick={handlePause}
                  className="rounded-full border border-white/30 px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white"
                >
                  Pauzeer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResume}
                  className="rounded-full border border-white/30 px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white"
                >
                  Hervat
                </button>
              )}
              <button
                type="button"
                onClick={() => handleSnooze(60)}
                className="rounded-full border border-white/30 px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white"
              >
                Snooze 60s
              </button>
              <button
                type="button"
                onClick={handleToggleMute}
                className={`rounded-full border px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] ${
                  alarmMuted
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/30 text-white"
                }`}
              >
                {alarmMuted ? "Alarm dempen uit" : "Mute"}
              </button>
            </div>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white px-4 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Slides
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {slides.map((slide, index) => (
                <li key={slide.id}>
                  <button
                    type="button"
                    onClick={() => handleSlideChange(index)}
                    className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                      index === activeSlideIndex
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    <span className="block text-xs uppercase tracking-[0.2em] text-neutral-400">
                      {slide.kind}
                    </span>
                    <span className="text-sm font-semibold">{slide.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <header className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Sessies bedienen</h3>
            <p className="text-sm text-neutral-500">
              Kies een sessie om fasen te starten of direct naar de slide te springen.
            </p>
          </div>
        </header>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`rounded-2xl border px-4 py-4 ${
                session.id === activeSession?.id
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-neutral-50"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em]">
                Sessie {session.order + 1}
              </p>
              <h4 className="mt-1 text-sm font-semibold">{session.title}</h4>
              <div className="mt-3 flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.2em]">
                <button
                  type="button"
                  onClick={() => handleStartPhase(session.id, "build")}
                  className="rounded-full border border-current px-3 py-1"
                >
                  Bouw {formatClock(session.buildDurationSec)}
                </button>
                <button
                  type="button"
                  onClick={() => handleStartPhase(session.id, "discuss")}
                  className="rounded-full border border-current px-3 py-1"
                >
                  Bespreek {formatClock(session.discussDurationSec)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {error ? (
        <p className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
