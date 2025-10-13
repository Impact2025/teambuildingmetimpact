"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { generateUniqueViewerPin } from "@/lib/viewer-pin";
import { createSessionsFromPlan } from "@/lib/workshop-plan";

import { requireAdmin } from "./helpers";

const workshopSchema = z.object({
  title: z.string().min(3, "Titel is verplicht"),
  date: z.coerce.date(),
  description: z.string().optional(),
  themeColor: z.string().optional(),
  facilitatorName: z.string().optional(),
  facilitatorTitle: z.string().optional(),
});

const sessionSchema = z.object({
  workshopId: z.string().cuid(),
  title: z.string().min(3, "Titel is verplicht"),
  assignmentMarkdown: z.string().min(1, "Opdracht is verplicht"),
  buildDurationSec: z.coerce.number().int().positive(),
  discussDurationSec: z.coerce.number().int().positive(),
  themeColor: z.string().optional(),
  facilitatorNotes: z.string().optional(),
});

const sessionUpdateSchema = sessionSchema.partial();

export async function createWorkshopAction(input: z.input<typeof workshopSchema>) {
  await requireAdmin();
  const data = workshopSchema.parse(input);

  const workshop = await prisma.$transaction(async (tx) => {
    const viewerPin = await generateUniqueViewerPin(tx);

    const created = await tx.workshop.create({
      data: {
        title: data.title,
        date: data.date,
        description: data.description,
        themeColor: data.themeColor,
        facilitatorName: data.facilitatorName,
        facilitatorTitle: data.facilitatorTitle,
        viewerPin,
      },
    });

    await tx.workshopState.create({
      data: {
        workshopId: created.id,
      },
    });

    return created;
  });

  revalidatePath("/admin");
  revalidatePath("/admin/sessions");

  return workshop;
}

export async function updateWorkshopAction(
  workshopId: string,
  input: Partial<z.infer<typeof workshopSchema>>
) {
  await requireAdmin();
  const data = workshopSchema.partial().parse(input);

  const workshop = await prisma.workshop.update({
    where: { id: workshopId },
    data: {
      ...(data.date !== undefined ? { date: data.date } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.themeColor !== undefined ? { themeColor: data.themeColor } : {}),
      ...(data.facilitatorName !== undefined
        ? { facilitatorName: data.facilitatorName }
        : {}),
      ...(data.facilitatorTitle !== undefined
        ? { facilitatorTitle: data.facilitatorTitle }
        : {}),
      ...(data.title !== undefined ? { title: data.title } : {}),
    },
  });

  revalidatePath(`/admin/workshops/${workshopId}`);
  revalidatePath("/admin/sessions");

  return workshop;
}

export async function deleteWorkshopAction(workshopId: string) {
  await requireAdmin();

  await prisma.workshop.delete({
    where: { id: workshopId },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/sessions");
}

export async function cloneWorkshopAction(workshopId: string) {
  await requireAdmin();

  const workshop = await prisma.workshop.findUnique({
    where: { id: workshopId },
    include: { sessions: { orderBy: { order: "asc" } } },
  });

  if (!workshop) {
    throw new Error("Workshop niet gevonden");
  }

  const copy = await prisma.$transaction(async (tx) => {
    const viewerPin = await generateUniqueViewerPin(tx);

    const created = await tx.workshop.create({
      data: {
        title: `${workshop.title} (kopie)`,
        date: workshop.date,
        description: workshop.description,
        themeColor: workshop.themeColor,
        facilitatorName: workshop.facilitatorName,
        facilitatorTitle: workshop.facilitatorTitle,
        status: "DRAFT",
        viewerPin,
        sessions: {
          create: workshop.sessions.map((session) => ({
            title: session.title,
            assignmentMarkdown: session.assignmentMarkdown,
            buildDurationSec: session.buildDurationSec,
            discussDurationSec: session.discussDurationSec,
            themeColor: session.themeColor,
            facilitatorNotes: session.facilitatorNotes,
            order: session.order,
          })),
        },
      },
    });

    await tx.workshopState.create({
      data: {
        workshopId: created.id,
      },
    });

    return created;
  });

  revalidatePath("/admin/sessions");

  return copy;
}

export async function createSessionAction(input: z.infer<typeof sessionSchema>) {
  await requireAdmin();
  const data = sessionSchema.parse(input);

  const order = await prisma.workshopSession.count({
    where: { workshopId: data.workshopId },
  });

  const session = await prisma.workshopSession.create({
    data: {
      workshopId: data.workshopId,
      title: data.title,
      assignmentMarkdown: data.assignmentMarkdown,
      buildDurationSec: data.buildDurationSec,
      discussDurationSec: data.discussDurationSec,
      themeColor: data.themeColor,
      facilitatorNotes: data.facilitatorNotes,
      order,
    },
  });

  revalidatePath(`/admin/sessions/${data.workshopId}`);
  revalidatePath("/admin/sessions");

  return session;
}

export async function updateSessionAction(
  sessionId: string,
  input: z.infer<typeof sessionUpdateSchema>
) {
  await requireAdmin();
  const data = sessionUpdateSchema.parse(input);

  const session = await prisma.workshopSession.update({
    where: { id: sessionId },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.assignmentMarkdown !== undefined
        ? { assignmentMarkdown: data.assignmentMarkdown }
        : {}),
      ...(data.buildDurationSec !== undefined
        ? { buildDurationSec: data.buildDurationSec }
        : {}),
      ...(data.discussDurationSec !== undefined
        ? { discussDurationSec: data.discussDurationSec }
        : {}),
      ...(data.themeColor !== undefined ? { themeColor: data.themeColor } : {}),
      ...(data.facilitatorNotes !== undefined
        ? { facilitatorNotes: data.facilitatorNotes }
        : {}),
    },
  });

  revalidatePath(`/admin/sessions/${session.workshopId}`);

  return session;
}

export async function deleteSessionAction(sessionId: string) {
  await requireAdmin();

  const session = await prisma.workshopSession.delete({
    where: { id: sessionId },
    select: {
      workshopId: true,
    },
  });

  const sessions = await prisma.workshopSession.findMany({
    where: { workshopId: session.workshopId },
    orderBy: { order: "asc" },
  });

  await Promise.all(
    sessions.map((item, index) =>
      prisma.workshopSession.update({
        where: { id: item.id },
        data: { order: index },
      })
    )
  );

  revalidatePath(`/admin/sessions/${session.workshopId}`);
  revalidatePath("/admin/sessions");
}

export async function reorderSessionsAction(
  workshopId: string,
  orderedSessionIds: string[]
) {
  await requireAdmin();

  await Promise.all(
    orderedSessionIds.map((id, index) =>
      prisma.workshopSession.update({
        where: { id },
        data: { order: index },
      })
    )
  );

  revalidatePath(`/admin/sessions/${workshopId}`);
}

export type WorkshopActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function createWorkshopFormAction(
  _prevState: WorkshopActionState | undefined,
  formData: FormData
): Promise<WorkshopActionState> {
  try {
    await createWorkshopAction({
      title: formData.get("title")?.toString() ?? "",
      date: formData.get("date")?.toString() ?? "",
      description: formData.get("description")?.toString() || undefined,
      themeColor: formData.get("themeColor")?.toString() || undefined,
      facilitatorName: formData.get("facilitatorName")?.toString() || undefined,
      facilitatorTitle: formData.get("facilitatorTitle")?.toString() || undefined,
    });

    return { status: "success", message: "Workshop aangemaakt." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: "error",
        message: error.issues[0]?.message ?? "Controleer de invoer.",
      };
    }

    return {
      status: "error",
      message: "Kon workshop niet aanmaken.",
    };
  }
}

export async function createSessionFormAction(
  _prevState: WorkshopActionState | undefined,
  formData: FormData
): Promise<WorkshopActionState> {
  try {
    const buildMinutes = Number(formData.get("buildMinutes") ?? 0);
    const buildSeconds = Number(formData.get("buildSeconds") ?? 0);
    const discussMinutes = Number(formData.get("discussMinutes") ?? 0);
    const discussSeconds = Number(formData.get("discussSeconds") ?? 0);

    await createSessionAction({
      workshopId: formData.get("workshopId")?.toString() ?? "",
      title: formData.get("title")?.toString() ?? "",
      assignmentMarkdown: formData.get("assignmentMarkdown")?.toString() ?? "",
      buildDurationSec: (buildMinutes || 0) * 60 + (buildSeconds || 0),
      discussDurationSec: (discussMinutes || 0) * 60 + (discussSeconds || 0),
      themeColor: formData.get("themeColor")?.toString() || undefined,
      facilitatorNotes: formData.get("facilitatorNotes")?.toString() || undefined,
    });

    return { status: "success", message: "Sessie toegevoegd." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: "error",
        message: error.issues[0]?.message ?? "Controleer de invoer.",
      };
    }

    return {
      status: "error",
      message: "Kon sessie niet toevoegen.",
    };
  }
}

export async function updateSessionFormAction(
  _prevState: WorkshopActionState | undefined,
  formData: FormData
): Promise<WorkshopActionState> {
  try {
    const sessionId = formData.get("sessionId")?.toString() ?? "";
    const buildMinutes = Number(formData.get("buildMinutes") ?? 0);
    const buildSeconds = Number(formData.get("buildSeconds") ?? 0);
    const discussMinutes = Number(formData.get("discussMinutes") ?? 0);
    const discussSeconds = Number(formData.get("discussSeconds") ?? 0);

    await updateSessionAction(sessionId, {
      title: formData.get("title")?.toString() ?? undefined,
      assignmentMarkdown: formData.get("assignmentMarkdown")?.toString() ?? undefined,
      buildDurationSec: (buildMinutes || 0) * 60 + (buildSeconds || 0),
      discussDurationSec: (discussMinutes || 0) * 60 + (discussSeconds || 0),
      themeColor: formData.get("themeColor")?.toString() || undefined,
      facilitatorNotes: formData.get("facilitatorNotes")?.toString() || undefined,
    });

    return { status: "success", message: "Sessie bijgewerkt." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: "error",
        message: error.issues[0]?.message ?? "Controleer de invoer.",
      };
    }

    return {
      status: "error",
      message: "Kon sessie niet bijwerken.",
    };
  }
}

export async function importWorkshopPlanAction(
  _prevState: WorkshopActionState | undefined,
  formData: FormData
): Promise<WorkshopActionState> {
  try {
    await requireAdmin();

    const workshopId = formData.get("workshopId")?.toString() ?? "";
    const planText = formData.get("planText")?.toString() ?? "";
    const replaceExisting = formData.get("replaceExisting") === "on";

    if (!workshopId) {
      return { status: "error", message: "Workshop ontbreekt." };
    }

    if (!planText.trim()) {
      return {
        status: "error",
        message: "Geen planningstekst gevonden.",
      };
    }

    const parsedSessions = createSessionsFromPlan(planText);

    if (parsedSessions.length === 0) {
      return {
        status: "error",
        message: "Kon geen sessies uit de tekst halen.",
      };
    }

    await prisma.$transaction(async (tx) => {
      if (replaceExisting) {
        await tx.workshopSession.deleteMany({ where: { workshopId } });
      }

      const baseOrder = replaceExisting
        ? 0
        : await tx.workshopSession.count({ where: { workshopId } });

      for (let index = 0; index < parsedSessions.length; index += 1) {
        const session = parsedSessions[index];
        await tx.workshopSession.create({
          data: {
            workshopId,
            title: session.title,
            assignmentMarkdown: session.assignmentMarkdown,
            buildDurationSec: session.buildDurationSec,
            discussDurationSec: session.discussDurationSec,
            themeColor: session.themeColor,
            facilitatorNotes: session.facilitatorNotes,
            order: baseOrder + index,
          },
        });
      }
    });

    revalidatePath(`/admin/sessions/${workshopId}`);
    revalidatePath("/admin/sessions");

    return {
      status: "success",
      message: `${parsedSessions.length} sessies geïmporteerd.`,
    };
  } catch (error) {
    console.error("Import workshop plan failed", error);
    return {
      status: "error",
      message: "Importeren van planning is mislukt.",
    };
  }
}
