import { getSupabase } from "../config/supabase.js";

export async function findProfileById(userId) {
  if (!userId) {
    throw new Error("A user ID is required.");
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, username, display_name, bio, avatar_url, account_type, created_at"
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to retrieve profile: ${error.message}`);
  }

  return data;
}

export async function findProfileByUsername(username) {
  if (!username || typeof username !== "string") {
    throw new Error("A valid username is required.");
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, username, display_name, bio, avatar_url, account_type, created_at"
    )
    .eq("username", username.trim().toLowerCase())
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to retrieve profile: ${error.message}`);
  }

  return data;
}