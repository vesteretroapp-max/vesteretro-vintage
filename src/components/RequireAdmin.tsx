import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { Loader2, ShieldOff } from "lucide-react";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, profile } = useSupabaseAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090B0B]">
        <Loader2 className="size-6 animate-spin text-[#D6A632]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/entrar?returnTo=/admin" replace />;
  }

  // In demo mode (no Supabase), allow admin access
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    // Demo mode — everyone is admin
    return <>{children}</>;
  }

  if (profile && profile.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090B0B]">
        <div className="text-center max-w-md px-6">
          <ShieldOff className="w-12 h-12 text-[#C94B4B] mx-auto mb-4" />
          <h1 className="text-xl font-bold text-[#F8F5ED] mb-2">
            Acesso Restrito
          </h1>
          <p className="text-sm text-[#9B9B9B] mb-6">
            Você não possui permissão para acessar esta área. Apenas administradores podem visualizar o painel.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-[#D6A632] text-[#090B0B] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-colors"
          >
            Voltar à Loja
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
