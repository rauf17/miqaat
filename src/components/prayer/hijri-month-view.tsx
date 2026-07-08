'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getHijriMonthGrid, getNextMonth, getPrevMonth } from '@/lib/hijri/calendar';
import { getEventsForGregorianDate, IslamicEvent } from '@/lib/hijri/events';
import { toHijri } from '@/lib/hijri/convert';
import { themeTransitionPreset } from '@/lib/theme/motion';
import { cn } from '@/lib/utils';
import { isSameDay } from 'date-fns';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function HijriMonthView() {
  const [currentDate, setCurrentDate] = React.useState<Date | null>(null);
  const [direction, setDirection] = React.useState(0);
  const [selectedEvent, setSelectedEvent] = React.useState<IslamicEvent | null>(null);
  const [viewState, setViewState] = React.useState<{ year: number, month: string } | null>(null);

  React.useEffect(() => {
    const now = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: avoids hydration mismatch with Date()
    setCurrentDate(now);
    const hijri = toHijri(now);
    setViewState({ year: hijri.year, month: hijri.monthName });
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEvent(null);
    };
    if (selectedEvent) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent]);

  // P-H-018/019: memoize the grid per (year, month). Must be called
  // unconditionally (before any early return) to satisfy rules-of-hooks.
  const grid = React.useMemo(
    () => (viewState ? getHijriMonthGrid(viewState.year, viewState.month) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: only re-run when year/month change, not on viewState object identity
    [viewState?.year, viewState?.month]
  );

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
              {/* P-H-009: make the month-year title a button that snaps
                  back to today's hijri month, so users can quickly return
                  after navigating away. */}
              <button
                onClick={() => {
                  if (!currentDate) return;
                  const h = toHijri(currentDate);
                  setViewState({ year: h.year, month: h.monthName });
                  setDirection(0);
                }}
                className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-1"
                aria-label={`Jump to current month. Currently viewing ${viewState.month} ${viewState.year}. Click to return to today.`}
                title="Click to return to today"
              >
                {viewState.month} {viewState.year}
              </button>
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
                        onClick={() => hasEvent && setSelectedEvent(events[0])}
                        role={hasEvent ? "button" : undefined}
                        tabIndex={hasEvent ? 0 : undefined}
                        aria-label={hasEvent ? `${events[0].name} on ${day.date.toDateString()}` : undefined}
                        // A11Y-030: padding days are decorative context, hide from AT
                        aria-hidden={day.isPadding ? true : undefined}
                        className={cn(
                          "group relative aspect-square flex flex-col items-center justify-center p-1 rounded-xl transition-all",
                          // A11Y-030: raised padding opacity from 30 to 40 for better contrast
                          day.isPadding ? "opacity-40" : "hover:bg-muted/50",
                          hasEvent && "cursor-pointer active:scale-95",
                          isToday && "ring-2 ring-primary bg-primary/10 shadow-[0_0_15px_var(--color-time-glow)]",
                          isFriday && !isToday && !day.isPadding && "bg-primary/5",
                          hasEvent && !isToday && "ring-1 ring-primary/40 bg-primary/5 hover:bg-primary/10"
                        )}
                      >
                        {/* Gregorian Date — A11Y-030: raised from /60 to full for contrast */}
                        <span className="absolute top-1 right-1.5 text-[9px] md:text-[10px] text-muted-foreground font-sans">
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
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-full mt-1 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none max-w-[120px] md:max-w-[150px] truncate z-50">
                              {events[0].description}
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

      {/* Event Popup Overlay */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedEvent(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={themeTransitionPreset}
              className="relative w-full max-w-sm bg-card border border-border shadow-2xl rounded-3xl p-6 md:p-8 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-heading font-bold text-primary mb-3 mt-2 pr-6">
                {selectedEvent.name}
              </h3>
              <p className="text-muted-foreground font-sans leading-relaxed text-sm md:text-base">
                {selectedEvent.description}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
