"use client"

import * as React from "react"
import Image from "next/image"
import {
  X,
  Save,
  RotateCcw,
  Eye,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Copy,
  Loader2,
  ExternalLink,
  Upload,
  ImageIcon,
  ArrowUpDown,
  ShoppingBag,
  Layers,
  Type,
  Palette,
  LayoutTemplate,
  Award,
  Zap,
  BadgeCheck,
  Star,
  CheckCircle2,
  Flame,
  Search,
  Link as LinkIcon,
  HelpCircle,
  SlidersHorizontal,
  Package,
  ArrowRight,
  Coins,
  Tag,
  Percent,
  FileText,
  MessageCircle,
  Phone,
} from "lucide-react"
import { poppins, outfit, HERO_FONTS } from "@/lib/fonts"
import { uploadOurProductsMedia } from "@/lib/storage"
import { cn } from "@/lib/utils"
import {
  OurProductsSettingsData,
  DEFAULT_OUR_PRODUCTS_SETTINGS,
  OUR_PRODUCTS_SETTINGS_KEY,
  OUR_PRODUCTS_DRAFT_KEY,
  OUR_PRODUCTS_HAS_DRAFT_KEY,
  OUR_PRODUCTS_PREVIEW_CHANNEL,
  StoreCardItem,
  ShopeeProductItem,
} from "@/lib/our-products-settings"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export interface OurProductsSettingsSidebarProps {
  isOpen: boolean
  onClose: () => void
  data: OurProductsSettingsData
  onChange: (updated: OurProductsSettingsData) => void
  onSave: () => void
  onReset: () => void
  isSaving?: boolean
}

type TabKey = "banner" | "store_cards" | "galeri_slide" | "katalog_produk" | "daftar_produk"

export interface BadgePreset {
  id: "official" | "star_plus" | "star_seller" | "best_seller" | "new" | "deal" | "custom" | "none"
  label: string
  badgeText: string
  badgeType: "official" | "star" | "best_seller" | "new" | "deal" | "custom" | "none"
  bgColor: string
  textColor: string
  iconType: "check" | "star" | "award" | "zap" | "flame" | "palette" | "none"
  description: string
}

export const BADGE_PRESETS: BadgePreset[] = [
  {
    id: "official",
    label: "Official Shop",
    badgeText: "Official Shop",
    badgeType: "official",
    bgColor: "#D0011B",
    textColor: "#FFFFFF",
    iconType: "check",
    description: "Badge resmi merah Shopee dengan logo centang verifikasi",
  },
  {
    id: "star_plus",
    label: "Star+",
    badgeText: "Star+",
    badgeType: "star",
    bgColor: "#EE4D2D",
    textColor: "#FFFFFF",
    iconType: "star",
    description: "Badge oranye Shopee Star+ dengan icon bintang emas",
  },
  {
    id: "star_seller",
    label: "Star Seller",
    badgeText: "Star",
    badgeType: "star",
    bgColor: "#EE4D2D",
    textColor: "#FFFFFF",
    iconType: "star",
    description: "Badge Star Seller standar warna oranye Shopee",
  },
  {
    id: "best_seller",
    label: "Best Seller",
    badgeText: "Best Seller",
    badgeType: "best_seller",
    bgColor: "#15803D",
    textColor: "#FFFFFF",
    iconType: "award",
    description: "Badge terlaris dengan pita penghargaan warna hijau emerald",
  },
  {
    id: "new",
    label: "Produk Baru",
    badgeText: "Produk Baru",
    badgeType: "new",
    bgColor: "#2563EB",
    textColor: "#FFFFFF",
    iconType: "zap",
    description: "Badge biru modern untuk katalog rilis terbaru",
  },
  {
    id: "deal",
    label: "Hot Deal",
    badgeText: "Hot Deal",
    badgeType: "deal",
    bgColor: "#9333EA",
    textColor: "#FFFFFF",
    iconType: "flame",
    description: "Badge promo ungu royal untuk item diskon spesial",
  },
  {
    id: "custom",
    label: "Kustom",
    badgeText: "",
    badgeType: "custom",
    bgColor: "#00897B",
    textColor: "#FFFFFF",
    iconType: "palette",
    description: "Tulis teks badge dan tentukan warna background & teks sendiri",
  },
  {
    id: "none",
    label: "Tanpa Badge",
    badgeText: "",
    badgeType: "none",
    bgColor: "",
    textColor: "",
    iconType: "none",
    description: "Sembunyikan badge display dari foto produk",
  },
]

export const POPULAR_CUSTOM_TAGS = [
  "BPOM TR",
  "Halal MUI",
  "100% Alami",
  "Beauty",
  "Detox",
  "Slimming",
  "High Protein",
  "CPOTB",
]

function getActiveBadgePresetId(prod: ShopeeProductItem): string {
  if (!prod.badge || prod.badge.trim() === "" || prod.badgeType === "none") {
    return "none"
  }
  const bLower = prod.badge.toLowerCase().trim()
  const bg = prod.badgeBgColor?.toUpperCase()
  if (prod.badgeType === "official" || (bLower.includes("official") && (!bg || bg === "#D0011B"))) {
    return "official"
  }
  if (bLower === "star+" || (prod.badgeType === "star" && bLower.includes("+"))) {
    return "star_plus"
  }
  if (bLower === "star" || bLower.includes("seller")) {
    return "star_seller"
  }
  if (prod.badgeType === "best_seller" || bLower.includes("best") || bLower.includes("terlaris")) {
    return "best_seller"
  }
  if (prod.badgeType === "new" || bLower.includes("baru") || bLower.includes("new")) {
    return "new"
  }
  if (prod.badgeType === "deal" || bLower.includes("deal") || bLower.includes("hot")) {
    return "deal"
  }
  return "custom"
}

/**
 * Memformat angka menjadi format titik ribuan Indonesia (contoh: 50000 -> "50.000")
 */
function formatThousandDots(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === "") return ""
  const clean = String(val).replace(/\D/g, "")
  if (!clean) return ""
  return parseInt(clean, 10).toLocaleString("id-ID")
}

/**
 * Format mata uang Rupiah lengkap (contoh: 50000 -> "Rp 50.000")
 */
function formatRupiahCurrency(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === "" || Number(val) === 0) return "Rp 0"
  const clean = String(val).replace(/\D/g, "")
  if (!clean) return "Rp 0"
  return `Rp ${parseInt(clean, 10).toLocaleString("id-ID")}`
}

/**
 * Komponen Input Angka Rupiah dengan Format Titik Ribuan Otomatis
 */
interface ThousandCurrencyInputProps {
  value: number | undefined
  onChange: (val: number | undefined) => void
  placeholder?: string
  className?: string
  textColorClass?: string
  prefix?: string
}

function ThousandCurrencyInput({
  value,
  onChange,
  placeholder = "0",
  className,
  textColorClass = "text-[#15803D]",
  prefix = "Rp",
}: ThousandCurrencyInputProps) {
  const displayValue = value && value > 0 ? formatThousandDots(value) : ""

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "")
    if (!raw) {
      onChange(undefined)
      return
    }
    const num = parseInt(raw, 10)
    onChange(isNaN(num) ? 0 : num)
  }

  return (
    <div className="relative w-full">
      {prefix && (
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground select-none pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        placeholder={placeholder}
        onChange={handleChange}
        className={cn(
          "w-full pr-2.5 py-1.5 rounded-[5px] border border-border bg-background font-mono text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#15803D] transition-colors",
          prefix ? "pl-8" : "pl-2.5",
          textColorClass,
          className
        )}
      />
    </div>
  )
}

/**
 * Memastikan nilai untuk input type="color" selalu berformat hex valid "#rrggbb" (7 karakter).
 */
function toSafeHexColor(color: string | undefined | null, fallback: string = "#15803D"): string {
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

interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  minHeight?: number
}

function AutoResizeTextarea({
  value,
  onChange,
  className,
  minHeight = 80,
  ...props
}: AutoResizeTextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const adjustHeight = React.useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    const nextHeight = Math.max(el.scrollHeight + 4, minHeight)
    el.style.height = `${nextHeight}px`
  }, [minHeight])

  React.useEffect(() => {
    adjustHeight()
    const handleResize = () => adjustHeight()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [value, adjustHeight])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        onChange(e)
        adjustHeight()
      }}
      className={cn(
        "w-full overflow-hidden resize-none [field-sizing:content] transition-[height] duration-75",
        className
      )}
      {...props}
    />
  )
}

import { FontSelect } from "@/components/ui/font-combobox"

export function OurProductsSettingsSidebar({
  isOpen,
  onClose,
  data,
  onChange,
  onSave,
  onReset,
  isSaving = false,
}: OurProductsSettingsSidebarProps) {
  const [activeTab, setActiveTab] = React.useState<TabKey>("banner")
  const [openProductAccordions, setOpenProductAccordions] = React.useState<string[]>([])
  const broadcastChannelRef = React.useRef<BroadcastChannel | null>(null)

  // Uploading state trackers
  const [isUploadingStoreCover, setIsUploadingStoreCover] = React.useState<number | null>(null)
  const [isUploadingSlideLeft, setIsUploadingSlideLeft] = React.useState<number | null>(null)
  const [isUploadingSlideRight, setIsUploadingSlideRight] = React.useState<number | null>(null)
  const [isUploadingNewSlideLeft, setIsUploadingNewSlideLeft] = React.useState(false)
  const [isUploadingNewSlideRight, setIsUploadingNewSlideRight] = React.useState(false)
  const [isUploadingProductCover, setIsUploadingProductCover] = React.useState<number | null>(null)
  const [isUploadingProductGallery, setIsUploadingProductGallery] = React.useState<number | null>(null)

  // File input hidden refs
  const storeCoverInputRef = React.useRef<HTMLInputElement>(null)
  const [storeCoverTargetIdx, setStoreCoverTargetIdx] = React.useState<number | null>(null)

  const slideLeftInputRef = React.useRef<HTMLInputElement>(null)
  const [slideLeftTargetIdx, setSlideLeftTargetIdx] = React.useState<number | null>(null)

  const slideRightInputRef = React.useRef<HTMLInputElement>(null)
  const [slideRightTargetIdx, setSlideRightTargetIdx] = React.useState<number | null>(null)

  const productCoverInputRef = React.useRef<HTMLInputElement>(null)
  const [productCoverTargetIdx, setProductCoverTargetIdx] = React.useState<number | null>(null)

  const productGalleryInputRef = React.useRef<HTMLInputElement>(null)
  const [productGalleryTargetIdx, setProductGalleryTargetIdx] = React.useState<number | null>(null)

  // Filter & Search katalog produk
  const [productSearchQuery, setProductSearchQuery] = React.useState("")
  const [productCategoryFilter, setProductCategoryFilter] = React.useState<string>("all")
  const [customTagInputs, setCustomTagInputs] = React.useState<Record<number, string>>({})

  // Kategori unik untuk dropdown katalog & filter (Hook dipanggil konsisten di atas komponen)
  const availableCategories = React.useMemo(() => {
    const fromSettings = (data.shopeeCategories || [])
      .map((c) => c.trim())
      .filter((c) => c && c.toLowerCase() !== "semua")
    const fromProducts = (data.shopeeProducts || [])
      .map((p) => p.category?.trim())
      .filter((c): c is string => Boolean(c && c.toLowerCase() !== "semua"))
    const defaultList = [
      "Minuman Serbuk",
      "Collagen & Beauty",
      "Kapsul Herbal",
      "Teh Herbal",
      "Herbal Kesehatan",
      "Madu Murni",
      "Minyak Atsiri",
    ]
    return Array.from(new Set([...fromSettings, ...fromProducts, ...defaultList]))
  }, [data.shopeeCategories, data.shopeeProducts])

  // Inisialisasi BroadcastChannel untuk preview real-time lintas tab
  React.useEffect(() => {
    if (typeof BroadcastChannel !== "undefined") {
      try {
        broadcastChannelRef.current = new BroadcastChannel(OUR_PRODUCTS_PREVIEW_CHANNEL)
      } catch {}
    }
    return () => {
      broadcastChannelRef.current?.close()
    }
  }, [])

  // Tangani ESC untuk menutup modal
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

  // Emit preview update ke state induk, localStorage, dan BroadcastChannel
  const emitPreview = (newData: OurProductsSettingsData) => {
    onChange(newData)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(OUR_PRODUCTS_DRAFT_KEY, JSON.stringify(newData))
        localStorage.setItem(OUR_PRODUCTS_HAS_DRAFT_KEY, "true")
        localStorage.setItem(OUR_PRODUCTS_SETTINGS_KEY, JSON.stringify(newData))
        broadcastChannelRef.current?.postMessage({
          type: "PREVIEW_UPDATE",
          data: newData,
        })
      } catch {}
    }
  }

  const handleFieldChange = <K extends keyof OurProductsSettingsData>(
    field: K,
    val: OurProductsSettingsData[K]
  ) => {
    emitPreview({
      ...data,
      [field]: val,
    })
  }

  // ─── UPLOAD FILE HELPER ───
  const processUpload = async (
    file: File,
    subfolder: "banners" | "stores" | "cards" | "store_cards" | "slides" | "products" | "general"
  ): Promise<string | null> => {
    // 1. Coba upload ke Supabase Storage (bucket media/our_products/{subfolder})
    try {
      const publicUrl = await uploadOurProductsMedia(file, subfolder)
      if (publicUrl) return publicUrl
    } catch (err) {
      console.warn(`[OurProducts] Gagal upload ke Supabase storage folder our_products/${subfolder}:`, err)
    }

    // 2. Fallback Data URL Base64 jika Supabase offline/error
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // ─── HANDLER STORE CARDS ───
  const handleUpdateStoreCard = (idx: number, updates: Partial<StoreCardItem>) => {
    const next = [...data.storeCards]
    next[idx] = { ...next[idx], ...updates }
    emitPreview({ ...data, storeCards: next })
  }

  const triggerUploadStoreCover = (idx: number) => {
    setStoreCoverTargetIdx(idx)
    storeCoverInputRef.current?.click()
  }

  const handleStoreCoverFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || storeCoverTargetIdx === null) return

    setIsUploadingStoreCover(storeCoverTargetIdx)
    try {
      const url = await processUpload(file, "cards")
      if (url) {
        handleUpdateStoreCard(storeCoverTargetIdx, { image: url })
      }
    } catch (err) {
      console.error("Gagal unggah foto cover store:", err)
    } finally {
      setIsUploadingStoreCover(null)
      setStoreCoverTargetIdx(null)
      if (storeCoverInputRef.current) storeCoverInputRef.current.value = ""
    }
  }

  // ─── HANDLER SLIDE IMAGES (DUAL COLUMN AUTO-SLIDE) ───
  const handleUpdateImageLeft = (idx: number, url: string) => {
    const next = [...(data.slideImagesLeft || [])]
    next[idx] = url
    emitPreview({ ...data, slideImagesLeft: next })
  }

  const handleRemoveImageLeft = (idx: number) => {
    if ((data.slideImagesLeft || []).length <= 1) return
    const next = (data.slideImagesLeft || []).filter((_, i) => i !== idx)
    emitPreview({ ...data, slideImagesLeft: next })
  }

  const triggerUploadSlideLeft = (idx: number) => {
    setSlideLeftTargetIdx(idx)
    slideLeftInputRef.current?.click()
  }

  const handleSlideLeftFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isNew = slideLeftTargetIdx === -1
    if (isNew) setIsUploadingNewSlideLeft(true)
    else setIsUploadingSlideLeft(slideLeftTargetIdx)

    try {
      const url = await processUpload(file, "slides")
      if (url) {
        if (isNew) {
          emitPreview({
            ...data,
            slideImagesLeft: [...(data.slideImagesLeft || []), url],
          })
        } else if (slideLeftTargetIdx !== null) {
          handleUpdateImageLeft(slideLeftTargetIdx, url)
        }
      }
    } catch (err) {
      console.error("Gagal unggah slide kiri:", err)
    } finally {
      setIsUploadingSlideLeft(null)
      setIsUploadingNewSlideLeft(false)
      setSlideLeftTargetIdx(null)
      if (slideLeftInputRef.current) slideLeftInputRef.current.value = ""
    }
  }

  const handleUpdateImageRight = (idx: number, url: string) => {
    const next = [...(data.slideImagesRight || [])]
    next[idx] = url
    emitPreview({ ...data, slideImagesRight: next })
  }

  const handleRemoveImageRight = (idx: number) => {
    if ((data.slideImagesRight || []).length <= 1) return
    const next = (data.slideImagesRight || []).filter((_, i) => i !== idx)
    emitPreview({ ...data, slideImagesRight: next })
  }

  const triggerUploadSlideRight = (idx: number) => {
    setSlideRightTargetIdx(idx)
    slideRightInputRef.current?.click()
  }

  const handleSlideRightFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isNew = slideRightTargetIdx === -1
    if (isNew) setIsUploadingNewSlideRight(true)
    else setIsUploadingSlideRight(slideRightTargetIdx)

    try {
      const url = await processUpload(file, "slides")
      if (url) {
        if (isNew) {
          emitPreview({
            ...data,
            slideImagesRight: [...(data.slideImagesRight || []), url],
          })
        } else if (slideRightTargetIdx !== null) {
          handleUpdateImageRight(slideRightTargetIdx, url)
        }
      }
    } catch (err) {
      console.error("Gagal unggah slide kanan:", err)
    } finally {
      setIsUploadingSlideRight(null)
      setIsUploadingNewSlideRight(false)
      setSlideRightTargetIdx(null)
      if (slideRightInputRef.current) slideRightInputRef.current.value = ""
    }
  }

  // ─── HANDLER PRODUK KATALOG ───
  const handleUpdateShopeeProduct = (idx: number, updates: Partial<ShopeeProductItem>) => {
    const list = [...(data.shopeeProducts || [])]
    list[idx] = { ...list[idx], ...updates }
    emitPreview({ ...data, shopeeProducts: list })
  }

  const handleAddShopeeProduct = () => {
    const newId = `sp-${Date.now()}`
    const newProduct: ShopeeProductItem = {
      id: newId,
      name: "Produk Herbal Baru CV. Indo Green Nature",
      category: data.shopeeCategories?.[1] || "Minuman Serbuk",
      price: 50000,
      originalPrice: 65000,
      soldCount: "1RB+ Terjual",
      rating: 4.9,
      location: "D.I. Yogyakarta",
      image: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792475799445-79sbk9.webp",
      images: [
        "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792475799445-79sbk9.webp",
      ],
      badge: "Official Shop",
      discount: "-23%",
      tags: ["Cashback Xtra", "Gratis Ongkir"],
      shopeeUrl: "https://shopee.co.id",
      tokopediaUrl: "https://tokopedia.com",
      lazadaUrl: "https://www.lazada.co.id",
      tiktokUrl: "https://www.tiktok.com",
      description: "Deskripsi produk herbal alami berkualitas premium dari CV. Indo Green Nature.",
    }
    emitPreview({ ...data, shopeeProducts: [newProduct, ...(data.shopeeProducts || [])] })
    setOpenProductAccordions([newId])
  }

  const handleDeleteShopeeProduct = (idx: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini dari daftar?")) {
      const list = [...(data.shopeeProducts || [])]
      list.splice(idx, 1)
      emitPreview({ ...data, shopeeProducts: list })
      setOpenProductAccordions([])
    }
  }

  const handleDuplicateShopeeProduct = (idx: number) => {
    const list = [...(data.shopeeProducts || [])]
    const source = list[idx]
    if (!source) return
    const newId = `sp-${Date.now()}`
    const duplicated: ShopeeProductItem = {
      ...source,
      id: newId,
      name: `${source.name} (Salinan)`,
      images: source.images ? [...source.images] : [source.image],
      tags: source.tags ? [...source.tags] : [],
    }
    list.splice(idx + 1, 0, duplicated)
    emitPreview({ ...data, shopeeProducts: list })
    setOpenProductAccordions([newId])
  }

  const handleMoveShopeeProduct = (idx: number, direction: "up" | "down") => {
    const list = [...(data.shopeeProducts || [])]
    const targetIdx = direction === "up" ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= list.length) return
    const temp = list[idx]
    list[idx] = list[targetIdx]
    list[targetIdx] = temp
    emitPreview({ ...data, shopeeProducts: list })
  }

  // Logika Diskon Otomatis:
  // Jika diskon ditulis angka persen (misal: 10), otomatis harga coret mengikuti harga jual saat ini
  // dan harga jual otomatis mengikuti diskon (terpotong 10%).
  const handleApplyDiscountPercentage = (productIdx: number, rawInput: string | number) => {
    const list = [...(data.shopeeProducts || [])]
    const prod = list[productIdx]
    if (!prod) return

    const rawStr = String(rawInput).trim()

    // Jika dikosongkan: hapus diskon dan kembalikan harga normal (dari harga coret)
    if (!rawStr) {
      const restoredPrice =
        prod.originalPrice && prod.originalPrice > prod.price ? prod.originalPrice : prod.price
      handleUpdateShopeeProduct(productIdx, {
        discount: "",
        price: restoredPrice,
        originalPrice: undefined,
      })
      return
    }

    const numericOnly = rawStr.replace(/[^\d.]/g, "")
    const pct = parseFloat(numericOnly)

    // Jika teks bebas non-angka (misal "BPOM", "NEW")
    if (isNaN(pct) || pct <= 0) {
      handleUpdateShopeeProduct(productIdx, {
        discount: rawStr,
      })
      return
    }

    // Jika angka persen valid (1 - 99%)
    if (pct > 0 && pct < 100) {
      // Ambil harga dasar: jika harga coret sudah ada dan lebih tinggi dari harga diskon, gunakan harga coret.
      // Jika belum ada harga coret, harga jual saat ini menjadi harga coret!
      const basePrice =
        prod.originalPrice && prod.originalPrice > prod.price ? prod.originalPrice : (prod.price || 0)

      const discountNominal = Math.round((basePrice * pct) / 100)
      const newPrice = Math.max(0, basePrice - discountNominal)

      handleUpdateShopeeProduct(productIdx, {
        discount: `-${pct}%`,
        originalPrice: basePrice, // harga coret otomatis mengikuti harga jual saat ini
        price: newPrice,          // harga jual otomatis mengikuti diskon
      })
    }
  }

  // Toggle Aktif / Nonaktifkan Diskon Produk
  const handleToggleDiscount = (productIdx: number, enable: boolean) => {
    const list = [...(data.shopeeProducts || [])]
    const prod = list[productIdx]
    if (!prod) return

    if (enable) {
      // Aktifkan diskon: jika sebelumnya sudah ada angka diskon pakai itu, jika belum ada pakai default 10%
      const currentPct = prod.discount ? parseFloat(prod.discount.replace(/[^\d.]/g, "")) : 0
      const targetPct = currentPct > 0 ? currentPct : 10
      handleApplyDiscountPercentage(productIdx, targetPct)
    } else {
      // Nonaktifkan diskon: kembalikan harga ke harga normal (harga coret) dan hapus data diskon
      const restoredPrice =
        prod.originalPrice && prod.originalPrice > prod.price ? prod.originalPrice : prod.price
      handleUpdateShopeeProduct(productIdx, {
        discount: "",
        originalPrice: undefined,
        price: restoredPrice,
      })
    }
  }

  // Toggle Cashback Xtra
  const handleToggleCashbackXtra = (productIdx: number, enable: boolean) => {
    const list = [...(data.shopeeProducts || [])]
    const prod = list[productIdx]
    if (!prod) return

    let updatedTags = [...(prod.tags || [])]
    if (enable) {
      if (!updatedTags.some((t) => t.toLowerCase().includes("cashback"))) {
        updatedTags.push("Cashback Xtra")
      }
    } else {
      updatedTags = updatedTags.filter((t) => !t.toLowerCase().includes("cashback"))
    }

    handleUpdateShopeeProduct(productIdx, {
      isCashbackXtra: enable,
      tags: updatedTags,
    })
  }

  // Toggle Gratis Ongkir
  const handleToggleGratisOngkir = (productIdx: number, enable: boolean) => {
    const list = [...(data.shopeeProducts || [])]
    const prod = list[productIdx]
    if (!prod) return

    let updatedTags = [...(prod.tags || [])]
    if (enable) {
      if (!updatedTags.some((t) => t.toLowerCase().includes("ongkir"))) {
        updatedTags.push("Gratis Ongkir")
      }
    } else {
      updatedTags = updatedTags.filter((t) => !t.toLowerCase().includes("ongkir"))
    }

    handleUpdateShopeeProduct(productIdx, {
      isGratisOngkir: enable,
      tags: updatedTags,
    })
  }

  // Ambil daftar tag kustom (semua tag selain cashback & ongkir)
  const getProductCustomTags = (prod: ShopeeProductItem): string[] => {
    return (prod.tags || []).filter(
      (t) =>
        !t.toLowerCase().includes("cashback") &&
        !t.toLowerCase().includes("ongkir")
    )
  }

  // Tambah tag kustom baru
  const handleAddCustomTag = (productIdx: number, newTag: string) => {
    const trimmed = newTag.trim()
    if (!trimmed) return
    const list = [...(data.shopeeProducts || [])]
    const prod = list[productIdx]
    if (!prod) return

    const currentTags = [...(prod.tags || [])]
    if (!currentTags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      currentTags.push(trimmed)
      handleUpdateShopeeProduct(productIdx, { tags: currentTags })
    }
  }

  // Hapus tag kustom
  const handleRemoveCustomTag = (productIdx: number, tagToRemove: string) => {
    const list = [...(data.shopeeProducts || [])]
    const prod = list[productIdx]
    if (!prod) return

    const updatedTags = (prod.tags || []).filter(
      (t) => t.toLowerCase() !== tagToRemove.toLowerCase()
    )
    handleUpdateShopeeProduct(productIdx, { tags: updatedTags })
  }

  const applyBadgePreset = (productIdx: number, preset: BadgePreset) => {
    if (preset.id === "none") {
      handleUpdateShopeeProduct(productIdx, {
        badge: "",
        badgeType: "none",
        badgeBgColor: undefined,
        badgeTextColor: undefined,
      })
    } else if (preset.id === "custom") {
      const current = data.shopeeProducts[productIdx]
      handleUpdateShopeeProduct(productIdx, {
        badge: current?.badge && current.badge.trim() !== "" ? current.badge : "Promo Spesial",
        badgeType: "custom",
        badgeBgColor: current?.badgeBgColor || "#00897B",
        badgeTextColor: current?.badgeTextColor || "#FFFFFF",
      })
    } else {
      handleUpdateShopeeProduct(productIdx, {
        badge: preset.badgeText,
        badgeType: preset.badgeType,
        badgeBgColor: preset.bgColor,
        badgeTextColor: preset.textColor,
      })
    }
  }

  const triggerUploadProductCover = (idx: number) => {
    setProductCoverTargetIdx(idx)
    productCoverInputRef.current?.click()
  }

  const handleProductCoverFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || productCoverTargetIdx === null) return

    setIsUploadingProductCover(productCoverTargetIdx)
    try {
      const url = await processUpload(file, "products")
      if (url) {
        const prod = data.shopeeProducts[productCoverTargetIdx]
        const currentImages = prod.images && prod.images.length > 0 ? [...prod.images] : [url]
        currentImages[0] = url
        handleUpdateShopeeProduct(productCoverTargetIdx, {
          image: url,
          images: currentImages,
        })
      }
    } catch (err) {
      console.error("Gagal unggah cover produk:", err)
    } finally {
      setIsUploadingProductCover(null)
      setProductCoverTargetIdx(null)
      if (productCoverInputRef.current) productCoverInputRef.current.value = ""
    }
  }

  const triggerUploadProductGallery = (idx: number) => {
    setProductGalleryTargetIdx(idx)
    productGalleryInputRef.current?.click()
  }

  const handleProductGalleryFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || productGalleryTargetIdx === null) return

    setIsUploadingProductGallery(productGalleryTargetIdx)
    try {
      const url = await processUpload(file, "products")
      if (url) {
        const prod = data.shopeeProducts[productGalleryTargetIdx]
        const currentImages = prod.images && prod.images.length > 0 ? [...prod.images] : [prod.image]
        currentImages.push(url)
        handleUpdateShopeeProduct(productGalleryTargetIdx, {
          images: currentImages,
        })
      }
    } catch (err) {
      console.error("Gagal tambah galeri pop-up produk:", err)
    } finally {
      setIsUploadingProductGallery(null)
      setProductGalleryTargetIdx(null)
      if (productGalleryInputRef.current) productGalleryInputRef.current.value = ""
    }
  }

  // ─── HANDLER DAFTAR FOTO PRODUK TERPISAH (INDIVIDUAL) ───
  const handleUpdateProductImageAt = (productIdx: number, imgIdx: number, newUrl: string) => {
    const list = [...(data.shopeeProducts || [])]
    const prod = list[productIdx]
    if (!prod) return
    const currentImages = prod.images && prod.images.length > 0 ? [...prod.images] : [prod.image]
    currentImages[imgIdx] = newUrl
    const updates: Partial<ShopeeProductItem> = {
      images: currentImages,
    }
    if (imgIdx === 0) {
      updates.image = newUrl || prod.image
    }
    handleUpdateShopeeProduct(productIdx, updates)
  }

  const handleAddProductImageSlot = (productIdx: number) => {
    const list = [...(data.shopeeProducts || [])]
    const prod = list[productIdx]
    if (!prod) return
    const currentImages = prod.images && prod.images.length > 0 ? [...prod.images] : [prod.image]
    currentImages.push("")
    handleUpdateShopeeProduct(productIdx, { images: currentImages })
  }

  const handleRemoveProductImageAt = (productIdx: number, imgIdx: number) => {
    const list = [...(data.shopeeProducts || [])]
    const prod = list[productIdx]
    if (!prod) return
    const currentImages = prod.images && prod.images.length > 0 ? [...prod.images] : [prod.image]
    if (currentImages.length <= 1) {
      alert("Produk harus memiliki minimal 1 foto.")
      return
    }
    currentImages.splice(imgIdx, 1)
    handleUpdateShopeeProduct(productIdx, {
      images: currentImages,
      image: currentImages[0] || prod.image,
    })
  }

  const handleMoveProductImageAt = (productIdx: number, imgIdx: number, direction: "up" | "down") => {
    const list = [...(data.shopeeProducts || [])]
    const prod = list[productIdx]
    if (!prod) return
    const currentImages = prod.images && prod.images.length > 0 ? [...prod.images] : [prod.image]
    const targetIdx = direction === "up" ? imgIdx - 1 : imgIdx + 1
    if (targetIdx < 0 || targetIdx >= currentImages.length) return
    const temp = currentImages[imgIdx]
    currentImages[imgIdx] = currentImages[targetIdx]
    currentImages[targetIdx] = temp
    handleUpdateShopeeProduct(productIdx, {
      images: currentImages,
      image: currentImages[0],
    })
  }

  const openPreviewTab = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(OUR_PRODUCTS_DRAFT_KEY, JSON.stringify(data))
        localStorage.setItem(OUR_PRODUCTS_HAS_DRAFT_KEY, "true")
        localStorage.setItem(OUR_PRODUCTS_SETTINGS_KEY, JSON.stringify(data))
        broadcastChannelRef.current?.postMessage({
          type: "PREVIEW_UPDATE",
          data,
        })
      } catch {}
      window.open("/our-products?preview=true", "_blank")
    }
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs p-1.5 sm:p-3 md:p-4 transition-all duration-300">
      {/* Hidden File Inputs untuk Direct Upload Supabase Folder our_products */}
      <input
        ref={storeCoverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleStoreCoverFileSelected}
      />
      <input
        ref={slideLeftInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSlideLeftFileSelected}
      />
      <input
        ref={slideRightInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleSlideRightFileSelected}
      />
      <input
        ref={productCoverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleProductCoverFileSelected}
      />
      <input
        ref={productGalleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleProductGalleryFileSelected}
      />

      {/* Outer Panel Container dengan Proporsi Figma Modal yang Lega seperti About Us */}
      <div className="w-[98vw] max-w-[1560px] h-[95vh] max-h-[920px] bg-white dark:bg-zinc-900 rounded-[8px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-200 dark:border-zinc-700 relative">
        {/* ─── SISI KIRI: SIDEBAR SESUAI KONSEP FIGMA & ABOUT US ─── */}
        <div className="w-full md:w-[316px] md:min-w-[316px] md:max-w-[316px] flex flex-col bg-[#D9D9D9] dark:bg-zinc-800 border-r border-zinc-300 dark:border-zinc-700 shrink-0 select-none">
          {/* Header Sidebar: Figma .rectangle (w: 316px, h: 60px, bg: #D97706) */}
          <div className="w-full h-[60px] bg-[#D97706] px-4 flex items-center justify-center relative shadow-xs">
            <h2
              className={cn(
                "text-[12px] font-bold text-white tracking-wider uppercase text-center w-full",
                poppins.className
              )}
            >
              PENGATURAN OUR PRODUCTS
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
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-xs",
                poppins.className,
                activeTab === "banner"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              BANNER UTAMA
            </button>

            {/* Tombol 2: 4 KARTU OFFICIAL STORE */}
            <button
              type="button"
              onClick={() => setActiveTab("store_cards")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-xs",
                poppins.className,
                activeTab === "store_cards"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              4 KARTU OFFICIAL STORE
            </button>

            {/* Tombol 3: GALERI AUTO-SLIDE BANNER */}
            <button
              type="button"
              onClick={() => setActiveTab("galeri_slide")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-xs",
                poppins.className,
                activeTab === "galeri_slide"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              GALERI AUTO-SLIDE BANNER
            </button>

            {/* Tombol 4: KATALOG PRODUK */}
            <button
              type="button"
              onClick={() => setActiveTab("katalog_produk")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-xs",
                poppins.className,
                activeTab === "katalog_produk"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              KATALOG PRODUK
            </button>

            {/* Tombol 5: DAFTAR PRODUK */}
            <button
              type="button"
              onClick={() => setActiveTab("daftar_produk")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-xs",
                poppins.className,
                activeTab === "daftar_produk"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              DAFTAR PRODUK
            </button>

            {/* Action Buttons: Simpan & Reset di Sidebar Bawah */}
            <div className="mt-auto pt-4 flex flex-col gap-2 border-t border-zinc-300 dark:border-zinc-700">
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="w-full h-[38px] rounded-[5px] bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
              </button>

              <button
                type="button"
                onClick={onReset}
                className="w-full h-[34px] rounded-[5px] bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── SISI KANAN: TOP BAR & CONTENT EDITOR ─── */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-900">
          {/* Top Bar: Figma .rectangle-3 (h: 60px, bg: #D9D9D9) */}
          <div className="w-full h-[60px] bg-[#D9D9D9] dark:bg-zinc-800 px-4 md:px-6 flex items-center justify-between border-b border-zinc-300 dark:border-zinc-700 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-semibold text-zinc-700 dark:text-zinc-300">
                PENGATURAN BAGIAN:
              </span>
              <span className="text-xs font-bold text-[#15803D] dark:text-emerald-400 bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-[4px] border border-zinc-300 dark:border-zinc-700">
                {activeTab === "banner" && "BANNER UTAMA"}
                {activeTab === "store_cards" && "4 KARTU OFFICIAL STORE"}
                {activeTab === "galeri_slide" && "GALERI AUTO-SLIDE BANNER"}
                {activeTab === "katalog_produk" && "KATALOG PRODUK"}
                {activeTab === "daftar_produk" && "DAFTAR PRODUK"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Badge & Tombol Mode Preview Aktif */}
              <button
                type="button"
                onClick={openPreviewTab}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[5px] bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                title="Buka atau lihat Pratinjau Halaman secara Real-Time di Tab Baru (preview=true)"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
                </span>
                <span>Mode Preview Aktif</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/90" />
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
          <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto space-y-6 w-full text-foreground">
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ─── TAB 1: BANNER UTAMA (KONSEP PENGATURAN LENGKAP) ─── */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeTab === "banner" && (
              <div className="space-y-6 w-full">
                <div>
                  <h3 className={cn("text-lg font-bold text-foreground", poppins.className)}>
                    Pengaturan Banner Utama Our Products
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Sesuaikan judul utama, subtitle, badge tagline, deskripsi pengantar, dan format tipografi banner secara menyeluruh.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* 1. Judul Utama Banner (Layer 1) */}
                  <div className="p-4 rounded-[6px] bg-muted/40 border border-border space-y-3.5">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
                        <Type className="w-3.5 h-3.5 text-[#15803D]" />
                        Judul Utama Banner (Layer 1)
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {(data.bannerTitle || "").length} karakter
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80">
                        Isi Teks Judul
                      </label>
                      <AutoResizeTextarea
                        minHeight={65}
                        value={data.bannerTitle}
                        onChange={(e) => handleFieldChange("bannerTitle", e.target.value)}
                        className="w-full px-3.5 py-2 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D] font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      {/* Gaya Font Judul */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                          <span>Gaya Font</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {data.bannerTitleFont || "poppins"}
                          </span>
                        </label>
                        <FontSelect
                          value={data.bannerTitleFont || "poppins"}
                          onChange={(val) => handleFieldChange("bannerTitleFont", val)}
                        />
                      </div>

                      {/* Ukuran Font Judul */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Ukuran Font</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {data.bannerTitleSize || 48}px
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={24}
                            max={64}
                            step={1}
                            value={data.bannerTitleSize || 48}
                            onChange={(e) =>
                              handleFieldChange("bannerTitleSize", parseInt(e.target.value, 10) || 48)
                            }
                            className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                          />
                          <input
                            type="number"
                            min={24}
                            max={64}
                            value={data.bannerTitleSize || 48}
                            onChange={(e) =>
                              handleFieldChange("bannerTitleSize", parseInt(e.target.value, 10) || 48)
                            }
                            className="w-14 px-2 py-1 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                          />
                        </div>
                      </div>

                      {/* Warna Font Judul */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Warna Font</span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {data.bannerTitleColor || "#15803D"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.bannerTitleColor, "#15803D")}
                            onChange={(e) => handleFieldChange("bannerTitleColor", e.target.value)}
                            className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                          />
                          <input
                            type="text"
                            placeholder="#15803D"
                            value={data.bannerTitleColor || ""}
                            onChange={(e) => handleFieldChange("bannerTitleColor", e.target.value)}
                            className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border"
                          />
                          {data.bannerTitleColor && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("bannerTitleColor", "#15803D")}
                              className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Palet Preset Warna Cepat Judul */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                      <span className="text-muted-foreground font-medium">Preset Cepat:</span>
                      {[
                        { label: "Hijau IGN", color: "#15803D" },
                        { label: "Emerald", color: "#059669" },
                        { label: "Amber", color: "#D97706" },
                        { label: "Charcoal", color: "#111827" },
                        { label: "Navy", color: "#1E3A8A" },
                        { label: "Emas", color: "#B45309" },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleFieldChange("bannerTitleColor", preset.color)}
                          className={cn(
                            "px-2 py-0.5 rounded border text-[10px] transition-all cursor-pointer flex items-center gap-1",
                            (data.bannerTitleColor || "#15803D") === preset.color
                              ? "border-[#15803D] bg-emerald-50 text-[#15803D] dark:bg-emerald-950/40 dark:text-emerald-300 font-bold"
                              : "border-border bg-background hover:bg-muted text-foreground/80"
                          )}
                        >
                          <span
                            className="w-2 h-2 rounded-full border border-black/20"
                            style={{ backgroundColor: preset.color }}
                          />
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Subtitle Banner (Layer 2) */}
                  <div className="p-4 rounded-[6px] bg-muted/40 border border-border space-y-3.5">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
                        <Type className="w-3.5 h-3.5 text-[#15803D]" />
                        Subtitle Banner (Layer 2)
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {(data.bannerSubtitle || "").length} karakter
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80">
                        Isi Teks Subtitle
                      </label>
                      <AutoResizeTextarea
                        minHeight={55}
                        value={data.bannerSubtitle}
                        onChange={(e) => handleFieldChange("bannerSubtitle", e.target.value)}
                        className="w-full px-3.5 py-2 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D] font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      {/* Gaya Font Subtitle */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                          <span>Gaya Font</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {data.bannerSubtitleFont || "poppins"}
                          </span>
                        </label>
                        <FontSelect
                          value={data.bannerSubtitleFont || "poppins"}
                          onChange={(val) => handleFieldChange("bannerSubtitleFont", val)}
                        />
                      </div>

                      {/* Ukuran Font Subtitle */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Ukuran Font</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {data.bannerSubtitleSize || 24}px
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={14}
                            max={36}
                            step={1}
                            value={data.bannerSubtitleSize || 24}
                            onChange={(e) =>
                              handleFieldChange("bannerSubtitleSize", parseInt(e.target.value, 10) || 24)
                            }
                            className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                          />
                          <input
                            type="number"
                            min={14}
                            max={36}
                            value={data.bannerSubtitleSize || 24}
                            onChange={(e) =>
                              handleFieldChange("bannerSubtitleSize", parseInt(e.target.value, 10) || 24)
                            }
                            className="w-14 px-2 py-1 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                          />
                        </div>
                      </div>

                      {/* Warna Font Subtitle */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Warna Font</span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {data.bannerSubtitleColor || "#15803D"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.bannerSubtitleColor, "#15803D")}
                            onChange={(e) => handleFieldChange("bannerSubtitleColor", e.target.value)}
                            className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                          />
                          <input
                            type="text"
                            placeholder="#15803D"
                            value={data.bannerSubtitleColor || ""}
                            onChange={(e) => handleFieldChange("bannerSubtitleColor", e.target.value)}
                            className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border"
                          />
                          {data.bannerSubtitleColor && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("bannerSubtitleColor", "#15803D")}
                              className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Deskripsi Pelengkap Banner (Opsional) */}
                  <div className="p-4 rounded-[6px] bg-muted/40 border border-border space-y-3.5">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
                        <LayoutTemplate className="w-3.5 h-3.5 text-[#15803D]" />
                        Deskripsi Singkat / Pengantar Banner (Opsional)
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {(data.bannerDescription || "").length} karakter
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80">
                        Isi Paragraf Pengantar
                      </label>
                      <AutoResizeTextarea
                        minHeight={65}
                        placeholder="Tuliskan deskripsi ringkas mengenai jaminan keaslian produk, sertifikasi resmi, atau kemudahan berbelanja..."
                        value={data.bannerDescription || ""}
                        onChange={(e) => handleFieldChange("bannerDescription", e.target.value)}
                        className="w-full px-3.5 py-2 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D] leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      {/* Gaya Font Deskripsi */}
                      <div className="flex flex-col gap-1.5">
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

                      {/* Ukuran Font Deskripsi */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Ukuran Font</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {data.bannerDescSize || 13}px
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={11}
                            max={20}
                            step={1}
                            value={data.bannerDescSize || 13}
                            onChange={(e) =>
                              handleFieldChange("bannerDescSize", parseInt(e.target.value, 10) || 13)
                            }
                            className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                          />
                          <input
                            type="number"
                            min={11}
                            max={20}
                            value={data.bannerDescSize || 13}
                            onChange={(e) =>
                              handleFieldChange("bannerDescSize", parseInt(e.target.value, 10) || 13)
                            }
                            className="w-14 px-2 py-1 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                          />
                        </div>
                      </div>

                      {/* Warna Font Deskripsi */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Warna Font</span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {data.bannerDescColor || "#4B5563"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.bannerDescColor, "#4B5563")}
                            onChange={(e) => handleFieldChange("bannerDescColor", e.target.value)}
                            className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                          />
                          <input
                            type="text"
                            placeholder="#4B5563"
                            value={data.bannerDescColor || ""}
                            onChange={(e) => handleFieldChange("bannerDescColor", e.target.value)}
                            className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 5. Ukuran Gambar Kartu Official Store (Banner) */}
                  <div className="p-4 rounded-[6px] bg-muted/40 border border-border space-y-3.5">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#15803D]" />
                        Ukuran Gambar Official Store (Banner)
                      </span>
                      <span className="text-[10px] text-[#15803D] font-mono font-bold">
                        {data.storeCardSize || 125}px
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Atur diameter ukuran gambar lingkaran Official Store di bawah teks banner.
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="range"
                        min={60}
                        max={180}
                        step={2}
                        value={data.storeCardSize || 125}
                        onChange={(e) =>
                          handleFieldChange("storeCardSize", parseInt(e.target.value, 10) || 125)
                        }
                        className="flex-1 accent-[#15803D] cursor-pointer h-2 bg-border rounded-lg"
                      />
                      <input
                        type="number"
                        min={60}
                        max={180}
                        value={data.storeCardSize || 125}
                        onChange={(e) =>
                          handleFieldChange("storeCardSize", parseInt(e.target.value, 10) || 125)
                        }
                        className="w-16 px-2 py-1.5 rounded-[5px] bg-background border border-border text-xs font-mono font-bold text-center"
                      />
                      {data.storeCardSize && data.storeCardSize !== 125 && (
                        <button
                          type="button"
                          onClick={() => handleFieldChange("storeCardSize", 125)}
                          className="px-2.5 py-1.5 text-[11px] rounded-[5px] bg-muted hover:bg-muted/80 text-muted-foreground font-semibold cursor-pointer"
                          title="Kembalikan ke ukuran default (125px)"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    {/* Preset Pilihan Cepat */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                      <span className="text-muted-foreground font-medium">Preset Cepat:</span>
                      {[
                        { label: "Kecil (80px)", size: 80 },
                        { label: "Kompak (100px)", size: 100 },
                        { label: "Standar (125px)", size: 125 },
                        { label: "Sedang (145px)", size: 145 },
                        { label: "Besar (160px)", size: 160 },
                        { label: "Maksimal (177px)", size: 177 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleFieldChange("storeCardSize", preset.size)}
                          className={cn(
                            "px-2.5 py-1 rounded border text-[10px] transition-all cursor-pointer font-medium",
                            (data.storeCardSize || 125) === preset.size
                              ? "border-[#15803D] bg-emerald-50 text-[#15803D] dark:bg-emerald-950/40 dark:text-emerald-300 font-bold"
                              : "border-border bg-background hover:bg-muted text-foreground/80"
                          )}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ─── TAB 2: 4 KARTU OFFICIAL STORE (177PX X 177PX) ─── */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeTab === "store_cards" && (
              <div className="space-y-6 w-full">
                <div>
                  <h3 className={cn("text-lg font-bold text-foreground", poppins.className)}>
                    Pengaturan 4 Kartu Official Store (Banner)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Kelola ukuran gambar lingkaran, cover foto toko, dan link tujuan untuk Shopee Mall, Tokopedia, TikTok Shop, dan Lazada Mall.
                  </p>
                </div>

                {/* ─── PENGATURAN UKURAN GAMBAR OFFICIAL STORE ─── */}
                <div className="p-4 rounded-[8px] bg-muted/40 border border-border space-y-3.5">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#15803D]" />
                      Ukuran Gambar Official Store (Banner)
                    </span>
                    <span className="text-[10px] text-[#15803D] font-mono font-bold">
                      {data.storeCardSize || 125}px
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Atur diameter ukuran lingkaran gambar Official Store pada banner halaman utama.
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="range"
                      min={60}
                      max={180}
                      step={2}
                      value={data.storeCardSize || 125}
                      onChange={(e) =>
                        handleFieldChange("storeCardSize", parseInt(e.target.value, 10) || 125)
                      }
                      className="flex-1 accent-[#15803D] cursor-pointer h-2 bg-border rounded-lg"
                    />
                    <input
                      type="number"
                      min={60}
                      max={180}
                      value={data.storeCardSize || 125}
                      onChange={(e) =>
                        handleFieldChange("storeCardSize", parseInt(e.target.value, 10) || 125)
                      }
                      className="w-16 px-2 py-1.5 rounded-[5px] bg-background border border-border text-xs font-mono font-bold text-center"
                    />
                    {data.storeCardSize && data.storeCardSize !== 125 && (
                      <button
                        type="button"
                        onClick={() => handleFieldChange("storeCardSize", 125)}
                        className="px-2.5 py-1.5 text-[11px] rounded-[5px] bg-muted hover:bg-muted/80 text-muted-foreground font-semibold cursor-pointer"
                        title="Kembalikan ke ukuran default (125px)"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Preset Pilihan Cepat */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                    <span className="text-muted-foreground font-medium">Preset Cepat:</span>
                    {[
                      { label: "Kecil (80px)", size: 80 },
                      { label: "Kompak (100px)", size: 100 },
                      { label: "Standar (125px)", size: 125 },
                      { label: "Sedang (145px)", size: 145 },
                      { label: "Besar (160px)", size: 160 },
                      { label: "Maksimal (177px)", size: 177 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleFieldChange("storeCardSize", preset.size)}
                        className={cn(
                          "px-2.5 py-1 rounded border text-[10px] transition-all cursor-pointer font-medium",
                          (data.storeCardSize || 125) === preset.size
                            ? "border-[#15803D] bg-emerald-50 text-[#15803D] dark:bg-emerald-950/40 dark:text-emerald-300 font-bold"
                            : "border-border bg-background hover:bg-muted text-foreground/80"
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ─── DAFTAR 4 KARTU OFFICIAL STORE ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {data.storeCards.map((card, idx) => {
                    const isUploadingThis = isUploadingStoreCover === idx

                    return (
                      <div
                        key={card.id || idx}
                        className="p-4 rounded-[8px] bg-card border border-border space-y-3.5 shadow-none relative hover:border-[#15803D]/60 transition-colors"
                      >
                        {/* Header Kartu */}
                        <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#15803D]/15 text-[#15803D] font-bold text-xs flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <div>
                              <h4 className="text-xs font-bold text-foreground">
                                {card.title || `Toko #${idx + 1}`}
                              </h4>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                Badge: {card.badge || "Marketplace"}
                              </span>
                            </div>
                          </div>

                          {card.link && (
                            <a
                              href={card.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#15803D] hover:underline flex items-center gap-1 font-semibold"
                              title="Kunjungi toko di tab baru"
                            >
                              <span>Buka Link</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>

                        {/* Preview Gambar & Upload Box */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                          {/* Box Preview 1:1 Full Rounded Bersih Tanpa Shadow, Text, & Stroke */}
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 bg-muted/40 shadow-none group">
                            {card.image ? (
                              <Image
                                src={card.image}
                                alt={card.title}
                                fill
                                sizes="112px"
                                className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-full"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                <ImageIcon className="w-6 h-6 stroke-[1.5]" />
                                <span className="text-[9px] mt-1 font-medium">Belum ada foto</span>
                              </div>
                            )}

                            {isUploadingThis && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex flex-col items-center justify-center text-white">
                                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                                <span className="text-[9px] mt-1 font-bold">Mengunggah...</span>
                              </div>
                            )}
                          </div>

                          {/* Tombol Unggah & Reset URL */}
                          <div className="flex-1 space-y-2 w-full">
                            <button
                              type="button"
                              onClick={() => triggerUploadStoreCover(idx)}
                              disabled={isUploadingThis}
                              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[5px] bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {isUploadingThis ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Unggah Foto Card (our_products/cards)</span>
                            </button>

                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-muted-foreground font-mono">
                                Atau tempel URL gambar langsung:
                              </span>
                              <input
                                type="text"
                                value={card.image}
                                placeholder="https://..."
                                onChange={(e) => handleUpdateStoreCard(idx, { image: e.target.value })}
                                className="w-full px-2.5 py-1 rounded-[5px] border border-border bg-background font-mono text-[10px]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Input Teks: Nama Toko (Shopee Mall) & Sub-Label (Official Store) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-foreground/80">
                              Nama Toko (Judul)
                            </label>
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) => handleUpdateStoreCard(idx, { title: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-[5px] border border-border bg-background text-xs font-semibold"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-foreground/80">
                              Sub-Label Toko
                            </label>
                            <input
                              type="text"
                              value={card.subtitle}
                              onChange={(e) => handleUpdateStoreCard(idx, { subtitle: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-[5px] border border-border bg-background text-xs"
                            />
                          </div>
                        </div>

                        {/* Badge & Link URL Toko */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-foreground/80">Badge Marketplace</label>
                            <input
                              type="text"
                              value={card.badge || ""}
                              onChange={(e) => handleUpdateStoreCard(idx, { badge: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-[5px] border border-border bg-background text-xs"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-foreground/80">Link URL Toko</label>
                            <input
                              type="text"
                              value={card.link}
                              placeholder="https://shopee.co.id/..."
                              onChange={(e) => handleUpdateStoreCard(idx, { link: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-[5px] border border-border bg-background text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ─── TAB 3: GALERI AUTO-SLIDE BANNER (DUAL COLUMN) ─── */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeTab === "galeri_slide" && (
              <div className="space-y-6 w-full">
                <div>
                  <h3 className={cn("text-lg font-bold text-foreground", poppins.className)}>
                    Pengaturan Galeri Auto-Slide Banner Kanan
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Frame auto-slide kanan bergerak tanpa henti secara vertikal: <strong>Kolom Kiri naik ke atas</strong> dan <strong>Kolom Kanan turun ke bawah</strong>.
                  </p>
                </div>

                {/* Card Kontrol Kecepatan Animasi */}
                <div className="p-4 rounded-[8px] bg-muted/40 border border-border space-y-3">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
                      <ArrowUpDown className="w-3.5 h-3.5 text-[#15803D]" />
                      Durasi Kecepatan Animasi Auto-Slide
                    </span>
                    <span className="text-xs font-mono font-bold text-[#15803D] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-[#15803D]/30">
                      {data.slideSpeed || 18} Detik
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-medium text-muted-foreground">Cepat (10s)</span>
                    <input
                      type="range"
                      min={8}
                      max={35}
                      step={1}
                      value={data.slideSpeed || 18}
                      onChange={(e) => handleFieldChange("slideSpeed", parseInt(e.target.value, 10) || 18)}
                      className="flex-1 accent-[#15803D] cursor-pointer h-2 bg-border rounded-lg"
                    />
                    <span className="text-[11px] font-medium text-muted-foreground">Lambat (35s)</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Semakin kecil durasi detik, semakin cepat gambar meluncur vertikal. Rekomendasi standar: <strong>18 detik</strong>.
                  </p>
                </div>

                {/* Grid 2 Kolom Foto: Kolom Kiri & Kolom Kanan */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* ─── KOLOM KIRI (SLIDE NAIK KE ATAS) ─── */}
                  <div className="p-4 rounded-[8px] bg-card border border-border space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                      <div>
                        <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                          Kolom Kiri (Slide Naik ke Atas)
                        </h4>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {data.slideImagesLeft?.length || 0} foto aktif
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => triggerUploadSlideLeft(-1)}
                        disabled={isUploadingNewSlideLeft}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] bg-[#15803D] hover:bg-[#166534] text-white text-[11px] font-semibold cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        {isUploadingNewSlideLeft ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                        <span>Tambah Foto</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(data.slideImagesLeft || []).map((imgUrl, idx) => {
                        const isUploadingThis = isUploadingSlideLeft === idx
                        return (
                          <div
                            key={`left-${idx}`}
                            className="p-2.5 rounded-[6px] border border-border/80 bg-background flex items-center gap-3 relative group"
                          >
                            <span className="text-xs font-bold font-mono text-muted-foreground w-4 shrink-0 text-center">
                              {idx + 1}
                            </span>

                            {/* Thumbnail Preview */}
                            <div className="relative w-12 h-12 rounded-[5px] overflow-hidden border border-border shrink-0 bg-muted">
                              <Image
                                src={imgUrl}
                                alt={`Slide Kiri ${idx + 1}`}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                              {isUploadingThis && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                                </div>
                              )}
                            </div>

                            {/* Input URL */}
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                value={imgUrl}
                                onChange={(e) => handleUpdateImageLeft(idx, e.target.value)}
                                className="w-full px-2 py-1 rounded-[4px] border border-border bg-background font-mono text-[10px]"
                              />
                            </div>

                            {/* Ganti Foto & Hapus */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => triggerUploadSlideLeft(idx)}
                                disabled={isUploadingThis}
                                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                                title="Unggah ganti foto (our_products/slides)"
                              >
                                <Upload className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveImageLeft(idx)}
                                disabled={(data.slideImagesLeft || []).length <= 1}
                                className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-muted-foreground hover:text-red-500 cursor-pointer disabled:opacity-30"
                                title="Hapus foto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* ─── KOLOM KANAN (SLIDE TURUN KE BAWAH) ─── */}
                  <div className="p-4 rounded-[8px] bg-card border border-border space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                      <div>
                        <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                          Kolom Kanan (Slide Turun ke Bawah)
                        </h4>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {data.slideImagesRight?.length || 0} foto aktif
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => triggerUploadSlideRight(-1)}
                        disabled={isUploadingNewSlideRight}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] bg-[#15803D] hover:bg-[#166534] text-white text-[11px] font-semibold cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        {isUploadingNewSlideRight ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                        <span>Tambah Foto</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(data.slideImagesRight || []).map((imgUrl, idx) => {
                        const isUploadingThis = isUploadingSlideRight === idx
                        return (
                          <div
                            key={`right-${idx}`}
                            className="p-2.5 rounded-[6px] border border-border/80 bg-background flex items-center gap-3 relative group"
                          >
                            <span className="text-xs font-bold font-mono text-muted-foreground w-4 shrink-0 text-center">
                              {idx + 1}
                            </span>

                            {/* Thumbnail Preview */}
                            <div className="relative w-12 h-12 rounded-[5px] overflow-hidden border border-border shrink-0 bg-muted">
                              <Image
                                src={imgUrl}
                                alt={`Slide Kanan ${idx + 1}`}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                              {isUploadingThis && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                                </div>
                              )}
                            </div>

                            {/* Input URL */}
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                value={imgUrl}
                                onChange={(e) => handleUpdateImageRight(idx, e.target.value)}
                                className="w-full px-2 py-1 rounded-[4px] border border-border bg-background font-mono text-[10px]"
                              />
                            </div>

                            {/* Ganti Foto & Hapus */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => triggerUploadSlideRight(idx)}
                                disabled={isUploadingThis}
                                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                                title="Unggah ganti foto (our_products/slides)"
                              >
                                <Upload className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveImageRight(idx)}
                                disabled={(data.slideImagesRight || []).length <= 1}
                                className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-muted-foreground hover:text-red-500 cursor-pointer disabled:opacity-30"
                                title="Hapus foto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ─── TAB 4: KATALOG PRODUK (FRAME & KOLOM GRID) ─── */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeTab === "katalog_produk" && (
              <div className="space-y-6 w-full">
                <div>
                  <h3 className={cn("text-lg font-bold text-foreground", poppins.className)}>
                    Pengaturan Katalog Produk
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Kelola judul frame, sub-judul, dan tata letak kolom grid katalog produk desktop.
                  </p>
                </div>

                {/* 1. Judul Frame Produk */}
                <div className="p-4 rounded-[8px] bg-muted/40 border border-border space-y-3.5">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
                      <Type className="w-3.5 h-3.5 text-[#15803D]" />
                      Judul Frame Produk
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {(data.shopeeSectionTitle || "").length} karakter
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-foreground/80">
                      Isi Teks Judul
                    </label>
                    <AutoResizeTextarea
                      minHeight={45}
                      value={data.shopeeSectionTitle || ""}
                      placeholder="DAFTAR PRODUK PILIHAN KAMI"
                      onChange={(e) => handleFieldChange("shopeeSectionTitle", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D] font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    {/* Gaya Font Judul */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                        <span>Gaya Font</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {data.shopeeSectionTitleFont || "poppins"}
                        </span>
                      </label>
                      <FontSelect
                        value={data.shopeeSectionTitleFont || "poppins"}
                        onChange={(val) => handleFieldChange("shopeeSectionTitleFont", val)}
                      />
                    </div>

                    {/* Ukuran Font Judul */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                        <span>Ukuran Font</span>
                        <span className="text-[10px] font-mono text-[#15803D] font-bold">
                          {data.shopeeSectionTitleSize || 28}px
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={16}
                          max={48}
                          step={1}
                          value={data.shopeeSectionTitleSize || 28}
                          onChange={(e) =>
                            handleFieldChange("shopeeSectionTitleSize", parseInt(e.target.value, 10) || 28)
                          }
                          className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                        />
                        <input
                          type="number"
                          min={16}
                          max={48}
                          value={data.shopeeSectionTitleSize || 28}
                          onChange={(e) =>
                            handleFieldChange("shopeeSectionTitleSize", parseInt(e.target.value, 10) || 28)
                          }
                          className="w-14 px-2 py-1 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                        />
                      </div>
                    </div>

                    {/* Warna Font Judul */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                        <span>Warna Font</span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {data.shopeeSectionTitleColor || "#15803D"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={toSafeHexColor(data.shopeeSectionTitleColor, "#15803D")}
                          onChange={(e) => handleFieldChange("shopeeSectionTitleColor", e.target.value)}
                          className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="#15803D"
                          value={data.shopeeSectionTitleColor || ""}
                          onChange={(e) => handleFieldChange("shopeeSectionTitleColor", e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border"
                        />
                        {data.shopeeSectionTitleColor && (
                          <button
                            type="button"
                            onClick={() => handleFieldChange("shopeeSectionTitleColor", "#15803D")}
                            className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Preset Cepat Warna Judul */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                    <span className="text-muted-foreground font-medium">Preset Cepat:</span>
                    {[
                      { label: "Hijau IGN", color: "#15803D" },
                      { label: "Emerald", color: "#059669" },
                      { label: "Amber", color: "#D97706" },
                      { label: "Charcoal", color: "#111827" },
                      { label: "Navy", color: "#1E3A8A" },
                      { label: "Emas", color: "#B45309" },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleFieldChange("shopeeSectionTitleColor", preset.color)}
                        className={cn(
                          "px-2 py-0.5 rounded border text-[10px] transition-all cursor-pointer flex items-center gap-1",
                          (data.shopeeSectionTitleColor || "#15803D") === preset.color
                            ? "border-[#15803D] bg-emerald-50 text-[#15803D] dark:bg-emerald-950/40 dark:text-emerald-300 font-bold"
                            : "border-border bg-background hover:bg-muted text-foreground/80"
                        )}
                      >
                        <span
                          className="w-2 h-2 rounded-full border border-black/20"
                          style={{ backgroundColor: preset.color }}
                        />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Subtitle Frame Produk */}
                <div className="p-4 rounded-[8px] bg-muted/40 border border-border space-y-3.5">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#15803D]" />
                      Subtitle Frame Produk
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {(data.shopeeSectionSubtitle || "").length} karakter
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-foreground/80">
                      Isi Teks Subtitle
                    </label>
                    <AutoResizeTextarea
                      minHeight={55}
                      value={data.shopeeSectionSubtitle || ""}
                      placeholder="Produk herbal alami terlaris berstandar BPOM & Halal resmi siap kirim ke seluruh Indonesia."
                      onChange={(e) => handleFieldChange("shopeeSectionSubtitle", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    {/* Gaya Font Subtitle */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                        <span>Gaya Font</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {data.shopeeSectionSubtitleFont || "poppins"}
                        </span>
                      </label>
                      <FontSelect
                        value={data.shopeeSectionSubtitleFont || "poppins"}
                        onChange={(val) => handleFieldChange("shopeeSectionSubtitleFont", val)}
                      />
                    </div>

                    {/* Ukuran Font Subtitle */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                        <span>Ukuran Font</span>
                        <span className="text-[10px] font-mono text-[#15803D] font-bold">
                          {data.shopeeSectionSubtitleSize || 13}px
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={11}
                          max={24}
                          step={1}
                          value={data.shopeeSectionSubtitleSize || 13}
                          onChange={(e) =>
                            handleFieldChange("shopeeSectionSubtitleSize", parseInt(e.target.value, 10) || 13)
                          }
                          className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                        />
                        <input
                          type="number"
                          min={11}
                          max={24}
                          value={data.shopeeSectionSubtitleSize || 13}
                          onChange={(e) =>
                            handleFieldChange("shopeeSectionSubtitleSize", parseInt(e.target.value, 10) || 13)
                          }
                          className="w-14 px-2 py-1 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                        />
                      </div>
                    </div>

                    {/* Warna Font Subtitle */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                        <span>Warna Font</span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {data.shopeeSectionSubtitleColor || "#6B7280"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={toSafeHexColor(data.shopeeSectionSubtitleColor, "#6B7280")}
                          onChange={(e) => handleFieldChange("shopeeSectionSubtitleColor", e.target.value)}
                          className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="#6B7280"
                          value={data.shopeeSectionSubtitleColor || ""}
                          onChange={(e) => handleFieldChange("shopeeSectionSubtitleColor", e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border"
                        />
                        {data.shopeeSectionSubtitleColor && (
                          <button
                            type="button"
                            onClick={() => handleFieldChange("shopeeSectionSubtitleColor", "#6B7280")}
                            className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Preset Cepat Warna Subtitle */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                    <span className="text-muted-foreground font-medium">Preset Cepat:</span>
                    {[
                      { label: "Muted Gray", color: "#6B7280" },
                      { label: "Slate", color: "#475569" },
                      { label: "Charcoal", color: "#1F2937" },
                      { label: "Hijau IGN", color: "#15803D" },
                      { label: "Navy", color: "#1E3A8A" },
                      { label: "Light Gray", color: "#9CA3AF" },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleFieldChange("shopeeSectionSubtitleColor", preset.color)}
                        className={cn(
                          "px-2 py-0.5 rounded border text-[10px] transition-all cursor-pointer flex items-center gap-1",
                          (data.shopeeSectionSubtitleColor || "#6B7280") === preset.color
                            ? "border-[#15803D] bg-emerald-50 text-[#15803D] dark:bg-emerald-950/40 dark:text-emerald-300 font-bold"
                            : "border-border bg-background hover:bg-muted text-foreground/80"
                        )}
                      >
                        <span
                          className="w-2 h-2 rounded-full border border-black/20"
                          style={{ backgroundColor: preset.color }}
                        />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pengaturan Kolom Grid Desktop */}
                <div className="p-4 rounded-[8px] bg-muted/40 border border-border space-y-3">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
                      <LayoutTemplate className="w-3.5 h-3.5 text-[#15803D]" />
                      Tampilan Kolom Grid Desktop
                    </span>
                    <span className="text-[10px] text-[#15803D] font-bold font-mono">
                      Aktif: {data.shopeeGridColumns || 6} Kolom Desktop
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pilih kepadatan kartu produk pada monitor/laptop desktop. Layar ponsel otomatis 2 kolom &amp; tablet 3-4 kolom agar selalu rapi.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {[
                      { cols: 6 as const, label: "6 Kolom (Standar Shopee)", desc: "Layout padat ala Shopee Mall / Figma resmi" },
                      { cols: 5 as const, label: "5 Kolom (Seimbang)", desc: "Ukuran kartu proporsional & ruang foto lega" },
                      { cols: 4 as const, label: "4 Kolom (Lebar & Besar)", desc: "Foto dan label promo terlihat paling menonjol" },
                    ].map((opt) => {
                      const isSelected = (data.shopeeGridColumns || 6) === opt.cols
                      return (
                        <button
                          key={opt.cols}
                          type="button"
                          onClick={() => handleFieldChange("shopeeGridColumns", opt.cols)}
                          className={cn(
                            "p-3 rounded-[6px] border text-left transition-all cursor-pointer flex flex-col gap-1",
                            isSelected
                              ? "bg-[#15803D]/10 border-[#15803D] ring-1 ring-[#15803D]"
                              : "bg-background border-border hover:border-border/80"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className={cn("text-xs font-bold", isSelected ? "text-[#15803D]" : "text-foreground")}>
                              {opt.label}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#15803D]" />}
                          </div>
                          <span className="text-[10px] text-muted-foreground leading-snug">{opt.desc}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Pengaturan Order Cepat via WhatsApp (Global Semua Produk) */}
                <div className="p-4 rounded-[8px] bg-muted/40 border border-emerald-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      Order Cepat via WhatsApp (Global Semua Produk)
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold font-mono bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                      Semua Produk
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Pengaturan nomor dan template pesan WhatsApp di bawah ini berlaku secara global untuk tombol <strong>Order Cepat via WhatsApp</strong> pada semua item produk di halaman Our Products.
                  </p>

                  {/* 1. Nomor WhatsApp */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                      <span>Nomor WhatsApp Pemesanan</span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Awali 62 atau 0 (misal: 6285877669199)
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={data.orderWhatsappNumber || ""}
                          placeholder="6285877669199"
                          onChange={(e) => handleFieldChange("orderWhatsappNumber", e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2 rounded-[5px] text-xs font-mono font-bold bg-background border border-border focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                      <a
                        href={`https://wa.me/${(data.orderWhatsappNumber || "6285877669199").replace(/[^0-9]/g, "").replace(/^0/, "62")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 text-xs font-semibold rounded-[5px] bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Tes Nomor</span>
                      </a>
                    </div>
                  </div>

                  {/* 2. Teks Tombol Order */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-foreground/80">
                      Teks Tombol Order WhatsApp
                    </label>
                    <input
                      type="text"
                      value={data.orderWhatsappButtonText || ""}
                      placeholder="Order Cepat via WhatsApp Official"
                      onChange={(e) => handleFieldChange("orderWhatsappButtonText", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-[5px] text-xs font-medium bg-background border border-border focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  {/* 3. Template Pesan WhatsApp */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-foreground/80">
                        Template Pesan WhatsApp Otomatis
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          handleFieldChange(
                            "orderWhatsappMessageTemplate",
                            "Halo CV. Indo Green Nature, saya ingin memesan produk: {product_name} ({product_price}). Mohon info ketersediaan stok & pengiriman."
                          )
                        }
                        className="text-[10px] text-emerald-600 hover:underline cursor-pointer"
                      >
                        Gunakan Template Standar
                      </button>
                    </div>
                    <AutoResizeTextarea
                      minHeight={65}
                      value={data.orderWhatsappMessageTemplate || ""}
                      placeholder="Halo CV. Indo Green Nature, saya ingin memesan produk: {product_name} ({product_price}). Mohon info ketersediaan stok & pengiriman."
                      onChange={(e) => handleFieldChange("orderWhatsappMessageTemplate", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-2 focus:ring-emerald-600 leading-relaxed font-sans"
                    />
                    <div className="flex items-center gap-2 flex-wrap text-[10px] text-muted-foreground pt-0.5">
                      <span className="font-semibold text-foreground/70">Variabel dinamis:</span>
                      <code className="px-1.5 py-0.5 bg-muted rounded font-mono text-emerald-600 font-bold border border-border">
                        {"{product_name}"}
                      </code>
                      <span>(Nama Produk)</span>
                      <code className="px-1.5 py-0.5 bg-muted rounded font-mono text-emerald-600 font-bold border border-border">
                        {"{product_price}"}
                      </code>
                      <span>(Harga Produk)</span>
                    </div>
                  </div>
                </div>

                {/* Banner Pintasan ke Menu Daftar Produk */}
                <div className="p-4 rounded-[8px] bg-emerald-500/10 dark:bg-emerald-950/20 border border-[#15803D]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#15803D]" />
                      <span>Item Produk Terdaftar ({data.shopeeProducts?.length || 0} Produk)</span>
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Kelola rincian item produk, foto, harga, diskon, dan opsi badge melalui menu terpisah.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("daftar_produk")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[5px] bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <span>Buka Menu Daftar Produk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ─── TAB 5: DAFTAR PRODUK (PENGELOLAAN ITEM PRODUK) ─── */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeTab === "daftar_produk" && (() => {
              const allProducts = data.shopeeProducts || []
              const filteredShopeeProducts = allProducts
                .map((product, originalIndex) => ({ product, originalIndex }))
                .filter(({ product }) => {
                  const q = productSearchQuery.toLowerCase().trim()
                  const matchName =
                    !q ||
                    product.name.toLowerCase().includes(q) ||
                    product.category.toLowerCase().includes(q) ||
                    (product.badge && product.badge.toLowerCase().includes(q))
                  const matchCategory =
                    productCategoryFilter === "all" || product.category === productCategoryFilter
                  return matchName && matchCategory
                })

              return (
                <div className="space-y-6 w-full">
                  <div>
                    <h3 className={cn("text-lg font-bold text-foreground", poppins.className)}>
                      Pengaturan Daftar Produk Pilihan Kami
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Kelola daftar produk, opsi badge display (Official Shop, Star+, Best Seller, dll), harga, upload cover, dan multi-foto modal 1:1 auto-slide.
                    </p>
                  </div>

                  {/* Header Action & Filter Pencarian Produk */}
                  <div className="space-y-3 pt-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <h4 className="text-xs font-bold text-foreground flex items-center gap-2 flex-wrap">
                          <span>Daftar Produk</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#15803D]/15 text-[#15803D] text-[10px] font-mono font-bold">
                            {data.shopeeProducts?.length || 0} Total
                          </span>
                        </h4>
                        <p className="text-[10px] text-muted-foreground">
                          Mode ringkas: membuka menu produk lain otomatis menutup menu produk sebelumnya.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Tombol Tutup Menu Accordion */}
                        <button
                          type="button"
                          onClick={() => setOpenProductAccordions([])}
                          disabled={openProductAccordions.length === 0}
                          className="px-2.5 py-1.5 rounded-[5px] border border-border bg-background hover:bg-muted text-[11px] font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                          title="Tutup menu produk yang sedang terbuka"
                        >
                          Tutup Menu
                        </button>

                        <button
                          type="button"
                          onClick={handleAddShopeeProduct}
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-[5px] bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Produk Baru</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Search & Category Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-2 items-center bg-muted/30 p-2 rounded-[6px] border border-border/80">
                      <div className="relative flex-1 w-full">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={productSearchQuery}
                          onChange={(e) => setProductSearchQuery(e.target.value)}
                          placeholder="Cari nama produk, kategori, atau badge..."
                          className="w-full pl-8 pr-7 py-1.5 rounded-[5px] border border-border bg-background text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                        />
                        {productSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setProductSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Filter Kategori */}
                      <div className="w-full sm:w-auto shrink-0 flex items-center gap-1.5">
                        <span className="text-[11px] text-muted-foreground font-semibold whitespace-nowrap">
                          Kategori:
                        </span>
                        <select
                          value={productCategoryFilter}
                          onChange={(e) => setProductCategoryFilter(e.target.value)}
                          className="px-2.5 py-1.5 rounded-[5px] border border-border bg-background text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                        >
                          <option value="all">Semua ({data.shopeeProducts?.length || 0})</option>
                          {availableCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Empty state bila filter pencarian tidak menemukan hasil */}
                  {filteredShopeeProducts.length === 0 && (
                    <div className="p-8 text-center rounded-[8px] border border-dashed border-border bg-muted/20 space-y-2">
                      <Search className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
                      <p className="text-xs font-semibold text-foreground">
                        Tidak ada produk yang cocok dengan pencarian &quot;{productSearchQuery}&quot;
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setProductSearchQuery("")
                          setProductCategoryFilter("all")
                        }}
                        className="text-[11px] text-[#15803D] hover:underline font-semibold cursor-pointer"
                      >
                        Reset Filter Pencarian
                      </button>
                    </div>
                  )}

                  {/* List Kartu Produk dengan Accordion Shadcn (Mode Single Compact: otomatis menutup menu produk lain) */}
                  <Accordion
                    value={openProductAccordions}
                    onValueChange={(val) => setOpenProductAccordions(val as string[])}
                    className="space-y-3"
                  >
                    {filteredShopeeProducts.map(({ product, originalIndex }) => {
                      const isUploadingCover = isUploadingProductCover === originalIndex
                      const isUploadingGallery = isUploadingProductGallery === originalIndex
                      const photosCount = product.images?.length || 1
                      const activePresetId = getActiveBadgePresetId(product)
                      const itemVal = product.id || String(originalIndex)

                      return (
                        <AccordionItem
                          key={product.id || originalIndex}
                          value={itemVal}
                          className="rounded-[8px] bg-card border border-border shadow-2xs hover:border-[#15803D]/60 transition-colors overflow-hidden"
                        >
                          {/* Header Bar Accordion: Trigger di kiri & Action Controls di kanan */}
                          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/20 hover:bg-muted/40 transition-colors gap-2">
                            <AccordionTrigger className="flex-1 py-1 hover:no-underline text-foreground cursor-pointer min-w-0 pr-2">
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <span className="w-6 h-6 rounded-full bg-[#15803D]/15 text-[#15803D] font-bold text-xs flex items-center justify-center shrink-0">
                                  {originalIndex + 1}
                                </span>

                                <div className="w-8 h-8 rounded-[4px] overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center">
                                  {product.image ? (
                                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <ImageIcon className="w-4 h-4 text-muted-foreground/60" />
                                  )}
                                </div>

                                <div className="flex flex-col text-left min-w-0 flex-1">
                                  <span className="text-xs font-bold text-foreground truncate max-w-[170px] sm:max-w-[280px] md:max-w-[380px]">
                                    {product.name || "Nama Produk Belum Diisi"}
                                  </span>
                                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground flex-wrap">
                                    <span className="px-1.5 py-0.2 rounded bg-muted font-medium">
                                      {product.category || "Tanpa Kategori"}
                                    </span>
                                    <span className="font-mono text-[#15803D] font-bold">
                                      {formatRupiahCurrency(product.price)}
                                    </span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                      <span className="font-mono text-muted-foreground line-through text-[9px]">
                                        {formatRupiahCurrency(product.originalPrice)}
                                      </span>
                                    )}
                                    {product.discount && (
                                      <span className="text-red-500 font-bold text-[9.5px]">
                                        {product.discount}
                                      </span>
                                    )}
                                    <span className="text-muted-foreground/70 hidden sm:inline">
                                      • {photosCount} foto
                                    </span>
                                    {((product.isCashbackXtra !== undefined
                                      ? product.isCashbackXtra
                                      : Boolean(product.tags?.some((t) => t.toLowerCase().includes("cashback")))) && (
                                      <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded text-[#EE4D2D] bg-[#EE4D2D]/10 border border-[#EE4D2D]/25 hidden md:inline">
                                        Cashback
                                      </span>
                                    ))}
                                    {((product.isGratisOngkir !== undefined
                                      ? product.isGratisOngkir
                                      : Boolean(product.tags?.some((t) => t.toLowerCase().includes("ongkir")))) && (
                                      <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded text-[#00897B] dark:text-[#26A69A] bg-[#00897B]/10 dark:bg-[#26A69A]/15 border border-[#00897B]/30 dark:border-[#26A69A]/30 hidden md:inline">
                                        Gratis Ongkir
                                      </span>
                                    ))}
                                    {getProductCustomTags(product).slice(0, 2).map((ct, idx) => (
                                      <span
                                        key={idx}
                                        className="text-[8.5px] font-bold px-1.5 py-0.2 rounded text-[#00897B] dark:text-[#26A69A] bg-[#00897B]/10 dark:bg-[#26A69A]/15 border border-[#00897B]/30 dark:border-[#26A69A]/30 hidden lg:inline"
                                      >
                                        {ct}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Live Pill Preview di Trigger */}
                                {product.badge && product.badge.trim() !== "" ? (
                                  <span
                                    className="text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs hidden md:flex items-center gap-1 uppercase tracking-wider shrink-0"
                                    style={{
                                      backgroundColor:
                                        product.badgeBgColor ||
                                        (product.badge.toLowerCase().includes("official")
                                          ? "#D0011B"
                                          : product.badge.toLowerCase().includes("star")
                                          ? "#EE4D2D"
                                          : product.badge.toLowerCase().includes("best") ||
                                            product.badge.toLowerCase().includes("terlaris")
                                          ? "#15803D"
                                          : product.badge.toLowerCase().includes("deal") ||
                                            product.badge.toLowerCase().includes("hot")
                                          ? "#9333EA"
                                          : product.badge.toLowerCase().includes("baru") ||
                                            product.badge.toLowerCase().includes("new")
                                          ? "#2563EB"
                                          : "#15803D"),
                                      color: product.badgeTextColor || "#FFFFFF",
                                    }}
                                  >
                                    {product.badge.toLowerCase().includes("star") ? (
                                      <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300 shrink-0" />
                                    ) : product.badge.toLowerCase().includes("official") ? (
                                      <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                                    ) : product.badge.toLowerCase().includes("deal") ||
                                      product.badge.toLowerCase().includes("hot") ? (
                                      <Flame className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                                    ) : product.badge.toLowerCase().includes("best") ||
                                      product.badge.toLowerCase().includes("terlaris") ? (
                                      <Award className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                                    ) : product.badge.toLowerCase().includes("baru") ||
                                      product.badge.toLowerCase().includes("new") ? (
                                      <Zap className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                                    ) : null}
                                    <span>{product.badge}</span>
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-medium text-muted-foreground px-1.5 py-0.5 rounded bg-muted/60 hidden lg:inline">
                                    Tanpa Badge
                                  </span>
                                )}
                              </div>
                            </AccordionTrigger>

                            {/* Tombol Aksi: Geser Urutan, Duplikat, Hapus (di luar trigger agar tidak men-toggle accordion) */}
                            <div className="flex items-center gap-1 shrink-0 ml-auto pl-1 border-l border-border/60">
                              <button
                                type="button"
                                onClick={() => handleMoveShopeeProduct(originalIndex, "up")}
                                disabled={originalIndex === 0}
                                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                                title="Geser Urutan Naik (Ke Atas)"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveShopeeProduct(originalIndex, "down")}
                                disabled={originalIndex === (data.shopeeProducts?.length || 0) - 1}
                                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                                title="Geser Urutan Turun (Ke Bawah)"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDuplicateShopeeProduct(originalIndex)}
                                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                title="Duplikat Produk Ini"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteShopeeProduct(originalIndex)}
                                className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                                title="Hapus Produk"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Isi Formulir Detail Edit Produk */}
                          <AccordionContent className="p-4 pt-4 border-t border-border/60 bg-background/50 space-y-4">

                          {/* ─── 1. IDENTITAS PRODUK: NAMA PRODUK & KATEGORI (PALING ATAS) ─── */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                            {/* Input Nama Produk (Paling Atas) */}
                            <div className="md:col-span-2 flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                                <Package className="w-3.5 h-3.5 text-[#15803D]" />
                                Nama Produk
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={product.name}
                                placeholder="Contoh: Minuman Serbuk Jahe Merah & Temulawak Premium"
                                onChange={(e) =>
                                  handleUpdateShopeeProduct(originalIndex, { name: e.target.value })
                                }
                                className="w-full px-3 py-2 rounded-[6px] border border-border bg-background text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-[#15803D] focus:border-[#15803D] transition-colors"
                              />
                              <span className="text-[9.5px] text-muted-foreground">
                                Nama produk yang ditampilkan pada etalase dan pop-up informasi.
                              </span>
                            </div>

                            {/* Dropdown Kategori Produk */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-[#15803D]" />
                                Kategori Produk
                              </label>
                              <div className="relative w-full">
                                <select
                                  value={product.category || ""}
                                  onChange={(e) => {
                                    const val = e.target.value
                                    if (val === "__custom__") {
                                      const customName = prompt(
                                        "Masukkan nama kategori baru:",
                                        product.category || ""
                                      )
                                      if (customName && customName.trim()) {
                                        handleUpdateShopeeProduct(originalIndex, {
                                          category: customName.trim(),
                                        })
                                      }
                                    } else {
                                      handleUpdateShopeeProduct(originalIndex, {
                                        category: val,
                                      })
                                    }
                                  }}
                                  className="w-full px-3 py-2 rounded-[6px] border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-[#15803D] focus:border-[#15803D] cursor-pointer appearance-none pr-8 transition-colors"
                                >
                                  <option value="" disabled>
                                    Pilih Kategori...
                                  </option>
                                  {product.category &&
                                    !availableCategories.includes(product.category) && (
                                      <option value={product.category}>
                                        {product.category} (Kategori Saat Ini)
                                      </option>
                                    )}
                                  {availableCategories.map((cat) => (
                                    <option key={cat} value={cat}>
                                      {cat}
                                    </option>
                                  ))}
                                  <option value="__custom__">
                                    + Tambah / Ketik Kategori Baru...
                                  </option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                              <span className="text-[9.5px] text-muted-foreground">
                                Pilih kategori dari dropdown atau tambah kustom.
                              </span>
                            </div>
                          </div>

                          {/* Deskripsi Produk (Tepat di bawah Nama Produk) */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-[#15803D]" />
                              Deskripsi Produk
                            </label>
                            <textarea
                              rows={4}
                              value={product.description || ""}
                              placeholder="Tuliskan deskripsi lengkap manfaat, kandungan herbal, atau cara konsumsi produk..."
                              onChange={(e) =>
                                handleUpdateShopeeProduct(originalIndex, { description: e.target.value })
                              }
                              className="w-full min-h-[96px] px-3 py-2 rounded-[6px] border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#15803D] focus:border-[#15803D] resize-y leading-relaxed transition-colors"
                            />
                            <span className="text-[9.5px] text-muted-foreground">
                              Deskripsi detail mengenai manfaat, kandungan herbal, atau cara konsumsi produk.
                            </span>
                          </div>

                          {/* ─── 2. HARGA JUAL - DISKON - HARGA CORET (DENGAN TOGGLE SWITCH DISKON) ─── */}
                          {(() => {
                            const hasDiscount = Boolean(
                              (product.discount && product.discount.trim() !== "") ||
                              (product.originalPrice && product.originalPrice > product.price)
                            )

                            return (
                              <div className="p-3.5 rounded-[7px] bg-muted/20 border border-border/80 space-y-3">
                                {/* Header Bar: Judul di kiri & Toggle Switch Diskon di kanan */}
                                <div className="flex items-center justify-between border-b border-border/50 pb-2 flex-wrap gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <Coins className="w-3.5 h-3.5 text-[#15803D]" />
                                    <span className="text-[11px] font-bold text-foreground">
                                      Penetapan Harga Produk
                                    </span>
                                  </div>

                                  {/* Toggle Switch Diskon */}
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={cn(
                                        "text-[10px] font-bold transition-colors select-none",
                                        hasDiscount ? "text-red-500" : "text-muted-foreground"
                                      )}
                                    >
                                      {hasDiscount ? "Promo Diskon Aktif" : "Diskon Nonaktif"}
                                    </span>
                                    <button
                                      type="button"
                                      role="switch"
                                      aria-checked={hasDiscount}
                                      onClick={() => handleToggleDiscount(originalIndex, !hasDiscount)}
                                      className={cn(
                                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-[#15803D]",
                                        hasDiscount
                                          ? "bg-red-500"
                                          : "bg-muted-foreground/30 hover:bg-muted-foreground/40"
                                      )}
                                      title={
                                        hasDiscount
                                          ? "Klik untuk menonaktifkan promo diskon"
                                          : "Klik untuk mengaktifkan promo diskon"
                                      }
                                    >
                                      <span
                                        className={cn(
                                          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                                          hasDiscount ? "translate-x-4" : "translate-x-0"
                                        )}
                                      />
                                    </button>
                                  </div>
                                </div>

                                {/* Banner Informasi Diskon jika Aktif */}
                                {hasDiscount && product.originalPrice && product.price && product.originalPrice > product.price && (
                                  <div className="flex items-center justify-between p-2 rounded-[5px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-[10px]">
                                    <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                                      <Tag className="w-3.5 h-3.5 text-red-500" />
                                      Hemat {formatRupiahCurrency(product.originalPrice - product.price)}
                                    </span>
                                    <span className="font-mono font-extrabold text-red-500 bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded shadow-2xs border border-red-200 dark:border-red-900">
                                      {product.discount || `-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%`}
                                    </span>
                                  </div>
                                )}

                                {/* Form Input Harga */}
                                {hasDiscount ? (
                                  /* Mode Diskon AKTIF: 3 Kolom (Harga Jual - Diskon - Harga Coret) */
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    {/* 1. Harga Jual (Rp) */}
                                    <div className="flex flex-col gap-1">
                                      <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-bold text-[#15803D] flex items-center gap-1">
                                          Harga Jual (Rp)
                                        </label>
                                        <span className="text-[9.5px] font-mono text-[#15803D] font-bold">
                                          {formatRupiahCurrency(product.price)}
                                        </span>
                                      </div>
                                      <ThousandCurrencyInput
                                        value={product.price}
                                        onChange={(newVal) =>
                                          handleUpdateShopeeProduct(originalIndex, {
                                            price: newVal || 0,
                                          })
                                        }
                                        placeholder="50.000"
                                        textColorClass="text-[#15803D] font-extrabold text-sm"
                                      />
                                      <span className="text-[9px] text-muted-foreground">
                                        Harga akhir yang dibayar pembeli.
                                      </span>
                                    </div>

                                    {/* 2. Diskon (%) */}
                                    <div className="flex flex-col gap-1">
                                      <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-bold text-red-500 flex items-center gap-1">
                                          <Tag className="w-3 h-3 text-red-500" />
                                          Diskon (%)
                                        </label>
                                        {product.discount && (
                                          <span className="text-[9.5px] font-bold text-red-500 font-mono">
                                            {product.discount}
                                          </span>
                                        )}
                                      </div>
                                      <div className="relative w-full">
                                        <input
                                          type="text"
                                          inputMode="numeric"
                                          value={
                                            product.discount
                                              ? product.discount.replace(/[^\d.]/g, "")
                                              : ""
                                          }
                                          placeholder="Contoh: 10"
                                          onChange={(e) =>
                                            handleApplyDiscountPercentage(
                                              originalIndex,
                                              e.target.value
                                            )
                                          }
                                          className="w-full pl-2.5 pr-7 py-1.5 rounded-[5px] border border-border bg-background text-xs font-bold text-red-500 focus:outline-none focus:ring-1 focus:ring-red-400 font-mono"
                                        />
                                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500 pointer-events-none">
                                          %
                                        </span>
                                      </div>
                                      <span className="text-[9px] text-muted-foreground">
                                        Tulis angka persen (cth: 10).
                                      </span>
                                    </div>

                                    {/* 3. Harga Coret (Rp) */}
                                    <div className="flex flex-col gap-1">
                                      <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-bold text-muted-foreground">
                                          Harga Coret (Rp)
                                        </label>
                                        {product.originalPrice ? (
                                          <span className="text-[9.5px] font-mono text-muted-foreground line-through">
                                            {formatRupiahCurrency(product.originalPrice)}
                                          </span>
                                        ) : (
                                          <span className="text-[9px] text-muted-foreground/70">
                                            Otomatis
                                          </span>
                                        )}
                                      </div>
                                      <ThousandCurrencyInput
                                        value={product.originalPrice}
                                        onChange={(newVal) =>
                                          handleUpdateShopeeProduct(originalIndex, {
                                            originalPrice: newVal,
                                          })
                                        }
                                        placeholder="Otomatis mengikuti harga jual"
                                        textColorClass="text-muted-foreground line-through"
                                      />
                                      <span className="text-[9px] text-muted-foreground">
                                        Harga normal sebelum diskon.
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  /* Mode Diskon NONAKTIF: Input Harga Jual Langsung */
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                      <label className="text-[11px] font-bold text-[#15803D] flex items-center gap-1">
                                        Harga Jual (Rp)
                                      </label>
                                      <span className="text-[9.5px] font-mono text-[#15803D] font-bold">
                                        {formatRupiahCurrency(product.price)}
                                      </span>
                                    </div>
                                    <ThousandCurrencyInput
                                      value={product.price}
                                      onChange={(newVal) =>
                                        handleUpdateShopeeProduct(originalIndex, {
                                          price: newVal || 0,
                                        })
                                      }
                                      placeholder="50.000"
                                      textColorClass="text-[#15803D] font-extrabold text-sm"
                                    />
                                    <span className="text-[9px] text-muted-foreground">
                                      Harga transaksi yang dibayar pembeli.
                                    </span>
                                  </div>
                                )}
                              </div>
                            )
                          })()}

                          {/* ─── 3. PENGATURAN BADGE DISPLAY (PRESET & KUSTOM) ─── */}
                          <div className="p-3.5 rounded-[6px] bg-muted/30 border border-border/80 space-y-3">
                            <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
                              <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                                <BadgeCheck className="w-3.5 h-3.5 text-[#15803D]" />
                                Pengaturan Opsi Badge Display Produk
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                Klik pilihan di bawah untuk mengganti badge secara instan
                              </span>
                            </div>

                            {/* Tombol Pilihan Preset Cepat */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                              {BADGE_PRESETS.map((preset) => {
                                const isCurrent = activePresetId === preset.id

                                return (
                                  <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => applyBadgePreset(originalIndex, preset)}
                                    className={cn(
                                      "px-2.5 py-1.5 rounded-[5px] text-[11px] font-semibold flex items-center gap-1.5 border transition-all cursor-pointer text-left justify-start",
                                      isCurrent
                                        ? "bg-[#15803D]/10 border-[#15803D] text-[#15803D] ring-1 ring-[#15803D] font-bold"
                                        : "bg-background border-border hover:border-border/80 text-foreground"
                                    )}
                                    title={preset.description}
                                  >
                                    {preset.iconType === "check" && (
                                      <span className="w-2.5 h-2.5 rounded-full bg-[#D0011B] flex items-center justify-center shrink-0">
                                        <Check className="w-2 h-2 text-white stroke-[3]" />
                                      </span>
                                    )}
                                    {preset.iconType === "star" && (
                                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500 shrink-0" />
                                    )}
                                    {preset.iconType === "award" && (
                                      <Award className="w-2.5 h-2.5 text-[#15803D] shrink-0" />
                                    )}
                                    {preset.iconType === "zap" && (
                                      <Zap className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                                    )}
                                    {preset.iconType === "flame" && (
                                      <Flame className="w-2.5 h-2.5 text-purple-600 shrink-0" />
                                    )}
                                    {preset.iconType === "palette" && (
                                      <Palette className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                                    )}
                                    {preset.iconType === "none" && (
                                      <X className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
                                    )}
                                    <span className="truncate">{preset.label}</span>
                                    {isCurrent && <Check className="w-3 h-3 ml-auto text-[#15803D] shrink-0" />}
                                  </button>
                                )
                              })}
                            </div>

                            {/* Kontrol Kustomisasi Badge: Teks, Warna Latar, dan Warna Teks */}
                            {product.badge && product.badge.trim() !== "" && (
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-border/40">
                                {/* Teks Label Badge */}
                                <div className="flex flex-col gap-1">
                                  <label className="text-[10px] font-semibold text-foreground/80">
                                    Teks Label Badge
                                  </label>
                                  <input
                                    type="text"
                                    value={product.badge || ""}
                                    placeholder="Official Shop, Star+, Best Seller..."
                                    onChange={(e) =>
                                      handleUpdateShopeeProduct(originalIndex, {
                                        badge: e.target.value,
                                        badgeType: "custom",
                                      })
                                    }
                                    className="w-full px-2.5 py-1.5 rounded-[5px] border border-border bg-background text-xs font-bold"
                                  />
                                </div>

                                {/* Warna Background Badge */}
                                <div className="flex flex-col gap-1">
                                  <label className="text-[10px] font-semibold text-foreground/80">
                                    Warna Background Badge
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={toSafeHexColor(product.badgeBgColor, "#D0011B")}
                                      onChange={(e) =>
                                        handleUpdateShopeeProduct(originalIndex, {
                                          badgeBgColor: e.target.value,
                                          badgeType: "custom",
                                        })
                                      }
                                      className="w-7 h-7 rounded border border-border cursor-pointer p-0.5 bg-background shrink-0"
                                    />
                                    <input
                                      type="text"
                                      value={product.badgeBgColor || "#D0011B"}
                                      onChange={(e) =>
                                        handleUpdateShopeeProduct(originalIndex, {
                                          badgeBgColor: e.target.value,
                                          badgeType: "custom",
                                        })
                                      }
                                      className="flex-1 px-2 py-1 rounded-[4px] border border-border bg-background font-mono text-xs uppercase"
                                      placeholder="#D0011B"
                                    />
                                  </div>
                                </div>

                                {/* Warna Teks Badge */}
                                <div className="flex flex-col gap-1">
                                  <label className="text-[10px] font-semibold text-foreground/80">
                                    Warna Teks Badge
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={toSafeHexColor(product.badgeTextColor, "#FFFFFF")}
                                      onChange={(e) =>
                                        handleUpdateShopeeProduct(originalIndex, {
                                          badgeTextColor: e.target.value,
                                          badgeType: "custom",
                                        })
                                      }
                                      className="w-7 h-7 rounded border border-border cursor-pointer p-0.5 bg-background shrink-0"
                                    />
                                    <input
                                      type="text"
                                      value={product.badgeTextColor || "#FFFFFF"}
                                      onChange={(e) =>
                                        handleUpdateShopeeProduct(originalIndex, {
                                          badgeTextColor: e.target.value,
                                          badgeType: "custom",
                                        })
                                      }
                                      className="flex-1 px-2 py-1 rounded-[4px] border border-border bg-background font-mono text-xs uppercase"
                                      placeholder="#FFFFFF"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* ─── 4. OPSI VOUCHER & PROMO (CASHBACK XTRA & GRATIS ONGKIR) ─── */}
                          {(() => {
                            const isCashbackActive =
                              product.isCashbackXtra !== undefined
                                ? product.isCashbackXtra
                                : Boolean(product.tags?.some((t) => t.toLowerCase().includes("cashback")))
                            const isGratisOngkirActive =
                              product.isGratisOngkir !== undefined
                                ? product.isGratisOngkir
                                : Boolean(product.tags?.some((t) => t.toLowerCase().includes("ongkir")))
                            const customTags = getProductCustomTags(product)

                            return (
                              <div className="p-3.5 rounded-[6px] bg-muted/25 border border-border/80 space-y-3">
                                <div className="flex items-center justify-between border-b border-border/50 pb-1.5 flex-wrap gap-1">
                                  <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                                    <Tag className="w-3.5 h-3.5 text-[#15803D]" />
                                    Opsi Voucher &amp; Tag Kustom Produk
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    Voucher Shopee &amp; tag kustom (BPOM TR, Beauty, dll)
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  {/* Toggle Card 1: Cashback Xtra */}
                                  <div
                                    className={cn(
                                      "p-2.5 rounded-[6px] border transition-all flex items-center justify-between gap-3",
                                      isCashbackActive
                                        ? "bg-[#EE4D2D]/5 border-[#EE4D2D]/40 shadow-2xs"
                                        : "bg-background border-border/80 hover:border-border"
                                    )}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span
                                        className={cn(
                                          "text-[10px] font-extrabold px-2 py-0.5 rounded-[3px] border tracking-tight shrink-0 select-none",
                                          isCashbackActive
                                            ? "border-[#EE4D2D]/60 text-[#EE4D2D] bg-[#EE4D2D]/10"
                                            : "border-border text-muted-foreground bg-muted/50"
                                        )}
                                      >
                                        Cashback Xtra
                                      </span>
                                      <div className="flex flex-col min-w-0">
                                        <span className="text-[10.5px] font-semibold text-foreground truncate">
                                          Cashback Xtra
                                        </span>
                                        <span className="text-[9px] text-muted-foreground truncate">
                                          {isCashbackActive ? "Label voucher aktif" : "Nonaktif"}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Saklar Toggle ON/OFF */}
                                    <button
                                      type="button"
                                      role="switch"
                                      aria-checked={isCashbackActive}
                                      onClick={() => handleToggleCashbackXtra(originalIndex, !isCashbackActive)}
                                      className={cn(
                                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-[#EE4D2D]",
                                        isCashbackActive ? "bg-[#EE4D2D]" : "bg-muted-foreground/30"
                                      )}
                                      title={isCashbackActive ? "Matikan Cashback Xtra" : "Aktifkan Cashback Xtra"}
                                    >
                                      <span
                                        className={cn(
                                          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                                          isCashbackActive ? "translate-x-4" : "translate-x-0"
                                        )}
                                      />
                                    </button>
                                  </div>

                                  {/* Toggle Card 2: Gratis Ongkir */}
                                  <div
                                    className={cn(
                                      "p-2.5 rounded-[6px] border transition-all flex items-center justify-between gap-3",
                                      isGratisOngkirActive
                                        ? "bg-[#00897B]/5 dark:bg-[#26A69A]/10 border-[#00897B]/40 dark:border-[#26A69A]/40 shadow-2xs"
                                        : "bg-background border-border/80 hover:border-border"
                                    )}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span
                                        className={cn(
                                          "text-[10px] font-extrabold px-2 py-0.5 rounded-[3px] border tracking-tight shrink-0 select-none",
                                          isGratisOngkirActive
                                            ? "border-[#00897B]/60 dark:border-[#26A69A]/60 text-[#00897B] dark:text-[#26A69A] bg-[#00897B]/10 dark:bg-[#26A69A]/15"
                                            : "border-border text-muted-foreground bg-muted/50"
                                        )}
                                      >
                                        Gratis Ongkir
                                      </span>
                                      <div className="flex flex-col min-w-0">
                                        <span className="text-[10.5px] font-semibold text-foreground truncate">
                                          Gratis Ongkir
                                        </span>
                                        <span className="text-[9px] text-muted-foreground truncate">
                                          {isGratisOngkirActive ? "Label voucher aktif" : "Nonaktif"}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Saklar Toggle ON/OFF */}
                                    <button
                                      type="button"
                                      role="switch"
                                      aria-checked={isGratisOngkirActive}
                                      onClick={() => handleToggleGratisOngkir(originalIndex, !isGratisOngkirActive)}
                                      className={cn(
                                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-[#00897B]",
                                        isGratisOngkirActive ? "bg-[#00897B] dark:bg-[#26A69A]" : "bg-muted-foreground/30"
                                      )}
                                      title={isGratisOngkirActive ? "Matikan Gratis Ongkir" : "Aktifkan Gratis Ongkir"}
                                    >
                                      <span
                                        className={cn(
                                          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                                          isGratisOngkirActive ? "translate-x-4" : "translate-x-0"
                                        )}
                                      />
                                    </button>
                                  </div>
                                </div>

                                {/* ─── Tag / Badge Kustom Tambahan (Beauty, BPOM TR, dll) ─── */}
                                <div className="pt-2.5 border-t border-border/50 space-y-2">
                                  <div className="flex items-center justify-between flex-wrap gap-1">
                                    <label className="text-[10.5px] font-bold text-foreground flex items-center gap-1.5">
                                      <Tag className="w-3.5 h-3.5 text-[#00897B]" />
                                      Badge / Tag Kustom Tambahan
                                    </label>
                                    <span className="text-[9.5px] text-muted-foreground">
                                      Bisa atur bebas teks (misal: BPOM TR, Beauty, Halal, Alami)
                                    </span>
                                  </div>

                                  {/* Chip Tag Kustom yang sedang Aktif */}
                                  <div className="flex flex-wrap items-center gap-1.5 min-h-[32px] p-2 rounded-[5px] bg-background border border-border">
                                    {customTags.length > 0 ? (
                                      customTags.map((tag, tIdx) => (
                                        <span
                                          key={tIdx}
                                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-[#00897B]/10 dark:bg-[#26A69A]/15 text-[#00897B] dark:text-[#26A69A] border border-[#00897B]/30 dark:border-[#26A69A]/30"
                                        >
                                          <span>{tag}</span>
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveCustomTag(originalIndex, tag)}
                                            className="hover:text-red-500 rounded p-0.5 cursor-pointer transition-colors"
                                            title={`Hapus tag ${tag}`}
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-[10px] text-muted-foreground italic">
                                        Belum ada tag kustom. Ketik di bawah atau klik pilihan cepat.
                                      </span>
                                    )}
                                  </div>

                                  {/* Input Teks untuk Tambah Tag Kustom */}
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={customTagInputs[originalIndex] || ""}
                                      placeholder="Ketik tag kustom (cth: BPOM TR, Beauty, Halal, 100% Herbal)..."
                                      onChange={(e) =>
                                        setCustomTagInputs((prev) => ({
                                          ...prev,
                                          [originalIndex]: e.target.value,
                                        }))
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault()
                                          const val = customTagInputs[originalIndex] || ""
                                          if (val.trim()) {
                                            handleAddCustomTag(originalIndex, val)
                                            setCustomTagInputs((prev) => ({
                                              ...prev,
                                              [originalIndex]: "",
                                            }))
                                          }
                                        }
                                      }}
                                      className="flex-1 px-2.5 py-1.5 rounded-[5px] border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-[#00897B] transition-colors"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const val = customTagInputs[originalIndex] || ""
                                        if (val.trim()) {
                                          handleAddCustomTag(originalIndex, val)
                                          setCustomTagInputs((prev) => ({
                                            ...prev,
                                            [originalIndex]: "",
                                          }))
                                        }
                                      }}
                                      disabled={!(customTagInputs[originalIndex] || "").trim()}
                                      className="px-3 py-1.5 rounded-[5px] bg-[#00897B] hover:bg-[#00796B] disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>Tambah Tag</span>
                                    </button>
                                  </div>

                                  {/* Saran Tag Cepat (Quick Presets) */}
                                  <div className="flex items-center gap-1 flex-wrap pt-0.5">
                                    <span className="text-[9.5px] text-muted-foreground font-semibold mr-1">
                                      Pilihan Cepat:
                                    </span>
                                    {POPULAR_CUSTOM_TAGS.map((pTag) => {
                                      const isAdded = customTags.some(
                                        (t) => t.toLowerCase() === pTag.toLowerCase()
                                      )
                                      return (
                                        <button
                                          key={pTag}
                                          type="button"
                                          onClick={() => {
                                            if (isAdded) {
                                              handleRemoveCustomTag(originalIndex, pTag)
                                            } else {
                                              handleAddCustomTag(originalIndex, pTag)
                                            }
                                          }}
                                          className={cn(
                                            "text-[9px] font-semibold px-2 py-0.5 rounded-[3px] border transition-colors cursor-pointer flex items-center gap-1",
                                            isAdded
                                              ? "bg-[#00897B] text-white border-[#00897B]"
                                              : "bg-background text-muted-foreground hover:text-foreground border-border hover:border-border/80"
                                          )}
                                        >
                                          {isAdded && <Check className="w-2.5 h-2.5" />}
                                          <span>{pTag}</span>
                                        </button>
                                      )
                                    })}
                                  </div>
                                </div>
                              </div>
                            )
                          })()}

                          {/* Metriks: Terjual, Rating, Lokasi */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-semibold text-foreground/80">Terjual</label>
                              <input
                                type="text"
                                value={product.soldCount}
                                placeholder="10RB+ Terjual"
                                onChange={(e) =>
                                  handleUpdateShopeeProduct(originalIndex, { soldCount: e.target.value })
                                }
                                className="w-full px-2.5 py-1.5 rounded-[5px] border border-border bg-background text-xs"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-semibold text-foreground/80">
                                Rating (1.0 - 5.0)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                min="1"
                                max="5"
                                value={product.rating || 4.9}
                                onChange={(e) =>
                                  handleUpdateShopeeProduct(originalIndex, {
                                    rating: parseFloat(e.target.value) || 4.9,
                                  })
                                }
                                className="w-full px-2.5 py-1.5 rounded-[5px] border border-border bg-background font-mono text-xs font-bold text-amber-500"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-semibold text-foreground/80">
                                Lokasi Pengiriman
                              </label>
                              <input
                                type="text"
                                value={product.location || "D.I. Yogyakarta"}
                                onChange={(e) =>
                                  handleUpdateShopeeProduct(originalIndex, { location: e.target.value })
                                }
                                className="w-full px-2.5 py-1.5 rounded-[5px] border border-border bg-background text-xs"
                              />
                            </div>
                          </div>

                          {/* Foto Utama & Galeri Pop-Up Modal */}
                          <div className="p-3 rounded-[6px] bg-muted/30 border border-border/80 space-y-3">
                            <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
                              <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5 text-[#15803D]" />
                                Foto Produk &amp; Galeri Pop-up Modal 1:1
                              </span>
                              <span className="text-[10px] font-mono font-bold text-[#15803D]">
                                {photosCount} Foto Terpasang
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                              {/* Preview Cover & Info Foto */}
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="relative w-16 h-16 rounded-[6px] overflow-hidden border border-border shrink-0 bg-muted">
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                  />
                                  {isUploadingCover && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col text-[10px] text-muted-foreground">
                                  <span className="font-semibold text-foreground">Foto Produk (1:1)</span>
                                  <span>Format WebP, JPG, PNG</span>
                                </div>
                              </div>

                              {/* Tombol Aksi di Pojok Kanan */}
                              <div className="flex items-center gap-2 ml-auto shrink-0 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => triggerUploadProductCover(originalIndex)}
                                  disabled={isUploadingCover}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-[#15803D] hover:bg-[#166534] text-white text-[11px] font-semibold cursor-pointer shadow-2xs disabled:opacity-50 transition-colors"
                                  title="Unggah Foto Produk"
                                >
                                  {isUploadingCover ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Upload className="w-3.5 h-3.5" />
                                  )}
                                  <span>Unggah Foto</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => triggerUploadProductGallery(originalIndex)}
                                  disabled={isUploadingGallery}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-foreground border border-border text-[11px] font-semibold cursor-pointer shadow-2xs disabled:opacity-50 transition-colors"
                                  title="Tambah Foto Produk"
                                >
                                  {isUploadingGallery ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#15803D]" />
                                  ) : (
                                    <Plus className="w-3.5 h-3.5 text-[#15803D]" />
                                  )}
                                  <span>+ Tambah Foto</span>
                                </button>
                              </div>
                            </div>

                            {/* ─── DAFTAR FOTO TERPISAH (INDIVIDUAL PHOTO ITEMS) ─── */}
                            {(() => {
                              const currentImages = (product.images && product.images.length > 0
                                ? product.images
                                : [product.image]
                              ).filter((img) => typeof img === "string")

                              return (
                                <div className="space-y-2 pt-2 border-t border-border/50">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[10.5px] font-bold text-foreground flex items-center gap-1.5">
                                      <ImageIcon className="w-3.5 h-3.5 text-[#15803D]" />
                                      Daftar Foto Produk ({currentImages.length} Foto Terdaftar)
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => handleAddProductImageSlot(originalIndex)}
                                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#15803D] hover:text-[#166534] hover:underline cursor-pointer"
                                      title="Tambah baris URL foto baru"
                                    >
                                      <Plus className="w-3 h-3" />
                                      <span>+ Tambah URL Foto</span>
                                    </button>
                                  </div>

                                  {/* List per Item Foto Terpisah */}
                                  <div className="space-y-1.5">
                                    {currentImages.map((imgUrl, imgIdx) => {
                                      const isMainCover = imgIdx === 0

                                      return (
                                        <div
                                          key={imgIdx}
                                          className="p-2 rounded-[6px] bg-background border border-border/80 flex items-center gap-2.5 hover:border-border transition-colors group shadow-2xs"
                                        >
                                          {/* Preview Miniatur Foto Persegi (1:1) */}
                                          <div className="relative w-11 h-11 rounded-[4px] overflow-hidden border border-border shrink-0 bg-muted flex items-center justify-center">
                                            {imgUrl && imgUrl.trim() !== "" ? (
                                              <img
                                                src={imgUrl}
                                                alt={`Foto ${imgIdx + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                  e.currentTarget.style.display = "none"
                                                }}
                                              />
                                            ) : (
                                              <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
                                            )}
                                          </div>

                                          {/* Tag Nomor & Input URL Mandiri */}
                                          <div className="flex-1 min-w-0 flex flex-col gap-1">
                                            <div className="flex items-center justify-between gap-1">
                                              <div className="flex items-center gap-1.5">
                                                <span
                                                  className={cn(
                                                    "text-[9px] font-bold px-1.5 py-0.2 rounded font-mono uppercase tracking-wider",
                                                    isMainCover
                                                      ? "bg-[#15803D]/15 text-[#15803D] border border-[#15803D]/30"
                                                      : "bg-muted text-muted-foreground"
                                                  )}
                                                >
                                                  {isMainCover ? "Foto 1 (Utama)" : `Foto ${imgIdx + 1}`}
                                                </span>
                                                {isMainCover && (
                                                  <span className="text-[9px] text-muted-foreground hidden sm:inline">
                                                    • Ditampilkan pada thumbnail etalase &amp; slide pertama
                                                  </span>
                                                )}
                                              </div>
                                            </div>

                                            <input
                                              type="text"
                                              value={imgUrl}
                                              placeholder="https://ivtpcjwwenjdatxxtjqm.supabase.co/..."
                                              onChange={(e) =>
                                                handleUpdateProductImageAt(originalIndex, imgIdx, e.target.value)
                                              }
                                              className="w-full px-2 py-1 rounded-[4px] border border-border bg-background font-mono text-[10px] text-foreground focus:outline-none focus:ring-1 focus:ring-[#15803D] transition-colors"
                                            />
                                          </div>

                                          {/* Tombol Kontrol: Geser Naik, Geser Turun, Hapus */}
                                          <div className="flex items-center gap-0.5 shrink-0 pl-1 border-l border-border/60">
                                            <button
                                              type="button"
                                              onClick={() => handleMoveProductImageAt(originalIndex, imgIdx, "up")}
                                              disabled={imgIdx === 0}
                                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                                              title="Geser Urutan Naik"
                                            >
                                              <ChevronUp className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => handleMoveProductImageAt(originalIndex, imgIdx, "down")}
                                              disabled={imgIdx === currentImages.length - 1}
                                              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                                              title="Geser Urutan Turun"
                                            >
                                              <ChevronDown className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => handleRemoveProductImageAt(originalIndex, imgIdx)}
                                              disabled={currentImages.length <= 1}
                                              className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-muted-foreground hover:text-red-500 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                                              title="Hapus Foto Ini"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )
                            })()}
                          </div>

                          {/* Link Marketplace (Shopee, Tokopedia, Lazada, TikTok) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-semibold text-muted-foreground">Link Shopee</label>
                              <input
                                type="text"
                                value={product.shopeeUrl || ""}
                                placeholder="https://shopee.co.id/..."
                                onChange={(e) =>
                                  handleUpdateShopeeProduct(originalIndex, { shopeeUrl: e.target.value })
                                }
                                className="w-full px-2 py-1 rounded-[4px] border border-border bg-background text-[10px] font-mono"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-semibold text-muted-foreground">Link Tokopedia</label>
                              <input
                                type="text"
                                value={product.tokopediaUrl || ""}
                                placeholder="https://tokopedia.com/..."
                                onChange={(e) =>
                                  handleUpdateShopeeProduct(originalIndex, { tokopediaUrl: e.target.value })
                                }
                                className="w-full px-2 py-1 rounded-[4px] border border-border bg-background text-[10px] font-mono"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-semibold text-muted-foreground">Link Lazada</label>
                              <input
                                type="text"
                                value={product.lazadaUrl || ""}
                                placeholder="https://lazada.co.id/..."
                                onChange={(e) =>
                                  handleUpdateShopeeProduct(originalIndex, { lazadaUrl: e.target.value })
                                }
                                className="w-full px-2 py-1 rounded-[4px] border border-border bg-background text-[10px] font-mono"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-semibold text-muted-foreground">Link TikTok Shop</label>
                              <input
                                type="text"
                                value={product.tiktokUrl || ""}
                                placeholder="https://tiktok.com/..."
                                onChange={(e) =>
                                  handleUpdateShopeeProduct(originalIndex, { tiktokUrl: e.target.value })
                                }
                                className="w-full px-2 py-1 rounded-[4px] border border-border bg-background text-[10px] font-mono"
                              />
                            </div>
                          </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </div>
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
