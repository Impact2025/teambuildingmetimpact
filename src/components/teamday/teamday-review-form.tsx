"use client";

import { useMemo, useState, type FormEvent } from "react";

import type { TeamdayProgram } from "@/lib/teamday-program";
import { MAX_TEAMDAY_REVIEW_COMMENT_LENGTH } from "@/lib/teamday-review-constants";

type ReviewMessage = {
  type: "success" | "error";
  text: string;
};

type SessionEntry = {
  rating: number | null;
  comment: string;
};

type SessionState = Record<string, SessionEntry>;

function createInitialState(program: TeamdayProgram): SessionState {
  return program.sessions.reduce<SessionState>((acc, session) => {
    acc[session.id] = { rating: null, comment: "" };
    return acc;
  }, {});
}

type TeamdayReviewFormProps = {
  program: TeamdayProgram;
};

export function TeamdayReviewForm({ program }: TeamdayReviewFormProps) {
  const [reviewerName, setReviewerName] = useState("");
  const [sessionsState, setSessionsState] = useState<SessionState>(() => createInitialState(program));
  const [message, setMessage] = useState<ReviewMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sessionsWithRatings = useMemo(() => {
    return program.sessions.filter((session) => sessionsState[session.id]?.rating);
  }, [program.sessions, sessionsState]);

  const completedCount = sessionsWithRatings.length;

  const handleRatingChange = (sessionId: string, rating: number | null) => {
    setSessionsState((prev) => ({
      ...prev,
      [sessionId]: {
        rating,
        comment: prev[sessionId]?.comment ?? "",
      },
    }));
  };

  const handleCommentChange = (sessionId: string, comment: string) => {
    setSessionsState((prev) => ({
      ...prev,
      [sessionId]: {
        rating: prev[sessionId]?.rating ?? null,
        comment,
      },
    }));
  };

  const resetForm = () => {
    setReviewerName("");
    setSessionsState(createInitialState(program));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    const selectedEntries = program.sessions
      .map((session) => {
        const entry = sessionsState[session.id];
        if (!entry?.rating) {
          return null;
        }
        return {
          sessionKey: session.id,
          rating: entry.rating,
          comment: entry.comment.trim().slice(0, MAX_TEAMDAY_REVIEW_COMMENT_LENGTH),
        };
      })
      .filter((entry): entry is { sessionKey: string; rating: number; comment: string } => Boolean(entry));

    if (!reviewerName.trim()) {
      setMessage({ type: "error", text: "Vul je naam in om de review te versturen." });
      return;
    }

    if (selectedEntries.length === 0) {
      setMessage({ type: "error", text: "Geef minimaal één onderdeel een beoordeling." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/teamday/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewerName: reviewerName.trim(),
          entries: selectedEntries,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Opslaan mislukt");
      }

      resetForm();
      setMessage({ type: "success", text: "Bedankt! Je review is opgeslagen en wordt binnen enkele werkdagen gepubliceerd na controle." });
    } catch (error: any) {
      setMessage({ type: "error", text: error?.message ?? "Er ging iets mis. Probeer het later opnieuw." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Deel je ervaring</p>
            <h1 className="text-2xl font-semibold text-neutral-900">Review van deze teamdag</h1>
            <p className="mt-2 text-sm text-neutral-600">
              Geef per onderdeel aan hoe je de sessie hebt ervaren. Je toelichting is optioneel maar helpt ons om toekomstige programma&apos;s te verbeteren.
            </p>
          </div>
          <div className="rounded-2xl border border-accent/40 bg-accent-soft/40 px-4 py-3 text-sm text-neutral-700">
            {completedCount > 0 ? (
              <span className="font-semibold">{completedCount}</span>
            ) : (
              <span className="font-semibold">Nog niets ingevuld</span>
            )}
            {completedCount > 0 ? " onderdelen beoordeeld" : ""}
          </div>
        </div>

        <label className="mt-6 block text-sm font-medium text-neutral-700">
          Naam
          <input
            type="text"
            value={reviewerName}
            onChange={(event) => setReviewerName(event.target.value)}
            placeholder="Bijv. Naam van de contactpersoon"
            className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          />
        </label>
      </section>

      <section className="space-y-6">
        {program.sessions.map((session) => {
          const entry = sessionsState[session.id];
          const rating = entry?.rating ?? null;
          const comment = entry?.comment ?? "";

          return (
            <article
              key={session.id}
              className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
                    {session.timeslot.start} – {session.timeslot.end}
                  </p>
                  <h2 className="text-xl font-semibold text-neutral-900">{session.title}</h2>
                  {session.subtitle ? (
                    <p className="text-sm text-neutral-500">{session.subtitle}</p>
                  ) : null}
                </div>
                <div className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Locatie: {session.location ?? "n.t.b."}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-neutral-700">Hoeveel sterren geef je dit onderdeel?</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => {
                    const isActive = rating !== null && value <= rating;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRatingChange(session.id, rating === value ? null : value)}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg transition ${
                          isActive
                            ? "border-amber-500 bg-amber-100 text-amber-600"
                            : "border-neutral-200 bg-neutral-50 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600"
                        }`}
                        aria-label={`${value} sterren`}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-neutral-500">Klik nogmaals op dezelfde ster om te wissen.</p>
              </div>

              <label className="block text-sm font-medium text-neutral-700">
                Toelichting (optioneel)
                <textarea
                  value={comment}
                  onChange={(event) => handleCommentChange(session.id, event.target.value)}
                  rows={3}
                  maxLength={MAX_TEAMDAY_REVIEW_COMMENT_LENGTH}
                  placeholder="Wat maakte deze sessie sterk? Heb je verbeterpunten?"
                  className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                />
                <span className="mt-1 block text-xs text-neutral-400">
                  {comment.length}/{MAX_TEAMDAY_REVIEW_COMMENT_LENGTH} tekens
                </span>
              </label>
            </article>
          );
        })}
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-neutral-800">Klaar om te versturen?</p>
            <p className="text-sm text-neutral-500">
              We gebruiken je feedback om toekomstige teamdagen nog beter af te stemmen.
            </p>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl border border-[#006D77] bg-[#006D77] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-300"
          >
            {isSubmitting ? "Versturen..." : "Verstuur review"}
          </button>
        </div>

        {message ? (
          <p
            className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
              message.type === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-red-200 bg-red-50 text-red-600"
            }`}
          >
            {message.text}
          </p>
        ) : null}
      </section>
    </form>
  );
}
