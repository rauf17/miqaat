import { describe, it, expect } from 'vitest';
import { getMoonPhase } from './moon-phase';

describe('getMoonPhase', () => {
  it('identifies New Moon correctly (Jan 11 2024)', () => {
    const result = getMoonPhase(new Date('2024-01-11T11:57:00Z'));
    expect(result.name).toBe('New Moon');
    expect(result.illumination).toBe(0);
  });

  it('identifies Full Moon correctly (Jan 25 2024)', () => {
    // Roughly 14.76 days after New Moon
    const result = getMoonPhase(new Date('2024-01-25T17:54:00Z'));
    expect(result.name).toBe('Full Moon');
    expect(result.illumination).toBeGreaterThan(98);
  });

  it('identifies First Quarter correctly (Jan 18 2024)', () => {
    const result = getMoonPhase(new Date('2024-01-18T03:52:00Z'));
    expect(result.name).toBe('First Quarter');
    // First quarter is ~50% illuminated
    expect(result.illumination).toBeGreaterThan(45);
    expect(result.illumination).toBeLessThan(55);
  });

  it('identifies Last Quarter correctly (Feb 2 2024)', () => {
    const result = getMoonPhase(new Date('2024-02-02T23:18:00Z'));
    expect(result.name).toBe('Last Quarter');
    expect(result.illumination).toBeGreaterThan(45);
    expect(result.illumination).toBeLessThan(55);
  });
});
