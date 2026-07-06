import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing lat/lng parameters' }, { status: 400 });
  }

  try {
    // Open-Meteo API (No API key required)
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,weather_code,is_day&daily=sunrise,sunset&timezone=auto`,
      {
        next: { revalidate: 1800 } // Cache for 30 minutes (1800 seconds)
      }
    );

    if (!response.ok) {
      throw new Error(`Weather API returned ${response.status}`);
    }

    const data = await response.json();
    
    const conditionCode = data.current?.weather_code;
    const tempC = Math.round(data.current?.temperature_2m);
    const apparentTempC = data.current?.apparent_temperature !== undefined ? Math.round(data.current.apparent_temperature) : undefined;
    const isDay = data.current?.is_day;
    const sunrise = data.daily?.sunrise?.[0];
    const sunset = data.daily?.sunset?.[0];

    return NextResponse.json({
      tempC,
      apparentTempC,
      conditionCode,
      isDay,
      sunrise,
      sunset
    });
  } catch (error) {
    console.error('Weather fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
