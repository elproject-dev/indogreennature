import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Moderustic, Poiret_One } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { outfit } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Toaster as ToastUiToaster } from "@/components/ui/toast"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { GoogleAnalytics } from "@/components/google-analytics"
import { DeferredPushNotificationManager } from "@/components/deferred-widgets"
import { GlobalThemeApplier } from "@/components/global-theme-applier"
import { GoogleTranslator } from "@/components/google-translator"


// const moderustic = Moderustic({ subsets: ['latin'], variable: '--font-moderustic', preload: false });
const moderustic = Moderustic({ subsets: ['latin'], variable: '--font-moderustic', preload: false });
const poiretOne = Poiret_One({ weight: "400", subsets: ['latin'], variable: '--font-poiret-one', preload: false });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

import { fetchSeoConfig, DEFAULT_SEO_CONFIG } from "@/lib/seo-settings";

export const revalidate = 60; // Refresh cache server setiap 60 detik

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSeoConfig();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || seo.canonicalUrl || "https://www.indogreennature.com";
  const siteTitle = seo.siteTitle || DEFAULT_SEO_CONFIG.siteTitle;
  const siteDescription = seo.siteDescription || DEFAULT_SEO_CONFIG.siteDescription;
  const ogImage = seo.ogImageUrl || DEFAULT_SEO_CONFIG.ogImageUrl;
  const keywords = seo.siteKeywords
    ? seo.siteKeywords.split(",").map((k) => k.trim()).filter(Boolean)
    : DEFAULT_SEO_CONFIG.siteKeywords.split(",").map((k) => k.trim());

  return {
    title: {
      default: siteTitle,
      template: `%s | ${seo.companyName || "CV. Indo Green Nature"}`,
    },
    description: siteDescription,
    keywords: keywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: baseUrl,
      siteName: seo.companyName || "CV. Indo Green Nature",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteTitle,
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      images: [ogImage],
    },
    robots: {
      index: seo.robotsIndex !== false,
      follow: seo.robotsIndex !== false,
      googleBot: {
        index: seo.robotsIndex !== false,
        follow: seo.robotsIndex !== false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/pwa-icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/pwa-icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: seo.companyName || "CV. Indo Green Nature",
    },
    verification: {
      google: seo.googleVerification || "LGVKTK0moSrDgV9sOu-cy4n5hK3bPya07IQ_rB-WT50",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const seo = await fetchSeoConfig();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || seo.canonicalUrl || "https://www.indogreennature.com";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      "url": baseUrl,
      "name": seo.companyName || "CV. Indo Green Nature",
      "description": seo.siteDescription,
      "publisher": {
        "@id": `${baseUrl}/#organization`,
      },
      "inLanguage": "id-ID",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/our-products?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": seo.companyName || "CV. Indo Green Nature",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/pwa-icon-512.png`,
        "width": 512,
        "height": 512
      },
      "image": seo.ogImageUrl || `${baseUrl}/pwa-icon-512.png`,
      "description": seo.siteDescription,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": seo.streetAddress || "Jl. Wahid Hasyim No. 123",
        "addressLocality": seo.addressLocality || "Wates",
        "addressRegion": seo.addressRegion || "Daerah Istimewa Yogyakarta",
        "postalCode": seo.postalCode || "55651",
        "addressCountry": seo.addressCountry || "ID"
      },
      "telephone": seo.telephone || "+6285877669199",
      "email": seo.email || "admin@indogreennature.com",
      "sameAs": [
        seo.instagramUrl || "https://instagram.com/indogreennature",
        seo.facebookUrl || "https://facebook.com/indogreennature",
        seo.tiktokUrl || "https://tiktok.com/@indogreennature",
        seo.youtubeUrl,
        seo.linkedinUrl,
      ].filter(Boolean) as string[]
    }
  ];

  return (
    <html
      lang="id"
      className={cn("light", "h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", outfit.variable, moderustic.variable, poiretOne.variable)}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(typeof window==="undefined")return;if(typeof Node!=="undefined"&&Node.prototype){var r=Node.prototype.removeChild;Node.prototype.removeChild=function(c){if(c&&c.parentNode!==this)return c;return r.apply(this,arguments);};var i=Node.prototype.insertBefore;Node.prototype.insertBefore=function(n,ref){if(ref&&ref.parentNode!==this)return n;return i.apply(this,arguments);};}function isIgnored(m){if(!m)return false;var s=typeof m==="string"?m:(m.message||m.name||m.stack||"");return s.indexOf("418")!==-1||s.indexOf("423")!==-1||s.indexOf("425")!==-1||s.indexOf("Hydration")!==-1||s.indexOf("hydration")!==-1||s.indexOf("Node cannot be found")!==-1||s.indexOf("removeChild")!==-1||s.indexOf("insertBefore")!==-1||s.indexOf("NotFoundError")!==-1;}window.addEventListener("error",function(e){if(isIgnored(e.message)||isIgnored(e.error)){e.preventDefault();e.stopImmediatePropagation();return true;}},true);var oErr=window.onerror;window.onerror=function(m,u,l,c,e){if(isIgnored(m)||isIgnored(e))return true;if(oErr)return oErr.apply(this,arguments);};window.addEventListener("unhandledrejection",function(e){if(isIgnored(e.reason)){e.preventDefault();e.stopImmediatePropagation();return true;}},true);var cErr=console.error;console.error=function(){var a=Array.prototype.slice.call(arguments);for(var k=0;k<a.length;k++){if(isIgnored(a[k]))return;}cErr.apply(console,a);};var cWarn=console.warn;console.warn=function(){var a=Array.prototype.slice.call(arguments);for(var k=0;k<a.length;k++){if(isIgnored(a[k]))return;}cWarn.apply(console,a);};})();`
          }}
        />
        <link rel="preconnect" href="https://ivtpcjwwenjdatxxtjqm.supabase.co" crossOrigin="" />
        <link rel="dns-prefetch" href="https://ivtpcjwwenjdatxxtjqm.supabase.co" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <GlobalThemeApplier />
          {children}
          <Toaster />
          <ToastUiToaster />
          <PWAInstallPrompt />
          <DeferredPushNotificationManager />
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID} />
          <GoogleTranslator />
        </ThemeProvider>
      </body>
    </html>
  );
}
