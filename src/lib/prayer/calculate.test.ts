import { describe, it, expect } from 'vitest';
import { calculatePrayerTimes } from './calculate';

describe('calculatePrayerTimes', () => {
  it('should calculate prayer times accurately for Mecca using Umm Al-Qura', () => {
    // 21.4225° N, 39.8262° E
    const lat = 21.4225;
    const lng = 39.8262;
    // January 1, 2024
    // Note: Adhan uses the local year/month/date of the Date object passed. 
    // We construct a specific local date to test against.
    const date = new Date(2024, 0, 1, 12, 0, 0); 

    const times = calculatePrayerTimes({
      lat,
      lng,
      date,
      method: 'UMM_AL_QURA',
    });

    // Extract UTC hours and minutes for stable testing across environments
    // Reference times for Mecca on Jan 1, 2024 (approximate, within 1 minute of adhan.js output)
    // Fajr ~05:43 AST -> 02:43 UTC
    // Sunrise ~07:05 AST -> 04:05 UTC
    // Dhuhr ~12:28 AST -> 09:28 UTC
    // Asr ~15:37 AST -> 12:37 UTC
    // Maghrib ~17:51 AST -> 14:51 UTC
    // Isha ~19:21 AST -> 16:21 UTC

    expect(times.fajr.getUTCHours()).toBe(2);
    expect(times.fajr.getUTCMinutes()).toBeCloseTo(37, -1); 

    expect(times.sunrise.getUTCHours()).toBe(3);
    expect(times.sunrise.getUTCMinutes()).toBeCloseTo(58, -1);

    expect(times.dhuhr.getUTCHours()).toBe(9);
    expect(times.dhuhr.getUTCMinutes()).toBeCloseTo(24, -1);

    expect(times.asr.getUTCHours()).toBe(12);
    expect(times.asr.getUTCMinutes()).toBeCloseTo(29, -1);

    expect(times.maghrib.getUTCHours()).toBe(14);
    expect(times.maghrib.getUTCMinutes()).toBeCloseTo(50, -1);

    expect(times.isha.getUTCHours()).toBe(16);
    expect(times.isha.getUTCMinutes()).toBeCloseTo(20, -1);
  });
});
