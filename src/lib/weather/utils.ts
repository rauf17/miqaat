import {
  Sun,
  Moon,
  Cloud,
  CloudMoon,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudDrizzle,
  CloudFog,
  CloudOff,
} from 'lucide-react';

/**
 * Map a WMO weather code to a Lucide icon.
 *
 * WTH-006: accepts an optional `isDay` parameter. Clear sky at night
 * now returns Moon instead of Sun; mainly-clear/partly-cloudy at night
 * returns CloudMoon. Callers should pass `data.current.isDay === 1`
 * for current conditions.
 */
export function getWeatherIcon(code: number | undefined, isDay: boolean = true) {
  if (code === undefined) return CloudOff;
  if (code === 0) return isDay ? Sun : Moon; // Clear sky
  if ((code === 1 || code === 2) && !isDay) return CloudMoon; // Mainly clear / partly cloudy at night
  if (code === 1 || code === 2 || code === 3) return Cloud; // Mainly clear, partly cloudy, overcast
  if (code === 45 || code === 48) return CloudFog; // Fog
  if (code >= 51 && code <= 57) return CloudDrizzle; // Drizzle
  if (code >= 61 && code <= 67) return CloudRain; // Rain
  if (code >= 71 && code <= 77) return Snowflake; // Snow
  if (code >= 80 && code <= 82) return CloudRain; // Rain showers
  if (code === 85 || code === 86) return Snowflake; // Snow showers
  if (code >= 95) return CloudLightning; // Thunderstorm
  return Cloud;
}

export function getWeatherDescription(code: number | undefined) {
  if (code === undefined) return 'Offline';
  if (code === 0) return 'Clear';
  // WTH-023: distinguish code 1/2/3 instead of collapsing all to "Cloudy"
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Fog';
  if (code >= 51 && code <= 57) return 'Drizzle';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code === 85 || code === 86) return 'Snow Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Unknown';
}
