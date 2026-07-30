import { useState } from "react";
import { Link } from "react-router";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  // Determine badge type
  const getBadge = () => {
    if (discount > 0) {
      return { text: `-${discount}%`, color: "bg-red-500 text-white" };
    }
    if (product.isNew) {
      return { text: "NOVA", color: "bg-[var(--gold)] text-background" };
    }
    if (product.isRetro) {
      return { text: "RETRÔ", color: "bg-background/80 text-[var(--gold)] border border-[var(--border-gold)]" };
    }
    if (product.isBestSeller) {
      return { text: "LIMITADA", color: "bg-[var(--gold-dark)] text-white" };
    }
    return null;
  };

  const badge = getBadge();

  return (
    <div
      className="card-premium group relative flex flex-col overflow-hidden rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {badge && (
        <span
          className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm ${badge.color}`}
        >
          {badge.text}
        </span>
      )}

      {/* Favorite button */}
      <button
        aria-label="Favoritar"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsFavorited(!isFavorited);
        }}
        className="absolute right-3 top-3 z-10 rounded-full bg-background/70 p-2.5 text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:text-[var(--gold)] hover:bg-background/90 hover:scale-110"
      >
        <Heart
          className={`h-4 w-4 transition-all duration-300 ${
            isFavorited ? "fill-[var(--gold)] text-[var(--gold)] scale-110" : ""
          }`}
        />
      </button>

      {/* Image */}
      <Link to={`/produto/${product.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
          {!imgError ? (
            <>
              {/* Primary Image */}
              <img
                src={product.images[0]}
                alt={product.name}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                  isHovered && product.images[1] ? "opacity-0 scale-105" : "scale-100"
                }`}
                loading="lazy"
                onError={() => setImgError(true)}
              />
              {/* Secondary Image on hover */}
              {product.images[1] && (
                <img
                  src={product.images[1]}
                  alt={product.name}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                    isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                  loading="lazy"
                />
              )}
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-surface-2 via-surface to-background p-6">
              <svg
                viewBox="0 0 120 130"
                className="h-28 w-28 text-[var(--gold)]/40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M20 20 L45 10 Q60 25 75 10 L100 20 L110 45 L90 55 L90 120 L30 120 L30 55 L10 45 Z"
                  fill="currentColor"
                  fillOpacity="0.08"
                />
              </svg>
              <div className="text-center">
                <p className="font-display text-lg text-foreground/70">
                  {product.club}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]/70">
                  {product.year}
                </p>
              </div>
            </div>
          )}

          {/* Quick Actions Overlay */}
          <div
            className={`absolute inset-x-0 bottom-0 p-3 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex gap-2">
              <Link
                to={`/produto/${product.slug}`}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-background/90 backdrop-blur-sm py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-[var(--gold)] hover:text-background"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Visualizar</span>
              </Link>
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center rounded-lg bg-[var(--gold)] py-2.5 px-4 text-background transition-all hover:bg-[var(--gold-light)] hover:shadow-[0_0_20px_rgba(214,166,50,0.3)]"
                aria-label="Adicionar ao carrinho"
              >
                <ShoppingBag className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Info */}
      <Link to={`/produto/${product.slug}`} className="flex flex-1 flex-col p-4">
        {/* Club & Year */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {product.club}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {product.year}
          </p>
        </div>

        {/* Name */}
        <h3 className="mt-1.5 line-clamp-2 font-sans text-sm font-medium text-foreground leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= Math.round(product.rating)
                    ? "fill-[var(--gold)] text-[var(--gold)]"
                    : "fill-muted-foreground/20 text-muted-foreground/20"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="mt-3">
          {product.promotionalPrice ? (
            <div>
              <p className="text-xs text-muted-foreground line-through">
                R$ {product.price.toFixed(2)}
              </p>
              <p className="text-lg font-bold text-[var(--gold)]">
                R$ {product.promotionalPrice.toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="text-lg font-bold text-[var(--gold)]">
              R$ {product.price.toFixed(2)}
            </p>
          )}
          <p className="text-[11px] text-muted-foreground">
            ou 12x de R$ {installmentPrice.toFixed(2)} sem juros
          </p>
        </div>
      </Link>

      {/* Buy Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className="w-full rounded-lg bg-[var(--gold)] py-3 text-sm font-bold uppercase tracking-[0.15em] text-background transition-all duration-300 hover:bg-[var(--gold-light)] hover:shadow-[0_0_25px_rgba(214,166,50,0.25)] active:scale-[0.98]"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
