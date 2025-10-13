"use client";

import { useEffect, useMemo, useRef } from "react";

import { useCountdownTimer } from "@/hooks/use-countdown-timer";
import { useWorkshopStore, derivePhaseLabel } from "@/state/workshop-store";

type PresenterScreenProps = {
  workshopTitle: string;
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

export function PresenterScreen({ workshopTitle }: PresenterScreenProps) {
  const state = useWorkshopStore((store) => store.state);
  const countdown = useCountdownTimer(
    state?.remainingSeconds ?? 0,
    state?.timerRunning ?? false,
    state?.lastTickAt
  );
  const alarmTriggeredRef = useRef(false);

  useEffect(() => {
    if (!state || state.alarm.muted) return;
    if (countdown <= 0 && !alarmTriggeredRef.current) {
      alarmTriggeredRef.current = true;
      try {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.value = 440;
        const gain = audioContext.createGain();
        gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.2);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1.2);
      } catch (error) {
        console.warn("Kon alarmtoon niet afspelen", error);
      }
    }
    if (countdown > 0) {
      alarmTriggeredRef.current = false;
    }
  }, [countdown, state]);

  const slide = state?.slides[state.activeSlideIndex ?? 0];
  const displayMode = state?.displayMode ?? "standard";
  const phaseLabel = derivePhaseLabel(state?.phase ?? "idle");

  const description = useMemo(() => {
    if (!slide?.description) return null;
    return slide.description.split("\n");
  }, [slide?.description]);

  const baseClass =
    "flex min-h-screen flex-col items-center justify-between bg-neutral-900 px-12 py-16 text-white";

  if (!state) {
    return (
      <main className={`${baseClass} text-center`}>
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
            Presentatie-viewer
          </p>
          <h1 className="text-5xl font-semibold">{workshopTitle}</h1>
          <p className="text-sm text-white/60">
            Wacht op synchronisatie met het admin-dashboard.
          </p>
        </div>
      </main>
    );
  }

  if (displayMode === "focus") {
    return (
      <main className={`${baseClass} text-center`}> 
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-white/60">{phaseLabel}</h1>
          <div className="text-[12rem] font-semibold tabular-nums leading-none">
            {formatClock(countdown)}
          </div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">
            Focus modus
          </p>
        </div>
      </main>
    );
  }

  if (displayMode === "pause") {
    return (
      <main className={`${baseClass} text-center`}> 
        <div className="space-y-6">
          <h1 className="text-6xl font-semibold">Pauze</h1>
          <p className="text-xl text-white/60">
            Neem een moment, we starten weer over {formatClock(countdown)}.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={`${baseClass}`}> 
      <header className="flex w-full items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
            {workshopTitle}
          </p>
          <h1 className="text-4xl font-semibold">{slide?.title ?? "Sessies"}</h1>
        </div>
        <div className="text-right text-sm text-white/60">
          <p>{phaseLabel}</p>
          <p>{state.timerRunning ? "Lopend" : "Gepauzeerd"}</p>
        </div>
      </header>

      <section className="flex w-full flex-1 items-center justify-center">
        <div className="max-w-4xl text-center">
          <div className="text-[10rem] font-semibold tabular-nums leading-none">
            {formatClock(countdown)}
          </div>
          {description ? (
            <div className="mt-8 space-y-3 text-lg leading-relaxed text-white/80">
              {description.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <footer className="flex w-full items-center justify-between text-sm text-white/50">
        <div>
          <p>Slide {state.activeSlideIndex + 1} / {state.slides.length}</p>
        </div>
        <div className="text-right">
          <p>Volgende actie: gebruik pijltjes ← / →</p>
        </div>
      </footer>
    </main>
  );
}
