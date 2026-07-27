import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowRight, Loader2, Check } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

const LOGO_URL = "https://harmless-tapir-303.convex.cloud/api/storage/026f76e2-7e38-46d7-8178-c7d0a140b884";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const result = await resetPassword(email);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
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
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">E-mail enviado!</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Enviamos um link de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Não recebeu? Verifique a caixa de spam ou{" "}
              <button onClick={() => setSuccess(false)} className="text-[var(--gold)] hover:underline">tente novamente</button>.
            </p>
            <Link to="/entrar" className="btn-gold rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2">
              Voltar ao login <ArrowRight className="w-4 h-4" />
            </Link>
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
              <h1 className="font-display text-2xl font-bold text-foreground">Recuperar senha</h1>
              <p className="text-sm text-muted-foreground mt-1">Receba um link para redefinir sua senha</p>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-sm">
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">E-mail cadastrado</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com" required
                    className="w-full pl-10 pr-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none transition-colors" />
                </div>
              </div>
              <button type="submit" disabled={isLoading}
                className="w-full btn-gold rounded-md py-3 text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Enviar link <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/entrar" className="text-xs text-[var(--gold)] hover:underline transition-colors">Voltar ao login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
