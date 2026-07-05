import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CalculationMethodId } from '../prayer/methods';

export interface SettingsState {
  calculationMethod: CalculationMethodId;
  manualLocationOverride: boolean;
  timeFormat: '12h' | '24h';
  setCalculationMethod: (method: CalculationMethodId) => void;
  setManualLocationOverride: (override: boolean) => void;
  setTimeFormat: (format: '12h' | '24h') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      calculationMethod: 'MWL',
      manualLocationOverride: false,
      timeFormat: '12h',
      setCalculationMethod: (method) => set({ calculationMethod: method }),
      setManualLocationOverride: (override) => set({ manualLocationOverride: override }),
      setTimeFormat: (format) => set({ timeFormat: format }),
    }),
    {
      name: 'miqaat-settings-storage',
      version: 1,
    }
  )
);
