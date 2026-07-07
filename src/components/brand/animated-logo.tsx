'use client';

import * as React from 'react';
import { motion, useReducedMotion, Variants, AnimatePresence } from 'framer-motion';
import { LogoMark } from './logo-mark';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
  className?: string;
  animateIn?: boolean;
}

export function AnimatedLogo({ className, animateIn = false }: AnimatedLogoProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();

  const textVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { delay: 0.8, duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      role="link"
      aria-describedby={isHovered ? "miqaat-tooltip" : undefined}
      className={cn("flex items-center gap-3 cursor-pointer group outline-none focus-visible:ring-2 rounded-lg relative", className)}
    >
      <LogoMark 
        className="w-10 h-10 shrink-0" 
        animateIn={animateIn} 
        isHovered={isHovered} 
        reducedMotion={prefersReducedMotion!} 
      />
      
      <motion.span 
        className="text-2xl font-brand font-semibold text-foreground tracking-widest uppercase"
        initial={animateIn && !prefersReducedMotion ? "hidden" : "visible"}
        animate="visible"
        variants={textVariants}
      >
        Miqaat
      </motion.span>

      {/* Custom Theme-Aware Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 p-4 w-64 bg-card/80 backdrop-blur-md border border-border rounded-xl shadow-lg z-50 pointer-events-none"
            role="tooltip"
            id="miqaat-tooltip"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-end justify-between">
                <span className="font-heading font-semibold text-primary tracking-wide">Miqaat</span>
                <span className="font-arabic text-xl text-foreground" dir="rtl">مِيقَات</span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium border-b border-border/50 pb-2 mb-1">
                /miːˈqɑːt/
              </span>
              <p className="text-sm font-sans text-foreground/90 leading-relaxed pt-1">
                The appointed time <span className="text-primary/70">&mdash;</span> a sacred moment.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
