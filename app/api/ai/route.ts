import { NextResponse } from 'next/server';
import { callOmniRouteAI, ChatMessage } from '@/lib/ai';
import {
  getAiConfigServer,
  saveAiConfigServer,
  resetAiConfigServer,
  getWhatsAppCsKnowledgeServer,
  saveWhatsAppCsKnowledgeServer,
  DEFAULT_AI_CONFIG,
  DEFAULT_BASE_SYSTEM_PROMPT,
} from '@/lib/ai-config';
import { getDynamicImagePromptPool } from '@/lib/insight/herbal-images';
import { supabase } from '@/lib/supabase';
import { getFullWebsiteKnowledge } from '@/lib/website-knowledge';

// GET: Mengambil konfigurasi AI aktif dan daftar model yang tersedia
export async function GET() {
  try {
    const config = await getAiConfigServer();
    const baseUrl = config.baseUrl;
    const apiKey = config.apiKey;
    const defaultModel = config.defaultModel;

    let availableModels: string[] = [];

    if (apiKey) {
      try {
        const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/models`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.data)) {
            availableModels = data.data.map((m: any) => m.id);
          }
        }
      } catch (e) {
        console.warn('Gagal fetch models dari OmniRoute:', e);
      }
    }

    const whatsappKnowledge = await getWhatsAppCsKnowledgeServer();

    return NextResponse.json({
      success: true,
      defaultModel,
      models: availableModels,
      config: {
        baseUrl: config.baseUrl,
        defaultModel: config.defaultModel,
        systemPrompt: config.systemPrompt,
        temperature: config.temperature,
        isKeySet: Boolean(config.apiKey),
        maskedApiKey: config.apiKey
          ? `${config.apiKey.slice(0, 8)}...${config.apiKey.slice(-4)}`
          : '',
      },
      whatsappKnowledge,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Menangani pemrosesan prompt, konfigurasi, atau chat AI
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { task, payload, messages, model } = body;

    // TUGAS MANAJEMEN KONFIGURASI WEB
    if (task === 'save_config') {
      const res = await saveAiConfigServer(payload || {});
      return NextResponse.json(res);
    }

    if (task === 'reset_config') {
      const res = await resetAiConfigServer();
      return NextResponse.json(res);
    }

    if (task === 'save_cs_knowledge') {
      const res = await saveWhatsAppCsKnowledgeServer(payload || {});
      return NextResponse.json(res);
    }

    if (task === 'test_connection') {
      const testBaseUrl = payload?.baseUrl?.trim() || (await getAiConfigServer()).baseUrl;
      const testApiKey = payload?.apiKey?.trim() || (await getAiConfigServer()).apiKey;
      const startTime = Date.now();

      const res = await fetch(`${testBaseUrl.replace(/\/+$/, '')}/models`, {
        headers: {
          Authorization: `Bearer ${testApiKey}`,
        },
        cache: 'no-store',
      });

      const latencyMs = Date.now() - startTime;
      if (!res.ok) {
        const errorText = await res.text();
        return NextResponse.json({
          success: false,
          error: `OmniRoute menolak koneksi (${res.status}): ${errorText}`,
          latencyMs,
        });
      }

      const data = await res.json();
      const models = Array.isArray(data.data) ? data.data.map((m: any) => m.id) : [];
      return NextResponse.json({
        success: true,
        latencyMs,
        modelsCount: models.length,
        models,
      });
    }

    if (task === 'test_model') {
      const activeConfig = await getAiConfigServer();
      const testBaseUrl = payload?.baseUrl?.trim() || activeConfig.baseUrl;
      const testApiKey = payload?.apiKey?.trim() || activeConfig.apiKey;
      const testModel = payload?.model?.trim() || activeConfig.defaultModel;
      const startTime = Date.now();

      try {
        const aiResult = await callOmniRouteAI({
          baseUrl: testBaseUrl,
          apiKey: testApiKey,
          systemPrompt: 'Reply with "Pong" and your model status in 5 words.',
          messages: [{ role: 'user', content: 'Ping' }],
          temperature: 0.1,
          model: testModel,
        });

        const latencyMs = Date.now() - startTime;
        return NextResponse.json({
          success: true,
          latencyMs,
          model: testModel,
          sampleResponse: (aiResult || 'Pong').trim(),
        });
      } catch (err: any) {
        const latencyMs = Date.now() - startTime;
        return NextResponse.json({
          success: false,
          latencyMs,
          model: testModel,
          error: err.message || 'Model gagal merespons atau tidak aktif di provider.',
        });
      }
    }

    // AMBIL KONFIGURASI DINAMIS DARI DATABASE / CACHE
    const activeConfig = await getAiConfigServer();
    const chosenModel = model || payload?.model || activeConfig.defaultModel;
    const baseCompanyContext = activeConfig.systemPrompt || DEFAULT_BASE_SYSTEM_PROMPT;
    const activeTemperature =
      typeof payload?.temperature === 'number'
        ? payload.temperature
        : activeConfig.temperature;

    // MODE 1: CHAT INTERAKTIF CS WHATSAPP & ASSISTANT (BERBASIS KNOWLEDGE BASE LENGKAP)
    if (task === 'chat' && Array.isArray(messages) && messages.length > 0) {
      const [csKnowledge, websiteKnowledge] = await Promise.all([
        getWhatsAppCsKnowledgeServer(),
        getFullWebsiteKnowledge(),
      ]);

      const csSystemPrompt = `Anda adalah "INDO GREEN NATURE SUPPORT", staf Customer Service resmi dari CV. Indo Green Nature.
Perusahaan: CV. Indo Green Nature (Pabrik Maklon Herbal Berstandar CPOTB Tahap II, Halal MUI/BPJPH, Izin Edar BPOM TR/MD).

=== BASIS PENGETAHUAN RESMI PERUSAHAAN ===
- Alamat Pabrik / Fasilitas Produksi:
  ${csKnowledge.pabrikAddress}
- Jam Operasional Pabrik & Kantor:
  ${csKnowledge.operatingHours}
- Kontak Resmi:
  WhatsApp: ${csKnowledge.contactPhone} | Email: ${csKnowledge.contactEmail}
- Toko Resmi Marketplace:
  * Shopee: ${csKnowledge.shopeeUrl || "https://shopee.co.id"}
  * Tokopedia: ${csKnowledge.tokopediaUrl || "https://tokopedia.com"}
  * Lazada: ${csKnowledge.lazadaUrl || "https://www.lazada.co.id"}
  * TikTok Shop: ${csKnowledge.tiktokShopUrl || "https://tiktok.com"}
- Layanan & Katalog Sediaan Maklon:
${csKnowledge.serviceCatalog}
- Minimal Order (MOQ) & Biaya:
${csKnowledge.moqAndPricing}

=== SELURUH HALAMAN WEBSITE & KATALOG PRODUK RETAIL RESMI ===
${websiteKnowledge}

=== INSTRUKSI & PELATIHAN KHUSUS DARI ADMIN ===
${csKnowledge.customTrainingNotes}

=== ATURAN KOMUNIKASI CUSTOMER SERVICE ===
1. Selalu gunakan tutur bahasa yang ramah, sopan, profesional, dan solutif layaknya CS resmi terpercaya.
2. JIKA DITANYA PRODUK APA SAJA YANG DIJUAL / DAFTAR PRODUK:
   - Jelaskan bahwa CV. Indo Green Nature memiliki 2 lini produk & layanan:
     a) **Daftar Produk Herbal Retail Siap Pakai**:
        WAJIB sebutkan daftar produk herbal siap pakai menggunakan format TEXT LINK markdown pada setiap nama produknya (contoh: [Jahe Merah & Temulawak](/our-products?q=Jahe%20Merah), [Collagen Tripeptide Glow Drink](/our-products?q=Collagen), [Kapsul Meniran & Sambiloto](/our-products?q=Meniran), [Teh Bunga Telang & Kelor](/our-products?q=Telang), [Fiber Slimming Drink](/our-products?q=Fiber), [Kunyit Asam Segar](/our-products?q=Kunyit), [Madu Murni Hutan](/our-products?q=Madu), dll beserta harganya).
        Pengunjung dapat langsung mengklik nama produk tersebut untuk melihat detailnya di [Halaman Produk Kami](/our-products).
     b) **Jasa Maklon Herbal OEM/ODM (Brand Sendiri)**:
        Pembuatan produk herbal dengan merk sendiri berstandar CPOTB Tahap II (sediaan kapsul, cairan obat dalam/madu herbal, serbuk minuman, teh celup). MOQ mulai 1.000 pcs, formula sampel gratis, dan pendampingan izin BPOM TR/MD & Halal sampai terbit.
3. JIKA DITANYA ALAMAT / LOKASI / PETA PABRIK:
   - Berikan alamat pabrik dan jam operasional, serta WAJIB SELALU sertakan link peta Google Maps persis dengan format: [Buka Lokasi di Google Maps](https://maps.app.goo.gl/KWv4Axdh4eYWpnE6A). Tautan ini otomatis dirender sebagai tombol hijau resmi oleh sistem.
4. JIKA DITANYA LINK TOKO RESMI SHOPEE, TOKOPEDIA, LAZADA, ATAU TIKTOK SHOP:
   - Berikan link resmi yang diminta menggunakan format tombol markdown berikut:
     * Shopee: [Beli di Shopee Official](${csKnowledge.shopeeUrl || "https://shopee.co.id"})
     * Tokopedia: [Beli di Tokopedia Official](${csKnowledge.tokopediaUrl || "https://tokopedia.com"})
     * Lazada: [Beli di Lazada Official](${csKnowledge.lazadaUrl || "https://www.lazada.co.id"})
     * TikTok Shop: [Beli di TikTok Shop Official](${csKnowledge.tiktokShopUrl || "https://tiktok.com"})
   - Tautan ini otomatis ditampilkan sebagai tombol resmi marketplace berlogo di obrolan pengunjung. Berikan juga alternatif melihat katalog di [Halaman Produk Kami](/our-products).
5. JIKA DITANYA MENGENAI HALAMAN / FITUR WEBSITE:
   - Berikan panduan dan tautan langsung ke halaman terkait:
     - Produk Retail: [Halaman Produk Kami](/our-products)
     - Legalitas & Izin Pabrik: [Halaman Legalitas](/legality)
     - Profil Pabrik & Fasilitas: [Halaman Tentang Kami](/about)
     - Kontak & Lokasi: [Halaman Kontak](/contact)
     - Artikel Edukasi Herbal: [Halaman Insight Blog](/insight)
6. JIKA DITANYA KONTAK:
   - Berikan nomor WhatsApp resmi ${csKnowledge.contactPhone} dan email ${csKnowledge.contactEmail}.
7. JIKA DITANYA MOQ / BIAYA MAKLON:
   - Jelaskan bahwa MOQ sangat ramah untuk pengusaha pemula mulai dari 1.000 pcs per batch dengan konsultasi dan sampel formulasi R&D gratis revisi.
8. Hindari klaim medis yang berlebihan/dilarang BPOM.
9. Di akhir jawaban yang relevan, selalu tawarkan bantuan lebih lanjut melalui WhatsApp resmi secara hangat.`;

      const aiResult = await callOmniRouteAI({
        baseUrl: activeConfig.baseUrl,
        apiKey: activeConfig.apiKey,
        systemPrompt: csSystemPrompt,
        messages: messages as ChatMessage[],
        temperature: activeTemperature,
        model: chosenModel,
      });

      return NextResponse.json({ success: true, result: aiResult });
    }

    // MODE 2: TUGAS SPESIFIK (SHORTCUT TASKS)
    let systemPrompt = baseCompanyContext;
    let userPrompt = '';

    switch (task) {
      case 'generate_seo': {
        const topic = payload?.topic || 'Jasa Maklon Herbal BPOM & Halal';
        systemPrompt += ` Tugas Anda adalah merancang metadata SEO berkualitas tinggi untuk halaman website jasa maklon herbal.`;
        userPrompt = `Buatkan metadata SEO yang memikat, ramah algoritma Google, dan mendorong konversi untuk topik: "${topic}".
Respon HARUS HANYA berupa JSON valid tanpa blok markdown di luar kurung kurawal:
{
  "title": "Judul SEO max 60 karakter yang memikat calon brand owner",
  "description": "Meta description max 160 karakter memuat keunggulan (BPOM, Halal, legalitas, formulasi custom)",
  "keywords": "kumpulan, keyword, relevan, dipisahkan, koma"
}`;
        break;
      }

      case 'generate_insight_full': {
        const topic = payload?.topic || 'Panduan Memulai Bisnis Maklon Herbal Berizin BPOM';

        // Ambil daftar cover image yang SUDAH pernah digunakan di artikel database
        // agar gambar yang disodorkan ke AI dijamin 100% belum pernah ada di artikel mana pun
        let usedImages: string[] = Array.isArray(payload?.usedImages) ? payload.usedImages : [];
        if (usedImages.length === 0) {
          try {
            const { data: existingArticles } = await supabase.from('article').select('src');
            if (existingArticles) {
              usedImages = existingArticles.map((a: any) => a.src).filter(Boolean);
            }
          } catch (e) {
            // fallback silently
          }
        }

        const dynamicImagePool = getDynamicImagePromptPool(topic, usedImages);

        systemPrompt += ` Tugas Anda adalah merancang artikel insight blog lengkap yang terstruktur untuk website maklon herbal CV. Indo Green Nature.`;
        userPrompt = `Buatkan artikel edukasi lengkap dan komprehensif tentang: "${topic}".
Kategori yang valid: "Panduan Bisnis", "Regulasi & Legalitas", "R&D & Formulasi", "Tren Pasar", atau "Studi Bahan Alam".

Aturan Pemilihan Gambar:
- WAJIB pilih SATU URL gambar berkualitas tinggi HANYA pada field "cover_image".
- Pilih dari katalog gambar terverifikasi dari internet di bawah ini (daftar ini sudah disaring otomatis agar BELUM PERNAH digunakan di artikel website mana pun):
${dynamicImagePool}
- PENTING: DILARANG mengarang URL sembarangan di luar daftar di atas (karena akan menyebabkan link gambar rusak/404).
- PENTING: DILARANG membuat tag gambar (![...](...)) di dalam isi teks "markdown". Semua gambar hanya boleh masuk ke field "cover_image" saja!

Respon WAJIB HANYA berupa JSON valid tanpa teks atau blok markdown di luar kurung kurawal:
{
  "title": "Judul artikel yang menarik dan bernilai bisnis tinggi",
  "category": "Pilih salah satu dari kategori valid di atas",
  "pembahasan": "Fokus bahasan utama misal CPOTB, BPOM, atau Formulasi Herbal",
  "cover_image": "Pilih salah satu URL gambar herbal unik dari daftar di atas yang belum pernah digunakan",
  "tags": ["Maklon Herbal", "Izin BPOM", "Sediaan Herbal", "Indo Green Nature"],
  "markdown": "Isi lengkap artikel terstruktur minimal 400 kata menggunakan Markdown murni TANPA gambar di dalamnya. Buat subjudul (## Subjudul), poin-poin penjelasan (*), kutipan tips (>), serta solusi maklon bersama CV. Indo Green Nature."
}`;
        break;
      }

      case 'write_article': {
        const topic = payload?.topic || 'Peluang Bisnis Minuman Herbal Berizin BPOM';
        systemPrompt += ` Tugas Anda adalah menulis artikel informatif, profesional, dan meyakinkan bagi calon wirausahawan atau brand owner yang ingin membuat produk herbal sendiri.`;
        userPrompt = `Tulis artikel lengkap tentang: "${topic}".
Gunakan format Markdown:
- Berikan Judul yang memikat (H1)
- Pembuka yang menyoroti potensi pasar dan kebutuhan legalitas (BPOM & Halal)
- Poin-poin tahapan atau keunggulan (H2 dan H3)
- Rekomendasi solusi maklon bersama CV. Indo Green Nature
- Kesimpulan dan Call to Action (CTA) untuk konsultasi formulasi produk.`;
        break;
      }

      case 'product_description': {
        const sediaan = payload?.sediaan || 'Kapsul Herbal';
        const benefit = payload?.benefit || 'Formulasi alami, ekstrak terstandar';
        systemPrompt += ` Tugas Anda adalah membuat deskripsi layanan sediaan maklon herbal yang elegan, profesional, dan persuasif.`;
        userPrompt = `Buatkan deskripsi produk/sediaan maklon untuk: "${sediaan}".
Keunggulan tambahan: "${benefit}".
Sertakan:
1. Ringkasan sediaan & daya tarik pasar
2. Pilihan formulasi & khasiat yang bisa dikembangkan
3. Jaminan mutu (CPOTB, BPOM, Halal)
4. Ajakan konsultasi sampel formulasi.`;
        break;
      }

      case 'analyze_inquiry': {
        const message = payload?.message || '';
        systemPrompt += ` Tugas Anda adalah menganalisis pesan dari calon klien yang tertarik maklon herbal dan membuat draf balasan ramah serta profesional untuk Customer Service / Tim Sales.`;
        userPrompt = `Analisis pesan calon klien berikut:
"${message}"

Tolong berikan:
1. **Analisis Kebutuhan**: Sediaan yang diminati (kapsul/serbuk/teh/madu), skala estimasi, dan kebutuhan perizinan.
2. **Potensi Lead**: Tinggi / Sedang / Rendah.
3. **Draf Balasan WhatsApp/Email**: Pesan balasan hangat dan informatif yang mengarahkan ke jadwal konsultasi formulasi & sampel gratis bersama tim CV. Indo Green Nature.`;
        break;
      }

      default: {
        userPrompt = payload?.prompt || '';
        if (payload?.system) {
          systemPrompt = payload.system;
        }
        break;
      }
      case 'test_model': {
        systemPrompt = 'Jawab hanya satu kata: OK';
        userPrompt = 'Ping';
        break;
      }
    }

    const startTime = Date.now();
    const aiResult = await callOmniRouteAI({
      baseUrl: activeConfig.baseUrl,
      apiKey: activeConfig.apiKey,
      systemPrompt,
      userPrompt,
      temperature: task === 'test_model' ? 0.1 : activeTemperature,
      model: chosenModel,
    });
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({ success: true, result: aiResult, latencyMs });
  } catch (error: any) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Terjadi kendala saat memproses permintaan AI.',
      },
      { status: 500 }
    );
  }
}
