import { Truck, ShieldCheck, CreditCard, Star, RefreshCw } from "lucide-react";

const benefits = [
  { icon: Truck, text: "Frete grátis" },
  { icon: ShieldCheck, text: "Compra segura" },
  { icon: CreditCard, text: "Até 10x sem juros" },
  { icon: Star, text: "Qualidade premium" },
  { icon: RefreshCw, text: "Troca fácil" },
];

export function BenefitsBar() {
  return (
    <section className="border-y border-border/40 bg-background">
      <div className="container-vr">
        <div className="flex items-center justify-center gap-8 md:gap-14 py-8 md:py-10 overflow-x-auto">
          {benefits.map((benefit, i) => (
            <div
              key={benefit.text}
              className="flex items-center gap-3 whitespace-nowrap group"
            >
              <benefit.icon className="h-4 w-4 text-[var(--gold)]/60 transition-colors duration-300 group-hover:text-[var(--gold)]" />
              <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground/70 transition-colors duration-300 group-hover:text-muted-foreground">
                {benefit.text}
              </span>
              {i < benefits.length - 1 && (
                <span className="ml-6 hidden md:block h-1 w-1 rounded-full bg-border/40" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
