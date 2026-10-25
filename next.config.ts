import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    navigateFallbackDenylist: [/^\/api\/.*/, /^\/auth\/.*/, /^\/login(\/.*)?$/],
    runtimeCaching: [
      {
        urlPattern: ({ url }: { url: URL }) =>
          url.hostname.includes("supabase.co") ||
          url.pathname.startsWith("/auth") ||
          url.pathname.startsWith("/login") ||
          url.pathname.startsWith("/api"),
        handler: "NetworkOnly",
      },
    ],
  },
});

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ivtpcjwwenjdatxxtjqm.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wnozfcqgcmvxvkxbxgfj.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/produk',
        destination: '/our-products',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // 1 Year Cache (31536000s) for all static media, images, and fonts in public folder
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|gif|woff|woff2|ttf|otf|wav|mp3|mp4|webm)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/manifest.webmanifest',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // Service Worker files should revalidate to receive prompt updates
        source: '/(sw.js|workbox-:path*|worker-:path*|firebase-messaging-sw.js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },
};

// @ts-ignore - next-pwa plugin has a slightly outdated NextConfig type signature in IDE, but not always during build
export default withPWA(nextConfig);
