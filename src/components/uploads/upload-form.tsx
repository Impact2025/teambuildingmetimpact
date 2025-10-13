"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type UploadFormProps = {
  sessions: { id: string; title: string }[];
};

export function UploadForm({ sessions }: UploadFormProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState(sessions[0]?.id ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file || !sessionId) {
      setError("Kies een sessie en bestand");
      return;
    }

    const formData = new FormData();
    formData.append("sessionId", sessionId);
    formData.append("title", title);
    formData.append("tags", tags);
    formData.append("notes", notes);
    formData.append("file", file);

    try {
      setIsUploading(true);
      setError(null);
      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error ?? "Upload mislukt");
      }

      setFile(null);
      setTitle("");
      setTags("");
      setNotes("");
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? "Upload mislukt");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Bouwwerk uploaden</h2>
        <p className="text-sm text-neutral-500">
          Koppel foto’s aan een sessie om tags en notities te bewaren voor de AI-analyse.
        </p>
      </div>

      <label className="block text-sm font-medium text-neutral-700">
        Sessie
        <select
          className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm"
          value={sessionId}
          onChange={(event) => setSessionId(event.target.value)}
        >
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.title}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-neutral-700">
        Titel
        <input
          className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm"
          placeholder="Naam van het bouwwerk"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>

      <label className="block text-sm font-medium text-neutral-700">
        Tags (komma-gescheiden)
        <input
          className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm"
          placeholder="Verbinding, samenwerking, innovatie"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
        />
      </label>

      <label className="block text-sm font-medium text-neutral-700">
        Notities
        <textarea
          className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm"
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </label>

      <label className="block text-sm font-medium text-neutral-700">
        Bestand (JPG of PNG, max 10MB)
        <input
          type="file"
          accept="image/png, image/jpeg"
          className="mt-1 w-full text-sm"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </label>

      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-400">
          Bestand wordt veilig opgeslagen in Supabase Storage.
        </p>
        <button
          type="submit"
          disabled={isUploading}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          {isUploading ? "Bezig..." : "Uploaden"}
        </button>
      </div>

      {file ? (
        <p className="text-xs text-neutral-500">Geselecteerd: {file.name}</p>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </form>
  );
}
