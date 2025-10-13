import { createSupabaseServerClient } from "@/lib/supabase/server";

const BUCKET = "workshop-uploads";

export async function getUploadSignedUrl(path: string) {
  let supabase;
  try {
    supabase = createSupabaseServerClient();
  } catch (error) {
    throw new Error("Supabase opslag is niet geconfigureerd");
  }
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60);

  if (error || !data?.signedUrl) {
    throw new Error("Kon ondertekende URL niet genereren");
  }

  return data.signedUrl;
}
