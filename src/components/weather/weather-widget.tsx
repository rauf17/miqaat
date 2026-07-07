'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocationStore } from '@/lib/store/locationStore';
import { useWeatherStore } from '@/lib/store/weatherStore';
import { getWeatherIcon } from '@/lib/weather/utils';
import { CloudOff } from 'lucide-react';
import { getMoonPhase } from '@/lib/weather/moon-phase';
import { MoonPhaseIcon } from '@/components/weather/moon-phase-icon';

export function WeatherWidget() {
  const { lat, lng } = useLocationStore();
  const { data, loading, error } = useWeatherStore();

  if (lat === null || lng === null) return null;
  
  if (loading) {
    return (
      <div className="flex items-center px-3 py-1.5 h-8 w-16 rounded-full bg-card/10 animate-pulse border border-border/20 backdrop-blur-md" />
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/20 border border-border/30 backdrop-blur-md text-muted-foreground/50 text-xs font-medium font-sans">
        <CloudOff className="w-4 h-4" />
      </div>
    );
  }

  const { tempC, apparentTempC, conditionCode } = data.current;

  return (
    <Link href="/weather" className="group" aria-label="View Weather">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/30 border border-border/50 backdrop-blur-md text-muted-foreground text-xs font-medium font-sans shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:bg-card/40 hover:text-foreground">
        {React.createElement(getWeatherIcon(conditionCode), { className: "w-4 h-4 text-foreground/70 group-hover:text-foreground transition-colors" })}
        <span className="flex items-center gap-1">
          <span>{tempC}°</span>
          {apparentTempC !== undefined && (
            <span className="opacity-0 group-hover:opacity-100 hidden sm:inline transition-opacity duration-300 text-[10px]">
              Feels like {apparentTempC}°
            </span>
          )}
        </span>
        <div className="w-[1px] h-3 bg-border/50 mx-1"></div>
        {(() => {
          const moon = getMoonPhase(new Date());
          return (
            <MoonPhaseIcon phase={moon.phase} className="w-3.5 h-3.5 text-foreground/70 group-hover:text-foreground transition-colors" />
          );
        })()}
      </div>
    </Link>
  );
}
