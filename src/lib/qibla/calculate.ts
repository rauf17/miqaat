export const KAABA_LAT = 21.4225;
export const KAABA_LNG = 39.8262;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calculates the great-circle bearing from a given location to the Kaaba.
 * 
 * @param lat User's latitude in degrees
 * @param lng User's longitude in degrees
 * @returns The bearing to Qibla in degrees (0-360)
 */
export function getQiblaBearing(lat: number, lng: number): number {
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
