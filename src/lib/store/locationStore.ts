import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LocationState {
  lat: number | null;
  lng: number | null;
  city: string | null;
  country: string | null;
  source: 'auto' | 'manual';
  version: number;
  setLocation: (
    location: { lat: number; lng: number; city?: string; country?: string },
    source: 'auto' | 'manual'
  ) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      lat: null,
      lng: null,
      city: null,
      country: null,
      source: 'auto',
      version: 1,
      setLocation: (location, source) =>
        set({
          lat: location.lat,
          lng: location.lng,
          city: location.city ?? null,
          country: location.country ?? null,
          source,
        }),
    }),
    {
      name: 'miqaat-location-storage',
      version: 1, // Zustand persist version
    }
  )
);
