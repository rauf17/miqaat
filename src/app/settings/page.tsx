import type { Metadata } from 'next';
import { SettingsClient } from './settings-client';

export const metadata: Metadata = {
  title: 'Settings — Calculation Method, Madhab & Preferences',
  description:
    'Customize your prayer calculation method, Asr madhab, time format, notification reminders, location, and accessibility preferences.',
  alternates: { canonical: '/settings' },
  openGraph: {
    title: 'Settings — Miqaat',
    description: 'Customize calculation method, madhab, notifications, and accessibility.',
  },
};

export default function SettingsPage() {
  return <SettingsClient />;
}
