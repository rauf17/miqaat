'use client';

import * as React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogoMarkProps extends React.ComponentProps<typeof motion.svg> {
  animateIn?: boolean;
  isHovered?: boolean;
  reducedMotion?: boolean;
}

export function LogoMark({ animateIn = false, isHovered = false, reducedMotion = false, className, ...props }: LogoMarkProps) {
  
  // Animation variants
  const lineVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  };

  const sunVariants: Variants = {
    hidden: { y: 6, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { delay: 0.3, duration: 0.5, ease: "easeOut" }
    },
    hover: {
      y: -2,
      filter: "drop-shadow(0px 0px 4px var(--logo-sun))",
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  };

  const archVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { delay: 0.6, duration: 0.4, ease: "easeIn" }
    }
  };

  const starsVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { delay: 0.7, duration: 0.4 }
    }
  };

  return (
    <motion.svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      className={cn("text-[var(--logo-base)]", className)}
      initial={animateIn && !reducedMotion ? "hidden" : "visible"}
      animate={isHovered ? "hover" : "visible"}
      {...props}
    >
      {/* Horizon */}
      <motion.line 
        x1="2" y1="19" x2="22" y2="19" 
        stroke="var(--logo-base)"
        fill="none"
        variants={lineVariants}
      />
      
      {/* Sun / Moon - Bisected by horizon */}
      <motion.circle 
        cx="12" 
        cy="17" 
        r="4" 
        fill="var(--logo-sun)" 
        stroke="none" 
        variants={sunVariants}
      />
      
      {/* Night Stars (Controlled by CSS variable opacity) */}
      <motion.g 
        fill="var(--logo-sun)" 
        stroke="none" 
        style={{ opacity: 'var(--logo-star-opacity)' }}
        data-theme-transition
        variants={starsVariants}
      >
        <circle cx="7" cy="8" r="0.5" />
        <circle cx="17" cy="6" r="0.75" />
        <circle cx="15" cy="11" r="0.5" />
      </motion.g>

      {/* Subtle floating "M" Arch - Open, un-enclosed */}
      <motion.path 
        d="M3 11 C 6 4, 10 8, 12 8 C 14 8, 18 4, 21 11" 
        stroke="var(--logo-base)"
        fill="none"
        strokeLinecap="round"
        variants={archVariants}
      />
    </motion.svg>
  );
}
