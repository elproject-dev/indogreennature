"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ClockIcon,
  CalendarIcon,
  Share2Icon,
  ArrowLeftIcon,
  ChevronRight,
  CheckIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  BookmarkIcon,
  FolderIcon,
  HelpCircleIcon,
} from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { InsightViewer } from "@/components/insight/insight-viewer"
import { fetchInsightBySlug, fetchInsights } from "@/lib/insight/db"
import { InsightArticle } from "@/lib/insight/types"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  InsightSettingsData,
  DEFAULT_INSIGHT_SETTINGS,
  INSIGHT_SETTINGS_KEY,
  INSIGHT_PREVIEW_CHANNEL,
  getInitialInsightSettings,
  fetchInsightSettings,
  saveInsightSettings,
} from "@/lib/insight-settings"

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
  return "Temukan wawasan mendalam seputar riset herbal, formulasi alami, dan regulasi resmi bersama CV. Indo Green Nature."
}

export default function InsightDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [article, setArticle] = React.useState<InsightArticle | null>(null)
  const [relatedArticles, setRelatedArticles] = React.useState<InsightArticle[]>([])
  const [loading, setLoading] = React.useState(true)
  const [copied, setCopied] = React.useState(false)
  const [insightSettings, setInsightSettings] = React.useState<InsightSettingsData>(DEFAULT_INSIGHT_SETTINGS)
  const [isPreviewMode, setIsPreviewMode] = React.useState(false)

  // State untuk fungsi bar penyesuaian ukuran gambar
  const [coverHeight, setCoverHeight] = React.useState<number>(467)
  const [coverFit, setCoverFit] = React.useState<"cover" | "contain">("cover")

  React.useEffect(() => {
    if (insightSettings.articleCoverHeight) {
      setCoverHeight(insightSettings.articleCoverHeight)
    }
    if (insightSettings.articleCoverFit) {
      setCoverFit(insightSettings.articleCoverFit)
    }
  }, [insightSettings.articleCoverHeight, insightSettings.articleCoverFit])


  // Inisialisasi Pengaturan Insight (Sinkronisasi dengan master / live preview)
  React.useEffect(() => {
    let isMounted = true

    async function initSettings() {
      try {
        const cached = getInitialInsightSettings()
        if (cached && isMounted) {
          setInsightSettings(cached)
        }

        const isPrev = typeof window !== "undefined" && window.location.search.includes("preview=true")
        if (!isPrev) {
          const remote = await fetchInsightSettings()
          if (isMounted) {
            setInsightSettings(remote)
          }
        }
      } catch (err) {
        console.warn("[InsightDetailPage] Gagal memuat pengaturan insight:", err)
      }
    }

    initSettings()

    // Realtime preview sync via BroadcastChannel & Storage Event
    let bc: BroadcastChannel | null = null
    const handleApplyUpdate = (updated: InsightSettingsData) => {
      if (isMounted) setInsightSettings(updated)
    }

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        bc = new BroadcastChannel(INSIGHT_PREVIEW_CHANNEL)
        bc.onmessage = (event) => {
          if (event.data?.type === "UPDATE_PREVIEW" && event.data?.data) {
            handleApplyUpdate(event.data.data)
          }
        }
      } catch (err) {
        console.warn("BroadcastChannel error:", err)
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === INSIGHT_SETTINGS_KEY && e.newValue) {
        try {
          handleApplyUpdate(JSON.parse(e.newValue))
        } catch {
          // Ignore
        }
      }
    }
    window.addEventListener("storage", handleStorage)

    return () => {
      isMounted = false
      if (bc) bc.close()
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  React.useEffect(() => {
    if (!slug) return
    let isMounted = true

    async function loadData() {
      setLoading(true)
      try {
        if (slug === "preview") {
          setIsPreviewMode(true)
          let draft: InsightArticle | null = null
          if (typeof window !== "undefined") {
            try {
              const raw = localStorage.getItem("ign_article_preview_draft")
              if (raw) {
                draft = JSON.parse(raw)
              }
            } catch (e) {
              console.warn("Gagal membaca draft pratinjau:", e)
            }
          }

          if (!draft) {
            draft = {
              id: 999999,
              title: "Pratinjau Artikel Insight",
              slug: "preview",
              category: "Panduan Bisnis",
              excerpt: "Pratinjau konten artikel draf real-time dari editor Insight.",
              author: "Tim R&D CV. Indo Green Nature",
              reading_time: "4 min baca",
              cover_image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
              content: "## Pratinjau Artikel\n\nTulis konten di editor dan lihat perubahannya secara instan di tab ini.",
              tags: ["Maklon Herbal", "Formulasi Alami"],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_active: true,
            }
          }

          if (isMounted) {
            setArticle(draft)
          }

          // Load other articles for related section
          const all = await fetchInsights()
          if (isMounted) {
            setRelatedArticles(all.slice(0, 4))
          }
          return
        }

        const found = await fetchInsightBySlug(slug)
        if (isMounted) {
          setArticle(found)
        }

        // Load other articles for related section
        const all = await fetchInsights()
        if (isMounted) {
          const others = all
            .filter((a) => a.slug !== slug)
            .slice(0, 4)
          setRelatedArticles(others)
        }
      } catch (err) {
        console.error("Gagal memuat artikel:", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [slug])

  // Sinkronisasi realtime artikel draf saat berada di tab pratinjau
  React.useEffect(() => {
    if (slug !== "preview" && !isPreviewMode) return
    let isMounted = true

    let bc: BroadcastChannel | null = null
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        bc = new BroadcastChannel("ign_article_preview_channel")
        bc.onmessage = (event) => {
          if (event.data?.type === "UPDATE_ARTICLE_DRAFT" && event.data?.data) {
            if (isMounted) {
              setArticle(event.data.data)
            }
          }
        }
      } catch (err) {
        console.warn("BroadcastChannel error:", err)
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "ign_article_preview_draft" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (isMounted) {
            setArticle(parsed)
          }
        } catch {
          // Ignore
        }
      }
    }

    window.addEventListener("storage", handleStorage)

    return () => {
      isMounted = false
      if (bc) bc.close()
      window.removeEventListener("storage", handleStorage)
    }
  }, [slug, isPreviewMode])

  const handleCopyLink = () => {
    if (typeof window === "undefined") return
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    toast.success("Tautan artikel berhasil disalin!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareWhatsApp = () => {
    if (typeof window === "undefined" || !article) return
    const text = encodeURIComponent(
      `*${article.title}*\n\nBaca artikel insight herbal menarik dari CV. Indo Green Nature:\n${window.location.href}`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank")
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner text="Memuat artikel insight..." />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-[20px] py-24 text-center">
        <h2 className="text-2xl font-bold text-foreground">
          Artikel Tidak Ditemukan
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Maaf, artikel dengan tautan ini tidak tersedia atau telah dipindahkan.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => router.push("/insight")} variant="outline">
            Kembali ke Insight
          </Button>
          <Button onClick={() => router.push("/")} className="bg-[#15803d] hover:bg-[#166534]">
            Halaman Utama
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center overflow-x-hidden font-sans transition-colors duration-300 pb-20">
      {/* Top Indicator Banner jika dalam Mode Pratinjau Tab Baru */}
      {isPreviewMode && (
        <div className="w-full bg-emerald-50/95 dark:bg-emerald-950/80 border-b border-[#15803d]/30 py-2.5 px-4 text-xs sticky top-0 z-50 backdrop-blur-md shadow-xs transition-all">
          <div className="w-full max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#15803d]"></span>
              </span>
              <span className="font-bold text-[#15803d] dark:text-green-400">
                Mode Pratinjau Tab Baru
              </span>
              <span className="text-muted-foreground hidden md:inline">
                • Menampilkan tampilan asli pembaca secara penuh. Perubahan di tab editor langsung tersinkronisasi realtime.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (typeof window !== "undefined" && window.opener) {
                    window.opener.focus()
                  } else {
                    router.push("/insight/create")
                  }
                }}
                className="h-7 text-xs border-[#15803d]/40 text-[#15803d] dark:text-green-400 hover:bg-[#15803d]/10 font-semibold rounded-[5px]"
              >
                Fokus ke Editor
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.close()
                  }
                }}
                className="h-7 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-[5px]"
              >
                ✕ Tutup Tab
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Top Breadcrumb & Navigation Bar - Full Width with 1440px container */}
      <div className="w-full border-b border-border/60 bg-muted/20 flex justify-center">
        <div className="w-full max-w-[1440px] px-4 lg:px-[20px] py-3.5 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/"
              className="hover:text-[#15803d] transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
            <Link
              href="/insight"
              className="hover:text-[#15803d] transition-colors"
            >
              Insight
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-[400px]">
              {isPreviewMode ? `[Pratinjau] ${article.title}` : article.title}
            </span>
          </div>

          <Link
            href="/insight"
            className="inline-flex items-center gap-1.5 hover:text-[#15803d] transition-colors font-medium shrink-0 ml-4"
          >
            <ArrowLeftIcon className="size-3.5" />
            <span className="hidden sm:inline">Kembali ke Semua Insight</span>
            <span className="sm:hidden">Kembali</span>
          </Link>
        </div>
      </div>

      {/* Main Container - Full Width max-w-[1440px] */}
      <main className="w-full max-w-[1440px] px-4 lg:px-[20px] pt-8 sm:pt-12 flex flex-col relative">
        {/* Article Header (Wide Hero Area) */}
        <header className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge className="bg-[#15803d] text-white font-semibold text-xs px-3 py-0.5 shadow-xs rounded-[5px]">
              {article.category}
            </Badge>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CalendarIcon className="size-3" />
              {article.created_at
                ? new Date(article.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Terbaru"}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
              <ClockIcon className="size-3" />
              {article.reading_time || "4 min baca"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.18] max-w-5xl">
            {article.title}
          </h1>

          {/* Author & Share Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-border/60">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-[#15803d] to-[#166534] text-white font-bold text-sm shadow-sm">
                IGN
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {article.author || "Tim R&D CV. Indo Green Nature"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Pakar Formulasi Herbal & Regulasi CPOTB
                </p>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareWhatsApp}
                className="h-9 gap-1.5 text-xs text-[#15803d] dark:text-green-400 border-[#15803d]/30 hover:bg-[#15803d]/10 dark:hover:bg-green-950/30 font-medium rounded-[5px]"
              >
                <WhatsAppIcon className="size-3.5" />
                <span>Bagikan WA</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="h-9 gap-1.5 text-xs font-medium rounded-[5px]"
              >
                {copied ? (
                  <>
                    <CheckIcon className="size-3.5 text-[#15803d]" />
                    <span className="text-[#15803d] font-semibold">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Share2Icon className="size-3.5" />
                    <span>Salin Link</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* 2-Column Wide Layout Sesuai Spesifikasi Figma (Left: 927px Foto & Konten, Right: 453px Sidebar Cards, Gap: 20px) */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_453px] gap-5 items-start">
          {/* Kolom Kiri: Main Article Content (rectangle: 927px x 467px Cover + Konten Artikel) */}
          <article className="min-w-0 w-full">
            {/* Foto Frame Insight (rectangle: 927px x 467px) */}
            {article.cover_image && (
              <div className="mb-8">
                <div
                  style={{
                    height: `${coverHeight}px`,
                    maxHeight: `${coverHeight}px`,
                  }}
                  className="relative w-full overflow-hidden rounded-[5px] border border-border shadow-md bg-muted transition-all duration-300"
                >
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    style={{
                      objectFit: coverFit,
                    }}
                    className="h-full w-full transition-all duration-300"
                  />
                </div>
              </div>
            )}

            <InsightViewer content={article.content} />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t border-border/60">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">
                  Topik & Kata Kunci Terkait:
                </span>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/insight?q=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center rounded-[5px] border border-[#15803d]/20 bg-[#15803d]/10 px-3.5 py-1 text-xs font-medium text-green-800 dark:text-green-300 hover:bg-[#15803d]/20 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Kolom Kanan: Sidebar Cards (rectangle-2, rectangle-3, rectangle-4: width 453px, gap 20px) */}
          <aside className="w-full lg:w-[453px] shrink-0 space-y-5 lg:sticky lg:top-24">
            {/* rectangle-2: Consultation Card Widget: Punya Ide Formulasi Serupa (height ~324px, sejajar dengan foto) */}
            {insightSettings.sidebarCtaShow !== false && (
              <div className="overflow-hidden rounded-[5px] border border-[#15803d]/30 bg-gradient-to-br from-[#15803d] via-[#166534] to-[#14532d] text-white p-6 shadow-md space-y-3.5">
                <div className="inline-flex items-center rounded-[5px] bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                  <span>{insightSettings.sidebarCtaBadge || "Konsultasi Maklon Herbal"}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold leading-snug whitespace-pre-line">
                  {insightSettings.sidebarCtaTitle || "Punya Ide Formulasi Serupa?"}
                </h3>
                <p className="text-green-100 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {insightSettings.sidebarCtaDesc ||
                    "Tim R&D dan apoteker CV. Indo Green Nature siap membantu memformulasikan produk herbal Anda hingga izin edar BPOM dan sertifikat Halal terbit."}
                </p>
                <div className="pt-1 flex flex-col gap-2">
                  <a
                    href={
                      insightSettings.sidebarCtaBtnLink ||
                      "https://wa.me/6281234567890?text=Halo%20CV.%20Indo%20Green%20Nature%2C%20saya%20tertarik%20konsultasi%20maklon%20produk%20herbal%20setelah%20membaca%20artikel%20insight."
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: insightSettings.sidebarCtaBtnBg || "#ffffff",
                      color: insightSettings.sidebarCtaBtnColor || "#15803d",
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-[5px] hover:opacity-90 px-4 py-2.5 text-xs sm:text-sm font-bold shadow-md transition-opacity"
                  >
                    <WhatsAppIcon className="size-4" />
                    <span>{insightSettings.sidebarCtaBtnText || "Hubungi Tim R&D via WA"}</span>
                  </a>
                  {insightSettings.sidebarCtaSublinkText && (
                    <Link
                      href={insightSettings.sidebarCtaSublinkUrl || "/our-products"}
                      className="text-center text-xs text-green-100 hover:text-white underline underline-offset-4 font-medium"
                    >
                      {insightSettings.sidebarCtaSublinkText}
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* rectangle-3: Quick Article Specs Widget: Detail Publikasi (height ~235px) */}
            <div className="rounded-[5px] border border-border bg-card p-5 space-y-3 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FolderIcon className="size-3.5 text-[#15803d]" />
                Detail Publikasi
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Kategori</span>
                  <span className="font-semibold text-[#15803d] dark:text-green-400">
                    {article.category}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Waktu Baca</span>
                  <span className="font-semibold text-foreground">
                    {article.reading_time || "4 min baca"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Pembahasan</span>
                  <span className="font-semibold text-foreground">
                    {article.pembahasan || "CPOTB & BPOM"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 gap-2">
                  <span className="text-muted-foreground shrink-0">Penerbit</span>
                  <span className="font-semibold text-foreground text-right">
                    {article.author || "CV. Indo Green Nature"}
                  </span>
                </div>
              </div>
            </div>

            {/* rectangle-4: Quick Related Widget: Insight Terkait (height ~392px) */}
            {relatedArticles.length > 0 && (
              <div className="rounded-[5px] border border-border bg-card p-5 space-y-3.5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <BookmarkIcon className="size-3.5 text-[#15803d]" />
                  Insight Terkait
                </h4>
                <div className="space-y-3">
                  {relatedArticles.slice(0, 3).map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/insight/${rel.slug}`}
                      className="group flex gap-3 items-center"
                    >
                      <div className="size-14 rounded-[5px] overflow-hidden bg-muted shrink-0 border border-border">
                        <img
                          src={rel.cover_image || "/images/banner-default.jpg"}
                          alt={rel.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        <span className="text-[10px] font-semibold text-[#15803d] dark:text-green-400 uppercase">
                          {rel.category}
                        </span>
                        <h5 className="text-xs font-bold text-foreground group-hover:text-[#15803d] transition-colors line-clamp-2 leading-snug">
                          {rel.title}
                        </h5>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Bottom Full-Width CTA Section: Kembangkan Brand Herbal Anda */}
        {insightSettings.bottomCtaShow !== false && (
          <section className="mt-16 w-full rounded-[5px] border border-border bg-gradient-to-r from-[#15803d]/10 via-[#15803d]/5 to-transparent p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
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

        {/* Related Articles Bottom Grid */}
        {relatedArticles.length > 0 && (
          <section className="mt-14 pt-10 border-t border-border w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#15803d] inline-block" />
                Riset & Artikel Lainnya
              </h3>
              <Link
                href="/insight"
                className="text-xs font-semibold text-[#15803d] hover:text-[#166534] flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRightIcon className="size-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/insight/${rel.slug}`}
                  className="group rounded-[5px] border border-border bg-card overflow-hidden hover:border-[#15803d]/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={rel.cover_image || "/images/banner-default.jpg"}
                        alt={rel.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 space-y-1.5">
                      <span className="text-[10px] font-semibold text-[#15803d] dark:text-green-400 uppercase tracking-wider">
                        {rel.category}
                      </span>
                      <h4 className="font-bold text-sm text-foreground group-hover:text-[#15803d] transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {getArticleSnippet(rel)}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t border-border/50 flex items-center justify-end mt-auto">
                    <span className="text-xs font-semibold text-[#15803d] dark:text-green-400 group-hover:text-[#166534] inline-flex items-center gap-1.5 transition-colors">
                      <span>Baca Selengkapnya</span>
                      <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
