export const KAABA_LAT = 21.4225;
export const KAABA_LNG = 39.8262;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Validates geographic coordinates. Throws RangeError on invalid input
 * so downstream code can't silently produce NaN bearings (audit QIB-010).
 */
export function validateCoordinates(lat: number, lng: number): void {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new RangeError(`Invalid coordinates: lat=${lat}, lng=${lng}`);
  }
  if (lat < -90 || lat > 90) {
    throw new RangeError(`Latitude out of range [-90, 90]: ${lat}`);
  }
  if (lng < -180 || lng > 180) {
    throw new RangeError(`Longitude out of range [-180, 180]: ${lng}`);
  }
}

/**
 * Calculates the great-circle bearing from a given location to the Kaaba.
 *
 * @param lat User's latitude in degrees
 * @param lng User's longitude in degrees
 * @returns The bearing to Qibla in degrees (0-360)
 * @throws RangeError if coordinates are invalid (audit QIB-010)
 */
export function getQiblaBearing(lat: number, lng: number): number {
  validateCoordinates(lat, lng);

  const phiK = toRadians(KAABA_LAT);
  const lambdaK = toRadians(KAABA_LNG);
  const phi = toRadians(lat);
  const lambda = toRadians(lng);

  const y = Math.sin(lambdaK - lambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);

  let qibla = Math.atan2(y, x);

  // Convert from radians to degrees
  qibla = toDegrees(qibla);

  // Normalize to 0-360
  return (qibla + 360) % 360;
}
