"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

interface SmartImageProps {
  src?: string | null;
  alt: string;
  /** Ukuran render sebenarnya (hint untuk srcset), mis. "(min-width:1024px) 25vw, 50vw" */
  sizes: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
}

/**
 * Apakah URL aman dioptimasi oleh next/image (host sudah terdaftar di next.config.ts).
 * Host lain (URL bebas yang diinput admin) otomatis fallback ke <img> biasa agar tidak error.
 */
function canOptimize(src: string): boolean {
  if (src.startsWith("data:") || src.startsWith("blob:")) return false;
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const u = new URL(src);
    return u.protocol === "https:" && u.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

/**
 * Pengganti <img> untuk wadah ber-posisi (relative/absolute) dengan ukuran sudah ditentukan.
 * Memakai next/image mode `fill` => resize otomatis, format WebP/AVIF, lazy loading, cache panjang.
 * Parent HARUS memiliki `position: relative` (atau absolute/fixed).
 */
export function SmartImage({ src, alt, sizes, className, style, priority }: SmartImageProps) {
  if (!src) return null;

  if (canOptimize(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
        style={style}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
      style={style}
    />
  );
}
