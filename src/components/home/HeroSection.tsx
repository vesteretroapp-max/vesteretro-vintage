import { Link } from "react-router";
import { ArrowRight, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.15;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85vh] overflow-hidden bg-background"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,color-mix(in_oklab,var(--gold)_8%,transparent),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,color-mix(in_oklab,var(--gold)_5%,transparent),transparent_40%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Floating gold particles */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[var(--gold)]/10 animate-float"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${6 + i}s`,
            }}
          />
        ))}
      </div>

      <div className="container-vr grid gap-8 py-12 md:grid-cols-[1fr_1.2fr] md:py-16 lg:py-20 items-center min-h-[85vh]">
        {/* Left: Text Content */}
        <div
          className={`space-y-6 md:space-y-8 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-[var(--gold)]" />
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)] font-semibold">
              Coleção Retrô Premium
            </p>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-5xl leading-[1.05] md:text-6xl lg:text-7xl xl:text-8xl">
            <span className="block text-foreground">Vista a</span>
            <span className="block text-gradient-gold italic">História.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg lg:text-xl">
            Camisas atuais e retrô dos maiores clubes do mundo.
            <span className="block mt-2 text-[var(--gold)]/80">
              Vestimos memórias que nunca morreram.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/todos-os-produtos"
              className="group relative inline-flex items-center gap-3 rounded-lg bg-[var(--gold)] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-background transition-all duration-300 hover:bg-[var(--gold-light)] hover:shadow-[0_0_30px_rgba(214,166,50,0.3)]"
            >
              Comprar Agora
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/lancamentos"
              className="group inline-flex items-center gap-3 rounded-lg border border-[var(--border-gold)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition-all duration-300 hover:border-[var(--gold)] hover:bg-[var(--gold)]/5"
            >
              <Play className="h-4 w-4" />
              Explorar Coleção
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
              <span>Frete grátis acima de R$ 299</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
              <span>Compra 100% segura</span>
            </div>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div
          className={`relative transition-all duration-1000 delay-300 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          {/* Gold glow behind image */}
          <div
            className="absolute -inset-8 -z-10 rounded-full bg-[var(--gold)]/8 blur-[80px]"
            style={{ transform: `translateY(${-parallaxOffset}px)` }}
          />
          <div
            className="absolute -inset-16 -z-10 rounded-full bg-[var(--gold)]/4 blur-[120px]"
            style={{ transform: `translateY(${-parallaxOffset * 0.5}px)` }}
          />

          {/* Image container */}
          <div
            className="relative overflow-hidden rounded-2xl border border-[var(--border-gold)]/50 shadow-2xl shadow-[var(--gold)]/10"
            style={{ transform: `translateY(${parallaxOffset}px)` }}
          >
            <div className="aspect-[4/5] md:aspect-[3/4]">
              <img
                src="https://i.postimg.cc/2SnM0q7H/grandes.png"
                alt="Camisas retrô dos grandes clubes — VesteRetro"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="eager"
              />
            </div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

            {/* Floating badge */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3 rounded-lg bg-background/80 px-4 py-3 backdrop-blur-md border border-[var(--border-gold)]/30">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-background bg-[var(--gold)]/20 flex items-center justify-center"
                    >
                      <span className="text-[10px] text-[var(--gold)]">
                        ★
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-xs">
                  <p className="text-foreground font-medium">
                    +2.500 camisas vendidas
                  </p>
                  <p className="text-muted-foreground">
                    Avaliação 4.9/5 dos clientes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Role para baixo
        </span>
        <div className="h-8 w-5 rounded-full border border-border flex justify-center pt-1.5">
          <div className="h-2 w-1 rounded-full bg-[var(--gold)] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
