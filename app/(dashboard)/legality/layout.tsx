import type { Metadata } from "next"
import { fetchSeoConfig } from "@/lib/seo-settings"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSeoConfig()
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || seo?.canonicalUrl || "https://www.indogreennature.com").replace(/\/+$/, "")
  const canonicalUrl = `${baseUrl}/legality`
  const title = `Legalitas & Sertifikasi Resmi (BPOM RI, Halal, CPOTB) | ${seo?.companyName || "CV. Indo Green Nature"}`
  const description = "Jaminan legalitas lengkap produksi maklon herbal CV. Indo Green Nature: Izin Edar BPOM RI, Sertifikat Halal MUI/BPJPH, standar CPOTB dan ISO mutu."
  const image = seo?.ogImageUrl || `${baseUrl}/pwa-icon-512.png`

  return {
    title: "Legalitas & Sertifikasi Resmi (BPOM RI, Halal, CPOTB)",
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

export default function LegalityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
