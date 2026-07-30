import { HeroSection } from "@/components/home/HeroSection";
import { BenefitsBar } from "@/components/home/BenefitsBar";
import { CategoryCards } from "@/components/home/CategoryCards";
import { ClubShieldCarousel } from "@/components/home/ClubShieldCarousel";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { PremiumBanner } from "@/components/home/PremiumBanner";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { demoProducts } from "@/data/products";

export default function Home() {
  // Mais Vendidas — top sellers only
  const maisVendidas = [...demoProducts]
    .filter((p) => p.category === "brasil" || p.category === "mundo")
    .sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0));

  // Clubes Brasileiros
  const brasileiros = demoProducts
    .filter((p) => p.category === "brasil")
    .sort((a, b) => (a.homepageOrder ?? 99) - (b.homepageOrder ?? 99));

  // Clubes Europeus
  const europeus = demoProducts
    .filter((p) => p.category === "mundo")
    .sort((a, b) => (a.homepageOrder ?? 99) - (b.homepageOrder ?? 99));

  // Camisas Retrô
  const retro = demoProducts
    .filter((p) => p.isRetro && p.category !== "selecoes")
    .sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0));

  // Novidades
  const novidades = demoProducts
    .filter((p) => p.isNew || p.isLaunch)
    .sort((a, b) => (b.homepageOrder ?? 99) - (a.homepageOrder ?? 99));

  return (
    <div>
      {/* 1. HERO — Campaign-style, full-screen (no reveal — always visible) */}
      <HeroSection />

      {/* 2. BENEFITS — Ultra-minimal */}
      <ScrollReveal delay={100} direction="none">
        <BenefitsBar />
      </ScrollReveal>

      {/* 3. CATEGORIES — Campaign-style cards */}
      <ScrollReveal delay={100}>
        <CategoryCards />
      </ScrollReveal>

      {/* 4. CLUB SHIELDS — Elegant carousel */}
      <ScrollReveal delay={100}>
        <ClubShieldCarousel />
      </ScrollReveal>

      {/* 5. MAIS VENDIDAS — Featured products */}
      <ScrollReveal delay={100}>
        <ProductShowcase
          eyebrow="Mais procurados"
          title="Mais Vendidas"
          href="/todos-os-produtos"
          linkText="Ver todas"
          products={maisVendidas}
        />
      </ScrollReveal>

      {/* 6. CLUBES BRASILEIROS */}
      <ScrollReveal delay={100}>
        <ProductShowcase
          eyebrow="Clubes do Brasil"
          title="Camisas Brasileiras"
          href="/clubes-do-brasil"
          linkText="Ver todos"
          products={brasileiros}
        />
      </ScrollReveal>

      {/* 7. INSTITUTIONAL BANNER — Emotional */}
      <ScrollReveal delay={200} duration={1000}>
        <PremiumBanner />
      </ScrollReveal>

      {/* 8. CLUBES EUROPEUS */}
      <ScrollReveal delay={100}>
        <ProductShowcase
          eyebrow="Clubes da Europa"
          title="Camisas Europeias"
          href="/clubes-do-mundo"
          linkText="Ver todos"
          products={europeus}
        />
      </ScrollReveal>

      {/* 9. CAMISAS RETRÔ */}
      <ScrollReveal delay={100}>
        <ProductShowcase
          eyebrow="Retrô"
          title="Camisas Retrô"
          href="/retro"
          linkText="Ver todas"
          products={retro}
        />
      </ScrollReveal>

      {/* 10. NOVIDADES */}
      <ScrollReveal delay={100}>
        <ProductShowcase
          eyebrow="Chegaram agora"
          title="Novidades"
          href="/lancamentos"
          linkText="Ver todos"
          products={novidades}
        />
      </ScrollReveal>

      {/* 11. DEPOIMENTOS — Clean, no photos */}
      <ScrollReveal delay={100}>
        <ReviewsSection />
      </ScrollReveal>

      {/* 12. NEWSLETTER — Minimalist */}
      <ScrollReveal delay={100}>
        <NewsletterSection />
      </ScrollReveal>
    </div>
  );
}
