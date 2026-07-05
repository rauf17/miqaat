import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  const apiKey = process.env.GEOCODING_API_KEY;

  if (!apiKey || apiKey === 'placeholder_geocoding_key' || apiKey.trim() === '') {
    console.warn('GEOCODING_API_KEY is not configured or is a placeholder. Falling back to Unknown City.');
    return NextResponse.json({
      city: 'Unknown City',
      country: 'Unknown Country',
    });
  }

  try {
    // Attempting to use Google Maps Geocoding API structure
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const addressComponents = data.results[0].address_components;
      
      let city = '';
      let country = '';

      for (const component of addressComponents) {
        if (component.types.includes('locality') || component.types.includes('postal_town')) {
          city = component.long_name;
        }
        if (component.types.includes('country')) {
          country = component.long_name;
        }
      }

      // Fallback to top level admin area if city wasn't found
      if (!city) {
        const adminArea = addressComponents.find((c: { types: string[] }) => c.types.includes('administrative_area_level_1'));
        if (adminArea) city = adminArea.long_name;
      }

      return NextResponse.json({
        city: city || 'Unknown City',
        country: country || 'Unknown Country',
      });
    }

    throw new Error('No results from geocoding service');
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return NextResponse.json({ error: 'Failed to reverse geocode' }, { status: 500 });
  }
}
