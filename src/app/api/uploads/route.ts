import { Buffer } from "node:buffer";
import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/actions/helpers";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const BUCKET = "workshop-uploads";

function normaliseFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function POST(request: NextRequest) {
  await requireAdmin();

  const formData = await request.formData();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Bestand ontbreekt" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Bestand is groter dan 10MB" }, { status: 413 });
  }

  const sessionId = formData.get("sessionId")?.toString();
  if (!sessionId) {
    return NextResponse.json({ error: "Sessiereferentie ontbreekt" }, { status: 400 });
  }

  const session = await prisma.workshopSession.findUnique({
    where: { id: sessionId },
    select: { workshopId: true },
  });

  if (!session) {
    return NextResponse.json({ error: "Sessie niet gevonden" }, { status: 404 });
  }

  let supabase;
  try {
    supabase = createSupabaseServerClient();
  } catch (error) {
    console.error("Supabase configuratie ontbreekt", error);
    return NextResponse.json({ error: "Opslag niet geconfigureerd" }, { status: 500 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `${session.workshopId}/${sessionId}/${Date.now()}-${normaliseFileName(
    file.name
  )}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(key, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (uploadError) {
    console.error(uploadError);
    return NextResponse.json({ error: "Opslaan in opslag mislukt" }, { status: 500 });
  }

  const tagsRaw = formData.get("tags")?.toString() ?? "";
  const tags = tagsRaw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const upload = await prisma.buildUpload.create({
    data: {
      sessionId,
      storagePath: key,
      title: formData.get("title")?.toString() ?? null,
      tags,
      notes: formData.get("notes")?.toString() ?? null,
    },
  });

  return NextResponse.json({ upload });
}
