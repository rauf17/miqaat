import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type WeatherData = {
  current: {
    tempC: number;
    apparentTempC?: number;
    conditionCode: number;
    isDay?: number;
    humidity?: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
  utc_offset_seconds?: number;
};

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: boolean;
  lastUpdated: number | null;
  fetchWeather: (lat: number, lng: number) => Promise<void>;
}

// WTH-017: persist weather data across reloads so users see last-known
// conditions immediately instead of a loading skeleton. The server's
// 30-min cache (next: { revalidate: 1800 }) governs freshness; the
// client-side SWR (in weather-fetcher.tsx) refreshes in the background.
const safeStorage = createJSONStorage(() => {
  try {
    if (typeof window === 'undefined') {
      return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    }
    return localStorage;
  } catch {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }
});

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      data: null,
      loading: false,
      error: false,
      lastUpdated: null,
      fetchWeather: async (lat, lng) => {
        set({ loading: true, error: false });
        try {
          const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
          if (!res.ok) throw new Error('Weather fetch failed');
          const json = await res.json();
          // WTH-003: reject NaN temperatures.
          const t = json?.current?.tempC;
          if (typeof t === 'number' && !Number.isNaN(t) && Number.isFinite(t)) {
            set({ data: json, loading: false, error: false, lastUpdated: Date.now() });
          } else {
            throw new Error('Invalid weather data');
          }
        } catch {
          // WTH-008: keep prior data on error; just set the error flag.
          set({ error: true, loading: false });
        }
      },
    }),
    {
      name: 'miqaat-weather-storage',
      // WTH-017: persist only data + lastUpdated, not loading/error
      partialize: (s) => ({ data: s.data, lastUpdated: s.lastUpdated }),
      storage: safeStorage,
      version: 1,
    }
  )
);

// WTH-007: helper to check if the cached weather is stale (> 30 min).
export function isWeatherStale(lastUpdated: number | null, maxAgeMs = 30 * 60 * 1000): boolean {
  if (!lastUpdated) return true;
  return Date.now() - lastUpdated > maxAgeMs;
}
