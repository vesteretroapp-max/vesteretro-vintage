// ==================================================
// VESTERETRO — Supabase Storage (Imagens de Produto)
// Utiliza EXCLUSIVAMENTE a API oficial do Supabase Storage.
// ==================================================

import { supabase } from "@/lib/supabase";

/**
 * Bucket público onde ficam as fotos dos produtos/times.
 * O bucket "product-images" deve estar marcado como público
 * no Supabase (Storage → product-images → público).
 */
export const PRODUCT_IMAGES_BUCKET = "product-images";

/**
 * Monta a URL pública de uma imagem de produto a partir do campo
 * `image_path` (caminho relativo, ex.: "corinthians/1994-home/hero.webp.webp").
 *
 * Usa apenas a API oficial do Supabase Storage:
 *   supabase.storage.from("product-images").getPublicUrl(image_path)
 *
 * @param imagePath Caminho relativo da imagem dentro do bucket.
 * @returns URL pública completa ou "" quando não houver caminho/configuração.
 */
export function getProductImageUrl(
  imagePath: string | null | undefined
): string {
  if (!imagePath) return "";
  const { data } = supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(imagePath);
  return data?.publicUrl || "";
}

/**
 * Monta a URL pública a partir de um caminho relativo simples.
 * Usada quando o produto possui image_path herdado de importações
 * (ex.: "corinthians/corinthians-1994-home.webp").
 */
export function getProductImageUrlFromPath(path: string): string {
  return getProductImageUrl(path);
}
