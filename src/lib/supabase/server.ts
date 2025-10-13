import { createClient } from "@supabase/supabase-js";

export const createSupabaseServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase server client is not geconfigureerd. Voeg SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY toe.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
};
