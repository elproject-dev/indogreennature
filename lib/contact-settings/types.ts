export interface ContactFaqItem {
  id: string
  question: string
  answer: string
}

export interface ContactServiceCard {
  id: string
  iconType: "handshake" | "package" | "leaf"
  title: string
  desc: string
  points: string[]
  btnText: string
  waText: string
}

export interface ContactSettingsData {
  // ─── 01. Hero Banner ───
  bannerTitle: string
  bannerTitleColor?: string
  bannerTitleFont?: string
  bannerTitleSize?: number

  bannerDesc: string
  bannerDescColor?: string
  bannerDescFont?: string
  bannerDescSize?: number

  bannerLogo: string
  bannerLogoScale?: number
  bannerGap?: number

  bannerBtn1Text?: string
  bannerBtn1Link?: string
  bannerBtn1BgColor?: string
  bannerBtn1TextColor?: string

  bannerBtn2Text?: string
  bannerBtn2Link?: string
  bannerBtn2BgColor?: string
  bannerBtn2TextColor?: string

  // ─── 02. Informasi Kontak Langsung ───
  kontakSectionTitle?: string
  kontakSectionSubtitle?: string

  whatsappNumber: string
  whatsappDisplay: string
  whatsappSubtitle?: string

  whatsappBisnisNumber: string
  whatsappBisnisDisplay: string
  whatsappBisnisSubtitle?: string

  emailBisnis: string
  emailSubtitle?: string

  lokasiKota: string
  lokasiProvinsi: string

  alamatPabrik: string
  mapsUrl: string

  jamOperasional: string
  jamSabtu: string

  // ─── 03. Form Kirim Pesan ───
  formTitle?: string
  formSubtitle?: string
  formReceiverEmail: string
  formFootnote?: string

  // ─── 04. Alamat & Maps Embed ───
  mapsTitle?: string
  mapsSubtitle?: string
  mapsEmbedUrl: string

  // ─── 05. Layanan Kemitraan & Maklon ───
  layananSectionTitle?: string
  layananSectionSubtitle?: string
  serviceCards: ContactServiceCard[]

  // ─── 06. FAQ ───
  faqTitle?: string
  faqSubtitle?: string
  faqItems: ContactFaqItem[]

  faqCtaTitle?: string
  faqCtaSubtitle?: string
  faqCtaBtnText?: string
  faqCtaWaText?: string
}

export const CONTACT_SETTINGS_KEY = "cv_contact_page_settings_data_v1"
export const CONTACT_DB_CONFIG_KEY = "contact_page_config"
export const CONTACT_PREVIEW_CHANNEL = "contact_page_preview_sync"

export const DEFAULT_CONTACT_SETTINGS: ContactSettingsData = {
  // Banner
  bannerTitle: "Hubungi Kami & Mulai Kerjasama",
  bannerTitleColor: "",
  bannerTitleFont: "poppins",
  bannerTitleSize: 48,

  bannerDesc:
    "Tim kami siap membantu kebutuhan Anda — dari konsultasi produk herbal, permintaan maklon, hingga program kemitraan bisnis jangka panjang bersama CV. **Indo Green Nature**.",
  bannerDescColor: "",
  bannerDescFont: "poppins",
  bannerDescSize: 15,

  bannerLogo: "/logo.png",
  bannerLogoScale: 100,
  bannerGap: 20,

  bannerBtn1Text: "WhatsApp Bisnis",
  bannerBtn1Link: "",
  bannerBtn1BgColor: "",
  bannerBtn1TextColor: "",

  bannerBtn2Text: "Kirim Pesan",
  bannerBtn2Link: "#form-email",
  bannerBtn2BgColor: "",
  bannerBtn2TextColor: "",

  // Kontak Langsung
  kontakSectionTitle: "Informasi Kontak Langsung",
  kontakSectionSubtitle: "Pilih metode komunikasi yang paling mudah bagi Anda.",

  whatsappNumber: "6285877669199",
  whatsappDisplay: "+62 858-7766-9199",
  whatsappSubtitle: "Pertanyaan & Info Produk",

  whatsappBisnisNumber: "6282136368880",
  whatsappBisnisDisplay: "+62 821-3636-8880",
  whatsappBisnisSubtitle: "Kemitraan & Maklon",

  emailBisnis: "marketing@indogreennature.com",
  emailSubtitle: "Proposal & Dokumen Resmi",

  lokasiKota: "Wates, Kulon Progo",
  lokasiProvinsi: "D.I. Yogyakarta",

  alamatPabrik: "Jl. Wahid Hasyim No. 123, Wates, Kulon Progo, D.I. Yogyakarta 55651",
  mapsUrl: "https://maps.app.goo.gl/KWv4Axdh4eYWpnE6A",

  jamOperasional: "Senin – Jumat: 08.00 – 17.00 WIB",
  jamSabtu: "Sabtu: 08.00 – 13.00 WIB",

  // Form
  formTitle: "Kirim Pesan ke Kami",
  formSubtitle: "Isi formulir di bawah dan tim kami akan segera menghubungi Anda.",
  formReceiverEmail: "marketing@indogreennature.com",
  formFootnote: "Pesan akan diarahkan ke email resmi marketing@indogreennature.com. Respon dalam 1×24 jam kerja.",

  // Maps
  mapsTitle: "Alamat & Lokasi",
  mapsSubtitle: "Kunjungi fasilitas produksi kami langsung di Wates, Kulon Progo.",
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.0519183492723!2d110.160808!3d-7.8361807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7afb0026c9ca95%3A0xc9b260e0de743d6b!2sCV.%20Indo%20Green%20Nature!5e0!3m2!1sid!2sid!4v1729600000000!5m2!1sid!2sid",

  // Layanan Kemitraan (3 Kartu)
  layananSectionTitle: "Layanan Kemitraan & Maklon",
  layananSectionSubtitle:
    "Kami menyediakan solusi terpadu untuk kebutuhan kemitraan bisnis dan produksi maklon herbal Anda.",
  serviceCards: [
    {
      id: "card-1",
      iconType: "handshake",
      title: "Program Kemitraan Bisnis",
      desc: "Bergabung sebagai mitra distribusi dan retail. Dapatkan harga khusus, materi promosi eksklusif, dan dukungan penuh tim sales kami.",
      points: ["Harga grosir distributor", "Program reward mitra", "Dukungan marketing"],
      btnText: "Daftar Kemitraan",
      waText: "Halo, saya tertarik dengan program kemitraan bisnis CV. Indo Green Nature. Mohon informasinya.",
    },
    {
      id: "card-2",
      iconType: "package",
      title: "Layanan Maklon / OEM Herbal",
      desc: "Wujudkan produk herbal impian Anda dengan label sendiri. Kami handle formulasi, produksi, perizinan BPOM, hingga pengemasan siap jual.",
      points: ["Sertifikasi CPOTB & Halal", "Private label & OEM", "Konsultasi formula gratis"],
      btnText: "Mulai Maklon",
      waText: "Halo, saya tertarik dengan layanan maklon/OEM herbal CV. Indo Green Nature. Mohon informasi lebih lanjut.",
    },
    {
      id: "card-3",
      iconType: "leaf",
      title: "Pengadaan Bahan Baku Herbal",
      desc: "Pasokan simplisia dan ekstrak herbal alami berkualitas untuk kebutuhan industri farmasi, makanan, dan minuman dalam skala besar.",
      points: ["100% Simplisia & Ekstrak Murni", "Uji Mutu Laboratorium", "Pasokan Kontinu Skala Besar"],
      btnText: "Konsultasi Suplai",
      waText: "Halo, saya tertarik dengan layanan pengadaan bahan baku/ekstrak herbal CV. Indo Green Nature. Mohon informasi lebih lanjut.",
    },
  ],

  // FAQ
  faqTitle: "Pertanyaan yang Sering Diajukan",
  faqSubtitle: "Temukan jawaban cepat untuk pertanyaan umum seputar layanan kami.",
  faqItems: [
    {
      id: "faq-1",
      question: "Berapa minimum order untuk layanan maklon herbal?",
      answer:
        "Minimum order untuk layanan maklon herbal kami dimulai dari 1.000 pcs per varian produk. Namun untuk konsultasi lebih lanjut mengenai skala produksi yang sesuai kebutuhan brand Anda, silakan hubungi tim kami.",
    },
    {
      id: "faq-2",
      question: "Berapa lama proses produksi maklon dari awal hingga produk jadi?",
      answer:
        "Rata-rata waktu produksi maklon adalah 30–60 hari kerja, tergantung jenis produk, kompleksitas formula, dan ketersediaan bahan baku. Proses ini meliputi konsultasi formula, uji lab, persetujuan, produksi, hingga pengemasan.",
    },
    {
      id: "faq-3",
      question: "Apakah CV. Indo Green Nature memiliki sertifikasi resmi?",
      answer:
        "Ya, kami telah mengantongi Izin UKOT dari BPOM, Sertifikat CPOTB, Sertifikasi Halal dari BPJPH, dan ISO 22000. Semua dokumen legalitas dapat kami sertakan dalam proses kemitraan.",
    },
    {
      id: "faq-4",
      question: "Apakah bisa menggunakan label/brand sendiri (private label)?",
      answer:
        "Tentu! Kami menyediakan layanan private label & OEM sepenuhnya. Anda dapat menggunakan merek, desain kemasan, dan identitas brand Anda sendiri. Tim desainer kami siap membantu pengembangan kemasan.",
    },
    {
      id: "faq-5",
      question: "Wilayah mana saja yang sudah dilayani untuk distribusi?",
      answer:
        "Produk kami telah didistribusikan ke seluruh wilayah Indonesia dan sudah mulai merambah pasar ekspor. Untuk informasi lebih detail mengenai area distribusi dan ketersediaan produk di daerah Anda, hubungi tim sales kami.",
    },
    {
      id: "faq-6",
      question: "Bagaimana cara memulai kemitraan dengan CV. Indo Green Nature?",
      answer:
        "Mudah! Cukup hubungi kami melalui form kontak, WhatsApp Bisnis, atau email. Tim kami akan menghubungi Anda dalam 1×24 jam untuk menjadwalkan sesi konsultasi gratis dan presentasi portofolio produk.",
    },
  ],

  faqCtaTitle: "Tidak menemukan jawaban yang Anda cari?",
  faqCtaSubtitle: "Tim kami siap menjawab pertanyaan Anda secara langsung.",
  faqCtaBtnText: "Tanya Langsung",
  faqCtaWaText: "Halo CV. Indo Green Nature, saya ingin berkonsultasi mengenai pertanyaan seputar layanan Anda.",
}
