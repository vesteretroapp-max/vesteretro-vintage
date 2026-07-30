import { ProductCardSkeleton } from "@/components/ui/ProductCardSkeleton";

interface SkeletonShowcaseProps {
  count?: number;
}

export function SkeletonShowcase({ count = 5 }: SkeletonShowcaseProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-vr">
        {/* Header skeleton */}
        <div className="flex items-end justify-between gap-4 mb-14">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-white/5" />
              <div className="h-2.5 w-24 rounded bg-white/5" />
            </div>
            <div className="h-8 w-48 rounded bg-white/5" />
            <div className="h-3 w-64 rounded bg-white/3" />
          </div>
          <div className="h-3 w-20 rounded bg-white/5 hidden sm:block" />
        </div>

        {/* Cards skeleton — horizontal scroll layout */}
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: count }).map((_, i) => (
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
