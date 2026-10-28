import { MetadataRoute } from "next"
import { fetchInsights } from "@/lib/insight/db"
import { fetchSeoConfig } from "@/lib/seo-settings"

// Memastikan sitemap selalu dievaluasi secara dinamis dan real-time dari Supabase
export const dynamic = "force-dynamic"
export const revalidate = 0

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;")
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
        return {
          url: `${baseUrl}/insight/${art.slug}`,
          lastModified: art.updated_at ? new Date(art.updated_at) : new Date(art.created_at || Date.now()),
          changeFrequency: "weekly" as const,
          priority: 0.7,
          images: coverImg ? [escapeXml(coverImg)] : undefined,
        }
      })
  } catch (err) {
    console.warn("Gagal membuat sitemap artikel dinamis:", err)
  }

  return [...staticRoutes, ...articleRoutes]
}
