import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Miqaat - Islamic Daily Companion',
    short_name: 'Miqaat',
    description: 'Your premium Islamic daily companion. Software that moves with the sky.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050B14',
    theme_color: '#050B14',
    icons: [
      {
        // /icon route (src/app/icon.tsx) actually serves image/png via
        // Next.js ImageResponse, not SVG. Previously declared as
        // image/svg+xml which could break PWA install validation
        // (audit MKT-003).
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
