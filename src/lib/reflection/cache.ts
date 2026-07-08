export interface CachedReflection {
  text: string;
  dateStr: string;
  locationHash: string;
  timestamp: number;
}

// P-H-015: TTL for cached reflections. A reflection older than 30 days
// is considered stale and won't be served. Also used to prune old
// entries on write to prevent unbounded localStorage growth.
const REFLECTION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAX_CACHE_ENTRIES = 50;

export function generateCacheKey(dateStr: string, locationHash: string): string {
  return `miqaat-reflection-v2-${dateStr}-${locationHash}`;
}

export function getCachedReflection(key: string): CachedReflection | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    // Validate schema
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.text === 'string' &&
      typeof parsed.dateStr === 'string' &&
      typeof parsed.locationHash === 'string' &&
      typeof parsed.timestamp === 'number'
    ) {
      // P-H-015: TTL check — don't serve reflections older than 30 days
      if (Date.now() - parsed.timestamp > REFLECTION_TTL_MS) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed as CachedReflection;
    }
    return null;
  } catch {
    return null;
  }
}

export function setCachedReflection(key: string, reflection: Omit<CachedReflection, 'timestamp'>): void {
  if (typeof window === 'undefined') return;

  try {
    const data: CachedReflection = {
      ...reflection,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(data));
    // P-H-015: prune oldest entries beyond MAX_CACHE_ENTRIES to prevent
    // unbounded localStorage growth (travels, multi-year usage).
    pruneOldEntries();
  } catch {
    // Gracefully handle quota exceeded or disabled localStorage
  }
}

function pruneOldEntries(): void {
  try {
    const entries: { key: string; timestamp: number }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith('miqaat-reflection-v2-')) continue;
      try {
        const v = JSON.parse(localStorage.getItem(k) || '{}');
        if (typeof v.timestamp === 'number') entries.push({ key: k, timestamp: v.timestamp });
      } catch {
        // skip unparseable
      }
    }
    if (entries.length <= MAX_CACHE_ENTRIES) return;
    // Sort oldest-first, remove the surplus
    entries.sort((a, b) => a.timestamp - b.timestamp);
    const toRemove = entries.slice(0, entries.length - MAX_CACHE_ENTRIES);
    for (const e of toRemove) localStorage.removeItem(e.key);
  } catch {
    // swallow
  }
}
