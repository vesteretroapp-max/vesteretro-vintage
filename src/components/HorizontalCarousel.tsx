import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalCarouselProps {
  children: React.ReactNode[];
  show?: { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number;
  autoPlay?: number;
  transition?: number;
  loop?: boolean;
  itemClassName?: string;
}

const DEFAULT_SHOW = { base: 1.3, sm: 2.3, md: 3.3, lg: 4.3, xl: 5.3 };

export function HorizontalCarousel({
  children,
  show: showProp,
  gap = 16,
  autoPlay = 3500,
  transition = 700,
  loop = true,
  itemClassName = "",
}: HorizontalCarouselProps) {
  const show = { ...DEFAULT_SHOW, ...showProp };
  const containerRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );
  const [isPaused, setIsPaused] = useState(false);
  const [position, setPosition] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);

  const totalItems = children.length;

  // Visible count
  const getVisibleCount = useCallback(() => {
    const w = windowWidth;
    if (w >= 1280) return show.xl!;
    if (w >= 1024) return show.lg!;
    if (w >= 768) return show.md!;
    if (w >= 640) return show.sm!;
    return show.base!;
  }, [show, windowWidth]);

  const visibleCount = getVisibleCount();
  const floorVisible = Math.floor(visibleCount);

  // Clone count for infinite loop
  const cloneCount = loop ? Math.min(floorVisible, totalItems) : 0;

  // All slides: [lastN, ...original, firstN]
  const slides = useMemo(() => {
    if (!loop || totalItems === 0) return [...children];
    const lastN = children.slice(totalItems - cloneCount);
    const firstN = children.slice(0, cloneCount);
    return [...lastN, ...children, ...firstN];
  }, [children, loop, cloneCount, totalItems]);

  const totalSlides = slides.length;

  // Item width calculation
  const itemWidth = useMemo(() => {
    if (!containerWidth || !visibleCount) return 0;
    return (containerWidth - gap * (visibleCount - 1)) / visibleCount;
  }, [containerWidth, visibleCount, gap]);

  // Current real index (0-based among original items)
  const realIndex = loop
    ? ((position - cloneCount) % totalItems + totalItems) % totalItems
    : Math.max(0, Math.min(position, totalItems - floorVisible));

  // Measure container
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Wrap-around: after transition, instantly snap to equivalent real position
  useEffect(() => {
    if (!loop || totalItems === 0 || !isAnimating) return;

    // Went past last clone → snap to first real position
    if (position >= totalItems + cloneCount) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPosition(cloneCount);
        // Re-enable animation after DOM update
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setIsAnimating(true));
        });
      }, transition);
      return () => clearTimeout(timer);
    }

    // Went before first clone → snap to last real position
    if (position < cloneCount) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPosition(totalItems + cloneCount - 1);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setIsAnimating(true));
        });
      }, transition);
      return () => clearTimeout(timer);
    }
  }, [position, loop, totalItems, cloneCount, transition, isAnimating]);

  // Autoplay — uses functional setState to avoid stale closures
  useEffect(() => {
    if (!autoPlay || isPaused || totalItems <= floorVisible) return;
    if (typeof window === "undefined") return;

    // Respect prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const timer = window.setInterval(() => {
      setPosition((prev) => prev + 1);
    }, autoPlay);

    return () => window.clearInterval(timer);
  }, [autoPlay, isPaused, totalItems, floorVisible]);

  // Pause on tab hidden
  useEffect(() => {
    if (!autoPlay) return;
    const handleVisibility = () => {
      if (document.hidden) {
        setIsPaused(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [autoPlay]);

  // Resume when tab becomes visible (with small delay)
  useEffect(() => {
    if (!autoPlay) return;
    const handleVisibility = () => {
      if (!document.hidden) {
        setTimeout(() => setIsPaused(false), 500);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [autoPlay]);

  // Navigation
  const goNext = useCallback(() => {
    setPosition((prev) => prev + 1);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 2000);
  }, []);

  const goPrev = useCallback(() => {
    setPosition((prev) => prev - 1);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 2000);
  }, []);

  const goToReal = useCallback(
    (index: number) => {
      setPosition(cloneCount + index);
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 2000);
    },
    [cloneCount],
  );

  // Keyboard
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
    },
    [goPrev, goNext],
  );

  // Touch/swipe
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchDelta = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchDelta.current = 0;
    setIsPaused(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      touchDelta.current = dx;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const threshold = 50;
    if (touchDelta.current < -threshold) {
      setPosition((prev) => prev + 1);
    } else if (touchDelta.current > threshold) {
      setPosition((prev) => prev - 1);
    }
    touchStart.current = null;
    touchDelta.current = 0;
    setTimeout(() => setIsPaused(false), 3000);
  }, []);

  if (totalItems === 0) return null;

  // Calculate translateX
  const translateX = -(position * (itemWidth + gap));

  // Dots
  const dotCount = loop
    ? Math.min(totalItems, Math.ceil(visibleCount) + 2)
    : Math.min(totalItems, Math.ceil(visibleCount) + 1);
  const activeDot = realIndex;

  // Arrow visibility
  const canGoPrev = loop || position > 0;
  const canGoNext = loop || position < totalItems - floorVisible;

  return (
    <div
      ref={containerRef}
      className="relative group/carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carrossel"
      tabIndex={0}
      aria-label="Carrossel de produtos"
    >
      {/* Track */}
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            gap: `${gap}px`,
            transform: `translateX(${translateX}px)`,
            transition: isAnimating
              ? `transform ${transition}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
              : "none",
          }}
        >
          {slides.map((child, i) => (
            <div
              key={i}
              className={`shrink-0 ${itemClassName}`}
              style={{
                width: itemWidth > 0 ? `${itemWidth}px` : `calc((100% - ${gap * (visibleCount - 1)}px) / ${visibleCount})`,
                minWidth: "200px",
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${(i % totalItems) + 1} de ${totalItems}`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Prev arrow */}
      {canGoPrev && (
        <button
          onClick={goPrev}
          aria-label="Anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-background/80 border border-border text-foreground backdrop-blur-sm transition-all opacity-0 group-hover/carousel:opacity-100 hover:border-[var(--gold)] hover:text-[var(--gold)] shadow-lg hover:scale-105"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Next arrow */}
      {canGoNext && (
        <button
          onClick={goNext}
          aria-label="Próximo"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-background/80 border border-border text-foreground backdrop-blur-sm transition-all opacity-0 group-hover/carousel:opacity-100 hover:border-[var(--gold)] hover:text-[var(--gold)] shadow-lg hover:scale-105"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Dots */}
      {totalItems > floorVisible && (
        <div className="flex items-center justify-center gap-2 mt-5">
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToReal(i)}
              aria-label={`Ir para slide ${i + 1}`}
              aria-current={i === activeDot ? "true" : undefined}
              className={`rounded-full transition-all duration-300 ${
                i === activeDot
                  ? "w-6 h-2 bg-[var(--gold)]"
                  : "w-2 h-2 bg-muted-foreground/25 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
