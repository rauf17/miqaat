import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateCacheKey, getCachedReflection, setCachedReflection } from './cache';

describe('Reflection Cache', () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    const mockStorage = {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      length: 0,
      key: vi.fn(),
    };
    
    vi.stubGlobal('localStorage', mockStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should generate a deterministic cache key', () => {
    const key1 = generateCacheKey('2023-10-20', '33.64,72.97');
    const key2 = generateCacheKey('2023-10-20', '33.64,72.97');
    expect(key1).toBe('miqaat-reflection-v2-2023-10-20-33.64,72.97');
    expect(key1).toBe(key2);
  });

  it('should save and retrieve a valid reflection', () => {
    const key = generateCacheKey('2023-10-20', 'loc1');
    const data = {
      text: 'A beautiful reflection.',
      dateStr: '2023-10-20',
      locationHash: 'loc1'
    };

    setCachedReflection(key, data);
    
    const retrieved = getCachedReflection(key);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.text).toBe(data.text);
    expect(retrieved?.dateStr).toBe(data.dateStr);
    expect(retrieved?.locationHash).toBe(data.locationHash);
    expect(retrieved?.timestamp).toBeTypeOf('number');
  });

  it('should return null for missing cache', () => {
    const key = generateCacheKey('2023-10-20', 'loc1');
    const retrieved = getCachedReflection(key);
    expect(retrieved).toBeNull();
  });

  it('should return null for malformed JSON', () => {
    const key = generateCacheKey('2023-10-20', 'loc1');
    localStorage.setItem(key, 'not valid json');
    
    const retrieved = getCachedReflection(key);
    expect(retrieved).toBeNull();
  });

  it('should return null for invalid schema', () => {
    const key = generateCacheKey('2023-10-20', 'loc1');
    localStorage.setItem(key, JSON.stringify({
      text: 'Missing timestamp',
      dateStr: '2023-10-20',
      locationHash: 'loc1'
    }));
    
    const retrieved = getCachedReflection(key);
    expect(retrieved).toBeNull();
  });

  // P-H-015: TTL tests for the 30-day expiry + prune logic.
  it('returns null and removes an entry older than 30 days', () => {
    const key = generateCacheKey('2026-01-01', 'stale');
    const staleTimestamp = Date.now() - 31 * 24 * 60 * 60 * 1000; // 31 days ago
    store[key] = JSON.stringify({ text: 'old reflection', dateStr: '2026-01-01', locationHash: 'stale', timestamp: staleTimestamp });
    expect(getCachedReflection(key)).toBeNull();
    expect(store[key]).toBeUndefined(); // should have been removed
  });

  it('accepts an entry younger than 30 days', () => {
    const key = generateCacheKey('2026-01-01', 'fresh');
    const freshTimestamp = Date.now() - 5 * 60 * 1000; // 5 min ago
    store[key] = JSON.stringify({ text: 'fresh reflection', dateStr: '2026-01-01', locationHash: 'fresh', timestamp: freshTimestamp });
    const cached = getCachedReflection(key);
    expect(cached).not.toBeNull();
    expect(cached?.text).toBe('fresh reflection');
  });
});
