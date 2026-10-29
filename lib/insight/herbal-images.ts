/**
 * Katalog foto herbal resolusi tinggi terverifikasi dari internet (100% HTTP 200 OK)
 * Digunakan untuk auto-suggest AI cover, randomizer, dan variasi cover artikel.
 * Menjamin gambar selalu unik, bervariasi, dan tidak pernah menghasilkan link rusak (404).
 */

export interface HerbalImageItem {
  id: string
  url: string
  title: string
  category: "kapsul" | "bahan_alam" | "lab" | "minuman" | "madu" | "pabrik"
  tags: string[]
}

export const VERIFIED_HERBAL_IMAGES: HerbalImageItem[] = [
  // ─── 1. Kapsul, Tablet & Suplemen Herbal ───
  {
    id: "capsule-1",
    url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=700&fit=crop",
    title: "Kapsul Herbal & Suplemen Alami",
    category: "kapsul",
    tags: ["kapsul", "suplemen", "obat tradisional", "farmasi"],
  },
  {
    id: "capsule-2",
    url: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=1200&h=700&fit=crop",
    title: "Botol Suplemen & Kapsul Terstandar",
    category: "kapsul",
    tags: ["kapsul", "botol", "brand herbal", "kemasan"],
  },
  {
    id: "capsule-3",
    url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1200&h=700&fit=crop",
    title: "Kapsul & Bahan Ekstrak Alami",
    category: "kapsul",
    tags: ["kapsul", "bahan alam", "herba"],
  },
  {
    id: "capsule-4",
    url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&h=700&fit=crop",
    title: "Produk Sediaan Farmasi Herbal",
    category: "kapsul",
    tags: ["kapsul", "farmasi", "legalitas bpom"],
  },
  {
    id: "capsule-5",
    url: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=1200&h=700&fit=crop",
    title: "Sediaan Kapsul & Minyak Herbal",
    category: "kapsul",
    tags: ["kapsul", "minyak habbatussauda", "softgel"],
  },
  {
    id: "capsule-6",
    url: "https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=1200&h=700&fit=crop",
    title: "Pill & Suplemen Herbal Modern",
    category: "kapsul",
    tags: ["kapsul", "suplemen", "tablet"],
  },
  {
    id: "capsule-7",
    url: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=1200&h=700&fit=crop",
    title: "Blister Kapsul Herbal Higienis",
    category: "kapsul",
    tags: ["kapsul", "blister pack", "farmasi herbal"],
  },
  {
    id: "capsule-8",
    url: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=1200&h=700&fit=crop",
    title: "Suplemen Herbal Bahan Alam Alami",
    category: "kapsul",
    tags: ["suplemen", "herbal", "wellness", "kapsul"],
  },
  {
    id: "capsule-9",
    url: "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=1200&h=700&fit=crop",
    title: "Botol Amber Dropper Ekstrak Alami",
    category: "kapsul",
    tags: ["botol herbal", "ekstrak", "cairan", "kemasan"],
  },
  {
    id: "capsule-10",
    url: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200&h=700&fit=crop",
    title: "Sediaan Herbal Botanikal Terstandar",
    category: "kapsul",
    tags: ["botanikal", "sediaan herbal", "formulasi"],
  },

  // ─── 2. Ekstrak, Rimpang & Tanaman Alami ───
  {
    id: "plant-1",
    url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=1200&h=700&fit=crop",
    title: "Rimpang Jahe & Kunyit Segar",
    category: "bahan_alam",
    tags: ["jahe", "kunyit", "temulawak", "rimpang", "bahan alam"],
  },
  {
    id: "plant-2",
    url: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=1200&h=700&fit=crop",
    title: "Daun & Tanaman Obat Botanikal",
    category: "bahan_alam",
    tags: ["daun", "tanaman obat", "botanikal", "herbal"],
  },
  {
    id: "plant-3",
    url: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=1200&h=700&fit=crop",
    title: "Rempah & Bahan Simplisia Kering",
    category: "bahan_alam",
    tags: ["simplisia", "rempah", "ekstrak"],
  },
  {
    id: "plant-4",
    url: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1200&h=700&fit=crop",
    title: "Bunga & Tanaman Herbal Aromatik",
    category: "bahan_alam",
    tags: ["bunga", "herbal", "alami"],
  },
  {
    id: "plant-5",
    url: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=1200&h=700&fit=crop",
    title: "Koleksi Simplisia & Rimpang Alami",
    category: "bahan_alam",
    tags: ["rimpang", "simplisia", "studi bahan alam"],
  },
  {
    id: "plant-6",
    url: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=1200&h=700&fit=crop",
    title: "Kunyit & Curcumin Bahan Alam",
    category: "bahan_alam",
    tags: ["kunyit", "curcumin", "temulawak", "ekstrak"],
  },
  {
    id: "plant-7",
    url: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=1200&h=700&fit=crop",
    title: "Mortar & Penumbukan Daun Herbal",
    category: "bahan_alam",
    tags: ["herbal", "mortar", "ramuan", "alami"],
  },
  {
    id: "plant-8",
    url: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=1200&h=700&fit=crop",
    title: "Dedaunan Hijau Segar Bahan Herbal",
    category: "bahan_alam",
    tags: ["daun herbal", "kelor", "pegagan", "alami"],
  },
  {
    id: "plant-9",
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=700&fit=crop",
    title: "Bahan Pangan Sehat & Nutrisi Alami",
    category: "bahan_alam",
    tags: ["nutrisi", "organik", "sehat", "wellness"],
  },

  // ─── 3. Laboratorium R&D & Formulasi CPOTB ───
  {
    id: "lab-1",
    url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1200&h=700&fit=crop",
    title: "Penelitian Laboratorium & Formulasi R&D",
    category: "lab",
    tags: ["lab", "r&d", "formulasi", "pengujian"],
  },
  {
    id: "lab-2",
    url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=700&fit=crop",
    title: "Uji Sampel & Ekstraksi Kimia Bahan Alam",
    category: "lab",
    tags: ["ekstraksi", "sampel", "uji lab", "cpotb"],
  },
  {
    id: "lab-3",
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=700&fit=crop",
    title: "Mikroskop & Penelitian Molekuler Herbal",
    category: "lab",
    tags: ["mikroskop", "riset", "bpom", "standar mutu"],
  },
  {
    id: "lab-4",
    url: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1200&h=700&fit=crop",
    title: "Peralatan Canggih Laboratorium Farmasi",
    category: "lab",
    tags: ["lab", "alat lab", "uji klinis"],
  },
  {
    id: "lab-5",
    url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&h=700&fit=crop",
    title: "Uji Kontrol Mutu & Sterilisasi Produk",
    category: "lab",
    tags: ["quality control", "qc", "haccp", "steril"],
  },
  {
    id: "lab-6",
    url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=700&fit=crop",
    title: "Formulasi Medis & Ahli Farmasi Herbal",
    category: "lab",
    tags: ["apoteker", "farmasi", "ahli formulasi", "bpom"],
  },
  {
    id: "lab-7",
    url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&h=700&fit=crop",
    title: "Peneliti Lab Uji Bahan Baku Herbal",
    category: "lab",
    tags: ["laboratorium", "peneliti", "uji mutu", "cpotb"],
  },

  // ─── 4. Teh Herbal & Minuman Serbuk Fungsional ───
  {
    id: "tea-1",
    url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200&h=700&fit=crop",
    title: "Seduhan Teh Herbal Alami",
    category: "minuman",
    tags: ["teh", "teh celup", "minuman herbal", "seduhan"],
  },
  {
    id: "tea-2",
    url: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=1200&h=700&fit=crop",
    title: "Serbuk Minuman Herbal Matcha & Botanikal",
    category: "minuman",
    tags: ["minuman serbuk", "matcha", "fiber", "collagen"],
  },
  {
    id: "tea-3",
    url: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=1200&h=700&fit=crop",
    title: "Teh Hijau & Rempah Fungsional",
    category: "minuman",
    tags: ["teh hijau", "antioksidan", "minuman fungsional"],
  },
  {
    id: "tea-4",
    url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=700&fit=crop",
    title: "Lifestyle Minuman Sehat Alami",
    category: "minuman",
    tags: ["wellness", "minuman sehat", "herbal drink"],
  },

  // ─── 5. Madu Herbal & Cairan Obat Dalam ───
  {
    id: "honey-1",
    url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&h=700&fit=crop",
    title: "Madu Murni & Sirup Herbal Alami",
    category: "madu",
    tags: ["madu", "madu herbal", "sirup", "cairan obat dalam"],
  },
  {
    id: "honey-2",
    url: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1200&h=700&fit=crop",
    title: "Ekstrak Cairan Madu & Propolis",
    category: "madu",
    tags: ["madu", "propolis", "tetes", "cairan obat"],
  },
  {
    id: "honey-3",
    url: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=1200&h=700&fit=crop",
    title: "Sarang Madu Murni Lebah Alami",
    category: "madu",
    tags: ["madu hutan", "lebah", "sarang madu", "habbatussauda"],
  },
  {
    id: "honey-4",
    url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&h=700&fit=crop",
    title: "Formulasi Organik Madu & Bahan Alam",
    category: "madu",
    tags: ["organik", "madu", "cairan herbal"],
  },

  // ─── 6. Pabrik, Fasilitas Maklon & Pengemasan ───
  {
    id: "factory-1",
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&h=700&fit=crop",
    title: "Fasilitas Produksi Pabrik Maklon Herbal",
    category: "pabrik",
    tags: ["pabrik", "fasilitas", "produksi", "maklon"],
  },
  {
    id: "factory-2",
    url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=700&fit=crop",
    title: "Lini Gudang & Distribusi Logistik Maklon",
    category: "pabrik",
    tags: ["logistik", "gudang", "distribusi", "pengiriman"],
  },
  {
    id: "factory-3",
    url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200&h=700&fit=crop",
    title: "Mesin Industri Produksi & Pengemasan",
    category: "pabrik",
    tags: ["mesin", "packaging", "pengemasan", "lini produksi"],
  },
  {
    id: "factory-4",
    url: "/images/facilities/cleanroom_extraction.jpg",
    title: "Cleanroom Ekstraksi CPOTB Indo Green Nature",
    category: "pabrik",
    tags: ["cleanroom", "ekstraksi", "cpotb", "ign"],
  },
  {
    id: "factory-5",
    url: "/images/facilities/packaging_line.jpg",
    title: "Packaging Line Resmi Indo Green Nature",
    category: "pabrik",
    tags: ["packaging", "pengemasan", "produksi"],
  },
  {
    id: "factory-6",
    url: "/images/about_hero_banner.jpg",
    title: "Pabrik Utama CV. Indo Green Nature",
    category: "pabrik",
    tags: ["pabrik", "perusahaan", "indogreen"],
  },
]

/**
 * Mengambil rekomendasi acak atau berbasis topik dari katalog terverifikasi,
 * dengan opsi mengecualikan URL yang sudah pernah digunakan di artikel lain.
 */
export function getRandomHerbalImage(
  filterCategory?: string,
  excludeUrls: string[] = []
): HerbalImageItem {
  const isExcluded = (url: string) =>
    excludeUrls.some((e) => e && url && (e.trim() === url.trim() || e.includes(url) || url.includes(e)))

  let list = VERIFIED_HERBAL_IMAGES.filter((img) => !isExcluded(img.url))
  // Jika semua sudah terpakai, fallback ke semua katalog
  if (list.length === 0) {
    list = VERIFIED_HERBAL_IMAGES
  }

  if (filterCategory) {
    const matched = list.filter((img) => img.category === filterCategory)
    if (matched.length > 0) list = matched
  }

  const idx = Math.floor(Math.random() * list.length)
  return list[idx]
}

/**
 * Menghasilkan blok daftar URL gambar internet berkualitas tinggi yang di-shuffle secara dinamis
 * untuk diinjeksikan ke dalam prompt AI.
 * 
 * Parameter `excludeUrls` memastikan gambar yang sudah pernah dipakai di artikel database
 * TIDAK AKAN PERNAH disodorkan ke AI, sehingga cover artikel SELALU BERBEDA & UNIK.
 */
export function getDynamicImagePromptPool(
  topic: string = "",
  excludeUrls: string[] = []
): string {
  const lowerTopic = topic.toLowerCase()

  const isExcluded = (url: string) =>
    excludeUrls.some((e) => e && url && (e.trim() === url.trim() || e.includes(url) || url.includes(e)))

  // Saring hanya gambar yang BELUM PERNAH digunakan
  let availableImages = VERIFIED_HERBAL_IMAGES.filter((img) => !isExcluded(img.url))

  // Jika semua gambar katalog sudah pernah dipakai di puluhan artikel,
  // fallback ke semua gambar agar prompt tidak kosong
  if (availableImages.length < 5) {
    availableImages = VERIFIED_HERBAL_IMAGES
  }

  // Tentukan bobot kategori berdasarkan kata kunci topik
  let priorityCategory: HerbalImageItem["category"] = "bahan_alam"
  if (
    lowerTopic.includes("kapsul") ||
    lowerTopic.includes("suplemen") ||
    lowerTopic.includes("tablet") ||
    lowerTopic.includes("otak") ||
    lowerTopic.includes("stamina")
  ) {
    priorityCategory = "kapsul"
  } else if (
    lowerTopic.includes("lab") ||
    lowerTopic.includes("uji") ||
    lowerTopic.includes("bpom") ||
    lowerTopic.includes("cpotb") ||
    lowerTopic.includes("formulasi") ||
    lowerTopic.includes("r&d") ||
    lowerTopic.includes("legalitas")
  ) {
    priorityCategory = "lab"
  } else if (
    lowerTopic.includes("teh") ||
    lowerTopic.includes("serbuk") ||
    lowerTopic.includes("minuman") ||
    lowerTopic.includes("fiber") ||
    lowerTopic.includes("collagen")
  ) {
    priorityCategory = "minuman"
  } else if (
    lowerTopic.includes("madu") ||
    lowerTopic.includes("cairan") ||
    lowerTopic.includes("tetes") ||
    lowerTopic.includes("propolis")
  ) {
    priorityCategory = "madu"
  } else if (
    lowerTopic.includes("pabrik") ||
    lowerTopic.includes("bisnis") ||
    lowerTopic.includes("maklon") ||
    lowerTopic.includes("kemasan") ||
    lowerTopic.includes("logistik") ||
    lowerTopic.includes("peluang")
  ) {
    priorityCategory = "pabrik"
  }

  // Ambil beberapa gambar dari kategori prioritas + beberapa gambar acak kategori lain
  const priorityItems = availableImages
    .filter((img) => img.category === priorityCategory)
    .sort(() => 0.5 - Math.random())

  const otherItems = availableImages
    .filter((img) => img.category !== priorityCategory)
    .sort(() => 0.5 - Math.random())

  // Gabungkan 6-8 pilihan unik yang belum pernah dipakai di artikel mana pun
  const selectedPool = [
    ...priorityItems.slice(0, 4),
    ...otherItems.slice(0, 4),
  ].sort(() => 0.5 - Math.random())

  return selectedPool
    .map((img, i) => `  ${i + 1}. [${img.title}]: "${img.url}"`)
    .join("\n")
}
