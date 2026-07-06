export interface CachedReflection {
  text: string;
  dateStr: string;
  locationHash: string;
  timestamp: number;
}

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
  } catch {
    // Gracefully handle quota exceeded or disabled localStorage
  }
}
