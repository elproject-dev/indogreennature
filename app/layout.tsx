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


// const moderustic = Moderustic({ subsets: ['latin'], variable: '--font-moderustic', preload: false });
const moderustic = Moderustic({ subsets: ['latin'], variable: '--font-moderustic' });
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
  themeColor: "#000000",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const seo = await fetchSeoConfig();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || seo.canonicalUrl || "https://www.indogreennature.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": seo.companyName || "CV. Indo Green Nature",
    "url": baseUrl,
    "logo": `${baseUrl}/pwa-icon.png`,
    "description": seo.siteDescription,
    "sameAs": [
      "https://instagram.com/indogreennature",
      "https://facebook.com/indogreennature",
      "https://tiktok.com/@indogreennature"
    ]
  };

  return (
    <html
      lang="id"
      className={cn("light", "h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", outfit.variable, moderustic.variable, poiretOne.variable)}
      suppressHydrationWarning
    >
      <head>
        <script
          id="hydration-suppress-filter"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var o=console.error;console.error=function(){var m=arguments[0];if(typeof m==="string"&&(m.indexOf("418")!==-1||m.indexOf("423")!==-1||m.indexOf("Hydration")!==-1))return;if(m&&m.message&&(m.message.indexOf("418")!==-1||m.message.indexOf("423")!==-1))return;o.apply(console,arguments)};window.addEventListener("error",function(e){if(e&&e.message&&(e.message.indexOf("418")!==-1||e.message.indexOf("423")!==-1)){e.preventDefault();e.stopImmediatePropagation();return true;}},true);}catch(err){}})();`,
          }}
        />
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
        </ThemeProvider>
      </body>
    </html>
  );
}
