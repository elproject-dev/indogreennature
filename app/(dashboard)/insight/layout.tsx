import type { Metadata } from "next"
import { fetchSeoConfig } from "@/lib/seo-settings"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSeoConfig()
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || seo?.canonicalUrl || "https://www.indogreennature.com").replace(/\/+$/, "")
  const canonicalUrl = `${baseUrl}/insight`
  const title = `Insight & Artikel Maklon Herbal | ${seo?.companyName || "CV. Indo Green Nature"}`
  const description = "Temukan artikel, tips bisnis maklon herbal, panduan regulasi BPOM & CPOTB, serta inovasi formulasi minuman dan suplemen herbal terkini."
  const image = seo?.ogImageUrl || `${baseUrl}/pwa-icon-512.png`

  return {
    title: "Insight & Artikel Maklon Herbal",
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: seo?.companyName || "CV. Indo Green Nature",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

export default function InsightLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
