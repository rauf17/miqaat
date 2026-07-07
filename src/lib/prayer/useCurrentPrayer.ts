import { useState, useEffect } from 'react';
import { ComputedPrayerTimes, calculatePrayerTimes } from './calculate';
import { useLocationStore } from '../store/locationStore';
import { useSettingsStore } from '../store/settingsStore';
import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export const PRAYER_SEQUENCE: PrayerName[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

export interface CurrentPrayerState {
  current: { name: PrayerName; time: Date };
  next: { name: PrayerName; time: Date };
  isAfterIsha: boolean;
  now: Date;
}

/**
 * Pure function to derive the current and next prayer from system time.
 * Takes times for yesterday, today, and tomorrow to handle midnight rollovers safely.
 */
export function deriveCurrentPrayer(
  currentTime: Date,
  yesterday: ComputedPrayerTimes,
  today: ComputedPrayerTimes,
  tomorrow: ComputedPrayerTimes
): CurrentPrayerState {
  // Case 1: After today's Isha (e.g. 21:00 to 23:59)
  if (isAfter(currentTime, today.isha) || currentTime.getTime() === today.isha.getTime()) {
    return {
      current: { name: 'isha', time: today.isha },
      next: { name: 'fajr', time: tomorrow.fajr },
      isAfterIsha: true,
      now: currentTime,
    };
  }

  // Case 2: Before today's Fajr (e.g. 00:00 to Fajr)
  // Current prayer is yesterday's Isha, next is today's Fajr.
  if (isBefore(currentTime, today.fajr)) {
    return {
      current: { name: 'isha', time: yesterday.isha },
      next: { name: 'fajr', time: today.fajr },
      isAfterIsha: true,
      now: currentTime,
    };
  }

  // Case 3: Daytime
  let currentName: PrayerName = 'fajr';
  let nextName: PrayerName = 'sunrise';
  let currentTimeValue: Date = today.fajr;
  let nextTimeValue: Date = today.sunrise;

  for (let i = 0; i < PRAYER_SEQUENCE.length - 1; i++) {
    const currentIter = PRAYER_SEQUENCE[i];
    const nextIter = PRAYER_SEQUENCE[i + 1];
    
    if (
      (isAfter(currentTime, today[currentIter]) || currentTime.getTime() === today[currentIter].getTime()) &&
      isBefore(currentTime, today[nextIter])
    ) {
      currentName = currentIter;
      nextName = nextIter;
      currentTimeValue = today[currentIter];
      nextTimeValue = today[nextIter];
      break;
    }
  }

  return {
    current: { name: currentName, time: currentTimeValue },
    next: { name: nextName, time: nextTimeValue },
    isAfterIsha: false,
    now: currentTime,
  };
}

export function useCurrentPrayer() {
  const { lat, lng } = useLocationStore();
  const { calculationMethod, madhab } = useSettingsStore();

  const [state, setState] = useState<CurrentPrayerState | null>(null);

  useEffect(() => {
    if (lat === null || lng === null) return;

    function update() {
      const now = new Date();
      // Ensure we use the start of the current day to avoid shifting during the day
      const todayDate = startOfDay(now);
      
      const yesterday = calculatePrayerTimes({
        lat: lat!,
        lng: lng!,
        date: addDays(todayDate, -1),
        method: calculationMethod,
        madhab,
      });

      const today = calculatePrayerTimes({
        lat: lat!,
        lng: lng!,
        date: todayDate,
        method: calculationMethod,
        madhab,
      });

      const tomorrow = calculatePrayerTimes({
        lat: lat!,
        lng: lng!,
        date: addDays(todayDate, 1),
        method: calculationMethod,
        madhab,
      });

      setState(deriveCurrentPrayer(now, yesterday, today, tomorrow));
    }

    update();
    const intervalId = setInterval(update, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [lat, lng, calculationMethod, madhab]);

  return state;
}
