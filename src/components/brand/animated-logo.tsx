'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LogoMark } from './logo-mark';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
  className?: string;
  animateIn?: boolean;
}

export function AnimatedLogo({ className, animateIn = false }: AnimatedLogoProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();

  const textVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { delay: 0.8, duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div 
      className={cn("flex items-center gap-3 cursor-pointer group outline-none focus-visible:ring-2 rounded-lg", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      role="link"
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
    </div>
  );
}
