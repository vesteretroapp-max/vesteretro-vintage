import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalCarouselProps {
  children: React.ReactNode[];
  /** Items visible per breakpoint */
  show?: { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  /** Gap between items in px */
  gap?: number;
  /** Autoplay interval in ms (0 = disabled) */
  autoPlay?: number;
  /** Transition duration in ms */
  transition?: number;
  /** Whether to loop infinitely */
  loop?: boolean;
  /** Class applied to each item wrapper */
  itemClassName?: string;
}

const DEFAULT_SHOW = {
  base: 1.3,
  sm: 2.3,
  md: 3.3,
  lg: 4.3,
  xl: 5.3,
};

const TRANSITION_DEFAULT = 700;
const AUTOPLAY_DEFAULT = 3500;

export function HorizontalCarousel({
  children,
  show: showProp,
  gap = 16,
  autoPlay = AUTOPLAY_DEFAULT,
  transition = TRANSITION_DEFAULT,
  loop = true,
  itemClassName = "",
}: HorizontalCarouselProps) {
  const show = { ...DEFAULT_SHOW, ...showProp };
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );
  const totalItems = children.length;

  // Respect prefers-reduced-motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Calculate visible count based on viewport
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
  const maxIndex = Math.max(0, totalItems - floorVisible);

  // For infinite loop: we prepend last N items and append first N items
  const cloneCount = loop ? Math.min(floorVisible, totalItems) : 0;

  const slides = useMemo(() => {
    if (!loop || totalItems === 0) return children;
    // Clone: [...lastN, ...original, ...firstN]
    const lastN = children.slice(totalItems - cloneCount);
    const firstN = children.slice(0, cloneCount);
    return [...lastN, ...children, ...firstN];
  }, [children, children.length, loop, cloneCount, totalItems]);

  // The "real" index in the cloned array (offset by cloneCount)
  const slideIndex = loop ? currentIndex + cloneCount : currentIndex;

  // Calculate translation offset
  const getTranslateX = useCallback(() => {
    if (!containerRef.current) return 0;
    const containerWidth = containerRef.current.offsetWidth;
    const itemWidth = (containerWidth - gap * (visibleCount - 1)) / visibleCount;
    return -(slideIndex * (itemWidth + gap));
  }, [slideIndex, visibleCount, gap]);

  // Go to a specific "real" index (0-based among original items)
  const goTo = useCallback(
    (index: number, instant = false) => {
      if (isTransitioning && !instant) return;
      const clamped = loop
        ? ((index % totalItems) + totalItems) % totalItems
        : Math.max(0, Math.min(index, maxIndex));

      if (instant) {
        setIsTransitioning(false);
        setCurrentIndex(clamped);
        return;
      }

      setIsTransitioning(true);
      setCurrentIndex(clamped);
      setTimeout(() => setIsTransitioning(false), transition);
    },
    [isTransitioning, loop, totalItems, maxIndex, transition],
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  // Snap back after clone transition finishes (for infinite loop)
  useEffect(() => {
    if (!loop || totalItems === 0) return;
    // When at the "end" clone (showing first items), snap back instantly
    if (currentIndex >= totalItems) {
      const timer = setTimeout(() => {
        goTo(0, true);
      }, transition);
      return () => clearTimeout(timer);
    }
    // When at the "start" clone (showing last items), snap back instantly
    if (currentIndex < 0) {
      const timer = setTimeout(() => {
        goTo(totalItems + currentIndex, true);
      }, transition);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, loop, totalItems, transition, goTo]);

  // Autoplay
  useEffect(() => {
    if (!autoPlay || isHovered || prefersReducedMotion || totalItems <= floorVisible)
      return;
    const timer = setInterval(goNext, autoPlay);
    return () => clearInterval(timer);
  }, [autoPlay, isHovered, prefersReducedMotion, goNext, totalItems, floorVisible]);

  // Window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Touch/swipe
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchDelta = useRef(0);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      touchDelta.current = 0;
      setIsHovered(true); // pause autoplay during touch
    },
    [],
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;
    // Only horizontal swipe
    if (Math.abs(dx) > Math.abs(dy)) {
      touchDelta.current = dx;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const threshold = 50;
    if (touchDelta.current < -threshold) {
      goNext();
    } else if (touchDelta.current > threshold) {
      goPrev();
    }
    touchStart.current = null;
    touchDelta.current = 0;
    // Resume autoplay after a delay
    setTimeout(() => setIsHovered(false), 2000);
  }, [goNext, goPrev]);

  if (totalItems === 0) return null;

  // Calculate item width for inline style
  const itemWidthPercent = 100 / visibleCount;
  const itemGapStyle = `${gap}px`;

  // For dots: show based on original items
  const dotCount = Math.min(totalItems, Math.ceil(visibleCount) + 2);
  const activeDot = loop
    ? ((currentIndex % totalItems) + totalItems) % totalItems
    : currentIndex;

  const translateX = getTranslateX();

  return (
    <div
      ref={containerRef}
      className="relative group/carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
          ref={trackRef}
          className="flex"
          style={{
            gap: itemGapStyle,
            transform: `translateX(${translateX}px)`,
            transition: isTransitioning
              ? `transform ${transition}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
              : "none",
          }}
        >
          {slides.map((child, i) => (
            <div
              key={i}
              className={`shrink-0 ${itemClassName}`}
              style={{
                width: `calc((100% - ${gap * (visibleCount - 1)}px) / ${visibleCount})`,
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

      {/* Prev arrow — desktop only, visible on hover */}
      {loop || currentIndex > 0 ? (
        <button
          onClick={goPrev}
          aria-label="Anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-background/80 border border-border text-foreground backdrop-blur-sm transition-all opacity-0 group-hover/carousel:opacity-100 hover:border-[var(--gold)] hover:text-[var(--gold)] shadow-lg hover:scale-105"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      ) : null}

      {/* Next arrow — desktop only, visible on hover */}
      {loop || currentIndex < maxIndex ? (
        <button
          onClick={goNext}
          aria-label="Próximo"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-background/80 border border-border text-foreground backdrop-blur-sm transition-all opacity-0 group-hover/carousel:opacity-100 hover:border-[var(--gold)] hover:text-[var(--gold)] shadow-lg hover:scale-105"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      ) : null}

      {/* Dots indicator — visible on all viewports */}
      {totalItems > floorVisible && (
        <div className="flex items-center justify-center gap-2 mt-5">
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
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
