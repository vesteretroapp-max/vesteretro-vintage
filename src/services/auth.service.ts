// ==================================================
// VESTERETRO — Auth Service
// Serviço de autenticação encapsulando chamadas ao Supabase
// ==================================================

import { supabase } from "@/lib/supabase";
import type { Profile, ApiResponse } from "@/types/supabase";

// ==================================================
// SIGN UP
// ==================================================
export async function signUp(data: {
  email: string;
  password: string;
  full_name: string;
  whatsapp?: string;
  marketing_consent?: boolean;
}): Promise<ApiResponse<{ user: unknown }>> {
  try {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          whatsapp: data.whatsapp || null,
          marketing_consent: data.marketing_consent || false,
        },
      },
    });

    if (error) {
      const message =
        error.message === "User already registered"
          ? "Este e-mail já está cadastrado. Faça login ou recupere sua senha."
          : "Não foi possível criar sua conta. Verifique os dados e tente novamente.";
      return { data: null, error: message };
    }

    return { data: { user: null }, error: null };
  } catch {
    return { data: null, error: "Erro de conexão. Verifique sua internet e tente novamente." };
  }
}

// ==================================================
// SIGN IN
// ==================================================
export async function signIn(
  email: string,
  password: string
): Promise<ApiResponse<{ user: unknown; session: unknown }>> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const message =
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : "Não foi possível entrar. Tente novamente.";
      return { data: null, error: message };
    }

    return { data: { user: data.user, session: data.session }, error: null };
  } catch {
    return { data: null, error: "Erro de conexão. Verifique sua internet e tente novamente." };
  }
}

// ==================================================
// SIGN OUT
// ==================================================
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: "Não foi possível sair. Tente novamente." };
    }
    return { error: null };
  } catch {
    return { error: "Erro de conexão. Tente novamente." };
  }
}

// ==================================================
// RESET PASSWORD
// ==================================================
export async function resetPassword(email: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });

    if (error) {
      return { error: "Não foi possível enviar o link de recuperação." };
    }

    return { error: null };
  } catch {
    return { error: "Erro de conexão. Tente novamente." };
  }
}

// ==================================================
// UPDATE PASSWORD
// ==================================================
export async function updatePassword(password: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { error: "Não foi possível atualizar sua senha." };
    }

    return { error: null };
  } catch {
    return { error: "Erro de conexão. Tente novamente." };
  }
}

// ==================================================
// GET PROFILE
// ==================================================
export async function getProfile(userId: string): Promise<ApiResponse<Profile>> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return { data: null, error: "Não foi possível carregar o perfil." };
    }

    return { data: data as Profile, error: null };
  } catch {
    return { data: null, error: "Erro de conexão. Tente novamente." };
  }
}

// ==================================================
// UPDATE PROFILE
// ==================================================
export async function updateProfile(
  userId: string,
  data: Partial<Profile>
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", userId);

    if (error) {
      return { error: "Não foi possível atualizar seus dados." };
    }

    return { error: null };
  } catch {
    return { error: "Erro de conexão. Tente novamente." };
  }
}

// ==================================================
// GET SESSION
// ==================================================
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  } catch {
    return { session: null, error: new Error("Erro de conexão") };
  }
}

// ==================================================
// LISTEN TO AUTH CHANGES
// ==================================================
export function onAuthStateChange(
  callback: (event: string, session: unknown) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}
