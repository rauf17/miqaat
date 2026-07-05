import { Coordinates, PrayerTimes, CalculationParameters } from 'adhan';
import { CalculationMethodId, CALCULATION_METHODS } from './methods';

export interface CalculatePrayerTimesParams {
  lat: number;
  lng: number;
  date: Date;
  method: CalculationMethodId;
}

export interface ComputedPrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export function calculatePrayerTimes({
  lat,
  lng,
  date,
  method,
}: CalculatePrayerTimesParams): ComputedPrayerTimes {
  const coordinates = new Coordinates(lat, lng);
  const calculationParameters: CalculationParameters = CALCULATION_METHODS[method].getAdhanMethod();
  
  // High latitude adjustments could be added here in the future
  
  const prayerTimes = new PrayerTimes(coordinates, date, calculationParameters);

  return {
    fajr: prayerTimes.fajr,
    sunrise: prayerTimes.sunrise,
    dhuhr: prayerTimes.dhuhr,
    asr: prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha: prayerTimes.isha,
  };
}
