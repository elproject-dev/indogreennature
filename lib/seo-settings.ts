import { supabase } from "./supabase"

export interface SeoConfig {
  siteTitle: string
  siteDescription: string
  siteKeywords: string
  canonicalUrl: string
  ogImageUrl: string
  googleVerification: string
  robotsIndex: boolean
  author: string
  companyName: string
}

export const SEO_CONFIG_KEY = "seo_config"
export const SEO_CONFIG_DB_KEY = "seo_config"

export const DEFAULT_SEO_CONFIG: SeoConfig = {
  siteTitle: "CV. Indo Green Nature | Jasa Maklon Herbal BPOM & Halal Resmi",
  siteDescription: "Pabrik dan jasa maklon herbal terpercaya di Indonesia. Melayani formulasi minuman serbuk, kapsul herbal, teh herbal berstandar BPOM & Halal dengan legalitas lengkap.",
  siteKeywords: "maklon herbal, jasa maklon herbal, maklon herbal bpom, pabrik herbal, maklon minuman serbuk, maklon kapsul herbal, maklon teh herbal, cv indo green nature",
  canonicalUrl: "https://www.indogreennature.com",
  ogImageUrl: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/hero_banner/1792330129667-hsobqa.webp",
  googleVerification: "LGVKTK0moSrDgV9sOu-cy4n5hK3bPya07IQ_rB-WT50",
  robotsIndex: true,
  author: "CV. Indo Green Nature",
  companyName: "CV. Indo Green Nature",
}

export function getInitialSeoConfig(): SeoConfig {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(SEO_CONFIG_KEY)
      if (stored) {
        return { ...DEFAULT_SEO_CONFIG, ...JSON.parse(stored) }
      }
    } catch {}
  }
  return DEFAULT_SEO_CONFIG
}

export async function fetchSeoConfig(): Promise<SeoConfig> {
  let localData: Partial<SeoConfig> = {}
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(SEO_CONFIG_KEY)
      if (stored) {
        localData = JSON.parse(stored)
      }
    } catch {}
  }

  try {
    const { data, error } = await supabase
      .from("app_config")
      .select("key, value")
      .eq("key", SEO_CONFIG_DB_KEY)
      .maybeSingle()

    if (!error && data?.value) {
      const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value
      const merged = { ...DEFAULT_SEO_CONFIG, ...localData, ...parsed }
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(SEO_CONFIG_KEY, JSON.stringify(merged))
        } catch {}
      }
      return merged
    }
  } catch (err) {
    console.warn("Gagal fetch seo_config:", err)
  }

  return { ...DEFAULT_SEO_CONFIG, ...localData }
}

export async function saveSeoConfig(config: SeoConfig): Promise<boolean> {
  const merged = { ...DEFAULT_SEO_CONFIG, ...config }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SEO_CONFIG_KEY, JSON.stringify(merged))
      window.dispatchEvent(new CustomEvent("seo-config-updated", { detail: merged }))
    } catch {}
  }

  try {
    const stringified = JSON.stringify(merged)
    const { data: existing } = await supabase
      .from("app_config")
      .select("id")
      .eq("key", SEO_CONFIG_DB_KEY)
      .maybeSingle()

    if (existing?.id) {
      const { error } = await supabase
        .from("app_config")
        .update({ value: stringified, updated_at: new Date().toISOString() })
        .eq("key", SEO_CONFIG_DB_KEY)
      return !error
    } else {
      const { error } = await supabase
        .from("app_config")
        .insert({ key: SEO_CONFIG_DB_KEY, value: stringified })
      return !error
    }
  } catch (err) {
    console.error("Gagal simpan seo_config:", err)
    return false
  }
}
