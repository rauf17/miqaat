'use client';

import * as React from 'react';
import { useLocationStore } from '@/lib/store/locationStore';
import { useTimeOfDay } from '@/lib/theme/useTimeOfDay';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  CloudDrizzle,
  CloudFog,
  CloudOff
} from 'lucide-react';

type WeatherData = {
  tempC: number;
  conditionCode: number;
};



export function WeatherWidget() {
  const { lat, lng } = useLocationStore();
  const updateTimeOfDay = useTimeOfDay((s) => s.updateTimeOfDay);
  const [data, setData] = React.useState<WeatherData | null>(null);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (lat === null || lng === null) return;

    let mounted = true;
    
    async function fetchWeather() {
      setLoading(true);
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
        if (!res.ok) throw new Error('Weather fetch failed');
        const json = await res.json();
        if (mounted && json.tempC !== undefined) {
          setData(json);
          setError(false);
          if (json.sunrise && json.sunset) {
            updateTimeOfDay(new Date(json.sunrise), new Date(json.sunset));
          }
        } else {
          throw new Error('Invalid weather data');
        }
      } catch (err) {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchWeather();
    
    return () => { mounted = false; };
  }, [lat, lng]);

  if (lat === null || lng === null) return null;
  
  // Minimal fallback: if loading, just show an empty placeholder or don't render. 
  // If error, show a quiet offline state so it doesn't break UI.
  if (loading) {
    return (
      <div className="flex items-center px-3 py-1.5 h-[30px] w-[50px] rounded-full bg-card/10 animate-pulse border border-border/20 backdrop-blur-md" />
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/20 border border-border/30 backdrop-blur-md text-muted-foreground/50 text-xs font-medium font-sans">
        <CloudOff className="w-3.5 h-3.5" />
      </div>
    );
  }

  let Icon = Cloud;
  const code = data.conditionCode;
  
  if (code === undefined) Icon = CloudOff;
  else if (code === 0) Icon = Sun; // Clear sky
  else if (code === 1 || code === 2 || code === 3) Icon = Cloud; // Mainly clear, partly cloudy, overcast
  else if (code === 45 || code === 48) Icon = CloudFog; // Fog
  else if (code >= 51 && code <= 57) Icon = CloudDrizzle; // Drizzle
  else if (code >= 61 && code <= 67) Icon = CloudRain; // Rain
  else if (code >= 71 && code <= 77) Icon = Snowflake; // Snow
  else if (code >= 80 && code <= 82) Icon = CloudRain; // Rain showers
  else if (code === 85 || code === 86) Icon = Snowflake; // Snow showers
  else if (code >= 95) Icon = CloudLightning; // Thunderstorm

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/30 border border-border/50 backdrop-blur-md text-muted-foreground text-xs font-medium font-sans shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-opacity">
      <Icon className="w-3.5 h-3.5 text-foreground/70" />
      <span>{data.tempC}°</span>
    </div>
  );
}
