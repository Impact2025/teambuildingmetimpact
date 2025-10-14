"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ViewerUploadFormProps = {
  pin: string;
  sessions: Array<{
    id: string;
    title: string;
  }>;
  defaultSessionId?: string | null;
};

function normaliseTags(input: string) {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function ViewerUploadForm({ pin, sessions, defaultSessionId }: ViewerUploadFormProps) {
  const router = useRouter();
  const orderedSessions = useMemo(() => sessions, [sessions]);
  const [sessionId, setSessionId] = useState(
    defaultSessionId && orderedSessions.some((session) => session.id === defaultSessionId)
      ? defaultSessionId
      : orderedSessions[0]?.id ?? ""
  );
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!file) {
      setError("Maak eerst een foto of kies een bestand.");
      return;
    }
    if (!sessionId) {
      setError("Kies een sessie.");
      return;
    }

    const formData = new FormData();
    formData.append("pin", pin);
    formData.append("sessionId", sessionId);
    formData.append("file", file);
    formData.append("title", title);
    formData.append("notes", notes);
    formData.append("uploadedBy", uploadedBy);
    formData.append("tags", normaliseTags(tagsInput).join(","));

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/viewer/uploads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Opslaan mislukt");
      }

      setSuccess("Foto opgeslagen bij de sessie.");
      setFile(null);
      setTitle("");
      setNotes("");
      setTagsInput("");
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? "Er ging iets mis.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-neutral-200">
          Sessie
          <select
            value={sessionId}
            onChange={(event) => setSessionId(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            {orderedSessions.map((session) => (
              <option key={session.id} value={session.id} className="text-neutral-900">
                {session.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-neutral-200">
          Titel (optioneel)
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Bijv. Team blauw – hindernisbaan"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </label>

        <label className="block text-sm font-medium text-neutral-200">
          Beschrijving / notities
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            placeholder="Wat zie je op de foto? Welke inzichten of quotes horen erbij?"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </label>

        <label className="block text-sm font-medium text-neutral-200">
          Tags (optioneel, komma gescheiden)
          <input
            type="text"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            placeholder="verbinding, idee, quote"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </label>

        <label className="block text-sm font-medium text-neutral-200">
          Wie uploadt dit? (optioneel)
          <input
            type="text"
            value={uploadedBy}
            onChange={(event) => setUploadedBy(event.target.value)}
            placeholder="Bijv. Vincent"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </label>

        <label className="block text-sm font-medium text-neutral-200">
          Foto of camera
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="mt-2 w-full text-sm text-white"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <p className="mt-2 text-xs text-white/60">
            Max. 10MB — werkt ook rechtstreeks met de camera op je telefoon.
          </p>
          {file ? (
            <p className="mt-1 text-xs text-white/50">Geselecteerd: {file.name}</p>
          ) : null}
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-300"
      >
        {isSubmitting ? "Opslaan..." : "Uploaden"}
      </button>

      {success ? (
        <p className="rounded-2xl border border-emerald-500/40 bg-emerald-500/20 px-4 py-3 text-sm text-emerald-100">
          {success}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}
    </form>
  );
}
