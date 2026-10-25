"use client"

import React, { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Star,
  Search,
  ShoppingBag,
  X,
  MapPin,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
  Award,
  Zap,
  BadgeCheck,
  Flame,
  ArrowUpDown,
  ArrowDownNarrowWide,
  ArrowDownWideNarrow,
} from "lucide-react"
import { poppins, getHeroFontFamily } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/loading-spinner"
import { OurProductsSettingsSidebar } from "@/components/our-products-settings-sidebar"
import {
  OurProductsSettingsData,
  ShopeeProductItem,
  DEFAULT_OUR_PRODUCTS_SETTINGS,
  OUR_PRODUCTS_SETTINGS_KEY,
  OUR_PRODUCTS_DRAFT_KEY,
  OUR_PRODUCTS_HAS_DRAFT_KEY,
  OUR_PRODUCTS_PREVIEW_CHANNEL,
  sanitizeOurProductsSettings,
  getInitialOurProductsSettings,
  fetchOurProductsSettings,
  saveOurProductsSettings,
  resetOurProductsSettings,
} from "@/lib/our-products-settings"
import { renderFormattedText } from "@/lib/home-blocks"

export default function OurProductsPage() {
  const [isClientMounted, setIsClientMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // Inisialisasi SSR stabil dengan DEFAULT_OUR_PRODUCTS_SETTINGS untuk mencegah Hydration Mismatch
  const [settings, setSettings] = useState<OurProductsSettingsData>(DEFAULT_OUR_PRODUCTS_SETTINGS)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  // State untuk Frame Daftar Produk Pilihan Kami (Katalog Produk) - Versi Clean
  const [sortOption, setSortOption] = useState<"terkait" | "terlaris" | "termurah" | "termahal">("terkait")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<ShopeeProductItem | null>(null)
  const [modalSlideIndex, setModalSlideIndex] = useState(0)
  const [isModalHovered, setIsModalHovered] = useState(false)
  const [marketplacePage, setMarketplacePage] = useState<0 | 1>(0)
  const [isMarketplaceHovered, setIsMarketplaceHovered] = useState(false)

  // Inisialisasi data dari Supabase/Cache & Cek Mode Pratinjau / Mode Edit
  useEffect(() => {
    setIsClientMounted(true)
    let isMounted = true

    const search = typeof window !== "undefined" ? window.location.search : ""
    const params = new URLSearchParams(search)
    const hasEdit =
      params.get("edit") === "true" ||
      params.get("settings") === "products" ||
      params.get("settings") === "our-products"
    const hasPrev = params.get("preview") === "true"

    if (hasEdit) {
      setIsSettingsOpen(true)
      setIsPreview(false)
    } else if (hasPrev) {
      setIsPreview(true)
      setIsSettingsOpen(false)
    }

    // Muat data draft dari cache lokal terlebih dahulu seketika setelah client mount
    try {
      const cached = getInitialOurProductsSettings()
      if (cached && isMounted) {
        setSettings(cached)
      }
    } catch {
      // ignore
    }

    const initData = async () => {
      const minTimer = new Promise((resolve) => setTimeout(resolve, 250))
      try {
        const remoteData = await fetchOurProductsSettings()
        if (isMounted) {
          const currentSearch = typeof window !== "undefined" ? window.location.search : ""
          const currentParams = new URLSearchParams(currentSearch)
          const isCurrentlyEdit =
            currentParams.get("edit") === "true" ||
            currentParams.get("settings") === "products" ||
            currentParams.get("settings") === "our-products"
          const isCurrentlyPrev = currentParams.get("preview") === "true"
          const hasLocalDraft =
            typeof window !== "undefined" &&
            (localStorage.getItem(OUR_PRODUCTS_HAS_DRAFT_KEY) === "true" ||
              Boolean(localStorage.getItem(OUR_PRODUCTS_DRAFT_KEY)))

          // Hanya ganti data dengan remoteData jika BUKAN mode edit/preview dan TIDAK ADA draft belum disimpan
          if (!isCurrentlyEdit && !isCurrentlyPrev && !hasLocalDraft) {
            setSettings(remoteData)
          }
        }
        await minTimer
      } catch (err) {
        console.warn("Gagal memuat pengaturan our products:", err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    initData()
    return () => {
      isMounted = false
    }
  }, [])

  // Event listener untuk membuka sidebar modal dari AdminFAB atau URL query
  useEffect(() => {
    const handleOpenSettings = () => {
      try {
        const draft =
          localStorage.getItem(OUR_PRODUCTS_DRAFT_KEY) ||
          localStorage.getItem(OUR_PRODUCTS_SETTINGS_KEY)
        if (draft) {
          setSettings(sanitizeOurProductsSettings(JSON.parse(draft)))
        }
      } catch {}
      setIsSettingsOpen(true)
    }

    window.addEventListener("open-our-products-settings", handleOpenSettings)

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const hasEdit =
        params.get("edit") === "true" ||
        params.get("settings") === "products" ||
        params.get("settings") === "our-products"
      const hasPrev = params.get("preview") === "true"

      if (hasEdit) {
        try {
          const draft =
            localStorage.getItem(OUR_PRODUCTS_DRAFT_KEY) ||
            localStorage.getItem(OUR_PRODUCTS_SETTINGS_KEY)
          if (draft) {
            setSettings(sanitizeOurProductsSettings(JSON.parse(draft)))
          }
        } catch {}
        setIsSettingsOpen(true)
        setIsPreview(false)
      } else if (hasPrev) {
        setIsPreview(true)
        setIsSettingsOpen(false)
      }
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("open-our-products-settings", handleOpenSettings)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  // Sinkronisasi Real-Time Lintas Tab via BroadcastChannel & Storage Event
  useEffect(() => {
    let bc: BroadcastChannel | null = null

    if (typeof BroadcastChannel !== "undefined") {
      try {
        bc = new BroadcastChannel(OUR_PRODUCTS_PREVIEW_CHANNEL)
        bc.onmessage = (event) => {
          if (event.data?.type === "PREVIEW_UPDATE" && event.data?.data) {
            setSettings(sanitizeOurProductsSettings(event.data.data))
          }
        }
      } catch {}
    }

    const handleStorage = (e: StorageEvent) => {
      if (
        (e.key === OUR_PRODUCTS_SETTINGS_KEY || e.key === OUR_PRODUCTS_DRAFT_KEY) &&
        e.newValue
      ) {
        try {
          setSettings(sanitizeOurProductsSettings(JSON.parse(e.newValue)))
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
      const res = await saveOurProductsSettings(settings)
      if (res.success) {
        setIsSettingsOpen(false)
      } else {
        alert(res.error || "Gagal menyimpan perubahan.")
      }
    } catch (err: any) {
      alert("Error: " + (err?.message || "Gagal menyimpan."))
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetSettings = async () => {
    if (confirm("Apakah Anda yakin ingin mengembalikan pengaturan Our Products ke default?")) {
      await resetOurProductsSettings()
      setSettings(DEFAULT_OUR_PRODUCTS_SETTINGS)
      setIsSettingsOpen(false)
    }
  }

  // Gandakan array gambar untuk infinite seamless loop tanpa putus
  const leftColImages = settings.slideImagesLeft || DEFAULT_OUR_PRODUCTS_SETTINGS.slideImagesLeft
  const rightColImages = settings.slideImagesRight || DEFAULT_OUR_PRODUCTS_SETTINGS.slideImagesRight
  const duplicatedLeft = [...leftColImages, ...leftColImages]
  const duplicatedRight = [...rightColImages, ...rightColImages]
  const animDuration = Math.max(8, settings.slideSpeed || 18)

  // ─── Filter & Sorting Produk Ala Shopee (Versi Clean) ───
  const rawProducts =
    settings.shopeeProducts && settings.shopeeProducts.length > 0
      ? settings.shopeeProducts
      : DEFAULT_OUR_PRODUCTS_SETTINGS.shopeeProducts

  const filteredProducts = rawProducts.filter((product) => {
    return (
      !searchQuery.trim() ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.tags &&
        product.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "termurah") return a.price - b.price
    if (sortOption === "termahal") return b.price - a.price
    if (sortOption === "terlaris") {
      const getNum = (str: string) => {
        const clean = str.replace(/[^\d.,]/g, "").replace(",", ".")
        const multiplier = str.toLowerCase().includes("rb")
          ? 1000
          : str.toLowerCase().includes("jt")
          ? 1000000
          : 1
        return (parseFloat(clean) || 0) * multiplier
      }
      return getNum(b.soldCount) - getNum(a.soldCount)
    }
    return 0 // default 'terkait'
  })

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num)
  }

  // Kumpulan foto produk yang dipilih untuk auto-slide di pop-up modal
  const modalPhotos = selectedProduct
    ? Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0
      ? selectedProduct.images
      : [selectedProduct.image]
    : []

  // Reset slide index ke 0 setiap kali modal produk dibuka atau berganti
  useEffect(() => {
    setModalSlideIndex(0)
    setMarketplacePage(0)
  }, [selectedProduct?.id])

  // Timer auto-slide galeri foto modal pop-up (berjalan setiap 3 detik saat tidak di-hover)
  useEffect(() => {
    if (!selectedProduct || modalPhotos.length <= 1 || isModalHovered) return
    const timer = setInterval(() => {
      setModalSlideIndex((prev) => (prev + 1) % modalPhotos.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [selectedProduct, modalPhotos.length, isModalHovered])

  // Timer auto-slide saluran pemesanan marketplace (berjalan setiap 3.5 detik saat tidak di-hover, selalu ke arah kiri)
  useEffect(() => {
    if (!selectedProduct || isMarketplaceHovered) return
    const timer = setInterval(() => {
      setMarketplacePage((prev) => (prev === 0 ? 1 : 0))
    }, 3500)
    return () => clearInterval(timer)
  }, [selectedProduct, isMarketplaceHovered])

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
          <LoadingSpinner text="Loading" />
        </div>
      )}

      <div
        suppressHydrationWarning
        className={cn(
          "w-full min-h-screen bg-background flex flex-col items-center overflow-x-hidden font-sans transition-colors duration-300",
          isLoading && "invisible",
          poppins.className
        )}
      >
        {/* Banner Indikator Mode Pratinjau (preview=true) */}
        {isPreview && (
          <div className="w-full bg-[#15803D] text-white py-2 px-4 sm:px-6 text-xs font-semibold flex items-center justify-between sticky top-[60px] z-40 shadow-sm border-b border-white/20 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>Mode Pratinjau Halaman Our Products Aktif</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[11px] opacity-90 hidden md:inline">
                Data pratinjau draft ditampilkan secara real-time
              </span>
              <button
                type="button"
                onClick={() => {
                  try {
                    const draft =
                      localStorage.getItem(OUR_PRODUCTS_DRAFT_KEY) ||
                      localStorage.getItem(OUR_PRODUCTS_SETTINGS_KEY)
                    if (draft) {
                      setSettings(sanitizeOurProductsSettings(JSON.parse(draft)))
                    }
                  } catch {}
                  setIsPreview(false)
                  setIsSettingsOpen(true)
                  if (typeof window !== "undefined") {
                    window.history.pushState({}, "", "/our-products?edit=true")
                  }
                }}
                className="px-3 py-1 bg-white text-[#15803D] hover:bg-emerald-50 rounded-[4px] text-[11px] transition-all cursor-pointer font-bold shadow-2xs flex items-center gap-1 active:scale-95"
              >
                <span>← Kembali ke Mode Edit</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    window.close()
                  } catch {}
                  window.location.href = "/our-products?edit=true"
                }}
                className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-[4px] text-[11px] transition-colors cursor-pointer font-medium"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        )}

        <main
          suppressHydrationWarning
          className="w-full max-w-[1440px] px-4 lg:px-[20px] pt-[10px] pb-16 flex flex-col relative"
        >
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 sm:gap-2 py-2 border-b border-primary/10 text-xs md:text-sm text-zinc-700 dark:text-zinc-300 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-primary font-semibold">Our Products</span>
          </div>

          {/* ─── FRAME BANNER OUR PRODUCTS ─── */}
          <section className="relative w-full flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-10 pt-1">
            {/* Bagian Kiri: Teks Judul, Subtitle, dan 4 Kotak Kartu Store (177px x 177px) */}
            <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left w-full">
              {/* Judul Utama (layer- : 48px Poppins bold #15803D) */}
              <h1
                className={cn(
                  "font-bold leading-[1.15] tracking-tight text-center lg:text-left",
                  !settings.bannerTitleColor && "text-[#15803D]"
                )}
                style={{
                  fontFamily: getHeroFontFamily(settings.bannerTitleFont || "poppins"),
                  color: settings.bannerTitleColor || "#15803D",
                  fontSize: settings.bannerTitleSize ? `clamp(20px, 5vw, ${settings.bannerTitleSize}px)` : undefined,
                }}
              >
                {renderFormattedText(settings.bannerTitle || "Lebih Dari 10.000 + Produk Terjual")}
              </h1>

              {/* Subtitle (layer--2 : 24px Poppins bold #15803D) */}
              <p
                className={cn(
                  "font-bold leading-snug mt-2 sm:mt-3 tracking-tight text-center lg:text-left",
                  !settings.bannerSubtitleColor && "text-[#15803D]"
                )}
                style={{
                  fontFamily: getHeroFontFamily(settings.bannerSubtitleFont || "poppins"),
                  color: settings.bannerSubtitleColor || "#15803D",
                  fontSize: settings.bannerSubtitleSize ? `clamp(14px, 3.2vw, ${settings.bannerSubtitleSize}px)` : undefined,
                }}
              >
                {renderFormattedText(settings.bannerSubtitle || "Mulai Belanja di Official Store Kami")}
              </p>

              {/* Deskripsi Tambahan Banner (Opsional) */}
              {settings.bannerDescription && (
                <p
                  className="mt-2 text-xs sm:text-sm max-w-[620px] leading-relaxed opacity-90 text-center lg:text-left mx-auto lg:mx-0"
                  style={{
                    fontFamily: getHeroFontFamily(settings.bannerDescFont || "poppins"),
                    color: settings.bannerDescColor || undefined,
                    fontSize: settings.bannerDescSize ? `clamp(12px, 2.5vw, ${settings.bannerDescSize}px)` : undefined,
                  }}
                >
                  {renderFormattedText(settings.bannerDescription)}
                </p>
              )}

              {/* 4 Kartu Official Store - Ukuran Dinamis (storeCardSize), Full Rounded, Polosan Gambar Saja Tanpa Stroke & Shadow */}
              <div className="flex items-center justify-center lg:justify-start flex-wrap gap-2.5 sm:gap-3.5 md:gap-4 mt-4 sm:mt-6 w-full max-w-[760px]">
                {settings.storeCards.map((card, idx) => {
                  const cardSize = settings.storeCardSize || 125
                  return (
                    <a
                      key={card.id || idx}
                      href={card.link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={card.title || "Official Store"}
                      style={{
                        width: `clamp(68px, 18vw, ${cardSize}px)`,
                        height: `clamp(68px, 18vw, ${cardSize}px)`,
                      }}
                      className="aspect-square rounded-full overflow-hidden relative group shadow-none hover:shadow-none transition-transform duration-300 hover:scale-105 bg-transparent cursor-pointer select-none shrink-0 block"
                    >
                      {/* Polosan Gambar Saja Tanpa Stroke */}
                      <Image
                        src={card.image}
                        alt={card.title || "Official Store"}
                        fill
                        unoptimized
                        loading={idx < 4 ? "eager" : "lazy"}
                        sizes={`${cardSize}px`}
                        className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-full"
                      />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Bagian Kanan: Frame Auto-Slide (453px x 329px) dengan Background Transparan */}
            <div className="w-full lg:w-[453px] shrink-0 flex justify-center lg:justify-end">
              <div
                className="w-full max-w-[453px] h-[260px] sm:h-[330px] rounded-[14px] bg-transparent border-0 shadow-none relative overflow-hidden flex justify-center gap-2.5 sm:gap-[20px] p-0"
              >
                {/* Mask Fade Halus Atas & Bawah agar Foto Masuk & Keluar Terlihat Lembut */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-background via-background/60 to-transparent z-10" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />

                {/* ─── Kolom 1 (Kiri): AUTO SLIDE NAIK KE ATAS (rectangle-10, rectangle-6, rectangle-8: 197x197) ─── */}
                <div className="w-[145px] sm:w-[197px] overflow-hidden flex flex-col">
                  <motion.div
                    animate={{ y: ["0%", "-50%"] }}
                    transition={{
                      y: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: animDuration,
                        ease: "linear",
                      },
                    }}
                    className="flex flex-col gap-2.5 sm:gap-[20px]"
                  >
                    {duplicatedLeft.map((imgUrl, i) => {
                      const isAboveFold = imgUrl === leftColImages[0] || imgUrl === leftColImages[1] || i < 2;
                      return (
                        <div
                          key={`left-${i}`}
                          className="w-[145px] sm:w-[197px] h-[145px] sm:h-[197px] shrink-0 rounded-[10px] overflow-hidden shadow-sm border border-border/50 relative group bg-card"
                        >
                          <Image
                            src={imgUrl}
                            alt={`Produk IGN ${i + 1}`}
                            fill
                            sizes="(max-width: 640px) 145px, 197px"
                            unoptimized
                            priority={isAboveFold}
                            loading={isAboveFold ? "eager" : "lazy"}
                            fetchPriority={isAboveFold ? "high" : "auto"}
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      );
                    })}
                  </motion.div>
                </div>

                {/* ─── Kolom 2 (Kanan): AUTO SLIDE TURUN KE BAWAH (rectangle-11, rectangle-7, rectangle-9: 197x197) ─── */}
                <div className="w-[145px] sm:w-[197px] overflow-hidden flex flex-col">
                  <motion.div
                    animate={{ y: ["-50%", "0%"] }}
                    transition={{
                      y: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: animDuration,
                        ease: "linear",
                      },
                    }}
                    className="flex flex-col gap-2.5 sm:gap-[20px]"
                  >
                    {duplicatedRight.map((imgUrl, i) => {
                      const isAboveFold = imgUrl === rightColImages[0] || imgUrl === rightColImages[1] || i < 2;
                      return (
                        <div
                          key={`right-${i}`}
                          className="w-[145px] sm:w-[197px] h-[145px] sm:h-[197px] shrink-0 rounded-[10px] overflow-hidden shadow-sm border border-border/50 relative group bg-card"
                        >
                          <Image
                            src={imgUrl}
                            alt={`Produk IGN ${i + 1}`}
                            fill
                            sizes="(max-width: 640px) 145px, 197px"
                            unoptimized
                            priority={isAboveFold}
                            loading={isAboveFold ? "eager" : "lazy"}
                            fetchPriority={isAboveFold ? "high" : "auto"}
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* Garis Pemisah (.line : 1px solid #000000 / border-border) */}
          <div className="w-full border-t border-black/15 dark:border-white/15 mt-10 sm:mt-12" />

          {/* ─── FRAME DAFTAR PRODUK 6 KOLOM ALA SHOPEE ─── */}
          <section className="w-full mt-8 sm:mt-10 flex flex-col gap-6" id="katalog-produk">
            {/* Header Frame Produk */}
            {/* Header Frame Produk (Clean & Rapi) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="text-center md:text-left">
                <h2
                  className={cn(
                    "font-extrabold tracking-tight text-center md:text-left",
                    !settings.shopeeSectionTitleSize && "text-lg sm:text-2xl md:text-3xl",
                    !settings.shopeeSectionTitleColor && "text-[#15803D] dark:text-emerald-400"
                  )}
                  style={{
                    fontFamily: getHeroFontFamily(settings.shopeeSectionTitleFont || "poppins"),
                    color: settings.shopeeSectionTitleColor || undefined,
                    fontSize: settings.shopeeSectionTitleSize ? `clamp(16px, 3.8vw, ${settings.shopeeSectionTitleSize}px)` : undefined,
                  }}
                >
                  {renderFormattedText(settings.shopeeSectionTitle || "DAFTAR PRODUK KAMI")}
                </h2>
                <p
                  className={cn(
                    "mt-1 max-w-2xl text-center md:text-left mx-auto md:mx-0",
                    !settings.shopeeSectionSubtitleSize && "text-xs sm:text-sm",
                    !settings.shopeeSectionSubtitleColor && "text-muted-foreground"
                  )}
                  style={{
                    fontFamily: getHeroFontFamily(settings.shopeeSectionSubtitleFont || "poppins"),
                    color: settings.shopeeSectionSubtitleColor || undefined,
                    fontSize: settings.shopeeSectionSubtitleSize ? `clamp(11px, 2.5vw, ${settings.shopeeSectionSubtitleSize}px)` : undefined,
                  }}
                >
                  {renderFormattedText(
                    settings.shopeeSectionSubtitle ||
                      "Produk herbal alami terlaris berstandar BPOM & Halal resmi siap kirim ke seluruh Indonesia."
                  )}
                </p>
              </div>

              {/* Bar Pencarian Produk Minimalis */}
              <div className="relative w-full md:w-72 shrink-0">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="search-product"
                  name="search_product"
                  type="search"
                  autoComplete="off"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk herbal..."
                  aria-label="Cari produk herbal"
                  className="w-full pl-8 pr-8 py-2 rounded-[6px] border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Bar Urutkan Ala Shopee (Clean & Rapi, 1 Baris di Mobile dengan Icon) */}
            <div className="bg-card/70 border border-border/80 rounded-[6px] p-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-3 text-xs overflow-x-auto">
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <span className="hidden sm:flex items-center gap-1 text-muted-foreground text-[11px] font-medium mr-1 shrink-0">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Urutkan:
                </span>

                {/* Terkait */}
                <button
                  type="button"
                  onClick={() => setSortOption("terkait")}
                  title="Terkait"
                  className={cn(
                    "flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-[4px] font-medium transition-colors cursor-pointer shrink-0 text-xs",
                    sortOption === "terkait"
                      ? "bg-[#15803D] text-white font-semibold shadow-xs"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  )}
                >
                  <ArrowUpDown className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Terkait</span>
                </button>

                {/* Terlaris */}
                <button
                  type="button"
                  onClick={() => setSortOption("terlaris")}
                  title="Terlaris"
                  className={cn(
                    "flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-[4px] font-medium transition-colors cursor-pointer shrink-0 text-xs",
                    sortOption === "terlaris"
                      ? "bg-[#15803D] text-white font-semibold shadow-xs"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  )}
                >
                  <Flame className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Terlaris</span>
                </button>

                {/* Harga: Rendah ke Tinggi */}
                <button
                  type="button"
                  onClick={() => setSortOption("termurah")}
                  title="Harga: Rendah ke Tinggi"
                  className={cn(
                    "flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-[4px] font-medium transition-colors cursor-pointer shrink-0 text-xs",
                    sortOption === "termurah"
                      ? "bg-[#15803D] text-white font-semibold shadow-xs"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  )}
                >
                  <ArrowDownNarrowWide className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Harga: Rendah ke Tinggi</span>
                </button>

                {/* Harga: Tinggi ke Rendah */}
                <button
                  type="button"
                  onClick={() => setSortOption("termahal")}
                  title="Harga: Tinggi ke Rendah"
                  className={cn(
                    "flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-[4px] font-medium transition-colors cursor-pointer shrink-0 text-xs",
                    sortOption === "termahal"
                      ? "bg-[#15803D] text-white font-semibold shadow-xs"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  )}
                >
                  <ArrowDownWideNarrow className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Harga: Tinggi ke Rendah</span>
                </button>
              </div>

              <div className="text-[11px] text-muted-foreground font-medium shrink-0 ml-auto whitespace-nowrap pl-1">
                <span className="hidden sm:inline">Menampilkan </span>
                <span className="font-bold text-foreground">{sortedProducts.length}</span>
                <span className="text-[10px] sm:text-[11px]"> produk</span>
              </div>
            </div>

            {/* ─── GRID 6 KOLOM ALA SHOPEE ─── */}
            {sortedProducts.length === 0 ? (
              <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-card rounded-[8px] border border-border">
                <ShoppingBag className="w-12 h-12 text-muted-foreground/40 mb-3" />
                <h3 className="text-base font-bold text-foreground">Tidak Ada Produk yang Ditemukan</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Coba kata kunci pencarian lain.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-4 py-1.5 rounded-[5px] bg-[#15803D] text-white text-xs font-semibold cursor-pointer"
                >
                  Tampilkan Semua Produk
                </button>
              </div>
            ) : (
              <div
                className={cn(
                  "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3",
                  settings.shopeeGridColumns === 4 && "lg:grid-cols-4 xl:grid-cols-4",
                  settings.shopeeGridColumns === 5 && "lg:grid-cols-4 xl:grid-cols-5",
                  (!settings.shopeeGridColumns || settings.shopeeGridColumns === 6) && "lg:grid-cols-5 xl:grid-cols-6"
                )}
              >
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="group bg-card text-card-foreground rounded-[6px] border border-border/80 hover:border-[#15803D] hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer relative hover:-translate-y-1 select-none"
                  >
                    {/* Wadah Foto Produk 1:1 Aspect Square */}
                    <div className="relative aspect-square w-full overflow-hidden bg-muted/40">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Badge Display Fleksibel (Official Shop, Star+, Best Seller, dll) */}
                      {product.badge && product.badge.trim() !== "" && (
                        <div className="absolute top-1.5 left-0 z-10">
                          <span
                            className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-r-[3px] shadow-xs uppercase tracking-wider flex items-center gap-0.5"
                            style={{
                              backgroundColor:
                                product.badgeBgColor ||
                                (product.badge.toLowerCase().includes("official")
                                  ? "#D0011B"
                                  : product.badge.toLowerCase().includes("star")
                                  ? "#EE4D2D"
                                  : product.badge.toLowerCase().includes("best") || product.badge.toLowerCase().includes("terlaris")
                                  ? "#15803D"
                                  : product.badge.toLowerCase().includes("deal") || product.badge.toLowerCase().includes("hot")
                                  ? "#9333EA"
                                  : product.badge.toLowerCase().includes("baru") || product.badge.toLowerCase().includes("new")
                                  ? "#2563EB"
                                  : "#15803D"),
                              color: product.badgeTextColor || "#FFFFFF",
                            }}
                          >
                            {product.badge.toLowerCase().includes("star") ? (
                              <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300 shrink-0" />
                            ) : product.badge.toLowerCase().includes("official") ? (
                              <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                            ) : product.badge.toLowerCase().includes("deal") || product.badge.toLowerCase().includes("hot") ? (
                              <Flame className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                            ) : product.badge.toLowerCase().includes("best") || product.badge.toLowerCase().includes("terlaris") ? (
                              <Award className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                            ) : product.badge.toLowerCase().includes("baru") || product.badge.toLowerCase().includes("new") ? (
                              <Zap className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                            ) : null}
                            <span>{product.badge}</span>
                          </span>
                        </div>
                      )}

                      {/* Tag Diskon Shopee (Top-Right: Kuning Khas Shopee) */}
                      {product.discount && (
                        <div className="absolute top-0 right-0 z-10 bg-[#FFE880] text-[#EE4D2D] px-1.5 py-0.5 rounded-bl-[4px] text-center shadow-xs flex flex-col items-center leading-none">
                          <span className="text-[10px] font-extrabold">{product.discount}</span>
                          <span className="text-[7px] font-bold uppercase text-zinc-800">OFF</span>
                        </div>
                      )}
                    </div>

                    {/* Deskripsi & Harga Produk */}
                    <div className="p-2 sm:p-2.5 flex flex-col flex-1 justify-between gap-1.5">
                      {/* Judul Produk (Maks 2 Baris Clamp) */}
                      <h3 className="line-clamp-2 text-xs sm:text-[13px] font-medium leading-[1.3] text-foreground group-hover:text-[#15803D] transition-colors min-h-[32px]">
                        {product.name}
                      </h3>

                      {/* Voucher & Label Khusus Ala Shopee (Cashback Xtra & Gratis Ongkir Dinamis) */}
                      {(() => {
                        const hasCashback =
                          product.isCashbackXtra !== undefined
                            ? product.isCashbackXtra
                            : Boolean(product.tags?.some((t) => t.toLowerCase().includes("cashback")))
                        const hasGratisOngkir =
                          product.isGratisOngkir !== undefined
                            ? product.isGratisOngkir
                            : Boolean(product.tags?.some((t) => t.toLowerCase().includes("ongkir")))
                        const customTags = (product.tags || []).filter(
                          (t) =>
                            !t.toLowerCase().includes("cashback") &&
                            !t.toLowerCase().includes("ongkir")
                        )

                        if (!hasCashback && !hasGratisOngkir && customTags.length === 0) {
                          return null
                        }

                        return (
                          <div className="flex flex-wrap items-center gap-1">
                            {hasCashback && (
                              <span className="text-[9px] font-semibold px-1 py-0.5 rounded-[2px] border border-[#EE4D2D]/60 text-[#EE4D2D] bg-[#EE4D2D]/5 leading-none">
                                Cashback Xtra
                              </span>
                            )}
                            {hasGratisOngkir && (
                              <span className="text-[9px] font-semibold px-1 py-0.5 rounded-[2px] border border-[#00897B]/60 dark:border-[#26A69A]/60 text-[#00897B] dark:text-[#26A69A] bg-[#00897B]/5 dark:bg-[#26A69A]/10 leading-none">
                                Gratis Ongkir
                              </span>
                            )}
                            {customTags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[9px] font-semibold px-1 py-0.5 rounded-[2px] border border-[#00897B]/60 dark:border-[#26A69A]/60 text-[#00897B] dark:text-[#26A69A] bg-[#00897B]/5 dark:bg-[#26A69A]/10 leading-none"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )
                      })()}

                      {/* Baris Harga Ala Shopee (Warna Orange) */}
                      <div className="mt-0.5">
                        {product.originalPrice ? (
                          <div className="flex items-center gap-1.5 leading-none">
                            <span className="text-[10px] text-muted-foreground line-through">
                              {formatRupiah(product.originalPrice)}
                            </span>
                            {product.discount && product.discount.trim() !== "" && (
                              <span className="text-[8.5px] font-bold text-[#EE4D2D] leading-none -translate-y-[0.5px]">
                                {product.discount}
                              </span>
                            )}
                          </div>
                        ) : product.discount && product.discount.trim() !== "" ? (
                          <div className="leading-none">
                            <span className="text-[8.5px] font-bold text-[#EE4D2D] leading-none -translate-y-[0.5px]">
                              {product.discount}
                            </span>
                          </div>
                        ) : null}
                        <div className="text-xs sm:text-sm md:text-base font-bold text-[#EE4D2D] dark:text-[#FF5722]">
                          {formatRupiah(product.price)}
                        </div>
                      </div>

                      {/* Rating & Terjual (Sejajar Sempurna) */}
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-muted-foreground pt-1">
                        <div className="inline-flex items-center gap-1">
                          <Star className="w-3 h-3 shrink-0 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-foreground text-[11px] leading-none">
                            {product.rating ? Number(product.rating).toFixed(1) : "4.9"}
                          </span>
                        </div>
                        <span className="text-[10px] leading-none">{product.soldCount}</span>
                      </div>

                      {/* Footer Lokasi Shopee */}
                      <div className="pt-1.5 border-t border-border/40 text-[10px] text-muted-foreground flex items-center justify-between">
                        <div className="flex items-center gap-0.5 truncate text-[10px]">
                          <MapPin className="w-2.5 h-2.5 shrink-0 text-muted-foreground/70" />
                          <span className="truncate">{product.location || "D.I. Yogyakarta"}</span>
                        </div>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-[#15803D] group-hover:text-[#EE4D2D] transition-colors shrink-0">
                          <span>Detail</span>
                          <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ─── MODAL DETAIL PRODUK & QUICK ORDER (PORTAL KE BODY) ─── */}
          {isClientMounted && selectedProduct && typeof document !== "undefined" && createPortal(
            <div
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 pt-[68px] sm:pt-[76px] pb-4 animate-in fade-in duration-200 overflow-y-auto"
              onClick={() => setSelectedProduct(null)}
            >
              <div
                className="w-full max-w-2xl md:max-w-3xl lg:max-w-[900px] xl:max-w-[940px] bg-card rounded-[16px] sm:rounded-[20px] border border-border shadow-2xl overflow-y-auto md:overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-200 md:min-h-[580px] lg:min-h-[610px] max-h-[calc(100vh-84px)] md:max-h-[600px] lg:max-h-[630px]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Tombol Tutup Modal */}
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-background/85 hover:bg-background border border-border flex items-center justify-center text-foreground hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
                  aria-label="Tutup Detail Produk"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* ─── SISI KIRI: WADAH FOTO 1:1 KOMPAK ALA SHOPEE ─── */}
                <div className="w-full md:w-[350px] lg:w-[380px] xl:w-[400px] shrink-0 bg-transparent flex flex-col items-center justify-center p-3 sm:p-5.5 lg:p-6 border-b md:border-b-0 md:border-r border-border/60">
                  {/* Foto Utama 1:1 Presisi (Square) */}
                  <div
                    className="w-full aspect-square relative rounded-[12px] overflow-hidden bg-transparent select-none group/slider"
                    onMouseEnter={() => setIsModalHovered(true)}
                    onMouseLeave={() => setIsModalHovered(false)}
                  >
                    {/* Gambar Auto-Slide dengan Animasi Fade/Scale Halus */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={modalSlideIndex}
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute inset-0 w-full h-full"
                      >
                        <Image
                          src={modalPhotos[modalSlideIndex] || selectedProduct.image}
                          alt={`${selectedProduct.name} - Foto ${modalSlideIndex + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 380px, 400px"
                          className="object-cover"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Badge Display Modal (Pojok Kiri Atas) */}
                    {selectedProduct.badge && selectedProduct.badge.trim() !== "" && (
                      <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                        <span
                          className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-[4px] shadow-md uppercase tracking-wider flex items-center gap-1"
                          style={{
                            backgroundColor:
                              selectedProduct.badgeBgColor ||
                              (selectedProduct.badge.toLowerCase().includes("official")
                                ? "#D0011B"
                                : selectedProduct.badge.toLowerCase().includes("star")
                                ? "#EE4D2D"
                                : selectedProduct.badge.toLowerCase().includes("best") || selectedProduct.badge.toLowerCase().includes("terlaris")
                                ? "#15803D"
                                : selectedProduct.badge.toLowerCase().includes("deal") || selectedProduct.badge.toLowerCase().includes("hot")
                                ? "#9333EA"
                                : selectedProduct.badge.toLowerCase().includes("baru") || selectedProduct.badge.toLowerCase().includes("new")
                                ? "#2563EB"
                                : "#15803D"),
                            color: selectedProduct.badgeTextColor || "#FFFFFF",
                          }}
                        >
                          {selectedProduct.badge.toLowerCase().includes("star") ? (
                            <Star className="w-3 h-3 fill-amber-300 text-amber-300 shrink-0" />
                          ) : selectedProduct.badge.toLowerCase().includes("official") ? (
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                          ) : selectedProduct.badge.toLowerCase().includes("deal") || selectedProduct.badge.toLowerCase().includes("hot") ? (
                            <Flame className="w-3 h-3 text-amber-300 shrink-0" />
                          ) : selectedProduct.badge.toLowerCase().includes("best") || selectedProduct.badge.toLowerCase().includes("terlaris") ? (
                            <Award className="w-3 h-3 text-amber-300 shrink-0" />
                          ) : selectedProduct.badge.toLowerCase().includes("baru") || selectedProduct.badge.toLowerCase().includes("new") ? (
                            <Zap className="w-3 h-3 text-amber-300 shrink-0" />
                          ) : null}
                          <span>{selectedProduct.badge}</span>
                        </span>
                      </div>
                    )}

                    {/* Diskon Shopee (Pojok Kanan Atas) */}
                    {selectedProduct.discount && (
                      <div className="absolute top-2.5 right-2.5 z-20 bg-[#FFE880] text-[#EE4D2D] px-2 py-0.5 rounded-[4px] font-extrabold text-[11px] sm:text-xs shadow-md pointer-events-none">
                        {selectedProduct.discount} OFF
                      </div>
                    )}

                    {/* Navigasi Kiri / Kanan & Indikator Titik (Jika foto > 1) */}
                    {modalPhotos.length > 1 && (
                      <>
                        {/* Tombol Panah Kiri Transparan */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setModalSlideIndex((prev) => (prev - 1 + modalPhotos.length) % modalPhotos.length)
                          }}
                          className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-transparent hover:bg-black/20 text-white flex items-center justify-center transition-all opacity-90 sm:opacity-0 group-hover/slider:opacity-100 cursor-pointer drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:scale-110 active:scale-95"
                          title="Foto Sebelumnya"
                        >
                          <ChevronLeft className="w-5 h-5 drop-shadow-md" />
                        </button>

                        {/* Tombol Panah Kanan Transparan */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setModalSlideIndex((prev) => (prev + 1) % modalPhotos.length)
                          }}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-transparent hover:bg-black/20 text-white flex items-center justify-center transition-all opacity-90 sm:opacity-0 group-hover/slider:opacity-100 cursor-pointer drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:scale-110 active:scale-95"
                          title="Foto Selanjutnya"
                        >
                          <ChevronRight className="w-5 h-5 drop-shadow-md" />
                        </button>

                        {/* Deretan Thumbnail Mini di Dalam Frame Bawah Kiri (Khusus Mobile agar Kompak) */}
                        <div className="sm:hidden absolute bottom-2 left-2 z-20 flex items-center gap-1.5 p-0.5 rounded-[7px] max-w-[calc(100%-20px)] overflow-x-auto scrollbar-none">
                          {modalPhotos.map((photo, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setModalSlideIndex(i)
                              }}
                              className={cn(
                                "w-7 h-7 rounded-[4px] overflow-hidden relative shrink-0 border transition-all cursor-pointer bg-card/60 shadow-xs",
                                modalSlideIndex === i
                                  ? "border-[#EE4D2D] ring-1.5 ring-[#EE4D2D] shadow-md scale-105"
                                  : "border-white/60 opacity-75 hover:opacity-100"
                              )}
                              title={`Lihat foto ${i + 1}`}
                            >
                              <Image
                                src={photo}
                                alt={`Thumbnail ${i + 1}`}
                                fill
                                sizes="28px"
                                className="object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Deretan Thumbnail Foto Ala Shopee di Bawah Foto Utama (Tablet & Desktop) */}
                  {modalPhotos.length > 1 && (
                    <div className="hidden sm:flex w-full items-center justify-center gap-2 sm:gap-2.5 mt-3.5 overflow-x-auto py-1.5 px-1.5 scrollbar-none">
                      {modalPhotos.map((photo, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setModalSlideIndex(i)}
                          className={cn(
                            "w-12 h-12 sm:w-[52px] sm:h-[52px] lg:w-14 lg:h-14 rounded-[7px] overflow-hidden relative shrink-0 border-2 transition-all cursor-pointer bg-muted/40",
                            modalSlideIndex === i
                              ? "border-[#EE4D2D] ring-2 ring-[#EE4D2D]/40 ring-offset-1 dark:ring-offset-zinc-900 shadow-sm"
                              : "border-border/70 opacity-70 hover:opacity-100 hover:border-foreground/40"
                          )}
                          title={`Lihat foto ${i + 1}`}
                        >
                          <Image
                            src={photo}
                            alt={`Thumbnail ${i + 1}`}
                            fill
                            sizes="60px"
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Informasi & CTA Pemesanan (Kompak, Rapi & Nyaman) */}
                <div className="p-5 sm:p-6 lg:p-7 flex-1 flex flex-col justify-between overflow-y-auto min-h-0 max-h-[calc(100vh-84px)] md:max-h-[600px] lg:max-h-[630px]">
                  <div>
                    <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#15803D] dark:text-emerald-400">
                      {selectedProduct.category}
                    </div>
                    <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-foreground mt-1 leading-snug">
                      {selectedProduct.name}
                    </h2>

                    {/* Rating, Terjual & Lokasi */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs text-muted-foreground mt-2">
                      <div className="inline-flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 shrink-0 fill-amber-400 text-amber-400" />
                        <span className="leading-none text-foreground font-semibold">
                          {selectedProduct.rating ? Number(selectedProduct.rating).toFixed(1) : "4.9"}
                        </span>
                      </div>
                      <span>•</span>
                      <span className="text-foreground font-semibold">{selectedProduct.soldCount}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-foreground font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-foreground" />
                        <span>{selectedProduct.location || "D.I. Yogyakarta"}</span>
                      </div>
                    </div>

                    {/* Harga Ala Shopee (Warna Orange) */}
                    <div className="mt-3.5 sm:mt-4 p-3.5 sm:p-4 rounded-[10px] bg-muted/40 border border-border/60">
                      {selectedProduct.originalPrice ? (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs sm:text-sm text-muted-foreground line-through">
                            {formatRupiah(selectedProduct.originalPrice)}
                          </span>
                          {selectedProduct.discount && selectedProduct.discount.trim() !== "" && (
                            <span className="text-[11px] sm:text-xs font-bold text-[#EE4D2D] leading-none -translate-y-[0.5px]">
                              {selectedProduct.discount}
                            </span>
                          )}
                        </div>
                      ) : selectedProduct.discount && selectedProduct.discount.trim() !== "" ? (
                        <div className="mb-1">
                          <span className="text-[11px] sm:text-xs font-bold text-[#EE4D2D] leading-none -translate-y-[0.5px]">
                            {selectedProduct.discount}
                          </span>
                        </div>
                      ) : null}
                      <div>
                        <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#EE4D2D] dark:text-[#FF5722]">
                          {formatRupiah(selectedProduct.price)}
                        </span>
                      </div>
                    </div>

                    {/* Deskripsi Produk - Kompak dengan Scroll Mandiri jika teks panjang */}
                    <div className="mt-3.5 sm:mt-4">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground mb-1.5">Deskripsi Singkat:</h4>
                      <div className="max-h-[110px] sm:max-h-[140px] overflow-y-auto pr-1.5 scrollbar-thin text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed rounded-xs">
                        <p className="whitespace-pre-line">
                          {selectedProduct.description ||
                            "Produk herbal terstandar kualitas tinggi dari CV. Indo Green Nature, diproduksi dengan higienitas CPOTB terakreditasi dan bahan baku tanaman obat pilihan."}
                        </p>
                      </div>
                    </div>

                    {/* Badge & Jaminan Produk (Garansi Produk Asli, Cashback, Gratis Ongkir & Custom Tags) */}
                    {(() => {
                      const hasCashback =
                        selectedProduct.isCashbackXtra !== undefined
                          ? selectedProduct.isCashbackXtra
                          : Boolean(selectedProduct.tags?.some((t) => t.toLowerCase().includes("cashback")))
                      const hasGratisOngkir =
                        selectedProduct.isGratisOngkir !== undefined
                          ? selectedProduct.isGratisOngkir
                          : Boolean(selectedProduct.tags?.some((t) => t.toLowerCase().includes("ongkir")))

                      const customTags = (selectedProduct.tags || []).filter(
                        (t) =>
                          !t.toLowerCase().includes("cashback") &&
                          !t.toLowerCase().includes("ongkir")
                      )

                      return (
                        <div className="mt-3.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                          {/* Badge Garansi Produk Asli (Kotak rounded-[4px]) */}
                          <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-[4px] bg-muted text-foreground/80 border border-border/60">
                            Garansi 100% Produk Asli
                          </span>

                          {/* Badge Cashback Xtra (Kotak rounded-[4px]) */}
                          {hasCashback && (
                            <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-[4px] bg-[#EE4D2D]/10 text-[#EE4D2D] border border-[#EE4D2D]/30">
                              Cashback Xtra
                            </span>
                          )}

                          {/* Badge Gratis Ongkir Xtra (Kotak rounded-[4px], Cyan #00897B) */}
                          {hasGratisOngkir && (
                            <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-[4px] bg-[#00897B]/10 dark:bg-[#26A69A]/15 text-[#00897B] dark:text-[#26A69A] border border-[#00897B]/40 dark:border-[#26A69A]/40">
                              Gratis Ongkir Xtra
                            </span>
                          )}

                          {/* Badge Custom Lainnya (Kotak rounded-[4px], Cyan #00897B) */}
                          {customTags.map((ct, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-[4px] bg-[#00897B]/10 dark:bg-[#26A69A]/15 text-[#00897B] dark:text-[#26A69A] border border-[#00897B]/40 dark:border-[#26A69A]/40"
                            >
                              {ct}
                            </span>
                          ))}
                        </div>
                      )
                    })()}
                  </div>

                  {/* Tombol Pemesanan Marketplace (Auto-Slide ke Kiri: Shopee & Tokopedia <-> Lazada & TikTok) */}
                  <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-border flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Pilih Saluran Pemesanan
                      </span>

                      {/* Navigasi Slide Marketplace */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setMarketplacePage((prev) => (prev === 0 ? 1 : 0))}
                          className="w-6 h-6 rounded-full border border-border/80 bg-background/80 hover:bg-muted text-foreground flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                          title={marketplacePage === 0 ? "Lihat Lazada & TikTok" : "Lihat Shopee & Tokopedia"}
                          aria-label="Saluran Sebelumnya"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setMarketplacePage((prev) => (prev === 0 ? 1 : 0))}
                          className="w-6 h-6 rounded-full border border-border/80 bg-background/80 hover:bg-muted text-foreground flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                          title={marketplacePage === 0 ? "Lihat Lazada & TikTok" : "Lihat Shopee & Tokopedia"}
                          aria-label="Saluran Selanjutnya"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Container Auto-Slide 2 Button: Transisi Selalu Bergerak ke Arah Kiri */}
                    <div
                      className="w-full overflow-hidden rounded-[8px] relative h-[42px] sm:h-[44px]"
                      onMouseEnter={() => setIsMarketplaceHovered(true)}
                      onMouseLeave={() => setIsMarketplaceHovered(false)}
                    >
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                          key={marketplacePage}
                          initial={{ x: "100%", opacity: 0 }}
                          animate={{ x: "0%", opacity: 1 }}
                          exit={{ x: "-100%", opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                          className="w-full grid grid-cols-2 gap-2 sm:gap-2.5 absolute inset-0 items-center"
                        >
                          {marketplacePage === 0 ? (
                            <>
                              {/* Shopee */}
                              <a
                                href={selectedProduct.shopeeUrl || "https://shopee.co.id"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[8px] bg-[#EE4D2D] hover:bg-[#EE4D2D]/90 text-white text-xs sm:text-sm font-bold transition-all shadow-none cursor-pointer hover:scale-[1.01] active:scale-[0.99] h-full"
                              >
                                <ShoppingBag className="w-4 h-4 shrink-0" />
                                <span className="truncate">Beli di Shopee</span>
                              </a>

                              {/* Tokopedia */}
                              <a
                                href={selectedProduct.tokopediaUrl || "https://tokopedia.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[8px] bg-[#03AC0E] hover:bg-[#03AC0E]/90 text-white text-xs sm:text-sm font-bold transition-all shadow-none cursor-pointer hover:scale-[1.01] active:scale-[0.99] h-full"
                              >
                                <ShoppingBag className="w-4 h-4 shrink-0" />
                                <span className="truncate">Beli di Tokopedia</span>
                              </a>
                            </>
                          ) : (
                            <>
                              {/* Lazada */}
                              <a
                                href={selectedProduct.lazadaUrl || "https://www.lazada.co.id"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-[8px] bg-[#0F146D] hover:bg-[#0F146D]/90 text-white text-xs sm:text-sm font-bold transition-all shadow-none cursor-pointer hover:scale-[1.01] active:scale-[0.99] h-full"
                              >
                                <ShoppingBag className="w-4 h-4 shrink-0" />
                                <span className="truncate">Beli di Lazada</span>
                              </a>

                              {/* TikTok */}
                              <a
                                href={selectedProduct.tiktokUrl || "https://tiktok.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-[8px] bg-black hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold transition-all shadow-none cursor-pointer hover:scale-[1.01] active:scale-[0.99] h-full"
                              >
                                <ShoppingBag className="w-4 h-4 shrink-0" />
                                <span className="truncate">Beli di TikTok</span>
                              </a>
                            </>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Order Cepat WhatsApp */}
                    <a
                      href={`https://wa.me/6285877669199?text=${encodeURIComponent(
                        `Halo CV. Indo Green Nature, saya ingin memesan produk: ${selectedProduct.name} (${formatRupiah(
                          selectedProduct.price
                        )}). Mohon info ketersediaan stok & pengiriman.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-[8px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <svg
                        className="w-4 h-4 fill-current shrink-0"
                        viewBox="0 0 24 24"
                      >
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                      <span>Order Cepat via WhatsApp Official</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}
        </main>

        {/* Sidebar Pengaturan Admin */}
        <OurProductsSettingsSidebar
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          data={settings}
          onChange={setSettings}
          onSave={handleSaveSettings}
          onReset={handleResetSettings}
          isSaving={isSaving}
        />
      </div>
    </>
  )
}
