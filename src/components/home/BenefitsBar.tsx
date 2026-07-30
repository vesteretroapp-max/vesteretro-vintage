import { Truck, ShieldCheck, CreditCard, Star, RefreshCw } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Frete Grátis",
    description: "Acima de R$ 299 para todo o Brasil",
  },
  {
    icon: ShieldCheck,
    title: "Compra Segura",
    description: "Pagamento 100% protegido",
  },
  {
    icon: CreditCard,
    title: "Até 10x",
    description: "Sem juros no cartão de crédito",
  },
  {
    icon: Star,
    title: "Produtos Premium",
    description: "Qualidade superior garantida",
  },
  {
    icon: RefreshCw,
    title: "Troca Fácil",
    description: "Até 30 dias para trocar",
  },
];

export function BenefitsBar() {
  return (
    <section className="relative border-y border-border bg-surface/50 backdrop-blur-sm">
      <div className="container-vr">
        <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-border/50">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group flex flex-col items-center gap-3 py-6 px-4 text-center transition-all duration-300 hover:bg-[var(--gold)]/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-gold)] bg-[var(--gold)]/5 transition-all duration-300 group-hover:border-[var(--gold)] group-hover:bg-[var(--gold)]/10 group-hover:shadow-[0_0_20px_rgba(214,166,50,0.15)]">
                <benefit.icon className="h-5 w-5 text-[var(--gold)] transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {benefit.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
