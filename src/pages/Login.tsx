import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

const LOGO_URL =
  "https://harmless-tapir-303.convex.cloud/api/storage/026f76e2-7e38-46d7-8178-c7d0a140b884";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { signIn, resetPassword } = useSupabaseAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/minha-conta";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      navigate(returnTo);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Informe seu e-mail para recuperar a senha.");
      return;
    }
    setIsLoading(true);
    setError(null);
    const result = await resetPassword(email);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Enviamos um link de recuperação para seu e-mail.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#090B0B] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/">
              <img src={LOGO_URL} alt="VesteRetro" className="h-14 w-auto" />
            </Link>
          </div>

          <div className="bg-surface border border-border rounded-sm p-6 lg:p-8">
            <div className="text-center mb-6">
              <h1 className="font-display text-2xl font-bold text-foreground">
                Bem-vindo de volta
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Entre na sua conta VesteRetro
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-sm">
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-sm">
                <p className="text-xs text-[var(--success)]">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" className="accent-[var(--gold)]" />
                  Lembrar de mim
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-[var(--gold)] hover:underline transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-gold rounded-md py-3 text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Entrar <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-xs text-muted-foreground mb-3">Ainda não tem conta?</p>
              <Link
                to="/criar-conta"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--gold)] hover:underline transition-colors"
              >
                Criar minha conta
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
