import { createSupabaseServerClient } from "@/lib/supabase/server";

export const WORKSHOP_UPLOAD_BUCKET = "workshop-uploads";

export function normaliseUploadFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function getUploadSignedUrl(path: string) {
  let supabase;
  try {
    supabase = createSupabaseServerClient();
  } catch (error) {
    throw new Error("Supabase opslag is niet geconfigureerd");
  }
  const { data, error } = await supabase.storage
    .from(WORKSHOP_UPLOAD_BUCKET)
    .createSignedUrl(path, 60 * 60);

  if (error || !data?.signedUrl) {
    throw new Error("Kon ondertekende URL niet genereren");
  }

  return data.signedUrl;
}
