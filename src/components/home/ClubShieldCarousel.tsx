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
  { name: "Corinthians", slug: "/clubes-do-brasil", color: "#1a1a1a", textColor: "#fff", initial: "COR" },
  { name: "Flamengo", slug: "/clubes-do-brasil", color: "#c4161a", textColor: "#fff", initial: "FLA" },
  { name: "Palmeiras", slug: "/clubes-do-brasil", color: "#006437", textColor: "#fff", initial: "PAL" },
  { name: "Vasco", slug: "/clubes-do-brasil", color: "#1a1a1a", textColor: "#fff", initial: "VAS" },
  { name: "São Paulo", slug: "/clubes-do-brasil", color: "#d42a2a", textColor: "#fff", initial: "SPF" },
  { name: "Santos", slug: "/clubes-do-brasil", color: "#1a1a1a", textColor: "#fff", initial: "SAN" },
  { name: "Grêmio", slug: "/clubes-do-brasil", color: "#0068ab", textColor: "#fff", initial: "GRE" },
  { name: "Internacional", slug: "/clubes-do-brasil", color: "#d4171e", textColor: "#fff", initial: "INT" },
  { name: "Atlético-MG", slug: "/clubes-do-brasil", color: "#1a1a1a", textColor: "#fff", initial: "CAM" },
  { name: "Cruzeiro", slug: "/clubes-do-brasil", color: "#003da5", textColor: "#fff", initial: "CRU" },
  { name: "Botafogo", slug: "/clubes-do-brasil", color: "#1a1a1a", textColor: "#fff", initial: "BOT" },
  { name: "Bahia", slug: "/clubes-do-brasil", color: "#003da5", textColor: "#fff", initial: "BAH" },
  { name: "Real Madrid", slug: "/clubes-do-mundo", color: "#f5f5f5", textColor: "#1a1a1a", initial: "RMA" },
  { name: "Barcelona", slug: "/clubes-do-mundo", color: "#a50044", textColor: "#003da5", initial: "FCB" },
  { name: "Liverpool", slug: "/clubes-do-mundo", color: "#c8102e", textColor: "#fff", initial: "LFC" },
  { name: "Man United", slug: "/clubes-do-mundo", color: "#da291c", textColor: "#fff", initial: "MUN" },
  { name: "Arsenal", slug: "/clubes-do-mundo", color: "#ef0107", textColor: "#fff", initial: "ARS" },
  { name: "Juventus", slug: "/clubes-do-mundo", color: "#1a1a1a", textColor: "#fff", initial: "JUV" },
  { name: "Milan", slug: "/clubes-do-mundo", color: "#fb090b", textColor: "#1a1a1a", initial: "ACM" },
  { name: "Inter", slug: "/clubes-do-mundo", color: "#0068a8", textColor: "#fff", initial: "INT" },
  { name: "PSG", slug: "/clubes-do-mundo", color: "#004170", textColor: "#fff", initial: "PSG" },
  { name: "Bayern", slug: "/clubes-do-mundo", color: "#dc052d", textColor: "#fff", initial: "BAY" },
  { name: "Dortmund", slug: "/clubes-do-mundo", color: "#fde100", textColor: "#1a1a1a", initial: "BVB" },
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
    scrollRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container-vr">
        <div className="flex items-center gap-4 mb-14">
          <div className="h-px w-12 bg-[var(--gold)]/40" />
          <span className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground/60">
            Os maiores clubes
          </span>
        </div>

        <div className="relative group">
          {canScrollLeft && (
            <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 h-12 w-12 rounded-full bg-background/80 border border-border/40 flex items-center justify-center text-foreground backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-[var(--gold)]/40 hover:text-[var(--gold)]" aria-label="Anterior">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {canScrollRight && (
            <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 h-12 w-12 rounded-full bg-background/80 border border-border/40 flex items-center justify-center text-foreground backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-[var(--gold)]/40 hover:text-[var(--gold)]" aria-label="Próximo">
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          <div ref={scrollRef} className="flex gap-8 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory px-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {clubs.map((club) => (
              <Link key={club.name} to={club.slug} className="group/item flex-shrink-0 snap-center">
                <div className="flex flex-col items-center gap-4 w-24">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border border-transparent transition-all duration-500 group-hover/item:border-[var(--gold)]/30 group-hover/item:shadow-[0_0_40px_rgba(214,166,50,0.15)] group-hover/item:scale-110" style={{ backgroundColor: club.color }}>
                    <span className="text-xs md:text-sm font-bold tracking-[0.15em]" style={{ color: club.textColor }}>
                      {club.initial}
                    </span>
                  </div>
                  <span className="text-[11px] text-center text-muted-foreground/50 group-hover/item:text-[var(--gold)] transition-colors duration-500 font-medium tracking-wide">
                    {club.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
