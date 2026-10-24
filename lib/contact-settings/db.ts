import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import {
  ContactSettingsData,
  DEFAULT_CONTACT_SETTINGS,
  CONTACT_SETTINGS_KEY,
  CONTACT_DB_CONFIG_KEY,
} from "./types"

export function sanitizeContactSettings(raw: any): ContactSettingsData {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_CONTACT_SETTINGS }
  return {
    ...DEFAULT_CONTACT_SETTINGS,
    ...raw,
    serviceCards: Array.isArray(raw.serviceCards) && raw.serviceCards.length > 0
      ? raw.serviceCards
      : DEFAULT_CONTACT_SETTINGS.serviceCards,
    faqItems: Array.isArray(raw.faqItems) && raw.faqItems.length > 0
      ? raw.faqItems
      : DEFAULT_CONTACT_SETTINGS.faqItems,
  }
}

/**
 * Mengambil pengaturan awal secara sinkron dari cache lokal jika tersedia,
 * mencegah flashback font/layout saat inisialisasi awal.
 */
export function getInitialContactSettings(): ContactSettingsData {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(CONTACT_SETTINGS_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        return sanitizeContactSettings(parsed)
      }
    } catch {
      // Abaikan error cache
    }
  }
  return DEFAULT_CONTACT_SETTINGS
}

/**
 * Mengambil pengaturan kontak dari Supabase (tabel app_config).
 * Fallback ke localStorage / DEFAULT_CONTACT_SETTINGS.
 */
export async function fetchContactSettings(): Promise<ContactSettingsData> {
  let localData: Partial<ContactSettingsData> | null = null
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(CONTACT_SETTINGS_KEY)
      if (cached) {
        localData = JSON.parse(cached)
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
        .eq("key", CONTACT_DB_CONFIG_KEY)
        .maybeSingle()

      if (!error && data?.value) {
        const dbSettings =
          typeof data.value === "string" ? JSON.parse(data.value) : data.value

        const merged: ContactSettingsData = sanitizeContactSettings(dbSettings)

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(CONTACT_SETTINGS_KEY, JSON.stringify(merged))
          } catch {}
        }

        return merged
      }
    } catch (err) {
      console.warn("[ContactSettings] Gagal mengambil dari database, gunakan fallback cache:", err)
    }
  }

  return {
    ...DEFAULT_CONTACT_SETTINGS,
    ...(localData || {}),
  }
}

/**
 * Menyimpan perubahan pengaturan Contact ke database Supabase dan localStorage.
 */
export async function saveContactSettings(
  settings: ContactSettingsData
): Promise<{ success: boolean; error?: string }> {
  // 1. Simpan ke cache lokal
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CONTACT_SETTINGS_KEY, JSON.stringify(settings))
    } catch (err: any) {
      console.warn("[ContactSettings] Gagal menulis ke localStorage:", err)
    }
  }

  if (!isSupabaseConfigured) {
    return { success: true }
  }

  try {
    const { data: existing, error: checkError } = await supabase
      .from("app_config")
      .select("id")
      .eq("key", CONTACT_DB_CONFIG_KEY)
      .maybeSingle()

    if (checkError) {
      console.error("[ContactSettings] Error saat query app_config:", checkError)
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
          key: CONTACT_DB_CONFIG_KEY,
          value: settings,
          updated_at: new Date().toISOString(),
        })

      if (insertError) throw insertError
    }

    return { success: true }
  } catch (err: any) {
    console.error("[ContactSettings] Gagal menyimpan ke app_config:", err)
    return {
      success: false,
      error: err?.message || "Gagal menyimpan perubahan ke database.",
    }
  }
}

/**
 * Mengembalikan pengaturan Contact ke default.
 */
export async function resetContactSettings(): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(CONTACT_SETTINGS_KEY)
    } catch {}
  }

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from("app_config")
        .delete()
        .eq("key", CONTACT_DB_CONFIG_KEY)
    } catch (err: any) {
      console.error("[ContactSettings] Error saat reset:", err)
      return { success: false, error: err?.message }
    }
  }

  return { success: true }
}
