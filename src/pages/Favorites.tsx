import { useState } from "react";
import { Link } from "react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { demoProducts } from "@/data/products";

export default function Favorites() {
  const [favorites] = useState(demoProducts.slice(0, 3));

  return (
    <div className="min-h-screen bg-[#090B0B]">
      <div className="bg-[#111414] border-b border-[#D6A632]/10">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
          <h1 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED]">
            Meus{" "}
            <span className="gold-text">Favoritos</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-[#D6A632]/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#F8F5ED] mb-2">
              Nenhum favorito ainda
            </h2>
            <p className="text-sm text-[#9B9B9B] mb-6">
              Salve seus produtos favoritos para comprar depois.
            </p>
            <Link
              to="/todos-os-produtos"
              className="inline-flex items-center gap-2 bg-[#D6A632] text-[#090B0B] px-6 py-3 text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-all"
            >
              Explorar produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
