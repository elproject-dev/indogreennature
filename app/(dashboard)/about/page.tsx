"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  Globe2,
  Building2,
  Users,
  Sparkles,
  ArrowRight,
  Target,
  Eye,
  HeartHandshake,
  Leaf,
  Scale,
  FlaskConical,
  PackageCheck,
  Clock,
  Layers,
  MapPin,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  PhoneCall,
  Check,
  Plane,
  BadgeCheck,
  Play,
  X,
  SlidersHorizontal,
} from "lucide-react"
import { poppins, outfit, getHeroFontClass, getHeroFontFamily, preloadHeroFont } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getEmbedVideoUrl, DEFAULT_VIDEO_PROFIL_URL } from "@/lib/home-blocks"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { AboutSettingsSidebar } from "@/components/about-settings-sidebar"
import {
  AboutSettingsData,
  DEFAULT_ABOUT_SETTINGS,
  ABOUT_SETTINGS_KEY,
  ABOUT_PREVIEW_CHANNEL,
  getInitialAboutSettings,
  fetchAboutSettings,
  saveAboutSettings,
  resetAboutSettings,
  resolveAboutWhatsappUrl,
} from "@/lib/about-settings"
import { toast } from "@/components/ui/toast"
import { supabase } from "@/lib/supabase"
import { isUserAdmin } from "@/lib/auth-admin"

const timelineMilestones = [
  {
    year: "2000",
    title: "Awal Berdiri di Yogyakarta",
    desc: "Memulai kiprah sebagai produsen pengolahan simplisia herbal murni dan jamu racik tradisional dengan komitmen mutu higienis.",
  },
  {
    year: "2008",
    title: "Ekspansi Pabrik Wates",
    desc: "Pembangunan fasilitas pabrik mandiri di Wates, Kulon Progo, serta penerbitan Izin Usaha Kecil Obat Tradisional (UKOT).",
  },
  {
    year: "2015",
    title: "Sertifikasi CPOTB Penuh",
    desc: "Modernisasi mesin produksi otomatis kapsul, sediaan cair, dan pengesahan fasilitas Cleanroom sesuai regulasi CPOTB BPOM.",
  },
  {
    year: "2020",
    title: "Maklon One-Stop Solution",
    desc: "Meluncurkan program kemitraan maklon terpadu bagi brand owner, sukses memformulasi lebih dari 760 brand produk beredar.",
  },
  {
    year: "2024",
    title: "Standar ISO & Halal",
    desc: "Meraih sertifikasi ISO 22000 dan sertifikasi Halal BPJPH guna menjamin kepatuhan mutu farmasi serta kesiapan ekspansi ekspor.",
  },
]

function AnimatedCounter({
  from = 0,
  to,
  duration = 2000,
  suffix = "",
  className,
  ready = true,
}: {
  from?: number
  to: number
  duration?: number
  suffix?: string
  className?: string
  ready?: boolean
}) {
  const [count, setCount] = React.useState(from)
  const ref = React.useRef<HTMLSpanElement>(null)
  const hasAnimated = React.useRef(false)

  React.useEffect(() => {
    if (!ready || hasAnimated.current) return
    const node = ref.current
    if (!node) return

    const startAnimation = () => {
      hasAnimated.current = true
      let startTime: number | null = null
      const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

      const step = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        const easedProgress = easeOutExpo(progress)
        const currentCount = Math.floor(easedProgress * (to - from) + from)
        setCount(currentCount)

        if (progress < 1) {
          requestAnimationFrame(step)
        } else {
          setCount(to)
        }
      }

      requestAnimationFrame(step)
    }

    if (typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry.isIntersecting && !hasAnimated.current) {
            startAnimation()
            observer.disconnect()
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(node)
      return () => observer.disconnect()
    } else {
      startAnimation()
    }
  }, [from, to, duration, ready])

  return (
    <span ref={ref} className={className}>
      {count}
      {suffix}
    </span>
  )
}

export default function AboutUsPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [activeVideoModalUrl, setActiveVideoModalUrl] = React.useState<string | null>(null)
  const [activeVideoModalTitle, setActiveVideoModalTitle] = React.useState<string>("Video Profil CV. Indo Green Nature")

  // Pengaturan About Us: inisialisasi SSR stabil dengan DEFAULT_ABOUT_SETTINGS untuk mencegah Hydration Mismatch
  const [aboutSettings, setAboutSettings] = React.useState<AboutSettingsData>(DEFAULT_ABOUT_SETTINGS)
  const [isSettingsOpen, setIsSettingsOpen] = React.useState<boolean>(false)
  const [isSavingSettings, setIsSavingSettings] = React.useState<boolean>(false)
  const [isPreview, setIsPreview] = React.useState<boolean>(false)

  // Embla Carousel Hook dengan Infinite Loop & Autoplay terus ke kiri tanpa berbalik arah
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })
  )
  const [timelineEmblaRef, timelineEmblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    [autoplayPlugin.current]
  )

  // Duplikasi item agar carousel memiliki slide berlebih untuk continuous loop yang mulus tanpa batas
  const rawMilestones =
    aboutSettings.rekamJejakMilestones && aboutSettings.rekamJejakMilestones.length > 0
      ? aboutSettings.rekamJejakMilestones
      : timelineMilestones

  const displayMilestones = React.useMemo(() => {
    if (rawMilestones.length === 0) return []
    if (rawMilestones.length < 5) {
      return [...rawMilestones, ...rawMilestones, ...rawMilestones, ...rawMilestones]
    }
    return [...rawMilestones, ...rawMilestones, ...rawMilestones]
  }, [rawMilestones])

  const scrollTimeline = (direction: "left" | "right") => {
    if (direction === "left") {
      timelineEmblaApi?.scrollPrev()
    } else {
      timelineEmblaApi?.scrollNext()
    }
  }

  // Embla Carousel Hook untuk Legalitas & Sertifikasi Mutu dengan Auto Slide ke kiri (infinite loop)
  const legalitasAutoplayPlugin = React.useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })
  )
  const [legalitasEmblaRef, legalitasEmblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    [legalitasAutoplayPlugin.current]
  )

  const scrollLegalitas = (direction: "left" | "right") => {
    if (direction === "left") {
      legalitasEmblaApi?.scrollPrev()
    } else {
      legalitasEmblaApi?.scrollNext()
    }
  }

  React.useEffect(() => {
    let isMounted = true

    // Cek apakah halaman dibuka dalam mode pratinjau tab baru (?preview=true)
    const isPrev = typeof window !== "undefined" && window.location.search.includes("preview=true")
    if (isPrev) {
      setIsPreview(true)
    }

    const initDataAndFont = async () => {
      const minTimer = new Promise((resolve) => setTimeout(resolve, 250))
      let activeFont = "poppins"

      try {
        // 1. Ambil data lokal dari cache seketika setelah client mount
        const cached = getInitialAboutSettings()
        if (cached && isMounted) {
          setAboutSettings(cached)
          if (cached.bannerTitleFont) {
            activeFont = cached.bannerTitleFont
          }
          if (cached.bannerDescFont) {
            preloadHeroFont(cached.bannerDescFont)
          }
          if (cached.profilTitleFont) {
            preloadHeroFont(cached.profilTitleFont)
          }
          if (cached.profilDescFont) {
            preloadHeroFont(cached.profilDescFont)
          }
          if (cached.visiMisiTitleFont) {
            preloadHeroFont(cached.visiMisiTitleFont)
          }
          if (cached.visiMisiSubtitleFont) {
            preloadHeroFont(cached.visiMisiSubtitleFont)
          }
          if (cached.visiTitleFont) {
            preloadHeroFont(cached.visiTitleFont)
          }
          if (cached.visiDescFont) {
            preloadHeroFont(cached.visiDescFont)
          }
          if (cached.misiTitleFont) {
            preloadHeroFont(cached.misiTitleFont)
          }
          if (cached.misiItemTitleFont) {
            preloadHeroFont(cached.misiItemTitleFont)
          }
          if (cached.misiItemDescFont) {
            preloadHeroFont(cached.misiItemDescFont)
          }
          if (cached.rekamJejakTitleFont) {
            preloadHeroFont(cached.rekamJejakTitleFont)
          }
          if (cached.rekamJejakSubtitleFont) {
            preloadHeroFont(cached.rekamJejakSubtitleFont)
          }
          if (cached.rekamJejakCarouselTitleFont) {
            preloadHeroFont(cached.rekamJejakCarouselTitleFont)
          }
        }

        // 2. Preload font awal dari cache agar browser segera mengunduh file font
        preloadHeroFont(activeFont)

        // 3. Ambil data master dari database Supabase
        const dbData = await fetchAboutSettings()
        if (isMounted && dbData) {
          setAboutSettings(dbData)
          if (dbData.bannerTitleFont) {
            activeFont = dbData.bannerTitleFont
          }
          if (dbData.bannerDescFont) {
            preloadHeroFont(dbData.bannerDescFont)
          }
          if (dbData.profilTitleFont) {
            preloadHeroFont(dbData.profilTitleFont)
          }
          if (dbData.profilDescFont) {
            preloadHeroFont(dbData.profilDescFont)
          }
          if (dbData.visiMisiTitleFont) {
            preloadHeroFont(dbData.visiMisiTitleFont)
          }
          if (dbData.visiMisiSubtitleFont) {
            preloadHeroFont(dbData.visiMisiSubtitleFont)
          }
          if (dbData.visiTitleFont) {
            preloadHeroFont(dbData.visiTitleFont)
          }
          if (dbData.visiDescFont) {
            preloadHeroFont(dbData.visiDescFont)
          }
          if (dbData.misiTitleFont) {
            preloadHeroFont(dbData.misiTitleFont)
          }
          if (dbData.misiItemTitleFont) {
            preloadHeroFont(dbData.misiItemTitleFont)
          }
          if (dbData.misiItemDescFont) {
            preloadHeroFont(dbData.misiItemDescFont)
          }
          if (dbData.rekamJejakTitleFont) {
            preloadHeroFont(dbData.rekamJejakTitleFont)
          }
          if (dbData.rekamJejakSubtitleFont) {
            preloadHeroFont(dbData.rekamJejakSubtitleFont)
          }
          if (dbData.rekamJejakCarouselTitleFont) {
            preloadHeroFont(dbData.rekamJejakCarouselTitleFont)
          }
        }

        // 4. Pastikan font final benar-benar selesai diunduh & didekode oleh browser
        await Promise.all([
          preloadHeroFont(activeFont),
          preloadHeroFont(dbData?.bannerDescFont || cached?.bannerDescFont || "outfit"),
          preloadHeroFont(dbData?.profilTitleFont || cached?.profilTitleFont || "poppins"),
          preloadHeroFont(dbData?.profilDescFont || cached?.profilDescFont || "outfit"),
          preloadHeroFont(dbData?.visiMisiTitleFont || cached?.visiMisiTitleFont || "poppins"),
          preloadHeroFont(dbData?.visiMisiSubtitleFont || cached?.visiMisiSubtitleFont || "outfit"),
          preloadHeroFont(dbData?.visiTitleFont || cached?.visiTitleFont || "poppins"),
          preloadHeroFont(dbData?.visiDescFont || cached?.visiDescFont || "outfit"),
          preloadHeroFont(dbData?.misiTitleFont || cached?.misiTitleFont || "poppins"),
          preloadHeroFont(dbData?.misiItemTitleFont || cached?.misiItemTitleFont || "poppins"),
          preloadHeroFont(dbData?.misiItemDescFont || cached?.misiItemDescFont || "outfit"),
          preloadHeroFont(dbData?.rekamJejakTitleFont || cached?.rekamJejakTitleFont || "poppins"),
          preloadHeroFont(dbData?.rekamJejakSubtitleFont || cached?.rekamJejakSubtitleFont || "outfit"),
          preloadHeroFont(dbData?.rekamJejakCarouselTitleFont || cached?.rekamJejakCarouselTitleFont || "poppins"),
        ])
      } catch (err) {
        console.warn("[AboutUsPage] Error saat memuat pengaturan:", err)
      } finally {
        // Tunggu minimal 250ms agar loading spinner stabil
        await minTimer

        // 5. Pastikan semua web font browser telah ready
        if (typeof document !== "undefined" && document.fonts) {
          try {
            await document.fonts.ready
          } catch {
            // Abaikan jika browser tidak mendukung
          }
        }

        // 6. Gunakan requestAnimationFrame agar frame pertama dengan font baru selesai dirender sebelum overlay diangkat
        requestAnimationFrame(() => {
          if (isMounted) {
            setIsLoading(false)

            // Jika mode pratinjau dan ada target hash section (#banner-utama, #visi-misi, dll), lakukan smooth scroll
            if (typeof window !== "undefined" && window.location.hash) {
              const targetId = window.location.hash.replace("#", "")
              setTimeout(() => {
                const el = document.getElementById(targetId)
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              }, 120)
            }
          }
        })
      }
    }

    initDataAndFont()

    return () => {
      isMounted = false
    }
  }, [])

  // Listener untuk membuka sidebar dari Floating Button Settings (AdminFAB)
  React.useEffect(() => {
    const handleOpenFromFab = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user || !isUserAdmin(session.user.email)) return
      setIsSettingsOpen(true)
    }

    window.addEventListener("open-about-settings", handleOpenFromFab)

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const isPrev = params.get("preview") === "true"
      if (!isPrev && (params.get("edit") === "true" || params.get("settings") === "about")) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user && isUserAdmin(session.user.email)) {
            setIsSettingsOpen(true)
          } else {
            setIsSettingsOpen(false)
            window.history.replaceState({}, "", window.location.pathname)
          }
        })
      }
    }

    return () => {
      window.removeEventListener("open-about-settings", handleOpenFromFab)
    }
  }, [])

  // Sinkronisasi Real-Time Lintas Tab: Tab pratinjau otomatis update saat data diubah di tab pengaturan
  React.useEffect(() => {
    let bc: BroadcastChannel | null = null

    if (typeof BroadcastChannel !== "undefined") {
      try {
        bc = new BroadcastChannel(ABOUT_PREVIEW_CHANNEL)
        bc.onmessage = (event) => {
          if (event.data?.type === "PREVIEW_UPDATE" && event.data?.data) {
            const updated = event.data.data
            if (updated.bannerTitleFont) {
              preloadHeroFont(updated.bannerTitleFont)
            }
            if (updated.bannerDescFont) {
              preloadHeroFont(updated.bannerDescFont)
            }
            if (updated.profilTitleFont) {
              preloadHeroFont(updated.profilTitleFont)
            }
            if (updated.profilDescFont) {
              preloadHeroFont(updated.profilDescFont)
            }
            if (updated.visiMisiTitleFont) {
              preloadHeroFont(updated.visiMisiTitleFont)
            }
            if (updated.visiMisiSubtitleFont) {
              preloadHeroFont(updated.visiMisiSubtitleFont)
            }
            if (updated.visiTitleFont) {
              preloadHeroFont(updated.visiTitleFont)
            }
            if (updated.visiDescFont) {
              preloadHeroFont(updated.visiDescFont)
            }
            if (updated.misiTitleFont) {
              preloadHeroFont(updated.misiTitleFont)
            }
            if (updated.misiItemTitleFont) {
              preloadHeroFont(updated.misiItemTitleFont)
            }
            if (updated.misiItemDescFont) {
              preloadHeroFont(updated.misiItemDescFont)
            }
            if (updated.rekamJejakTitleFont) {
              preloadHeroFont(updated.rekamJejakTitleFont)
            }
            if (updated.rekamJejakSubtitleFont) {
              preloadHeroFont(updated.rekamJejakSubtitleFont)
            }
            if (updated.rekamJejakCarouselTitleFont) {
              preloadHeroFont(updated.rekamJejakCarouselTitleFont)
            }
            setAboutSettings(updated)
          }
        }
      } catch (err) {
        console.warn("[AboutUsPage] Error initializing BroadcastChannel:", err)
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ABOUT_SETTINGS_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (parsed.bannerTitleFont) {
            preloadHeroFont(parsed.bannerTitleFont)
          }
          if (parsed.bannerDescFont) {
            preloadHeroFont(parsed.bannerDescFont)
          }
          if (parsed.profilTitleFont) {
            preloadHeroFont(parsed.profilTitleFont)
          }
          if (parsed.profilDescFont) {
            preloadHeroFont(parsed.profilDescFont)
          }
          if (parsed.visiMisiTitleFont) {
            preloadHeroFont(parsed.visiMisiTitleFont)
          }
          if (parsed.visiMisiSubtitleFont) {
            preloadHeroFont(parsed.visiMisiSubtitleFont)
          }
          if (parsed.visiTitleFont) {
            preloadHeroFont(parsed.visiTitleFont)
          }
          if (parsed.visiDescFont) {
            preloadHeroFont(parsed.visiDescFont)
          }
          if (parsed.misiTitleFont) {
            preloadHeroFont(parsed.misiTitleFont)
          }
          if (parsed.misiItemTitleFont) {
            preloadHeroFont(parsed.misiItemTitleFont)
          }
          if (parsed.misiItemDescFont) {
            preloadHeroFont(parsed.misiItemDescFont)
          }
          if (parsed.rekamJejakTitleFont) {
            preloadHeroFont(parsed.rekamJejakTitleFont)
          }
          if (parsed.rekamJejakSubtitleFont) {
            preloadHeroFont(parsed.rekamJejakSubtitleFont)
          }
          if (parsed.rekamJejakCarouselTitleFont) {
            preloadHeroFont(parsed.rekamJejakCarouselTitleFont)
          }
          setAboutSettings((prev) => ({ ...prev, ...parsed }))
        } catch {
          // ignore
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      if (bc) {
        bc.close()
      }
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleSaveSettings = async () => {
    setIsSavingSettings(true)
    try {
      const res = await saveAboutSettings(aboutSettings)
      if (res.success) {
        toast.add({
          title: "Pengaturan Tersimpan di Database",
          description: "Perubahan konten About Us berhasil disimpan ke tabel khusus about_us_config.",
          type: "success",
        })
      } else {
        toast.add({
          title: "Gagal Menyimpan ke Database",
          description: res.error || "Terjadi kesalahan saat menyimpan pengaturan.",
          type: "error",
        })
      }
    } catch (err: any) {
      console.error(err)
      toast.add({
        title: "Gagal Menyimpan",
        description: err?.message || "Terjadi kesalahan sistem saat menyimpan pengaturan.",
        type: "error",
      })
    } finally {
      setIsSavingSettings(false)
    }
  }

  const handleResetSettings = async () => {
    if (typeof window !== "undefined") {
      const confirmReset = window.confirm("Kembalikan seluruh teks & gambar ke pengaturan standar?")
      if (!confirmReset) return
      try {
        setIsSavingSettings(true)
        await resetAboutSettings()
        setAboutSettings(DEFAULT_ABOUT_SETTINGS)
        toast.add({
          title: "Pengaturan Direset",
          description: "Konten About Us telah dikembalikan ke kondisi default.",
          type: "info",
        })
      } catch (err) {
        console.error(err)
      } finally {
        setIsSavingSettings(false)
      }
    }
  }

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const whatsappUrl = "https://wa.me/6282136368880?text=Halo%20Tim%20CV.%20Indo%20Green%20Nature,%20saya%20ingin%20konsultasi%20mengenai%20layanan%20maklon%20herbal."

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
          <LoadingSpinner text="Loading" />
        </div>
      )}

      <div
        className={cn(
          "w-full min-h-screen bg-background flex flex-col items-center overflow-x-hidden font-sans transition-colors duration-300",
          isLoading && "invisible"
        )}
      >
        {/* Banner Indikator Mode Pratinjau (preview=true) */}
        {isPreview && (
          <div className="w-full bg-[#15803D] text-white py-2 px-4 sm:px-6 text-xs font-semibold flex items-center justify-between sticky top-[60px] z-40 shadow-sm border-b border-white/20 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>Mode Pratinjau Halaman About Us Aktif</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] opacity-90 hidden md:inline">
                Data pratinjau draft ditampilkan secara real-time
              </span>
              <button
                type="button"
                onClick={() => window.close()}
                className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded text-[11px] transition-colors cursor-pointer font-bold"
              >
                Tutup Tab Pratinjau
              </button>
            </div>
          </div>
        )}

        {/* Hidden Font Preloader Anchor: Memastikan browser mengenali & mendownload font yang dipilih */}
        <span
          aria-hidden="true"
          suppressHydrationWarning
          className={cn(
            "sr-only opacity-0 pointer-events-none select-none fixed -top-[9999px] -left-[9999px]",
            getHeroFontClass(aboutSettings.bannerTitleFont || "poppins"),
            getHeroFontClass(aboutSettings.bannerDescFont || "outfit"),
            getHeroFontClass(aboutSettings.profilTitleFont || "poppins"),
            getHeroFontClass(aboutSettings.profilDescFont || "outfit"),
            getHeroFontClass(aboutSettings.visiMisiTitleFont || "poppins"),
            getHeroFontClass(aboutSettings.visiMisiSubtitleFont || "outfit"),
            getHeroFontClass(aboutSettings.visiTitleFont || "poppins"),
            getHeroFontClass(aboutSettings.visiDescFont || "outfit"),
            getHeroFontClass(aboutSettings.misiTitleFont || "poppins"),
            getHeroFontClass(aboutSettings.misiItemTitleFont || "poppins"),
            getHeroFontClass(aboutSettings.misiItemDescFont || "outfit")
          )}
          style={{
            fontFamily: `${getHeroFontFamily(aboutSettings.bannerTitleFont || "poppins")}, ${getHeroFontFamily(aboutSettings.bannerDescFont || "outfit")}, ${getHeroFontFamily(aboutSettings.profilTitleFont || "poppins")}, ${getHeroFontFamily(aboutSettings.profilDescFont || "outfit")}, ${getHeroFontFamily(aboutSettings.visiMisiTitleFont || "poppins")}, ${getHeroFontFamily(aboutSettings.visiMisiSubtitleFont || "outfit")}, ${getHeroFontFamily(aboutSettings.visiTitleFont || "poppins")}, ${getHeroFontFamily(aboutSettings.visiDescFont || "outfit")}, ${getHeroFontFamily(aboutSettings.misiTitleFont || "poppins")}, ${getHeroFontFamily(aboutSettings.misiItemTitleFont || "poppins")}, ${getHeroFontFamily(aboutSettings.misiItemDescFont || "outfit")}`,
          }}
        >
          {aboutSettings.bannerTitle || "CV. Indo Green Nature - Banner Title"}
        </span>

        <main className="w-full max-w-[1440px] px-4 lg:px-[20px] pt-[10px] pb-16 flex flex-col relative z-10 gap-10 md:gap-14">

          {/* ─── Breadcrumb & Navigation Bar ─── */}
          <div className="flex items-center justify-between py-2 border-b border-primary/10 text-xs md:text-sm text-zinc-700 dark:text-zinc-300">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link href="/" className="hover:text-primary transition-colors">
                Beranda
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-primary font-semibold">About Us</span>
            </div>
          </div>

          {/* ─── 01. Hero Section (Frameless, seperti Hero Banner) ─── */}
          <section id="banner-utama" className="scroll-mt-24 relative w-full flex flex-col gap-6 pt-2 pb-6">
            {/* Flex Container Fleksibel: Menjamin Jarak (Gap) Tepat 20px Antara Foto & Teks */}
            <div className="flex flex-col lg:flex-row items-center gap-[20px] w-full transition-all duration-300">
              {/* Sisi Teks & Tombol (Otomatis Melebar & Mengisi Ruang Sisa Saat Foto Mengecil) */}
              <div
                className={cn(
                  "flex-1 min-w-0 w-full flex flex-col gap-4 transition-all duration-300",
                  aboutSettings.bannerImagePosition === "left" ? "lg:order-2" : "lg:order-1"
                )}
              >
                <h1
                  suppressHydrationWarning
                  className={cn(
                    "text-xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold leading-[1.22] sm:leading-[1.18] tracking-tight transition-colors duration-200",
                    !aboutSettings.bannerTitleColor && "text-foreground",
                    getHeroFontClass(aboutSettings.bannerTitleFont || "poppins")
                  )}
                  style={{
                    fontFamily: getHeroFontFamily(aboutSettings.bannerTitleFont || "poppins"),
                    color: aboutSettings.bannerTitleColor || undefined,
                    fontSize: aboutSettings.bannerTitleSize
                      ? `clamp(${Math.max(18, Math.round(aboutSettings.bannerTitleSize * 0.52))}px, 3.8vw, ${aboutSettings.bannerTitleSize}px)`
                      : undefined,
                  }}
                >
                  {aboutSettings.bannerTitle}
                </h1>

                <p
                  suppressHydrationWarning
                  className={cn(
                    "leading-relaxed font-normal whitespace-pre-line transition-colors duration-200",
                    !aboutSettings.bannerDescColor && "text-zinc-800 dark:text-zinc-200",
                    !aboutSettings.bannerDescSize && "text-sm sm:text-base md:text-lg",
                    getHeroFontClass(aboutSettings.bannerDescFont || "outfit")
                  )}
                  style={{
                    fontFamily: getHeroFontFamily(aboutSettings.bannerDescFont || "outfit"),
                    color: aboutSettings.bannerDescColor || undefined,
                    fontSize: aboutSettings.bannerDescSize
                      ? `clamp(${Math.max(12, Math.round(aboutSettings.bannerDescSize * 0.85))}px, 2vw, ${aboutSettings.bannerDescSize}px)`
                      : undefined,
                  }}
                >
                  {aboutSettings.bannerDesc}
                </p>

                {/* CTA Buttons inside Hero - 2 Kolom di Mobile, Flex di Desktop */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 pt-2 w-full sm:w-auto">
                  <a
                    href={resolveAboutWhatsappUrl(aboutSettings.bannerBtn1Link || whatsappUrl)}
                    target={resolveAboutWhatsappUrl(aboutSettings.bannerBtn1Link || whatsappUrl).startsWith("http") ? "_blank" : undefined}
                    rel={resolveAboutWhatsappUrl(aboutSettings.bannerBtn1Link || whatsappUrl).startsWith("http") ? "noopener noreferrer" : undefined}
                    className={cn(
                      "inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-[5px] font-bold text-[11px] sm:text-xs md:text-sm text-center shadow-xs hover:shadow-md transition-all cursor-pointer",
                      !aboutSettings.bannerBtn1BgColor && "bg-primary hover:bg-primary/90",
                      !aboutSettings.bannerBtn1TextColor && "text-primary-foreground"
                    )}
                    style={{
                      backgroundColor: aboutSettings.bannerBtn1BgColor || undefined,
                      color: aboutSettings.bannerBtn1TextColor || undefined,
                    }}
                  >
                    <PhoneCall className="size-3 sm:size-3.5 shrink-0" />
                    <span className="truncate">{aboutSettings.bannerBtn1Text || "Konsultasi Maklon Herbal"}</span>
                  </a>
                  <a
                    href={aboutSettings.bannerBtn2Link || "#profil-perusahaan"}
                    target={(aboutSettings.bannerBtn2Link || "#profil-perusahaan").startsWith("http") ? "_blank" : undefined}
                    rel={(aboutSettings.bannerBtn2Link || "#profil-perusahaan").startsWith("http") ? "noopener noreferrer" : undefined}
                    className={cn(
                      "inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-[5px] font-semibold text-[11px] sm:text-xs md:text-sm text-center border transition-all cursor-pointer",
                      !aboutSettings.bannerBtn2BgColor && "bg-background hover:bg-muted border-border",
                      !aboutSettings.bannerBtn2TextColor && "text-foreground"
                    )}
                    style={{
                      backgroundColor: aboutSettings.bannerBtn2BgColor || undefined,
                      color: aboutSettings.bannerBtn2TextColor || undefined,
                      borderColor: aboutSettings.bannerBtn2BgColor ? "transparent" : undefined,
                    }}
                  >
                    <span className="truncate">{aboutSettings.bannerBtn2Text || "Jelajahi Profil Perusahaan"}</span>
                    <ArrowRight className="size-3 sm:size-3.5 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Sisi Foto dengan Rasio 16:9 & Skala Fleksibel Berjarak Tepat 20px */}
              <div
                className={cn(
                  "shrink-0 flex items-center transition-all duration-300",
                  aboutSettings.bannerImagePosition === "left"
                    ? "lg:order-1 justify-start"
                    : "lg:order-2 justify-end"
                )}
                style={{
                  width: `min(100%, ${Math.max(220, Math.round(540 * ((aboutSettings.bannerImageScale ?? 100) / 100)))}px)`,
                }}
              >
                <div className="relative w-full aspect-[16/9] rounded-[5px] overflow-hidden shadow-md border border-border/80 group">
                  <Image
                    src={aboutSettings.bannerImage || "/images/about_hero_banner.jpg"}
                    alt="Fasilitas Manufaktur & Laboratorium CV. Indo Green Nature"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Quick Metrics / Counter Cards dengan Animated Count */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-4 pt-6 border-t border-border">
              <div className="flex flex-col items-center text-center">
                <span className={cn("text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary", poppins.className)}>
                  <AnimatedCounter
                    to={aboutSettings.stat1Number}
                    suffix={aboutSettings.stat1Suffix}
                    ready={!isLoading}
                  />
                </span>
                <span className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-medium mt-1">
                  {aboutSettings.stat1Label}
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className={cn("text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary", poppins.className)}>
                  <AnimatedCounter
                    to={aboutSettings.stat2Number}
                    suffix={aboutSettings.stat2Suffix}
                    ready={!isLoading}
                  />
                </span>
                <span className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-medium mt-1">
                  {aboutSettings.stat2Label}
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className={cn("text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary", poppins.className)}>
                  <AnimatedCounter
                    to={aboutSettings.stat3Number}
                    suffix={aboutSettings.stat3Suffix}
                    ready={!isLoading}
                  />
                </span>
                <span className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-medium mt-1">
                  {aboutSettings.stat3Label}
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className={cn("text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary", poppins.className)}>
                  <AnimatedCounter
                    to={aboutSettings.stat4Number}
                    suffix={aboutSettings.stat4Suffix}
                    ready={!isLoading}
                  />
                </span>
                <span className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-medium mt-1">
                  {aboutSettings.stat4Label}
                </span>
              </div>
            </div>

            {/* Garis Pembatas Putus-putus Halus seperti Home Block */}
            <div className="w-full pt-2 md:pt-4 flex items-center justify-center">
              <hr
                className="w-full transition-colors border-dashed border-black/20 dark:border-white/15"
                style={{ borderTopWidth: "1px", borderBottomWidth: "0px" }}
              />
            </div>
          </section>

          {/* ─── 02. Profil CV. Indo Green Nature ─── */}
          <section id="profil-perusahaan" className="scroll-mt-24 w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-primary uppercase">
                <Building2 className="w-4 h-4" />
                <span>Profil Perusahaan</span>
              </div>
              <h2
                suppressHydrationWarning
                className={cn(
                  "font-bold tracking-tight transition-colors duration-200",
                  !aboutSettings.profilTitleSize && "text-2xl md:text-3xl lg:text-4xl",
                  !aboutSettings.profilTitleColor && "text-foreground",
                  getHeroFontClass(aboutSettings.profilTitleFont || "poppins")
                )}
                style={{
                  fontFamily: getHeroFontFamily(aboutSettings.profilTitleFont || "poppins"),
                  color: aboutSettings.profilTitleColor || undefined,
                  fontSize: aboutSettings.profilTitleSize
                    ? `clamp(${Math.max(18, Math.round(aboutSettings.profilTitleSize * 0.65))}px, 3.2vw, ${aboutSettings.profilTitleSize}px)`
                    : undefined,
                }}
              >
                {aboutSettings.profilTitle}
              </h2>
            </div>

            {/* Flex Container Fleksibel: Menjamin Jarak (Gap) Mulus Antara Video & Teks Saat Thumbnail Diskalakan */}
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-[24px] w-full transition-all duration-300">
              {/* Kolom Frame Video 16:9 dengan Skala Fleksibel */}
              <div
                className={cn(
                  "shrink-0 flex items-center transition-all duration-300",
                  aboutSettings.profilMediaPosition === "right"
                    ? "lg:order-2 justify-end"
                    : "lg:order-1 justify-start"
                )}
                style={{
                  width: `min(100%, ${Math.max(240, Math.round(520 * ((aboutSettings.profilMediaScale ?? 100) / 100)))}px)`,
                }}
              >
                <div
                  onClick={() => {
                    setActiveVideoModalUrl(aboutSettings.profilVideoUrl || DEFAULT_VIDEO_PROFIL_URL)
                    setActiveVideoModalTitle(aboutSettings.profilTitle)
                  }}
                  className="group w-full aspect-[16/9] bg-neutral-900 rounded-[5px] overflow-hidden shadow-lg border border-primary/20 relative cursor-pointer select-none transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
                  title="Klik untuk memutar video profil"
                >
                  {/* Thumbnail Image */}
                  <img
                    src={aboutSettings.profilVideoThumb || "/images/ign_lab_video_thumb.jpg"}
                    alt={aboutSettings.profilTitle}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/20 group-hover:from-black/85 transition-all duration-300" />

                  {/* Center Pulsing Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative flex items-center justify-center">
                      {/* Ripple Ring */}
                      <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/40 animate-ping opacity-75" />

                      {/* Play Button Circle */}
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 group-hover:bg-red-700 text-white flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110">
                        <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-0.5 fill-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom Deskripsi Profil Perusahaan (Fleksibel Melebar Mengikuti Sisa Ruang) */}
              <div
                className={cn(
                  "flex-1 min-w-0 w-full flex flex-col transition-all duration-300",
                  aboutSettings.profilMediaPosition === "right" ? "lg:order-1" : "lg:order-2"
                )}
              >
                <div
                  suppressHydrationWarning
                  className={cn(
                    "leading-relaxed font-normal whitespace-pre-line transition-colors duration-200",
                    !aboutSettings.profilDescColor && "text-zinc-800 dark:text-zinc-200",
                    !aboutSettings.profilDescSize && "text-sm md:text-base",
                    getHeroFontClass(aboutSettings.profilDescFont || "outfit")
                  )}
                  style={{
                    fontFamily: getHeroFontFamily(aboutSettings.profilDescFont || "outfit"),
                    color: aboutSettings.profilDescColor || undefined,
                    fontSize: aboutSettings.profilDescSize
                      ? `clamp(${Math.max(12, Math.round(aboutSettings.profilDescSize * 0.85))}px, 1.8vw, ${aboutSettings.profilDescSize}px)`
                      : undefined,
                  }}
                >
                  {aboutSettings.profilDesc ||
                    [aboutSettings.profilP1, aboutSettings.profilP2, aboutSettings.profilP3]
                      .filter(Boolean)
                      .join("\n\n")}
                </div>
              </div>
            </div>

            {/* Garis Pembatas Putus-putus Halus seperti Home Block */}
            <div className="w-full pt-2 md:pt-4 flex items-center justify-center">
              <hr
                className="w-full transition-colors border-dashed border-black/20 dark:border-white/15"
                style={{ borderTopWidth: "1px", borderBottomWidth: "0px" }}
              />
            </div>
          </section>

          {/* ─── 03. Visi dan Misi Perusahaan ─── */}
          <section id="visi-misi" className="scroll-mt-24 w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-primary uppercase">
                <Target className="w-4 h-4" />
                <span>Arah Strategis</span>
              </div>
              <h2
                className={cn(
                  "font-bold tracking-tight",
                  !aboutSettings.visiMisiTitleColor && "text-foreground",
                  !aboutSettings.visiMisiTitleSize && "text-2xl md:text-3xl lg:text-4xl",
                  getHeroFontClass(aboutSettings.visiMisiTitleFont || "poppins")
                )}
                style={{
                  color: aboutSettings.visiMisiTitleColor || undefined,
                  fontFamily: getHeroFontFamily(aboutSettings.visiMisiTitleFont || "poppins"),
                  fontSize: aboutSettings.visiMisiTitleSize
                    ? `clamp(${Math.max(20, Math.round(aboutSettings.visiMisiTitleSize * 0.75))}px, 3.2vw, ${aboutSettings.visiMisiTitleSize}px)`
                    : undefined,
                }}
              >
                {aboutSettings.visiMisiTitle || "Visi & Misi CV. Indo Green Nature"}
              </h2>
              <p
                className={cn(
                  "w-full leading-relaxed font-normal whitespace-pre-line",
                  !aboutSettings.visiMisiSubtitleColor && "text-zinc-800 dark:text-zinc-200",
                  !aboutSettings.visiMisiSubtitleSize && "text-sm md:text-base",
                  getHeroFontClass(aboutSettings.visiMisiSubtitleFont || "outfit")
                )}
                style={{
                  color: aboutSettings.visiMisiSubtitleColor || undefined,
                  fontFamily: getHeroFontFamily(aboutSettings.visiMisiSubtitleFont || "outfit"),
                  fontSize: aboutSettings.visiMisiSubtitleSize
                    ? `clamp(${Math.max(12, Math.round(aboutSettings.visiMisiSubtitleSize * 0.85))}px, 1.8vw, ${aboutSettings.visiMisiSubtitleSize}px)`
                    : undefined,
                }}
              >
                {aboutSettings.visiMisiSubtitle ||
                  "Prinsip panduan yang mendasari setiap inovasi, formulasi, dan kemitraan manufaktur yang kami bangun bersama seluruh mitra klien."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Kartu Visi */}
              {(() => {
                const isLightBg = Boolean(
                  aboutSettings.visiCardBg &&
                    (aboutSettings.visiCardBg.toLowerCase() === "#ffffff" ||
                      aboutSettings.visiCardBg.toLowerCase() === "#fff" ||
                      aboutSettings.visiCardBg.toLowerCase() === "#f8fafc" ||
                      aboutSettings.visiCardBg.toLowerCase().startsWith("rgb(255") ||
                      aboutSettings.visiCardBg.toLowerCase().includes("white"))
                )

                return (
                  <div
                    className={cn(
                      "flex flex-col justify-between p-6 sm:p-8 rounded-[5px] shadow-md border h-full transition-all",
                      !aboutSettings.visiCardBg &&
                        "bg-gradient-to-br from-[#15803d] via-[#166534] to-[#14532d] text-white border-emerald-600/30",
                      aboutSettings.visiCardBg &&
                        (isLightBg ? "border-border shadow-xs text-foreground" : "border-border/60 text-white"),
                      aboutSettings.visiAlign === "center"
                        ? "text-center items-center"
                        : aboutSettings.visiAlign === "right"
                        ? "text-right items-end"
                        : "text-left items-start"
                    )}
                    style={{
                      background: aboutSettings.visiCardBg || undefined,
                      backgroundColor: aboutSettings.visiCardBg || undefined,
                    }}
                  >
                    {/* Header Visi */}
                    <div
                      className={cn(
                        "w-full flex flex-col",
                        aboutSettings.visiAlign === "center"
                          ? "items-center text-center"
                          : aboutSettings.visiAlign === "right"
                          ? "items-end text-right"
                          : "items-start text-left"
                      )}
                    >
                      <span
                        className={cn(
                          "text-xs font-bold uppercase tracking-widest",
                          !aboutSettings.visiCardBg
                            ? "text-white"
                            : isLightBg
                            ? "text-primary"
                            : "text-white"
                        )}
                      >
                        VISI KAMI
                      </span>
                      <h3
                        className={cn(
                          "font-bold mt-1 tracking-tight leading-snug w-full",
                          !aboutSettings.visiTitleColor &&
                            (!aboutSettings.visiCardBg
                              ? "text-white"
                              : isLightBg
                              ? "text-foreground font-black"
                              : "text-white"),
                          !aboutSettings.visiTitleSize && "text-xl sm:text-2xl",
                          getHeroFontClass(aboutSettings.visiTitleFont || "poppins")
                        )}
                        style={{
                          color: aboutSettings.visiTitleColor || undefined,
                          fontFamily: getHeroFontFamily(aboutSettings.visiTitleFont || "poppins"),
                          fontSize: aboutSettings.visiTitleSize
                            ? `clamp(${Math.max(16, Math.round(aboutSettings.visiTitleSize * 0.85))}px, 2.2vw, ${aboutSettings.visiTitleSize}px)`
                            : undefined,
                        }}
                      >
                        {aboutSettings.visiTitle}
                      </h3>
                    </div>

                    {/* Deskripsi di Tengah-Tengah Frame Card */}
                    <div
                      className={cn(
                        "my-auto py-6 flex w-full",
                        aboutSettings.visiAlign === "center"
                          ? "justify-center text-center"
                          : aboutSettings.visiAlign === "right"
                          ? "justify-end text-right"
                          : "justify-start text-left"
                      )}
                    >
                      <p
                        className={cn(
                          "leading-relaxed font-normal whitespace-pre-line w-full",
                          !aboutSettings.visiDescColor &&
                            (!aboutSettings.visiCardBg
                              ? "text-white/95"
                              : isLightBg
                              ? "text-zinc-700 dark:text-zinc-300"
                              : "text-white/95"),
                          !aboutSettings.visiDescSize && "text-sm sm:text-base",
                          getHeroFontClass(aboutSettings.visiDescFont || "outfit")
                        )}
                        style={{
                          color: aboutSettings.visiDescColor || undefined,
                          fontFamily: getHeroFontFamily(aboutSettings.visiDescFont || "outfit"),
                          fontSize: aboutSettings.visiDescSize
                            ? `clamp(${Math.max(12, Math.round(aboutSettings.visiDescSize * 0.85))}px, 1.8vw, ${aboutSettings.visiDescSize}px)`
                            : undefined,
                        }}
                      >
                        {aboutSettings.visiDesc}
                      </p>
                    </div>

                    {/* Footer Visi */}
                    <div
                      className={cn(
                        "mt-auto pt-6 border-t w-full flex items-center gap-2.5 sm:gap-3.5 text-xs font-semibold flex-wrap",
                        !aboutSettings.visiCardBg
                          ? "border-white/15 text-white/90"
                          : isLightBg
                          ? "border-border text-zinc-600 dark:text-zinc-400"
                          : "border-white/20 text-white/90",
                        aboutSettings.visiAlign === "center"
                          ? "justify-center text-center"
                          : aboutSettings.visiAlign === "right"
                          ? "justify-end text-right"
                          : "justify-start text-left"
                      )}
                    >
                      {(aboutSettings.visiPillars && aboutSettings.visiPillars.length > 0
                        ? aboutSettings.visiPillars
                        : ["Standar Mutu Farmasi", "Inovasi Alami", "Orientasi Global"]
                      ).map((pillar, idx, arr) => (
                        <React.Fragment key={idx}>
                          <span>{pillar}</span>
                          {idx < arr.length - 1 && <span className="opacity-60">•</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* Kartu Misi */}
              {(() => {
                const isLightMisiBg = Boolean(
                  aboutSettings.misiCardBg &&
                    (aboutSettings.misiCardBg.toLowerCase() === "#ffffff" ||
                      aboutSettings.misiCardBg.toLowerCase() === "#fff" ||
                      aboutSettings.misiCardBg.toLowerCase() === "#f8fafc" ||
                      aboutSettings.misiCardBg.toLowerCase() === "#fdfbf7" ||
                      aboutSettings.misiCardBg.toLowerCase().startsWith("rgb(255") ||
                      aboutSettings.misiCardBg.toLowerCase().includes("white"))
                )

                return (
                  <div
                    className={cn(
                      "flex flex-col p-6 sm:p-8 rounded-[5px] shadow-md border transition-all h-full",
                      !aboutSettings.misiCardBg && "bg-card-alt border-primary/20",
                      aboutSettings.misiCardBg &&
                        (isLightMisiBg
                          ? "border-border shadow-xs text-foreground"
                          : "border-border/60 text-white"),
                      aboutSettings.misiAlign === "center"
                        ? "text-center items-center"
                        : aboutSettings.misiAlign === "right"
                        ? "text-right items-end"
                        : "text-left items-start"
                    )}
                    style={{
                      background: aboutSettings.misiCardBg || undefined,
                      backgroundColor: aboutSettings.misiCardBg || undefined,
                    }}
                  >
                    {/* Header Misi */}
                    <div
                      className={cn(
                        "w-full flex flex-col mb-4",
                        aboutSettings.misiAlign === "center"
                          ? "items-center text-center"
                          : aboutSettings.misiAlign === "right"
                          ? "items-end text-right"
                          : "items-start text-left"
                      )}
                    >
                      <span
                        className={cn(
                          "text-xs font-bold uppercase tracking-widest transition-colors duration-200",
                          !aboutSettings.misiBadgeNumberColor &&
                            !aboutSettings.misiBadgeNumberBg &&
                            (!aboutSettings.misiCardBg
                              ? "text-primary"
                              : isLightMisiBg
                              ? "text-primary"
                              : "text-emerald-300")
                        )}
                        style={{
                          color:
                            aboutSettings.misiBadgeNumberColor ||
                            aboutSettings.misiBadgeNumberBg ||
                            undefined,
                        }}
                      >
                        {aboutSettings.misiBadge || "MISI KAMI"}
                      </span>
                      <h3
                        className={cn(
                          "font-bold mt-1 tracking-tight leading-snug w-full",
                          !aboutSettings.misiTitleColor && "text-foreground",
                          !aboutSettings.misiTitleSize && "text-xl sm:text-2xl",
                          getHeroFontClass(aboutSettings.misiTitleFont || "poppins")
                        )}
                        style={{
                          color: aboutSettings.misiTitleColor || undefined,
                          fontFamily: getHeroFontFamily(aboutSettings.misiTitleFont || "poppins"),
                          fontSize: aboutSettings.misiTitleSize
                            ? `clamp(${Math.max(16, Math.round(aboutSettings.misiTitleSize * 0.85))}px, 2.2vw, ${aboutSettings.misiTitleSize}px)`
                            : undefined,
                        }}
                      >
                        {aboutSettings.misiTitle || "Komitmen Utama Mewujudkan Keunggulan"}
                      </h3>
                    </div>

                    {/* Daftar Poin Komitmen Misi */}
                    <div className="flex flex-col gap-4 mt-2 w-full">
                      {(aboutSettings.misiItems || []).map((item) => {
                        const customBg = aboutSettings.misiBadgeNumberBg
                        const customNumColor = aboutSettings.misiBadgeNumberColor
                        const customTitleColor = aboutSettings.misiItemTitleColor

                        // Tentukan warna aksen utama yang telah diatur oleh user
                        const setupAccentColor =
                          customNumColor ||
                          customBg ||
                          (customTitleColor ? `color-mix(in srgb, ${customTitleColor} 80%, #15803D)` : "var(--primary)")

                        // Warna normal badge nomor
                        const badgeNormalBg = customBg
                          ? customBg
                          : customNumColor
                          ? `color-mix(in srgb, ${customNumColor} 16%, transparent)`
                          : "color-mix(in srgb, var(--primary) 15%, transparent)"

                        const badgeNormalText = customNumColor
                          ? customNumColor
                          : customBg
                          ? "#FFFFFF"
                          : "var(--primary)"

                        // Warna hover badge nomor (jika ada customBg, sedikit diangkat/kontras; jika tanpa customBg, solid warna angka)
                        const badgeHoverBg = customBg
                          ? `color-mix(in srgb, ${customBg} 85%, white)`
                          : customNumColor
                          ? customNumColor
                          : "var(--primary)"

                        const badgeHoverText = customBg
                          ? (customNumColor || "#FFFFFF")
                          : "#FFFFFF"

                        // Warna judul komitmen misi (normal & saat di-hover mengikuti warna setup)
                        const titleNormalColor = customTitleColor || "inherit"
                        const titleHoverColor = setupAccentColor

                        return (
                          <div
                            key={item.num}
                            className={cn(
                              "flex gap-3.5 group/misi cursor-default transition-all duration-200",
                              aboutSettings.misiAlign === "center"
                                ? "flex-col items-center text-center"
                                : aboutSettings.misiAlign === "right"
                                ? "flex-row-reverse items-start text-right"
                                : "flex-row items-start text-left"
                            )}
                            style={
                              {
                                "--misi-badge-bg": badgeNormalBg,
                                "--misi-badge-text": badgeNormalText,
                                "--misi-badge-hover-bg": badgeHoverBg,
                                "--misi-badge-hover-text": badgeHoverText,
                                "--misi-title-color": titleNormalColor,
                                "--misi-title-hover-color": titleHoverColor,
                              } as React.CSSProperties
                            }
                          >
                            <span
                              className={cn(
                                "w-7 h-7 rounded-[5px] text-xs font-black flex items-center justify-center shrink-0 shadow-xs transition-all duration-200",
                                "bg-[var(--misi-badge-bg)] text-[var(--misi-badge-text)]",
                                "group-hover/misi:bg-[var(--misi-badge-hover-bg)] group-hover/misi:text-[var(--misi-badge-hover-text)]",
                                "group-hover/misi:scale-110 group-hover/misi:shadow-md"
                              )}
                            >
                              {item.num}
                            </span>
                            <div className="flex flex-col flex-1">
                              <h4
                                className={cn(
                                  "font-bold transition-colors duration-200",
                                  "text-[var(--misi-title-color)] group-hover/misi:text-[var(--misi-title-hover-color)]",
                                  !aboutSettings.misiItemTitleSize && "text-sm",
                                  getHeroFontClass(aboutSettings.misiItemTitleFont || "poppins")
                                )}
                                style={{
                                  fontFamily: getHeroFontFamily(
                                    aboutSettings.misiItemTitleFont || "poppins"
                                  ),
                                  fontSize: aboutSettings.misiItemTitleSize
                                    ? `${aboutSettings.misiItemTitleSize}px`
                                    : undefined,
                                }}
                              >
                                {item.title}
                              </h4>
                              <p
                                className={cn(
                                  "mt-0.5 leading-relaxed font-normal whitespace-pre-line",
                                  !aboutSettings.misiItemDescColor &&
                                    "text-zinc-800 dark:text-zinc-200",
                                  !aboutSettings.misiItemDescSize && "text-xs sm:text-sm",
                                  getHeroFontClass(aboutSettings.misiItemDescFont || "outfit")
                                )}
                                style={{
                                  color: aboutSettings.misiItemDescColor || undefined,
                                  fontFamily: getHeroFontFamily(
                                    aboutSettings.misiItemDescFont || "outfit"
                                  ),
                                  fontSize: aboutSettings.misiItemDescSize
                                    ? `${aboutSettings.misiItemDescSize}px`
                                    : undefined,
                                }}
                              >
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}
            </div>
          </section>

          {/* ─── Garis Pembatas Rekam Jejak ─── */}
          <div className="w-full border-t border-border" />

          {/* ─── 04. Perjalanan & Kapabilitas Perusahaan ─── */}
          <section id="rekam-jejak" className="scroll-mt-24 w-full flex flex-col gap-6">
            <div
              className={cn(
                "flex flex-col gap-2 w-full",
                aboutSettings.rekamJejakAlign === "center"
                  ? "items-center text-center"
                  : aboutSettings.rekamJejakAlign === "right"
                  ? "items-end text-right"
                  : "items-start text-left"
              )}
            >
              <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-primary uppercase">
                <Clock className="w-4 h-4" />
                <span>{aboutSettings.rekamJejakBadge || "Rekam Jejak & Kapabilitas"}</span>
              </div>
              <h2
                className={cn(
                  "font-bold tracking-tight w-full",
                  !aboutSettings.rekamJejakTitleColor && "text-foreground",
                  !aboutSettings.rekamJejakTitleSize && "text-2xl md:text-3xl lg:text-4xl",
                  getHeroFontClass(aboutSettings.rekamJejakTitleFont || "poppins")
                )}
                style={{
                  color: aboutSettings.rekamJejakTitleColor || undefined,
                  fontFamily: getHeroFontFamily(aboutSettings.rekamJejakTitleFont || "poppins"),
                  fontSize: aboutSettings.rekamJejakTitleSize
                    ? `clamp(${Math.max(20, Math.round(aboutSettings.rekamJejakTitleSize * 0.75))}px, 3.2vw, ${aboutSettings.rekamJejakTitleSize}px)`
                    : undefined,
                }}
              >
                {aboutSettings.rekamJejakTitle || "Perjalanan & Kapabilitas Manufaktur Kami"}
              </h2>
              <p
                className={cn(
                  "w-full leading-relaxed font-normal whitespace-pre-line",
                  !aboutSettings.rekamJejakSubtitleColor && "text-zinc-800 dark:text-zinc-200",
                  !aboutSettings.rekamJejakSubtitleSize && "text-sm md:text-base",
                  getHeroFontClass(aboutSettings.rekamJejakSubtitleFont || "outfit")
                )}
                style={{
                  color: aboutSettings.rekamJejakSubtitleColor || undefined,
                  fontFamily: getHeroFontFamily(aboutSettings.rekamJejakSubtitleFont || "outfit"),
                  fontSize: aboutSettings.rekamJejakSubtitleSize
                    ? `clamp(${Math.max(12, Math.round(aboutSettings.rekamJejakSubtitleSize * 0.85))}px, 1.8vw, ${aboutSettings.rekamJejakSubtitleSize}px)`
                    : undefined,
                }}
              >
                {aboutSettings.rekamJejakSubtitle ||
                  "Lebih dari dua dekade membuktikan dedikasi berkelanjutan dalam memajukan industri kesehatan dan obat bahan alam di Indonesia."}
              </p>
            </div>

            {/* Timeline Milestones Carousel */}
            <div className="w-full flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3
                  className={cn(
                    "font-bold",
                    !aboutSettings.rekamJejakCarouselTitleColor && "text-foreground",
                    !aboutSettings.rekamJejakCarouselTitleSize && "text-lg sm:text-xl",
                    getHeroFontClass(aboutSettings.rekamJejakCarouselTitleFont || "poppins")
                  )}
                  style={{
                    color: aboutSettings.rekamJejakCarouselTitleColor || undefined,
                    fontFamily: getHeroFontFamily(
                      aboutSettings.rekamJejakCarouselTitleFont || "poppins"
                    ),
                    fontSize: aboutSettings.rekamJejakCarouselTitleSize
                      ? `${aboutSettings.rekamJejakCarouselTitleSize}px`
                      : undefined,
                  }}
                >
                  {aboutSettings.rekamJejakCarouselTitle || "Tonggak Perjalanan CV. Indo Green Nature"}
                </h3>

                {/* Tombol Navigasi Manual Carousel (Desktop: di Header) */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => scrollTimeline("left")}
                    aria-label="Geser ke kiri"
                    className="w-8 h-8 rounded-[5px] bg-card-alt border border-primary/20 hover:border-primary text-foreground hover:text-primary flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTimeline("right")}
                    aria-label="Geser ke kanan"
                    className="w-8 h-8 rounded-[5px] bg-card-alt border border-primary/20 hover:border-primary text-foreground hover:text-primary flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="w-full overflow-hidden" ref={timelineEmblaRef}>
                <div className="flex -ml-4 py-2">
                  {displayMilestones.map((m, idx) => (
                    <div
                      key={`${m.year}-${idx}`}
                      className="min-w-0 shrink-0 grow-0 pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
                    >
                      <div
                        className="h-full flex flex-col p-4 rounded-[5px] border transition-all relative group select-none shadow-xs hover:shadow-md"
                        style={{
                          backgroundColor: aboutSettings.rekamJejakCardBg || undefined,
                          background: aboutSettings.rekamJejakCardBg || undefined,
                          borderColor:
                            aboutSettings.rekamJejakCardBorderColor || "color-mix(in srgb, var(--primary) 18%, transparent)",
                        }}
                      >
                        <span
                          className={cn(
                            "text-xl sm:text-2xl font-bold tracking-tight transition-transform duration-200 group-hover:scale-105 inline-block",
                            !aboutSettings.rekamJejakYearColor && "text-primary"
                          )}
                          style={{
                            color: aboutSettings.rekamJejakYearColor || undefined,
                          }}
                        >
                          {m.year}
                        </span>
                        <h4
                          className={cn(
                            "text-sm font-bold mt-1 leading-snug transition-colors",
                            !aboutSettings.rekamJejakCardTitleColor &&
                              "text-foreground group-hover:text-primary"
                          )}
                          style={{
                            color: aboutSettings.rekamJejakCardTitleColor || undefined,
                          }}
                        >
                          {m.title}
                        </h4>
                        <p
                          className={cn(
                            "text-xs mt-1.5 leading-relaxed font-normal whitespace-pre-line",
                            !aboutSettings.rekamJejakCardDescColor &&
                              "text-zinc-800 dark:text-zinc-200"
                          )}
                          style={{
                            color: aboutSettings.rekamJejakCardDescColor || undefined,
                          }}
                        >
                          {m.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tombol Navigasi Manual Carousel (Mobile: di Bawah Carousel) */}
              <div className="flex sm:hidden items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => scrollTimeline("left")}
                  aria-label="Geser ke kiri"
                  className="w-8 h-8 rounded-[5px] bg-card-alt border border-primary/20 hover:border-primary text-foreground hover:text-primary flex items-center justify-center transition-colors cursor-pointer shadow-xs active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTimeline("right")}
                  aria-label="Geser ke kanan"
                  className="w-8 h-8 rounded-[5px] bg-card-alt border border-primary/20 hover:border-primary text-foreground hover:text-primary flex items-center justify-center transition-colors cursor-pointer shadow-xs active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* ─── Garis Pembatas Prinsip Kerja ─── */}
          <div className="w-full border-t border-border" />

          {/* ─── 05. Nilai & Komitmen Perusahaan (Prinsip Kerja) ─── */}
          <section className="w-full flex flex-col gap-6" id="prinsip-kerja">
            <div
              className={cn(
                "flex flex-col gap-2",
                aboutSettings.prinsipKerjaAlign === "center"
                  ? "items-center text-center"
                  : aboutSettings.prinsipKerjaAlign === "right"
                  ? "items-end text-right"
                  : "items-start text-left"
              )}
            >
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase",
                  !aboutSettings.prinsipKerjaBadgeColor && "text-primary"
                )}
                style={{
                  color: aboutSettings.prinsipKerjaBadgeColor || undefined,
                }}
              >
                <Scale className="w-4 h-4" />
                <span>{aboutSettings.prinsipKerjaBadge || "Prinsip Kerja"}</span>
              </div>
              <h2
                className={cn(
                  "text-lg sm:text-2xl md:text-3xl font-bold tracking-tight",
                  !aboutSettings.prinsipKerjaTitleColor && "text-foreground",
                  getHeroFontClass(aboutSettings.prinsipKerjaTitleFont || "poppins")
                )}
                style={{
                  fontSize: aboutSettings.prinsipKerjaTitleSize
                    ? `clamp(18px, 4vw, ${aboutSettings.prinsipKerjaTitleSize}px)`
                    : undefined,
                  color: aboutSettings.prinsipKerjaTitleColor || undefined,
                }}
              >
                {aboutSettings.prinsipKerjaTitle || "Nilai & Komitmen CV. Indo Green Nature"}
              </h2>
              <p
                className={cn(
                  "text-xs sm:text-[13px] md:text-sm w-full leading-relaxed font-normal",
                  !aboutSettings.prinsipKerjaDescColor && "text-zinc-800 dark:text-zinc-200",
                  getHeroFontClass(aboutSettings.prinsipKerjaDescFont || "outfit")
                )}
                style={{
                  fontSize: aboutSettings.prinsipKerjaDescSize
                    ? `clamp(12px, 2.5vw, ${aboutSettings.prinsipKerjaDescSize}px)`
                    : undefined,
                  color: aboutSettings.prinsipKerjaDescColor || undefined,
                }}
              >
                {aboutSettings.prinsipKerjaDesc ||
                  "Integritas bisnis dan standar etika manufaktur yang selalu kami pertahankan untuk menjamin kepercayaan seluruh mitra usaha."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {(aboutSettings.prinsipKerjaItems && aboutSettings.prinsipKerjaItems.length > 0
                ? aboutSettings.prinsipKerjaItems
                : DEFAULT_ABOUT_SETTINGS.prinsipKerjaItems || []
              ).map((val, idx) => (
                <div
                  key={`${val.title}-${idx}`}
                  className={cn(
                    "flex flex-col p-4 sm:p-5 rounded-[5px] shadow-xs hover:shadow-md transition-all group",
                    !aboutSettings.prinsipKerjaCardBg && "bg-card-alt",
                    !aboutSettings.prinsipKerjaCardBorderColor &&
                      "border border-primary/20 hover:border-primary/50"
                  )}
                  style={{
                    backgroundColor: aboutSettings.prinsipKerjaCardBg || undefined,
                    borderColor: aboutSettings.prinsipKerjaCardBorderColor || undefined,
                    borderWidth: aboutSettings.prinsipKerjaCardBorderColor ? "1px" : undefined,
                    borderStyle: aboutSettings.prinsipKerjaCardBorderColor ? "solid" : undefined,
                  }}
                >
                  <h4
                    className={cn(
                      "text-xs sm:text-sm md:text-base font-bold transition-colors",
                      !aboutSettings.prinsipKerjaCardTitleColor && "text-foreground group-hover:text-primary",
                      getHeroFontClass(aboutSettings.prinsipKerjaCardTitleFont || "poppins")
                    )}
                    style={{
                      fontSize: aboutSettings.prinsipKerjaCardTitleSize
                        ? `clamp(13px, 2.8vw, ${aboutSettings.prinsipKerjaCardTitleSize}px)`
                        : undefined,
                      color: aboutSettings.prinsipKerjaCardTitleColor || undefined,
                    }}
                  >
                    {val.title}
                  </h4>
                  <p
                    className={cn(
                      "text-xs mt-1.5 sm:mt-2 leading-relaxed font-normal",
                      !aboutSettings.prinsipKerjaCardDescColor && "text-zinc-800 dark:text-zinc-200",
                      getHeroFontClass(aboutSettings.prinsipKerjaCardDescFont || "outfit")
                    )}
                    style={{
                      fontSize: aboutSettings.prinsipKerjaCardDescSize
                        ? `clamp(12px, 2.5vw, ${aboutSettings.prinsipKerjaCardDescSize}px)`
                        : undefined,
                      color: aboutSettings.prinsipKerjaCardDescColor || undefined,
                    }}
                  >
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Garis Pembatas Jangkauan Distribusi ─── */}
          <div className="w-full border-t border-border" />

          {/* ─── 06. Area Layanan Pasar Domestik & Internasional (Jangkauan Distribusi) ─── */}
          <section className="w-full flex flex-col gap-6" id="jangkauan-distribusi">
            <div
              className={cn(
                "flex flex-col gap-2",
                aboutSettings.distribusiAlign === "center"
                  ? "items-center text-center"
                  : aboutSettings.distribusiAlign === "right"
                  ? "items-end text-right"
                  : "items-start text-left"
              )}
            >
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase",
                  !aboutSettings.distribusiBadgeColor && "text-primary"
                )}
                style={{
                  color: aboutSettings.distribusiBadgeColor || undefined,
                }}
              >
                <Globe2 className="w-4 h-4" />
                <span>{aboutSettings.distribusiBadge || "Jangkauan Distribusi"}</span>
              </div>
              <h2
                className={cn(
                  "text-lg sm:text-2xl md:text-3xl font-bold tracking-tight",
                  !aboutSettings.distribusiTitleColor && "text-foreground",
                  getHeroFontClass(aboutSettings.distribusiTitleFont || "poppins")
                )}
                style={{
                  fontSize: aboutSettings.distribusiTitleSize
                    ? `clamp(18px, 4vw, ${aboutSettings.distribusiTitleSize}px)`
                    : undefined,
                  color: aboutSettings.distribusiTitleColor || undefined,
                }}
              >
                {aboutSettings.distribusiTitle || "Area Layanan Pasar Domestik & Internasional"}
              </h2>
              <p
                className={cn(
                  "text-xs sm:text-[13px] md:text-sm w-full leading-relaxed font-normal",
                  !aboutSettings.distribusiDescColor && "text-zinc-800 dark:text-zinc-200",
                  getHeroFontClass(aboutSettings.distribusiDescFont || "outfit")
                )}
                style={{
                  fontSize: aboutSettings.distribusiDescSize
                    ? `clamp(12px, 2.5vw, ${aboutSettings.distribusiDescSize}px)`
                    : undefined,
                  color: aboutSettings.distribusiDescColor || undefined,
                }}
              >
                {aboutSettings.distribusiDesc ||
                  "Menjangkau para pemilik brand, klinik, apotek, dan distributor di seluruh pelosok Indonesia hingga siap memenuhi pesanan pasar luar negeri."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pasar Domestik */}
              <div
                className={cn(
                  "flex flex-col justify-between p-6 sm:p-8 rounded-[5px] shadow-md transition-all",
                  !aboutSettings.distribusiCardBg && "bg-card-alt",
                  !aboutSettings.distribusiCardBorderColor && "border border-primary/20"
                )}
                style={{
                  backgroundColor: aboutSettings.distribusiCardBg || undefined,
                  borderColor: aboutSettings.distribusiCardBorderColor || undefined,
                  borderWidth: aboutSettings.distribusiCardBorderColor ? "1px" : undefined,
                  borderStyle: aboutSettings.distribusiCardBorderColor ? "solid" : undefined,
                }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span
                      className={cn(
                        "text-xs font-bold uppercase tracking-widest",
                        !aboutSettings.distribusiTagColor && "text-primary"
                      )}
                      style={{
                        color: aboutSettings.distribusiTagColor || undefined,
                      }}
                    >
                      {aboutSettings.distribusiDomestikTag || "JANGKAUAN NASIONAL"}
                    </span>
                    <h3
                      className={cn(
                        "text-base sm:text-xl font-bold",
                        !aboutSettings.distribusiCardTitleColor && "text-foreground",
                        getHeroFontClass(aboutSettings.distribusiCardTitleFont || "poppins")
                      )}
                      style={{
                        fontSize: aboutSettings.distribusiCardTitleSize
                          ? `clamp(16px, 3.5vw, ${aboutSettings.distribusiCardTitleSize}px)`
                          : undefined,
                        color: aboutSettings.distribusiCardTitleColor || undefined,
                      }}
                    >
                      {aboutSettings.distribusiDomestikTitle || "Pasar Domestik (Seluruh Indonesia)"}
                    </h3>
                  </div>

                  <p
                    className={cn(
                      "text-xs sm:text-sm leading-relaxed font-normal",
                      !aboutSettings.distribusiCardDescColor && "text-zinc-800 dark:text-zinc-200",
                      getHeroFontClass(aboutSettings.distribusiCardDescFont || "outfit")
                    )}
                    style={{
                      fontSize: aboutSettings.distribusiCardDescSize
                        ? `clamp(12px, 2.5vw, ${aboutSettings.distribusiCardDescSize}px)`
                        : undefined,
                      color: aboutSettings.distribusiCardDescColor || undefined,
                    }}
                  >
                    {aboutSettings.distribusiDomestikDesc ||
                      "Kami telah melayani pengiriman produk dan pendampingan maklon bagi mitra yang tersebar di 38 Provinsi di Indonesia. Rantai logistik kami terintegrasi dengan ekspedisi kargo darat, laut, dan udara untuk pengiriman tepat waktu."}
                  </p>

                  {/* City Badges */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(aboutSettings.distribusiDomestikCities && aboutSettings.distribusiDomestikCities.length > 0
                      ? aboutSettings.distribusiDomestikCities
                      : DEFAULT_ABOUT_SETTINGS.distribusiDomestikCities || []
                    ).map((city, idx) => (
                      <span
                        key={`${city}-${idx}`}
                        className={cn(
                          "px-3 py-1.5 rounded-[5px] text-xs font-semibold hover:border-primary/40 transition-colors",
                          !aboutSettings.distribusiCityBadgeBg && "bg-background",
                          !aboutSettings.distribusiCityBadgeColor && "text-foreground",
                          "border border-primary/15"
                        )}
                        style={{
                          backgroundColor: aboutSettings.distribusiCityBadgeBg || undefined,
                          color: aboutSettings.distribusiCityBadgeColor || undefined,
                        }}
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-primary/10 text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    {aboutSettings.distribusiDomestikFooter ||
                      "Mendukung ekspedisi kargo skala kecil, palet, hingga container penuh."}
                  </span>
                </div>
              </div>

              {/* Pasar Internasional */}
              <div
                className={cn(
                  "flex flex-col justify-between p-6 sm:p-8 rounded-[5px] shadow-md transition-all",
                  !aboutSettings.distribusiCardBg && "bg-card-alt",
                  !aboutSettings.distribusiCardBorderColor && "border border-primary/20"
                )}
                style={{
                  backgroundColor: aboutSettings.distribusiCardBg || undefined,
                  borderColor: aboutSettings.distribusiCardBorderColor || undefined,
                  borderWidth: aboutSettings.distribusiCardBorderColor ? "1px" : undefined,
                  borderStyle: aboutSettings.distribusiCardBorderColor ? "solid" : undefined,
                }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <span
                      className={cn(
                        "text-xs font-bold uppercase tracking-widest",
                        !aboutSettings.distribusiTagColor && "text-primary"
                      )}
                      style={{
                        color: aboutSettings.distribusiTagColor || undefined,
                      }}
                    >
                      {aboutSettings.distribusiEksporTag || "JANGKAUAN EKSPOR"}
                    </span>
                    <h3
                      className={cn(
                        "text-base sm:text-xl font-bold",
                        !aboutSettings.distribusiCardTitleColor && "text-foreground",
                        getHeroFontClass(aboutSettings.distribusiCardTitleFont || "poppins")
                      )}
                      style={{
                        fontSize: aboutSettings.distribusiCardTitleSize
                          ? `clamp(16px, 3.5vw, ${aboutSettings.distribusiCardTitleSize}px)`
                          : undefined,
                        color: aboutSettings.distribusiCardTitleColor || undefined,
                      }}
                    >
                      {aboutSettings.distribusiEksporTitle || "Pasar Internasional & Standar Ekspor"}
                    </h3>
                  </div>

                  <p
                    className={cn(
                      "text-xs sm:text-sm leading-relaxed font-normal",
                      !aboutSettings.distribusiCardDescColor && "text-zinc-800 dark:text-zinc-200",
                      getHeroFontClass(aboutSettings.distribusiCardDescFont || "outfit")
                    )}
                    style={{
                      fontSize: aboutSettings.distribusiCardDescSize
                        ? `clamp(12px, 2.5vw, ${aboutSettings.distribusiCardDescSize}px)`
                        : undefined,
                      color: aboutSettings.distribusiCardDescColor || undefined,
                    }}
                  >
                    {aboutSettings.distribusiEksporDesc ||
                      "Dengan standar ISO 22000, CPOTB, dan sertifikasi Halal bertaraf global, CV. Indo Green Nature siap memfasilitasi kebutuhan ekspor herbal ke negara-negara tetangga dan pasar dunia."}
                  </p>

                  {/* International Capabilities Points */}
                  <div className="flex flex-col gap-2.5 pt-1">
                    {(aboutSettings.distribusiEksporPoints && aboutSettings.distribusiEksporPoints.length > 0
                      ? aboutSettings.distribusiEksporPoints
                      : DEFAULT_ABOUT_SETTINGS.distribusiEksporPoints || []
                    ).map((doc, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-start gap-2.5 text-xs sm:text-sm",
                          !aboutSettings.distribusiCardDescColor && "text-zinc-800 dark:text-zinc-200"
                        )}
                        style={{
                          color: aboutSettings.distribusiCardDescColor || undefined,
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-primary/10 text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    {aboutSettings.distribusiEksporFooter ||
                      "Siap melayani kemitraan OEM/ODM bagi perusahaan dagang internasional."}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ─── 07. Legalitas & Standar Mutu Resmi ─── */}
          {(() => {
            const rawLegalitasItems =
              aboutSettings.legalitasItems && aboutSettings.legalitasItems.length > 0
                ? aboutSettings.legalitasItems
                : [
                    { imageUrl: "/images/legalitas/bpom.svg" },
                    { imageUrl: "/images/legalitas/halal.svg" },
                    { imageUrl: "/images/legalitas/cpotb.svg" },
                    { imageUrl: "/images/legalitas/iso22000.svg" },
                    { imageUrl: "/images/legalitas/haccp.svg" },
                  ]

            const isCarousel = Boolean(
              aboutSettings.legalitasEnableCarousel !== false || rawLegalitasItems.length > 5
            )

            // Gandakan item agar auto-slide infinite loop ke kiri berjalan mulus tanpa jeda
            const displayItems =
              isCarousel && rawLegalitasItems.length > 0
                ? rawLegalitasItems.length < 5
                  ? [
                      ...rawLegalitasItems,
                      ...rawLegalitasItems,
                      ...rawLegalitasItems,
                      ...rawLegalitasItems,
                    ]
                  : [
                      ...rawLegalitasItems,
                      ...rawLegalitasItems,
                      ...rawLegalitasItems,
                    ]
                : rawLegalitasItems

            return (
              <section
                id="legalitas"
                className="w-full flex flex-col gap-6 py-6 sm:py-8"
              >
                {/* Header Legalitas */}
                <div
                  className={cn(
                    "flex flex-col gap-2 w-full",
                    aboutSettings.legalitasAlign === "left"
                      ? "items-start text-left"
                      : aboutSettings.legalitasAlign === "right"
                      ? "items-end text-right"
                      : "items-center text-center mx-auto max-w-4xl lg:max-w-5xl"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] text-xs font-bold uppercase tracking-wider",
                      !aboutSettings.legalitasBadgeColor &&
                        "bg-primary/10 text-primary border border-primary/20"
                    )}
                    style={{
                      color: aboutSettings.legalitasBadgeColor || undefined,
                      borderColor: aboutSettings.legalitasBadgeColor
                        ? `${aboutSettings.legalitasBadgeColor}40`
                        : undefined,
                      backgroundColor: aboutSettings.legalitasBadgeColor
                        ? `${aboutSettings.legalitasBadgeColor}15`
                        : undefined,
                    }}
                  >
                    <BadgeCheck className="w-4 h-4" />
                    {aboutSettings.legalitasBadge || "Sertifikasi & Legalitas"}
                  </span>
                  <h3
                    className={cn(
                      "text-lg sm:text-2xl md:text-3xl font-bold tracking-tight max-w-4xl",
                      !aboutSettings.legalitasTitleColor && "text-foreground",
                      getHeroFontClass(aboutSettings.legalitasTitleFont || "poppins")
                    )}
                    style={{
                      fontSize: aboutSettings.legalitasTitleSize
                        ? `clamp(18px, 4vw, ${aboutSettings.legalitasTitleSize}px)`
                        : undefined,
                      color: aboutSettings.legalitasTitleColor || undefined,
                    }}
                  >
                    {aboutSettings.legalitasTitle || "Jaminan Legalitas & Mutu Bersertifikasi"}
                  </h3>
                  <p
                    className={cn(
                      "text-xs sm:text-[13px] md:text-sm font-normal max-w-4xl lg:max-w-5xl leading-relaxed",
                      !aboutSettings.legalitasDescColor && "text-zinc-800 dark:text-zinc-200",
                      getHeroFontClass(aboutSettings.legalitasDescFont || "outfit")
                    )}
                    style={{
                      fontSize: aboutSettings.legalitasDescSize
                        ? `clamp(12px, 2.5vw, ${aboutSettings.legalitasDescSize}px)`
                        : undefined,
                      color: aboutSettings.legalitasDescColor || undefined,
                    }}
                  >
                    {aboutSettings.legalitasDesc ||
                      "Seluruh fasilitas produksi kami terakreditasi resmi oleh instansi pemerintah dan badan sertifikasi independen."}
                  </p>
                </div>

                {/* Cards Container: Kotak 1:1, Tanpa Teks & Tanpa Deskripsi, Murni Foto Saja (3 Kolom di Mobile) */}
                {isCarousel ? (
                  <div className="relative w-full group">
                    {/* Tombol Navigasi Carousel (Rata Tengah / Center) */}
                    <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                      <button
                        type="button"
                        onClick={() => scrollLegalitas("left")}
                        className="w-8 h-8 rounded-[5px] border border-primary/20 bg-background/80 hover:bg-primary hover:text-white text-foreground flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                        aria-label="Sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollLegalitas("right")}
                        className="w-8 h-8 rounded-[5px] border border-primary/20 bg-background/80 hover:bg-primary hover:text-white text-foreground flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                        aria-label="Berikutnya"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="overflow-hidden" ref={legalitasEmblaRef}>
                      <div className="flex -ml-2 sm:-ml-4">
                        {displayItems.map((item, idx) => (
                          <div
                            key={`carousel-${idx}-${item.imageUrl}`}
                            className="flex-[0_0_33.3333%] sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_20%] min-w-0 pl-2 sm:pl-4"
                          >
                            <div
                              className="w-full aspect-square relative rounded-[8px] overflow-hidden p-2 sm:p-4 flex items-center justify-center transition-all hover:scale-[1.05] cursor-pointer"
                              style={{
                                backgroundColor:
                                  aboutSettings.legalitasCardBg &&
                                  aboutSettings.legalitasCardBg !== "transparent"
                                    ? aboutSettings.legalitasCardBg
                                    : "transparent",
                                borderColor:
                                  aboutSettings.legalitasCardBorderColor &&
                                  aboutSettings.legalitasCardBorderColor !== "transparent"
                                    ? aboutSettings.legalitasCardBorderColor
                                    : "transparent",
                                borderWidth:
                                  aboutSettings.legalitasCardBorderColor &&
                                  aboutSettings.legalitasCardBorderColor !== "transparent"
                                    ? "1px"
                                    : "0px",
                                borderStyle: "solid",
                                borderRadius: aboutSettings.legalitasCardRounded
                                  ? `${aboutSettings.legalitasCardRounded}px`
                                  : "8px",
                              }}
                            >
                              <img
                                src={item.imageUrl}
                                alt="Sertifikat Legalitas"
                                style={{
                                  ["--admin-scale" as any]: `${aboutSettings.legalitasImageScale ?? 65}%`,
                                }}
                                className={cn(
                                  "transition-all duration-200 w-[80%] h-[80%] sm:w-[var(--admin-scale)] sm:h-[var(--admin-scale)] max-w-full max-h-full",
                                  aboutSettings.legalitasCardFit === "cover"
                                    ? "object-cover"
                                    : "object-contain"
                                )}
                                loading="lazy"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "grid gap-2 sm:gap-4 w-full",
                      rawLegalitasItems.length === 1 && "grid-cols-1 max-w-xs mx-auto",
                      rawLegalitasItems.length === 2 && "grid-cols-2 max-w-md mx-auto",
                      rawLegalitasItems.length === 3 && "grid-cols-3 max-w-2xl mx-auto",
                      rawLegalitasItems.length === 4 && "grid-cols-2 sm:grid-cols-4 max-w-3xl mx-auto",
                      rawLegalitasItems.length >= 5 && "grid-cols-3 sm:grid-cols-3 lg:grid-cols-5"
                    )}
                  >
                    {rawLegalitasItems.map((item, idx) => (
                      <div
                        key={`grid-${idx}-${item.imageUrl}`}
                        className="w-full aspect-square relative rounded-[8px] overflow-hidden p-2 sm:p-4 flex items-center justify-center transition-all hover:scale-[1.05] cursor-pointer"
                        style={{
                          backgroundColor:
                            aboutSettings.legalitasCardBg &&
                            aboutSettings.legalitasCardBg !== "transparent"
                              ? aboutSettings.legalitasCardBg
                              : "transparent",
                          borderColor:
                            aboutSettings.legalitasCardBorderColor &&
                            aboutSettings.legalitasCardBorderColor !== "transparent"
                              ? aboutSettings.legalitasCardBorderColor
                              : "transparent",
                          borderWidth:
                            aboutSettings.legalitasCardBorderColor &&
                            aboutSettings.legalitasCardBorderColor !== "transparent"
                              ? "1px"
                              : "0px",
                          borderStyle: "solid",
                          borderRadius: aboutSettings.legalitasCardRounded
                            ? `${aboutSettings.legalitasCardRounded}px`
                            : "8px",
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt="Sertifikat Legalitas"
                          style={{
                            ["--admin-scale" as any]: `${aboutSettings.legalitasImageScale ?? 65}%`,
                          }}
                          className={cn(
                            "transition-all duration-200 w-[80%] h-[80%] sm:w-[var(--admin-scale)] sm:h-[var(--admin-scale)] max-w-full max-h-full",
                            aboutSettings.legalitasCardFit === "cover"
                              ? "object-cover"
                              : "object-contain"
                          )}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )
          })()}

          {/* ─── 08. CTA Banner (Mulai Konsultasi Brand) ─── */}
          <section
            id="konsultasi-brand"
            className={cn(
              "relative w-full rounded-[5px] overflow-hidden p-5 sm:p-10 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6",
              !aboutSettings.ctaCardBg && "bg-gradient-to-r from-[#143d23] via-[#1e5631] to-[#0e2a18]",
              !aboutSettings.ctaCardBorderColor && "border border-primary/40"
            )}
            style={{
              background: aboutSettings.ctaCardBg || undefined,
              borderColor: aboutSettings.ctaCardBorderColor || undefined,
              borderWidth: aboutSettings.ctaCardBorderColor ? "1px" : undefined,
              borderStyle: aboutSettings.ctaCardBorderColor ? "solid" : undefined,
            }}
          >
            <div className="flex flex-col gap-2 text-center md:text-left max-w-2xl">
              <h3
                className={cn(
                  "text-lg sm:text-2xl md:text-3xl font-bold",
                  !aboutSettings.ctaTitleColor && "text-white",
                  getHeroFontClass(aboutSettings.ctaTitleFont || "poppins")
                )}
                style={{
                  fontSize: aboutSettings.ctaTitleSize
                    ? `clamp(18px, 4vw, ${aboutSettings.ctaTitleSize}px)`
                    : undefined,
                  color: aboutSettings.ctaTitleColor || undefined,
                }}
              >
                {aboutSettings.ctaTitle || "Mulai Konsultasi Brand Herbal Anda Hari Ini"}
              </h3>
              <p
                className={cn(
                  "text-xs sm:text-[13px] md:text-sm leading-relaxed font-normal",
                  !aboutSettings.ctaDescColor && "text-emerald-100/90",
                  getHeroFontClass(aboutSettings.ctaDescFont || "outfit")
                )}
                style={{
                  fontSize: aboutSettings.ctaDescSize
                    ? `clamp(12px, 2.5vw, ${aboutSettings.ctaDescSize}px)`
                    : undefined,
                  color: aboutSettings.ctaDescColor || undefined,
                }}
              >
                {aboutSettings.ctaDesc ||
                  "Diskusikan rancangan formula, kemasan, estimasi biaya maklon, dan jadwal produksi bersama tim ahli CV. Indo Green Nature tanpa dipungut biaya."}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
              <a
                href={resolveAboutWhatsappUrl(aboutSettings.ctaWhatsappUrl || whatsappUrl)}
                target={resolveAboutWhatsappUrl(aboutSettings.ctaWhatsappUrl || whatsappUrl).startsWith("http") ? "_blank" : undefined}
                rel={resolveAboutWhatsappUrl(aboutSettings.ctaWhatsappUrl || whatsappUrl).startsWith("http") ? "noopener noreferrer" : undefined}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-6 py-2.5 sm:py-3.5 font-bold text-xs sm:text-sm md:text-base shadow-lg transition-all cursor-pointer w-full sm:w-auto text-center",
                  aboutSettings.ctaButtonFullRounded ? "rounded-full" : "rounded-[5px]",
                  !aboutSettings.ctaButtonBg && "bg-white hover:bg-emerald-50",
                  !aboutSettings.ctaButtonTextColor && "text-[#1e5631]"
                )}
                style={{
                  backgroundColor: aboutSettings.ctaButtonBg || undefined,
                  color: aboutSettings.ctaButtonTextColor || undefined,
                }}
              >
                <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">{aboutSettings.ctaWhatsappText || "WhatsApp Kami"}</span>
              </a>
              <Link
                href={aboutSettings.ctaSecondaryUrl || "/"}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-5 py-2.5 sm:py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm md:text-base border border-white/20 transition-all cursor-pointer w-full sm:w-auto text-center",
                  aboutSettings.ctaButtonFullRounded ? "rounded-full" : "rounded-[5px]"
                )}
              >
                <span className="truncate">{aboutSettings.ctaSecondaryText || "Kembali ke Beranda"}</span>
              </Link>
            </div>
          </section>

        </main>
      </div>

      {/* Pop Up Video Modal 16:9 */}
      {activeVideoModalUrl && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveVideoModalUrl(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-[5px] overflow-hidden shadow-2xl border border-white/10 flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#111827] border-b border-white/10 text-white">
              <span className="text-sm sm:text-base font-semibold truncate flex items-center gap-2">
                <Play className="w-4 h-4 text-red-600 fill-red-600" />
                {activeVideoModalTitle}
              </span>
              <button
                type="button"
                onClick={() => setActiveVideoModalUrl(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Tutup Video (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 16:9 Video Container */}
            <div className="relative w-full aspect-[16/9] bg-black">
              {(() => {
                const embedUrl = getEmbedVideoUrl(activeVideoModalUrl)
                const isEmbed = embedUrl?.includes("youtube.com/embed") || embedUrl?.includes("player.vimeo.com")
                if (isEmbed && embedUrl) {
                  return (
                    <iframe
                      src={embedUrl}
                      title={activeVideoModalTitle}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )
                }
                return (
                  <video
                    src={activeVideoModalUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  >
                    Browser Anda tidak mendukung pemutar video HTML5.
                  </video>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ─── Sidebar Pengaturan Desktop (Konsep Figma) ─── */}
      <AboutSettingsSidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        data={aboutSettings}
        onChange={setAboutSettings}
        onSave={handleSaveSettings}
        onReset={handleResetSettings}
        onScrollToSection={handleScrollToSection}
        isSaving={isSavingSettings}
      />
    </>
  )
}
