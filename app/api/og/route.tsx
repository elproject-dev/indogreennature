import { NextRequest } from "next/server"
import { ImageResponse } from "next/og"
import fs from "fs"
import path from "path"
import sharp from "sharp"
import { fetchInsightBySlug } from "@/lib/insight/db"
import { fetchSeoConfig, DEFAULT_SEO_CONFIG } from "@/lib/seo-settings"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")
    const customUrl = searchParams.get("url")
    const customTitle = searchParams.get("title")

    let targetImageUrl: string | null = null
    let title = customTitle || ""
    let description = ""
    let category = "Maklon Herbal Resmi"

    // 1. Tentukan target gambar berdasarkan query param
    if (customUrl) {
      targetImageUrl = decodeURIComponent(customUrl)
    } else if (slug) {
      const article = await fetchInsightBySlug(slug)
      if (article) {
        targetImageUrl = article.cover_image || article.src || null
        title = article.title
        category = article.category || "Insight Maklon Herbal"
        description = article.excerpt || article.description || ""
      }
    }

    // Jika belum ada target gambar, ambil foto SEO resmi dari database
    if (!targetImageUrl) {
      const seo = await fetchSeoConfig()
      targetImageUrl = seo.ogImageUrl || DEFAULT_SEO_CONFIG.ogImageUrl || null
      if (!title) {
        title = seo.siteTitle || DEFAULT_SEO_CONFIG.siteTitle
        description = seo.siteDescription || DEFAULT_SEO_CONFIG.siteDescription
        category = "Pabrik Maklon BPOM & Halal"
      }
    }

    // 2. Jika ada foto target yang diunggah, PROXY & OPTIMALKAN FOTO ASLI
    // Menghapus header pemblokir x-robots-tag: none dari Supabase Storage dan mengubah ke standard 1200x630 JPEG
    if (targetImageUrl) {
      try {
        let inputBuffer: Buffer | null = null

        if (targetImageUrl.startsWith("http://") || targetImageUrl.startsWith("https://")) {
          const imgRes = await fetch(targetImageUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
            },
            cache: "no-store",
          })

          if (imgRes.ok) {
            const arr = await imgRes.arrayBuffer()
            if (arr.byteLength > 0) {
              inputBuffer = Buffer.from(arr)
            }
          }
        } else {
          // File path lokal (misal: /images/facilities/...)
          const cleanPath = targetImageUrl.replace(/^\/+/, "")
          const localPath = path.join(process.cwd(), "public", cleanPath)
          if (fs.existsSync(localPath)) {
            inputBuffer = await fs.promises.readFile(localPath)
          }
        }

        if (inputBuffer && inputBuffer.length > 0) {
          try {
            // Konversi ke JPEG standar 1200x630 dengan kualitas 90%
            // (Kompatibel 100% dengan WhatsApp, Facebook Debugger, Twitter/X, Telegram)
            const processedJpg = await sharp(inputBuffer)
              .resize(1200, 630, {
                fit: "cover",
                position: "center",
              })
              .jpeg({
                quality: 90,
                progressive: true,
                mozjpeg: true,
              })
              .toBuffer()

            return new Response(new Uint8Array(processedJpg), {
              status: 200,
              headers: {
                "Content-Type": "image/jpeg",
                "Content-Length": processedJpg.length.toString(),
                "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
                "X-Robots-Tag": "all",
                "Access-Control-Allow-Origin": "*",
              },
            })
          } catch (sharpErr) {
            console.warn("[OG Route] Sharp convert gagal, streaming buffer asli:", sharpErr)
            return new Response(new Uint8Array(inputBuffer), {
              status: 200,
              headers: {
                "Content-Type": "image/jpeg",
                "Content-Length": inputBuffer.length.toString(),
                "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
                "X-Robots-Tag": "all",
                "Access-Control-Allow-Origin": "*",
              },
            })
          }
        }
      } catch (proxyErr) {
        console.warn("[OG Route] Gagal memuat foto asli:", proxyErr)
      }
    }

    // 3. FALLBACK: Hanya jika tidak ada gambar sama sekali
    if (description.length > 150) {
      description = description.slice(0, 147) + "..."
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#064e3b",
            backgroundImage: "radial-gradient(circle at 88% 12%, #047857 0%, #064e3b 50%, #022c22 100%)",
            padding: "56px 64px",
            fontFamily: "sans-serif",
            boxSizing: "border-box",
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "22px",
                  backgroundColor: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#064e3b",
                  fontWeight: 900,
                  fontSize: "22px",
                }}
              >
                🌿
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#ffffff",
                    letterSpacing: "-0.5px",
                  }}
                >
                  CV. INDO GREEN NATURE
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#a7f3d0",
                    fontWeight: 600,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Indonesian Herbal Manufacturer
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                border: "1px solid rgba(52, 211, 153, 0.4)",
                padding: "8px 18px",
                borderRadius: "30px",
                color: "#6ee7b7",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              {category}
            </div>
          </div>

          {/* Main Title & Excerpt */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "1060px",
              margin: "24px 0",
            }}
          >
            <h1
              style={{
                fontSize: title.length > 60 ? "40px" : "48px",
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1.18,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              {title}
            </h1>
            {description && (
              <p
                style={{
                  fontSize: "19px",
                  color: "#d1fae5",
                  lineHeight: 1.45,
                  margin: 0,
                }}
              >
                {description}
              </p>
            )}
          </div>

          {/* Footer Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255, 255, 255, 0.15)",
              paddingTop: "24px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                color: "#a7f3d0",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              <span>✓ BPOM Certified</span>
              <span>✓ Halal MUI</span>
              <span>✓ Standar CPOTB</span>
            </div>

            <div
              style={{
                color: "#6ee7b7",
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              www.indogreennature.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
          "X-Robots-Tag": "all",
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
  } catch (e: any) {
    console.error("[OG Error]:", e)
    return new Response(`OG Error: ${e.message}`, { status: 500 })
  }
}
