'use client';

import * as React from 'react';
import { Sunrise, Sunset, Droplets, Sun, CloudOff } from 'lucide-react';
import { motion } from 'framer-motion';

import { AnimatedLogo } from '@/components/brand/animated-logo';
import { HeaderDropdown } from '@/components/layout/header-dropdown';
import { LocationSetup } from '@/components/prayer/location-setup';
import { useLocationStore } from '@/lib/store/locationStore';
import { useWeatherStore } from '@/lib/store/weatherStore';
import { getWeatherIcon, getWeatherDescription } from '@/lib/weather/utils';
import { getMoonPhase } from '@/lib/weather/moon-phase';
import { MoonPhaseIcon } from '@/components/weather/moon-phase-icon';

export function WeatherClient() {
  const { lat, lng } = useLocationStore();
  const { data, loading, error } = useWeatherStore();
  const hasLocation = lat !== null && lng !== null;

  // WTH-025: memoize moon phase (only changes once per day)
  const moon = React.useMemo(() => getMoonPhase(new Date()), []);

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
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Weather Forecast</h1>
          <p className="text-muted-foreground font-sans">
            Live local conditions and 7-day forecast.
          </p>
        </div>

        <div className="pt-4 flex flex-col w-full">
          {!hasLocation ? (
            <div className="bg-card p-8 rounded-3xl border border-border shadow-lg max-w-md w-full mx-auto">
              <h2 className="text-2xl font-heading font-semibold mb-4 text-center">Set your location</h2>
              <p className="text-muted-foreground font-sans text-sm text-center mb-8">
                We need to know where you are to fetch the local forecast.
              </p>
              <LocationSetup />
            </div>
          ) : loading && !data ? (
            <div className="w-full h-64 rounded-3xl bg-card/20 border border-border/30 animate-pulse backdrop-blur-md" />
          ) : error || !data ? (
            <div className="bg-card/20 p-8 rounded-3xl border border-border/30 backdrop-blur-md flex flex-col items-center justify-center py-20">
              <CloudOff className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground font-sans">Weather data is currently unavailable.</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Current Conditions Card */}
              <div className="bg-card/30 rounded-3xl border border-border/50 p-6 md:p-8 backdrop-blur-md shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  {React.createElement(getWeatherIcon(data.current.conditionCode, data.current.isDay === 1), { className: "w-20 h-20 text-foreground" })}
                  <div>
                    <div className="text-6xl font-sans font-light tracking-tighter">
                      {data.current.tempC}°
                    </div>
                    <div className="text-lg text-muted-foreground font-medium mt-1">
                      {getWeatherDescription(data.current.conditionCode)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                  {data.current.apparentTempC !== undefined && (
                    <div className="flex flex-col bg-card/40 p-4 rounded-2xl border border-border/30">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Feels Like</span>
                      <span className="text-xl font-medium">{data.current.apparentTempC}°</span>
                    </div>
                  )}
                  {data.current.humidity !== undefined && (
                    <div className="flex flex-col bg-card/40 p-4 rounded-2xl border border-border/30">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><Droplets className="w-3 h-3"/> Humidity</span>
                      <span className="text-xl font-medium">{data.current.humidity}%</span>
                    </div>
                  )}
                  {data.daily?.uv_index_max?.[0] !== undefined && (
                    <div className="flex flex-col bg-card/40 p-4 rounded-2xl border border-border/30">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><Sun className="w-3 h-3"/> UV Max</span>
                      <span className="text-xl font-medium">{Math.round(data.daily.uv_index_max[0])}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 24-Hour Forecast Row */}
              <div className="bg-card/20 rounded-3xl border border-border/30 p-6 backdrop-blur-md overflow-hidden">
                <h3 className="font-heading text-lg font-semibold mb-4">24-Hour Forecast</h3>
                <div className="flex overflow-x-auto gap-4 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:thin]" role="region" aria-label="24-hour forecast, scroll horizontally" tabIndex={0}>
                  {/* WTH-004: Open-Meteo's hourly array starts at 00:00 of
                      the current day. Previously idx===0 (midnight) was
                      labeled "Now" even at 3pm. Now we find the first
                      hour >= current time and slice 24 forward. */}
                  {(() => {
                    const now = new Date();
                    const times = data.hourly?.time ?? [];
                    let startIdx = times.findIndex((t) => new Date(t) >= now);
                    if (startIdx === -1) startIdx = 0;
                    const hours = times.slice(startIdx, startIdx + 24);
                    return hours.map((timeStr, idx) => {
                      const realIdx = startIdx + idx;
                      const temp = Math.round(data.hourly.temperature_2m[realIdx]);
                      const code = data.hourly.weather_code[realIdx];
                      const precip = data.hourly.precipitation_probability[realIdx];
                      const date = new Date(timeStr);
                      // WTH-006: determine if this hour is day or night
                      // by comparing against sunrise/sunset.
                      const sr = data.daily?.sunrise?.[0] ? new Date(data.daily.sunrise[0]) : null;
                      const ss = data.daily?.sunset?.[0] ? new Date(data.daily.sunset[0]) : null;
                      const isDay = sr && ss ? date >= sr && date < ss : true;
                      const HIcon = getWeatherIcon(code, isDay);

                      return (
                        <div key={timeStr} className="flex flex-col items-center justify-between min-w-[72px] bg-card/30 p-3 rounded-2xl border border-border/20 snap-start">
                          <span className="text-xs text-muted-foreground mb-2">
                            {idx === 0 ? 'Now' : date.toLocaleTimeString([], { hour: 'numeric' })}
                          </span>
                          <HIcon className="w-6 h-6 my-2 text-foreground/80" />
                          <span className="text-sm font-medium">{temp}°</span>
                          {typeof precip === 'number' && precip > 10 ? (
                            <span className="text-[10px] text-primary/70 mt-2 font-medium">{precip}%</span>
                          ) : (
                            <span className="text-[10px] text-transparent mt-2">0%</span>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* 7-Day Forecast & Solar Data */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 7-Day */}
                <div className="lg:col-span-2 bg-card/20 rounded-3xl border border-border/30 p-6 backdrop-blur-md">
                  <h3 className="font-heading text-lg font-semibold mb-4">7-Day Forecast</h3>
                  <div className="flex flex-col gap-2">
                    {data.daily?.time?.slice(0, 7).map((timeStr, idx) => {
                      const max = Math.round(data.daily.temperature_2m_max[idx]);
                      const min = Math.round(data.daily.temperature_2m_min[idx]);
                      const code = data.daily.weather_code[idx];
                      const date = new Date(timeStr);
                      const DIcon = getWeatherIcon(code);
                      const isToday = idx === 0;

                      return (
                        <div key={timeStr} className="flex items-center justify-between py-3 px-4 rounded-2xl hover:bg-card/30 transition-colors">
                          <span className="w-24 font-medium text-sm">
                            {isToday ? 'Today' : date.toLocaleDateString([], { weekday: 'long' })}
                          </span>
                          <div className="flex items-center gap-2 w-32">
                            <DIcon className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{getWeatherDescription(code)}</span>
                          </div>
                          <div className="flex items-center gap-4 w-24 justify-end">
                            <span className="text-muted-foreground text-sm">{min}°</span>
                            <span className="font-medium">{max}°</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Solar & Lunar Data */}
                <div className="bg-card/20 rounded-3xl border border-border/30 p-6 backdrop-blur-md flex flex-col gap-6">
                  <h3 className="font-heading text-lg font-semibold mb-2">Sun & Moon</h3>
                  {data.daily?.sunrise?.[0] && (
                    <div className="flex items-center gap-4 bg-card/30 p-4 rounded-2xl border border-border/20">
                      <Sunrise className="w-8 h-8 text-primary/80" />
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Sunrise</div>
                        <div className="text-lg font-medium">
                          {new Date(data.daily.sunrise[0]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  )}
                  {data.daily?.sunset?.[0] && (
                    <div className="flex items-center gap-4 bg-card/30 p-4 rounded-2xl border border-border/20">
                      <Sunset className="w-8 h-8 text-primary/80" />
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Sunset</div>
                        <div className="text-lg font-medium">
                          {new Date(data.daily.sunset[0]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Moon Phase (WTH-030: extracted IIFE, WTH-025: memoized) */}
                  <div className="flex items-center gap-4 bg-card/30 p-4 rounded-2xl border border-border/20">
                    <MoonPhaseIcon phase={moon.phase} className="w-8 h-8 text-primary/80" />
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Moon Phase</div>
                      <div className="text-lg font-medium">
                        {moon.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{moon.illumination}% illuminated</div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

      </div>
    </motion.main>
  );
}
