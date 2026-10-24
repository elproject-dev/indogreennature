import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Moderustic, Poiret_One } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { outfit } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Toaster as ToastUiToaster } from "@/components/ui/toast"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { GoogleAnalytics } from "@next/third-parties/google"
import { PushNotificationManager } from "@/components/push-notification-manager"
import { GlobalThemeApplier } from "@/components/global-theme-applier"


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

export const metadata: Metadata = {
  title: {
    default: "CV. Indo Green Nature | Jasa Maklon Herbal BPOM & Halal Resmi",
    template: "%s | CV. Indo Green Nature",
  },
  description: "Pabrik dan jasa maklon herbal terpercaya di Indonesia. Melayani formulasi minuman serbuk, kapsul herbal, teh herbal berstandar BPOM & Halal dengan legalitas lengkap.",
  keywords: [
    "maklon herbal",
    "jasa maklon herbal",
    "maklon herbal bpom",
    "pabrik herbal indonesia",
    "maklon minuman serbuk",
    "maklon kapsul herbal",
    "maklon teh herbal",
    "cv indo green nature",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://indogreennature.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CV. Indo Green Nature | Jasa Maklon Herbal BPOM & Halal Resmi",
    description: "Pabrik dan jasa maklon herbal terpercaya di Indonesia. Melayani formulasi minuman serbuk, kapsul herbal, teh herbal berstandar BPOM & Halal dengan legalitas lengkap.",
    url: "https://indogreennature.com",
    siteName: "CV. Indo Green Nature",
    images: [
      {
        url: "https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/hero_banner/1792330129667-hsobqa.webp",
        width: 1200,
        height: 630,
        alt: "CV. Indo Green Nature - Jasa Maklon Herbal",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CV. Indo Green Nature | Jasa Maklon Herbal BPOM & Halal Resmi",
    description: "Pabrik dan jasa maklon herbal terpercaya di Indonesia. Melayani formulasi minuman serbuk, kapsul herbal, teh herbal berstandar BPOM & Halal dengan legalitas lengkap.",
    images: ["https://ivtpcjwwenjdatxxtjqm.supabase.co/storage/v1/object/public/media/hero_banner/1792330129667-hsobqa.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/pwa-icon.png", type: "image/png" }],
    shortcut: "/pwa-icon.png",
    apple: "/pwa-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CV. Indo Green Nature",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CV. Indo Green Nature",
    "url": "https://indogreennature.com",
    "logo": "https://indogreennature.com/pwa-icon.png",
    "description": "Pabrik dan jasa maklon herbal terpercaya di Indonesia melayani formulasi minuman serbuk, kapsul herbal, teh herbal berstandar BPOM & Halal.",
    "sameAs": [
      "https://instagram.com/indogreennature",
      "https://facebook.com/indogreennature",
      "https://tiktok.com/@indogreennature"
    ]
  };

  return (
    <html
      lang="id"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", outfit.variable, moderustic.variable, poiretOne.variable)}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <GlobalThemeApplier />
          {children}
          <Toaster />
          <ToastUiToaster />
          <PWAInstallPrompt />
          <PushNotificationManager />
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
