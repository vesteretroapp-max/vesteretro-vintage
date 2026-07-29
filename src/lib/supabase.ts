import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

if (supabaseUrl && supabaseAnonKey) {
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
  if (typeof window !== "undefined") {
    console.error(
      "[Supabase] ⚠️ NOT CONFIGURED — VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY are missing! " +
      "Auth, database, and storage will NOT work. " +
      "Add these variables in your hosting platform (Netlify → Site configuration → Environment variables)."
    );
  }
  supabase = createMockClient();
}

export { supabase };
