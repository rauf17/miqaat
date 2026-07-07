'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Compass, AlertCircle, MapPin } from 'lucide-react';
import { useLocationStore } from '@/lib/store/locationStore';
import { getQiblaBearing } from '@/lib/qibla/calculate';

export function QiblaCompass() {
  const { lat, lng } = useLocationStore();
  const [heading, setHeading] = React.useState<number | null>(null);
  const [permissionState, setPermissionState] = React.useState<'prompt' | 'granted' | 'denied' | 'unsupported' | 'unknown'>('unknown');

  const qiblaBearing = React.useMemo(() => {
    if (lat === null || lng === null) return null;
    return getQiblaBearing(lat, lng);
  }, [lat, lng]);

  const handleOrientation = React.useCallback((event: DeviceOrientationEvent) => {
    let newHeading: number | null = null;
    
    // iOS
    if ('webkitCompassHeading' in event) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      newHeading = (event as any).webkitCompassHeading;
    } 
    // Android Absolute
    else if (event.absolute && event.alpha !== null) {
      newHeading = 360 - event.alpha;
    }

    if (newHeading !== null) {
      setHeading(newHeading);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.DeviceOrientationEvent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPermissionState('unsupported');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      setPermissionState('prompt');
    } else {
      setPermissionState('granted');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ('ondeviceorientationabsolute' in (window as any)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).addEventListener('deviceorientationabsolute', handleOrientation as any, true);
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    }

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.removeEventListener('deviceorientationabsolute', handleOrientation as any, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [handleOrientation]);

  const requestPermission = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setPermissionState('granted');
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          setPermissionState('denied');
        }
      }
    } catch (err) {
      console.warn("DeviceOrientation request failed", err);
      setPermissionState('denied');
    }
  };

  if (lat === null || lng === null) {
    return null; // Handled by parent
  }

  // If we have heading, dial rotation is -heading so North is aligned to reality.
  // If no heading (fallback), dial is 0 (North up).
  const dialRotation = heading !== null ? -heading : 0;
  
  // The needle rotates independently on top of the dial.
  // Its screen rotation is the physical Qibla bearing minus our current heading.
  const needleRotation = qiblaBearing !== null && heading !== null 
    ? qiblaBearing - heading 
    : (qiblaBearing ?? 0);
  
  // Calculate how close we are facing to Qibla (0 = perfectly facing, 180 = opposite)
  const isFacingQibla = heading !== null && qiblaBearing !== null 
    ? Math.abs((((heading - qiblaBearing + 180) % 360) + 360) % 360 - 180) < 5
    : false;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-8">
      {/* Fallback/Permission Alerts */}
      {permissionState === 'prompt' && (
        <div className="w-full flex flex-col space-y-4 p-5 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-md shadow-sm">
          <div className="flex items-start gap-3">
            <Compass className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-heading font-medium text-foreground">Live Compass</h4>
              <p className="text-sm text-muted-foreground leading-snug">
                For the compass to rotate as you move, Miqaat needs access to your device&apos;s orientation sensors.
              </p>
            </div>
          </div>
          <button
            onClick={requestPermission}
            className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-xl text-sm font-medium transition-all hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
          >
            Enable Compass
          </button>
        </div>
      )}

      {(permissionState === 'denied' || permissionState === 'unsupported' || (permissionState === 'granted' && heading === null)) && (
        <div className="w-full flex items-start gap-3 p-4 rounded-2xl border border-border/50 bg-muted/30 backdrop-blur-md text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 opacity-70" />
          <p>
            Showing static bearing. For a live compass, open on a mobile device and allow orientation access.
          </p>
        </div>
      )}

      {/* Compass UI */}
      <div className="relative flex flex-col items-center justify-center py-8">
        
        {/* Glow effect when facing Qibla */}
        <motion.div 
          className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-20"
          animate={{ opacity: isFacingQibla ? 1 : 0, scale: isFacingQibla ? 1.2 : 0.8 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* The SVG Dial */}
        <div className="relative w-72 h-72 rounded-full border border-border/30 bg-card/20 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex items-center justify-center overflow-hidden z-10">
          
          {/* Dial Layer */}
          <motion.div 
            className="absolute inset-0 w-full h-full"
            animate={{ rotate: dialRotation }}
            transition={{ type: "spring", stiffness: 50, damping: 20, mass: 1 }}
          >
            {/* Compass Marks */}
            <svg viewBox="0 0 200 200" className="w-full h-full text-foreground/40">
              <g className="font-heading text-[10px] font-semibold" fill="currentColor">
                <text x="100" y="25" textAnchor="middle" alignmentBaseline="middle">N</text>
                <text x="175" y="100" textAnchor="middle" alignmentBaseline="middle">E</text>
                <text x="100" y="175" textAnchor="middle" alignmentBaseline="middle">S</text>
                <text x="25" y="100" textAnchor="middle" alignmentBaseline="middle">W</text>
              </g>
              
              {/* Tick marks */}
              {Array.from({ length: 72 }).map((_, i) => {
                const angle = i * 5;
                const isMajor = i % 18 === 0;
                const isMedium = i % 9 === 0;
                const length = isMajor ? 8 : isMedium ? 5 : 3;
                const strokeWidth = isMajor ? 2 : 1;
                const opacity = isMajor ? 0.5 : 0.2;
                return (
                  <line 
                    key={i}
                    x1="100" y1="5" x2="100" y2={5 + length}
                    stroke="currentColor" strokeWidth={strokeWidth}
                    opacity={opacity}
                    transform={`rotate(${angle} 100 100)`}
                  />
                );
              })}
            </svg>
          </motion.div>

          {/* Needle Layer */}
          <motion.div 
            className="absolute inset-0 w-full h-full"
            initial={false}
            animate={{ rotate: needleRotation }}
            transition={{ type: "spring", stiffness: 40, damping: 15, mass: 1 }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Needle Base Line */}
              <line x1="100" y1="100" x2="100" y2="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-primary/50" />
              {/* Kaaba / Arrow Indicator */}
              <polygon points="90,45 100,20 110,45 100,40" className="fill-primary" />
              <circle cx="100" cy="100" r="4" className="fill-primary" />
              <circle cx="100" cy="100" r="2" className="fill-background" />
            </svg>
          </motion.div>
        </div>

        {/* Readouts */}
        <div className="mt-12 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground uppercase tracking-widest font-bold">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Qibla Bearing</span>
          </div>
          <div className="text-5xl font-heading font-light tracking-tight text-foreground">
            {qiblaBearing !== null ? Math.round(qiblaBearing) : '--'}°
          </div>
          {isFacingQibla && (
             <motion.p 
               initial={{ opacity: 0, y: 5 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-sm font-medium text-primary"
             >
               You are facing the Qibla
             </motion.p>
          )}
        </div>

      </div>
    </div>
  );
}
