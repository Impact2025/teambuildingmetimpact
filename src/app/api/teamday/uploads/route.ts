import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getTeamdayProgram, TEAMDAY_PROGRAM_SLUG, ensureTeamdayProgramSeed } from "@/lib/teamday-program";
import { createTeamdayUpload } from "@/lib/teamday-uploads";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const sessionId = formData.get("sessionId")?.toString();
  if (!sessionId) {
    return NextResponse.json({ error: "Sessiereferentie ontbreekt" }, { status: 400 });
  }

  const program = await getTeamdayProgram();
  const sessionExists = program.sessions.some((session) => session.id === sessionId);

  if (!sessionExists) {
    return NextResponse.json({ error: "Onbekende sessie" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Bestand ontbreekt" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Bestand is groter dan 10MB" }, { status: 413 });
  }

  await ensureTeamdayProgramSeed();
  const programRecord = await fetchProgramId();

  try {
    const upload = await createTeamdayUpload(sessionId, file, {
      title: formData.get("title")?.toString() ?? null,
      notes: formData.get("notes")?.toString() ?? null,
      tags: (formData.get("tags")?.toString() ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      uploadedBy: formData.get("uploadedBy")?.toString() ?? null,
      programId: programRecord?.id ?? null,
    });

    return NextResponse.json({ upload });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Upload mislukt" }, { status: 500 });
  }
}

async function fetchProgramId() {
  return prisma.teamdayProgram.findUnique({
    where: { slug: TEAMDAY_PROGRAM_SLUG },
    select: { id: true },
  });
}
