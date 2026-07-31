/**
 * Product Image Management System for VesteRetro
 * 
 * This module provides utilities for managing product images with a consistent
 * folder structure and naming convention.
 * 
 * Folder Structure:
 * /public/images/products/{product-slug}/
 *   - hero.webp      (primary image for listings and search)
 *   - front.webp     (front view of the jersey)
 *   - back.webp      (back view of the jersey)
 *   - badge.webp     (club badge close-up)
 *   - fabric.webp    (fabric texture detail)
 *   - collar.webp    (collar detail)
 *   - tag.webp       (brand tag detail)
 *   - lifestyle.webp (lifestyle/styled photo)
 * 
 * Image Specifications:
 * - Format: WebP
 * - Max Width: 1200px
 * - Compression: 82-88%
 * - Aspect Ratio: 3:4 (portrait) for product images
 */

// Image variant types
export type ImageVariant =
  | "hero"
  | "front"
  | "back"
  | "badge"
  | "fabric"
  | "collar"
  | "tag"
  | "lifestyle";

// All available image variants in display order
export const IMAGE_VARIANTS: ImageVariant[] = [
  "hero",
  "front",
  "back",
  "badge",
  "fabric",
  "collar",
  "tag",
  "lifestyle",
];

// Human-readable labels for each variant
export const IMAGE_VARIANT_LABELS: Record<ImageVariant, string> = {
  hero: "Imagem Principal",
  front: "Vista Frontal",
  back: "Vista Traseira",
  badge: "Emblema do Clube",
  fabric: "Detalhe do Tecido",
  collar: "Detalhe da Gola",
  tag: "Etiqueta",
  lifestyle: "Foto Lifestyle",
};

// Product image configuration
export interface ProductImageConfig {
  slug: string;
  basePath?: string;
}

// Product image result
export interface ProductImages {
  hero: string;
  front: string;
  back: string;
  badge: string;
  fabric: string;
  collar: string;
  tag: string;
  lifestyle: string;
}

/**
 * Base path for product images
 */
export const PRODUCT_IMAGES_BASE_PATH = "/images/products";

/**
 * Generate the path to a specific product image
 * 
 * @param slug - Product slug (e.g., "camisa-retro-flamengo-1981-home")
 * @param variant - Image variant (e.g., "hero", "front", "back")
 * @returns Full path to the image
 */
export function getProductImagePath(
  slug: string,
  variant: ImageVariant = "hero"
): string {
  return `${PRODUCT_IMAGES_BASE_PATH}/${slug}/${variant}.webp`;
}

/**
 * Get all image paths for a product
 * 
 * @param slug - Product slug
 * @returns Object with all image paths
 */
export function getProductImages(slug: string): ProductImages {
  return {
    hero: getProductImagePath(slug, "hero"),
    front: getProductImagePath(slug, "front"),
    back: getProductImagePath(slug, "back"),
    badge: getProductImagePath(slug, "badge"),
    fabric: getProductImagePath(slug, "fabric"),
    collar: getProductImagePath(slug, "collar"),
    tag: getProductImagePath(slug, "tag"),
    lifestyle: getProductImagePath(slug, "lifestyle"),
  };
}

/**
 * Get available images for a product (checking which ones exist)
 * 
 * This function returns only the images that have been uploaded.
 * In production, you would check against the database or use
 * a manifest file.
 * 
 * @param slug - Product slug
 * @param availableVariants - Array of variants that exist for this product
 * @returns Array of available image paths with metadata
 */
export function getAvailableProductImages(
  slug: string,
  availableVariants: ImageVariant[] = ["hero"]
): Array<{ variant: ImageVariant; path: string; label: string }> {
  return availableVariants.map((variant) => ({
    variant,
    path: getProductImagePath(slug, variant),
    label: IMAGE_VARIANT_LABELS[variant],
  }));
}

/**
 * Fallback image for products without images
 */
export const FALLBACK_IMAGE = "/images/placeholder-jersey.webp";

/**
 * Get the hero image with fallback
 * 
 * @param slug - Product slug
 * @param hasImages - Whether the product has images uploaded
 * @returns Path to hero image or fallback
 */
export function getHeroImageWithFallback(
  slug: string,
  hasImages: boolean = false
): string {
  if (!hasImages) {
    return FALLBACK_IMAGE;
  }
  return getProductImagePath(slug, "hero");
}

/**
 * Generate srcSet for responsive images
 * 
 * @param slug - Product slug
 * @param variant - Image variant
 * @returns srcSet string for responsive images
 */
export function getProductImageSrcSet(
  slug: string,
  variant: ImageVariant = "hero"
): string {
  const basePath = getProductImagePath(slug, variant);
  // In production, you would have multiple sizes
  // For now, return the base path
  return `${basePath} 1200w`;
}

/**
 * Image loading configuration
 */
export const IMAGE_LOADING_CONFIG = {
  /** Lazy load threshold in pixels */
  rootMargin: "200px 0px",
  /** Priority loading for hero images */
  heroPriority: true,
  /** Default quality for WebP compression */
  quality: 85,
  /** Maximum width in pixels */
  maxWidth: 1200,
} as const;

/**
 * Check if a URL is a product image (internal)
 */
export function isProductImage(url: string): boolean {
  return url.startsWith(PRODUCT_IMAGES_BASE_PATH);
}

/**
 * Get image alt text for SEO
 */
export function getProductImageAlt(
  productName: string,
  variant: ImageVariant,
  club?: string
): string {
  const variantLabel = IMAGE_VARIANT_LABELS[variant];
  if (club) {
    return `${productName} - ${variantLabel} | ${club} | VesteRetro`;
  }
  return `${productName} - ${variantLabel} | VesteRetro`;
}
