"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  ShieldCheck,
  Award,
  FileCheck2,
  Building2,
  FlaskConical,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Eye,
  FileText,
  HelpCircle,
  Download,
  X,
  BadgeCheck,
  Sparkles,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import { cn } from "@/lib/utils"
import { poppins } from "@/lib/fonts"
import { LegalitySettingsSidebar } from "@/components/legality-settings-sidebar"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  LegalDocument,
  LegalitySettingsData,
  DEFAULT_LEGALITY_SETTINGS,
  LEGALITY_SETTINGS_KEY,
  LEGALITY_PREVIEW_CHANNEL,
  getInitialLegalitySettings,
  fetchLegalitySettings,
  saveLegalitySettings,
  resetLegalitySettings,
} from "@/lib/legality-settings"
import { supabase } from "@/lib/supabase"
import { isUserAdmin } from "@/lib/auth-admin"

/** Render teks dengan dukungan **tebal** */
function renderRich(text: string): React.ReactNode {
  return (text || "").split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  )
}

export default function LegalityPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [settings, setSettings] = useState<LegalitySettingsData>(DEFAULT_LEGALITY_SETTINGS)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  const accent = settings.accentColor || "#15803D"
  const LEGAL_DOCUMENTS = settings.documents
  const waNumber = settings.ctaWhatsappNumber || "6282136368880"

  useEffect(() => {
    if (!selectedDoc) {
      setIsZoomed(false)
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false)
        } else {
          setSelectedDoc(null)
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selectedDoc, isZoomed])

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Reset scroll ke paling atas dokumen saat mode zoom aktif
  useEffect(() => {
    if (isZoomed && scrollContainerRef.current) {
      const el = scrollContainerRef.current
      el.scrollTop = 0
      if (el.scrollWidth > el.clientWidth) {
        el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
      } else {
        el.scrollLeft = 0
      }
    }
  }, [isZoomed])

  const handleCopyNumber = (docId: string, docNumber: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(docNumber)
      setCopiedId(docId)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  // Muat data: cache lokal seketika, lalu database dengan minTimer dan font ready check untuk mencegah flashback
  useEffect(() => {
    let isMounted = true
    const isPrev = window.location.search.includes("preview=true")
    if (isPrev) setIsPreview(true)

    try {
      const cached = getInitialLegalitySettings()
      if (cached && isMounted) {
        setSettings(cached)
      }
    } catch {}

    const initData = async () => {
      const minTimer = new Promise((resolve) => setTimeout(resolve, 250))
      try {
        const remoteData = await fetchLegalitySettings()
        if (isMounted) {
          if (!isPrev) {
            setSettings(remoteData)
          }
        }
        await minTimer
      } catch (err) {
        console.warn("Gagal memuat pengaturan legalitas:", err)
      } finally {
        if (typeof document !== "undefined" && document.fonts) {
          try {
            await document.fonts.ready
          } catch {}
        }
        requestAnimationFrame(() => {
          if (isMounted) {
            setIsLoading(false)
          }
        })
      }
    }

    initData()

    return () => {
      isMounted = false
    }
  }, [])

  // Buka modal dari AdminFAB atau query ?edit=true
  useEffect(() => {
    const handleOpen = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user || !isUserAdmin(session.user.email)) return
      setIsSettingsOpen(true)
    }
    window.addEventListener("open-legality-settings", handleOpen)
    const params = new URLSearchParams(window.location.search)
    if (params.get("preview") !== "true" && params.get("edit") === "true") {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user && isUserAdmin(session.user.email)) {
          setIsSettingsOpen(true)
        } else {
          setIsSettingsOpen(false)
          window.history.replaceState({}, "", window.location.pathname)
        }
      })
    }
    return () => window.removeEventListener("open-legality-settings", handleOpen)
  }, [])

  // Sinkronisasi real-time lintas tab (pratinjau)
  useEffect(() => {
    let bc: BroadcastChannel | null = null
    if (typeof BroadcastChannel !== "undefined") {
      try {
        bc = new BroadcastChannel(LEGALITY_PREVIEW_CHANNEL)
        bc.onmessage = (event) => {
          if (event.data?.type === "PREVIEW_UPDATE" && event.data?.data) {
            setSettings(event.data.data)
          }
        }
      } catch {}
    }
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LEGALITY_SETTINGS_KEY && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue))
        } catch {}
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => {
      if (bc) bc.close()
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      const res = await saveLegalitySettings(settings)
      if (res.success) setIsSettingsOpen(false)
      else alert(res.error || "Gagal menyimpan perubahan.")
    } catch (err: any) {
      alert("Error: " + (err?.message || "Gagal menyimpan."))
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetSettings = async () => {
    await resetLegalitySettings()
    setSettings(DEFAULT_LEGALITY_SETTINGS)
    setIsSettingsOpen(false)
  }

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
          <LoadingSpinner text="Loading" />
        </div>
      )}

      <div
        suppressHydrationWarning
        style={{ ["--lg-accent" as any]: accent }}
        className={cn(
          "min-h-screen bg-card-alt dark:bg-background text-foreground pb-24 lg:pb-16 font-sans flex flex-col items-center transition-colors duration-300",
          isLoading && "invisible",
          poppins.className
        )}
      >
      {isPreview && (
        <div className="w-full bg-[color:var(--lg-accent)] text-white py-2 px-4 sm:px-6 text-xs font-semibold flex items-center justify-between sticky top-[60px] z-40 shadow-sm border-b border-white/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>Mode Pratinjau Halaman Legality Aktif</span>
          </div>
          <button
            type="button"
            onClick={() => window.close()}
            className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded text-[11px] transition-colors cursor-pointer font-bold"
          >
            Tutup Tab Pratinjau
          </button>
        </div>
      )}
      <main
        suppressHydrationWarning
        className="w-full max-w-[1440px] px-4 lg:px-[20px] pt-[10px] pb-16 flex flex-col relative z-10 gap-8 md:gap-10"
      >
        {/* ─── Breadcrumb & Navigation Bar (Konsisten seperti About Us & Contact) ─── */}
        <div className="flex items-center justify-between py-2 border-b border-primary/10 text-xs md:text-sm text-zinc-700 dark:text-zinc-300">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link href="/" className="hover:text-primary transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-primary font-semibold">Legality &amp; Sertifikasi</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 md:gap-4 text-xs text-foreground/80 font-medium">
            <a href="#dokumen-resmi" className="hover:text-primary transition-colors">
              Daftar Dokumen
            </a>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <a href="#panduan-verifikasi" className="hover:text-primary transition-colors">
              Panduan Cek
            </a>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <a href="#due-diligence" className="hover:text-primary transition-colors">
              Due Diligence B2B
            </a>
          </div>
        </div>

        {/* ─── 01. Hero Section (Figma Simple Layout) ─── */}
        <section
          id="hero-legalitas"
          className="w-full text-center space-y-4 pt-3 sm:pt-5 scroll-mt-24"
        >
          <h1
            style={{ color: settings.heroTitleColor || undefined }}
            className={cn(
              "text-xl sm:text-2xl md:text-[32px] lg:text-[38px] font-bold text-[color:var(--lg-accent)] leading-tight max-w-[1282px] mx-auto tracking-tight",
              poppins.className
            )}
          >
            {settings.heroTitle}
          </h1>

          <p
            className={cn(
              "text-sm sm:text-base text-[#161616] dark:text-foreground/85 max-w-[1282px] mx-auto leading-relaxed text-center px-2",
              poppins.className
            )}
          >
            {renderRich(settings.heroSubtitle)}
          </p>

          {/* Stat Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 pt-3 w-full">
            {settings.heroStats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-[5px] bg-[#D9D9D9]/30 dark:bg-card border border-border/80 p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[96px] shadow-2xs hover:border-[color:var(--lg-accent)] transition-colors"
              >
                <p className={cn("text-base font-bold text-[color:var(--lg-accent)]", poppins.className)}>{stat.title}</p>
                <p className={cn("text-xs text-[#161616] dark:text-foreground/80 font-normal mt-1", poppins.className)}>
                  {stat.subtitle}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Dividing Line 1 (line in Figma) ─── */}
        <div className="w-full flex items-center justify-center my-1">
          <hr className="w-full border-t border-black/15 dark:border-white/15" />
        </div>

        {/* ─── 02. Document Grid Cards (group-11 in Figma) ─── */}
        <section id="dokumen-resmi" className="w-full scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
            {LEGAL_DOCUMENTS.map((doc) => {
                const isCopied = copiedId === doc.id
                return (
                  <div
                    key={doc.id}
                    className="group rounded-[5px] border border-border bg-[#D9D9D9]/25 dark:bg-card hover:border-[color:var(--lg-accent)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden relative w-full h-full p-5 sm:p-6"
                  >
                    {/* Header (layer--13: issuer, layer--14: title) */}
                    <div className="space-y-1">
                      <p className={cn("text-xs font-bold text-[color:var(--lg-accent)] line-clamp-1", poppins.className)}>
                        {doc.issuer}
                      </p>
                      <h3 className={cn("text-base font-bold text-[color:var(--lg-accent)] leading-snug line-clamp-2 min-h-[44px]", poppins.className)}>
                        {doc.title}
                      </h3>
                    </div>

                    {/* Registration Box (rectangle-7) */}
                    <div className="rounded-[5px] bg-white dark:bg-muted/40 border border-border/80 p-3 my-4 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-xs">
                        {/* layer--16 */}
                        <span className="text-[#000000] dark:text-foreground/85 font-normal">
                          Nomor Dokumen Registrasi
                        </span>
                        {/* layer--17 */}
                        <button
                          type="button"
                          onClick={() => handleCopyNumber(doc.id, doc.docNumber)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[color:var(--lg-accent)] hover:underline cursor-pointer"
                          title="Salin nomor dokumen"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600 font-bold">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>salin</span>
                            </>
                          )}
                        </button>
                      </div>
                      {/* layer--18 */}
                      <p className="font-mono font-bold text-xs text-[#000000] dark:text-foreground tracking-tight select-all break-all">
                        {doc.docNumber}
                      </p>
                    </div>

                    {/* Description Paragraph (layer--15: 12px, text-center) */}
                    <p className={cn("text-xs text-[#161616] dark:text-foreground/85 leading-relaxed text-center line-clamp-4 mb-5 flex-1", poppins.className)}>
                      {doc.description}
                    </p>

                    {/* Action Button (rectangle-8 & layer--19: border-radius 100px, bg #15803D, text white 16px bold) */}
                    <button
                      type="button"
                      onClick={() => setSelectedDoc(doc)}
                      className={cn(
                        "w-full py-3 px-5 rounded-full bg-[color:var(--lg-accent)] hover:brightness-90 text-white text-sm sm:text-base font-bold text-center transition-all shadow-xs hover:shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2",
                        poppins.className
                      )}
                    >
                      <Eye className="w-4 h-4 text-white" />
                      <span>{settings.docCardBtnText}</span>
                    </button>
                  </div>
                )
              })}
            </div>
        </section>

        {/* ─── Dividing Line 2 (line-2 in Figma) ─── */}
        <div className="w-full flex items-center justify-center my-2 sm:my-3">
          <hr className="w-full border-t border-black/15 dark:border-white/15" />
        </div>

        {/* ─── 04. Verification Guide for Clients (layer--55 & layer--56 in Figma) ─── */}
        <section id="panduan-verifikasi" className="w-full scroll-mt-24 space-y-6">
          <div className="w-full rounded-[5px] bg-card border border-border p-6 md:p-8 shadow-xs space-y-6">
            <div className="text-center w-full max-w-[1282px] mx-auto space-y-2">
              <p className={cn("text-sm font-bold text-[#161616] dark:text-foreground tracking-wide", poppins.className)}>
                {settings.guideLabel}
              </p>
              <h2 className={cn("text-lg sm:text-xl md:text-2xl lg:text-[26px] font-bold text-[color:var(--lg-accent)] leading-tight tracking-tight max-w-[1282px] mx-auto", poppins.className)}>
                {settings.guideTitle}
              </h2>
              <p className={cn("text-xs md:text-sm text-foreground/85 leading-relaxed max-w-3xl mx-auto", poppins.className)}>
                {settings.guideDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 w-full">
              {settings.guideSteps.map((step, idx) => (
                <div key={step.id} className="p-4 rounded-[5px] bg-muted/30 border border-border/80 space-y-2 text-xs">
                  <div className="w-7 h-7 rounded-full bg-[color:var(--lg-accent)] text-white flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <h4 className="font-bold text-foreground text-sm">{step.title}</h4>
                  <p className="text-foreground/85 leading-relaxed text-[11.5px]">{renderRich(step.desc)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 05. CTA Due Diligence Banner ─── */}
        <section id="due-diligence" className="w-full scroll-mt-24">
          <div
            style={{ background: `linear-gradient(to right, ${accent}, color-mix(in srgb, ${accent} 65%, black))` }}
            className="w-full relative rounded-[5px] overflow-hidden text-white p-6 md:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="space-y-2 max-w-2xl text-center md:text-left">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold backdrop-blur-xs">
                {settings.ctaBadge}
              </span>
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
                {settings.ctaTitle}
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(settings.ctaWhatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: accent }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-2.5 md:px-7 md:py-2.5 rounded-full bg-white hover:bg-emerald-50 text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" />
                <span>{settings.ctaBtnText}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Modal Pengaturan Legality ─── */}
      <LegalitySettingsSidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        data={settings}
        onChange={setSettings}
        onSave={handleSaveSettings}
        onReset={handleResetSettings}
        isSaving={isSaving}
      />

      {/* ─── Modal Foto Dokumen (clean & compact, tanpa tombol, tanpa scrollbar, zoom on click) ─── */}
      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => {
            setSelectedDoc(null)
            setIsZoomed(false)
          }}
          role="dialog"
          aria-modal="true"
          aria-label={selectedDoc.title}
        >
          <div
            className="w-full max-w-3xl max-h-[92vh] overflow-hidden bg-card rounded-[5px] shadow-2xl p-3 sm:p-4 space-y-3 animate-in zoom-in-95 duration-200 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-0.5 select-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--lg-accent)] block">
                {selectedDoc.issuer}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                {selectedDoc.title}
              </h3>
            </div>

            {selectedDoc.imageUrl ? (
              selectedDoc.imageUrl.toLowerCase().includes(".pdf") ||
              selectedDoc.imageUrl.startsWith("data:application/pdf") ? (
                <div className="w-full h-[75vh] max-h-[800px] rounded-[5px] overflow-hidden border border-border bg-muted/20">
                  <iframe
                    src={selectedDoc.imageUrl}
                    title={selectedDoc.title}
                    className="w-full h-full border-none"
                  />
                </div>
              ) : (
                <div className="relative w-full rounded-[5px] overflow-hidden bg-black/5 dark:bg-black/20 select-none">
                  <div
                    ref={scrollContainerRef}
                    className={cn(
                      "w-full max-h-[78vh] transition-all",
                      isZoomed
                        ? "overflow-auto cursor-zoom-out [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden block"
                        : "overflow-hidden cursor-zoom-in flex items-center justify-center"
                    )}
                    onClick={() => setIsZoomed((prev) => !prev)}
                    title={isZoomed ? "Klik foto untuk memperkecil" : "Klik foto untuk memperbesar (zoom)"}
                  >
                    <div
                      className={cn(
                        "min-w-full transition-all duration-300 ease-out",
                        isZoomed
                          ? "w-max flex flex-col items-center justify-start p-2 sm:p-3"
                          : "w-full flex items-center justify-center h-auto"
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedDoc.imageUrl}
                        alt={selectedDoc.title}
                        className={cn(
                          "rounded-[5px] border border-border object-contain shadow-sm transition-all duration-300 ease-out",
                          isZoomed
                            ? "max-h-[96vh] sm:max-h-[102vh] w-auto max-w-[120%] sm:max-w-[125%] shadow-md"
                            : "max-h-[78vh] w-auto max-w-full mx-auto hover:opacity-95"
                        )}
                      />
                    </div>
                  </div>

                  {/* Floating mini badge petunjuk zoom */}
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-xs text-white text-[10.5px] font-medium pointer-events-none transition-all flex items-center gap-1.5 shadow-xs z-10">
                    {isZoomed ? (
                      <>
                        <ZoomOut className="w-3 h-3 text-emerald-400" />
                        <span>Klik untuk perkecil</span>
                      </>
                    ) : (
                      <>
                        <ZoomIn className="w-3 h-3 text-emerald-400" />
                        <span>Klik foto untuk zoom</span>
                      </>
                    )}
                  </div>
                </div>
              )
            ) : (
              <div className="w-full aspect-[3/4] sm:aspect-[4/3] max-h-[500px] rounded-[5px] border border-dashed border-border bg-muted/30 flex flex-col items-center justify-center p-6 text-center gap-2">
                <FileText className="w-8 h-8 text-muted-foreground/60" />
                <p className="text-xs sm:text-sm font-semibold text-foreground/80">
                  Dokumen fisik sedang dalam proses digitalisasi
                </p>
                <p className="text-[11px] text-muted-foreground max-w-xs">
                  Salinan dokumen resmi dapat diminta melalui kontak resmi CV. Indo Green Nature.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </>
  )
}
