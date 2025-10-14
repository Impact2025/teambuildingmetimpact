"use server";

import { revalidatePath } from "next/cache";

import {
  DEFAULT_TEAMDAY_PROGRAM,
  getTeamdayProgram,
  type TeamdayProgram,
  upsertTeamdayProgram,
} from "@/lib/teamday-program";

type TeamdayProgramActionResult = {
  status: "success" | "error";
  message?: string;
  program?: TeamdayProgram;
};

const REVALIDATE_PATHS = ["/teamdag", "/admin/teamday"];

export async function updateTeamdayProgramAction(
  program: TeamdayProgram
): Promise<TeamdayProgramActionResult> {
  try {
    await upsertTeamdayProgram(program);
    REVALIDATE_PATHS.forEach((path) => revalidatePath(path));

    const nextProgram = await getTeamdayProgram();

    return {
      status: "success",
      message: "Programma opgeslagen.",
      program: nextProgram,
    };
  } catch (error) {
    console.error("Kon teamdag-programma niet opslaan", error);
    return {
      status: "error",
      message: "Opslaan mislukt. Controleer invoer en probeer opnieuw.",
    };
  }
}

export async function resetTeamdayProgramAction(): Promise<TeamdayProgramActionResult> {
  try {
    await upsertTeamdayProgram(DEFAULT_TEAMDAY_PROGRAM);
    REVALIDATE_PATHS.forEach((path) => revalidatePath(path));

    return {
      status: "success",
      message: "Programma teruggezet naar standaard versie.",
      program: DEFAULT_TEAMDAY_PROGRAM,
    };
  } catch (error) {
    console.error("Kon teamdag-programma niet resetten", error);
    return {
      status: "error",
      message: "Reset mislukt. Probeer het later opnieuw.",
    };
  }
}
