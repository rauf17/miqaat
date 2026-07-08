import * as React from 'react';
import { notFound } from 'next/navigation';
import { GeometricPattern } from '@/components/ui/geometric-pattern';
import { NightAtmosphere } from '@/components/ui/night-atmosphere';
import { TimeOfDay } from '@/lib/theme/useTimeOfDay';

// This route is for development QA only. In production builds it returns
// 404 via the `notFound()` call below, which renders src/app/not-found.tsx.
// During `npm run dev` the page renders normally so designers/developers
// can preview the four time-adaptive theme states side-by-side.

const states: { id: TimeOfDay; name: string; desc: string }[] = [
  { id: 'dawn', name: 'Dawn', desc: 'Fajr & Shuruq - Soft, cool, peaceful' },
  { id: 'day', name: 'Day', desc: 'Dhuhr & Asr - Bright, clear, focused' },
  { id: 'golden', name: 'Golden', desc: 'Maghrib - Warm, reflective, amber' },
  { id: 'night', name: 'Night', desc: 'Isha - Deep, restful, quiet' },
];

export default function ThemeQAPage() {
  // Production gate — `process.env.NODE_ENV` is replaced at build time,
  // so this branch is statically resolved during `next build`. The page
  // prerenders as a 404 and is unreachable at runtime in production.
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-heading font-bold text-foreground">Theme Engine QA</h1>
          <p className="text-muted-foreground mt-2 font-sans">
            Preview of the 4 time-adaptive states side-by-side.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {states.map((state) => (
            <div
              key={state.id}
              data-time-of-day={state.id}
              className="relative overflow-hidden rounded-3xl border border-border bg-theme-gradient p-8 min-h-[300px] flex flex-col justify-between shadow-lg"
            >
              <GeometricPattern className="text-foreground" />
              {state.id === 'night' && <NightAtmosphere className="text-foreground" />}
              
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {state.id.toUpperCase()} STATE
                </div>
                <h2 className="text-3xl font-heading font-semibold text-foreground">
                  {state.name}
                </h2>
                <p className="text-muted-foreground font-sans max-w-sm">
                  {state.desc}
                </p>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-4 mt-8">
                <div className="rounded-xl bg-card border border-border p-4 shadow-sm">
                  <h3 className="font-heading font-medium text-card-foreground">Surface Card</h3>
                  <p className="text-xs text-muted-foreground mt-1">Secondary element container</p>
                </div>
                <div className="rounded-xl bg-primary flex items-center justify-center p-4 shadow-[0_0_20px_var(--color-time-glow)]">
                  <span className="font-sans font-medium text-primary-foreground">Accent & Glow</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
