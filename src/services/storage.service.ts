// ==================================================
// VESTERETRO — Storage Service
// Funções para upload de imagens no Supabase Storage
// ==================================================

import { supabase } from "@/lib/supabase";
import type { StorageBucket, UploadResult } from "@/types/supabase";

// ==================================================
// BUCKETS DISPONÍVEIS
// ==================================================
const BUCKETS = {
  products: "products",
  avatars: "avatars",
  banners: "banners",
  reviews: "reviews",
} as const;

// ==================================================
// UPLOAD DE IMAGEM
// ==================================================
export async function uploadImage(
  bucket: StorageBucket,
  file: File,
  path: string
): Promise<UploadResult> {
  try {
    // Validar tipo de arquivo
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return {
        path: "",
        url: "",
        error: "Tipo de arquivo não permitido. Use JPG, PNG, WebP ou AVIF.",
      };
    }

    // Validar tamanho (máx 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        path: "",
        url: "",
        error: "Arquivo muito grande. Tamanho máximo: 5MB.",
      };
    }

    // Upload
    const { data, error } = await supabase.storage
      .from(BUCKETS[bucket])
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return {
        path: "",
        url: "",
        error: "Não foi possível fazer o upload da imagem.",
      };
    }

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from(BUCKETS[bucket])
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: urlData.publicUrl,
      error: null,
    };
  } catch {
    return {
      path: "",
      url: "",
      error: "Erro de conexão. Verifique sua internet e tente novamente.",
    };
  }
}

// ==================================================
// REMOVER IMAGEM
// ==================================================
export async function removeImage(
  bucket: StorageBucket,
  path: string
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.storage
      .from(BUCKETS[bucket])
      .remove([path]);

    if (error) {
      return { error: "Não foi possível remover a imagem." };
    }

    return { error: null };
  } catch {
    return { error: "Erro de conexão. Tente novamente." };
  }
}

// ==================================================
// LISTAR IMAGENS
// ==================================================
export async function listImages(
  bucket: StorageBucket,
  folder?: string
): Promise<{ data: Array<{ name: string; id: string | null }>; error: string | null }> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKETS[bucket])
      .list(folder || "", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      return { data: [], error: "Não foi possível listar as imagens." };
    }

    return { data: data || [], error: null };
  } catch {
    return { data: [], error: "Erro de conexão. Tente novamente." };
  }
}

// ==================================================
// OBTER URL PÚBLICA
// ==================================================
export function getPublicUrl(
  bucket: StorageBucket,
  path: string
): string {
  const { data } = supabase.storage
    .from(BUCKETS[bucket])
    .getPublicUrl(path);

  return data.publicUrl;
}

// ==================================================
// UPLOAD DE AVATAR
// ==================================================
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<UploadResult> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `avatars/${userId}.${ext}`;
  return uploadImage("avatars", file, path);
}

// ==================================================
// UPLOAD DE IMAGEM DE PRODUTO
// ==================================================
export async function uploadProductImage(
  productId: string,
  file: File,
  index: number = 0
): Promise<UploadResult> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `products/${productId}/${index}.${ext}`;
  return uploadImage("products", file, path);
}

// ==================================================
// UPLOAD DE BANNER
// ==================================================
export async function uploadBanner(
  bannerId: string,
  file: File,
  isMobile: boolean = false
): Promise<UploadResult> {
  const ext = file.name.split(".").pop() || "jpg";
  const suffix = isMobile ? "mobile" : "desktop";
  const path = `banners/${bannerId}_${suffix}.${ext}`;
  return uploadImage("banners", file, path);
}

// ==================================================
// COMPRESSÃO DE IMAGEM (CLIENT-SIDE)
// ==================================================
export function compressImage(
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.85
): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}
