import { Truck, ShieldCheck, CreditCard, Star, RefreshCw, Users, Award, Clock, Heart } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";

const stats = [
  { icon: Users, value: 2500, prefix: "+", suffix: "", label: "Clientes satisfeitos" },
  { icon: Award, value: 50, prefix: "+", suffix: "", label: "Clubes disponíveis" },
  { icon: Clock, value: 15, prefix: "", suffix: " anos", label: "No mercado" },
  { icon: Heart, value: 98, prefix: "", suffix: "%", label: "Satisfação" },
];

const benefits = [
  { icon: Truck, text: "Frete grátis" },
  { icon: ShieldCheck, text: "Compra segura" },
  { icon: CreditCard, text: "Até 10x sem juros" },
  { icon: Star, text: "Qualidade premium" },
  { icon: RefreshCw, text: "Troca fácil" },
];

function StatCounter({ icon: Icon, value, prefix, suffix, label }: { icon: React.ElementType; value: number; prefix: string; suffix: string; label: string }) {
  const { ref, formatted } = useCountUp({
    end: value,
    duration: 2200,
    startOnVisible: true,
    prefix,
    suffix,
  });

  return (
    <div ref={ref} className="flex flex-col items-center text-center min-w-[120px]">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--gold)]/10 mb-3">
        <Icon className="h-4.5 w-4.5 text-[var(--gold)]" />
      </div>
      <span className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
        {formatted}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
        {label}
      </span>
    </div>
  );
}

export function BenefitsBar() {
  return (
    <section className="border-y border-border/30 bg-surface/30">
      <div className="container-vr">
        {/* Stats counters */}
        <div className="flex items-center justify-center gap-6 md:gap-16 py-12 md:py-16 overflow-x-auto scrollbar-hide">
          {stats.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </div>

        {/* Separator */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/40 to-transparent" />
        </div>

        {/* Benefits icons */}
        <div className="flex items-center justify-center gap-6 md:gap-12 py-6 md:py-8 overflow-x-auto scrollbar-hide">
          {benefits.map((benefit, i) => (
            <div
              key={benefit.text}
              className="flex items-center gap-2.5 whitespace-nowrap group"
            >
              <benefit.icon className="h-3.5 w-3.5 text-[var(--gold)]/50 transition-colors duration-300 group-hover:text-[var(--gold)]" />
              <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground/60 transition-colors duration-300 group-hover:text-muted-foreground">
                {benefit.text}
              </span>
              {i < benefits.length - 1 && (
                <span className="ml-4 hidden md:block h-1 w-1 rounded-full bg-border/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
