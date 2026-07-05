import * as React from 'react';
import { cn } from '@/lib/utils';

interface GeometricPatternProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function GeometricPattern({ className, ...props }: GeometricPatternProps) {
  return (
    <svg
      className={cn('absolute inset-0 h-full w-full pointer-events-none mix-blend-overlay opacity-15', className)}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        {/* Genuine 8-point Islamic star tiling motif */}
        <pattern id="islamic-arabesque" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <g stroke="currentColor" strokeWidth="1.2" fill="none">
            {/* Center Star (Khatam) */}
            <g transform="translate(50, 50)">
              <rect x="-15" y="-15" width="30" height="30" />
              <rect x="-15" y="-15" width="30" height="30" transform="rotate(45)" />
            </g>
            
            {/* Corner Stars */}
            <g transform="translate(0, 0)">
              <rect x="-15" y="-15" width="30" height="30" />
              <rect x="-15" y="-15" width="30" height="30" transform="rotate(45)" />
            </g>
            <g transform="translate(100, 0)">
              <rect x="-15" y="-15" width="30" height="30" />
              <rect x="-15" y="-15" width="30" height="30" transform="rotate(45)" />
            </g>
            <g transform="translate(0, 100)">
              <rect x="-15" y="-15" width="30" height="30" />
              <rect x="-15" y="-15" width="30" height="30" transform="rotate(45)" />
            </g>
            <g transform="translate(100, 100)">
              <rect x="-15" y="-15" width="30" height="30" />
              <rect x="-15" y="-15" width="30" height="30" transform="rotate(45)" />
            </g>

            {/* Connecting octagonal web lines */}
            <path d="M 15 0 L 35 15 L 50 0 L 65 15 L 85 0" />
            <path d="M 0 15 L 15 35 L 0 50 L 15 65 L 0 85" />
            <path d="M 100 15 L 85 35 L 100 50 L 85 65 L 100 85" />
            <path d="M 15 100 L 35 85 L 50 100 L 65 85 L 85 100" />
            
            {/* Diamond cross-links */}
            <path d="M 25 25 L 35 35 L 50 25 L 65 35 L 75 25 L 65 15 L 50 25 L 35 15 Z" />
            <path d="M 25 75 L 35 65 L 50 75 L 65 65 L 75 75 L 65 85 L 50 75 L 35 85 Z" />
            <path d="M 15 35 L 25 50 L 15 65" />
            <path d="M 85 35 L 75 50 L 85 65" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-arabesque)" />
    </svg>
  );
}
