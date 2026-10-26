"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import {
  BookOpenIcon,
  SearchIcon,
  ClockIcon,
  UserIcon,
  ArrowRightIcon,
  ChevronRight,
  FolderIcon,
  FilterIcon,
  Sparkles,
} from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { InsightArticle, INSIGHT_CATEGORIES } from "@/lib/insight/types"
import { fetchInsights } from "@/lib/insight/db"
import { LoadingSpinner } from "@/components/loading-spinner"

// Lazy load settings sidebar so it is not included in the main visitor bundle
const InsightSettingsSidebar = dynamic(
  () => import("@/components/insight-settings-sidebar").then((m) => m.InsightSettingsSidebar),
  { ssr: false }
)
import {
  InsightSettingsData,
  DEFAULT_INSIGHT_SETTINGS,
  INSIGHT_SETTINGS_KEY,
  INSIGHT_PREVIEW_CHANNEL,
  getInitialInsightSettings,
  fetchInsightSettings,
  saveInsightSettings,
  resetInsightSettings,
} from "@/lib/insight-settings"
import { getHeroFontClass, preloadHeroFont } from "@/lib/fonts"
import { cn } from "@/lib/utils"

function getArticleSnippet(article?: InsightArticle | null): string {
  if (!article) return ""
  if (article.excerpt && article.excerpt.trim()) return article.excerpt.trim()
  if (article.description && article.description.trim()) return article.description.trim()
  if (article.content) {
    const clean = article.content
      .replace(/```[\s\S]*?```/g, "")
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/#{1,6}\s+/g, "")
      .replace(/>\s*\[!.*?\]/gi, "")
      .replace(/>\s*/g, "")
      .replace(/[*_~`]/g, "")
      .replace(/@[a-z]+\s*[\s\S]*?@[a-z]+/gi, "")
      .replace(/\s+/g, " ")
      .trim()
    if (clean) return clean
  }
  return "Temukan wawasan mendalam, regulasi izin edar, dan panduan formulasi herbal berkualitas bersama CV. Indo Green Nature."
}

export default function InsightIndexPage() {
  const router = useRouter()
  const [articles, setArticles] = React.useState<InsightArticle[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("Semua")

  // Insight Banner & Page Settings (inisialisasi SSR stabil dengan DEFAULT_INSIGHT_SETTINGS untuk mencegah Hydration Mismatch)
  const [insightSettings, setInsightSettings] = React.useState<InsightSettingsData>(DEFAULT_INSIGHT_SETTINGS)
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [isSavingSettings, setIsSavingSettings] = React.useState(false)
  const [isPreview, setIsPreview] = React.useState(false)
  const [customCategories, setCustomCategories] = React.useState<string[]>([])
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    try {
      const saved = localStorage.getItem("ign_insight_custom_categories")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomCategories(parsed)
        }
      }
    } catch {
      // Ignore
    }
  }, [])

  // Kategori dinamis (default saat SSR, sinkron dengan custom categories setelah mount)
  const availableCategories = React.useMemo(() => {
    if (isMounted && customCategories.length > 0) {
      return customCategories
    }
    const list = [...INSIGHT_CATEGORIES]
    articles.forEach((a) => {
      if (a.category && !list.includes(a.category as any)) {
        list.push(a.category as any)
      }
    })
    return list
  }, [isMounted, customCategories, articles])

  const loadData = React.useCallback(async () => {
    setLoading(true)
    const minTimer = new Promise((resolve) => setTimeout(resolve, 250))
    try {
      const data = await fetchInsights()
      setArticles(data)
    } catch (err) {
      console.error("Gagal memuat insight:", err)
      toast.error("Gagal memuat artikel insight.")
    } finally {
      await minTimer
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  // Inisialisasi Pengaturan dari Cache & Server (setelah client hydration)
  React.useEffect(() => {
    let isMounted = true

    // Cek apakah halaman dibuka dalam mode pratinjau tab baru (?preview=true)
    const isPrev = typeof window !== "undefined" && window.location.search.includes("preview=true")
    if (isPrev) {
      setIsPreview(true)
    }

    async function initSettings() {
      try {
        // 1. Ambil data lokal dari cache seketika setelah client mount
        const cached = getInitialInsightSettings()
        if (cached && isMounted) {
          setInsightSettings(cached)
        }

        // 2. Sinkronkan dengan data master database secara non-blocking di background
        if (!isPrev) {
          const remote = await fetchInsightSettings()
          if (isMounted) {
            setInsightSettings(remote)
            // Preload font baru di background
            preloadHeroFont(remote.bannerTitleFont || "outfit")
            preloadHeroFont(remote.bannerDescFont || "outfit")
            preloadHeroFont(remote.bannerBadgeFont || "outfit")
          }
        }
      } catch (err) {
        console.warn("[InsightPage] Gagal memuat pengaturan insight:", err)
      }
    }
    initSettings()
    return () => {
      isMounted = false
    }
  }, [])

  // Listener Floating Button Admin & URL Query (?edit=true / ?settings=insight)
  React.useEffect(() => {
    const handleOpenSettings = () => {
      setIsSettingsOpen(true)
    }

    window.addEventListener("open-insight-settings", handleOpenSettings)

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const isPrev = params.get("preview") === "true"
      if (!isPrev && (params.get("edit") === "true" || params.get("settings") === "insight")) {
        setIsSettingsOpen(true)
      }
    }

    return () => {
      window.removeEventListener("open-insight-settings", handleOpenSettings)
    }
  }, [])

  // Sinkronisasi Real-Time Lintas Tab / Preview via BroadcastChannel + Storage Event Listener
  React.useEffect(() => {
    let bc: BroadcastChannel | null = null

    const handleApplyUpdate = (updated: InsightSettingsData) => {
      setInsightSettings(updated)
      if (updated.bannerTitleFont) preloadHeroFont(updated.bannerTitleFont)
      if (updated.bannerDescFont) preloadHeroFont(updated.bannerDescFont)
      if (updated.bannerBadgeFont) preloadHeroFont(updated.bannerBadgeFont)
    }

    if (typeof BroadcastChannel !== "undefined") {
      try {
        bc = new BroadcastChannel(INSIGHT_PREVIEW_CHANNEL)
        bc.onmessage = (event) => {
          if (event.data?.type === "PREVIEW_UPDATE" && event.data?.data) {
            handleApplyUpdate(event.data.data)
          }
        }
      } catch {}
    }

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === INSIGHT_SETTINGS_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          handleApplyUpdate(parsed)
        } catch {}
      }
    }
    window.addEventListener("storage", handleStorageEvent)

    return () => {
      try {
        bc?.close()
      } catch {}
      window.removeEventListener("storage", handleStorageEvent)
    }
  }, [])

  const handleSaveSettings = async () => {
    setIsSavingSettings(true)
    try {
      const res = await saveInsightSettings(insightSettings)
      if (res.success) {
        toast.success("Pengaturan Insight berhasil disimpan ke sistem!")
        setIsSettingsOpen(false)
      } else {
        toast.error(res.error || "Gagal menyimpan pengaturan.")
      }
    } catch (err: any) {
      toast.error(err?.message || "Terjadi kesalahan saat menyimpan.")
    } finally {
      setIsSavingSettings(false)
    }
  }

  const handleResetSettings = async () => {
    if (window.confirm("Kembalikan seluruh pengaturan Insight ke kondisi bawaan (default)?")) {
      await resetInsightSettings()
      setInsightSettings(DEFAULT_INSIGHT_SETTINGS)
      toast.success("Pengaturan Insight direset ke default.")
    }
  }

  // Filtered articles
  const filteredArticles = React.useMemo(() => {
    return articles.filter((art) => {
      const matchesCategory =
        selectedCategory === "Semua" || art.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        art.title.toLowerCase().includes(query) ||
        (art.excerpt && art.excerpt.toLowerCase().includes(query)) ||
        (art.tags && art.tags.some((t: string) => t.toLowerCase().includes(query)))
      return matchesCategory && matchesSearch
    })
  }, [articles, selectedCategory, searchQuery])

  // Featured article (first one or specific)
  const featuredArticle = filteredArticles[0] || articles[0]
  const otherArticles = filteredArticles.filter(
    (a) => a.id !== featuredArticle?.id
  )

  const handleShare = (e: React.MouseEvent, article: InsightArticle) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/insight/${article.slug}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
      toast.success("Tautan artikel berhasil disalin!")
    }
  }

  // Style Latar Belakang Banner Dinamis
  const bannerBgStyle: React.CSSProperties = React.useMemo(() => {
    if (insightSettings.bannerBgType === "solid" && insightSettings.bannerBgSolidColor) {
      return { backgroundColor: insightSettings.bannerBgSolidColor }
    }
    if (insightSettings.bannerBgType === "image" && insightSettings.bannerBgImage) {
      return {
        backgroundImage: `url(${insightSettings.bannerBgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    }
    return {
      backgroundImage: `linear-gradient(to bottom, ${insightSettings.bannerBgGradientFrom || "#15803d1a"}, ${insightSettings.bannerBgGradientVia || "#15803d0d"}, ${insightSettings.bannerBgGradientTo || "transparent"})`,
    }
  }, [
    insightSettings.bannerBgType,
    insightSettings.bannerBgSolidColor,
    insightSettings.bannerBgImage,
    insightSettings.bannerBgGradientFrom,
    insightSettings.bannerBgGradientVia,
    insightSettings.bannerBgGradientTo,
  ])

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
          <LoadingSpinner text="Loading" />
        </div>
      )}

      <div
        className={cn(
          "w-full min-h-screen bg-background flex flex-col items-center overflow-x-hidden font-sans transition-colors duration-300",
          loading && "invisible"
        )}
      >
      {/* Banner Indikator Mode Pratinjau (preview=true) */}
      {isPreview && (
        <div className="w-full bg-[#15803D] text-white text-xs py-2 px-4 flex items-center justify-between font-medium shadow-md sticky top-0 z-[100]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>Mode Pratinjau Langsung (Preview Mode) &bull; Sinkron secara Real-time</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-[4px] font-mono">Tab Pratinjau</span>
        </div>
      )}

      {/* ─── Breadcrumb Bar (Konsisten seperti Halaman Lain) ─── */}
      <div className="w-full max-w-[1440px] px-4 lg:px-[20px] pt-3 pb-1">
        <div className="flex items-center gap-1.5 sm:gap-2 py-2 border-b border-border/60 text-xs md:text-sm text-zinc-700 dark:text-zinc-300">
          <Link href="/" className="hover:text-[#15803d] dark:hover:text-green-400 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
          <span className="text-[#15803d] dark:text-green-400 font-semibold">Insight</span>
        </div>
      </div>

      {/* Hero Banner Section */}
      <section
        id="banner-utama"
        style={bannerBgStyle}
        suppressHydrationWarning
        className="relative w-full overflow-hidden border-b border-border py-6 sm:py-14 flex justify-center transition-all duration-300"
      >
        {/* Pola Titik Grid (Dot Matrix Texture) */}
        {insightSettings.bannerShowPattern && (
          <div
            style={{
              backgroundImage: `radial-gradient(${insightSettings.bannerPatternColor || "#15803d"} 1px, transparent 1px)`,
              opacity: (insightSettings.bannerPatternOpacity ?? 15) / 100,
            }}
            className="absolute inset-0 [background-size:24px_24px] pointer-events-none"
          />
        )}

        <div className="relative w-full max-w-[1440px] px-4 lg:px-[20px]">
          <div
            className={cn(
              "flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12",
              insightSettings.bannerFrameAlign === "top"
                ? "lg:items-start"
                : insightSettings.bannerFrameAlign === "bottom"
                ? "lg:items-end"
                : "lg:items-center"
            )}
          >
            {/* Sisi Kiri: Teks & Informasi Utama Banner */}
            <div
              className={cn(
                "order-2 lg:order-1 flex-1 flex flex-col gap-3.5 sm:gap-5 w-full",
                insightSettings.bannerFrameAlign === "top"
                  ? "self-center lg:self-start"
                  : insightSettings.bannerFrameAlign === "bottom"
                  ? "self-center lg:self-end"
                  : "self-center lg:self-center",
                insightSettings.bannerTitleAlign === "center"
                  ? "items-center text-center"
                  : insightSettings.bannerTitleAlign === "right"
                  ? "items-end text-right"
                  : "items-center lg:items-start text-center lg:text-left"
              )}
            >
              {/* Badge Sub-Judul Banner */}
              {insightSettings.bannerBadgeShow && (
                <div
                  className={cn(
                    "flex",
                    insightSettings.bannerTitleAlign === "center"
                      ? "justify-center"
                      : insightSettings.bannerTitleAlign === "right"
                      ? "justify-end"
                      : "justify-center lg:justify-start"
                  )}
                >
                  <div
                    style={{
                      color: insightSettings.bannerBadgeColor || undefined,
                      backgroundColor: insightSettings.bannerBadgeBg || undefined,
                      borderColor: insightSettings.bannerBadgeBorderColor || undefined,
                      fontSize: insightSettings.bannerBadgeSize ? `clamp(11px, 2.5vw, ${insightSettings.bannerBadgeSize}px)` : undefined,
                    }}
                    className={cn(
                      "inline-flex items-center rounded-[5px] border px-3 sm:px-3.5 py-0.5 sm:py-1 text-xs font-semibold shadow-2xs transition-colors",
                      getHeroFontClass(insightSettings.bannerBadgeFont || "outfit")
                    )}
                  >
                    <span>{insightSettings.bannerBadgeText || "Riset, Regulasi & Tren Bisnis Herbal Terkini"}</span>
                  </div>
                </div>
              )}

              <div
                style={{
                  maxWidth: insightSettings.bannerDescMaxWidth ? `${insightSettings.bannerDescMaxWidth}px` : "896px",
                }}
                className={cn(
                  "space-y-2.5 sm:space-y-3.5 w-full flex flex-col",
                  insightSettings.bannerTitleAlign === "center"
                    ? "items-center text-center mx-auto"
                    : insightSettings.bannerTitleAlign === "right"
                    ? "items-end text-right ml-auto"
                    : "items-center lg:items-start text-center lg:text-left mx-auto lg:mx-0"
                )}
              >
                {/* Judul Utama Banner */}
                <h1
                  suppressHydrationWarning
                  style={{
                    color: insightSettings.bannerTitleColor || undefined,
                    fontSize: insightSettings.bannerTitleSize ? `clamp(22px, 5.5vw, ${insightSettings.bannerTitleSize}px)` : undefined,
                    fontWeight: insightSettings.bannerTitleWeight || "800",
                    textAlign:
                      insightSettings.bannerTitleAlign === "center" || insightSettings.bannerTitleAlign === "right"
                        ? insightSettings.bannerTitleAlign
                        : undefined,
                  }}
                  className={cn(
                    "tracking-tight text-foreground leading-[1.15]",
                    insightSettings.bannerTitleAlign === "center"
                      ? "text-center"
                      : insightSettings.bannerTitleAlign === "right"
                      ? "text-right"
                      : "text-center lg:text-left",
                    getHeroFontClass(insightSettings.bannerTitleFont || "outfit")
                  )}
                >
                  <span>{insightSettings.bannerTitleLine1 || "Insight & Riset Herbal"}</span>
                  {insightSettings.bannerTitleLine2 && (
                    <span
                      style={{
                        ...(insightSettings.bannerTitleUseGradient
                          ? {
                              backgroundImage: `linear-gradient(to right, ${insightSettings.bannerTitleGradientFrom || "#166534"}, ${insightSettings.bannerTitleGradientTo || "#15803d"})`,
                            }
                          : {
                              color: insightSettings.bannerTitleHighlightColor || "#15803d",
                            }),
                      }}
                      className={cn(
                        "block mt-1 sm:mt-1.5",
                        insightSettings.bannerTitleUseGradient && "bg-clip-text text-transparent"
                      )}
                    >
                      {insightSettings.bannerTitleLine2}
                    </span>
                  )}
                </h1>

                {/* Paragraf Deskripsi */}
                {insightSettings.bannerDescShow && insightSettings.bannerDesc && (
                  <p
                    style={{
                      color: insightSettings.bannerDescColor || undefined,
                      fontSize: insightSettings.bannerDescSize ? `clamp(12.5px, 3.2vw, ${insightSettings.bannerDescSize}px)` : undefined,
                      textAlign:
                        insightSettings.bannerTitleAlign === "center" || insightSettings.bannerTitleAlign === "right"
                          ? insightSettings.bannerTitleAlign
                          : undefined,
                    }}
                    className={cn(
                      "text-muted-foreground leading-relaxed",
                      insightSettings.bannerTitleAlign === "center"
                        ? "text-center mx-auto"
                        : insightSettings.bannerTitleAlign === "right"
                        ? "text-right ml-auto"
                        : "text-center lg:text-left mx-auto lg:mx-0",
                      getHeroFontClass(insightSettings.bannerDescFont || "poppins")
                    )}
                  >
                    {insightSettings.bannerDesc}
                  </p>
                )}

                {/* Tombol CTA Banner (Opsional) */}
                {insightSettings.bannerShowCta && (
                  <div
                    className={cn(
                      "pt-1.5 sm:pt-2 flex items-center",
                      insightSettings.bannerTitleAlign === "center"
                        ? "justify-center"
                        : insightSettings.bannerTitleAlign === "right"
                        ? "justify-end"
                        : "justify-center lg:justify-start"
                    )}
                  >
                    <a
                      href={insightSettings.bannerCtaLink || "/contact"}
                      target={insightSettings.bannerCtaLink?.startsWith("http") ? "_blank" : undefined}
                      rel={insightSettings.bannerCtaLink?.startsWith("http") ? "noopener noreferrer" : undefined}
                      style={{
                        backgroundColor: insightSettings.bannerCtaBg || "#15803d",
                        color: insightSettings.bannerCtaTextColor || "#ffffff",
                      }}
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-[5px] text-xs font-bold shadow-md hover:opacity-95 transition-all"
                    >
                      <span>{insightSettings.bannerCtaText || "Konsultasi Formulasi"}</span>
                      <ArrowRightIcon className="size-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Sisi Kanan: Logo Transparan (Di atas judul pada mobile, pojok kanan pada desktop) */}
            {insightSettings.bannerFrameShow && (
              <div
                style={{
                  ["--banner-frame-offset" as any]: `${insightSettings.bannerFrameOffsetY ?? 0}px`,
                }}
                className={cn(
                  "order-1 lg:order-2 shrink-0 w-full sm:w-auto flex justify-center lg:justify-end lg:[transform:translateY(var(--banner-frame-offset))]",
                  insightSettings.bannerFrameAlign === "top"
                    ? "self-center lg:self-start"
                    : insightSettings.bannerFrameAlign === "bottom"
                    ? "self-center lg:self-end"
                    : "self-center lg:self-center"
                )}
              >
                <div className="relative group/frame">
                  {/* Container Logo Transparan 1:1 (Tanpa border, background, shadow, atau glow) */}
                  <div
                    style={{
                      width: `clamp(160px, 45vw, ${insightSettings.bannerFrameSize || 210}px)`,
                      maxWidth: "100%",
                      aspectRatio: "1 / 1",
                    }}
                    className="relative aspect-square flex items-center justify-center bg-transparent border-0 shadow-none ring-0 overflow-visible"
                  >
                    {insightSettings.bannerFrameLink ? (
                      <a
                        href={insightSettings.bannerFrameLink}
                        target={insightSettings.bannerFrameLink.startsWith("http") ? "_blank" : undefined}
                        rel={insightSettings.bannerFrameLink.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="block w-full h-full relative cursor-pointer flex items-center justify-center"
                        title={insightSettings.bannerFrameAlt || "Logo CV. Indo Green Nature"}
                      >
                        {/* Logo Transparan */}
                        {insightSettings.bannerFrameImage ? (
                          <img
                            key={insightSettings.bannerFrameImage || "empty"}
                            src={insightSettings.bannerFrameImage}
                            alt={insightSettings.bannerFrameAlt || "Logo CV. Indo Green Nature"}
                            className={cn(
                              "w-full h-full transition-transform duration-500 ease-out group-hover/frame:scale-105",
                              insightSettings.bannerFrameFit === "cover" ? "object-cover" : "object-contain"
                            )}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-[#15803d]/30 rounded-xl p-4 text-center text-green-800 dark:text-green-300">
                            <Sparkles className="w-8 h-8 mb-2 text-[#15803D]" />
                            <span className="text-xs font-bold uppercase tracking-wider">Logo Transparan</span>
                            <span className="text-[10px] text-muted-foreground mt-1">Belum ada logo diunggah</span>
                          </div>
                        )}
                      </a>
                    ) : (
                      <div className="w-full h-full relative flex items-center justify-center">
                        {/* Logo Transparan */}
                        {insightSettings.bannerFrameImage ? (
                          <img
                            key={insightSettings.bannerFrameImage || "empty"}
                            src={insightSettings.bannerFrameImage}
                            alt={insightSettings.bannerFrameAlt || "Logo CV. Indo Green Nature"}
                            className={cn(
                              "w-full h-full transition-transform duration-500 ease-out group-hover/frame:scale-105",
                              insightSettings.bannerFrameFit === "cover" ? "object-cover" : "object-contain"
                            )}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-[#15803d]/30 rounded-xl p-4 text-center text-green-800 dark:text-green-300">
                            <Sparkles className="w-8 h-8 mb-2 text-[#15803D]" />
                            <span className="text-xs font-bold uppercase tracking-wider">Logo Transparan</span>
                            <span className="text-[10px] text-muted-foreground mt-1">Belum ada logo diunggah</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar & Categories Tabs */}
          {(insightSettings.bannerShowCategories || insightSettings.bannerShowSearch) && (
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border/60 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Category Pills */}
              {insightSettings.bannerShowCategories && (
                <div suppressHydrationWarning className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setSelectedCategory("Semua")}
                    style={
                      selectedCategory === "Semua"
                        ? {
                            backgroundColor: insightSettings.bannerCategoryActiveBg || "#15803d",
                            color: insightSettings.bannerCategoryActiveColor || "#ffffff",
                          }
                        : insightSettings.bannerCategoryInactiveBg
                        ? {
                            backgroundColor: insightSettings.bannerCategoryInactiveBg,
                            color: insightSettings.bannerCategoryInactiveColor || undefined,
                          }
                        : undefined
                    }
                    className={cn(
                      "rounded-[5px] px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
                      selectedCategory === "Semua"
                        ? "shadow-xs font-semibold"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    Semua Topik
                  </button>
                  {availableCategories.map((cat) => {
                    const isSelected = selectedCategory === cat
                    return (
                      <button
                        key={cat}
                        type="button"
                        suppressHydrationWarning
                        onClick={() => setSelectedCategory(cat)}
                        style={
                          isSelected
                            ? {
                                backgroundColor: insightSettings.bannerCategoryActiveBg || "#15803d",
                                color: insightSettings.bannerCategoryActiveColor || "#ffffff",
                              }
                            : insightSettings.bannerCategoryInactiveBg
                            ? {
                                backgroundColor: insightSettings.bannerCategoryInactiveBg,
                                color: insightSettings.bannerCategoryInactiveColor || undefined,
                              }
                            : undefined
                        }
                        className={cn(
                          "rounded-[5px] px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
                          isSelected
                            ? "shadow-xs font-semibold"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Search Input */}
              {insightSettings.bannerShowSearch && (
                <div className="relative w-full sm:w-80 shrink-0">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="search-insight"
                    name="search_insight"
                    type="search"
                    autoComplete="off"
                    aria-label="Cari insight, bahan, regulasi"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={insightSettings.bannerSearchPlaceholder || "Cari insight, bahan, regulasi..."}
                    className="pl-9 text-xs h-9 rounded-[5px] bg-background/80"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <main
        id="artikel-terbaru"
        className="w-full max-w-[1440px] px-4 lg:px-[20px] py-8 sm:py-12 flex flex-col relative scroll-mt-24"
      >
        {loading ? (
          <div className="space-y-12">
            {/* Skeleton Featured Card (Mencegah flash lingkaran spinner) */}
            <div className="rounded-[5px] border border-border bg-card p-0 overflow-hidden shadow-xs animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 w-full aspect-video lg:aspect-auto lg:h-full lg:min-h-[340px] bg-muted/60" />
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between min-h-[340px] space-y-4">
                  <div className="space-y-3">
                    <div className="h-4 w-28 bg-muted rounded-[4px]" />
                    <div className="h-7 w-4/5 bg-muted rounded-[4px]" />
                    <div className="h-4 w-full bg-muted/70 rounded-[4px]" />
                    <div className="h-4 w-2/3 bg-muted/50 rounded-[4px]" />
                  </div>
                  <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-muted" />
                      <div className="space-y-1">
                        <div className="h-3 w-24 bg-muted rounded-[3px]" />
                        <div className="h-2.5 w-16 bg-muted/60 rounded-[3px]" />
                      </div>
                    </div>
                    <div className="h-8 w-8 sm:w-28 bg-muted rounded-full sm:rounded-[5px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="rounded-[5px] border border-dashed border-border bg-card/50 p-12 text-center">
            <BookOpenIcon className="mx-auto size-12 text-muted-foreground/40 mb-3" />
            <h3 className="text-lg font-bold text-foreground">
              Tidak Ada Artikel Ditemukan
            </h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
              Tidak ada artikel yang cocok dengan filter atau kata kunci pencarian Anda.
              Coba pilih kategori lain atau buat artikel baru sekarang.
            </p>
            <Button
              onClick={() => {
                setSelectedCategory("Semua")
                setSearchQuery("")
              }}
              variant="outline"
              size="sm"
              className="mt-4 rounded-[5px]"
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Article Spotlight (Hero Card) */}
            {featuredArticle && (
              <div className="group relative overflow-hidden rounded-[5px] border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Image Column (Rasio 16:9 di Mobile) */}
                  <div className="relative lg:col-span-7 w-full aspect-video lg:aspect-auto lg:h-full lg:min-h-[340px] overflow-hidden bg-muted">
                    <Image
                      src={
                        featuredArticle.cover_image ||
                        "/images/banner-default.jpg"
                      }
                      alt={featuredArticle.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                  </div>

                  {/* Content Column */}
                  <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between min-h-[340px]">
                    {/* Top: Meta & Title */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-semibold text-[#15803d] dark:text-green-400">
                          {featuredArticle.category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="size-3" />
                          {featuredArticle.reading_time || "4 min baca"}
                        </span>
                      </div>

                      <Link href={`/insight/${featuredArticle.slug}`}>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground hover:text-[#15803d] transition-colors leading-snug">
                          {featuredArticle.title}
                        </h2>
                      </Link>
                    </div>

                    {/* Middle: Deskripsi Berada di Tengah-Tengah & Karakter Lebih Banyak */}
                    <div className="my-auto py-4 space-y-3">
                      <p className="text-xs sm:text-[13px] text-[#4B5563] dark:text-zinc-300 leading-relaxed line-clamp-4 sm:line-clamp-5">
                        {getArticleSnippet(featuredArticle)}
                      </p>

                      {/* Tag badges */}
                      {featuredArticle.tags && featuredArticle.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {featuredArticle.tags.slice(0, 4).map((tag: string) => (
                            <span
                              key={tag}
                              className="text-[11px] font-medium text-[#15803d] dark:text-green-400 bg-[#15803d]/10 px-2.5 py-0.5 rounded-[5px]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions: Tim Konsultan & Button Lihat Selengkapnya */}
                    <div className="pt-5 border-t border-border/60 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                        <div className="size-8 rounded-full bg-[#15803d] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          IGN
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground text-xs leading-none">
                            {featuredArticle.author || "Tim Konsultan R&D IGN"}
                          </span>
                          <span className="text-[10px] text-muted-foreground mt-0.5">
                            Konsultan Herbal
                          </span>
                        </div>
                      </div>

                      {/* Tombol Lihat Selengkapnya: Mobile (Bulat Ikon Saja) & Desktop (Rounded [5px] dengan Teks) */}
                      <Link
                        href={`/insight/${featuredArticle.slug}`}
                        title="Lihat Selengkapnya"
                        className="sm:hidden inline-flex items-center justify-center size-8 rounded-full bg-[#15803d] hover:bg-[#166534] text-white shadow-xs shrink-0 transition-transform active:scale-95"
                      >
                        <ArrowRightIcon className="size-4" />
                      </Link>
                      <Link
                        href={`/insight/${featuredArticle.slug}`}
                        className="hidden sm:inline-flex items-center gap-1.5 rounded-[5px] bg-[#15803d] hover:bg-[#166534] px-4 py-2 text-xs font-semibold text-white shadow-xs shrink-0 transition-colors"
                      >
                        <span>Lihat Selengkapnya</span>
                        <ArrowRightIcon className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Articles Grid */}
            {otherArticles.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5 sm:gap-2">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#15803d] inline-block shrink-0" />
                    <span>Artikel & Panduan Terbaru</span>
                  </h3>
                  <span className="text-xs text-muted-foreground shrink-0">
                    <span className="hidden sm:inline">Menampilkan </span>
                    {filteredArticles.length} artikel
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {otherArticles.map((art) => (
                    <article
                      key={art.id}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-[5px] border border-border bg-card shadow-xs hover:shadow-md transition-[box-shadow,border-color] duration-200 hover:border-[#15803d]/30"
                    >
                      <div>
                        {/* Cover image */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                          <Image
                            src={art.cover_image || "/images/banner-default.jpg"}
                            alt={art.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <Badge className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white font-medium text-[11px] border-none rounded-[5px]">
                            {art.category}
                          </Badge>
                        </div>

                        {/* Article meta info */}
                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span suppressHydrationWarning>
                              {art.created_at
                                ? new Date(art.created_at).toLocaleDateString(
                                    "id-ID",
                                    { day: "numeric", month: "short", year: "numeric" }
                                  )
                                : "Terbaru"}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <ClockIcon className="size-3" />
                              {art.reading_time || "4 min"}
                            </span>
                          </div>

                          <Link href={`/insight/${art.slug}`}>
                            <h4 className="font-bold text-foreground text-lg leading-snug group-hover:text-[#15803d] transition-colors line-clamp-2">
                              {art.title}
                            </h4>
                          </Link>

                          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                            {getArticleSnippet(art)}
                          </p>

                          {art.tags && art.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {art.tags.slice(0, 2).map((t: string) => (
                                <span
                                  key={t}
                                  className="text-[10px] text-[#15803d] dark:text-green-400 bg-[#15803d]/10 px-2 py-0.5 rounded-[5px]"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="p-5 pt-3 flex items-center justify-between border-t border-border/50 mt-auto">
                        <span className="text-[10.5px] sm:text-[11px] text-muted-foreground font-medium truncate max-w-[120px] sm:max-w-[130px]">
                          {art.author || "Tim Konsultan IGN"}
                        </span>

                        <Link
                          href={`/insight/${art.slug}`}
                          className="inline-flex items-center gap-1 text-[10.5px] sm:text-xs font-semibold text-[#15803d] hover:text-[#166534] transition-colors shrink-0"
                        >
                          <span>Lihat Selengkapnya</span>
                          <ArrowRightIcon className="size-2.5 sm:size-3" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Full-Width CTA Section: Kembangkan Brand Herbal Anda */}
            {insightSettings.bottomCtaShow !== false && (
              <section className="mt-14 w-full rounded-[5px] border border-border bg-gradient-to-r from-[#15803d]/10 via-[#15803d]/5 to-transparent p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight whitespace-pre-line">
                    {insightSettings.bottomCtaTitle || "Kembangkan Brand Herbal Anda Bersama CV. Indo Green Nature"}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {insightSettings.bottomCtaDesc ||
                      "Dukungan lengkap mulai dari perancangan formula terstandar, uji laboratorium, legalitas izin edar BPOM & Halal, hingga produksi massal bersertifikat CPOTB."}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={
                      insightSettings.bottomCtaBtnLink ||
                      "https://wa.me/6281234567890?text=Halo%20CV.%20Indo%20Green%20Nature%2C%20saya%20ingin%20konsultasi%20layanan%20maklon%20herbal."
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: insightSettings.bottomCtaBtnBg || "#15803d",
                      color: insightSettings.bottomCtaBtnColor || "#ffffff",
                    }}
                    className="inline-flex items-center gap-2 rounded-[5px] hover:opacity-90 px-5 py-3 text-xs sm:text-sm font-bold shadow-md transition-opacity"
                  >
                    <WhatsAppIcon className="size-4" />
                    <span>{insightSettings.bottomCtaBtnText || "Konsultasi Maklon Sekarang"}</span>
                  </a>
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* ─── Sidebar / Modal Pengaturan Desktop (Konsep Figma Sesuai About Us) ─── */}
      {isSettingsOpen && (
        <InsightSettingsSidebar
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          data={insightSettings}
          onChange={setInsightSettings}
          onSave={handleSaveSettings}
          onReset={handleResetSettings}
          isSaving={isSavingSettings}
        />
      )}
    </div>
    </>
  )
}

