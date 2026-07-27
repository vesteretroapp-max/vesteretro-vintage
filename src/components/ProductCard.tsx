import { useState } from "react";
import { Link } from "react-router";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
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
    <div className="card-premium group relative flex flex-col overflow-hidden rounded-lg">
      {/* Badges */}
      {product.isBestSeller && (
        <span className="absolute left-3 top-3 z-10 rounded-full border border-[var(--gold)]/50 bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--gold)] backdrop-blur">
          Mais vendido
        </span>
      )}
      {discount > 0 && (
        <span className="absolute left-3 top-3 z-10 rounded-full border border-red-500/50 bg-red-500/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur">
          -{discount}%
        </span>
      )}
      {product.isNew && !product.isBestSeller && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--gold)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-background">
          Novo
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
        className="absolute right-3 top-3 z-10 rounded-full bg-background/70 p-2 text-muted-foreground backdrop-blur transition hover:text-[var(--gold)]"
      >
        <Heart
          className={`h-4 w-4 ${
            isFavorited ? "fill-[var(--gold)] text-[var(--gold)]" : ""
          }`}
        />
      </button>

      {/* Image */}
      <Link to={`/produto/${product.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
          {!imgError ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-surface-2 via-surface to-background p-6">
              <svg
                viewBox="0 0 120 130"
                className="h-32 w-32 text-[var(--gold)]/50"
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
        </div>
      </Link>

      {/* Info */}
      <Link to={`/produto/${product.slug}`} className="flex flex-1 flex-col p-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {product.club} · {product.year}
        </p>
        <h3 className="mt-1 line-clamp-2 font-sans text-sm font-medium text-foreground">
          {product.name}
        </h3>
        <div className="mt-3 flex items-end justify-between">
          <div>
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
        </div>
      </Link>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <Link
          to={`/produto/${product.slug}`}
          className="flex-1 rounded-md border border-border py-2 text-center text-xs uppercase tracking-widest text-foreground/90 transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
        >
          Ver detalhes
        </Link>
        <button
          aria-label="Adicionar ao carrinho"
          onClick={handleAddToCart}
          className="rounded-md btn-gold px-3"
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
