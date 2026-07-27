import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Lock, ArrowRight, Loader2, Eye, EyeOff, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

const LOGO_URL = "https://harmless-tapir-303.convex.cloud/api/storage/026f76e2-7e38-46d7-8178-c7d0a140b884";

export default function RedefinirSenha() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid recovery session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email_confirmed_at) {
        setIsValidSession(true);
      } else {
        setError("Link inválido ou expirado. Solicite uma nova recuperação de senha.");
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError("Não foi possível redefinir sua senha. O link pode ter expirado.");
      } else {
        setSuccess(true);
        setTimeout(() => navigate("/entrar"), 3000);
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    }
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#090B0B] flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/30 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-[var(--success)]" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Senha redefinida!</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Sua senha foi alterada com sucesso. Você será redirecionado para o login.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090B0B] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Link to="/"><img src={LOGO_URL} alt="VesteRetro" className="h-14 w-auto" /></Link>
          </div>
          <div className="bg-surface border border-border rounded-sm p-6 lg:p-8">
            <div className="text-center mb-6">
              <h1 className="font-display text-2xl font-bold text-foreground">Redefinir senha</h1>
              <p className="text-sm text-muted-foreground mt-1">Escolha uma nova senha para sua conta</p>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-sm">
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}
            {isValidSession ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Nova senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type={showPassword ? "text" : "password"} value={password}
                      onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" required
                      className="w-full pl-10 pr-10 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Confirmar nova senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="password" value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a senha" required
                      className="w-full pl-10 pr-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none transition-colors" />
                  </div>
                </div>
                <button type="submit" disabled={isLoading}
                  className="w-full btn-gold rounded-md py-3 text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Redefinir senha <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <Link to="/recuperar-senha" className="text-sm text-[var(--gold)] hover:underline transition-colors">
                  Solicitar novo link de recuperação
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
