import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-background">
      {/* Full-bleed hero image */}
      <div
        className="absolute inset-0 -z-10"
        style={{ transform: `translateY(${scrollY * 0.12}px)` }}
      >
        <img
          src="https://i.postimg.cc/2SnM0q7H/grandes.png"
          alt=""
          className="h-full w-full object-cover object-center"
          loading="eager"
        />
        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      {/* Content */}
      <div className="relative flex h-full items-center">
        <div className="container-vr w-full">
          <div
            className={`max-w-2xl transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            {/* Minimal eyebrow */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-16 bg-[var(--gold)]" />
              <span className="text-[11px] uppercase tracking-[0.4em] text-[var(--gold)] font-medium">
                VesteRetro
              </span>
            </div>

            {/* Main headline — minimal, impactful */}
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] leading-[0.95] tracking-tight">
              <span className="block text-foreground">Vista a</span>
              <span className="block text-gradient-gold italic mt-2">História.</span>
            </h1>

            {/* Subtle subtitle */}
            <p className="mt-8 max-w-md text-sm md:text-base leading-relaxed text-muted-foreground/80">
              Camisas retrô dos maiores clubes do mundo.
            </p>

            {/* Refined CTAs */}
            <div className="mt-10 flex items-center gap-6">
              <Link
                to="/todos-os-produtos"
                className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)] transition-all duration-300"
              >
                Explorar coleção
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
              <div className="h-4 w-px bg-border" />
              <Link
                to="/lancamentos"
                className="text-sm uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Lançamentos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="h-12 w-px bg-gradient-to-b from-transparent via-[var(--gold)]/40 to-transparent" />
      </div>
    </section>
  );
}
