import { toHijri } from './convert';

export interface IslamicEvent {
  name: string;
  monthName: string;
  day: number;
}

export const MAJOR_EVENTS: IslamicEvent[] = [
  { name: 'Ashura', monthName: 'Muharram', day: 10 },
  { name: 'Ramadan Begins', monthName: 'Ramadan', day: 1 },
  { name: 'Eid al-Fitr', monthName: 'Shawwal', day: 1 },
  { name: 'Eid al-Adha', monthName: 'Dhuʻl-Hijjah', day: 10 },
];

/**
 * Finds all major Islamic events that fall on a specific Gregorian date.
 */
export function getEventsForGregorianDate(date: Date): IslamicEvent[] {
  const hijri = toHijri(date);
  return MAJOR_EVENTS.filter(
    (e) => e.monthName === hijri.monthName && e.day === hijri.day
  );
}

/**
 * Finds the Gregorian date for a given Hijri year and event.
 * Computes this dynamically using a forward scan, avoiding any hardcoded lookup tables.
 * Returns the date at 12:00 PM local time to avoid timezone edge-cases.
 */
export function getEventDate(hijriYear: number, event: IslamicEvent): Date | null {
  // Approximate the Gregorian year equivalent
  const estGregorianYear = Math.floor(hijriYear - hijriYear / 33 + 622);
  // Start searching from January 1st of the preceding year to be safe
  const current = new Date(estGregorianYear - 1, 0, 1, 12, 0, 0);

  // Jump forward 15 days at a time until we hit the requested Hijri year
  while (toHijri(current).year < hijriYear) {
    current.setDate(current.getDate() + 15);
  }

  // Step back 20 days just in case we overshot the first month
  current.setDate(current.getDate() - 20);

  // Walk forward day by day until we are inside the correct year
  while (toHijri(current).year < hijriYear) {
    current.setDate(current.getDate() + 1);
  }

  // Now `current` is exactly at or slightly after 1 Muharram of the requested Hijri year.
  // Scan forward up to one full lunar year (360 days) to find the event.
  for (let i = 0; i < 360; i++) {
    const h = toHijri(current);
    if (h.year > hijriYear) break; // We've moved past the requested year
    if (h.monthName === event.monthName && h.day === event.day) {
      return new Date(current);
    }
    current.setDate(current.getDate() + 1);
  }

  return null;
}
