import { getSupabase } from "../config/supabase.js";

export async function registerWithEmail(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Email and password must be text.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (password.length < 12) {
    throw new Error("Password must contain at least 12 characters.");
  }

  const supabase = getSupabase();

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: data.user,
    session: data.session,
    requiresEmailConfirmation: !data.session
  };
}

export async function signInWithEmail(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const supabase = getSupabase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password
  });

  if (error) {
    throw new Error("Unable to sign in. Check your details and try again.");
  }

  return {
    user: data.user,
    session: data.session
  };
}

export async function signOutUser(accessToken) {
  if (!accessToken) {
    throw new Error("A valid access token is required.");
  }

  const supabase = getSupabase();

  const { error } = await supabase.auth.admin.signOut(accessToken);

  if (error) {
    throw new Error("Unable to sign out.");
  }

  return { success: true };
}