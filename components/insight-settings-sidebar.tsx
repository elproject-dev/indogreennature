"use client"

import * as React from "react"
import {
  X,
  SlidersHorizontal,
  Save,
  RotateCcw,
  Eye,
  Check,
  Sparkles,
  ExternalLink,
  ImageIcon,
  Type,
  Palette,
  Upload,
  Trash2,
  Loader2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  LayoutTemplate,
  Search,
  Layers,
  MousePointerClick,
  Square,
  ArrowRight,
  Link as LinkIcon,
  PenLine,
  BookOpen,
  Plus,
  FileText,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
} from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import { uploadMedia, compressImageToWebP } from "@/lib/storage"
import { toast } from "sonner"
import { poppins, outfit, getHeroFontClass } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import {
  InsightSettingsData,
  DEFAULT_INSIGHT_SETTINGS,
  INSIGHT_SETTINGS_KEY,
  INSIGHT_PREVIEW_CHANNEL,
} from "@/lib/insight-settings"
import { fetchInsights, deleteInsight, saveInsight } from "@/lib/insight/db"
import { InsightArticle } from "@/lib/insight/types"

export type { InsightSettingsData }
export { DEFAULT_INSIGHT_SETTINGS, INSIGHT_SETTINGS_KEY }

interface InsightSettingsSidebarProps {
  isOpen: boolean
  onClose: () => void
  data: InsightSettingsData
  onChange: (updated: InsightSettingsData) => void
  onSave: () => void
  onReset: () => void
  isSaving?: boolean
}

import { FontSelect } from "@/components/ui/font-combobox"

function toSafeHexColor(color: string | undefined | null, fallback: string = "#000000"): string {
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

export function InsightSettingsSidebar({
  isOpen,
  onClose,
  data,
  onChange,
  onSave,
  onReset,
  isSaving = false,
}: InsightSettingsSidebarProps) {
  const [activeTab, setActiveTab] = React.useState<"banner" | "frame" | "cta" | "artikel">("banner")

  // ─── State manajemen artikel ───
  const [articles, setArticles] = React.useState<InsightArticle[]>([])
  const [articlesLoading, setArticlesLoading] = React.useState(false)
  const [articleSearch, setArticleSearch] = React.useState("")
  const [deletingId, setDeletingId] = React.useState<number | null>(null)
  const [togglingId, setTogglingId] = React.useState<number | null>(null)

  const loadArticles = React.useCallback(async () => {
    setArticlesLoading(true)
    try {
      const data = await fetchInsights({ onlyActive: false })
      setArticles(data)
    } catch {
      toast.error("Gagal memuat artikel")
    } finally {
      setArticlesLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (activeTab === "artikel") {
      loadArticles()
    }
  }, [activeTab, loadArticles])

  const handleToggleActive = async (article: InsightArticle) => {
    if (!article.id) return
    setTogglingId(article.id)
    try {
      const res = await saveInsight({ ...article, is_active: !article.is_active })
      if (res.success) {
        setArticles((prev) =>
          prev.map((a) => (a.id === article.id ? { ...a, is_active: !article.is_active } : a))
        )
        toast.success(article.is_active ? "Artikel disembunyikan" : "Artikel diaktifkan")
      } else {
        toast.error(res.message || "Gagal mengubah status")
      }
    } catch {
      toast.error("Terjadi kesalahan")
    } finally {
      setTogglingId(null)
    }
  }

  const handleDeleteArticle = async (article: InsightArticle) => {
    if (!article.id) return
    if (!confirm(`Hapus artikel "${article.title}"? Tindakan ini tidak dapat dibatalkan.`)) return
    setDeletingId(article.id)
    try {
      const res = await deleteInsight(article.id)
      if (res.success) {
        setArticles((prev) => prev.filter((a) => a.id !== article.id))
        toast.success("Artikel berhasil dihapus")
      } else {
        toast.error(res.message || "Gagal menghapus artikel")
      }
    } catch {
      toast.error("Terjadi kesalahan")
    } finally {
      setDeletingId(null)
    }
  }
  const bgImageInputRef = React.useRef<HTMLInputElement>(null)
  const [isUploadingBg, setIsUploadingBg] = React.useState(false)
  const frameImageInputRef = React.useRef<HTMLInputElement>(null)
  const [isUploadingFrame, setIsUploadingFrame] = React.useState(false)

  // Persistent BroadcastChannel untuk sinkronisasi pratinjau real-time lintas tab
  const bcRef = React.useRef<BroadcastChannel | null>(null)
  React.useEffect(() => {
    if (typeof BroadcastChannel !== "undefined") {
      try {
        bcRef.current = new BroadcastChannel(INSIGHT_PREVIEW_CHANNEL)
      } catch { }
    }
    return () => {
      try {
        bcRef.current?.close()
      } catch { }
    }
  }, [])

  // Tangani tombol ESC untuk menutup
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Fungsi sinkronisasi real-time lintas tab (BroadcastChannel + localStorage)
  const broadcastPreviewUpdate = (updated: InsightSettingsData) => {
    onChange(updated)

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(INSIGHT_SETTINGS_KEY, JSON.stringify(updated))
      } catch {
        // ignore
      }

      try {
        if (bcRef.current) {
          bcRef.current.postMessage({ type: "PREVIEW_UPDATE", data: updated })
        } else if (typeof BroadcastChannel !== "undefined") {
          const tempBc = new BroadcastChannel(INSIGHT_PREVIEW_CHANNEL)
          tempBc.postMessage({ type: "PREVIEW_UPDATE", data: updated })
          setTimeout(() => tempBc.close(), 1000)
        }
      } catch {
        // ignore
      }
    }
  }

  const handleFieldChange = <K extends keyof InsightSettingsData>(
    field: K,
    val: InsightSettingsData[K]
  ) => {
    broadcastPreviewUpdate({
      ...data,
      [field]: val,
    })
  }

  const handleMultipleFieldChange = (patch: Partial<InsightSettingsData>) => {
    broadcastPreviewUpdate({
      ...data,
      ...patch,
    })
  }

  const handleBgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Format tidak didukung. Harap pilih file gambar (JPG, PNG, WebP).")
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar (maksimal 15MB).")
      return
    }

    setIsUploadingBg(true)
    const toastId = toast.loading("Mengunggah gambar latar belakang...")
    try {
      let photoUrl: string | null = null
      try {
        photoUrl = await uploadMedia(file, "insight/banner")
      } catch (err) {
        console.warn("[InsightSettings] Upload Supabase latar gagal, mencoba fallback:", err)
      }

      if (!photoUrl) {
        try {
          const webpBlob = await compressImageToWebP(file)
          photoUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(webpBlob)
          })
        } catch {
          photoUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
        }
      }

      if (photoUrl) {
        handleMultipleFieldChange({
          bannerBgImage: photoUrl,
          bannerBgType: "image",
        })
        toast.success("Gambar latar belakang berhasil diperbarui!", { id: toastId })
      } else {
        toast.error("Gagal memproses gambar latar.", { id: toastId })
      }
    } catch (err: any) {
      console.error("[InsightSettings] Gagal memproses gambar latar:", err)
      toast.error("Terjadi kesalahan saat memproses gambar latar.", { id: toastId })
    } finally {
      setIsUploadingBg(false)
      if (bgImageInputRef.current) {
        bgImageInputRef.current.value = ""
      }
    }
  }

  const handleFrameImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Format tidak didukung. Harap pilih file gambar (JPG, PNG, WebP).")
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar (maksimal 15MB).")
      return
    }

    setIsUploadingFrame(true)
    const toastId = toast.loading("Mengunggah dan mengoptimalkan gambar frame 1:1...")
    try {
      let photoUrl: string | null = null
      try {
        photoUrl = await uploadMedia(file, "insight/frame")
      } catch (err) {
        console.warn("[InsightSettings] Upload Supabase gambar frame gagal, mencoba fallback:", err)
      }

      if (!photoUrl) {
        try {
          const webpBlob = await compressImageToWebP(file)
          photoUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(webpBlob)
          })
        } catch {
          photoUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
        }
      }

      if (photoUrl) {
        handleMultipleFieldChange({
          bannerFrameImage: photoUrl,
          bannerFrameShow: true,
        })
        toast.success("Logo banner berhasil diperbarui!", { id: toastId })
      } else {
        toast.error("Gagal memproses logo.", { id: toastId })
      }
    } catch (err: any) {
      console.error("[InsightSettings] Gagal memproses logo banner:", err)
      toast.error("Terjadi kesalahan saat memproses logo.", { id: toastId })
    } finally {
      setIsUploadingFrame(false)
      if (frameImageInputRef.current) {
        frameImageInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs p-1.5 sm:p-3 md:p-4 transition-all duration-300">
      {/* Outer Panel Container dengan Proporsi Figma Desktop Full Width & Height yang Lega */}
      <div className="w-[98vw] max-w-[1560px] h-[95vh] max-h-[920px] bg-white dark:bg-zinc-900 rounded-[8px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-200 dark:border-zinc-700 relative">
        {/* Hidden global inputs for image uploads */}
        <input
          type="file"
          ref={frameImageInputRef}
          onChange={handleFrameImageUpload}
          accept="image/*"
          className="hidden"
        />
        <input
          type="file"
          ref={bgImageInputRef}
          onChange={handleBgImageUpload}
          accept="image/*"
          className="hidden"
        />

        {/* ─── SISI KIRI: SIDEBAR SESUAI KONSEP FIGMA ─── */}
        <div className="w-full md:w-[316px] md:min-w-[316px] md:max-w-[316px] flex flex-col bg-[#D9D9D9] dark:bg-zinc-800 border-r border-zinc-300 dark:border-zinc-700 shrink-0 select-none">
          {/* Header Sidebar: Figma .rectangle (w: 316px, h: 60px, bg: #D97706) */}
          <div className="w-full h-[60px] bg-[#D97706] px-4 flex items-center justify-center relative shadow-xs">
            <h2
              className={cn(
                "text-[12px] font-bold text-white tracking-wider uppercase text-center w-full",
                poppins.className
              )}
            >
              PENGATURAN INSIGHT
            </h2>

            {/* Mobile close button inside header */}
            <button
              onClick={onClose}
              className="md:hidden absolute right-3 text-white/80 hover:text-white p-1 rounded hover:bg-black/10 transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Sidebar: Menu tombol hijau #15803D */}
          <div className="flex-1 p-5 flex flex-col gap-3.5 overflow-y-auto">
            {/* Tombol 1: BANNER UTAMA */}
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

            {/* Tombol 2: LOGO BANNER (TRANSPARAN) */}
            <button
              type="button"
              onClick={() => setActiveTab("frame")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-sm gap-2",
                poppins.className,
                activeTab === "frame"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              <span>LOGO BANNER</span>
              {data.bannerFrameShow && (
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              )}
            </button>

            {/* Tombol 3: KONSULTASI & CTA */}
            <button
              type="button"
              onClick={() => setActiveTab("cta")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-sm gap-2",
                poppins.className,
                activeTab === "cta"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              <span>KONSULTASI &amp; CTA</span>
              {(data.sidebarCtaShow !== false || data.bottomCtaShow !== false) && (
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              )}
            </button>

            {/* Tombol 4: KELOLA ARTIKEL */}
            <button
              type="button"
              onClick={() => setActiveTab("artikel")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-sm gap-2",
                poppins.className,
                activeTab === "artikel"
                  ? "bg-[#D97706] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#D97706] text-white hover:bg-[#b45309] opacity-90 hover:opacity-100"
              )}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>KELOLA ARTIKEL</span>
              {articles.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">{articles.length}</span>
              )}
            </button>

            {/* Informasi Mode Penyesuaian Figma */}
            <div className="pt-4 border-t border-zinc-400/50 dark:border-zinc-700 space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400 tracking-wider block px-1">
                Kustomisasi Bagian
              </span>
              <div className="p-3 rounded-[5px] bg-zinc-200/60 dark:bg-zinc-700/40 border border-zinc-300 dark:border-zinc-600 text-[11px] text-zinc-600 dark:text-zinc-300 space-y-1">
                <span className="font-semibold block text-green-800 dark:text-green-400">
                  ✨ Pengaturan Lengkap Real-Time
                </span>
                <p className="text-[10px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Banner utama, logo transparan, widget formulasi sidebar, dan card ajakan maklon dapat disesuaikan langsung.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── SISI KANAN: EDITOR WORKSPACE ─── */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
          {/* Header Editor Workspace (h: 60px) */}
          <div className="w-full h-[60px] bg-zinc-100 dark:bg-zinc-800/80 px-4 md:px-6 flex items-center justify-between border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-semibold text-zinc-700 dark:text-zinc-300">
                PENGATURAN BAGIAN:
              </span>
              <span className="text-xs font-bold text-[#15803D] dark:text-green-400 bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-[4px] border border-zinc-300 dark:border-zinc-700 uppercase">
                {activeTab === "frame"
                  ? "LOGO BANNER (TRANSPARAN)"
                  : activeTab === "cta"
                    ? "KONSULTASI & CTA ARTIKEL"
                    : activeTab === "artikel"
                      ? "KELOLA ARTIKEL"
                      : "BANNER UTAMA"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Tombol Pratinjau Halaman */}
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    try {
                      localStorage.setItem(INSIGHT_SETTINGS_KEY, JSON.stringify(data))
                    } catch (e) {
                      console.error(e)
                    }
                    window.open("/insight?preview=true", "_blank")
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer shadow-2xs"
                title="Buka Pratinjau Halaman di Tab Baru"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Pratinjau Halaman</span>
              </button>

              {/* Tombol Close (X) */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 hover:bg-red-50 text-zinc-700 dark:text-zinc-300 hover:text-red-600 flex items-center justify-center border border-zinc-300 dark:border-zinc-700 transition-all cursor-pointer shadow-2xs"
                title="Tutup Pengaturan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form Editor Body dengan Scroll Area */}
          <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto space-y-8 w-full">
            {activeTab === "artikel" ? (
              /* ══════════════════════════════════════════════════════
                 TAB ARTIKEL: Manajemen & Pembuatan Artikel Insight
              ══════════════════════════════════════════════════════ */
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h3 className={cn("text-lg font-bold text-foreground", poppins.className)}>
                    Kelola Artikel Insight
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Buat, edit, aktifkan, atau hapus artikel insight CV. Indo Green Nature.
                  </p>
                </div>

                {/* Tombol Buat Artikel Baru */}
                <div className="p-5 rounded-[8px] border-2 border-dashed border-[#D97706]/50 bg-amber-50/60 dark:bg-amber-900/10 flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1">
                    <p className={cn("text-sm font-bold text-amber-800 dark:text-amber-400", poppins.className)}>Studio Artikel Lengkap</p>
                    <p className="text-xs text-amber-700/80 dark:text-amber-500/80 mt-0.5">
                      Buat artikel baru dengan editor blok penuh — teks, gambar, heading, callout, kutipan, dan lainnya.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      window.open("/insight/create", "_blank")
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-[#D97706] hover:bg-[#b45309] text-white text-sm font-bold shadow-md transition-all cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    Buat Artikel Baru
                  </button>
                </div>

                {/* Daftar Artikel */}
                <div className="p-4 sm:p-5 rounded-[5px] border border-border bg-card shadow-xs space-y-4">
                  {/* Header daftar */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-3 gap-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#15803D]" />
                      Daftar Artikel ({articles.length})
                    </span>
                    <button
                      type="button"
                      onClick={loadArticles}
                      disabled={articlesLoading}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-muted hover:bg-muted/80 text-xs text-muted-foreground transition-colors cursor-pointer disabled:opacity-50"
                      title="Muat ulang daftar artikel"
                    >
                      <RefreshCw className={cn("w-3.5 h-3.5", articlesLoading && "animate-spin")} />
                      Refresh
                    </button>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      value={articleSearch}
                      onChange={(e) => setArticleSearch(e.target.value)}
                      placeholder="Cari artikel..."
                      className="w-full pl-8 pr-3 py-2 rounded-[5px] border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#15803D]/50"
                    />
                  </div>

                  {/* Loading state */}
                  {articlesLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#15803D]" />
                      <span className="text-xs">Memuat artikel...</span>
                    </div>
                  ) : articles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                      <BookOpen className="w-10 h-10 text-muted-foreground/40" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Belum ada artikel</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Klik &quot;Buat Artikel Baru&quot; untuk memulai.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                      {articles
                        .filter((a) =>
                          articleSearch.trim() === "" ||
                          a.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
                          a.category.toLowerCase().includes(articleSearch.toLowerCase())
                        )
                        .map((article) => (
                          <div
                            key={article.id}
                            className={cn(
                              "flex items-start gap-3 p-3 rounded-[6px] border transition-all",
                              article.is_active
                                ? "border-border bg-background hover:bg-muted/30"
                                : "border-dashed border-border/60 bg-muted/20 opacity-70"
                            )}
                          >
                            {/* Cover thumbnail */}
                            <div className="w-14 h-14 rounded-[4px] shrink-0 overflow-hidden bg-muted border border-border/50">
                              {article.src || article.cover_image ? (
                                <img
                                  src={article.src || article.cover_image}
                                  alt={article.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="w-5 h-5 text-muted-foreground/40" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-foreground line-clamp-2 leading-tight">{article.title}</p>
                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                <span className="text-[10px] px-1.5 py-0.5 rounded-[3px] bg-[#15803D]/10 text-[#15803D] font-semibold">{article.category}</span>
                                <span className="text-[10px] text-muted-foreground">{article.reading_time}</span>
                                <span className={cn(
                                  "text-[10px] font-semibold px-1.5 py-0.5 rounded-[3px]",
                                  article.is_active
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
                                )}>
                                  {article.is_active ? "Aktif" : "Nonaktif"}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-1.5 shrink-0">
                              {/* Toggle aktif */}
                              <button
                                type="button"
                                onClick={() => handleToggleActive(article)}
                                disabled={togglingId === article.id}
                                title={article.is_active ? "Sembunyikan artikel" : "Aktifkan artikel"}
                                className="w-7 h-7 rounded-[4px] flex items-center justify-center bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all cursor-pointer disabled:opacity-40"
                              >
                                {togglingId === article.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : article.is_active ? (
                                  <ToggleRight className="w-3.5 h-3.5 text-[#15803D]" />
                                ) : (
                                  <ToggleLeft className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {/* Edit */}
                              <button
                                type="button"
                                onClick={() => window.open(`/insight/create?edit=${article.slug}`, "_blank")}
                                title="Edit artikel"
                                className="w-7 h-7 rounded-[4px] flex items-center justify-center bg-muted hover:bg-[#15803D]/10 text-muted-foreground hover:text-[#15803D] transition-all cursor-pointer"
                              >
                                <PenLine className="w-3.5 h-3.5" />
                              </button>

                              {/* Hapus */}
                              <button
                                type="button"
                                onClick={() => handleDeleteArticle(article)}
                                disabled={deletingId === article.id}
                                title="Hapus artikel"
                                className="w-7 h-7 rounded-[4px] flex items-center justify-center bg-muted hover:bg-red-50 text-muted-foreground hover:text-red-600 dark:hover:bg-red-900/20 transition-all cursor-pointer disabled:opacity-40"
                              >
                                {deletingId === article.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Tips */}
                <div className="p-3.5 rounded-[5px] bg-[#15803D]/5 border border-[#15803D]/20 text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-[#15803D] dark:text-green-400">💡 Tips Penggunaan</p>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    <li>Klik <strong>Buat Artikel Baru</strong> untuk membuka studio editor lengkap di tab baru.</li>
                    <li>Gunakan ikon <strong>toggle</strong> untuk menyembunyikan/menampilkan artikel tanpa menghapusnya.</li>
                    <li>Klik ikon <strong>pensil</strong> untuk mengedit artikel yang sudah ada.</li>
                    <li>Klik ikon <strong>tong sampah</strong> untuk menghapus artikel secara permanen.</li>
                  </ul>
                </div>
              </div>
            ) : activeTab === "frame" ? (
              <div className="space-y-8">
                {/* Header intro */}
                <div>
                  <h3 className={cn("text-lg font-bold text-foreground", poppins.className)}>
                    Kustomisasi Logo Banner (Transparan)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Atur logo transparan (format PNG / SVG / WebP) di sudut kanan banner insight tanpa border atau background.
                  </p>
                </div>

                {/* ─── PRATINJAU LANGSUNG LOGO TRANSPARAN ─── */}
                <div className="p-4 sm:p-5 rounded-[5px] border border-border bg-card shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#15803D]" />
                      Pratinjau Langsung Logo Transparan
                    </span>
                    <span className="text-[11px] font-mono text-[#15803D] bg-[#15803D]/10 px-2 py-0.5 rounded-[5px] font-semibold">
                      Transparan 1:1
                    </span>
                  </div>

                  {/* Canvas Pratinjau dengan Pola Dot Transparan */}
                  <div className="p-6 sm:p-8 bg-zinc-100 dark:bg-zinc-900/60 rounded-[5px] flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden border border-border/50 [background-image:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.08)_1px,transparent_0)] dark:[background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:16px_16px]">
                    <div className="relative group/prev max-w-full">
                      {/* Logo Container Transparan (Tanpa border, shadow, background box, atau glow) */}
                      <div
                        style={{
                          width: `${Math.min(data.bannerFrameSize || 320, 260)}px`,
                          aspectRatio: "1 / 1",
                        }}
                        className={cn(
                          "relative aspect-square flex items-center justify-center bg-transparent border-0 shadow-none ring-0 transition-all duration-300",
                          !data.bannerFrameShow && "opacity-40 grayscale"
                        )}
                      >
                        {data.bannerFrameImage ? (
                          <img
                            key={data.bannerFrameImage || "empty"}
                            src={data.bannerFrameImage}
                            alt={data.bannerFrameAlt || "Pratinjau Logo"}
                            className={cn(
                              "w-full h-full drop-shadow-xs transition-transform duration-500",
                              data.bannerFrameFit === "cover" ? "object-cover" : "object-contain"
                            )}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-[#15803D]/30 rounded-xl bg-transparent text-muted-foreground">
                            <ImageIcon className="w-8 h-8 opacity-60 mb-1.5 text-[#15803D]" />
                            <span className="text-xs font-semibold text-foreground">Belum Ada Logo</span>
                            <span className="text-[10px] opacity-75">Silakan pilih atau unggah logo PNG/SVG transparan di bawah</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {!data.bannerFrameShow && (
                      <div className="mt-3 px-3 py-1 rounded-[5px] bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-medium border border-amber-500/20">
                        ⚠️ Logo saat ini disetel tersembunyi (nonaktif)
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[11px] text-muted-foreground">
                      <span>Ukuran: <strong className="text-foreground">{data.bannerFrameSize || 320}px</strong></span>
                      <span>&bull;</span>
                      <span>Posisi: <strong className="text-foreground">{data.bannerFrameAlign === "center" ? "Tengah" : data.bannerFrameAlign === "bottom" ? "Bawah" : "Sejajar Judul"}</strong></span>
                      <span>&bull;</span>
                      <span>Mode: <strong className="text-foreground">{data.bannerFrameFit === "cover" ? "Cover" : "Contain (Utuh)"}</strong></span>
                      <span>&bull;</span>
                      <span>Status: <strong className="text-foreground">{data.bannerFrameShow ? "Aktif" : "Nonaktif"}</strong></span>
                    </div>
                  </div>
                </div>

                {/* ─── BLOK 1: STATUS & UNGGAH LOGO TRANSPARAN ─── */}
                <div className="p-4 sm:p-5 rounded-[5px] border border-border bg-card shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#15803D]" />
                      1. Status Tampil &amp; Unggah Logo
                    </span>
                    <button
                      type="button"
                      onClick={() => handleFieldChange("bannerFrameShow", !data.bannerFrameShow)}
                      className={cn(
                        "px-3 py-1 rounded-[5px] text-xs font-bold transition-all cursor-pointer",
                        data.bannerFrameShow
                          ? "bg-[#15803D] text-white shadow-xs"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {data.bannerFrameShow ? "✓ Logo Aktif" : "✕ Disembunyikan"}
                    </button>
                  </div>

                  {/* Upload Logo & Input URL */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => frameImageInputRef.current?.click()}
                        disabled={isUploadingFrame}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[5px] bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isUploadingFrame ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>{isUploadingFrame ? "Mengunggah Logo..." : "Unggah Logo Baru (PNG/SVG/WebP)"}</span>
                      </button>

                      {data.bannerFrameImage && (
                        <button
                          type="button"
                          onClick={() => handleFieldChange("bannerFrameImage", "")}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[5px] bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus Logo</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-foreground/80 block">
                        URL Logo Langsung (Mendukung PNG/SVG Transparan)
                      </label>
                      <input
                        type="text"
                        value={data.bannerFrameImage || ""}
                        onChange={(e) => handleFieldChange("bannerFrameImage", e.target.value)}
                        placeholder="/logo.png atau https://.../logo.png"
                        className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                      />
                    </div>

                    {/* Preset Logo Cepat */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        Preset Logo / Aset Cepat:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { label: "Logo IGN Utama", path: "/logo.png" },
                          { label: "PWA Icon", path: "/pwa-icon.png" },
                          { label: "Badge Icon", path: "/badge-icon.png" },
                        ].map((preset) => (
                          <button
                            key={preset.path}
                            type="button"
                            onClick={() => {
                              handleMultipleFieldChange({
                                bannerFrameImage: preset.path,
                                bannerFrameShow: true,
                              })
                            }}
                            className={cn(
                              "px-2.5 py-1 rounded-[5px] text-[11px] font-medium border transition-colors cursor-pointer",
                              data.bannerFrameImage === preset.path
                                ? "bg-[#15803D] text-white border-[#15803D]"
                                : "bg-muted/60 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                            )}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mode Pas Logo (Fit) & Teks Alt */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 block">
                          Mode Pas Logo (Object Fit)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleFieldChange("bannerFrameFit", "contain")}
                            className={cn(
                              "py-1.5 px-3 rounded-[5px] text-xs font-semibold border transition-all cursor-pointer text-center",
                              (data.bannerFrameFit || "contain") === "contain"
                                ? "bg-[#15803D] text-white border-[#15803D] shadow-xs"
                                : "bg-background text-foreground border-border hover:bg-muted"
                            )}
                          >
                            Contain (Utuh - Rekomendasi)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFieldChange("bannerFrameFit", "cover")}
                            className={cn(
                              "py-1.5 px-3 rounded-[5px] text-xs font-semibold border transition-all cursor-pointer text-center",
                              data.bannerFrameFit === "cover"
                                ? "bg-[#15803D] text-white border-[#15803D] shadow-xs"
                                : "bg-background text-foreground border-border hover:bg-muted"
                            )}
                          >
                            Cover (Penuh)
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 block">
                          Teks Alt Logo (SEO / Aksesibilitas)
                        </label>
                        <input
                          type="text"
                          value={data.bannerFrameAlt || ""}
                          onChange={(e) => handleFieldChange("bannerFrameAlt", e.target.value)}
                          placeholder="Logo CV. Indo Green Nature"
                          className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                        />
                      </div>
                    </div>

                    {/* Perataan Vertikal Logo & Teks Banner */}
                    <div className="space-y-1.5 pt-3 border-t border-border/50">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                        <span>Perataan Vertikal Judul &amp; Foto Banner</span>
                        <span className="text-[10px] font-mono text-[#15803D] font-bold">
                          {data.bannerFrameAlign === "top" ? "Atas (Sejajar Judul)" : data.bannerFrameAlign === "bottom" ? "Bawah (Bottom)" : "Tengah (Center - Seimbang)"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleFieldChange("bannerFrameAlign", "center")}
                          className={cn(
                            "py-1.5 px-2 rounded-[5px] text-xs font-semibold border transition-all cursor-pointer text-center",
                            (!data.bannerFrameAlign || data.bannerFrameAlign === "center")
                              ? "bg-[#15803D] text-white border-[#15803D] shadow-xs"
                              : "bg-background text-foreground border-border hover:bg-muted"
                          )}
                        >
                          Tengah (Seimbang)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange("bannerFrameAlign", "top")}
                          className={cn(
                            "py-1.5 px-2 rounded-[5px] text-xs font-semibold border transition-all cursor-pointer text-center",
                            data.bannerFrameAlign === "top"
                              ? "bg-[#15803D] text-white border-[#15803D] shadow-xs"
                              : "bg-background text-foreground border-border hover:bg-muted"
                          )}
                        >
                          Atas (Sejajar Judul)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange("bannerFrameAlign", "bottom")}
                          className={cn(
                            "py-1.5 px-2 rounded-[5px] text-xs font-semibold border transition-all cursor-pointer text-center",
                            data.bannerFrameAlign === "bottom"
                              ? "bg-[#15803D] text-white border-[#15803D] shadow-xs"
                              : "bg-background text-foreground border-border hover:bg-muted"
                          )}
                        >
                          Bawah (Bottom)
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Pilih &quot;Tengah (Seimbang)&quot; agar teks judul dan deskripsi otomatis turun tepat di tengah ketinggian frame foto sehingga tampilan seimbang dan proporsional.
                      </p>
                    </div>

                    {/* Penyesuaian Posisi Naik / Turun (Offset Vertikal) */}
                    <div className="space-y-1.5 pt-3 border-t border-border/50">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                        <span>Penyesuaian Posisi Naik / Turun (Offset)</span>
                        <span className="text-[10px] font-mono text-[#15803D] font-bold">
                          {data.bannerFrameOffsetY ?? 0}px {(data.bannerFrameOffsetY ?? 0) < 0 ? "(Foto Naik)" : (data.bannerFrameOffsetY ?? 0) > 0 ? "(Foto Turun)" : "(Seimbang Murni)"}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        step="2"
                        value={data.bannerFrameOffsetY ?? 0}
                        onChange={(e) => handleFieldChange("bannerFrameOffsetY", parseInt(e.target.value, 10))}
                        className="w-full accent-[#15803D] cursor-pointer"
                      />
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {[
                          { label: "Foto Naik (-14px)", val: -14 },
                          { label: "Tengah Seimbang (0px)", val: 0 },
                          { label: "Foto Turun (+14px)", val: 14 },
                          { label: "Foto Turun (+28px)", val: 28 },
                        ].map((btn) => (
                          <button
                            key={btn.val}
                            type="button"
                            onClick={() => handleFieldChange("bannerFrameOffsetY", btn.val)}
                            className={cn(
                              "px-2 py-1 rounded-[5px] text-[10px] font-medium border transition-colors cursor-pointer",
                              (data.bannerFrameOffsetY ?? 0) === btn.val
                                ? "bg-[#15803D] text-white border-[#15803D]"
                                : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                            )}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Gunakan tombol atau slider untuk menyesuaikan posisi vertikal foto terhadap teks judul &amp; deskripsi secara presisi.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ─── BLOK 2: UKURAN LOGO BANNER ─── */}
                <div className="p-4 sm:p-5 rounded-[5px] border border-border bg-card shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Square className="w-4 h-4 text-[#15803D]" />
                      2. Ukuran Logo Banner
                    </span>
                    <span className="text-[11px] font-mono text-[#15803D] font-bold">
                      {data.bannerFrameSize || 320}px &times; {data.bannerFrameSize || 320}px
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Ukuran Logo Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                        <span>Dimensi Logo (Lebar &amp; Tinggi Proporsional)</span>
                        <span className="text-[10px] font-mono text-[#15803D] font-bold">
                          {data.bannerFrameSize || 320}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="120"
                        max="480"
                        step="10"
                        value={data.bannerFrameSize || 320}
                        onChange={(e) => handleFieldChange("bannerFrameSize", parseInt(e.target.value, 10))}
                        className="w-full accent-[#15803D] cursor-pointer"
                      />
                      <div className="flex items-center gap-2 pt-1">
                        {[
                          { label: "Kecil (200px)", size: 200 },
                          { label: "Sedang (260px)", size: 260 },
                          { label: "Standar (320px)", size: 320 },
                          { label: "Besar (400px)", size: 400 },
                        ].map((btn) => (
                          <button
                            key={btn.size}
                            type="button"
                            onClick={() => handleFieldChange("bannerFrameSize", btn.size)}
                            className={cn(
                              "px-2.5 py-1 rounded-[5px] text-[10px] font-medium border transition-colors cursor-pointer",
                              (data.bannerFrameSize || 320) === btn.size
                                ? "bg-[#15803D] text-white border-[#15803D]"
                                : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                            )}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── BLOK 3: TAUTAN / LINK INTERAKTIF ─── */}
                <div className="p-4 sm:p-5 rounded-[5px] border border-border bg-card shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-[#15803D]" />
                      3. Tautan / Link Interaktif (Opsional)
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Click Action
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-foreground/80 block">
                      URL Tujuan Saat Logo Diklik
                    </label>
                    <input
                      type="text"
                      value={data.bannerFrameLink || ""}
                      onChange={(e) => handleFieldChange("bannerFrameLink", e.target.value)}
                      placeholder="/about atau /contact atau https://..."
                      className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Jika diisi, pengunjung yang mengeklik logo di pojok kanan banner akan diarahkan ke halaman tersebut. Kosongkan jika logo hanya berfungsi sebagai grafis transparan.
                    </p>
                  </div>
                </div>
              </div>
            ) : activeTab === "cta" ? (
              <div className="space-y-8">
                {/* Header Intro */}
                <div>
                  <h3 className={cn("text-lg font-bold text-foreground", poppins.className)}>
                    Kustomisasi Widget Formulasi &amp; Card Maklon
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Atur teks, tombol WhatsApp, tautan, dan visibilitas pada widget sidebar &ldquo;Punya Ide Formulasi Serupa?&rdquo; serta card ajakan &ldquo;Kembangkan Brand Herbal Anda&rdquo; pada halaman Insight dan artikel.
                  </p>
                </div>

                {/* ─── BAGIAN 1: WIDGET SIDEBAR (PUNYA IDE FORMULASI SERUPA?) ─── */}
                <div className="p-4 sm:p-5 rounded-[5px] border border-border bg-card shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#15803D]" />
                      1. Widget Sidebar &ldquo;Punya Ide Formulasi Serupa?&rdquo;
                    </span>
                    <button
                      type="button"
                      onClick={() => handleFieldChange("sidebarCtaShow", data.sidebarCtaShow === false ? true : false)}
                      className={cn(
                        "px-3 py-1 rounded-[5px] text-xs font-bold transition-all cursor-pointer",
                        data.sidebarCtaShow !== false
                          ? "bg-[#15803D] text-white shadow-xs"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {data.sidebarCtaShow !== false ? "✓ Widget Aktif" : "✕ Disembunyikan"}
                    </button>
                  </div>

                  {/* Pratinjau Interaktif Widget Sidebar */}
                  <div className="p-5 sm:p-6 bg-zinc-100 dark:bg-zinc-900/60 rounded-[5px] border border-border/60">
                    <div className="max-w-[360px] mx-auto overflow-hidden rounded-[5px] border border-[#15803D]/30 bg-gradient-to-br from-[#15803D] via-[#166534] to-[#14532d] text-white p-5 shadow-md space-y-3">
                      <div className="inline-flex items-center rounded-[5px] bg-white/15 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md">
                        <span>{data.sidebarCtaBadge || "Konsultasi Maklon Herbal"}</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold leading-snug whitespace-pre-line">
                        {data.sidebarCtaTitle || "Punya Ide Formulasi Serupa?"}
                      </h4>
                      <p className="text-green-100 text-xs leading-relaxed whitespace-pre-line">
                        {data.sidebarCtaDesc ||
                          "Tim R&D dan apoteker CV. Indo Green Nature siap membantu memformulasikan produk herbal Anda hingga izin edar BPOM dan sertifikat Halal terbit."}
                      </p>
                      <div className="pt-1 flex flex-col gap-2">
                        <div
                          style={{
                            backgroundColor: data.sidebarCtaBtnBg || "#ffffff",
                            color: data.sidebarCtaBtnColor || "#15803d",
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-[5px] px-3.5 py-2 text-xs font-bold shadow-xs select-none"
                        >
                          <WhatsAppIcon className="size-3.5" />
                          <span>{data.sidebarCtaBtnText || "Hubungi Tim R&D via WA"}</span>
                        </div>
                        {data.sidebarCtaSublinkText && (
                          <span className="text-center text-[11px] text-green-100 underline underline-offset-4 font-medium select-none">
                            {data.sidebarCtaSublinkText}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form Inputs Widget Sidebar */}
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 block">
                          Badge Teks Atas
                        </label>
                        <input
                          type="text"
                          value={data.sidebarCtaBadge ?? "Konsultasi Maklon Herbal"}
                          onChange={(e) => handleFieldChange("sidebarCtaBadge", e.target.value)}
                          placeholder="Konsultasi Maklon Herbal"
                          className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-semibold text-foreground/80 block">
                            Judul Widget
                          </label>
                          <span className="text-[10px] text-muted-foreground">
                            Enter = baris baru
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          value={data.sidebarCtaTitle ?? "Punya Ide Formulasi Serupa?"}
                          onChange={(e) => handleFieldChange("sidebarCtaTitle", e.target.value)}
                          placeholder="Punya Ide Formulasi Serupa?"
                          className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D] resize-y leading-snug"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80 block">
                        Deskripsi Penjelasan Widget
                      </label>
                      <textarea
                        rows={2}
                        value={
                          data.sidebarCtaDesc ??
                          "Tim R&D dan apoteker CV. Indo Green Nature siap membantu memformulasikan produk herbal Anda hingga izin edar BPOM dan sertifikat Halal terbit."
                        }
                        onChange={(e) => handleFieldChange("sidebarCtaDesc", e.target.value)}
                        placeholder="Deskripsi penjelasan..."
                        className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 block">
                          Teks Tombol WhatsApp Utama
                        </label>
                        <input
                          type="text"
                          value={data.sidebarCtaBtnText ?? "Hubungi Tim R&D via WA"}
                          onChange={(e) => handleFieldChange("sidebarCtaBtnText", e.target.value)}
                          placeholder="Hubungi Tim R&D via WA"
                          className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 block">
                          Link / WhatsApp URL Tombol Utama
                        </label>
                        <input
                          type="text"
                          value={
                            data.sidebarCtaBtnLink ??
                            "https://wa.me/6281234567890?text=Halo%20CV.%20Indo%20Green%20Nature%2C%20saya%20tertarik%20konsultasi%20maklon%20produk%20herbal%20setelah%20membaca%20artikel%20insight."
                          }
                          onChange={(e) => handleFieldChange("sidebarCtaBtnLink", e.target.value)}
                          placeholder="https://wa.me/..."
                          className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-border/50">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 block">
                          Teks Sub-Link Bawah (Opsional)
                        </label>
                        <input
                          type="text"
                          value={data.sidebarCtaSublinkText ?? "Jelajahi Produk Kami"}
                          onChange={(e) => handleFieldChange("sidebarCtaSublinkText", e.target.value)}
                          placeholder="Jelajahi Produk Kami (kosongkan bila tidak ingin tampil)"
                          className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 block">
                          URL Sub-Link Bawah
                        </label>
                        <input
                          type="text"
                          value={data.sidebarCtaSublinkUrl ?? "/our-products"}
                          onChange={(e) => handleFieldChange("sidebarCtaSublinkUrl", e.target.value)}
                          placeholder="/our-products atau https://..."
                          className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── BAGIAN 2: CARD BAWAH (KEMBANGKAN BRAND HERBAL ANDA) ─── */}
                <div className="p-4 sm:p-5 rounded-[5px] border border-border bg-card shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <WhatsAppIcon className="w-4 h-4 text-[#15803D]" />
                      2. Card Bawah &ldquo;Kembangkan Brand Herbal Anda&rdquo;
                    </span>
                    <button
                      type="button"
                      onClick={() => handleFieldChange("bottomCtaShow", data.bottomCtaShow === false ? true : false)}
                      className={cn(
                        "px-3 py-1 rounded-[5px] text-xs font-bold transition-all cursor-pointer",
                        data.bottomCtaShow !== false
                          ? "bg-[#15803D] text-white shadow-xs"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {data.bottomCtaShow !== false ? "✓ Card Aktif" : "✕ Disembunyikan"}
                    </button>
                  </div>

                  {/* Pratinjau Interaktif Card Bawah */}
                  <div className="p-4 sm:p-6 bg-zinc-100 dark:bg-zinc-900/60 rounded-[5px] border border-border/60">
                    <div className="w-full rounded-[5px] border border-border bg-gradient-to-r from-[#15803D]/10 via-[#15803D]/5 to-transparent p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="space-y-1.5 max-w-xl text-center md:text-left">
                        <h4 className="text-base sm:text-lg font-extrabold text-foreground tracking-tight whitespace-pre-line">
                          {data.bottomCtaTitle || "Kembangkan Brand Herbal Anda Bersama CV. Indo Green Nature"}
                        </h4>
                        <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-line">
                          {data.bottomCtaDesc ||
                            "Dukungan lengkap mulai dari perancangan formula terstandar, uji laboratorium, legalitas izin edar BPOM & Halal, hingga produksi massal bersertifikat CPOTB."}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <div
                          style={{
                            backgroundColor: data.bottomCtaBtnBg || "#15803d",
                            color: data.bottomCtaBtnColor || "#ffffff",
                          }}
                          className="inline-flex items-center gap-2 rounded-[5px] px-4 py-2.5 text-xs font-bold shadow-sm select-none"
                        >
                          <WhatsAppIcon className="size-3.5" />
                          <span>{data.bottomCtaBtnText || "Konsultasi Maklon Sekarang"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Inputs Card Bawah */}
                  <div className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-foreground/80 block">
                          Judul Utama Card
                        </label>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          Enter = baris baru (turun)
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={data.bottomCtaTitle ?? "Kembangkan Brand Herbal Anda Bersama CV. Indo Green Nature"}
                        onChange={(e) => handleFieldChange("bottomCtaTitle", e.target.value)}
                        placeholder="Kembangkan Brand Herbal Anda Bersama CV. Indo Green Nature"
                        className="w-full px-3 py-2 rounded-[5px] text-xs bg-background border border-border font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D] resize-y leading-snug"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-foreground/80 block">
                          Deskripsi Card
                        </label>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          Enter = baris baru (turun)
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={
                          data.bottomCtaDesc ??
                          "Dukungan lengkap mulai dari perancangan formula terstandar, uji laboratorium, legalitas izin edar BPOM & Halal, hingga produksi massal bersertifikat CPOTB."
                        }
                        onChange={(e) => handleFieldChange("bottomCtaDesc", e.target.value)}
                        placeholder="Dukungan lengkap..."
                        className="w-full px-3 py-2 rounded-[5px] text-xs bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D] resize-y leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 block">
                          Teks Tombol Konsultasi Maklon
                        </label>
                        <input
                          type="text"
                          value={data.bottomCtaBtnText ?? "Konsultasi Maklon Sekarang"}
                          onChange={(e) => handleFieldChange("bottomCtaBtnText", e.target.value)}
                          placeholder="Konsultasi Maklon Sekarang"
                          className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 block">
                          Link / WhatsApp URL Tombol Konsultasi
                        </label>
                        <input
                          type="text"
                          value={
                            data.bottomCtaBtnLink ??
                            "https://wa.me/6281234567890?text=Halo%20CV.%20Indo%20Green%20Nature%2C%20saya%20ingin%20konsultasi%20layanan%20maklon%20herbal."
                          }
                          onChange={(e) => handleFieldChange("bottomCtaBtnLink", e.target.value)}
                          placeholder="https://wa.me/..."
                          className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                        />
                      </div>
                    </div>

                    {/* Styling Warna Tombol */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/50">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 block">
                          Warna Background Tombol
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.bottomCtaBtnBg, "#15803d")}
                            onChange={(e) => handleFieldChange("bottomCtaBtnBg", e.target.value)}
                            className="w-8 h-8 rounded border border-border cursor-pointer p-0 bg-transparent shrink-0"
                          />
                          <input
                            type="text"
                            value={data.bottomCtaBtnBg || "#15803d"}
                            onChange={(e) => handleFieldChange("bottomCtaBtnBg", e.target.value)}
                            placeholder="#15803d"
                            className="w-full px-3 py-1.5 rounded-[5px] text-xs font-mono bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 block">
                          Warna Teks Tombol
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.bottomCtaBtnColor, "#ffffff")}
                            onChange={(e) => handleFieldChange("bottomCtaBtnColor", e.target.value)}
                            className="w-8 h-8 rounded border border-border cursor-pointer p-0 bg-transparent shrink-0"
                          />
                          <input
                            type="text"
                            value={data.bottomCtaBtnColor || "#ffffff"}
                            onChange={(e) => handleFieldChange("bottomCtaBtnColor", e.target.value)}
                            placeholder="#ffffff"
                            className="w-full px-3 py-1.5 rounded-[5px] text-xs font-mono bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── BAGIAN 3: UKURAN & FORMAT FOTO FRAME INSIGHT (COVER ARTIKEL) ─── */}
                <div className="p-4 sm:p-5 rounded-[5px] border border-border bg-card shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#15803D]" />
                      3. Ukuran &amp; Format Foto Frame Insight (Cover Artikel)
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-[4px] bg-green-50 dark:bg-green-950/40 text-[#15803D] dark:text-green-400 border border-[#15803D]/25 font-mono">
                      {data.articleCoverHeight || 467}px
                    </span>
                  </div>

                  {/* Pratinjau Interaktif Foto Frame Insight */}
                  <div className="p-4 sm:p-5 bg-zinc-100 dark:bg-zinc-900/60 rounded-[5px] border border-border/60 space-y-2">
                    <span className="text-[11px] font-semibold text-muted-foreground block">
                      Pratinjau Skala Foto Frame di Desktop:
                    </span>
                    <div
                      style={{
                        height: `${Math.min(Math.round((data.articleCoverHeight || 467) * 0.45), 240)}px`,
                      }}
                      className="w-full max-w-[420px] mx-auto rounded-[5px] overflow-hidden border border-border shadow-xs bg-muted transition-all relative"
                    >
                      <img
                        src="/images/banner-default.jpg"
                        alt="Pratinjau Cover"
                        style={{
                          objectFit: data.articleCoverFit || "cover",
                        }}
                        className="w-full h-full"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-[4px] bg-black/70 text-white font-mono text-[10px] backdrop-blur-xs">
                        Tinggi Asli: {data.articleCoverHeight || 467}px
                      </div>
                    </div>
                  </div>

                  {/* Slider Bar & Presets Ukuran Foto */}
                  <div className="space-y-4 pt-1">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-foreground/80 block">
                          Bilah Geser Tinggi Foto (Fungsi Bar)
                        </label>
                        <span className="text-xs font-mono font-bold text-[#15803D] dark:text-green-400">
                          {data.articleCoverHeight || 467}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="240"
                        max="650"
                        step="10"
                        value={data.articleCoverHeight || 467}
                        onChange={(e) => handleFieldChange("articleCoverHeight", parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-[#15803D]"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                        <span>240px (Ramping)</span>
                        <span>467px (Figma Standar)</span>
                        <span>650px (Tinggi Penuh)</span>
                      </div>
                    </div>

                    {/* Tombol Preset Ukuran Cepat */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80 block">
                        Preset Ukuran Cepat
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { label: "320px", desc: "Ringkas", val: 320 },
                          { label: "400px", desc: "Sedang", val: 400 },
                          { label: "467px", desc: "Figma Standar", val: 467 },
                          { label: "540px", desc: "Besar", val: 540 },
                        ].map((btn) => (
                          <button
                            key={btn.val}
                            type="button"
                            onClick={() => handleFieldChange("articleCoverHeight", btn.val)}
                            className={cn(
                              "p-2 rounded-[5px] border text-left transition-all cursor-pointer",
                              (data.articleCoverHeight || 467) === btn.val
                                ? "bg-[#15803D] text-white border-[#15803D] shadow-xs"
                                : "bg-background border-border text-foreground hover:bg-muted"
                            )}
                          >
                            <span className="text-xs font-bold block">{btn.label}</span>
                            <span className={cn("text-[10px]", (data.articleCoverHeight || 467) === btn.val ? "text-green-100" : "text-muted-foreground")}>
                              {btn.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mode Tampilan Objek Gambar (Cover vs Contain) */}
                    <div className="space-y-1.5 pt-2 border-t border-border/50">
                      <label className="text-[11px] font-semibold text-foreground/80 block">
                        Mode Potongan Gambar (Object Fit)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleFieldChange("articleCoverFit", "cover")}
                          className={cn(
                            "p-2 rounded-[5px] border text-center text-xs font-bold transition-all cursor-pointer",
                            (data.articleCoverFit || "cover") === "cover"
                              ? "bg-[#15803D] text-white border-[#15803D] shadow-xs"
                              : "bg-background border-border text-foreground hover:bg-muted"
                          )}
                        >
                          Cover (Penuh Terpotong Rapi)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange("articleCoverFit", "contain")}
                          className={cn(
                            "p-2 rounded-[5px] border text-center text-xs font-bold transition-all cursor-pointer",
                            data.articleCoverFit === "contain"
                              ? "bg-[#15803D] text-white border-[#15803D] shadow-xs"
                              : "bg-background border-border text-foreground hover:bg-muted"
                          )}
                        >
                          Contain (Utuh Tanpa Terpotong)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Header intro */}
                <div>
                  <h3 className={cn("text-lg font-bold text-foreground", poppins.className)}>
                    Kustomisasi Banner Utama Insight
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ubah judul, warna teks, gradien sorotan, gaya font, badge, deskripsi, latar belakang, hingga opsi bilah pencarian secara fleksibel.
                  </p>
                </div>

                {/* ─── BLOK 1: JUDUL UTAMA & HIGHLIGHT ─── */}
                <div className="p-4 sm:p-5 rounded-[5px] border border-border bg-card shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Type className="w-4 h-4 text-[#15803D]" />
                      1. Judul Utama &amp; Teks Sorotan
                    </span>
                    <span className="text-[11px] font-mono text-[#15803D] bg-[#15803D]/10 px-2 py-0.5 rounded-[5px]">
                      Hero Heading
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Baris 1: Judul Utama */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Judul Baris 1
                      </label>
                      <input
                        type="text"
                        value={data.bannerTitleLine1}
                        onChange={(e) => handleFieldChange("bannerTitleLine1", e.target.value)}
                        placeholder="Contoh: Insight & Riset Herbal"
                        className="w-full px-3 py-2 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                      />
                    </div>

                    {/* Baris 2: Teks Sorotan */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Judul Baris 2 (Teks Sorotan)
                      </label>
                      <input
                        type="text"
                        value={data.bannerTitleLine2}
                        onChange={(e) => handleFieldChange("bannerTitleLine2", e.target.value)}
                        placeholder="Contoh: CV. Indo Green Nature"
                        className="w-full px-3 py-2 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                      />
                    </div>
                  </div>

                  {/* Opsi Gradien Sorotan */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="useGradient"
                      checked={data.bannerTitleUseGradient}
                      onChange={(e) => handleFieldChange("bannerTitleUseGradient", e.target.checked)}
                      className="rounded border-border text-[#15803D] focus:ring-[#15803D] cursor-pointer"
                    />
                    <label htmlFor="useGradient" className="text-xs font-medium text-foreground cursor-pointer select-none">
                      Terapkan Efek Gradien Berkilau pada Baris 2
                    </label>
                  </div>

                  {/* Kontrol Tipografi & Warna Judul */}
                  <div className="p-3.5 rounded-[5px] bg-muted/40 border border-border space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Gaya Font */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                          <span>Gaya Font</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {data.bannerTitleFont || "outfit"}
                          </span>
                        </label>
                        <FontSelect
                          value={data.bannerTitleFont || "outfit"}
                          onChange={(val) => handleFieldChange("bannerTitleFont", val)}
                        />
                      </div>

                      {/* Ukuran Font Slider */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Ukuran Font</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {data.bannerTitleSize || 44}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min={24}
                          max={68}
                          step={1}
                          value={data.bannerTitleSize || 44}
                          onChange={(e) => handleFieldChange("bannerTitleSize", parseInt(e.target.value, 10))}
                          className="w-full accent-[#15803D] cursor-pointer h-6"
                        />
                      </div>

                      {/* Ketebalan Font (Font Weight) */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-foreground/80">
                          Ketebalan
                        </label>
                        <select
                          value={data.bannerTitleWeight || "800"}
                          onChange={(e) => handleFieldChange("bannerTitleWeight", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                        >
                          <option value="600">SemiBold (600)</option>
                          <option value="700">Bold (700)</option>
                          <option value="800">ExtraBold (800)</option>
                          <option value="900">Black (900)</option>
                        </select>
                      </div>

                      {/* Perataan Teks (Alignment) */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-foreground/80">
                          Perataan Teks
                        </label>
                        <div className="flex items-center rounded-[5px] border border-border bg-background p-0.5">
                          <button
                            type="button"
                            onClick={() => handleFieldChange("bannerTitleAlign", "left")}
                            className={cn(
                              "flex-1 py-1 flex items-center justify-center rounded-[3px] transition-colors",
                              (data.bannerTitleAlign === "left" || !data.bannerTitleAlign)
                                ? "bg-[#15803D] text-white"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                            title="Rata Kiri"
                          >
                            <AlignLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFieldChange("bannerTitleAlign", "center")}
                            className={cn(
                              "flex-1 py-1 flex items-center justify-center rounded-[3px] transition-colors",
                              data.bannerTitleAlign === "center"
                                ? "bg-[#15803D] text-white"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                            title="Rata Tengah"
                          >
                            <AlignCenter className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFieldChange("bannerTitleAlign", "right")}
                            className={cn(
                              "flex-1 py-1 flex items-center justify-center rounded-[3px] transition-colors",
                              data.bannerTitleAlign === "right"
                                ? "bg-[#15803D] text-white"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                            title="Rata Kanan"
                          >
                            <AlignRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Palet Warna Judul */}
                    <div className="pt-2 border-t border-border/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground block">
                          Warna Baris 1
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.bannerTitleColor, "#18181b")}
                            onChange={(e) => handleFieldChange("bannerTitleColor", e.target.value)}
                            className="w-7 h-7 rounded border border-border cursor-pointer p-0 shrink-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={data.bannerTitleColor || "Default Tema"}
                            onChange={(e) => handleFieldChange("bannerTitleColor", e.target.value)}
                            className="flex-1 px-2 py-1 text-[11px] font-mono rounded-[5px] bg-background border border-border"
                          />
                        </div>
                      </div>

                      {data.bannerTitleUseGradient ? (
                        <>
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-muted-foreground block">
                              Gradien Awal Baris 2
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={toSafeHexColor(data.bannerTitleGradientFrom, "#166534")}
                                onChange={(e) => handleFieldChange("bannerTitleGradientFrom", e.target.value)}
                                className="w-7 h-7 rounded border border-border cursor-pointer p-0 shrink-0 bg-transparent"
                              />
                              <input
                                type="text"
                                value={data.bannerTitleGradientFrom}
                                onChange={(e) => handleFieldChange("bannerTitleGradientFrom", e.target.value)}
                                className="flex-1 px-2 py-1 text-[11px] font-mono rounded-[5px] bg-background border border-border"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-muted-foreground block">
                              Gradien Akhir Baris 2
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={toSafeHexColor(data.bannerTitleGradientTo, "#15803d")}
                                onChange={(e) => handleFieldChange("bannerTitleGradientTo", e.target.value)}
                                className="w-7 h-7 rounded border border-border cursor-pointer p-0 shrink-0 bg-transparent"
                              />
                              <input
                                type="text"
                                value={data.bannerTitleGradientTo}
                                onChange={(e) => handleFieldChange("bannerTitleGradientTo", e.target.value)}
                                className="flex-1 px-2 py-1 text-[11px] font-mono rounded-[5px] bg-background border border-border"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[10px] font-semibold text-muted-foreground block">
                            Warna Solid Baris 2
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={toSafeHexColor(data.bannerTitleHighlightColor, "#15803d")}
                              onChange={(e) => handleFieldChange("bannerTitleHighlightColor", e.target.value)}
                              className="w-7 h-7 rounded border border-border cursor-pointer p-0 shrink-0 bg-transparent"
                            />
                            <input
                              type="text"
                              value={data.bannerTitleHighlightColor}
                              onChange={(e) => handleFieldChange("bannerTitleHighlightColor", e.target.value)}
                              className="flex-1 px-2 py-1 text-[11px] font-mono rounded-[5px] bg-background border border-border"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ─── BLOK 2: BADGE / SUB-JUDUL ATAS ─── */}
                <div className="p-4 sm:p-5 rounded-[5px] border border-border bg-card shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#15803D]" />
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                        2. Badge Sub-Judul Banner
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="showBadge"
                        checked={data.bannerBadgeShow}
                        onChange={(e) => handleFieldChange("bannerBadgeShow", e.target.checked)}
                        className="rounded border-border text-[#15803D] focus:ring-[#15803D] cursor-pointer"
                      />
                      <label htmlFor="showBadge" className="text-xs text-muted-foreground cursor-pointer select-none">
                        Tampilkan Badge
                      </label>
                    </div>
                  </div>

                  {data.bannerBadgeShow && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Teks Badge
                        </label>
                        <input
                          type="text"
                          value={data.bannerBadgeText}
                          onChange={(e) => handleFieldChange("bannerBadgeText", e.target.value)}
                          placeholder="Teks badge sub-judul..."
                          className="w-full px-3 py-2 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-[5px] bg-muted/40 border border-border">
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-muted-foreground block">
                            Warna Teks Badge
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={toSafeHexColor(data.bannerBadgeColor, "#15803d")}
                              onChange={(e) => handleFieldChange("bannerBadgeColor", e.target.value)}
                              className="w-7 h-7 rounded border border-border cursor-pointer p-0 bg-transparent shrink-0"
                            />
                            <input
                              type="text"
                              value={data.bannerBadgeColor}
                              onChange={(e) => handleFieldChange("bannerBadgeColor", e.target.value)}
                              className="flex-1 px-2 py-1 text-[11px] font-mono rounded-[5px] bg-background border border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-muted-foreground block">
                            Background Badge
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={toSafeHexColor(data.bannerBadgeBg?.substring(0, 7), "#15803d")}
                              onChange={(e) => handleFieldChange("bannerBadgeBg", e.target.value + "26")}
                              className="w-7 h-7 rounded border border-border cursor-pointer p-0 bg-transparent shrink-0"
                            />
                            <input
                              type="text"
                              value={data.bannerBadgeBg}
                              onChange={(e) => handleFieldChange("bannerBadgeBg", e.target.value)}
                              className="flex-1 px-2 py-1 text-[11px] font-mono rounded-[5px] bg-background border border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-muted-foreground block">
                            Border Badge
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={toSafeHexColor(data.bannerBadgeBorderColor?.substring(0, 7), "#15803d")}
                              onChange={(e) => handleFieldChange("bannerBadgeBorderColor", e.target.value + "4d")}
                              className="w-7 h-7 rounded border border-border cursor-pointer p-0 bg-transparent shrink-0"
                            />
                            <input
                              type="text"
                              value={data.bannerBadgeBorderColor}
                              onChange={(e) => handleFieldChange("bannerBadgeBorderColor", e.target.value)}
                              className="flex-1 px-2 py-1 text-[11px] font-mono rounded-[5px] bg-background border border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                            <span>Ukuran Font</span>
                            <span className="font-mono text-[#15803D]">{data.bannerBadgeSize || 12}px</span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={16}
                            step={1}
                            value={data.bannerBadgeSize || 12}
                            onChange={(e) => handleFieldChange("bannerBadgeSize", parseInt(e.target.value, 10))}
                            className="w-full accent-[#15803D] cursor-pointer h-6"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ─── BLOK 3: DESKRIPSI PENGANTAR ─── */}
                <div className="p-4 sm:p-5 rounded-[5px] border border-border bg-card shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <LayoutTemplate className="w-4 h-4 text-[#15803D]" />
                      3. Deskripsi Pengantar Banner
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="showDesc"
                        checked={data.bannerDescShow}
                        onChange={(e) => handleFieldChange("bannerDescShow", e.target.checked)}
                        className="rounded border-border text-[#15803D] focus:ring-[#15803D] cursor-pointer"
                      />
                      <label htmlFor="showDesc" className="text-xs text-muted-foreground cursor-pointer select-none">
                        Tampilkan Deskripsi
                      </label>
                    </div>
                  </div>

                  {data.bannerDescShow && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Isi Paragraf Deskripsi
                        </label>
                        <textarea
                          rows={3}
                          value={data.bannerDesc}
                          onChange={(e) => handleFieldChange("bannerDesc", e.target.value)}
                          placeholder="Deskripsi rangkuman insight herbal..."
                          className="w-full px-3 py-2 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D] leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-[5px] bg-muted/40 border border-border">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                            <span>Gaya Font</span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {data.bannerDescFont || "poppins"}
                            </span>
                          </label>
                          <FontSelect
                            value={data.bannerDescFont || "poppins"}
                            onChange={(val) => handleFieldChange("bannerDescFont", val)}
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                            <span>Ukuran Font</span>
                            <span className="text-[10px] font-mono text-[#15803D] font-bold">
                              {data.bannerDescSize || 15}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min={12}
                            max={20}
                            step={1}
                            value={data.bannerDescSize || 15}
                            onChange={(e) => handleFieldChange("bannerDescSize", parseInt(e.target.value, 10))}
                            className="w-full accent-[#15803D] cursor-pointer h-6"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-foreground/80 block">
                            Warna Teks Deskripsi
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={toSafeHexColor(data.bannerDescColor, "#71717a")}
                              onChange={(e) => handleFieldChange("bannerDescColor", e.target.value)}
                              className="w-7 h-7 rounded border border-border cursor-pointer p-0 bg-transparent shrink-0"
                            />
                            <input
                              type="text"
                              value={data.bannerDescColor || "Default Muted"}
                              onChange={(e) => handleFieldChange("bannerDescColor", e.target.value)}
                              className="flex-1 px-2 py-1 text-[11px] font-mono rounded-[5px] bg-background border border-border"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ─── BLOK 4: LATAR BELAKANG & POLA DEKORASI ─── */}
                <div className="p-4 sm:p-5 rounded-[5px] border border-border bg-card shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#15803D]" />
                      4. Latar Belakang (Background) &amp; Pola Titik
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Gaya Tampilan Section
                    </span>
                  </div>

                  {/* Tipe Background */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground block">
                      Tipe Latar Belakang:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleFieldChange("bannerBgType", "gradient")}
                        className={cn(
                          "py-2 px-3 rounded-[5px] border text-xs font-semibold transition-all",
                          data.bannerBgType === "gradient"
                            ? "border-[#15803D] bg-[#15803D]/10 text-green-800 dark:text-green-300 ring-1 ring-[#15803D]"
                            : "border-border hover:bg-muted text-muted-foreground"
                        )}
                      >
                        Gradien Halus
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFieldChange("bannerBgType", "solid")}
                        className={cn(
                          "py-2 px-3 rounded-[5px] border text-xs font-semibold transition-all",
                          data.bannerBgType === "solid"
                            ? "border-[#15803D] bg-[#15803D]/10 text-green-800 dark:text-green-300 ring-1 ring-[#15803D]"
                            : "border-border hover:bg-muted text-muted-foreground"
                        )}
                      >
                        Warna Polos
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFieldChange("bannerBgType", "image")}
                        className={cn(
                          "py-2 px-3 rounded-[5px] border text-xs font-semibold transition-all",
                          data.bannerBgType === "image"
                            ? "border-[#15803D] bg-[#15803D]/10 text-green-800 dark:text-green-300 ring-1 ring-[#15803D]"
                            : "border-border hover:bg-muted text-muted-foreground"
                        )}
                      >
                        Gambar Khusus
                      </button>
                    </div>
                  </div>

                  {/* Kontrol Sesuai Tipe Background */}
                  {data.bannerBgType === "gradient" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-[5px] bg-muted/40 border border-border">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground block">
                          Gradien Atas (From)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.bannerBgGradientFrom?.substring(0, 7), "#15803d")}
                            onChange={(e) => handleFieldChange("bannerBgGradientFrom", e.target.value + "26")}
                            className="w-7 h-7 rounded border border-border cursor-pointer p-0 bg-transparent shrink-0"
                          />
                          <input
                            type="text"
                            value={data.bannerBgGradientFrom}
                            onChange={(e) => handleFieldChange("bannerBgGradientFrom", e.target.value)}
                            className="flex-1 px-2 py-1 text-[11px] font-mono rounded-[5px] bg-background border border-border"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground block">
                          Gradien Tengah (Via)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.bannerBgGradientVia?.substring(0, 7), "#15803d")}
                            onChange={(e) => handleFieldChange("bannerBgGradientVia", e.target.value + "14")}
                            className="w-7 h-7 rounded border border-border cursor-pointer p-0 bg-transparent shrink-0"
                          />
                          <input
                            type="text"
                            value={data.bannerBgGradientVia}
                            onChange={(e) => handleFieldChange("bannerBgGradientVia", e.target.value)}
                            className="flex-1 px-2 py-1 text-[11px] font-mono rounded-[5px] bg-background border border-border"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground block">
                          Gradien Bawah (To)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={data.bannerBgGradientTo}
                            onChange={(e) => handleFieldChange("bannerBgGradientTo", e.target.value)}
                            className="w-full px-2 py-1 text-[11px] font-mono rounded-[5px] bg-background border border-border"
                            placeholder="transparent / #ffffff"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {data.bannerBgType === "solid" && (
                    <div className="p-3 rounded-[5px] bg-muted/40 border border-border space-y-1">
                      <label className="text-xs font-semibold text-foreground block">
                        Pilih Warna Polos Background
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={toSafeHexColor(data.bannerBgSolidColor, "#ffffff")}
                          onChange={(e) => handleFieldChange("bannerBgSolidColor", e.target.value)}
                          className="w-8 h-8 rounded border border-border cursor-pointer p-0 bg-transparent shrink-0"
                        />
                        <input
                          type="text"
                          value={data.bannerBgSolidColor}
                          onChange={(e) => handleFieldChange("bannerBgSolidColor", e.target.value)}
                          className="max-w-[180px] px-2.5 py-1.5 text-xs font-mono rounded-[5px] bg-background border border-border"
                        />
                      </div>
                    </div>
                  )}

                  {data.bannerBgType === "image" && (
                    <div className="p-3.5 rounded-[5px] bg-muted/40 border border-border space-y-3">
                      <label className="text-xs font-semibold text-foreground block">
                        URL atau File Gambar Latar Belakang
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={data.bannerBgImage}
                          onChange={(e) => handleFieldChange("bannerBgImage", e.target.value)}
                          placeholder="https://... atau klik tombol Upload"
                          className="flex-1 px-3 py-1.5 text-xs rounded-[5px] bg-background border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => bgImageInputRef.current?.click()}
                          disabled={isUploadingBg}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                        >
                          <Upload className={cn("w-3.5 h-3.5", isUploadingBg && "animate-spin")} />
                          <span>{isUploadingBg ? "Upload..." : "Upload"}</span>
                        </button>
                      </div>
                      {data.bannerBgImage && (
                        <div className="relative aspect-[21/9] max-h-32 overflow-hidden rounded-[5px] border border-border">
                          <img
                            src={data.bannerBgImage}
                            alt="Background Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleFieldChange("bannerBgImage", "")}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-black"
                            title="Hapus Gambar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pola Titik Dot Matrix */}
                  <div className="pt-2 border-t border-border/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="showPattern"
                          checked={data.bannerShowPattern}
                          onChange={(e) => handleFieldChange("bannerShowPattern", e.target.checked)}
                          className="rounded border-border text-[#15803D] focus:ring-[#15803D] cursor-pointer"
                        />
                        <label htmlFor="showPattern" className="text-xs font-semibold text-foreground cursor-pointer select-none">
                          Tampilkan Pola Titik Grid (Dot Matrix Texture)
                        </label>
                      </div>
                    </div>

                    {data.bannerShowPattern && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-[5px] bg-muted/40 border border-border">
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-muted-foreground block">
                            Warna Titik Grid
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={toSafeHexColor(data.bannerPatternColor, "#15803d")}
                              onChange={(e) => handleFieldChange("bannerPatternColor", e.target.value)}
                              className="w-7 h-7 rounded border border-border cursor-pointer p-0 bg-transparent shrink-0"
                            />
                            <input
                              type="text"
                              value={data.bannerPatternColor}
                              onChange={(e) => handleFieldChange("bannerPatternColor", e.target.value)}
                              className="flex-1 px-2 py-1 text-[11px] font-mono rounded-[5px] bg-background border border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                            <span>Opasitas Pola Titik</span>
                            <span className="font-mono text-[#15803D]">{data.bannerPatternOpacity || 15}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={60}
                            step={1}
                            value={data.bannerPatternOpacity || 15}
                            onChange={(e) => handleFieldChange("bannerPatternOpacity", parseInt(e.target.value, 10))}
                            className="w-full accent-[#15803D] cursor-pointer h-6"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ─── BLOK 5: PENCARIAN & TAB KATEGORI ─── */}
                <div className="p-4 sm:p-5 rounded-[5px] border border-border bg-card shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#15803D]" />
                      5. Bilah Pencarian &amp; Filter Kategori
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Kontrol Navigasi Hero
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search Bar Settings */}
                    <div className="space-y-2 p-3.5 rounded-[5px] bg-muted/40 border border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">
                          Input Pencarian
                        </span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            id="showSearch"
                            checked={data.bannerShowSearch}
                            onChange={(e) => handleFieldChange("bannerShowSearch", e.target.checked)}
                            className="rounded border-border text-[#15803D] focus:ring-[#15803D] cursor-pointer"
                          />
                          <label htmlFor="showSearch" className="text-xs text-muted-foreground cursor-pointer select-none">
                            Aktif
                          </label>
                        </div>
                      </div>
                      {data.bannerShowSearch && (
                        <div className="space-y-1">
                          <label className="text-[11px] text-muted-foreground block">
                            Placeholder Teks
                          </label>
                          <input
                            type="text"
                            value={data.bannerSearchPlaceholder}
                            onChange={(e) => handleFieldChange("bannerSearchPlaceholder", e.target.value)}
                            placeholder="Cari insight, bahan, regulasi..."
                            className="w-full px-2.5 py-1.5 text-xs rounded-[5px] bg-background border border-border"
                          />
                        </div>
                      )}
                    </div>

                    {/* Categories Pills Settings */}
                    <div className="space-y-2 p-3.5 rounded-[5px] bg-muted/40 border border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">
                          Pilihan Tab Kategori
                        </span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            id="showCategories"
                            checked={data.bannerShowCategories}
                            onChange={(e) => handleFieldChange("bannerShowCategories", e.target.checked)}
                            className="rounded border-border text-[#15803D] focus:ring-[#15803D] cursor-pointer"
                          />
                          <label htmlFor="showCategories" className="text-xs text-muted-foreground cursor-pointer select-none">
                            Aktif
                          </label>
                        </div>
                      </div>

                      {data.bannerShowCategories && (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="space-y-1">
                            <label className="text-[10px] text-muted-foreground block font-semibold">
                              Warna Tab Aktif
                            </label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={toSafeHexColor(data.bannerCategoryActiveBg, "#15803d")}
                                onChange={(e) => handleFieldChange("bannerCategoryActiveBg", e.target.value)}
                                className="w-6 h-6 rounded border border-border cursor-pointer p-0 bg-transparent shrink-0"
                              />
                              <input
                                type="text"
                                value={data.bannerCategoryActiveBg}
                                onChange={(e) => handleFieldChange("bannerCategoryActiveBg", e.target.value)}
                                className="w-full px-2 py-1 text-[10px] font-mono rounded-[5px] bg-background border border-border"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-muted-foreground block font-semibold">
                              Warna Teks Aktif
                            </label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={toSafeHexColor(data.bannerCategoryActiveColor, "#ffffff")}
                                onChange={(e) => handleFieldChange("bannerCategoryActiveColor", e.target.value)}
                                className="w-6 h-6 rounded border border-border cursor-pointer p-0 bg-transparent shrink-0"
                              />
                              <input
                                type="text"
                                value={data.bannerCategoryActiveColor}
                                onChange={(e) => handleFieldChange("bannerCategoryActiveColor", e.target.value)}
                                className="w-full px-2 py-1 text-[10px] font-mono rounded-[5px] bg-background border border-border"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ─── BLOK 6: TOMBOL CTA OPSIONAL DI BANNER ─── */}
                <div className="p-4 sm:p-5 rounded-[5px] border border-border bg-card shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <MousePointerClick className="w-4 h-4 text-[#15803D]" />
                      6. Tombol Aksi Hero Banner (Opsional)
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="showCta"
                        checked={data.bannerShowCta}
                        onChange={(e) => handleFieldChange("bannerShowCta", e.target.checked)}
                        className="rounded border-border text-[#15803D] focus:ring-[#15803D] cursor-pointer"
                      />
                      <label htmlFor="showCta" className="text-xs text-muted-foreground cursor-pointer select-none">
                        Tampilkan Tombol CTA
                      </label>
                    </div>
                  </div>

                  {data.bannerShowCta && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-[5px] bg-muted/40 border border-border">
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[11px] font-semibold text-foreground/80 block">
                          Teks Tombol
                        </label>
                        <input
                          type="text"
                          value={data.bannerCtaText}
                          onChange={(e) => handleFieldChange("bannerCtaText", e.target.value)}
                          placeholder="Contoh: Konsultasi Formulasi"
                          className="w-full px-2.5 py-1.5 text-xs rounded-[5px] bg-background border border-border"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[11px] font-semibold text-foreground/80 block">
                          Tautan URL Tombol
                        </label>
                        <input
                          type="text"
                          value={data.bannerCtaLink}
                          onChange={(e) => handleFieldChange("bannerCtaLink", e.target.value)}
                          placeholder="https://wa.me/... atau /our-products"
                          className="w-full px-2.5 py-1.5 text-xs rounded-[5px] bg-background border border-border"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground block">
                          Warna Background Tombol
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={toSafeHexColor(data.bannerCtaBg, "#15803d")}
                            onChange={(e) => handleFieldChange("bannerCtaBg", e.target.value)}
                            className="w-6 h-6 rounded border border-border cursor-pointer p-0 bg-transparent shrink-0"
                          />
                          <input
                            type="text"
                            value={data.bannerCtaBg}
                            onChange={(e) => handleFieldChange("bannerCtaBg", e.target.value)}
                            className="w-full px-2 py-1 text-[10px] font-mono rounded-[5px] bg-background border border-border"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground block">
                          Warna Teks Tombol
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={toSafeHexColor(data.bannerCtaTextColor, "#ffffff")}
                            onChange={(e) => handleFieldChange("bannerCtaTextColor", e.target.value)}
                            className="w-6 h-6 rounded border border-border cursor-pointer p-0 bg-transparent shrink-0"
                          />
                          <input
                            type="text"
                            value={data.bannerCtaTextColor}
                            onChange={(e) => handleFieldChange("bannerCtaTextColor", e.target.value)}
                            className="w-full px-2 py-1 text-[10px] font-mono rounded-[5px] bg-background border border-border"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ─── BLOK 7: FRAME 1:1 POJOK KANAN (RINGKASAN & SHORTCUT) ─── */}
                <div className="p-4 sm:p-5 rounded-[5px] border border-border bg-card shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <Square className="w-4 h-4 text-[#15803D]" />
                      7. Frame 1:1 Pojok Kanan Hero Banner
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("frame")}
                      className="text-[11px] font-bold text-[#15803D] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Buka Pengaturan Lengkap</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-[5px] bg-muted/30 border border-border/60">
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          borderRadius: `${data.bannerFrameRounded ?? 5}px`,
                          borderColor: data.bannerFrameBorderColor || "rgba(21, 128, 61, 0.2)",
                        }}
                        className="w-14 h-14 rounded-[5px] border aspect-square overflow-hidden bg-background shrink-0 shadow-xs"
                      >
                        {data.bannerFrameImage ? (
                          <img
                            src={data.bannerFrameImage}
                            alt="Frame Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">
                            1:1
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-foreground block">
                          Frame Foto Bujur Sangkar (1:1)
                        </span>
                        <span className="text-[11px] text-muted-foreground block">
                          Status: <strong className={data.bannerFrameShow ? "text-[#15803D]" : "text-zinc-500"}>{data.bannerFrameShow ? "Aktif Tampil" : "Nonaktif"}</strong> &bull; Ukuran: {data.bannerFrameSize || 340}px
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleFieldChange("bannerFrameShow", !data.bannerFrameShow)}
                        className={cn(
                          "px-3 py-1.5 rounded-[5px] text-xs font-bold transition-all cursor-pointer",
                          data.bannerFrameShow
                            ? "bg-[#15803D] text-white"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {data.bannerFrameShow ? "Aktif" : "Nonaktif"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("frame")}
                        className="px-3.5 py-1.5 rounded-[5px] bg-background hover:bg-muted text-foreground text-xs font-semibold border border-border transition-colors cursor-pointer"
                      >
                        Kelola
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="w-full py-3 px-4 md:px-6 bg-zinc-50 dark:bg-zinc-800/60 border-t border-border flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[5px] bg-background hover:bg-muted text-zinc-700 dark:text-zinc-300 text-xs font-semibold border border-border transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
              <span>Reset Default</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-[5px] bg-transparent hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-[5px] bg-[#15803D] hover:bg-[#166534] disabled:opacity-60 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Save className={cn("w-3.5 h-3.5", isSaving && "animate-spin")} />
                <span>{isSaving ? "Menyimpan ke Database..." : "Simpan Pengaturan"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
