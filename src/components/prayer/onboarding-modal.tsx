'use client';

import * as React from 'react';
import { LocationSetup } from './location-setup';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { X, Bell, Compass, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CALCULATION_METHODS, CalculationMethodId } from '@/lib/prayer/methods';

/**
 * Onboarding modal shown on first visit.
 *
 * P0 fixes applied (audit SET-001, A11Y-001, A11Y-002):
 *  - "Enable Prayer Alerts" toggle now calls Notification.requestPermission()
 *    before flipping the persisted flag. Previously the flag was flipped but
 *    the browser permission prompt was never shown, so no notification ever
 *    fired.
 *  - Modal now has role="dialog" + aria-modal + aria-labelledby, Escape to
 *    close, focus trap (Tab/Shift-Tab cycles within the modal), and focus
 *    restoration to the trigger on close.
 *  - Alerts toggle uses role="switch" + aria-checked + bg-primary/bg-muted
 *    (valid Tailwind classes). Previously used inline style
 *    `hsl(var(--primary))` which is invalid CSS because --primary is an
 *    oklch value, not HSL components — the track was transparent.
 */
export function OnboardingModal() {
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);

  const {
    calculationMethod,
    setCalculationMethod,
    notificationsEnabled,
    setNotificationsEnabled,
    onboardingCompleted,
    setOnboardingCompleted,
  } = useSettingsStore();

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // SET-005: onboarding flag now lives in the settings store (was
    // raw localStorage). The store's persist middleware handles Safari
    // private mode safely via createJSONStorage with try/catch.
    if (!onboardingCompleted) {
      setIsOpen(true);
    }
  }, [onboardingCompleted]);

  // Declare handleComplete BEFORE the focus-trap effect so the effect's
  // dependency array is valid (audit A11Y-001).
  const handleComplete = React.useCallback(() => {
    // SET-005: persist via the store setter, not raw localStorage.
    setOnboardingCompleted(true);
    setIsOpen(false);
    // Restore focus to the previously-focused element (A11Y-001).
    window.setTimeout(() => {
      previouslyFocused.current?.focus();
    }, 0);
  }, [setOnboardingCompleted]);

  // Focus trap + Escape handler (A11Y-001).
  React.useEffect(() => {
    if (!isOpen) return;

    // Capture the currently-focused element so we can restore it on close.
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // Move focus into the modal.
    const t = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleComplete();
        return;
      }
      if (e.key !== 'Tab') return;
      // Focus trap: keep Tab within the modal.
      const modal = dialogRef.current;
      if (!modal) return;
      const focusable = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent background scroll.
    document.body.style.overflow = 'hidden';

    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleComplete]);

  // SET-001: call Notification.requestPermission() before flipping the flag.
  const handleNotificationsToggle = React.useCallback(async () => {
    if (notificationsEnabled) {
      // Turning off — just flip the flag.
      setNotificationsEnabled(false);
      return;
    }
    // Turning on — request browser permission first.
    if (typeof Notification === 'undefined') {
      // Notifications not supported; flip the flag but it won't fire anything.
      setNotificationsEnabled(true);
      return;
    }
    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
      return;
    }
    if (Notification.permission === 'denied') {
      // Permission was denied; don't flip the flag since nothing will fire.
      // (A more complete fix would show an inline message here — see SET-013/P1.)
      return;
    }
    try {
      const result = await Notification.requestPermission();
      if (result === 'granted') {
        setNotificationsEnabled(true);
      }
      // If denied or default, leave the flag off.
    } catch {
      // requestPermission can throw on some browsers; leave the flag off.
    }
  }, [notificationsEnabled, setNotificationsEnabled]);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="space-y-1">
            <h2 id="onboarding-title" className="text-2xl font-heading font-bold text-foreground">
              Welcome to Miqaat
            </h2>
            <p className="text-sm text-muted-foreground font-sans">Set up your preferences to get started.</p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={handleComplete}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
            <div className="-mx-6 px-6">
              <LocationSetup />
            </div>
          </div>

          <div className="h-px w-full bg-border/50" />

          {/* Calculation Method */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Compass className="w-5 h-5 text-primary" />
              <h3 id="onboarding-calc-method">2. Calculation Method</h3>
            </div>
            <select
              value={calculationMethod}
              onChange={(e) => setCalculationMethod(e.target.value as CalculationMethodId)}
              aria-labelledby="onboarding-calc-method"
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
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20">
              <span className="text-sm font-medium">Enable Prayer Alerts</span>
              <button
                type="button"
                role="switch"
                aria-checked={notificationsEnabled}
                aria-label="Enable prayer alerts"
                onClick={handleNotificationsToggle}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  notificationsEnabled ? 'bg-primary' : 'bg-muted',
                )}
              >
                <span className="sr-only">Enable prayer alerts</span>
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1',
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 bg-card">
          <button
            onClick={handleComplete}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Continue to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
