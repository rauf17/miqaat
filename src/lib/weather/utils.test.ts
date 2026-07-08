import { describe, it, expect } from 'vitest';
import { getWeatherIcon, getWeatherDescription } from './utils';
import { Sun, Moon, Cloud, CloudMoon, CloudFog, CloudDrizzle, CloudRain, Snowflake, CloudLightning, CloudOff } from 'lucide-react';

// WTH-014: tests for the WMO weather code → icon/description mapping.

describe('getWeatherIcon', () => {
  it('returns Sun for code 0 (clear sky) during day', () => {
    expect(getWeatherIcon(0, true)).toBe(Sun);
  });

  it('WTH-006: returns Moon for code 0 (clear sky) at night', () => {
    expect(getWeatherIcon(0, false)).toBe(Moon);
  });

  it('WTH-006: returns CloudMoon for code 1 (mainly clear) at night', () => {
    expect(getWeatherIcon(1, false)).toBe(CloudMoon);
  });

  it('WTH-006: returns CloudMoon for code 2 (partly cloudy) at night', () => {
    expect(getWeatherIcon(2, false)).toBe(CloudMoon);
  });

  it('returns Cloud for code 3 (overcast) regardless of day/night', () => {
    expect(getWeatherIcon(3, true)).toBe(Cloud);
    expect(getWeatherIcon(3, false)).toBe(Cloud);
  });

  it('returns CloudFog for fog codes', () => {
    expect(getWeatherIcon(45, true)).toBe(CloudFog);
    expect(getWeatherIcon(48, true)).toBe(CloudFog);
  });

  it('returns CloudDrizzle for drizzle codes', () => {
    expect(getWeatherIcon(51, true)).toBe(CloudDrizzle);
    expect(getWeatherIcon(57, true)).toBe(CloudDrizzle);
  });

  it('returns CloudRain for rain codes', () => {
    expect(getWeatherIcon(61, true)).toBe(CloudRain);
    expect(getWeatherIcon(67, true)).toBe(CloudRain);
    expect(getWeatherIcon(80, true)).toBe(CloudRain);
  });

  it('returns Snowflake for snow codes', () => {
    expect(getWeatherIcon(71, true)).toBe(Snowflake);
    expect(getWeatherIcon(77, true)).toBe(Snowflake);
    expect(getWeatherIcon(85, true)).toBe(Snowflake);
  });

  it('returns CloudLightning for thunderstorm codes', () => {
    expect(getWeatherIcon(95, true)).toBe(CloudLightning);
    expect(getWeatherIcon(99, true)).toBe(CloudLightning);
  });

  it('returns CloudOff for undefined code', () => {
    expect(getWeatherIcon(undefined)).toBe(CloudOff);
  });

  it('returns Cloud for unknown positive code (not caught by other branches)', () => {
    // Use a code between 48 and 51 (falls through all if-branches)
    expect(getWeatherIcon(50, true)).toBe(Cloud);
  });

  it('defaults isDay to true when not specified', () => {
    expect(getWeatherIcon(0)).toBe(Sun);
  });
});

describe('getWeatherDescription', () => {
  it('returns "Clear" for code 0', () => {
    expect(getWeatherDescription(0)).toBe('Clear');
  });

  it('WTH-023: distinguishes code 1/2/3 instead of all "Cloudy"', () => {
    expect(getWeatherDescription(1)).toBe('Mainly Clear');
    expect(getWeatherDescription(2)).toBe('Partly Cloudy');
    expect(getWeatherDescription(3)).toBe('Overcast');
  });

  it('returns "Fog" for fog codes', () => {
    expect(getWeatherDescription(45)).toBe('Fog');
    expect(getWeatherDescription(48)).toBe('Fog');
  });

  it('returns "Drizzle" for drizzle codes', () => {
    expect(getWeatherDescription(51)).toBe('Drizzle');
  });

  it('returns "Rain" for rain codes', () => {
    expect(getWeatherDescription(61)).toBe('Rain');
  });

  it('returns "Snow" for snow codes', () => {
    expect(getWeatherDescription(71)).toBe('Snow');
  });

  it('returns "Showers" for shower codes', () => {
    expect(getWeatherDescription(80)).toBe('Showers');
  });

  it('returns "Snow Showers" for snow shower codes', () => {
    expect(getWeatherDescription(85)).toBe('Snow Showers');
  });

  it('returns "Thunderstorm" for thunderstorm codes', () => {
    expect(getWeatherDescription(95)).toBe('Thunderstorm');
  });

  it('returns "Offline" for undefined code', () => {
    expect(getWeatherDescription(undefined)).toBe('Offline');
  });

  it('returns "Unknown" for unrecognized positive code', () => {
    // Use a code between 48 and 51 (falls through all if-branches)
    expect(getWeatherDescription(50)).toBe('Unknown');
  });
});
