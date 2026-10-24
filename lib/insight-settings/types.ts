export interface InsightSettingsData {
  // ─── BADGE / SUB-JUDUL BANNER ───
  bannerBadgeText: string
  bannerBadgeShow: boolean
  bannerBadgeColor: string
  bannerBadgeBg: string
  bannerBadgeBorderColor: string
  bannerBadgeFont: string
  bannerBadgeSize: number

  // ─── JUDUL UTAMA BANNER ───
  bannerTitleLine1: string
  bannerTitleLine2: string
  bannerTitleColor: string
  bannerTitleHighlightColor: string
  bannerTitleUseGradient: boolean
  bannerTitleGradientFrom: string
  bannerTitleGradientTo: string
  bannerTitleFont: string
  bannerTitleSize: number
  bannerTitleWeight: string
  bannerTitleAlign: "left" | "center" | "right"

  // ─── DESKRIPSI PENGANTAR ───
  bannerDesc: string
  bannerDescShow: boolean
  bannerDescColor: string
  bannerDescFont: string
  bannerDescSize: number
  bannerDescMaxWidth: number

  // ─── BACKGROUND & POLA DEKORASI ───
  bannerBgType: "gradient" | "solid" | "image"
  bannerBgGradientFrom: string
  bannerBgGradientVia: string
  bannerBgGradientTo: string
  bannerBgSolidColor: string
  bannerBgImage: string
  bannerShowPattern: boolean
  bannerPatternColor: string
  bannerPatternOpacity: number

  // ─── PENCARIAN & KATEGORI ───
  bannerSearchPlaceholder: string
  bannerShowSearch: boolean
  bannerShowCategories: boolean
  bannerCategoryActiveBg: string
  bannerCategoryActiveColor: string
  bannerCategoryInactiveBg: string
  bannerCategoryInactiveColor: string

  // ─── TOMBOL CTA HERO BANNER (OPSIONAL) ───
  bannerShowCta: boolean
  bannerCtaText: string
  bannerCtaLink: string
  bannerCtaBg: string
  bannerCtaTextColor: string

  // ─── LOGO BANNER TRANSPARAN (POJOK KANAN) ───
  bannerFrameShow: boolean
  bannerFrameImage: string
  bannerFrameAlt: string
  bannerFrameSize: number // Lebar/tinggi logo dalam px (default 320)
  bannerFrameFit: "cover" | "contain"
  bannerFrameAlign?: "top" | "center" | "bottom" // Perataan vertikal logo terhadap teks judul (default "center" agar judul & deskripsi seimbang di tengah)
  bannerFrameOffsetY?: number // Penyesuaian posisi naik/turun logo dalam px (default 0)
  bannerFrameRounded?: number // Radius sudut (opsional untuk kompatibilitas data lama)
  bannerFrameBorderWidth?: number // Ketebalan border dalam px (opsional)
  bannerFrameBorderColor?: string // Warna border (opsional)
  bannerFrameBg?: string // Latar belakang (opsional)
  bannerFrameShadow?: boolean // Efek bayangan (opsional)
  bannerFrameGlow?: boolean // Efek ambient glow (opsional)
  bannerFrameGlowColor?: string // Warna ambient glow (opsional)
  bannerFrameLink: string // URL tautan saat logo diklik (opsional)

  // ─── WIDGET FORMULASI SERUPA (STICKY SIDEBAR ARTIKEL) ───
  sidebarCtaShow: boolean
  sidebarCtaBadge: string
  sidebarCtaTitle: string
  sidebarCtaDesc: string
  sidebarCtaBtnText: string
  sidebarCtaBtnLink: string
  sidebarCtaBtnBg?: string
  sidebarCtaBtnColor?: string
  sidebarCtaSublinkText: string
  sidebarCtaSublinkUrl: string

  // ─── CARD KEMBANGKAN BRAND HERBAL (BOTTOM CTA ARTIKEL) ───
  bottomCtaShow: boolean
  bottomCtaTitle: string
  bottomCtaDesc: string
  bottomCtaBtnText: string
  bottomCtaBtnLink: string
  bottomCtaBtnBg?: string
  bottomCtaBtnColor?: string

  // ─── FOTO FRAME INSIGHT (COVER ARTIKEL DETAIL) ───
  articleCoverHeight?: number
  articleCoverFit?: "cover" | "contain"
}

export const DEFAULT_INSIGHT_SETTINGS: InsightSettingsData = {
  // Badge
  bannerBadgeText: "Riset, Regulasi & Tren Bisnis Herbal Terkini",
  bannerBadgeShow: true,
  bannerBadgeColor: "#15803d", // Hijau Hutan
  bannerBadgeBg: "#15803d1a", // Hijau Hutan 10%
  bannerBadgeBorderColor: "#15803d4d", // Hijau Hutan 30%
  bannerBadgeFont: "outfit",
  bannerBadgeSize: 12,

  // Title
  bannerTitleLine1: "Insight & Riset Herbal",
  bannerTitleLine2: "CV. Indo Green Nature",
  bannerTitleColor: "", // inherits foreground
  bannerTitleHighlightColor: "#15803d",
  bannerTitleUseGradient: true,
  bannerTitleGradientFrom: "#166534", // Hijau Hutan Gelap
  bannerTitleGradientTo: "#15803d", // Hijau Hutan
  bannerTitleFont: "outfit",
  bannerTitleSize: 44,
  bannerTitleWeight: "800",
  bannerTitleAlign: "left",

  // Desc
  bannerDesc:
    "Kumpulan artikel mendalam, panduan maklon sediaan alami, standar Cara Pembuatan Obat Tradisional yang Baik (CPOTB), regulasi BPOM & Halal, serta inspirasi inovasi formulasi herbal bernilai jual tinggi.",
  bannerDescShow: true,
  bannerDescColor: "", // inherits muted-foreground
  bannerDescFont: "poppins",
  bannerDescSize: 15,
  bannerDescMaxWidth: 896, // 4xl

  // Background
  bannerBgType: "gradient",
  bannerBgGradientFrom: "#15803d1a", // Hijau Hutan 10%
  bannerBgGradientVia: "#15803d0d", // Hijau Hutan 5%
  bannerBgGradientTo: "transparent",
  bannerBgSolidColor: "#ffffff",
  bannerBgImage: "",
  bannerShowPattern: true,
  bannerPatternColor: "#15803d",
  bannerPatternOpacity: 15,

  // Search & Categories
  bannerSearchPlaceholder: "Cari insight, bahan, regulasi...",
  bannerShowSearch: true,
  bannerShowCategories: true,
  bannerCategoryActiveBg: "#15803d",
  bannerCategoryActiveColor: "#ffffff",
  bannerCategoryInactiveBg: "",
  bannerCategoryInactiveColor: "",

  // CTA
  bannerShowCta: false,
  bannerCtaText: "Konsultasi Formulasi Maklon",
  bannerCtaLink: "https://wa.me/6281234567890?text=Halo%20CV.%20Indo%20Green%20Nature%2C%20saya%20ingin%20konsultasi%20layanan%20maklon%20herbal.",
  bannerCtaBg: "#15803d",
  bannerCtaTextColor: "#ffffff",

  // Logo Banner (Transparan) Pojok Kanan
  bannerFrameShow: true,
  bannerFrameImage: "/logo.png",
  bannerFrameAlt: "Logo CV. Indo Green Nature",
  bannerFrameSize: 320,
  bannerFrameFit: "contain",
  bannerFrameAlign: "center",
  bannerFrameOffsetY: 0,
  bannerFrameRounded: 0,
  bannerFrameBorderWidth: 0,
  bannerFrameBorderColor: "transparent",
  bannerFrameBg: "transparent",
  bannerFrameShadow: false,
  bannerFrameGlow: false,
  bannerFrameGlowColor: "transparent",
  bannerFrameLink: "",

  // Widget Formulasi Serupa (Sidebar Artikel)
  sidebarCtaShow: true,
  sidebarCtaBadge: "Konsultasi Maklon Herbal",
  sidebarCtaTitle: "Punya Ide Formulasi Serupa?",
  sidebarCtaDesc:
    "Tim R&D dan apoteker CV. Indo Green Nature siap membantu memformulasikan produk herbal Anda hingga izin edar BPOM dan sertifikat Halal terbit.",
  sidebarCtaBtnText: "Hubungi Tim R&D via WA",
  sidebarCtaBtnLink:
    "https://wa.me/6281234567890?text=Halo%20CV.%20Indo%20Green%20Nature%2C%20saya%20tertarik%20konsultasi%20maklon%20produk%20herbal%20setelah%20membaca%20artikel%20insight.",
  sidebarCtaBtnBg: "#ffffff",
  sidebarCtaBtnColor: "#15803d",
  sidebarCtaSublinkText: "Jelajahi Produk Kami",
  sidebarCtaSublinkUrl: "/our-products",

  // Card Kembangkan Brand Herbal (Bottom CTA)
  bottomCtaShow: true,
  bottomCtaTitle: "Kembangkan Brand Herbal Anda Bersama CV. Indo Green Nature",
  bottomCtaDesc:
    "Dukungan lengkap mulai dari perancangan formula terstandar, uji laboratorium, legalitas izin edar BPOM & Halal, hingga produksi massal bersertifikat CPOTB.",
  bottomCtaBtnText: "Konsultasi Maklon Sekarang",
  bottomCtaBtnLink:
    "https://wa.me/6281234567890?text=Halo%20CV.%20Indo%20Green%20Nature%2C%20saya%20ingin%20konsultasi%20layanan%20maklon%20herbal.",
  bottomCtaBtnBg: "#15803d",
  bottomCtaBtnColor: "#ffffff",

  // Foto Frame Insight (Cover Artikel Detail)
  articleCoverHeight: 467,
  articleCoverFit: "cover",
}

export const INSIGHT_SETTINGS_KEY = "ign_insight_settings_v1"
export const INSIGHT_PREVIEW_CHANNEL = "ign_insight_preview_channel"
export const INSIGHT_DB_CONFIG_KEY = "insight_settings"
export const INSIGHT_SETTINGS_TABLE = "app_config"
