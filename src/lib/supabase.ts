import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

// Sanitize the Supabase URL: trim whitespace and remove trailing slashes
// that can cause "Invalid path specified in request URL" errors.
const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function sanitizeUrl(url: string): string {
  let cleaned = url.trim();
  // Remove trailing slashes
  cleaned = cleaned.replace(/\/+$/, "");
  // Remove any trailing path segments like /auth/v1, /rest/v1, etc.
  cleaned = cleaned.replace(/\/(auth|rest|realtime|storage|functions|graphql)\/.*$/, "");
  return cleaned;
}

const supabaseUrl = rawUrl ? sanitizeUrl(rawUrl) : "";
const supabaseAnonKey = rawKey ? rawKey.trim() : "";

// Validate URL format
function isValidSupabaseUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.includes("supabase");
  } catch {
    return false;
  }
}

// Create a mock Supabase client that silently no-ops when not configured.
// This prevents the real createClient("", "") from throwing during module
// evaluation, which would crash the entire app before React can mount.
function createMockClient(): SupabaseClient {
  const handler: ProxyHandler<SupabaseClient> = {
    get(_, prop) {
      if (prop === "auth") {
        return {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
          signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
          signOut: () => Promise.resolve({ error: null }),
          resetPasswordForEmail: () => Promise.resolve({ data: {}, error: null }),
          updateUser: () => Promise.resolve({ data: { user: null }, error: null }),
          getUser: () => Promise.resolve({ data: { user: null }, error: null }),
          refreshSession: () => Promise.resolve({ data: { session: null }, error: null }),
          setSession: () => Promise.resolve({ data: { session: null }, error: null }),
          exchangeCodeForSession: () => Promise.resolve({ data: { session: null }, error: null }),
          signInWithOAuth: () => Promise.resolve({ data: { provider: null, url: null }, error: null }),
          signInWithOtp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
          verifyOtp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
          reauthenticate: () => Promise.resolve({ error: null }),
        };
      }
      if (prop === "from") {
        return () => ({
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
              maybeSingle: () => Promise.resolve({ data: null, error: null }),
              order: () => ({
                eq: () => Promise.resolve({ data: [], error: null }),
              }),
              limit: () => Promise.resolve({ data: [], error: null }),
            }),
            order: () => ({
              eq: () => Promise.resolve({ data: [], error: null }),
              limit: () => Promise.resolve({ data: [], error: null }),
            }),
            limit: () => Promise.resolve({ data: [], error: null }),
            maybeSingle: () => Promise.resolve({ data: null, error: null }),
            single: () => Promise.resolve({ data: null, error: null }),
          }),
          insert: () => Promise.resolve({ data: null, error: null }),
          update: () => ({
            eq: () => Promise.resolve({ data: null, error: null }),
          }),
          delete: () => ({
            eq: () => Promise.resolve({ data: null, error: null }),
          }),
        });
      }
      if (prop === "storage") {
        return {
          from: () => ({
            upload: () => Promise.resolve({ data: null, error: null }),
            download: () => Promise.resolve({ data: null, error: null }),
            list: () => Promise.resolve({ data: [], error: null }),
            remove: () => Promise.resolve({ data: [], error: null }),
            getPublicUrl: () => ({ data: { publicUrl: "" } }),
          }),
        };
      }
      if (prop === "rpc") {
        return () => Promise.resolve({ data: null, error: null });
      }
      if (prop === "functions") {
        return {
          invoke: () => Promise.resolve({ data: null, error: null }),
        };
      }
      return undefined;
    },
  };

  return new Proxy({} as SupabaseClient, handler);
}

let supabase: SupabaseClient;

if (typeof window !== "undefined") {
  // Log diagnostics to help debug configuration issues
  console.log("[Supabase] Raw URL:", rawUrl ? `${rawUrl.substring(0, 30)}...` : "(not set)");
  console.log("[Supabase] Sanitized URL:", supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : "(empty)");
  console.log("[Supabase] Key present:", !!supabaseAnonKey);
}

if (supabaseUrl && supabaseAnonKey) {
  if (isValidSupabaseUrl(supabaseUrl)) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    if (typeof window !== "undefined") {
      console.log("[Supabase] Client configured successfully.");
    }
  } else {
    console.error(
      "[Supabase] ⚠️ INVALID URL FORMAT:", supabaseUrl,
      "\nThe URL must be in format: https://<project-ref>.supabase.co",
      "\nCheck VITE_SUPABASE_URL in your environment variables."
    );
    supabase = createMockClient();
  }
} else {
  if (typeof window !== "undefined") {
    console.error(
      "[Supabase] ⚠️ NOT CONFIGURED — VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY are missing! ",
      "Auth, database, and storage will NOT work. ",
      "Add these variables in your hosting platform (Netlify → Site configuration → Environment variables)."
    );
  }
  supabase = createMockClient();
}

export { supabase };
