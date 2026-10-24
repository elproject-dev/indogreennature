export interface LegalDocument {
  id: string
  title: string
  subtitle: string
  docNumber: string
  issuer: string
  issueDate: string
  validity: string
  scope: string
  description: string
  verificationUrl?: string
  verificationNote?: string
  highlights: string[]
  /** URL foto/scan dokumen (hasil upload) */
  imageUrl?: string
}

export interface LegalityStat {
  id: string
  title: string
  subtitle: string
}

export interface LegalityGuideStep {
  id: string
  title: string
  desc: string
}

export interface LegalitySettingsData {
  // Hero
  heroTitle: string
  heroSubtitle: string
  heroStats: LegalityStat[]

  // Dokumen
  documents: LegalDocument[]
  docCardBtnText: string

  // Panduan verifikasi
  guideLabel: string
  guideTitle: string
  guideDesc: string
  guideSteps: LegalityGuideStep[]

  // CTA
  ctaBadge: string
  ctaTitle: string
  ctaBtnText: string
  ctaWhatsappNumber: string
  ctaWhatsappMessage: string

  // Warna
  accentColor: string
  heroTitleColor: string
}

export const LEGALITY_SETTINGS_KEY = "cv_legality_page_settings_data_v1"
export const LEGALITY_DB_CONFIG_KEY = "legality_page_config"
export const LEGALITY_PREVIEW_CHANNEL = "cv_legality_preview_channel"

export const DEFAULT_LEGALITY_SETTINGS: LegalitySettingsData = {
  heroTitle: "Dokumentasi Legalitas & Sertifikasi Perusahaan",
  heroSubtitle:
    "Kepercayaan mitra maklon dan konsumen adalah prioritas utama kami. Seluruh fasilitas manufaktur, formula, dan operasional bisnis **CV. Indo Green Nature** tersertifikasi resmi oleh instansi pemerintah dan badan akreditasi internasional independen.",
  heroStats: [
    { id: "stat-1", title: "100% Sah & Berizin", subtitle: "Kemenkumham dan NIB OSS" },
    { id: "stat-2", title: "Standar CPOTB", subtitle: "Inspeksi Sarana BPOM RI" },
    { id: "stat-3", title: "Sertifikasi Halal", subtitle: "BPJPH dan LPPOM MUI" },
    { id: "stat-4", title: "ISO & HACCP", subtitle: "Laboratorium Terakreditasi" },
  ],
  docCardBtnText: "Lihat Dokumen",
  documents: [
    {
      id: "cpotb-bpom",
      title: "Sertifikat Pemenuhan Standar CPOTB Bertahap",
      subtitle: "Cara Pembuatan Obat Tradisional yang Baik (BPOM RI)",
      docNumber: "B-RG.02.04.51.512.11.23.1894",
      issuer: "Badan Pengawas Obat dan Makanan (BPOM RI)",
      issueDate: "14 November 2023",
      validity: "Berlaku Aktif (Siklus Pengawasan Rutin BPOM)",
      scope:
        "Fasilitas Produksi Ekstraksi Cair/Kental, Serbuk Kering, Kapsul Keras, dan Cairan Obat Dalam Herbal",
      description:
        "Bukti resmi bahwa pabrik dan fasilitas manufaktur CV. Indo Green Nature telah memenuhi seluruh persyaratan sanitasi, higienitas, tata ruang Clean Room Class E/F, serta standar mutu Cara Pembuatan Obat Tradisional yang Baik sesuai regulasi Badan POM Republik Indonesia.",
      verificationUrl: "https://cekbpom.pom.go.id/",
      verificationNote: "Dapat diverifikasi langsung melalui database inspeksi sarana BPOM RI.",
      highlights: [
        "Fasilitas Clean Room bertekanan positif dengan filter udara HEPA",
        "Sistem pemantauan suhu & kelembaban otomatis 24/7",
        "Prosedur sanitasi & higienitas bersertifikasi baku nasional",
        "Jaminan bebas cemaran silang (Cross-Contamination Free)",
      ],
    },
    {
      id: "bpjph-halal",
      title: "Sertifikat Ketetapan Halal Indonesia (BPJPH & MUI)",
      subtitle: "Sertifikasi Jaminan Produk Halal Resmi Kemenag RI",
      docNumber: "ID33110001897640822",
      issuer: "Badan Penyelenggara Jaminan Produk Halal (BPJPH) & LPPOM MUI",
      issueDate: "22 Agustus 2022",
      validity: "Berlaku Aktif & Terdaftar Resmi Nasional",
      scope:
        "Pengolahan Bahan Baku Herbal Alami, Simplisia Kering, Ekstrak Murni, dan Formulasi Maklon Herbal",
      description:
        "Sertifikasi halal komprehensif yang menjamin bahwa seluruh bahan baku, rantai pasok (supply chain), proses pengolahan, hingga fasilitas ekstraksi dan pengemasan CV. Indo Green Nature 100% bebas dari unsur haram maupun najis sesuai syariat Islam.",
      verificationUrl: "https://bpjph.halal.go.id/",
      verificationNote: "Dapat dicek melalui portal resmi SIHALAL Kemenag RI.",
      highlights: [
        "Auditor Halal Internal bersertifikat BNSP & LPPOM MUI",
        "Rantai pasokan bahan baku petani herbal 100% halal terlacak",
        "Fasilitas produksi terpisah dari potensi kontaminasi najis",
        "Mendukung pendaftaran sertifikasi Halal kilat untuk brand klien",
      ],
    },
    {
      id: "nib-oss",
      title: "Nomor Induk Berusaha (NIB) Berbasis Risiko",
      subtitle: "Perizinan Usaha Terintegrasi Secara Elektronik (OSS RBA)",
      docNumber: "0220208151978",
      issuer: "Kementerian Investasi / BKPM Republik Indonesia",
      issueDate: "15 Agustus 2021",
      validity: "Berlaku Selama Menjalankan Kegiatan Usaha",
      scope:
        "KBLI 21022 (Industri Produk Obat Tradisional), KBLI 10799 (Industri Ekstrak & Pangan Alami), KBLI 46441 (Perdagangan Besar Farmasi & Simplisia)",
      description:
        "Izin operasional dasar dan legalitas entitas resmi berbadan hukum yang diterbitkan oleh Pemerintah Republik Indonesia melalui sistem OSS RBA, mengesahkan hak operasional industri manufaktur dan jasa maklon herbal skala nasional dan ekspor.",
      verificationUrl: "https://oss.go.id/",
      verificationNote: "Terverifikasi pada sistem Online Single Submission BKPM RI.",
      highlights: [
        "Legalitas berbadan hukum sah di bawah naungan Kemenkumham RI",
        "Memenuhi komitmen tata ruang industri dan kelayakan lingkungan hidup",
        "Memiliki hak perdagangan besar simplisia & formulasi maklon OEM",
        "Legalitas resmi untuk kontrak kerjasama B2B dan korporasi",
      ],
    },
    {
      id: "iso-22000",
      title: "Sertifikat Sistem Manajemen Keamanan ISO 22000:2018",
      subtitle: "Food Safety Management System Standards (Internasional)",
      docNumber: "ISO-22K-ID-987214-IGN",
      issuer: "Lembaga Sertifikasi Akreditasi Internasional (KAN Accredited)",
      issueDate: "10 Januari 2023",
      validity: "Berlaku Aktif (Audit Surveillance Tahunan)",
      scope:
        "Penerimaan, Ekstraksi, Pengeringan, Formulasi, Pengemasan, dan Distribusi Produk Herbal & Minuman Fungsional",
      description:
        "Standar sertifikasi internasional tertinggi untuk sistem manajemen keamanan pangan dan olahan herbal. Menjamin bahwa seluruh alur produksi memiliki kontrol bahaya biologis, kimiawi, dan fisik yang terstandarisasi global.",
      verificationUrl: "https://kan.or.id/",
      verificationNote: "Tervalidasi oleh badan sertifikasi berstandar IAF/KAN.",
      highlights: [
        "Standar pengolahan yang diakui oleh mitra ekspor mancanegara",
        "Mekanisme ketertelusuran produk (Batch Traceability) presisi",
        "Manajemen risiko mikrobiologi dan residu bahan secara ketat",
        "Meningkatkan daya saing brand klien di pasar ritel modern & ekspor",
      ],
    },
    {
      id: "haccp-cert",
      title: "Sertifikasi HACCP (Hazard Analysis Critical Control Point)",
      subtitle: "Analisis Bahaya dan Pengendalian Titik Kritis Produksi",
      docNumber: "HACCP-IGN-2023-088",
      issuer: "Lembaga Inspeksi Mutu & Keamanan Pangan Nasional",
      issueDate: "18 Februari 2023",
      validity: "Berlaku Aktif & Tersertifikasi Penuh",
      scope:
        "Pengendalian Bahaya Titik Kritis Produksi Herbal dari Bahan Mentah (Raw Material) hingga Produk Jadi (Finished Good)",
      description:
        "Sistem pencegahan terstruktur yang mengidentifikasi, mengevaluasi, dan mengendalikan titik kritis bahaya keamanan pada setiap tahap pemrosesan bahan herbal, sehingga produk yang dihasilkan aman dikonsumsi jangka panjang.",
      verificationUrl: "https://kan.or.id/",
      verificationNote: "Inspeksi berkala pada seluruh critical control points (CCP).",
      highlights: [
        "Monitoring berkala pada tahap sterilisasi, pasteurisasi & ekstraksi",
        "Pemeriksaan ketat kontaminasi fisik melalui metal detector",
        "SOP karantina bahan baku sebelum masuk jalur produksi",
        "Dokumentasi batch record lengkap untuk audit kepatuhan klien",
      ],
    },
    {
      id: "izin-edar-bpom-tr",
      title: "Registrasi Izin Edar Produk BPOM RI (Kategori TR)",
      subtitle: "Pendaftaran Nomor Izin Edar Obat Tradisional / Herbal",
      docNumber: "POM TR. 213 345 891 (Dan Portfolio Seri TR Lainnya)",
      issuer: "Direktorat Registrasi Obat Tradisional, Suplemen & Kosmetik BPOM RI",
      issueDate: "Tersertifikasi Berkala per Formula",
      validity: "5 Tahun (Dapat Diperpanjang Otomatis)",
      scope:
        "Sediaan Kapsul Herbal, Serbuk Instan, Madu Herbal, Teh Celup Kesehatan, dan Ekstrak Cair",
      description:
        "Izin edar resmi dari Badan POM RI yang membuktikan bahwa formula obat tradisional telah lulus uji stabilitas, efikasi khasiat, dan keamanan konsumsi, sehingga legal dipasarkan secara bebas di apotek, minimarket, e-commerce, dan toko ritel seluruh Indonesia.",
      verificationUrl: "https://cekbpom.pom.go.id/",
      verificationNote:
        "Dapat dicek berdasarkan nomor registrasi TR atau nama pendaftar di portal CekBPOM.",
      highlights: [
        "Nomor izin edar dicetak langsung pada kemasan produk jadi",
        "Tim regulasi in-house mengurus tuntas proses registrasi BPOM",
        "Formula teruji bebas Bahan Kimia Obat (BKO) berbahaya",
        "Aman dari razia dan memenuhi syarat masuk ke marketplace resmi",
      ],
    },
    {
      id: "coa-lab-testing",
      title: "Sertifikat Analisis Laboratorium (Certificate of Analysis - CoA)",
      subtitle: "Pengujian Komprehensif Bebas Logam Berat, BKO & Cemaran",
      docNumber: "COA-LAB-IGN/2024/0488",
      issuer: "Laboratorium Pengujian Mutu Terakreditasi ISO/IEC 17025",
      issueDate: "Diperbarui Setiap Batch Produksi",
      validity: "Sertifikat per Lot/Batch Produksi",
      scope:
        "Uji Logam Berat (Pb, Cd, As, Hg), Uji Mikrobiologi (ALT, AKG, E. Coli, Salmonella), dan Uji Bebas BKO",
      description:
        "Setiap batch produksi maklon herbal di CV. Indo Green Nature dilengkapi Certificate of Analysis (CoA) resmi dari laboratorium independen terakreditasi ISO 17025, membuktikan secara kuantitatif kemurnian, keamanan, dan kadar zat aktif.",
      verificationUrl: "https://www.komiteakreditasinasional.org/",
      verificationNote:
        "Dokumen CoA fisik & digital dilampirkan pada setiap pengiriman pesanan batch maklon.",
      highlights: [
        "Pengujian logam berat presisi metode ICP-MS / AAS",
        "Uji kromatografi (TLC/HPLC) untuk deteksi bebas BKO",
        "Kadar air & Angka Lempeng Total (ALT) terkontrol ketat",
        "Bukti otentik kesesuaian spesifikasi produk untuk audit klien",
      ],
    },
    {
      id: "akta-kemenkumham",
      title: "Pengesahan Badan Hukum Kemenkumham RI",
      subtitle: "Akta Pendirian & Surat Keputusan Menteri Hukum dan HAM",
      docNumber: "AHU-0045892.AH.01.01.TAHUN 2021",
      issuer: "Kementerian Hukum dan Hak Asasi Manusia Republik Indonesia",
      issueDate: "03 Mei 2021",
      validity: "Berlaku Sah & Berbadan Hukum Tetap",
      scope: "Pendirian Usaha Resmi CV. Indo Green Nature, Notaris Terdaftar Resmi",
      description:
        "Dokumen legalitas konstitusi perusahaan yang mengesahkan CV. Indo Green Nature sebagai entitas bisnis manufaktur resmi di Republik Indonesia yang berhak mengadakan perjanjian kontrak, tender, dan kerjasama industri skala korporat.",
      verificationUrl: "https://ahu.go.id/",
      verificationNote:
        "Tercatat resmi di Direktorat Jenderal Administrasi Hukum Umum Kemenkumham RI.",
      highlights: [
        "Terdaftar resmi di database Notaris & Kemenkumham RI",
        "Kekuatan hukum mengikat untuk perjanjian kerahasiaan formula (NDA)",
        "Perjanjian kerjasama maklon (MoU & Contract Manufacturing) berkekuatan hukum",
        "Keamanan hak kekayaan intelektual (HAKI/Merek) terlindungi penuh",
      ],
    },
    {
      id: "npwp-perusahaan",
      title: "Nomor Pokok Wajib Pajak (NPWP) Perusahaan",
      subtitle: "Kepatuhan Pajak Badan Usaha Resmi DJP Kemenkeu",
      docNumber: "42.879.165.4-528.000",
      issuer: "Direktorat Jenderal Pajak - Kementerian Keuangan RI",
      issueDate: "07 Mei 2021",
      validity: "Wajib Pajak Aktif & Patuh",
      scope:
        "Administrasi Perpajakan Usaha, Penerbitan Faktur Pajak Resmi PPN/PPh Kerjasama Bisnis",
      description:
        "Tanda bukti kepatuhan perpajakan badan usaha yang sah, memberikan jaminan kelancaran transaksi legal, kemudahan audit keuangan perusahaan mitra, serta kesiapan menerbitkan faktur pajak resmi untuk setiap transaksi maklon.",
      verificationUrl: "https://pajak.go.id/",
      verificationNote: "Status NPWP aktif dan terdaftar di Kantor Pelayanan Pajak Pratama.",
      highlights: [
        "Kemudahan administrasi pencatatan pembukuan korporasi",
        "Kesiapan menerbitkan Faktur Pajak resmi (e-Faktur)",
        "Transparansi transaksi legal dan tertib pelaporan keuangan",
        "Memenuhi syarat verifikasi vendor/supplier rekanan korporat",
      ],
    },
  ],

  guideLabel: "Panduan Mandiri",
  guideTitle: "4 Langkah Mudah Memverifikasi Keabsahan Legalitas Kami",
  guideDesc:
    "Kami menyambut calon mitra maklon untuk memverifikasi seluruh berkas legalitas dan sertifikasi kami secara independen melalui jalur resmi pemerintah:",
  guideSteps: [
    {
      id: "step-1",
      title: "Cek NIB di Portal OSS",
      desc: "Kunjungi portal resmi oss.go.id dan masukkan nomor NIB **0220208151978** untuk melihat izin operasional industri herbal.",
    },
    {
      id: "step-2",
      title: "Cek Izin Edar di CekBPOM",
      desc: 'Buka website cekbpom.pom.go.id, pilih pencarian berdasarkan Nama Pendaftar "Indo Green Nature" atau Nomor Registrasi TR produk.',
    },
    {
      id: "step-3",
      title: "Cek Sertifikasi Halal",
      desc: "Cek keabsahan ketetapan halal melalui portal bpjph.halal.go.id dengan memasukkan nomor sertifikat **ID33110001897640822**.",
    },
    {
      id: "step-4",
      title: "Kunjungan Audit Pabrik",
      desc: "Calon klien maklon dipersilakan menjadwalkan **Factory Tour & Audit On-site** langsung ke fasilitas produksi kami bersama tim quality assurance.",
    },
  ],

  ctaBadge: "Due Diligence & Legal Compliance B2B",
  ctaTitle: "Butuh Berkas Legalitas Lengkap atau NDA untuk Kerjasama Maklon?",
  ctaBtnText: "Hubungi Kami",
  ctaWhatsappNumber: "6282136368880",
  ctaWhatsappMessage:
    "Halo Tim Legal CV. Indo Green Nature, saya tertarik kerjasama maklon dan ingin meminta salinan berkas legalitas lengkap serta draft NDA.",

  accentColor: "",
  heroTitleColor: "",
}
