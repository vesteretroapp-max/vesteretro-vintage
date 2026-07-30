import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Clubes Brasileiros",
    description: "Do Maracanã ao Beira-Rio, a paixão que nunca para.",
    href: "/clubes-do-brasil",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    gradient: "from-[#c4161a]/80 to-background/90",
  },
  {
    title: "Clubes Europeus",
    description: "As grandes ligas e os clubes mais icônicos do mundo.",
    href: "/clubes-do-mundo",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
    gradient: "from-[#003da5]/80 to-background/90",
  },
  {
    title: "Camisas Retrô",
    description: "Momentos eternos que marcaram gerações do futebol.",
    href: "/retro",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    gradient: "from-[var(--gold-dark)]/80 to-background/90",
  },
  {
    title: "Lançamentos",
    description: "Os novos mantos da temporada 2026/2027.",
    href: "/lancamentos",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80",
    gradient: "from-emerald-900/80 to-background/90",
  },
];

export function CategoryCards() {
  return (
    <section className="container-vr py-16 md:py-24">
      {/* Section Header */}
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)] font-semibold">
          Explore
        </p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl lg:text-5xl">
          Nossas categorias
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Encontre exatamente o que procura. Dos clubes brasileiros aos gigantes da Europa.
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <Link
            key={category.title}
            to={category.href}
            className={`group relative overflow-hidden rounded-xl border border-border transition-all duration-500 hover:border-[var(--border-gold)] hover:shadow-2xl hover:shadow-[var(--gold)]/10 ${
              index === 0 ? "sm:col-span-2 lg:col-span-1" : ""
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={category.image}
                alt={category.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient}`} />
            </div>

            {/* Content */}
            <div className="relative flex flex-col justify-end p-6 min-h-[280px]">
              <div className="space-y-3">
                <h3 className="font-display text-2xl text-foreground">
                  {category.title}
                </h3>
                <p className="text-sm text-foreground/80 line-clamp-2">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 text-[var(--gold)] text-sm font-semibold opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  Explorar
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Hover border glow */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent transition-all duration-500 group-hover:border-[var(--gold)]/30" />
          </Link>
        ))}
      </div>
    </section>
  );
}
