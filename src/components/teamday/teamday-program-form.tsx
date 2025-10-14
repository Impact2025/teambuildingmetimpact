"use client";

import { useMemo, useState, useTransition } from "react";

import {
  resetTeamdayProgramAction,
  updateTeamdayProgramAction,
} from "@/actions/teamday-program";
import type {
  TeamdayActivity,
  TeamdayProgram,
  TeamdayScriptBlock,
  TeamdaySession,
} from "@/lib/teamday-program";

type TeamdayProgramFormProps = {
  initialProgram: TeamdayProgram;
};

type ActionMessage = {
  type: "success" | "error";
  text: string;
};

function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function splitComma(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function stringifyLines(value?: string[]) {
  return value?.join("\n") ?? "";
}

function stringifyComma(value?: string[]) {
  return value?.join(", ") ?? "";
}

function stringifyScriptLines(lines?: string[]) {
  return lines?.join("\n") ?? "";
}

function stringifyPrompts(prompts?: string[]) {
  return prompts?.join("\n") ?? "";
}

function toNumber(value: string, fallback: number) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function createNewSession(): TeamdaySession {
  const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}`;
  return {
    id,
    title: "Nieuw onderdeel",
    subtitle: "",
    timeslot: {
      start: "00:00",
      end: "00:00",
      totalMinutes: 10,
    },
    location: "",
    attendees: [],
    overview: [],
    script: [],
    activities: [],
    transitions: [],
    reflection: [],
    notes: [],
  };
}

function createNewScriptBlock(): TeamdayScriptBlock {
  return {
    label: "Nieuw blok",
    lines: [""],
  };
}

function createNewActivity(): TeamdayActivity {
  const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `activity-${Date.now()}`;
  return {
    id,
    title: "Nieuwe activiteit",
    durationSec: 300,
    description: "",
    prompts: [],
    reminders: [],
  };
}

export function TeamdayProgramForm({ initialProgram }: TeamdayProgramFormProps) {
  const [program, setProgram] = useState<TeamdayProgram>(initialProgram);
  const [baseline, setBaseline] = useState<TeamdayProgram>(initialProgram);
  const [message, setMessage] = useState<ActionMessage | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasChanges = useMemo(() => {
    return JSON.stringify(program) !== JSON.stringify(baseline);
  }, [program, baseline]);

  const handleMetaChange = <K extends keyof TeamdayProgram["meta"]>(
    key: K,
    value: TeamdayProgram["meta"][K]
  ) => {
    setProgram((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        [key]: value,
      },
    }));
  };

  const updateSession = (
    index: number,
    updater: (session: TeamdaySession) => TeamdaySession
  ) => {
    setProgram((prev) => {
      const nextSessions = [...prev.sessions];
      nextSessions[index] = updater(nextSessions[index]);
      return { ...prev, sessions: nextSessions };
    });
  };

  const removeSession = (index: number) => {
    setProgram((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((_, idx) => idx !== index),
    }));
  };

  const moveSession = (index: number, direction: -1 | 1) => {
    setProgram((prev) => {
      const nextSessions = [...prev.sessions];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= nextSessions.length) {
        return prev;
      }
      const [removed] = nextSessions.splice(index, 1);
      nextSessions.splice(targetIndex, 0, removed);
      return { ...prev, sessions: nextSessions };
    });
  };

  const addSession = () => {
    setProgram((prev) => ({
      ...prev,
      sessions: [...prev.sessions, createNewSession()],
    }));
  };

  const handleSave = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await updateTeamdayProgramAction(program);
      if (result.status === "success" && result.program) {
        setProgram(result.program);
        setBaseline(result.program);
      }
      setMessage({
        type: result.status,
        text: result.message ?? (result.status === "success" ? "Programma opgeslagen." : "Opslaan mislukt."),
      });
    });
  };

  const handleResetToDefault = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await resetTeamdayProgramAction();
      if (result.status === "success" && result.program) {
        setProgram(result.program);
        setBaseline(result.program);
      }
      setMessage({
        type: result.status,
        text: result.message ?? (result.status === "success" ? "Programma teruggezet." : "Reset mislukt."),
      });
    });
  };

  return (
    <div className="space-y-8">
      <header className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Teamdag programma
            </p>
            <h1 className="text-2xl font-semibold text-neutral-900">
              Beheer dagprogramma
            </h1>
            <p className="text-sm text-neutral-500">
              Pas timings, teksten en activiteiten aan. Wijzigingen zijn direct zichtbaar in de teamdag-viewer.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              disabled={isPending}
              className="rounded-2xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600 transition hover:border-neutral-500 hover:text-neutral-900 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-300"
            >
              Reset naar standaard
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || !hasChanges}
              className="rounded-2xl border border-emerald-500 bg-emerald-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:border-emerald-200 disabled:bg-emerald-200"
            >
              {isPending ? "Opslaan..." : "Opslaan"}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span
            className={`rounded-full px-3 py-1 ${
              hasChanges ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {hasChanges ? "Niet-opgeslagen wijzigingen" : "Alle wijzigingen opgeslagen"}
          </span>
          {message ? (
            <span
              className={`rounded-full px-3 py-1 ${
                message.type === "success" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
              }`}
            >
              {message.text}
            </span>
          ) : null}
        </div>
      </header>

      <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">Algemene informatie</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-neutral-700">
            <span>Datumlabel</span>
            <input
              type="text"
              value={program.meta.dateLabel}
              onChange={(event) => handleMetaChange("dateLabel", event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-neutral-700">
            <span>Playlist URL</span>
            <input
              type="url"
              value={program.meta.playlistUrl}
              onChange={(event) => handleMetaChange("playlistUrl", event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-neutral-700">
            <span>Locaties (één per regel)</span>
            <textarea
              value={stringifyLines(program.meta.locations)}
              onChange={(event) => handleMetaChange("locations", splitLines(event.target.value))}
              rows={3}
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-neutral-700">
            <span>Organisaties (één per regel)</span>
            <textarea
              value={stringifyLines(program.meta.organisations)}
              onChange={(event) => handleMetaChange("organisations", splitLines(event.target.value))}
              rows={3}
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-neutral-700">
            <span>Facilitator naam</span>
            <input
              type="text"
              value={program.meta.facilitator.name}
              onChange={(event) =>
                handleMetaChange("facilitator", {
                  ...program.meta.facilitator,
                  name: event.target.value,
                })
              }
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-neutral-700">
            <span>Facilitator titel</span>
            <input
              type="text"
              value={program.meta.facilitator.title}
              onChange={(event) =>
                handleMetaChange("facilitator", {
                  ...program.meta.facilitator,
                  title: event.target.value,
                })
              }
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            />
          </label>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Sessies</h2>
          <button
            type="button"
            onClick={addSession}
            className="rounded-2xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600 transition hover:border-neutral-500 hover:text-neutral-900"
          >
            Sessies toevoegen
          </button>
        </div>

        <div className="space-y-4">
          {program.sessions.map((session, index) => (
            <article
              key={session.id}
              className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
                    Onderdeel {index + 1}
                  </p>
                  <h3 className="text-xl font-semibold text-neutral-900">{session.title}</h3>
                  {session.subtitle ? (
                    <p className="text-sm text-neutral-500">{session.subtitle}</p>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveSession(index, -1)}
                    disabled={index === 0}
                    className="rounded-xl border border-neutral-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 transition hover:border-neutral-500 hover:text-neutral-800 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-300"
                  >
                    Omhoog
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSession(index, 1)}
                    disabled={index === program.sessions.length - 1}
                    className="rounded-xl border border-neutral-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 transition hover:border-neutral-500 hover:text-neutral-800 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-300"
                  >
                    Omlaag
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSession(index)}
                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-600 transition hover:border-red-300 hover:bg-red-100"
                  >
                    Verwijder
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-neutral-700">
                  <span>Titel</span>
                  <input
                    type="text"
                    value={session.title}
                    onChange={(event) =>
                      updateSession(index, (current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-neutral-700">
                  <span>Subtitel</span>
                  <input
                    type="text"
                    value={session.subtitle ?? ""}
                    onChange={(event) =>
                      updateSession(index, (current) => ({
                        ...current,
                        subtitle: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-neutral-700">
                  <span>Starttijd (HH:MM)</span>
                  <input
                    type="text"
                    value={session.timeslot.start}
                    onChange={(event) =>
                      updateSession(index, (current) => ({
                        ...current,
                        timeslot: {
                          ...current.timeslot,
                          start: event.target.value,
                        },
                      }))
                    }
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-neutral-700">
                  <span>Eindtijd (HH:MM)</span>
                  <input
                    type="text"
                    value={session.timeslot.end}
                    onChange={(event) =>
                      updateSession(index, (current) => ({
                        ...current,
                        timeslot: {
                          ...current.timeslot,
                          end: event.target.value,
                        },
                      }))
                    }
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-neutral-700">
                  <span>Duur (minuten)</span>
                  <input
                    type="number"
                    min={1}
                    value={session.timeslot.totalMinutes}
                    onChange={(event) =>
                      updateSession(index, (current) => ({
                        ...current,
                        timeslot: {
                          ...current.timeslot,
                          totalMinutes: Math.max(1, toNumber(event.target.value, current.timeslot.totalMinutes)),
                        },
                      }))
                    }
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-neutral-700">
                  <span>Locatie</span>
                  <input
                    type="text"
                    value={session.location ?? ""}
                    onChange={(event) =>
                      updateSession(index, (current) => ({
                        ...current,
                        location: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-neutral-700">
                  <span>Aanwezigen (comma gescheiden)</span>
                  <input
                    type="text"
                    value={stringifyComma(session.attendees)}
                    onChange={(event) =>
                      updateSession(index, (current) => ({
                        ...current,
                        attendees: splitComma(event.target.value),
                      }))
                    }
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm font-medium text-neutral-700">
                <span>Overzicht / Doel (één punt per regel)</span>
                <textarea
                  value={stringifyLines(session.overview)}
                  onChange={(event) =>
                    updateSession(index, (current) => ({
                      ...current,
                      overview: splitLines(event.target.value),
                    }))
                  }
                  rows={4}
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                />
              </label>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Spreektekst</h4>
                  <button
                    type="button"
                    onClick={() =>
                      updateSession(index, (current) => ({
                        ...current,
                        script: [...(current.script ?? []), createNewScriptBlock()],
                      }))
                    }
                    className="rounded-xl border border-neutral-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 transition hover:border-neutral-500 hover:text-neutral-800"
                  >
                    Blok toevoegen
                  </button>
                </div>
                <div className="space-y-3">
                  {(session.script ?? []).map((block, blockIndex) => (
                    <div
                      key={`${block.label}-${blockIndex}`}
                      className="space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <label className="flex-1 space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                          <span>Label</span>
                          <input
                            type="text"
                            value={block.label}
                            onChange={(event) =>
                              updateSession(index, (current) => {
                                const nextScript = [...(current.script ?? [])];
                                nextScript[blockIndex] = {
                                  ...nextScript[blockIndex],
                                  label: event.target.value,
                                };
                                return { ...current, script: nextScript };
                              })
                            }
                            className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            updateSession(index, (current) => ({
                              ...current,
                              script: (current.script ?? []).filter((_, sIdx) => sIdx !== blockIndex),
                            }))
                          }
                          className="rounded-xl border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-600 transition hover:border-red-300 hover:bg-red-100"
                        >
                          Verwijder
                        </button>
                      </div>
                      <label className="block space-y-2 text-xs font-medium text-neutral-600">
                        <span>Tekst (één zin per regel)</span>
                        <textarea
                          value={stringifyScriptLines(block.lines)}
                          onChange={(event) =>
                            updateSession(index, (current) => {
                              const nextScript = [...(current.script ?? [])];
                              nextScript[blockIndex] = {
                                ...nextScript[blockIndex],
                                lines: splitLines(event.target.value),
                              };
                              return { ...current, script: nextScript };
                            })
                          }
                          rows={4}
                          className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Activiteiten</h4>
                  <button
                    type="button"
                    onClick={() =>
                      updateSession(index, (current) => ({
                        ...current,
                        activities: [...(current.activities ?? []), createNewActivity()],
                      }))
                    }
                    className="rounded-xl border border-neutral-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 transition hover:border-neutral-500 hover:text-neutral-800"
                  >
                    Activiteit toevoegen
                  </button>
                </div>
                <div className="space-y-3">
                  {(session.activities ?? []).map((activity, activityIndex) => (
                    <div
                      key={activity.id}
                      className="space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <label className="flex-1 space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                          <span>Titel</span>
                          <input
                            type="text"
                            value={activity.title}
                            onChange={(event) =>
                              updateSession(index, (current) => {
                                const nextActivities = [...(current.activities ?? [])];
                                nextActivities[activityIndex] = {
                                  ...nextActivities[activityIndex],
                                  title: event.target.value,
                                };
                                return { ...current, activities: nextActivities };
                              })
                            }
                            className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                          />
                        </label>
                        <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                          <span>Duur (seconden)</span>
                          <input
                            type="number"
                            min={30}
                            step={30}
                            value={activity.durationSec ?? 0}
                            onChange={(event) =>
                              updateSession(index, (current) => {
                                const nextActivities = [...(current.activities ?? [])];
                                nextActivities[activityIndex] = {
                                  ...nextActivities[activityIndex],
                                  durationSec: Math.max(10, toNumber(event.target.value, activity.durationSec ?? 60)),
                                };
                                return { ...current, activities: nextActivities };
                              })
                            }
                            className="w-32 rounded-2xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            updateSession(index, (current) => ({
                              ...current,
                              activities: (current.activities ?? []).filter((_, aIdx) => aIdx !== activityIndex),
                            }))
                          }
                          className="rounded-xl border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-600 transition hover:border-red-300 hover:bg-red-100"
                        >
                          Verwijder
                        </button>
                      </div>
                      <label className="block space-y-2 text-xs font-medium text-neutral-600">
                        <span>Omschrijving</span>
                        <textarea
                          value={activity.description ?? ""}
                          onChange={(event) =>
                            updateSession(index, (current) => {
                              const nextActivities = [...(current.activities ?? [])];
                              nextActivities[activityIndex] = {
                                ...nextActivities[activityIndex],
                                description: event.target.value,
                              };
                              return { ...current, activities: nextActivities };
                            })
                          }
                          rows={3}
                          className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                        />
                      </label>
                      <label className="block space-y-2 text-xs font-medium text-neutral-600">
                        <span>Prompts (één per regel)</span>
                        <textarea
                          value={stringifyPrompts(activity.prompts)}
                          onChange={(event) =>
                            updateSession(index, (current) => {
                              const nextActivities = [...(current.activities ?? [])];
                              nextActivities[activityIndex] = {
                                ...nextActivities[activityIndex],
                                prompts: splitLines(event.target.value),
                              };
                              return { ...current, activities: nextActivities };
                            })
                          }
                          rows={3}
                          className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                        />
                      </label>
                      <label className="block space-y-2 text-xs font-medium text-neutral-600">
                        <span>Reminders (één per regel)</span>
                        <textarea
                          value={stringifyPrompts(activity.reminders)}
                          onChange={(event) =>
                            updateSession(index, (current) => {
                              const nextActivities = [...(current.activities ?? [])];
                              nextActivities[activityIndex] = {
                                ...nextActivities[activityIndex],
                                reminders: splitLines(event.target.value),
                              };
                              return { ...current, activities: nextActivities };
                            })
                          }
                          rows={3}
                          className="w-full rounded-2xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="space-y-2 text-sm font-medium text-neutral-700">
                  <span>Transities (één per regel)</span>
                  <textarea
                    value={stringifyLines(session.transitions)}
                    onChange={(event) =>
                      updateSession(index, (current) => ({
                        ...current,
                        transitions: splitLines(event.target.value),
                      }))
                    }
                    rows={3}
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-neutral-700">
                  <span>Reflectievragen (één per regel)</span>
                  <textarea
                    value={stringifyLines(session.reflection)}
                    onChange={(event) =>
                      updateSession(index, (current) => ({
                        ...current,
                        reflection: splitLines(event.target.value),
                      }))
                    }
                    rows={3}
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-neutral-700">
                  <span>Notities / Opties (één per regel)</span>
                  <textarea
                    value={stringifyLines(session.notes)}
                    onChange={(event) =>
                      updateSession(index, (current) => ({
                        ...current,
                        notes: splitLines(event.target.value),
                      }))
                    }
                    rows={3}
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
