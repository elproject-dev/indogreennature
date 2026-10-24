import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import {
  OurProductsSettingsData,
  DEFAULT_OUR_PRODUCTS_SETTINGS,
  OUR_PRODUCTS_SETTINGS_KEY,
  OUR_PRODUCTS_DRAFT_KEY,
  OUR_PRODUCTS_HAS_DRAFT_KEY,
  OUR_PRODUCTS_DB_CONFIG_KEY,
} from "./types"

export function sanitizeOurProductsSettings(raw: any): OurProductsSettingsData {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_OUR_PRODUCTS_SETTINGS }
  return {
    ...DEFAULT_OUR_PRODUCTS_SETTINGS,
    ...raw,
    shopeeSectionTitleColor: raw.shopeeSectionTitleColor || DEFAULT_OUR_PRODUCTS_SETTINGS.shopeeSectionTitleColor,
    shopeeSectionTitleFont: raw.shopeeSectionTitleFont || DEFAULT_OUR_PRODUCTS_SETTINGS.shopeeSectionTitleFont,
    shopeeSectionTitleSize: typeof raw.shopeeSectionTitleSize === "number" ? raw.shopeeSectionTitleSize : DEFAULT_OUR_PRODUCTS_SETTINGS.shopeeSectionTitleSize,
    shopeeSectionSubtitleColor: raw.shopeeSectionSubtitleColor || DEFAULT_OUR_PRODUCTS_SETTINGS.shopeeSectionSubtitleColor,
    shopeeSectionSubtitleFont: raw.shopeeSectionSubtitleFont || DEFAULT_OUR_PRODUCTS_SETTINGS.shopeeSectionSubtitleFont,
    shopeeSectionSubtitleSize: typeof raw.shopeeSectionSubtitleSize === "number" ? raw.shopeeSectionSubtitleSize : DEFAULT_OUR_PRODUCTS_SETTINGS.shopeeSectionSubtitleSize,
    storeCardSize: typeof raw.storeCardSize === "number" && !isNaN(raw.storeCardSize) ? raw.storeCardSize : DEFAULT_OUR_PRODUCTS_SETTINGS.storeCardSize,
    storeCards: Array.isArray(raw.storeCards) && raw.storeCards.length > 0
      ? (raw.storeCards.some((c: any) => c?.title?.toLowerCase().includes("lazada") || c?.badge?.toLowerCase().includes("lazada"))
          ? raw.storeCards
          : [...raw.storeCards, DEFAULT_OUR_PRODUCTS_SETTINGS.storeCards[3]])
      : DEFAULT_OUR_PRODUCTS_SETTINGS.storeCards,
    slideImagesLeft: Array.isArray(raw.slideImagesLeft) && raw.slideImagesLeft.length > 0
      ? raw.slideImagesLeft
      : DEFAULT_OUR_PRODUCTS_SETTINGS.slideImagesLeft,
    slideImagesRight: Array.isArray(raw.slideImagesRight) && raw.slideImagesRight.length > 0
      ? raw.slideImagesRight
      : DEFAULT_OUR_PRODUCTS_SETTINGS.slideImagesRight,
    shopeeProducts: Array.isArray(raw.shopeeProducts) && raw.shopeeProducts.length > 0
      ? raw.shopeeProducts.map((p: any) => ({
          ...p,
          images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || DEFAULT_OUR_PRODUCTS_SETTINGS.shopeeProducts[0].image],
        }))
      : DEFAULT_OUR_PRODUCTS_SETTINGS.shopeeProducts,
    shopeeCategories: Array.isArray(raw.shopeeCategories) && raw.shopeeCategories.length > 0
      ? raw.shopeeCategories
      : DEFAULT_OUR_PRODUCTS_SETTINGS.shopeeCategories,
  }
}

/**
 * Mengambil pengaturan awal secara sinkron dari cache lokal jika tersedia,
 * mengutamakan draft pengguna yang belum disimpan.
 */
export function getInitialOurProductsSettings(): OurProductsSettingsData {
  if (typeof window !== "undefined") {
    try {
      // Prioritaskan draft perubahan aktif
      const draft = localStorage.getItem(OUR_PRODUCTS_DRAFT_KEY)
      if (draft) {
        const parsed = JSON.parse(draft)
        return sanitizeOurProductsSettings(parsed)
      }
      const cached = localStorage.getItem(OUR_PRODUCTS_SETTINGS_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        return sanitizeOurProductsSettings(parsed)
      }
    } catch {
      // Abaikan error cache
    }
  }
  return DEFAULT_OUR_PRODUCTS_SETTINGS
}

/**
 * Mengambil pengaturan Our Products dari Supabase (tabel app_config).
 * Fallback ke localStorage / DEFAULT_OUR_PRODUCTS_SETTINGS.
 */
export async function fetchOurProductsSettings(): Promise<OurProductsSettingsData> {
  let localData: Partial<OurProductsSettingsData> | null = null
  if (typeof window !== "undefined") {
    try {
      const draft = localStorage.getItem(OUR_PRODUCTS_DRAFT_KEY)
      const cached = localStorage.getItem(OUR_PRODUCTS_SETTINGS_KEY)
      const target = draft || cached
      if (target) {
        localData = JSON.parse(target)
      }
    } catch {
      // Ignore
    }
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("app_config")
        .select("key, value")
        .eq("key", OUR_PRODUCTS_DB_CONFIG_KEY)
        .maybeSingle()

      if (!error && data?.value) {
        const dbSettings =
          typeof data.value === "string" ? JSON.parse(data.value) : data.value

        const merged: OurProductsSettingsData = sanitizeOurProductsSettings(dbSettings)

        if (typeof window !== "undefined") {
          try {
            const hasDraft =
              localStorage.getItem(OUR_PRODUCTS_HAS_DRAFT_KEY) === "true" ||
              Boolean(localStorage.getItem(OUR_PRODUCTS_DRAFT_KEY))
            const isPrevOrEdit =
              window.location.search.includes("preview=true") ||
              window.location.search.includes("edit=true") ||
              window.location.search.includes("settings=products") ||
              window.location.search.includes("settings=our-products")

            // JANGAN timpa draft/cache jika ada draft belum disimpan atau sedang mode preview/edit
            if (!hasDraft && !isPrevOrEdit) {
              localStorage.setItem(OUR_PRODUCTS_SETTINGS_KEY, JSON.stringify(merged))
            }
          } catch {}
        }

        return merged
      }
    } catch (err) {
      console.warn("[OurProductsSettings] Gagal mengambil dari database, gunakan fallback cache:", err)
    }
  }

  return {
    ...DEFAULT_OUR_PRODUCTS_SETTINGS,
    ...(localData || {}),
  }
}

/**
 * Menyimpan perubahan pengaturan Our Products ke database Supabase dan localStorage.
 */
export async function saveOurProductsSettings(
  settings: OurProductsSettingsData
): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(OUR_PRODUCTS_SETTINGS_KEY, JSON.stringify(settings))
      // Bersihkan draft karena sudah resmi tersimpan di database
      localStorage.removeItem(OUR_PRODUCTS_DRAFT_KEY)
      localStorage.removeItem(OUR_PRODUCTS_HAS_DRAFT_KEY)
    } catch (err: any) {
      console.warn("[OurProductsSettings] Gagal menulis ke localStorage:", err)
    }
  }

  if (!isSupabaseConfigured) {
    return { success: true }
  }

  try {
    const { data: existing, error: checkError } = await supabase
      .from("app_config")
      .select("id")
      .eq("key", OUR_PRODUCTS_DB_CONFIG_KEY)
      .maybeSingle()

    if (checkError) {
      console.error("[OurProductsSettings] Error saat query app_config:", checkError)
    }

    if (existing?.id) {
      const { error: updateError } = await supabase
        .from("app_config")
        .update({
          value: settings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)

      if (updateError) throw updateError
    } else {
      const { error: insertError } = await supabase
        .from("app_config")
        .insert({
          key: OUR_PRODUCTS_DB_CONFIG_KEY,
          value: settings,
          updated_at: new Date().toISOString(),
        })

      if (insertError) throw insertError
    }

    return { success: true }
  } catch (err: any) {
    console.error("[OurProductsSettings] Gagal menyimpan ke app_config:", err)
    return {
      success: false,
      error: err?.message || "Gagal menyimpan perubahan ke database.",
    }
  }
}

/**
 * Mengembalikan pengaturan Our Products ke default.
 */
export async function resetOurProductsSettings(): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(OUR_PRODUCTS_SETTINGS_KEY)
      localStorage.removeItem(OUR_PRODUCTS_DRAFT_KEY)
      localStorage.removeItem(OUR_PRODUCTS_HAS_DRAFT_KEY)
    } catch {}
  }

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from("app_config")
        .delete()
        .eq("key", OUR_PRODUCTS_DB_CONFIG_KEY)
    } catch (err: any) {
      console.error("[OurProductsSettings] Error saat reset:", err)
      return { success: false, error: err?.message }
    }
  }

  return { success: true }
}
