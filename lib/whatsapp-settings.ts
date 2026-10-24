import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export interface WhatsAppTopicItem {
  id: string
  title: string
  description: string
  phone: string
  template: string
  enabled?: boolean
}

export interface WhatsAppButtonSettings {
  isEnabled: boolean
  phoneDefault: string
  phoneMaklon: string
  headerTitle: string
  headerSubtitle: string
  greetingMessage1: string
  greetingMessage2: string
  tooltipText: string
  position: "right" | "left"
  topics: WhatsAppTopicItem[]
}

export const DEFAULT_WHATSAPP_SETTINGS: WhatsAppButtonSettings = {
  isEnabled: true,
  phoneDefault: "6285877669199",
  phoneMaklon: "6282136368880",
  headerTitle: "CV. Indo Green Nature Support",
  headerSubtitle: "Online • Siap Mendengarkan",
  greetingMessage1: "Halo! 👋 Selamat datang di CV. Indo Green Nature.",
  greetingMessage2:
    "Ada yang bisa kami bantu? Pilih topik layanan di bawah atau ketik pesan konsultasi Anda langsung ke tim kami.",
  tooltipText: "Chat WhatsApp CV. Indo Green Nature",
  position: "right",
  topics: [
    {
      id: "maklon",
      title: "Jasa Maklon Herbal",
      description: "Konsultasi formula, perizinan BPOM & produksi",
      phone: "6282136368880",
      template:
        "Halo CV. Indo Green Nature, saya ingin berkonsultasi mengenai layanan jasa maklon / OEM produk herbal (formulasi, perizinan BPOM/Halal, dan syarat minimum produksi).",
      enabled: true,
    },
    {
      id: "produk",
      title: "Produk Herbal",
      description: "Katalog simplisia, ekstrak & pasokan herbal",
      phone: "6285877669199",
      template:
        "Halo CV. Indo Green Nature, saya ingin bertanya seputar katalog produk herbal, simplisia, dan pasokan bahan baku alami.",
      enabled: true,
    },
  ],
}

export const WHATSAPP_SETTINGS_KEY = "cv_whatsapp_button_settings_v1"
export const WHATSAPP_CONFIG_KEY = "whatsapp_button_config"
export const WHATSAPP_SETTINGS_CHANNEL = "cv_whatsapp_button_sync"

export function normalizeWhatsAppNumber(phone?: string | null): string {
  if (!phone) return ""
  let cleaned = String(phone).replace(/[^0-9]/g, "")
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1)
  } else if (cleaned.startsWith("8")) {
    cleaned = "62" + cleaned
  }
  return cleaned
}

export function sanitizeWhatsAppSettings(raw: any): WhatsAppButtonSettings {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_WHATSAPP_SETTINGS }

  const phoneDefault = normalizeWhatsAppNumber(raw.phoneDefault) || DEFAULT_WHATSAPP_SETTINGS.phoneDefault
  const phoneMaklon = normalizeWhatsAppNumber(raw.phoneMaklon) || phoneDefault || DEFAULT_WHATSAPP_SETTINGS.phoneMaklon

  const rawTopics = Array.isArray(raw.topics) && raw.topics.length > 0
    ? raw.topics
    : DEFAULT_WHATSAPP_SETTINGS.topics

  const sanitizedTopics = rawTopics.map((topic: any) => {
    let topicPhone = normalizeWhatsAppNumber(topic.phone)
    if (!topicPhone) {
      topicPhone = topic.id === "maklon" ? phoneMaklon : phoneDefault
    }
    return {
      ...topic,
      phone: topicPhone,
      enabled: topic.enabled !== false,
    }
  })

  return {
    ...DEFAULT_WHATSAPP_SETTINGS,
    ...raw,
    phoneDefault,
    phoneMaklon,
    topics: sanitizedTopics,
  }
}

export function getInitialWhatsAppSettings(): WhatsAppButtonSettings {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(WHATSAPP_SETTINGS_KEY)
      if (cached) {
        return sanitizeWhatsAppSettings(JSON.parse(cached))
      }
    } catch {
      // ignore
    }
  }
  return DEFAULT_WHATSAPP_SETTINGS
}

export async function fetchWhatsAppSettings(): Promise<WhatsAppButtonSettings> {
  let localData: Partial<WhatsAppButtonSettings> | null = null
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(WHATSAPP_SETTINGS_KEY)
      if (cached) {
        localData = JSON.parse(cached)
      }
    } catch {
      // ignore
    }
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("app_config")
        .select("value")
        .eq("key", WHATSAPP_CONFIG_KEY)
        .maybeSingle()

      if (!error && data?.value) {
        const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value
        // Server database takes precedence over stale localStorage
        const merged = sanitizeWhatsAppSettings({ ...localData, ...parsed })
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(WHATSAPP_SETTINGS_KEY, JSON.stringify(merged))
          } catch {}
        }
        return merged
      }
    } catch (err) {
      console.warn("fetchWhatsAppSettings Supabase error:", err)
    }
  }

  if (localData) {
    return sanitizeWhatsAppSettings(localData)
  }
  return DEFAULT_WHATSAPP_SETTINGS
}

export async function saveWhatsAppSettings(
  settings: WhatsAppButtonSettings
): Promise<{ success: boolean; error?: string }> {
  const sanitized = sanitizeWhatsAppSettings(settings)

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(WHATSAPP_SETTINGS_KEY, JSON.stringify(sanitized))
    } catch (e: any) {
      console.warn("Gagal simpan ke localStorage:", e)
    }

    try {
      if (typeof BroadcastChannel !== "undefined") {
        const bc = new BroadcastChannel(WHATSAPP_SETTINGS_CHANNEL)
        bc.postMessage({ type: "UPDATE_WHATSAPP_SETTINGS", data: sanitized })
        bc.close()
      }
    } catch {}
  }

  if (isSupabaseConfigured) {
    try {
      const { data: existing } = await supabase
        .from("app_config")
        .select("id")
        .eq("key", WHATSAPP_CONFIG_KEY)
        .maybeSingle()

      if (existing?.id) {
        const { error } = await supabase
          .from("app_config")
          .update({
            value: JSON.stringify(sanitized),
            updated_at: new Date().toISOString(),
          })
          .eq("key", WHATSAPP_CONFIG_KEY)

        if (error) throw error
      } else {
        const { error } = await supabase.from("app_config").insert({
          key: WHATSAPP_CONFIG_KEY,
          value: JSON.stringify(sanitized),
          updated_at: new Date().toISOString(),
        })
        if (error) throw error
      }
      return { success: true }
    } catch (err: any) {
      console.error("saveWhatsAppSettings error:", err)
      return { success: false, error: err?.message || "Gagal menyimpan ke database." }
    }
  }

  return { success: true }
}
