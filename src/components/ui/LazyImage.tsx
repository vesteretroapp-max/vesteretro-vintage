import { useRef, useState, useEffect, ImgHTMLAttributes } from "react";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Append WebP/AVIF auto-format to supported CDN URLs */
  autoFormat?: boolean;
}

/**
 * Optimized image component:
 * - IntersectionObserver lazy loading
 * - decoding="async" for non-blocking decode
 * - Auto WebP/AVIF for Unsplash/Picsum URLs
 * - Proper width/height to prevent CLS
 * - Smooth fade-in on load
 */
export function LazyImage({
  src,
  alt,
  width,
  height,
  autoFormat = true,
  className = "",
  ...props
}: LazyImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Optimize CDN URLs for modern formats
  const optimizedSrc = (() => {
    if (!autoFormat || !src) return src;
    // Unsplash: append &fmt=auto
    if (src.includes("unsplash.com")) {
      const separator = src.includes("?") ? "&" : "?";
      return `${src}${separator}fmt=auto&q=80&w=800`;
    }
    // Picsum: already optimized, just limit size
    if (src.includes("picsum.photos")) {
      return src.replace(/\/\d+\/\d+$/, "/600/800");
    }
    return src;
  })();

  return (
    <img
      ref={ref}
      src={isVisible ? optimizedSrc : undefined}
      alt={alt}
      width={width}
      height={height}
      decoding="async"
      loading="lazy"
      className={`transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
      onLoad={() => setIsLoaded(true)}
      {...props}
    />
  );
}
