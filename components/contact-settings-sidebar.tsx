"use client"

import * as React from "react"
import {
  X,
  Save,
  RotateCcw,
  Eye,
  Check,
  Building2,
  ExternalLink,
  ChevronRight,
  ImageIcon,
  Type,
  Palette,
  Upload,
  Trash2,
  Loader2,
  ChevronDown,
  Plus,
  PhoneCall,
  MapPin,
  Mail,
  HelpCircle,
  Briefcase,
  Layers,
  MessageSquare,
} from "lucide-react"
import { uploadMedia } from "@/lib/storage"
import { poppins, HERO_FONTS } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import {
  ContactSettingsData,
  DEFAULT_CONTACT_SETTINGS,
  CONTACT_SETTINGS_KEY,
  CONTACT_PREVIEW_CHANNEL,
  ContactFaqItem,
  ContactServiceCard,
} from "@/lib/contact-settings"

interface ContactSettingsSidebarProps {
  isOpen: boolean
  onClose: () => void
  data: ContactSettingsData
  onChange: (updated: ContactSettingsData) => void
  onSave: () => void
  onReset: () => void
  onScrollToSection?: (sectionId: string) => void
  isSaving?: boolean
}

type ContactTabKey =
  | "banner"
  | "kontak"
  | "form"
  | "maps"
  | "layanan"
  | "faq"

function toSafeHexColor(color: string | undefined | null, fallback: string = "#1e5631"): string {
  if (!color || typeof color !== "string") return fallback
  const trimmed = color.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed
  }
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`
  }
  return fallback
}

import { FontSelect } from "@/components/ui/font-combobox"

function ColorPickerInput({
  label,
  value,
  onChange,
  defaultColor = "#1e5631",
}: {
  label: string
  value?: string
  onChange: (color: string) => void
  defaultColor?: string
}) {
  const safeColor = toSafeHexColor(value, defaultColor)

  return (
    <div className="flex items-center justify-between gap-3 p-2.5 rounded-[5px] bg-muted/40 border border-border">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        <span className="text-[10px] text-muted-foreground">{value || "Default (Hijau Hutan)"}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] text-muted-foreground hover:text-red-500 underline"
            title="Reset ke default"
          >
            Reset
          </button>
        )}
        <input
          type="color"
          value={safeColor}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-[5px] border border-border cursor-pointer bg-transparent"
        />
      </div>
    </div>
  )
}

export function ContactSettingsSidebar({
  isOpen,
  onClose,
  data,
  onChange,
  onSave,
  onReset,
  onScrollToSection,
  isSaving = false,
}: ContactSettingsSidebarProps) {
  const [activeTab, setActiveTab] = React.useState<ContactTabKey>("banner")
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isUploadingLogo, setIsUploadingLogo] = React.useState(false)

  if (!isOpen) return null

  // Sinkronisasi real-time lintas tab (BroadcastChannel + localStorage)
  const broadcastPreviewUpdate = (updated: ContactSettingsData) => {
    onChange(updated)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CONTACT_SETTINGS_KEY, JSON.stringify(updated))
      } catch {
        // ignore
      }
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const bc = new BroadcastChannel(CONTACT_PREVIEW_CHANNEL)
          bc.postMessage({ type: "PREVIEW_UPDATE", data: updated })
          bc.close()
        }
      } catch {
        // ignore
      }
    }
  }

  const handleFieldChange = <K extends keyof ContactSettingsData>(
    field: K,
    val: ContactSettingsData[K]
  ) => {
    broadcastPreviewUpdate({
      ...data,
      [field]: val,
    })
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingLogo(true)
    try {
      let photoUrl: string | null = null
      try {
        photoUrl = await uploadMedia(file, "contact")
      } catch (err) {
        console.warn("Upload storage gagal, beralih ke data URL:", err)
      }

      if (!photoUrl) {
        photoUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      if (photoUrl) {
        handleFieldChange("bannerLogo", photoUrl)
      }
    } catch (err) {
      console.error("Gagal memproses upload gambar:", err)
    } finally {
      setIsUploadingLogo(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Update specific service card
  const handleUpdateCard = (idx: number, updated: Partial<ContactServiceCard>) => {
    const newCards = [...data.serviceCards]
    newCards[idx] = { ...newCards[idx], ...updated }
    handleFieldChange("serviceCards", newCards)
  }

  // FAQ Handlers
  const handleAddFaq = () => {
    const newFaq: ContactFaqItem = {
      id: `faq-${Date.now()}`,
      question: "Pertanyaan Baru...",
      answer: "Tuliskan jawaban yang lengkap di sini...",
    }
    handleFieldChange("faqItems", [...data.faqItems, newFaq])
  }

  const handleUpdateFaq = (idx: number, updated: Partial<ContactFaqItem>) => {
    const newItems = [...data.faqItems]
    newItems[idx] = { ...newItems[idx], ...updated }
    handleFieldChange("faqItems", newItems)
  }

  const handleDeleteFaq = (idx: number) => {
    const newItems = data.faqItems.filter((_, i) => i !== idx)
    handleFieldChange("faqItems", newItems)
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs p-1.5 sm:p-3 md:p-4 transition-all duration-300">
      {/* Outer Modal Container */}
      <div className="w-[98vw] max-w-[1560px] h-[95vh] max-h-[920px] bg-white dark:bg-zinc-900 rounded-[8px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-200 dark:border-zinc-700 relative">

        {/* ─── SISI KIRI: SIDEBAR SESUAI KONSEP FIGMA ─── */}
        <div className="w-full md:w-[316px] md:min-w-[316px] md:max-w-[316px] flex flex-col bg-[#D9D9D9] dark:bg-zinc-800 border-r border-zinc-300 dark:border-zinc-700 shrink-0 select-none">
          {/* Header Sidebar: Figma .rectangle (w: 316px, h: 60px, bg: #D97706) */}
          <div className="w-full h-[60px] bg-[#D97706] px-4 flex items-center justify-between md:justify-center relative shadow-xs">
            <h2
              className={cn(
                "text-[12px] font-bold text-white tracking-wider uppercase text-center w-full",
                poppins.className
              )}
            >
              PENGATURAN CONTACT
            </h2>
            <button
              onClick={onClose}
              className="md:hidden text-white/80 hover:text-white p-1 rounded hover:bg-black/10 transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Sidebar: Menu tombol hijau #15803D */}
          <div className="flex-1 p-5 flex flex-col gap-3 overflow-y-auto">
            <button
              type="button"
              onClick={() => setActiveTab("banner")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-sm",
                poppins.className,
                activeTab === "banner"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              BANNER UTAMA
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("kontak")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-sm",
                poppins.className,
                activeTab === "kontak"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              KONTAK LANGSUNG
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("form")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-sm",
                poppins.className,
                activeTab === "form"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              FORMULIR PESAN
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("maps")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-sm",
                poppins.className,
                activeTab === "maps"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              ALAMAT &amp; MAPS
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("layanan")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-sm",
                poppins.className,
                activeTab === "layanan"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              LAYANAN KEMITRAAN
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("faq")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-sm",
                poppins.className,
                activeTab === "faq"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              FAQ (TANYA JAWAB)
            </button>
          </div>

          {/* Footer Sidebar: Tombol Simpan & Reset */}
          <div className="p-4 border-t border-zinc-300 dark:border-zinc-700 bg-white/40 dark:bg-black/20 flex flex-col gap-2">
            <button
              type="button"
              disabled={isSaving}
              onClick={onSave}
              className={cn(
                "w-full h-[40px] rounded-[5px] bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 disabled:opacity-70 cursor-pointer",
                poppins.className
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm("Kembalikan semua pengaturan kontak ke standar awal?")) {
                  onReset()
                }
              }}
              className={cn(
                "w-full h-[36px] rounded-[5px] border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer",
                poppins.className
              )}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ke Default</span>
            </button>
          </div>
        </div>

        {/* ─── SISI KANAN: PANEL FORM PENGATURAN ─── */}
        <div className="flex-1 flex flex-col bg-background overflow-hidden">
          {/* Header Panel Kanan */}
          <div className="h-[60px] px-6 border-b border-border flex items-center justify-between shrink-0 bg-card">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-primary">
                {activeTab === "banner" && "01. PENGATURAN BANNER UTAMA"}
                {activeTab === "kontak" && "02. PENGATURAN INFORMASI KONTAK"}
                {activeTab === "form" && "03. PENGATURAN FORMULIR PESAN"}
                {activeTab === "maps" && "04. PENGATURAN ALAMAT & MAPS"}
                {activeTab === "layanan" && "05. PENGATURAN LAYANAN KEMITRAAN"}
                {activeTab === "faq" && "06. PENGATURAN FAQ (TANYA JAWAB)"}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Tombol Pratinjau Halaman (Buka Tab Baru dengan preview=true) */}
              <button
                type="button"
                onClick={() => {
                  const targetId =
                    activeTab === "banner"
                      ? "banner-utama"
                      : activeTab === "kontak"
                        ? "kontak-langsung"
                        : activeTab === "form"
                          ? "form-email"
                          : activeTab === "maps"
                            ? "lokasi-maps"
                            : activeTab === "layanan"
                              ? "layanan-kemitraan"
                              : "faq-section"
                  if (typeof window !== "undefined") {
                    try {
                      // Simpan data pratinjau terkini ke localStorage agar langsung terbaca di tab baru
                      localStorage.setItem(CONTACT_SETTINGS_KEY, JSON.stringify(data))
                    } catch (e) {
                      console.error(e)
                    }
                    window.open(`/contact?preview=true#${targetId}`, "_blank")
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer shadow-xs"
                title="Buka Pratinjau Halaman di Tab Baru (preview=true)"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Pratinjau Halaman</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Tutup Pengaturan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form Content Scrollable Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">

            {/* ═════════ TAB 1: BANNER UTAMA ═════════ */}
            {activeTab === "banner" && (
              <div className="w-full space-y-6">
                {/* Judul Banner */}
                <div className="p-4 rounded-[5px] border border-border bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Judul Banner Utama
                    </label>
                  </div>
                  <input
                    type="text"
                    value={data.bannerTitle}
                    onChange={(e) => handleFieldChange("bannerTitle", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-[5px] text-sm border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                    placeholder="Hubungi Kami & Mulai Kerjasama"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                        Font Judul
                      </span>
                      <FontSelect
                        value={data.bannerTitleFont || "poppins"}
                        onChange={(val) => handleFieldChange("bannerTitleFont", val)}
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                        Ukuran Font ({data.bannerTitleSize || 48}px)
                      </span>
                      <input
                        type="range"
                        min={28}
                        max={64}
                        value={data.bannerTitleSize || 48}
                        onChange={(e) => handleFieldChange("bannerTitleSize", Number(e.target.value))}
                        className="w-full accent-[#15803D]"
                      />
                    </div>
                  </div>
                  <ColorPickerInput
                    label="Warna Teks Judul"
                    value={data.bannerTitleColor}
                    onChange={(c) => handleFieldChange("bannerTitleColor", c)}
                  />
                </div>

                {/* Deskripsi Banner */}
                <div className="p-4 rounded-[5px] border border-border bg-card space-y-3">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Deskripsi Banner
                  </label>
                  <textarea
                    rows={3}
                    value={data.bannerDesc}
                    onChange={(e) => handleFieldChange("bannerDesc", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-[5px] text-sm border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D] resize-none"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Gunakan format <strong>**teks**</strong> untuk menebalkan kata, contoh: <code>**Indo Green Nature**</code>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                        Font Deskripsi
                      </span>
                      <FontSelect
                        value={data.bannerDescFont || "poppins"}
                        onChange={(val) => handleFieldChange("bannerDescFont", val)}
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-muted-foreground mb-1 block">
                        Ukuran Font ({data.bannerDescSize || 15}px)
                      </span>
                      <input
                        type="range"
                        min={12}
                        max={20}
                        value={data.bannerDescSize || 15}
                        onChange={(e) => handleFieldChange("bannerDescSize", Number(e.target.value))}
                        className="w-full accent-[#15803D]"
                      />
                    </div>
                  </div>
                  <ColorPickerInput
                    label="Warna Teks Deskripsi"
                    value={data.bannerDescColor}
                    onChange={(c) => handleFieldChange("bannerDescColor", c)}
                  />
                </div>

                {/* Logo Perusahaan & Gap */}
                <div className="p-4 rounded-[5px] border border-border bg-card space-y-4">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Gambar Logo Perusahaan (Rasio 1:1)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-24 h-24 rounded-[5px] border border-border p-2 flex items-center justify-center shrink-0 bg-background/50">
                      <img
                        src={data.bannerLogo || "/logo.png"}
                        alt="Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={isUploadingLogo}
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-[5px] text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                      >
                        {isUploadingLogo ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>{isUploadingLogo ? "Mengunggah..." : "Upload Logo Baru"}</span>
                      </button>
                      <input
                        type="text"
                        value={data.bannerLogo}
                        onChange={(e) => handleFieldChange("bannerLogo", e.target.value)}
                        placeholder="Atau masukkan URL gambar..."
                        className="w-full px-3 py-1.5 rounded-[5px] text-xs border border-border bg-background text-foreground"
                      />
                    </div>
                  </div>

                  {/* Skala Besar / Kecil Gambar */}
                  <div className="flex flex-col gap-1.5 p-3 rounded-[5px] bg-background border border-border/80">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                      <span>Skala Besar / Kecil Gambar</span>
                      <span className="text-[10px] font-mono text-[#15803D] font-bold">
                        {data.bannerLogoScale ?? 100}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="range"
                        min={50}
                        max={150}
                        step={1}
                        value={data.bannerLogoScale ?? 100}
                        onChange={(e) =>
                          handleFieldChange(
                            "bannerLogoScale",
                            parseInt(e.target.value, 10) || 100
                          )
                        }
                        className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={50}
                          max={150}
                          value={data.bannerLogoScale ?? 100}
                          onChange={(e) =>
                            handleFieldChange(
                              "bannerLogoScale",
                              parseInt(e.target.value, 10) || 100
                            )
                          }
                          className="w-14 px-2 py-1 rounded bg-card border border-border text-xs font-mono font-bold text-center"
                        />
                        <span className="text-xs text-muted-foreground font-mono">%</span>
                      </div>
                      {(data.bannerLogoScale ?? 100) !== 100 && (
                        <button
                          type="button"
                          onClick={() => handleFieldChange("bannerLogoScale", 100)}
                          className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer shrink-0"
                          title="Reset skala ke 100%"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tombol CTA Banner */}
                <div className="p-4 rounded-[5px] border border-border bg-card space-y-3">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Tombol Banner
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground font-semibold">Teks Tombol 1</span>
                      <input
                        type="text"
                        value={data.bannerBtn1Text || "WhatsApp Bisnis"}
                        onChange={(e) => handleFieldChange("bannerBtn1Text", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-[5px] text-xs border border-border bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] text-muted-foreground font-semibold">Teks Tombol 2</span>
                      <input
                        type="text"
                        value={data.bannerBtn2Text || "Kirim Pesan"}
                        onChange={(e) => handleFieldChange("bannerBtn2Text", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-[5px] text-xs border border-border bg-background"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═════════ TAB 2: INFORMASI KONTAK ═════════ */}
            {activeTab === "kontak" && (
              <div className="w-full space-y-6">
                <div className="p-4 rounded-[5px] border border-border bg-card space-y-4">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Informasi Kontak Langsung
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-foreground">WhatsApp Umum (Nomor)</span>
                      <input
                        type="text"
                        value={data.whatsappNumber}
                        onChange={(e) => handleFieldChange("whatsappNumber", e.target.value)}
                        placeholder="6285877669199"
                        className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-foreground">WhatsApp Umum (Display)</span>
                      <input
                        type="text"
                        value={data.whatsappDisplay}
                        onChange={(e) => handleFieldChange("whatsappDisplay", e.target.value)}
                        placeholder="+62 858-7766-9199"
                        className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-foreground">WhatsApp Bisnis (Nomor)</span>
                      <input
                        type="text"
                        value={data.whatsappBisnisNumber}
                        onChange={(e) => handleFieldChange("whatsappBisnisNumber", e.target.value)}
                        placeholder="6282136368880"
                        className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-foreground">WhatsApp Bisnis (Display)</span>
                      <input
                        type="text"
                        value={data.whatsappBisnisDisplay}
                        onChange={(e) => handleFieldChange("whatsappBisnisDisplay", e.target.value)}
                        placeholder="+62 821-3636-8880"
                        className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">Email Bisnis Resmi</span>
                    <input
                      type="email"
                      value={data.emailBisnis}
                      onChange={(e) => handleFieldChange("emailBisnis", e.target.value)}
                      placeholder="marketing@indogreennature.com"
                      className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-foreground">Lokasi Singkat (Kota)</span>
                      <input
                        type="text"
                        value={data.lokasiKota}
                        onChange={(e) => handleFieldChange("lokasiKota", e.target.value)}
                        placeholder="Wates, Kulon Progo"
                        className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-foreground">Lokasi Singkat (Provinsi)</span>
                      <input
                        type="text"
                        value={data.lokasiProvinsi}
                        onChange={(e) => handleFieldChange("lokasiProvinsi", e.target.value)}
                        placeholder="D.I. Yogyakarta"
                        className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">Alamat Pabrik Lengkap</span>
                    <textarea
                      rows={2}
                      value={data.alamatPabrik}
                      onChange={(e) => handleFieldChange("alamatPabrik", e.target.value)}
                      className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-foreground">Jam Operasional (Hari Kerja)</span>
                      <input
                        type="text"
                        value={data.jamOperasional}
                        onChange={(e) => handleFieldChange("jamOperasional", e.target.value)}
                        placeholder="Senin – Jumat: 08.00 – 17.00 WIB"
                        className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-foreground">Jam Operasional (Sabtu)</span>
                      <input
                        type="text"
                        value={data.jamSabtu}
                        onChange={(e) => handleFieldChange("jamSabtu", e.target.value)}
                        placeholder="Sabtu: 08.00 – 13.00 WIB"
                        className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═════════ TAB 3: FORMULIR PESAN ═════════ */}
            {activeTab === "form" && (
              <div className="w-full space-y-6">
                <div className="p-4 rounded-[5px] border border-border bg-card space-y-4">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Formulir Kirim Pesan
                  </label>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">Judul Formulir</span>
                    <input
                      type="text"
                      value={data.formTitle || "Kirim Pesan ke Kami"}
                      onChange={(e) => handleFieldChange("formTitle", e.target.value)}
                      className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">Subjudul Formulir</span>
                    <input
                      type="text"
                      value={data.formSubtitle || "Isi formulir di bawah dan tim kami akan segera menghubungi Anda."}
                      onChange={(e) => handleFieldChange("formSubtitle", e.target.value)}
                      className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">Email Penerima Pesan</span>
                    <input
                      type="email"
                      value={data.formReceiverEmail}
                      onChange={(e) => handleFieldChange("formReceiverEmail", e.target.value)}
                      className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background"
                      placeholder="marketing@indogreennature.com"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Pesan formulir akan otomatis ditujukan ke alamat email ini saat tombol Kirim ditekan.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">Teks Catatan Kaki</span>
                    <textarea
                      rows={2}
                      value={data.formFootnote || ""}
                      onChange={(e) => handleFieldChange("formFootnote", e.target.value)}
                      className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ═════════ TAB 4: ALAMAT & MAPS ═════════ */}
            {activeTab === "maps" && (
              <div className="w-full space-y-6">
                <div className="p-4 rounded-[5px] border border-border bg-card space-y-4">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Pengaturan Lokasi &amp; Google Maps
                  </label>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">Judul Seksi Maps</span>
                    <input
                      type="text"
                      value={data.mapsTitle || "Alamat & Lokasi"}
                      onChange={(e) => handleFieldChange("mapsTitle", e.target.value)}
                      className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">Subjudul Seksi Maps</span>
                    <input
                      type="text"
                      value={data.mapsSubtitle || "Kunjungi fasilitas produksi kami langsung di Wates, Kulon Progo."}
                      onChange={(e) => handleFieldChange("mapsSubtitle", e.target.value)}
                      className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">Tautan Google Maps Langsung (Share Link)</span>
                    <input
                      type="text"
                      value={data.mapsUrl}
                      onChange={(e) => handleFieldChange("mapsUrl", e.target.value)}
                      placeholder="https://maps.app.goo.gl/..."
                      className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">URL Iframe Embed Google Maps</span>
                    <textarea
                      rows={3}
                      value={data.mapsEmbedUrl}
                      onChange={(e) => handleFieldChange("mapsEmbedUrl", e.target.value)}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background font-mono resize-none"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Masukkan URL `src` dari kode sematan (embed) Google Maps.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ═════════ TAB 5: LAYANAN KEMITRAAN ═════════ */}
            {activeTab === "layanan" && (
              <div className="w-full space-y-6">
                <div className="p-4 rounded-[5px] border border-border bg-card space-y-4">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Header Layanan Kemitraan &amp; Maklon
                  </label>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-foreground">Judul Seksi</span>
                    <input
                      type="text"
                      value={data.layananSectionTitle || "Layanan Kemitraan & Maklon"}
                      onChange={(e) => handleFieldChange("layananSectionTitle", e.target.value)}
                      className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-foreground">Deskripsi Seksi</span>
                    <textarea
                      rows={2}
                      value={data.layananSectionSubtitle || ""}
                      onChange={(e) => handleFieldChange("layananSectionSubtitle", e.target.value)}
                      className="w-full px-3 py-2 rounded-[5px] text-xs border border-border bg-background resize-none"
                    />
                  </div>
                </div>

                {/* 3 Kartu Layanan */}
                <div className="space-y-4">
                  {data.serviceCards.map((card, idx) => (
                    <div key={card.id || idx} className="p-4 rounded-[5px] border border-border bg-card space-y-3">
                      <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-wide">
                          Kartu {idx + 1}: {card.title}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-foreground">Judul Kartu</span>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => handleUpdateCard(idx, { title: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-[5px] text-xs border border-border bg-background"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-foreground">Deskripsi Singkat</span>
                        <textarea
                          rows={2}
                          value={card.desc}
                          onChange={(e) => handleUpdateCard(idx, { desc: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-[5px] text-xs border border-border bg-background resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-foreground">Poin Checklist (Pisahkan dengan baris baru)</span>
                        <textarea
                          rows={3}
                          value={card.points.join("\n")}
                          onChange={(e) =>
                            handleUpdateCard(idx, {
                              points: e.target.value.split("\n").filter((p) => p.trim() !== ""),
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-[5px] text-xs border border-border bg-background resize-none font-mono text-[11px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-muted-foreground">Teks Tombol</span>
                          <input
                            type="text"
                            value={card.btnText}
                            onChange={(e) => handleUpdateCard(idx, { btnText: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-[5px] text-xs border border-border bg-background"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-muted-foreground">Pesan WhatsApp Otomatis</span>
                          <input
                            type="text"
                            value={card.waText}
                            onChange={(e) => handleUpdateCard(idx, { waText: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-[5px] text-xs border border-border bg-background"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═════════ TAB 6: FAQ ═════════ */}
            {activeTab === "faq" && (
              <div className="w-full space-y-6">
                <div className="p-4 rounded-[5px] border border-border bg-card space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Daftar Pertanyaan &amp; Jawaban (FAQ)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#15803D] text-white hover:bg-[#166534] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Pertanyaan</span>
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    {data.faqItems.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-3.5 rounded-[5px] border border-border bg-background/80 space-y-2 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary">#{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteFaq(idx)}
                            className="text-muted-foreground hover:text-red-500 p-1 rounded transition-colors"
                            title="Hapus Pertanyaan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => handleUpdateFaq(idx, { question: e.target.value })}
                          placeholder="Pertanyaan..."
                          className="w-full px-3 py-1.5 rounded-[5px] text-xs font-semibold border border-border bg-card"
                        />

                        <textarea
                          rows={3}
                          value={item.answer}
                          onChange={(e) => handleUpdateFaq(idx, { answer: e.target.value })}
                          placeholder="Jawaban..."
                          className="w-full px-3 py-1.5 rounded-[5px] text-xs border border-border bg-card resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Banner Bawah FAQ */}
                <div className="p-4 rounded-[5px] border border-border bg-card space-y-3">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Kotak Tanya Langsung Bawah FAQ
                  </label>
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">Judul</span>
                    <input
                      type="text"
                      value={data.faqCtaTitle || "Tidak menemukan jawaban yang Anda cari?"}
                      onChange={(e) => handleFieldChange("faqCtaTitle", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-[5px] text-xs border border-border bg-background"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-foreground">Subteks</span>
                    <input
                      type="text"
                      value={data.faqCtaSubtitle || "Tim kami siap menjawab pertanyaan Anda secara langsung."}
                      onChange={(e) => handleFieldChange("faqCtaSubtitle", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-[5px] text-xs border border-border bg-background"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground">Teks Tombol</span>
                      <input
                        type="text"
                        value={data.faqCtaBtnText || "Tanya Langsung"}
                        onChange={(e) => handleFieldChange("faqCtaBtnText", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-[5px] text-xs border border-border bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground">Pesan WhatsApp</span>
                      <input
                        type="text"
                        value={data.faqCtaWaText || ""}
                        onChange={(e) => handleFieldChange("faqCtaWaText", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-[5px] text-xs border border-border bg-background"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
