import { CalculationMethod as AdhanMethod } from 'adhan';

export type CalculationMethodId = 'MWL' | 'ISNA' | 'UMM_AL_QURA' | 'KARACHI' | 'EGYPTIAN' | 'DUBAI';

export interface MethodMetadata {
  id: CalculationMethodId;
  name: string;
  regionDescription: string;
  getAdhanMethod: () => ReturnType<typeof AdhanMethod.MuslimWorldLeague>;
}

export const CALCULATION_METHODS: Record<CalculationMethodId, MethodMetadata> = {
  MWL: {
    id: 'MWL',
    name: 'Muslim World League',
    regionDescription: 'Europe, Far East, parts of US',
    getAdhanMethod: () => AdhanMethod.MuslimWorldLeague(),
  },
  ISNA: {
    id: 'ISNA',
    name: 'Islamic Society of North America (ISNA)',
    regionDescription: 'North America (US and Canada)',
    getAdhanMethod: () => AdhanMethod.NorthAmerica(),
  },
  UMM_AL_QURA: {
    id: 'UMM_AL_QURA',
    name: 'Umm Al-Qura University, Makkah',
    regionDescription: 'Arabian Peninsula',
    getAdhanMethod: () => AdhanMethod.UmmAlQura(),
  },
  KARACHI: {
    id: 'KARACHI',
    name: 'University of Islamic Sciences, Karachi',
    regionDescription: 'Pakistan, Bangladesh, India, Afghanistan, parts of Europe',
    getAdhanMethod: () => AdhanMethod.Karachi(),
  },
  EGYPTIAN: {
    id: 'EGYPTIAN',
    name: 'Egyptian General Authority of Survey',
    regionDescription: 'Africa, Syria, Iraq, Lebanon, Malaysia, parts of US',
    getAdhanMethod: () => AdhanMethod.Egyptian(),
  },
  DUBAI: {
    id: 'DUBAI',
    name: 'Dubai',
    regionDescription: 'Dubai and UAE',
    getAdhanMethod: () => AdhanMethod.Dubai(),
  },
};
