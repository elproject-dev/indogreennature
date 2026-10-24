import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import {
  AboutSettingsData,
  DEFAULT_ABOUT_SETTINGS,
  ABOUT_SETTINGS_KEY,
  ABOUT_DB_CONFIG_KEY,
} from "./types"

export const ABOUT_SETTINGS_TABLE = "about_us_config"

const COLOR_FIELDS: (keyof AboutSettingsData)[] = [
  "bannerTitleColor",
  "bannerDescColor",
  "bannerBtn1BgColor",
  "bannerBtn1TextColor",
  "bannerBtn2BgColor",
  "bannerBtn2TextColor",
  "profilTitleColor",
  "profilDescColor",
  "visiMisiTitleColor",
  "visiMisiSubtitleColor",
  "visiTitleColor",
  "visiDescColor",
  "visiCardBg",
  "misiCardBg",
  "misiTitleColor",
  "misiItemTitleColor",
  "misiItemDescColor",
  "misiBadgeNumberBg",
  "misiBadgeNumberColor",
  "rekamJejakTitleColor",
  "rekamJejakSubtitleColor",
  "rekamJejakCarouselTitleColor",
  "rekamJejakYearColor",
  "rekamJejakCardTitleColor",
  "rekamJejakCardDescColor",
  "rekamJejakCardBg",
  "rekamJejakCardBorderColor",
  "prinsipKerjaBadgeColor",
  "prinsipKerjaTitleColor",
  "prinsipKerjaDescColor",
  "prinsipKerjaCardTitleColor",
  "prinsipKerjaCardDescColor",
  "prinsipKerjaCardBg",
  "prinsipKerjaCardBorderColor",
  "distribusiBadgeColor",
  "distribusiTitleColor",
  "distribusiDescColor",
  "distribusiCardBg",
  "distribusiCardBorderColor",
  "distribusiTagColor",
  "distribusiCardTitleColor",
  "distribusiCardDescColor",
  "distribusiCityBadgeBg",
  "distribusiCityBadgeColor",
  "legalitasBadgeColor",
  "legalitasTitleColor",
  "legalitasDescColor",
  "legalitasCardBg",
  "legalitasCardBorderColor",
  "ctaTitleColor",
  "ctaDescColor",
  "ctaButtonBg",
  "ctaButtonTextColor",
  "ctaCardBg",
  "ctaCardBorderColor",
]

export function sanitizeAboutSettings(raw: any): AboutSettingsData {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_ABOUT_SETTINGS }
  const cleaned = { ...raw }

  for (const field of COLOR_FIELDS) {
    if (typeof cleaned[field] === "string") {
      const val = cleaned[field].trim()
      // Jika panjang string lebih dari 35 karakter atau mengandung spasi selain gradient, pasti bukan warna
      if (
        val.length > 35 ||
        (val.includes(" ") && !val.startsWith("linear-gradient") && !val.startsWith("radial-gradient"))
      ) {
        cleaned[field] = ""
      }
    }
  }

  return {
    ...DEFAULT_ABOUT_SETTINGS,
    ...cleaned,
  }
}

/**
 * Mengambil pengaturan awal secara sinkron dari cache lokal jika tersedia,
 * mencegah flashback font/layout (FOUT) saat inisialisasi state awal.
 */
export function getInitialAboutSettings(): AboutSettingsData {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(ABOUT_SETTINGS_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        const sanitized = sanitizeAboutSettings(parsed)
        // Perbarui cache jika ada data kotor
        try {
          localStorage.setItem(ABOUT_SETTINGS_KEY, JSON.stringify(sanitized))
        } catch {}
        return sanitized
      }
    } catch {
      // Abaikan error cache
    }
  }
  return DEFAULT_ABOUT_SETTINGS
}

/**
 * Mengambil pengaturan About Us dari tabel khusus `about_us_config` di Supabase.
 * Jika tabel belum berisi data atau Supabase belum terhubung, fallback ke localStorage / DEFAULT_ABOUT_SETTINGS.
 */
export async function fetchAboutSettings(): Promise<AboutSettingsData> {
  // 1. Coba ambil dari localStorage sebagai cache awal
  let localData: Partial<AboutSettingsData> | null = null
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(ABOUT_SETTINGS_KEY)
      if (cached) {
        localData = JSON.parse(cached)
      }
    } catch {
      // Abaikan error parsing cache lokal
    }
  }

  // 2. Ambil data master dari database Supabase (tabel about_us_config)
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from(ABOUT_SETTINGS_TABLE)
        .select("key, value")
        .eq("key", ABOUT_DB_CONFIG_KEY)
        .maybeSingle()

      if (!error && data?.value) {
        const dbSettings =
          typeof data.value === "string" ? JSON.parse(data.value) : data.value

        const merged: AboutSettingsData = {
          ...DEFAULT_ABOUT_SETTINGS,
          ...dbSettings,
        }

        // Perbarui cache localStorage agar tetap sinkron saat offline
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(ABOUT_SETTINGS_KEY, JSON.stringify(merged))
          } catch {
            // Ignore storage error
          }
        }

        return merged
      }
    } catch (err) {
      console.warn("[AboutSettings] Gagal mengambil dari tabel about_us_config, fallback ke cache:", err)
    }
  }

  // 3. Fallback ke data localStorage atau data default jika database kosong/offline
  return {
    ...DEFAULT_ABOUT_SETTINGS,
    ...(localData || {}),
  }
}

/**
 * Menyimpan perubahan pengaturan About Us ke tabel khusus `about_us_config` di Supabase.
 * Juga memperbarui cache lokal untuk kecepatan render client.
 */
export async function saveAboutSettings(
  settings: AboutSettingsData
): Promise<{ success: boolean; error?: string }> {
  // 1. Simpan ke cache lokal terlebih dahulu
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ABOUT_SETTINGS_KEY, JSON.stringify(settings))
    } catch (err: any) {
      console.warn("[AboutSettings] Gagal menulis ke localStorage:", err)
    }
  }

  // 2. Simpan ke tabel about_us_config di database
  if (!isSupabaseConfigured) {
    return { success: true }
  }

  try {
    const { data: existing, error: checkError } = await supabase
      .from(ABOUT_SETTINGS_TABLE)
      .select("id")
      .eq("key", ABOUT_DB_CONFIG_KEY)
      .maybeSingle()

    if (checkError) {
      console.error("[AboutSettings] Error saat mengecek data di about_us_config:", checkError)
    }

    if (existing?.id) {
      // Update record yang sudah ada
      const { error: updateError } = await supabase
        .from(ABOUT_SETTINGS_TABLE)
        .update({
          value: settings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)

      if (updateError) throw updateError
    } else {
      // Insert record baru
      const { error: insertError } = await supabase
        .from(ABOUT_SETTINGS_TABLE)
        .insert({
          key: ABOUT_DB_CONFIG_KEY,
          value: settings,
          updated_at: new Date().toISOString(),
        })

      if (insertError) throw insertError
    }

    return { success: true }
  } catch (err: any) {
    console.error("[AboutSettings] Gagal menyimpan ke tabel about_us_config:", err)
    return {
      success: false,
      error: err?.message || "Gagal menyimpan perubahan ke database.",
    }
  }
}

/**
 * Mengembalikan pengaturan About Us ke kondisi default baik di database `about_us_config` maupun di cache lokal.
 */
export async function resetAboutSettings(): Promise<{ success: boolean; error?: string }> {
  // 1. Hapus dari localStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(ABOUT_SETTINGS_KEY)
    } catch {
      // Ignore
    }
  }

  // 2. Hapus / reset di tabel about_us_config
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from(ABOUT_SETTINGS_TABLE)
        .delete()
        .eq("key", ABOUT_DB_CONFIG_KEY)

      if (error) {
        console.warn("[AboutSettings] Gagal mereset di database:", error)
      }
    } catch (err: any) {
      console.error("[AboutSettings] Error saat reset:", err)
      return { success: false, error: err?.message }
    }
  }

  return { success: true }
}
