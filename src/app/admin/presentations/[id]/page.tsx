"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Slide {
  id: string;
  order: number;
  type: string;
  title: string;
  content: string | null;
  backgroundColor: string | null;
  textColor: string | null;
  timerDuration: number | null;
  sessionKey: string | null;
  imageUrl: string | null;
  notes: string | null;
}

interface Presentation {
  id: string;
  title: string;
  description: string | null;
  slides: Slide[];
}

const slideTypes = [
  { value: "INTRO", label: "Intro" },
  { value: "WHO_AM_I", label: "Wie ben ik" },
  { value: "WHAT_IS_LSP", label: "Wat is LSP" },
  { value: "RULES", label: "Regels" },
  { value: "SESSION", label: "Sessie (met timer)" },
  { value: "BREAK", label: "Pauze" },
  { value: "CLOSING", label: "Afsluiting" },
  { value: "CUSTOM", label: "Aangepast" },
];

export default function PresentationEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [slideForm, setSlideForm] = useState({
    type: "CUSTOM",
    title: "",
    content: "",
    backgroundColor: "#006D77",
    textColor: "#FFFFFF",
    timerDuration: null as number | null,
    sessionKey: "",
    imageUrl: "",
    notes: "",
  });

  const fetchPresentation = useCallback(async () => {
    try {
      const res = await fetch(`/api/presentations/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setPresentation(data);
      }
    } catch (error) {
      console.error("Error fetching presentation:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchPresentation();
  }, [fetchPresentation]);

  const handleAddSlide = () => {
    setEditingSlide(null);
    setSlideForm({
      type: "CUSTOM",
      title: "",
      content: "",
      backgroundColor: "#006D77",
      textColor: "#FFFFFF",
      timerDuration: null,
      sessionKey: "",
      imageUrl: "",
      notes: "",
    });
    setShowSlideModal(true);
  };

  const handleEditSlide = (slide: Slide) => {
    setEditingSlide(slide);
    setSlideForm({
      type: slide.type,
      title: slide.title,
      content: slide.content || "",
      backgroundColor: slide.backgroundColor || "#006D77",
      textColor: slide.textColor || "#FFFFFF",
      timerDuration: slide.timerDuration,
      sessionKey: slide.sessionKey || "",
      imageUrl: slide.imageUrl || "",
      notes: slide.notes || "",
    });
    setShowSlideModal(true);
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSlide) {
        // Update existing slide
        const res = await fetch(
          `/api/presentations/${params.id}/slides/${editingSlide.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(slideForm),
          }
        );
        if (res.ok) {
          fetchPresentation();
          setShowSlideModal(false);
        }
      } else {
        // Create new slide
        const res = await fetch(`/api/presentations/${params.id}/slides`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(slideForm),
        });
        if (res.ok) {
          fetchPresentation();
          setShowSlideModal(false);
        }
      }
    } catch (error) {
      console.error("Error saving slide:", error);
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    if (!confirm("Weet je zeker dat je deze slide wilt verwijderen?")) {
      return;
    }

    try {
      const res = await fetch(
        `/api/presentations/${params.id}/slides/${slideId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        fetchPresentation();
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-neutral-600">Laden...</div>
      </div>
    );
  }

  if (!presentation) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-neutral-600">Presentatie niet gevonden</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin/presentations"
              className="mb-2 inline-block text-sm text-[#006D77] hover:underline"
            >
              ← Terug naar overzicht
            </Link>
            <h1 className="text-3xl font-bold text-neutral-900">
              {presentation.title}
            </h1>
            {presentation.description && (
              <p className="text-neutral-600">{presentation.description}</p>
            )}
          </div>
          <div className="flex gap-4">
            <Link
              href={`/present/${presentation.id}`}
              target="_blank"
              className="rounded-lg bg-[#006D77] px-6 py-3 text-white transition hover:bg-[#005862]"
            >
              Presenteren
            </Link>
            <button
              onClick={handleAddSlide}
              className="rounded-lg border border-[#006D77] px-6 py-3 text-[#006D77] transition hover:bg-[#006D77] hover:text-white"
            >
              + Slide Toevoegen
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {presentation.slides.map((slide, index) => (
            <div
              key={slide.id}
              className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 font-bold text-neutral-700">
                {index + 1}
              </div>
              <div
                className="flex h-24 w-40 flex-shrink-0 items-center justify-center rounded-lg p-4 text-center text-sm font-semibold"
                style={{
                  backgroundColor: slide.backgroundColor || "#006D77",
                  color: slide.textColor || "#FFFFFF",
                }}
              >
                {slide.title}
              </div>
              <div className="flex-1">
                <div className="mb-1 inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
                  {slideTypes.find((t) => t.value === slide.type)?.label || slide.type}
                </div>
                {slide.timerDuration && (
                  <div className="text-sm text-neutral-600">
                    Timer: {Math.floor(slide.timerDuration / 60)}:
                    {(slide.timerDuration % 60).toString().padStart(2, "0")}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditSlide(slide)}
                  className="rounded-lg border border-[#006D77] px-4 py-2 text-sm font-semibold text-[#006D77] transition hover:bg-[#006D77] hover:text-white"
                >
                  Bewerken
                </button>
                <button
                  onClick={() => handleDeleteSlide(slide.id)}
                  className="rounded-lg border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                >
                  Verwijder
                </button>
              </div>
            </div>
          ))}

          {presentation.slides.length === 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
              <p className="text-neutral-600">
                Nog geen slides. Voeg je eerste slide toe!
              </p>
            </div>
          )}
        </div>
      </div>

      {showSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8">
            <h2 className="mb-6 text-2xl font-bold text-neutral-900">
              {editingSlide ? "Slide Bewerken" : "Nieuwe Slide"}
            </h2>
            <form onSubmit={handleSaveSlide} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700">
                  Type
                </label>
                <select
                  value={slideForm.type}
                  onChange={(e) =>
                    setSlideForm({ ...slideForm, type: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#006D77] focus:outline-none"
                >
                  {slideTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700">
                  Titel
                </label>
                <input
                  type="text"
                  value={slideForm.title}
                  onChange={(e) =>
                    setSlideForm({ ...slideForm, title: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#006D77] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700">
                  Inhoud (optioneel)
                </label>
                <textarea
                  value={slideForm.content}
                  onChange={(e) =>
                    setSlideForm({ ...slideForm, content: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#006D77] focus:outline-none"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700">
                    Achtergrondkleur
                  </label>
                  <input
                    type="color"
                    value={slideForm.backgroundColor}
                    onChange={(e) =>
                      setSlideForm({
                        ...slideForm,
                        backgroundColor: e.target.value,
                      })
                    }
                    className="h-10 w-full rounded-lg border border-neutral-300"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700">
                    Tekstkleur
                  </label>
                  <input
                    type="color"
                    value={slideForm.textColor}
                    onChange={(e) =>
                      setSlideForm({ ...slideForm, textColor: e.target.value })
                    }
                    className="h-10 w-full rounded-lg border border-neutral-300"
                  />
                </div>
              </div>

              {slideForm.type === "SESSION" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700">
                    Timer Duur (minuten)
                  </label>
                  <input
                    type="number"
                    value={slideForm.timerDuration ? slideForm.timerDuration / 60 : ""}
                    onChange={(e) =>
                      setSlideForm({
                        ...slideForm,
                        timerDuration: e.target.value
                          ? parseInt(e.target.value) * 60
                          : null,
                      })
                    }
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#006D77] focus:outline-none"
                    min="1"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700">
                  Notities (alleen voor jou zichtbaar)
                </label>
                <textarea
                  value={slideForm.notes}
                  onChange={(e) =>
                    setSlideForm({ ...slideForm, notes: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#006D77] focus:outline-none"
                  rows={2}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowSlideModal(false)}
                  className="flex-1 rounded-lg border border-neutral-300 px-6 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-100"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#006D77] px-6 py-3 font-semibold text-white transition hover:bg-[#005862]"
                >
                  {editingSlide ? "Opslaan" : "Toevoegen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
