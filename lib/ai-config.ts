import { supabase } from "@/lib/supabase"

export interface AiGatewayConfig {
  baseUrl: string
  apiKey: string
  defaultModel: string
  systemPrompt: string
  temperature: number
}

export const DEFAULT_BASE_SYSTEM_PROMPT = `Anda adalah asisten AI profesional untuk "CV. Indo Green Nature", pabrik dan penyedia jasa Maklon Herbal terpercaya di Indonesia berstandar CPOTB (Cara Pembuatan Obat Tradisional yang Baik), izin edar BPOM (TR/MD), dan sertifikasi Halal MUI. Layanan meliputi formulasi custom R&D, produksi sediaan kapsul herbal, minuman serbuk (fiber, collagen, rempah), teh herbal/celup, cairan obat dalam/madu herbal, serta pengurusan izin edar BPOM, Halal, desain kemasan, dan pendaftaran HKI merek bagi calon brand owner herbal. Selalu berikan jawaban yang cerdas, solutif, berbasis regulasi, dan ramah bisnis.`

export const DEFAULT_AI_CONFIG: AiGatewayConfig = {
  baseUrl: process.env.OMNIROUTE_BASE_URL || "https://ai.indogreennature.com/v1",
  apiKey: process.env.OMNIROUTE_API_KEY || "",
  defaultModel: process.env.OMNIROUTE_MODEL || "kc/kilo-auto/free",
  systemPrompt: DEFAULT_BASE_SYSTEM_PROMPT,
  temperature: 0.7,
}

export interface WhatsAppCsKnowledgeConfig {
  pabrikAddress: string
  operatingHours: string
  contactPhone: string
  contactEmail: string
  serviceCatalog: string
  moqAndPricing: string
  customTrainingNotes: string
  // Tautan Toko Marketplace Resmi
  shopeeUrl?: string
  tokopediaUrl?: string
  lazadaUrl?: string
  tiktokShopUrl?: string
}

export const DEFAULT_WHATSAPP_CS_KNOWLEDGE: WhatsAppCsKnowledgeConfig = {
  pabrikAddress:
    "Jl. Wahid Hasyim No. 123, Wates, Kulon Progo, D.I. Yogyakarta 55651 (Fasilitas produksi dapat dikunjungi untuk audit dan konsultasi langsung dengan membuat janji temu).",
  operatingHours:
    "Senin – Jumat: 08.00 – 17.00 WIB | Sabtu: 08.00 – 13.00 WIB (Hari Minggu & Libur Nasional tutup).",
  contactPhone: "0858-7766-9199 / 0821-3636-8880",
  contactEmail: "admin@indogreennature.com",
  serviceCatalog: `1. Kapsul Herbal: Ekstrak tunggal, kombinasi multi-herbal, serbuk simplisia terstandar (kapsul gelatin halal / vegetal).
2. Cairan Obat Dalam: Madu herbal racikan, sirup herbal, tetes herbal, jamu cair berkhasiat.
3. Minuman Serbuk: Fiber diet & detox, collagen kecantikan, serbuk jahe/temulawak/rempah seduh instan.
4. Teh Herbal: Teh celup rimpang/daun herbal & teh tubruk alami.
5. Fasilitas One-Stop: Formulasi sampel R&D gratis revisi, pengurusan izin edar BPOM (TR/MD) sampai terbit, sertifikasi Halal MUI/BPJPH, desain kemasan profesional, serta pendaftaran HKI merek.`,
  moqAndPricing:
    "Minimal Order Quantity (MOQ) sangat bersahabat untuk brand owner pemula, mulai dari 1.000 botol/pcs per batch produksi. Estimasi biaya fleksibel disesuaikan dengan formula bahan baku, jenis kemasan, dan volume produksi.",
  shopeeUrl: "https://shopee.co.id",
  tokopediaUrl: "https://tokopedia.com",
  lazadaUrl: "https://www.lazada.co.id",
  tiktokShopUrl: "https://tiktok.com",
  customTrainingNotes: `- Sambut penanya dengan santun, ramah, dan profesional sebagai tim Customer Service resmi CV. Indo Green Nature.
- Jika ada yang menanyakan alamat pabrik atau ingin berkunjung, berikan alamat lengkap di Wates, Kulon Progo, Yogyakarta dan tawarkan bantuan untuk menjadwalkan janji temu.
- Jika ada yang menanyakan link toko marketplace resmi (Shopee, Tokopedia, Lazada, TikTok Shop), berikan tautan resmi dengan format tombol link markdown:
  * Shopee: [Beli di Shopee Official Store](https://shopee.co.id)
  * Tokopedia: [Beli di Tokopedia Official Store](https://tokopedia.com)
  * Lazada: [Beli di Lazada Official Store](https://www.lazada.co.id)
  * TikTok Shop: [Beli di TikTok Shop Official](https://tiktok.com)
- Jika ada yang menanyakan katalog produk atau maklon, jelaskan sediaan kapsul, cairan obat dalam/madu, serbuk minuman, dan teh herbal berstandar CPOTB Tahap II & Halal.
- Jika ada yang menanyakan minimal order (MOQ) atau biaya, sampaikan bahwa MOQ terjangkau mulai dari 1.000 pcs dan tim kami siap memberikan simulasi biaya gratis.
- Jaga integritas regulasi: dilarang memberikan klaim penyembuhan penyakit medis secara berlebihan atau melanggar ketentuan BPOM.
- Di akhir penjelasan penting, selalu tawarkan dengan hangat: "Jika ingin berdiskusi formulasi atau konsultasi langsung, silakan klik tombol WhatsApp resmi kami di bawah ya!"`,
}

export const AI_CONFIG_KEY = "indogreen_ai_gateway_config"
export const AI_CONFIG_DB_KEY = "ai_gateway_config"
export const WHATSAPP_CS_KNOWLEDGE_DB_KEY = "whatsapp_cs_knowledge_config"

let serverCache: { data: AiGatewayConfig; timestamp: number } | null = null
let csKnowledgeCache: { data: WhatsAppCsKnowledgeConfig; timestamp: number } | null = null

/**
 * Mengambil konfigurasi AI aktif dari database app_config di Supabase
 * dengan fallback ke environment variables (.env.local).
 */
export async function getAiConfigServer(): Promise<AiGatewayConfig> {
  const now = Date.now()
  if (serverCache && now - serverCache.timestamp < 15000) {
    return serverCache.data
  }

  try {
    const { data } = await supabase
      .from("app_config")
      .select("value")
      .eq("key", AI_CONFIG_DB_KEY)
      .maybeSingle()

    if (data?.value) {
      const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value
      const merged: AiGatewayConfig = {
        baseUrl: parsed.baseUrl?.trim() || process.env.OMNIROUTE_BASE_URL || DEFAULT_AI_CONFIG.baseUrl,
        apiKey: parsed.apiKey?.trim() !== undefined && parsed.apiKey.trim() !== "" ? parsed.apiKey.trim() : (process.env.OMNIROUTE_API_KEY || ""),
        defaultModel: parsed.defaultModel?.trim() || process.env.OMNIROUTE_MODEL || DEFAULT_AI_CONFIG.defaultModel,
        systemPrompt: parsed.systemPrompt?.trim() || DEFAULT_BASE_SYSTEM_PROMPT,
        temperature: typeof parsed.temperature === "number" ? parsed.temperature : DEFAULT_AI_CONFIG.temperature,
      }
      serverCache = { data: merged, timestamp: now }
      return merged
    }
  } catch (err) {
    console.warn("Gagal fetch ai_gateway_config dari database:", err)
  }

  const fallback: AiGatewayConfig = {
    baseUrl: process.env.OMNIROUTE_BASE_URL || DEFAULT_AI_CONFIG.baseUrl,
    apiKey: process.env.OMNIROUTE_API_KEY || "",
    defaultModel: process.env.OMNIROUTE_MODEL || DEFAULT_AI_CONFIG.defaultModel,
    systemPrompt: DEFAULT_BASE_SYSTEM_PROMPT,
    temperature: DEFAULT_AI_CONFIG.temperature,
  }
  serverCache = { data: fallback, timestamp: now }
  return fallback
}

/**
 * Menyimpan konfigurasi AI ke database app_config di Supabase
 */
export async function saveAiConfigServer(
  newConfig: Partial<AiGatewayConfig>
): Promise<{ success: boolean; error?: string }> {
  try {
    const current = await getAiConfigServer()
    const merged: AiGatewayConfig = {
      baseUrl: newConfig.baseUrl?.trim() || current.baseUrl,
      apiKey: newConfig.apiKey !== undefined ? newConfig.apiKey.trim() : current.apiKey,
      defaultModel: newConfig.defaultModel?.trim() || current.defaultModel,
      systemPrompt: newConfig.systemPrompt?.trim() || current.systemPrompt,
      temperature: typeof newConfig.temperature === "number" ? newConfig.temperature : current.temperature,
    }

    const stringified = JSON.stringify(merged)
    const { data: existing } = await supabase
      .from("app_config")
      .select("id")
      .eq("key", AI_CONFIG_DB_KEY)
      .maybeSingle()

    if (existing?.id) {
      const { error } = await supabase
        .from("app_config")
        .update({ value: stringified, updated_at: new Date().toISOString() })
        .eq("key", AI_CONFIG_DB_KEY)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from("app_config")
        .insert({ key: AI_CONFIG_DB_KEY, value: stringified })
      if (error) throw error
    }

    serverCache = { data: merged, timestamp: Date.now() }
    return { success: true }
  } catch (err: any) {
    console.error("Gagal menyimpan ai_gateway_config:", err)
    return { success: false, error: err.message || "Gagal menyimpan konfigurasi AI" }
  }
}

/**
 * Reset konfigurasi AI ke pengaturan bawaan (.env.local)
 */
export async function resetAiConfigServer(): Promise<{ success: boolean; error?: string }> {
  try {
    await supabase.from("app_config").delete().eq("key", AI_CONFIG_DB_KEY)
    serverCache = null
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal reset konfigurasi AI" }
  }
}

/**
 * Mengambil konfigurasi knowledge base CS WhatsApp aktif dari app_config Supabase
 */
export async function getWhatsAppCsKnowledgeServer(): Promise<WhatsAppCsKnowledgeConfig> {
  const now = Date.now()
  if (csKnowledgeCache && now - csKnowledgeCache.timestamp < 15000) {
    return csKnowledgeCache.data
  }

  try {
    const { data } = await supabase
      .from("app_config")
      .select("value")
      .eq("key", WHATSAPP_CS_KNOWLEDGE_DB_KEY)
      .maybeSingle()

    if (data?.value) {
      const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value
      const merged: WhatsAppCsKnowledgeConfig = {
        pabrikAddress: parsed.pabrikAddress?.trim() || DEFAULT_WHATSAPP_CS_KNOWLEDGE.pabrikAddress,
        operatingHours: parsed.operatingHours?.trim() || DEFAULT_WHATSAPP_CS_KNOWLEDGE.operatingHours,
        contactPhone: parsed.contactPhone?.trim() || DEFAULT_WHATSAPP_CS_KNOWLEDGE.contactPhone,
        contactEmail: parsed.contactEmail?.trim() || DEFAULT_WHATSAPP_CS_KNOWLEDGE.contactEmail,
        serviceCatalog: parsed.serviceCatalog?.trim() || DEFAULT_WHATSAPP_CS_KNOWLEDGE.serviceCatalog,
        moqAndPricing: parsed.moqAndPricing?.trim() || DEFAULT_WHATSAPP_CS_KNOWLEDGE.moqAndPricing,
        shopeeUrl: parsed.shopeeUrl?.trim() || DEFAULT_WHATSAPP_CS_KNOWLEDGE.shopeeUrl,
        tokopediaUrl: parsed.tokopediaUrl?.trim() || DEFAULT_WHATSAPP_CS_KNOWLEDGE.tokopediaUrl,
        lazadaUrl: parsed.lazadaUrl?.trim() || DEFAULT_WHATSAPP_CS_KNOWLEDGE.lazadaUrl,
        tiktokShopUrl: parsed.tiktokShopUrl?.trim() || DEFAULT_WHATSAPP_CS_KNOWLEDGE.tiktokShopUrl,
        customTrainingNotes: parsed.customTrainingNotes?.trim() || DEFAULT_WHATSAPP_CS_KNOWLEDGE.customTrainingNotes,
      }
      csKnowledgeCache = { data: merged, timestamp: now }
      return merged
    }
  } catch (err) {
    console.warn("Gagal fetch whatsapp_cs_knowledge_config dari database:", err)
  }

  csKnowledgeCache = { data: DEFAULT_WHATSAPP_CS_KNOWLEDGE, timestamp: now }
  return DEFAULT_WHATSAPP_CS_KNOWLEDGE
}

/**
 * Menyimpan data knowledge base & instruksi pelatihan CS WhatsApp ke database
 */
export async function saveWhatsAppCsKnowledgeServer(
  newKnowledge: Partial<WhatsAppCsKnowledgeConfig>
): Promise<{ success: boolean; error?: string }> {
  try {
    const current = await getWhatsAppCsKnowledgeServer()
    const merged: WhatsAppCsKnowledgeConfig = {
      pabrikAddress: newKnowledge.pabrikAddress?.trim() || current.pabrikAddress,
      operatingHours: newKnowledge.operatingHours?.trim() || current.operatingHours,
      contactPhone: newKnowledge.contactPhone?.trim() || current.contactPhone,
      contactEmail: newKnowledge.contactEmail?.trim() || current.contactEmail,
      serviceCatalog: newKnowledge.serviceCatalog?.trim() || current.serviceCatalog,
      moqAndPricing: newKnowledge.moqAndPricing?.trim() || current.moqAndPricing,
      shopeeUrl: newKnowledge.shopeeUrl !== undefined ? newKnowledge.shopeeUrl.trim() : (current.shopeeUrl || DEFAULT_WHATSAPP_CS_KNOWLEDGE.shopeeUrl),
      tokopediaUrl: newKnowledge.tokopediaUrl !== undefined ? newKnowledge.tokopediaUrl.trim() : (current.tokopediaUrl || DEFAULT_WHATSAPP_CS_KNOWLEDGE.tokopediaUrl),
      lazadaUrl: newKnowledge.lazadaUrl !== undefined ? newKnowledge.lazadaUrl.trim() : (current.lazadaUrl || DEFAULT_WHATSAPP_CS_KNOWLEDGE.lazadaUrl),
      tiktokShopUrl: newKnowledge.tiktokShopUrl !== undefined ? newKnowledge.tiktokShopUrl.trim() : (current.tiktokShopUrl || DEFAULT_WHATSAPP_CS_KNOWLEDGE.tiktokShopUrl),
      customTrainingNotes: newKnowledge.customTrainingNotes?.trim() || current.customTrainingNotes,
    }

    const stringified = JSON.stringify(merged)
    const { data: existing } = await supabase
      .from("app_config")
      .select("id")
      .eq("key", WHATSAPP_CS_KNOWLEDGE_DB_KEY)
      .maybeSingle()

    if (existing?.id) {
      const { error } = await supabase
        .from("app_config")
        .update({ value: stringified, updated_at: new Date().toISOString() })
        .eq("key", WHATSAPP_CS_KNOWLEDGE_DB_KEY)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from("app_config")
        .insert({ key: WHATSAPP_CS_KNOWLEDGE_DB_KEY, value: stringified })
      if (error) throw error
    }

    csKnowledgeCache = { data: merged, timestamp: Date.now() }
    return { success: true }
  } catch (err: any) {
    console.error("Gagal menyimpan whatsapp_cs_knowledge_config:", err)
    return { success: false, error: err.message || "Gagal menyimpan knowledge base CS" }
  }
}
