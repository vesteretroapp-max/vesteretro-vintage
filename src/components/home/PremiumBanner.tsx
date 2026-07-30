export function PremiumBanner() {
  return (
    <section className="py-32 md:py-44 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-[var(--gold)]/[0.02] to-background" />
      </div>

      <div className="container-vr text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight">
            <span className="block text-foreground">O futebol muda.</span>
            <span className="block text-gradient-gold italic mt-4">As histórias permanecem.</span>
          </h2>

          {/* Minimal decorative element */}
          <div className="mt-12 flex justify-center">
            <div className="h-px w-20 bg-[var(--gold)]/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
