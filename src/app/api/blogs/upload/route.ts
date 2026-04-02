import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/actions/helpers";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function normaliseFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");
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

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Alleen afbeeldingen zijn toegestaan" }, { status: 400 });
  }

  try {
    const filename = `blog/${Date.now()}-${normaliseFileName(file.name)}`;
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Opslaan in opslag mislukt" }, { status: 500 });
  }
}
