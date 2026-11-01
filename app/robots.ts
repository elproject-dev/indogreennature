import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.indogreennature.com").replace(/\/+$/, "")

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/og"],
        disallow: [
          "/settings",
          "/login",
          "/api/",
          "/insight/create",
          "/dashboard",
          "/auth",
          "/broadcast",
          "/analytics",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/api/og"],
        disallow: [
          "/settings",
          "/login",
          "/api/",
          "/insight/create",
          "/dashboard",
          "/auth",
          "/broadcast",
          "/analytics",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
