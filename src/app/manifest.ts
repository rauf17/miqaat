import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    // PSP-027 / MKT-022: added id, lang, dir, categories, shortcuts.
    // PSP-026: added purpose: 'any' on the 512px icon.
    // MKT-003: fixed icon type from image/svg+xml to image/png.
    id: '/',
    name: 'Miqaat - Islamic Daily Companion',
    short_name: 'Miqaat',
    description: 'Your premium Islamic daily companion. Software that moves with the sky.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050B14',
    theme_color: '#050B14',
    lang: 'en',
    dir: 'ltr',
    categories: ['lifestyle', 'religion', 'productivity'],
    icons: [
      {
        // /icon route (src/app/icon.tsx) serves image/png via Next.js
        // ImageResponse, not SVG. Previously declared as image/svg+xml
        // which could break PWA install validation (audit MKT-003).
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        // PSP-026: also declare as maskable so Android adaptive icons
        // work. The /icon route renders a circular logo which isn't
        // truly maskable-safe (logo should be within inner 80% safe
        // zone), but declaring it is better than omitting.
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: 'Qibla',
        short_name: 'Qibla',
        description: 'Find the direction to the Kaaba',
        url: '/qibla',
      },
      {
        name: 'Weather',
        short_name: 'Weather',
        description: 'Live weather forecast',
        url: '/weather',
      },
      {
        name: 'Settings',
        short_name: 'Settings',
        description: 'Customize prayer calculation and preferences',
        url: '/settings',
      },
    ],
  };
}
