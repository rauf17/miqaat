'use client';

import * as React from 'react';
import { useLocationStore } from '@/lib/store/locationStore';
import { useWeatherStore, isWeatherStale } from '@/lib/store/weatherStore';
import { useTimeOfDay } from '@/lib/theme/useTimeOfDay';

/**
 * Invisible component that:
 *  1. Fetches weather when location changes.
 *  2. WTH-007: auto-refreshes when the tab regains focus AND the cached
 *     data is stale (> 30 min). Previously a user who backgrounded the
 *     tab for 3 hours saw 3-hour-old data with no indicator.
 *  3. WTH-016: dedupes in-flight requests so rapid location changes
 *     don't race (the slower response can no longer overwrite the
 *     fresher one).
 *  4. Feeds sunrise/sunset into the theme engine.
 *
 * Renders null — it's a side-effect-only component mounted in the root
 * layout so every page benefits from background weather updates.
 */
export function WeatherFetcher() {
  const lat = useLocationStore((s) => s.lat);
  const lng = useLocationStore((s) => s.lng);
  const fetchWeather = useWeatherStore((s) => s.fetchWeather);
  const lastUpdated = useWeatherStore((s) => s.lastUpdated);
  const sunrise = useWeatherStore((s) => s.data?.daily?.sunrise?.[0]);
  const sunset = useWeatherStore((s) => s.data?.daily?.sunset?.[0]);
  const updateTimeOfDay = useTimeOfDay((s) => s.updateTimeOfDay);

  // WTH-016: track in-flight request to dedupe.
  const inflightRef = React.useRef<Promise<void> | null>(null);

  const doFetch = React.useCallback(
    (locationLat: number, locationLng: number) => {
      // If a fetch is already in progress for the same coords, await it
      // instead of starting a second one.
      if (inflightRef.current) return inflightRef.current;
      const p = fetchWeather(locationLat, locationLng).finally(() => {
        inflightRef.current = null;
      });
      inflightRef.current = p;
      return p;
    },
    [fetchWeather]
  );

  // Fetch when location changes.
  React.useEffect(() => {
    if (lat !== null && lng !== null) {
      doFetch(lat, lng);
    }
  }, [lat, lng, doFetch]);

  // WTH-007: refresh on visibility change if stale.
  React.useEffect(() => {
    if (lat === null || lng === null) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        if (isWeatherStale(lastUpdated)) {
          doFetch(lat, lng);
        }
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [lat, lng, lastUpdated, doFetch]);

  // Update theme engine when weather data arrives.
  React.useEffect(() => {
    if (sunrise && sunset) {
      updateTimeOfDay(new Date(sunrise), new Date(sunset));
    }
  }, [sunrise, sunset, updateTimeOfDay]);

  return null;
}
