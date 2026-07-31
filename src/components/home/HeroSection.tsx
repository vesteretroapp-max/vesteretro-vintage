import { useEffect, useState } from "react";

const HERO_IMAGE = "https://i.postimg.cc/ZYMbBTfc/milaf.png";
const BG = "#090B0B";

export function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: BG,
        height: "100svh",
        minHeight: "600px",
        maxHeight: "1000px",
      }}
    >
      {/* Full-screen hero image */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-[1500ms] ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <img
          src={HERO_IMAGE}
          alt="VesteRetro — Camisas retrô e atuais dos maiores clubes do futebol mundial"
          className="h-full w-full object-cover object-center"
          style={{
            objectPosition: "center 30%",
          }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      {/* Bottom fade — seamless blend into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: "120px",
          background: `linear-gradient(to top, ${BG} 0%, ${BG} 20%, rgba(9,11,11,0.6) 50%, transparent 100%)`,
        }}
      />

      {/* Top fade — subtle blend from header */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: "80px",
          background: `linear-gradient(to bottom, ${BG} 0%, ${BG} 30%, transparent 100%)`,
        }}
      />

      {/* Left edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to right, ${BG} 0%, transparent 12%)`,
        }}
      />

      {/* Right edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to left, ${BG} 0%, transparent 12%)`,
        }}
      />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <div
          className="w-px h-10"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(214,166,50,0.3), transparent)",
            animation: "scrollPulse 2.5s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 0.8; transform: scaleY(1.15); }
        }
      `}</style>
    </section>
  );
}
