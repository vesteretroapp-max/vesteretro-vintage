import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalCarouselProps {
  children: React.ReactNode[];
  /** How many items to show at each breakpoint */
  show?: { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  /** Gap between items in pixels */
  gap?: number;
  /** Enable autoplay in ms (0 = disabled) */
  autoPlay?: number;
  /** Whether to loop infinitely */
  loop?: boolean;
  /** Class applied to each item wrapper */
  itemClassName?: string;
}

const DEFAULT_SHOW = { base: 1.3, sm: 2.3, md: 3.3, lg: 4.3, xl: 5.3 };

export function HorizontalCarousel({
  children,
  show: showProp,
  gap = 16,
  autoPlay = 0,
  loop = false,
  itemClassName = "",
}: HorizontalCarouselProps) {
  const show = { ...DEFAULT_SHOW, ...showProp };
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const totalItems = children.length;

  // Calculate how many items are visible based on viewport
  const getVisibleCount = useCallback(() => {
    if (typeof window === "undefined") return show.xl!;
    const w = window.innerWidth;
    if (w >= 1280) return show.xl!;
    if (w >= 1024) return show.lg!;
    if (w >= 768) return show.md!;
    if (w >= 640) return show.sm!;
    return show.base!;
  }, [show]);

  const maxIndex = Math.max(0, totalItems - Math.floor(getVisibleCount()));

  const scrollTo = useCallback(
    (index: number) => {
      if (!trackRef.current) return;
      const clamped = Math.max(0, Math.min(index, maxIndex));
      setCurrentIndex(clamped);

      const itemWidth =
        trackRef.current.scrollWidth / totalItems;
      const offset = clamped * (itemWidth + gap);
      trackRef.current.scrollTo({ left: offset, behavior: "smooth" });
    },
    [maxIndex, totalItems, gap],
  );

  const goNext = useCallback(() => {
    if (currentIndex < maxIndex) {
      scrollTo(currentIndex + 1);
    } else if (loop) {
      scrollTo(0);
    }
  }, [currentIndex, maxIndex, loop, scrollTo]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      scrollTo(currentIndex - 1);
    } else if (loop) {
      scrollTo(maxIndex);
    }
  }, [currentIndex, maxIndex, loop, scrollTo]);

  // Update canPrev / canNext
  useEffect(() => {
    setCanPrev(currentIndex > 0 || loop);
    setCanNext(currentIndex < maxIndex || loop);
  }, [currentIndex, maxIndex, loop]);

  // Autoplay
  useEffect(() => {
    if (!autoPlay || isHovered) return;
    const timer = setInterval(goNext, autoPlay);
    return () => clearInterval(timer);
  }, [autoPlay, isHovered, goNext]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    },
    [goPrev, goNext],
  );

  // Recalculate on resize
  useEffect(() => {
    const recalc = () => {
      const vis = getVisibleCount();
      const newMax = Math.max(0, totalItems - Math.floor(vis));
      if (currentIndex > newMax) {
        scrollTo(newMax);
      }
    };
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [getVisibleCount, totalItems, currentIndex, scrollTo]);

  if (totalItems === 0) return null;

  const itemWidth = `${100 / getVisibleCount()}%`;
  const paddingBottom = `${gap}px`;

  return (
    <div
      className="relative group/carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      role="region"
      aria-roledescription="carrossel"
      tabIndex={0}
    >
      {/* Track */}
      <div
        ref={trackRef}
        className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory"
        style={{ gap: `${gap}px`, scrollSnapType: "x mandatory" }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className={`shrink-0 snap-start ${itemClassName}`}
            style={{
              width: itemWidth,
              minWidth: "220px",
              paddingBottom,
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${totalItems}`}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Prev arrow */}
      {canPrev && (
        <button
          onClick={goPrev}
          aria-label="Anterior"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-background/80 border border-border text-foreground backdrop-blur transition-all opacity-0 group-hover/carousel:opacity-100 hover:border-[var(--gold)] hover:text-[var(--gold)] shadow-lg"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Next arrow */}
      {canNext && (
        <button
          onClick={goNext}
          aria-label="Próximo"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-background/80 border border-border text-foreground backdrop-blur transition-all opacity-0 group-hover/carousel:opacity-100 hover:border-[var(--gold)] hover:text-[var(--gold)] shadow-lg"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Dots indicator (only if items exceed visible count) */}
      {totalItems > Math.ceil(getVisibleCount()) && (
        <div className="flex items-center justify-center gap-1.5 mt-4 sm:hidden">
          {Array.from({ length: Math.min(totalItems, Math.ceil(getVisibleCount()) + 1) }).map(
            (_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Ir para slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIndex
                    ? "w-5 bg-[var(--gold)]"
                    : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
