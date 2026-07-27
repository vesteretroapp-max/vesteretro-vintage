import { useState } from "react";
import { useSearchParams } from "react-router";
import { SlidersHorizontal, Grid3X3, List, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { demoProducts } from "@/data/products";

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const q = searchParams.get("q")?.toLowerCase() || "";
  const decade = searchParams.get("decada");

  let products = [...demoProducts];

  if (q) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.club.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.country?.toLowerCase().includes(q)
    );
  }

  if (decade) {
    const d = parseInt(decade);
    products = products.filter((p) => p.decade >= d && p.decade < d + 10);
  }

  switch (sortBy) {
    case "price-asc":
      products.sort((a, b) => (a.promotionalPrice || a.price) - (b.promotionalPrice || b.price));
      break;
    case "price-desc":
      products.sort((a, b) => (b.promotionalPrice || b.price) - (a.promotionalPrice || a.price));
      break;
    case "rating":
      products.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  return (
    <div className="min-h-screen bg-[#090B0B]">
      {/* Banner */}
      <div className="bg-[#111414] border-b border-[#D6A632]/10">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
          <h1 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED]">
            {q ? `Busca: "${q}"` : decade ? `Década de ${decade}` : "Todos os Produtos"}
          </h1>
          <p className="text-sm text-[#9B9B9B] mt-2">{products.length} resultados</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D6A632]/10">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#D4D4D4] hover:text-[#D6A632] transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
            </button>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "grid"
                    ? "text-[#D6A632] bg-[#D6A632]/10"
                    : "text-[#9B9B9B] hover:text-[#D4D4D4]"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "list"
                    ? "text-[#D6A632] bg-[#D6A632]/10"
                    : "text-[#9B9B9B] hover:text-[#D4D4D4]"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[10px] uppercase tracking-wider text-[#9B9B9B]">
              Ordenar por:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#111414] border border-[#D6A632]/20 text-[#D4D4D4] text-xs px-3 py-1.5 rounded-sm focus:border-[#D6A632] outline-none"
            >
              <option value="relevance">Mais relevantes</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="rating">Melhor avaliados</option>
            </select>
          </div>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
                : "space-y-4"
            }
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-[#9B9B9B]">Nenhum produto encontrado.</p>
            <p className="text-sm text-[#9B9B9B] mt-2">Tente buscar por outro termo.</p>
          </div>
        )}

        {/* Pagination */}
        {products.length > 12 && (
          <div className="flex justify-center mt-12 gap-2">
            <button className="px-4 py-2 border border-[#D6A632]/20 text-xs text-[#D4D4D4] rounded-sm hover:border-[#D6A632] transition-colors">
              Anterior
            </button>
            <button className="px-4 py-2 bg-[#D6A632] text-[#090B0B] text-xs font-semibold rounded-sm">
              1
            </button>
            <button className="px-4 py-2 border border-[#D6A632]/20 text-xs text-[#D4D4D4] rounded-sm hover:border-[#D6A632] transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-[#D6A632]/20 text-xs text-[#D4D4D4] rounded-sm hover:border-[#D6A632] transition-colors">
              Próximo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
