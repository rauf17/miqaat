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

  // THM-006: do NOT animate opacity here — the CSS variable
  // --logo-star-opacity controls it (0 for day/dawn/golden, 1 for night).
  // Previously the variant wrote opacity:1 as inline style, overriding
  // the CSS variable and making stars always visible. Now we animate
  // scale for the entrance effect, and let the CSS variable own opacity.
  const starsVariants: Variants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
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
      aria-hidden="true"
      {...props}
    >
      {/* Horizon */}
      <motion.line 
        x1="2" y1="20" x2="22" y2="20" 
        stroke="var(--logo-base)"
        fill="none"
        variants={lineVariants}
      />
      
      {/* Sun / Moon - Bisected by horizon */}
      <motion.circle 
        cx="12" 
        cy="17" 
        r="3.5" 
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
        d="M2 8 C 6 5, 10 7, 12 7 C 14 7, 18 5, 22 8" 
        stroke="var(--logo-base)"
        fill="none"
        strokeLinecap="round"
        variants={archVariants}
      />
    </motion.svg>
  );
}
