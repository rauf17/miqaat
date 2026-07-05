import { calculatePrayerTimes } from './src/lib/prayer/calculate';

const times = calculatePrayerTimes({
  lat: 21.4225,
  lng: 39.8262,
  date: new Date(2024, 0, 1, 12, 0, 0),
  method: 'UMM_AL_QURA',
});

console.log('fajr:', times.fajr.getUTCHours(), times.fajr.getUTCMinutes());
console.log('sunrise:', times.sunrise.getUTCHours(), times.sunrise.getUTCMinutes());
console.log('dhuhr:', times.dhuhr.getUTCHours(), times.dhuhr.getUTCMinutes());
console.log('asr:', times.asr.getUTCHours(), times.asr.getUTCMinutes());
console.log('maghrib:', times.maghrib.getUTCHours(), times.maghrib.getUTCMinutes());
console.log('isha:', times.isha.getUTCHours(), times.isha.getUTCMinutes());
