import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 4000);
    }
  };

  return (
    <section className="py-24 md:py-32 relative">
      <div className="container-vr">
        <div className="max-w-2xl mx-auto text-center">
          {/* Minimal header */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-12 bg-[var(--gold)]/40" />
            <span className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground/60">
              Newsletter
            </span>
            <div className="h-px w-12 bg-[var(--gold)]/40" />
          </div>

          <h2 className="font-display text-3xl md:text-4xl">
            Fique por dentro
          </h2>
          <p className="mt-4 text-sm text-muted-foreground/60 max-w-md mx-auto">
            Lançamentos exclusivos e novidades da VesteRetro.
          </p>

          {/* Form */}
          {isSubmitted ? (
            <div className="mt-10 py-6">
              <p className="text-[var(--gold)] text-sm tracking-wide">
                Obrigado. Você receberá nossas novidades em breve.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10">
              <div className="flex items-center gap-0 max-w-md mx-auto border-b border-border/40 focus-within:border-[var(--gold)]/40 transition-colors duration-300">
                <input
                  required
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/40"
                />
                <button
                  type="submit"
                  className="group flex items-center gap-2 py-4 text-[var(--gold)] text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300"
                >
                  Inscrever
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
