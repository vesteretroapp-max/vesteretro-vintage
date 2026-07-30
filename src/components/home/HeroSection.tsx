import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const JERSEY_IMAGE = "https://i.postimg.cc/zB1ybq0H/milan.png";

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
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-[#090B0B]">
      {/* === RIGHT SIDE: Jersey Image === */}
      <div
        className="absolute inset-0 lg:right-0 lg:left-auto lg:w-[55%] lg:top-0 lg:bottom-0"
        style={{ transform: `translateY(${scrollY * 0.06}px)` }}
      >
        {/* The jersey image — reduced size, full view, repositioned */}
        <div className="relative h-full w-full flex items-center justify-center">
          <img
            src={JERSEY_IMAGE}
            alt="Camisa retrô AC Milan 1994-1995"
            className="w-[70%] max-w-[480px] h-auto object-contain drop-shadow-2xl"
            loading="eager"
            fetchPriority="high"
            style={{
              animation: "heroFloat 10s ease-in-out infinite",
              transform: "translateX(-40px)",
              filter: "drop-shadow(0 20px 60px rgba(214,166,50,0.12))",
            }}
          />

          {/* Background ambient glow — behind the jersey */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 50% at 55% 50%, rgba(214,166,50,0.04) 0%, transparent 70%)",
            }}
          />

          {/* Seamless blending masks */}
          {/* Left edge fade — stronger to blend into dark background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to right, #090B0B 0%, #090B0B 12%, transparent 50%)",
            }}
          />
          {/* Bottom fade — softer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to top, #090B0B 0%, transparent 12%)",
            }}
          />
          {/* Top fade — softer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, #090B0B 0%, transparent 8%)",
            }}
          />
          {/* Right edge fade — subtle vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to left, rgba(9,11,11,0.5) 0%, transparent 15%)",
            }}
          />
        </div>
      </div>

      {/* === LEFT SIDE: Content (45%) === */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container-vr w-full">
          <div className="lg:max-w-[50%]">
            <div
              className={`transition-all duration-[1200ms] ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-14 bg-[var(--gold)]/60" />
                <span className="text-[11px] uppercase tracking-[0.4em] text-[var(--gold)] font-medium">
                  VesteRetro
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-[6.5rem] leading-[0.92] tracking-tight">
                <span className="block text-foreground">Vista a</span>
                <span className="block text-gradient-gold italic mt-1">História.</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-8 max-w-sm text-sm md:text-base leading-relaxed text-muted-foreground/70">
                Camisas retrô dos maiores clubes do mundo.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex items-center gap-6">
                <Link
                  to="/todos-os-produtos"
                  className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)] transition-all duration-300"
                >
                  Explorar coleção
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
                <div className="h-4 w-px bg-border/50" />
                <Link
                  to="/lancamentos"
                  className="text-sm uppercase tracking-[0.15em] text-muted-foreground/50 hover:text-foreground transition-colors duration-300"
                >
                  Lançamentos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <div className="h-12 w-px bg-gradient-to-b from-transparent via-[var(--gold)]/30 to-transparent" />
      </div>

      {/* Floating animation keyframes — 3px, 10s, continuous */}
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateX(-40px) translateY(0px); }
          50% { transform: translateX(-40px) translateY(-3px); }
        }
      `}</style>
    </section>
  );
}
