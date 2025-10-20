"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";

import type { TeamdayActivity, TeamdayProgram, TeamdaySession } from "@/lib/teamday-program";
import type { TeamdayUploadRecord } from "@/lib/teamday-uploads";

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

type TeamdayUploadItem = {
  id: string;
  sessionKey: string;
  title: string | null;
  notes: string | null;
  tags: string[];
  uploadedBy: string | null;
  createdAt: string;
  url: string;
};

type TeamdayUploadLike = TeamdayUploadRecord | (Omit<TeamdayUploadRecord, "createdAt"> & { createdAt: string });

function mapUploadRecord(record: TeamdayUploadLike): TeamdayUploadItem {
  return {
    id: record.id,
    sessionKey: record.sessionKey,
    title: record.title ?? null,
    notes: record.notes ?? null,
    tags: record.tags ?? [],
    uploadedBy: record.uploadedBy ?? null,
    createdAt:
      typeof record.createdAt === "string"
        ? record.createdAt
        : record.createdAt.toISOString(),
    url: record.url,
  };
}

function formatUploadTimestamp(iso: string) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(date);
}

type SessionUploadFormProps = {
  sessionId: string;
  onUploaded: (upload: TeamdayUploadItem) => void;
};

function SessionUploadForm({ sessionId, onUploaded }: SessionUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setNotes("");
    setTagsInput("");
    setUploadedBy("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!file) {
      setError("Kies of maak eerst een foto.");
      return;
    }

    const formData = new FormData();
    formData.append("sessionId", sessionId);
    formData.append("file", file);
    formData.append("title", title);
    formData.append("notes", notes);
    formData.append("uploadedBy", uploadedBy);
    formData.append("tags", tagsInput);

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/teamday/uploads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Opslaan mislukt");
      }

      const body = await response.json();
      const upload = mapUploadRecord(body.upload);
      onUploaded(upload);
      setSuccess("Foto opgeslagen bij deze sessie.");
      resetForm();
    } catch (err: any) {
      setError(err.message ?? "Er ging iets mis");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
        Titel (optioneel)
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Bijv. Happy object van team blauw"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
      </label>

      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
        Notities
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          placeholder="Wat gebeurt hier? Welke inzichten wil je later onthouden?"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
      </label>

      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
        Tags (comma)
        <input
          type="text"
          value={tagsInput}
          onChange={(event) => setTagsInput(event.target.value)}
          placeholder="verbinding, quote, aha"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
      </label>

      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
        Door wie (optioneel)
        <input
          type="text"
          value={uploadedBy}
          onChange={(event) => setUploadedBy(event.target.value)}
          placeholder="Bijv. Vincent"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
      </label>

      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
        Foto
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="mt-2 w-full text-sm text-white"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        <p className="mt-2 text-[0.7rem] text-white/50">Werkt ook rechtstreeks met de camera van je telefoon.</p>
        {file ? (
          <p className="mt-1 text-[0.7rem] text-white/40">Geselecteerd: {file.name}</p>
        ) : null}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-300"
      >
        {isSubmitting ? "Opslaan..." : "Uploaden"}
      </button>

      {success ? (
        <p className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-100">
          {success}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
          {error}
        </p>
      ) : null}
    </form>
  );
}

function SessionUploadCard({ upload }: { upload: TeamdayUploadItem }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="relative aspect-video bg-neutral-800">
        <img
          src={upload.url}
          alt={upload.title ?? "Teamdag upload"}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-2 px-4 py-3 text-sm text-white/70">
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>{formatUploadTimestamp(upload.createdAt)}</span>
          {upload.uploadedBy ? <span>{upload.uploadedBy}</span> : null}
        </div>
        {upload.title ? <p className="text-base font-semibold text-white">{upload.title}</p> : null}
        {upload.notes ? <p>{upload.notes}</p> : null}
        {upload.tags?.length ? (
          <div className="flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-white/50">
            {upload.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 px-3 py-1">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

type SessionUploadsProps = {
  sessionId: string;
  uploads: TeamdayUploadItem[];
  onUploadAdded: (upload: TeamdayUploadItem) => void;
};

function SessionUploads({ sessionId, uploads, onUploadAdded }: SessionUploadsProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-white/10 bg-neutral-900/80 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Foto’s & verslag</p>
          <p className="text-sm text-white/60">Leg de creaties van deze sessie vast met korte notities.</p>
        </div>
      </div>

      <SessionUploadForm sessionId={sessionId} onUploaded={onUploadAdded} />

      {uploads.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {uploads.map((upload) => (
            <SessionUploadCard key={upload.id} upload={upload} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-white/50">
          Nog geen foto’s geüpload voor deze sessie.
        </p>
      )}
    </section>
  );
}

type TeamdayViewerProps = {
  program: TeamdayProgram;
  tips: string[];
  initialUploads: Record<string, TeamdayUploadRecord[]>;
};

export function TeamdayViewer({ program, tips, initialUploads }: TeamdayViewerProps) {
  const sessions = program.sessions;
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedTimerId, setSelectedTimerId] = useState<string>("");
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const playlistOpenedRef = useRef(false);
  const [musicReminderActive, setMusicReminderActive] = useState(false);
  const [currentTip, setCurrentTip] = useState<string | null>(null);
  const [uploadsBySession, setUploadsBySession] = useState<Record<string, TeamdayUploadItem[]>>(() => {
    const mapped: Record<string, TeamdayUploadItem[]> = {};
    for (const [key, list] of Object.entries(initialUploads)) {
      mapped[key] = list.map((upload) => mapUploadRecord(upload));
    }
    return mapped;
  });

  const handleUploadAdded = useCallback((sessionId: string, upload: TeamdayUploadItem) => {
    setUploadsBySession((prev) => {
      const current = prev[sessionId] ?? [];
      return {
        ...prev,
        [sessionId]: [upload, ...current],
      };
    });
  }, []);

  const hasSessions = sessions.length > 0;
  const safeIndex = hasSessions ? Math.min(activeIndex, sessions.length - 1) : 0;
  const activeSession = hasSessions ? sessions[safeIndex] : null;

  useEffect(() => {
    if (!hasSessions) {
      setActiveIndex(0);
      return;
    }
    if (activeIndex > sessions.length - 1) {
      setActiveIndex(sessions.length - 1);
    }
  }, [activeIndex, hasSessions, sessions.length]);

  const timerOptions = useMemo(() => {
    if (!activeSession) {
      return [] as TimerOption[];
    }
    return buildTimerOptions(activeSession);
  }, [activeSession]);

  useEffect(() => {
    if (timerOptions.length === 0) {
      setSelectedTimerId("");
      setRemainingSeconds(0);
      setRunning(false);
      playlistOpenedRef.current = false;
      setMusicReminderActive(false);
      return;
    }

    const firstOption = timerOptions[0];
    setSelectedTimerId(firstOption.id);
    setRemainingSeconds(firstOption.durationSec);
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

  const selectedTimer = useMemo(() => {
    if (timerOptions.length === 0) {
      return null;
    }
    return timerOptions.find((option) => option.id === selectedTimerId) ?? timerOptions[0];
  }, [selectedTimerId, timerOptions]);

  const progress = hasSessions ? Math.round(((safeIndex + 1) / sessions.length) * 100) : 0;

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
        window.open(program.meta.playlistUrl, "_blank", "noopener,noreferrer");
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
    if (!tips.length) {
      setCurrentTip(null);
      return;
    }
    const nextTip = tips[Math.floor(Math.random() * tips.length)];
    setCurrentTip(nextTip);
  };

  if (!hasSessions) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-16 text-white">
        <div className="max-w-xl rounded-3xl border border-white/10 bg-neutral-900/70 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">Teamdag viewer</p>
          <h1 className="mt-3 text-2xl font-semibold">Geen sessies gevonden</h1>
          <p className="mt-2 text-sm text-white/60">
            Voeg sessies toe in het admin-dashboard onder <span className="font-semibold">Teamdag</span> om het programma hier te tonen.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="space-y-6 rounded-3xl border border-white/10 bg-neutral-900/70 px-6 py-6 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                Teambuilding met Impact – Teamdag viewer
              </p>
              <h1 className="mt-2 text-3xl font-semibold">Programma-overzicht {program.meta.dateLabel}</h1>
              <p className="mt-2 text-sm text-white/60">
                {program.meta.organisations.join(" & ")} • Facilitator: {program.meta.facilitator.name} ({program.meta.facilitator.title})
              </p>
              <p className="text-sm text-white/60">
                Locaties: {program.meta.locations.join(" → ")}
              </p>
            </div>
            <div className="flex items-center gap-3 self-start rounded-2xl bg-white/5 px-4 py-3 text-sm text-white/70">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-lg font-semibold text-emerald-300">
                {safeIndex + 1}
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Huidige onderdeel</p>
                <p className="font-semibold">{activeSession ? formatRange(activeSession) : "-"}</p>
                <p className="text-xs text-white/50">{activeSession?.title ?? "-"}</p>
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
            <p className="mt-2 text-right text-xs text-white/50">{safeIndex + 1} / {sessions.length} onderdelen</p>
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
                  const isActive = index === safeIndex;
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
                  disabled={safeIndex === 0}
                >
                  Vorige
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 rounded-2xl border border-emerald-400/60 bg-emerald-400/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100 transition hover:border-emerald-300 hover:bg-emerald-400/30 disabled:border-white/10 disabled:bg-white/5 disabled:text-white/30"
                  disabled={safeIndex === sessions.length - 1}
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
                href={program.meta.playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center justify-center rounded-2xl border border-emerald-400/60 bg-emerald-400/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100 transition hover:border-emerald-300 hover:bg-emerald-400/30"
              >
                Open Spotify
              </a>
            </div>
          </aside>

          <section className="space-y-6">
            {activeSession ? (
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
            ) : null}

            {activeSession?.script?.length ? (
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

            {activeSession?.activities?.length ? (
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
                      href={program.meta.playlistUrl}
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

            {activeSession ? (
              <SessionUploads
                key={activeSession.id}
                sessionId={activeSession.id}
                uploads={uploadsBySession[activeSession.id] ?? []}
                onUploadAdded={(upload) => handleUploadAdded(activeSession.id, upload)}
              />
            ) : null}

            {activeSession?.reflection?.length ? (
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

            {activeSession?.transitions?.length || activeSession?.notes?.length ? (
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
