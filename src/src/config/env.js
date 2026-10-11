const REQUIRED_ENV = [
  "SUPABASE_URL",
  "SUPABASE_SECRET_KEY"
];

export function validateEnvironment() {
  const missing = REQUIRED_ENV.filter(
    (name) => !process.env[name]
  );

  if (missing.length > 0) {
    console.warn(
      `[TIVA] Database configuration is incomplete. Missing: ${missing.join(", ")}`
    );

    return false;
  }

  return true;
}