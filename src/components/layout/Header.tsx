import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  User,
  ChevronDown,
  Trophy,
  ShieldCheck,
  Lock,
  CreditCard,
} from "lucide-react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

const LOGO_URL =
  "https://i.postimg.cc/1PpMzQ81/Chat-GPT-Image-27-de-jul-de-2026-16-41-41.png";

interface MegaMenuItem {
  name: string;
  href: string;
}

const clubesBrasil: MegaMenuItem[] = [
  { name: "Clubes do Brasil", href: "/clubes-do-brasil" },
  { name: "Clubes do Mundo", href: "/clubes-do-mundo" },
  { name: "Promoções", href: "/promocoes" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
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

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      {/* Gold Top Bar */}
      <div className="hidden bg-gradient-to-r from-[var(--gold-dark)] via-[var(--gold)] to-[var(--gold-dark)] md:block">
        <div className="container-vr grid h-10 grid-cols-4 items-center text-[11px] font-semibold uppercase tracking-[0.16em] text-background">
          <span className="flex items-center justify-center gap-2">
            <Trophy className="h-3.5 w-3.5" />
            Camisas retrô premium
          </span>
          <span className="flex items-center justify-center gap-2 border-l border-background/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            Qualidade premium
          </span>
          <span className="flex items-center justify-center gap-2 border-l border-background/20">
            <Lock className="h-3.5 w-3.5" />
            Compra 100% segura
          </span>
          <span className="flex items-center justify-center gap-2 border-l border-background/20">
            <CreditCard className="h-3.5 w-3.5" />
            Parcele em até 12x no cartão
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-vr flex items-center justify-between gap-10 py-3 pl-6">
        {/* Logo */}
        <Link
          to="/"
          aria-label="VesteRetro — Início"
          className="shrink-0"
        >
          <img
            src={LOGO_URL}
            alt="VesteRetro — Vista a História"
            className="h-[50px] w-auto max-w-[210px] shrink-0 object-contain mix-blend-lighten md:h-[58px] md:max-w-[245px] lg:h-[68px] lg:max-w-[290px] xl:h-[76px] xl:max-w-[330px]"
            loading="eager"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-[13px] font-semibold uppercase tracking-[0.14em] lg:flex">
          <Link
            to="/"
            className="text-[var(--gold)]"
          >
            Início
          </Link>
          <div className="group relative">
            <button className="inline-flex items-center gap-1 text-foreground/85 hover:text-[var(--gold)] transition-colors">
              Clubes
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="pointer-events-none invisible absolute left-1/2 top-full z-30 mt-2 min-w-52 -translate-x-1/2 rounded-md border border-border bg-surface p-2 opacity-0 shadow-lg transition group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
              {clubesBrasil.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block rounded px-3 py-2 text-xs text-foreground/85 hover:bg-surface-2 hover:text-[var(--gold)] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <Link
            to="/selecoes"
            className="text-foreground/85 hover:text-[var(--gold)] transition-colors"
          >
            Seleções
          </Link>
          <Link
            to="/lancamentos"
            className="text-foreground/85 hover:text-[var(--gold)] transition-colors"
          >
            Lançamentos
          </Link>
          <Link
            to="/sobre"
            className="text-foreground/85 hover:text-[var(--gold)] transition-colors"
          >
            Sobre nós
          </Link>
          <Link
            to="/contato"
            className="text-foreground/85 hover:text-[var(--gold)] transition-colors"
          >
            Contato
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            aria-label="Buscar"
            className="rounded-md p-2 text-foreground/85 hover:text-[var(--gold)] transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            aria-label="Conta"
            to={isAuthenticated ? "/minha-conta" : "/entrar"}
            className="rounded-md p-2 text-foreground/85 hover:text-[var(--gold)] transition-colors"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Carrinho"
            to="/carrinho"
            className="relative rounded-md p-2 text-foreground/85 hover:text-[var(--gold)] transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--gold)] px-1 text-[10px] font-bold text-background">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          <button
            className="rounded-md p-2 lg:hidden text-foreground/85 hover:text-[var(--gold)] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-surface">
          <div className="px-4 py-4 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2.5 text-sm text-foreground/85 hover:text-[var(--gold)] hover:bg-surface-2 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/clubes-do-brasil"
              className="block px-3 py-2.5 text-sm text-foreground/85 hover:text-[var(--gold)] hover:bg-surface-2 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Clubes do Brasil
            </Link>
            <Link
              to="/clubes-do-mundo"
              className="block px-3 py-2.5 text-sm text-foreground/85 hover:text-[var(--gold)] hover:bg-surface-2 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Clubes do Mundo
            </Link>
            <Link
              to="/selecoes"
              className="block px-3 py-2.5 text-sm text-foreground/85 hover:text-[var(--gold)] hover:bg-surface-2 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Seleções
            </Link>
            <Link
              to="/lancamentos"
              className="block px-3 py-2.5 text-sm text-foreground/85 hover:text-[var(--gold)] hover:bg-surface-2 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Lançamentos
            </Link>
            <Link
              to="/promocoes"
              className="block px-3 py-2.5 text-sm text-[var(--gold)] hover:text-[var(--gold-light)] hover:bg-surface-2 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Promoções
            </Link>
            <div className="border-t border-border pt-2 mt-2">
              <Link
                to={isAuthenticated ? "/minha-conta" : "/entrar"}
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground/85 hover:text-[var(--gold)] hover:bg-surface-2 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                {isAuthenticated ? "Minha Conta" : "Entrar"}
              </Link>
              <Link
                to="/favoritos"
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground/85 hover:text-[var(--gold)] hover:bg-surface-2 rounded transition-colors"
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
