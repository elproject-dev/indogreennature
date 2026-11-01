import { MetadataRoute } from "next"
import { fetchInsights } from "@/lib/insight/db"
import { fetchSeoConfig } from "@/lib/seo-settings"

// Memastikan sitemap selalu dievaluasi secara dinamis dan real-time dari Supabase
export const dynamic = "force-dynamic"
export const revalidate = 0

function escapeXml(str: string): string {
  return str.replace(/&amp;/g, "&").replace(/&/g, "&amp;")
}

function formatImageUrl(url: string | null | undefined, baseUrl: string): string | undefined {
  if (!url || typeof url !== "string") return undefined
  const trimmed = url.trim()
  if (!trimmed || trimmed.startsWith("data:")) return undefined

  let fullUrl = trimmed
  if (fullUrl.startsWith("//")) {
    fullUrl = `https:${fullUrl}`
  } else if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
    const cleanPath = fullUrl.startsWith("/") ? fullUrl : `/${fullUrl}`
    fullUrl = `${baseUrl}${cleanPath}`
  }

  // Bersihkan spasi dan escape karakter khusus untuk XML
  fullUrl = fullUrl.replace(/\s+/g, "%20")
  return escapeXml(fullUrl)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let baseUrl = "https://www.indogreennature.com"
  try {
    const seo = await fetchSeoConfig()
    baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || seo?.canonicalUrl || baseUrl).replace(/\/+$/, "")
  } catch {
    baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || baseUrl).replace(/\/+$/, "")
  }

  // 1. Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/our-products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/insight`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/legality`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]

  // 2. Dynamic Insight Articles from Supabase (Selalu update saat artikel dibuat, diedit, atau dihapus)
  let articleRoutes: MetadataRoute.Sitemap = []
  try {
    const articles = await fetchInsights({ onlyActive: true })
    articleRoutes = articles
      .filter((art) => art.slug)
      .map((art) => {
        const coverImg = art.cover_image || art.src
        const formattedImg = formatImageUrl(coverImg, baseUrl)
        return {
          url: `${baseUrl}/insight/${art.slug}`,
          lastModified: art.updated_at ? new Date(art.updated_at) : new Date(art.created_at || Date.now()),
          changeFrequency: "weekly" as const,
          priority: 0.7,
          images: formattedImg ? [formattedImg] : undefined,
        }
      })
  } catch (err) {
    console.warn("Gagal membuat sitemap artikel dinamis:", err)
  }

  return [...staticRoutes, ...articleRoutes]
}
