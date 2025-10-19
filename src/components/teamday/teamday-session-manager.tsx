"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { TeamdaySessionWithStats } from "@/lib/teamday-sessions";

type TeamdaySessionManagerProps = {
  initialSessions: TeamdaySessionWithStats[];
};

const dateFormatter = new Intl.DateTimeFormat("nl-NL", { dateStyle: "long" });

export function TeamdaySessionManager({ initialSessions }: TeamdaySessionManagerProps) {
  const router = useRouter();
  const [sessions, setSessions] = useState(initialSessions);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  // Form state
  const [eventDate, setEventDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [participantCount, setParticipantCount] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setEventDate("");
    setClientName("");
    setParticipantCount("");
    setNotes("");
    setFormError(null);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setIsCreating(true);

    try {
      const response = await fetch("/api/admin/teamday/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventDate,
          clientName,
          participantCount: participantCount ? parseInt(participantCount) : undefined,
          notes: notes || undefined,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Aanmaken mislukt");
      }

      resetForm();
      setShowForm(false);
      router.refresh();

      // Reload sessions
      const sessionsResponse = await fetch("/api/admin/teamday/sessions");
      if (sessionsResponse.ok) {
        const data = await sessionsResponse.json();
        setSessions(data.sessions);
      }
    } catch (error: any) {
      setFormError(error?.message ?? "Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setIsCreating(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm("Weet je zeker dat je deze sessie wilt verwijderen? Alle gekoppelde reviews worden ook verwijderd.")) {
      return;
    }

    setLoading(sessionId);
    try {
      const response = await fetch(`/api/admin/teamday/sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Verwijderen mislukt");
      }

      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      router.refresh();
    } catch (error) {
      alert("Er is iets misgegaan. Probeer het opnieuw.");
    } finally {
      setLoading(null);
    }
  };

  const copyLink = (slug: string) => {
    const link = `${window.location.origin}/teamdag/review/${slug}`;
    navigator.clipboard.writeText(link);
    alert("Link gekopieerd naar klembord!");
  };

  return (
    <div className="space-y-6">
      {/* Create form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-2xl bg-[#006D77] px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-deep"
        >
          + Nieuwe sessie aanmaken
        </button>
      ) : (
        <form onSubmit={handleCreate} className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Nieuwe teamdag sessie</h2>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="text-sm text-neutral-500 hover:text-neutral-700"
            >
              Annuleren
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-neutral-700">
              Datum
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              />
            </label>

            <label className="block text-sm font-medium text-neutral-700">
              Aantal deelnemers (optioneel)
              <input
                type="number"
                value={participantCount}
                onChange={(e) => setParticipantCount(e.target.value)}
                min="1"
                placeholder="Bijv. 15"
                className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-neutral-700">
            Klant / Organisatie
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              placeholder="Bijv. Stichting Maatvast"
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            />
          </label>

          <label className="block text-sm font-medium text-neutral-700">
            Notities (optioneel)
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Interne opmerkingen over deze sessie"
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            />
          </label>

          {formError && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isCreating}
            className="w-full rounded-2xl bg-[#006D77] px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {isCreating ? "Aanmaken..." : "Sessie aanmaken"}
          </button>
        </form>
      )}

      {/* Sessions list */}
      {sessions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 p-10 text-center text-sm text-neutral-500">
          Nog geen sessies aangemaakt. Maak een sessie aan om review links te kunnen delen.
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <article
              key={session.id}
              className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
                    {dateFormatter.format(new Date(session.eventDate))}
                  </p>
                  <h3 className="text-xl font-semibold text-neutral-900">{session.clientName}</h3>
                  {session.participantCount && (
                    <p className="text-sm text-neutral-600">{session.participantCount} deelnemers</p>
                  )}
                  {session.notes && (
                    <p className="mt-2 text-sm text-neutral-500">{session.notes}</p>
                  )}
                </div>

                {session.reviewCount > 0 && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-2 text-center">
                    <p className="text-lg font-bold text-green-800">{session.averageRating?.toFixed(1)}</p>
                    <p className="text-xs text-green-600">{session.reviewCount} reviews</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => copyLink(session.slug)}
                  className="rounded-xl bg-[#006D77] px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-deep"
                >
                  Kopieer review link
                </button>
                <a
                  href={`/teamdag/review/${session.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  Bekijk pagina
                </a>
                <button
                  onClick={() => deleteSession(session.id)}
                  disabled={loading === session.id}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {loading === session.id ? "Verwijderen..." : "Verwijderen"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
