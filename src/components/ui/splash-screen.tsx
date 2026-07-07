'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedLogo } from '@/components/brand/animated-logo';

export function SplashScreen({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-theme-gradient pointer-events-none"
          role="status"
          aria-live="polite"
          aria-label="Loading Miqaat"
        >
          <AnimatedLogo animateIn={true} className="scale-150 pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
