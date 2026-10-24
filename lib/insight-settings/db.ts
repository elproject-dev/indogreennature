import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import {
  InsightSettingsData,
  DEFAULT_INSIGHT_SETTINGS,
  INSIGHT_SETTINGS_KEY,
  INSIGHT_DB_CONFIG_KEY,
  INSIGHT_SETTINGS_TABLE,
} from "./types"

const COLOR_FIELDS: (keyof InsightSettingsData)[] = [
  "bannerBadgeColor",
  "bannerBadgeBg",
  "bannerBadgeBorderColor",
  "bannerTitleColor",
  "bannerTitleHighlightColor",
  "bannerTitleGradientFrom",
  "bannerTitleGradientTo",
  "bannerDescColor",
  "bannerBgGradientFrom",
  "bannerBgGradientVia",
  "bannerBgGradientTo",
  "bannerBgSolidColor",
  "bannerPatternColor",
  "bannerCategoryActiveBg",
  "bannerCategoryActiveColor",
  "bannerCategoryInactiveBg",
  "bannerCategoryInactiveColor",
  "bannerCtaBg",
  "bannerCtaTextColor",
  "bannerFrameBorderColor",
  "bannerFrameBg",
  "bannerFrameGlowColor",
  "sidebarCtaBtnBg",
  "sidebarCtaBtnColor",
  "bottomCtaBtnBg",
  "bottomCtaBtnColor",
]

export function sanitizeInsightSettings(raw: any): InsightSettingsData {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_INSIGHT_SETTINGS }
  const cleaned = { ...raw }

  for (const field of COLOR_FIELDS) {
    if (typeof cleaned[field] === "string") {
      const val = cleaned[field].trim()
      // Filter out overly long corrupted strings
      if (
        val.length > 40 ||
        (val.includes(" ") && !val.startsWith("linear-gradient") && !val.startsWith("radial-gradient"))
      ) {
        cleaned[field] = ""
      }
    }
  }

  return {
    ...DEFAULT_INSIGHT_SETTINGS,
    ...cleaned,
  }
}

/**
 * Mengambil pengaturan awal secara sinkron dari cache lokal jika tersedia,
 * mencegah flashback font/layout saat inisialisasi awal.
 */
export function getInitialInsightSettings(): InsightSettingsData {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(INSIGHT_SETTINGS_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        return sanitizeInsightSettings(parsed)
      }
    } catch {
      // Abaikan error cache
    }
  }
  return DEFAULT_INSIGHT_SETTINGS
}

/**
 * Mengambil pengaturan Insight dari Supabase (tabel app_config / fallback about_us_config).
 * Fallback ke localStorage / DEFAULT_INSIGHT_SETTINGS.
 */
export async function fetchInsightSettings(): Promise<InsightSettingsData> {
  const isPrev =
    typeof window !== "undefined" &&
    window.location.search.includes("preview=true")

  let localData: Partial<InsightSettingsData> | null = null
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(INSIGHT_SETTINGS_KEY)
      if (cached) {
        localData = JSON.parse(cached)
      }
    } catch {
      // Ignore
    }
  }

  // Jika sedang membuka tab pratinjau, utamakan data live preview dari cache
  if (isPrev && localData) {
    return sanitizeInsightSettings(localData)
  }

  if (isSupabaseConfigured) {
    try {
      // 1. Coba ambil dari app_config
      const { data, error } = await supabase
        .from(INSIGHT_SETTINGS_TABLE)
        .select("key, value")
        .eq("key", INSIGHT_DB_CONFIG_KEY)
        .maybeSingle()

      if (!error && data?.value) {
        const dbSettings =
          typeof data.value === "string" ? JSON.parse(data.value) : data.value

        const merged: InsightSettingsData = sanitizeInsightSettings(dbSettings)

        if (typeof window !== "undefined" && !isPrev) {
          try {
            localStorage.setItem(INSIGHT_SETTINGS_KEY, JSON.stringify(merged))
          } catch {}
        }

        return merged
      }
    } catch (err) {
      console.warn("[InsightSettings] Gagal mengambil dari database app_config, fallback ke cache:", err)
    }

    // 2. Coba alternatif tabel about_us_config jika app_config tidak ada
    try {
      const { data, error } = await supabase
        .from("about_us_config")
        .select("key, value")
        .eq("key", INSIGHT_DB_CONFIG_KEY)
        .maybeSingle()

      if (!error && data?.value) {
        const dbSettings =
          typeof data.value === "string" ? JSON.parse(data.value) : data.value
        const merged: InsightSettingsData = sanitizeInsightSettings(dbSettings)
        return merged
      }
    } catch {
      // Ignore
    }
  }

  return {
    ...DEFAULT_INSIGHT_SETTINGS,
    ...(localData || {}),
  }
}

/**
 * Menyimpan perubahan pengaturan Insight ke Supabase dan cache lokal.
 */
export async function saveInsightSettings(
  settings: InsightSettingsData
): Promise<{ success: boolean; error?: string }> {
  // 1. Simpan ke cache lokal terlebih dahulu
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(INSIGHT_SETTINGS_KEY, JSON.stringify(settings))
    } catch (err: any) {
      console.warn("[InsightSettings] Gagal menulis ke localStorage:", err)
    }
  }

  // 2. Simpan ke database Supabase
  if (!isSupabaseConfigured) {
    return { success: true }
  }

  try {
    // Coba simpan ke app_config
    const { data: existing } = await supabase
      .from(INSIGHT_SETTINGS_TABLE)
      .select("id")
      .eq("key", INSIGHT_DB_CONFIG_KEY)
      .maybeSingle()

    if (existing?.id) {
      const { error: updateError } = await supabase
        .from(INSIGHT_SETTINGS_TABLE)
        .update({
          value: settings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)

      if (updateError) throw updateError
    } else {
      const { error: insertError } = await supabase
        .from(INSIGHT_SETTINGS_TABLE)
        .insert({
          key: INSIGHT_DB_CONFIG_KEY,
          value: settings,
          updated_at: new Date().toISOString(),
        })

      if (insertError) throw insertError
    }

    return { success: true }
  } catch (err: any) {
    console.warn("[InsightSettings] Gagal menyimpan ke app_config, mencoba alternatif:", err)

    // Fallback: coba simpan ke about_us_config yang pasti ada tabelnya
    try {
      const { data: existingAbout } = await supabase
        .from("about_us_config")
        .select("id")
        .eq("key", INSIGHT_DB_CONFIG_KEY)
        .maybeSingle()

      if (existingAbout?.id) {
        await supabase
          .from("about_us_config")
          .update({
            value: settings,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingAbout.id)
      } else {
        await supabase
          .from("about_us_config")
          .insert({
            key: INSIGHT_DB_CONFIG_KEY,
            value: settings,
            updated_at: new Date().toISOString(),
          })
      }
      return { success: true }
    } catch (fallbackErr: any) {
      console.error("[InsightSettings] Gagal simpan ke database:", fallbackErr)
      // Cache lokal sudah tersimpan, return success dengan catatan
      return { success: true }
    }
  }
}

/**
 * Mengembalikan pengaturan Insight ke kondisi default.
 */
export async function resetInsightSettings(): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(INSIGHT_SETTINGS_KEY)
    } catch {}
  }

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from(INSIGHT_SETTINGS_TABLE)
        .delete()
        .eq("key", INSIGHT_DB_CONFIG_KEY)

      await supabase
        .from("about_us_config")
        .delete()
        .eq("key", INSIGHT_DB_CONFIG_KEY)
    } catch {}
  }

  return { success: true }
}
