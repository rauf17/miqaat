'use client';

import * as React from 'react';
import { PrayerTimeline } from '@/components/prayer/prayer-timeline';
import dynamic from 'next/dynamic';

const HijriMonthView = dynamic(
  () => import('@/components/prayer/hijri-month-view').then(mod => mod.HijriMonthView),
  { ssr: false, loading: () => <div className="h-[384px] w-full animate-pulse bg-card/50 border border-border/50 rounded-3xl" /> }
);

const DailyContentPanel = dynamic(
  () => import('@/components/reflection/daily-content-panel').then(mod => mod.DailyContentPanel),
  { ssr: false, loading: () => <div className="h-64 w-full animate-pulse bg-card/60 border border-border/50 shadow-sm rounded-3xl mt-6" /> }
);
import { SplashScreen } from '@/components/ui/splash-screen';
import { AnimatedLogo } from '@/components/brand/animated-logo';
import { useLocationStore } from '@/lib/store/locationStore';
import { useWeatherStore } from '@/lib/store/weatherStore';
import { useCurrentPrayer, PrayerName } from '@/lib/prayer/useCurrentPrayer';
import { toHijri } from '@/lib/hijri/convert';
import { format } from 'date-fns';
import { getWeatherIcon } from '@/lib/weather/utils';
import { cn } from '@/lib/utils';
import { CalendarDays, Clock, Settings, Compass, CloudOff } from 'lucide-react';
import Link from 'next/link';
import { NotificationScheduler } from '@/components/prayer/notification-scheduler';
import { LiveCountdown } from '@/components/prayer/live-countdown';
import { OnboardingModal } from '@/components/prayer/onboarding-modal';

const PRAYER_DISPLAY_NAMES: Record<PrayerName, string> = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

function WeatherInline() {
  const { data, loading, error } = useWeatherStore();

  if (loading) {
    return <div className="w-12 h-4 animate-pulse bg-foreground/10 rounded" />;
  }

  if (error || !data) {
    return (
      <div className="flex items-center gap-1 text-muted-foreground/50">
        <CloudOff className="w-4 h-4" />
      </div>
    );
  }

  const { tempC, conditionCode } = data.current;
  const Icon = getWeatherIcon(conditionCode);

  return (
    <Link href="/weather" className="flex items-center gap-1.5 hover:text-foreground transition-colors group">
      {React.createElement(Icon, { className: "w-4 h-4 text-foreground/70 group-hover:text-foreground transition-colors" })}
      <span>{tempC}°</span>
    </Link>
  );
}

export default function Home() {
  const [isMounted, setIsMounted] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'timeline' | 'calendar'>('timeline');
  const { lat, lng, city } = useLocationStore();
  const currentPrayerState = useCurrentPrayer();
  const hasLocation = lat !== null && lng !== null;

  const [date, setDate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const tick = () => setDate(new Date());
    tick();
    const intervalId = setInterval(tick, 60000);
    
    const timer = setTimeout(() => setIsMounted(true), 800);
    
    return () => {
      clearInterval(intervalId);
      clearTimeout(timer);
    };
  }, []);

  const greeting = React.useMemo(() => {
    if (!date) return 'Welcome';
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
  }, [date]);

  const hijri = date ? toHijri(date) : null;
  const gregorian = date ? format(date, 'MMMM d, yyyy') : null;
  const weekday = date ? format(date, 'EEEE') : null;

  return (
    <>
      <SplashScreen show={!isMounted} />
      <NotificationScheduler />
      <main className={cn(
        "flex min-h-screen flex-col items-center justify-start p-4 pt-4 md:p-6 relative z-10 transition-opacity duration-1000",
        !isMounted ? "opacity-0" : "opacity-100"
      )}>
        <div className="w-full max-w-md mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col w-full pb-2 relative z-50">
          <div className="flex items-center justify-between w-full">
            <AnimatedLogo />
            <div className="flex items-center gap-2">
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
          </div>
          <div className="pl-[3.25rem] -mt-1">
            <p className="text-[11px] font-sans font-medium text-muted-foreground/60 uppercase tracking-widest">
              Software that moves with the sky
            </p>
          </div>
        </header>

        {/* Unified Today Flow */}
        <OnboardingModal />
        {!hasLocation ? (
          <div className="flex flex-col items-center text-center space-y-4 pt-12">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground leading-tight tracking-tight">
               {greeting},<br />
               <span className="text-foreground/80">Traveler</span>
            </h1>
            <p className="text-muted-foreground font-sans text-sm text-center max-w-sm">
              Your location is needed to calculate prayer times. Please grant location access in the onboarding menu.
            </p>
          </div>
        ) : (
          <div className="flex flex-col space-y-12">
            
            {/* 1. Greeting & Date & Weather */}
            <div className="flex flex-col items-center text-center space-y-3 pt-4">
              <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-widest uppercase text-muted-foreground">
                 <span>{weekday}</span>
                 <span className="text-muted-foreground/30">•</span>
                 <span>{gregorian}</span>
                 <span className="text-muted-foreground/30">•</span>
                 <WeatherInline />
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground leading-tight tracking-tight">
                 {greeting},<br />
                 <span className="text-foreground/80">{city || 'Traveler'}</span>
              </h1>
              {hijri && (
                <div className="text-primary font-heading font-medium text-lg mt-1">
                   {hijri.day} {hijri.monthName} {hijri.year} AH
                </div>
              )}
            </div>

            {/* 2. Visual Centerpiece: Next Prayer & Countdown */}
            {currentPrayerState && (
              <div className="flex flex-col items-center justify-center py-6 relative">
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -z-10" />
                <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">Next Prayer</p>
                <h2 className="text-6xl md:text-7xl font-heading font-bold text-foreground tracking-tight">
                  {PRAYER_DISPLAY_NAMES[currentPrayerState.next.name]}
                </h2>
                <div className="text-3xl font-mono text-primary/80 mt-4 font-light tracking-tight">
                  <LiveCountdown targetTime={currentPrayerState.next.time} />
                </div>
              </div>
            )}

            {/* 3. Timeline */}
            <div className="w-full flex flex-col items-center">
              {/* View Toggle */}
              <div className="flex bg-muted/30 p-1 rounded-full mb-6 border border-border/50 backdrop-blur-md">
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

              <div className="w-full transition-all duration-500 ease-in-out px-2">
                {viewMode === 'timeline' ? <PrayerTimeline /> : <HijriMonthView />}
              </div>
            </div>

            {/* 4. Reflection */}
            <div className="w-full pb-8">
              <DailyContentPanel />
            </div>

          </div>
        )}
      </div>
    </main>
    </>
  );
}
