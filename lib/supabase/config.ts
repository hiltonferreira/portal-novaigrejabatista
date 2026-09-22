export function sharedAccessConfigured() {
  return process.env.PORTAL_SHARED_ACCESS === "true" && process.env.VERCEL_ENV !== "production" &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}
