export interface HijriDateParts {
  day: number;
  monthName: string;
  year: number;
  weekday: string;
}

/**
 * Pure function converting a Gregorian date to a Hijri date using the 
 * native Intl.DateTimeFormat API with the Umm al-Qura calendar.
 */
export function toHijri(date: Date): HijriDateParts {
  const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  });

  const parts = formatter.formatToParts(date);
  
  let day = 1;
  let monthName = '';
  let year = 1400;
  let weekday = '';

  for (const part of parts) {
    if (part.type === 'day') day = parseInt(part.value, 10);
    if (part.type === 'month') monthName = part.value;
    if (part.type === 'year') {
      // The year might contain " AH" at the end depending on the browser,
      // so we parse the integer specifically.
      year = parseInt(part.value.replace(/\D/g, ''), 10);
    }
    if (part.type === 'weekday') weekday = part.value;
  }

  return { day, monthName, year, weekday };
}
