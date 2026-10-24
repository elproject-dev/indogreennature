import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://indogreennature.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/settings", "/login", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/settings", "/login", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
