import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { HorizontalCarousel } from "@/components/HorizontalCarousel";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/ProductCardSkeleton";
import type { Product } from "@/data/products";

interface ProductShowcaseProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  href?: string;
  linkText?: string;
  products: Product[];
  showCount?: number;
  loading?: boolean;
}

export function ProductShowcase({
  eyebrow,
  title,
  subtitle,
  href,
  linkText = "Ver todos",
  products,
  showCount,
  loading = false,
}: ProductShowcaseProps) {
  const displayProducts = showCount ? products.slice(0, showCount) : products;

  // Show skeleton when loading or no products yet
  if (loading || displayProducts.length === 0) {
    return (
      <section className="py-20 md:py-28">
        <div className="container-vr">
          {/* Header skeleton */}
          <div className="flex items-end justify-between gap-4 mb-14">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-white/5" />
                <div className="h-2.5 w-24 rounded bg-white/5 animate-pulse" />
              </div>
              <div className="h-8 w-48 rounded bg-white/5 animate-pulse" />
            </div>
          </div>

          {/* Cards skeleton */}
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0"
                style={{ width: "calc((100% - 64px) / 5)", minWidth: "220px" }}
              >
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28">
      <div className="container-vr">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-14">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-[var(--gold)]/40" />
              <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground/60">
                {eyebrow}
              </p>
            </div>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-muted-foreground/50 max-w-lg">
                {subtitle}
              </p>
            )}
          </div>
          {href && (
            <Link
              to={href}
              className="hidden shrink-0 items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/50 hover:text-[var(--gold)] transition-colors duration-300 sm:inline-flex group"
            >
              {linkText}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Product Carousel */}
        <HorizontalCarousel
          autoPlay={5000}
          transition={800}
          loop={displayProducts.length > 4}
          show={{ base: 1.3, sm: 2.3, md: 3.3, lg: 4.3, xl: 5.3 }}
        >
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </HorizontalCarousel>

        {/* Mobile link */}
        {href && (
          <div className="mt-8 text-center sm:hidden">
            <Link
              to={href}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/50 hover:text-[var(--gold)] transition-colors duration-300 group"
            >
              {linkText}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
