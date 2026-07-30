import { Send } from "lucide-react";
import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
        setName("");
      }, 4000);
    }
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/8 via-background to-[var(--gold)]/8" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[var(--gold)]/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[var(--gold)]/5 blur-[120px]" />
      </div>

      <div className="container-vr">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--border-gold)] bg-gradient-to-br from-card via-card/80 to-card p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-14 w-14 rounded-full border border-[var(--border-gold)] bg-[var(--gold)]/5 flex items-center justify-center">
              <Send className="h-6 w-6 text-[var(--gold)]" />
            </div>
          </div>

          {/* Title */}
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)] font-semibold">
            Newsletter
          </p>
          <h2 className="mt-3 font-display text-2xl md:text-3xl lg:text-4xl">
            Receba novidades da VesteRetro
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
            Lançamentos exclusivos, camisas históricas e ofertas especiais
            diretamente no seu e-mail. Sem spam, prometemos.
          </p>

          {/* Form */}
          {isSubmitted ? (
            <div className="mt-8 p-6 rounded-lg bg-[var(--gold)]/10 border border-[var(--border-gold)]">
              <p className="text-[var(--gold)] font-medium">
                Obrigado! Você receberá nossas novidades em breve.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-4"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  required
                  name="name"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-background px-5 py-3.5 text-sm outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/20 transition-all placeholder:text-muted-foreground/60"
                />
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-background px-5 py-3.5 text-sm outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/20 transition-all placeholder:text-muted-foreground/60"
                />
              </div>
              <button
                type="submit"
                className="group w-full sm:w-auto mx-auto rounded-lg bg-[var(--gold)] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-background transition-all duration-300 hover:bg-[var(--gold-light)] hover:shadow-[0_0_30px_rgba(214,166,50,0.3)] inline-flex items-center justify-center gap-2"
              >
                Quero receber
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          )}

          {/* Privacy note */}
          <p className="mt-6 text-[11px] text-muted-foreground/60">
            Ao se inscrever, você concorda com nossa política de privacidade.
            Pode cancelar a qualquer momento.
          </p>
        </div>
      </div>
    </section>
  );
}
