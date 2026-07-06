'use client';

import * as React from 'react';
import { LocationSetup } from '@/components/prayer/location-setup';
import { PrayerTimeline } from '@/components/prayer/prayer-timeline';
import { HijriHeroCard } from '@/components/prayer/hijri-hero-card';
import { HijriMonthView } from '@/components/prayer/hijri-month-view';
import { SplashScreen } from '@/components/ui/splash-screen';
import { AnimatedLogo } from '@/components/brand/animated-logo';
import { useLocationStore } from '@/lib/store/locationStore';
import { cn } from '@/lib/utils';
import { CalendarDays, Clock, Settings, Compass } from 'lucide-react';
import Link from 'next/link';
import { NotificationScheduler } from '@/components/prayer/notification-scheduler';
import { WeatherWidget } from '@/components/weather/weather-widget';

export default function Home() {
  const [isMounted, setIsMounted] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'timeline' | 'calendar'>('timeline');
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
      <NotificationScheduler />
      <main className={cn(
        "flex min-h-screen flex-col items-center justify-start p-4 pt-4 md:p-6 relative z-10 transition-opacity duration-1000",
        !isMounted ? "opacity-0" : "opacity-100"
      )}>
        <div className="w-full max-w-2xl mx-auto space-y-4">
        
        {/* Header Section */}
        <header className="flex items-center justify-between w-full pb-4">
          <AnimatedLogo />
          <div className="z-50 flex items-center gap-2">
            <WeatherWidget />
            <Link 
              href="/qibla"
              className="inline-flex p-2.5 rounded-full hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Open Qibla compass"
            >
              <Compass className="w-6 h-6 text-foreground" />
            </Link>
            <Link 
              href="/settings"
              className="inline-flex p-2.5 rounded-full hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Open settings"
            >
              <Settings className="w-6 h-6 text-foreground" />
            </Link>
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
          <div className="w-full mt-2 flex flex-col items-center">
            {/* View Toggle */}
            <div className="flex bg-muted/30 p-1 rounded-full mb-4 border border-border/50 backdrop-blur-md">
              <button
                onClick={() => setViewMode('timeline')}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  viewMode === 'timeline' 
                    ? "bg-card text-foreground shadow-sm ring-1 ring-border/50" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Clock className="w-4 h-4" />
                Timeline
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  viewMode === 'calendar' 
                    ? "bg-card text-foreground shadow-sm ring-1 ring-border/50" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <CalendarDays className="w-4 h-4" />
                Calendar
              </button>
            </div>

            <div className="w-full transition-all duration-500 ease-in-out">
              {viewMode === 'timeline' ? <PrayerTimeline /> : <HijriMonthView />}
            </div>
          </div>
        )}
      </div>
    </main>
    </>
  );
}
