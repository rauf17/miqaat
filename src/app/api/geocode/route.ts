import { NextResponse } from 'next/server';
import { parseCoords, rateLimit, getClientIp, safeFetch, withCache } from '@/lib/api-utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const city = searchParams.get('city');

  // WTH-010: rate limit (5 req/IP/10s — geocoding is expensive and
  // Nominatim policy is ≤1 req/s). Also protects Google API spend.
  const ip = getClientIp(request);
  if (!rateLimit(ip, 5, 0.5)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const apiKey = process.env.GEOCODING_API_KEY;
  const hasGoogleKey = !!(apiKey && apiKey !== 'placeholder_geocoding_key' && apiKey.trim() !== '');

  // Forward Geocoding (by city name)
  if (city) {
    if (hasGoogleKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`;
        const response = await safeFetch(url, {}, 8000);
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

          // WTH-028: cache geocode results for 24h (cities don't move)
          return withCache({
            lat: location.lat,
            lng: location.lng,
            city: resolvedCity,
            country: resolvedCountry,
          }, 200, 86400, 604800);
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
        const response = await safeFetch(url, { headers: { 'User-Agent': 'MiqaatApp/1.0' } }, 8000);
        const data = await response.json();

        if (data && data.length > 0) {
          const result = data[0];
          const parts = result.display_name.split(',').map((p: string) => p.trim());
          const resolvedCountry = parts.length > 1 ? parts[parts.length - 1] : 'Unknown Country';

          return withCache({
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            city: parts[0],
            country: resolvedCountry,
          }, 200, 86400, 604800);
        }
        throw new Error('No results found');
      } catch (error) {
        console.error('Nominatim forward geocoding failed:', error);
        return NextResponse.json({ error: 'Failed to geocode city' }, { status: 500 });
      }
    }
  }

  // Reverse Geocoding (by lat/lng) — validate coordinates (WTH-002)
  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing coordinates or city' }, { status: 400 });
  }
  const coordsResult = parseCoords(searchParams);
  if (coordsResult instanceof Response) return coordsResult;

  if (hasGoogleKey) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
      const response = await safeFetch(url, {}, 8000);
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

        if (!resolvedCity) {
          const adminArea = addressComponents.find((c: { types: string[] }) => c.types.includes('administrative_area_level_1'));
          if (adminArea) resolvedCity = adminArea.long_name;
        }

        return withCache({
          city: resolvedCity || 'Unknown City',
          country: resolvedCountry || 'Unknown Country',
        }, 200, 86400, 604800);
      }

      throw new Error('No results from geocoding service');
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return NextResponse.json({ error: 'Failed to reverse geocode' }, { status: 500 });
    }
  } else {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`;
      const response = await safeFetch(url, { headers: { 'User-Agent': 'MiqaatApp/1.0' } }, 8000);
      const data = await response.json();

      if (data && data.address) {
        const city = data.address.city || data.address.town || data.address.village || data.address.county || 'Unknown City';
        const country = data.address.country || 'Unknown Country';

        return withCache({
          city: city,
          country: country,
        }, 200, 86400, 604800);
      }

      throw new Error('No results from Nominatim reverse geocoding');
    } catch (error) {
      console.error('Nominatim reverse geocoding failed:', error);
      return NextResponse.json({ error: 'Failed to reverse geocode' }, { status: 500 });
    }
  }
}
