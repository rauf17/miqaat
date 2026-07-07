import type { Metadata } from 'next';
import { WeatherClient } from './weather-client';

export const metadata: Metadata = {
  title: 'Weather Forecast — Live Conditions & 7-Day Outlook',
  description:
    'Live local weather conditions, 24-hour and 7-day forecasts, sunrise/sunset times, and moon phase data for your location.',
  alternates: { canonical: '/weather' },
  openGraph: {
    title: 'Weather Forecast — Miqaat',
    description: 'Live local weather, 24-hour and 7-day forecasts, sun & moon data.',
  },
};

export default function WeatherPage() {
  return <WeatherClient />;
}
