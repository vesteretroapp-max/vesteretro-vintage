import { Link } from "react-router";
import {
  ArrowRight,
  Award,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  Truck,
  CreditCard,
  Trophy,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { demoProducts, decades } from "@/data/products";

// Working Unsplash image URLs for editorial section
const EDITORIAL_IMAGES = [
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
];

export default function Home() {
  // Product slices for each section
  const lancamentos = demoProducts.slice(0, 8);
  const brasilProducts = demoProducts.filter((p) => p.category === "brasil").slice(0, 4);
  const mundoProducts = demoProducts.filter((p) => p.category === "mundo").slice(0, 4);
  const selecoesProducts = demoProducts.filter((p) => p.category === "selecoes").slice(0, 4);

  return (
    <div>
      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--gold)_10%,transparent),transparent_60%)]" />
        <div className="container-vr grid gap-10 py-16 md:grid-cols-2 md:py-28 md:gap-16 items-center">
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

          {/* Right decorative */}
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-full bg-[var(--gold)]/10 blur-3xl" />
            <div className="aspect-square w-full rounded-2xl border border-[var(--border-gold)] bg-gradient-to-br from-surface via-surface-2 to-background p-8 shadow-lg">
              <div className="flex h-full flex-col items-center justify-center gap-6">
                <Award className="h-16 w-16 text-[var(--gold)]" />
                <p className="font-display text-3xl italic text-foreground/90">
                  1970 · 1994 · 2002
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  Três títulos. Uma história.
                  <br />
                  Uma camisa para cada memória.
                </p>
                <div className="mt-4 h-px w-24 bg-[var(--gold)]/60" />
                <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--gold)]">
                  Coleção Copa do Mundo
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES SECTION ============ */}
      <section className="container-vr py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
              Explore
            </p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">
              Nossas categorias
            </h2>
          </div>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Clubes do Brasil",
              desc: "Do Maracanã ao Beira-Rio",
              href: "/clubes-do-brasil",
            },
            {
              name: "Clubes do Mundo",
              desc: "As lendas da Europa e América",
              href: "/clubes-do-mundo",
            },
            {
              name: "Seleções",
              desc: "Copas que fizeram história",
              href: "/selecoes",
            },
            {
              name: "Lançamentos",
              desc: "As novidades da temporada",
              href: "/lancamentos",
            },
            {
              name: "Promoções",
              desc: "Ofertas selecionadas",
              href: "/promocoes",
            },
            {
              name: "Todas as camisas",
              desc: "Explore o catálogo completo",
              href: "/todos-os-produtos",
            },
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

      {/* ============ LANÇAMENTOS SECTION ============ */}
      <section className="container-vr py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
              Chegaram agora
            </p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">
              Lançamentos
            </h2>
          </div>
          <Link
            to="/lancamentos"
            className="hidden shrink-0 items-center gap-2 text-sm text-[var(--gold)] hover:underline sm:inline-flex"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {lancamentos.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ============ CLUBE BRASIL SECTION ============ */}
      <section className="container-vr py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
              Do Brasil com paixão
            </p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">
              Do Brasil com paixão
            </h2>
          </div>
          <Link
            to="/clubes-do-brasil"
            className="hidden shrink-0 items-center gap-2 text-sm text-[var(--gold)] hover:underline sm:inline-flex"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {brasilProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ============ CLUBE MUNDO SECTION ============ */}
      <section className="container-vr py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
              Europa e América em campo
            </p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">
              Europa e América em campo
            </h2>
          </div>
          <Link
            to="/clubes-do-mundo"
            className="hidden shrink-0 items-center gap-2 text-sm text-[var(--gold)] hover:underline sm:inline-flex"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {mundoProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ============ SELEÇÕES SECTION ============ */}
      <section className="container-vr py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
              Seleções eternas
            </p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">
              Seleções eternas
            </h2>
          </div>
          <Link
            to="/selecoes"
            className="hidden shrink-0 items-center gap-2 text-sm text-[var(--gold)] hover:underline sm:inline-flex"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {selecoesProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ============ DÉCADAS SECTION ============ */}
      <section className="border-y border-border bg-surface py-20">
        <div className="container-vr">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
                Viagem no tempo
              </p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl">
                Compre por década
              </h2>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
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

      {/* ============ EDITORIAL SECTION ============ */}
      <section className="container-vr py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
              Editorial
            </p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">
              A história por trás do manto
            </h2>
          </div>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
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
              {/* Background image */}
              <div className="absolute inset-0">
                <img
                  src={EDITORIAL_IMAGES[article.img]}
                  alt=""
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/60" />
              </div>

              {/* Content */}
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

      {/* ============ BENEFITS SECTION ============ */}
      <section className="border-y border-border bg-surface py-14">
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

      {/* ============ NEWSLETTER SECTION ============ */}
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

      {/* ============ INSTAGRAM SECTION ============ */}
      <section className="container-vr pb-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
              @vesteretro
            </p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">
              Siga no Instagram
            </h2>
          </div>
        </div>
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
