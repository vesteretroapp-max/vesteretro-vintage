import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, Check } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

const LOGO_URL = "https://harmless-tapir-303.convex.cloud/api/storage/026f76e2-7e38-46d7-8178-c7d0a140b884";

export default function CriarConta() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    whatsapp: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    marketing: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signUp } = useSupabaseAuth();
  const navigate = useNavigate();

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.acceptTerms) {
      setError("Você precisa aceitar os termos de uso para continuar.");
      return;
    }
    if (formData.password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    setIsLoading(true);
    const result = await signUp({
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
      whatsapp: formData.whatsapp,
      marketing_consent: formData.marketing,
    });

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#090B0B] flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/30 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-[var(--success)]" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Conta criada com sucesso!
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Enviamos um e-mail de confirmação para <strong>{formData.email}</strong>.
              Verifique sua caixa de entrada e confirme seu cadastro.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Não recebeu o e-mail? Verifique a caixa de spam ou{" "}
              <button onClick={() => setSuccess(false)} className="text-[var(--gold)] hover:underline">
                tente novamente
              </button>.
            </p>
            <Link
              to="/entrar"
              className="btn-gold rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2"
            >
              Ir para o login
              <ArrowRight className="w-4 h-4" />
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
              <h1 className="font-display text-2xl font-bold text-foreground">Criar minha conta</h1>
              <p className="text-sm text-muted-foreground mt-1">Faça parte da história VesteRetro</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-sm">
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Nome completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" value={formData.full_name} onChange={(e) => updateField("full_name", e.target.value)}
                    placeholder="Seu nome" required
                    className="w-full pl-10 pr-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">E-mail *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)}
                    placeholder="seu@email.com" required
                    className="w-full pl-10 pr-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">WhatsApp</label>
                <input type="tel" value={formData.whatsapp} onChange={(e) => updateField("whatsapp", e.target.value.replace(/\D/g, "").slice(0, 11))}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none transition-colors" />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Senha *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={showPassword ? "text" : "password"} value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)} placeholder="Mínimo 8 caracteres" required
                    className="w-full pl-10 pr-10 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none transition-colors" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Confirmar senha *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="password" value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)} placeholder="Repita a senha" required
                    className="w-full pl-10 pr-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.acceptTerms}
                    onChange={(e) => updateField("acceptTerms", e.target.checked)}
                    className="mt-0.5 accent-[var(--gold)]" />
                  <span className="text-xs text-muted-foreground">
                    Aceito os{" "}
                    <Link to="/termos" className="text-[var(--gold)] hover:underline">Termos de Uso</Link>
                    {" "}e{" "}
                    <Link to="/privacidade" className="text-[var(--gold)] hover:underline">Política de Privacidade</Link> *
                  </span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.marketing}
                    onChange={(e) => updateField("marketing", e.target.checked)}
                    className="mt-0.5 accent-[var(--gold)]" />
                  <span className="text-xs text-muted-foreground">
                    Quero receber novidades e ofertas por e-mail
                  </span>
                </label>
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full btn-gold rounded-md py-3 text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Criar minha conta <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">Já tem uma conta?</p>
              <Link to="/entrar" className="text-xs font-semibold text-[var(--gold)] hover:underline transition-colors">
                Fazer login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
