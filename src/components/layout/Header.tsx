import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  User,
  ChevronDown,
  ShieldCheck,
  Star,
  Clock,
  Shirt,
  Trophy,
} from "lucide-react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

const LOGO_URL =
  "https://i.postimg.cc/28gXBJRt/vesteretro-logo.png";

interface MegaMenuSection {
  title: string;
  items: { name: string; href: string; icon?: React.ReactNode }[];
}

const megaMenuBrasileiros: MegaMenuSection = {
  title: "Clubes Brasileiros",
  items: [
    { name: "Corinthians", href: "/clubes-do-brasil", icon: <ShieldCheck className="h-4 w-4" /> },
    { name: "Flamengo", href: "/clubes-do-brasil", icon: <ShieldCheck className="h-4 w-4" /> },
    { name: "Palmeiras", href: "/clubes-do-brasil", icon: <ShieldCheck className="h-4 w-4" /> },
    { name: "Vasco da Gama", href: "/clubes-do-brasil", icon: <ShieldCheck className="h-4 w-4" /> },
    { name: "São Paulo", href: "/clubes-do-brasil", icon: <ShieldCheck className="h-4 w-4" /> },
    { name: "Santos", href: "/clubes-do-brasil", icon: <ShieldCheck className="h-4 w-4" /> },
    { name: "Grêmio", href: "/clubes-do-brasil", icon: <ShieldCheck className="h-4 w-4" /> },
    { name: "Internacional", href: "/clubes-do-brasil", icon: <ShieldCheck className="h-4 w-4" /> },
    { name: "Atlético Mineiro", href: "/clubes-do-brasil", icon: <ShieldCheck className="h-4 w-4" /> },
    { name: "Cruzeiro", href: "/clubes-do-brasil", icon: <ShieldCheck className="h-4 w-4" /> },
    { name: "Botafogo", href: "/clubes-do-brasil", icon: <ShieldCheck className="h-4 w-4" /> },
    { name: "Bahia", href: "/clubes-do-brasil", icon: <ShieldCheck className="h-4 w-4" /> },
  ],
};

const megaMenuEuropeus: MegaMenuSection = {
  title: "Clubes Europeus",
  items: [
    { name: "Real Madrid", href: "/clubes-do-mundo", icon: <Trophy className="h-4 w-4" /> },
    { name: "Barcelona", href: "/clubes-do-mundo", icon: <Trophy className="h-4 w-4" /> },
    { name: "Liverpool", href: "/clubes-do-mundo", icon: <Trophy className="h-4 w-4" /> },
    { name: "Manchester United", href: "/clubes-do-mundo", icon: <Trophy className="h-4 w-4" /> },
    { name: "Arsenal", href: "/clubes-do-mundo", icon: <Trophy className="h-4 w-4" /> },
    { name: "Juventus", href: "/clubes-do-mundo", icon: <Trophy className="h-4 w-4" /> },
    { name: "Milan", href: "/clubes-do-mundo", icon: <Trophy className="h-4 w-4" /> },
    { name: "Inter de Milão", href: "/clubes-do-mundo", icon: <Trophy className="h-4 w-4" /> },
    { name: "PSG", href: "/clubes-do-mundo", icon: <Trophy className="h-4 w-4" /> },
    { name: "Bayern de Munique", href: "/clubes-do-mundo", icon: <Trophy className="h-4 w-4" /> },
  ],
};

const megaMenuRetro: MegaMenuSection = {
  title: "Camisas Retrô",
  items: [
    { name: "Todas as Retrô", href: "/retro", icon: <Clock className="h-4 w-4" /> },
    { name: "Brasileiros Retrô", href: "/retro", icon: <Shirt className="h-4 w-4" /> },
    { name: "Europeus Retrô", href: "/retro", icon: <Shirt className="h-4 w-4" /> },
    { name: "Mais Vendidas", href: "/retro", icon: <Star className="h-4 w-4" /> },
  ],
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useSupabaseAuth();

  useEffect(() => {
    const updateCart = () => {
      const stored = localStorage.getItem("veste_cart");
      if (stored) {
        try {
          const items = JSON.parse(stored);
          setCartCount(items.reduce((a: number, b: any) => a + b.quantity, 0));
        } catch {
          setCartCount(0);
        }
      }
    };
    updateCart();
    window.addEventListener("cart-updated", updateCart);
    return () => window.removeEventListener("cart-updated", updateCart);
  }, []);

  // Scroll detection for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const megaMenuData: Record<string, MegaMenuSection> = {
    brasileiros: megaMenuBrasileiros,
    europeus: megaMenuEuropeus,
    retro: megaMenuRetro,
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/20"
          : "bg-background/95 backdrop-blur-md border-b border-border"
      }`}
    >
      {/* Gold Top Bar - Hidden on scroll for cleaner look */}
      <div
        className={`hidden md:block transition-all duration-300 overflow-hidden ${
          scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
        }`}
      >
        <div className="bg-gradient-to-r from-[var(--gold-dark)] via-[var(--gold)] to-[var(--gold-dark)]">
          <div className="container-vr flex items-center justify-center h-10 text-[11px] font-semibold uppercase tracking-[0.16em] text-background">
            <span className="flex items-center gap-2">
              <Trophy className="h-3.5 w-3.5" />
              Camisas retrô premium · Frete grátis acima de R$ 299 · Até 10x sem juros
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-vr flex items-center justify-between gap-6 py-3 pl-6">
        {/* Logo */}
        <Link
          to="/"
          aria-label="VesteRetro — Início"
          className="shrink-0"
        >
          <div className="logo-container">
            <img
              src={LOGO_URL}
              alt="VesteRetro — Vista a História"
              className="logo-img"
              loading="eager"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 text-[13px] font-semibold uppercase tracking-[0.12em] lg:flex">
          <Link
            to="/"
            className="px-3 py-2 text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors rounded-md hover:bg-[var(--gold)]/5"
          >
            Início
          </Link>

          {/* Brasileiros Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => setActiveMegaMenu("brasileiros")}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <button className="inline-flex items-center gap-1.5 px-3 py-2 text-foreground/85 hover:text-[var(--gold)] transition-colors rounded-md hover:bg-[var(--gold)]/5">
              Brasileiros
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  activeMegaMenu === "brasileiros" ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeMegaMenu === "brasileiros" && (
              <div className="absolute left-0 top-full z-50 mt-1 w-80 rounded-xl border border-border bg-card/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/30 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] font-semibold mb-3 px-2">
                  {megaMenuBrasileiros.title}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {megaMenuBrasileiros.items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-[var(--gold)]/10 hover:text-[var(--gold)] transition-colors"
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border/50">
                  <Link
                    to="/clubes-do-brasil"
                    className="flex items-center justify-center gap-2 rounded-lg bg-[var(--gold)]/10 px-4 py-2 text-xs font-semibold text-[var(--gold)] hover:bg-[var(--gold)]/20 transition-colors"
                  >
                    Ver todos os brasileiros
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Europeus Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => setActiveMegaMenu("europeus")}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <button className="inline-flex items-center gap-1.5 px-3 py-2 text-foreground/85 hover:text-[var(--gold)] transition-colors rounded-md hover:bg-[var(--gold)]/5">
              Europeus
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  activeMegaMenu === "europeus" ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeMegaMenu === "europeus" && (
              <div className="absolute left-0 top-full z-50 mt-1 w-80 rounded-xl border border-border bg-card/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/30 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] font-semibold mb-3 px-2">
                  {megaMenuEuropeus.title}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {megaMenuEuropeus.items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-[var(--gold)]/10 hover:text-[var(--gold)] transition-colors"
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border/50">
                  <Link
                    to="/clubes-do-mundo"
                    className="flex items-center justify-center gap-2 rounded-lg bg-[var(--gold)]/10 px-4 py-2 text-xs font-semibold text-[var(--gold)] hover:bg-[var(--gold)]/20 transition-colors"
                  >
                    Ver todos os europeus
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Retrô Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => setActiveMegaMenu("retro")}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <button className="inline-flex items-center gap-1.5 px-3 py-2 text-foreground/85 hover:text-[var(--gold)] transition-colors rounded-md hover:bg-[var(--gold)]/5">
              Retrô
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  activeMegaMenu === "retro" ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeMegaMenu === "retro" && (
              <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-border bg-card/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/30 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] font-semibold mb-3 px-2">
                  {megaMenuRetro.title}
                </p>
                <div className="space-y-1">
                  {megaMenuRetro.items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-[var(--gold)]/10 hover:text-[var(--gold)] transition-colors"
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/lancamentos"
            className="px-3 py-2 text-foreground/85 hover:text-[var(--gold)] transition-colors rounded-md hover:bg-[var(--gold)]/5"
          >
            Lançamentos
          </Link>
          <Link
            to="/promocoes"
            className="px-3 py-2 text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors rounded-md hover:bg-[var(--gold)]/5"
          >
            Promoções
          </Link>
          <Link
            to="/sobre"
            className="px-3 py-2 text-foreground/85 hover:text-[var(--gold)] transition-colors rounded-md hover:bg-[var(--gold)]/5"
          >
            Sobre
          </Link>
          <Link
            to="/contato"
            className="px-3 py-2 text-foreground/85 hover:text-[var(--gold)] transition-colors rounded-md hover:bg-[var(--gold)]/5"
          >
            Contato
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            aria-label="Buscar"
            className="rounded-lg p-2.5 text-foreground/85 hover:text-[var(--gold)] hover:bg-[var(--gold)]/5 transition-all"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            aria-label="Favoritos"
            to="/favoritos"
            className="hidden sm:flex rounded-lg p-2.5 text-foreground/85 hover:text-[var(--gold)] hover:bg-[var(--gold)]/5 transition-all"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Conta"
            to={isAuthenticated ? "/minha-conta" : "/entrar"}
            className="rounded-lg p-2.5 text-foreground/85 hover:text-[var(--gold)] hover:bg-[var(--gold)]/5 transition-all"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Carrinho"
            to="/carrinho"
            className="relative rounded-lg p-2.5 text-foreground/85 hover:text-[var(--gold)] hover:bg-[var(--gold)]/5 transition-all"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--gold)] px-1.5 text-[10px] font-bold text-background animate-pulse">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          <button
            className="rounded-lg p-2.5 lg:hidden text-foreground/85 hover:text-[var(--gold)] hover:bg-[var(--gold)]/5 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            <Link
              to="/"
              className="block px-4 py-3 text-sm text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded-lg transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/clubes-do-brasil"
              className="block px-4 py-3 text-sm text-foreground/85 hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Brasileiros
            </Link>
            <Link
              to="/clubes-do-mundo"
              className="block px-4 py-3 text-sm text-foreground/85 hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Europeus
            </Link>
            <Link
              to="/retro"
              className="block px-4 py-3 text-sm text-foreground/85 hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Retrô
            </Link>
            <Link
              to="/lancamentos"
              className="block px-4 py-3 text-sm text-foreground/85 hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Lançamentos
            </Link>
            <Link
              to="/promocoes"
              className="block px-4 py-3 text-sm text-[var(--gold)] hover:text-[var(--gold-light)] hover:bg-[var(--gold)]/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Promoções
            </Link>
            <Link
              to="/sobre"
              className="block px-4 py-3 text-sm text-foreground/85 hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              to="/contato"
              className="block px-4 py-3 text-sm text-foreground/85 hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
            <div className="border-t border-border pt-2 mt-2">
              <Link
                to={isAuthenticated ? "/minha-conta" : "/entrar"}
                className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/85 hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                {isAuthenticated ? "Minha Conta" : "Entrar"}
              </Link>
              <Link
                to="/favoritos"
                className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/85 hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-4 h-4" />
                Favoritos
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
