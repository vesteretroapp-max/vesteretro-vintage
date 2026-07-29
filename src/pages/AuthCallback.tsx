import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Check, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

const LOGO_URL =
  "https://i.postimg.cc/1PpMzQ81/Chat-GPT-Image-27-de-jul-de-2026-16-41-41.png";

export default function AuthCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase sends back with hash params like #access_token=...&type=signup
        // or #access_token=...&type=recovery
        // The client with detectSessionInUrl:true handles this automatically.

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          setStatus("error");
          setMessage(
            "Link inválido ou expirado. Solicite um novo e-mail."
          );
          return;
        }

        if (session?.user) {
          setStatus("success");
          setMessage("Autenticação realizada com sucesso!");

          // Redirect to minha-conta after 2 seconds
          setTimeout(() => {
            navigate("/minha-conta", { replace: true });
          }, 2000);
        } else {
          // No session - the link might be expired or invalid
          setStatus("error");
          setMessage(
            "Link inválido ou expirado. Verifique seu e-mail e tente novamente."
          );
        }
      } catch {
        setStatus("error");
        setMessage("Erro ao processar a autenticação. Tente novamente.");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#090B0B] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-8">
            <Link to="/">
              <img
                src={LOGO_URL}
                alt="VesteRetro"
                className="h-14 w-auto"
              />
            </Link>
          </div>

          {status === "loading" && (
            <div className="bg-surface border border-border rounded-sm p-8">
              <Loader2 className="w-10 h-10 animate-spin text-[var(--gold)] mx-auto mb-4" />
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Processando...
              </h1>
              <p className="text-sm text-muted-foreground">
                Aguarde enquanto validamos sua autenticação.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="bg-surface border border-border rounded-sm p-8">
              <div className="w-16 h-16 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/30 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-[var(--success)]" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Autenticado!
              </h1>
              <p className="text-sm text-muted-foreground mb-6">{message}</p>
              <p className="text-xs text-muted-foreground">
                Redirecionando para Minha Conta...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="bg-surface border border-border rounded-sm p-8">
              <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center mx-auto mb-6">
                <X className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Não foi possível autenticar
              </h1>
              <p className="text-sm text-muted-foreground mb-6">{message}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/entrar"
                  className="btn-gold rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-2"
                >
                  Fazer login
                </Link>
                <Link
                  to="/criar-conta"
                  className="border border-border text-muted-foreground px-6 py-3 text-sm rounded-sm hover:border-[var(--gold)] transition-colors inline-flex items-center justify-center gap-2"
                >
                  Criar nova conta
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
