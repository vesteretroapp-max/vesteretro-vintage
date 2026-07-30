/**
 * Premium skeleton loader for product cards.
 * Matches exact dimensions of ProductCard to prevent layout shift.
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Image skeleton — matches aspect-[3/4] */}
      <div className="relative aspect-[3/4] bg-[#0e1010] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e1010] via-[#161a1a] to-[#0e1010] animate-shimmer" 
          style={{ 
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s ease-in-out infinite" 
          }} 
        />
        {/* Badge skeleton */}
        <div className="absolute left-4 top-4 h-5 w-14 rounded-sm bg-white/5" />
        {/* Favorite skeleton */}
        <div className="absolute right-4 top-4 h-8 w-8 rounded-full bg-white/5" />
      </div>

      {/* Info skeleton */}
      <div className="mt-5 space-y-3">
        {/* Club + Year */}
        <div className="flex justify-between">
          <div className="h-2.5 w-20 rounded bg-white/5" />
          <div className="h-2.5 w-8 rounded bg-white/5" />
        </div>
        {/* Title */}
        <div className="h-4 w-3/4 rounded bg-white/5" />
        {/* Stars */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-3 w-3 rounded-full bg-white/5" />
          ))}
        </div>
        {/* Price */}
        <div className="h-5 w-24 rounded bg-white/5" />
        <div className="h-2.5 w-32 rounded bg-white/3" />
      </div>

      {/* Button skeleton */}
      <div className="mt-4 h-11 w-full rounded-sm bg-white/5" />
    </div>
  );
}
