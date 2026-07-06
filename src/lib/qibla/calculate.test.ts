import { describe, it, expect } from 'vitest';
import { getQiblaBearing } from './calculate';

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
});
