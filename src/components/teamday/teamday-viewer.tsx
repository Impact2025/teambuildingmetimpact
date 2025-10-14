"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  FACILITATOR_TIPS,
  TEAMDAY_META,
  TEAMDAY_SESSIONS,
  type TeamdayActivity,
  type TeamdaySession,
} from "@/lib/teamday-program";

type TimerOption = {
  id: string;
  label: string;
  durationSec: number;
  description?: string;
  source?: TeamdayActivity;
};

function formatRange(session: TeamdaySession) {
  return `${session.timeslot.start} – ${session.timeslot.end}`;
}

function formatMinutesLabel(minutes: number) {
  return minutes === 1 ? "1 minuut" : `${minutes} minuten`;
}

function formatSeconds(seconds: number) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.max(0, seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

function formatDurationLabel(seconds: number) {
  if (seconds % 60 === 0) {
    const minutes = seconds / 60;
    return formatMinutesLabel(minutes);
  }
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (minutes === 0) {
    return `${remainder} seconden`;
  }
  return `${minutes} min ${remainder} sec`;
}

function buildTimerOptions(session: TeamdaySession): TimerOption[] {
  const base: TimerOption[] = [];
  const sessionDurationSec = Math.max(60, Math.round(session.timeslot.totalMinutes * 60));

  base.push({
    id: `${session.id}-total`,
    label: `Volledige sessie (${formatMinutesLabel(session.timeslot.totalMinutes)})`,
    durationSec: sessionDurationSec,
  });

  session.activities?.forEach((activity) => {
    if (!activity.durationSec) {
      return;
    }
    base.push({
      id: activity.id,
      label: `${activity.title} (${formatDurationLabel(activity.durationSec)})`,
      durationSec: activity.durationSec,
      description: activity.description,
      source: activity,
    });
  });

  return base;
}

export function TeamdayViewer() {
  const sessions = TEAMDAY_SESSIONS;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSession = sessions[activeIndex];

  const timerOptions = useMemo(() => buildTimerOptions(activeSession), [activeSession]);
  const [selectedTimerId, setSelectedTimerId] = useState<string>(() => timerOptions[0]?.id ?? "");
  const [remainingSeconds, setRemainingSeconds] = useState<number>(timerOptions[0]?.durationSec ?? 0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const playlistOpenedRef = useRef(false);
  const [musicReminderActive, setMusicReminderActive] = useState(false);
  const [currentTip, setCurrentTip] = useState<string | null>(null);

  useEffect(() => {
    const firstOption = timerOptions[0];
    setSelectedTimerId(firstOption?.id ?? "");
    setRemainingSeconds(firstOption?.durationSec ?? 0);
    setRunning(false);
    playlistOpenedRef.current = false;
    setMusicReminderActive(false);
  }, [timerOptions]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setRunning(false);
          setMusicReminderActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  const selectedTimer = useMemo(
    () => timerOptions.find((option) => option.id === selectedTimerId) ?? timerOptions[0],
    [selectedTimerId, timerOptions]
  );

  const progress = Math.round(((activeIndex + 1) / sessions.length) * 100);

  const handleTimerSelection = (id: string) => {
    const option = timerOptions.find((item) => item.id === id);
    if (!option) return;
    setSelectedTimerId(option.id);
    setRemainingSeconds(option.durationSec);
    setRunning(false);
    playlistOpenedRef.current = false;
    setMusicReminderActive(false);
  };

  const handleStart = () => {
    if (!selectedTimer) return;
    if (remainingSeconds <= 0) {
      setRemainingSeconds(selectedTimer.durationSec);
    }
    setRunning(true);
    setMusicReminderActive(true);
    if (!playlistOpenedRef.current && typeof window !== "undefined") {
      try {
        window.open(TEAMDAY_META.playlistUrl, "_blank", "noopener,noreferrer");
        playlistOpenedRef.current = true;
      } catch (error) {
        console.warn("Kon Spotify-playlist niet openen", error);
      }
    }
  };

  const handlePause = () => {
    setRunning(false);
  };

  const handleReset = () => {
    if (!selectedTimer) return;
    setRunning(false);
    setRemainingSeconds(selectedTimer.durationSec);
    setMusicReminderActive(false);
    playlistOpenedRef.current = false;
  };

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, sessions.length - 1));
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleRandomTip = () => {
    if (!FACILITATOR_TIPS.length) {
      setCurrentTip(null);
      return;
    }
    const nextTip = FACILITATOR_TIPS[Math.floor(Math.random() * FACILITATOR_TIPS.length)];
    setCurrentTip(nextTip);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="space-y-6 rounded-3xl border border-white/10 bg-neutral-900/70 px-6 py-6 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                Teambuilding met Impact – Teamdag viewer
              </p>
              <h1 className="mt-2 text-3xl font-semibold">Programma-overzicht {TEAMDAY_META.dateLabel}</h1>
              <p className="mt-2 text-sm text-white/60">
                {TEAMDAY_META.organisations.join(" & ")} • Facilitator: {TEAMDAY_META.facilitator.name} ({TEAMDAY_META.facilitator.title})
              </p>
              <p className="text-sm text-white/60">
                Locaties: {TEAMDAY_META.locations.join(" → ")}
              </p>
            </div>
            <div className="flex items-center gap-3 self-start rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/70">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-lg font-semibold text-emerald-300">
                {activeIndex + 1}
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Huidige onderdeel</p>
                <p className="font-semibold">{formatRange(activeSession)}</p>
                <p className="text-xs text-white/50">{activeSession.title}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Start</span>
              <span>Finish</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-emerald-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-right text-xs text-white/50">{activeIndex + 1} / {sessions.length} onderdelen</p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <aside className="space-y-4">
            <nav className="space-y-3 rounded-3xl border border-white/10 bg-neutral-900/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                Tijdlijn
              </p>
              <ol className="space-y-2">
                {sessions.map((session, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <li key={session.id}>
                      <button
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                          isActive
                            ? "border-emerald-400 bg-emerald-400/20 text-white"
                            : "border-white/10 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10"
                        }`}
                      >
                        <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                          {session.timeslot.start} – {session.timeslot.end}
                        </p>
                        <p className="text-sm font-semibold">{session.title}</p>
                        {session.subtitle ? (
                          <p className="text-xs text-white/50">{session.subtitle}</p>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-4 text-sm text-white/70">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Snelle bediening</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex-1 rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/40 hover:bg-white/10 disabled:border-white/10 disabled:text-white/30"
                  disabled={activeIndex === 0}
                >
                  Vorige
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 rounded-2xl border border-emerald-400/60 bg-emerald-400/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100 transition hover:border-emerald-300 hover:bg-emerald-400/30 disabled:border-white/10 disabled:bg-white/5 disabled:text-white/30"
                  disabled={activeIndex === sessions.length - 1}
                >
                  Volgende
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-4 text-sm text-white/70">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Playlist</p>
              <p className="mt-2 text-xs text-white/60">
                Start bij iedere bouwfase de afspeellijst “Teambuilding met Impact” voor extra energie.
              </p>
              <a
                href={TEAMDAY_META.playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center rounded-2xl border border-emerald-400/60 bg-emerald-400/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100 transition hover:border-emerald-300 hover:bg-emerald-400/30"
              >
                Open Spotify
              </a>
            </div>
          </aside>

          <section className="space-y-6">
            <article className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
                    {formatRange(activeSession)}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">{activeSession.title}</h2>
                  {activeSession.subtitle ? (
                    <p className="text-sm text-white/60">{activeSession.subtitle}</p>
                  ) : null}
                </div>
                <div className="text-right text-sm text-white/60">
                  <p>{activeSession.location}</p>
                  {activeSession.attendees ? (
                    <p>Aanwezig: {activeSession.attendees.join(", ")}</p>
                  ) : null}
                </div>
              </div>
              {activeSession.overview ? (
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  {activeSession.overview.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 h-2 w-2 flex-none rounded-full bg-emerald-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>

            {activeSession.script?.length ? (
              <section className="space-y-4">
                {activeSession.script.map((block) => (
                  <div
                    key={block.label}
                    className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{block.label}</p>
                    <div className="mt-3 space-y-2">
                      {block.lines.map((line, index) => (
                        <p key={`${block.label}-${index}`}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ) : null}

            {activeSession.activities?.length ? (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
                  Activiteiten & cues
                </h3>
                <div className="space-y-3">
                  {activeSession.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="rounded-3xl border border-white/10 bg-neutral-900/80 p-5 text-sm text-white/70"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-base font-semibold text-white">{activity.title}</p>
                        {activity.durationSec ? (
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
                            {formatDurationLabel(activity.durationSec)}
                          </span>
                        ) : null}
                      </div>
                      {activity.description ? (
                        <p className="mt-2 text-white/60">{activity.description}</p>
                      ) : null}
                      {activity.prompts?.length ? (
                        <ul className="mt-3 space-y-2">
                          {activity.prompts.map((prompt) => (
                            <li key={prompt} className="flex gap-2">
                              <span className="mt-1 h-2 w-2 flex-none rounded-full bg-emerald-300" />
                              <span>{prompt}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {activity.reminders?.length ? (
                        <div className="mt-3 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-100">
                          <p className="font-semibold uppercase tracking-[0.2em]">Reminder</p>
                          <ul className="mt-2 space-y-1">
                            {activity.reminders.map((reminder) => (
                              <li key={reminder}>{reminder}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-neutral-900/80 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Timer</p>
                    <h3 className="text-lg font-semibold text-white">{selectedTimer?.label ?? "Geen timer beschikbaar"}</h3>
                  </div>
                  {selectedTimer ? (
                    <p className="text-sm text-white/60">{formatDurationLabel(selectedTimer.durationSec)}</p>
                  ) : null}
                </div>

                {timerOptions.length > 1 ? (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">Selecteer onderdeel</p>
                    <div className="space-y-2">
                      {timerOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleTimerSelection(option.id)}
                          className={`w-full rounded-2xl border px-3 py-2 text-left text-xs transition ${
                            option.id === selectedTimerId
                              ? "border-emerald-400 bg-emerald-400/20 text-white"
                              : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-6 flex flex-col items-center gap-4">
                  <div className="text-6xl font-semibold tabular-nums text-white">
                    {formatSeconds(remainingSeconds)}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleStart}
                      className="rounded-2xl border border-emerald-400/70 bg-emerald-400/20 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100 transition hover:border-emerald-300 hover:bg-emerald-400/30"
                    >
                      Start
                    </button>
                    <button
                      type="button"
                      onClick={handlePause}
                      className="rounded-2xl border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:border-white/40 hover:bg-white/10"
                    >
                      Pauze
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/60 transition hover:border-white/30 hover:bg-white/10"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {musicReminderActive ? (
                  <div className="mt-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-100">
                    <p className="font-semibold uppercase tracking-[0.2em]">Muziek reminder</p>
                    <p className="mt-2 text-emerald-50">
                      Timer loopt — zet de playlist “Teambuilding met Impact” aan voor sfeer.
                    </p>
                    <a
                      href={TEAMDAY_META.playlistUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center justify-center rounded-xl border border-emerald-400/60 bg-emerald-400/20 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-emerald-100 transition hover:border-emerald-300 hover:bg-emerald-400/30"
                    >
                      Open playlist
                    </a>
                  </div>
                ) : null}
              </div>

              <div className="rounded-3xl border border-white/10 bg-neutral-900/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  Facilitator tip
                </p>
                <div className="mt-3 min-h-[84px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                  {currentTip ? currentTip : "Klik op ‘Toon tip’ voor inspiratie tijdens de sessie."}
                </div>
                <button
                  type="button"
                  onClick={handleRandomTip}
                  className="mt-4 inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/40 hover:bg-white/10"
                >
                  Toon tip
                </button>
              </div>
            </section>

            {activeSession.reflection?.length ? (
              <section className="rounded-3xl border border-white/10 bg-neutral-900/80 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">Reflectievragen</h3>
                <ul className="mt-3 space-y-2 text-sm text-white/70">
                  {activeSession.reflection.map((question) => (
                    <li key={question} className="flex gap-2">
                      <span className="mt-1 h-2 w-2 flex-none rounded-full bg-emerald-400" />
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {activeSession.transitions?.length || activeSession.notes?.length ? (
              <section className="grid gap-4 lg:grid-cols-2">
                {activeSession.transitions?.length ? (
                  <div className="rounded-3xl border border-white/10 bg-neutral-900/80 p-5">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">Overgangen</h3>
                    <ul className="mt-3 space-y-2 text-sm text-white/70">
                      {activeSession.transitions.map((transition) => (
                        <li key={transition} className="flex gap-2">
                          <span className="mt-1 h-2 w-2 flex-none rounded-full bg-white/40" />
                          <span>{transition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {activeSession.notes?.length ? (
                  <div className="rounded-3xl border border-white/10 bg-neutral-900/80 p-5">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">Notities & opties</h3>
                    <ul className="mt-3 space-y-2 text-sm text-white/70">
                      {activeSession.notes.map((note) => (
                        <li key={note} className="flex gap-2">
                          <span className="mt-1 h-2 w-2 flex-none rounded-full bg-white/40" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
