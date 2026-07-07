import { create } from 'zustand';

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

export const useWeatherStore = create<WeatherState>((set) => ({
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
      // WTH-003: reject NaN temperatures. `NaN !== undefined` is true,
      // so the old check passed NaN through. Now we explicitly check
      // for a finite number.
      const t = json?.current?.tempC;
      if (typeof t === 'number' && !Number.isNaN(t) && Number.isFinite(t)) {
        // WTH-008: keep existing data on error so a transient failure
        // doesn't wipe the UI; here we're on the success path so just
        // set data + lastUpdated.
        set({ data: json, loading: false, error: false, lastUpdated: Date.now() });
      } else {
        throw new Error('Invalid weather data');
      }
    } catch {
      // WTH-008: keep prior data on error; just set the error flag.
      set({ error: true, loading: false });
    }
  },
}));
