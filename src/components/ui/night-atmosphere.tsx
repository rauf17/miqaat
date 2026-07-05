import * as React from 'react';
import { cn } from '@/lib/utils';

interface NightAtmosphereProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  isNight?: boolean; // We could control this dynamically, but usually we just mount it and let CSS opacity hide it based on data-time-of-day
}

export function NightAtmosphere({ className, ...props }: NightAtmosphereProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('absolute inset-0 h-full w-full pointer-events-none opacity-0 transition-opacity duration-[60s] ease-in-out', className)}
      // We rely on the global data-time-of-day="night" selector to show this component.
      // We can add a class that becomes visible only in night mode.
      data-night-atmosphere
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <style>
        {`
          [data-time-of-day="night"] [data-night-atmosphere] {
            opacity: 1;
          }
          
          .star {
            fill: currentColor;
            opacity: 0.8;
            animation: twinkle 4s infinite ease-in-out alternate;
          }
          
          .star-1 { animation-delay: 0s; }
          .star-2 { animation-delay: 1s; }
          .star-3 { animation-delay: 2s; }
          .star-4 { animation-delay: 3s; }
          
          @keyframes twinkle {
            0% { opacity: 0.2; transform: scale(0.8); }
            100% { opacity: 0.9; transform: scale(1.1); }
          }
          
          @media (prefers-reduced-motion: reduce) {
            .star {
              animation: none;
            }
          }
        `}
      </style>
      
      {/* Subtle Moon Glyph */}
      <path
        d="M85 20 A 12 12 0 1 0 95 30 A 15 15 0 0 1 85 20 Z"
        fill="currentColor"
        className="opacity-10 mix-blend-overlay"
      />
      
      {/* Star points distributed across the view */}
      <circle cx="15" cy="25" r="0.4" className="star star-1 mix-blend-overlay opacity-30" />
      <circle cx="35" cy="15" r="0.6" className="star star-2 mix-blend-overlay opacity-20" />
      <circle cx="65" cy="25" r="0.3" className="star star-3 mix-blend-overlay opacity-40" />
      <circle cx="80" cy="55" r="0.5" className="star star-4 mix-blend-overlay opacity-20" />
      <circle cx="20" cy="65" r="0.4" className="star star-2 mix-blend-overlay opacity-30" />
      <circle cx="45" cy="80" r="0.6" className="star star-1 mix-blend-overlay opacity-20" />
      <circle cx="85" cy="85" r="0.4" className="star star-3 mix-blend-overlay opacity-30" />
    </svg>
  );
}
