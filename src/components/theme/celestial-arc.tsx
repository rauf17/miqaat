'use client';

import * as React from 'react';
import { useRef } from 'react';
import { useTimeOfDay } from '@/lib/theme/useTimeOfDay';
import { useReduceMotion } from '@/lib/theme/use-reduce-motion';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useTransform, useAnimationFrame, PanInfo } from 'framer-motion';

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
  const reduceMotion = useReduceMotion();

  const isNight = timeOfDay === 'night';
  
  // Calculate percentage positions to perfectly track the SVG viewBox
  const angle = progress * Math.PI;
  const leftPercent = ((1 - Math.cos(angle)) / 2) * 100;
  const topPercent = 100 - 80 * Math.sin(angle);

  // --- Interactive 3D Spinning Logic ---
  const baseSpeed = -0.02; // Base speed of rotation (pixels per millisecond)
  const rotation = useMotionValue(0);
  const velocity = useMotionValue(reduceMotion ? 0 : baseSpeed);
  const isDragging = useRef(false);

  useAnimationFrame((time, delta) => {
    if (reduceMotion) return;
    
    if (!isDragging.current) {
      // Smoothly decay velocity back to the base speed
      const currentV = velocity.get();
      const decayFactor = 0.05; // Controls how fast it slows down after spinning
      velocity.set(currentV + (baseSpeed - currentV) * decayFactor);
    }
    
    // Apply velocity to rotation
    rotation.set(rotation.get() + velocity.get() * delta);
  });

  // Map the rotation pixel value to the CSS background-position property
  const backgroundPosition = useTransform(rotation, (r) => `${r}px center`);

  const handlePanStart = () => {
    isDragging.current = true;
  };

  const handlePan = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Directly update the rotation by the pan delta
    rotation.set(rotation.get() + info.delta.x);
    // Update velocity based on the pan delta so it carries momentum when released
    // (Assuming ~16ms per frame for 60fps)
    velocity.set(info.delta.x / 16);
  };

  const handlePanEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-70">
      
      {/* Required keyframes for the spinning effect */}
      <style>{`
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
          className="absolute origin-center pointer-events-auto cursor-grab active:cursor-grabbing"
          style={{ 
            left: `${leftPercent}%`, 
            top: `${topPercent}%`,
            width: isNight ? '80px' : '100px',
            height: isNight ? '80px' : '100px',
            transform: 'translate(-50%, -50%)',
            touchAction: 'none' // Prevent scrolling when spinning the sphere
          }}
          animate={{
            left: `${leftPercent}%`,
            top: `${topPercent}%`
          }}
          transition={reduceMotion ? { duration: 0 } : { duration: 1, ease: "linear" }}
          onPanStart={handlePanStart}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
        >
          {isNight ? (
            // PHOTOREALISTIC 3D MOON
            <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
              {/* Distant atmospheric glow */}
              <div className="absolute inset-[-50%] bg-blue-100/10 blur-2xl rounded-full mix-blend-screen" />
              <div className="absolute inset-[-20%] bg-blue-50/20 blur-xl rounded-full mix-blend-screen" />
              
              {/* The Moon Sphere */}
              <motion.div 
                className="relative w-16 h-16 rounded-full overflow-hidden"
                style={{
                  backgroundImage: "url('/moon-texture.png')",
                  backgroundSize: "200% 100%",
                  backgroundPosition,
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
            <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
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
              <motion.div 
                className="relative w-16 h-16 rounded-full overflow-hidden"
                style={{
                  backgroundImage: "url('/sun-texture.png')",
                  backgroundSize: "200% 100%",
                  backgroundPosition,
                  // Complex 3D shading: bright hot spot in the center, fiery edges
                  boxShadow: `
                    inset -8px -8px 20px rgba(234, 88, 12, 0.8),
                    inset 8px 8px 20px rgba(253, 224, 71, 0.6),
                    0 0 30px rgba(253, 224, 71, 0.6)
                  `
                }}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
