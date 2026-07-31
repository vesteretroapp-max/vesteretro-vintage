import { useState } from "react";
import { Link } from "react-router";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { LazyImage } from "@/components/ui/LazyImage";
import type { Product } from "@/data/products";
import { FALLBACK_IMAGE } from "@/lib/product-images";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [secondImgError, setSecondImgError] = useState(false);

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

  const getBadge = () => {
    if (discount > 0) {
      return { text: `-${discount}%`, className: "bg-[var(--gold)] text-background" };
    }
    if (product.isNew) {
      return { text: "NOVA", className: "bg-[var(--gold)] text-background" };
    }
    if (product.isRetro) {
      return { text: "RETRÔ", className: "bg-background/90 text-[var(--gold)] border border-[var(--gold)]/30" };
    }
    if (product.isBestSeller) {
      return { text: "LIMITADA", className: "bg-[var(--gold-dark)] text-white" };
    }
    return null;
  };

  const badge = getBadge();

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/produto/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#0e1010] group">
          {!imgError ? (
            <>
              <LazyImage
                src={product.images[0] || FALLBACK_IMAGE}
                alt={product.name}
                width={450}
                height={600}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-[600ms] ease-out ${
                  isHovered && product.images[1] && !secondImgError
                    ? "opacity-0 scale-[1.03]"
                    : "scale-100"
                }`}
                onError={() => setImgError(true)}
              />
              {product.images[1] && !secondImgError && (
                <LazyImage
                  src={product.images[1]}
                  alt={product.name}
                  width={450}
                  height={600}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-[600ms] ease-out ${
                    isHovered ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]"
                  }`}
                  onError={() => setSecondImgError(true)}
                />
              )}
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#0e1010] p-6">
              <svg viewBox="0 0 120 130" className="h-24 w-24 text-[var(--gold)]/20" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M20 20 L45 10 Q60 25 75 10 L100 20 L110 45 L90 55 L90 120 L30 120 L30 55 L10 45 Z" fill="currentColor" fillOpacity="0.05" />
              </svg>
              <div className="text-center">
                <p className="font-display text-base text-foreground/50">{product.club}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/50 mt-1">{product.year}</p>
              </div>
            </div>
          )}

          {badge && (
            <span className={`absolute left-4 top-4 z-10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] ${badge.className}`}>
              {badge.text}
            </span>
          )}

          <button
            aria-label="Favoritar"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsFavorited(!isFavorited); }}
            className="absolute right-4 top-4 z-10 p-2 text-muted-foreground/40 transition-all duration-300 hover:text-[var(--gold)]"
          >
            <Heart className={`h-4 w-4 ${isFavorited ? "fill-[var(--gold)] text-[var(--gold)]" : ""}`} />
          </button>

          <div className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-500 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
            <div className="flex gap-2">
              <Link to={`/produto/${product.slug}`} className="flex-1 flex items-center justify-center gap-2 bg-background/80 backdrop-blur-md py-2.5 text-[10px] uppercase tracking-[0.15em] text-foreground transition-colors duration-300 hover:bg-[var(--gold)] hover:text-background">
                <Eye className="h-3.5 w-3.5" />
                Visualizar
              </Link>
              <button onClick={handleAddToCart} className="flex items-center justify-center bg-[var(--gold)] py-2.5 px-4 text-background transition-all duration-300 hover:bg-[var(--gold-light)]" aria-label="Adicionar ao carrinho">
                <ShoppingBag className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>

      <Link to={`/produto/${product.slug}`} className="block mt-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">{product.club}</p>
          <p className="text-[10px] text-muted-foreground/50">{product.year}</p>
        </div>
        <h3 className="font-display text-base text-foreground/90 leading-snug line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-1.5 mt-2.5">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`h-3 w-3 ${star <= Math.round(product.rating) ? "fill-[var(--gold)] text-[var(--gold)]" : "fill-muted-foreground/10 text-muted-foreground/10"}`} />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground/40">({product.reviewCount})</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          {product.promotionalPrice ? (
            <>
              <span className="text-xs text-muted-foreground/40 line-through">R$ {product.price.toFixed(2)}</span>
              <span className="text-base font-semibold text-[var(--gold)]">R$ {product.promotionalPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-base font-semibold text-[var(--gold)]">R$ {product.price.toFixed(2)}</span>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground/40 mt-1">ou 12x de R$ {installmentPrice.toFixed(2)}</p>
      </Link>

      <div className="mt-4">
        <button onClick={handleAddToCart} className="w-full py-3 border border-border/30 text-[10px] uppercase tracking-[0.2em] text-foreground/70 transition-all duration-300 hover:border-[var(--gold)]/40 hover:text-[var(--gold)] active:scale-[0.99]">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
