'use client';

import * as React from 'react';
import { LocationSetup } from '@/components/prayer/location-setup';
import { PrayerTimeline } from '@/components/prayer/prayer-timeline';
import { HijriHeroCard } from '@/components/prayer/hijri-hero-card';
import { SettingsSheet } from '@/components/prayer/settings-sheet';
import { SplashScreen } from '@/components/ui/splash-screen';
import { AnimatedLogo } from '@/components/brand/animated-logo';
import { useLocationStore } from '@/lib/store/locationStore';
import { cn } from '@/lib/utils';

export default function Home() {
  const [isMounted, setIsMounted] = React.useState(false);
  const { lat, lng } = useLocationStore();
  const hasLocation = lat !== null && lng !== null;

  React.useEffect(() => {
    // Add a slight intentional delay for the splash screen so it doesn't flash
    // and hides the initial location/time calculation jitter
    const timer = setTimeout(() => setIsMounted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SplashScreen show={!isMounted} />
      <main className={cn(
        "flex min-h-screen flex-col items-center justify-start p-4 pt-6 md:p-12 relative z-10 transition-opacity duration-1000",
        !isMounted ? "opacity-0" : "opacity-100"
      )}>
        <div className="w-full max-w-2xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex items-center justify-between w-full pb-4">
          <AnimatedLogo />
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
    </>
  );
}
