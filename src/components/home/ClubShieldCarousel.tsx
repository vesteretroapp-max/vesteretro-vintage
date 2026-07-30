import { Link } from "react-router";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Club {
  name: string;
  slug: string;
  color: string;
  textColor?: string;
  initial: string;
}

const clubs: Club[] = [
  // Brasileiros
  { name: "Corinthians", slug: "/clubes-do-brasil", color: "#000000", textColor: "#fff", initial: "COR" },
  { name: "Flamengo", slug: "/clubes-do-brasil", color: "#c4161a", textColor: "#fff", initial: "FLA" },
  { name: "Palmeiras", slug: "/clubes-do-brasil", color: "#006437", textColor: "#fff", initial: "PAL" },
  { name: "Vasco", slug: "/clubes-do-brasil", color: "#000000", textColor: "#fff", initial: "VAS" },
  { name: "São Paulo", slug: "/clubes-do-brasil", color: "#d42a2a", textColor: "#fff", initial: "SPF" },
  { name: "Santos", slug: "/clubes-do-brasil", color: "#000000", textColor: "#fff", initial: "SAN" },
  { name: "Grêmio", slug: "/clubes-do-brasil", color: "#0068ab", textColor: "#fff", initial: "GRE" },
  { name: "Internacional", slug: "/clubes-do-brasil", color: "#d4171e", textColor: "#fff", initial: "INT" },
  { name: "Atlético-MG", slug: "/clubes-do-brasil", color: "#000000", textColor: "#fff", initial: "CAM" },
  { name: "Cruzeiro", slug: "/clubes-do-brasil", color: "#003da5", textColor: "#fff", initial: "CRU" },
  { name: "Botafogo", slug: "/clubes-do-brasil", color: "#000000", textColor: "#fff", initial: "BOT" },
  { name: "Bahia", slug: "/clubes-do-brasil", color: "#003da5", textColor: "#fff", initial: "BAH" },
  // Europeus
  { name: "Real Madrid", slug: "/clubes-do-mundo", color: "#ffffff", textColor: "#000", initial: "RMA" },
  { name: "Barcelona", slug: "/clubes-do-mundo", color: "#a50044", textColor: "#000080", initial: "FCB" },
  { name: "Liverpool", slug: "/clubes-do-mundo", color: "#c8102e", textColor: "#fff", initial: "LFC" },
  { name: "Man United", slug: "/clubes-do-mundo", color: "#da291c", textColor: "#fff", initial: "MUN" },
  { name: "Arsenal", slug: "/clubes-do-mundo", color: "#ef0107", textColor: "#fff", initial: "ARS" },
  { name: "Juventus", slug: "/clubes-do-mundo", color: "#000000", textColor: "#fff", initial: "JUV" },
  { name: "Milan", slug: "/clubes-do-mundo", color: "#fb090b", textColor: "#000", initial: "ACM" },
  { name: "Inter", slug: "/clubes-do-mundo", color: "#0068a8", textColor: "#fff", initial: "INT" },
  { name: "PSG", slug: "/clubes-do-mundo", color: "#004170", textColor: "#fff", initial: "PSG" },
  { name: "Bayern", slug: "/clubes-do-mundo", color: "#dc052d", textColor: "#fff", initial: "BAY" },
  { name: "Dortmund", slug: "/clubes-do-mundo", color: "#fde100", textColor: "#000", initial: "BVB" },
  { name: "Chelsea", slug: "/clubes-do-mundo", color: "#034694", textColor: "#fff", initial: "CHE" },
];

export function ClubShieldCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative py-12 md:py-16 bg-surface/30">
      <div className="container-vr">
        {/* Section Header */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)] font-semibold">
            Os maiores clubes
          </p>
          <h2 className="mt-3 font-display text-2xl md:text-3xl">
            Escolha seu time
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-10 w-10 rounded-full bg-background/90 border border-border flex items-center justify-center text-foreground backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-[var(--gold)] hover:text-[var(--gold)] shadow-lg"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-10 w-10 rounded-full bg-background/90 border border-border flex items-center justify-center text-foreground backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-[var(--gold)] hover:text-[var(--gold)] shadow-lg"
              aria-label="Próximo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {clubs.map((club) => (
              <Link
                key={club.name}
                to={club.slug}
                className="group/item flex-shrink-0 snap-center"
              >
                <div className="relative flex flex-col items-center gap-2 w-20 md:w-24">
                  {/* Shield */}
                  <div
                    className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-2 border-transparent transition-all duration-300 group-hover/item:border-[var(--gold)] group-hover/item:shadow-[0_0_25px_rgba(214,166,50,0.3)] group-hover/item:scale-110"
                    style={{ backgroundColor: club.color }}
                  >
                    <span
                      className="text-xs md:text-sm font-bold tracking-wider"
                      style={{ color: club.textColor }}
                    >
                      {club.initial}
                    </span>
                    
                    {/* Gold ring on hover */}
                    <div className="absolute inset-0 rounded-full border-2 border-transparent transition-all duration-300 group-hover/item:border-[var(--gold)]/50" />
                  </div>
                  
                  {/* Club Name */}
                  <span className="text-[10px] md:text-xs text-center text-muted-foreground group-hover/item:text-[var(--gold)] transition-colors duration-300 font-medium">
                    {club.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicators for mobile */}
        <div className="flex justify-center gap-1.5 mt-4 md:hidden">
          {clubs.slice(0, Math.ceil(clubs.length / 4)).map((_, i) => (
            <div
              key={i}
              className="h-1 w-1 rounded-full bg-muted-foreground/30"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
