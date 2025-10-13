"use server";

import { revalidatePath } from "next/cache";
import { SessionPhase } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getWorkshopLiveState } from "@/lib/workshop/state";
import type { WorkshopLiveState } from "@/types/workshop";

import { requireAdmin } from "./helpers";

function toSessionPhase(phase: "build" | "discuss" | "pause" | "transition" | "complete") {
  switch (phase) {
    case "build":
      return SessionPhase.BUILD;
    case "discuss":
      return SessionPhase.DISCUSS;
    case "pause":
      return SessionPhase.PAUSED;
    case "transition":
      return SessionPhase.TRANSITION;
    case "complete":
      return SessionPhase.COMPLETE;
    default:
      return SessionPhase.BUILD;
  }
}

async function upsertSessionState(
  sessionId: string,
  data: {
    phase: SessionPhase;
    remainingSeconds: number;
    isRunning: boolean;
    alarmMuted?: boolean;
  }
) {
  await prisma.sessionState.upsert({
    where: { sessionId },
    update: {
      phase: data.phase,
      remainingSeconds: data.remainingSeconds,
      isRunning: data.isRunning,
      alarmMuted: data.alarmMuted ?? false,
    },
    create: {
      sessionId,
      phase: data.phase,
      remainingSeconds: data.remainingSeconds,
      isRunning: data.isRunning,
      alarmMuted: data.alarmMuted ?? false,
    },
  });
}

async function broadcastState(workshopId: string): Promise<WorkshopLiveState> {
  const state = await getWorkshopLiveState(workshopId);
  revalidatePath(`/admin/timer`);
  revalidatePath(`/presenter/${workshopId}`);
  return state;
}

export async function setActiveSlideAction(workshopId: string, slideIndex: number) {
  await requireAdmin();

  await prisma.workshopState.update({
    where: { workshopId },
    data: { activeSlide: slideIndex },
  });

  return broadcastState(workshopId);
}

export async function setDisplayModeAction(
  workshopId: string,
  mode: "standard" | "focus" | "pause"
) {
  await requireAdmin();

  await prisma.workshopState.update({
    where: { workshopId },
    data: { displayMode: mode.toUpperCase() as any },
  });

  return broadcastState(workshopId);
}

export async function startPhaseAction(
  workshopId: string,
  sessionId: string,
  phase: "build" | "discuss"
) {
  await requireAdmin();

  const session = await prisma.workshopSession.findUnique({
    where: { id: sessionId },
    select: {
      workshopId: true,
      buildDurationSec: true,
      discussDurationSec: true,
      order: true,
    },
  });

  if (!session || session.workshopId !== workshopId) {
    throw new Error("Sessie bestaat niet");
  }

  const duration =
    phase === "build" ? session.buildDurationSec : session.discussDurationSec;

  await upsertSessionState(sessionId, {
    phase: toSessionPhase(phase),
    remainingSeconds: duration,
    isRunning: true,
  });

  await prisma.workshopState.update({
    where: { workshopId },
    data: {
      activeSessionId: sessionId,
      activeSlide: Math.max(session.order + 3, 0),
    },
  });

  return broadcastState(workshopId);
}

export async function updateTimerProgressAction(
  workshopId: string,
  sessionId: string,
  remainingSeconds: number,
  timerRunning: boolean
) {
  await requireAdmin();

  const sessionState = await prisma.sessionState.findUnique({
    where: { sessionId },
  });

  if (!sessionState) {
    throw new Error("Timerstatus niet gevonden");
  }

  await prisma.sessionState.update({
    where: { sessionId },
    data: {
      remainingSeconds: Math.max(0, remainingSeconds),
      isRunning: timerRunning,
    },
  });

  return broadcastState(workshopId);
}

export async function pauseTimerAction(workshopId: string, sessionId: string) {
  await requireAdmin();

  await prisma.sessionState.update({
    where: { sessionId },
    data: { isRunning: false },
  });

  return broadcastState(workshopId);
}

export async function resumeTimerAction(
  workshopId: string,
  sessionId: string
) {
  await requireAdmin();

  await prisma.sessionState.update({
    where: { sessionId },
    data: { isRunning: true },
  });

  return broadcastState(workshopId);
}

export async function completePhaseAction(
  workshopId: string,
  sessionId: string
) {
  await requireAdmin();

  await prisma.sessionState.update({
    where: { sessionId },
    data: {
      phase: SessionPhase.COMPLETE,
      remainingSeconds: 0,
      isRunning: false,
    },
  });

  return broadcastState(workshopId);
}

export async function snoozeTimerAction(
  workshopId: string,
  sessionId: string,
  seconds: number
) {
  await requireAdmin();

  const state = await prisma.sessionState.findUnique({ where: { sessionId } });

  if (!state) {
    throw new Error("Timerstatus niet gevonden");
  }

  await prisma.sessionState.update({
    where: { sessionId },
    data: {
      remainingSeconds: state.remainingSeconds + seconds,
    },
  });

  return broadcastState(workshopId);
}

export async function toggleAlarmMuteAction(
  workshopId: string,
  sessionId: string,
  muted: boolean
) {
  await requireAdmin();

  await prisma.sessionState.update({
    where: { sessionId },
    data: { alarmMuted: muted },
  });

  return broadcastState(workshopId);
}
