import { NextRequest, NextResponse } from 'next/server';

const OWM_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

export async function GET(request: NextRequest) {
  if (!OWM_API_KEY) {
    return NextResponse.json({ error: 'Weather API key not configured' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing lat/lng parameters' }, { status: 400 });
  }

  try {
    // OpenWeatherMap Current Weather Data API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${OWM_API_KEY}`,
      {
        next: { revalidate: 1800 } // Cache for 30 minutes (1800 seconds)
      }
    );

    if (!response.ok) {
      throw new Error(`Weather API returned ${response.status}`);
    }

    const data = await response.json();
    
    // We want to return a minimal payload to the client
    const conditionCode = data.weather?.[0]?.id;
    const tempC = Math.round(data.main?.temp);

    return NextResponse.json({
      tempC,
      conditionCode,
    });
  } catch (error) {
    console.error('Weather fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
