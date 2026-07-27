import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

type Profile = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  cpf: string | null;
  birth_date: string | null;
  avatar_url: string | null;
  marketing_consent: boolean;
  role: "customer" | "admin";
};

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (data: {
    full_name: string;
    email: string;
    password: string;
    whatsapp?: string;
    marketing_consent?: boolean;
  }) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: string | null }>;
  syncCart: () => Promise<void>;
  syncFavorites: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({} as AuthState);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data as Profile);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async ({
    full_name,
    email,
    password,
    whatsapp,
    marketing_consent,
  }: {
    full_name: string;
    email: string;
    password: string;
    whatsapp?: string;
    marketing_consent?: boolean;
  }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            whatsapp: whatsapp || null,
            marketing_consent: marketing_consent || false,
          },
        },
      });

      if (error) {
        const message =
          error.message === "User already registered"
            ? "Este e-mail já está cadastrado. Faça login ou recupere sua senha."
            : "Não foi possível criar sua conta. Verifique os dados e tente novamente.";
        return { error: message };
      }

      return { error: null };
    } catch {
      return { error: "Erro de conexão. Verifique sua internet e tente novamente." };
    }
  };

  const signIn = async (email: string, password: string) => {
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
        return { error: message };
      }

      // Sync cart and favorites after login using session user (not state variable)
      const currentUser = data.session?.user ?? null;
      if (currentUser) {
        await syncCartAfterLogin(currentUser);
        await syncFavoritesAfterLogin(currentUser);
      }

      return { error: null };
    } catch {
      return { error: "Erro de conexão. Verifique sua internet e tente novamente." };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
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
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        return { error: "Não foi possível atualizar sua senha." };
      }

      return { error: null };
    } catch {
      return { error: "Erro de conexão. Tente novamente." };
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return { error: "Usuário não autenticado." };

    try {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user.id);

      if (error) {
        return { error: "Não foi possível atualizar seus dados." };
      }

      setProfile((prev) => (prev ? { ...prev, ...data } : prev));
      return { error: null };
    } catch {
      return { error: "Erro de conexão. Tente novamente." };
    }
  };

  const syncCartAfterLogin = async (syncUser?: User) => {
    const currentUser = syncUser || user;
    const stored = localStorage.getItem("veste_cart");
    if (!stored || !currentUser) return;

    try {
      const localItems = JSON.parse(stored);

      // Get or create cart
      let { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", currentUser.id)
        .single();

      if (!cart) {
        const { data: newCart } = await supabase
          .from("carts")
          .insert({ user_id: currentUser.id })
          .select("id")
          .single();
        cart = newCart;
      }

      if (cart) {
        for (const item of localItems) {
          const { data: existing } = await supabase
            .from("cart_items")
            .select("id, quantity")
            .eq("cart_id", cart.id)
            .eq("product_id", item.productId)
            .eq("size", item.size)
            .maybeSingle();

          if (existing) {
            await supabase
              .from("cart_items")
              .update({ quantity: existing.quantity + item.quantity })
              .eq("id", existing.id);
          } else {
            await supabase.from("cart_items").insert({
              cart_id: cart.id,
              product_id: item.productId,
              size: item.size,
              quantity: item.quantity,
              unit_price: item.price,
            });
          }
        }
      }

      localStorage.removeItem("veste_cart");
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error("Error syncing cart:", err);
    }
  };

  const syncFavoritesAfterLogin = async (syncUser?: User) => {
    const currentUser = syncUser || user;
    const stored = localStorage.getItem("veste_favorites");
    if (!stored || !currentUser) return;

    try {
      const localFavorites = JSON.parse(stored);

      for (const fav of localFavorites) {
        const { data: existing } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", currentUser.id)
          .eq("product_id", fav.productId)
          .maybeSingle();

        if (!existing) {
          await supabase.from("favorites").insert({
            user_id: currentUser.id,
            product_id: fav.productId,
          });
        }
      }

      localStorage.removeItem("veste_favorites");
      window.dispatchEvent(new Event("favorites-updated"));
    } catch (err) {
      console.error("Error syncing favorites:", err);
    }
  };

  const syncCart = syncCartAfterLogin;
  const syncFavorites = syncFavoritesAfterLogin;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isAuthenticated: !!user,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        syncCart,
        syncFavorites,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  return useContext(AuthContext);
}
