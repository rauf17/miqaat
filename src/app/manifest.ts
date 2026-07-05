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
        src: '/icon',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
