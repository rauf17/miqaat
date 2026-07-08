'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useReduceMotion } from '@/lib/theme/use-reduce-motion';
import { useTimeOfDay } from '@/lib/theme/useTimeOfDay';
import { cn } from '@/lib/utils';

export function StreetLamp({ className }: { className?: string }) {
  const reduceMotion = useReduceMotion();
  // THM-026: derive isNight from the theme state (post-sunset) rather
  // than from prayer state. Previously the lamp glow desynced from the
  // sky theme because prayer-based night (post-Isha) doesn't match
  // theme-based night (post-sunset).
  const { timeOfDay } = useTimeOfDay();
  const isNight = timeOfDay === 'night';
  
  // Theme the glow based on time of day (warmer at night, more neutral/subtle in day)
  const glowColor = isNight ? 'rgba(251, 191, 36, 0.4)' : 'rgba(250, 204, 21, 0.2)';
  const bulbColor = isNight ? '#fde68a' : '#fef08a';

  return (
    <div className={cn("relative flex flex-col items-center justify-start z-10 pointer-events-none", className)}>
      {/* Hanging Wire / Base */}
      <div className="w-[1px] h-3 bg-muted-foreground/40" />
      
      {/* Lamp Head */}
      <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-muted-foreground/80">
        <path d="M2 6L4 2H8L10 6H2Z" fill="currentColor" />
        <path d="M4.5 2L6 0L7.5 2" fill="currentColor" />
      </svg>
      
      {/* Bulb Light Element */}
      <div className="w-1.5 h-1.5 rounded-full -mt-0.5 z-10" style={{ backgroundColor: bulbColor, boxShadow: `0 0 4px ${bulbColor}` }} />
      
      {/* Downward Light Spillage / Glow */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.7, 1, 0.8] }}
        transition={reduceMotion ? { duration: 0 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[14px] w-20 h-12 pointer-events-none rounded-t-[100%] rounded-b-full blur-[8px]"
        style={{ 
          background: `radial-gradient(ellipse at top, ${glowColor} 0%, transparent 70%)` 
        }}
      />
    </div>
  );
}
