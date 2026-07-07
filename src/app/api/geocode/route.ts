import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const city = searchParams.get('city');

  const apiKey = process.env.GEOCODING_API_KEY;

  // Forward Geocoding (by city name)
  if (city) {
    if (apiKey && apiKey !== 'placeholder_geocoding_key' && apiKey.trim() !== '') {
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          let resolvedCity = city;
          let resolvedCountry = 'Unknown Country';
          
          for (const component of data.results[0].address_components) {
            if (component.types.includes('locality') || component.types.includes('postal_town')) {
              resolvedCity = component.long_name;
            }
            if (component.types.includes('country')) {
              resolvedCountry = component.long_name;
            }
          }
          
          return NextResponse.json({
            lat: location.lat,
            lng: location.lng,
            city: resolvedCity,
            country: resolvedCountry,
          });
        }
        throw new Error('No results found');
      } catch (error) {
        console.error('Google forward geocoding failed:', error);
        return NextResponse.json({ error: 'Failed to geocode city' }, { status: 500 });
      }
    } else {
      // Free Fallback: Nominatim (OpenStreetMap)
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&accept-language=en`;
        const response = await fetch(url, { headers: { 'User-Agent': 'MiqaatApp/1.0' } });
        const data = await response.json();
        
        if (data && data.length > 0) {
          const result = data[0];
          // Try to parse city and country from display_name if possible, or just use the input
          const parts = result.display_name.split(',').map((p: string) => p.trim());
          const resolvedCountry = parts.length > 1 ? parts[parts.length - 1] : 'Unknown Country';
          
          return NextResponse.json({
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            city: parts[0],
            country: resolvedCountry,
          });
        }
        throw new Error('No results found');
      } catch (error) {
        console.error('Nominatim forward geocoding failed:', error);
        return NextResponse.json({ error: 'Failed to geocode city' }, { status: 500 });
      }
    }
  }

  // Reverse Geocoding (by lat/lng)
  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing coordinates or city' }, { status: 400 });
  }

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
      
      let resolvedCity = '';
      let resolvedCountry = '';

      for (const component of addressComponents) {
        if (component.types.includes('locality') || component.types.includes('postal_town')) {
          resolvedCity = component.long_name;
        }
        if (component.types.includes('country')) {
          resolvedCountry = component.long_name;
        }
      }

      // Fallback to top level admin area if city wasn't found
      if (!resolvedCity) {
        const adminArea = addressComponents.find((c: { types: string[] }) => c.types.includes('administrative_area_level_1'));
        if (adminArea) resolvedCity = adminArea.long_name;
      }

      return NextResponse.json({
        city: resolvedCity || 'Unknown City',
        country: resolvedCountry || 'Unknown Country',
      });
    }

    throw new Error('No results from geocoding service');
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return NextResponse.json({ error: 'Failed to reverse geocode' }, { status: 500 });
  }
}
