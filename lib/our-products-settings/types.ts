export interface StoreCardItem {
  id: string
  title: string
  subtitle: string
  image: string
  link: string
  badge?: string
  titleColor?: string // Warna teks judul toko (contoh: Shopee Mall)
  subtitleColor?: string // Warna teks sub-label (contoh: Official Store)
}

export interface ShopeeProductItem {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  soldCount: string // e.g. "1,2RB Terjual"
  rating: number // e.g. 4.9
  location: string // e.g. "D.I. Yogyakarta"
  image: string
  images?: string[] // Kumpulan foto galeri untuk auto slide pada pop up modal
  badge?: string // e.g. "Official Shop", "Star+", "Best Seller"
  badgeType?: "official" | "star" | "best_seller" | "new" | "deal" | "custom" | "none"
  badgeBgColor?: string
  badgeTextColor?: string
  discount?: string // e.g. "-20%", "BPOM"
  tags?: string[] // e.g. ["Cashback Xtra", "Gratis Ongkir"]
  isCashbackXtra?: boolean
  isGratisOngkir?: boolean
  shopeeUrl?: string
  tokopediaUrl?: string
  lazadaUrl?: string
  tiktokUrl?: string
  whatsappUrl?: string
  description?: string
}

export interface OurProductsSettingsData {
  // ─── Banner Header Text ───
  bannerTitle: string
  bannerTitleColor?: string
  bannerTitleFont?: string
  bannerTitleSize?: number

  bannerSubtitle: string
  bannerSubtitleColor?: string
  bannerSubtitleFont?: string
  bannerSubtitleSize?: number

  // ─── Banner Badge & Description ───
  bannerBadgeText?: string
  bannerBadgeColor?: string
  bannerBadgeBg?: string
  bannerDescription?: string
  bannerDescColor?: string
  bannerDescFont?: string
  bannerDescSize?: number

  // ─── 4 Kotak Store Kiri (177x177) ───
  storeTitleColor?: string
  storeSubtitleColor?: string
  storeCardSize?: number
  storeCards: StoreCardItem[]

  // ─── Foto Frame Kanan Auto-Slide ───
  slideImagesLeft: string[]   // Kolom kiri (Slide ke Atas)
  slideImagesRight: string[]  // Kolom kanan (Slide ke Bawah)
  slideSpeed?: number         // Kecepatan animasi dalam detik (default: 18)

  // ─── Frame Daftar Produk 6 Kolom Ala Shopee ───
  shopeeSectionTitle?: string
  shopeeSectionTitleColor?: string
  shopeeSectionTitleFont?: string
  shopeeSectionTitleSize?: number

  shopeeSectionSubtitle?: string
  shopeeSectionSubtitleColor?: string
  shopeeSectionSubtitleFont?: string
  shopeeSectionSubtitleSize?: number

  shopeeCategories?: string[]
  shopeeGridColumns?: 4 | 5 | 6
  shopeeProducts: ShopeeProductItem[]

  // ─── Order via WhatsApp Global ───
  orderWhatsappNumber?: string
  orderWhatsappMessageTemplate?: string
  orderWhatsappButtonText?: string
}

export const OUR_PRODUCTS_SETTINGS_KEY = "cv_our_products_settings_data_v1"
export const OUR_PRODUCTS_DRAFT_KEY = "cv_our_products_settings_draft_v1"
export const OUR_PRODUCTS_HAS_DRAFT_KEY = "cv_our_products_has_draft_v1"
export const OUR_PRODUCTS_DB_CONFIG_KEY = "our_products_page_config"
export const OUR_PRODUCTS_PREVIEW_CHANNEL = "cv_our_products_preview_channel"

export const DEFAULT_SHOPEE_PRODUCTS: ShopeeProductItem[] = [
  {
    id: "sp-1",
    name: "Minuman Serbuk Jahe Merah & Temulawak Premium 200g",
    category: "Minuman Serbuk",
    price: 45000,
    originalPrice: 55000,
    soldCount: "10RB+ Terjual",
    rating: 4.9,
    location: "D.I. Yogyakarta",
    image: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792475799445-79sbk9.webp",
    images: [
      "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792475799445-79sbk9.webp",
      "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/hero_banner/1792329895943-of8w8u.webp",
      "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/about_us/1792658572073-7wxq7v.webp",
      "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/solusi_maklon/1792406673549-z6me70.webp",
    ],
    badge: "Official Shop",
    discount: "-18%",
    tags: ["Cashback Xtra", "Gratis Ongkir"],
    shopeeUrl: "https://shopee.co.id",
    tokopediaUrl: "https://tokopedia.com",
    description: "Kombinasi ekstrak jahe merah murni dan temulawak organik terstandar BPOM untuk menghangatkan tubuh dan meningkatkan daya tahan tubuh."
  },
  {
    id: "sp-2",
    name: "Collagen Tripeptide 5000mg & Glutathione Glow Drink",
    category: "Collagen & Beauty",
    price: 85000,
    originalPrice: 115000,
    soldCount: "5,4RB Terjual",
    rating: 5.0,
    location: "D.I. Yogyakarta",
    image: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792476841458-tp95nu.webp",
    images: [
      "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792476841458-tp95nu.webp",
      "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/hero_banner/1792330024260-7zpazy.webp",
      "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/about_us/1792658587802-vsc1dw.webp",
      "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792475799445-79sbk9.webp",
    ],
    badge: "Star+",
    discount: "-26%",
    tags: ["Cashback Xtra", "Beauty"],
    shopeeUrl: "https://shopee.co.id",
    tokopediaUrl: "https://tokopedia.com",
    description: "Minuman kecantikan dengan hydrolyzed fish collagen tripeptide 5000mg, L-glutathione, vitamin C, dan ekstrak buah berry segar tanpa rasa amis."
  },
  {
    id: "sp-3",
    name: "Kapsul Ekstrak Meniran & Sambiloto Immune Booster BPOM",
    category: "Kapsul Herbal",
    price: 65000,
    originalPrice: 75000,
    soldCount: "3,2RB Terjual",
    rating: 4.9,
    location: "D.I. Yogyakarta",
    image: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792477079553-20t1up.webp",
    images: [
      "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792477079553-20t1up.webp",
      "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/about_us/1792658597612-9o0kzc.webp",
      "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/hero_banner/1792330129667-hsobqa.webp",
    ],
    badge: "Official Shop",
    discount: "-13%",
    tags: ["BPOM TR", "Halal"],
    shopeeUrl: "https://shopee.co.id",
    tokopediaUrl: "https://tokopedia.com",
    description: "Ekstrak meniran dan sambiloto fitofarmaka dalam kapsul halal bersertifikasi BPOM TR untuk mendukung aktivitas pertahanan sel imun tubuh."
  },
  {
    id: "sp-4",
    name: "Teh Celup Bunga Telang & Daun Kelor 20 Kantong Biodegradable",
    category: "Teh Herbal",
    price: 35000,
    originalPrice: 42000,
    soldCount: "7,8RB Terjual",
    rating: 4.9,
    location: "D.I. Yogyakarta",
    image: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/about_us/1792658572073-7wxq7v.webp",
    images: [
      "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/about_us/1792658572073-7wxq7v.webp",
      "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792478065677-xzzbqp.webp",
      "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/hero_banner/1792167095755-6fjsz7.webp",
    ],
    badge: "Best Seller",
    discount: "-16%",
    tags: ["Gratis Ongkir", "Detox"],
    shopeeUrl: "https://shopee.co.id",
    tokopediaUrl: "https://tokopedia.com",
    description: "Perpaduan bunga telang biru alami kaya antioksidan dan daun kelor organik dalam kantong teh ramah lingkungan untuk relaksasi harian."
  },
  {
    id: "sp-5",
    name: "Fiber Slimming Drink Mix Berry Psyllium Husk Prebiotik",
    category: "Minuman Serbuk",
    price: 75000,
    originalPrice: 99000,
    soldCount: "8,9RB Terjual",
    rating: 4.9,
    location: "D.I. Yogyakarta",
    image: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/hero_banner/1792329895943-of8w8u.webp",
    images: [
      "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/hero_banner/1792329895943-of8w8u.webp",
      "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792476841458-tp95nu.webp",
      "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/about_us/1792658587802-vsc1dw.webp",
    ],
    badge: "Official Shop",
    discount: "-24%",
    tags: ["Cashback Xtra", "Slimming"],
    shopeeUrl: "https://shopee.co.id",
    tokopediaUrl: "https://tokopedia.com",
    description: "Minuman serat larut tinggi dengan psyllium husk, ekstrak apel malang, inulin prebiotik, dan ekstrak garcinia cambogia untuk melancarkan pencernaan."
  },
  {
    id: "sp-6",
    name: "Minuman Serbuk Kunyit Asam Alami Segar Tradisional 250g",
    category: "Minuman Serbuk",
    price: 38000,
    originalPrice: 45000,
    soldCount: "4,1RB Terjual",
    rating: 4.8,
    location: "D.I. Yogyakarta",
    image: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/about_us/1792658587802-vsc1dw.webp",
    badge: "Star+",
    discount: "-15%",
    tags: ["Tradisional", "Alami"],
    shopeeUrl: "https://shopee.co.id",
    tokopediaUrl: "https://tokopedia.com",
    description: "Resep jamu kunyit asam warisan nusantara yang diolah higienis menjadi serbuk instan tanpa menghilangkan aroma dan khasiat alaminya."
  },
  {
    id: "sp-7",
    name: "Meal Replacement Oat Herbal Cokelat Protein Nabati 400g",
    category: "Minuman Serbuk",
    price: 95000,
    originalPrice: 120000,
    soldCount: "2,3RB Terjual",
    rating: 4.9,
    location: "D.I. Yogyakarta",
    image: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/solusi_maklon/1792406673549-z6me70.webp",
    badge: "Official Shop",
    discount: "-20%",
    tags: ["Cashback Xtra", "High Protein"],
    shopeeUrl: "https://shopee.co.id",
    tokopediaUrl: "https://tokopedia.com",
    description: "Minuman pengganti sarapan sehat berbahan gandum oat utuh, isolat protein kedelai nabati, multivitamin, dan krimer nabati rendah kalori."
  },
  {
    id: "sp-8",
    name: "Madu Murni Hutan Ekstrak Curcuma & Pegagan Nutrisi Otak",
    category: "Herbal Kesehatan",
    price: 60000,
    originalPrice: 70000,
    soldCount: "6,7RB Terjual",
    rating: 5.0,
    location: "D.I. Yogyakarta",
    image: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/about_us/1792658597612-9o0kzc.webp",
    badge: "Best Seller",
    discount: "-14%",
    tags: ["100% Murni", "Anak & Dewasa"],
    shopeeUrl: "https://shopee.co.id",
    tokopediaUrl: "https://tokopedia.com",
    description: "Madu murni alami diperkaya ekstrak temulawak dan pegagan untuk nafsu makan, daya konsentrasi, serta stamina tubuh harian."
  },
  {
    id: "sp-9",
    name: "Kapsul Ekstrak Kulit Manggis & Daun Sirsak 60 Kapsul",
    category: "Kapsul Herbal",
    price: 70000,
    originalPrice: 85000,
    soldCount: "3,5RB Terjual",
    rating: 4.9,
    location: "D.I. Yogyakarta",
    image: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/hero_banner/1792330024260-7zpazy.webp",
    badge: "Star+",
    discount: "-17%",
    tags: ["Antioksidan", "BPOM"],
    shopeeUrl: "https://shopee.co.id",
    tokopediaUrl: "https://tokopedia.com",
    description: "Sinergi ekstrak xanthone kulit manggis dan daun sirsak terstandar untuk menangkal radikal bebas dan mendukung regenerasi sel tubuh."
  },
  {
    id: "sp-10",
    name: "Teh Hijau Melati & Lemongrass Organik 25 Kantong",
    category: "Teh Herbal",
    price: 32000,
    originalPrice: 40000,
    soldCount: "4,8RB Terjual",
    rating: 4.8,
    location: "D.I. Yogyakarta",
    image: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/hero_banner/1792330129667-hsobqa.webp",
    badge: "Official Shop",
    discount: "-20%",
    tags: ["Aroma Segar", "Relaksasi"],
    shopeeUrl: "https://shopee.co.id",
    tokopediaUrl: "https://tokopedia.com",
    description: "Teh hijau pucuk pilihan berpadu dengan bunga melati segar dan serai wangi untuk sensasi relaksasi aromatik yang menenangkan."
  },
  {
    id: "sp-11",
    name: "Minuman Serbuk Matcha Latte Herbal Rendah Kalori 200g",
    category: "Minuman Serbuk",
    price: 55000,
    originalPrice: 65000,
    soldCount: "3,9RB Terjual",
    rating: 4.9,
    location: "D.I. Yogyakarta",
    image: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792478065677-xzzbqp.webp",
    badge: "Tren 2026",
    discount: "-15%",
    tags: ["Matcha Asli", "Rendah Gula"],
    shopeeUrl: "https://shopee.co.id",
    tokopediaUrl: "https://tokopedia.com",
    description: "Bubuk teh hijau Jepang matcha asli dengan susu nabati dan ekstrak herbal penambah energi, rasa lembut gurih tidak bikin enek."
  },
  {
    id: "sp-12",
    name: "Liang Teh Herbal Ekstrak Alang-Alang & Krisan Panas Dalam",
    category: "Minuman Serbuk",
    price: 42000,
    originalPrice: 50000,
    soldCount: "2,7RB Terjual",
    rating: 4.9,
    location: "D.I. Yogyakarta",
    image: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/hero_banner/1792167095755-6fjsz7.webp",
    badge: "Official Shop",
    discount: "-16%",
    tags: ["Pereda Panas", "Segar Alami"],
    shopeeUrl: "https://shopee.co.id",
    tokopediaUrl: "https://tokopedia.com",
    description: "Formulasi minuman herbal pereda panas dalam dengan ekstrak akar alang-alang, bunga krisan, dan luo han guo alami."
  }
]

export const DEFAULT_OUR_PRODUCTS_SETTINGS: OurProductsSettingsData = {
  bannerTitle: "Lebih Dari 10.000 + Produk Terjual",
  bannerTitleColor: "#15803D",
  bannerTitleFont: "poppins",
  bannerTitleSize: 48,

  bannerSubtitle: "Mulai Belanja di Official Store Kami",
  bannerSubtitleColor: "#15803D",
  bannerSubtitleFont: "poppins",
  bannerSubtitleSize: 24,

  bannerDescription: "Dapatkan produk herbal alami terstandar BPOM & Halal resmi langsung melalui toko resmi kami di marketplace terpercaya.",
  bannerDescColor: "#4B5563",
  bannerDescFont: "poppins",
  bannerDescSize: 13,

  // 4 Kotak Kartu Store (Ukuran dinamis default 125px)
  storeTitleColor: "#FFFFFF",
  storeSubtitleColor: "#6EE7B7",
  storeCardSize: 125,
  storeCards: [
    {
      id: "store-1",
      title: "Shopee Mall",
      subtitle: "Official Store",
      image: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792475799445-79sbk9.webp",
      link: "https://shopee.co.id",
      badge: "Shopee",
      titleColor: "#FFFFFF",
      subtitleColor: "#6EE7B7",
    },
    {
      id: "store-2",
      title: "Tokopedia",
      subtitle: "Official Store",
      image: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792476841458-tp95nu.webp",
      link: "https://tokopedia.com",
      badge: "Tokopedia",
      titleColor: "#FFFFFF",
      subtitleColor: "#6EE7B7",
    },
    {
      id: "store-3",
      title: "TikTok Shop",
      subtitle: "Official Store",
      image: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/hero_banner/1792329895943-of8w8u.webp",
      link: "https://tiktok.com",
      badge: "TikTok",
      titleColor: "#FFFFFF",
      subtitleColor: "#6EE7B7",
    },
    {
      id: "store-4",
      title: "Lazada Mall",
      subtitle: "Official Store",
      image: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792477079553-20t1up.webp",
      link: "https://lazada.co.id",
      badge: "Lazada",
      titleColor: "#FFFFFF",
      subtitleColor: "#6EE7B7",
    },
  ],

  // Kolom Kiri: Bergerak otomatis KE ATAS
  slideImagesLeft: [
    "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792475799445-79sbk9.webp",
    "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/hero_banner/1792329895943-of8w8u.webp",
    "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/about_us/1792658572073-7wxq7v.webp",
    "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/about_us/1792658587802-vsc1dw.webp",
    "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/solusi_maklon/1792406673549-z6me70.webp",
  ],

  // Kolom Kanan: Bergerak otomatis TURUN KE BAWAH
  slideImagesRight: [
    "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792476841458-tp95nu.webp",
    "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/hero_banner/1792330024260-7zpazy.webp",
    "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/jenis_produk/1792477079553-20t1up.webp",
    "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/about_us/1792658597612-9o0kzc.webp",
    "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/hero_banner/1792330129667-hsobqa.webp",
  ],

  slideSpeed: 18,

  // ─── Frame Daftar Produk 6 Kolom Ala Shopee ───
  shopeeSectionTitle: "DAFTAR PRODUK PILIHAN KAMI",
  shopeeSectionTitleColor: "#15803D",
  shopeeSectionTitleFont: "poppins",
  shopeeSectionTitleSize: 28,

  shopeeSectionSubtitle: "Produk herbal alami terlaris berstandar BPOM & Halal resmi siap kirim ke seluruh Indonesia.",
  shopeeSectionSubtitleColor: "#6B7280",
  shopeeSectionSubtitleFont: "poppins",
  shopeeSectionSubtitleSize: 13,
  shopeeCategories: [
    "Semua",
    "Minuman Serbuk",
    "Collagen & Beauty",
    "Kapsul Herbal",
    "Teh Herbal",
    "Herbal Kesehatan",
  ],
  shopeeGridColumns: 6,
  shopeeProducts: DEFAULT_SHOPEE_PRODUCTS,

  // ─── Order via WhatsApp Global ───
  orderWhatsappNumber: "6285877669199",
  orderWhatsappMessageTemplate: "Halo CV. Indo Green Nature, saya ingin memesan produk: {product_name} ({product_price}). Mohon info ketersediaan stok & pengiriman.",
  orderWhatsappButtonText: "Order Cepat via WhatsApp Official",
}
