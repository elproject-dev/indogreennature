import { NextRequest } from "next/server"
import sharp from "sharp"
import fs from "fs"
import path from "path"
import { fetchInsightBySlug } from "@/lib/insight/db"
import { fetchSeoConfig, DEFAULT_SEO_CONFIG } from "@/lib/seo-settings"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function escapeXml(unsafe: string): string {
  return (unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function wrapText(text: string, maxChars = 38, maxLines = 3): string[] {
  const words = (text || "").split(/\s+/)
  const lines: string[] = []
  let current = ""
  for (const w of words) {
    if ((current + " " + w).trim().length <= maxChars) {
      current = (current + " " + w).trim()
    } else {
      if (current) lines.push(current)
      current = w
      if (lines.length >= maxLines) break
    }
  }
  if (current && lines.length < maxLines) lines.push(current)
  return lines
}

function generateFallbackSvg(title: string, category = "Maklon Herbal Resmi", brand = "CV. INDO GREEN NATURE"): Buffer {
  const lines = wrapText(title, 36, 3)
  const tspans = lines
    .map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : 56}">${escapeXml(l)}</tspan>`)
    .join("")

  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="50%" stop-color="#043325" />
      <stop offset="100%" stop-color="#021d15" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <circle cx="1100" cy="120" r="320" fill="#10b981" fill-opacity="0.08" />
  <circle cx="100" cy="560" r="260" fill="#10b981" fill-opacity="0.05" />
  
  <rect x="80" y="80" width="340" height="44" rx="22" fill="#0a3d2e" stroke="#10b981" stroke-width="1.5" />
  <text x="250" y="108" font-family="sans-serif" font-size="14" font-weight="bold" fill="#34d399" text-anchor="middle" letter-spacing="2">
    ${escapeXml(brand)}
  </text>
  
  <rect x="80" y="146" width="220" height="32" rx="6" fill="#10b981" fill-opacity="0.18" />
  <text x="95" y="168" font-family="sans-serif" font-size="13" font-weight="600" fill="#6ee7b7">
    ${escapeXml(category)}
  </text>
  
  <text x="80" y="260" font-family="sans-serif" font-size="44" font-weight="bold" fill="#ffffff">
    ${tspans}
  </text>
  
  <text x="80" y="450" font-family="sans-serif" font-size="20" fill="#a7f3d0">
    Pabrik &amp; Jasa Maklon Herbal BPOM &amp; Halal Resmi di Indonesia
  </text>
  
  <rect x="80" y="515" width="1040" height="1" fill="#10b981" fill-opacity="0.25" />
  <text x="80" y="555" font-family="sans-serif" font-size="18" font-weight="bold" fill="#34d399">
    www.indogreennature.com
  </text>
  <text x="1120" y="555" font-family="sans-serif" font-size="15" fill="#94a3b8" text-anchor="end">
    Formulasi Kapsul, Minuman Serbuk &amp; Teh Herbal
  </text>
</svg>
`
  return Buffer.from(svg)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")
    const customUrl = searchParams.get("url")
    const customTitle = searchParams.get("title")

    let targetImageUrl: string | null = null
    let title = customTitle || ""
    let category = "Maklon Herbal Resmi"

    // 1. Ambil target gambar berdasarkan parameter
    if (customUrl) {
      targetImageUrl = decodeURIComponent(customUrl)
    } else if (slug) {
      const article = await fetchInsightBySlug(slug)
      if (article) {
        targetImageUrl = article.cover_image || article.src || null
        title = article.title
        category = article.category || "Insight Herbal"
      }
    }

    // Jika belum ada target, ambil dari konfigurasi SEO website
    if (!targetImageUrl) {
      const seo = await fetchSeoConfig()
      targetImageUrl = seo.ogImageUrl || DEFAULT_SEO_CONFIG.ogImageUrl || null
      if (!title) {
        title = seo.siteTitle || DEFAULT_SEO_CONFIG.siteTitle
      }
    }

    let inputBuffer: Buffer | null = null

    // 2. Fetch atau baca file gambar sumber
    if (targetImageUrl) {
      try {
        if (targetImageUrl.startsWith("http://") || targetImageUrl.startsWith("https://")) {
          const res = await fetch(targetImageUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
            cache: "force-cache",
          })
          if (res.ok) {
            const arr = await res.arrayBuffer()
            inputBuffer = Buffer.from(arr)
          }
        } else {
          // File path lokal (misal: /images/facilities/...)
          const cleanPath = targetImageUrl.replace(/^\/+/, "")
          const localPath = path.join(process.cwd(), "public", cleanPath)
          if (fs.existsSync(localPath)) {
            inputBuffer = await fs.promises.readFile(localPath)
          }
        }
      } catch (err) {
        console.warn("[OG Route] Gagal memuat gambar sumber:", err)
      }
    }

    let outputBuffer: Buffer

    // 3. Konversi dan optimasi gambar ke Progressive JPEG 1200x630
    if (inputBuffer && inputBuffer.length > 0) {
      try {
        outputBuffer = await sharp(inputBuffer)
          .resize(1200, 630, {
            fit: "cover",
            position: "center",
          })
          .jpeg({
            quality: 85,
            progressive: true,
            mozjpeg: true,
          })
          .toBuffer()
      } catch (sharpErr) {
        console.warn("[OG Route] Sharp gagal memproses gambar, memakai fallback:", sharpErr)
        const svgBuf = generateFallbackSvg(title || "CV. Indo Green Nature", category)
        outputBuffer = await sharp(svgBuf).jpeg({ quality: 90 }).toBuffer()
      }
    } else {
      // Fallback banner SVG berstandar visual Indo Green Nature
      const svgBuf = generateFallbackSvg(title || "CV. Indo Green Nature", category)
      outputBuffer = await sharp(svgBuf).jpeg({ quality: 90 }).toBuffer()
    }

    // 4. Return respon gambar dengan header OpenGraph terbaik
    return new Response(new Uint8Array(outputBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": outputBuffer.length.toString(),
        "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
        "X-Robots-Tag": "all",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("[OG Route Error]:", error)
    // Fallback minimal jika terjadi fatal error
    const svgBuf = generateFallbackSvg("CV. Indo Green Nature | Jasa Maklon Herbal Resmi")
    const fallbackBuffer = await sharp(svgBuf).jpeg({ quality: 85 }).toBuffer()
    return new Response(new Uint8Array(fallbackBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=3600",
        "X-Robots-Tag": "all",
      },
    })
  }
}
