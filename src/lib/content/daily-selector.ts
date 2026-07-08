import versesData from '@/data/verses.json';
import hadithsData from '@/data/hadith.json';

export interface Verse {
  reference: string;
  surah: string;
  ayah: number;
  arabic: string;
  english: string;
}

export interface Hadith {
  collection: string;
  book: number;
  number: number;
  text: string;
  grade: string;
}

export interface DailyContent {
  verse: Verse;
  hadith: Hadith;
  showVerse: boolean;
}

export function getDailyContent(dateStr: string): DailyContent {
  // Date format is expected to be YYYY-MM-DD
  const parts = dateStr.split('-');
  let daysSinceEpoch = 0;
  
  if (parts.length === 3) {
    const d = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
    daysSinceEpoch = Math.floor(d.getTime() / (1000 * 60 * 60 * 24));
  } else {
    // Fallback if date is malformed
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = (hash << 5) - hash + dateStr.charCodeAt(i);
      hash |= 0;
    }
    daysSinceEpoch = Math.abs(hash);
  }

  // Ensure positive index
  daysSinceEpoch = Math.max(0, daysSinceEpoch);

  // Cycle through available items
  const verseIndex = daysSinceEpoch % versesData.length;
  // P-H-037: extracted magic number 7 into a named constant. The
  // multiplier ensures verse/hadith pairings mix over time (if both
  // arrays had the same length, 1-to-1 pairing would be repetitive).
  // 7 is chosen because gcd(7, 36) = 1, so the hadith index visits
  // all 36 entries before repeating. If hadithsData.length ever
  // becomes a multiple of 7, switch to a different prime.
  const HADITH_DAY_MULTIPLIER = 7;
  const hadithIndex = (daysSinceEpoch * HADITH_DAY_MULTIPLIER) % hadithsData.length;

  return {
    verse: versesData[verseIndex] as Verse,
    hadith: hadithsData[hadithIndex] as Hadith,
    showVerse: daysSinceEpoch % 2 === 0,
  };
}
