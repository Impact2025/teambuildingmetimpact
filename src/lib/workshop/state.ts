import { SessionPhase } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { WorkshopLiveState } from "@/types/workshop";

import { buildSlides } from "./slides";

const phaseMap: Record<SessionPhase, WorkshopLiveState["phase"]> = {
  BUILD: "build",
  DISCUSS: "discuss",
  PAUSED: "pause",
  TRANSITION: "transition",
  COMPLETE: "complete",
};

export async function getWorkshopLiveState(workshopId: string): Promise<WorkshopLiveState> {
  const workshop = await prisma.workshop.findUnique({
    where: { id: workshopId },
    include: {
      sessions: {
        orderBy: { order: "asc" },
      },
      workshopState: true,
    },
  });

  if (!workshop || !workshop.workshopState) {
    throw new Error("Workshop state niet gevonden");
  }

  const slides = buildSlides(workshop, workshop.sessions);
  const activeSlideIndex = Math.min(
    workshop.workshopState.activeSlide,
    Math.max(slides.length - 1, 0)
  );
  const activeSessionId = workshop.workshopState.activeSessionId ?? undefined;

  const currentSession = activeSessionId
    ? workshop.sessions.find((session) => session.id === activeSessionId)
    : null;

  const sessionState = activeSessionId
    ? await prisma.sessionState.findUnique({ where: { sessionId: activeSessionId } })
    : null;

  const phase = sessionState ? phaseMap[sessionState.phase] : "idle";
  let remainingSeconds = sessionState?.remainingSeconds ?? 0;
  let lastTickAt: number | undefined;

  if (sessionState) {
    const updatedAtMs = sessionState.updatedAt.getTime();
    if (sessionState.isRunning) {
      const elapsed = (Date.now() - updatedAtMs) / 1000;
      remainingSeconds = Math.max(0, remainingSeconds - elapsed);
      lastTickAt = Date.now();
    } else {
      lastTickAt = updatedAtMs;
    }
  }

  const totalSeconds = currentSession
    ? sessionState?.phase === SessionPhase.DISCUSS
      ? currentSession.discussDurationSec
      : currentSession.buildDurationSec
    : remainingSeconds;

  return {
    workshopId,
    activeSlideIndex,
    slides,
    activeSessionId,
    phase,
    remainingSeconds,
    totalSeconds,
    timerRunning: sessionState?.isRunning ?? false,
    lastTickAt,
    displayMode: workshop.workshopState.displayMode.toLowerCase() as WorkshopLiveState["displayMode"],
    alarm: {
      active:
        phase === "complete" || (remainingSeconds === 0 && (sessionState?.isRunning ?? false) === false),
      muted: sessionState?.alarmMuted ?? false,
      snoozeUntil: null,
    },
    updatedAt: Date.now(),
  };
}
