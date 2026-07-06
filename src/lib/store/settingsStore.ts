import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CalculationMethodId } from '../prayer/methods';

export interface SettingsState {
  calculationMethod: CalculationMethodId;
  manualLocationOverride: boolean;
  timeFormat: '12h' | '24h';
  notificationsEnabled: boolean;
  notificationOffset: 5 | 10 | 15;
  setCalculationMethod: (method: CalculationMethodId) => void;
  setManualLocationOverride: (override: boolean) => void;
  setTimeFormat: (format: '12h' | '24h') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setNotificationOffset: (offset: 5 | 10 | 15) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      calculationMethod: 'MWL',
      manualLocationOverride: false,
      timeFormat: '12h',
      notificationsEnabled: false,
      notificationOffset: 10,
      setCalculationMethod: (method) => set({ calculationMethod: method }),
      setManualLocationOverride: (override) => set({ manualLocationOverride: override }),
      setTimeFormat: (format) => set({ timeFormat: format }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setNotificationOffset: (offset) => set({ notificationOffset: offset }),
    }),
    {
      name: 'miqaat-settings-storage',
      version: 1,
    }
  )
);
