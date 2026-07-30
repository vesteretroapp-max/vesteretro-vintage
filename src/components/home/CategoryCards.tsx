import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Brasileiros",
    description: "Paixão que nunca para.",
    href: "/clubes-do-brasil",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
  },
  {
    title: "Europeus",
    description: "Os gigantes do velho mundo.",
    href: "/clubes-do-mundo",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1200&q=80",
  },
  {
    title: "Retrô",
    description: "Momentos que marcaram gerações.",
    href: "/retro",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80",
  },
  {
    title: "Lançamentos",
    description: "Temporada 2026/2027.",
    href: "/lancamentos",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&q=80",
  },
];

export function CategoryCards() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-vr">
        {/* Minimal header */}
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px w-12 bg-[var(--gold)]/40" />
          <span className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground/60">
            Coleções
          </span>
        </div>

        {/* Campaign-style grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category, index) => (
            <Link
              key={category.title}
              to={category.href}
              className={`group relative overflow-hidden ${
                index === 0 ? "md:row-span-2" : ""
              }`}
            >
              <div className={`relative overflow-hidden ${index === 0 ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                <div className="transition-transform duration-500 group-hover:translate-y-[-4px]">
                  <h3 className="font-display text-3xl md:text-4xl text-foreground">
                    {category.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground/70">
                    {category.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-[var(--gold)] text-xs uppercase tracking-[0.2em] font-medium opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    Explorar
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
