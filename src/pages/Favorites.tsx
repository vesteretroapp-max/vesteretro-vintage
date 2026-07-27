import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { demoProducts } from "@/data/products";

interface FavoriteItem {
  productId: string;
  addedAt: number;
}

export default function Favorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("veste_favorites");
    if (stored) {
      try {
        const items: FavoriteItem[] = JSON.parse(stored);
        setFavoriteIds(items.map((i) => i.productId));
      } catch {
        setFavoriteIds([]);
      }
    }
  }, []);

  const products = demoProducts.filter((p) => favoriteIds.includes(p.id));

  const clearFavorites = () => {
    localStorage.removeItem("veste_favorites");
    setFavoriteIds([]);
    window.dispatchEvent(new Event("favorites-updated"));
  };

  return (
    <div className="min-h-screen bg-[#090B0B]">
      <div className="bg-surface border-b border-border">
        <div className="container-vr py-8 lg:py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
                Meus <span className="text-[var(--gold)]">Favoritos</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                {products.length} {products.length === 1 ? "produto salvo" : "produtos salvos"}
              </p>
            </div>
            {products.length > 0 && (
              <button
                onClick={clearFavorites}
                className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Limpar todos
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-vr py-8">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-[var(--gold)]/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Nenhum favorito ainda</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Salve seus produtos favoritos clicando no ícone de coração e encontre-os aqui.
            </p>
            <Link
              to="/todos-os-produtos"
              className="btn-gold rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2"
            >
              Explorar produtos
              <ShoppingBag className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
