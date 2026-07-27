import { useState, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router";
import {
  SlidersHorizontal,
  Grid3X3,
  X,
  Search,
  ChevronDown,
  Filter,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { demoProducts, decades } from "@/data/products";

type SortOption = "relevance" | "bestSellers" | "newest" | "price-asc" | "price-desc" | "rating";

export default function Catalog() {
  const { club, team, slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [sizeFilter, setSizeFilter] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [decadeFilter, setDecadeFilter] = useState<string>("");

  const perPage = 12;

  // Determine the category context from URL params
  const categoryContext = useMemo(() => {
    const path = window.location.pathname;
    if (path.includes("clubes-do-brasil")) return { type: "brasil" as const, club: club };
    if (path.includes("clubes-do-mundo")) return { type: "mundo" as const, club: club };
    if (path.includes("selecoes")) return { type: "selecoes" as const, team: club };
    if (path.includes("lancamentos")) return { type: "lancamentos" as const };
    if (path.includes("promocoes")) return { type: "promocoes" as const };
    if (path.includes("mais-vendidos")) return { type: "bestSellers" as const };
    if (path.includes("todos-os-produtos")) return { type: "all" as const };
    if (path.includes("busca")) return { type: "search" as const, q: searchParams.get("q") || "" };
    return { type: "all" as const };
  }, [club, searchParams]);

  // Filter products based on context and filters
  const filteredProducts = useMemo(() => {
    let filtered = [...demoProducts];

    // Context filter
    switch (categoryContext.type) {
      case "brasil":
        filtered = filtered.filter((p) => p.category === "brasil");
        if (categoryContext.club) {
          filtered = filtered.filter(
            (p) => p.club.toLowerCase() === categoryContext.club?.replace(/-/g, " ")
          );
        }
        break;
      case "mundo":
        filtered = filtered.filter((p) => p.category === "mundo");
        if (categoryContext.club) {
          filtered = filtered.filter(
            (p) => p.club.toLowerCase() === categoryContext.club?.replace(/-/g, " ")
          );
        }
        break;
      case "selecoes":
        filtered = filtered.filter((p) => p.category === "selecoes");
        if (categoryContext.team) {
          filtered = filtered.filter(
            (p) => p.club.toLowerCase() === categoryContext.team?.replace(/-/g, " ")
          );
        }
        break;
      case "lancamentos":
        filtered = filtered.filter((p) => p.isNew);
        break;
      case "promocoes":
        filtered = filtered.filter((p) => p.isPromotion);
        break;
      case "bestSellers":
        filtered = filtered.filter((p) => p.isBestSeller);
        break;
      case "search":
        if (categoryContext.q) {
          const term = categoryContext.q.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(term) ||
              p.club.toLowerCase().includes(term) ||
              p.tags.some((t) => t.toLowerCase().includes(term)) ||
              p.country?.toLowerCase().includes(term)
          );
        }
        break;
    }

    // Decade filter
    if (decadeFilter) {
      const d = parseInt(decadeFilter);
      filtered = filtered.filter((p) => p.decade === d);
    }

    // Size filter
    if (sizeFilter) {
      filtered = filtered.filter((p) =>
        p.sizes.some((s) => s.size === sizeFilter && s.stock > 0)
      );
    }

    // Price range filter
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((p) => {
        const price = p.promotionalPrice || p.price;
        return price >= min && price <= max;
      });
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => (a.promotionalPrice || a.price) - (b.promotionalPrice || b.price));
        break;
      case "price-desc":
        filtered.sort((a, b) => (b.promotionalPrice || b.price) - (a.promotionalPrice || a.price));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "bestSellers":
        filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case "newest":
        filtered.sort((a, b) => b.year - a.year);
        break;
    }

    return filtered;
  }, [categoryContext, decadeFilter, sizeFilter, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const getTitle = () => {
    switch (categoryContext.type) {
      case "brasil":
        return categoryContext.club
          ? `${categoryContext.club.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`
          : "Clubes do Brasil";
      case "mundo":
        return categoryContext.club
          ? `${categoryContext.club.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`
          : "Clubes do Mundo";
      case "selecoes":
        return categoryContext.team
          ? `${categoryContext.team.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`
          : "Seleções";
      case "lancamentos":
        return "Lançamentos";
      case "promocoes":
        return "Promoções";
      case "bestSellers":
        return "Mais Vendidos";
      case "search":
        return `Busca: "${categoryContext.q}"`;
      default:
        return "Todos os Produtos";
    }
  };

  const getDescription = () => {
    switch (categoryContext.type) {
      case "brasil":
        return "Camisas retrô dos maiores clubes do futebol brasileiro. Reviva momentos históricos com os mantos que marcaram gerações.";
      case "mundo":
        return "Camisas retrô de clubes lendários do futebol mundial. Europa, América do Sul e muito mais.";
      case "selecoes":
        return "Camisas retrô de seleções que marcaram a história das Copas do Mundo.";
      case "lancamentos":
        return "As novidades que acabaram de chegar na VesteRetro. Seja o primeiro a garantir a sua.";
      case "promocoes":
        return "Ofertas selecionadas em camisas retrô premium. Aproveite os melhores preços.";
      case "bestSellers":
        return "Os produtos mais vendidos da VesteRetro. Os favoritos dos nossos clientes.";
      default:
        return "Explore nosso catálogo completo de camisas retrô premium.";
    }
  };

  const filterChips = [
    ...(decadeFilter ? [{ label: `Década: ${decadeFilter}s`, onRemove: () => setDecadeFilter("") }] : []),
    ...(sizeFilter ? [{ label: `Tam: ${sizeFilter}`, onRemove: () => setSizeFilter("") }] : []),
    ...(priceRange
      ? [{ label: `R$ ${priceRange.replace("-", " a R$ ")}`, onRemove: () => setPriceRange("") }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#090B0B]">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="container-vr py-8 lg:py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground mb-4">
            <Link to="/" className="hover:text-[var(--gold)] transition-colors">Início</Link>
            <span>/</span>
            <span className="text-foreground/70">{getTitle()}</span>
          </div>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
            {getTitle()}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{getDescription()}</p>
          <p className="text-xs text-[var(--gold)] mt-2 font-medium">
            {filteredProducts.length} {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
        </div>
      </div>

      <div className="container-vr py-8">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-[var(--gold)] transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
              {filterChips.length > 0 && (
                <span className="bg-[var(--gold)] text-background text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {filterChips.length}
                </span>
              )}
            </button>
            <div className="hidden md:flex items-center gap-2 border-l border-border pl-3">
              <Grid3X3 className="w-4 h-4 text-[var(--gold)]" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchTerm.trim()) {
                  setSearchParams({ q: searchTerm.trim() });
                }
              }}
              className="hidden sm:flex items-center"
            >
              <input
                type="text"
                placeholder="Buscar no catálogo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-40 lg:w-52 px-3 py-1.5 bg-surface border border-border text-foreground text-xs placeholder:text-muted-foreground rounded-l-sm focus:border-[var(--gold)] outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[var(--gold)] text-background text-xs font-semibold rounded-r-sm hover:bg-[var(--gold-light)] transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-surface border border-border text-muted-foreground text-xs px-3 py-1.5 rounded-sm focus:border-[var(--gold)] outline-none"
            >
              <option value="relevance">Mais relevantes</option>
              <option value="bestSellers">Mais vendidos</option>
              <option value="newest">Lançamentos</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="rating">Melhor avaliados</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {filterChips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filterChips.map((chip) => (
              <button
                key={chip.label}
                onClick={chip.onRemove}
                className="flex items-center gap-1 px-3 py-1 bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[var(--gold)] text-[10px] uppercase tracking-wider rounded-full hover:bg-[var(--gold)]/20 transition-colors"
              >
                {chip.label}
                <X className="w-3 h-3" />
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="hidden lg:block w-64 shrink-0">
              <div className="space-y-6 sticky top-28">
                {/* Década */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-semibold mb-3">Década</h4>
                  <div className="space-y-1">
                    {decades.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setDecadeFilter(decadeFilter === String(d.value) ? "" : String(d.value))}
                        className={`block w-full text-left px-3 py-1.5 text-xs rounded-sm transition-colors ${
                          decadeFilter === String(d.value)
                            ? "bg-[var(--gold)]/10 text-[var(--gold)]"
                            : "text-muted-foreground hover:text-foreground hover:bg-surface"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tamanho */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-semibold mb-3">Tamanho</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {["P", "M", "G", "GG", "XG", "2XG", "3XG", "4XG"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSizeFilter(sizeFilter === s ? "" : s)}
                        className={`w-8 h-8 text-[10px] font-medium border rounded-sm transition-all ${
                          sizeFilter === s
                            ? "bg-[var(--gold)] text-background border-[var(--gold)]"
                            : "border-border text-muted-foreground hover:border-[var(--gold)]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preço */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-semibold mb-3">Preço</h4>
                  <div className="space-y-1">
                    {[
                      { label: "Até R$ 149", value: "0-149" },
                      { label: "R$ 150 a R$ 169", value: "150-169" },
                      { label: "R$ 170 a R$ 179", value: "170-179" },
                      { label: "Acima de R$ 179", value: "179-999" },
                    ].map((range) => (
                      <button
                        key={range.value}
                        onClick={() => setPriceRange(priceRange === range.value ? "" : range.value)}
                        className={`block w-full text-left px-3 py-1.5 text-xs rounded-sm transition-colors ${
                          priceRange === range.value
                            ? "bg-[var(--gold)]/10 text-[var(--gold)]"
                            : "text-muted-foreground hover:text-foreground hover:bg-surface"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Promoção check */}
                {categoryContext.type !== "promocoes" && (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-semibold mb-3">Ofertas</h4>
                    <Link
                      to="/promocoes"
                      className="block w-full text-left px-3 py-1.5 text-xs text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded-sm transition-colors"
                    >
                      Ver promoções
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Filters Drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setShowFilters(false)}>
              <div className="fixed right-0 top-0 bottom-0 w-80 bg-surface border-l border-border p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs uppercase tracking-widest text-[var(--gold)] font-semibold">Filtros</h3>
                  <button onClick={() => setShowFilters(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Mobile filters - same content as sidebar */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-semibold mb-3">Década</h4>
                    {decades.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => { setDecadeFilter(decadeFilter === String(d.value) ? "" : String(d.value)); setShowFilters(false); }}
                        className={`block w-full text-left px-3 py-1.5 text-xs rounded-sm transition-colors ${
                          decadeFilter === String(d.value) ? "bg-[var(--gold)]/10 text-[var(--gold)]" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-semibold mb-3">Tamanho</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {["P", "M", "G", "GG", "XG"].map((s) => (
                        <button
                          key={s}
                          onClick={() => { setSizeFilter(sizeFilter === s ? "" : s); setShowFilters(false); }}
                          className={`w-8 h-8 text-[10px] font-medium border rounded-sm transition-all ${
                            sizeFilter === s ? "bg-[var(--gold)] text-background border-[var(--gold)]" : "border-border text-muted-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-semibold mb-3">Preço</h4>
                    {[
                      { label: "Até R$ 149", value: "0-149" },
                      { label: "R$ 150 a R$ 169", value: "150-169" },
                      { label: "R$ 170 a R$ 179", value: "170-179" },
                      { label: "Acima de R$ 179", value: "179-999" },
                    ].map((range) => (
                      <button
                        key={range.value}
                        onClick={() => { setPriceRange(priceRange === range.value ? "" : range.value); setShowFilters(false); }}
                        className={`block w-full text-left px-3 py-1.5 text-xs rounded-sm transition-colors ${
                          priceRange === range.value ? "bg-[var(--gold)]/10 text-[var(--gold)]" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-border text-xs text-muted-foreground rounded-sm hover:border-[var(--gold)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 text-xs font-medium rounded-sm transition-all ${
                          currentPage === page
                            ? "bg-[var(--gold)] text-background"
                            : "border border-border text-muted-foreground hover:border-[var(--gold)]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-border text-xs text-muted-foreground rounded-sm hover:border-[var(--gold)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Próximo
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-bold text-foreground mb-2">Nenhum produto encontrado</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Tente ajustar os filtros ou buscar por outro termo.
                </p>
                <button
                  onClick={() => {
                    setDecadeFilter("");
                    setSizeFilter("");
                    setPriceRange("");
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="btn-gold rounded-md px-6 py-2.5 text-xs uppercase tracking-widest"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
