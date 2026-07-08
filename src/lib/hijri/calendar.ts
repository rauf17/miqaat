import { toHijri, HijriDateParts } from './convert';

export interface CalendarDay {
  date: Date;
  hijri: HijriDateParts;
  isPadding: boolean;
}

export const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  'Rabiʻ I',
  'Rabiʻ II',
  'Jumada I',
  'Jumada II',
  'Rajab',
  'Shaʻban',
  'Ramadan',
  'Shawwal',
  'Dhuʻl-Qiʻdah',
  'Dhuʻl-Hijjah'
];

/**
 * Returns a 2D array of weeks, where each week is an array of 7 CalendarDays (Sunday to Saturday).
 * Days outside the requested month are marked as `isPadding: true`.
 */
export function getHijriMonthGrid(hijriYear: number, monthName: string): CalendarDay[][] {
  // Find the 1st day of this Hijri month
  const estGregorianYear = Math.floor(hijriYear - hijriYear / 33 + 622);
  const start = new Date(estGregorianYear - 1, 0, 1, 12, 0, 0);

  // Jump near the requested year
  while (toHijri(start).year < hijriYear) {
    start.setDate(start.getDate() + 15);
  }
  start.setDate(start.getDate() - 20);
  while (toHijri(start).year < hijriYear) {
    start.setDate(start.getDate() + 1);
  }

  // Scan until we hit the requested month
  for (let i = 0; i < 360; i++) {
    const h = toHijri(start);
    if (h.monthName === monthName) break;
    start.setDate(start.getDate() + 1);
  }

  // Collect all days of this month
  const monthDays: CalendarDay[] = [];
  const current = new Date(start);
  while (true) {
    const h = toHijri(current);
    if (h.monthName !== monthName || h.year !== hijriYear) break;
    monthDays.push({
      date: new Date(current),
      hijri: h,
      isPadding: false
    });
    current.setDate(current.getDate() + 1);
  }

  // P-H-017: if monthName didn't match (e.g. Intl transliteration drift),
  // monthDays is empty and monthDays[0] would crash. Return empty grid.
  if (monthDays.length === 0) {
    return [];
  }

  // Pad the grid to start on Sunday (0) and end on Saturday (6)
  const firstDayOfWeek = monthDays[0].date.getDay();
  const paddedGrid: CalendarDay[] = [];
  
  // Previous month padding
  const prevCurrent = new Date(monthDays[0].date);
  prevCurrent.setDate(prevCurrent.getDate() - firstDayOfWeek);
  for (let i = 0; i < firstDayOfWeek; i++) {
    paddedGrid.push({
      date: new Date(prevCurrent),
      hijri: toHijri(prevCurrent),
      isPadding: true
    });
    prevCurrent.setDate(prevCurrent.getDate() + 1);
  }

  // Actual month days
  paddedGrid.push(...monthDays);

  // Next month padding
  const lastDayOfWeek = paddedGrid[paddedGrid.length - 1].date.getDay();
  if (lastDayOfWeek !== 6) {
    const nextCurrent = new Date(monthDays[monthDays.length - 1].date);
    nextCurrent.setDate(nextCurrent.getDate() + 1);
    const daysToAdd = 6 - lastDayOfWeek;
    for (let i = 0; i < daysToAdd; i++) {
      paddedGrid.push({
        date: new Date(nextCurrent),
        hijri: toHijri(nextCurrent),
        isPadding: true
      });
      nextCurrent.setDate(nextCurrent.getDate() + 1);
    }
  }

  // P-H-022: always pad to 42 cells (6 weeks) so the calendar card
  // doesn't visibly grow/shrink between 5-week and 6-week months.
  while (paddedGrid.length < 42) {
    const last = paddedGrid[paddedGrid.length - 1].date;
    const next = new Date(last);
    next.setDate(next.getDate() + 1);
    paddedGrid.push({
      date: next,
      hijri: toHijri(next),
      isPadding: true
    });
  }

  // Chunk into weeks
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < paddedGrid.length; i += 7) {
    weeks.push(paddedGrid.slice(i, i + 7));
  }

  return weeks;
}

export function getNextMonth(hijriYear: number, monthName: string) {
  const index = HIJRI_MONTHS.indexOf(monthName);
  // P-H-034: throw on unknown month instead of silently returning Muharram
  if (index === -1) throw new Error(`Unknown hijri month: ${monthName}`);
  if (index === 11) return { year: hijriYear + 1, month: HIJRI_MONTHS[0] };
  return { year: hijriYear, month: HIJRI_MONTHS[index + 1] };
}

export function getPrevMonth(hijriYear: number, monthName: string) {
  const index = HIJRI_MONTHS.indexOf(monthName);
  if (index === -1) throw new Error(`Unknown hijri month: ${monthName}`);
  if (index === 0) return { year: hijriYear - 1, month: HIJRI_MONTHS[11] };
  return { year: hijriYear, month: HIJRI_MONTHS[index - 1] };
}
