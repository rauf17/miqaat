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

  // We need today's times to render the list.
  // We compute it once per render, which is fine since it's just local date math,
  // or we could memoize it.
  const todayTimes = React.useMemo(() => {
    if (lat === null || lng === null) return null;
    return calculatePrayerTimes({
      lat,
      lng,
      date: new Date(),
      method: calculationMethod,
    });
  }, [lat, lng, calculationMethod]);

  if (!todayTimes || !currentPrayerState) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground animate-pulse">
        Calculating times...
      </div>
    );
  }

  const { current, next } = currentPrayerState;
  const is24h = timeFormat === '24h';

  return (
    <div className="relative flex flex-col space-y-0 py-6 w-full mx-auto">
      {/* Central rail line */}
      <div className="absolute left-[2.25rem] top-10 bottom-10 w-0.5 bg-border -z-10" />

      {PRAYER_SEQUENCE.map((prayerName) => {
        const time = todayTimes[prayerName];
        const isCurrent = current.name === prayerName;
        const isNext = next.name === prayerName;
        const isPast = time.getTime() < currentPrayerState.now.getTime() && !isCurrent;
        
        return (
          <div 
            key={prayerName}
            className="relative flex items-start gap-8 py-5 cursor-pointer group"
            onClick={() => setExpandedNode(expandedNode === prayerName ? null : prayerName)}
          >
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
                  isPast ? "border-border bg-background/50" : 
                  "border-muted-foreground bg-background"
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
                  isCurrent ? "text-primary font-bold" : isPast ? "text-muted-foreground/50" : "text-muted-foreground"
                )}>
                  {formatTime(time, is24h)}
                </span>
              </div>

              {/* Countdown & Expansion */}
              <AnimatePresence>
                {(isNext || expandedNode === prayerName) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={themeTransitionPreset}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground bg-muted/40 rounded-xl p-4 border border-border/50">
                      <Clock className="w-5 h-5 text-primary shrink-0" />
                      {isNext ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground text-xs uppercase tracking-wider mb-1">Next Prayer</span>
                          <div className="text-lg font-mono tracking-tight text-primary">
                            <LiveCountdown targetTime={next.time} />
                          </div>
                        </div>
                      ) : (
                        <span>Exact time: {format(time, is24h ? 'HH:mm:ss' : 'hh:mm:ss a')}</span>
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
