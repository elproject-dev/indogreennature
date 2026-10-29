import { NextResponse } from 'next/server';
import { callOmniRouteAI, ChatMessage } from '@/lib/ai';

// GET: Mengambil daftar model dari OmniRoute dan model default saat ini
export async function GET() {
  try {
    const baseUrl = process.env.OMNIROUTE_BASE_URL || 'https://ai.indogreennature.com/v1';
    const apiKey = process.env.OMNIROUTE_API_KEY;
    const defaultModel = process.env.OMNIROUTE_MODEL || 'kc/kilo-auto/free';

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

    return NextResponse.json({
      success: true,
      defaultModel,
      models: availableModels,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Menangani pemrosesan prompt atau chat AI
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { task, payload, messages, model } = body;
    const chosenModel = model || payload?.model;

    const baseCompanyContext = `Anda adalah asisten AI profesional untuk "CV. Indo Green Nature", pabrik dan penyedia jasa Maklon Herbal terpercaya di Indonesia berstandar CPOTB (Cara Pembuatan Obat Tradisional yang Baik), izin edar BPOM (TR/MD), dan sertifikasi Halal MUI. Layanan meliputi formulasi custom R&D, produksi sediaan kapsul herbal, minuman serbuk (fiber, collagen, rempah), teh herbal/celup, cairan obat dalam/madu herbal, serta pengurusan izin edar BPOM, Halal, desain kemasan, dan pendaftaran HKI merek bagi calon brand owner herbal. Selalu berikan jawaban yang cerdas, solutif, berbasis regulasi, dan ramah bisnis.`;

    // MODE 1: CHAT INTERAKTIF (MULTI-TURN) UNTUK HALAMAN KHUSUS AI ASSISTANT
    if (task === 'chat' && Array.isArray(messages) && messages.length > 0) {
      const aiResult = await callOmniRouteAI({
        systemPrompt: baseCompanyContext,
        messages: messages as ChatMessage[],
        temperature: 0.7,
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
        systemPrompt += ` Tugas Anda adalah merancang artikel insight blog lengkap yang terstruktur untuk website maklon herbal CV. Indo Green Nature.`;
        userPrompt = `Buatkan artikel edukasi lengkap dan komprehensif tentang: "${topic}".
Kategori yang valid: "Panduan Bisnis", "Regulasi & Legalitas", "R&D & Formulasi", "Tren Pasar", atau "Studi Bahan Alam".

Respon WAJIB HANYA berupa JSON valid tanpa teks atau blok markdown di luar kurung kurawal:
{
  "title": "Judul artikel yang menarik dan bernilai bisnis tinggi",
  "category": "Pilih salah satu dari kategori valid di atas",
  "pembahasan": "Fokus bahasan utama misal CPOTB, BPOM, atau Formulasi Herbal",
  "tags": ["Maklon Herbal", "Izin BPOM", "Sediaan Herbal", "Indo Green Nature"],
  "markdown": "Isi lengkap artikel terstruktur minimal 400 kata menggunakan Markdown. Buat subjudul (## Subjudul), poin-poin penjelasan (*), kutipan tips (>), serta solusi maklon bersama CV. Indo Green Nature."
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
    }

    const aiResult = await callOmniRouteAI({
      systemPrompt,
      userPrompt,
      temperature: 0.7,
      model: chosenModel,
    });

    return NextResponse.json({ success: true, result: aiResult });
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
