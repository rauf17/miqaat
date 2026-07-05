'use client';

import * as React from 'react';
import { toHijri } from '@/lib/hijri/convert';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export function HijriHeroCard() {
  const [date, setDate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    // Set date only on client to avoid hydration mismatch
    const tick = () => setDate(new Date());
    tick();
    
    // We only need to check daily if the date rolled over, but since this app
    // expects to be open for long periods, we can just update it occasionally.
    const intervalId = setInterval(tick, 60000); // every minute check
    
    return () => clearInterval(intervalId);
  }, []);

  if (!date) {
    return <div className="h-32 animate-pulse" />;
  }

  const hijri = toHijri(date);
  const gregorian = format(date, 'MMMM d, yyyy');
  const weekday = format(date, 'EEEE');

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center space-y-4 w-full">
      <div className="flex flex-col space-y-1">
        <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
          {weekday}
        </span>
        <span className="text-sm text-muted-foreground/80">
          {gregorian}
        </span>
      </div>

      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary tracking-tight">
          {hijri.day} {hijri.monthName}
        </h2>
        <span className="text-xl font-heading font-medium text-primary/80 mt-2">
          {hijri.year} AH
        </span>
      </motion.div>
    </div>
  );
}
