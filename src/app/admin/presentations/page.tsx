"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Presentation {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  slides: any[];
}

export default function PresentationsPage() {
  const router = useRouter();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    fetchPresentations();
  }, []);

  const fetchPresentations = async () => {
    try {
      const res = await fetch("/api/presentations");
      if (res.ok) {
        const data = await res.json();
        setPresentations(data);
      }
    } catch (error) {
      console.error("Error fetching presentations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/presentations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, description: newDescription }),
      });

      if (res.ok) {
        const presentation = await res.json();
        router.push(`/admin/presentations/${presentation.id}`);
      }
    } catch (error) {
      console.error("Error creating presentation:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze presentatie wilt verwijderen?")) {
      return;
    }

    try {
      const res = await fetch(`/api/presentations/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchPresentations();
      }
    } catch (error) {
      console.error("Error deleting presentation:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-neutral-600">Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-neutral-900">Presentaties</h1>
          <button
            onClick={() => setShowNewModal(true)}
            className="rounded-lg bg-[#006D77] px-6 py-3 text-white transition hover:bg-[#005862]"
          >
            + Nieuwe Presentatie
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {presentations.map((presentation) => (
            <div
              key={presentation.id}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="mb-2 text-xl font-semibold text-neutral-900">
                {presentation.title}
              </h3>
              {presentation.description && (
                <p className="mb-4 text-sm text-neutral-600">
                  {presentation.description}
                </p>
              )}
              <div className="mb-4 text-sm text-neutral-500">
                {presentation.slides.length} slide{presentation.slides.length !== 1 && "s"}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/presentations/${presentation.id}`}
                  className="flex-1 rounded-lg border border-[#006D77] px-4 py-2 text-center text-sm font-semibold text-[#006D77] transition hover:bg-[#006D77] hover:text-white"
                >
                  Bewerken
                </Link>
                <Link
                  href={`/present/${presentation.id}`}
                  target="_blank"
                  className="flex-1 rounded-lg bg-[#006D77] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#005862]"
                >
                  Presenteren
                </Link>
                <button
                  onClick={() => handleDelete(presentation.id)}
                  className="rounded-lg border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                >
                  Verwijder
                </button>
              </div>
            </div>
          ))}
        </div>

        {presentations.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
            <p className="text-neutral-600">
              Nog geen presentaties. Maak je eerste presentatie aan!
            </p>
          </div>
        )}
      </div>

      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8">
            <h2 className="mb-6 text-2xl font-bold text-neutral-900">
              Nieuwe Presentatie
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700">
                  Titel
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#006D77] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700">
                  Beschrijving (optioneel)
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#006D77] focus:outline-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewModal(false);
                    setNewTitle("");
                    setNewDescription("");
                  }}
                  className="flex-1 rounded-lg border border-neutral-300 px-6 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-100"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#006D77] px-6 py-3 font-semibold text-white transition hover:bg-[#005862]"
                >
                  Aanmaken
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
