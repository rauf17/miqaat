import type { Metadata } from 'next';
import { LandingContent } from './landing-content';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Miqaat — Software That Moves with the Sky',
  description:
    'A premium, privacy-first Islamic daily companion. Prayer times calculated from the sun, Hijri calendar, Qibla compass, and daily reflections — no account required.',
  alternates: { canonical: '/welcome' },
  openGraph: {
    title: 'Miqaat — Software That Moves with the Sky',
    description:
      'A premium, privacy-first Islamic daily companion. Prayer times, Hijri calendar, Qibla compass — no account required.',
    url: `${SITE.siteUrl}/welcome`,
    siteName: 'Miqaat',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miqaat — Software That Moves with the Sky',
    description:
      'A premium, privacy-first Islamic daily companion. No account required.',
  },
};

export default function WelcomePage() {
  return <LandingContent />;
}
