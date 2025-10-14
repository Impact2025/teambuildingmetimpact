import { Buffer } from "node:buffer";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  WORKSHOP_UPLOAD_BUCKET,
  normaliseUploadFileName,
} from "@/lib/workshop/uploads";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const pin = formData.get("pin")?.toString();
  if (!pin) {
    return NextResponse.json({ error: "Pincode ontbreekt" }, { status: 400 });
  }

  const workshop = await prisma.workshop.findUnique({
    where: { viewerPin: pin },
    include: {
      sessions: {
        select: { id: true },
      },
    },
  });

  if (!workshop) {
    return NextResponse.json({ error: "Onbekende pincode" }, { status: 403 });
  }

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

  const belongsToWorkshop = workshop.sessions.some(
    (session) => session.id === sessionId
  );

  if (!belongsToWorkshop) {
    return NextResponse.json({ error: "Sessie hoort niet bij deze workshop" }, { status: 403 });
  }

  let supabase;
  try {
    supabase = createSupabaseServerClient();
  } catch (error) {
    console.error("Supabase configuratie ontbreekt", error);
    return NextResponse.json({ error: "Opslag niet geconfigureerd" }, { status: 500 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `${workshop.id}/${sessionId}/${Date.now()}-${normaliseUploadFileName(
    file.name
  )}`;

  const { error: uploadError } = await supabase.storage
    .from(WORKSHOP_UPLOAD_BUCKET)
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
      uploadedBy: formData.get("uploadedBy")?.toString() ?? "viewer",
    },
  });

  return NextResponse.json({ upload });
}
