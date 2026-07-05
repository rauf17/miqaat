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
    <main className="flex min-h-screen flex-col items-center justify-start p-4 pt-6 md:p-12 relative z-10">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex items-center justify-between w-full pb-4">
          <div className="flex items-center gap-3">
            {/* Minimal App Branding / Logo Mark */}
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0 L60 30 L90 20 L75 45 L100 65 L70 70 L65 100 L45 75 L15 95 L25 65 L0 45 L30 35 L15 5 Z" fill="currentColor" className="text-primary opacity-80" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground tracking-tight">Miqaat</h1>
          </div>
          <div className="z-50">
            <SettingsSheet />
          </div>
        </header>

        {/* Hijri Hero */}
        {hasLocation && (
          <div className="w-full">
            <HijriHeroCard />
          </div>
        )}

        {/* Timeline / Setup */}
        {!hasLocation ? (
          <div className="bg-card p-8 rounded-3xl border border-border shadow-lg mt-8">
            <h2 className="text-2xl font-heading font-semibold mb-4 text-center">Set your location</h2>
            <p className="text-muted-foreground font-sans text-sm text-center mb-8">
              We need to know where you are to calculate accurate prayer times based on the sun&apos;s position.
            </p>
            <LocationSetup />
          </div>
        ) : (
          <div className="w-full mt-4">
            <PrayerTimeline />
          </div>
        )}
      </div>
    </main>
  );
}
