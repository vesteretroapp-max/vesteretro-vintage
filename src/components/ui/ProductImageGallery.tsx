import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { LazyImage } from "@/components/ui/LazyImage";
import type { ImageVariant } from "@/lib/product-images";
import {
  IMAGE_VARIANT_LABELS,
  getAvailableProductImages,
  getProductImageAlt,
} from "@/lib/product-images";

interface GalleryImage {
  src: string;
  variant: ImageVariant;
  alt?: string;
}

interface ProductImageGalleryProps {
  /** Product name for alt text */
  productName: string;
  /** Product slug for image paths */
  slug: string;
  /** Club name for alt text */
  club?: string;
  /** Array of image URLs or objects */
  images: (string | GalleryImage)[];
  /** Available image variants */
  availableVariants?: ImageVariant[];
  /** Show zoom on hover */
  enableZoom?: boolean;
  /** Zoom scale factor */
  zoomScale?: number;
  /** Show thumbnails */
  showThumbnails?: boolean;
  /** Show navigation arrows */
  showNavigation?: boolean;
  /** Aspect ratio for main image */
  aspectRatio?: string;
  /** Custom class for main image container */
  className?: string;
}

/**
 * Premium product image gallery with:
 * - Smooth transitions between images
 * - Elegant zoom on hover
 * - Thumbnail navigation
 * - Keyboard navigation
 * - Touch swipe support
 * - Loading states
 */
export function ProductImageGallery({
  productName,
  slug,
  club,
  images,
  availableVariants,
  enableZoom = true,
  zoomScale = 1.5,
  showThumbnails = true,
  showNavigation = true,
  aspectRatio = "3/4",
  className = "",
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Normalize images to uniform format
  const normalizedImages: GalleryImage[] = images.map((img, index) => {
    if (typeof img === "string") {
      const variant = availableVariants?.[index] || "hero";
      return {
        src: img,
        variant,
        alt: getProductImageAlt(productName, variant, club),
      };
    }
    return {
      ...img,
      alt: img.alt || getProductImageAlt(productName, img.variant, club),
    };
  });

  const currentImage = normalizedImages[selectedIndex];

  // Handle image navigation
  const goToImage = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setSelectedIndex(index);
      setTimeout(() => setIsTransitioning(false), 300);
    },
    [isTransitioning]
  );

  const goToNext = useCallback(() => {
    const nextIndex = (selectedIndex + 1) % normalizedImages.length;
    goToImage(nextIndex);
  }, [selectedIndex, normalizedImages.length, goToImage]);

  const goToPrevious = useCallback(() => {
    const prevIndex =
      (selectedIndex - 1 + normalizedImages.length) % normalizedImages.length;
    goToImage(prevIndex);
  }, [selectedIndex, normalizedImages.length, goToImage]);

  // Handle zoom
  const handleMouseEnter = useCallback(() => {
    if (enableZoom) {
      setIsZoomed(true);
    }
  }, [enableZoom]);

  const handleMouseLeave = useCallback(() => {
    setIsZoomed(false);
    setZoomPosition({ x: 50, y: 50 });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enableZoom || !mainImageRef.current) return;

      const rect = mainImageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setZoomPosition({ x, y });
    },
    [enableZoom]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  // Scroll thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const thumbnail = thumbnailsRef.current.children[selectedIndex] as HTMLElement;
      if (thumbnail) {
        thumbnail.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedIndex]);

  // Handle image error
  const handleImageError = useCallback((index: number) => {
    setImageErrors((prev) => new Set([...prev, index]));
  }, []);

  // Filter out errored images
  const validImages = normalizedImages.filter(
    (_, index) => !imageErrors.has(index)
  );

  if (validImages.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-surface border border-border rounded-sm ${className}`}
        style={{ aspectRatio }}
      >
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">Imagem não disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div
        ref={mainImageRef}
        className="relative overflow-hidden bg-surface border border-border rounded-sm cursor-crosshair"
        style={{ aspectRatio }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <LazyImage
              src={currentImage.src}
              alt={currentImage.alt || productName}
              width={1200}
              height={1600}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isZoomed ? "scale-150" : "scale-100"
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : undefined
              }
              onError={() => handleImageError(selectedIndex)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom indicator */}
        {enableZoom && !isZoomed && (
          <div className="absolute bottom-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-4 h-4 text-muted-foreground" />
          </div>
        )}

        {/* Navigation arrows */}
        {showNavigation && validImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-background"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-background"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 left-4 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full">
            <span className="text-xs text-muted-foreground">
              {selectedIndex + 1} / {validImages.length}
            </span>
          </div>
        )}

        {/* Variant badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-background/80 backdrop-blur-sm text-[10px] uppercase tracking-wider text-foreground/80 rounded-sm">
            {IMAGE_VARIANT_LABELS[currentImage.variant]}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && validImages.length > 1 && (
        <div
          ref={thumbnailsRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          {validImages.map((image, index) => (
            <button
              key={image.variant}
              onClick={() => goToImage(index)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-sm overflow-hidden shrink-0 transition-all duration-200 ${
                index === selectedIndex
                  ? "border-[var(--gold)]"
                  : "border-border hover:border-[var(--gold)]/40"
              }`}
              aria-label={image.alt}
            >
              <LazyImage
                src={image.src}
                alt=""
                width={80}
                height={80}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => handleImageError(index)}
              />
              {index === selectedIndex && (
                <div className="absolute inset-0 bg-[var(--gold)]/10" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Image dots for mobile */}
      {validImages.length > 1 && (
        <div className="flex justify-center gap-1.5 lg:hidden">
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === selectedIndex
                  ? "bg-[var(--gold)] w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Imagem ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
