'use client';

import * as React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Settings } from 'lucide-react';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { CALCULATION_METHODS, CalculationMethodId } from '@/lib/prayer/methods';
import { LocationSetup } from './location-setup';
import { cn } from '@/lib/utils';

export function SettingsSheet() {
  const { calculationMethod, setCalculationMethod, timeFormat, setTimeFormat } = useSettingsStore();

  return (
    <Sheet>
      <SheetTrigger 
        className="p-2 rounded-full hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Open settings"
      >
        <Settings className="w-5 h-5 text-foreground" />
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-md" aria-describedby="settings-description">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-heading text-2xl">Settings</SheetTitle>
          <SheetDescription id="settings-description">
            Customize your location, calculation methods, and preferences.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 pb-12">
          {/* Location Override */}
          <section className="space-y-4">
            <h3 className="font-heading font-medium text-lg">Location</h3>
            <div className="rounded-2xl border border-border bg-card p-4">
              <LocationSetup />
            </div>
          </section>

          {/* Time Format */}
          <section className="space-y-4">
            <h3 className="font-heading font-medium text-lg">Time Format</h3>
            <div 
              className="flex p-1 rounded-xl bg-muted/50" 
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
                    "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    timeFormat === format 
                      ? "bg-card shadow-sm text-foreground ring-1 ring-border" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </section>

          {/* Calculation Method */}
          <section className="space-y-4">
            <h3 className="font-heading font-medium text-lg">Calculation Method</h3>
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
                      "flex flex-col p-4 rounded-xl border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isSelected 
                        ? "border-primary bg-primary/5 shadow-sm" 
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn("font-medium", isSelected ? "text-primary" : "text-foreground")}>
                        {method.name}
                      </span>
                      {/* Custom Radio Circle */}
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                        isSelected ? "border-primary" : "border-muted-foreground/50"
                      )}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {method.regionDescription}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
