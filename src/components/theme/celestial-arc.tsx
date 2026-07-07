'use client';

import * as React from 'react';
import { useTimeOfDay } from '@/lib/theme/useTimeOfDay';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

function useCelestialProgress() {
  const { timeOfDay, sunrise, sunset } = useTimeOfDay();
  const [progress, setProgress] = React.useState(0.5); // Default to peak

  React.useEffect(() => {
    if (!sunrise || !sunset) return;

    const updateProgress = () => {
      const now = new Date().getTime();
      const sr = sunrise.getTime();
      const ss = sunset.getTime();

      let currentProgress = 0.5;

      if (timeOfDay === 'day' || timeOfDay === 'dawn' || timeOfDay === 'golden') {
        // Daylight arc
        const totalDaylight = ss - sr;
        currentProgress = (now - sr) / totalDaylight;
      } else {
        // Nighttime arc
        if (now < sr) {
          // Past midnight, approaching today's sunrise. Base off yesterday's sunset.
          const yesterdaySunset = ss - 24 * 60 * 60 * 1000;
          const totalNight = sr - yesterdaySunset;
          currentProgress = (now - yesterdaySunset) / totalNight;
        } else {
          // After sunset, approaching tomorrow's sunrise.
          const tomorrowSunrise = sr + 24 * 60 * 60 * 1000;
          const totalNight = tomorrowSunrise - ss;
          currentProgress = (now - ss) / totalNight;
        }
      }
      
      // Clamp between -0.1 and 1.1 so it doesn't go too far off screen
      setProgress(Math.max(-0.1, Math.min(1.1, currentProgress)));
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [timeOfDay, sunrise, sunset]);

  return progress;
}

export function CelestialArc() {
  const { timeOfDay } = useTimeOfDay();
  const progress = useCelestialProgress();
  const { reduceMotion } = useSettingsStore();

  const isNight = timeOfDay === 'night';
  
  // Calculate percentage positions to perfectly track the SVG viewBox
  const angle = progress * Math.PI;
  const leftPercent = ((1 - Math.cos(angle)) / 2) * 100;
  const topPercent = 100 - 80 * Math.sin(angle);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-70">
      
      {/* Required keyframes for the spinning effect */}
      <style>{`
        @keyframes spinMoon {
          from { background-position: 0% center; }
          to { background-position: 200% center; }
        }
        @keyframes pulseSun {
          0% { transform: scale(1) translate(-50%, -50%); opacity: 0.8; }
          100% { transform: scale(1.1) translate(-45%, -45%); opacity: 1; }
        }
      `}</style>

      <div className="absolute bottom-0 left-0 w-full h-[70vh]">
        {/* The glowing arc path */}
        <svg 
          viewBox="0 0 200 100" 
          preserveAspectRatio="none" 
          className="absolute inset-0 w-full h-full mix-blend-screen"
        >
          <defs>
            <linearGradient id="arc-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="20%" stopColor="currentColor" stopOpacity="0.2" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.6" />
              <stop offset="80%" stopColor="currentColor" stopOpacity="0.2" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d="M 0 100 A 100 80 0 0 1 200 100" 
            fill="none" 
            stroke="url(#arc-glow)" 
            strokeWidth="0.3" 
            className="text-foreground/40" 
            strokeDasharray="1 3" 
          />
        </svg>

        {/* The Celestial Body */}
        <motion.div
          className="absolute origin-center"
          style={{ 
            left: `${leftPercent}%`, 
            top: `${topPercent}%`,
            width: isNight ? '80px' : '100px',
            height: isNight ? '80px' : '100px',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            left: `${leftPercent}%`,
            top: `${topPercent}%`
          }}
          transition={reduceMotion ? { duration: 0 } : { duration: 1, ease: "linear" }}
        >
          {isNight ? (
            // PHOTOREALISTIC 3D MOON
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Distant atmospheric glow */}
              <div className="absolute inset-[-50%] bg-blue-100/10 blur-2xl rounded-full mix-blend-screen" />
              <div className="absolute inset-[-20%] bg-blue-50/20 blur-xl rounded-full mix-blend-screen" />
              
              {/* The Moon Sphere */}
              <div 
                className="relative w-16 h-16 rounded-full overflow-hidden"
                style={{
                  backgroundImage: "url('/moon-texture.png')",
                  backgroundSize: "200% 100%",
                  // Spin animation
                  animation: reduceMotion ? 'none' : 'spinMoon 40s linear infinite',
                  // Complex 3D shading: dark side on bottom left, bright side on top right
                  boxShadow: `
                    inset -16px -16px 20px rgba(0,0,0,0.8),
                    inset 8px 8px 15px rgba(255,255,255,0.4),
                    0 0 20px rgba(226, 232, 240, 0.4)
                  `
                }}
              />
            </div>
          ) : (
            // BRILLIANT 3D SUN
            <div className="relative w-full h-full flex items-center justify-center mix-blend-screen">
              {/* Intense outer corona */}
              <div 
                className="absolute inset-[-60%] rounded-full opacity-60"
                style={{
                  background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, rgba(245,158,11,0.1) 40%, rgba(0,0,0,0) 70%)',
                  animation: reduceMotion ? 'none' : 'pulseSun 4s ease-in-out infinite alternate',
                }}
              />
              <div className="absolute inset-[-20%] rounded-full blur-xl bg-amber-500/40" />
              
              {/* The Sun Sphere */}
              <div 
                className="relative w-12 h-12 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #fef08a 30%, #f59e0b 80%, #ea580c 100%)',
                  boxShadow: '0 0 30px rgba(253, 224, 71, 0.8), inset -4px -4px 10px rgba(234, 88, 12, 0.6)'
                }}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
