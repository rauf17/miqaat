'use client';

import * as React from 'react';
import { useLocationStore } from '@/lib/store/locationStore';
import { generateCacheKey, getCachedReflection, setCachedReflection } from '@/lib/reflection/cache';
import { getDailyContent } from '@/lib/content/daily-selector';
import { getWeatherDescription } from '@/lib/weather/utils';
import { toHijri } from '@/lib/hijri/convert';
import { useTimeOfDay } from '@/lib/theme/useTimeOfDay';
import { useWeatherStore } from '@/lib/store/weatherStore';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';

export function DailyContentPanel() {
  const { lat, lng } = useLocationStore();
  const [reflection, setReflection] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const { timeOfDay } = useTimeOfDay();
  const { data: weatherData } = useWeatherStore();
  const weatherCondition = getWeatherDescription(weatherData?.current?.conditionCode);
  
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  const content = React.useMemo(() => getDailyContent(dateStr), [dateStr]);
  const activeText = content.showVerse 
    ? `Quran Surah ${content.verse.surah} ${content.verse.reference}:\n${content.verse.english}`
    : `${content.hadith.collection} Book ${content.hadith.book}, Hadith ${content.hadith.number}:\n${content.hadith.text}`;

  React.useEffect(() => {
    async function fetchReflection() {
      if (lat === null || lng === null) return;
      
      setIsLoading(true);
      const locationHash = `${lat.toFixed(2)},${lng.toFixed(2)}`;
      const cacheKey = generateCacheKey(dateStr, locationHash);
      
      const cached = getCachedReflection(cacheKey);
      if (cached) {
        setReflection(cached.text);
        setIsLoading(false);
        return;
      }
      
      try {
        const now = new Date();
        const isFriday = now.getDay() === 5;
        const isRamadan = toHijri(now).monthName.toLowerCase() === 'ramadan';

        const res = await fetch('/api/reflection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            dateStr, 
            contentText: activeText,
            context: {
              timeOfDay,
              isFriday,
              isRamadan,
              weatherCondition
            }
          })
        });
        
        if (!res.ok) throw new Error('Failed to fetch');
        
        const data = await res.json();
        
        if (data.text) {
          setReflection(data.text);
          setCachedReflection(cacheKey, { text: data.text, dateStr, locationHash });
        } else {
          throw new Error('Empty response');
        }
      } catch {
        // Fallback is simply not showing a reflection if validation/network fails.
        setReflection(null);
      } finally {
        setIsLoading(false);
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReflection();
  }, [lat, lng, dateStr, activeText, timeOfDay, weatherCondition]);

  if (lat === null || lng === null) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full bg-card/60 backdrop-blur-md border border-border/50 shadow-sm rounded-3xl overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <BookOpen className="w-32 h-32" />
      </div>

      <div className="p-6 md:p-8 flex flex-col gap-6 relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-2 text-primary">
          <BookOpen className="w-4 h-4" />
          <h3 className="text-sm font-medium uppercase tracking-wider">
            {content.showVerse ? 'Verse of the Day' : 'Hadith of the Day'}
          </h3>
        </div>

        {/* Primary Scripture Content */}
        <div className="flex flex-col gap-4">
          {content.showVerse && (
            <p className="text-right text-2xl md:text-3xl leading-relaxed text-foreground font-arabic" dir="rtl" lang="ar">
              {content.verse.arabic}
            </p>
          )}
          <p className="text-foreground/90 text-lg md:text-xl font-serif italic leading-relaxed">
            &quot;{content.showVerse ? content.verse.english : content.hadith.text}&quot;
          </p>
          <p className="text-muted-foreground text-sm font-medium">
            — {content.showVerse 
                 ? `Quran, Surah ${content.verse.surah} (${content.verse.reference})` 
                 : `${content.hadith.collection}, Book ${content.hadith.book}, Hadith ${content.hadith.number}`
              }
          </p>
        </div>
      </div>

      {/* Secondary Reflection Content */}
      {(reflection || isLoading) && (
        <div className="bg-muted/30 border-t border-border/50 p-6 md:p-8 relative z-10">
          <div className="flex items-center gap-2 text-primary/80 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <h4 className="text-xs font-semibold uppercase tracking-widest">Daily Reflection</h4>
          </div>
          
          {isLoading && !reflection ? (
            <div className="space-y-2 w-full animate-pulse mt-2">
              <div className="h-4 bg-border/50 rounded w-full"></div>
              <div className="h-4 bg-border/50 rounded w-5/6"></div>
              <div className="h-4 bg-border/50 rounded w-4/6"></div>
            </div>
          ) : (
            <p className="text-muted-foreground leading-relaxed text-sm">
              {reflection}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
