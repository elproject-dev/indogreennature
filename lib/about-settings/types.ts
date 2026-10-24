export interface MisiItem {
  num: string
  title: string
  desc: string
}

export interface TimelineMilestone {
  year: string
  title: string
  desc: string
}

export interface PrinsipKerjaItem {
  id?: string
  title: string
  desc: string
}

export interface LegalitasItem {
  id?: string
  imageUrl: string
  title?: string
}

export interface AboutSettingsData {
  // Banner Utama
  bannerTitle: string
  bannerTitleColor?: string
  bannerTitleFont?: string
  bannerTitleSize?: number
  bannerDesc: string
  bannerDescColor?: string
  bannerDescFont?: string
  bannerDescSize?: number
  bannerImage: string
  bannerImagePosition?: "left" | "right"
  bannerImageScale?: number

  // Tombol CTA Hero Banner
  bannerBtn1Text?: string
  bannerBtn1Link?: string
  bannerBtn1BgColor?: string
  bannerBtn1TextColor?: string

  bannerBtn2Text?: string
  bannerBtn2Link?: string
  bannerBtn2BgColor?: string
  bannerBtn2TextColor?: string

  stat1Number: number
  stat1Suffix: string
  stat1Label: string
  stat2Number: number
  stat2Suffix: string
  stat2Label: string
  stat3Number: number
  stat3Suffix: string
  stat3Label: string
  stat4Number: number
  stat4Suffix: string
  stat4Label: string

  // Visi & Misi
  visiMisiTitle?: string
  visiMisiTitleColor?: string
  visiMisiTitleFont?: string
  visiMisiTitleSize?: number

  visiMisiSubtitle?: string
  visiMisiSubtitleColor?: string
  visiMisiSubtitleFont?: string
  visiMisiSubtitleSize?: number

  visiTitle: string
  visiTitleColor?: string
  visiTitleFont?: string
  visiTitleSize?: number

  visiDesc: string
  visiDescColor?: string
  visiDescFont?: string
  visiDescSize?: number

  visiCardBg?: string
  visiAlign?: "left" | "center" | "right"
  visiPillars?: string[]

  // Misi Kami (Kartu Misi)
  misiBadge?: string
  misiTitle?: string
  misiTitleColor?: string
  misiTitleFont?: string
  misiTitleSize?: number

  misiCardBg?: string
  misiAlign?: "left" | "center" | "right"

  misiItemTitleColor?: string
  misiItemTitleFont?: string
  misiItemTitleSize?: number

  misiItemDescColor?: string
  misiItemDescFont?: string
  misiItemDescSize?: number

  misiBadgeNumberBg?: string
  misiBadgeNumberColor?: string

  misiItems: MisiItem[]

  // Profile Perusahaan
  profilTitle: string
  profilTitleColor?: string
  profilTitleFont?: string
  profilTitleSize?: number
  profilVideoUrl: string
  profilVideoThumb: string
  profilMediaPosition?: "left" | "right"
  profilMediaScale?: number
  profilDesc?: string
  profilDescColor?: string
  profilDescFont?: string
  profilDescSize?: number
  profilP1?: string
  profilP2?: string
  profilP3?: string

  // Rekam Jejak & Kapabilitas
  rekamJejakBadge?: string
  rekamJejakTitle?: string
  rekamJejakTitleColor?: string
  rekamJejakTitleFont?: string
  rekamJejakTitleSize?: number
  rekamJejakSubtitle?: string
  rekamJejakSubtitleColor?: string
  rekamJejakSubtitleFont?: string
  rekamJejakSubtitleSize?: number
  rekamJejakAlign?: "left" | "center" | "right"

  rekamJejakCarouselTitle?: string
  rekamJejakCarouselTitleColor?: string
  rekamJejakCarouselTitleFont?: string
  rekamJejakCarouselTitleSize?: number

  rekamJejakYearColor?: string
  rekamJejakCardTitleColor?: string
  rekamJejakCardDescColor?: string
  rekamJejakCardBg?: string
  rekamJejakCardBorderColor?: string

  rekamJejakMilestones?: TimelineMilestone[]

  // Prinsip Kerja (Nilai & Komitmen Perusahaan)
  prinsipKerjaBadge?: string
  prinsipKerjaBadgeColor?: string
  prinsipKerjaTitle?: string
  prinsipKerjaTitleColor?: string
  prinsipKerjaTitleFont?: string
  prinsipKerjaTitleSize?: number
  prinsipKerjaDesc?: string
  prinsipKerjaDescColor?: string
  prinsipKerjaDescFont?: string
  prinsipKerjaDescSize?: number
  prinsipKerjaAlign?: "left" | "center" | "right"

  // Kustomisasi Kartu Prinsip Kerja
  prinsipKerjaCardTitleColor?: string
  prinsipKerjaCardTitleFont?: string
  prinsipKerjaCardTitleSize?: number
  prinsipKerjaCardDescColor?: string
  prinsipKerjaCardDescFont?: string
  prinsipKerjaCardDescSize?: number
  prinsipKerjaCardBg?: string
  prinsipKerjaCardBorderColor?: string

  prinsipKerjaItems?: PrinsipKerjaItem[]

  // Jangkauan Distribusi (Pasar Domestik & Internasional)
  distribusiBadge?: string
  distribusiBadgeColor?: string
  distribusiTitle?: string
  distribusiTitleColor?: string
  distribusiTitleFont?: string
  distribusiTitleSize?: number
  distribusiDesc?: string
  distribusiDescColor?: string
  distribusiDescFont?: string
  distribusiDescSize?: number
  distribusiAlign?: "left" | "center" | "right"

  // Styling Card Domestik & Ekspor
  distribusiCardBg?: string
  distribusiCardBorderColor?: string
  distribusiTagColor?: string
  distribusiCardTitleColor?: string
  distribusiCardTitleFont?: string
  distribusiCardTitleSize?: number
  distribusiCardDescColor?: string
  distribusiCardDescFont?: string
  distribusiCardDescSize?: number

  // Pasar Domestik
  distribusiDomestikTag?: string
  distribusiDomestikTitle?: string
  distribusiDomestikDesc?: string
  distribusiDomestikFooter?: string
  distribusiDomestikCities?: string[]
  distribusiCityBadgeBg?: string
  distribusiCityBadgeColor?: string

  // Pasar Internasional / Ekspor
  distribusiEksporTag?: string
  distribusiEksporTitle?: string
  distribusiEksporDesc?: string
  distribusiEksporFooter?: string
  distribusiEksporPoints?: string[]

  // Legalitas & Standar Mutu Resmi
  legalitasBadge?: string
  legalitasBadgeColor?: string
  legalitasTitle?: string
  legalitasTitleColor?: string
  legalitasTitleFont?: string
  legalitasTitleSize?: number
  legalitasDesc?: string
  legalitasDescColor?: string
  legalitasDescFont?: string
  legalitasDescSize?: number
  legalitasAlign?: "left" | "center" | "right"

  // Tampilan Card 1:1 Legalitas
  legalitasCardBg?: string
  legalitasCardBorderColor?: string
  legalitasCardFit?: "contain" | "cover"
  legalitasCardRounded?: number
  legalitasImageScale?: number
  legalitasEnableCarousel?: boolean
  legalitasAutoplay?: boolean
  legalitasAutoplayDelay?: number

  legalitasItems?: LegalitasItem[]

  // 08. Konsultasi Brand (CTA Banner)
  ctaTitle?: string
  ctaTitleColor?: string
  ctaTitleFont?: string
  ctaTitleSize?: number
  ctaDesc?: string
  ctaDescColor?: string
  ctaDescFont?: string
  ctaDescSize?: number
  ctaWhatsappText?: string
  ctaWhatsappUrl?: string
  ctaSecondaryText?: string
  ctaSecondaryUrl?: string
  ctaButtonFullRounded?: boolean
  ctaButtonBg?: string
  ctaButtonTextColor?: string
  ctaCardBg?: string
  ctaCardBorderColor?: string
}

export const DEFAULT_ABOUT_SETTINGS: AboutSettingsData = {
  bannerTitle: "Dedikasi Lebih Dari 25 Tahun Mengembangkan Produk Herbal Berkualitas Tinggi",
  bannerTitleColor: "",
  bannerTitleFont: "poppins",
  bannerTitleSize: 42,
  bannerDesc:
    "CV. Indo Green Nature adalah industri manufaktur dan jasa maklon obat herbal alami terkemuka di Indonesia. Kami memadukan kearifan bahan baku tanaman obat Nusantara dengan teknologi ekstraksi mutakhir berstandar CPOTB, BPOM, Halal, dan ISO 22000 untuk melahirkan produk berkhasiat tinggi dan bernilai komersial kuat.",
  bannerDescColor: "",
  bannerDescFont: "outfit",
  bannerDescSize: 16,
  bannerImage: "/images/about_hero_banner.jpg",
  bannerImagePosition: "right",
  bannerImageScale: 100,
  bannerBtn1Text: "Konsultasi Maklon Herbal",
  bannerBtn1Link:
    "https://wa.me/6282136368880?text=Halo%20Tim%20CV.%20Indo%20Green%20Nature,%20saya%20ingin%20konsultasi%20mengenai%20layanan%20maklon%20herbal.",
  bannerBtn1BgColor: "",
  bannerBtn1TextColor: "",
  bannerBtn2Text: "Jelajahi Profil Perusahaan",
  bannerBtn2Link: "#profil-perusahaan",
  bannerBtn2BgColor: "",
  bannerBtn2TextColor: "",
  stat1Number: 25,
  stat1Suffix: "+",
  stat1Label: "Tahun Berpengalaman",
  stat2Number: 760,
  stat2Suffix: "+",
  stat2Label: "Brand & Mitra Terdaftar",
  stat3Number: 930,
  stat3Suffix: "+",
  stat3Label: "Formula Produk Disetujui",
  stat4Number: 100,
  stat4Suffix: "%",
  stat4Label: "CPOTB, BPOM, Halal & ISO",

  visiMisiTitle: "Visi & Misi CV. Indo Green Nature",
  visiMisiTitleColor: "",
  visiMisiTitleFont: "poppins",
  visiMisiTitleSize: 32,

  visiMisiSubtitle:
    "Prinsip panduan yang mendasari setiap inovasi, formulasi, dan kemitraan manufaktur yang kami bangun bersama seluruh mitra klien.",
  visiMisiSubtitleColor: "",
  visiMisiSubtitleFont: "outfit",
  visiMisiSubtitleSize: 16,

  visiTitle: "Menjadi Industri Manufaktur Herbal Terkemuka & Berdaya Saing Global",
  visiTitleColor: "",
  visiTitleFont: "poppins",
  visiTitleSize: 24,

  visiDesc:
    "Menjadi perusahaan manufaktur dan formulasi obat tradisional alami paling terpercaya di Indonesia yang mampu bersaing di kancah internasional, menghasilkan produk bermutu prima, berkhasiat nyata, legal, dan berkontribusi terhadap kesejahteraan masyarakat global.",
  visiDescColor: "",
  visiDescFont: "outfit",
  visiDescSize: 15,

  visiCardBg: "",
  visiAlign: "left",
  visiPillars: ["Standar Mutu Farmasi", "Inovasi Alami", "Orientasi Global"],

  misiBadge: "MISI KAMI",
  misiTitle: "Komitmen Utama Mewujudkan Keunggulan",
  misiTitleColor: "",
  misiTitleFont: "poppins",
  misiTitleSize: 24,

  misiCardBg: "",
  misiAlign: "left",

  misiItemTitleColor: "",
  misiItemTitleFont: "poppins",
  misiItemTitleSize: 14,

  misiItemDescColor: "",
  misiItemDescFont: "outfit",
  misiItemDescSize: 13,

  misiBadgeNumberBg: "",
  misiBadgeNumberColor: "",

  misiItems: [
    {
      num: "01",
      title: "Standar Kualitas Tanpa Kompromi",
      desc: "Menerapkan sistem penjaminan mutu CPOTB, BPOM, Halal, dan ISO 22000 pada seluruh mata rantai pemilihan bahan baku, pengolahan, hingga pengemasan.",
    },
    {
      num: "02",
      title: "Riset & Inovasi Formulasi Berkelanjutan",
      desc: "Mengembangkan formulasi berbasis sains herbal modern (evidence-based) yang menjaga kestabilan senyawa aktif dan memaksimalkan efektivitas terapi.",
    },
    {
      num: "03",
      title: "Layanan Maklon Satu Pintu (One-Stop Solution)",
      desc: "Mendampingi pemilik brand dari konsep rancangan awal, uji klinis & stabilitas, desain kemasan, hingga tuntasnya legalitas izin edar resmi.",
    },
    {
      num: "04",
      title: "Integritas & Kerahasiaan Formula Mitra",
      desc: "Menjaga kerahasiaan resep formula eksklusif setiap mitra klien dengan penandatanganan perjanjian kerahasiaan resmi (NDA).",
    },
    {
      num: "05",
      title: "Pemberdayaan Petani Herbal Nusantara",
      desc: "Membina dan menyerap bahan simplisia segar dari jaringan petani lokal di Yogyakarta dan Nusantara untuk ketahanan rantai pasok hijau.",
    },
  ],

  profilTitle: "CV. Indo Green Nature — Pelopor Manufaktur Herbal Nusantara",
  profilTitleColor: "",
  profilTitleFont: "poppins",
  profilTitleSize: 32,
  profilVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  profilVideoThumb: "/images/ign_lab_video_thumb.jpg",
  profilMediaPosition: "left",
  profilMediaScale: 100,
  profilDesc:
    "CV. Indo Green Nature adalah perusahaan manufaktur dan formulasi obat herbal alami yang berpusat di Wates, Daerah Istimewa Yogyakarta. Didirikan pada tahun 2000, perusahaan ini lahir dari cita-cita luhur untuk mengoptimalkan potensi kekayaan tanaman obat alami Indonesia menjadi produk bernilai medis, higienis, dan diterima di pasar modern.\n\nSebagai pelaku industri terdepan, kami menerapkan sistem manajemen mutu holistik yang memadukan fasilitas pabrik berstandar CPOTB (Cara Pembuatan Obat Tradisional yang Baik), ruang bersih terkondisi (cleanroom), laboratorium kendali mutu berinstrumen presisi tinggi, serta proses ekstraksi bersuhu rendah guna menjaga keutuhan zat aktif fitokimia dari setiap tanaman obat.\n\nKami melayani kerja sama One-Stop Solution Jasa Maklon Herbal, mulai dari penelitian formula (RnD), pengadaan bahan baku terstandar, proses produksi, desain kemasan yang memikat, hingga pengurusan izin edar resmi dari BPOM RI, sertifikasi Halal BPJPH, serta hak paten merek HKI.",
  profilDescColor: "",
  profilDescFont: "outfit",
  profilDescSize: 16,
  profilP1:
    "CV. Indo Green Nature adalah perusahaan manufaktur dan formulasi obat herbal alami yang berpusat di Wates, Daerah Istimewa Yogyakarta. Didirikan pada tahun 2000, perusahaan ini lahir dari cita-cita luhur untuk mengoptimalkan potensi kekayaan tanaman obat alami Indonesia menjadi produk bernilai medis, higienis, dan diterima di pasar modern.",
  profilP2:
    "Sebagai pelaku industri terdepan, kami menerapkan sistem manajemen mutu holistik yang memadukan fasilitas pabrik berstandar CPOTB (Cara Pembuatan Obat Tradisional yang Baik), ruang bersih terkondisi (cleanroom), laboratorium kendali mutu berinstrumen presisi tinggi, serta proses ekstraksi bersuhu rendah guna menjaga keutuhan zat aktif fitokimia dari setiap tanaman obat.",
  profilP3:
    "Kami melayani kerja sama One-Stop Solution Jasa Maklon Herbal, mulai dari penelitian formula (RnD), pengadaan bahan baku terstandar, proses produksi, desain kemasan yang memikat, hingga pengurusan izin edar resmi dari BPOM RI, sertifikasi Halal BPJPH, serta hak paten merek HKI.",

  // Rekam Jejak & Kapabilitas
  rekamJejakBadge: "Rekam Jejak & Kapabilitas",
  rekamJejakTitle: "Perjalanan & Kapabilitas Manufaktur Kami",
  rekamJejakTitleColor: "",
  rekamJejakTitleFont: "poppins",
  rekamJejakTitleSize: 32,
  rekamJejakSubtitle:
    "Lebih dari dua dekade membuktikan dedikasi berkelanjutan dalam memajukan industri kesehatan dan obat bahan alam di Indonesia.",
  rekamJejakSubtitleColor: "",
  rekamJejakSubtitleFont: "outfit",
  rekamJejakSubtitleSize: 16,
  rekamJejakAlign: "left",

  rekamJejakCarouselTitle: "Tonggak Perjalanan CV. Indo Green Nature",
  rekamJejakCarouselTitleColor: "",
  rekamJejakCarouselTitleFont: "poppins",
  rekamJejakCarouselTitleSize: 20,

  rekamJejakYearColor: "",
  rekamJejakCardTitleColor: "",
  rekamJejakCardDescColor: "",
  rekamJejakCardBg: "",
  rekamJejakCardBorderColor: "",

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

  // Prinsip Kerja (Nilai & Komitmen Perusahaan)
  prinsipKerjaBadge: "Prinsip Kerja",
  prinsipKerjaBadgeColor: "",
  prinsipKerjaTitle: "Nilai & Komitmen CV. Indo Green Nature",
  prinsipKerjaTitleColor: "",
  prinsipKerjaTitleFont: "poppins",
  prinsipKerjaTitleSize: 32,
  prinsipKerjaDesc:
    "Integritas bisnis dan standar etika manufaktur yang selalu kami pertahankan untuk menjamin kepercayaan seluruh mitra usaha.",
  prinsipKerjaDescColor: "",
  prinsipKerjaDescFont: "outfit",
  prinsipKerjaDescSize: 15,
  prinsipKerjaAlign: "left",

  prinsipKerjaCardTitleColor: "",
  prinsipKerjaCardTitleFont: "poppins",
  prinsipKerjaCardTitleSize: 15,
  prinsipKerjaCardDescColor: "",
  prinsipKerjaCardDescFont: "outfit",
  prinsipKerjaCardDescSize: 13,
  prinsipKerjaCardBg: "",
  prinsipKerjaCardBorderColor: "",

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

  // Jangkauan Distribusi (Pasar Domestik & Internasional)
  distribusiBadge: "Jangkauan Distribusi",
  distribusiBadgeColor: "",
  distribusiTitle: "Area Layanan Pasar Domestik & Internasional",
  distribusiTitleColor: "",
  distribusiTitleFont: "poppins",
  distribusiTitleSize: 32,
  distribusiDesc:
    "Menjangkau para pemilik brand, klinik, apotek, dan distributor di seluruh pelosok Indonesia hingga siap memenuhi pesanan pasar luar negeri.",
  distribusiDescColor: "",
  distribusiDescFont: "outfit",
  distribusiDescSize: 15,
  distribusiAlign: "left",

  distribusiCardBg: "",
  distribusiCardBorderColor: "",
  distribusiTagColor: "",
  distribusiCardTitleColor: "",
  distribusiCardTitleFont: "poppins",
  distribusiCardTitleSize: 22,
  distribusiCardDescColor: "",
  distribusiCardDescFont: "outfit",
  distribusiCardDescSize: 14,

  distribusiDomestikTag: "JANGKAUAN NASIONAL",
  distribusiDomestikTitle: "Pasar Domestik (Seluruh Indonesia)",
  distribusiDomestikDesc:
    "Kami telah melayani pengiriman produk dan pendampingan maklon bagi mitra yang tersebar di 38 Provinsi di Indonesia. Rantai logistik kami terintegrasi dengan ekspedisi kargo darat, laut, dan udara untuk pengiriman tepat waktu.",
  distribusiDomestikFooter:
    "Mendukung ekspedisi kargo skala kecil, palet, hingga container penuh.",
  distribusiDomestikCities: [
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
  ],
  distribusiCityBadgeBg: "",
  distribusiCityBadgeColor: "",

  distribusiEksporTag: "JANGKAUAN EKSPOR",
  distribusiEksporTitle: "Pasar Internasional & Standar Ekspor",
  distribusiEksporDesc:
    "Dengan standar ISO 22000, CPOTB, dan sertifikasi Halal bertaraf global, CV. Indo Green Nature siap memfasilitasi kebutuhan ekspor herbal ke negara-negara tetangga dan pasar dunia.",
  distribusiEksporFooter:
    "Siap melayani kemitraan OEM/ODM bagi perusahaan dagang internasional.",
  distribusiEksporPoints: [
    "Kelengkapan Dokumen Ekspor Resmi (Certificate of Analysis / CoA, MSDS, Free Sale Certificate).",
    "Standar Pengemasan Ekspor anti-lembab & tahan goncangan jarak jauh.",
    "Fasilitasi formula herbal yang disesuaikan dengan regulasi otoritas kesehatan negara tujuan.",
    "Fokus Pasar Ekspor: Kawasan Asia Tenggara (Malaysia, Singapura, Brunei) & Timur Tengah.",
  ],

  // Legalitas & Standar Mutu Resmi
  legalitasBadge: "Sertifikasi & Legalitas",
  legalitasBadgeColor: "",
  legalitasTitle: "Jaminan Legalitas & Mutu Bersertifikasi",
  legalitasTitleColor: "",
  legalitasTitleFont: "poppins",
  legalitasTitleSize: 30,
  legalitasDesc:
    "Seluruh fasilitas produksi kami terakreditasi resmi oleh instansi pemerintah dan badan sertifikasi independen.",
  legalitasDescColor: "",
  legalitasDescFont: "outfit",
  legalitasDescSize: 15,
  legalitasAlign: "center",

  legalitasCardBg: "transparent",
  legalitasCardBorderColor: "transparent",
  legalitasCardFit: "contain",
  legalitasCardRounded: 8,
  legalitasImageScale: 65,
  legalitasEnableCarousel: true,
  legalitasAutoplay: true,
  legalitasAutoplayDelay: 2500,

  legalitasItems: [
    { imageUrl: "/images/legalitas/bpom.svg", title: "BPOM RI" },
    { imageUrl: "/images/legalitas/halal.svg", title: "HALAL INDONESIA" },
    { imageUrl: "/images/legalitas/cpotb.svg", title: "CPOTB BPOM" },
    { imageUrl: "/images/legalitas/iso22000.svg", title: "ISO 22000" },
    { imageUrl: "/images/legalitas/haccp.svg", title: "HACCP" },
  ],

  // 08. Konsultasi Brand (CTA Banner)
  ctaTitle: "Mulai Konsultasi Brand Herbal Anda Hari Ini",
  ctaTitleColor: "",
  ctaTitleFont: "poppins",
  ctaTitleSize: 28,
  ctaDesc:
    "Diskusikan rancangan formula, kemasan, estimasi biaya maklon, dan jadwal produksi bersama tim ahli CV. Indo Green Nature tanpa dipungut biaya.",
  ctaDescColor: "",
  ctaDescFont: "outfit",
  ctaDescSize: 15,
  ctaWhatsappText: "WhatsApp Kami",
  ctaWhatsappUrl: "",
  ctaSecondaryText: "Kembali ke Beranda",
  ctaSecondaryUrl: "/",
  ctaButtonFullRounded: false,
  ctaButtonBg: "",
  ctaButtonTextColor: "",
  ctaCardBg: "",
  ctaCardBorderColor: "",
}

export const ABOUT_SETTINGS_KEY = "about_us_custom_settings"
export const ABOUT_DB_CONFIG_KEY = "about_us_main"
export const ABOUT_PREVIEW_CHANNEL = "about_us_preview_channel"
