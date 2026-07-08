import type { Metadata } from 'next';
import { QiblaClient } from './qibla-client';

// PSP-020: per-page metadata. Previously all 4 client pages inherited
// the root layout's metadata, so they all shared the same title/description.
export const metadata: Metadata = {
  title: 'Qibla Compass — Direction to the Kaaba',
  description:
    'Find the precise direction to the Kaaba in Mecca from your current location. Live compass on mobile, static bearing on desktop.',
  alternates: { canonical: '/qibla' },
  openGraph: {
    title: 'Qibla Compass — Miqaat',
    description: 'Find the precise direction to the Kaaba from your current location.',
  },
};

export default function QiblaPage() {
  return <QiblaClient />;
}
