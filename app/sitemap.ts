import { MetadataRoute } from "next"
import { fetchInsights } from "@/lib/insight/db"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://indogreennature.com"

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

  // 2. Dynamic Insight Articles from Supabase
  let articleRoutes: MetadataRoute.Sitemap = []
  try {
    const articles = await fetchInsights({ onlyActive: true })
    articleRoutes = articles.map((art) => ({
      url: `${baseUrl}/insight/${art.slug}`,
      lastModified: art.updated_at ? new Date(art.updated_at) : new Date(art.created_at || Date.now()),
      changeFrequency: "weekly",
      priority: 0.7,
    }))
  } catch (err) {
    console.warn("Gagal membuat sitemap artikel dinamis:", err)
  }

  return [...staticRoutes, ...articleRoutes]
}
