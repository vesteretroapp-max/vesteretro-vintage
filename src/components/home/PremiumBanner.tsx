import { Quote } from "lucide-react";

export function PremiumBanner() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/5 via-background to-[var(--gold)]/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--gold)]/5 blur-[100px]" />
      </div>

      <div className="container-vr text-center">
        {/* Quote Icon */}
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 rounded-full border border-[var(--border-gold)] bg-[var(--gold)]/5 flex items-center justify-center">
            <Quote className="h-7 w-7 text-[var(--gold)]" />
          </div>
        </div>

        {/* Main Text */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight">
            <span className="text-foreground">Não vendemos apenas </span>
            <span className="text-gradient-gold italic">camisas.</span>
          </h2>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-display">
            Vendemos{" "}
            <span className="text-[var(--gold)]">momentos</span>{" "}
            que marcaram gerações.
          </p>
        </div>

        {/* Decorative line */}
        <div className="flex justify-center mt-10">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent" />
        </div>

        {/* Subtext */}
        <p className="mt-8 text-sm text-muted-foreground max-w-2xl mx-auto">
          Cada camisa conta uma história. Cada detalhe revive um momento épico.
          Vista a história. Sinta a glória.
        </p>
      </div>
    </section>
  );
}
