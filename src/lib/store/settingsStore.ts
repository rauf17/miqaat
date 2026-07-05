import { create } from 'zustand';

export interface SettingsState {
  // Placeholder for future settings state
  calculationMethod: string | null;
  setCalculationMethod: (method: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  calculationMethod: null,
  setCalculationMethod: (method) => set({ calculationMethod: method }),
}));
