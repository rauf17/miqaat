export interface MoonPhaseResult {
  phase: number; // 0.0 to 1.0
  name: string;
  illumination: number; // 0 to 100
}

export function getMoonPhase(date: Date = new Date()): MoonPhaseResult {
  const LUNAR_MONTH = 29.53058867;
  
  // Reference New Moon: 2024-01-11T11:57:00Z
  const knownNewMoon = new Date('2024-01-11T11:57:00Z').getTime();
  
  const diff = date.getTime() - knownNewMoon;
  const days = diff / (1000 * 60 * 60 * 24);
  
  let phase = days % LUNAR_MONTH;
  if (phase < 0) phase += LUNAR_MONTH; 
  
  // Normalize to 0.0 - 1.0
  const normalized = phase / LUNAR_MONTH;
  
  // Illumination calculation: 50% * (1 - cos(normalized * 2 * PI))
  const illumination = 50 * (1 - Math.cos(normalized * 2 * Math.PI));

  // Determine the name of the phase (approximate slices)
  let name = "";
  if (normalized < 0.03 || normalized > 0.97) name = "New Moon";
  else if (normalized < 0.22) name = "Waxing Crescent";
  else if (normalized < 0.28) name = "First Quarter";
  else if (normalized < 0.47) name = "Waxing Gibbous";
  else if (normalized < 0.53) name = "Full Moon";
  else if (normalized < 0.72) name = "Waning Gibbous";
  else if (normalized < 0.78) name = "Last Quarter";
  else name = "Waning Crescent";

  return {
    phase: normalized,
    name,
    illumination: Math.round(illumination)
  };
}
