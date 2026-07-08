'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

import { AnimatedLogo } from '@/components/brand/animated-logo';
import { HeaderDropdown } from '@/components/layout/header-dropdown';
import dynamic from 'next/dynamic';

const QiblaCompass = dynamic(
  () => import('@/components/qibla/qibla-compass').then(mod => mod.QiblaCompass),
  { ssr: false, loading: () => <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-border bg-card/50 animate-pulse" /> }
);
import { LocationSetup } from '@/components/prayer/location-setup';
import { useLocationStore } from '@/lib/store/locationStore';

export function QiblaClient() {
  const { lat, lng } = useLocationStore();
  const hasLocation = lat !== null && lng !== null;

  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex min-h-screen flex-col items-center justify-start p-4 pt-6 md:p-12 relative z-10"
    >
      <div className="w-full max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex items-center justify-between w-full pb-4">
          <AnimatedLogo />
          <HeaderDropdown />
        </header>

        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Qibla</h1>
          <p className="text-muted-foreground font-sans">
            Find the direction to the Kaaba from your current location.
          </p>
        </div>

        <div className="pt-8 flex flex-col items-center w-full">
          {!hasLocation ? (
            <div className="bg-card p-8 rounded-3xl border border-border shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-heading font-semibold mb-4 text-center">Set your location</h2>
              <p className="text-muted-foreground font-sans text-sm text-center mb-8">
                We need to know where you are to calculate the Qibla bearing.
              </p>
              <LocationSetup />
            </div>
          ) : (
            <QiblaCompass />
          )}
        </div>

      </div>
    </motion.main>
  );
}
