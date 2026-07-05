'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useCurrentPrayer, PRAYER_SEQUENCE, PrayerName } from '@/lib/prayer/useCurrentPrayer';
import { useLocationStore } from '@/lib/store/locationStore';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { calculatePrayerTimes } from '@/lib/prayer/calculate';
import { LiveCountdown } from './live-countdown';
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

  // We need today's times to render the list.
  // We compute it once per render, which is fine since it's just local date math,
  // or we could memoize it.
  // We use the date of the current prayer to generate the timeline.
  // This ensures that if it's 1 AM and Isha is still active, we show yesterday's 
  // timeline instead of today's (which would make all prayers appear as 'future').
  const timelineDate = currentPrayerState?.current.time || new Date();
  
  const timelineTimes = React.useMemo(() => {
    if (lat === null || lng === null) return null;
    return calculatePrayerTimes({
      lat,
      lng,
      date: timelineDate,
      method: calculationMethod,
    });
  }, [lat, lng, calculationMethod, timelineDate]);

  if (!timelineTimes || !currentPrayerState) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground animate-pulse">
        Calculating times...
      </div>
    );
  }

  const { current, next } = currentPrayerState;
  const is24h = timeFormat === '24h';

  return (
    <div className="relative flex flex-col space-y-0 py-6 w-full mx-auto" role="list" aria-label="Prayer Timeline">

      {PRAYER_SEQUENCE.map((prayerName, index) => {
        const time = timelineTimes[prayerName];
        const isCurrent = current.name === prayerName;
        // Strict index comparison ensures logical past/future regardless of minor time drift
        const currentIndex = PRAYER_SEQUENCE.indexOf(current.name);
        const isPast = index < currentIndex;
        const isFuture = index > currentIndex;
        
        // The rail from the first prayer down to the current prayer is completed
        const isRailCompleted = index < currentIndex;
        
        return (
          <div 
            key={prayerName}
            className={cn(
              "timeline-node relative flex items-start gap-8 py-5 group transition-opacity duration-300 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isPast && "opacity-70",
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
                "absolute left-[2.25rem] top-[2.5rem] bottom-[-1.25rem] -translate-x-1/2 -z-10 rounded-full",
                isRailCompleted ? "w-[3px] bg-foreground/30" : "w-[1px] bg-border/50"
              )} />
            )}
            {/* Node marker container */}
            <div className="relative flex h-8 w-16 shrink-0 items-center justify-center">
              {/* Outer Glow (Animated for Current) */}
              {isCurrent && (
                <motion.div
                  layoutId="current-glow"
                  className="absolute inset-0 rounded-full bg-primary/30 blur-xl hidden sm:block motion-safe:block"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              
              {/* Node Circle */}
              <motion.div 
                layout
                className={cn(
                  "relative z-10 h-5 w-5 rounded-full border-[3px] transition-colors duration-500",
                  isCurrent ? "border-primary bg-background shadow-[0_0_20px_var(--color-time-glow)] ring-4 ring-primary/20" : 
                  isPast ? "border-foreground/30 bg-foreground/10" : 
                  "border-muted-foreground/40 bg-background"
                )}
              />
            </div>

            {/* Content */}
            <div className="flex flex-col pt-0.5 w-full">
              <div className="flex items-baseline justify-between">
                <motion.h3 
                  layout
                  className={cn(
                    "text-2xl font-heading font-medium transition-colors",
                    isCurrent ? "text-primary font-bold" : isPast ? "text-muted-foreground/50" : "text-foreground"
                  )}
                >
                  {PRAYER_DISPLAY_NAMES[prayerName]}
                </motion.h3>
                
                <span className={cn(
                  "text-lg font-medium transition-colors",
                  isCurrent ? "text-primary font-bold" : isPast ? "text-foreground/60" : "text-muted-foreground"
                )}>
                  {formatTime(time, is24h)}
                </span>
              </div>

              {/* Countdown & Expansion */}
              <AnimatePresence>
                {((next.name === prayerName) || expandedNode === prayerName) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={themeTransitionPreset}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground bg-muted/40 rounded-xl p-4 border border-border/50">
                      <Clock className="w-5 h-5 text-primary shrink-0" />
                      {next.name === prayerName ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground text-xs uppercase tracking-wider mb-1">Next Prayer</span>
                          <div className="text-lg font-mono tracking-tight text-primary">
                            <LiveCountdown targetTime={next.time} />
                          </div>
                        </div>
                      ) : (
                        <span>{format(time, is24h ? 'HH:mm:ss' : 'hh:mm:ss a')}</span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
