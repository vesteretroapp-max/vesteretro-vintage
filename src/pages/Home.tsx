import { HeroSection } from "@/components/home/HeroSection";
import { BenefitsBar } from "@/components/home/BenefitsBar";
import { CategoryCards } from "@/components/home/CategoryCards";
import { ClubShieldCarousel } from "@/components/home/ClubShieldCarousel";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { PremiumBanner } from "@/components/home/PremiumBanner";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { demoProducts } from "@/data/products";

export default function Home() {
  // ---- Filter products for each section ----

  // Mais Vendidas: products sorted by salesCount
  const maisVendidas = [...demoProducts]
    .filter((p) => p.category === "brasil" || p.category === "mundo")
    .sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0));

  // Clubes Brasileiros: category === "brasil"
  const brasileiros = demoProducts
    .filter((p) => p.category === "brasil")
    .sort((a, b) => (a.homepageOrder ?? 99) - (b.homepageOrder ?? 99));

  // Clubes Europeus: category === "mundo"
  const europeus = demoProducts
    .filter((p) => p.category === "mundo")
    .sort((a, b) => (a.homepageOrder ?? 99) - (b.homepageOrder ?? 99));

  // Camisas Retrô: isRetro, excluding selecoes
  const retro = demoProducts
    .filter((p) => p.isRetro && p.category !== "selecoes")
    .sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0));

  // Novidades: isNew or isLaunch
  const novidades = demoProducts
    .filter((p) => p.isNew || p.isLaunch)
    .sort((a, b) => (b.homepageOrder ?? 99) - (a.homepageOrder ?? 99));

  // Promoções: isOnSale or isPromotion
  const promocoes = demoProducts
    .filter((p) => p.isOnSale || p.isPromotion)
    .sort((a, b) => (b.homepageOrder ?? 99) - (a.homepageOrder ?? 99));

  return (
    <div>
      {/* ============ 1. HERO PREMIUM ============ */}
      <HeroSection />

      {/* ============ 2. BENEFITS BAR ============ */}
      <BenefitsBar />

      {/* ============ 3. CATEGORIAS ============ */}
      <CategoryCards />

      {/* ============ 4. ESCUDOS DOS CLUBES ============ */}
      <ClubShieldCarousel />

      {/* ============ 5. MAIS VENDIDAS ============ */}
      <ProductShowcase
        eyebrow="Mais procurados"
        title="Mais Vendidas"
        subtitle="Os mantos que conquistaram nossos clientes."
        href="/todos-os-produtos"
        linkText="Ver todas"
        products={maisVendidas}
      />

      {/* ============ 6. CLUBES BRASILEIROS ============ */}
      <ProductShowcase
        eyebrow="Clubes do Brasil"
        title="Camisas Brasileiras"
        subtitle="Paixão, tradição e história em cada manto."
        href="/clubes-do-brasil"
        linkText="Ver todos os brasileiros"
        products={brasileiros}
      />

      {/* ============ 7. BANNER PREMIUM ============ */}
      <PremiumBanner />

      {/* ============ 8. CLUBES EUROPEUS ============ */}
      <ProductShowcase
        eyebrow="Clubes da Europa"
        title="Camisas Europeias"
        subtitle="Os maiores clubes do velho mundo."
        href="/clubes-do-mundo"
        linkText="Ver todos os europeus"
        products={europeus}
      />

      {/* ============ 9. CAMISAS RETRÔ ============ */}
      <ProductShowcase
        eyebrow="Retrô"
        title="Camisas Retrô"
        subtitle="Momentos eternos que marcaram gerações do futebol."
        href="/retro"
        linkText="Ver todas as retrô"
        products={retro}
      />

      {/* ============ 10. NOVIDADES ============ */}
      <ProductShowcase
        eyebrow="Chegaram agora"
        title="Novidades"
        subtitle="Os novos mantos dos maiores clubes do mundo."
        href="/lancamentos"
        linkText="Ver todos os lançamentos"
        products={novidades}
      />

      {/* ============ 11. PROMOÇÕES ============ */}
      <ProductShowcase
        eyebrow="Ofertas especiais"
        title="Promoções"
        subtitle="Modelos selecionados com condições especiais por tempo limitado."
        href="/promocoes"
        linkText="Ver todas as promoções"
        products={promocoes}
      />

      {/* ============ 12. AVALIAÇÕES ============ */}
      <ReviewsSection />

      {/* ============ 13. NEWSLETTER ============ */}
      <NewsletterSection />
    </div>
  );
}
