'use client';

import * as React from 'react';
import { LocationSetup } from '@/components/prayer/location-setup';
import { PrayerTimeline } from '@/components/prayer/prayer-timeline';
import { HijriHeroCard } from '@/components/prayer/hijri-hero-card';
import { SettingsSheet } from '@/components/prayer/settings-sheet';
import { useLocationStore } from '@/lib/store/locationStore';

export default function Home() {
  const { lat, lng } = useLocationStore();
  const hasLocation = lat !== null && lng !== null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 pt-12 md:p-24 relative z-10">
      
      {/* Top Navigation/Header */}
      <div className="absolute top-6 right-6 z-50">
        <SettingsSheet />
      </div>

      <div className="w-full max-w-md mx-auto space-y-6">
        
        {/* Hijri Hero - only show if we have location, as the app 'starts' fully once location is set */}
        {hasLocation && (
          <div className="mb-8">
            <HijriHeroCard />
          </div>
        )}

        {!hasLocation ? (
          <div className="bg-card p-6 rounded-3xl border border-border shadow-lg mt-12">
            <h1 className="text-3xl font-heading font-bold mb-2 text-center">Miqaat</h1>
            <p className="text-muted-foreground font-sans text-sm text-center mb-8">
              Living Prayer Timeline
            </p>
            <h2 className="text-xl font-heading font-semibold mb-4 text-center">Set your location</h2>
            <LocationSetup />
          </div>
        ) : (
          <div className="bg-card p-6 pb-8 rounded-3xl border border-border shadow-lg">
            <PrayerTimeline />
          </div>
        )}
      </div>
    </main>
  );
}
