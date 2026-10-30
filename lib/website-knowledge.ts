import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import {
  DEFAULT_SHOPEE_PRODUCTS,
  OUR_PRODUCTS_DB_CONFIG_KEY,
  ShopeeProductItem,
} from "@/lib/our-products-settings/types"

let cachedProductsSummary: { text: string; timestamp: number } | null = null

/**
 * Mengambil ringkasan dinamis seluruh halaman website dan katalog produk
 * untuk disuntikkan ke dalam AI Customer Service.
 */
export async function getFullWebsiteKnowledge(): Promise<string> {
  const now = Date.now()
  if (cachedProductsSummary && now - cachedProductsSummary.timestamp < 30000) {
    return cachedProductsSummary.text
  }

  let products: ShopeeProductItem[] = DEFAULT_SHOPEE_PRODUCTS

  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase
        .from("app_config")
        .select("value")
        .eq("key", OUR_PRODUCTS_DB_CONFIG_KEY)
        .maybeSingle()

      if (data?.value) {
        const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value
        if (Array.isArray(parsed?.shopeeProducts) && parsed.shopeeProducts.length > 0) {
          products = parsed.shopeeProducts
        }
      }
    } catch (e) {
      console.warn("Gagal fetch products untuk AI knowledge:", e)
    }
  }

  const productListText = products
    .slice(0, 15)
    .map((p, idx) => {
      const priceFmt = `Rp ${p.price?.toLocaleString("id-ID") || 0}`
      const desc = p.description ? ` - ${p.description}` : ""
      const encodedName = encodeURIComponent(p.name.trim())
      return `${idx + 1}. [${p.name}](/our-products?q=${encodedName}) (${p.category || "Herbal"}, ${priceFmt})${desc}`
    })
    .join("\n")

  const fullKnowledge = `
=== KATALOG PRODUK HERBAL SIAP JUAL (HALAMAN /our-products) ===
CV. Indo Green Nature menjual produk herbal retail siap pakai berkualitas tinggi berizin BPOM & Halal.
Format setiap produk berikut sudah berupa text link langsung ke halaman katalog:
${productListText}

Toko Marketplace Resmi:
- Shopee: CV. Indo Green Nature Official Shop
- Tokopedia, Lazada, dan TikTok Shop
* Pembeli retail/eceran dapat diarahkan untuk mengklik langsung nama produk di atas atau membuka katalog lengkap di [Halaman Produk Kami](/our-products).

=== STRUKTUR & INFORMASI LENGKAP HALAMAN WEBSITE ===
1. Halaman Beranda (/) :
   - Layanan Utama: Jasa Maklon Herbal berstandar CPOTB (Cara Pembuatan Obat Tradisional yang Baik) Tahap II dari BPOM RI.
   - Solusi: Formulasi sampel R&D gratis revisi, pengurusan izin edar BPOM (TR/MD) sampai terbit, sertifikasi Halal MUI/BPJPH, desain kemasan profesional, pendaftaran HKI merek, dan produksi massal.
   - Minimal Order (MOQ): Mulai dari 1.000 botol/pcs per batch produksi (ramah untuk brand owner pemula).

2. Halaman Produk Kami (/our-products) :
   - Berisi etalase katalog produk herbal retail siap konsumsi, ulasan pembeli, serta akses belanja online ke marketplace resmi.

3. Halaman Tentang Kami (/about) :
   - Profil pabrik, visi dan misi, fasilitas mesin ekstraksi modern, standar higienitas CPOTB, serta komitmen terhadap bahan alami Nusantara.

4. Halaman Legalitas & Perizinan (/legality) :
   - Menampilkan sertifikat CPOTB Tahap II dari BPOM RI, Sertifikat Halal BPJPH Kemenag / MUI, serta izin operasional industri obat tradisional.

5. Halaman Kontak & Lokasi (/contact) :
   - Alamat pabrik di Jl. Wahid Hasyim No. 123, Wates, Kulon Progo, D.I. Yogyakarta 55651.
   - Jam kerja: Senin–Jumat 08.00–17.00 WIB, Sabtu 08.00–13.00 WIB.
   - Peta Google Maps resmi: https://maps.app.goo.gl/KWv4Axdh4eYWpnE6A
   - Email resmi: admin@indogreennature.com
   - WhatsApp Maklon: 0858-7766-9199 / 0821-3636-8880

6. Halaman Insight Blog (/insight) :
   - Artikel edukasi herbal, tren pasar maklon, panduan perizinan BPOM, serta tips memulai bisnis produk herbal label sendiri.

=== CARA MEMBERIKAN REKOMENDASI HALAMAN KEPADA PENGUNJUNG ===
- Jika pengunjung ingin belanja produk eceran / menanyakan daftar produk yang dijual:
  WAJIB sebutkan daftar produk herbal dalam format TEXT LINK markdown langsung pada setiap nama produknya (contoh: [Jahe Merah Temulawak](/our-products?q=Jahe%20Merah), [Collagen Tripeptide Glow Drink](/our-products?q=Collagen), dll) agar penanya bisa langsung mengklik dan melihat detail produknya di halaman web. Berikan juga tautan katalog umum [Halaman Produk Kami](/our-products).
- Jika pengunjung ingin membuat produk merk sendiri (maklon), jelaskan layanan maklon, MOQ mulai 1.000 pcs, dan arahkan ke WhatsApp resmi untuk simulasi biaya.
- Jika pengunjung menanyakan legalitas/sertifikat pabrik, sarankan untuk melihat sertifikat resmi di halaman Legalitas (/legality).
- Jika pengunjung menanyakan fasilitas pabrik/perusahaan, sarankan melihat profil di halaman Tentang Kami (/about).
- Jika pengunjung menanyakan artikel atau panduan bisnis herbal, sarankan membaca di halaman Insight (/insight).
`

  cachedProductsSummary = { text: fullKnowledge, timestamp: now }
  return fullKnowledge
}
