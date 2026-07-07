'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useCurrentPrayer, PRAYER_SEQUENCE, PrayerName } from '@/lib/prayer/useCurrentPrayer';
import { useLocationStore } from '@/lib/store/locationStore';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { calculatePrayerTimes } from '@/lib/prayer/calculate';
import { themeTransitionPreset } from '@/lib/theme/motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formatTime = (date: Date, is24h: boolean) => {
  return format(date, is24h ? 'HH:mm' : 'h:mm a');
};

const PRAYER_DISPLAY_NAMES: Record<PrayerName, string> = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

export function PrayerTimeline() {
  const { lat, lng } = useLocationStore();
  const { calculationMethod, timeFormat } = useSettingsStore();
  const currentPrayerState = useCurrentPrayer();
  const [expandedNode, setExpandedNode] = React.useState<PrayerName | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedNode(null);
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.timeline-node')) {
        setExpandedNode(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Memoize the fallback date so `new Date()` doesn't create a new reference
  // on every render (which would invalidate useMemo and cause an infinite loop).
  const stableFallbackDate = React.useMemo(() => new Date(), []);
  const timelineDate = currentPrayerState?.current.time ?? stableFallbackDate;
  
  const timelineTimes = React.useMemo(() => {
    if (lat === null || lng === null) return null;
    return calculatePrayerTimes({
      lat,
      lng,
      date: timelineDate,
      method: calculationMethod,
    });
  }, [lat, lng, calculationMethod, timelineDate]);

  const is24h = timeFormat === '24h';
  const isLoading = !timelineTimes || !currentPrayerState;

  return (
    <div className="relative flex flex-col space-y-0 py-1 w-full mx-auto" role="list" aria-label="Prayer Timeline">
      {PRAYER_SEQUENCE.map((prayerName, index) => {
        const time = timelineTimes ? timelineTimes[prayerName] : null;
        const isCurrent = !isLoading && currentPrayerState?.current.name === prayerName;
        const currentIndex = !isLoading && currentPrayerState ? PRAYER_SEQUENCE.indexOf(currentPrayerState.current.name) : -1;
        const isPast = !isLoading && index < currentIndex;
        const isFuture = !isLoading && index > currentIndex;
        const isRailCompleted = !isLoading && index < currentIndex;

        return (
          <div 
            key={prayerName}
            className={cn(
              "timeline-node relative flex items-start gap-8 py-2 group rounded-2xl outline-none",
              !isLoading && "transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-primary",
              isPast && "opacity-50",
              isFuture && "cursor-pointer hover:bg-muted/20"
            )}
            role={isFuture ? "button" : "listitem"}
            tabIndex={isFuture ? 0 : undefined}
            aria-expanded={isFuture ? expandedNode === prayerName : undefined}
            onClick={() => {
              if (isFuture) setExpandedNode(expandedNode === prayerName ? null : prayerName);
            }}
            onKeyDown={(e) => {
              if (isFuture && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                setExpandedNode(expandedNode === prayerName ? null : prayerName);
              }
            }}
          >
            {/* Segment connecting to next node */}
            {index < PRAYER_SEQUENCE.length - 1 && (
              <div className={cn(
                "absolute left-[2.25rem] top-[1.75rem] bottom-[-0.75rem] -translate-x-1/2 -z-10 rounded-full",
                isLoading ? "w-[1px] bg-muted/20" :
                isRailCompleted ? "w-[3px] bg-primary/50 transition-all duration-500" : "w-[1px] bg-border/50 transition-all duration-500"
              )} />
            )}
            {/* Node marker container */}
            <div className="relative flex h-8 w-16 shrink-0 items-center justify-center">
              {/* Outer Glow (Animated for Current using CSS animation instead of Framer Motion) */}
              {!isLoading && isCurrent && (
                <div
                  className="absolute inset-0 rounded-full bg-primary/30 blur-xl hidden sm:block motion-safe:animate-current-glow"
                />
              )}
              
              {/* Node Circle (plain HTML div to avoid Framer Motion tracking) */}
              <div 
                className={cn(
                  "relative z-10 h-5 w-5 rounded-full border-[3px]",
                  isLoading ? "border-muted-foreground/20 bg-muted/10" : 
                  "transition-colors duration-500",
                  !isLoading && (
                    isCurrent ? "border-primary bg-background shadow-[0_0_20px_var(--color-time-glow)] ring-4 ring-primary/20" : 
                    isPast ? "border-foreground/30 bg-foreground/10" : 
                    "border-muted-foreground/40 bg-background"
                  )
                )}
              />
            </div>

            {/* Content */}
            <div className="flex flex-col pt-0.5 w-full">
              <div className="flex items-baseline justify-between">
                {/* plain HTML h3 to avoid Framer Motion tracking */}
                <h3 
                  className={cn(
                    "text-xl font-heading font-medium",
                    isLoading ? "text-muted-foreground/40" : 
                    "transition-colors duration-500",
                    !isLoading && (
                      isCurrent ? "text-primary font-bold" : isPast ? "text-muted-foreground/50" : "text-foreground"
                    )
                  )}
                >
                  {PRAYER_DISPLAY_NAMES[prayerName]}
                </h3>
                
                <span className={cn(
                  "text-lg font-medium",
                  isLoading ? "text-muted-foreground/20" : 
                  "transition-colors duration-500",
                  !isLoading && (
                    isCurrent ? "text-primary font-bold" : isPast ? "text-muted-foreground" : "text-foreground"
                  )
                )}>
                  {isLoading ? "--:--" : formatTime(time!, is24h)}
                </span>
              </div>

              {/* Countdown & Expansion */}
              {!isLoading && (
                <AnimatePresence>
                  {(expandedNode === prayerName) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={themeTransitionPreset}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground bg-muted/40 rounded-xl p-2.5 border border-border/50">
                        <Clock className="w-5 h-5 text-primary shrink-0" />
                        <span>{format(time!, is24h ? 'HH:mm:ss' : 'hh:mm:ss a')}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
