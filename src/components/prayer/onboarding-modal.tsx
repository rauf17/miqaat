'use client';

import * as React from 'react';
import { LocationSetup } from './location-setup';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { X, Bell, Compass, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CALCULATION_METHODS, CalculationMethodId } from '@/lib/prayer/methods';

export function OnboardingModal() {
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  
  const { 
    calculationMethod, 
    setCalculationMethod,
    notificationsEnabled,
    setNotificationsEnabled 
  } = useSettingsStore();

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const completed = localStorage.getItem('onboardingCompleted');
    if (!completed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(true);
    }
  }, []);

  if (!mounted || !isOpen) return null;

  const handleComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="space-y-1">
            <h2 className="text-2xl font-heading font-bold text-foreground">Welcome to Miqaat</h2>
            <p className="text-sm text-muted-foreground font-sans">Set up your preferences to get started.</p>
          </div>
          <button 
            onClick={handleComplete}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Skip onboarding"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Location Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Compass className="w-5 h-5 text-primary" />
              <h3>1. Location</h3>
            </div>
            {/* We reuse the LocationSetup */}
            <div className="-mx-6 px-6">
              <LocationSetup />
            </div>
          </div>

          <div className="h-px w-full bg-border/50" />

          {/* Calculation Method */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Compass className="w-5 h-5 text-primary" />
              <h3>2. Calculation Method</h3>
            </div>
            <select
              value={calculationMethod}
              onChange={(e) => setCalculationMethod(e.target.value as CalculationMethodId)}
              className="w-full bg-input/50 border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            >
              {Object.entries(CALCULATION_METHODS).map(([key, method]) => (
                <option key={key} value={key} className="bg-background text-foreground">
                  {method.name}
                </option>
              ))}
            </select>
          </div>

          <div className="h-px w-full bg-border/50" />

          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Bell className="w-5 h-5 text-primary" />
              <h3>3. Notifications</h3>
            </div>
            <label className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors">
              <span className="text-sm font-medium">Enable Prayer Alerts</span>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2" style={{ backgroundColor: notificationsEnabled ? 'hsl(var(--primary))' : 'hsl(var(--muted))' }}>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                />
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </div>
            </label>
          </div>
          
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 bg-card">
          <button 
            onClick={handleComplete}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2"
          >
            Continue to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
