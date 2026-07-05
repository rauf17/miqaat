import { describe, it, expect } from 'vitest';
import { toHijri } from './convert';

describe('toHijri conversion', () => {
  it('converts Ramadan 1, 1445 AH correctly (Mar 11, 2024)', () => {
    // 2024-03-11T00:00:00.000Z
    const d = new Date(Date.UTC(2024, 2, 11));
    const result = toHijri(d);
    expect(result.day).toBe(1);
    expect(result.monthName).toBe('Ramadan');
    expect(result.year).toBe(1445);
  });

  it('converts Shawwal 1, 1445 AH correctly (Apr 10, 2024)', () => {
    const d = new Date(Date.UTC(2024, 3, 10));
    const result = toHijri(d);
    expect(result.day).toBe(1);
    expect(result.monthName).toBe('Shawwal');
    expect(result.year).toBe(1445);
  });

  it('converts Dhuʻl-Hijjah 10, 1445 AH correctly (Jun 16, 2024)', () => {
    const d = new Date(Date.UTC(2024, 5, 16));
    const result = toHijri(d);
    expect(result.day).toBe(10);
    expect(result.monthName).toBe('Dhuʻl-Hijjah');
    expect(result.year).toBe(1445);
  });

  it('converts Muharram 1, 1446 AH correctly (Jul 7, 2024)', () => {
    const d = new Date(Date.UTC(2024, 6, 7));
    const result = toHijri(d);
    expect(result.day).toBe(1);
    expect(result.monthName).toBe('Muharram');
    expect(result.year).toBe(1446);
  });

  it('converts Ramadan 1, 1444 AH correctly (Mar 23, 2023)', () => {
    const d = new Date(Date.UTC(2023, 2, 23));
    const result = toHijri(d);
    expect(result.day).toBe(1);
    expect(result.monthName).toBe('Ramadan');
    expect(result.year).toBe(1444);
  });
});
