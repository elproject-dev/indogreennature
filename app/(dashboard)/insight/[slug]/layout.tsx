import type { Metadata } from "next"
import { fetchInsightBySlug } from "@/lib/insight/db"
import { fetchSeoConfig } from "@/lib/seo-settings"

interface Props {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

function toAbsoluteUrl(url?: string, baseUrl: string = "https://www.indogreennature.com"): string {
  if (!url) return `${baseUrl}/pwa-icon-512.png`
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  const clean = url.startsWith("/") ? url : `/${url}`
  return `${baseUrl}${clean}`
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params

  if (slug === "preview") {
    return {
      title: "Pratinjau Artikel Insight | CV. Indo Green Nature",
      robots: { index: false, follow: false },
    }
  }

  const article = await fetchInsightBySlug(slug)
  const seo = await fetchSeoConfig()
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || seo?.canonicalUrl || "https://www.indogreennature.com").replace(/\/+$/, "")

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
      robots: { index: false, follow: false },
    }
  }

  const title = article.title
  const description = (article.description || article.excerpt || seo?.siteDescription || "").slice(0, 160)
  const canonicalUrl = `${baseUrl}/insight/${article.slug}`
  const coverImage = toAbsoluteUrl(article.cover_image || article.src || seo?.ogImageUrl, baseUrl)

  return {
    title: title,
    description: description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ${seo?.companyName || "CV. Indo Green Nature"}`,
      description: description,
      url: canonicalUrl,
      type: "article",
      publishedTime: article.created_at,
      modifiedTime: article.updated_at || article.created_at,
      authors: [article.author || "Tim R&D Indo Green Nature"],
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: seo?.companyName || "CV. Indo Green Nature",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [coverImage],
    },
    keywords: article.tags && article.tags.length > 0 ? article.tags : undefined,
  }
}

export default async function InsightSlugLayout({ children, params }: Props) {
  const { slug } = await params

  if (slug === "preview") {
    return <>{children}</>
  }

  const article = await fetchInsightBySlug(slug)
  const seo = await fetchSeoConfig()
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || seo?.canonicalUrl || "https://www.indogreennature.com").replace(/\/+$/, "")

  let structuredData: any = null
  if (article) {
    const canonicalUrl = `${baseUrl}/insight/${article.slug}`
    const coverImage = toAbsoluteUrl(article.cover_image || article.src || seo?.ogImageUrl, baseUrl)
    structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Beranda",
              "item": baseUrl,
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Insight & Berita",
              "item": `${baseUrl}/insight`,
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": article.title,
              "item": canonicalUrl,
            },
          ],
        },
        {
          "@type": "Article",
          "@id": `${canonicalUrl}#article`,
          "isPartOf": {
            "@type": "WebPage",
            "@id": canonicalUrl,
          },
          "headline": article.title,
          "description": (article.description || article.excerpt || "").slice(0, 200),
          "inLanguage": "id-ID",
          "mainEntityOfPage": canonicalUrl,
          "datePublished": article.created_at,
          "dateModified": article.updated_at || article.created_at,
          "author": {
            "@type": "Person",
            "name": article.author || "Tim R&D Indo Green Nature",
          },
          "publisher": {
            "@type": "Organization",
            "name": seo?.companyName || "CV. Indo Green Nature",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/pwa-icon-512.png`,
            },
          },
          "image": {
            "@type": "ImageObject",
            "url": coverImage,
          },
          "articleSection": article.category || "Herbal & Maklon",
          "keywords": (article.tags || []).join(", "),
        },
      ],
    }
  }

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      {children}
    </>
  )
}
