import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import {
  LegalitySettingsData,
  DEFAULT_LEGALITY_SETTINGS,
} from "@/lib/legality-settings/types"
import {
  LEGALITY_PRIMARY_TABLE,
  LEGALITY_PRIMARY_KEY,
  LEGALITY_FALLBACK_TABLE,
  LEGALITY_FALLBACK_KEY,
  LEGALITY_CACHE_KEY,
} from "./legality-config"

const nonEmptyArray = <T>(val: unknown, fallback: T[]): T[] =>
  Array.isArray(val) && val.length > 0 ? (val as T[]) : fallback

/**
 * Sanitasi data legality untuk memastikan seluruh struktur array & properti valid
 */
export function sanitizeLegalitySettings(raw: any): LegalitySettingsData {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_LEGALITY_SETTINGS }
  const d = DEFAULT_LEGALITY_SETTINGS
  const documents = nonEmptyArray(raw.documents, d.documents).map((doc: any) => ({
    ...doc,
    highlights: Array.isArray(doc?.highlights) ? doc.highlights : [],
    imageUrl: typeof doc?.imageUrl === "string" ? doc.imageUrl : undefined,
  }))

  return {
    ...d,
    ...raw,
    heroStats: nonEmptyArray(raw.heroStats, d.heroStats),
    documents,
    guideSteps: nonEmptyArray(raw.guideSteps, d.guideSteps),
  }
}

/**
 * Mengambil pengaturan awal dari localStorage secara sinkron untuk menghindari layout flash.
 */
export function getInitialLegalitySettings(): LegalitySettingsData {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(LEGALITY_CACHE_KEY)
      if (cached) return sanitizeLegalitySettings(JSON.parse(cached))
    } catch {
      // Abaikan error cache
    }
  }
  return DEFAULT_LEGALITY_SETTINGS
}

/**
 * Mengambil pengaturan legality dari Supabase.
 * Prioritas 1: Tabel terpisah `legality_config`
 * Prioritas 2: Tabel fallback `app_config` (key: `legality_page_config`)
 * Prioritas 3: Cache localStorage / Default
 */
export async function fetchLegalitySettings(): Promise<LegalitySettingsData> {
  let localData: any = null
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(LEGALITY_CACHE_KEY)
      if (cached) localData = JSON.parse(cached)
    } catch {}
  }

  if (isSupabaseConfigured) {
    // 1. Coba ambil dari tabel khusus `legality_config`
    try {
      const { data, error } = await supabase
        .from(LEGALITY_PRIMARY_TABLE)
        .select("key, value")
        .eq("key", LEGALITY_PRIMARY_KEY)
        .maybeSingle()

      if (!error && data?.value) {
        const dbVal = typeof data.value === "string" ? JSON.parse(data.value) : data.value
        const merged = sanitizeLegalitySettings(dbVal)

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(LEGALITY_CACHE_KEY, JSON.stringify(merged))
          } catch {}
        }
        return merged
      }
    } catch (err) {
      console.warn(`[LegalityDB] Gagal membaca dari tabel ${LEGALITY_PRIMARY_TABLE}:`, err)
    }

    // 2. Fallback: Coba ambil dari tabel `app_config` jika tabel khusus belum terisi
    try {
      const { data, error } = await supabase
        .from(LEGALITY_FALLBACK_TABLE)
        .select("key, value")
        .eq("key", LEGALITY_FALLBACK_KEY)
        .maybeSingle()

      if (!error && data?.value) {
        const dbVal = typeof data.value === "string" ? JSON.parse(data.value) : data.value
        const merged = sanitizeLegalitySettings(dbVal)

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(LEGALITY_CACHE_KEY, JSON.stringify(merged))
          } catch {}
        }
        return merged
      }
    } catch (err) {
      console.warn(`[LegalityDB] Gagal membaca dari tabel fallback ${LEGALITY_FALLBACK_TABLE}:`, err)
    }
  }

  return sanitizeLegalitySettings(localData)
}

/**
 * Menyimpan data pengaturan legality ke database Supabase.
 * Data disimpan ke tabel khusus `legality_config`, serta disinkronkan ke cache localStorage.
 */
export async function saveLegalitySettings(
  settings: LegalitySettingsData
): Promise<{ success: boolean; error?: string }> {
  // 1. Simpan ke cache lokal seketika
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LEGALITY_CACHE_KEY, JSON.stringify(settings))
    } catch (err) {
      console.warn("[LegalityDB] Gagal menulis ke localStorage:", err)
    }
  }

  if (!isSupabaseConfigured) return { success: true }

  try {
    // 2. Simpan ke tabel khusus `legality_config`
    const { data: existing, error: checkError } = await supabase
      .from(LEGALITY_PRIMARY_TABLE)
      .select("id")
      .eq("key", LEGALITY_PRIMARY_KEY)
      .maybeSingle()

    if (checkError) {
      console.warn(`[LegalityDB] Check error di ${LEGALITY_PRIMARY_TABLE}:`, checkError)
    }

    if (existing?.id) {
      const { error: updateError } = await supabase
        .from(LEGALITY_PRIMARY_TABLE)
        .update({
          value: settings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)

      if (updateError) throw updateError
    } else {
      const { error: insertError } = await supabase
        .from(LEGALITY_PRIMARY_TABLE)
        .insert({
          key: LEGALITY_PRIMARY_KEY,
          value: settings,
          updated_at: new Date().toISOString(),
        })

      if (insertError) throw insertError
    }

    // 3. Mirroring ke app_config untuk redundansi & kompatibilitas
    try {
      const { data: fallbackExisting } = await supabase
        .from(LEGALITY_FALLBACK_TABLE)
        .select("id")
        .eq("key", LEGALITY_FALLBACK_KEY)
        .maybeSingle()

      if (fallbackExisting?.id) {
        await supabase
          .from(LEGALITY_FALLBACK_TABLE)
          .update({ value: settings, updated_at: new Date().toISOString() })
          .eq("id", fallbackExisting.id)
      } else {
        await supabase
          .from(LEGALITY_FALLBACK_TABLE)
          .insert({ key: LEGALITY_FALLBACK_KEY, value: settings, updated_at: new Date().toISOString() })
      }
    } catch {
      // Mirroring opsional, abaikan jika app_config bermasalah
    }

    return { success: true }
  } catch (err: any) {
    console.error("[LegalityDB] Gagal menyimpan ke database Supabase:", err)
    return {
      success: false,
      error: err?.message || "Gagal menyimpan perubahan ke database Supabase.",
    }
  }
}

/**
 * Mereset data pengaturan legality ke default di Supabase & localStorage
 */
export async function resetLegalitySettings(): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(LEGALITY_CACHE_KEY)
    } catch {}
  }

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from(LEGALITY_PRIMARY_TABLE)
        .delete()
        .eq("key", LEGALITY_PRIMARY_KEY)
    } catch (err) {
      console.error("[LegalityDB] Error reset di primary table:", err)
    }

    try {
      await supabase
        .from(LEGALITY_FALLBACK_TABLE)
        .delete()
        .eq("key", LEGALITY_FALLBACK_KEY)
    } catch {}
  }

  return { success: true }
}
