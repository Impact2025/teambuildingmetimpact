import { Buffer } from "node:buffer";
import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/actions/helpers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const BLOG_IMAGES_BUCKET = "blog-images";

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

  // Only allow images
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Alleen afbeeldingen zijn toegestaan" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = createSupabaseServerClient();
  } catch (error) {
    console.error("Supabase configuratie ontbreekt", error);
    return NextResponse.json({ error: "Opslag niet geconfigureerd" }, { status: 500 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `${Date.now()}-${normaliseFileName(file.name)}`;

  const { error: uploadError } = await supabase.storage
    .from(BLOG_IMAGES_BUCKET)
    .upload(key, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return NextResponse.json({ error: "Opslaan in opslag mislukt" }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BLOG_IMAGES_BUCKET)
    .getPublicUrl(key);

  return NextResponse.json({ url: urlData.publicUrl });
}
