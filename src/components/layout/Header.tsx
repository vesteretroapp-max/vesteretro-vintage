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
  Phone,
  Truck,
  Shield,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const logoUrl =
  "https://harmless-tapir-303.convex.cloud/api/storage/026f76e2-7e38-46d7-8178-c7d0a140b884";

interface MegaMenuItem {
  name: string;
  href: string;
}

const brasilClubes: MegaMenuItem[] = [
  { name: "Flamengo", href: "/clubes-do-brasil/flamengo" },
  { name: "Corinthians", href: "/clubes-do-brasil/corinthians" },
  { name: "Palmeiras", href: "/clubes-do-brasil/palmeiras" },
  { name: "São Paulo", href: "/clubes-do-brasil/sao-paulo" },
  { name: "Santos", href: "/clubes-do-brasil/santos" },
  { name: "Vasco da Gama", href: "/clubes-do-brasil/vasco" },
  { name: "Botafogo", href: "/clubes-do-brasil/botafogo" },
  { name: "Fluminense", href: "/clubes-do-brasil/fluminense" },
  { name: "Grêmio", href: "/clubes-do-brasil/gremio" },
  { name: "Internacional", href: "/clubes-do-brasil/internacional" },
  { name: "Cruzeiro", href: "/clubes-do-brasil/cruzeiro" },
  { name: "Atlético Mineiro", href: "/clubes-do-brasil/atletico-mg" },
  { name: "Bahia", href: "/clubes-do-brasil/bahia" },
  { name: "Sport Recife", href: "/clubes-do-brasil/sport" },
  { name: "Outros clubes", href: "/clubes-do-brasil" },
];

const mundoClubes: MegaMenuItem[] = [
  { name: "Real Madrid", href: "/clubes-do-mundo/real-madrid" },
  { name: "Barcelona", href: "/clubes-do-mundo/barcelona" },
  { name: "Manchester United", href: "/clubes-do-mundo/manchester-united" },
  { name: "Manchester City", href: "/clubes-do-mundo/manchester-city" },
  { name: "Liverpool", href: "/clubes-do-mundo/liverpool" },
  { name: "Arsenal", href: "/clubes-do-mundo/arsenal" },
  { name: "Chelsea", href: "/clubes-do-mundo/chelsea" },
  { name: "Milan", href: "/clubes-do-mundo/milan" },
  { name: "Inter de Milão", href: "/clubes-do-mundo/inter-milao" },
  { name: "Juventus", href: "/clubes-do-mundo/juventus" },
  { name: "Roma", href: "/clubes-do-mundo/roma" },
  { name: "Napoli", href: "/clubes-do-mundo/napoli" },
  { name: "Bayern de Munique", href: "/clubes-do-mundo/bayern" },
  { name: "Borussia Dortmund", href: "/clubes-do-mundo/dortmund" },
  { name: "Paris Saint-Germain", href: "/clubes-do-mundo/psg" },
  { name: "Boca Juniors", href: "/clubes-do-mundo/boca-juniors" },
  { name: "River Plate", href: "/clubes-do-mundo/river-plate" },
  { name: "Outros clubes", href: "/clubes-do-mundo" },
];

const selecoes: MegaMenuItem[] = [
  { name: "Brasil", href: "/selecoes/brasil" },
  { name: "Argentina", href: "/selecoes/argentina" },
  { name: "Alemanha", href: "/selecoes/alemanha" },
  { name: "Itália", href: "/selecoes/italia" },
  { name: "França", href: "/selecoes/franca" },
  { name: "Espanha", href: "/selecoes/espanha" },
  { name: "Inglaterra", href: "/selecoes/inglaterra" },
  { name: "Portugal", href: "/selecoes/portugal" },
  { name: "Holanda", href: "/selecoes/holanda" },
  { name: "México", href: "/selecoes/mexico" },
  { name: "Japão", href: "/selecoes/japao" },
  { name: "Colômbia", href: "/selecoes/colombia" },
  { name: "Outras seleções", href: "/selecoes" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const megaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("veste_cart");
    if (stored) {
      try {
        const items = JSON.parse(stored);
        setCartCount(items.reduce((a: number, b: any) => a + b.quantity, 0));
      } catch {
        setCartCount(0);
      }
    }
    const handleCartUpdate = () => {
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
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  const handleMegaEnter = (menu: string) => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setActiveMega(menu);
  };

  const handleMegaLeave = () => {
    megaTimeoutRef.current = setTimeout(() => {
      setActiveMega(null);
    }, 150);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-[#090B0B] border-b border-[#D6A632]/20">
      {/* Top Bar */}
      <div className="hidden lg:block bg-[#111414] border-b border-[#D6A632]/10">
        <div className="max-w-7xl mx-auto px-4 py-1.5">
          <div className="flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest text-[#D4D4D4]">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3 h-3 text-[#D6A632]" />
              Qualidade Premium
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-[#D6A632]" />
              Compra Segura
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-3 h-3 text-[#D6A632]" />
              Parcele em até 12x
            </span>
            <a
              href="https://wa.me/5511987516823"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#D6A632] transition-colors"
            >
              <MessageCircle className="w-3 h-3 text-[#D6A632]" />
              Atendimento via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-[#F8F5ED] hover:text-[#D6A632] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={logoUrl}
              alt="VesteRetro"
              className="h-10 lg:h-12 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg lg:text-xl font-bold tracking-wider text-[#F8F5ED]">
                VesteRetro
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#D6A632] font-serif italic">
                Vista a História.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className="px-3 py-2 text-xs uppercase tracking-widest text-[#D4D4D4] hover:text-[#D6A632] transition-colors"
            >
              Início
            </Link>

            {/* Mega Menu - Clubes do Brasil */}
            <div
              className="relative"
              onMouseEnter={() => handleMegaEnter("brasil")}
              onMouseLeave={handleMegaLeave}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-xs uppercase tracking-widest text-[#D4D4D4] hover:text-[#D6A632] transition-colors">
                Clubes do Brasil
                <ChevronDown className="w-3 h-3" />
              </button>
              {activeMega === "brasil" && (
                <div
                  ref={megaRef}
                  className="absolute top-full left-0 w-[600px] bg-[#111414] border border-[#D6A632]/20 shadow-2xl z-50 mega-menu-content"
                  onMouseEnter={() => handleMegaEnter("brasil")}
                  onMouseLeave={handleMegaLeave}
                >
                  <div className="grid grid-cols-3 gap-1 p-4">
                    {brasilClubes.map((club) => (
                      <Link
                        key={club.name}
                        to={club.href}
                        className="px-3 py-2 text-xs text-[#D4D4D4] hover:text-[#D6A632] hover:bg-[#181B1B] rounded transition-all"
                      >
                        {club.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mega Menu - Clubes do Mundo */}
            <div
              className="relative"
              onMouseEnter={() => handleMegaEnter("mundo")}
              onMouseLeave={handleMegaLeave}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-xs uppercase tracking-widest text-[#D4D4D4] hover:text-[#D6A632] transition-colors">
                Clubes do Mundo
                <ChevronDown className="w-3 h-3" />
              </button>
              {activeMega === "mundo" && (
                <div
                  className="absolute top-full left-0 w-[600px] bg-[#111414] border border-[#D6A632]/20 shadow-2xl z-50 mega-menu-content"
                  onMouseEnter={() => handleMegaEnter("mundo")}
                  onMouseLeave={handleMegaLeave}
                >
                  <div className="grid grid-cols-3 gap-1 p-4">
                    {mundoClubes.map((club) => (
                      <Link
                        key={club.name}
                        to={club.href}
                        className="px-3 py-2 text-xs text-[#D4D4D4] hover:text-[#D6A632] hover:bg-[#181B1B] rounded transition-all"
                      >
                        {club.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mega Menu - Seleções */}
            <div
              className="relative"
              onMouseEnter={() => handleMegaEnter("selecoes")}
              onMouseLeave={handleMegaLeave}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-xs uppercase tracking-widest text-[#D4D4D4] hover:text-[#D6A632] transition-colors">
                Seleções
                <ChevronDown className="w-3 h-3" />
              </button>
              {activeMega === "selecoes" && (
                <div
                  className="absolute top-full left-0 w-[400px] bg-[#111414] border border-[#D6A632]/20 shadow-2xl z-50 mega-menu-content"
                  onMouseEnter={() => handleMegaEnter("selecoes")}
                  onMouseLeave={handleMegaLeave}
                >
                  <div className="grid grid-cols-2 gap-1 p-4">
                    {selecoes.map((sel) => (
                      <Link
                        key={sel.name}
                        to={sel.href}
                        className="px-3 py-2 text-xs text-[#D4D4D4] hover:text-[#D6A632] hover:bg-[#181B1B] rounded transition-all"
                      >
                        {sel.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/lancamentos"
              className="px-3 py-2 text-xs uppercase tracking-widest text-[#D4D4D4] hover:text-[#D6A632] transition-colors"
            >
              Lançamentos
            </Link>
            <Link
              to="/promocoes"
              className="px-3 py-2 text-xs uppercase tracking-widest text-[#D6A632] hover:text-[#E8C56A] transition-colors"
            >
              Promoções
            </Link>
            <Link
              to="/sobre"
              className="px-3 py-2 text-xs uppercase tracking-widest text-[#D4D4D4] hover:text-[#D6A632] transition-colors"
            >
              Sobre nós
            </Link>
            <Link
              to="/contato"
              className="px-3 py-2 text-xs uppercase tracking-widest text-[#D4D4D4] hover:text-[#D6A632] transition-colors"
            >
              Contato
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Desktop */}
            <button
              className="hidden lg:flex items-center justify-center w-9 h-9 text-[#D4D4D4] hover:text-[#D6A632] transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User */}
            <Link
              to={isAuthenticated ? "/minha-conta" : "/auth"}
              className="hidden lg:flex items-center justify-center w-9 h-9 text-[#D4D4D4] hover:text-[#D6A632] transition-colors"
              aria-label="Minha conta"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Favorites */}
            <Link
              to="/favoritos"
              className="hidden lg:flex items-center justify-center w-9 h-9 text-[#D4D4D4] hover:text-[#D6A632] transition-colors"
              aria-label="Favoritos"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link
              to="/carrinho"
              className="relative flex items-center justify-center w-9 h-9 text-[#D4D4D4] hover:text-[#D6A632] transition-colors"
              aria-label="Carrinho"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D6A632] text-[#090B0B] text-[10px] font-bold flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Search */}
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 text-[#D4D4D4] hover:text-[#D6A632] transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="border-t border-[#D6A632]/10 bg-[#111414]">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B9B9B]" />
              <Input
                type="text"
                placeholder="Buscar por clube, seleção, ano, jogador..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#090B0B] border-[#D6A632]/30 text-[#F8F5ED] placeholder:text-[#9B9B9B] rounded-sm text-sm focus:border-[#D6A632]"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-[#D6A632] text-[#090B0B] text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-colors"
              >
                Buscar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-[#D6A632]/10 bg-[#111414]">
          <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
            <Link
              to="/"
              className="block px-3 py-2.5 text-sm text-[#D4D4D4] hover:text-[#D6A632] hover:bg-[#181B1B] rounded transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>

            {/* Mobile - Clubes do Brasil */}
            <div className="border-b border-[#D6A632]/10 pb-2 mb-2">
              <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-[#D6A632] font-semibold">
                Clubes do Brasil
              </p>
              <div className="grid grid-cols-2 gap-1">
                {brasilClubes.map((club) => (
                  <Link
                    key={club.name}
                    to={club.href}
                    className="px-3 py-2 text-xs text-[#D4D4D4] hover:text-[#D6A632] hover:bg-[#181B1B] rounded transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {club.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile - Clubes do Mundo */}
            <div className="border-b border-[#D6A632]/10 pb-2 mb-2">
              <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-[#D6A632] font-semibold">
                Clubes do Mundo
              </p>
              <div className="grid grid-cols-2 gap-1">
                {mundoClubes.map((club) => (
                  <Link
                    key={club.name}
                    to={club.href}
                    className="px-3 py-2 text-xs text-[#D4D4D4] hover:text-[#D6A632] hover:bg-[#181B1B] rounded transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {club.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile - Seleções */}
            <div className="border-b border-[#D6A632]/10 pb-2 mb-2">
              <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-[#D6A632] font-semibold">
                Seleções
              </p>
              <div className="grid grid-cols-2 gap-1">
                {selecoes.map((sel) => (
                  <Link
                    key={sel.name}
                    to={sel.href}
                    className="px-3 py-2 text-xs text-[#D4D4D4] hover:text-[#D6A632] hover:bg-[#181B1B] rounded transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {sel.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/lancamentos"
              className="block px-3 py-2.5 text-sm text-[#D4D4D4] hover:text-[#D6A632] hover:bg-[#181B1B] rounded transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Lançamentos
            </Link>
            <Link
              to="/promocoes"
              className="block px-3 py-2.5 text-sm text-[#D6A632] hover:text-[#E8C56A] hover:bg-[#181B1B] rounded transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Promoções
            </Link>
            <Link
              to="/sobre"
              className="block px-3 py-2.5 text-sm text-[#D4D4D4] hover:text-[#D6A632] hover:bg-[#181B1B] rounded transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre nós
            </Link>
            <Link
              to="/contato"
              className="block px-3 py-2.5 text-sm text-[#D4D4D4] hover:text-[#D6A632] hover:bg-[#181B1B] rounded transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>

            <div className="pt-2 border-t border-[#D6A632]/10 mt-2">
              <Link
                to={isAuthenticated ? "/minha-conta" : "/auth"}
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#D4D4D4] hover:text-[#D6A632] hover:bg-[#181B1B] rounded transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                {isAuthenticated ? "Minha Conta" : "Entrar"}
              </Link>
              <Link
                to="/favoritos"
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#D4D4D4] hover:text-[#D6A632] hover:bg-[#181B1B] rounded transition-all"
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
