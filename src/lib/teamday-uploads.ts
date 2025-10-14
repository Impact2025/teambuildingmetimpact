import { Buffer } from "node:buffer";

import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { WORKSHOP_UPLOAD_BUCKET, normaliseUploadFileName } from "@/lib/workshop/uploads";

export type TeamdayUploadRecord = {
  id: string;
  sessionKey: string;
  title: string | null;
  notes: string | null;
  tags: string[];
  uploadedBy: string | null;
  createdAt: Date;
  url: string;
};

async function ensureSupabaseClient() {
  try {
    return createSupabaseServerClient();
  } catch (error) {
    console.error("Supabase opslag is niet geconfigureerd", error);
    throw new Error("Opslag niet geconfigureerd");
  }
}

export async function createTeamdayUpload(
  sessionKey: string,
  file: File,
  meta: {
    title?: string | null;
    notes?: string | null;
    tags?: string[];
    uploadedBy?: string | null;
    programId?: string | null;
  }
): Promise<TeamdayUploadRecord> {
  const supabase = await ensureSupabaseClient();

  const key = `teamday/${sessionKey}/${Date.now()}-${normaliseUploadFileName(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(WORKSHOP_UPLOAD_BUCKET)
    .upload(key, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (uploadError) {
    console.error(uploadError);
    throw new Error("Opslaan in opslag mislukt");
  }

  const created = await prisma.teamdayUpload.create({
    data: {
      sessionKey,
      storagePath: key,
      title: meta.title ?? null,
      notes: meta.notes ?? null,
      tags: meta.tags ?? [],
      uploadedBy: meta.uploadedBy ?? null,
      programId: meta.programId ?? null,
    },
  });

  const url = await getSignedUrl(key);

  return {
    id: created.id,
    sessionKey: created.sessionKey,
    title: created.title,
    notes: created.notes,
    tags: created.tags,
    uploadedBy: created.uploadedBy,
    createdAt: created.createdAt,
    url,
  };
}

export async function getSignedUrl(path: string) {
  const supabase = await ensureSupabaseClient();
  const { data, error } = await supabase.storage
    .from(WORKSHOP_UPLOAD_BUCKET)
    .createSignedUrl(path, 60 * 60);

  if (error || !data?.signedUrl) {
    throw new Error("Kon ondertekende URL niet genereren");
  }

  return data.signedUrl;
}

export async function getTeamdayUploadsBySession(
  sessionKeys: string[]
): Promise<Record<string, TeamdayUploadRecord[]>> {
  if (sessionKeys.length === 0) {
    return {};
  }

  const uploads = await prisma.teamdayUpload.findMany({
    where: { sessionKey: { in: sessionKeys } },
    orderBy: { createdAt: "desc" },
  });

  const results: Record<string, TeamdayUploadRecord[]> = {};

  for (const upload of uploads) {
    let url: string;
    try {
      url = await getSignedUrl(upload.storagePath);
    } catch (error) {
      console.error("Kon signed URL niet ophalen", error);
      continue;
    }

    if (!results[upload.sessionKey]) {
      results[upload.sessionKey] = [];
    }

    results[upload.sessionKey].push({
      id: upload.id,
      sessionKey: upload.sessionKey,
      title: upload.title,
      notes: upload.notes,
      tags: upload.tags,
      uploadedBy: upload.uploadedBy,
      createdAt: upload.createdAt,
      url,
    });
  }

  return results;
}
