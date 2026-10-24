"use client"

import * as React from "react"
import {
  X,
  SlidersHorizontal,
  Save,
  RotateCcw,
  Eye,
  Check,
  Building2,
  Target,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ImageIcon,
  Video,
  Type,
  Palette,
  Upload,
  Trash2,
  Loader2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  Plus,
  BadgeCheck,
  PhoneCall,
} from "lucide-react"
import { uploadMedia } from "@/lib/storage"
import { poppins, outfit, HERO_FONTS, getHeroFontClass } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import {
  AboutSettingsData,
  DEFAULT_ABOUT_SETTINGS,
  ABOUT_SETTINGS_KEY,
  ABOUT_PREVIEW_CHANNEL,
} from "@/lib/about-settings"

export type { AboutSettingsData }
export { DEFAULT_ABOUT_SETTINGS, ABOUT_SETTINGS_KEY }

interface AboutSettingsSidebarProps {
  isOpen: boolean
  onClose: () => void
  data: AboutSettingsData
  onChange: (updated: AboutSettingsData) => void
  onSave: () => void
  onReset: () => void
  onScrollToSection: (sectionId: string) => void
  isSaving?: boolean
}

interface AutoResizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  minHeight?: number
}

function AutoResizeTextarea({
  value,
  onChange,
  className,
  minHeight = 100,
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

/**
 * Memastikan nilai untuk input type="color" selalu berformat hex valid "#rrggbb" (7 karakter).
 * Mencegah warning browser HTML5: "The specified value ... does not conform to the required format."
 */
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

type TabKey =
  | "banner"
  | "profile"
  | "visi_misi"
  | "rekam_jejak"
  | "prinsip_kerja"
  | "jangkauan_distribusi"
  | "legalitas"
  | "konsultasi_brand"

export function AboutSettingsSidebar({
  isOpen,
  onClose,
  data,
  onChange,
  onSave,
  onReset,
  onScrollToSection,
  isSaving = false,
}: AboutSettingsSidebarProps) {
  const [activeTab, setActiveTab] = React.useState<TabKey>("banner")
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState<boolean>(false)

  // Upload Foto Media Kartu Legalitas 1:1
  const legalitasFileInputRef = React.useRef<HTMLInputElement>(null)
  const [legalitasTargetIndex, setLegalitasTargetIndex] = React.useState<number | null>(null)
  const [isUploadingLegalitas, setIsUploadingLegalitas] = React.useState<boolean>(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingPhoto(true)
    try {
      // 1. Coba upload ke Supabase Storage (bucket media/about_us)
      let photoUrl: string | null = null
      try {
        photoUrl = await uploadMedia(file, "about_us")
      } catch (err) {
        console.warn("[AboutSettings] Upload Supabase gagal, beralih ke fallback base64:", err)
      }

      // 2. Fallback ke Data URL Base64 jika storage offline
      if (!photoUrl) {
        photoUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      if (photoUrl) {
        handleFieldChange("bannerImage", photoUrl)
      }
    } catch (error) {
      console.error("[AboutSettings] Gagal memproses file foto:", error)
    } finally {
      setIsUploadingPhoto(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const videoThumbInputRef = React.useRef<HTMLInputElement>(null)
  const [isUploadingThumb, setIsUploadingThumb] = React.useState<boolean>(false)

  const handleVideoThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingThumb(true)
    try {
      // 1. Coba upload ke Supabase Storage (bucket media/about_us)
      let photoUrl: string | null = null
      try {
        photoUrl = await uploadMedia(file, "about_us")
      } catch (err) {
        console.warn("[AboutSettings] Upload Supabase thumbnail gagal, beralih ke fallback base64:", err)
      }

      // 2. Fallback ke Data URL Base64 jika storage offline
      if (!photoUrl) {
        photoUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      if (photoUrl) {
        handleFieldChange("profilVideoThumb", photoUrl)
      }
    } catch (error) {
      console.error("[AboutSettings] Gagal memproses file thumbnail video:", error)
    } finally {
      setIsUploadingThumb(false)
      if (videoThumbInputRef.current) {
        videoThumbInputRef.current.value = ""
      }
    }
  }

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
  const broadcastPreviewUpdate = (updated: AboutSettingsData) => {
    onChange(updated)

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(ABOUT_SETTINGS_KEY, JSON.stringify(updated))
      } catch {
        // ignore
      }

      try {
        if (typeof BroadcastChannel !== "undefined") {
          const bc = new BroadcastChannel(ABOUT_PREVIEW_CHANNEL)
          bc.postMessage({ type: "PREVIEW_UPDATE", data: updated })
          bc.close()
        }
      } catch {
        // ignore
      }
    }
  }

  const handleFieldChange = <K extends keyof AboutSettingsData>(
    field: K,
    val: AboutSettingsData[K]
  ) => {
    broadcastPreviewUpdate({
      ...data,
      [field]: val,
    })
  }

  const handleMisiChange = (index: number, subField: "title" | "desc" | "num", text: string) => {
    const updatedMisi = [...data.misiItems]
    updatedMisi[index] = {
      ...updatedMisi[index],
      [subField]: text,
    }
    broadcastPreviewUpdate({
      ...data,
      misiItems: updatedMisi,
    })
  }

  const handleAddMisiItem = () => {
    const nextNum = String(data.misiItems.length + 1).padStart(2, "0")
    const newMisi = [
      ...data.misiItems,
      {
        num: nextNum,
        title: "Komitmen Baru",
        desc: "Deskripsi komitmen manufaktur atau pelayanan yang kami berikan.",
      },
    ]
    broadcastPreviewUpdate({
      ...data,
      misiItems: newMisi,
    })
  }

  const handleRemoveMisiItem = (index: number) => {
    if (data.misiItems.length <= 1) return
    const newMisi = data.misiItems.filter((_, i) => i !== index)
    broadcastPreviewUpdate({
      ...data,
      misiItems: newMisi,
    })
  }

  const handlePillarChange = (index: number, text: string) => {
    const currentPillars =
      data.visiPillars && data.visiPillars.length > 0
        ? [...data.visiPillars]
        : ["Standar Mutu Farmasi", "Inovasi Alami", "Orientasi Global"]
    currentPillars[index] = text
    broadcastPreviewUpdate({
      ...data,
      visiPillars: currentPillars,
    })
  }

  const handleAddPillar = () => {
    const currentPillars =
      data.visiPillars && data.visiPillars.length > 0
        ? [...data.visiPillars]
        : ["Standar Mutu Farmasi", "Inovasi Alami", "Orientasi Global"]
    broadcastPreviewUpdate({
      ...data,
      visiPillars: [...currentPillars, "Pilar Baru"],
    })
  }

  const handleRemovePillar = (index: number) => {
    const currentPillars =
      data.visiPillars && data.visiPillars.length > 0
        ? [...data.visiPillars]
        : ["Standar Mutu Farmasi", "Inovasi Alami", "Orientasi Global"]
    if (currentPillars.length <= 1) return
    broadcastPreviewUpdate({
      ...data,
      visiPillars: currentPillars.filter((_, i) => i !== index),
    })
  }

  const handleMilestoneChange = (
    index: number,
    subField: "year" | "title" | "desc",
    text: string
  ) => {
    const current =
      data.rekamJejakMilestones && data.rekamJejakMilestones.length > 0
        ? [...data.rekamJejakMilestones]
        : [
          { year: "2000", title: "Awal Berdiri di Yogyakarta", desc: "Memulai kiprah sebagai produsen pengolahan simplisia herbal murni." },
          { year: "2008", title: "Ekspansi Pabrik Wates", desc: "Pembangunan fasilitas pabrik mandiri di Wates, Kulon Progo." },
          { year: "2015", title: "Sertifikasi CPOTB Penuh", desc: "Modernisasi mesin produksi otomatis kapsul dan sediaan cair." },
          { year: "2020", title: "Maklon One-Stop Solution", desc: "Meluncurkan program kemitraan maklon terpadu bagi brand owner." },
          { year: "2024", title: "Standar ISO & Halal", desc: "Meraih sertifikasi ISO 22000 dan sertifikasi Halal BPJPH." },
        ]
    current[index] = {
      ...current[index],
      [subField]: text,
    }
    broadcastPreviewUpdate({
      ...data,
      rekamJejakMilestones: current,
    })
  }

  const handleAddMilestone = () => {
    const current =
      data.rekamJejakMilestones && data.rekamJejakMilestones.length > 0
        ? [...data.rekamJejakMilestones]
        : [
          { year: "2000", title: "Awal Berdiri di Yogyakarta", desc: "Memulai kiprah sebagai produsen pengolahan simplisia herbal murni." },
          { year: "2008", title: "Ekspansi Pabrik Wates", desc: "Pembangunan fasilitas pabrik mandiri di Wates, Kulon Progo." },
          { year: "2015", title: "Sertifikasi CPOTB Penuh", desc: "Modernisasi mesin produksi otomatis kapsul dan sediaan cair." },
          { year: "2020", title: "Maklon One-Stop Solution", desc: "Meluncurkan program kemitraan maklon terpadu bagi brand owner." },
          { year: "2024", title: "Standar ISO & Halal", desc: "Meraih sertifikasi ISO 22000 dan sertifikasi Halal BPJPH." },
        ]
    const lastYear = parseInt(current[current.length - 1]?.year || "2024", 10)
    const nextYear = isNaN(lastYear) ? "2025" : String(lastYear + 1)
    broadcastPreviewUpdate({
      ...data,
      rekamJejakMilestones: [
        ...current,
        {
          year: nextYear,
          title: "Tonggak Pencapaian Baru",
          desc: "Tuliskan catatan pencapaian, inovasi fasilitas, atau sertifikasi yang berhasil diraih.",
        },
      ],
    })
  }

  const handleRemoveMilestone = (index: number) => {
    const current =
      data.rekamJejakMilestones && data.rekamJejakMilestones.length > 0
        ? [...data.rekamJejakMilestones]
        : [
          { year: "2000", title: "Awal Berdiri di Yogyakarta", desc: "Memulai kiprah sebagai produsen pengolahan simplisia herbal murni." },
          { year: "2008", title: "Ekspansi Pabrik Wates", desc: "Pembangunan fasilitas pabrik mandiri di Wates, Kulon Progo." },
          { year: "2015", title: "Sertifikasi CPOTB Penuh", desc: "Modernisasi mesin produksi otomatis kapsul dan sediaan cair." },
          { year: "2020", title: "Maklon One-Stop Solution", desc: "Meluncurkan program kemitraan maklon terpadu bagi brand owner." },
          { year: "2024", title: "Standar ISO & Halal", desc: "Meraih sertifikasi ISO 22000 dan sertifikasi Halal BPJPH." },
        ]
    if (current.length <= 1) return
    broadcastPreviewUpdate({
      ...data,
      rekamJejakMilestones: current.filter((_, i) => i !== index),
    })
  }

  const handlePrinsipItemChange = (
    index: number,
    subField: "title" | "desc",
    text: string
  ) => {
    const current =
      data.prinsipKerjaItems && data.prinsipKerjaItems.length > 0
        ? [...data.prinsipKerjaItems]
        : [
          {
            title: "Integritas & Kerahasiaan (NDA)",
            desc: "Jaminan 100% perlindungan kerahasiaan formula, resep, dan strategi bisnis milik setiap mitra klien tanpa pernah dibocorkan.",
          },
          {
            title: "Kualitas Tanpa Kompromi",
            desc: "Bebas dari Bahan Kimia Obat (BKO), teruji bebas cemaran logam berat dan bakteri berbahaya melalui protokol lab berlapis.",
          },
          {
            title: "Inovasi Formula Efektif",
            desc: "Kombinasi herbal sinergis berbasis literatur ilmiah modern yang aman dikonsumsi jangka panjang dan terbukti khasiatnya.",
          },
          {
            title: "Ramah Lingkungan (Green Eco)",
            desc: "Pengelolaan limbah ampas ekstraksi herbal secara bertanggung jawab sebagai pupuk organik ramah kelestarian lingkungan.",
          },
          {
            title: "Kemitraan Jangka Panjang",
            desc: "Fleksibilitas MOQ yang ramah untuk pebisnis pemula hingga korporasi besar demi tumbuh bersama secara berkesinambungan.",
          },
        ]
    current[index] = {
      ...current[index],
      [subField]: text,
    }
    broadcastPreviewUpdate({
      ...data,
      prinsipKerjaItems: current,
    })
  }

  const handleAddPrinsipItem = () => {
    const current =
      data.prinsipKerjaItems && data.prinsipKerjaItems.length > 0
        ? [...data.prinsipKerjaItems]
        : [
          {
            title: "Integritas & Kerahasiaan (NDA)",
            desc: "Jaminan 100% perlindungan kerahasiaan formula, resep, dan strategi bisnis milik setiap mitra klien tanpa pernah dibocorkan.",
          },
          {
            title: "Kualitas Tanpa Kompromi",
            desc: "Bebas dari Bahan Kimia Obat (BKO), teruji bebas cemaran logam berat dan bakteri berbahaya melalui protokol lab berlapis.",
          },
          {
            title: "Inovasi Formula Efektif",
            desc: "Kombinasi herbal sinergis berbasis literatur ilmiah modern yang aman dikonsumsi jangka panjang dan terbukti khasiatnya.",
          },
          {
            title: "Ramah Lingkungan (Green Eco)",
            desc: "Pengelolaan limbah ampas ekstraksi herbal secara bertanggung jawab sebagai pupuk organik ramah kelestarian lingkungan.",
          },
          {
            title: "Kemitraan Jangka Panjang",
            desc: "Fleksibilitas MOQ yang ramah untuk pebisnis pemula hingga korporasi besar demi tumbuh bersama secara berkesinambungan.",
          },
        ]
    broadcastPreviewUpdate({
      ...data,
      prinsipKerjaItems: [
        ...current,
        {
          title: "Prinsip Nilai Baru",
          desc: "Tuliskan komitmen atau standar mutu kerja yang dipegang teguh oleh perusahaan.",
        },
      ],
    })
  }

  const handleRemovePrinsipItem = (index: number) => {
    const current =
      data.prinsipKerjaItems && data.prinsipKerjaItems.length > 0
        ? [...data.prinsipKerjaItems]
        : [
          {
            title: "Integritas & Kerahasiaan (NDA)",
            desc: "Jaminan 100% perlindungan kerahasiaan formula, resep, dan strategi bisnis milik setiap mitra klien tanpa pernah dibocorkan.",
          },
          {
            title: "Kualitas Tanpa Kompromi",
            desc: "Bebas dari Bahan Kimia Obat (BKO), teruji bebas cemaran logam berat dan bakteri berbahaya melalui protokol lab berlapis.",
          },
          {
            title: "Inovasi Formula Efektif",
            desc: "Kombinasi herbal sinergis berbasis literatur ilmiah modern yang aman dikonsumsi jangka panjang dan terbukti khasiatnya.",
          },
          {
            title: "Ramah Lingkungan (Green Eco)",
            desc: "Pengelolaan limbah ampas ekstraksi herbal secara bertanggung jawab sebagai pupuk organik ramah kelestarian lingkungan.",
          },
          {
            title: "Kemitraan Jangka Panjang",
            desc: "Fleksibilitas MOQ yang ramah untuk pebisnis pemula hingga korporasi besar demi tumbuh bersama secara berkesinambungan.",
          },
        ]
    if (current.length <= 1) return
    broadcastPreviewUpdate({
      ...data,
      prinsipKerjaItems: current.filter((_, i) => i !== index),
    })
  }

  const handleCityChange = (index: number, val: string) => {
    const current =
      data.distribusiDomestikCities && data.distribusiDomestikCities.length > 0
        ? [...data.distribusiDomestikCities]
        : [
          "Jakarta & Jabodetabek",
          "Bandung & Jawa Barat",
          "Semarang & Jawa Tengah",
          "D.I. Yogyakarta",
          "Surabaya & Jawa Timur",
          "Bali & Nusa Tenggara",
          "Medan & Sumatera",
          "Makassar & Sulawesi",
          "Balikpapan & Kalimantan",
          "Maluku & Papua",
        ]
    current[index] = val
    broadcastPreviewUpdate({
      ...data,
      distribusiDomestikCities: current,
    })
  }

  const handleAddCity = () => {
    const current =
      data.distribusiDomestikCities && data.distribusiDomestikCities.length > 0
        ? [...data.distribusiDomestikCities]
        : [
          "Jakarta & Jabodetabek",
          "Bandung & Jawa Barat",
          "Semarang & Jawa Tengah",
          "D.I. Yogyakarta",
          "Surabaya & Jawa Timur",
          "Bali & Nusa Tenggara",
          "Medan & Sumatera",
          "Makassar & Sulawesi",
          "Balikpapan & Kalimantan",
          "Maluku & Papua",
        ]
    broadcastPreviewUpdate({
      ...data,
      distribusiDomestikCities: [...current, "Kota / Wilayah Baru"],
    })
  }

  const handleRemoveCity = (index: number) => {
    const current =
      data.distribusiDomestikCities && data.distribusiDomestikCities.length > 0
        ? [...data.distribusiDomestikCities]
        : [
          "Jakarta & Jabodetabek",
          "Bandung & Jawa Barat",
          "Semarang & Jawa Tengah",
          "D.I. Yogyakarta",
          "Surabaya & Jawa Timur",
          "Bali & Nusa Tenggara",
          "Medan & Sumatera",
          "Makassar & Sulawesi",
          "Balikpapan & Kalimantan",
          "Maluku & Papua",
        ]
    if (current.length <= 1) return
    broadcastPreviewUpdate({
      ...data,
      distribusiDomestikCities: current.filter((_, i) => i !== index),
    })
  }

  const handleExportPointChange = (index: number, val: string) => {
    const current =
      data.distribusiEksporPoints && data.distribusiEksporPoints.length > 0
        ? [...data.distribusiEksporPoints]
        : [
          "Kelengkapan Dokumen Ekspor Resmi (Certificate of Analysis / CoA, MSDS, Free Sale Certificate).",
          "Standar Pengemasan Ekspor anti-lembab & tahan goncangan jarak jauh.",
          "Fasilitasi formula herbal yang disesuaikan dengan regulasi otoritas kesehatan negara tujuan.",
          "Fokus Pasar Ekspor: Kawasan Asia Tenggara (Malaysia, Singapura, Brunei) & Timur Tengah.",
        ]
    current[index] = val
    broadcastPreviewUpdate({
      ...data,
      distribusiEksporPoints: current,
    })
  }

  const handleAddExportPoint = () => {
    const current =
      data.distribusiEksporPoints && data.distribusiEksporPoints.length > 0
        ? [...data.distribusiEksporPoints]
        : [
          "Kelengkapan Dokumen Ekspor Resmi (Certificate of Analysis / CoA, MSDS, Free Sale Certificate).",
          "Standar Pengemasan Ekspor anti-lembab & tahan goncangan jarak jauh.",
          "Fasilitasi formula herbal yang disesuaikan dengan regulasi otoritas kesehatan negara tujuan.",
          "Fokus Pasar Ekspor: Kawasan Asia Tenggara (Malaysia, Singapura, Brunei) & Timur Tengah.",
        ]
    broadcastPreviewUpdate({
      ...data,
      distribusiEksporPoints: [
        ...current,
        "Tuliskan kapabilitas, fasilitas, atau dokumen ekspor tambahan...",
      ],
    })
  }

  const handleRemoveExportPoint = (index: number) => {
    const current =
      data.distribusiEksporPoints && data.distribusiEksporPoints.length > 0
        ? [...data.distribusiEksporPoints]
        : [
          "Kelengkapan Dokumen Ekspor Resmi (Certificate of Analysis / CoA, MSDS, Free Sale Certificate).",
          "Standar Pengemasan Ekspor anti-lembab & tahan goncangan jarak jauh.",
          "Fasilitasi formula herbal yang disesuaikan dengan regulasi otoritas kesehatan negara tujuan.",
          "Fokus Pasar Ekspor: Kawasan Asia Tenggara (Malaysia, Singapura, Brunei) & Timur Tengah.",
        ]
    if (current.length <= 1) return
    broadcastPreviewUpdate({
      ...data,
      distribusiEksporPoints: current.filter((_, i) => i !== index),
    })
  }

  // ─── HANDLER PENGATURAN LEGALITAS & MUTU ───
  const handleLegalitasFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingLegalitas(true)
    try {
      let photoUrl: string | null = null
      try {
        photoUrl = await uploadMedia(file, "about_us")
      } catch (err) {
        console.warn("[AboutSettings] Upload Supabase sertifikat gagal, beralih ke fallback base64:", err)
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
        const current =
          data.legalitasItems && data.legalitasItems.length > 0
            ? [...data.legalitasItems]
            : [
              { imageUrl: "/images/legalitas/bpom.svg", title: "BPOM RI" },
              { imageUrl: "/images/legalitas/halal.svg", title: "HALAL INDONESIA" },
              { imageUrl: "/images/legalitas/cpotb.svg", title: "CPOTB BPOM" },
              { imageUrl: "/images/legalitas/iso22000.svg", title: "ISO 22000" },
              { imageUrl: "/images/legalitas/haccp.svg", title: "HACCP" },
            ]

        if (legalitasTargetIndex !== null && legalitasTargetIndex >= 0 && legalitasTargetIndex < current.length) {
          current[legalitasTargetIndex] = {
            ...current[legalitasTargetIndex],
            imageUrl: photoUrl,
          }
          broadcastPreviewUpdate({
            ...data,
            legalitasItems: current,
          })
        } else {
          // Tambah kartu baru
          broadcastPreviewUpdate({
            ...data,
            legalitasItems: [...current, { imageUrl: photoUrl }],
          })
        }
      }
    } catch (error) {
      console.error("[AboutSettings] Gagal memproses file foto sertifikat:", error)
    } finally {
      setIsUploadingLegalitas(false)
      setLegalitasTargetIndex(null)
      if (legalitasFileInputRef.current) {
        legalitasFileInputRef.current.value = ""
      }
    }
  }

  const handleLegalitasItemChange = (index: number, url: string) => {
    const current =
      data.legalitasItems && data.legalitasItems.length > 0
        ? [...data.legalitasItems]
        : [
          { imageUrl: "/images/legalitas/bpom.svg", title: "BPOM RI" },
          { imageUrl: "/images/legalitas/halal.svg", title: "HALAL INDONESIA" },
          { imageUrl: "/images/legalitas/cpotb.svg", title: "CPOTB BPOM" },
          { imageUrl: "/images/legalitas/iso22000.svg", title: "ISO 22000" },
          { imageUrl: "/images/legalitas/haccp.svg", title: "HACCP" },
        ]
    current[index] = {
      ...current[index],
      imageUrl: url,
    }
    broadcastPreviewUpdate({
      ...data,
      legalitasItems: current,
    })
  }

  const handleAddLegalitasItem = () => {
    const current =
      data.legalitasItems && data.legalitasItems.length > 0
        ? [...data.legalitasItems]
        : [
          { imageUrl: "/images/legalitas/bpom.svg", title: "BPOM RI" },
          { imageUrl: "/images/legalitas/halal.svg", title: "HALAL INDONESIA" },
          { imageUrl: "/images/legalitas/cpotb.svg", title: "CPOTB BPOM" },
          { imageUrl: "/images/legalitas/iso22000.svg", title: "ISO 22000" },
          { imageUrl: "/images/legalitas/haccp.svg", title: "HACCP" },
        ]
    broadcastPreviewUpdate({
      ...data,
      legalitasItems: [
        ...current,
        { imageUrl: "/images/legalitas/bpom.svg" },
      ],
    })
  }

  const handleRemoveLegalitasItem = (index: number) => {
    const current =
      data.legalitasItems && data.legalitasItems.length > 0
        ? [...data.legalitasItems]
        : [
          { imageUrl: "/images/legalitas/bpom.svg", title: "BPOM RI" },
          { imageUrl: "/images/legalitas/halal.svg", title: "HALAL INDONESIA" },
          { imageUrl: "/images/legalitas/cpotb.svg", title: "CPOTB BPOM" },
          { imageUrl: "/images/legalitas/iso22000.svg", title: "ISO 22000" },
          { imageUrl: "/images/legalitas/haccp.svg", title: "HACCP" },
        ]
    if (current.length <= 1) return
    broadcastPreviewUpdate({
      ...data,
      legalitasItems: current.filter((_, i) => i !== index),
    })
  }

  const triggerUploadForIndex = (index: number) => {
    setLegalitasTargetIndex(index)
    legalitasFileInputRef.current?.click()
  }

  const triggerUploadForNew = () => {
    setLegalitasTargetIndex(-1)
    legalitasFileInputRef.current?.click()
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs p-1.5 sm:p-3 md:p-4 transition-all duration-300">
      {/* Outer Panel Container dengan Proporsi Figma Desktop Full Width & Height yang Lega */}
      <div className="w-[98vw] max-w-[1560px] h-[95vh] max-h-[920px] bg-white dark:bg-zinc-900 rounded-[8px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-zinc-200 dark:border-zinc-700 relative">

        {/* ─── SISI KIRI: SIDEBAR SESUAI KONSEP FIGMA ─── */}
        <div className="w-full md:w-[316px] md:min-w-[316px] md:max-w-[316px] flex flex-col bg-[#D9D9D9] dark:bg-zinc-800 border-r border-zinc-300 dark:border-zinc-700 shrink-0 select-none">
          {/* Header Sidebar: Figma .rectangle (w: 316px, h: 60px, bg: #D97706) */}
          <div className="w-full h-[60px] bg-[#D97706] px-4 flex items-center justify-center relative shadow-xs">
            {/* Figma .layer--5: font-family Poppins, size 12px, weight 700, color #FFFFFF, centered */}
            <h2
              className={cn(
                "text-[12px] font-bold text-white tracking-wider uppercase text-center w-full",
                poppins.className
              )}
            >
              PENGATURAN ABOUT US
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

          {/* Body Sidebar: Figma .rectangle-2 (bg: #D9D9D9) dengan menu tombol hijau #15803D */}
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

            {/* Tombol 2: PROFILE PERUSAHAAN */}
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-sm",
                poppins.className,
                activeTab === "profile"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              PROFILE PERUSAHAAN
            </button>

            {/* Tombol 3: VISI & MISI */}
            <button
              type="button"
              onClick={() => setActiveTab("visi_misi")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-sm",
                poppins.className,
                activeTab === "visi_misi"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              VISI &amp; MISI
            </button>

            {/* Tombol 4: REKAM JEJAK */}
            <button
              type="button"
              onClick={() => setActiveTab("rekam_jejak")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-sm",
                poppins.className,
                activeTab === "rekam_jejak"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              REKAM JEJAK
            </button>

            {/* Tombol 5: PRINSIP KERJA */}
            <button
              type="button"
              onClick={() => setActiveTab("prinsip_kerja")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-sm",
                poppins.className,
                activeTab === "prinsip_kerja"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              PRINSIP KERJA
            </button>

            {/* Tombol 6: JANGKAUAN DISTRIBUSI */}
            <button
              type="button"
              onClick={() => setActiveTab("jangkauan_distribusi")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-sm",
                poppins.className,
                activeTab === "jangkauan_distribusi"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              JANGKAUAN DISTRIBUSI
            </button>

            {/* Tombol 7: LEGALITAS & MUTU */}
            <button
              type="button"
              onClick={() => setActiveTab("legalitas")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-sm",
                poppins.className,
                activeTab === "legalitas"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              LEGALITAS & MUTU
            </button>

            {/* Tombol 8: KONSULTASI BRAND */}
            <button
              type="button"
              onClick={() => setActiveTab("konsultasi_brand")}
              className={cn(
                "w-full h-[40px] rounded-[5px] flex items-center justify-center text-center font-bold text-[12px] transition-all duration-200 cursor-pointer shadow-sm",
                poppins.className,
                activeTab === "konsultasi_brand"
                  ? "bg-[#15803D] text-white ring-2 ring-white/50 shadow-md scale-[1.02]"
                  : "bg-[#15803D] text-white hover:bg-[#166534] opacity-90 hover:opacity-100"
              )}
            >
              KONSULTASI BRAND
            </button>

            {/* Catatan / Keterangan di Sidebar Bawah */}
            <div className="mt-auto pt-6 text-[11px] text-zinc-700 dark:text-zinc-300 flex flex-col gap-1.5 border-t border-zinc-300 dark:border-zinc-700">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                Mode Preview Aktif:
              </span>
              <p className="leading-relaxed opacity-85">
                Gunakan 2 monitor untuk melihat perubahan secara langsung / gunakan tab browser baru
              </p>
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
                {activeTab === "visi_misi" && "VISI & MISI"}
                {activeTab === "profile" && "PROFILE PERUSAHAAN"}
                {activeTab === "rekam_jejak" && "REKAM JEJAK & KAPABILITAS"}
                {activeTab === "prinsip_kerja" && "PRINSIP KERJA"}
                {activeTab === "jangkauan_distribusi" && "JANGKAUAN DISTRIBUSI"}
                {activeTab === "legalitas" && "LEGALITAS & MUTU"}
                {activeTab === "konsultasi_brand" && "KONSULTASI BRAND"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Tombol Pratinjau Halaman (Buka Tab Baru dengan preview=true) */}
              <button
                type="button"
                onClick={() => {
                  const targetId =
                    activeTab === "banner"
                      ? "banner-utama"
                      : activeTab === "visi_misi"
                        ? "visi-misi"
                        : activeTab === "rekam_jejak"
                          ? "rekam-jejak"
                          : activeTab === "prinsip_kerja"
                            ? "prinsip-kerja"
                            : activeTab === "jangkauan_distribusi"
                              ? "jangkauan-distribusi"
                              : activeTab === "legalitas"
                                ? "legalitas"
                                : activeTab === "konsultasi_brand"
                                  ? "konsultasi-brand"
                                  : "profil-perusahaan"
                  if (typeof window !== "undefined") {
                    try {
                      // Simpan data pratinjau terkini ke localStorage agar langsung terbaca di tab baru
                      localStorage.setItem(ABOUT_SETTINGS_KEY, JSON.stringify(data))
                    } catch (e) {
                      console.error(e)
                    }
                    window.open(`/about?preview=true#${targetId}`, "_blank")
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer shadow-2xs"
                title="Buka Pratinjau Halaman di Tab Baru (preview=true)"
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
          <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto space-y-6 w-full">
            {/* ─── TAB 1: BANNER UTAMA ─── */}
            {activeTab === "banner" && (
              <div className="space-y-6 w-full">
                <div>
                  <h3 className={cn("text-lg font-bold text-foreground", poppins.className)}>
                    Pengaturan Banner Utama
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Sesuaikan judul utama, deskripsi pengantar, foto fasilitas, dan angka capaian metriks.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Judul Banner */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wide">
                      Judul Utama Banner
                    </label>
                    <textarea
                      rows={2}
                      value={data.bannerTitle}
                      onChange={(e) => handleFieldChange("bannerTitle", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D] resize-none"
                    />
                  </div>

                  {/* Kontrol Tipografi: Gaya Font, Ukuran Font, dan Warna Font */}
                  <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border/60 pb-2">
                      <Type className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>Format Teks: Gaya, Ukuran &amp; Warna Font</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* 1. Gaya Font (Font Family) */}
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

                      {/* 2. Ukuran Font (Font Size) */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Ukuran Font</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {data.bannerTitleSize || 42}px
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={20}
                            max={64}
                            step={1}
                            value={data.bannerTitleSize || 42}
                            onChange={(e) =>
                              handleFieldChange("bannerTitleSize", parseInt(e.target.value, 10) || 42)
                            }
                            className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                          />
                          <input
                            type="number"
                            min={20}
                            max={64}
                            value={data.bannerTitleSize || 42}
                            onChange={(e) =>
                              handleFieldChange("bannerTitleSize", parseInt(e.target.value, 10) || 42)
                            }
                            className="w-14 px-2 py-1 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                          />
                        </div>
                      </div>

                      {/* 3. Warna Font (Font Color) */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Warna Font</span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {data.bannerTitleColor || "Default"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.bannerTitleColor, "#000000")}
                            onChange={(e) => handleFieldChange("bannerTitleColor", e.target.value)}
                            className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                            title="Pilih warna kustom"
                          />
                          <input
                            type="text"
                            placeholder="Contoh: #15803D"
                            value={data.bannerTitleColor || ""}
                            onChange={(e) => handleFieldChange("bannerTitleColor", e.target.value)}
                            className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                          {data.bannerTitleColor && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("bannerTitleColor", "")}
                              className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                              title="Reset ke warna default tema"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Palet Preset Warna Cepat */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                      <span className="text-muted-foreground font-medium">Preset Warna:</span>
                      {[
                        { label: "Default (Tema)", color: "" },
                        { label: "Hijau IGN", color: "#15803D" },
                        { label: "Amber", color: "#D97706" },
                        { label: "Emerald", color: "#059669" },
                        { label: "Charcoal", color: "#111827" },
                        { label: "Navy", color: "#1E3A8A" },
                        { label: "Putih", color: "#FFFFFF" },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleFieldChange("bannerTitleColor", preset.color)}
                          className={cn(
                            "px-2 py-0.5 rounded border text-[10px] transition-all cursor-pointer flex items-center gap-1",
                            (data.bannerTitleColor || "") === preset.color
                              ? "border-[#15803D] bg-emerald-50 text-[#15803D] dark:bg-emerald-950/40 dark:text-emerald-300 font-bold"
                              : "border-border bg-background hover:bg-muted text-foreground/80"
                          )}
                        >
                          {preset.color && (
                            <span
                              className="w-2 h-2 rounded-full border border-black/20"
                              style={{ backgroundColor: preset.color }}
                            />
                          )}
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Deskripsi Banner (Auto-Resize Tanpa Scroll) */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground uppercase tracking-wide">
                      <span>Deskripsi Paragraf Banner</span>
                      <span className="text-[10px] text-muted-foreground font-mono font-normal">
                        {(data.bannerDesc || "").length} karakter
                      </span>
                    </div>
                    <AutoResizeTextarea
                      minHeight={110}
                      value={data.bannerDesc}
                      onChange={(e) => handleFieldChange("bannerDesc", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D] leading-relaxed"
                    />
                  </div>

                  {/* Kontrol Tipografi Paragraf: Gaya Font, Ukuran Font, dan Warna Font */}
                  <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border/60 pb-2">
                      <Type className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>Format Paragraf: Gaya, Ukuran &amp; Warna Font</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* 1. Gaya Font Paragraf (Font Family) */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                          <span>Gaya Font Paragraf</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {data.bannerDescFont || "outfit"}
                          </span>
                        </label>
                        <FontSelect
                          value={data.bannerDescFont || "outfit"}
                          onChange={(val) => handleFieldChange("bannerDescFont", val)}
                        />
                      </div>

                      {/* 2. Ukuran Font Paragraf (Font Size) */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Ukuran Font Paragraf</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {data.bannerDescSize || 16}px
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={12}
                            max={28}
                            step={1}
                            value={data.bannerDescSize || 16}
                            onChange={(e) =>
                              handleFieldChange("bannerDescSize", parseInt(e.target.value, 10) || 16)
                            }
                            className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                          />
                          <input
                            type="number"
                            min={12}
                            max={28}
                            value={data.bannerDescSize || 16}
                            onChange={(e) =>
                              handleFieldChange("bannerDescSize", parseInt(e.target.value, 10) || 16)
                            }
                            className="w-14 px-2 py-1 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                          />
                        </div>
                      </div>

                      {/* 3. Warna Font Paragraf (Font Color) */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Warna Font Paragraf</span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {data.bannerDescColor || "Default"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.bannerDescColor, "#27272a")}
                            onChange={(e) => handleFieldChange("bannerDescColor", e.target.value)}
                            className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                            title="Pilih warna paragraf kustom"
                          />
                          <input
                            type="text"
                            placeholder="Contoh: #3f3f46"
                            value={data.bannerDescColor || ""}
                            onChange={(e) => handleFieldChange("bannerDescColor", e.target.value)}
                            className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                          {data.bannerDescColor && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("bannerDescColor", "")}
                              className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                              title="Reset ke warna default tema"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Palet Preset Cepat Warna Paragraf */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                      <span className="text-muted-foreground font-medium">Preset Warna:</span>
                      {[
                        { label: "Default (Tema)", color: "" },
                        { label: "Abu Gelap (Zinc 800)", color: "#27272a" },
                        { label: "Abu Sedang (Zinc 600)", color: "#52525b" },
                        { label: "Hitam Murni", color: "#000000" },
                        { label: "Hijau IGN", color: "#15803D" },
                        { label: "Navy Elegan", color: "#1E3A8A" },
                        { label: "Cokelat Bumi", color: "#78350F" },
                        { label: "Putih", color: "#FFFFFF" },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleFieldChange("bannerDescColor", preset.color)}
                          className={cn(
                            "px-2 py-0.5 rounded border text-[10px] transition-all cursor-pointer flex items-center gap-1",
                            (data.bannerDescColor || "") === preset.color
                              ? "border-[#15803D] bg-emerald-50 text-[#15803D] dark:bg-emerald-950/40 dark:text-emerald-300 font-bold"
                              : "border-border bg-background hover:bg-muted text-foreground/80"
                          )}
                        >
                          {preset.color && (
                            <span
                              className="w-2 h-2 rounded-full border border-black/20"
                              style={{ backgroundColor: preset.color }}
                            />
                          )}
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ─── PENGATURAN TOMBOL CTA HERO BANNER (FULL WIDTH) ─── */}
                  <div className="p-4 rounded-[6px] bg-muted/40 border border-border space-y-4 w-full">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border/60 pb-2.5">
                      <ExternalLink className="w-4 h-4 text-[#15803D]" />
                      <span>Pengaturan Tombol CTA Hero Banner</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                      {/* ─── TOMBOL 1 (Tombol Utama / Konsultasi WhatsApp) ─── */}
                      <div className="p-3.5 rounded-[6px] bg-background border border-border/80 flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                          <span className="text-xs font-bold text-[#15803D] uppercase tracking-wide flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                            Tombol 1 (Utama)
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            Primary CTA
                          </span>
                        </div>

                        {/* Teks Tombol 1 */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-semibold text-foreground/80">
                            Teks Tombol
                          </label>
                          <input
                            type="text"
                            value={data.bannerBtn1Text ?? "Konsultasi Maklon Herbal"}
                            onChange={(e) => handleFieldChange("bannerBtn1Text", e.target.value)}
                            placeholder="Contoh: Konsultasi Maklon Herbal"
                            className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-card-alt border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                        </div>

                        {/* Link Tombol 1 */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                            <span>Tautan Link (URL / WhatsApp / Anchor)</span>
                            <span className="text-[10px] text-muted-foreground font-mono">href</span>
                          </label>
                          <input
                            type="text"
                            value={data.bannerBtn1Link ?? ""}
                            onChange={(e) => handleFieldChange("bannerBtn1Link", e.target.value)}
                            placeholder="https://wa.me/... atau #section"
                            className="w-full px-3 py-1.5 rounded-[5px] text-xs font-mono bg-card-alt border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                        </div>

                        {/* Warna Background & Warna Teks Tombol 1 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {/* Background Color */}
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                              <span>Warna Tombol</span>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {data.bannerBtn1BgColor || "Default (Hijau)"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={toSafeHexColor(data.bannerBtn1BgColor, "#15803D")}
                                onChange={(e) => handleFieldChange("bannerBtn1BgColor", e.target.value)}
                                className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                                title="Pilih warna background tombol"
                              />
                              <input
                                type="text"
                                placeholder="#15803D"
                                value={data.bannerBtn1BgColor || ""}
                                onChange={(e) => handleFieldChange("bannerBtn1BgColor", e.target.value)}
                                className="flex-1 min-w-0 px-2 py-1 rounded-[5px] text-xs font-mono bg-card-alt border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                              />
                              {data.bannerBtn1BgColor && (
                                <button
                                  type="button"
                                  onClick={() => handleFieldChange("bannerBtn1BgColor", "")}
                                  className="px-1.5 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer shrink-0"
                                  title="Reset ke default"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Text Color */}
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                              <span>Warna Teks</span>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {data.bannerBtn1TextColor || "Default (Putih)"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={toSafeHexColor(data.bannerBtn1TextColor, "#FFFFFF")}
                                onChange={(e) => handleFieldChange("bannerBtn1TextColor", e.target.value)}
                                className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                                title="Pilih warna teks tombol"
                              />
                              <input
                                type="text"
                                placeholder="#FFFFFF"
                                value={data.bannerBtn1TextColor || ""}
                                onChange={(e) => handleFieldChange("bannerBtn1TextColor", e.target.value)}
                                className="flex-1 min-w-0 px-2 py-1 rounded-[5px] text-xs font-mono bg-card-alt border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                              />
                              {data.bannerBtn1TextColor && (
                                <button
                                  type="button"
                                  onClick={() => handleFieldChange("bannerBtn1TextColor", "")}
                                  className="px-1.5 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer shrink-0"
                                  title="Reset ke default"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Palet Preset Warna Tombol 1 */}
                        <div className="flex items-center gap-1 flex-wrap pt-1 text-[10px]">
                          <span className="text-muted-foreground font-medium">Preset:</span>
                          {[
                            { label: "Hijau IGN", bg: "#15803D", text: "#FFFFFF" },
                            { label: "Amber", bg: "#D97706", text: "#FFFFFF" },
                            { label: "Emerald", bg: "#059669", text: "#FFFFFF" },
                            { label: "Navy", bg: "#1E3A8A", text: "#FFFFFF" },
                            { label: "Hitam", bg: "#18181b", text: "#FFFFFF" },
                          ].map((p) => (
                            <button
                              key={p.label}
                              type="button"
                              onClick={() => {
                                handleFieldChange("bannerBtn1BgColor", p.bg)
                                handleFieldChange("bannerBtn1TextColor", p.text)
                              }}
                              className="px-1.5 py-0.5 rounded border border-border bg-card-alt hover:bg-muted text-[10px] flex items-center gap-1 cursor-pointer"
                            >
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.bg }} />
                              <span>{p.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ─── TOMBOL 2 (Tombol Sekunder / Jelajahi Profil) ─── */}
                      <div className="p-3.5 rounded-[6px] bg-background border border-border/80 flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                          <span className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-zinc-400" />
                            Tombol 2 (Sekunder)
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            Secondary CTA
                          </span>
                        </div>

                        {/* Teks Tombol 2 */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-semibold text-foreground/80">
                            Teks Tombol
                          </label>
                          <input
                            type="text"
                            value={data.bannerBtn2Text ?? "Jelajahi Profil Perusahaan"}
                            onChange={(e) => handleFieldChange("bannerBtn2Text", e.target.value)}
                            placeholder="Contoh: Jelajahi Profil Perusahaan"
                            className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-card-alt border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                        </div>

                        {/* Link Tombol 2 */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                            <span>Tautan Link (URL / Anchor)</span>
                            <span className="text-[10px] text-muted-foreground font-mono">href</span>
                          </label>
                          <input
                            type="text"
                            value={data.bannerBtn2Link ?? ""}
                            onChange={(e) => handleFieldChange("bannerBtn2Link", e.target.value)}
                            placeholder="#profil-perusahaan atau https://..."
                            className="w-full px-3 py-1.5 rounded-[5px] text-xs font-mono bg-card-alt border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                        </div>

                        {/* Warna Background & Warna Teks Tombol 2 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {/* Background Color */}
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                              <span>Warna Tombol</span>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {data.bannerBtn2BgColor || "Default (Transparan)"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={toSafeHexColor(data.bannerBtn2BgColor, "#ffffff")}
                                onChange={(e) => handleFieldChange("bannerBtn2BgColor", e.target.value)}
                                className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                                title="Pilih warna background tombol 2"
                              />
                              <input
                                type="text"
                                placeholder="Default"
                                value={data.bannerBtn2BgColor || ""}
                                onChange={(e) => handleFieldChange("bannerBtn2BgColor", e.target.value)}
                                className="flex-1 min-w-0 px-2 py-1 rounded-[5px] text-xs font-mono bg-card-alt border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                              />
                              {data.bannerBtn2BgColor && (
                                <button
                                  type="button"
                                  onClick={() => handleFieldChange("bannerBtn2BgColor", "")}
                                  className="px-1.5 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer shrink-0"
                                  title="Reset ke default"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Text Color */}
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                              <span>Warna Teks</span>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                {data.bannerBtn2TextColor || "Default (Teks)"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={toSafeHexColor(data.bannerBtn2TextColor, "#18181b")}
                                onChange={(e) => handleFieldChange("bannerBtn2TextColor", e.target.value)}
                                className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                                title="Pilih warna teks tombol 2"
                              />
                              <input
                                type="text"
                                placeholder="Default"
                                value={data.bannerBtn2TextColor || ""}
                                onChange={(e) => handleFieldChange("bannerBtn2TextColor", e.target.value)}
                                className="flex-1 min-w-0 px-2 py-1 rounded-[5px] text-xs font-mono bg-card-alt border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                              />
                              {data.bannerBtn2TextColor && (
                                <button
                                  type="button"
                                  onClick={() => handleFieldChange("bannerBtn2TextColor", "")}
                                  className="px-1.5 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer shrink-0"
                                  title="Reset ke default"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Palet Preset Warna Tombol 2 */}
                        <div className="flex items-center gap-1 flex-wrap pt-1 text-[10px]">
                          <span className="text-muted-foreground font-medium">Preset:</span>
                          {[
                            { label: "Outline Default", bg: "", text: "" },
                            { label: "Abu Terang", bg: "#f4f4f5", text: "#18181b" },
                            { label: "Hijau Soft", bg: "#f0fdf4", text: "#15803D" },
                            { label: "Dark Fill", bg: "#27272a", text: "#FFFFFF" },
                          ].map((p) => (
                            <button
                              key={p.label}
                              type="button"
                              onClick={() => {
                                handleFieldChange("bannerBtn2BgColor", p.bg)
                                handleFieldChange("bannerBtn2TextColor", p.text)
                              }}
                              className="px-1.5 py-0.5 rounded border border-border bg-card-alt hover:bg-muted text-[10px] flex items-center gap-1 cursor-pointer"
                            >
                              {p.bg && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.bg }} />}
                              <span>{p.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ─── PENGATURAN FOTO BANNER (UPLOAD, POSISI KIRI-KANAN & SKALA) ─── */}
                  <div className="p-4 rounded-[6px] bg-muted/40 border border-border space-y-4 w-full">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border/60 pb-2.5">
                      <ImageIcon className="w-4 h-4 text-[#15803D]" />
                      <span>Pengaturan Foto Banner (Upload, Posisi &amp; Skala)</span>
                    </div>

                    {/* Baris 1: Path / URL Foto + Tombol Upload */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-foreground uppercase tracking-wide">
                        <span>Path / URL Foto Banner (Rasio 16:9)</span>
                        <span className="text-[10px] text-muted-foreground font-normal lowercase">
                          Mendukung link web, path lokal, atau upload file
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={data.bannerImage}
                          onChange={(e) => handleFieldChange("bannerImage", e.target.value)}
                          placeholder="/images/about_hero_banner.jpg atau https://..."
                          className="flex-1 px-3.5 py-2 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                        />

                        {/* Hidden File Input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />

                        {/* Tombol Upload Foto */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingPhoto}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[5px] bg-[#15803D] hover:bg-[#166534] disabled:opacity-60 text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
                          title="Pilih gambar dari komputer/HP"
                        >
                          {isUploadingPhoto ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          <span>{isUploadingPhoto ? "Mengunggah..." : "Upload Foto"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Baris 2: Pratinjau Foto Mini (Preview Box) */}
                    {data.bannerImage && (
                      <div className="flex items-center gap-3 p-2.5 rounded-[5px] bg-background border border-border/80">
                        <div className="relative w-24 aspect-[16/9] rounded overflow-hidden border border-border/80 bg-zinc-100 shrink-0 shadow-2xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={data.bannerImage}
                            alt="Pratinjau Foto Banner"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <span className="text-[11px] font-bold text-foreground truncate">
                            {data.bannerImage.startsWith("data:")
                              ? "Foto Terunggah (Data Base64)"
                              : data.bannerImage.split("/").pop()}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate">
                            {data.bannerImage}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFieldChange("bannerImage", "/images/about_hero_banner.jpg")}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 rounded border border-red-200 dark:border-red-800 transition-colors cursor-pointer shrink-0"
                          title="Kembalikan ke foto bawaan"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Foto</span>
                        </button>
                      </div>
                    )}

                    {/* Baris 3: Pengaturan Posisi (Kiri - Kanan) & Skala Besar Kecil */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      {/* 1. Posisi Foto Banner */}
                      <div className="flex flex-col gap-1.5 p-3 rounded-[5px] bg-background border border-border/80">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Posisi Foto Banner</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {(data.bannerImagePosition || "right") === "left"
                              ? "Sisi Kiri (Foto di Kiri)"
                              : "Sisi Kanan (Bawaan)"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => handleFieldChange("bannerImagePosition", "left")}
                            className={cn(
                              "inline-flex items-center justify-center gap-2 py-2 px-3 rounded-[5px] text-xs font-semibold border transition-all cursor-pointer",
                              data.bannerImagePosition === "left"
                                ? "bg-[#15803D] text-white border-[#15803D] shadow-sm font-bold"
                                : "bg-card-alt text-foreground/80 border-border hover:bg-muted"
                            )}
                          >
                            <AlignLeft className="w-3.5 h-3.5" />
                            <span>Sisi Kiri</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFieldChange("bannerImagePosition", "right")}
                            className={cn(
                              "inline-flex items-center justify-center gap-2 py-2 px-3 rounded-[5px] text-xs font-semibold border transition-all cursor-pointer",
                              (data.bannerImagePosition || "right") === "right"
                                ? "bg-[#15803D] text-white border-[#15803D] shadow-sm font-bold"
                                : "bg-card-alt text-foreground/80 border-border hover:bg-muted"
                            )}
                          >
                            <AlignRight className="w-3.5 h-3.5" />
                            <span>Sisi Kanan</span>
                          </button>
                        </div>
                      </div>

                      {/* 2. Skala Besar Kecil Foto */}
                      <div className="flex flex-col gap-1.5 p-3 rounded-[5px] bg-background border border-border/80">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Skala Besar / Kecil Foto</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {data.bannerImageScale ?? 100}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="range"
                            min={50}
                            max={120}
                            step={1}
                            value={data.bannerImageScale ?? 100}
                            onChange={(e) =>
                              handleFieldChange(
                                "bannerImageScale",
                                parseInt(e.target.value, 10) || 100
                              )
                            }
                            className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                          />
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={50}
                              max={120}
                              value={data.bannerImageScale ?? 100}
                              onChange={(e) =>
                                handleFieldChange(
                                  "bannerImageScale",
                                  parseInt(e.target.value, 10) || 100
                                )
                              }
                              className="w-14 px-2 py-1 rounded bg-card-alt border border-border text-xs font-mono font-bold text-center"
                            />
                            <span className="text-xs text-muted-foreground font-mono">%</span>
                          </div>
                          {(data.bannerImageScale ?? 100) !== 100 && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("bannerImageScale", 100)}
                              className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer shrink-0"
                              title="Reset skala ke 100%"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 Capaian Metriks */}
                  <div className="pt-2">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wide block mb-3">
                      4 Angka Metriks Capaian (Counter)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                      <div className="p-3 rounded-[5px] border border-border bg-card-alt flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#15803D]">Metrik 1</span>
                          <span className="text-[10px] text-muted-foreground font-mono">Angka &amp; Simbol</span>
                        </div>
                        <div className="flex gap-2 w-full">
                          <div className="flex-1 min-w-0 flex flex-col gap-1">
                            <label className="text-[10px] text-muted-foreground font-medium">Angka</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              autoComplete="off"
                              placeholder="0"
                              value={data.stat1Number === 0 ? "" : data.stat1Number}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const clean = e.target.value.replace(/[^0-9]/g, "")
                                handleFieldChange("stat1Number", clean === "" ? 0 : parseInt(clean, 10))
                              }}
                              className="w-full px-2.5 py-1.5 rounded bg-background border border-border text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#15803D] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>
                          <div className="w-16 shrink-0 flex flex-col gap-1">
                            <label className="text-[10px] text-muted-foreground font-medium text-center">Simbol</label>
                            <input
                              type="text"
                              value={data.stat1Suffix}
                              onChange={(e) => handleFieldChange("stat1Suffix", e.target.value)}
                              className="w-full px-2 py-1.5 rounded bg-background border border-border text-xs text-center font-bold focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                              placeholder="+"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-muted-foreground font-medium">Keterangan Label</label>
                          <input
                            type="text"
                            value={data.stat1Label}
                            onChange={(e) => handleFieldChange("stat1Label", e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-background border border-border text-[11px] focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                            placeholder="Contoh: Tahun Pengalaman..."
                          />
                        </div>
                      </div>

                      {/* Metric 2 */}
                      <div className="p-3 rounded-[5px] border border-border bg-card-alt flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#15803D]">Metrik 2</span>
                          <span className="text-[10px] text-muted-foreground font-mono">Angka &amp; Simbol</span>
                        </div>
                        <div className="flex gap-2 w-full">
                          <div className="flex-1 min-w-0 flex flex-col gap-1">
                            <label className="text-[10px] text-muted-foreground font-medium">Angka</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              autoComplete="off"
                              placeholder="0"
                              value={data.stat2Number === 0 ? "" : data.stat2Number}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const clean = e.target.value.replace(/[^0-9]/g, "")
                                handleFieldChange("stat2Number", clean === "" ? 0 : parseInt(clean, 10))
                              }}
                              className="w-full px-2.5 py-1.5 rounded bg-background border border-border text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#15803D] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>
                          <div className="w-16 shrink-0 flex flex-col gap-1">
                            <label className="text-[10px] text-muted-foreground font-medium text-center">Simbol</label>
                            <input
                              type="text"
                              value={data.stat2Suffix}
                              onChange={(e) => handleFieldChange("stat2Suffix", e.target.value)}
                              className="w-full px-2 py-1.5 rounded bg-background border border-border text-xs text-center font-bold focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                              placeholder="+"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-muted-foreground font-medium">Keterangan Label</label>
                          <input
                            type="text"
                            value={data.stat2Label}
                            onChange={(e) => handleFieldChange("stat2Label", e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-background border border-border text-[11px] focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                            placeholder="Contoh: Produk Terdaftar BPOM..."
                          />
                        </div>
                      </div>

                      {/* Metric 3 */}
                      <div className="p-3 rounded-[5px] border border-border bg-card-alt flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#15803D]">Metrik 3</span>
                          <span className="text-[10px] text-muted-foreground font-mono">Angka &amp; Simbol</span>
                        </div>
                        <div className="flex gap-2 w-full">
                          <div className="flex-1 min-w-0 flex flex-col gap-1">
                            <label className="text-[10px] text-muted-foreground font-medium">Angka</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              autoComplete="off"
                              placeholder="0"
                              value={data.stat3Number === 0 ? "" : data.stat3Number}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const clean = e.target.value.replace(/[^0-9]/g, "")
                                handleFieldChange("stat3Number", clean === "" ? 0 : parseInt(clean, 10))
                              }}
                              className="w-full px-2.5 py-1.5 rounded bg-background border border-border text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#15803D] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>
                          <div className="w-16 shrink-0 flex flex-col gap-1">
                            <label className="text-[10px] text-muted-foreground font-medium text-center">Simbol</label>
                            <input
                              type="text"
                              value={data.stat3Suffix}
                              onChange={(e) => handleFieldChange("stat3Suffix", e.target.value)}
                              className="w-full px-2 py-1.5 rounded bg-background border border-border text-xs text-center font-bold focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                              placeholder="+"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-muted-foreground font-medium">Keterangan Label</label>
                          <input
                            type="text"
                            value={data.stat3Label}
                            onChange={(e) => handleFieldChange("stat3Label", e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-background border border-border text-[11px] focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                            placeholder="Contoh: Mitra Brand Maklon..."
                          />
                        </div>
                      </div>

                      {/* Metric 4 */}
                      <div className="p-3 rounded-[5px] border border-border bg-card-alt flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[#15803D]">Metrik 4</span>
                          <span className="text-[10px] text-muted-foreground font-mono">Angka &amp; Simbol</span>
                        </div>
                        <div className="flex gap-2 w-full">
                          <div className="flex-1 min-w-0 flex flex-col gap-1">
                            <label className="text-[10px] text-muted-foreground font-medium">Angka</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              autoComplete="off"
                              placeholder="0"
                              value={data.stat4Number === 0 ? "" : data.stat4Number}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) => {
                                const clean = e.target.value.replace(/[^0-9]/g, "")
                                handleFieldChange("stat4Number", clean === "" ? 0 : parseInt(clean, 10))
                              }}
                              className="w-full px-2.5 py-1.5 rounded bg-background border border-border text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#15803D] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>
                          <div className="w-16 shrink-0 flex flex-col gap-1">
                            <label className="text-[10px] text-muted-foreground font-medium text-center">Simbol</label>
                            <input
                              type="text"
                              value={data.stat4Suffix}
                              onChange={(e) => handleFieldChange("stat4Suffix", e.target.value)}
                              className="w-full px-2 py-1.5 rounded bg-background border border-border text-xs text-center font-bold focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                              placeholder="+"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-muted-foreground font-medium">Keterangan Label</label>
                          <input
                            type="text"
                            value={data.stat4Label}
                            onChange={(e) => handleFieldChange("stat4Label", e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded bg-background border border-border text-[11px] focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                            placeholder="Contoh: Tingkat Kepuasan..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 2: PROFILE PERUSAHAAN ─── */}
            {activeTab === "profile" && (
              <div className="space-y-6 w-full">
                <div>
                  <h3 className={cn("text-lg font-bold text-foreground", poppins.className)}>
                    Pengaturan Profile CV. Indo Green Nature
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Kelola video profil YouTube, foto thumbnail video, dan narasi profil sejarah perusahaan.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Judul Profil */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wide">
                      Judul Bagian Profil
                    </label>
                    <input
                      type="text"
                      value={data.profilTitle}
                      onChange={(e) => handleFieldChange("profilTitle", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                    />
                  </div>

                  {/* Kontrol Tipografi Judul Profil: Gaya Font, Ukuran Font, dan Warna Font */}
                  <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border/60 pb-2">
                      <Type className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>Format Judul: Gaya, Ukuran &amp; Warna Font</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* 1. Gaya Font */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                          <span>Gaya Font</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {data.profilTitleFont || "poppins"}
                          </span>
                        </label>
                        <FontSelect
                          value={data.profilTitleFont || "poppins"}
                          onChange={(val) => handleFieldChange("profilTitleFont", val)}
                        />
                      </div>

                      {/* 2. Ukuran Font */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Ukuran Font</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {data.profilTitleSize || 32}px
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={18}
                            max={56}
                            step={1}
                            value={data.profilTitleSize || 32}
                            onChange={(e) =>
                              handleFieldChange("profilTitleSize", parseInt(e.target.value, 10) || 32)
                            }
                            className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                          />
                          <input
                            type="number"
                            min={18}
                            max={56}
                            value={data.profilTitleSize || 32}
                            onChange={(e) =>
                              handleFieldChange("profilTitleSize", parseInt(e.target.value, 10) || 32)
                            }
                            className="w-14 px-2 py-1 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                          />
                        </div>
                      </div>

                      {/* 3. Warna Font */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Warna Font</span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {data.profilTitleColor || "Default"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.profilTitleColor, "#000000")}
                            onChange={(e) => handleFieldChange("profilTitleColor", e.target.value)}
                            className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                            title="Pilih warna kustom"
                          />
                          <input
                            type="text"
                            placeholder="Contoh: #15803D"
                            value={data.profilTitleColor || ""}
                            onChange={(e) => handleFieldChange("profilTitleColor", e.target.value)}
                            className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                          {data.profilTitleColor && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("profilTitleColor", "")}
                              className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                              title="Reset ke warna default tema"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Palet Preset Warna Cepat */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                      <span className="text-muted-foreground font-medium">Preset Warna:</span>
                      {[
                        { label: "Default (Tema)", color: "" },
                        { label: "Hijau IGN", color: "#15803D" },
                        { label: "Amber", color: "#D97706" },
                        { label: "Emerald", color: "#059669" },
                        { label: "Charcoal", color: "#111827" },
                        { label: "Navy", color: "#1E3A8A" },
                        { label: "Putih", color: "#FFFFFF" },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleFieldChange("profilTitleColor", preset.color)}
                          className={cn(
                            "px-2 py-0.5 rounded border text-[10px] transition-all cursor-pointer flex items-center gap-1",
                            (data.profilTitleColor || "") === preset.color
                              ? "border-[#15803D] bg-emerald-50 text-[#15803D] dark:bg-emerald-950/40 dark:text-emerald-300 font-bold"
                              : "border-border bg-background hover:bg-muted text-foreground/80"
                          )}
                        >
                          {preset.color && (
                            <span
                              className="w-2 h-2 rounded-full border border-black/20"
                              style={{ backgroundColor: preset.color }}
                            />
                          )}
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Media Video, Thumbnail Mandiri & Pengaturan Alignment */}
                  <div className="p-4 rounded-[6px] bg-muted/40 border border-border space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border/60 pb-2">
                      <Video className="w-3.5 h-3.5 text-red-600" />
                      <span>Video Profil, Thumbnail &amp; Posisi Layout</span>
                    </div>

                    {/* 1. URL Video Profil (YouTube) */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-foreground/90 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-red-600" />
                        <span>URL Video Profil YouTube</span>
                      </label>
                      <input
                        type="text"
                        value={data.profilVideoUrl}
                        onChange={(e) => handleFieldChange("profilVideoUrl", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>

                    {/* 2. Path / URL Thumbnail Video & Upload Mandiri */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-foreground/90">
                        <span className="flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-[#15803D]" />
                          <span>Thumbnail Video (Rasio 16:9)</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground font-normal">
                          Mendukung link web, path lokal, atau upload langsung
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={data.profilVideoThumb}
                          onChange={(e) => handleFieldChange("profilVideoThumb", e.target.value)}
                          placeholder="/images/ign_lab_video_thumb.jpg atau https://..."
                          className="flex-1 px-3.5 py-2 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                        />

                        {/* Hidden File Input for Video Thumbnail */}
                        <input
                          ref={videoThumbInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleVideoThumbUpload}
                          className="hidden"
                        />

                        {/* Tombol Upload Thumbnail Mandiri */}
                        <button
                          type="button"
                          onClick={() => videoThumbInputRef.current?.click()}
                          disabled={isUploadingThumb}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[5px] bg-[#15803D] hover:bg-[#166534] disabled:opacity-60 text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
                          title="Pilih gambar thumbnail dari komputer/HP"
                        >
                          {isUploadingThumb ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          <span>{isUploadingThumb ? "Mengunggah..." : "Upload Thumbnail"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Pratinjau Mini Thumbnail */}
                    {data.profilVideoThumb && (
                      <div className="flex items-center gap-3 p-2.5 rounded-[5px] bg-background border border-border/80">
                        <div className="relative w-24 aspect-[16/9] rounded overflow-hidden border border-border/80 bg-zinc-100 shrink-0 shadow-2xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={data.profilVideoThumb}
                            alt="Pratinjau Thumbnail Video"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <span className="text-[11px] font-bold text-foreground truncate">
                            {data.profilVideoThumb.startsWith("data:")
                              ? "Thumbnail Terunggah (Data Base64)"
                              : data.profilVideoThumb.split("/").pop()}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate">
                            {data.profilVideoThumb}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFieldChange("profilVideoThumb", "/images/ign_lab_video_thumb.jpg")}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 rounded border border-red-200 dark:border-red-800 transition-colors cursor-pointer shrink-0"
                          title="Kembalikan ke thumbnail bawaan"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Thumbnail</span>
                        </button>
                      </div>
                    )}

                    {/* 3. Pengaturan Alignment Posisi Media & Skala Besar Kecil */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      {/* Posisi Media Video */}
                      <div className="flex flex-col gap-1.5 p-3 rounded-[5px] bg-background border border-border/80">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Posisi Media Video</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {(data.profilMediaPosition || "left") === "right"
                              ? "Sisi Kanan (Video di Kanan)"
                              : "Sisi Kiri (Bawaan)"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => handleFieldChange("profilMediaPosition", "left")}
                            className={cn(
                              "inline-flex items-center justify-center gap-2 py-2 px-3 rounded-[5px] text-xs font-semibold border transition-all cursor-pointer",
                              (data.profilMediaPosition || "left") === "left"
                                ? "bg-[#15803D] text-white border-[#15803D] shadow-sm font-bold"
                                : "bg-card-alt text-foreground/80 border-border hover:bg-muted"
                            )}
                          >
                            <AlignLeft className="w-3.5 h-3.5" />
                            <span>Sisi Kiri</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFieldChange("profilMediaPosition", "right")}
                            className={cn(
                              "inline-flex items-center justify-center gap-2 py-2 px-3 rounded-[5px] text-xs font-semibold border transition-all cursor-pointer",
                              data.profilMediaPosition === "right"
                                ? "bg-[#15803D] text-white border-[#15803D] shadow-sm font-bold"
                                : "bg-card-alt text-foreground/80 border-border hover:bg-muted"
                            )}
                          >
                            <AlignRight className="w-3.5 h-3.5" />
                            <span>Sisi Kanan</span>
                          </button>
                        </div>
                      </div>

                      {/* Skala Besar Kecil Thumbnail / Video */}
                      <div className="flex flex-col gap-1.5 p-3 rounded-[5px] bg-background border border-border/80">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Skala Thumbnail Video</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {data.profilMediaScale ?? 100}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="range"
                            min={50}
                            max={120}
                            step={1}
                            value={data.profilMediaScale ?? 100}
                            onChange={(e) =>
                              handleFieldChange(
                                "profilMediaScale",
                                parseInt(e.target.value, 10) || 100
                              )
                            }
                            className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                          />
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={50}
                              max={120}
                              value={data.profilMediaScale ?? 100}
                              onChange={(e) =>
                                handleFieldChange(
                                  "profilMediaScale",
                                  parseInt(e.target.value, 10) || 100
                                )
                              }
                              className="w-14 px-2 py-1 rounded bg-card-alt border border-border text-xs font-mono font-bold text-center"
                            />
                            <span className="text-xs text-muted-foreground font-mono">%</span>
                          </div>
                          {(data.profilMediaScale ?? 100) !== 100 && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("profilMediaScale", 100)}
                              className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer shrink-0"
                              title="Reset skala ke 100%"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deskripsi Paragraf Profil (Gabungan 1 Kolom Teks, Auto-Resize Tanpa Scroll) */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground uppercase tracking-wide">
                      <span>Deskripsi Paragraf Profil Perusahaan</span>
                      <span className="text-[10px] text-muted-foreground font-mono font-normal">
                        {(
                          data.profilDesc !== undefined
                            ? data.profilDesc
                            : [data.profilP1, data.profilP2, data.profilP3].filter(Boolean).join("\n\n")
                        ).length}{" "}
                        karakter
                      </span>
                    </div>
                    <AutoResizeTextarea
                      minHeight={160}
                      value={
                        data.profilDesc !== undefined
                          ? data.profilDesc
                          : [data.profilP1, data.profilP2, data.profilP3].filter(Boolean).join("\n\n")
                      }
                      onChange={(e) => handleFieldChange("profilDesc", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D] leading-relaxed"
                      placeholder="Tuliskan narasi profil perusahaan..."
                    />
                  </div>

                  {/* Kontrol Tipografi Paragraf Profil: Gaya, Ukuran & Warna Font */}
                  <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border/60 pb-2">
                      <Type className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>Format Paragraf Profil: Gaya, Ukuran &amp; Warna Font</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* 1. Gaya Font Paragraf */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                          <span>Gaya Font</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {data.profilDescFont || "outfit"}
                          </span>
                        </label>
                        <FontSelect
                          value={data.profilDescFont || "outfit"}
                          onChange={(val) => handleFieldChange("profilDescFont", val)}
                        />
                      </div>

                      {/* 2. Ukuran Font Paragraf */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Ukuran Font</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {data.profilDescSize || 16}px
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={12}
                            max={28}
                            step={1}
                            value={data.profilDescSize || 16}
                            onChange={(e) =>
                              handleFieldChange("profilDescSize", parseInt(e.target.value, 10) || 16)
                            }
                            className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                          />
                          <input
                            type="number"
                            min={12}
                            max={28}
                            value={data.profilDescSize || 16}
                            onChange={(e) =>
                              handleFieldChange("profilDescSize", parseInt(e.target.value, 10) || 16)
                            }
                            className="w-14 px-2 py-1 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                          />
                        </div>
                      </div>

                      {/* 3. Warna Font Paragraf */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Warna Font</span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {data.profilDescColor || "Default"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.profilDescColor, "#27272a")}
                            onChange={(e) => handleFieldChange("profilDescColor", e.target.value)}
                            className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                            title="Pilih warna font kustom"
                          />
                          <input
                            type="text"
                            placeholder="Contoh: #3f3f46"
                            value={data.profilDescColor || ""}
                            onChange={(e) => handleFieldChange("profilDescColor", e.target.value)}
                            className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                          {data.profilDescColor && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("profilDescColor", "")}
                              className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                              title="Reset ke warna default tema"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Palet Preset Warna Cepat Paragraf */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                      <span className="text-muted-foreground font-medium">Preset Warna:</span>
                      {[
                        { label: "Default (Tema)", color: "" },
                        { label: "Charcoal Gelap", color: "#27272a" },
                        { label: "Abu Netral", color: "#52525b" },
                        { label: "Hijau IGN", color: "#15803D" },
                        { label: "Emerald Deep", color: "#065f46" },
                        { label: "Navy", color: "#1e293b" },
                        { label: "Putih", color: "#f4f4f5" },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleFieldChange("profilDescColor", preset.color)}
                          className={cn(
                            "px-2 py-0.5 rounded border text-[10px] transition-all cursor-pointer flex items-center gap-1",
                            (data.profilDescColor || "") === preset.color
                              ? "border-[#15803D] bg-emerald-50 text-[#15803D] dark:bg-emerald-950/40 dark:text-emerald-300 font-bold"
                              : "border-border bg-background hover:bg-muted text-foreground/80"
                          )}
                        >
                          {preset.color && (
                            <span
                              className="w-2 h-2 rounded-full border border-black/20"
                              style={{ backgroundColor: preset.color }}
                            />
                          )}
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 3: VISI & MISI ─── */}
            {activeTab === "visi_misi" && (
              <div className="space-y-6 w-full">
                <div>
                  <h3 className={cn("text-lg font-bold text-foreground", poppins.className)}>
                    Pengaturan Visi &amp; Misi Perusahaan
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Kelola rumusan visi jangka panjang dan 5 pilar komitmen misi manufaktur.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* ─── A. Header Section: Judul & Prinsip Panduan ─── */}
                  <div className="p-4 rounded-[6px] border border-border bg-card-alt space-y-4">
                    <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider block">
                      Header Section Visi &amp; Misi
                    </span>

                    {/* 1. Teks Judul Section */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-foreground">
                        <span>Judul Section Visi &amp; Misi</span>
                        <span className="text-[10px] text-muted-foreground font-mono font-normal">
                          {(data.visiMisiTitle || "Visi & Misi CV. Indo Green Nature").length} karakter
                        </span>
                      </div>
                      <input
                        type="text"
                        value={data.visiMisiTitle !== undefined ? data.visiMisiTitle : "Visi & Misi CV. Indo Green Nature"}
                        onChange={(e) => handleFieldChange("visiMisiTitle", e.target.value)}
                        placeholder="Contoh: Visi & Misi CV. Indo Green Nature"
                        className="w-full px-3.5 py-2 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                      />
                    </div>

                    {/* Toolbar Format Tipografi Judul Section */}
                    <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border/60 pb-2">
                        <Type className="w-3.5 h-3.5 text-[#15803D]" />
                        <span>Format Judul: Gaya, Ukuran &amp; Warna Font</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Gaya Font Judul */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                            <span>Gaya Font</span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {data.visiMisiTitleFont || "poppins"}
                            </span>
                          </label>
                          <FontSelect
                            value={data.visiMisiTitleFont || "poppins"}
                            onChange={(val) => handleFieldChange("visiMisiTitleFont", val)}
                          />
                        </div>

                        {/* Ukuran Font Judul */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                            <span>Ukuran Font</span>
                            <span className="text-[10px] font-mono text-[#15803D] font-bold">
                              {data.visiMisiTitleSize || 32}px
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min={18}
                              max={48}
                              step={1}
                              value={data.visiMisiTitleSize || 32}
                              onChange={(e) =>
                                handleFieldChange("visiMisiTitleSize", parseInt(e.target.value, 10) || 32)
                              }
                              className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                            />
                            <input
                              type="number"
                              min={18}
                              max={48}
                              value={data.visiMisiTitleSize || 32}
                              onChange={(e) =>
                                handleFieldChange("visiMisiTitleSize", parseInt(e.target.value, 10) || 32)
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
                              {data.visiMisiTitleColor || "Default"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={toSafeHexColor(data.visiMisiTitleColor, "#000000")}
                              onChange={(e) => handleFieldChange("visiMisiTitleColor", e.target.value)}
                              className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                              title="Pilih warna kustom"
                            />
                            <input
                              type="text"
                              placeholder="Contoh: #15803D"
                              value={data.visiMisiTitleColor || ""}
                              onChange={(e) => handleFieldChange("visiMisiTitleColor", e.target.value)}
                              className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                            />
                            {data.visiMisiTitleColor && (
                              <button
                                type="button"
                                onClick={() => handleFieldChange("visiMisiTitleColor", "")}
                                className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                                title="Reset ke warna default tema"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Palet Preset Warna Cepat */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                        <span className="text-muted-foreground font-medium">Preset Warna:</span>
                        {[
                          { label: "Default (Tema)", color: "" },
                          { label: "Hijau IGN", color: "#15803D" },
                          { label: "Amber", color: "#D97706" },
                          { label: "Emerald", color: "#059669" },
                          { label: "Charcoal", color: "#111827" },
                          { label: "Putih", color: "#FFFFFF" },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => handleFieldChange("visiMisiTitleColor", preset.color)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border bg-background hover:border-[#15803D] transition-colors cursor-pointer"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: preset.color || "#888888" }}
                            />
                            <span>{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Teks Prinsip Panduan */}
                    <div className="flex flex-col gap-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-foreground">
                        <span>Teks Prinsip Panduan (Subjudul)</span>
                        <span className="text-[10px] text-muted-foreground font-mono font-normal">
                          {(data.visiMisiSubtitle || "Prinsip panduan yang mendasari setiap inovasi, formulasi, dan kemitraan manufaktur yang kami bangun bersama seluruh mitra klien.").length} karakter
                        </span>
                      </div>
                      <AutoResizeTextarea
                        minHeight={72}
                        value={
                          data.visiMisiSubtitle !== undefined
                            ? data.visiMisiSubtitle
                            : "Prinsip panduan yang mendasari setiap inovasi, formulasi, dan kemitraan manufaktur yang kami bangun bersama seluruh mitra klien."
                        }
                        onChange={(e) => handleFieldChange("visiMisiSubtitle", e.target.value)}
                        placeholder="Tuliskan prinsip panduan Visi & Misi..."
                        className="w-full px-3.5 py-2.5 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D] leading-relaxed"
                      />
                    </div>

                    {/* Toolbar Format Tipografi Prinsip Panduan */}
                    <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border/60 pb-2">
                        <Type className="w-3.5 h-3.5 text-[#15803D]" />
                        <span>Format Prinsip Panduan: Gaya, Ukuran &amp; Warna Font</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Gaya Font Prinsip Panduan */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                            <span>Gaya Font</span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {data.visiMisiSubtitleFont || "outfit"}
                            </span>
                          </label>
                          <FontSelect
                            value={data.visiMisiSubtitleFont || "outfit"}
                            onChange={(val) => handleFieldChange("visiMisiSubtitleFont", val)}
                          />
                        </div>

                        {/* Ukuran Font Prinsip Panduan */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                            <span>Ukuran Font</span>
                            <span className="text-[10px] font-mono text-[#15803D] font-bold">
                              {data.visiMisiSubtitleSize || 16}px
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min={12}
                              max={24}
                              step={1}
                              value={data.visiMisiSubtitleSize || 16}
                              onChange={(e) =>
                                handleFieldChange("visiMisiSubtitleSize", parseInt(e.target.value, 10) || 16)
                              }
                              className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                            />
                            <input
                              type="number"
                              min={12}
                              max={24}
                              value={data.visiMisiSubtitleSize || 16}
                              onChange={(e) =>
                                handleFieldChange("visiMisiSubtitleSize", parseInt(e.target.value, 10) || 16)
                              }
                              className="w-14 px-2 py-1 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                            />
                          </div>
                        </div>

                        {/* Warna Font Prinsip Panduan */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                            <span>Warna Font</span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {data.visiMisiSubtitleColor || "Default"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={toSafeHexColor(data.visiMisiSubtitleColor, "#000000")}
                              onChange={(e) => handleFieldChange("visiMisiSubtitleColor", e.target.value)}
                              className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                              title="Pilih warna kustom"
                            />
                            <input
                              type="text"
                              placeholder="Contoh: #374151"
                              value={data.visiMisiSubtitleColor || ""}
                              onChange={(e) => handleFieldChange("visiMisiSubtitleColor", e.target.value)}
                              className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                            />
                            {data.visiMisiSubtitleColor && (
                              <button
                                type="button"
                                onClick={() => handleFieldChange("visiMisiSubtitleColor", "")}
                                className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                                title="Reset ke warna default tema"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Palet Preset Warna Cepat */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                        <span className="text-muted-foreground font-medium">Preset Warna:</span>
                        {[
                          { label: "Default (Tema)", color: "" },
                          { label: "Zinc Gelap", color: "#27272A" },
                          { label: "Zinc Sedang", color: "#52525B" },
                          { label: "Hijau IGN", color: "#15803D" },
                          { label: "Emerald", color: "#059669" },
                          { label: "Putih", color: "#FFFFFF" },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => handleFieldChange("visiMisiSubtitleColor", preset.color)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border bg-background hover:border-[#15803D] transition-colors cursor-pointer"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: preset.color || "#888888" }}
                            />
                            <span>{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ─── B. Visi Perusahaan ─── */}
                  <div className="p-4 rounded-[6px] border border-border bg-card-alt space-y-4">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider block">
                        Visi Perusahaan
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">Kartu Visi</span>
                    </div>

                    {/* Kontrol 1: Alignment Teks (Kiri, Tengah, Kanan) */}
                    <div className="flex flex-col gap-1.5 p-3 rounded-[5px] bg-background border border-border">
                      <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                        <span>Perataan Teks (Alignment)</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {data.visiAlign === "center" ? "Tengah" : data.visiAlign === "right" ? "Kanan" : "Kiri"}
                        </span>
                      </label>
                      <div className="flex items-center p-0.5 rounded-[5px] bg-muted/60 border border-border">
                        <button
                          type="button"
                          onClick={() => handleFieldChange("visiAlign", "left")}
                          className={cn(
                            "flex-1 py-1.5 text-xs font-semibold rounded-[4px] transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                            (data.visiAlign === "left" || !data.visiAlign)
                              ? "bg-background text-foreground shadow-xs border border-border/80"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                          <span>Kiri</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange("visiAlign", "center")}
                          className={cn(
                            "flex-1 py-1.5 text-xs font-semibold rounded-[4px] transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                            data.visiAlign === "center"
                              ? "bg-background text-foreground shadow-xs border border-border/80"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                          <span>Tengah</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange("visiAlign", "right")}
                          className={cn(
                            "flex-1 py-1.5 text-xs font-semibold rounded-[4px] transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                            data.visiAlign === "right"
                              ? "bg-background text-foreground shadow-xs border border-border/80"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <AlignRight className="w-3.5 h-3.5" />
                          <span>Kanan</span>
                        </button>
                      </div>
                    </div>

                    {/* Kontrol 2: Warna & Efek Background Kartu Visi */}
                    <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                      <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide">
                          <Palette className="w-3.5 h-3.5 text-[#15803D]" />
                          <span>Warna Background Kartu Visi</span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {data.visiCardBg ? "Kustom" : "Default Gradient"}
                        </span>
                      </div>

                      {/* Input Color Picker & Text */}
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={toSafeHexColor(data.visiCardBg, "#15803D")}
                          onChange={(e) => handleFieldChange("visiCardBg", e.target.value)}
                          className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                          title="Pilih warna solid kartu visi"
                        />
                        <input
                          type="text"
                          placeholder="Kode warna hex atau gradient (contoh: #15803D)"
                          value={data.visiCardBg || ""}
                          onChange={(e) => handleFieldChange("visiCardBg", e.target.value)}
                          className="flex-1 px-2.5 py-1.5 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                        />
                        {data.visiCardBg && (
                          <button
                            type="button"
                            onClick={() => handleFieldChange("visiCardBg", "")}
                            className="px-2.5 py-1.5 text-xs font-semibold rounded-[5px] bg-background hover:bg-muted text-muted-foreground border border-border transition-colors cursor-pointer"
                            title="Reset ke default gradient hijau IGN"
                          >
                            Reset
                          </button>
                        )}
                      </div>

                      {/* Preset Background: Gradient & Solid */}
                      <div className="space-y-1.5 pt-1 text-[10px]">
                        <span className="text-muted-foreground font-medium block">
                          Pilihan Cepat Latar Kartu:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {[
                            {
                              label: "Default (Gradient Hijau IGN)",
                              color: "",
                              preview: "linear-gradient(135deg, #15803d, #14532d)",
                            },
                            {
                              label: "Deep Forest",
                              color: "linear-gradient(135deg, #064E3B 0%, #022C22 100%)",
                              preview: "linear-gradient(135deg, #064E3B, #022C22)",
                            },
                            {
                              label: "Dark Slate",
                              color: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                              preview: "linear-gradient(135deg, #1E293B, #0F172A)",
                            },
                            {
                              label: "Midnight Blue",
                              color: "linear-gradient(135deg, #1E3A8A 0%, #172554 100%)",
                              preview: "linear-gradient(135deg, #1E3A8A, #172554)",
                            },
                            {
                              label: "Golden Amber",
                              color: "linear-gradient(135deg, #B45309 0%, #78350F 100%)",
                              preview: "linear-gradient(135deg, #B45309, #78350F)",
                            },
                            {
                              label: "Hijau Solid IGN",
                              color: "#15803D",
                              preview: "#15803D",
                            },
                            {
                              label: "Charcoal Dark",
                              color: "#18181B",
                              preview: "#18181B",
                            },
                            {
                              label: "Putih Bersih",
                              color: "#FFFFFF",
                              preview: "#FFFFFF",
                            },
                            {
                              label: "Soft Card Light",
                              color: "#F8FAFC",
                              preview: "#F8FAFC",
                            },
                          ].map((preset) => {
                            const isSelected = (data.visiCardBg || "") === preset.color
                            return (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => handleFieldChange("visiCardBg", preset.color)}
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-2 py-1 rounded-[4px] border transition-all cursor-pointer",
                                  isSelected
                                    ? "border-[#15803D] bg-background font-bold text-foreground shadow-xs"
                                    : "border-border/80 bg-background/60 hover:bg-background text-foreground/80 hover:border-border"
                                )}
                              >
                                <span
                                  className="w-3 h-3 rounded-full border border-black/25 shrink-0 shadow-xs"
                                  style={{ background: preset.preview }}
                                />
                                <span>{preset.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* 2. Teks Judul Visi */}
                    <div className="flex flex-col gap-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs font-bold text-foreground">
                        <span>Judul Visi</span>
                        <span className="text-[10px] text-muted-foreground font-mono font-normal">
                          {(data.visiTitle || "").length} karakter
                        </span>
                      </div>
                      <input
                        type="text"
                        value={data.visiTitle}
                        onChange={(e) => handleFieldChange("visiTitle", e.target.value)}
                        placeholder="Contoh: Menjadi Industri Manufaktur Herbal Terkemuka..."
                        className="w-full px-3.5 py-2 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                      />
                    </div>

                    {/* Toolbar Format Tipografi Judul Visi */}
                    <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border/60 pb-2">
                        <Type className="w-3.5 h-3.5 text-[#15803D]" />
                        <span>Format Judul Visi: Gaya, Ukuran &amp; Warna Font</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Gaya Font Judul Visi */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                            <span>Gaya Font</span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {data.visiTitleFont || "poppins"}
                            </span>
                          </label>
                          <FontSelect
                            value={data.visiTitleFont || "poppins"}
                            onChange={(val) => handleFieldChange("visiTitleFont", val)}
                          />
                        </div>

                        {/* Ukuran Font Judul Visi */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                            <span>Ukuran Font</span>
                            <span className="text-[10px] font-mono text-[#15803D] font-bold">
                              {data.visiTitleSize || 24}px
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min={16}
                              max={36}
                              step={1}
                              value={data.visiTitleSize || 24}
                              onChange={(e) =>
                                handleFieldChange("visiTitleSize", parseInt(e.target.value, 10) || 24)
                              }
                              className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                            />
                            <input
                              type="number"
                              min={16}
                              max={36}
                              value={data.visiTitleSize || 24}
                              onChange={(e) =>
                                handleFieldChange("visiTitleSize", parseInt(e.target.value, 10) || 24)
                              }
                              className="w-14 px-2 py-1 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                            />
                          </div>
                        </div>

                        {/* Warna Font Judul Visi */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                            <span>Warna Font</span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {data.visiTitleColor || "Default"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={toSafeHexColor(data.visiTitleColor, "#FFFFFF")}
                              onChange={(e) => handleFieldChange("visiTitleColor", e.target.value)}
                              className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                              title="Pilih warna judul visi"
                            />
                            <input
                              type="text"
                              placeholder="Contoh: #FFFFFF"
                              value={data.visiTitleColor || ""}
                              onChange={(e) => handleFieldChange("visiTitleColor", e.target.value)}
                              className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                            />
                            {data.visiTitleColor && (
                              <button
                                type="button"
                                onClick={() => handleFieldChange("visiTitleColor", "")}
                                className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                                title="Reset ke warna default tema"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Palet Preset Warna Cepat */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                        <span className="text-muted-foreground font-medium">Preset Warna:</span>
                        {[
                          { label: "Default (Putih)", color: "" },
                          { label: "Putih", color: "#FFFFFF" },
                          { label: "Hijau Muda", color: "#86EFAC" },
                          { label: "Emas/Kuning", color: "#FDE047" },
                          { label: "Hijau IGN", color: "#15803D" },
                          { label: "Dark", color: "#0F172A" },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => handleFieldChange("visiTitleColor", preset.color)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border bg-background hover:border-[#15803D] transition-colors cursor-pointer"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: preset.color || "#FFFFFF" }}
                            />
                            <span>{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Teks Deskripsi Visi */}
                    <div className="flex flex-col gap-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-foreground">
                        <span>Deskripsi Visi</span>
                        <span className="text-[10px] text-muted-foreground font-mono font-normal">
                          {(data.visiDesc || "").length} karakter
                        </span>
                      </div>
                      <AutoResizeTextarea
                        minHeight={90}
                        value={data.visiDesc}
                        onChange={(e) => handleFieldChange("visiDesc", e.target.value)}
                        placeholder="Tuliskan rumusan visi jangka panjang..."
                        className="w-full px-3.5 py-2.5 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D] leading-relaxed"
                      />
                    </div>

                    {/* Toolbar Format Tipografi Deskripsi Visi */}
                    <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border/60 pb-2">
                        <Type className="w-3.5 h-3.5 text-[#15803D]" />
                        <span>Format Deskripsi Visi: Gaya, Ukuran &amp; Warna Font</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Gaya Font Deskripsi Visi */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                            <span>Gaya Font</span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {data.visiDescFont || "outfit"}
                            </span>
                          </label>
                          <FontSelect
                            value={data.visiDescFont || "outfit"}
                            onChange={(val) => handleFieldChange("visiDescFont", val)}
                          />
                        </div>

                        {/* Ukuran Font Deskripsi Visi */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                            <span>Ukuran Font</span>
                            <span className="text-[10px] font-mono text-[#15803D] font-bold">
                              {data.visiDescSize || 15}px
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min={12}
                              max={24}
                              step={1}
                              value={data.visiDescSize || 15}
                              onChange={(e) =>
                                handleFieldChange("visiDescSize", parseInt(e.target.value, 10) || 15)
                              }
                              className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                            />
                            <input
                              type="number"
                              min={12}
                              max={24}
                              value={data.visiDescSize || 15}
                              onChange={(e) =>
                                handleFieldChange("visiDescSize", parseInt(e.target.value, 10) || 15)
                              }
                              className="w-14 px-2 py-1 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                            />
                          </div>
                        </div>

                        {/* Warna Font Deskripsi Visi */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                            <span>Warna Font</span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {data.visiDescColor || "Default"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={toSafeHexColor(data.visiDescColor, "#ECFDF5")}
                              onChange={(e) => handleFieldChange("visiDescColor", e.target.value)}
                              className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                              title="Pilih warna deskripsi visi"
                            />
                            <input
                              type="text"
                              placeholder="Contoh: #ECFDF5"
                              value={data.visiDescColor || ""}
                              onChange={(e) => handleFieldChange("visiDescColor", e.target.value)}
                              className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                            />
                            {data.visiDescColor && (
                              <button
                                type="button"
                                onClick={() => handleFieldChange("visiDescColor", "")}
                                className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                                title="Reset ke warna default"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Palet Preset Warna Cepat */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                        <span className="text-muted-foreground font-medium">Preset Warna:</span>
                        {[
                          { label: "Default (Emerald-50)", color: "" },
                          { label: "Putih", color: "#FFFFFF" },
                          { label: "Mint Halus", color: "#D1FAE5" },
                          { label: "Zinc Gelap", color: "#27272A" },
                          { label: "Zinc Sedang", color: "#52525B" },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => handleFieldChange("visiDescColor", preset.color)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border bg-background hover:border-[#15803D] transition-colors cursor-pointer"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: preset.color || "#ECFDF5" }}
                            />
                            <span>{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 4. Poin Pilar Nilai Unggulan Footer Kartu Visi */}
                    <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                      <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                            Pilar Nilai Footer Visi
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Ubah teks pilar di bagian bawah kartu visi (misal: Standar Mutu Farmasi, Inovasi Alami, dll)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddPillar}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-[#15803D] hover:bg-[#166534] text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Tambah Pilar</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(data.visiPillars && data.visiPillars.length > 0
                          ? data.visiPillars
                          : ["Standar Mutu Farmasi", "Inovasi Alami", "Orientasi Global"]
                        ).map((pillar, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-7 text-[11px] font-mono font-bold text-muted-foreground text-center">
                              #{idx + 1}
                            </span>
                            <input
                              type="text"
                              value={pillar}
                              onChange={(e) => handlePillarChange(idx, e.target.value)}
                              placeholder={`Contoh: Pilar ke-${idx + 1}...`}
                              className="flex-1 px-3 py-1.5 rounded-[4px] text-xs font-medium bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                            />
                            {(data.visiPillars || ["Standar Mutu Farmasi", "Inovasi Alami", "Orientasi Global"]).length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemovePillar(idx)}
                                className="p-1.5 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                                title="Hapus pilar ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Tombol Reset ke Default */}
                      {data.visiPillars && (
                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              broadcastPreviewUpdate({
                                ...data,
                                visiPillars: ["Standar Mutu Farmasi", "Inovasi Alami", "Orientasi Global"],
                              })
                            }
                            className="text-[10px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                          >
                            Reset ke Pilar Default IGN
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ─── C. Misi Perusahaan (Kartu Misi) ─── */}
                  <div className="p-4 rounded-[6px] border border-border bg-card-alt space-y-4">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider block">
                        Misi Perusahaan
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">Kartu Misi</span>
                    </div>

                    {/* Kontrol 1: Alignment Teks (Kiri, Tengah, Kanan) */}
                    <div className="flex flex-col gap-1.5 p-3 rounded-[5px] bg-background border border-border">
                      <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                        <span>Perataan Teks (Alignment)</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {data.misiAlign === "center" ? "Tengah" : data.misiAlign === "right" ? "Kanan" : "Kiri"}
                        </span>
                      </label>
                      <div className="flex items-center p-0.5 rounded-[5px] bg-muted/60 border border-border">
                        <button
                          type="button"
                          onClick={() => handleFieldChange("misiAlign", "left")}
                          className={cn(
                            "flex-1 py-1.5 text-xs font-semibold rounded-[4px] transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                            (data.misiAlign === "left" || !data.misiAlign)
                              ? "bg-background text-foreground shadow-xs border border-border/80"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                          <span>Kiri</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange("misiAlign", "center")}
                          className={cn(
                            "flex-1 py-1.5 text-xs font-semibold rounded-[4px] transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                            data.misiAlign === "center"
                              ? "bg-background text-foreground shadow-xs border border-border/80"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                          <span>Tengah</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange("misiAlign", "right")}
                          className={cn(
                            "flex-1 py-1.5 text-xs font-semibold rounded-[4px] transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                            data.misiAlign === "right"
                              ? "bg-background text-foreground shadow-xs border border-border/80"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <AlignRight className="w-3.5 h-3.5" />
                          <span>Kanan</span>
                        </button>
                      </div>
                    </div>

                    {/* Kontrol 2: Warna & Efek Background Kartu Misi */}
                    <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                      <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide">
                          <Palette className="w-3.5 h-3.5 text-[#15803D]" />
                          <span>Warna Background Kartu Misi</span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {data.misiCardBg ? "Kustom" : "Default Tema"}
                        </span>
                      </div>

                      {/* Input Color Picker & Text */}
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={toSafeHexColor(data.misiCardBg, "#FFFFFF")}
                          onChange={(e) => handleFieldChange("misiCardBg", e.target.value)}
                          className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                          title="Pilih warna solid kartu misi"
                        />
                        <input
                          type="text"
                          placeholder="Kode warna hex atau CSS (contoh: #FFFFFF)"
                          value={data.misiCardBg || ""}
                          onChange={(e) => handleFieldChange("misiCardBg", e.target.value)}
                          className="flex-1 px-2.5 py-1.5 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                        />
                        {data.misiCardBg && (
                          <button
                            type="button"
                            onClick={() => handleFieldChange("misiCardBg", "")}
                            className="px-2.5 py-1.5 text-xs font-semibold rounded-[5px] bg-background hover:bg-muted text-muted-foreground border border-border transition-colors cursor-pointer"
                            title="Reset ke default background tema"
                          >
                            Reset
                          </button>
                        )}
                      </div>

                      {/* Preset Background Kartu Misi */}
                      <div className="space-y-1.5 pt-1 text-[10px]">
                        <span className="text-muted-foreground font-medium block">
                          Pilihan Cepat Latar Kartu:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {[
                            { label: "Default Tema", color: "", preview: "rgba(0,0,0,0.05)" },
                            { label: "Putih Bersih", color: "#FFFFFF", preview: "#FFFFFF" },
                            { label: "Soft Cream", color: "#FDFBF7", preview: "#FDFBF7" },
                            { label: "Soft Card Light", color: "#F8FAFC", preview: "#F8FAFC" },
                            { label: "Dark Slate", color: "#18181B", preview: "#18181B" },
                            { label: "Deep Charcoal", color: "#0F172A", preview: "#0F172A" },
                            {
                              label: "Forest Glow",
                              color: "linear-gradient(135deg, #14532D 0%, #064E3B 100%)",
                              preview: "linear-gradient(135deg, #14532D, #064E3B)",
                            },
                          ].map((preset) => {
                            const isSelected = (data.misiCardBg || "") === preset.color
                            return (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => handleFieldChange("misiCardBg", preset.color)}
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-2 py-1 rounded-[4px] border transition-all cursor-pointer",
                                  isSelected
                                    ? "border-[#15803D] bg-background font-bold text-foreground shadow-xs"
                                    : "border-border/80 bg-background/60 hover:bg-background text-foreground/80 hover:border-border"
                                )}
                              >
                                <span
                                  className="w-3 h-3 rounded-full border border-black/25 shrink-0 shadow-xs"
                                  style={{ background: preset.preview }}
                                />
                                <span>{preset.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Kontrol 3: Header Kartu Misi (Badge & Judul Misi) */}
                    <div className="p-3.5 rounded-[6px] bg-background border border-border space-y-3">
                      <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                          Header Kartu: Badge &amp; Judul Misi
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">Teks Judul</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Teks Badge Misi */}
                        <div className="flex flex-col gap-1.5 md:col-span-1">
                          <label className="text-[11px] font-semibold text-foreground/80">
                            Teks Badge (Label)
                          </label>
                          <input
                            type="text"
                            value={data.misiBadge !== undefined ? data.misiBadge : "MISI KAMI"}
                            onChange={(e) => handleFieldChange("misiBadge", e.target.value)}
                            placeholder="Contoh: MISI KAMI"
                            className="w-full px-3 py-1.5 rounded-[5px] text-xs font-bold bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                        </div>

                        {/* Teks Judul Misi */}
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-[11px] font-semibold text-foreground/80">
                            Judul Misi
                          </label>
                          <input
                            type="text"
                            value={data.misiTitle !== undefined ? data.misiTitle : "Komitmen Utama Mewujudkan Keunggulan"}
                            onChange={(e) => handleFieldChange("misiTitle", e.target.value)}
                            placeholder="Contoh: Komitmen Utama Mewujudkan Keunggulan"
                            className="w-full px-3 py-1.5 rounded-[5px] text-xs font-bold bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                        </div>
                      </div>

                      {/* Toolbar Tipografi Judul Misi */}
                      <div className="p-3 rounded-[5px] bg-muted/40 border border-border/80 space-y-2.5">
                        <div className="text-[11px] font-bold text-foreground/80 uppercase tracking-wide">
                          Format Judul Misi: Gaya, Ukuran &amp; Warna Font
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Gaya Font Judul Misi */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-semibold text-foreground/80 flex items-center justify-between">
                              <span>Gaya Font</span>
                              <span className="text-[9px] text-muted-foreground font-mono">
                                {data.misiTitleFont || "poppins"}
                              </span>
                            </label>
                            <FontSelect
                              value={data.misiTitleFont || "poppins"}
                              onChange={(val) => handleFieldChange("misiTitleFont", val)}
                            />
                          </div>

                          {/* Ukuran Font Judul Misi */}
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[10px] font-semibold text-foreground/80">
                              <span>Ukuran Font</span>
                              <span className="text-[9px] font-mono text-[#15803D] font-bold">
                                {data.misiTitleSize || 24}px
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min={16}
                                max={36}
                                step={1}
                                value={data.misiTitleSize || 24}
                                onChange={(e) =>
                                  handleFieldChange("misiTitleSize", parseInt(e.target.value, 10) || 24)
                                }
                                className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                              />
                              <input
                                type="number"
                                min={16}
                                max={36}
                                value={data.misiTitleSize || 24}
                                onChange={(e) =>
                                  handleFieldChange("misiTitleSize", parseInt(e.target.value, 10) || 24)
                                }
                                className="w-12 px-1.5 py-0.5 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                              />
                            </div>
                          </div>

                          {/* Warna Font Judul Misi */}
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[10px] font-semibold text-foreground/80">
                              <span>Warna Font</span>
                              <span className="text-[9px] font-mono text-muted-foreground">
                                {data.misiTitleColor || "Default"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={toSafeHexColor(data.misiTitleColor, "#111827")}
                                onChange={(e) => handleFieldChange("misiTitleColor", e.target.value)}
                                className="w-7 h-7 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                                title="Pilih warna judul misi"
                              />
                              <input
                                type="text"
                                placeholder="#111827"
                                value={data.misiTitleColor || ""}
                                onChange={(e) => handleFieldChange("misiTitleColor", e.target.value)}
                                className="flex-1 px-2 py-0.5 rounded text-xs font-mono bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                              />
                              {data.misiTitleColor && (
                                <button
                                  type="button"
                                  onClick={() => handleFieldChange("misiTitleColor", "")}
                                  className="px-1.5 py-0.5 text-[9px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Kontrol 4: Format Tipografi Poin Komitmen Misi */}
                    <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                      <div className="flex items-center justify-between border-b border-border/60 pb-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide">
                          <Type className="w-3.5 h-3.5 text-[#15803D]" />
                          <span>Format Tipografi Poin Komitmen Misi</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">Daftar Poin</span>
                      </div>

                      {/* Format Judul Poin */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-foreground/80 flex items-center justify-between">
                            <span>Gaya Font Judul Poin</span>
                            <span className="text-[9px] text-muted-foreground font-mono">
                              {data.misiItemTitleFont || "poppins"}
                            </span>
                          </label>
                          <FontSelect
                            value={data.misiItemTitleFont || "poppins"}
                            onChange={(val) => handleFieldChange("misiItemTitleFont", val)}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[10px] font-semibold text-foreground/80">
                            <span>Ukuran Judul Poin</span>
                            <span className="text-[9px] font-mono text-[#15803D] font-bold">
                              {data.misiItemTitleSize || 14}px
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min={12}
                              max={20}
                              step={1}
                              value={data.misiItemTitleSize || 14}
                              onChange={(e) =>
                                handleFieldChange("misiItemTitleSize", parseInt(e.target.value, 10) || 14)
                              }
                              className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                            />
                            <input
                              type="number"
                              min={12}
                              max={20}
                              value={data.misiItemTitleSize || 14}
                              onChange={(e) =>
                                handleFieldChange("misiItemTitleSize", parseInt(e.target.value, 10) || 14)
                              }
                              className="w-12 px-1.5 py-0.5 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[10px] font-semibold text-foreground/80">
                            <span>Warna Judul Poin</span>
                            <span className="text-[9px] font-mono text-muted-foreground">
                              {data.misiItemTitleColor || "Default"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={toSafeHexColor(data.misiItemTitleColor, "#111827")}
                              onChange={(e) => handleFieldChange("misiItemTitleColor", e.target.value)}
                              className="w-7 h-7 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                            />
                            <input
                              type="text"
                              placeholder="#111827"
                              value={data.misiItemTitleColor || ""}
                              onChange={(e) => handleFieldChange("misiItemTitleColor", e.target.value)}
                              className="flex-1 px-2 py-0.5 rounded text-xs font-mono bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                            />
                            {data.misiItemTitleColor && (
                              <button
                                type="button"
                                onClick={() => handleFieldChange("misiItemTitleColor", "")}
                                className="px-1.5 py-0.5 text-[9px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Format Deskripsi Poin */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 border-t border-border/40">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-foreground/80 flex items-center justify-between">
                            <span>Gaya Font Deskripsi</span>
                            <span className="text-[9px] text-muted-foreground font-mono">
                              {data.misiItemDescFont || "outfit"}
                            </span>
                          </label>
                          <FontSelect
                            value={data.misiItemDescFont || "outfit"}
                            onChange={(val) => handleFieldChange("misiItemDescFont", val)}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[10px] font-semibold text-foreground/80">
                            <span>Ukuran Deskripsi</span>
                            <span className="text-[9px] font-mono text-[#15803D] font-bold">
                              {data.misiItemDescSize || 13}px
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min={11}
                              max={18}
                              step={1}
                              value={data.misiItemDescSize || 13}
                              onChange={(e) =>
                                handleFieldChange("misiItemDescSize", parseInt(e.target.value, 10) || 13)
                              }
                              className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                            />
                            <input
                              type="number"
                              min={11}
                              max={18}
                              value={data.misiItemDescSize || 13}
                              onChange={(e) =>
                                handleFieldChange("misiItemDescSize", parseInt(e.target.value, 10) || 13)
                              }
                              className="w-12 px-1.5 py-0.5 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[10px] font-semibold text-foreground/80">
                            <span>Warna Deskripsi</span>
                            <span className="text-[9px] font-mono text-muted-foreground">
                              {data.misiItemDescColor || "Default"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={toSafeHexColor(data.misiItemDescColor, "#374151")}
                              onChange={(e) => handleFieldChange("misiItemDescColor", e.target.value)}
                              className="w-7 h-7 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                            />
                            <input
                              type="text"
                              placeholder="#374151"
                              value={data.misiItemDescColor || ""}
                              onChange={(e) => handleFieldChange("misiItemDescColor", e.target.value)}
                              className="flex-1 px-2 py-0.5 rounded text-xs font-mono bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                            />
                            {data.misiItemDescColor && (
                              <button
                                type="button"
                                onClick={() => handleFieldChange("misiItemDescColor", "")}
                                className="px-1.5 py-0.5 text-[9px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Setup Warna Angka & Background Badge Nomor */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-border/40 text-[11px]">
                        {/* 1. Warna Teks Angka */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between font-semibold text-foreground/80">
                            <span>Warna Teks Angka</span>
                            <span className="text-[9px] font-mono text-muted-foreground">
                              {data.misiBadgeNumberColor || "Default"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={toSafeHexColor(data.misiBadgeNumberColor, "#FFFFFF")}
                              onChange={(e) => handleFieldChange("misiBadgeNumberColor", e.target.value)}
                              className="w-7 h-7 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                              title="Pilih warna teks angka"
                            />
                            <input
                              type="text"
                              placeholder="Default Putih (#FFFFFF)"
                              value={data.misiBadgeNumberColor || ""}
                              onChange={(e) => handleFieldChange("misiBadgeNumberColor", e.target.value)}
                              className="flex-1 px-2 py-0.5 rounded text-xs font-mono bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                            />
                            {data.misiBadgeNumberColor && (
                              <button
                                type="button"
                                onClick={() => handleFieldChange("misiBadgeNumberColor", "")}
                                className="px-1.5 py-0.5 text-[9px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                          {/* Quick Swatch Warna Teks Angka */}
                          <div className="flex items-center gap-1 flex-wrap pt-0.5 text-[9px]">
                            {[
                              { label: "Putih", color: "#FFFFFF" },
                              { label: "Hijau IGN", color: "#15803D" },
                              { label: "Kuning", color: "#FDE047" },
                              { label: "Hitam", color: "#000000" },
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => handleFieldChange("misiBadgeNumberColor", preset.color)}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-background hover:border-[#15803D] cursor-pointer"
                              >
                                <span
                                  className="w-2 h-2 rounded-full border border-black/20 shrink-0"
                                  style={{ backgroundColor: preset.color }}
                                />
                                <span>{preset.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 2. Warna Background Kotak Nomor */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between font-semibold text-foreground/80">
                            <span>Warna Background Kotak</span>
                            <span className="text-[9px] font-mono text-muted-foreground">
                              {data.misiBadgeNumberBg || "Default Hijau"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={toSafeHexColor(data.misiBadgeNumberBg, "#15803D")}
                              onChange={(e) => handleFieldChange("misiBadgeNumberBg", e.target.value)}
                              className="w-7 h-7 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                              title="Pilih warna background kotak nomor"
                            />
                            <input
                              type="text"
                              placeholder="Default Hijau (#15803D)"
                              value={data.misiBadgeNumberBg || ""}
                              onChange={(e) => handleFieldChange("misiBadgeNumberBg", e.target.value)}
                              className="flex-1 px-2 py-0.5 rounded text-xs font-mono bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                            />
                            {data.misiBadgeNumberBg && (
                              <button
                                type="button"
                                onClick={() => handleFieldChange("misiBadgeNumberBg", "")}
                                className="px-1.5 py-0.5 text-[9px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                          {/* Quick Swatch Background Kotak */}
                          <div className="flex items-center gap-1 flex-wrap pt-0.5 text-[9px]">
                            {[
                              { label: "Hijau IGN", color: "#15803D" },
                              { label: "Emerald", color: "#059669" },
                              { label: "Amber", color: "#D97706" },
                              { label: "Slate", color: "#0F172A" },
                              { label: "Putih", color: "#FFFFFF" },
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => handleFieldChange("misiBadgeNumberBg", preset.color)}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-background hover:border-[#15803D] cursor-pointer"
                              >
                                <span
                                  className="w-2 h-2 rounded-full border border-black/20 shrink-0"
                                  style={{ backgroundColor: preset.color }}
                                />
                                <span>{preset.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Kontrol 5: Kelola Daftar Poin Komitmen Misi */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                            Daftar Poin Komitmen Misi ({data.misiItems.length} Poin)
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Edit isi nomor, judul, dan deskripsi setiap butir komitmen.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddMisiItem}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[5px] bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Poin</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {data.misiItems.map((misi, i) => (
                          <div
                            key={`${misi.num}-${i}`}
                            className="p-3.5 rounded-[5px] border border-border bg-background space-y-2.5 transition-all hover:border-[#15803D]/50 shadow-xs"
                          >
                            <div className="flex items-center gap-2">
                              {/* Nomor Poin Editable */}
                              <input
                                type="text"
                                value={misi.num}
                                onChange={(e) => handleMisiChange(i, "num", e.target.value)}
                                title="Ubah nomor / label poin"
                                className="w-9 h-7 rounded-[4px] bg-[#15803D] text-white text-xs font-black text-center border-0 focus:outline-none focus:ring-2 focus:ring-[#15803D] shrink-0"
                                style={{
                                  backgroundColor: data.misiBadgeNumberBg || undefined,
                                  color: data.misiBadgeNumberColor || undefined,
                                }}
                              />

                              {/* Judul Poin */}
                              <input
                                type="text"
                                value={misi.title}
                                onChange={(e) => handleMisiChange(i, "title", e.target.value)}
                                placeholder="Judul komitmen misi..."
                                className="flex-1 px-3 py-1.5 rounded-[4px] text-xs font-bold bg-card-alt border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                              />

                              {/* Tombol Hapus Poin */}
                              {data.misiItems.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMisiItem(i)}
                                  className="p-1.5 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                                  title="Hapus butir poin komitmen ini"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Deskripsi Poin */}
                            <AutoResizeTextarea
                              minHeight={56}
                              value={misi.desc}
                              onChange={(e) => handleMisiChange(i, "desc", e.target.value)}
                              placeholder="Deskripsi komitmen misi..."
                              className="w-full px-3 py-2 rounded-[4px] text-xs bg-card-alt border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D] leading-relaxed"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 4: REKAM JEJAK & KAPABILITAS ─── */}
            {activeTab === "rekam_jejak" && (
              <div className="p-4 md:p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Pengaturan Rekam Jejak &amp; Kapabilitas
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Kelola narasi perjalanan perusahaan, judul, warna, serta butir card carousel tonggak sejarah.
                  </p>
                </div>

                {/* ─── A. Header Section Rekam Jejak ─── */}
                <div className="p-4 rounded-[6px] border border-border bg-card-alt space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider block">
                      A. Header Section Rekam Jejak
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">Judul &amp; Deskripsi</span>
                  </div>

                  {/* 1. Badge & Perataan Teks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80">
                        Label / Badge Atas
                      </label>
                      <input
                        type="text"
                        value={data.rekamJejakBadge !== undefined ? data.rekamJejakBadge : "Rekam Jejak & Kapabilitas"}
                        onChange={(e) => handleFieldChange("rekamJejakBadge", e.target.value)}
                        placeholder="Contoh: Rekam Jejak & Kapabilitas"
                        className="w-full px-3 py-1.5 rounded-[5px] text-xs font-bold bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                        <span>Perataan Teks Header</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {data.rekamJejakAlign === "center" ? "Tengah" : data.rekamJejakAlign === "right" ? "Kanan" : "Kiri"}
                        </span>
                      </label>
                      <div className="flex items-center p-0.5 rounded-[5px] bg-muted/60 border border-border">
                        <button
                          type="button"
                          onClick={() => handleFieldChange("rekamJejakAlign", "left")}
                          className={cn(
                            "flex-1 py-1 text-xs font-semibold rounded-[4px] transition-all flex items-center justify-center gap-1 cursor-pointer",
                            (data.rekamJejakAlign === "left" || !data.rekamJejakAlign)
                              ? "bg-background text-foreground shadow-xs border border-border/80"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                          <span>Kiri</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange("rekamJejakAlign", "center")}
                          className={cn(
                            "flex-1 py-1 text-xs font-semibold rounded-[4px] transition-all flex items-center justify-center gap-1 cursor-pointer",
                            data.rekamJejakAlign === "center"
                              ? "bg-background text-foreground shadow-xs border border-border/80"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                          <span>Tengah</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange("rekamJejakAlign", "right")}
                          className={cn(
                            "flex-1 py-1 text-xs font-semibold rounded-[4px] transition-all flex items-center justify-center gap-1 cursor-pointer",
                            data.rekamJejakAlign === "right"
                              ? "bg-background text-foreground shadow-xs border border-border/80"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <AlignRight className="w-3.5 h-3.5" />
                          <span>Kanan</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 2. Judul Section Rekam Jejak */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>Judul Utama Section</span>
                      <span className="text-[10px] text-muted-foreground font-mono font-normal">
                        {(data.rekamJejakTitle || "Perjalanan & Kapabilitas Manufaktur Kami").length} karakter
                      </span>
                    </div>
                    <input
                      type="text"
                      value={data.rekamJejakTitle !== undefined ? data.rekamJejakTitle : "Perjalanan & Kapabilitas Manufaktur Kami"}
                      onChange={(e) => handleFieldChange("rekamJejakTitle", e.target.value)}
                      placeholder="Contoh: Perjalanan & Kapabilitas Manufaktur Kami"
                      className="w-full px-3.5 py-2 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                    />
                  </div>

                  {/* Toolbar Format Tipografi Judul */}
                  <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border/60 pb-2">
                      <Type className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>Format Tipografi Judul Section</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Gaya Font */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                          <span>Gaya Font</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {data.rekamJejakTitleFont || "poppins"}
                          </span>
                        </label>
                        <FontSelect
                          value={data.rekamJejakTitleFont || "poppins"}
                          onChange={(val) => handleFieldChange("rekamJejakTitleFont", val)}
                        />
                      </div>

                      {/* Ukuran Font */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Ukuran Font</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {data.rekamJejakTitleSize || 32}px
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={20}
                            max={48}
                            step={1}
                            value={data.rekamJejakTitleSize || 32}
                            onChange={(e) =>
                              handleFieldChange("rekamJejakTitleSize", parseInt(e.target.value, 10) || 32)
                            }
                            className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                          />
                          <input
                            type="number"
                            min={20}
                            max={48}
                            value={data.rekamJejakTitleSize || 32}
                            onChange={(e) =>
                              handleFieldChange("rekamJejakTitleSize", parseInt(e.target.value, 10) || 32)
                            }
                            className="w-14 px-2 py-1 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                          />
                        </div>
                      </div>

                      {/* Warna Font */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Warna Font</span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {data.rekamJejakTitleColor || "Default"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.rekamJejakTitleColor, "#18181B")}
                            onChange={(e) => handleFieldChange("rekamJejakTitleColor", e.target.value)}
                            className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                            title="Pilih warna judul"
                          />
                          <input
                            type="text"
                            placeholder="Contoh: #18181B"
                            value={data.rekamJejakTitleColor || ""}
                            onChange={(e) => handleFieldChange("rekamJejakTitleColor", e.target.value)}
                            className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                          {data.rekamJejakTitleColor && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("rekamJejakTitleColor", "")}
                              className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                              title="Reset ke warna default tema"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Subjudul / Deskripsi Section */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>Subjudul / Deskripsi Pengantar</span>
                      <span className="text-[10px] text-muted-foreground font-mono font-normal">
                        {(data.rekamJejakSubtitle || "").length} karakter
                      </span>
                    </div>
                    <AutoResizeTextarea
                      minHeight={64}
                      value={
                        data.rekamJejakSubtitle !== undefined
                          ? data.rekamJejakSubtitle
                          : "Lebih dari dua dekade membuktikan dedikasi berkelanjutan dalam memajukan industri kesehatan dan obat bahan alam di Indonesia."
                      }
                      onChange={(e) => handleFieldChange("rekamJejakSubtitle", e.target.value)}
                      placeholder="Tuliskan deskripsi pengantar rekam jejak..."
                      className="w-full px-3.5 py-2.5 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D] leading-relaxed"
                    />
                  </div>

                  {/* Toolbar Tipografi Subjudul */}
                  <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border/60 pb-2">
                      <Type className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>Format Tipografi Subjudul</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Gaya Font Subjudul */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                          <span>Gaya Font</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {data.rekamJejakSubtitleFont || "outfit"}
                          </span>
                        </label>
                        <FontSelect
                          value={data.rekamJejakSubtitleFont || "outfit"}
                          onChange={(val) => handleFieldChange("rekamJejakSubtitleFont", val)}
                        />
                      </div>

                      {/* Ukuran Font Subjudul */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Ukuran Font</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {data.rekamJejakSubtitleSize || 16}px
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={12}
                            max={24}
                            step={1}
                            value={data.rekamJejakSubtitleSize || 16}
                            onChange={(e) =>
                              handleFieldChange("rekamJejakSubtitleSize", parseInt(e.target.value, 10) || 16)
                            }
                            className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                          />
                          <input
                            type="number"
                            min={12}
                            max={24}
                            value={data.rekamJejakSubtitleSize || 16}
                            onChange={(e) =>
                              handleFieldChange("rekamJejakSubtitleSize", parseInt(e.target.value, 10) || 16)
                            }
                            className="w-14 px-2 py-1 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                          />
                        </div>
                      </div>

                      {/* Warna Font Subjudul */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Warna Font</span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {data.rekamJejakSubtitleColor || "Default"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.rekamJejakSubtitleColor, "#27272A")}
                            onChange={(e) => handleFieldChange("rekamJejakSubtitleColor", e.target.value)}
                            className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                            title="Pilih warna subjudul"
                          />
                          <input
                            type="text"
                            placeholder="Contoh: #27272A"
                            value={data.rekamJejakSubtitleColor || ""}
                            onChange={(e) => handleFieldChange("rekamJejakSubtitleColor", e.target.value)}
                            className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                          {data.rekamJejakSubtitleColor && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("rekamJejakSubtitleColor", "")}
                              className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                              title="Reset ke warna default tema"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── B. Header & Styling Carousel ─── */}
                <div className="p-4 rounded-[6px] border border-border bg-card-alt space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider block">
                      B. Judul &amp; Styling Card Carousel
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">Tampilan Visual</span>
                  </div>

                  {/* Judul Carousel */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Judul Sub-section Carousel
                    </label>
                    <input
                      type="text"
                      value={data.rekamJejakCarouselTitle !== undefined ? data.rekamJejakCarouselTitle : "Tonggak Perjalanan CV. Indo Green Nature"}
                      onChange={(e) => handleFieldChange("rekamJejakCarouselTitle", e.target.value)}
                      placeholder="Contoh: Tonggak Perjalanan CV. Indo Green Nature"
                      className="w-full px-3.5 py-2 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                    />
                  </div>

                  {/* Format Judul Carousel */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-[5px] bg-background border border-border">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-foreground/80">Font Judul Carousel</span>
                      <FontSelect
                        value={data.rekamJejakCarouselTitleFont || "poppins"}
                        onChange={(val) => handleFieldChange("rekamJejakCarouselTitleFont", val)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                        <span>Ukuran Judul</span>
                        <span className="text-[10px] font-mono text-[#15803D] font-bold">
                          {data.rekamJejakCarouselTitleSize || 20}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min={14}
                        max={32}
                        value={data.rekamJejakCarouselTitleSize || 20}
                        onChange={(e) =>
                          handleFieldChange("rekamJejakCarouselTitleSize", parseInt(e.target.value, 10) || 20)
                        }
                        className="accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg mt-1"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-foreground/80">Warna Judul</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={toSafeHexColor(data.rekamJejakCarouselTitleColor, "#18181B")}
                          onChange={(e) => handleFieldChange("rekamJejakCarouselTitleColor", e.target.value)}
                          className="w-7 h-7 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="Default"
                          value={data.rekamJejakCarouselTitleColor || ""}
                          onChange={(e) => handleFieldChange("rekamJejakCarouselTitleColor", e.target.value)}
                          className="flex-1 px-2 py-1 rounded text-xs font-mono bg-background border border-border"
                        />
                        {data.rekamJejakCarouselTitleColor && (
                          <button
                            type="button"
                            onClick={() => handleFieldChange("rekamJejakCarouselTitleColor", "")}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Kustomisasi Warna Card Carousel */}
                  <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide block border-b border-border/60 pb-1.5">
                      Warna Elemen Card Carousel
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {/* Warna Tahun */}
                      <div className="flex flex-col gap-1 p-2 rounded bg-background border border-border">
                        <span className="text-[11px] font-semibold text-foreground/80">Warna Angka Tahun</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={toSafeHexColor(data.rekamJejakYearColor, "#15803D")}
                            onChange={(e) => handleFieldChange("rekamJejakYearColor", e.target.value)}
                            className="w-6 h-6 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                          />
                          <input
                            type="text"
                            placeholder="Default Hijau"
                            value={data.rekamJejakYearColor || ""}
                            onChange={(e) => handleFieldChange("rekamJejakYearColor", e.target.value)}
                            className="flex-1 px-2 py-0.5 rounded text-[11px] font-mono bg-background border border-border"
                          />
                        </div>
                      </div>

                      {/* Warna Judul Card */}
                      <div className="flex flex-col gap-1 p-2 rounded bg-background border border-border">
                        <span className="text-[11px] font-semibold text-foreground/80">Warna Judul Card</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={toSafeHexColor(data.rekamJejakCardTitleColor, "#18181B")}
                            onChange={(e) => handleFieldChange("rekamJejakCardTitleColor", e.target.value)}
                            className="w-6 h-6 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                          />
                          <input
                            type="text"
                            placeholder="Default Tema"
                            value={data.rekamJejakCardTitleColor || ""}
                            onChange={(e) => handleFieldChange("rekamJejakCardTitleColor", e.target.value)}
                            className="flex-1 px-2 py-0.5 rounded text-[11px] font-mono bg-background border border-border"
                          />
                        </div>
                      </div>

                      {/* Warna Deskripsi Card */}
                      <div className="flex flex-col gap-1 p-2 rounded bg-background border border-border">
                        <span className="text-[11px] font-semibold text-foreground/80">Warna Deskripsi Card</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={toSafeHexColor(data.rekamJejakCardDescColor, "#52525B")}
                            onChange={(e) => handleFieldChange("rekamJejakCardDescColor", e.target.value)}
                            className="w-6 h-6 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                          />
                          <input
                            type="text"
                            placeholder="Default Abu"
                            value={data.rekamJejakCardDescColor || ""}
                            onChange={(e) => handleFieldChange("rekamJejakCardDescColor", e.target.value)}
                            className="flex-1 px-2 py-0.5 rounded text-[11px] font-mono bg-background border border-border"
                          />
                        </div>
                      </div>

                      {/* Warna Background Card */}
                      <div className="flex flex-col gap-1 p-2 rounded bg-background border border-border">
                        <span className="text-[11px] font-semibold text-foreground/80">Latar Background Card</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={toSafeHexColor(data.rekamJejakCardBg, "#FFFFFF")}
                            onChange={(e) => handleFieldChange("rekamJejakCardBg", e.target.value)}
                            className="w-6 h-6 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                          />
                          <input
                            type="text"
                            placeholder="Default Background"
                            value={data.rekamJejakCardBg || ""}
                            onChange={(e) => handleFieldChange("rekamJejakCardBg", e.target.value)}
                            className="flex-1 px-2 py-0.5 rounded text-[11px] font-mono bg-background border border-border"
                          />
                        </div>
                      </div>

                      {/* Warna Border Card */}
                      <div className="flex flex-col gap-1 p-2 rounded bg-background border border-border">
                        <span className="text-[11px] font-semibold text-foreground/80">Garis Border Card</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={toSafeHexColor(data.rekamJejakCardBorderColor, "#86EFAC")}
                            onChange={(e) => handleFieldChange("rekamJejakCardBorderColor", e.target.value)}
                            className="w-6 h-6 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                          />
                          <input
                            type="text"
                            placeholder="Default Border"
                            value={data.rekamJejakCardBorderColor || ""}
                            onChange={(e) => handleFieldChange("rekamJejakCardBorderColor", e.target.value)}
                            className="flex-1 px-2 py-0.5 rounded text-[11px] font-mono bg-background border border-border"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── C. Kelola Daftar Card Carousel (Milestones) ─── */}
                <div className="p-4 rounded-[6px] border border-border bg-card-alt space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <div>
                      <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider block">
                        C. Daftar Card Carousel ({(data.rekamJejakMilestones || []).length || 5} Card)
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Tambahkan atau ubah card tahun, judul capaian, dan deskripsi singkat.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddMilestone}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[5px] bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Card</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(data.rekamJejakMilestones && data.rekamJejakMilestones.length > 0
                      ? data.rekamJejakMilestones
                      : [
                        { year: "2000", title: "Awal Berdiri di Yogyakarta", desc: "Memulai kiprah sebagai produsen pengolahan simplisia herbal murni dan jamu racik tradisional dengan komitmen mutu higienis." },
                        { year: "2008", title: "Ekspansi Pabrik Wates", desc: "Pembangunan fasilitas pabrik mandiri di Wates, Kulon Progo, serta penerbitan Izin Usaha Kecil Obat Tradisional (UKOT)." },
                        { year: "2015", title: "Sertifikasi CPOTB Penuh", desc: "Modernisasi mesin produksi otomatis kapsul, sediaan cair, dan pengesahan fasilitas Cleanroom sesuai regulasi CPOTB BPOM." },
                        { year: "2020", title: "Maklon One-Stop Solution", desc: "Meluncurkan program kemitraan maklon terpadu bagi brand owner, sukses memformulasi lebih dari 760 brand produk beredar." },
                        { year: "2024", title: "Standar ISO & Halal", desc: "Meraih sertifikasi ISO 22000 dan sertifikasi Halal BPJPH guna menjamin kepatuhan mutu farmasi serta kesiapan ekspansi ekspor." },
                      ]
                    ).map((milestone, idx) => (
                      <div
                        key={`${milestone.year}-${idx}`}
                        className="p-3.5 rounded-[5px] border border-border bg-background space-y-2.5 transition-all hover:border-[#15803D]/50 shadow-xs"
                      >
                        <div className="flex items-center gap-2">
                          {/* Input Tahun */}
                          <input
                            type="text"
                            value={milestone.year}
                            onChange={(e) => handleMilestoneChange(idx, "year", e.target.value)}
                            placeholder="Tahun"
                            title="Tahun Capaian (Contoh: 2025)"
                            className="w-16 h-8 px-2 rounded-[4px] bg-[#15803D] text-white text-xs font-black text-center border-0 focus:outline-none focus:ring-2 focus:ring-[#15803D] shrink-0"
                            style={{
                              backgroundColor: data.rekamJejakYearColor || undefined,
                            }}
                          />

                          {/* Input Judul Milestone */}
                          <input
                            type="text"
                            value={milestone.title}
                            onChange={(e) => handleMilestoneChange(idx, "title", e.target.value)}
                            placeholder="Judul tonggak capaian..."
                            className="flex-1 px-3 py-1.5 rounded-[4px] text-xs font-bold bg-card-alt border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                          />

                          {/* Tombol Hapus */}
                          {(data.rekamJejakMilestones || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMilestone(idx)}
                              className="p-1.5 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                              title="Hapus card carousel ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Input Deskripsi Milestone */}
                        <AutoResizeTextarea
                          minHeight={50}
                          value={milestone.desc}
                          onChange={(e) => handleMilestoneChange(idx, "desc", e.target.value)}
                          placeholder="Deskripsi singkat tonggak perjalanan..."
                          className="w-full px-3 py-2 rounded-[4px] text-xs bg-card-alt border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D] leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Tombol Reset ke Default */}
                  {data.rekamJejakMilestones && (
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          broadcastPreviewUpdate({
                            ...data,
                            rekamJejakMilestones: [
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
                            ],
                          })
                        }
                        className="text-[10px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                      >
                        Reset ke Daftar Milestones Default IGN
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                TAB 5: PRINSIP KERJA (NILAI & KOMITMEN)
            ════════════════════════════════════════════════════════════════ */}
            {activeTab === "prinsip_kerja" && (
              <div className="space-y-6">
                {/* Header Toolbar Tab */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-3">
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-foreground">
                      Pengaturan Prinsip Kerja (Nilai &amp; Komitmen)
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Kelola teks judul, deskripsi, gaya tipografi, dan kartu prinsip kerja yang dipegang teguh oleh perusahaan.
                    </p>
                  </div>
                </div>

                {/* ─── A. Header Section: Badge, Judul & Deskripsi ─── */}
                <div className="p-4 rounded-[6px] border border-border bg-card-alt space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                      A. Header Section: Badge, Judul &amp; Deskripsi
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">Bagian Atas</span>
                  </div>

                  {/* 1. Badge & Perataan (Align) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80">Teks Badge</label>
                      <input
                        type="text"
                        value={data.prinsipKerjaBadge ?? "Prinsip Kerja"}
                        onChange={(e) => handleFieldChange("prinsipKerjaBadge", e.target.value)}
                        placeholder="Prinsip Kerja"
                        className="w-full px-2.5 py-1.5 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80">Perataan Konten (Align)</label>
                      <div className="grid grid-cols-3 gap-1 bg-background p-0.5 rounded-[5px] border border-border">
                        {([
                          { id: "left", label: "Kiri", icon: AlignLeft },
                          { id: "center", label: "Tengah", icon: AlignCenter },
                          { id: "right", label: "Kanan", icon: AlignRight },
                        ] as const).map((align) => {
                          const Icon = align.icon
                          const isSelected = (data.prinsipKerjaAlign || "left") === align.id
                          return (
                            <button
                              key={align.id}
                              type="button"
                              onClick={() => handleFieldChange("prinsipKerjaAlign", align.id)}
                              className={cn(
                                "flex items-center justify-center gap-1 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer",
                                isSelected
                                  ? "bg-[#15803D] text-white shadow-xs"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                              )}
                            >
                              <Icon className="w-3 h-3" />
                              <span>{align.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Warna Teks Badge */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                      <span>Warna Teks Badge</span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {data.prinsipKerjaBadgeColor || "Default Tema (Hijau)"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={toSafeHexColor(data.prinsipKerjaBadgeColor, "#15803D")}
                        onChange={(e) => handleFieldChange("prinsipKerjaBadgeColor", e.target.value)}
                        className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                        title="Pilih warna teks badge"
                      />
                      <input
                        type="text"
                        placeholder="Contoh: #15803D"
                        value={data.prinsipKerjaBadgeColor || ""}
                        onChange={(e) => handleFieldChange("prinsipKerjaBadgeColor", e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                      />
                      {data.prinsipKerjaBadgeColor && (
                        <button
                          type="button"
                          onClick={() => handleFieldChange("prinsipKerjaBadgeColor", "")}
                          className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 2. Teks Judul Utama */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-border/40">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>Judul Utama Bagian Prinsip Kerja</span>
                      <span className="text-[10px] text-muted-foreground font-mono font-normal">
                        {(data.prinsipKerjaTitle || "Nilai & Komitmen CV. Indo Green Nature").length} karakter
                      </span>
                    </div>
                    <input
                      type="text"
                      value={data.prinsipKerjaTitle ?? "Nilai & Komitmen CV. Indo Green Nature"}
                      onChange={(e) => handleFieldChange("prinsipKerjaTitle", e.target.value)}
                      placeholder="Nilai & Komitmen CV. Indo Green Nature"
                      className="w-full px-3 py-2 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D] font-medium"
                    />
                  </div>

                  {/* Tipografi Judul Utama */}
                  <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border/60 pb-2">
                      <Type className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>Format Judul: Gaya, Ukuran &amp; Warna Font</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Gaya Font */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                          <span>Gaya Font</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {data.prinsipKerjaTitleFont || "poppins"}
                          </span>
                        </label>
                        <FontSelect
                          value={data.prinsipKerjaTitleFont || "poppins"}
                          onChange={(val) => handleFieldChange("prinsipKerjaTitleFont", val)}
                        />
                      </div>

                      {/* Ukuran Font */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Ukuran Font</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {data.prinsipKerjaTitleSize || 32}px
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={20}
                            max={56}
                            step={1}
                            value={data.prinsipKerjaTitleSize || 32}
                            onChange={(e) =>
                              handleFieldChange("prinsipKerjaTitleSize", parseInt(e.target.value, 10) || 32)
                            }
                            className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                          />
                          <input
                            type="number"
                            min={20}
                            max={56}
                            value={data.prinsipKerjaTitleSize || 32}
                            onChange={(e) =>
                              handleFieldChange("prinsipKerjaTitleSize", parseInt(e.target.value, 10) || 32)
                            }
                            className="w-14 px-2 py-1 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                          />
                        </div>
                      </div>

                      {/* Warna Font */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Warna Font</span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {data.prinsipKerjaTitleColor || "Default"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.prinsipKerjaTitleColor, "#18181B")}
                            onChange={(e) => handleFieldChange("prinsipKerjaTitleColor", e.target.value)}
                            className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                            title="Pilih warna judul"
                          />
                          <input
                            type="text"
                            placeholder="Contoh: #18181B"
                            value={data.prinsipKerjaTitleColor || ""}
                            onChange={(e) => handleFieldChange("prinsipKerjaTitleColor", e.target.value)}
                            className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                          {data.prinsipKerjaTitleColor && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("prinsipKerjaTitleColor", "")}
                              className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                              title="Reset ke warna default tema"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Teks Deskripsi Prinsip Kerja */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-border/40">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>Teks Deskripsi / Subjudul</span>
                      <span className="text-[10px] text-muted-foreground font-mono font-normal">
                        {(data.prinsipKerjaDesc || "").length} karakter
                      </span>
                    </div>
                    <AutoResizeTextarea
                      minHeight={70}
                      value={
                        data.prinsipKerjaDesc !== undefined
                          ? data.prinsipKerjaDesc
                          : "Integritas bisnis dan standar etika manufaktur yang selalu kami pertahankan untuk menjamin kepercayaan seluruh mitra usaha."
                      }
                      onChange={(e) => handleFieldChange("prinsipKerjaDesc", e.target.value)}
                      placeholder="Tuliskan deskripsi prinsip kerja..."
                      className="w-full px-3 py-2 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D] leading-relaxed"
                    />
                  </div>

                  {/* Tipografi Deskripsi */}
                  <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border/60 pb-2">
                      <Type className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>Format Deskripsi: Gaya, Ukuran &amp; Warna Font</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Gaya Font Deskripsi */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                          <span>Gaya Font</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {data.prinsipKerjaDescFont || "outfit"}
                          </span>
                        </label>
                        <FontSelect
                          value={data.prinsipKerjaDescFont || "outfit"}
                          onChange={(val) => handleFieldChange("prinsipKerjaDescFont", val)}
                        />
                      </div>

                      {/* Ukuran Font Deskripsi */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Ukuran Font</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {data.prinsipKerjaDescSize || 15}px
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={12}
                            max={24}
                            step={1}
                            value={data.prinsipKerjaDescSize || 15}
                            onChange={(e) =>
                              handleFieldChange("prinsipKerjaDescSize", parseInt(e.target.value, 10) || 15)
                            }
                            className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                          />
                          <input
                            type="number"
                            min={12}
                            max={24}
                            value={data.prinsipKerjaDescSize || 15}
                            onChange={(e) =>
                              handleFieldChange("prinsipKerjaDescSize", parseInt(e.target.value, 10) || 15)
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
                            {data.prinsipKerjaDescColor || "Default"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.prinsipKerjaDescColor, "#27272A")}
                            onChange={(e) => handleFieldChange("prinsipKerjaDescColor", e.target.value)}
                            className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                            title="Pilih warna deskripsi"
                          />
                          <input
                            type="text"
                            placeholder="Contoh: #27272A"
                            value={data.prinsipKerjaDescColor || ""}
                            onChange={(e) => handleFieldChange("prinsipKerjaDescColor", e.target.value)}
                            className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                          {data.prinsipKerjaDescColor && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("prinsipKerjaDescColor", "")}
                              className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                              title="Reset ke warna default"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── B. Format Tipografi & Tampilan Kartu Prinsip Kerja ─── */}
                <div className="p-4 rounded-[6px] border border-border bg-card-alt space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                      B. Format Tipografi &amp; Tampilan Kartu
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">Styling Kartu</span>
                  </div>

                  {/* Baris 1: Tipografi Judul & Deskripsi Kartu */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Judul Kartu */}
                    <div className="p-3 rounded-[6px] bg-background border border-border space-y-3">
                      <span className="text-[11px] font-bold text-foreground uppercase tracking-wide block border-b border-border/60 pb-1.5">
                        Judul Poin Kartu
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-foreground/80">Font Judul</label>
                          <FontSelect
                            value={data.prinsipKerjaCardTitleFont || "poppins"}
                            onChange={(val) => handleFieldChange("prinsipKerjaCardTitleFont", val)}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[10px] font-semibold text-foreground/80">
                            <span>Ukuran</span>
                            <span className="font-mono text-[#15803D]">{data.prinsipKerjaCardTitleSize || 15}px</span>
                          </div>
                          <input
                            type="range"
                            min={12}
                            max={22}
                            step={1}
                            value={data.prinsipKerjaCardTitleSize || 15}
                            onChange={(e) =>
                              handleFieldChange("prinsipKerjaCardTitleSize", parseInt(e.target.value, 10) || 15)
                            }
                            className="accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg mt-1"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 pt-1 border-t border-border/40">
                        <span className="text-[10px] font-semibold text-foreground/80">Warna Judul</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={toSafeHexColor(data.prinsipKerjaCardTitleColor, "#18181B")}
                            onChange={(e) => handleFieldChange("prinsipKerjaCardTitleColor", e.target.value)}
                            className="w-7 h-7 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                          />
                          <input
                            type="text"
                            placeholder="Default Tema"
                            value={data.prinsipKerjaCardTitleColor || ""}
                            onChange={(e) => handleFieldChange("prinsipKerjaCardTitleColor", e.target.value)}
                            className="flex-1 px-2 py-0.5 rounded text-[11px] font-mono bg-background border border-border"
                          />
                          {data.prinsipKerjaCardTitleColor && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("prinsipKerjaCardTitleColor", "")}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Deskripsi Kartu */}
                    <div className="p-3 rounded-[6px] bg-background border border-border space-y-3">
                      <span className="text-[11px] font-bold text-foreground uppercase tracking-wide block border-b border-border/60 pb-1.5">
                        Deskripsi Poin Kartu
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-foreground/80">Font Deskripsi</label>
                          <FontSelect
                            value={data.prinsipKerjaCardDescFont || "outfit"}
                            onChange={(val) => handleFieldChange("prinsipKerjaCardDescFont", val)}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-semibold text-foreground/80">
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center justify-between text-[10px] font-semibold text-foreground/80">
                              <span>Ukuran</span>
                              <span className="font-mono text-[#15803D]">{data.prinsipKerjaCardDescSize || 13}px</span>
                            </div>
                            <input
                              type="range"
                              min={10}
                              max={18}
                              step={1}
                              value={data.prinsipKerjaCardDescSize || 13}
                              onChange={(e) =>
                                handleFieldChange("prinsipKerjaCardDescSize", parseInt(e.target.value, 10) || 13)
                              }
                              className="accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 pt-1 border-t border-border/40">
                        <span className="text-[10px] font-semibold text-foreground/80">Warna Deskripsi</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={toSafeHexColor(data.prinsipKerjaCardDescColor, "#52525B")}
                            onChange={(e) => handleFieldChange("prinsipKerjaCardDescColor", e.target.value)}
                            className="w-7 h-7 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                          />
                          <input
                            type="text"
                            placeholder="Default Abu"
                            value={data.prinsipKerjaCardDescColor || ""}
                            onChange={(e) => handleFieldChange("prinsipKerjaCardDescColor", e.target.value)}
                            className="flex-1 px-2 py-0.5 rounded text-[11px] font-mono bg-background border border-border"
                          />
                          {data.prinsipKerjaCardDescColor && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("prinsipKerjaCardDescColor", "")}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Baris 2: Background & Border Kartu */}
                  <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide block border-b border-border/60 pb-1.5">
                      Warna Background &amp; Border Kartu
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Background Card */}
                      <div className="flex flex-col gap-1 p-2 rounded bg-background border border-border">
                        <span className="text-[11px] font-semibold text-foreground/80">Latar Background Kartu</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={toSafeHexColor(data.prinsipKerjaCardBg, "#FFFFFF")}
                            onChange={(e) => handleFieldChange("prinsipKerjaCardBg", e.target.value)}
                            className="w-7 h-7 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                          />
                          <input
                            type="text"
                            placeholder="Default Background"
                            value={data.prinsipKerjaCardBg || ""}
                            onChange={(e) => handleFieldChange("prinsipKerjaCardBg", e.target.value)}
                            className="flex-1 px-2 py-0.5 rounded text-[11px] font-mono bg-background border border-border"
                          />
                          {data.prinsipKerjaCardBg && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("prinsipKerjaCardBg", "")}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Border Card */}
                      <div className="flex flex-col gap-1 p-2 rounded bg-background border border-border">
                        <span className="text-[11px] font-semibold text-foreground/80">Garis Border Kartu</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={toSafeHexColor(data.prinsipKerjaCardBorderColor, "#86EFAC")}
                            onChange={(e) => handleFieldChange("prinsipKerjaCardBorderColor", e.target.value)}
                            className="w-7 h-7 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                          />
                          <input
                            type="text"
                            placeholder="Default Border"
                            value={data.prinsipKerjaCardBorderColor || ""}
                            onChange={(e) => handleFieldChange("prinsipKerjaCardBorderColor", e.target.value)}
                            className="flex-1 px-2 py-0.5 rounded text-[11px] font-mono bg-background border border-border"
                          />
                          {data.prinsipKerjaCardBorderColor && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("prinsipKerjaCardBorderColor", "")}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── C. Kelola Daftar Poin Nilai & Komitmen (Prinsip Kerja) ─── */}
                <div className="p-4 rounded-[6px] border border-border bg-card-alt space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                        C. Daftar Kartu Nilai &amp; Komitmen
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                        {(data.prinsipKerjaItems || [
                          { title: "1", desc: "" },
                          { title: "2", desc: "" },
                          { title: "3", desc: "" },
                          { title: "4", desc: "" },
                          { title: "5", desc: "" },
                        ]).length} Poin
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPrinsipItem}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] text-xs font-bold bg-[#15803D] hover:bg-[#166534] text-white transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Poin Prinsip</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(data.prinsipKerjaItems && data.prinsipKerjaItems.length > 0
                      ? data.prinsipKerjaItems
                      : [
                        {
                          title: "Integritas & Kerahasiaan (NDA)",
                          desc: "Jaminan 100% perlindungan kerahasiaan formula, resep, dan strategi bisnis milik setiap mitra klien tanpa pernah dibocorkan.",
                        },
                        {
                          title: "Kualitas Tanpa Kompromi",
                          desc: "Bebas dari Bahan Kimia Obat (BKO), teruji bebas cemaran logam berat dan bakteri berbahaya melalui protokol lab berlapis.",
                        },
                        {
                          title: "Inovasi Formula Efektif",
                          desc: "Kombinasi herbal sinergis berbasis literatur ilmiah modern yang aman dikonsumsi jangka panjang dan terbukti khasiatnya.",
                        },
                        {
                          title: "Ramah Lingkungan (Green Eco)",
                          desc: "Pengelolaan limbah ampas ekstraksi herbal secara bertanggung jawab sebagai pupuk organik ramah kelestarian lingkungan.",
                        },
                        {
                          title: "Kemitraan Jangka Panjang",
                          desc: "Fleksibilitas MOQ yang ramah untuk pebisnis pemula hingga korporasi besar demi tumbuh bersama secara berkesinambungan.",
                        },
                      ]
                    ).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-[6px] bg-background border border-border space-y-2.5 relative group hover:border-[#15803D]/60 transition-colors"
                      >
                        <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                          <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded bg-[#15803D]/10 text-[#15803D] text-[10px] font-mono flex items-center justify-center font-bold">
                              #{idx + 1}
                            </span>
                            <span>Poin Nilai Prinsip</span>
                          </span>

                          {(data.prinsipKerjaItems && data.prinsipKerjaItems.length > 1) && (
                            <button
                              type="button"
                              onClick={() => handleRemovePrinsipItem(idx)}
                              className="text-xs text-muted-foreground hover:text-red-500 p-1 rounded hover:bg-muted transition-colors cursor-pointer"
                              title="Hapus kartu prinsip ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Input Judul Prinsip */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-foreground/80">Judul Prinsip</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handlePrinsipItemChange(idx, "title", e.target.value)}
                            placeholder="Contoh: Integritas & Kerahasiaan (NDA)"
                            className="w-full px-2.5 py-1 rounded-[5px] text-xs bg-card-alt border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D] font-semibold"
                          />
                        </div>

                        {/* Textarea Deskripsi Prinsip */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-foreground/80">Deskripsi Poin</label>
                          <AutoResizeTextarea
                            minHeight={55}
                            value={item.desc}
                            onChange={(e) => handlePrinsipItemChange(idx, "desc", e.target.value)}
                            placeholder="Jelaskan komitmen standar mutu atau nilai kerja..."
                            className="w-full px-2.5 py-1.5 rounded-[5px] text-xs bg-card-alt border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D] leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tombol Reset ke Default */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        broadcastPreviewUpdate({
                          ...data,
                          prinsipKerjaItems: [
                            {
                              title: "Integritas & Kerahasiaan (NDA)",
                              desc: "Jaminan 100% perlindungan kerahasiaan formula, resep, dan strategi bisnis milik setiap mitra klien tanpa pernah dibocorkan.",
                            },
                            {
                              title: "Kualitas Tanpa Kompromi",
                              desc: "Bebas dari Bahan Kimia Obat (BKO), teruji bebas cemaran logam berat dan bakteri berbahaya melalui protokol lab berlapis.",
                            },
                            {
                              title: "Inovasi Formula Efektif",
                              desc: "Kombinasi herbal sinergis berbasis literatur ilmiah modern yang aman dikonsumsi jangka panjang dan terbukti khasiatnya.",
                            },
                            {
                              title: "Ramah Lingkungan (Green Eco)",
                              desc: "Pengelolaan limbah ampas ekstraksi herbal secara bertanggung jawab sebagai pupuk organik ramah kelestarian lingkungan.",
                            },
                            {
                              title: "Kemitraan Jangka Panjang",
                              desc: "Fleksibilitas MOQ yang ramah untuk pebisnis pemula hingga korporasi besar demi tumbuh bersama secara berkesinambungan.",
                            },
                          ],
                        })
                      }
                      className="text-[10px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                    >
                      Reset ke Daftar Poin Prinsip Default IGN
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                TAB 6: JANGKAUAN DISTRIBUSI (DOMESTIK & EKSPOR)
            ════════════════════════════════════════════════════════════════ */}
            {activeTab === "jangkauan_distribusi" && (
              <div className="space-y-6">
                {/* Header Toolbar Tab */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-3">
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-foreground">
                      Pengaturan Jangkauan Distribusi (Domestik &amp; Ekspor)
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Kelola teks judul, subjudul, wilayah layanan nasional, dan kapabilitas sertifikasi ekspor internasional.
                    </p>
                  </div>
                </div>

                {/* ─── A. Header Section: Badge, Judul & Deskripsi ─── */}
                <div className="p-4 rounded-[6px] border border-border bg-card-alt space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                      A. Header Section: Badge, Judul &amp; Deskripsi
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">Bagian Atas</span>
                  </div>

                  {/* 1. Badge & Perataan (Align) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80">Teks Badge</label>
                      <input
                        type="text"
                        value={data.distribusiBadge ?? "Jangkauan Distribusi"}
                        onChange={(e) => handleFieldChange("distribusiBadge", e.target.value)}
                        placeholder="Jangkauan Distribusi"
                        className="w-full px-2.5 py-1.5 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80">Perataan Konten (Align)</label>
                      <div className="grid grid-cols-3 gap-1 bg-background p-0.5 rounded-[5px] border border-border">
                        {([
                          { id: "left", label: "Kiri", icon: AlignLeft },
                          { id: "center", label: "Tengah", icon: AlignCenter },
                          { id: "right", label: "Kanan", icon: AlignRight },
                        ] as const).map((align) => {
                          const Icon = align.icon
                          const isSelected = (data.distribusiAlign || "left") === align.id
                          return (
                            <button
                              key={align.id}
                              type="button"
                              onClick={() => handleFieldChange("distribusiAlign", align.id)}
                              className={cn(
                                "flex items-center justify-center gap-1 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer",
                                isSelected
                                  ? "bg-[#15803D] text-white shadow-xs"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                              )}
                            >
                              <Icon className="w-3 h-3" />
                              <span>{align.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Warna Teks Badge */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                      <span>Warna Teks Badge</span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {data.distribusiBadgeColor || "Default Tema (Hijau)"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={toSafeHexColor(data.distribusiBadgeColor, "#15803D")}
                        onChange={(e) => handleFieldChange("distribusiBadgeColor", e.target.value)}
                        className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                        title="Pilih warna teks badge"
                      />
                      <input
                        type="text"
                        placeholder="Contoh: #15803D"
                        value={data.distribusiBadgeColor || ""}
                        onChange={(e) => handleFieldChange("distribusiBadgeColor", e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                      />
                      {data.distribusiBadgeColor && (
                        <button
                          type="button"
                          onClick={() => handleFieldChange("distribusiBadgeColor", "")}
                          className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 2. Teks Judul Utama */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-border/40">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>Judul Utama Bagian Jangkauan Distribusi</span>
                      <span className="text-[10px] text-muted-foreground font-mono font-normal">
                        {(data.distribusiTitle || "Area Layanan Pasar Domestik & Internasional").length} karakter
                      </span>
                    </div>
                    <input
                      type="text"
                      value={data.distribusiTitle ?? "Area Layanan Pasar Domestik & Internasional"}
                      onChange={(e) => handleFieldChange("distribusiTitle", e.target.value)}
                      placeholder="Area Layanan Pasar Domestik & Internasional"
                      className="w-full px-3 py-2 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D] font-medium"
                    />
                  </div>

                  {/* Tipografi Judul Utama */}
                  <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border/60 pb-2">
                      <Type className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>Format Judul: Gaya, Ukuran &amp; Warna Font</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Gaya Font */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                          <span>Gaya Font</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {data.distribusiTitleFont || "poppins"}
                          </span>
                        </label>
                        <FontSelect
                          value={data.distribusiTitleFont || "poppins"}
                          onChange={(val) => handleFieldChange("distribusiTitleFont", val)}
                        />
                      </div>

                      {/* Ukuran Font */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Ukuran Font</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {data.distribusiTitleSize || 32}px
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={20}
                            max={56}
                            step={1}
                            value={data.distribusiTitleSize || 32}
                            onChange={(e) =>
                              handleFieldChange("distribusiTitleSize", parseInt(e.target.value, 10) || 32)
                            }
                            className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                          />
                          <input
                            type="number"
                            min={20}
                            max={56}
                            value={data.distribusiTitleSize || 32}
                            onChange={(e) =>
                              handleFieldChange("distribusiTitleSize", parseInt(e.target.value, 10) || 32)
                            }
                            className="w-14 px-2 py-1 rounded bg-background border border-border text-xs font-mono font-bold text-center"
                          />
                        </div>
                      </div>

                      {/* Warna Font */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Warna Font</span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {data.distribusiTitleColor || "Default"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.distribusiTitleColor, "#18181B")}
                            onChange={(e) => handleFieldChange("distribusiTitleColor", e.target.value)}
                            className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                            title="Pilih warna judul"
                          />
                          <input
                            type="text"
                            placeholder="Contoh: #18181B"
                            value={data.distribusiTitleColor || ""}
                            onChange={(e) => handleFieldChange("distribusiTitleColor", e.target.value)}
                            className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                          {data.distribusiTitleColor && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("distribusiTitleColor", "")}
                              className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                              title="Reset ke warna default tema"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Teks Deskripsi */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-border/40">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>Teks Deskripsi / Subjudul</span>
                      <span className="text-[10px] text-muted-foreground font-mono font-normal">
                        {(data.distribusiDesc || "").length} karakter
                      </span>
                    </div>
                    <AutoResizeTextarea
                      minHeight={70}
                      value={
                        data.distribusiDesc !== undefined
                          ? data.distribusiDesc
                          : "Menjangkau para pemilik brand, klinik, apotek, dan distributor di seluruh pelosok Indonesia hingga siap memenuhi pesanan pasar luar negeri."
                      }
                      onChange={(e) => handleFieldChange("distribusiDesc", e.target.value)}
                      placeholder="Tuliskan deskripsi jangkauan distribusi..."
                      className="w-full px-3 py-2 rounded-[5px] text-xs sm:text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D] leading-relaxed"
                    />
                  </div>

                  {/* Tipografi Deskripsi */}
                  <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide border-b border-border/60 pb-2">
                      <Type className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>Format Deskripsi: Gaya, Ukuran &amp; Warna Font</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Gaya Font Deskripsi */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-foreground/80 flex items-center justify-between">
                          <span>Gaya Font</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {data.distribusiDescFont || "outfit"}
                          </span>
                        </label>
                        <FontSelect
                          value={data.distribusiDescFont || "outfit"}
                          onChange={(val) => handleFieldChange("distribusiDescFont", val)}
                        />
                      </div>

                      {/* Ukuran Font Deskripsi */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80">
                          <span>Ukuran Font</span>
                          <span className="text-[10px] font-mono text-[#15803D] font-bold">
                            {data.distribusiDescSize || 15}px
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={12}
                            max={24}
                            step={1}
                            value={data.distribusiDescSize || 15}
                            onChange={(e) =>
                              handleFieldChange("distribusiDescSize", parseInt(e.target.value, 10) || 15)
                            }
                            className="flex-1 accent-[#15803D] cursor-pointer h-1.5 bg-border rounded-lg"
                          />
                          <input
                            type="number"
                            min={12}
                            max={24}
                            value={data.distribusiDescSize || 15}
                            onChange={(e) =>
                              handleFieldChange("distribusiDescSize", parseInt(e.target.value, 10) || 15)
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
                            {data.distribusiDescColor || "Default"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={toSafeHexColor(data.distribusiDescColor, "#27272A")}
                            onChange={(e) => handleFieldChange("distribusiDescColor", e.target.value)}
                            className="w-8 h-8 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                            title="Pilih warna deskripsi"
                          />
                          <input
                            type="text"
                            placeholder="Contoh: #27272A"
                            value={data.distribusiDescColor || ""}
                            onChange={(e) => handleFieldChange("distribusiDescColor", e.target.value)}
                            className="flex-1 px-2.5 py-1 rounded-[5px] text-xs font-mono bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[#15803D]"
                          />
                          {data.distribusiDescColor && (
                            <button
                              type="button"
                              onClick={() => handleFieldChange("distribusiDescColor", "")}
                              className="px-2 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer"
                              title="Reset ke warna default"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── B. Format Tampilan & Warna Kartu (Domestik & Ekspor) ─── */}
                <div className="p-4 rounded-[6px] border border-border bg-card-alt space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                      B. Format Tampilan &amp; Warna Kartu (Domestik &amp; Ekspor)
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">Styling Bersama</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {/* Background Card */}
                    <div className="flex flex-col gap-1 p-2.5 rounded bg-background border border-border">
                      <span className="text-[11px] font-semibold text-foreground/80">Latar Background Card</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={toSafeHexColor(data.distribusiCardBg, "#FFFFFF")}
                          onChange={(e) => handleFieldChange("distribusiCardBg", e.target.value)}
                          className="w-7 h-7 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="Default Tema"
                          value={data.distribusiCardBg || ""}
                          onChange={(e) => handleFieldChange("distribusiCardBg", e.target.value)}
                          className="flex-1 px-2 py-0.5 rounded text-[11px] font-mono bg-background border border-border"
                        />
                        {data.distribusiCardBg && (
                          <button
                            type="button"
                            onClick={() => handleFieldChange("distribusiCardBg", "")}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Border Card */}
                    <div className="flex flex-col gap-1 p-2.5 rounded bg-background border border-border">
                      <span className="text-[11px] font-semibold text-foreground/80">Garis Border Card</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={toSafeHexColor(data.distribusiCardBorderColor, "#86EFAC")}
                          onChange={(e) => handleFieldChange("distribusiCardBorderColor", e.target.value)}
                          className="w-7 h-7 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="Default Border"
                          value={data.distribusiCardBorderColor || ""}
                          onChange={(e) => handleFieldChange("distribusiCardBorderColor", e.target.value)}
                          className="flex-1 px-2 py-0.5 rounded text-[11px] font-mono bg-background border border-border"
                        />
                        {data.distribusiCardBorderColor && (
                          <button
                            type="button"
                            onClick={() => handleFieldChange("distribusiCardBorderColor", "")}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Warna Teks Tag (JANGKAUAN NASIONAL / EKSPOR) */}
                    <div className="flex flex-col gap-1 p-2.5 rounded bg-background border border-border">
                      <span className="text-[11px] font-semibold text-foreground/80">Warna Teks Tag (Badge Kecil)</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={toSafeHexColor(data.distribusiTagColor, "#15803D")}
                          onChange={(e) => handleFieldChange("distribusiTagColor", e.target.value)}
                          className="w-7 h-7 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="Default Hijau"
                          value={data.distribusiTagColor || ""}
                          onChange={(e) => handleFieldChange("distribusiTagColor", e.target.value)}
                          className="flex-1 px-2 py-0.5 rounded text-[11px] font-mono bg-background border border-border"
                        />
                        {data.distribusiTagColor && (
                          <button
                            type="button"
                            onClick={() => handleFieldChange("distribusiTagColor", "")}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Warna Judul Card */}
                    <div className="flex flex-col gap-1 p-2.5 rounded bg-background border border-border">
                      <span className="text-[11px] font-semibold text-foreground/80">Warna Judul Card</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={toSafeHexColor(data.distribusiCardTitleColor, "#18181B")}
                          onChange={(e) => handleFieldChange("distribusiCardTitleColor", e.target.value)}
                          className="w-7 h-7 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="Default Tema"
                          value={data.distribusiCardTitleColor || ""}
                          onChange={(e) => handleFieldChange("distribusiCardTitleColor", e.target.value)}
                          className="flex-1 px-2 py-0.5 rounded text-[11px] font-mono bg-background border border-border"
                        />
                        {data.distribusiCardTitleColor && (
                          <button
                            type="button"
                            onClick={() => handleFieldChange("distribusiCardTitleColor", "")}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Warna Deskripsi Card */}
                    <div className="flex flex-col gap-1 p-2.5 rounded bg-background border border-border">
                      <span className="text-[11px] font-semibold text-foreground/80">Warna Deskripsi Card</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={toSafeHexColor(data.distribusiCardDescColor, "#52525B")}
                          onChange={(e) => handleFieldChange("distribusiCardDescColor", e.target.value)}
                          className="w-7 h-7 rounded border border-border p-0.5 cursor-pointer bg-background shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="Default Abu"
                          value={data.distribusiCardDescColor || ""}
                          onChange={(e) => handleFieldChange("distribusiCardDescColor", e.target.value)}
                          className="flex-1 px-2 py-0.5 rounded text-[11px] font-mono bg-background border border-border"
                        />
                        {data.distribusiCardDescColor && (
                          <button
                            type="button"
                            onClick={() => handleFieldChange("distribusiCardDescColor", "")}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── C. Pengaturan Pasar Domestik (Seluruh Indonesia) ─── */}
                <div className="p-4 rounded-[6px] border border-border bg-card-alt space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                      C. Pasar Domestik (Seluruh Indonesia)
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">Kartu Kiri</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-foreground/80">Teks Tag Sub-badge</label>
                      <input
                        type="text"
                        value={data.distribusiDomestikTag ?? "JANGKAUAN NASIONAL"}
                        onChange={(e) => handleFieldChange("distribusiDomestikTag", e.target.value)}
                        placeholder="JANGKAUAN NASIONAL"
                        className="w-full px-2.5 py-1 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-foreground/80">Judul Kartu</label>
                      <input
                        type="text"
                        value={data.distribusiDomestikTitle ?? "Pasar Domestik (Seluruh Indonesia)"}
                        onChange={(e) => handleFieldChange("distribusiDomestikTitle", e.target.value)}
                        placeholder="Pasar Domestik (Seluruh Indonesia)"
                        className="w-full px-2.5 py-1 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D] font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-foreground/80">Teks Deskripsi Domestik</label>
                    <AutoResizeTextarea
                      minHeight={60}
                      value={
                        data.distribusiDomestikDesc !== undefined
                          ? data.distribusiDomestikDesc
                          : "Kami telah melayani pengiriman produk dan pendampingan maklon bagi mitra yang tersebar di 38 Provinsi di Indonesia. Rantai logistik kami terintegrasi dengan ekspedisi kargo darat, laut, dan udara untuk pengiriman tepat waktu."
                      }
                      onChange={(e) => handleFieldChange("distribusiDomestikDesc", e.target.value)}
                      placeholder="Jelaskan jangkauan dan rantai logistik pasar domestik..."
                      className="w-full px-2.5 py-1.5 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D] leading-relaxed"
                    />
                  </div>

                  {/* Kelola Daftar Badges Kota / Wilayah */}
                  <div className="p-3 rounded-[6px] bg-background border border-border space-y-3">
                    <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-foreground">Daftar Wilayah / Kota Distribusi</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                          {(data.distribusiDomestikCities || DEFAULT_ABOUT_SETTINGS.distribusiDomestikCities || []).length} Kota
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddCity}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#15803D] hover:bg-[#166534] text-white cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Tambah Kota</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {(data.distribusiDomestikCities && data.distribusiDomestikCities.length > 0
                        ? data.distribusiDomestikCities
                        : DEFAULT_ABOUT_SETTINGS.distribusiDomestikCities || []
                      ).map((city, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-card-alt border border-border"
                        >
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => handleCityChange(idx, e.target.value)}
                            className="flex-1 bg-transparent text-xs text-foreground focus:outline-none font-medium"
                          />
                          {(data.distribusiDomestikCities || DEFAULT_ABOUT_SETTINGS.distribusiDomestikCities || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCity(idx)}
                              className="text-muted-foreground hover:text-red-500 text-xs px-1 cursor-pointer"
                              title="Hapus kota ini"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-foreground/80">Catatan Kaki (Footer Note)</label>
                    <input
                      type="text"
                      value={data.distribusiDomestikFooter ?? "Mendukung ekspedisi kargo skala kecil, palet, hingga container penuh."}
                      onChange={(e) => handleFieldChange("distribusiDomestikFooter", e.target.value)}
                      placeholder="Mendukung ekspedisi kargo skala kecil, palet, hingga container penuh."
                      className="w-full px-2.5 py-1 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                    />
                  </div>
                </div>

                {/* ─── D. Pengaturan Pasar Internasional & Ekspor ─── */}
                <div className="p-4 rounded-[6px] border border-border bg-card-alt space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                      D. Pasar Internasional &amp; Standar Ekspor
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">Kartu Kanan</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-foreground/80">Teks Tag Sub-badge</label>
                      <input
                        type="text"
                        value={data.distribusiEksporTag ?? "JANGKAUAN EKSPOR"}
                        onChange={(e) => handleFieldChange("distribusiEksporTag", e.target.value)}
                        placeholder="JANGKAUAN EKSPOR"
                        className="w-full px-2.5 py-1 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-foreground/80">Judul Kartu</label>
                      <input
                        type="text"
                        value={data.distribusiEksporTitle ?? "Pasar Internasional & Standar Ekspor"}
                        onChange={(e) => handleFieldChange("distribusiEksporTitle", e.target.value)}
                        placeholder="Pasar Internasional & Standar Ekspor"
                        className="w-full px-2.5 py-1 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D] font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-foreground/80">Teks Deskripsi Ekspor</label>
                    <AutoResizeTextarea
                      minHeight={60}
                      value={
                        data.distribusiEksporDesc !== undefined
                          ? data.distribusiEksporDesc
                          : "Dengan standar ISO 22000, CPOTB, dan sertifikasi Halal bertaraf global, CV. Indo Green Nature siap memfasilitasi kebutuhan ekspor herbal ke negara-negara tetangga dan pasar dunia."
                      }
                      onChange={(e) => handleFieldChange("distribusiEksporDesc", e.target.value)}
                      placeholder="Jelaskan standar regulasi dan kesiapan pasar ekspor..."
                      className="w-full px-2.5 py-1.5 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D] leading-relaxed"
                    />
                  </div>

                  {/* Kelola Daftar Poin Kapabilitas Ekspor */}
                  <div className="p-3 rounded-[6px] bg-background border border-border space-y-3">
                    <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-foreground">Poin Kapabilitas Ekspor</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                          {(data.distribusiEksporPoints || DEFAULT_ABOUT_SETTINGS.distribusiEksporPoints || []).length} Poin
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddExportPoint}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#15803D] hover:bg-[#166534] text-white cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Tambah Poin Ekspor</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(data.distribusiEksporPoints && data.distribusiEksporPoints.length > 0
                        ? data.distribusiEksporPoints
                        : DEFAULT_ABOUT_SETTINGS.distribusiEksporPoints || []
                      ).map((point, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2 rounded bg-card-alt border border-border"
                        >
                          <span className="text-[10px] font-mono text-[#15803D] font-bold mt-1">#{idx + 1}</span>
                          <AutoResizeTextarea
                            minHeight={40}
                            value={point}
                            onChange={(e) => handleExportPointChange(idx, e.target.value)}
                            placeholder="Tuliskan poin dokumen atau kapabilitas ekspor..."
                            className="flex-1 px-2 py-1 rounded bg-background border border-border text-xs focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                          />
                          {(data.distribusiEksporPoints || DEFAULT_ABOUT_SETTINGS.distribusiEksporPoints || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveExportPoint(idx)}
                              className="text-muted-foreground hover:text-red-500 p-1 rounded hover:bg-muted cursor-pointer mt-1"
                              title="Hapus poin ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-foreground/80">Catatan Kaki (Footer Note)</label>
                    <input
                      type="text"
                      value={data.distribusiEksporFooter ?? "Siap melayani kemitraan OEM/ODM bagi perusahaan dagang internasional."}
                      onChange={(e) => handleFieldChange("distribusiEksporFooter", e.target.value)}
                      placeholder="Siap melayani kemitraan OEM/ODM bagi perusahaan dagang internasional."
                      className="w-full px-2.5 py-1 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                TAB 7: LEGALITAS & STANDAR MUTU RESMI
            ══════════════════════════════════════════════════════════════ */}
            {activeTab === "legalitas" && (
              <div className="flex flex-col gap-6">
                {/* Hidden File Input untuk Media Card Legalitas */}
                <input
                  type="file"
                  ref={legalitasFileInputRef}
                  onChange={handleLegalitasFileUpload}
                  accept="image/*,.svg"
                  className="hidden"
                />

                {/* 1. Header Section Legalitas */}
                <div className="p-4 rounded-[5px] bg-card border border-border flex flex-col gap-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                      1. Header &amp; Judul Bagian
                    </h4>
                    <button
                      type="button"
                      onClick={() => onScrollToSection("legalitas")}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat di Halaman</span>
                    </button>
                  </div>

                  {/* Badge Text & Warna */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80">Teks Badge</label>
                      <input
                        type="text"
                        value={data.legalitasBadge ?? "Sertifikasi & Legalitas"}
                        onChange={(e) => handleFieldChange("legalitasBadge", e.target.value)}
                        placeholder="Sertifikasi & Legalitas"
                        className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80">Warna Aksen Badge</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={toSafeHexColor(data.legalitasBadgeColor, "#15803D")}
                          onChange={(e) => handleFieldChange("legalitasBadgeColor", e.target.value)}
                          className="w-8 h-8 rounded-[5px] border border-border cursor-pointer p-0.5 bg-background"
                        />
                        <input
                          type="text"
                          value={data.legalitasBadgeColor || ""}
                          onChange={(e) => handleFieldChange("legalitasBadgeColor", e.target.value)}
                          placeholder="#15803D (Default)"
                          className="flex-1 px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Posisi Alignment Header */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-foreground/80">Posisi Perataan Header</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["left", "center", "right"] as const).map((align) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() => handleFieldChange("legalitasAlign", align)}
                          className={cn(
                            "py-1.5 px-3 rounded-[5px] text-xs font-semibold border flex items-center justify-center gap-1.5 capitalize transition-all cursor-pointer",
                            (data.legalitasAlign || "center") === align
                              ? "bg-[#15803D] text-white border-[#15803D] shadow-xs"
                              : "bg-background text-foreground/70 border-border hover:bg-muted"
                          )}
                        >
                          {align === "left" && <AlignLeft className="w-3.5 h-3.5" />}
                          {align === "center" && <AlignCenter className="w-3.5 h-3.5" />}
                          {align === "right" && <AlignRight className="w-3.5 h-3.5" />}
                          <span>{align === "left" ? "Kiri" : align === "center" ? "Tengah" : "Kanan"}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Judul Utama */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
                    <label className="text-[11px] font-semibold text-foreground/80">Judul Utama</label>
                    <input
                      type="text"
                      value={data.legalitasTitle ?? "Jaminan Legalitas & Mutu Bersertifikasi"}
                      onChange={(e) => handleFieldChange("legalitasTitle", e.target.value)}
                      placeholder="Jaminan Legalitas & Mutu Bersertifikasi"
                      className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border font-medium focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                    />

                    {/* Font, Size, Warna Judul */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-muted-foreground">Jenis Font</label>
                        <FontSelect
                          value={data.legalitasTitleFont || "poppins"}
                          onChange={(val) => handleFieldChange("legalitasTitleFont", val)}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                          <span>Ukuran Font</span>
                          <span className="font-bold text-foreground">{data.legalitasTitleSize || 30}px</span>
                        </div>
                        <input
                          type="range"
                          min="18"
                          max="48"
                          value={data.legalitasTitleSize || 30}
                          onChange={(e) => handleFieldChange("legalitasTitleSize", Number(e.target.value))}
                          className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-[#15803D]"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-muted-foreground">Warna Judul</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={toSafeHexColor(data.legalitasTitleColor, "#18181B")}
                            onChange={(e) => handleFieldChange("legalitasTitleColor", e.target.value)}
                            className="w-7 h-7 rounded-[5px] border border-border cursor-pointer p-0.5 bg-background shrink-0"
                          />
                          <input
                            type="text"
                            value={data.legalitasTitleColor || ""}
                            onChange={(e) => handleFieldChange("legalitasTitleColor", e.target.value)}
                            placeholder="Default"
                            className="w-full px-2 py-1 rounded-[5px] text-[11px] bg-background border border-border font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deskripsi Header */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
                    <label className="text-[11px] font-semibold text-foreground/80">Deskripsi Paragraf</label>
                    <AutoResizeTextarea
                      value={
                        data.legalitasDesc ??
                        "Seluruh fasilitas produksi kami terakreditasi resmi oleh instansi pemerintah dan badan sertifikasi independen."
                      }
                      onChange={(e) => handleFieldChange("legalitasDesc", e.target.value)}
                      placeholder="Seluruh fasilitas produksi kami terakreditasi resmi oleh instansi pemerintah dan badan sertifikasi independen."
                      className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                      minHeight={60}
                    />

                    {/* Font, Size, Warna Deskripsi */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-muted-foreground">Jenis Font</label>
                        <FontSelect
                          value={data.legalitasDescFont || "outfit"}
                          onChange={(val) => handleFieldChange("legalitasDescFont", val)}
                        />
                      </div>

                      <div className="flex justify-between flex-col gap-1">
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                          <span>Ukuran Font</span>
                          <span className="font-bold text-foreground">{data.legalitasDescSize || 15}px</span>
                        </div>
                        <input
                          type="range"
                          min="11"
                          max="20"
                          value={data.legalitasDescSize || 15}
                          onChange={(e) => handleFieldChange("legalitasDescSize", Number(e.target.value))}
                          className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-[#15803D]"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-muted-foreground">Warna Deskripsi</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={toSafeHexColor(data.legalitasDescColor, "#27272A")}
                            onChange={(e) => handleFieldChange("legalitasDescColor", e.target.value)}
                            className="w-7 h-7 rounded-[5px] border border-border cursor-pointer p-0.5 bg-background shrink-0"
                          />
                          <input
                            type="text"
                            value={data.legalitasDescColor || ""}
                            onChange={(e) => handleFieldChange("legalitasDescColor", e.target.value)}
                            placeholder="Default"
                            className="w-full px-2 py-1 rounded-[5px] text-[11px] bg-background border border-border font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Pengaturan Gaya Tampilan Card (Kotak 1:1) & Opsi Carousel */}
                <div className="p-4 rounded-[5px] bg-card border border-border flex flex-col gap-4 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                    2. Gaya Card (Kotak 1:1) &amp; Opsi Carousel
                  </h4>

                  {/* Mode Carousel & Auto Slide ke Kiri */}
                  <div className="flex flex-col gap-2.5 p-3 rounded-[5px] bg-muted/40 border border-border">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-foreground">Mode Carousel (Slide Horizontal)</span>
                        <span className="text-[11px] text-muted-foreground leading-relaxed">
                          Menampilkan kartu dalam deretan horizontal yang dapat digeser.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={data.legalitasEnableCarousel !== false}
                          onChange={(e) => handleFieldChange("legalitasEnableCarousel", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#15803D]"></div>
                      </label>
                    </div>

                    {/* Auto Slide ke Kiri Toggle */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-border/60">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-foreground">Auto Slide ke Kiri (Otomatis Bergeser)</span>
                        <span className="text-[11px] text-muted-foreground leading-relaxed">
                          Kartu legalitas akan otomatis bergeser ke kiri secara terus-menerus tanpa jeda (infinite loop).
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={data.legalitasAutoplay !== false}
                          onChange={(e) => handleFieldChange("legalitasAutoplay", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#15803D]"></div>
                      </label>
                    </div>

                    {/* Kecepatan / Jeda Auto Slide */}
                    {data.legalitasAutoplay !== false && (
                      <div className="flex flex-col gap-1 pt-1.5 border-t border-border/40">
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                          <span>Kecepatan Auto Slide</span>
                          <span className="font-bold text-foreground">
                            {((data.legalitasAutoplayDelay || 2500) / 1000).toFixed(1)} detik
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1500"
                          max="5000"
                          step="200"
                          value={data.legalitasAutoplayDelay || 2500}
                          onChange={(e) =>
                            handleFieldChange("legalitasAutoplayDelay", Number(e.target.value))
                          }
                          className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-[#15803D]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Opsi Fit Media Foto Card (Contain vs Cover) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-foreground/80">Kesesuaian Foto di Dalam Kotak 1:1</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleFieldChange("legalitasCardFit", "contain")}
                        className={cn(
                          "py-2 px-3 rounded-[5px] text-xs font-semibold border flex flex-col items-center gap-0.5 transition-all cursor-pointer",
                          (data.legalitasCardFit || "contain") === "contain"
                            ? "bg-[#15803D] text-white border-[#15803D] shadow-xs"
                            : "bg-background text-foreground/70 border-border hover:bg-muted"
                        )}
                      >
                        <span className="font-bold">Contain (Logo Utuh)</span>
                        <span className="text-[10px] opacity-80">Rekomendasi untuk sertifikat berlogo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFieldChange("legalitasCardFit", "cover")}
                        className={cn(
                          "py-2 px-3 rounded-[5px] text-xs font-semibold border flex flex-col items-center gap-0.5 transition-all cursor-pointer",
                          data.legalitasCardFit === "cover"
                            ? "bg-[#15803D] text-white border-[#15803D] shadow-xs"
                            : "bg-background text-foreground/70 border-border hover:bg-muted"
                        )}
                      >
                        <span className="font-bold">Cover (Penuh Kotak)</span>
                        <span className="text-[10px] opacity-80">Foto memenuhi seluruh bidang kotak</span>
                      </button>
                    </div>
                  </div>

                  {/* Warna Background & Border Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-foreground/80">Warna Background Card</label>
                        <button
                          type="button"
                          onClick={() => handleFieldChange("legalitasCardBg", "transparent")}
                          className="text-[10px] text-primary hover:underline cursor-pointer font-medium"
                        >
                          Set Transparan
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={toSafeHexColor(data.legalitasCardBg, "#FFFFFF")}
                          onChange={(e) => handleFieldChange("legalitasCardBg", e.target.value)}
                          className="w-8 h-8 rounded-[5px] border border-border cursor-pointer p-0.5 bg-background shrink-0"
                        />
                        <input
                          type="text"
                          value={data.legalitasCardBg || ""}
                          onChange={(e) => handleFieldChange("legalitasCardBg", e.target.value)}
                          placeholder="transparent (Default)"
                          className="flex-1 px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border font-mono focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-foreground/80">Warna Border (Stroke) Card</label>
                        <button
                          type="button"
                          onClick={() => handleFieldChange("legalitasCardBorderColor", "transparent")}
                          className="text-[10px] text-primary hover:underline cursor-pointer font-medium"
                        >
                          Tanpa Stroke
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={toSafeHexColor(data.legalitasCardBorderColor, "#86EFAC")}
                          onChange={(e) => handleFieldChange("legalitasCardBorderColor", e.target.value)}
                          className="w-8 h-8 rounded-[5px] border border-border cursor-pointer p-0.5 bg-background shrink-0"
                        />
                        <input
                          type="text"
                          value={data.legalitasCardBorderColor || ""}
                          onChange={(e) => handleFieldChange("legalitasCardBorderColor", e.target.value)}
                          placeholder="transparent (Tanpa Stroke)"
                          className="flex-1 px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border font-mono focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Kelengkungan Sudut (Border Radius) Card */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-border/60">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-foreground/80">
                      <span>Sudut Melengkung Card (Border Radius)</span>
                      <span className="font-bold text-foreground">{data.legalitasCardRounded ?? 8}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      value={data.legalitasCardRounded ?? 8}
                      onChange={(e) => handleFieldChange("legalitasCardRounded", Number(e.target.value))}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-[#15803D]"
                    />
                  </div>

                  {/* Skala Gambar di Dalam Card (Besar / Kecil) */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-border/60">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-foreground/80">
                      <span>Skala Gambar di Dalam Card</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground">{data.legalitasImageScale ?? 65}%</span>
                        <button
                          type="button"
                          onClick={() => handleFieldChange("legalitasImageScale", 65)}
                          className="text-[10px] text-primary hover:underline cursor-pointer font-medium"
                          title="Kembalikan ke 65%"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      step="5"
                      value={data.legalitasImageScale ?? 65}
                      onChange={(e) => handleFieldChange("legalitasImageScale", Number(e.target.value))}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-[#15803D]"
                    />
                    <div className="flex justify-between text-[9px] text-muted-foreground px-0.5">
                      <span>30% (Kecil)</span>
                      <span>65% (Ideal)</span>
                      <span>100% (Penuh)</span>
                    </div>
                  </div>
                </div>

                {/* 3. Daftar Media Card Sertifikat 1:1 (Upload Pengganti Media Card) */}
                <div className="p-4 rounded-[5px] bg-card border border-border flex flex-col gap-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                        3. Kelola Media Card Sertifikasi (Kotak 1:1)
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Klik tombol <strong>Unggah Foto</strong> pada masing-masing kartu untuk mengganti media sertifikat, atau masukkan URL gambar.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={triggerUploadForNew}
                      disabled={isUploadingLegalitas}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold transition-all cursor-pointer shrink-0 shadow-xs"
                    >
                      {isUploadingLegalitas && legalitasTargetIndex === -1 ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>+ Unggah &amp; Tambah Kartu</span>
                    </button>
                  </div>

                  {/* List Item Kartu */}
                  <div className="flex flex-col gap-3.5">
                    {(data.legalitasItems || DEFAULT_ABOUT_SETTINGS.legalitasItems || []).map((item, idx) => (
                      <div
                        key={`legalitas-editor-${idx}`}
                        className="p-3.5 rounded-[5px] bg-muted/20 border border-border flex flex-col sm:flex-row items-start sm:items-center gap-3.5 hover:border-primary/40 transition-all"
                      >
                        {/* Preview Kotak 1:1 */}
                        <div
                          className="w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-[6px] overflow-hidden flex items-center justify-center p-2 relative shrink-0"
                          style={{
                            backgroundColor:
                              data.legalitasCardBg && data.legalitasCardBg !== "transparent"
                                ? data.legalitasCardBg
                                : "transparent",
                            borderColor:
                              data.legalitasCardBorderColor &&
                                data.legalitasCardBorderColor !== "transparent"
                                ? data.legalitasCardBorderColor
                                : "rgba(0,0,0,0.08)",
                            borderWidth: "1px",
                            borderStyle:
                              data.legalitasCardBorderColor === "transparent" || !data.legalitasCardBorderColor
                                ? "dashed"
                                : "solid",
                          }}
                        >
                          <img
                            src={item.imageUrl}
                            alt={`Preview Sertifikat #${idx + 1}`}
                            className={cn(
                              "w-full h-full",
                              data.legalitasCardFit === "cover" ? "object-cover" : "object-contain p-1"
                            )}
                          />
                          <span className="absolute bottom-1 right-1 px-1 rounded bg-black/70 text-white text-[9px] font-mono">
                            #{idx + 1}
                          </span>
                        </div>

                        {/* Input & Kontrol Upload */}
                        <div className="flex-1 flex flex-col gap-2 w-full">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-foreground">
                              Kartu Legalitas #{idx + 1}
                            </span>
                            {(data.legalitasItems || DEFAULT_ABOUT_SETTINGS.legalitasItems || []).length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveLegalitasItem(idx)}
                                className="text-muted-foreground hover:text-red-500 p-1 rounded hover:bg-muted cursor-pointer transition-colors"
                                title="Hapus kartu ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-muted-foreground">Tautan URL Gambar / Media Card</label>
                            <input
                              type="text"
                              value={item.imageUrl}
                              onChange={(e) => handleLegalitasItemChange(idx, e.target.value)}
                              placeholder="/images/legalitas/bpom.svg atau URL gambar https://..."
                              className="w-full px-2.5 py-1.5 rounded-[5px] text-xs bg-background border border-border font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-0.5">
                            <button
                              type="button"
                              onClick={() => triggerUploadForIndex(idx)}
                              disabled={isUploadingLegalitas}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] bg-background hover:bg-muted border border-border text-xs font-semibold text-foreground transition-all cursor-pointer shadow-2xs"
                            >
                              {isUploadingLegalitas && legalitasTargetIndex === idx ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                              ) : (
                                <Upload className="w-3.5 h-3.5 text-primary" />
                              )}
                              <span>
                                {isUploadingLegalitas && legalitasTargetIndex === idx
                                  ? "Mengunggah..."
                                  : "Ganti Foto (Upload File)"}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tombol Tambah Kartu Kosong/Manual */}
                  <button
                    type="button"
                    onClick={handleAddLegalitasItem}
                    className="w-full py-2.5 rounded-[5px] border border-dashed border-border hover:border-primary/50 bg-background hover:bg-muted/30 text-xs font-semibold text-foreground/80 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-primary" />
                    <span>+ Tambah Kartu Legalitas Manual</span>
                  </button>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                TAB 8: KONSULTASI BRAND (CTA BANNER)
            ════════════════════════════════════════════════════════════════ */}
            {activeTab === "konsultasi_brand" && (
              <div className="space-y-6">
                {/* 1. Header & Teks Banner CTA */}
                <div className="p-4 rounded-[5px] bg-card border border-border flex flex-col gap-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                      1. Judul &amp; Deskripsi Konsultasi Brand
                    </h4>
                    <button
                      type="button"
                      onClick={() => onScrollToSection("konsultasi-brand")}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat di Halaman</span>
                    </button>
                  </div>

                  {/* Judul CTA */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-foreground/80">Teks Judul CTA</label>
                    <input
                      type="text"
                      value={data.ctaTitle ?? "Mulai Konsultasi Brand Herbal Anda Hari Ini"}
                      onChange={(e) => handleFieldChange("ctaTitle", e.target.value)}
                      placeholder="Mulai Konsultasi Brand Herbal Anda Hari Ini"
                      className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D] font-medium"
                    />
                  </div>

                  {/* Tipografi Judul */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-muted-foreground">Jenis Font</label>
                      <FontSelect
                        value={data.ctaTitleFont || "poppins"}
                        onChange={(val) => handleFieldChange("ctaTitleFont", val)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                        <span>Ukuran Font</span>
                        <span className="font-bold text-foreground">{data.ctaTitleSize || 28}px</span>
                      </div>
                      <input
                        type="range"
                        min="18"
                        max="44"
                        value={data.ctaTitleSize || 28}
                        onChange={(e) => handleFieldChange("ctaTitleSize", Number(e.target.value))}
                        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-[#15803D]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-muted-foreground">Warna Judul</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={toSafeHexColor(data.ctaTitleColor, "#FFFFFF")}
                          onChange={(e) => handleFieldChange("ctaTitleColor", e.target.value)}
                          className="w-7 h-7 rounded-[5px] border border-border cursor-pointer p-0.5 bg-background shrink-0"
                        />
                        <input
                          type="text"
                          value={data.ctaTitleColor || ""}
                          onChange={(e) => handleFieldChange("ctaTitleColor", e.target.value)}
                          placeholder="#FFFFFF (Default)"
                          className="w-full px-2 py-1 rounded-[5px] text-[11px] bg-background border border-border font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Deskripsi CTA */}
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-border/60">
                    <label className="text-[11px] font-semibold text-foreground/80">Teks Deskripsi CTA</label>
                    <AutoResizeTextarea
                      value={
                        data.ctaDesc ??
                        "Diskusikan rancangan formula, kemasan, estimasi biaya maklon, dan jadwal produksi bersama tim ahli CV. Indo Green Nature tanpa dipungut biaya."
                      }
                      onChange={(e) => handleFieldChange("ctaDesc", e.target.value)}
                      placeholder="Diskusikan rancangan formula, kemasan, estimasi biaya maklon, dan jadwal produksi bersama tim ahli CV. Indo Green Nature tanpa dipungut biaya."
                      className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                      minHeight={60}
                    />
                  </div>

                  {/* Tipografi Deskripsi */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-muted-foreground">Jenis Font</label>
                      <FontSelect
                        value={data.ctaDescFont || "outfit"}
                        onChange={(val) => handleFieldChange("ctaDescFont", val)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                        <span>Ukuran Font</span>
                        <span className="font-bold text-foreground">{data.ctaDescSize || 15}px</span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="22"
                        value={data.ctaDescSize || 15}
                        onChange={(e) => handleFieldChange("ctaDescSize", Number(e.target.value))}
                        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-[#15803D]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-muted-foreground">Warna Deskripsi</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={toSafeHexColor(data.ctaDescColor, "#D1FAE5")}
                          onChange={(e) => handleFieldChange("ctaDescColor", e.target.value)}
                          className="w-7 h-7 rounded-[5px] border border-border cursor-pointer p-0.5 bg-background shrink-0"
                        />
                        <input
                          type="text"
                          value={data.ctaDescColor || ""}
                          onChange={(e) => handleFieldChange("ctaDescColor", e.target.value)}
                          placeholder="#D1FAE5 (Default)"
                          className="w-full px-2 py-1 rounded-[5px] text-[11px] bg-background border border-border font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Pengaturan Tombol & OPSI BUTTON FULL ROUNDED */}
                <div className="p-4 rounded-[5px] bg-card border border-border flex flex-col gap-4 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                    2. Gaya Tombol Aksi (CTA Buttons)
                  </h4>

                  {/* OPSI BUTTON FULL ROUNDED */}
                  <div className="p-3.5 rounded-[5px] bg-muted/40 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">
                          Bentuk Tombol Full Rounded (Pill / Lonjong)
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            data.ctaButtonFullRounded
                              ? "bg-[#15803D] text-white"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {data.ctaButtonFullRounded ? "Aktif: Full Rounded" : "Kotak (Default)"}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground leading-relaxed">
                        Jika diaktifkan, tombol aksi CTA akan berformat melengkung penuh (<strong>rounded-full</strong> / kapsul). Jika nonaktif, tombol berformat sudut rapi (<strong>rounded-[5px]</strong>).
                      </span>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={Boolean(data.ctaButtonFullRounded)}
                        onChange={(e) => handleFieldChange("ctaButtonFullRounded", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#15803D]"></div>
                    </label>
                  </div>

                  {/* Pratinjau Langsung Card Banner & Tombol */}
                  <div
                    className="p-4 rounded-[6px] border flex flex-col items-center justify-center gap-3 transition-all"
                    style={{
                      background:
                        data.ctaCardBg ||
                        "linear-gradient(to right, #143d23, #1e5631, #0e2a18)",
                      borderColor: data.ctaCardBorderColor || "rgba(21, 128, 61, 0.4)",
                    }}
                  >
                    <div className="flex flex-col items-center text-center gap-1">
                      <span className="text-[10px] font-semibold text-emerald-200/80 uppercase tracking-wider">
                        Pratinjau Live Card Banner &amp; Tombol
                      </span>
                      <span className="text-xs font-bold text-white max-w-sm line-clamp-1">
                        {data.ctaTitle || "Mulai Konsultasi Brand Herbal Anda Hari Ini"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 px-5 py-2.5 font-bold text-xs shadow-md transition-all",
                          data.ctaButtonFullRounded ? "rounded-full" : "rounded-[5px]",
                          !data.ctaButtonBg && "bg-white text-[#1e5631]"
                        )}
                        style={{
                          backgroundColor: data.ctaButtonBg || undefined,
                          color: data.ctaButtonTextColor || undefined,
                        }}
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{data.ctaWhatsappText || "WhatsApp Kami"}</span>
                      </div>
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white font-semibold text-xs border border-white/20 transition-all",
                          data.ctaButtonFullRounded ? "rounded-full" : "rounded-[5px]"
                        )}
                      >
                        <span>{data.ctaSecondaryText || "Kembali ke Beranda"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pengaturan Detail Tombol WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80">Teks Tombol Utama</label>
                      <input
                        type="text"
                        value={data.ctaWhatsappText ?? "WhatsApp Kami"}
                        onChange={(e) => handleFieldChange("ctaWhatsappText", e.target.value)}
                        placeholder="WhatsApp Kami"
                        className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80">Custom Link WhatsApp (Opsional)</label>
                      <input
                        type="text"
                        value={data.ctaWhatsappUrl || ""}
                        onChange={(e) => handleFieldChange("ctaWhatsappUrl", e.target.value)}
                        placeholder="Default nomor WA perusahaan"
                        className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                      />
                    </div>
                  </div>

                  {/* Warna Tombol WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-muted-foreground">Warna Background Tombol</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={toSafeHexColor(data.ctaButtonBg, "#FFFFFF")}
                          onChange={(e) => handleFieldChange("ctaButtonBg", e.target.value)}
                          className="w-7 h-7 rounded-[5px] border border-border cursor-pointer p-0.5 bg-background shrink-0"
                        />
                        <input
                          type="text"
                          value={data.ctaButtonBg || ""}
                          onChange={(e) => handleFieldChange("ctaButtonBg", e.target.value)}
                          placeholder="#FFFFFF (Default)"
                          className="w-full px-2 py-1 rounded-[5px] text-[11px] bg-background border border-border font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-muted-foreground">Warna Teks Tombol</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={toSafeHexColor(data.ctaButtonTextColor, "#1E5631")}
                          onChange={(e) => handleFieldChange("ctaButtonTextColor", e.target.value)}
                          className="w-7 h-7 rounded-[5px] border border-border cursor-pointer p-0.5 bg-background shrink-0"
                        />
                        <input
                          type="text"
                          value={data.ctaButtonTextColor || ""}
                          onChange={(e) => handleFieldChange("ctaButtonTextColor", e.target.value)}
                          placeholder="#1E5631 (Default)"
                          className="w-full px-2 py-1 rounded-[5px] text-[11px] bg-background border border-border font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pengaturan Detail Tombol Sekunder */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80">Teks Tombol Sekunder</label>
                      <input
                        type="text"
                        value={data.ctaSecondaryText ?? "Kembali ke Beranda"}
                        onChange={(e) => handleFieldChange("ctaSecondaryText", e.target.value)}
                        placeholder="Kembali ke Beranda"
                        className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-foreground/80">Link URL Tombol Sekunder</label>
                      <input
                        type="text"
                        value={data.ctaSecondaryUrl ?? "/"}
                        onChange={(e) => handleFieldChange("ctaSecondaryUrl", e.target.value)}
                        placeholder="/"
                        className="w-full px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Warna Card Banner CTA (Background & Border) */}
                <div className="p-4 rounded-[5px] bg-card border border-border flex flex-col gap-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                      3. Warna Card Banner CTA
                    </h4>
                    {(data.ctaCardBg || data.ctaCardBorderColor) && (
                      <button
                        type="button"
                        onClick={() => {
                          handleFieldChange("ctaCardBg", "")
                          handleFieldChange("ctaCardBorderColor", "")
                        }}
                        className="text-[10px] text-muted-foreground hover:text-red-500 font-semibold cursor-pointer"
                      >
                        Reset ke Default
                      </button>
                    )}
                  </div>

                  {/* Warna Background Card */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-foreground/80">
                        Warna Background Card Banner
                      </label>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {data.ctaCardBg || "Default (Gradasi Hijau Botani)"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={toSafeHexColor(data.ctaCardBg, "#143D23")}
                        onChange={(e) => handleFieldChange("ctaCardBg", e.target.value)}
                        className="w-8 h-8 rounded-[5px] border border-border cursor-pointer p-0.5 bg-background shrink-0"
                        title="Pilih warna solid"
                      />
                      <input
                        type="text"
                        value={data.ctaCardBg || ""}
                        onChange={(e) => handleFieldChange("ctaCardBg", e.target.value)}
                        placeholder="Contoh: #143D23 atau linear-gradient(...)"
                        className="flex-1 px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                      />
                      {data.ctaCardBg && (
                        <button
                          type="button"
                          onClick={() => handleFieldChange("ctaCardBg", "")}
                          className="px-2.5 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer shrink-0"
                        >
                          Default
                        </button>
                      )}
                    </div>

                    {/* Preset Warna Populer Card CTA */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-muted-foreground mr-1">Preset Cepat:</span>
                      <button
                        type="button"
                        onClick={() => handleFieldChange("ctaCardBg", "")}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer"
                      >
                        Hijau Botani (Default)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleFieldChange(
                            "ctaCardBg",
                            "linear-gradient(135deg, #064e3b 0%, #047857 100%)"
                          )
                        }
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-900 text-white border border-emerald-700 hover:opacity-90 transition-all cursor-pointer"
                      >
                        Emerald Cerah
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleFieldChange(
                            "ctaCardBg",
                            "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
                          )
                        }
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-white border border-slate-700 hover:opacity-90 transition-all cursor-pointer"
                      >
                        Midnight Navy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFieldChange("ctaCardBg", "#18181b")}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-900 text-white border border-zinc-700 hover:opacity-90 transition-all cursor-pointer"
                      >
                        Hitam Elegan
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFieldChange("ctaCardBg", "#15803D")}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#15803D] text-white border border-[#15803D] hover:opacity-90 transition-all cursor-pointer"
                      >
                        Hijau CV Solid
                      </button>
                    </div>
                  </div>

                  {/* Warna Border Card */}
                  <div className="flex flex-col gap-1.5 pt-3 border-t border-border/60">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-foreground/80">
                        Warna Border / Garis Tepi Card
                      </label>
                      <button
                        type="button"
                        onClick={() => handleFieldChange("ctaCardBorderColor", "transparent")}
                        className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer underline"
                      >
                        Tanpa Border
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={toSafeHexColor(data.ctaCardBorderColor, "#15803D")}
                        onChange={(e) => handleFieldChange("ctaCardBorderColor", e.target.value)}
                        className="w-8 h-8 rounded-[5px] border border-border cursor-pointer p-0.5 bg-background shrink-0"
                      />
                      <input
                        type="text"
                        value={data.ctaCardBorderColor || ""}
                        onChange={(e) => handleFieldChange("ctaCardBorderColor", e.target.value)}
                        placeholder="Default (#15803D dengan opasitas)"
                        className="flex-1 px-3 py-1.5 rounded-[5px] text-xs bg-background border border-border font-mono uppercase text-[11px] focus:outline-none focus:ring-1 focus:ring-[#15803D]"
                      />
                      {data.ctaCardBorderColor && (
                        <button
                          type="button"
                          onClick={() => handleFieldChange("ctaCardBorderColor", "")}
                          className="px-2.5 py-1 text-[10px] rounded bg-muted hover:bg-muted/80 text-muted-foreground cursor-pointer shrink-0"
                        >
                          Reset
                        </button>
                      )}
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
