import { create } from 'zustand';

export type TimeOfDay = 'dawn' | 'day' | 'golden' | 'night';

interface TimeOfDayState {
  timeOfDay: TimeOfDay;
  override: TimeOfDay | null;
  setOverride: (override: TimeOfDay | null) => void;
  updateTimeOfDay: (sunrise?: Date, sunset?: Date, fajr?: Date) => void;
}

export const computeTimeOfDay = (
  date: Date = new Date(),
  sunrise?: Date,
  sunset?: Date,
  fajr?: Date
): TimeOfDay => {
  // If we have real prayer times, use them
  if (sunrise && sunset && fajr) {
    const time = date.getTime();
    
    // Dawn is from Fajr until Sunrise
    if (time >= fajr.getTime() && time < sunrise.getTime()) return 'dawn';
    
    // Day is from Sunrise until 1 hour before Sunset
    const goldenHourStart = new Date(sunset.getTime() - 60 * 60 * 1000);
    if (time >= sunrise.getTime() && time < goldenHourStart.getTime()) return 'day';
    
    // Golden is 1 hour before Sunset until Sunset
    if (time >= goldenHourStart.getTime() && time < sunset.getTime()) return 'golden';
    
    // Night is from Sunset until Fajr next day (or before Fajr today)
    return 'night';
  }

  // Fallback to hour-bucket approximation
  const hour = date.getHours();
  if (hour >= 4 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'golden';
  return 'night';
};

export const useTimeOfDay = create<TimeOfDayState>((set) => ({
  timeOfDay: computeTimeOfDay(),
  override: null,
  setOverride: (override) => set({ override }),
  updateTimeOfDay: (sunrise, sunset, fajr) => 
    set({ timeOfDay: computeTimeOfDay(new Date(), sunrise, sunset, fajr) }),
}));
