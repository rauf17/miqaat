'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

import { useSettingsStore } from '@/lib/store/settingsStore';
import { CALCULATION_METHODS, CalculationMethodId } from '@/lib/prayer/methods';
import { LocationSetup } from '@/components/prayer/location-setup';
import { NotificationSetup } from '@/components/prayer/notification-setup';
import { AnimatedLogo } from '@/components/brand/animated-logo';
import { HeaderDropdown } from '@/components/layout/header-dropdown';
import { cn } from '@/lib/utils';

export function SettingsClient() {
  const { calculationMethod, setCalculationMethod, timeFormat, setTimeFormat, madhab, setMadhab, language, setLanguage, reduceMotion, setReduceMotion, largerText, setLargerText } = useSettingsStore();

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

            {/* Asr Calculation (Madhab) */}
            <section>
              <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Asr Calculation (Madhab)</h3>
              <div 
                className="relative flex p-1.5 rounded-2xl bg-muted/40 backdrop-blur-md border border-border/50 shadow-sm" 
                role="radiogroup" 
                aria-label="Asr calculation method"
              >
                {(['shafi', 'hanafi'] as const).map((m) => (
                  <button
                    key={m}
                    role="radio"
                    aria-checked={madhab === m}
                    onClick={() => setMadhab(m)}
                    className={cn(
                      "relative flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary z-10 capitalize",
                      madhab === m 
                        ? "text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {madhab === m && (
                      <motion.div
                        layoutId="madhabIndicator"
                        className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-sm"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {m}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Hanafi Asr begins when shadow length is twice the object&apos;s length. Shafi/Standard begins at single length.
              </p>
            </section>

            {/* Language Selection */}
            <section>
              <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Language (Scaffold)</h3>
              <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-md p-5 shadow-sm space-y-4">
                <select 
                  className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  aria-label="Select language"
                >
                  <option value="en">English</option>
                  <option value="ar" disabled>Arabic (Coming Soon)</option>
                  <option value="ur" disabled>Urdu (Coming Soon)</option>
                </select>
              </div>
            </section>

            {/* Accessibility */}
            <section>
              <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Accessibility</h3>
              <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-md p-5 shadow-sm flex flex-col gap-4">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Reduce Motion</h4>
                    <p className="text-sm text-muted-foreground">Minimize decorative animations.</p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={reduceMotion}
                    onClick={() => setReduceMotion(!reduceMotion)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      reduceMotion ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span className="sr-only">Reduce Motion</span>
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        reduceMotion ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Larger Text</h4>
                    <p className="text-sm text-muted-foreground">Increase base font size.</p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={largerText}
                    onClick={() => setLargerText(!largerText)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      largerText ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span className="sr-only">Larger Text</span>
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        largerText ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>

              </div>
            </section>
          </div>

        </div>
      </div>
    </motion.main>
  );
}
