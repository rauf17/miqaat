import { NextRequest, NextResponse } from 'next/server';
import { parseCoords, rateLimit, getClientIp, safeFetch, withCache } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // WTH-002: validate coordinates (prevents URL injection + NaN propagation)
  const coords = parseCoords(searchParams);
  if (coords instanceof Response) return coords;
  const { lat, lng } = coords;

  // WTH-010: rate limit (10 requests per IP per 30s — generous for normal use,
  // catches abuse)
  const ip = getClientIp(request);
  if (!rateLimit(ip, 10, 0.33)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    // Open-Meteo API (No API key required)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,weather_code,is_day,relative_humidity_2m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto&forecast_days=7`;

    // WTH-027: 8s timeout via safeFetch
    const response = await safeFetch(url, { next: { revalidate: 1800 } });

    const data = await response.json();

    // WTH-001: validate upstream payload shape before mapping
    const c = data?.current;
    if (!c || typeof c.temperature_2m !== 'number' || typeof c.weather_code !== 'number') {
      return NextResponse.json({ error: 'Upstream weather payload malformed' }, { status: 502 });
    }

    return withCache({
      current: {
        tempC: Math.round(c.temperature_2m),
        apparentTempC: typeof c.apparent_temperature === 'number' ? Math.round(c.apparent_temperature) : undefined,
        conditionCode: c.weather_code,
        isDay: c.is_day,
        humidity: c.relative_humidity_2m,
      },
      hourly: data.hourly,
      daily: data.daily,
      utc_offset_seconds: data.utc_offset_seconds,
    });
  } catch (error) {
    console.error('Weather fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
