import * as React from 'react';
import { cn } from '@/lib/utils';

interface NightAtmosphereProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function NightAtmosphere({ className, ...props }: NightAtmosphereProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={cn('absolute inset-0 h-full w-full pointer-events-none opacity-0 transition-opacity duration-1000 ease-in-out', className)}
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
          .star-2 { animation-delay: 1.5s; }
          .star-3 { animation-delay: 3s; }
          .star-4 { animation-delay: 2s; }
          
          @keyframes twinkle {
            0% { opacity: 0.1; transform: scale(0.8); }
            100% { opacity: 0.8; transform: scale(1.1); }
          }
          
          @media (prefers-reduced-motion: reduce) {
            .star {
              animation: none;
            }
          }
        `}
      </style>
      
      {/* Subtle Moon Glyph (Top Right) */}
      <path
        d="M 85 15 A 10 10 0 1 0 95 25 A 8 8 0 1 1 85 15 Z"
        fill="currentColor"
        className="opacity-20 mix-blend-overlay"
      />
      
      {/* Star points distributed primarily towards edges and top */}
      <circle cx="10" cy="20" r="0.3" className="star star-1 mix-blend-overlay opacity-30" />
      <circle cx="25" cy="12" r="0.4" className="star star-2 mix-blend-overlay opacity-40" />
      <circle cx="45" cy="18" r="0.2" className="star star-3 mix-blend-overlay opacity-20" />
      <circle cx="65" cy="8" r="0.5" className="star star-4 mix-blend-overlay opacity-30" />
      
      <circle cx="15" cy="40" r="0.4" className="star star-2 mix-blend-overlay opacity-20" />
      <circle cx="85" cy="45" r="0.3" className="star star-1 mix-blend-overlay opacity-30" />
      
      <circle cx="8" cy="70" r="0.2" className="star star-3 mix-blend-overlay opacity-40" />
      <circle cx="90" cy="75" r="0.5" className="star star-4 mix-blend-overlay opacity-20" />
      <circle cx="20" cy="85" r="0.3" className="star star-1 mix-blend-overlay opacity-30" />
      <circle cx="75" cy="88" r="0.4" className="star star-2 mix-blend-overlay opacity-20" />
    </svg>
  );
}
