import { useState } from "react";
import { Link } from "react-router";
import { Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const discount = product.promotionalPrice
    ? Math.round(
        ((product.price - product.promotionalPrice) / product.price) * 100
      )
    : 0;

  const installmentPrice = (product.promotionalPrice || product.price) / 12;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cart = JSON.parse(localStorage.getItem("veste_cart") || "[]");
    const existing = cart.find(
      (item: any) => item.id === product.id && item.size === "M"
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.promotionalPrice || product.price,
        image: product.images[0],
        size: "M",
        quantity: 1,
        slug: product.slug,
      });
    }
    localStorage.setItem("veste_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  };

  return (
    <Link
      to={`/produto/${product.slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-card relative bg-[#111414] border border-[#D6A632]/10 rounded-sm overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#090B0B]">
          {!imgError ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isHovered ? "scale-110 opacity-80" : "scale-100 opacity-100"
              }`}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#181B1B]">
              <div className="text-center">
                <ShoppingBag className="w-8 h-8 text-[#D6A632]/40 mx-auto mb-2" />
                <p className="text-[10px] text-[#9B9B9B]">{product.club}</p>
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-[#090B0B]/90 via-transparent to-transparent transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Hover actions */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-500 ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#D6A632] text-[#090B0B] text-[10px] font-semibold uppercase tracking-wider py-2.5 rounded-sm hover:bg-[#E8C56A] transition-colors"
              >
                Adicionar ao carrinho
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsFavorited(!isFavorited);
                }}
                className="w-9 h-9 bg-[#090B0B]/80 border border-[#D6A632]/30 rounded-sm flex items-center justify-center hover:bg-[#D6A632]/20 transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorited
                      ? "fill-[#D6A632] text-[#D6A632]"
                      : "text-[#D4D4D4]"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-[#D6A632] text-[#090B0B] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                Novo
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-[#090B0B] text-[#F8F5ED] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border border-[#D6A632]/30">
                Mais Vendido
              </span>
            )}
            {discount > 0 && (
              <span className="bg-[#C94B4B] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick view on desktop */}
          <div
            className={`absolute top-2 right-2 transition-all duration-300 ${
              isHovered
                ? "translate-x-0 opacity-100"
                : "translate-x-4 opacity-0"
            }`}
          >
            <span className="text-[9px] uppercase tracking-wider text-[#F8F5ED] bg-[#090B0B]/80 px-2 py-1 rounded-sm border border-[#D6A632]/20">
              Ver detalhes
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <p className="text-[10px] uppercase tracking-wider text-[#D6A632] font-medium">
              {product.club}
            </p>
            <span className="text-[9px] text-[#9B9B9B]">• {product.year}</span>
          </div>

          <h3 className="text-xs text-[#F8F5ED] leading-tight line-clamp-2 font-medium">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-[#D6A632] text-[#D6A632]" />
            <span className="text-[10px] text-[#9B9B9B]">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="space-y-0.5">
            {product.promotionalPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#9B9B9B] line-through">
                  R$ {product.price.toFixed(2)}
                </span>
                <span className="text-sm font-bold text-[#D6A632]">
                  R$ {product.promotionalPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-sm font-bold text-[#D6A632]">
                R$ {product.price.toFixed(2)}
              </span>
            )}
            <p className="text-[9px] text-[#9B9B9B]">
              ou 12x de R$ {installmentPrice.toFixed(2)} sem juros
            </p>
          </div>

          {/* Size indicators */}
          <div className="flex gap-1 pt-1">
            {product.sizes.slice(0, 5).map((s) => (
              <span
                key={s.size}
                className={`text-[8px] px-1.5 py-0.5 rounded border ${
                  s.stock > 0
                    ? "border-[#D6A632]/30 text-[#D4D4D4]"
                    : "border-[#C94B4B]/30 text-[#C94B4B] line-through"
                }`}
              >
                {s.size}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
