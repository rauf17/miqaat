import * as React from 'react';

export function MoonPhaseIcon({ phase, className = "w-6 h-6" }: { phase: number, className?: string }) {
  // Normalize phase just in case
  const p = phase % 1;
  const isWaxing = p <= 0.5;
  
  // Outer arc: waxing = right side (sweep=1), waning = left side (sweep=0)
  const outerSweep = isWaxing ? 1 : 0;
  
  // Terminator horizontal radius
  // p=0 -> x=50, p=0.25 -> x=0, p=0.5 -> x=50
  const rx = 50 * Math.abs(Math.cos(p * 2 * Math.PI));
  
  // Terminator sweep
  // Waxing crescent (p < 0.25) -> sweep=0
  // Waxing gibbous (0.25 <= p < 0.5) -> sweep=1
  // Waning gibbous (0.5 <= p < 0.75) -> sweep=0
  // Waning crescent (0.75 <= p <= 1) -> sweep=1
  let innerSweep = 0;
  if (p < 0.25) innerSweep = 0;
  else if (p < 0.5) innerSweep = 1;
  else if (p < 0.75) innerSweep = 0;
  else innerSweep = 1;

  // WTH-012: new-moon icon was a thin stroked ring with no fill,
  // invisible against dark card backgrounds. Now render a dashed
  // "earthshine" outline so the new-moon phase is visible. Also
  // widened threshold to catch near-new-moon phases.
  if (p < 0.03 || p > 0.97) {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 5" strokeOpacity="0.6" aria-hidden="true">
        <circle cx="50" cy="50" r="42" />
      </svg>
    );
  }
  
  if (p === 0.5) {
    // Full moon - solid circle
    return (
      <svg viewBox="0 0 100 100" className={className} fill="currentColor">
        <circle cx="50" cy="50" r="50" />
      </svg>
    );
  }

  // Draw the moon! 
  // We'll have a faint outline for the full circle, and a solid fill for the illuminated part.
  return (
    <svg viewBox="0 0 100 100" className={className}>
      {/* Background dark moon */}
      <circle cx="50" cy="50" r="49" fill="transparent" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
      {/* Illuminated part */}
      <path
        d={`M 50,0 A 50,50 0 0,${outerSweep} 50,100 A ${rx},50 0 0,${innerSweep} 50,0`}
        fill="currentColor"
      />
    </svg>
  );
}
