"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

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

export default function PresentPage({ params }: { params: { id: string } }) {
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const fetchPresentation = useCallback(async () => {
    try {
      const res = await fetch(`/api/presentations/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setPresentation(data);
        // Initialize timer if first slide has one
        if (data.slides[0]?.timerDuration) {
          setTimerSeconds(data.slides[0].timerDuration);
        }
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev === null || prev <= 0) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const nextSlide = useCallback(() => {
    if (!presentation) return;
    if (currentSlideIndex < presentation.slides.length - 1) {
      const newIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(newIndex);
      const nextSlide = presentation.slides[newIndex];
      if (nextSlide.timerDuration) {
        setTimerSeconds(nextSlide.timerDuration);
        setTimerRunning(false);
      } else {
        setTimerSeconds(null);
        setTimerRunning(false);
      }
    }
  }, [presentation, currentSlideIndex]);

  const previousSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      const newIndex = currentSlideIndex - 1;
      setCurrentSlideIndex(newIndex);
      if (presentation) {
        const prevSlide = presentation.slides[newIndex];
        if (prevSlide.timerDuration) {
          setTimerSeconds(prevSlide.timerDuration);
          setTimerRunning(false);
        } else {
          setTimerSeconds(null);
          setTimerRunning(false);
        }
      }
    }
  }, [presentation, currentSlideIndex]);

  const toggleTimer = useCallback(() => {
    if (timerSeconds !== null && timerSeconds > 0) {
      setTimerRunning((prev) => !prev);
    }
  }, [timerSeconds]);

  const resetTimer = useCallback(() => {
    if (presentation) {
      const currentSlide = presentation.slides[currentSlideIndex];
      if (currentSlide.timerDuration) {
        setTimerSeconds(currentSlide.timerDuration);
        setTimerRunning(false);
      }
    }
  }, [presentation, currentSlideIndex]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        previousSlide();
      } else if (e.key === "Home") {
        e.preventDefault();
        setCurrentSlideIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        if (presentation) {
          setCurrentSlideIndex(presentation.slides.length - 1);
        }
      } else if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setShowNotes((prev) => !prev);
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        toggleTimer();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        resetTimer();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [presentation, nextSlide, previousSlide, toggleTimer, resetTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900">
        <div className="text-lg text-white">Laden...</div>
      </div>
    );
  }

  if (!presentation || presentation.slides.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900">
        <div className="text-lg text-white">Geen presentatie gevonden</div>
      </div>
    );
  }

  const currentSlide = presentation.slides[currentSlideIndex];

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: currentSlide.backgroundColor || "#006D77",
        color: currentSlide.textColor || "#FFFFFF",
      }}
    >
      {/* Main slide content */}
      <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
        {currentSlide.imageUrl && (
          <div className="mb-8">
            <Image
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              width={400}
              height={300}
              className="rounded-2xl"
            />
          </div>
        )}

        <h1 className="mb-8 text-6xl font-bold">{currentSlide.title}</h1>

        {currentSlide.content && (
          <div className="max-w-4xl text-2xl leading-relaxed">
            {currentSlide.content.split("\n").map((line, i) => (
              <p key={i} className="mb-4">
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Timer display */}
        {timerSeconds !== null && (
          <div className="mt-12">
            <div
              className={`text-8xl font-bold ${
                timerSeconds <= 60 ? "animate-pulse text-red-400" : ""
              }`}
            >
              {formatTime(timerSeconds)}
            </div>
            <div className="mt-4 text-xl opacity-70">
              {timerRunning ? "Druk op T om te pauzeren" : "Druk op T om te starten"}
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar with controls */}
      <div className="flex items-center justify-between border-t border-white/20 bg-black/20 px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="text-sm opacity-70">
            Slide {currentSlideIndex + 1} / {presentation.slides.length}
          </div>
          <div className="h-4 w-px bg-white/30"></div>
          <div className="text-xs opacity-50">
            ← → navigeren • N = notities • T = timer • R = reset
          </div>
        </div>

        {timerSeconds !== null && (
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTimer}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
            >
              {timerRunning ? "Pauzeer" : "Start"} Timer
            </button>
            <button
              onClick={resetTimer}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Speaker notes overlay */}
      {showNotes && currentSlide.notes && (
        <div className="fixed bottom-0 left-0 right-0 max-h-48 overflow-y-auto border-t-2 border-white/30 bg-black/80 p-6 backdrop-blur">
          <div className="text-sm">
            <span className="mr-2 font-bold opacity-70">Notities:</span>
            {currentSlide.notes}
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="h-1 bg-white/10">
        <div
          className="h-full bg-white/50 transition-all duration-300"
          style={{
            width: `${((currentSlideIndex + 1) / presentation.slides.length) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
