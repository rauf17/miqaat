import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface LocationState {
  lat: number | null;
  lng: number | null;
  city: string | null;
  country: string | null;
  source: 'auto' | 'manual';
  setLocation: (
    location: { lat: number; lng: number; city?: string; country?: string },
    source: 'auto' | 'manual'
  ) => void;
}

// SET-011: wrapped storage in createJSONStorage with try/catch so
// Safari Private Browsing doesn't crash on every setLocation call.
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

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      lat: null,
      lng: null,
      city: null,
      country: null,
      source: 'auto',
      // QIB-012: validate coordinates before storing to prevent NaN/Infinity
      // from silently propagating into Qibla + prayer calculations.
      setLocation: (location, source) => {
        const { lat, lng } = location;
        if (
          !Number.isFinite(lat) ||
          !Number.isFinite(lng) ||
          lat < -90 ||
          lat > 90 ||
          lng < -180 ||
          lng > 180
        ) {
          console.warn('Rejected invalid location', location);
          return;
        }
        set({
          lat,
          lng,
          city: location.city ?? null,
          country: location.country ?? null,
          source,
        });
      },
    }),
    {
      name: 'miqaat-location-storage',
      version: 1,
      storage: safeStorage,
    }
  )
);
