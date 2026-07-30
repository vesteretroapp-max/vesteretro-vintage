import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const JERSEY_IMAGE = "https://i.postimg.cc/zB1ybq0H/milan.png";
const BG = "#090B0B";

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
    <section className="relative h-screen min-h-[700px] overflow-hidden" style={{ background: BG }}>
      {/* === RIGHT SIDE: Jersey Image — cinematic integration === */}
      <div
        className="absolute inset-0 lg:left-[38%] lg:right-0 lg:top-0 lg:bottom-0"
        style={{ transform: `translateY(${scrollY * 0.05}px)` }}
      >
        {/* Image container — flex-center for perfect vertical alignment */}
        <div className="relative h-full w-full flex items-center justify-center md:justify-end">
          <img
            src={JERSEY_IMAGE}
            alt="Camisa retrô AC Milan 1994-1995"
            className="
              relative z-10
              w-[55%] sm:w-[50%] md:w-[75%] lg:w-[85%] xl:w-[80%]
              max-w-[520px]
              h-auto object-contain
            "
            loading="eager"
            fetchPriority="high"
            style={{
              animation: "heroFloat 10s ease-in-out infinite",
              filter: "drop-shadow(0 25px 80px rgba(214,166,50,0.10)) drop-shadow(0 8px 30px rgba(0,0,0,0.6))",
              /* Cinematic mask — extremely soft edges on all sides, strongest on left and bottom */
              WebkitMaskImage: `
                radial-gradient(
                  ellipse 85% 90% at 62% 48%,
                  black 30%,
                  rgba(0,0,0,0.7) 50%,
                  rgba(0,0,0,0.35) 65%,
                  rgba(0,0,0,0.1) 80%,
                  transparent 100%
                )
              `,
              maskImage: `
                radial-gradient(
                  ellipse 85% 90% at 62% 48%,
                  black 30%,
                  rgba(0,0,0,0.7) 50%,
                  rgba(0,0,0,0.35) 65%,
                  rgba(0,0,0,0.1) 80%,
                  transparent 100%
                )
              `,
            }}
          />

          {/* Ambient gold glow — subtle, behind the jersey */}
          <div
            className="absolute inset-0 pointer-events-none z-[5]"
            style={{
              background: "radial-gradient(ellipse 45% 40% at 60% 50%, rgba(214,166,50,0.035) 0%, transparent 70%)",
            }}
          />

          {/* === Overlays — all use the exact site background color === */}

          {/* Left edge — very long fade (40% of container) */}
          <div
            className="absolute inset-0 pointer-events-none z-[20]"
            style={{
              background: `linear-gradient(to right, ${BG} 0%, ${BG} 18%, rgba(9,11,11,0.85) 30%, rgba(9,11,11,0.4) 45%, transparent 65%)`,
            }}
          />

          {/* Bottom edge — long soft fade */}
          <div
            className="absolute inset-0 pointer-events-none z-[20]"
            style={{
              background: `linear-gradient(to top, ${BG} 0%, ${BG} 6%, rgba(9,11,11,0.7) 15%, rgba(9,11,11,0.2) 28%, transparent 45%)`,
            }}
          />

          {/* Top edge — short fade */}
          <div
            className="absolute inset-0 pointer-events-none z-[20]"
            style={{
              background: `linear-gradient(to bottom, ${BG} 0%, ${BG} 4%, rgba(9,11,11,0.5) 10%, transparent 22%)`,
            }}
          />

          {/* Right edge — subtle vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-[20]"
            style={{
              background: `linear-gradient(to left, rgba(9,11,11,0.45) 0%, transparent 18%)`,
            }}
          />

          {/* Bottom-left diagonal — reinforce the corner blend */}
          <div
            className="absolute inset-0 pointer-events-none z-[21]"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 10% 95%, ${BG} 0%, transparent 70%)`,
            }}
          />
        </div>
      </div>

      {/* === LEFT SIDE: Content (40%) === */}
      <div className="relative z-30 flex h-full items-center">
        <div className="container-vr w-full">
          <div className="lg:max-w-[45%]">
            <div
              className={`transition-all duration-[1200ms] ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-14" style={{ background: "rgba(214,166,50,0.6)" }} />
                <span
                  className="text-[11px] uppercase font-medium"
                  style={{ letterSpacing: "0.4em", color: "var(--gold)" }}
                >
                  VesteRetro
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-display leading-[0.92] tracking-tight"
                style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)" }}
              >
                <span className="block" style={{ color: "var(--foreground)" }}>Vista a</span>
                <span className="block text-gradient-gold italic mt-1">História.</span>
              </h1>

              {/* Subtitle */}
              <p
                className="mt-8 max-w-sm leading-relaxed"
                style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)", color: "rgba(155,155,155,0.7)" }}
              >
                Camisas retrô dos maiores clubes do mundo.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex items-center gap-6">
                <Link
                  to="/todos-os-produtos"
                  className="group inline-flex items-center gap-3 text-sm font-semibold uppercase"
                  style={{ letterSpacing: "0.2em", color: "var(--gold)" }}
                >
                  Explorar coleção
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
                <div className="h-4 w-px" style={{ background: "rgba(216,216,216,0.15)" }} />
                <Link
                  to="/lancamentos"
                  className="text-sm uppercase transition-colors duration-300"
                  style={{ letterSpacing: "0.15em", color: "rgba(155,155,155,0.4)" }}
                >
                  Lançamentos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30">
        <div
          className="h-12 w-px"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(214,166,50,0.3), transparent)",
          }}
        />
      </div>

      {/* Floating animation — 3px, 10s, continuous */}
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </section>
  );
}
