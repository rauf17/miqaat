export interface HijriDateParts {
  day: number;
  monthName: string;
  year: number;
  weekday: string;
}

/**
 * Module-scoped Hijri formatter.
 *
 * PSP-006: Intl.DateTimeFormat construction is one of the more
 * expensive browser APIs (~0.1-1ms each). getHijriMonthGrid calls
 * toHijri ~150 times per calendar render, so we hoist the formatter
 * to module scope and reuse it. The formatter is locale-stable and
 * safe to share across calls.
 */
const hijriFormatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekday: 'long',
});

/**
 * Pure function converting a Gregorian date to a Hijri date using the
 * native Intl.DateTimeFormat API with the Umm al-Qura calendar.
 */
export function toHijri(date: Date): HijriDateParts {
  const parts = hijriFormatter.formatToParts(date);

  let day = 1;
  let monthName = '';
  let year = 1400;
  let weekday = '';

  for (const part of parts) {
    if (part.type === 'day') day = parseInt(part.value, 10);
    if (part.type === 'month') monthName = part.value;
    if (part.type === 'year') {
      year = parseInt(part.value.replace(/\D/g, ''), 10);
    }
    if (part.type === 'weekday') weekday = part.value;
  }

  // P-H-032: guard against NaN from unexpected Intl output
  if (!Number.isFinite(day) || !Number.isFinite(year) || !monthName) {
    throw new Error(`toHijri: failed to parse Hijri date for ${date.toISOString()}`);
  }

  return { day, monthName, year, weekday };
}
