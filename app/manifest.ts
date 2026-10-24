import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CV. Indo Green Nature',
    short_name: 'CV. Indo Green Nature',
    description: 'CV. Indo Green Nature - Jasa Maklon Herbal Terpercaya',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#15803D',
    icons: [
      {
        src: '/pwa-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
