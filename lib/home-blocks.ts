import React from "react"
import { supabase } from "@/lib/supabase"

export const HOME_LAYOUT_KEY = "home_layout"
export const HOME_LAYOUT_PREVIEW_KEY = "home_layout_preview"
export const HOME_LAYOUT_EVENT = "home-layout-updated"

export type HomeBlockType =
  | "running_text"
  | "hero_banner"
  | "banners"
  | "hero_banner2"
  | "products"
  | "divider"
  | "mengenal_ign"
  | "solusi_bisnis"
  | "jenis_produk"
  | "peluang"
  | "mengapa_memilih"
  | "legalitas"
  | "dipercaya_brand"
  | "proses_maklon"
  | "konsultasi_banner"
  | "melayani_klien"
  | "ulasan_klien"
  | "faq_section"
  | "video_profil"
  | "sosial_media"

export type DividerStyle = "solid" | "dashed" | "dotted" | "gradient" | "double"
export type DividerColor = "default" | "primary" | "muted"
export type DividerSpacing = "sm" | "md" | "lg"

export interface HomeBlock {
  id: string
  type: HomeBlockType
  label: string
  desc: string
  hidden?: boolean
  divider_style?: DividerStyle
  divider_color?: DividerColor
  divider_thickness?: number
  divider_spacing?: DividerSpacing
}

export const BLOCK_META: Record<HomeBlockType, { label: string; desc: string }> = {
  running_text: {
    label: "Running Text / Teks Berjalan",
    desc: "Teks pengumuman berjalan dinamis di bagian atas beranda",
  },
  hero_banner: {
    label: "Hero Banner Utama",
    desc: "Teks judul utama, subjudul, dan logo brand CV. Indo Green Nature",
  },
  banners: {
    label: "Banner Slider / Carousel",
    desc: "Galeri slide banner promosi otomatis bergulir",
  },
  hero_banner2: {
    label: "Hero Banner 2",
    desc: "Banner promosi kedua dengan teks deskripsi dan foto",
  },
  products: {
    label: "Katalog Produk (Our Menu)",
    desc: "Daftar produk herbal unggulan dengan harga dan detail",
  },
  divider: {
    label: "Garis Pembatas",
    desc: "Garis pemisah visual antar bagian halaman untuk mempercantik tata letak",
  },
  mengenal_ign: {
    label: "Mengenal Indo Green Nature",
    desc: "Profil pengantar perusahaan CV. Indo Green Nature dan preview 16:9",
  },
  solusi_bisnis: {
    label: "Solusi Bisnis Maklon",
    desc: "4 pilar solusi maklon sesuai tujuan bisnis dengan layout 2x2 dan foto 1:1",
  },
  jenis_produk: {
    label: "Jenis Produk Maklon",
    desc: "Kategori produk yang dapat dimaklon dengan grid 6 kotak bujur sangkar",
  },
  peluang: {
    label: "Peluang Pasar Global",
    desc: "Peluang besar di pasar global dan daftar produksi maklon paling diminati",
  },
  mengapa_memilih: {
    label: "Mengapa Memilih IGN",
    desc: "6 pilar keunggulan dan alasan memilih INDO GREEN NATURE dengan grid kartu 3x2",
  },
  legalitas: {
    label: "Legalitas & Standar Kualitas",
    desc: "Sertifikasi legalitas resmi, izin edar BPOM, Halal, CPOTB, ISO, dan sertifikat mutu produksi",
  },
  dipercaya_brand: {
    label: "Dipercaya Oleh Berbagai Brand",
    desc: "Daftar logo brand mitra & klien terpercaya yang berkolaborasi dengan INDO GREEN NATURE",
  },
  proses_maklon: {
    label: "Proses Jasa Maklon Herbal",
    desc: "Alur tahapan proses jasa maklon terstruktur dari konsultasi hingga pengiriman (grid 3x2)",
  },
  konsultasi_banner: {
    label: "Banner Konsultasi CTA",
    desc: "Banner ajakan konsultasi pengembangan brand produk dengan tombol WhatsApp atau tautan kustom",
  },
  melayani_klien: {
    label: "Jangkauan Klien Indonesia",
    desc: "Peta / daftar jangkauan kota dan klien dari seluruh Indonesia dengan badge kota",
  },
  ulasan_klien: {
    label: "Ulasan & Testimoni Klien",
    desc: "Kartu ulasan dummy dari klien INDO GREEN NATURE dengan tampilan Google Review style",
  },
  faq_section: {
    label: "FAQ Maklon Herbal",
    desc: "Pertanyaan dan jawaban seputar layanan jasa maklon herbal CV. Indo Green Nature",
  },
  video_profil: {
    label: "Video Profil Mengenal IGN",
    desc: "Video profil dan pengenalan CV. Indo Green Nature dengan frame 16:9 dan pop-up video player",
  },
  sosial_media: {
    label: "Banner Tautan Sosial Media",
    desc: "Banner ajakan mengikuti media sosial resmi perusahaan dengan 5 tombol ikon sosial media",
  },
}

export const DEFAULT_HERO_TEXT = "\nJasa Maklon Obat Herbal Alami Terpercaya di Indonesia"
export const DEFAULT_HERO_FONT = "poppins"
export const DEFAULT_HERO_FONT_WEIGHT = "bold"
export const DEFAULT_HERO_FONT_SIZE = "52"
export const DEFAULT_HERO_TEXT_COLOR = "#D97706"
export const DEFAULT_HERO_SUBTEXT = "Dari Ide Produk Hingga Siap Dipasarkan"
export const DEFAULT_HERO_SUBTEXT_COLOR = "#1c8d2f"
export const DEFAULT_HERO_SUBTEXT_SIZE = 27
export const DEFAULT_HERO_SUBTEXT_FONT_WEIGHT = "bold"
export const DEFAULT_HERO_DESC = `**INDO GREEN NATURE** membantu Anda mewujudkan dan mengembangkan brand Obat Herbal sendiri \ntanpa harus membangun pabrik atau fasilitas produksi. \nMelalui layanan jasa maklon Herbal yang lengkap, \nkami mendampingi setiap tahap mulai dari pengembangan formula, produksi, pengemasan, \nhingga pengurusan legalitas BPOM dan Halal agar produk Anda siap dipasarkan.`
export const DEFAULT_HERO_DESC_COLOR = "#1c1c1c"
export const DEFAULT_HERO_POINTS: string[] = [
  "Berdiri Sejak 2000",
  "760+ Merek Terdaftar",
  "930+ Produk Diformulasikan",
  "BPOM, Halal & ISO 22000"
]
export const DEFAULT_HERO_POINTS_FONT_WEIGHT = "bold"
export const DEFAULT_HERO_POINTS_COLOR = "#252225"
export const DEFAULT_HERO_IMAGE = "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/hero_banner/1792330129667-hsobqa.webp"
export const DEFAULT_HERO_IMAGE_POSITION: "left" | "right" = "right"
export const DEFAULT_HERO_IMAGE_ASPECT = "square"
export const DEFAULT_HERO_IMAGE_SIZE = "465"
export const DEFAULT_HERO_IMAGE_TRANSPARENT = true
export const DEFAULT_HERO_IMAGE_FIT: "cover" | "contain" = "cover"

export const DEFAULT_PENGENALAN_TITLE = "Mengenal Indo Green Nature"
export const DEFAULT_PENGENALAN_TITLE_SIZE = 48
export const DEFAULT_PENGENALAN_TITLE_COLOR = "#15803D"
export const DEFAULT_PENGENALAN_TITLE_FONT = "poppins"
export const DEFAULT_PENGENALAN_TITLE_FONT_WEIGHT = "bold"
export const DEFAULT_PENGENALAN_DESC = "**INDO GREEN NATURE** adalah perusahaan jasa maklon obat herbal yang berdiri sejak tahun 2000 dan berlokasi di Wates, Daerah Istimewa Yogyakarta. Selama lebih dari 25 tahun, kami telah membantu ratusan brand mengembangkan produk kapsul, herbal, kesehatan, kecantikan, dan suplemen fungsional melalui layanan one-stop service mulai dari formulasi, produksi, pengemasan, hingga pengurusan legalitas BPOM dan Halal."
export const DEFAULT_PENGENALAN_DESC_SIZE = 20
export const DEFAULT_PENGENALAN_DESC_COLOR = "#000000"
export const DEFAULT_PENGENALAN_IMAGE = ""
export const DEFAULT_PENGENALAN_IMAGE_FIT: "cover" | "contain" | "fill" = "cover"
export const DEFAULT_PENGENALAN_IMAGE_POSITION: "left" | "right" = "right"
export const DEFAULT_PENGENALAN_IMAGE_SIZE = 576
export const DEFAULT_PENGENALAN_IMAGE_SCALE = 100

export interface SolusiBisnisCard {
  id: string
  title: string
  desc: string
  image: string
  titleColor?: string
  titleSize?: number
  titleFontWeight?: string
}

export const DEFAULT_SOLUSI_BISNIS_TITLE = "Solusi Maklon Sesuai Tujuan Bisnis Anda"
export const DEFAULT_SOLUSI_BISNIS_TITLE_COLOR = "#15803D"
export const DEFAULT_SOLUSI_BISNIS_TITLE_SIZE = 40
export const DEFAULT_SOLUSI_BISNIS_TITLE_FONT = "poppins"
export const DEFAULT_SOLUSI_BISNIS_TITLE_FONT_WEIGHT = "bold"
export const DEFAULT_SOLUSI_BISNIS_DESC_ALIGN: "center" | "left" | "justify" = "left"
export const DEFAULT_SOLUSI_BISNIS_VALIGN: "center" | "top" = "center"

export const DEFAULT_SOLUSI_BISNIS_CARD_TITLE_COLOR = "#B45309"
export const DEFAULT_SOLUSI_BISNIS_CARD_TITLE_SIZE = 20
export const DEFAULT_SOLUSI_BISNIS_CARD_TITLE_FONT_WEIGHT = "bold"
export const DEFAULT_SOLUSI_BISNIS_CARD_TITLE_FONT = "poppins"

export const DEFAULT_SOLUSI_BISNIS_CARDS: SolusiBisnisCard[] = [
  {
    id: "card-1",
    title: "Mulai Brand Obat Herbal Baru",
    desc: "Wujudkan produk impian Anda meski tanpa pengalaman. Kami bantu dari konsep, formulasi, hingga legalitas (BPOM & Halal) siap rilis.",
    image: "/images/solusi/logo.png",
  },
  {
    id: "card-2",
    title: "Mulai Brand Obat Herbal Baru",
    desc: "Wujudkan produk impian Anda meski tanpa pengalaman. Kami bantu dari konsep, formulasi, hingga legalitas (BPOM & Halal) siap rilis.",
    image: "/images/solusi/logo.png",
  },
  {
    id: "card-3",
    title: "Mulai Brand Obat Herbal Baru",
    desc: "Wujudkan produk impian Anda meski tanpa pengalaman. Kami bantu dari konsep, formulasi, hingga legalitas (BPOM & Halal) siap rilis.",
    image: "/images/solusi/logo.png",
  },
  {
    id: "card-4",
    title: "Mulai Brand Obat Herbal Baru",
    desc: "Wujudkan produk impian Anda meski tanpa pengalaman. Kami bantu dari konsep, formulasi, hingga legalitas (BPOM & Halal) siap rilis.",
    image: "/images/solusi/logo.png",
  },
]

export interface JenisProdukCard {
  id: string
  title: string
  description?: string
  image: string
  bgColor?: string
  textColor?: string
}

export const DEFAULT_JENIS_PRODUK_TITLE = "Jenis Produk yang dapat di Maklon"
export const DEFAULT_JENIS_PRODUK_TITLE_COLOR = "#15803D"
export const DEFAULT_JENIS_PRODUK_TITLE_SIZE = 40
export const DEFAULT_JENIS_PRODUK_TITLE_FONT = "poppins"
export const DEFAULT_JENIS_PRODUK_TITLE_FONT_WEIGHT = "bold"

export const DEFAULT_JENIS_PRODUK_DESC = "Putra Farma Yogyakarta menyediakan layanan jasa maklon minuman serbuk untuk berbagai kategori produk yang dapat disesuaikan dengan kebutuhan pasar dan target konsumen Anda. Mulai dari produk kesehatan, kecantikan, nutrisi, hingga minuman kekinian, seluruh formulasi dapat dikembangkan secara custom sesuai konsep, manfaat, dan identitas brand yang ingin Anda bangun."
export const DEFAULT_JENIS_PRODUK_DESC_COLOR = "#000000"
export const DEFAULT_JENIS_PRODUK_DESC_SIZE = 16

export const DEFAULT_JENIS_PRODUK_CARD_DESC = "Minuman kecantikan dengan kandungan seperti kolagen, glutathione, dan vitamin yang dirancang untuk mendukung kesehatan kulit serta tren beauty from within yang terus berkembang."

export function getDarkCardOverlay(bgColor?: string): string {
  let cleanHex = (bgColor && bgColor !== "#E58C05" ? bgColor : "#11991B").replace("#", "")
  if (cleanHex.length === 3) cleanHex = cleanHex.split("").map((c) => c + c).join("")
  const r = parseInt(cleanHex.substring(0, 2), 16) || 17
  const g = parseInt(cleanHex.substring(2, 4), 16) || 153
  const b = parseInt(cleanHex.substring(4, 6), 16) || 27

  // Warna gelap selaras dengan warna tema kartu (misal hijau hutan pekat untuk #11991B)
  const darkR = Math.round(r * 0.18)
  const darkG = Math.round(g * 0.22)
  const darkB = Math.round(b * 0.18)

  return `linear-gradient(to bottom, rgba(${darkR}, ${darkG}, ${darkB}, 0.88) 0%, rgba(${darkR}, ${darkG}, ${darkB}, 0.62) 50%, rgba(${darkR}, ${darkG}, ${darkB}, 0.94) 100%)`
}

export function getDarkCardShadowColor(bgColor?: string): string {
  let cleanHex = (bgColor && bgColor !== "#E58C05" ? bgColor : "#11991B").replace("#", "")
  if (cleanHex.length === 3) cleanHex = cleanHex.split("").map((c) => c + c).join("")
  const r = parseInt(cleanHex.substring(0, 2), 16) || 17
  const g = parseInt(cleanHex.substring(2, 4), 16) || 153
  const b = parseInt(cleanHex.substring(4, 6), 16) || 27

  const darkR = Math.round(r * 0.15)
  const darkG = Math.round(g * 0.18)
  const darkB = Math.round(b * 0.15)

  return `rgba(${darkR}, ${darkG}, ${darkB}, 0.95)`
}

export const DEFAULT_JENIS_PRODUK_CARDS: JenisProdukCard[] = [
  { id: "jp-1", title: "Minuman Herbal", description: DEFAULT_JENIS_PRODUK_CARD_DESC, image: "", bgColor: "#11991B", textColor: "#FFFFFF" },
  { id: "jp-2", title: "Minuman Herbal", description: DEFAULT_JENIS_PRODUK_CARD_DESC, image: "", bgColor: "#11991B", textColor: "#FFFFFF" },
  { id: "jp-3", title: "Minuman Herbal", description: DEFAULT_JENIS_PRODUK_CARD_DESC, image: "", bgColor: "#11991B", textColor: "#FFFFFF" },
  { id: "jp-4", title: "Minuman Herbal", description: DEFAULT_JENIS_PRODUK_CARD_DESC, image: "", bgColor: "#11991B", textColor: "#FFFFFF" },
  { id: "jp-5", title: "Minuman Herbal", description: DEFAULT_JENIS_PRODUK_CARD_DESC, image: "", bgColor: "#11991B", textColor: "#FFFFFF" },
  { id: "jp-6", title: "Minuman Herbal", description: DEFAULT_JENIS_PRODUK_CARD_DESC, image: "", bgColor: "#11991B", textColor: "#FFFFFF" },
  { id: "jp-7", title: "Minuman Herbal", description: DEFAULT_JENIS_PRODUK_CARD_DESC, image: "", bgColor: "#11991B", textColor: "#FFFFFF" },
  { id: "jp-8", title: "Minuman Herbal", description: DEFAULT_JENIS_PRODUK_CARD_DESC, image: "", bgColor: "#11991B", textColor: "#FFFFFF" },
]

export interface PeluangItem {
  id: string
  name: string
  bgColor?: string
  textColor?: string
}

export const DEFAULT_PELUANG_TITLE = "Peluang Besar Di Pasar Global"
export const DEFAULT_PELUANG_TITLE_SIZE = 36
export const DEFAULT_PELUANG_TITLE_COLOR = "#15803D"
export const DEFAULT_PELUANG_TITLE_FONT = "poppins"
export const DEFAULT_PELUANG_TITLE_FONT_WEIGHT = "bold"

export const DEFAULT_PELUANG_DESC = "Racikan Obat Herbal tetap menjadi salah satu kategori produk dengan permintaan yang stabil dan mudah diterima pasar. Banyak pelaku usaha kuliner, UMKM, kafe, hingga franchise makanan menghadirkan minuman sebagai produk pendamping untuk meningkatkan nilai transaksi dan memberikan lebih banyak pilihan kepada pelanggan.\n\nINDO GREEN NATURE membantu Anda mengembangkan berbagai varian minuman serbuk kekinian yang dapat disesuaikan dengan konsep bisnis dan target pasar. Mulai dari Thai Tea, Matcha, Taro, Red Velvet, Chocolate, Cappuccino, Avocado, Mango, Green Tea, hingga berbagai varian rasa populer lainnya yang banyak diminati konsumen Indonesia.\n\nDengan formulasi yang dapat disesuaikan, Anda memiliki fleksibilitas untuk menghadirkan produk dengan cita rasa khas, tampilan menarik, dan identitas brand yang berbeda dari kompetitor."
export const DEFAULT_PELUANG_DESC_SIZE = 16
export const DEFAULT_PELUANG_DESC_COLOR = "#000000"
export const DEFAULT_PELUANG_DESC_ALIGN: "left" | "center" | "justify" = "left"
export const DEFAULT_PELUANG_VALIGN: "center" | "top" = "center"

export const DEFAULT_PELUANG_BOX_TITLE = "Produksi Maklon  Paling Diminati"
export const DEFAULT_PELUANG_BOX_BG_COLOR = "#15803D"
export const DEFAULT_PELUANG_BOX_TITLE_COLOR = "#FFFFFF"

export const DEFAULT_PELUANG_ITEMS: PeluangItem[] = [
  { id: "pl-1", name: "Obat Herbal Nama", bgColor: "#D97706", textColor: "#FFFFFF" },
  { id: "pl-2", name: "Obat Herbal Nama", bgColor: "#D97706", textColor: "#FFFFFF" },
  { id: "pl-3", name: "Obat Herbal Nama", bgColor: "#D97706", textColor: "#FFFFFF" },
  { id: "pl-4", name: "Obat Herbal Nama", bgColor: "#D97706", textColor: "#FFFFFF" },
  { id: "pl-5", name: "Obat Herbal Nama", bgColor: "#D97706", textColor: "#FFFFFF" },
  { id: "pl-6", name: "Obat Herbal Nama", bgColor: "#D97706", textColor: "#FFFFFF" },
  { id: "pl-7", name: "Obat Herbal Nama", bgColor: "#D97706", textColor: "#FFFFFF" },
  { id: "pl-8", name: "Obat Herbal Nama", bgColor: "#D97706", textColor: "#FFFFFF" },
]

export interface MengapaMemilihCard {
  id: string
  title: string
  desc: string
  bgColor?: string
  textColor?: string
}

export const DEFAULT_MENGAPA_TITLE = "Mengapa Memilih INDO GREEN NATURE"
export const DEFAULT_MENGAPA_TITLE_SIZE = 36
export const DEFAULT_MENGAPA_TITLE_COLOR = "#15803D"
export const DEFAULT_MENGAPA_TITLE_FONT = "poppins"
export const DEFAULT_MENGAPA_TITLE_FONT_WEIGHT = "bold"

export const DEFAULT_MENGAPA_SUBTITLE = "Lebih dari sekadar perusahaan maklon, INDO GREEN NATURE adalah mitra yang membantu mempercepat proses\npengembangan produk hingga siap dipasarkan."
export const DEFAULT_MENGAPA_SUBTITLE_SIZE = 16
export const DEFAULT_MENGAPA_SUBTITLE_COLOR = "#000000"
export const DEFAULT_MENGAPA_SUBTITLE_ALIGN: "center" | "left" | "justify" = "center"

export const DEFAULT_MENGAPA_CARD_BG = "#D97706"
export const DEFAULT_MENGAPA_CARD_TITLE_COLOR = "#FFFFFF"
export const DEFAULT_MENGAPA_CARD_DESC_COLOR = "#FFFFFF"

export const DEFAULT_MENGAPA_CARDS: MengapaMemilihCard[] = [
  {
    id: "mm-1",
    title: "25+ Tahun Pengalaman",
    desc: "Dipercaya ratusan brand Indonesia dalam mengembangkan produk minuman serbuk sejak tahun 2000.",
    bgColor: "#D97706",
    textColor: "#FFFFFF"
  },
  {
    id: "mm-2",
    title: "Fasilitas Produksi Modern",
    desc: "Didukung mesin berkecepatan tinggi dengan standar CPOTB/GMP serta higienitas terjamin.",
    bgColor: "#D97706",
    textColor: "#FFFFFF"
  },
  {
    id: "mm-3",
    title: "Legalitas BPOM & Halal",
    desc: "Pendampingan penuh pengurusan sertifikasi izin edar BPOM, Halal MUI, hingga hak merek HKI.",
    bgColor: "#D97706",
    textColor: "#FFFFFF"
  },
  {
    id: "mm-4",
    title: "Formulasi Eksklusif & Kustom",
    desc: "Tim RnD profesional siap mengembangkan cita rasa, khasiat, dan tekstur khusus sesuai target pasar Anda.",
    bgColor: "#D97706",
    textColor: "#FFFFFF"
  },
  {
    id: "mm-5",
    title: "MOQ Fleksibel untuk Bisnis",
    desc: "Minimum order kuantiti bersahabat untuk membantu startup, UMKM, hingga korporasi berkembang pesat.",
    bgColor: "#D97706",
    textColor: "#FFFFFF"
  },
  {
    id: "mm-6",
    title: "Layanan One-Stop Maklon",
    desc: "Solusi terpadu dari konsep produk, racikan bahan baku, desain kemasan, produksi, hingga siap kirim.",
    bgColor: "#D97706",
    textColor: "#FFFFFF"
  },
]

export interface LegalitasItem {
  id: string
  title: string
  desc?: string
  image: string
  badgeText?: string
  bgColor?: string
  textColor?: string
}

export const DEFAULT_LEGALITAS_TITLE = "Legalitas & Standar Kualitas"
export const DEFAULT_LEGALITAS_TITLE_SIZE = 36
export const DEFAULT_LEGALITAS_TITLE_COLOR = "#15803D"
export const DEFAULT_LEGALITAS_TITLE_FONT = "poppins"
export const DEFAULT_LEGALITAS_TITLE_FONT_WEIGHT = "bold"

export const DEFAULT_LEGALITAS_SUBTITLE = "Seluruh proses produksi INDO GREEN NATURE didukung legalitas dan sertifikasi yang memastikan kualitas,\nkeamanan, dan kepatuhan terhadap standar industri."
export const DEFAULT_LEGALITAS_SUBTITLE_SIZE = 16
export const DEFAULT_LEGALITAS_SUBTITLE_COLOR = "#000000"
export const DEFAULT_LEGALITAS_SUBTITLE_ALIGN: "center" | "left" | "justify" = "center"

export const DEFAULT_LEGALITAS_CARD_BG = "#FFFFFF"
export const DEFAULT_LEGALITAS_CARD_BORDER = true
export const DEFAULT_LEGALITAS_CARD_SHADOW = true

export const DEFAULT_LEGALITAS_ITEMS: LegalitasItem[] = [
  {
    id: "leg-1",
    title: "BPOM RI",
    desc: "Izin Edar Resmi Terdaftar",
    image: "",
    badgeText: "BPOM",
    bgColor: "#FFFFFF",
    textColor: "#15803D",
  },
  {
    id: "leg-2",
    title: "HALAL INDONESIA",
    desc: "Sertifikasi Halal Resmi",
    image: "",
    badgeText: "HALAL",
    bgColor: "#FFFFFF",
    textColor: "#15803D",
  },
  {
    id: "leg-3",
    title: "CPOTB",
    desc: "Standar Obat Tradisional",
    image: "",
    badgeText: "CPOTB",
    bgColor: "#FFFFFF",
    textColor: "#15803D",
  },
  {
    id: "leg-4",
    title: "ISO 22000",
    desc: "Food Safety Management",
    image: "",
    badgeText: "ISO",
    bgColor: "#FFFFFF",
    textColor: "#15803D",
  },
  {
    id: "leg-5",
    title: "HACCP",
    desc: "Hazard Analysis Control",
    image: "",
    badgeText: "HACCP",
    bgColor: "#FFFFFF",
    textColor: "#15803D",
  },
  {
    id: "leg-6",
    title: "GMP QUALITY",
    desc: "Good Manufacturing Practice",
    image: "",
    badgeText: "GMP",
    bgColor: "#FFFFFF",
    textColor: "#15803D",
  },
]

export interface DipercayaBrandItem {
  id: string
  title: string
  desc?: string
  image: string
  bgColor?: string
  textColor?: string
}

export const DEFAULT_DIPERCAYA_BRAND_TITLE = "Dipercaya Oleh Berbagai Brand"
export const DEFAULT_DIPERCAYA_BRAND_TITLE_SIZE = 36
export const DEFAULT_DIPERCAYA_BRAND_TITLE_COLOR = "#15803D"
export const DEFAULT_DIPERCAYA_BRAND_TITLE_FONT = "poppins"
export const DEFAULT_DIPERCAYA_BRAND_TITLE_FONT_WEIGHT = "bold"

export const DEFAULT_DIPERCAYA_BRAND_SUBTITLE = "Ratusan pengusaha telah sukses mengembangkan produk bersama layanan maklon herbal INDO GREEN NATURE"
export const DEFAULT_DIPERCAYA_BRAND_SUBTITLE_SIZE = 16
export const DEFAULT_DIPERCAYA_BRAND_SUBTITLE_COLOR = "#000000"
export const DEFAULT_DIPERCAYA_BRAND_SUBTITLE_ALIGN: "center" | "left" | "justify" = "center"

export const DEFAULT_DIPERCAYA_BRAND_CARD_BG = "#FFFFFF"

export const DEFAULT_DIPERCAYA_BRAND_ITEMS: DipercayaBrandItem[] = [
  { id: "brand-1", title: "Brand Mitra 1", desc: "Partner Herbal", image: "", bgColor: "#FFFFFF", textColor: "#15803D" },
  { id: "brand-2", title: "Brand Mitra 2", desc: "Partner Minuman", image: "", bgColor: "#FFFFFF", textColor: "#15803D" },
  { id: "brand-3", title: "Brand Mitra 3", desc: "Partner Suplemen", image: "", bgColor: "#FFFFFF", textColor: "#15803D" },
  { id: "brand-4", title: "Brand Mitra 4", desc: "Partner Kosmetik", image: "", bgColor: "#FFFFFF", textColor: "#15803D" },
  { id: "brand-5", title: "Brand Mitra 5", desc: "Partner Kesehatan", image: "", bgColor: "#FFFFFF", textColor: "#15803D" },
  { id: "brand-6", title: "Brand Mitra 6", desc: "Partner Wellness", image: "", bgColor: "#FFFFFF", textColor: "#15803D" },
]

export interface ProsesMaklonItem {
  id: string
  step: string
  title: string
  desc: string
  bgColor?: string
  textColor?: string
}

export const DEFAULT_PROSES_MAKLON_TITLE = "Proses Jasa Maklon Herbal"
export const DEFAULT_PROSES_MAKLON_TITLE_SIZE = 36
export const DEFAULT_PROSES_MAKLON_TITLE_COLOR = "#15803D"
export const DEFAULT_PROSES_MAKLON_TITLE_FONT = "poppins"
export const DEFAULT_PROSES_MAKLON_TITLE_FONT_WEIGHT = "bold"

export const DEFAULT_PROSES_MAKLON_SUBTITLE = "Kami menyediakan proses maklon herbal tradisonal yang terstruktur dan mudah diikuti, sehingga Anda dapat mengembangkan produk dengan lebih cepat, aman, dan terarah."
export const DEFAULT_PROSES_MAKLON_SUBTITLE_SIZE = 16
export const DEFAULT_PROSES_MAKLON_SUBTITLE_COLOR = "#000000"
export const DEFAULT_PROSES_MAKLON_SUBTITLE_ALIGN: "center" | "left" | "justify" = "center"

export const DEFAULT_PROSES_MAKLON_CARD_BG = "#11991B"
export const DEFAULT_PROSES_MAKLON_CARD_TEXT_COLOR = "#FFFFFF"

export const DEFAULT_PROSES_MAKLON_ITEMS: ProsesMaklonItem[] = [
  {
    id: "pm-1",
    step: "01",
    title: "Konsultasi Produk",
    desc: "Diskusikan konsep produk, target pasar, manfaat, dan kebutuhan bisnis Anda bersama tim kami.",
  },
  {
    id: "pm-2",
    step: "02",
    title: "Formulasi & Sampel",
    desc: "Pengembangan formula herbal unik dan pembuatan sampel produk hingga mencapai persetujuan Anda.",
  },
  {
    id: "pm-3",
    step: "03",
    title: "Legalitas & Perizinan",
    desc: "Pengurusan izin edar BPOM, sertifikasi Halal MUI, dan pendaftaran merek (HKI) secara resmi.",
  },
  {
    id: "pm-4",
    step: "04",
    title: "Desain Kemasan",
    desc: "Perancangan desain kemasan dan label produk yang menarik, eksklusif, dan sesuai regulasi industri.",
  },
  {
    id: "pm-5",
    step: "05",
    title: "Produksi Massal",
    desc: "Proses manufaktur higienis dengan standar CPOTB dan sistem kendali mutu yang ketat.",
  },
  {
    id: "pm-6",
    step: "06",
    title: "Quality Control & Pengiriman",
    desc: "Pemeriksaan kualitas ketat sebelum produk jadi dikemas dan dikirim aman ke gudang Anda.",
  },
]

export const DEFAULT_KONSULTASI_BANNER_TEXT = "Ingin mengembangkan produk dengan brand Anda sendiri? Konsultasikan kebutuhan Anda bersama tim kami."
export const DEFAULT_KONSULTASI_BANNER_TEXT_SIZE = 30
export const DEFAULT_KONSULTASI_BANNER_TEXT_COLOR = "#FFFFFF"
export const DEFAULT_KONSULTASI_BANNER_TEXT_FONT = "poppins"
export const DEFAULT_KONSULTASI_BANNER_TEXT_FONT_WEIGHT = "bold"

export const DEFAULT_KONSULTASI_BANNER_BG_COLOR = "#D97706"
export const DEFAULT_KONSULTASI_BANNER_BORDER_RADIUS = 5

export const DEFAULT_KONSULTASI_BANNER_BTN_TEXT = "Konsultasi Sekarang"
export const DEFAULT_KONSULTASI_BANNER_BTN_BG_COLOR = "#087F11"
export const DEFAULT_KONSULTASI_BANNER_BTN_TEXT_COLOR = "#FFFFFF"
export const DEFAULT_KONSULTASI_BANNER_BTN_TEXT_SIZE = 20
export const DEFAULT_KONSULTASI_BANNER_BTN_FONT_WEIGHT = "bold"

export const DEFAULT_KONSULTASI_BANNER_LINK_TYPE: "whatsapp" | "custom" = "whatsapp"
export const DEFAULT_KONSULTASI_BANNER_WA_NUMBER = "6285877669199"
export const DEFAULT_KONSULTASI_BANNER_WA_MESSAGE = "Halo CV. Indo Green Nature, saya ingin berkonsultasi mengenai maklon herbal untuk brand saya sendiri."
export const DEFAULT_KONSULTASI_BANNER_CUSTOM_URL = "https://wa.me/6285877669199"
export const DEFAULT_KONSULTASI_BANNER_OPEN_NEW_TAB = true

export function buildKonsultasiBannerUrl(params: {
  linkType?: "whatsapp" | "custom" | string
  waNumber?: string
  waMessage?: string
  customUrl?: string
}): string {
  const type = params.linkType || DEFAULT_KONSULTASI_BANNER_LINK_TYPE
  if (type === "custom") {
    return params.customUrl?.trim() || DEFAULT_KONSULTASI_BANNER_CUSTOM_URL
  }
  const rawNumber = (params.waNumber || DEFAULT_KONSULTASI_BANNER_WA_NUMBER).replace(/[^0-9]/g, "")
  const cleanNumber = rawNumber.startsWith("0") ? `62${rawNumber.slice(1)}` : rawNumber.startsWith("62") ? rawNumber : `62${rawNumber}`
  const message = encodeURIComponent(params.waMessage || DEFAULT_KONSULTASI_BANNER_WA_MESSAGE)
  return `https://wa.me/${cleanNumber}${message ? `?text=${message}` : ""}`
}

export const DEFAULT_MELAYANI_KLIEN_TITLE = "Melayani Klien dari Seluruh Indonesia"
export const DEFAULT_MELAYANI_KLIEN_TITLE_SIZE = 36
export const DEFAULT_MELAYANI_KLIEN_TITLE_COLOR = "#15803D"
export const DEFAULT_MELAYANI_KLIEN_TITLE_FONT = "poppins"
export const DEFAULT_MELAYANI_KLIEN_TITLE_FONT_WEIGHT = "bold"

export const DEFAULT_MELAYANI_KLIEN_SUBTITLE = "INDO GREEN NATURE telah membantu berbagai brand, UMKM, distributor, dan perusahaan dari berbagai daerah di Indonesia dalam mengembangkan produk minuman serbuk mereka. Dengan layanan konsultasi online dan dukungan pengiriman ke seluruh Indonesia, kami siap melayani kebutuhan maklon minuman tanpa batas lokasi."
export const DEFAULT_MELAYANI_KLIEN_SUBTITLE_SIZE = 16
export const DEFAULT_MELAYANI_KLIEN_SUBTITLE_COLOR = "#000000"
export const DEFAULT_MELAYANI_KLIEN_SUBTITLE_ALIGN: "center" | "left" | "justify" = "center"

export const DEFAULT_MELAYANI_KLIEN_PILL_BG = "#15803D"
export const DEFAULT_MELAYANI_KLIEN_PILL_TEXT_COLOR = "#FFFFFF"
export const DEFAULT_MELAYANI_KLIEN_PILL_SIZE = 20
export const DEFAULT_MELAYANI_KLIEN_PILL_FONT_WEIGHT = "bold"

export const DEFAULT_MELAYANI_KLIEN_CITIES: string[] = [
  "JAKARTA",
  "BANDUNG",
  "BALI",
  "YOGYAKARTA",
  "SURABAYA",
  "MEDAN",
  "SEMARANG",
  "MAKASSAR",
  "PALEMBANG",
  "BANJARMASIN",
  "DAN KOTA-KOTA LAINNYA"
]

export const ALL_HOME_BLOCKS: HomeBlock[] = [
  { id: "b-running_text", type: "running_text", label: BLOCK_META.running_text.label, desc: BLOCK_META.running_text.desc, hidden: false },
  { id: "b-hero_banner", type: "hero_banner", label: BLOCK_META.hero_banner.label, desc: BLOCK_META.hero_banner.desc, hidden: false },
  { id: "b-mengenal_ign", type: "mengenal_ign", label: BLOCK_META.mengenal_ign.label, desc: BLOCK_META.mengenal_ign.desc, hidden: false },
  { id: "b-solusi_bisnis", type: "solusi_bisnis", label: BLOCK_META.solusi_bisnis.label, desc: BLOCK_META.solusi_bisnis.desc, hidden: false },
  { id: "b-jenis_produk", type: "jenis_produk", label: BLOCK_META.jenis_produk.label, desc: BLOCK_META.jenis_produk.desc, hidden: false },
  { id: "b-peluang", type: "peluang", label: BLOCK_META.peluang.label, desc: BLOCK_META.peluang.desc, hidden: false },
  { id: "b-mengapa_memilih", type: "mengapa_memilih", label: BLOCK_META.mengapa_memilih.label, desc: BLOCK_META.mengapa_memilih.desc, hidden: false },
  { id: "b-legalitas", type: "legalitas", label: BLOCK_META.legalitas.label, desc: BLOCK_META.legalitas.desc, hidden: false },
  { id: "b-dipercaya_brand", type: "dipercaya_brand", label: BLOCK_META.dipercaya_brand.label, desc: BLOCK_META.dipercaya_brand.desc, hidden: false },
  { id: "b-proses_maklon", type: "proses_maklon", label: BLOCK_META.proses_maklon.label, desc: BLOCK_META.proses_maklon.desc, hidden: false },
  { id: "b-konsultasi_banner", type: "konsultasi_banner", label: BLOCK_META.konsultasi_banner.label, desc: BLOCK_META.konsultasi_banner.desc, hidden: false },
  { id: "b-melayani_klien", type: "melayani_klien", label: BLOCK_META.melayani_klien.label, desc: BLOCK_META.melayani_klien.desc, hidden: false },
  { id: "b-ulasan_klien", type: "ulasan_klien", label: BLOCK_META.ulasan_klien.label, desc: BLOCK_META.ulasan_klien.desc, hidden: false },
  { id: "b-products", type: "products", label: BLOCK_META.products.label, desc: BLOCK_META.products.desc, hidden: false },
  { id: "b-faq_section", type: "faq_section", label: BLOCK_META.faq_section.label, desc: BLOCK_META.faq_section.desc, hidden: false },
  { id: "b-video_profil", type: "video_profil", label: BLOCK_META.video_profil.label, desc: BLOCK_META.video_profil.desc, hidden: false },
  { id: "b-sosial_media", type: "sosial_media", label: BLOCK_META.sosial_media.label, desc: BLOCK_META.sosial_media.desc, hidden: false },
]

export const DEFAULT_HOME_BLOCKS: HomeBlock[] = [
  { id: "b-running_text", type: "running_text", label: BLOCK_META.running_text.label, desc: BLOCK_META.running_text.desc, hidden: false },
  { id: "b-hero_banner", type: "hero_banner", label: BLOCK_META.hero_banner.label, desc: BLOCK_META.hero_banner.desc, hidden: false },
  { id: "b-divider-mvdv5mzo-bx76", type: "divider", label: BLOCK_META.divider.label, desc: BLOCK_META.divider.desc, hidden: false, divider_style: "dashed", divider_color: "muted", divider_thickness: 2, divider_spacing: "lg" },
  { id: "b-mengenal_ign", type: "mengenal_ign", label: BLOCK_META.mengenal_ign.label, desc: BLOCK_META.mengenal_ign.desc, hidden: false },
  { id: "b-solusi_bisnis", type: "solusi_bisnis", label: BLOCK_META.solusi_bisnis.label, desc: BLOCK_META.solusi_bisnis.desc, hidden: false },
  { id: "b-jenis_produk", type: "jenis_produk", label: BLOCK_META.jenis_produk.label, desc: BLOCK_META.jenis_produk.desc, hidden: false },
  { id: "b-peluang", type: "peluang", label: BLOCK_META.peluang.label, desc: BLOCK_META.peluang.desc, hidden: false },
  { id: "b-mengapa_memilih", type: "mengapa_memilih", label: BLOCK_META.mengapa_memilih.label, desc: BLOCK_META.mengapa_memilih.desc, hidden: false },
  { id: "b-legalitas", type: "legalitas", label: BLOCK_META.legalitas.label, desc: BLOCK_META.legalitas.desc, hidden: false },
  { id: "b-dipercaya_brand", type: "dipercaya_brand", label: BLOCK_META.dipercaya_brand.label, desc: BLOCK_META.dipercaya_brand.desc, hidden: false },
  { id: "b-proses_maklon", type: "proses_maklon", label: BLOCK_META.proses_maklon.label, desc: BLOCK_META.proses_maklon.desc, hidden: false },
  { id: "b-konsultasi_banner", type: "konsultasi_banner", label: BLOCK_META.konsultasi_banner.label, desc: BLOCK_META.konsultasi_banner.desc, hidden: false },
  { id: "b-melayani_klien", type: "melayani_klien", label: BLOCK_META.melayani_klien.label, desc: BLOCK_META.melayani_klien.desc, hidden: false },
  { id: "b-ulasan_klien", type: "ulasan_klien", label: BLOCK_META.ulasan_klien.label, desc: BLOCK_META.ulasan_klien.desc, hidden: false },
  { id: "b-faq_section", type: "faq_section", label: BLOCK_META.faq_section.label, desc: BLOCK_META.faq_section.desc, hidden: false },
  { id: "b-video_profil", type: "video_profil", label: BLOCK_META.video_profil.label, desc: BLOCK_META.video_profil.desc, hidden: false },
  { id: "b-sosial_media", type: "sosial_media", label: BLOCK_META.sosial_media.label, desc: BLOCK_META.sosial_media.desc, hidden: false },
]

export function normalizeHomeBlocks(blocks: any[]): HomeBlock[] {
  if (!Array.isArray(blocks) || blocks.length === 0) return DEFAULT_HOME_BLOCKS

  // Filter keluar blok yang tidak lagi digunakan (informasi outlet, order online, ulasan google, promo, artikel)
  const copy = blocks.filter(
    (b: any) => b && !["location", "order_online", "google_review", "promos", "articles"].includes(b.type)
  )

  // Pastikan mengenal_ign otomatis terselip jika belum ada di layout yang tersimpan
  const hasMengenal = copy.some((b: any) => b.type === "mengenal_ign")
  if (!hasMengenal) {
    const dividerIdx = copy.findIndex((b: any) => b.type === "divider")
    const heroIdx = copy.findIndex((b: any) => b.type === "hero_banner")
    const insertIdx = dividerIdx !== -1 ? dividerIdx + 1 : heroIdx !== -1 ? heroIdx + 1 : copy.length
    copy.splice(insertIdx, 0, {
      id: "b-mengenal_ign",
      type: "mengenal_ign",
      label: BLOCK_META.mengenal_ign.label,
      desc: BLOCK_META.mengenal_ign.desc,
      hidden: false,
    })
  }

  // Pastikan solusi_bisnis otomatis terselip jika belum ada di layout yang tersimpan
  const hasSolusi = copy.some((b: any) => b.type === "solusi_bisnis")
  if (!hasSolusi) {
    const mengenalIdx = copy.findIndex((b: any) => b.type === "mengenal_ign")
    const insertIdx = mengenalIdx !== -1 ? mengenalIdx + 1 : copy.length
    copy.splice(insertIdx, 0, {
      id: "b-solusi_bisnis",
      type: "solusi_bisnis",
      label: BLOCK_META.solusi_bisnis.label,
      desc: BLOCK_META.solusi_bisnis.desc,
      hidden: false,
    })
  }

  // Pastikan jenis_produk otomatis terselip jika belum ada di layout yang tersimpan
  const hasJenisProduk = copy.some((b: any) => b.type === "jenis_produk")
  if (!hasJenisProduk) {
    const solusiIdx = copy.findIndex((b: any) => b.type === "solusi_bisnis")
    const insertIdx = solusiIdx !== -1 ? solusiIdx + 1 : copy.length
    copy.splice(insertIdx, 0, {
      id: "b-jenis_produk",
      type: "jenis_produk",
      label: BLOCK_META.jenis_produk.label,
      desc: BLOCK_META.jenis_produk.desc,
      hidden: false,
    })
  }

  // Pastikan peluang otomatis terselip jika belum ada di layout yang tersimpan
  const hasPeluang = copy.some((b: any) => b.type === "peluang")
  if (!hasPeluang) {
    const jenisProdukIdx = copy.findIndex((b: any) => b.type === "jenis_produk")
    const insertIdx = jenisProdukIdx !== -1 ? jenisProdukIdx + 1 : copy.length
    copy.splice(insertIdx, 0, {
      id: "b-peluang",
      type: "peluang",
      label: BLOCK_META.peluang.label,
      desc: BLOCK_META.peluang.desc,
      hidden: false,
    })
  }

  // Pastikan mengapa_memilih otomatis terselip jika belum ada di layout yang tersimpan
  const hasMengapa = copy.some((b: any) => b.type === "mengapa_memilih")
  if (!hasMengapa) {
    const peluangIdx = copy.findIndex((b: any) => b.type === "peluang")
    const insertIdx = peluangIdx !== -1 ? peluangIdx + 1 : copy.length
    copy.splice(insertIdx, 0, {
      id: "b-mengapa_memilih",
      type: "mengapa_memilih",
      label: BLOCK_META.mengapa_memilih.label,
      desc: BLOCK_META.mengapa_memilih.desc,
      hidden: false,
    })
  }

  // Pastikan legalitas otomatis terselip jika belum ada di layout yang tersimpan
  const hasLegalitas = copy.some((b: any) => b.type === "legalitas")
  if (!hasLegalitas) {
    const mengapaIdx = copy.findIndex((b: any) => b.type === "mengapa_memilih")
    const insertIdx = mengapaIdx !== -1 ? mengapaIdx + 1 : copy.length
    copy.splice(insertIdx, 0, {
      id: "b-legalitas",
      type: "legalitas",
      label: BLOCK_META.legalitas.label,
      desc: BLOCK_META.legalitas.desc,
      hidden: false,
    })
  }

  // Pastikan dipercaya_brand otomatis terselip jika belum ada di layout yang tersimpan
  const hasDipercayaBrand = copy.some((b: any) => b.type === "dipercaya_brand")
  if (!hasDipercayaBrand) {
    const legalitasIdx = copy.findIndex((b: any) => b.type === "legalitas")
    const insertIdx = legalitasIdx !== -1 ? legalitasIdx + 1 : copy.length
    copy.splice(insertIdx, 0, {
      id: "b-dipercaya_brand",
      type: "dipercaya_brand",
      label: BLOCK_META.dipercaya_brand.label,
      desc: BLOCK_META.dipercaya_brand.desc,
      hidden: false,
    })
  }

  // Pastikan proses_maklon otomatis terselip jika belum ada di layout yang tersimpan
  const hasProsesMaklon = copy.some((b: any) => b.type === "proses_maklon")
  if (!hasProsesMaklon) {
    const brandIdx = copy.findIndex((b: any) => b.type === "dipercaya_brand")
    const legalitasIdx = copy.findIndex((b: any) => b.type === "legalitas")
    const insertIdx = brandIdx !== -1 ? brandIdx + 1 : legalitasIdx !== -1 ? legalitasIdx + 1 : copy.length
    copy.splice(insertIdx, 0, {
      id: "b-proses_maklon",
      type: "proses_maklon",
      label: BLOCK_META.proses_maklon.label,
      desc: BLOCK_META.proses_maklon.desc,
      hidden: false,
    })
  }

  // Pastikan konsultasi_banner otomatis terselip jika belum ada di layout yang tersimpan
  const hasKonsultasiBanner = copy.some((b: any) => b.type === "konsultasi_banner")
  if (!hasKonsultasiBanner) {
    const prosesIdx = copy.findIndex((b: any) => b.type === "proses_maklon")
    const brandIdx = copy.findIndex((b: any) => b.type === "dipercaya_brand")
    const insertIdx = prosesIdx !== -1 ? prosesIdx + 1 : brandIdx !== -1 ? brandIdx + 1 : copy.length
    copy.splice(insertIdx, 0, {
      id: "b-konsultasi_banner",
      type: "konsultasi_banner",
      label: BLOCK_META.konsultasi_banner.label,
      desc: BLOCK_META.konsultasi_banner.desc,
      hidden: false,
    })
  }

  // Pastikan melayani_klien otomatis terselip jika belum ada di layout yang tersimpan
  const hasMelayaniKlien = copy.some((b: any) => b.type === "melayani_klien")
  if (!hasMelayaniKlien) {
    const konsultasiIdx = copy.findIndex((b: any) => b.type === "konsultasi_banner")
    const prosesIdx = copy.findIndex((b: any) => b.type === "proses_maklon")
    const insertIdx = konsultasiIdx !== -1 ? konsultasiIdx + 1 : prosesIdx !== -1 ? prosesIdx + 1 : copy.length
    copy.splice(insertIdx, 0, {
      id: "b-melayani_klien",
      type: "melayani_klien",
      label: BLOCK_META.melayani_klien.label,
      desc: BLOCK_META.melayani_klien.desc,
      hidden: false,
    })
  }

  // Pastikan ulasan_klien otomatis terselip jika belum ada di layout yang tersimpan
  const hasUlasanKlien = copy.some((b: any) => b.type === "ulasan_klien")
  if (!hasUlasanKlien) {
    const melayaniIdx = copy.findIndex((b: any) => b.type === "melayani_klien")
    const konsultasiIdx = copy.findIndex((b: any) => b.type === "konsultasi_banner")
    const insertIdx = melayaniIdx !== -1 ? melayaniIdx + 1 : konsultasiIdx !== -1 ? konsultasiIdx + 1 : copy.length
    copy.splice(insertIdx, 0, {
      id: "b-ulasan_klien",
      type: "ulasan_klien",
      label: BLOCK_META.ulasan_klien.label,
      desc: BLOCK_META.ulasan_klien.desc,
      hidden: false,
    })
  }

  // Pastikan faq_section otomatis terselip jika belum ada di layout yang tersimpan
  const hasFaq = copy.some((b: any) => b.type === "faq_section")
  if (!hasFaq) {
    const ulasanIdx = copy.findIndex((b: any) => b.type === "ulasan_klien")
    const melayaniIdx = copy.findIndex((b: any) => b.type === "melayani_klien")
    const insertIdx = ulasanIdx !== -1 ? ulasanIdx + 1 : melayaniIdx !== -1 ? melayaniIdx + 1 : copy.length
    copy.splice(insertIdx, 0, {
      id: "b-faq_section",
      type: "faq_section",
      label: BLOCK_META.faq_section.label,
      desc: BLOCK_META.faq_section.desc,
      hidden: false,
    })
  }

  // Pastikan video_profil otomatis terselip jika belum ada di layout yang tersimpan
  const hasVideoProfil = copy.some((b: any) => b.type === "video_profil")
  if (!hasVideoProfil) {
    const faqIdx = copy.findIndex((b: any) => b.type === "faq_section")
    const ulasanIdx = copy.findIndex((b: any) => b.type === "ulasan_klien")
    const insertIdx = faqIdx !== -1 ? faqIdx + 1 : ulasanIdx !== -1 ? ulasanIdx + 1 : copy.length
    copy.splice(insertIdx, 0, {
      id: "b-video_profil",
      type: "video_profil",
      label: BLOCK_META.video_profil.label,
      desc: BLOCK_META.video_profil.desc,
      hidden: false,
    })
  }

  // Pastikan sosial_media otomatis terselip jika belum ada di layout yang tersimpan
  const hasSosialMedia = copy.some((b: any) => b.type === "sosial_media")
  if (!hasSosialMedia) {
    const videoIdx = copy.findIndex((b: any) => b.type === "video_profil")
    const faqIdx = copy.findIndex((b: any) => b.type === "faq_section")
    const insertIdx = videoIdx !== -1 ? videoIdx + 1 : faqIdx !== -1 ? faqIdx + 1 : copy.length
    copy.splice(insertIdx, 0, {
      id: "b-sosial_media",
      type: "sosial_media",
      label: BLOCK_META.sosial_media.label,
      desc: BLOCK_META.sosial_media.desc,
      hidden: false,
    })
  }

  return copy.map((item: any) => ({
    id: item.id || `b-${item.type}-${Math.random().toString(36).substring(2, 7)}`,
    type: item.type as HomeBlockType,
    label: item.type === "divider" ? (item.label || BLOCK_META.divider.label) : (BLOCK_META[item.type as HomeBlockType]?.label || item.label || item.type),
    desc: item.type === "divider" ? (item.desc || BLOCK_META.divider.desc) : (BLOCK_META[item.type as HomeBlockType]?.desc || item.desc || ""),
    hidden: Boolean(item.hidden),
    divider_style: item.divider_style || "solid",
    divider_color: item.divider_color || "default",
    divider_thickness: item.divider_thickness ?? 2,
    divider_spacing: item.divider_spacing || "md",
  }))
}

export function loadHomeLayout(key: string = HOME_LAYOUT_KEY): HomeBlock[] {
  if (typeof window === "undefined") return DEFAULT_HOME_BLOCKS
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return DEFAULT_HOME_BLOCKS
    const parsed = JSON.parse(raw)
    const normalized = normalizeHomeBlocks(parsed)
    try {
      localStorage.setItem(key, JSON.stringify(normalized))
    } catch (e) { }
    return normalized
  } catch {
    return DEFAULT_HOME_BLOCKS
  }
}

export function saveHomeLayoutLocal(blocks: HomeBlock[], key: string = HOME_LAYOUT_KEY) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(blocks))
    window.dispatchEvent(new CustomEvent(HOME_LAYOUT_EVENT, { detail: blocks }))
  } catch (e) {
    console.error("Gagal menyimpan ke localStorage:", e)
  }
}

export async function saveHomeLayoutRemote(blocks: HomeBlock[]): Promise<boolean> {
  try {
    const { data } = await supabase.from('app_config').select('id').eq('key', 'home_layout').maybeSingle()
    const value = JSON.stringify(blocks)
    if (data) {
      const { error } = await supabase
        .from('app_config')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', 'home_layout')
      return !error
    } else {
      const { error } = await supabase.from('app_config').insert({ key: 'home_layout', value })
      return !error
    }
  } catch (err) {
    console.error("Gagal menyimpan layout ke Supabase:", err)
    return false
  }
}

export async function fetchHomeLayoutRemote(): Promise<HomeBlock[] | null> {
  try {
    const { data } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'home_layout')
      .maybeSingle()
    if (data?.value) {
      const parsed = JSON.parse(data.value)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return normalizeHomeBlocks(parsed)
      }
    }
  } catch (err) {
    console.error("Gagal mengambil layout dari Supabase:", err)
  }
  return null
}

// ─── Ulasan Klien / Testimoni ─────────────────────────────────────────────────
export interface UlasanKlienItem {
  id: string
  name: string
  role?: string
  initials?: string
  avatar_bg?: string
  avatar_text_color?: string
  image?: string
  avatar_url?: string
  rating: number
  date: string
  text: string
}

export const DEFAULT_ULASAN_KLIEN_TITLE = "Dipercaya Ratusan Brand di Seluruh Indonesia"
export const DEFAULT_ULASAN_KLIEN_TITLE_SIZE = 40
export const DEFAULT_ULASAN_KLIEN_TITLE_COLOR = "#15803D"
export const DEFAULT_ULASAN_KLIEN_TITLE_FONT = "poppins"
export const DEFAULT_ULASAN_KLIEN_TITLE_FONT_WEIGHT = "bold"
export const DEFAULT_ULASAN_KLIEN_SUBTITLE = "Lihat pengalaman dan ulasan dari berbagai klien yang telah mempercayakan pengembangan serta produksi herbal mereka kepada CV. Indo Green Nature."
export const DEFAULT_ULASAN_KLIEN_SUBTITLE_SIZE = 17
export const DEFAULT_ULASAN_KLIEN_SUBTITLE_COLOR = "#4B5563"
export const DEFAULT_ULASAN_KLIEN_BG = "#F9FAFB"
export const DEFAULT_ULASAN_KLIEN_CARD_BG = "#FFFFFF"
export const DEFAULT_ULASAN_KLIEN_CARD_BORDER = "#E5E7EB"
export const DEFAULT_ULASAN_KLIEN_ITEMS: UlasanKlienItem[] = [
  {
    id: "ulasan-1",
    name: "Budi Santoso",
    role: "Owner Herbal Nusantara",
    initials: "BS",
    avatar_bg: "#15803D",
    avatar_text_color: "#FFFFFF",
    rating: 5,
    date: "2 bulan lalu",
    text: "Sangat profesional dan hasil produknya luar biasa memuaskan. INDO GREEN NATURE benar-benar membantu kami membangun brand herbal dari nol hingga mendapatkan izin BPOM. Tim konsultasinya responsif dan berpengalaman.",
  },
  {
    id: "ulasan-2",
    name: "Siti Rahayu",
    role: "Founder PT. Hijau Sehat",
    initials: "SR",
    avatar_bg: "#D97706",
    avatar_text_color: "#FFFFFF",
    rating: 5,
    date: "3 bulan lalu",
    text: "Pelayanan maklon di sini sangat memuaskan. Formulasi produk kapsul herbal kami dikerjakan dengan standar tinggi. Hasilnya sesuai dengan keinginan dan customer kami sangat puas.",
  },
  {
    id: "ulasan-3",
    name: "Reza Firmansyah",
    role: "Direktur Alami Brand",
    initials: "RF",
    avatar_bg: "#1D4ED8",
    avatar_text_color: "#FFFFFF",
    rating: 5,
    date: "5 bulan lalu",
    text: "Saya senang bisa menjadi bagian dari mitra jasa maklon INDO GREEN NATURE. Di saat susah mencari mitra produksi yang terpercaya, IGN hadir dengan solusi lengkap dan harga yang kompetitif.",
  },
  {
    id: "ulasan-4",
    name: "Dewi Anggraini",
    role: "Brand Owner Herba Prima",
    initials: "DA",
    avatar_bg: "#7C3AED",
    avatar_text_color: "#FFFFFF",
    rating: 5,
    date: "6 bulan lalu",
    text: "Jasa maklon yang profesional dalam bidang herbal. INDO GREEN NATURE memberikan layanan terbaik mulai dari konsultasi formula, pengembangan produk, pengemasan, hingga pengurusan legalitas. Terima kasih banyak untuk kerja samanya.",
  },
  {
    id: "ulasan-5",
    name: "Ahmad Fauzi",
    role: "CEO Greenlife Indonesia",
    initials: "AF",
    avatar_bg: "#DC2626",
    avatar_text_color: "#FFFFFF",
    rating: 5,
    date: "8 bulan lalu",
    text: "Tim INDO GREEN NATURE sangat membantu proses pengembangan produk suplemen kami. Proses produksi cepat, kualitas terjaga, dan komunikasi yang baik. Kami sudah 3 tahun bermitra dan sangat puas.",
  },
  {
    id: "ulasan-6",
    name: "Putri Maharani",
    role: "Owner Cantik Alami Beauty",
    initials: "PM",
    avatar_bg: "#DB2777",
    avatar_text_color: "#FFFFFF",
    rating: 5,
    date: "1 tahun lalu",
    text: "Maklon kecantikan berbahan herbal terbaik! Produk skincare herbal kami berhasil diproduksi dengan kualitas premium. Tim IGN sangat memahami kebutuhan pasar kecantikan Indonesia yang terus berkembang.",
  },
  {
    id: "ulasan-7",
    name: "Hendra Wijaya",
    role: "Direktur PT Segar Alam Sejahtera",
    initials: "HW",
    avatar_bg: "#0D9488",
    avatar_text_color: "#FFFFFF",
    rating: 5,
    date: "1 tahun lalu",
    text: "Kerja sama maklon minuman serbuk herbal bersama INDO GREEN NATURE sangat memuaskan. Mesin modern standar CPOTB dan higienitas pabriknya terjamin sehingga produk kami langsung laris di pasaran.",
  },
  {
    id: "ulasan-8",
    name: "Nurul Aini",
    role: "Founder Madu & Rempah Alami",
    initials: "NA",
    avatar_bg: "#EA580C",
    avatar_text_color: "#FFFFFF",
    rating: 5,
    date: "1 tahun lalu",
    text: "Sangat terbantu dalam proses uji laboratorium dan registrasi izin edar BPOM. Komunikasi tim R&D INDO GREEN NATURE sangat solutif dan tepat waktu dalam menyelesaikan formulasi madu herbal kami.",
  },
]

// ─── FAQ Maklon Herbal ────────────────────────────────────────────────────────
export interface FaqItem {
  id: string
  question: string
  answer: string
  question_color?: string
  answer_color?: string
}

export const DEFAULT_FAQ_TITLE = "FAQ Jasa Maklon Herbal"
export const DEFAULT_FAQ_TITLE_SIZE = 36
export const DEFAULT_FAQ_TITLE_COLOR = "#0D5C2E"
export const DEFAULT_FAQ_TITLE_FONT = "poppins"
export const DEFAULT_FAQ_TITLE_FONT_WEIGHT = "bold"

export const DEFAULT_FAQ_SUBTITLE = "Temukan jawaban atas pertanyaan yang paling sering diajukan mengenai layanan jasa maklon herbal di CV. Indo Green Nature."
export const DEFAULT_FAQ_SUBTITLE_SIZE = 16
export const DEFAULT_FAQ_SUBTITLE_COLOR = "#4B5563"

export const DEFAULT_FAQ_BG = "#FFFFFF"
export const DEFAULT_FAQ_CARD_BG = "#FFFFFF"
export const DEFAULT_FAQ_CARD_BORDER = "#E5E7EB"
export const DEFAULT_FAQ_ACTIVE_BORDER = "#16A34A"

export const DEFAULT_FAQ_QUESTION_COLOR = "#0D5C2E"
export const DEFAULT_FAQ_QUESTION_ACTIVE_COLOR = "#C25E00"
export const DEFAULT_FAQ_ANSWER_COLOR = "#475569"

export const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Berapa biaya jasa maklon herbal?",
    answer: "Biaya jasa maklon herbal di CV. Indo Green Nature sangat fleksibel dan disesuaikan dengan jenis sediaan (kapsul, cairan obat dalam/luar, serbuk teh herbal, atau ekstrak), komposisi bahan baku herbal, serta jenis kemasan yang Anda pilih. Kami menyediakan paket maklon transparan dan terjangkau baik untuk pengusaha pemula maupun brand yang sedang scale-up.",
  },
  {
    id: "faq-2",
    question: "Berapa MOQ jasa maklon herbal di CV. Indo Green Nature?",
    answer: "Kami menawarkan MOQ (Minimum Order Quantity) yang sangat terjangkau bagi pemilik brand herbal pemula mulai dari kapasitas batch produksi yang fleksibel, sehingga Anda dapat memulai peluncuran brand herbal sendiri tanpa beban modal awal yang terlalu besar.",
  },
  {
    id: "faq-3",
    question: "Apakah saya bisa membuat brand herbal sendiri?",
    answer: "Tentu saja bisa! CV. Indo Green Nature adalah mitra maklon herbal 'one-stop service' yang mendampingi Anda mulai dari pendaftaran HKI merek dagang, riset dan formulasi produk eksklusif, pengurusan legalitas BPOM & Halal, desain kemasan profesional, hingga produk siap edar ke pasar.",
  },
  {
    id: "faq-4",
    question: "Apakah formulasi produk herbal dapat disesuaikan (custom)?",
    answer: "Ya, tim Research & Development (R&D) kami yang berpengalaman siap mengembangkan formulasi herbal custom secara eksklusif sesuai dengan khasiat yang diinginkan, target konsumen Anda, serta standar keamanan CPOTB dan regulasi Badan POM.",
  },
  {
    id: "faq-5",
    question: "Berapa lama proses maklon herbal?",
    answer: "Lama proses maklon herbal bergantung pada tahapan R&D (apabila diperlukan revisi sampel) dan waktu pengurusan perizinan (seperti BPOM & Halal). Secara umum, mulai dari konsep awal hingga produk siap edar membutuhkan waktu beberapa bulan yang terjadwal dengan sistematis bersama tim kami.",
  },
  {
    id: "faq-6",
    question: "Apakah CV. Indo Green Nature membantu pengurusan izin BPOM dan Halal?",
    answer: "Ya, seluruh produk herbal yang diproduksi di fasilitas kami didampingi penuh oleh tim regulasi resmi untuk pengurusan izin edar BPOM (kategori Jamu/TR, Obat Herbal Terstandar/OHT, maupun Fitofarmaka) serta sertifikasi Halal dari Kemenag/BPJPH.",
  },
]

/**
 * Render teks yang mendukung format bold markdown (**teks**).
 * Contoh: "**indo** herbal" -> <strong>indo</strong> herbal
 */
export function renderFormattedText(text?: string | null): React.ReactNode {
  if (!text) return null;
  const parts = text.split(/(\*\*[\s\S]+?\*\*|__[\s\S]+?__|<b>[\s\S]+?<\/b>|<strong>[\s\S]+?<\/strong>)/g);
  if (parts.length === 1) return text;
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return React.createElement(
        "strong",
        { key: index, className: "font-bold", style: { fontWeight: 700 } },
        part.slice(2, -2)
      );
    }
    if (part.startsWith("__") && part.endsWith("__") && part.length >= 4) {
      return React.createElement(
        "strong",
        { key: index, className: "font-bold", style: { fontWeight: 700 } },
        part.slice(2, -2)
      );
    }
    if (part.startsWith("<b>") && part.endsWith("</b>") && part.length >= 7) {
      return React.createElement(
        "strong",
        { key: index, className: "font-bold", style: { fontWeight: 700 } },
        part.slice(3, -4)
      );
    }
    if (part.startsWith("<strong>") && part.endsWith("</strong>") && part.length >= 17) {
      return React.createElement(
        "strong",
        { key: index, className: "font-bold", style: { fontWeight: 700 } },
        part.slice(8, -9)
      );
    }
    return part;
  });
}

// ─── Video Profil Mengenal IGN ────────────────────────────────────────────────
export const DEFAULT_VIDEO_PROFIL_TITLE = "Mengenal Indo Green Nature"
export const DEFAULT_VIDEO_PROFIL_TITLE_SIZE = 40
export const DEFAULT_VIDEO_PROFIL_TITLE_COLOR = "#C25E00"
export const DEFAULT_VIDEO_PROFIL_TITLE_FONT = "poppins"
export const DEFAULT_VIDEO_PROFIL_TITLE_FONT_WEIGHT = "bold"

export const DEFAULT_VIDEO_PROFIL_DESC = `**INDO GREEN NATURE** adalah perusahaan jasa maklon obat herbal yang berdiri sejak tahun 1994 dan berlokasi di Wates, Daerah Istimewa Yogyakarta.\n\nSelama lebih dari 25 tahun, kami telah membantu ratusan brand mengembangkan produk kapsul, herbal, kesehatan, kecantikan, dan suplemen fungsional melalui layanan one-stop service mulai dari formulasi, produksi, pengemasan, hingga pengurusan legalitas BPOM dan Halal.\n\nINDO GREEN NATURE adalah perusahaan jasa maklon obat herbal yang berdiri sejak tahun 1994 dan berlokasi di Wates, Daerah Istimewa Yogyakarta. Selama lebih dari 25 tahun, kami telah membantu ratusan brand mengembangkan produk kapsul, herbal, kesehatan, kecantikan, dan suplemen fungsional melalui layanan one-stop service mulai dari formulasi, produksi, pengemasan, hingga pengurusan legalitas BPOM dan Halal.`
export const DEFAULT_VIDEO_PROFIL_DESC_SIZE = 16
export const DEFAULT_VIDEO_PROFIL_DESC_COLOR = "#334155"

export const DEFAULT_VIDEO_PROFIL_THUMBNAIL = "/images/ign_lab_video_thumb.jpg"
export const DEFAULT_VIDEO_PROFIL_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
export const DEFAULT_VIDEO_PROFIL_POSITION: "left" | "right" = "right"
export const DEFAULT_VIDEO_PROFIL_FRAME_SIZE = 576

export function getEmbedVideoUrl(url: string): string | null {
  if (!url || typeof url !== "string") return null
  const trimmed = url.trim()
  if (!trimmed) return null

  // YouTube match: watch?v=, embed/, shorts/, youtu.be/
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
  }

  return trimmed
}

// ─── Banner Tautan Sosial Media ───────────────────────────────────────────────
export interface SosialMediaItem {
  id: string
  name: string
  url: string
  platform: "instagram" | "facebook" | "tiktok" | "youtube" | "website" | "whatsapp" | "custom"
  icon_image?: string // Custom uploaded image URL
  is_active: boolean
}

export const DEFAULT_SOSIAL_MEDIA_TITLE = "ikuti sosial media kami disini"
export const DEFAULT_SOSIAL_MEDIA_TITLE_SIZE = 40
export const DEFAULT_SOSIAL_MEDIA_TITLE_COLOR = "#FFFFFF"
export const DEFAULT_SOSIAL_MEDIA_TITLE_FONT = "poppins"
export const DEFAULT_SOSIAL_MEDIA_TITLE_FONT_WEIGHT = "bold"

export const DEFAULT_SOSIAL_MEDIA_LABEL = ""
export const DEFAULT_SOSIAL_MEDIA_LABEL_SIZE = 12
export const DEFAULT_SOSIAL_MEDIA_LABEL_COLOR = "#FFFFFF"

export const DEFAULT_SOSIAL_MEDIA_BG_COLOR = "#D97706"
export const DEFAULT_SOSIAL_MEDIA_BORDER_RADIUS = 5

export const DEFAULT_SOSIAL_MEDIA_ITEMS: SosialMediaItem[] = [
  {
    id: "sm-instagram",
    name: "Instagram",
    url: "https://instagram.com/cv.indogreennature",
    platform: "instagram",
    is_active: true,
  },
  {
    id: "sm-facebook",
    name: "Facebook",
    url: "https://facebook.com/indogreennature",
    platform: "facebook",
    is_active: true,
  },
  {
    id: "sm-tiktok",
    name: "TikTok",
    url: "https://tiktok.com/@indogreennature",
    platform: "tiktok",
    is_active: true,
  },
  {
    id: "sm-youtube",
    name: "YouTube",
    url: "https://youtube.com/@indogreennature",
    platform: "youtube",
    is_active: true,
  },
  {
    id: "sm-website",
    name: "Website",
    url: "https://indogreennature.com",
    platform: "website",
    is_active: true,
  },
]
