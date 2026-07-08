import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CalculationMethodId } from '../prayer/methods';

export interface SettingsState {
  calculationMethod: CalculationMethodId;
  timeFormat: '12h' | '24h';
  notificationsEnabled: boolean;
  notificationOffset: 5 | 10 | 15;
  madhab: 'shafi' | 'hanafi';
  language: 'en'; // P-H-036: typed to supported set (ar/ur are disabled in UI)
  reduceMotion: boolean;
  largerText: boolean;
  setCalculationMethod: (method: CalculationMethodId) => void;
  setTimeFormat: (format: '12h' | '24h') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setNotificationOffset: (offset: 5 | 10 | 15) => void;
  setMadhab: (madhab: 'shafi' | 'hanafi') => void;
  setLanguage: (lang: string) => void;
  setReduceMotion: (reduce: boolean) => void;
  setLargerText: (larger: boolean) => void;
}

// SET-015: removed dead `manualLocationOverride` state (was written in
// 3 places but never read — locationStore.source already tracks the
// same intent).
// SET-011: wrapped storage in createJSONStorage with try/catch so
// Safari Private Browsing (where localStorage.setItem throws) doesn't
// crash the app on every settings toggle.
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

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      calculationMethod: 'MWL',
      timeFormat: '12h',
      notificationsEnabled: false,
      notificationOffset: 10,
      madhab: 'shafi',
      language: 'en',
      reduceMotion: false,
      largerText: false,
      setCalculationMethod: (method) => set({ calculationMethod: method }),
      setTimeFormat: (format) => set({ timeFormat: format }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setNotificationOffset: (offset) => set({ notificationOffset: offset }),
      setMadhab: (madhab) => set({ madhab }),
      // P-H-036: validate language against supported set
      setLanguage: (lang) => {
        const supported: string[] = ['en'];
        set({ language: (supported.includes(lang) ? lang : 'en') as 'en' });
      },
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setLargerText: (largerText) => set({ largerText }),
    }),
    {
      name: 'miqaat-settings-storage',
      // SET-007: bump to v2 + add migrate so future schema changes load
      // cleanly. v1 -> v2: clamp language to 'en' (ar/ur not yet supported).
      version: 2,
      migrate: (persisted, version) => {
        const s = (persisted ?? {}) as Partial<SettingsState>;
        if (version < 2 && s.language && s.language !== 'en') {
          s.language = 'en';
        }
        // SET-015: drop the removed field if present in old persisted state
        delete (s as Record<string, unknown>).manualLocationOverride;
        return s;
      },
      storage: safeStorage,
    }
  )
);
