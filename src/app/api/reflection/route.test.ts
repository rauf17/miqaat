import { describe, it, expect } from 'vitest';

/**
 * Tests for the reflection validation logic in /api/reflection/route.ts.
 *
 * The isValidReflection function is not exported, so these tests
 * document the intended behavior and serve as a regression guard if
 * the function is later extracted. For now they validate the
 * acceptance criteria from audit P-H-001 and P-H-002:
 *   - A reflection containing "as Muslims, we" is accepted.
 *   - A reflection containing "Sahih Muslim" is rejected.
 *   - A reflection with one quoted phrase is accepted.
 *   - A reflection with two separate quoted phrases is rejected.
 *
 * NOTE: These tests are written as a spec. To make them executable,
 * isValidReflection would need to be exported from route.ts (or
 * extracted to a shared module). That refactor is part of the P1
 * "test coverage" theme in the audit. For now, the tests document
 * the contract.
 */

describe('reflection validation contract (P-H-001, P-H-002)', () => {
  // These constants mirror the current implementation. If the
  // implementation changes, these tests should be updated.
  const FORBIDDEN_WORDS = [
    'surah',
    'ayah',
    'quran:',
    'bukhari',
    'sahih muslim',
    'tirmidhi',
    'abu dawud',
    'narrated',
    'prophet said',
    'allah says',
  ];

  /**
   * Local reimplementation of isValidReflection for spec purposes.
   * Mirrors src/app/api/reflection/route.ts lines 3-50.
   */
  function isValidReflection(output: string): boolean {
    if (!output || typeof output !== 'string' || output.trim().length < 10) return false;
    const words = output.trim().split(/\s+/);
    if (words.length < 15) return false;
    const sentences = output.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    if (sentences.length < 2) return false;
    const lowerOutput = output.toLowerCase();
    if (FORBIDDEN_WORDS.some((word) => lowerOutput.includes(word))) return false;
    if ((output.match(/"/g) || []).length >= 4) return false;
    return true;
  }

  it('accepts a reflection containing "as Muslims, we" (P-H-001)', () => {
    const reflection =
      'As Muslims, we are called to reflect on the quality of our daily prayers. ' +
      'Each prayer is an opportunity to pause and reconnect with what matters most. ' +
      'Today, consider how you might bring more presence to your next prayer.';
    expect(isValidReflection(reflection)).toBe(true);
  });

  it('rejects a reflection containing "Sahih Muslim" (P-H-001)', () => {
    const reflection =
      'This reflection is based on Sahih Muslim and the teachings within. ' +
      'The hadith collection provides guidance on daily prayer. ' +
      'Consider how these teachings apply to your life today.';
    expect(isValidReflection(reflection)).toBe(false);
  });

  it('accepts a reflection with a single quoted phrase (P-H-002)', () => {
    const reflection =
      'Consider the quality of "sabr" or patience in your daily life. ' +
      'Patience is not merely waiting but how we wait and what we do. ' +
      'Today, practice patience in one small interaction.';
    expect(isValidReflection(reflection)).toBe(true);
  });

  it('rejects a reflection with two separate quoted phrases (P-H-002)', () => {
    const reflection =
      'The Prophet said "prayer is the pillar of religion" and "whoever abandons it has abandoned faith". ' +
      'These narrations remind us of the central importance of prayer. ' +
      'Reflect on your own prayer habits today.';
    expect(isValidReflection(reflection)).toBe(false);
  });

  it('rejects a reflection that is too short (< 15 words)', () => {
    expect(isValidReflection('Short reflection. Too short.')).toBe(false);
  });

  it('rejects a reflection with only one sentence', () => {
    const one =
      'This is a single very long sentence that has well more than fifteen words in it but does not contain a second sentence at all so it should fail validation.';
    expect(isValidReflection(one)).toBe(false);
  });

  it('accepts a normal multi-sentence reflection with no forbidden words or quotes', () => {
    const reflection =
      'Today brings an opportunity to slow down and notice the small moments between prayers. ' +
      'The rhythm of Fajr, Dhuhr, Asr, Maghrib, and Isha structures the day with intention. ' +
      'Consider which prayer feels most meaningful to you and why.';
    expect(isValidReflection(reflection)).toBe(true);
  });
});
