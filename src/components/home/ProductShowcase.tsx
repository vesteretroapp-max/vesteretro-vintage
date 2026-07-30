import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { HorizontalCarousel } from "@/components/HorizontalCarousel";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/products";

interface ProductShowcaseProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  href?: string;
  linkText?: string;
  products: Product[];
  showCount?: number;
}

export function ProductShowcase({
  eyebrow,
  title,
  subtitle,
  href,
  linkText = "Ver todos",
  products,
  showCount,
}: ProductShowcaseProps) {
  const displayProducts = showCount ? products.slice(0, showCount) : products;

  if (displayProducts.length === 0) return null;

  return (
    <section className="relative py-12 md:py-16">
      <div className="container-vr">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] font-semibold">
              {eyebrow}
            </p>
            <h2 className="mt-2 font-display text-2xl md:text-3xl lg:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
          {href && (
            <Link
              to={href}
              className="hidden shrink-0 items-center gap-2 text-sm text-[var(--gold)] hover:underline sm:inline-flex group"
            >
              {linkText}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Product Carousel */}
        <HorizontalCarousel
          autoPlay={4000}
          transition={700}
          loop={displayProducts.length > 4}
          show={{ base: 1.3, sm: 2.3, md: 3.3, lg: 4.3, xl: 5.3 }}
        >
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </HorizontalCarousel>

        {/* Mobile link */}
        {href && (
          <div className="mt-6 text-center sm:hidden">
            <Link
              to={href}
              className="inline-flex items-center gap-2 text-sm text-[var(--gold)] hover:underline group"
            >
              {linkText}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
