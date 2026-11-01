import type { Metadata } from "next"
import { fetchSeoConfig } from "@/lib/seo-settings"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSeoConfig()
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || seo?.canonicalUrl || "https://www.indogreennature.com").replace(/\/+$/, "")
  const canonicalUrl = `${baseUrl}/our-products`
  const title = `Katalog Produk & Formulasi Maklon Herbal | ${seo?.companyName || "CV. Indo Green Nature"}`
  const description = "Jelajahi pilihan formulasi maklon herbal: minuman serbuk fungsional, kapsul ekstrak alami, dan teh celup kesehatan berstandar BPOM & Halal resmi."
  const ogImageUrl = `${baseUrl}/og-image.jpg`

  return {
    title: "Katalog Produk & Formulasi Maklon Herbal",
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
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: title,
        },
      ],
      locale: "id_ID",
    },
    facebook: {
      appId: seo?.facebookAppId || "966242223397117",
    },
    other: {
      "fb:app_id": seo?.facebookAppId || "966242223397117",
      "image_src": ogImageUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default function OurProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
