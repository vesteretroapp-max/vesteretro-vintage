import { Link } from "react-router";
import {
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  Truck,
  CreditCard,
  Trophy,
  Percent,
  Clock,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { HorizontalCarousel } from "@/components/HorizontalCarousel";
import { demoProducts, decades } from "@/data/products";

// Editorial images
const EDITORIAL_IMAGES = [
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
];

/** Section header shared across all carousel sections */
function SectionHeader({
  eyebrow,
  title,
  subtitle,
  href,
  linkText,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8">
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-2xl md:text-3xl lg:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        <Link
          to={href}
          className="hidden shrink-0 items-center gap-2 text-sm text-[var(--gold)] hover:underline sm:inline-flex"
        >
          {linkText || "Ver todos"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  // ---- Product sections ----
  // Lançamentos: newest products marked as isNew or recent
  const lancamentos = demoProducts
    .filter((p) => p.isNew || p.isLaunch)
    .sort((a, b) => (b.homepageOrder ?? 99) - (a.homepageOrder ?? 99));

  // Promoções: products with active sale price
  const promocoes = demoProducts
    .filter((p) => p.isOnSale || p.isPromotion)
    .sort((a, b) => (b.homepageOrder ?? 99) - (a.homepageOrder ?? 99));

  // Retrô mais procurados: featured retro products
  const retroMaisProcurados = demoProducts
    .filter((p) => p.isRetro || p.isBestSeller)
    .sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0));

  // Seleções: all selecoes category
  const selecoes = demoProducts
    .filter((p) => p.category === "selecoes")
    .sort((a, b) => (b.homepageOrder ?? 99) - (a.homepageOrder ?? 99));

  // NBA: all nba category
  const nba = demoProducts
    .filter((p) => p.category === "nba")
    .sort((a, b) => (a.homepageOrder ?? 99) - (b.homepageOrder ?? 99));

  return (
    <div>
      {/* ============ 1. HERO ============ */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--gold)_10%,transparent),transparent_60%)]" />
        <div className="container-vr grid gap-10 py-16 md:grid-cols-[1fr_1.3fr] md:py-24 md:gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
              Coleção Retrô Premium
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] md:text-7xl">
              Vista a história.
              <br />
              <span className="text-gradient-gold italic">Sinta a glória.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              Camisas retrô que marcaram gerações. Clubes históricos. Momentos
              eternos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/todos-os-produtos"
                className="btn-gold rounded-md px-6 py-3 text-sm uppercase tracking-widest inline-flex items-center"
              >
                Ver coleção
                <ArrowRight className="ml-2 inline h-4 w-4" />
              </Link>
              <Link
                to="/lancamentos"
                className="btn-outline-gold rounded-md px-6 py-3 text-sm uppercase tracking-widest"
              >
                Lançamentos
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-4 text-xs text-muted-foreground sm:grid-cols-4">
              <li className="border-l border-[var(--gold)]/40 pl-3">
                <span className="block text-foreground/90">Qualidade</span>
                <span className="text-[var(--gold)]">premium</span>
              </li>
              <li className="border-l border-[var(--gold)]/40 pl-3">
                <span className="block text-foreground/90">Envio</span>
                <span className="text-[var(--gold)]">todo Brasil</span>
              </li>
              <li className="border-l border-[var(--gold)]/40 pl-3">
                <span className="block text-foreground/90">Até 12x</span>
                <span className="text-[var(--gold)]">no cartão</span>
              </li>
              <li className="border-l border-[var(--gold)]/40 pl-3">
                <span className="block text-foreground/90">Compra</span>
                <span className="text-[var(--gold)]">segura</span>
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-full bg-[var(--gold)]/10 blur-3xl" />
            <div className="w-full overflow-hidden rounded-2xl border border-[var(--border-gold)] shadow-lg">
              <img
                src="https://i.postimg.cc/2SnM0q7H/grandes.png"
                alt="Camisas retrô dos grandes clubes do Brasil — Corinthians, Flamengo, Palmeiras e Vasco"
                className="w-full h-auto object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. BENEFITS (top bar) ============ */}
      <section className="border-b border-border bg-surface py-5">
        <div className="container-vr flex items-center justify-center gap-6 overflow-x-auto text-xs text-muted-foreground">
          {[
            { icon: ShieldCheck, text: "Compra 100% segura" },
            { icon: Truck, text: "Envio para todo o Brasil" },
            { icon: CreditCard, text: "Parcele em até 12x" },
            { icon: MessageCircle, text: "Atendimento via WhatsApp" },
          ].map((item) => (
            <span key={item.text} className="flex items-center gap-2 whitespace-nowrap">
              <item.icon className="h-3.5 w-3.5 text-[var(--gold)]" />
              {item.text}
            </span>
          ))}
        </div>
      </section>

      {/* ============ 3. CATEGORIES ============ */}
      <section className="container-vr py-16 md:py-20">
        <SectionHeader
          eyebrow="Explore"
          title="Nossas categorias"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Clubes do Brasil", desc: "Do Maracanã ao Beira-Rio", href: "/clubes-do-brasil" },
            { name: "Clubes do Mundo", desc: "As lendas da Europa e América", href: "/clubes-do-mundo" },
            { name: "Seleções", desc: "Copas que fizeram história", href: "/selecoes" },
            { name: "NBA Classics", desc: "Regatas históricas do basquete", href: "/categoria/nba" },
            { name: "Promoções", desc: "Ofertas selecionadas", href: "/promocoes" },
            { name: "Todas as camisas", desc: "Explore o catálogo completo", href: "/todos-os-produtos" },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={cat.href}
              className="card-premium group flex items-center justify-between rounded-lg p-6 transition-all"
            >
              <div>
                <p className="font-display text-xl">{cat.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{cat.desc}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-[var(--gold)] transition group-hover:translate-x-1 shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* ============ 4. LANÇAMENTOS ============ */}
      {lancamentos.length > 0 && (
        <section className="container-vr py-16 md:py-20">
          <SectionHeader
            eyebrow="Chegaram agora"
            title="Lançamentos 2026/2027"
            subtitle="Os novos mantos dos maiores clubes do Brasil e da Europa."
            href="/lancamentos"
            linkText="Ver todos os lançamentos"
          />
          <HorizontalCarousel autoPlay={6000}>
            {lancamentos.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </HorizontalCarousel>
        </section>
      )}

      {/* ============ 5. PROMOÇÕES ============ */}
      {promocoes.length > 0 && (
        <section className="container-vr py-16 md:py-20 border-t border-border">
          <SectionHeader
            eyebrow="Ofertas especiais"
            title="Modelos em promoção"
            subtitle="Modelos selecionados com condições especiais por tempo limitado."
            href="/promocoes"
            linkText="Ver todas as promoções"
          />
          <HorizontalCarousel autoPlay={6000}>
            {promocoes.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </HorizontalCarousel>
        </section>
      )}

      {/* ============ 6. CLÁSSICOS MAIS PROCURADOS ============ */}
      {retroMaisProcurados.length > 0 && (
        <section className="container-vr py-16 md:py-20 border-t border-border">
          <SectionHeader
            eyebrow="Mais procurados"
            title="Clássicos mais procurados"
            subtitle="Os mantos históricos que continuam conquistando gerações."
            href="/todos-os-produtos"
            linkText="Ver todas as camisas retrô"
          />
          <HorizontalCarousel autoPlay={7000}>
            {retroMaisProcurados.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </HorizontalCarousel>
        </section>
      )}

      {/* ============ 7. SELEÇÕES ============ */}
      {selecoes.length > 0 && (
        <section className="container-vr py-16 md:py-20 border-t border-border">
          <SectionHeader
            eyebrow="Seleções eternas"
            title="Seleções históricas"
            subtitle="Camisas que marcaram Copas do Mundo e momentos inesquecíveis."
            href="/selecoes"
            linkText="Ver todas as seleções"
          />
          <HorizontalCarousel autoPlay={7000}>
            {selecoes.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </HorizontalCarousel>
        </section>
      )}

      {/* ============ 8. NBA ============ */}
      {nba.length > 0 && (
        <section className="container-vr py-16 md:py-20 border-t border-border">
          <SectionHeader
            eyebrow="Basquete"
            title="NBA Classics"
            subtitle="Regatas históricas das maiores franquias do basquete mundial."
            href="/categoria/nba"
            linkText="Ver todos os modelos NBA"
          />
          <HorizontalCarousel autoPlay={6000}>
            {nba.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </HorizontalCarousel>
        </section>
      )}

      {/* ============ 9. EDITORIAL ============ */}
      <section className="container-vr py-20">
        <SectionHeader
          eyebrow="Editorial"
          title="A história por trás do manto"
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              year: "1970",
              competition: "Copa do Mundo — México",
              title: "Brasil 1970",
              text: "O tricampeonato, a magia de Pelé e um time que redefiniu o jogo bonito.",
              slug: "/produto/camisa-retro-brasil-1970-home",
              img: 0,
            },
            {
              year: "1981",
              competition: "Libertadores e Mundial",
              title: "Flamengo 1981",
              text: "Zico, Júnior, Nunes. O manto rubro-negro que conquistou o mundo em Tóquio.",
              slug: "/produto/camisa-retro-flamengo-1981-home",
              img: 1,
            },
            {
              year: "1999",
              competition: "Treble histórico",
              title: "Manchester United 1999",
              text: "A remontada em Barcelona, os minutos finais que viraram lenda em Old Trafford.",
              slug: "/produto/camisa-retro-manchester-united-1999-home",
              img: 2,
            },
          ].map((article) => (
            <Link
              key={article.title}
              to={article.slug}
              className="card-premium group relative rounded-lg overflow-hidden transition-all"
            >
              <div className="absolute inset-0">
                <img
                  src={EDITORIAL_IMAGES[article.img]}
                  alt=""
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/60" />
              </div>
              <div className="relative p-6 lg:p-8">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">
                  {article.year} · {article.competition}
                </p>
                <h3 className="mt-3 font-display text-2xl">{article.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {article.text}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--gold)] group-hover:gap-3 transition-all">
                  Ler história
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ 10. DÉCADAS ============ */}
      <section className="border-y border-border bg-surface py-20">
        <div className="container-vr">
          <SectionHeader
            eyebrow="Viagem no tempo"
            title="Compre por década"
          />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {decades.map((d) => (
              <Link
                key={d.value}
                to={`/busca?decada=${d.value}`}
                className="group relative overflow-hidden rounded-lg border border-border bg-background p-8 text-center transition hover:border-[var(--gold)]"
              >
                <p className="font-display text-3xl">{d.label.replace("s", "")}</p>
                <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground group-hover:text-[var(--gold)] transition-colors">
                  Explorar década
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 11. BENEFITS (full section) ============ */}
      <section className="border-b border-border bg-surface py-14">
        <div className="container-vr grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {[
            { icon: ShieldCheck, label: "Compra protegida" },
            { icon: MessageCircle, label: "Atendimento WhatsApp" },
            { icon: Sparkles, label: "Troca facilitada" },
            { icon: Truck, label: "Envio Brasil" },
            { icon: CreditCard, label: "Até 12x sem juros" },
            { icon: Trophy, label: "Qualidade premium" },
          ].map((ben) => (
            <div
              key={ben.label}
              className="flex flex-col items-center gap-2 text-center"
            >
              <ben.icon className="h-7 w-7 text-[var(--gold)]" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {ben.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 12. NEWSLETTER ============ */}
      <section className="container-vr py-20">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--border-gold)] bg-gradient-to-br from-surface via-surface-2 to-background p-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
            Newsletter
          </p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">
            Receba novidades da VesteRetro
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Lançamentos, camisas históricas e ofertas especiais diretamente no
            seu e-mail.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const name = (form.elements.namedItem("name") as HTMLInputElement)
                ?.value;
              const email = (
                form.elements.namedItem("email") as HTMLInputElement
              )?.value;
              if (name && email) {
                alert(
                  `Obrigado, ${name}! Você receberá nossas novidades no e-mail ${email}.`
                );
                form.reset();
              }
            }}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <input
              required
              name="name"
              placeholder="Seu nome"
              className="flex-1 rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--gold)] transition-colors"
            />
            <input
              required
              type="email"
              name="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--gold)] transition-colors"
            />
            <button
              type="submit"
              className="btn-gold rounded-md px-6 text-sm uppercase tracking-widest"
            >
              Quero receber
            </button>
          </form>
        </div>
      </section>

      {/* ============ 13. INSTAGRAM ============ */}
      <section className="container-vr pb-24">
        <SectionHeader
          eyebrow="@vesteretro"
          title="Siga no Instagram"
        />
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square rounded-md border border-border bg-surface-2 transition hover:border-[var(--gold)] overflow-hidden"
            >
              <img
                src={`https://picsum.photos/id/${i * 100}/400/400`}
                alt=""
                className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </a>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Integração com Instagram em breve
        </p>
      </section>
    </div>
  );
}
