'use client';

import * as React from 'react';
import { useTimeOfDay } from '@/lib/theme/useTimeOfDay';

export function AmbientBackground() {
  const { timeOfDay } = useTimeOfDay();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen transition-opacity duration-1000 opacity-50">
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .ambient-drift { animation: ambientDrift 60s linear infinite; }
          .ambient-drift-slow { animation: ambientDrift 120s linear infinite reverse; }
          .ambient-twinkle { animation: ambientTwinkle 4s ease-in-out infinite alternate; }
          .ambient-twinkle-delay { animation: ambientTwinkle 5s ease-in-out 2s infinite alternate; }
          .ambient-glow-shift { animation: ambientGlowShift 20s ease-in-out infinite alternate; }
        }
        @keyframes ambientDrift {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes ambientTwinkle {
          0% { opacity: 0.1; transform: scale(0.8); }
          100% { opacity: 0.8; transform: scale(1.2); }
        }
        @keyframes ambientGlowShift {
          0% { transform: scale(1) translate(0, 0); opacity: 0.2; }
          100% { transform: scale(1.2) translate(5%, 5%); opacity: 0.5; }
        }
      `}</style>

      {(timeOfDay === 'dawn' || timeOfDay === 'day') && (
        <div className="absolute inset-0 flex opacity-60 ambient-drift">
          {/* Use radial gradients instead of SVG blurs for massive performance gain */}
          <div className="absolute top-1/4 left-[10%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-3xl mix-blend-screen" />
          <div className="absolute top-1/5 left-[30%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-3xl mix-blend-screen" />
          <div className="absolute top-1/3 left-[40%] w-[35vw] h-[35vw] rounded-full bg-primary/20 blur-3xl mix-blend-screen" />
          
          {/* Mirrored half for seamless loop */}
          <div className="absolute top-1/4 left-[60%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-3xl mix-blend-screen" />
          <div className="absolute top-1/5 left-[80%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-3xl mix-blend-screen" />
          <div className="absolute top-1/3 left-[90%] w-[35vw] h-[35vw] rounded-full bg-primary/20 blur-3xl mix-blend-screen" />
        </div>
      )}

      {timeOfDay === 'golden' && (
        <div className="absolute inset-0 flex justify-center items-center">
          <svg className="w-full h-full ambient-glow-shift" viewBox="0 0 100 100" preserveAspectRatio="none">
             <defs>
               <radialGradient id="golden-glow" cx="50%" cy="50%" r="50%">
                 <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" className="text-primary" />
                 <stop offset="50%" stopColor="currentColor" stopOpacity="0.3" className="text-primary" />
                 <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-primary" />
               </radialGradient>
             </defs>
             <circle cx="50" cy="50" r="50" fill="url(#golden-glow)" />
          </svg>
        </div>
      )}

      {timeOfDay === 'night' && (
        <div className="absolute inset-0">
          <svg className="absolute inset-0 w-[200vw] h-full ambient-drift-slow" viewBox="0 0 2000 1000" preserveAspectRatio="none">
            {/* First half (0 - 1000) */}
            <circle cx="100" cy="150" r="2" fill="#FFF" className="ambient-twinkle" />
            <circle cx="250" cy="300" r="1.5" fill="#FFF" className="ambient-twinkle-delay" />
            <circle cx="450" cy="100" r="2.5" fill="#FFF" className="ambient-twinkle" />
            <circle cx="650" cy="450" r="1.5" fill="#FFF" className="ambient-twinkle-delay" />
            <circle cx="850" cy="200" r="2" fill="#FFF" className="ambient-twinkle" />
            
            {/* Second half (1000 - 2000) perfectly mirrored */}
            <circle cx="1100" cy="150" r="2" fill="#FFF" className="ambient-twinkle" />
            <circle cx="1250" cy="300" r="1.5" fill="#FFF" className="ambient-twinkle-delay" />
            <circle cx="1450" cy="100" r="2.5" fill="#FFF" className="ambient-twinkle" />
            <circle cx="1650" cy="450" r="1.5" fill="#FFF" className="ambient-twinkle-delay" />
            <circle cx="1850" cy="200" r="2" fill="#FFF" className="ambient-twinkle" />
          </svg>
          
          <svg className="absolute inset-0 w-[200vw] h-full ambient-drift opacity-40" viewBox="0 0 2000 1000" preserveAspectRatio="none">
            {/* Particles - First half */}
            <circle cx="150" cy="600" r="1" fill="#FFF" />
            <circle cx="350" cy="800" r="1" fill="#FFF" />
            <circle cx="550" cy="500" r="1.5" fill="#FFF" />
            <circle cx="750" cy="700" r="1" fill="#FFF" />
            <circle cx="950" cy="900" r="1" fill="#FFF" />
            
            {/* Particles - Second half */}
            <circle cx="1150" cy="600" r="1" fill="#FFF" />
            <circle cx="1350" cy="800" r="1" fill="#FFF" />
            <circle cx="1550" cy="500" r="1.5" fill="#FFF" />
            <circle cx="1750" cy="700" r="1" fill="#FFF" />
            <circle cx="1950" cy="900" r="1" fill="#FFF" />
          </svg>
        </div>
      )}
    </div>
  );
}
