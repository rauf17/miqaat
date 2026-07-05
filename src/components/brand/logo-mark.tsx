'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogoMarkProps extends React.ComponentProps<typeof motion.svg> {
  animateIn?: boolean;
  isHovered?: boolean;
  reducedMotion?: boolean;
}

export function LogoMark({ animateIn = false, isHovered = false, reducedMotion = false, className, ...props }: LogoMarkProps) {
  
  // Animation variants
  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  };

  const sunVariants = {
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

  const archVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { delay: 0.6, duration: 0.4, ease: "easeIn" }
    }
  };

  const starsVariants = {
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
        x1="2" y1="18" x2="22" y2="18" 
        stroke="var(--logo-base)"
        variants={lineVariants}
      />
      
      {/* Sun / Moon */}
      <motion.circle 
        cx="12" 
        cy="15" 
        r="3" 
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

      {/* Subtle "M" Arch */}
      <motion.path 
        d="M4 18 L4 12 C4 4, 9 2, 12 5 C15 2, 20 4, 20 12 L20 18" 
        stroke="var(--logo-base)"
        variants={archVariants}
      />
    </motion.svg>
  );
}
