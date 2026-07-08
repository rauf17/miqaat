import { describe, it, expect } from 'vitest';
import { getHijriMonthGrid, getNextMonth, getPrevMonth, HIJRI_MONTHS } from './calendar';

// P-H-017/022/034: tests for calendar robustness fixes.

describe('getHijriMonthGrid', () => {
  it('returns a 6-week (42-cell) grid for a valid month', () => {
    const grid = getHijriMonthGrid(1447, 'Ramadan');
    expect(grid.length).toBe(6); // 6 weeks
    const totalCells = grid.reduce((sum, week) => sum + week.length, 0);
    expect(totalCells).toBe(42);
  });

  it('returns an empty grid for an invalid month name', () => {
    // P-H-017: should return [] instead of crashing on monthDays[0]
    const grid = getHijriMonthGrid(1447, 'InvalidMonth');
    expect(grid).toEqual([]);
  });

  it('marks days outside the requested month as padding', () => {
    const grid = getHijriMonthGrid(1447, 'Muharram');
    const flat = grid.flat();
    // At least one padding day is expected in most month layouts
    const hasPadding = flat.some((d) => d.isPadding);
    const hasNonPadding = flat.some((d) => !d.isPadding);
    expect(hasPadding).toBe(true);
    expect(hasNonPadding).toBe(true);
    // All non-padding days should be in Muharram
    flat.filter((d) => !d.isPadding).forEach((d) => {
      expect(d.hijri.monthName).toBe('Muharram');
    });
  });
});

describe('getNextMonth / getPrevMonth', () => {
  it('getNextMonth wraps from Dhuʻl-Hijjah to Muharram (next year)', () => {
    const next = getNextMonth(1447, 'Dhuʻl-Hijjah');
    expect(next.year).toBe(1448);
    expect(next.month).toBe('Muharram');
  });

  it('getPrevMonth wraps from Muharram to Dhuʻl-Hijjah (prev year)', () => {
    const prev = getPrevMonth(1447, 'Muharram');
    expect(prev.year).toBe(1446);
    expect(prev.month).toBe('Dhuʻl-Hijjah');
  });

  it('getNextMonth advances within the same year', () => {
    const next = getNextMonth(1447, 'Ramadan');
    expect(next.year).toBe(1447);
    expect(next.month).toBe('Shawwal');
  });

  it('throws on unknown month name (P-H-034)', () => {
    expect(() => getNextMonth(1447, 'InvalidMonth')).toThrow(/Unknown hijri month/);
    expect(() => getPrevMonth(1447, 'InvalidMonth')).toThrow(/Unknown hijri month/);
  });

  it('HIJRI_MONTHS has exactly 12 entries', () => {
    expect(HIJRI_MONTHS).toHaveLength(12);
  });
});
