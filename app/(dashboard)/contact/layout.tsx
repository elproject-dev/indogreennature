import type { Metadata } from "next"
import { fetchSeoConfig } from "@/lib/seo-settings"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSeoConfig()
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || seo?.canonicalUrl || "https://www.indogreennature.com").replace(/\/+$/, "")
  const canonicalUrl = `${baseUrl}/contact`
  const title = `Hubungi Kami - Konsultasi Maklon Herbal Gratis | ${seo?.companyName || "CV. Indo Green Nature"}`
  const description = "Konsultasikan ide produk herbal Anda bersama tim formulasi kami. Dapatkan penawaran harga maklon terbaik, MOQ bersahabat, dan sampel produk gratis."
  const image = seo?.ogImageUrl || `${baseUrl}/pwa-icon-512.png`

  return {
    title: "Hubungi Kami - Konsultasi Maklon Herbal Gratis",
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

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
