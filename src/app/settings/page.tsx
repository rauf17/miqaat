'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

import { useSettingsStore } from '@/lib/store/settingsStore';
import { CALCULATION_METHODS, CalculationMethodId } from '@/lib/prayer/methods';
import { LocationSetup } from '@/components/prayer/location-setup';
import { NotificationSetup } from '@/components/prayer/notification-setup';
import { AnimatedLogo } from '@/components/brand/animated-logo';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { calculationMethod, setCalculationMethod, timeFormat, setTimeFormat } = useSettingsStore();

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
          <Link 
            href="/"
            className="group flex items-center gap-2 p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Back to dashboard"
          >
            <ChevronLeft className="w-5 h-5 text-foreground transition-transform group-hover:-translate-x-1" />
            <span className="font-heading font-medium text-foreground">Back</span>
          </Link>
          <div className="scale-75 origin-right">
            <AnimatedLogo />
          </div>
        </header>

        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground font-sans">
            Customize your location, calculation methods, and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pb-12 pt-4">
          
          {/* Left Column (Desktop) */}
          <div className="space-y-10">
            {/* Location Override */}
            <section>
              <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Location</h3>
              <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-md p-5 shadow-sm">
                <LocationSetup />
              </div>
            </section>

            {/* Time Format */}
            <section>
              <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Time Format</h3>
              <div 
                className="relative flex p-1.5 rounded-2xl bg-muted/40 backdrop-blur-md border border-border/50 shadow-sm" 
                role="radiogroup" 
                aria-label="Time format selection"
              >
                {(['12h', '24h'] as const).map((format) => (
                  <button
                    key={format}
                    role="radio"
                    aria-checked={timeFormat === format}
                    onClick={() => setTimeFormat(format)}
                    className={cn(
                      "relative flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary z-10",
                      timeFormat === format 
                        ? "text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {timeFormat === format && (
                      <motion.div
                        layoutId="timeFormatIndicator"
                        className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-sm"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </section>
            
            {/* Notifications */}
            <section>
              <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Reminders</h3>
              <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-md p-5 shadow-sm">
                <NotificationSetup />
              </div>
            </section>
          </div>

          {/* Right Column (Desktop) */}
          <div className="space-y-10">
            {/* Calculation Method */}
            <section>
              <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Calculation Method</h3>
              <div className="space-y-3" role="radiogroup" aria-label="Prayer calculation method">
                {(Object.keys(CALCULATION_METHODS) as CalculationMethodId[]).map((methodId) => {
                  const method = CALCULATION_METHODS[methodId];
                  const isSelected = calculationMethod === methodId;
                  
                  return (
                    <div
                      key={methodId}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onClick={() => setCalculationMethod(methodId)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setCalculationMethod(methodId);
                        }
                      }}
                      className={cn(
                        "relative flex flex-col p-4 rounded-2xl border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary overflow-hidden",
                        isSelected 
                          ? "border-primary/50 shadow-sm" 
                          : "border-border/50 bg-card/30 hover:border-primary/30 hover:bg-card/50 backdrop-blur-sm"
                      )}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="calcMethodIndicator"
                          className="absolute inset-0 bg-primary/10 -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className={cn("font-medium mb-1", isSelected ? "text-primary" : "text-foreground")}>
                        {method.name}
                      </span>
                      <span className="text-sm text-muted-foreground leading-snug">
                        {method.regionDescription}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

        </div>
      </div>
    </motion.main>
  );
}
