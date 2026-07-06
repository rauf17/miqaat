'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getHijriMonthGrid, getNextMonth, getPrevMonth, CalendarDay } from '@/lib/hijri/calendar';
import { getEventsForGregorianDate } from '@/lib/hijri/events';
import { toHijri } from '@/lib/hijri/convert';
import { themeTransitionPreset } from '@/lib/theme/motion';
import { cn } from '@/lib/utils';
import { isSameDay } from 'date-fns';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function HijriMonthView() {
  const [currentDate, setCurrentDate] = React.useState<Date | null>(null);
  const [viewState, setViewState] = React.useState<{ year: number, month: string } | null>(null);
  const [direction, setDirection] = React.useState(0);

  React.useEffect(() => {
    const now = new Date();
    setCurrentDate(now);
    const hijri = toHijri(now);
    setViewState({ year: hijri.year, month: hijri.monthName });
  }, []);

  if (!currentDate || !viewState) {
    return <div className="h-96 w-full animate-pulse bg-card border border-border rounded-3xl" />;
  }

  const handlePrev = () => {
    setDirection(-1);
    setViewState(getPrevMonth(viewState.year, viewState.month));
  };

  const handleNext = () => {
    setDirection(1);
    setViewState(getNextMonth(viewState.year, viewState.month));
  };

  const grid = getHijriMonthGrid(viewState.year, viewState.month);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0
    })
  };

  return (
    <div className="w-full bg-card border border-border shadow-lg rounded-3xl p-4 md:p-8 flex flex-col space-y-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <button 
          onClick={handlePrev}
          className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center overflow-hidden">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.h2 
              key={`${viewState.year}-${viewState.month}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={themeTransitionPreset}
              className="text-2xl md:text-3xl font-heading font-bold text-foreground"
            >
              {viewState.month} {viewState.year}
            </motion.h2>
          </AnimatePresence>
        </div>

        <button 
          onClick={handleNext}
          className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Next month"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="w-full relative z-10">
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          {WEEKDAYS.map((day, i) => (
            <div key={day} className={cn(
              "text-center text-[10px] md:text-xs font-medium uppercase tracking-wider py-2",
              i === 5 ? "text-primary/80" : "text-muted-foreground"
            )}>
              {day}
            </div>
          ))}
        </div>
        
        <div className="relative">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={`${viewState.year}-${viewState.month}-grid`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={themeTransitionPreset}
              className="grid grid-cols-7 gap-1 md:gap-2"
            >
              {grid.map((week, wIdx) => (
                <React.Fragment key={wIdx}>
                  {week.map((day, dIdx) => {
                    const isToday = isSameDay(day.date, currentDate);
                    const isFriday = day.date.getDay() === 5;
                    const events = getEventsForGregorianDate(day.date);
                    const hasEvent = !day.isPadding && events.length > 0;
                    
                    return (
                      <div 
                        key={dIdx} 
                        className={cn(
                          "relative aspect-square flex flex-col items-center justify-center p-1 rounded-xl transition-all",
                          day.isPadding ? "opacity-30" : "hover:bg-muted/50",
                          isToday && "ring-2 ring-primary bg-primary/10 shadow-[0_0_15px_var(--color-time-glow)]",
                          isFriday && !isToday && !day.isPadding && "bg-primary/5",
                          hasEvent && !isToday && "ring-1 ring-primary/40 bg-primary/5"
                        )}
                      >
                        {/* Gregorian Date */}
                        <span className="absolute top-1 right-1.5 text-[9px] md:text-[10px] text-muted-foreground/60 font-sans">
                          {day.date.getDate()}
                        </span>

                        {/* Hijri Date */}
                        <span className={cn(
                          "text-lg md:text-2xl font-heading transition-colors mt-2 md:mt-1",
                          isToday ? "text-primary font-bold" : day.isPadding ? "text-muted-foreground" : "text-foreground",
                          isFriday && !isToday && !day.isPadding && "text-primary/80 font-medium"
                        )}>
                          {day.hijri.day}
                        </span>
                        
                        {/* Events */}
                        {hasEvent && (
                          <div className="absolute bottom-1 md:bottom-1.5 flex flex-col items-center w-full px-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mb-0.5 md:hidden" />
                            <span className="hidden md:block text-[9px] leading-tight text-primary font-medium text-center truncate w-full">
                              {events[0].name}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
