import type { Metadata } from 'next';
import { LandingContent } from './landing-content';

export const metadata: Metadata = {
  title: 'Miqaat — Software That Moves with the Sky',
  description:
    'A premium, privacy-first Islamic daily companion. Prayer times calculated from the sun, Hijri calendar, Qibla compass, and daily reflections — no account required.',
  openGraph: {
    title: 'Miqaat — Software That Moves with the Sky',
    description:
      'A premium, privacy-first Islamic daily companion. Prayer times, Hijri calendar, Qibla compass — no account required.',
    url: 'https://miqaat-beta.vercel.app/welcome',
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
