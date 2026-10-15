import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY;

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  !supabaseServiceRoleKey
) {
  console.warn(
    "TIVA: Supabase environment variables are not configured."
  );
}

const fallbackUrl = "http://127.0.0.1:54321";

export const supabasePublic = createClient(
  supabaseUrl || fallbackUrl,
  supabaseAnonKey || "missing-anon-key",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

export const supabaseAdmin = createClient(
  supabaseUrl || fallbackUrl,
  supabaseServiceRoleKey || "missing-service-role-key",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);