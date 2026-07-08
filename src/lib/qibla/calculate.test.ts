import { describe, it, expect } from 'vitest';
import { getQiblaBearing, validateCoordinates } from './calculate';

describe('getQiblaBearing', () => {
  it('calculates the correct bearing for London, UK', () => {
    // London: 51.5072 N, 0.1276 W
    // Expected Qibla: ~118.98° (approx 119°)
    const bearing = getQiblaBearing(51.5072, -0.1276);
    expect(bearing).toBeCloseTo(118.98, 1);
  });

  it('calculates the correct bearing for New York, USA', () => {
    // New York: 40.7128 N, 74.0060 W
    // Expected Qibla: ~58.48° (approx 58.5°)
    const bearing = getQiblaBearing(40.7128, -74.0060);
    expect(bearing).toBeCloseTo(58.48, 1);
  });

  it('calculates the correct bearing for Tokyo, Japan', () => {
    // Tokyo: 35.6762 N, 139.6503 E
    // Expected Qibla: ~293.02° (approx 293°)
    const bearing = getQiblaBearing(35.6762, 139.6503);
    expect(bearing).toBeCloseTo(293.02, 1);
  });

  it('calculates the correct bearing for Mecca (should be roughly 0 depending on precise coords)', () => {
    // Slightly south of Kaaba
    const bearing = getQiblaBearing(21.4, 39.8262);
    expect(bearing).toBeCloseTo(0, 0); // pointing due North
  });

  // QIB-011: added Southern hemisphere, antipode-adjacent, and
  // high-latitude cases that were previously untested.
  it('calculates a finite bearing for Sydney, Australia (Southern hemisphere)', () => {
    const bearing = getQiblaBearing(-33.8688, 151.2093);
    expect(Number.isFinite(bearing)).toBe(true);
    expect(bearing).toBeGreaterThanOrEqual(0);
    expect(bearing).toBeLessThan(360);
    // Sydney Qibla is roughly 277° (west-northwest)
    expect(bearing).toBeCloseTo(277.5, 0);
  });

  it('calculates a finite bearing for Antarctica (-80, 0)', () => {
    const bearing = getQiblaBearing(-80, 0);
    expect(Number.isFinite(bearing)).toBe(true);
    expect(bearing).toBeGreaterThanOrEqual(0);
    expect(bearing).toBeLessThan(360);
  });

  it('calculates a finite bearing near the International Date Line (Fiji)', () => {
    const bearing = getQiblaBearing(-18.1, 178.4);
    expect(Number.isFinite(bearing)).toBe(true);
    expect(bearing).toBeGreaterThanOrEqual(0);
    expect(bearing).toBeLessThan(360);
  });
});

// QIB-010: validateCoordinates tests
describe('validateCoordinates', () => {
  it('accepts valid coordinates', () => {
    expect(() => validateCoordinates(0, 0)).not.toThrow();
    expect(() => validateCoordinates(90, 180)).not.toThrow();
    expect(() => validateCoordinates(-90, -180)).not.toThrow();
    expect(() => validateCoordinates(21.4225, 39.8262)).not.toThrow();
  });

  it('throws RangeError on NaN', () => {
    expect(() => validateCoordinates(NaN, 0)).toThrow(RangeError);
    expect(() => validateCoordinates(0, NaN)).toThrow(RangeError);
    expect(() => validateCoordinates(NaN, NaN)).toThrow(RangeError);
  });

  it('throws RangeError on Infinity', () => {
    expect(() => validateCoordinates(Infinity, 0)).toThrow(RangeError);
    expect(() => validateCoordinates(0, -Infinity)).toThrow(RangeError);
  });

  it('throws RangeError on out-of-range latitude', () => {
    expect(() => validateCoordinates(91, 0)).toThrow(RangeError);
    expect(() => validateCoordinates(-91, 0)).toThrow(RangeError);
  });

  it('throws RangeError on out-of-range longitude', () => {
    expect(() => validateCoordinates(0, 181)).toThrow(RangeError);
    expect(() => validateCoordinates(0, -181)).toThrow(RangeError);
  });
});
