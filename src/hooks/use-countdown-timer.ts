"use client";

import { useEffect, useRef, useState } from "react";

export function useCountdownTimer(
  initialSeconds: number,
  running: boolean,
  lastTickAt?: number
) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    let base = initialSeconds;
    if (running && lastTickAt) {
      const elapsed = (Date.now() - lastTickAt) / 1000;
      base = Math.max(0, initialSeconds - elapsed);
    }
    setSeconds(base);
    lastTickRef.current = null;
  }, [initialSeconds, lastTickAt, running]);

  useEffect(() => {
    if (!running) {
      lastTickRef.current = null;
      return;
    }

    let rafId: number;

    const loop = (timestamp: number) => {
      if (lastTickRef.current == null) {
        lastTickRef.current = timestamp;
      }
      const delta = (timestamp - lastTickRef.current) / 1000;
      lastTickRef.current = timestamp;

      setSeconds((prev) => {
        const next = Math.max(0, prev - delta);
        if (next > 0) {
          rafId = requestAnimationFrame(loop);
        }
        return next;
      });
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      lastTickRef.current = null;
    };
  }, [running]);

  return Math.ceil(seconds);
}
