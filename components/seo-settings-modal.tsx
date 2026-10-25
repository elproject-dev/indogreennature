"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Save,
  RotateCcw,
  Globe,
  Search,
  Share2,
  ShieldCheck,
  Check,
  ExternalLink,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Copy,
  Smartphone,
  Monitor,
  Gauge,
  Zap,
  Bot,
  Activity,
  Send,
  Upload,
  Loader2,
  Trash2,
  Image as ImageIcon,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  SeoConfig,
  DEFAULT_SEO_CONFIG,
  getInitialSeoConfig,
  fetchSeoConfig,
  saveSeoConfig,
} from "@/lib/seo-settings"
import { uploadMedia } from "@/lib/storage"
import { cn } from "@/lib/utils"

interface SeoSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SeoSettingsModal({ isOpen, onClose }: SeoSettingsModalProps) {
  const [config, setConfig] = useState<SeoConfig>(getInitialSeoConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"meta" | "social" | "google" | "pagespeed" | "preview">("meta")
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop")
  const [isUploadingOg, setIsUploadingOg] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      fetchSeoConfig().then((data) => setConfig(data))
    }
  }, [isOpen])

  const handleOgFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (JPG, PNG, atau WebP)")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB")
      return
    }

    setIsUploadingOg(true)
    const toastId = toast.loading("Mengunggah dan mengompresi gambar media sosial...")

    try {
      const url = await uploadMedia(file, "seo")
      if (url) {
        setConfig((prev) => ({ ...prev, ogImageUrl: url }))
        toast.success("Gambar media sosial berhasil diunggah!", { id: toastId })
      } else {
        toast.error("Gagal mengunggah gambar ke storage", { id: toastId })
      }
    } catch (err) {
      console.error("Upload error:", err)
      toast.error("Terjadi kesalahan saat mengunggah gambar", { id: toastId })
    } finally {
      setIsUploadingOg(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }


  const handleSave = async () => {
    setIsSaving(true)
    const success = await saveSeoConfig(config)
    setIsSaving(false)
    if (success) {
      toast.success("Pengaturan SEO berhasil disimpan dan aktif!", {
        description: "Meta tags dan konfigurasi mesin pencari telah diperbarui.",
      })
      onClose()
    } else {
      toast.error("Gagal menyimpan pengaturan SEO.")
    }
  }

  const handleReset = () => {
    if (confirm("Kembalikan semua pengaturan SEO ke rekomendasi praktik terbaik?")) {
      setConfig(DEFAULT_SEO_CONFIG)
      toast.info("Pengaturan SEO telah direset ke rekomendasi standar.")
    }
  }

  const titleLength = config.siteTitle.length
  const descLength = config.siteDescription.length

  const isTitleGood = titleLength >= 40 && titleLength <= 65
  const isDescGood = descLength >= 120 && descLength <= 165

  // URL Target generator
  const rawTargetUrl = config.canonicalUrl?.trim() || "https://www.indogreennature.com"
  const targetUrl = rawTargetUrl.startsWith("http") ? rawTargetUrl.replace(/\/$/, "") : `https://${rawTargetUrl}`
  const targetDomain = targetUrl.replace(/^https?:\/\//, "")

  // Direct tool URLs
  const pagespeedUrl = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(targetUrl)}`
  const gscUrl = `https://search.google.com/search-console`
  const gscInspectUrl = `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(targetUrl + "/")}&id=${encodeURIComponent(targetUrl + "/")}`
  const gscSitemapsUrl = `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(targetUrl + "/")}`
  const richResultsUrl = `https://search.google.com/test/rich-results?url=${encodeURIComponent(targetUrl)}`

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-3 md:p-5">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container: Diperlebar full (96vw) agar baris teks panjang dan leluasa */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-[96vw] 2xl:max-w-[94vw] h-[95vh] max-h-[96vh] bg-card text-card-foreground border border-border shadow-2xl rounded-xl flex flex-col overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-muted/40 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
                    <span>Pengaturan SEO & Mesin Pencari</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">
                      Best Practice
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Target Domain: <span className="font-mono text-foreground font-medium">{targetDomain}</span>
                  </p>
                </div>
              </div>

              {/* Quick Actions Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <a
                  href={pagespeedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600/20 text-xs font-semibold transition-colors border border-emerald-600/20"
                  title="Cek Skor Performa & SEO di Google PageSpeed Insights"
                >
                  <Gauge className="w-3.5 h-3.5" />
                  <span>Cek PageSpeed</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <a
                  href={gscUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 text-blue-700 dark:text-blue-400 hover:bg-blue-600/20 text-xs font-semibold transition-colors border border-blue-600/20"
                  title="Buka Google Search Console untuk Inspeksi URL & Minta Googlebot Crawl"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Google Console</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer ml-1"
                  title="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 border-b border-border/80 bg-background flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("meta")}
                className={cn(
                  "py-3 px-3.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                  activeTab === "meta"
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Meta Tags & Konten</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={cn(
                  "py-3 px-3.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                  activeTab === "preview"
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Simulasi Pratinjau Google</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("social")}
                className={cn(
                  "py-3 px-3.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                  activeTab === "social"
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Media Sosial (Open Graph)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("google")}
                className={cn(
                  "py-3 px-3.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                  activeTab === "google"
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Google Console & Crawl</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("pagespeed")}
                className={cn(
                  "py-3 px-3.5 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                  activeTab === "pagespeed"
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Gauge className="w-3.5 h-3.5" />
                <span>Uji PageSpeed & Audit SEO</span>
              </button>
            </div>

            {/* Modal Body / Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-7 space-y-6">
              {/* TAB 1: META TAGS & KONTEN */}
              {activeTab === "meta" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Kolom Kiri: Form Input Lebih Luas */}
                  <div className="lg:col-span-7 xl:col-span-8 space-y-5">
                    {/* Judul Situs */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="siteTitle" className="text-xs font-semibold flex items-center gap-1.5">
                          <span>Judul Situs (Meta Title Utama)</span>
                          <span className="text-red-500">*</span>
                        </Label>
                        <span
                          className={cn(
                            "text-[11px] font-mono",
                            isTitleGood ? "text-emerald-600 font-semibold" : "text-amber-600"
                          )}
                        >
                          {titleLength} / 60 karakter {isTitleGood ? "✓ (Ideal)" : "(Disarankan 50-60)"}
                        </span>
                      </div>
                      <Input
                        id="siteTitle"
                        value={config.siteTitle}
                        onChange={(e) => setConfig({ ...config, siteTitle: e.target.value })}
                        placeholder="Contoh: CV. Indo Green Nature | Jasa Maklon Herbal BPOM & Halal Resmi"
                        className="text-sm h-10 w-full"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Tampil sebagai baris judul utama berwarna biru di halaman hasil pencarian Google.
                      </p>
                    </div>

                    {/* Deskripsi Situs */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="siteDescription" className="text-xs font-semibold flex items-center gap-1.5">
                          <span>Deskripsi Singkat (Meta Description)</span>
                          <span className="text-red-500">*</span>
                        </Label>
                        <span
                          className={cn(
                            "text-[11px] font-mono",
                            isDescGood ? "text-emerald-600 font-semibold" : "text-amber-600"
                          )}
                        >
                          {descLength} / 160 karakter {isDescGood ? "✓ (Ideal)" : "(Disarankan 120-160)"}
                        </span>
                      </div>
                      <Textarea
                        id="siteDescription"
                        rows={4}
                        value={config.siteDescription}
                        onChange={(e) => setConfig({ ...config, siteDescription: e.target.value })}
                        placeholder="Jelaskan ringkasan keunggulan jasa maklon herbal Anda secara persuasif..."
                        className="text-sm leading-relaxed w-full resize-y"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Teks ringkasan penjelas yang dibaca pengunjung sebelum mengklik tautan website Anda di Google.
                      </p>
                    </div>

                    {/* Target Kata Kunci */}
                    <div className="space-y-2">
                      <Label htmlFor="siteKeywords" className="text-xs font-semibold">
                        Target Kata Kunci (Keywords dipisahkan tanda koma)
                      </Label>
                      <Input
                        id="siteKeywords"
                        value={config.siteKeywords}
                        onChange={(e) => setConfig({ ...config, siteKeywords: e.target.value })}
                        placeholder="maklon herbal, jasa maklon herbal, maklon herbal bpom, pabrik herbal"
                        className="text-sm"
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {config.siteKeywords
                          .split(",")
                          .map((kw) => kw.trim())
                          .filter(Boolean)
                          .map((kw, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium"
                            >
                              #{kw}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Canonical URL & Izin Robot */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="canonicalUrl" className="text-xs font-semibold">
                          Domain / Canonical URL Resmi
                        </Label>
                        <Input
                          id="canonicalUrl"
                          value={config.canonicalUrl}
                          onChange={(e) => setConfig({ ...config, canonicalUrl: e.target.value })}
                          placeholder="https://indogreennature.com"
                          className="text-sm font-mono"
                        />
                      </div>

                      <div className="p-3 rounded-lg border border-border/80 bg-muted/20 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold block">Izinkan Mesin Pencari Mengindeks</span>
                          <span className="text-[10px] text-muted-foreground">
                            {config.robotsIndex ? "Aktif (Google diperbolehkan)" : "Mati (Noindex/Nofollow)"}
                          </span>
                        </div>
                        <Switch
                          checked={config.robotsIndex}
                          onCheckedChange={(checked) => setConfig({ ...config, robotsIndex: checked })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Kolom Kanan: Live Preview & Quick Audit */}
                  <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-0">
                    <div className="p-4 rounded-xl border border-border/80 bg-card shadow-sm space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-border/60">
                        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Monitor className="w-3.5 h-3.5 text-primary" />
                          <span>Pratinjau Hasil Google Live</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">Real-time</span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                            IGN
                          </div>
                          <div className="flex flex-col leading-none">
                            <span className="text-[11px] font-semibold text-foreground">CV. Indo Green Nature</span>
                            <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">
                              {config.canonicalUrl || "https://www.indogreennature.com"}
                            </span>
                          </div>
                        </div>

                        <h4 className="text-[15px] text-[#1a0dab] dark:text-[#8ab4f8] font-medium leading-snug line-clamp-2 hover:underline cursor-pointer">
                          {config.siteTitle || DEFAULT_SEO_CONFIG.siteTitle}
                        </h4>

                        <p className="text-[12px] text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-3">
                          {config.siteDescription || DEFAULT_SEO_CONFIG.siteDescription}
                        </p>
                      </div>
                    </div>

                    {/* Status Audit Checklist */}
                    <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-2.5 text-xs">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Audit Skor Teks SEO:</span>
                      </span>
                      <div className="space-y-2 text-[11px]">
                        <div className="flex items-center gap-2">
                          {isTitleGood ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          <span>Judul ({titleLength}/60 karakter): {isTitleGood ? "Panjang ideal" : "Disarankan 50-60"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isDescGood ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          <span>Deskripsi ({descLength}/160 karakter): {isDescGood ? "Panjang ideal" : "Disarankan 120-160"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SIMULASI PRATINJAU GOOGLE LEBAR */}
              {activeTab === "preview" && (
                <div className="space-y-4 max-w-5xl mx-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">Simulasi Hasil Pencarian Google</span>
                      <span className="text-[10px] text-muted-foreground">Real-time simulator</span>
                    </div>
                    <div className="flex items-center gap-1 bg-muted p-0.5 rounded-md text-xs">
                      <button
                        type="button"
                        onClick={() => setPreviewDevice("desktop")}
                        className={cn(
                          "px-2.5 py-1 rounded transition-colors flex items-center gap-1",
                          previewDevice === "desktop" ? "bg-card shadow-xs font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Desktop</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice("mobile")}
                        className={cn(
                          "px-2.5 py-1 rounded transition-colors flex items-center gap-1",
                          previewDevice === "mobile" ? "bg-card shadow-xs font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Mobile</span>
                      </button>
                    </div>
                  </div>

                  {/* Google Snippet Card */}
                  <div className={cn("p-5 rounded-xl border border-border/80 bg-card shadow-sm transition-all", previewDevice === "mobile" ? "max-w-[400px] mx-auto" : "w-full")}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                        IGN
                      </div>
                      <div className="flex flex-col leading-none">
                        <span className="text-[12px] font-semibold text-foreground">CV. Indo Green Nature</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{config.canonicalUrl || "https://indogreennature.com"}</span>
                      </div>
                    </div>

                    <h4 className="text-[16px] sm:text-[18px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-medium leading-snug line-clamp-2 mt-1">
                      {config.siteTitle || DEFAULT_SEO_CONFIG.siteTitle}
                    </h4>

                    <p className="text-[12px] sm:text-[13px] text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed mt-1 line-clamp-3">
                      {config.siteDescription || DEFAULT_SEO_CONFIG.siteDescription}
                    </p>
                  </div>

                  {/* Checklist Rekomendasi */}
                  <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-2 text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Audit Cepat SEO Anda:</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                      <div className="flex items-center gap-2">
                        {isTitleGood ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span>Panjang Judul ({titleLength} karakter): {isTitleGood ? "Sempurna" : "Disarankan 50-60 karakter"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isDescGood ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span>Panjang Deskripsi ({descLength} karakter): {isDescGood ? "Sempurna" : "Disarankan 120-160 karakter"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MEDIA SOSIAL / OPEN GRAPH */}
              {activeTab === "social" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-6 space-y-4">
                    {/* Input File Tersembunyi */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleOgFileChange}
                      disabled={isUploadingOg}
                    />

                    {/* Kontrol Upload Gambar */}
                    <div className="space-y-3 p-4 rounded-xl border border-border/80 bg-card">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-primary" />
                          <span>Gambar Berbagi Media Sosial (Open Graph)</span>
                        </Label>
                        <span className="text-[10px] text-muted-foreground font-mono">1200 x 630 px</span>
                      </div>

                      {/* Tombol Aksi Upload & Hapus */}
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isUploadingOg}
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 h-9 text-xs font-semibold gap-1.5 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary cursor-pointer"
                        >
                          {isUploadingOg ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Mengompres & Mengunggah...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>Unggah Gambar dari Perangkat</span>
                            </>
                          )}
                        </Button>

                        {config.ogImageUrl && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isUploadingOg}
                            onClick={() => setConfig({ ...config, ogImageUrl: "" })}
                            className="h-9 px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 cursor-pointer"
                            title="Hapus gambar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>

                      {/* Input URL Manual (Opsional) */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] text-muted-foreground block">
                          Atau tempel URL gambar secara langsung:
                        </span>
                        <Input
                          id="ogImageUrl"
                          value={config.ogImageUrl}
                          onChange={(e) => setConfig({ ...config, ogImageUrl: e.target.value })}
                          placeholder="https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/..."
                          className="text-xs font-mono h-8"
                          disabled={isUploadingOg}
                        />
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                        Gambar ini otomatis muncul saat link website Anda dibagikan di <strong>WhatsApp, Telegram, Facebook, dan Twitter/X</strong>.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2 text-xs">
                      <span className="font-semibold text-foreground block">Ketentuan Gambar Rekomendasi:</span>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-muted-foreground">
                        <li>Rasio aspek ideal: <strong>1.91 : 1</strong> (standar resmi Facebook & WhatsApp)</li>
                        <li>Ukuran piksel ideal: <strong>1200 x 630 px</strong> (minimal 600 x 315 px)</li>
                        <li>Format file didukung: <strong>JPG, PNG, atau WebP</strong> (otomatis dikompres)</li>
                      </ul>
                    </div>
                  </div>

                  {/* WhatsApp Share Preview */}
                  <div className="lg:col-span-6 space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground block">
                      Simulasi Preview Link di WhatsApp:
                    </span>
                    <div className="w-full max-w-xl rounded-xl overflow-hidden border border-border/80 bg-card shadow-sm">
                      {config.ogImageUrl && (
                        <div className="w-full h-56 bg-zinc-800 overflow-hidden relative">
                          <img
                            src={config.ogImageUrl}
                            alt="Social Share Thumbnail"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              ;(e.target as HTMLElement).style.display = "none"
                            }}
                          />
                        </div>
                      )}
                      <div className="p-3.5 space-y-1">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">
                          {config.canonicalUrl.replace(/^https?:\/\//, "")}
                        </span>
                        <h5 className="font-semibold text-xs leading-tight line-clamp-1">
                          {config.siteTitle}
                        </h5>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
                          {config.siteDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: GOOGLE SEARCH CONSOLE & CRAWL */}
              {activeTab === "google" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                  {/* Kolom Kiri: Re-Crawl & Verifikasi */}
                  <div className="space-y-5">
                    {/* Card 1: Googlebot Re-Crawl & URL Inspection */}
                    <div className="p-5 rounded-xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <h4 className="text-sm font-semibold text-foreground">
                            Minta Google Crawl & Index Website (Googlebot URL Inspection)
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Gunakan fitur <strong>Inspeksi URL (URL Inspection)</strong> di Google Search Console untuk meminta Googlebot mengindeks halaman utama atau artikel baru dalam 24 jam.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2.5 pt-1">
                        <a
                          href={gscUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold shadow-sm transition-colors"
                        >
                          <Search className="w-4 h-4" />
                          <span>Buka Google Search Console</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(targetUrl + "/")
                            toast.success("URL Berhasil Disalin!", {
                              description: "Tempelkan di kotak pencarian paling atas Google Search Console lalu tekan Enter."
                            })
                          }}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium text-foreground transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>Salin URL: {targetDomain}</span>
                        </button>
                      </div>

                      <div className="p-3 rounded-lg bg-blue-100/60 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/40 text-[11px] text-blue-950 dark:text-blue-200 space-y-1">
                        <span className="font-semibold block">Cara Minta Googlebot Crawl (3 Langkah):</span>
                        <p>1. Klik <strong>Salin URL</strong> di atas ➔ Buka <strong>Google Search Console</strong>.</p>
                        <p>2. Tempelkan URL pada kolom pencarian di bagian atas: <em>&quot;Periksa URL apa pun di {targetDomain}&quot;</em> lalu tekan <strong>Enter</strong>.</p>
                        <p>3. Klik tombol <strong>Minta Pengindeksan (Request Indexing)</strong>.</p>
                      </div>
                    </div>

                    {/* Card 2: Kode Verifikasi Google Search Console */}
                    <div className="space-y-2 p-5 rounded-xl border border-border/80 bg-card">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="googleVerification" className="text-xs font-semibold flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          <span>Kode Verifikasi Google Search Console (HTML Tag)</span>
                        </Label>
                        <a
                          href="https://search.google.com/search-console/ownership"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-primary hover:underline flex items-center gap-1"
                        >
                          <span>Dapatkan Kode</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <Input
                        id="googleVerification"
                        value={config.googleVerification}
                        onChange={(e) => setConfig({ ...config, googleVerification: e.target.value })}
                        placeholder="Contoh: google-site-verification=abc123xyz... atau kode uniknya saja"
                        className="text-xs font-mono"
                      />
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Langkah cepat verifikasi: Pilih metode <strong>&quot;HTML Tag&quot;</strong> di Google Search Console, salin kode atribut content, tempel di sini, dan klik tombol <strong>Simpan Pengaturan SEO</strong> di bawah. Website Anda akan otomatis terverifikasi!
                      </p>
                    </div>
                  </div>

                  {/* Kolom Kanan: Peta Situs Dinamis & Submit */}
                  <div className="space-y-5">
                    <div className="p-5 rounded-xl border border-border/80 bg-card space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <Send className="w-4 h-4 text-emerald-600" />
                            <span>Pendaftaran Peta Situs (Sitemap.xml)</span>
                          </h4>
                          <p className="text-[11px] text-muted-foreground">
                            Peta situs membantu Google menemukan seluruh halaman dan artikel insight secara otomatis.
                          </p>
                        </div>

                        <a
                          href={gscSitemapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-primary hover:underline flex items-center gap-1 whitespace-nowrap"
                        >
                          <span>Kirim ke GSC</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="space-y-2.5 pt-1">
                        <a
                          href="/sitemap.xml"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-lg border border-border/70 bg-muted/20 hover:bg-muted/50 transition-colors flex items-center justify-between group"
                        >
                          <div className="space-y-0.5">
                            <span className="text-xs font-semibold block group-hover:text-primary transition-colors">
                              Peta Situs Dinamis (/sitemap.xml)
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {targetUrl}/sitemap.xml
                            </span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 ml-2" />
                        </a>

                        <a
                          href="/robots.txt"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-lg border border-border/70 bg-muted/20 hover:bg-muted/50 transition-colors flex items-center justify-between group"
                        >
                          <div className="space-y-0.5">
                            <span className="text-xs font-semibold block group-hover:text-primary transition-colors">
                              File Robot Mesin Pencari (/robots.txt)
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {targetUrl}/robots.txt
                            </span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 ml-2" />
                        </a>
                      </div>
                    </div>

                    {/* Panduan Singkat */}
                    <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-2 text-xs">
                      <span className="font-semibold text-foreground block">3 Langkah Agar Cepat Terindeks Google:</span>
                      <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-muted-foreground">
                        <li>Pastikan izin indeks aktif di tab <strong>Meta Tags</strong>.</li>
                        <li>Daftarkan URL <code>/sitemap.xml</code> pada menu <strong>Sitemaps</strong> di Search Console.</li>
                        <li>Gunakan tombol <strong>Minta Googlebot Crawl</strong> di samping untuk halaman utama.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: UJI PAGESPEED & AUDIT SEO */}
              {activeTab === "pagespeed" && (
                <div className="space-y-5">
                  {/* Card 1: Google PageSpeed Insights Hero Tester */}
                  <div className="p-5 sm:p-6 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <Gauge className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <span>Google PageSpeed Insights & Core Web Vitals</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 font-bold">
                              Google Official
                            </span>
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Uji langsung kecepatan loading, aksesibilitas, best practice, dan skor SEO website Anda.
                          </p>
                        </div>
                      </div>

                      <a
                        href={pagespeedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Jalankan Cek PageSpeed & SEO</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </a>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center">
                      <div className="p-3 rounded-lg bg-card border border-border/80 shadow-xs">
                        <span className="text-[10px] font-medium text-muted-foreground uppercase block">Performa</span>
                        <span className="text-xl font-bold text-emerald-600">90 - 100</span>
                        <span className="text-[10px] text-muted-foreground block">Target Cepat</span>
                      </div>
                      <div className="p-3 rounded-lg bg-card border border-border/80 shadow-xs">
                        <span className="text-[10px] font-medium text-muted-foreground uppercase block">Aksesibilitas</span>
                        <span className="text-xl font-bold text-emerald-600">95 - 100</span>
                        <span className="text-[10px] text-muted-foreground block">Sesuai Standar</span>
                      </div>
                      <div className="p-3 rounded-lg bg-card border border-border/80 shadow-xs">
                        <span className="text-[10px] font-medium text-muted-foreground uppercase block">Praktik Terbaik</span>
                        <span className="text-xl font-bold text-emerald-600">100</span>
                        <span className="text-[10px] text-muted-foreground block">Modern Web</span>
                      </div>
                      <div className="p-3 rounded-lg bg-card border border-border/80 shadow-xs">
                        <span className="text-[10px] font-medium text-muted-foreground uppercase block">SEO Google</span>
                        <span className="text-xl font-bold text-emerald-600">100</span>
                        <span className="text-[10px] text-muted-foreground block">Terindeks Penuh</span>
                      </div>
                    </div>
                  </div>

                  {/* 2 Kolom: Rich Results & Audit Status */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                    {/* Card 2: Google Rich Results Test */}
                    <div className="p-5 rounded-xl border border-border/80 bg-card space-y-3">
                      <div>
                        <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>Google Rich Results & Structured Data Validator</span>
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Periksa validitas format Schema.org JSON-LD (Organisasi, Artikel Insight) untuk memunculkan cuplikan kaya di hasil pencarian.
                        </p>
                      </div>

                      <a
                        href={richResultsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted text-xs font-medium text-foreground transition-colors shrink-0"
                      >
                        <Search className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Uji Cuplikan Kaya Google</span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </a>
                    </div>

                    {/* Card 3: Audit Optimasi yang Sudah Aktif di Website */}
                    <div className="p-5 rounded-xl border border-border/80 bg-muted/30 space-y-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-foreground">Status Optimasi Kecepatan & SEO di Website:</span>
                      </div>

                      <div className="space-y-2 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span><strong>LCP Optimization:</strong> Hero banner diprioritaskan (eager load)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span><strong>Peta Situs Dinamis:</strong> Otomatis memperbarui artikel baru</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span><strong>Metadata Open Graph:</strong> WhatsApp & Twitter preview card</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span><strong>Structured Data JSON-LD:</strong> Schema Organisasi Google siap</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-border/80 bg-muted/40 flex items-center justify-between shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Rekomendasi</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="text-xs h-8"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={isSaving}
                  onClick={handleSave}
                  className="text-xs h-8 px-4 bg-primary text-white hover:bg-primary/90 gap-1.5 shadow-sm"
                >
                  {isSaving ? (
                    <span>Menyimpan...</span>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Pengaturan SEO</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

