import { Coordinates, PrayerTimes, CalculationParameters, HighLatitudeRule, Madhab } from 'adhan';
import { CalculationMethodId, CALCULATION_METHODS } from './methods';

export interface CalculatePrayerTimesParams {
  lat: number;
  lng: number;
  date: Date;
  method: CalculationMethodId;
  madhab?: 'shafi' | 'hanafi';
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
  madhab = 'shafi',
}: CalculatePrayerTimesParams): ComputedPrayerTimes {
  const coordinates = new Coordinates(lat, lng);
  const calculationParameters: CalculationParameters = CALCULATION_METHODS[method].getAdhanMethod();
  
  // Apply high latitude rule to prevent errors or incorrect times in extreme northern/southern regions
  calculationParameters.highLatitudeRule = HighLatitudeRule.TwilightAngle;
  calculationParameters.madhab = madhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  
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
