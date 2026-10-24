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
};

// @ts-ignore - next-pwa plugin has a slightly outdated NextConfig type signature in IDE, but not always during build
export default withPWA(nextConfig);
