"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Save,
  RotateCcw,
  Sparkles,
  Bot,
  Cpu,
  KeyRound,
  Globe2,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Loader2,
  Zap,
  Search,
  ChevronDown,
  ChevronUp,
  Check,
  Activity,
  MessageSquare,
  MapPin,
  Clock,
  Phone,
  Mail,
  Package,
  Layers,
  BookOpen,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  DEFAULT_BASE_SYSTEM_PROMPT,
  DEFAULT_WHATSAPP_CS_KNOWLEDGE,
} from "@/lib/ai-config"

interface AiSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved?: () => void
}

export function AiSettingsModal({ isOpen, onClose, onSaved }: AiSettingsModalProps) {
  const [activeMainTab, setActiveMainTab] = useState<"gateway" | "cs_training">("gateway")

  const [baseUrl, setBaseUrl] = useState("https://ai.indogreennature.com/v1")
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [defaultModel, setDefaultModel] = useState("kc/kilo-auto/free")
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_BASE_SYSTEM_PROMPT)
  const [temperature, setTemperature] = useState(0.7)

  // State Pelatihan CS WhatsApp Support
  const [csPabrikAddress, setCsPabrikAddress] = useState(DEFAULT_WHATSAPP_CS_KNOWLEDGE.pabrikAddress)
  const [csOperatingHours, setCsOperatingHours] = useState(DEFAULT_WHATSAPP_CS_KNOWLEDGE.operatingHours)
  const [csContactPhone, setCsContactPhone] = useState(DEFAULT_WHATSAPP_CS_KNOWLEDGE.contactPhone)
  const [csContactEmail, setCsContactEmail] = useState(DEFAULT_WHATSAPP_CS_KNOWLEDGE.contactEmail)
  const [csServiceCatalog, setCsServiceCatalog] = useState(DEFAULT_WHATSAPP_CS_KNOWLEDGE.serviceCatalog)
  const [csMoqAndPricing, setCsMoqAndPricing] = useState(DEFAULT_WHATSAPP_CS_KNOWLEDGE.moqAndPricing)
  const [csCustomTrainingNotes, setCsCustomTrainingNotes] = useState(DEFAULT_WHATSAPP_CS_KNOWLEDGE.customTrainingNotes)
  const [isSavingCs, setIsSavingCs] = useState(false)

  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    latencyMs?: number
    message: string
  } | null>(null)

  const [isTestingModel, setIsTestingModel] = useState(false)
  const [modelTestResult, setModelTestResult] = useState<{
    success: boolean
    latencyMs?: number
    message: string
    sampleResponse?: string
  } | null>(null)
  const [modelSearch, setModelSearch] = useState("")
  const [modelTab, setModelTab] = useState<"all" | "auto" | "free" | "openai" | "google" | "deepseek" | "claude">("all")
  const [isComboboxOpen, setIsComboboxOpen] = useState(false)

  // Ambil konfigurasi aktif saat modal dibuka
  useEffect(() => {
    if (!isOpen) return

    let isMounted = true
    setIsLoading(true)
    setTestResult(null)

    fetch("/api/ai")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return
        if (data.success && data.config) {
          if (data.config.baseUrl) setBaseUrl(data.config.baseUrl)
          if (data.config.defaultModel) setDefaultModel(data.config.defaultModel)
          if (data.config.systemPrompt) setSystemPrompt(data.config.systemPrompt)
          if (typeof data.config.temperature === "number") setTemperature(data.config.temperature)
        }
        if (data.success && data.whatsappKnowledge) {
          const wk = data.whatsappKnowledge
          if (wk.pabrikAddress) setCsPabrikAddress(wk.pabrikAddress)
          if (wk.operatingHours) setCsOperatingHours(wk.operatingHours)
          if (wk.contactPhone) setCsContactPhone(wk.contactPhone)
          if (wk.contactEmail) setCsContactEmail(wk.contactEmail)
          if (wk.serviceCatalog) setCsServiceCatalog(wk.serviceCatalog)
          if (wk.moqAndPricing) setCsMoqAndPricing(wk.moqAndPricing)
          if (wk.customTrainingNotes) setCsCustomTrainingNotes(wk.customTrainingNotes)
        }
        if (Array.isArray(data.models) && data.models.length > 0) {
          setAvailableModels(data.models)
        }
      })
      .catch((err) => {
        console.warn("Gagal memuat konfigurasi AI:", err)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [isOpen])

  // Uji koneksi ke endpoint OmniRoute
  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "test_connection",
          payload: {
            baseUrl,
            apiKey: apiKey || undefined,
          },
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          latencyMs: data.latencyMs,
          message: `Koneksi berhasil! Latensi: ${data.latencyMs}ms (${data.modelsCount || 0} model aktif di VPS).`,
        })
        if (Array.isArray(data.models) && data.models.length > 0) {
          setAvailableModels(data.models)
        }
        toast.success(`Koneksi AI Gateway Berhasil (${data.latencyMs}ms)`)
      } else {
        setTestResult({
          success: false,
          latencyMs: data.latencyMs,
          message: data.error || "Gagal menghubungkan ke OmniRoute Gateway.",
        })
        toast.error("Gagal menghubungkan ke AI Gateway")
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "Terjadi kesalahan jaringan.",
      })
      toast.error("Gagal uji koneksi")
    } finally {
      setIsTesting(false)
    }
  }

  // Uji coba model tertentu secara spesifik (Health Check & Latensi Model)
  const handleTestModel = async (modelToTest?: string) => {
    const target = (modelToTest || defaultModel).trim()
    if (!target) {
      toast.error("Pilih atau ketik model yang ingin diuji")
      return
    }
    setIsTestingModel(true)
    setModelTestResult(null)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "test_model",
          payload: {
            model: target,
            baseUrl: baseUrl.trim(),
            apiKey: apiKey ? apiKey.trim() : undefined,
          },
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setModelTestResult({
          success: true,
          latencyMs: data.latencyMs,
          message: `Model aktif (${data.latencyMs}ms)`,
          sampleResponse: data.sampleResponse,
        })
        toast.success(`Model ${target} Aktif (${data.latencyMs}ms)`)
      } else {
        setModelTestResult({
          success: false,
          latencyMs: data.latencyMs,
          message: data.error || "Model tidak merespons atau provider offline.",
        })
        toast.error(`Model ${target} Gagal diuji`)
      }
    } catch (err: any) {
      setModelTestResult({
        success: false,
        message: err.message || "Gagal menguji model.",
      })
      toast.error("Gagal uji model")
    } finally {
      setIsTestingModel(false)
    }
  }

  // Filter daftar model berdasarkan Tab kategori & input pencarian
  const filteredModels = React.useMemo(() => {
    if (!availableModels || availableModels.length === 0) return []
    return availableModels.filter((m) => {
      const lower = m.toLowerCase()
      if (modelTab === "auto" && !lower.startsWith("auto/")) return false
      if (modelTab === "free" && !lower.includes("free")) return false
      if (modelTab === "openai" && !lower.includes("gpt") && !lower.includes("openai")) return false
      if (modelTab === "google" && !lower.includes("gemini") && !lower.includes("google") && !lower.includes("gemma")) return false
      if (modelTab === "deepseek" && !lower.includes("deepseek")) return false
      if (modelTab === "claude" && !lower.includes("claude") && !lower.includes("anthropic")) return false

      if (modelSearch.trim()) {
        const q = modelSearch.toLowerCase().trim()
        return lower.includes(q)
      }
      return true
    })
  }, [availableModels, modelTab, modelSearch])

  // Simpan konfigurasi ke database
  const handleSave = async () => {
    if (!baseUrl.trim()) {
      toast.error("Base URL tidak boleh kosong")
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "save_config",
          payload: {
            baseUrl: baseUrl.trim(),
            apiKey: apiKey ? apiKey.trim() : undefined,
            defaultModel: defaultModel.trim(),
            systemPrompt: systemPrompt.trim(),
            temperature: Number(temperature),
          },
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success("Pengaturan AI Gateway berhasil disimpan!")
        if (typeof window !== "undefined") {
          localStorage.setItem("indogreen_ai_model", defaultModel.trim())
        }
        onSaved?.()
        onClose()
      } else {
        toast.error(data.error || "Gagal menyimpan konfigurasi.")
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan saat menyimpan.")
    } finally {
      setIsSaving(false)
    }
  }

  // Reset ke pengaturan bawaan
  const handleReset = async () => {
    if (!window.confirm("Kembalikan konfigurasi AI ke pengaturan bawaan (.env.local)?")) {
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "reset_config" }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success("Konfigurasi AI direset ke pengaturan bawaan.")
        setBaseUrl("https://ai.indogreennature.com/v1")
        setApiKey("")
        setDefaultModel("kc/kilo-auto/free")
        setSystemPrompt(DEFAULT_BASE_SYSTEM_PROMPT)
        setTemperature(0.7)
        setTestResult(null)
      } else {
        toast.error(data.error || "Gagal mereset konfigurasi.")
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mereset konfigurasi.")
    } finally {
      setIsSaving(false)
    }
  }

  // Simpan Pelatihan & Knowledge Base CS WhatsApp
  const handleSaveCsKnowledge = async () => {
    setIsSavingCs(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "save_cs_knowledge",
          payload: {
            pabrikAddress: csPabrikAddress.trim(),
            operatingHours: csOperatingHours.trim(),
            contactPhone: csContactPhone.trim(),
            contactEmail: csContactEmail.trim(),
            serviceCatalog: csServiceCatalog.trim(),
            moqAndPricing: csMoqAndPricing.trim(),
            customTrainingNotes: csCustomTrainingNotes.trim(),
          },
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success("Pelatihan CS WhatsApp berhasil disimpan & aktif!")
        onSaved?.()
        onClose()
      } else {
        toast.error(data.error || "Gagal menyimpan pelatihan CS.")
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan data pelatihan CS.")
    } finally {
      setIsSavingCs(false)
    }
  }

  // Reset Pelatihan CS ke Bawaan
  const handleResetCsKnowledge = () => {
    if (!window.confirm("Kembalikan basis pengetahuan CS WhatsApp ke bawaan CV. Indo Green Nature?")) {
      return
    }
    setCsPabrikAddress(DEFAULT_WHATSAPP_CS_KNOWLEDGE.pabrikAddress)
    setCsOperatingHours(DEFAULT_WHATSAPP_CS_KNOWLEDGE.operatingHours)
    setCsContactPhone(DEFAULT_WHATSAPP_CS_KNOWLEDGE.contactPhone)
    setCsContactEmail(DEFAULT_WHATSAPP_CS_KNOWLEDGE.contactEmail)
    setCsServiceCatalog(DEFAULT_WHATSAPP_CS_KNOWLEDGE.serviceCatalog)
    setCsMoqAndPricing(DEFAULT_WHATSAPP_CS_KNOWLEDGE.moqAndPricing)
    setCsCustomTrainingNotes(DEFAULT_WHATSAPP_CS_KNOWLEDGE.customTrainingNotes)
    toast.info("Data pelatihan CS dikembalikan ke template bawaan.")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-card border border-border/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/70 bg-gradient-to-r from-zinc-50 to-green-50/30 dark:from-zinc-900/80 dark:to-green-950/20">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-[7px] bg-[#15803d]/15 text-[#15803d] dark:text-green-400 flex items-center justify-center shrink-0 border border-[#15803d]/30 shadow-xs">
                  <Bot className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                    <span>Pengaturan AI Gateway</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                      Live Config
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Konfigurasi endpoint VPS, API key, model utama, dan persona sistem langsung dari web
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                title="Tutup"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Tab Bar Switcher */}
            <div className="flex border-b border-border/70 bg-muted/20 px-5 pt-2 gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveMainTab("gateway")}
                className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeMainTab === "gateway"
                    ? "border-[#15803d] text-[#15803d] dark:text-emerald-400 font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sliders className="size-3.5" />
                <span>Model & Gateway AI</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMainTab("cs_training")}
                className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeMainTab === "cs_training"
                    ? "border-[#15803d] text-[#15803d] dark:text-emerald-400 font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <MessageSquare className="size-3.5 text-emerald-500" />
                <span>Latih CS WhatsApp</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-500/20 text-emerald-500 font-mono">
                  Pintar
                </span>
              </button>
            </div>

            {/* Isi Formulir Konfigurasi */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs">
              {isLoading && (
                <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground">
                  <Loader2 className="size-4 animate-spin text-[#15803d]" />
                  <span>Memuat konfigurasi AI & Knowledge CS...</span>
                </div>
              )}

              {activeMainTab === "cs_training" ? (
                <div className="space-y-4">
                  {/* Penjelasan Ringkas */}
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-foreground flex items-start gap-2.5">
                    <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-semibold text-emerald-800 dark:text-emerald-300 text-xs">
                        Pelatihan & Basis Pengetahuan Customer Service CV. Indo Green Nature
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Data dan instruksi di bawah ini langsung dihafal oleh AI saat menjawab pertanyaan di widget WhatsApp. Anda dapat memperbarui alamat, katalog sediaan produk, jam kerja, nomor kontak, maupun instruksi khusus kapan saja.
                      </p>
                    </div>
                  </div>

                  {/* FIELD 1: ALAMAT PABRIK */}
                  <div className="space-y-1.5 p-3.5 rounded-xl bg-muted/40 border border-border/70">
                    <label className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                      <MapPin className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      Alamat Pabrik & Fasilitas Produksi
                    </label>
                    <Textarea
                      rows={2}
                      value={csPabrikAddress}
                      onChange={(e) => setCsPabrikAddress(e.target.value)}
                      placeholder="Alamat lengkap fasilitas produksi CV. Indo Green Nature..."
                      className="text-xs bg-background leading-relaxed"
                    />
                    <p className="text-[10.5px] text-muted-foreground">
                      AI akan otomatis menyajikan alamat ini saat penanya bertanya lokasi pabrik atau ingin berkunjung/audit.
                    </p>
                  </div>

                  {/* FIELD 2 & 3: JAM OPERASIONAL & KONTAK */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5 p-3.5 rounded-xl bg-muted/40 border border-border/70">
                      <label className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                        <Clock className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        Jam Operasional Kantor & Pabrik
                      </label>
                      <Input
                        value={csOperatingHours}
                        onChange={(e) => setCsOperatingHours(e.target.value)}
                        placeholder="Senin – Jumat: 08.00 – 17.00 WIB..."
                        className="text-xs bg-background h-8.5"
                      />
                    </div>

                    <div className="space-y-1.5 p-3.5 rounded-xl bg-muted/40 border border-border/70">
                      <label className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                        <Phone className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        Nomor WhatsApp & Email Resmi
                      </label>
                      <Input
                        value={csContactPhone}
                        onChange={(e) => setCsContactPhone(e.target.value)}
                        placeholder="0858-7766-9199 / 0821-3636-8880"
                        className="text-xs bg-background h-8.5"
                      />
                    </div>
                  </div>

                  {/* FIELD 4: LAYANAN & KATALOG SEDIAAN */}
                  <div className="space-y-1.5 p-3.5 rounded-xl bg-muted/40 border border-border/70">
                    <label className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                      <Package className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      Layanan & Katalog Bentuk Sediaan Maklon Herbal (CPOTB Tahap II)
                    </label>
                    <Textarea
                      rows={4}
                      value={csServiceCatalog}
                      onChange={(e) => setCsServiceCatalog(e.target.value)}
                      placeholder="Daftar sediaan: kapsul herbal, cairan obat dalam/madu, serbuk minuman, teh herbal..."
                      className="text-xs bg-background leading-relaxed font-mono text-[11px]"
                    />
                    <p className="text-[10.5px] text-muted-foreground">
                      Cantumkan sediaan yang bisa diproduksi (kapsul, cair/madu, serbuk seduh/fiber, teh herbal, perizinan BPOM TR/MD & Halal).
                    </p>
                  </div>

                  {/* FIELD 5: MINIMAL ORDER (MOQ) & BIAYA */}
                  <div className="space-y-1.5 p-3.5 rounded-xl bg-muted/40 border border-border/70">
                    <label className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                      <Layers className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      Kebijakan Minimal Order (MOQ) & Biaya
                    </label>
                    <Textarea
                      rows={2}
                      value={csMoqAndPricing}
                      onChange={(e) => setCsMoqAndPricing(e.target.value)}
                      placeholder="MOQ mulai 1.000 botol/pcs, konsultasi formula gratis..."
                      className="text-xs bg-background leading-relaxed"
                    />
                  </div>

                  {/* FIELD 6: INSTRUKSI & PELATIHAN KHUSUS ADMIN */}
                  <div className="space-y-1.5 p-3.5 rounded-xl bg-muted/40 border border-border/70">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                        <BookOpen className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        Instruksi Pelatihan Khusus & Aturan CS (Prompt Pelatihan)
                      </label>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Bebas Atur Instruksi</span>
                    </div>
                    <Textarea
                      rows={6}
                      value={csCustomTrainingNotes}
                      onChange={(e) => setCsCustomTrainingNotes(e.target.value)}
                      placeholder="Tulis instruksi khusus untuk melatih CS, promo bulan ini, larangan klaim, atau gaya bicara..."
                      className="text-xs bg-background leading-relaxed font-mono text-[11px]"
                    />
                    <p className="text-[10.5px] text-muted-foreground">
                      💡 Anda dapat menambahkan aturan baru kapan saja: misal promo bulan ini, panduan diskon sampling, atau cara menjawab pertanyaan unik calon mitra.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* SECTION 1: KONEKSI GATEWAY */}
              <div className="space-y-3.5 p-4 rounded-[8px] bg-muted/40 border border-border/70">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                    <Globe2 className="size-3.5 text-[#15803d]" />
                    Endpoint VPS & Kredensial OmniRoute
                  </span>
                  <span className="text-[10px] text-muted-foreground">OpenAI-Compatible API</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-muted-foreground block">
                      OmniRoute Base URL:
                    </label>
                    <Input
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                      placeholder="https://ai.indogreennature.com/v1"
                      className="h-8.5 text-xs font-mono bg-background rounded-[5px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-muted-foreground block">
                      API Key (Opsional / Override):
                    </label>
                    <div className="relative">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-•••• (Kosongkan jika pakai .env)"
                        className="h-8.5 text-xs font-mono pr-8 bg-background rounded-[5px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                        title={showApiKey ? "Sembunyikan" : "Tampilkan"}
                      >
                        {showApiKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Uji Koneksi Button & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-border/50">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="h-8 text-xs gap-1.5 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 shrink-0 font-medium"
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        <span>Menguji Koneksi...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="size-3.5 text-emerald-600" />
                        <span>Uji Koneksi & Ping</span>
                      </>
                    )}
                  </Button>

                  {testResult && (
                    <div
                      className={`text-[11px] flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] border ${testResult.success
                          ? "bg-green-500/10 border-green-500/30 text-green-800 dark:text-green-300"
                          : "bg-destructive/10 border-destructive/30 text-destructive"
                        }`}
                    >
                      {testResult.success ? (
                        <CheckCircle2 className="size-3.5 shrink-0" />
                      ) : (
                        <AlertCircle className="size-3.5 shrink-0" />
                      )}
                      <span className="truncate">{testResult.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: TABCOMBOBOX MODEL & UJI MODEL LIVE */}
              <div className="space-y-3 p-4 rounded-[8px] bg-muted/40 border border-border/70">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                    <Cpu className="size-3.5 text-[#15803d]" />
                    Model Default Sistem
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 font-mono">
                      {availableModels.length > 0 ? `${availableModels.length} Model VPS Terbaca` : "Manual"}
                    </span>
                  </div>
                </div>

                {/* Input Model & Tombol Uji Live */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-medium text-muted-foreground block">
                      ID Model Aktif:
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsComboboxOpen((prev) => !prev)}
                      className="text-[10px] text-[#15803d] hover:underline flex items-center gap-0.5 cursor-pointer font-medium"
                    >
                      <span>{isComboboxOpen ? "Tutup Katalog Model" : "Buka Tab Combobox"}</span>
                      {isComboboxOpen ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        value={defaultModel}
                        onChange={(e) => {
                          setDefaultModel(e.target.value)
                          setModelTestResult(null)
                        }}
                        placeholder="Contoh: ddgw/gpt-5.4-mini atau kc/kilo-auto/free"
                        className="h-8.5 text-xs font-mono bg-background rounded-[5px] pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setIsComboboxOpen((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Buka / Tutup Pilihan Model"
                      >
                        <ChevronDown className="size-3.5" />
                      </button>
                    </div>

                    {/* Tombol Uji Model Ini */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestModel()}
                      disabled={isTestingModel || !defaultModel.trim()}
                      className="h-8.5 px-3 text-xs gap-1.5 border-[#15803d]/40 text-[#15803d] hover:bg-[#15803d]/10 shrink-0 cursor-pointer"
                      title="Kirim ping real-time ke VPS untuk menguji respon model ini"
                    >
                      {isTestingModel ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          <span>Menguji...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="size-3.5" />
                          <span>Tes Model</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Hasil Uji Model Spesifik */}
                  {modelTestResult && (
                    <div
                      className={`text-[11px] flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-[5px] border ${
                        modelTestResult.success
                          ? "bg-green-500/10 border-green-500/30 text-green-800 dark:text-green-300"
                          : "bg-destructive/10 border-destructive/30 text-destructive"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        {modelTestResult.success ? (
                          <CheckCircle2 className="size-3.5 shrink-0" />
                        ) : (
                          <AlertCircle className="size-3.5 shrink-0" />
                        )}
                        <span className="truncate font-medium">{modelTestResult.message}</span>
                      </div>
                      {modelTestResult.sampleResponse && (
                        <span className="text-[10px] font-mono bg-background/80 px-1.5 py-0.5 rounded border shrink-0">
                          Respon: &quot;{modelTestResult.sampleResponse}&quot;
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* TABCOMBOBOX PANEL (Search + Category Tabs + Model Grid) */}
                {(isComboboxOpen || availableModels.length > 0) && (
                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={modelSearch}
                          onChange={(e) => setModelSearch(e.target.value)}
                          placeholder="Cari model VPS (misal: 5.4, free, gpt, gemini, claude, deepseek)..."
                          className="w-full pl-8 pr-7 py-1 text-xs rounded-[5px] bg-background border border-border/70 focus:outline-none focus:ring-1 focus:ring-[#15803d]"
                        />
                        {modelSearch && (
                          <button
                            type="button"
                            onClick={() => setModelSearch("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            <X className="size-3" />
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                        {filteredModels.length} / {availableModels.length}
                      </span>
                    </div>

                    {/* Kategori Tabs */}
                    <div className="flex flex-wrap items-center gap-1">
                      {[
                        { id: "all", label: "Semua" },
                        { id: "free", label: "🎁 Free" },
                        { id: "auto", label: "⚡ Auto Router" },
                        { id: "openai", label: "OpenAI / GPT" },
                        { id: "google", label: "Google / Gemini" },
                        { id: "deepseek", label: "DeepSeek" },
                        { id: "claude", label: "Claude" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setModelTab(tab.id as any)}
                          className={`text-[10px] px-2 py-0.5 rounded-[4px] border transition-colors cursor-pointer ${
                            modelTab === tab.id
                              ? "bg-[#15803d] text-white border-[#15803d] font-semibold"
                              : "bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Model Grid Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-48 overflow-y-auto p-1.5 bg-background/60 rounded-[6px] border border-border/60 scrollbar-thin">
                      {filteredModels.slice(0, 100).map((m) => {
                        const isSelected = defaultModel === m
                        return (
                          <div
                            key={m}
                            onClick={() => {
                              setDefaultModel(m)
                              setModelTestResult(null)
                            }}
                            className={`group flex items-center justify-between px-2 py-1 rounded-[4px] border text-left cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-[#15803d]/15 border-[#15803d] text-[#15803d] dark:text-green-300 font-semibold shadow-2xs"
                                : "bg-card hover:bg-muted/70 border-border/50 text-foreground"
                            }`}
                          >
                            <span className="text-[10.5px] font-mono truncate mr-1.5" title={m}>
                              {m}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              {isSelected && <Check className="size-3 text-[#15803d]" />}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDefaultModel(m)
                                  handleTestModel(m)
                                }}
                                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-emerald-500/20 rounded text-[9px] text-muted-foreground hover:text-[#15803d] transition-opacity"
                                title={`Uji model ${m}`}
                              >
                                <Zap className="size-2.5" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                      {filteredModels.length === 0 && (
                        <div className="col-span-2 py-4 text-center text-xs text-muted-foreground">
                          Tidak ada model yang cocok dengan kata kunci &quot;{modelSearch}&quot;
                        </div>
                      )}
                      {filteredModels.length > 100 && (
                        <div className="col-span-2 py-1 text-center text-[10px] text-muted-foreground font-mono">
                          +{filteredModels.length - 100} model lainnya... ketik di kolom cari untuk mempersempit.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: SYSTEM PROMPT / PERSONA PERUSAHAAN */}
              <div className="space-y-2 p-4 rounded-[8px] bg-muted/40 border border-border/70">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                    <Bot className="size-3.5 text-[#15803d]" />
                    Persona & Konteks Bisnis Perusahaan (System Prompt)
                  </span>
                  <button
                    type="button"
                    onClick={() => setSystemPrompt(DEFAULT_BASE_SYSTEM_PROMPT)}
                    className="text-[10px] text-[#15803d] hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="size-2.5" />
                    Reset Teks Persona
                  </button>
                </div>
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={4}
                  className="text-xs bg-background rounded-[5px] leading-relaxed resize-y"
                  placeholder="Konteks dasar yang akan selalu disertakan dalam setiap pemanggilan AI..."
                />
              </div>

              {/* SECTION 4: TEMPERATURE (KREATIVITAS) */}
              <div className="space-y-2 p-4 rounded-[8px] bg-muted/40 border border-border/70">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                    <Sliders className="size-3.5 text-[#15803d]" />
                    Parameter Kreativitas (Temperature): {temperature}
                  </span>
                  <span className="text-[10.5px] font-medium text-emerald-800 dark:text-emerald-300">
                    {temperature <= 0.3
                      ? "Presisi & Faktual"
                      : temperature <= 0.7
                        ? "Seimbang (Rekomendasi)"
                        : "Eksploratif & Kreatif"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-muted-foreground/30 rounded-lg appearance-none cursor-pointer accent-[#15803d]"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>0.1 (Faktual & Konsisten)</span>
                  <span>0.7 (Default)</span>
                  <span>1.0 (Kreatif)</span>
                </div>
              </div>
            </>
          )}
            </div>

            {/* Footer Modal Actions */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-border/70 bg-muted/20">
              {activeMainTab === "cs_training" ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResetCsKnowledge}
                    disabled={isSavingCs}
                    className="h-8.5 text-xs text-muted-foreground hover:text-destructive gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="size-3.5" />
                    <span>Kembalikan Bawaan CS</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onClose}
                      disabled={isSavingCs}
                      className="h-8.5 text-xs rounded-[5px] cursor-pointer"
                    >
                      Batal
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleSaveCsKnowledge}
                      disabled={isSavingCs}
                      className="h-8.5 text-xs rounded-[5px] bg-[#15803d] hover:bg-[#166534] text-white gap-1.5 shadow-xs font-semibold cursor-pointer"
                    >
                      {isSavingCs ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          <span>Menyimpan Pelatihan...</span>
                        </>
                      ) : (
                        <>
                          <Save className="size-3.5" />
                          <span>Simpan Pelatihan CS</span>
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    disabled={isSaving}
                    className="h-8.5 text-xs text-muted-foreground hover:text-destructive gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="size-3.5" />
                    <span>Reset ke .env</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onClose}
                      disabled={isSaving}
                      className="h-8.5 text-xs rounded-[5px] cursor-pointer"
                    >
                      Batal
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="h-8.5 text-xs rounded-[5px] bg-[#15803d] hover:bg-[#166534] text-white gap-1.5 shadow-xs font-semibold cursor-pointer"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <Save className="size-3.5" />
                          <span>Simpan Pengaturan</span>
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
