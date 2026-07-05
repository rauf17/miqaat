import { create } from 'zustand';

export type TimeOfDay = 'dawn' | 'day' | 'golden' | 'night';

interface TimeOfDayState {
  timeOfDay: TimeOfDay;
  override: TimeOfDay | null;
  setOverride: (override: TimeOfDay | null) => void;
  updateTimeOfDay: () => void;
}

export const computeTimeOfDay = (date: Date = new Date()): TimeOfDay => {
  const hour = date.getHours();
  // Hour-bucket approximation (to be replaced with actual sun calculations later)
  if (hour >= 4 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'golden';
  return 'night';
};

export const useTimeOfDay = create<TimeOfDayState>((set) => ({
  timeOfDay: computeTimeOfDay(),
  override: null,
  setOverride: (override) => set({ override }),
  updateTimeOfDay: () => set({ timeOfDay: computeTimeOfDay() }),
}));
