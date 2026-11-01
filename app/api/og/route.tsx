import { NextRequest } from "next/server"
import { ImageResponse } from "next/og"
import { fetchInsightBySlug } from "@/lib/insight/db"
import { fetchSeoConfig, DEFAULT_SEO_CONFIG } from "@/lib/seo-settings"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")
    const customTitle = searchParams.get("title")

    let title = customTitle || ""
    let description = ""
    let category = "Maklon Herbal Resmi"
    let isArticle = false

    // 1. Jika slug artikel disertakan, ambil data artikel
    if (slug) {
      const article = await fetchInsightBySlug(slug)
      if (article) {
        title = article.title
        category = article.category || "Insight Herbal"
        description = article.excerpt || article.description || ""
        isArticle = true
      }
    }

    // 2. Jika bukan artikel / belum ada judul, ambil dari SEO website
    if (!title) {
      const seo = await fetchSeoConfig()
      title = seo.siteTitle || DEFAULT_SEO_CONFIG.siteTitle
      description = seo.siteDescription || DEFAULT_SEO_CONFIG.siteDescription
      category = "Pabrik Maklon BPOM & Halal"
    }

    // Truncate deskripsi agar proporsional
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
                  fontSize: "20px",
                }}
              >
                IGN
              </div>
              <div
                style={{
                  color: "#ffffff",
                  fontSize: "22px",
                  fontWeight: "bold",
                  letterSpacing: "1.5px",
                }}
              >
                CV. INDO GREEN NATURE
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                border: "1px solid #10b981",
                color: "#6ee7b7",
                padding: "6px 20px",
                borderRadius: "20px",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              {category}
            </div>
          </div>

          {/* Main Title & Description */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "1060px",
            }}
          >
            <div
              style={{
                fontSize: title.length > 70 ? "40px" : "48px",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.25,
              }}
            >
              {title}
            </div>

            {description ? (
              <div
                style={{
                  fontSize: "21px",
                  color: "#cbd5e1",
                  lineHeight: 1.45,
                }}
              >
                {description}
              </div>
            ) : null}
          </div>

          {/* Footer Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(255, 255, 255, 0.15)",
              paddingTop: "20px",
            }}
          >
            <div
              style={{
                color: "#34d399",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              www.indogreennature.com
            </div>
            <div
              style={{
                color: "#94a3b8",
                fontSize: "16px",
              }}
            >
              {isArticle
                ? "CV. Indo Green Nature • Riset & Formulasi Herbal"
                : "Standar CPOTB Tahap II • Izin Edar BPOM TR/MD • Halal MUI"}
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
  } catch (err: any) {
    console.error("[OG Route Error]:", err)
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#064e3b",
            color: "#ffffff",
            fontSize: "42px",
            fontWeight: "bold",
            fontFamily: "sans-serif",
          }}
        >
          CV. Indo Green Nature | Jasa Maklon Herbal Resmi
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=3600",
          "X-Robots-Tag": "all",
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
  }
}
