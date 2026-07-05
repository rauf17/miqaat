import * as React from 'react';
import { cn } from '@/lib/utils';

interface GeometricPatternProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function GeometricPattern({ className, ...props }: GeometricPatternProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('absolute inset-0 h-full w-full opacity-[0.03] pointer-events-none mix-blend-overlay', className)}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <pattern id="islamic-motif" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M20 0 L40 20 L20 40 L0 20 Z M10 10 L30 30 M30 10 L10 30 M0 20 L40 20 M20 0 L20 40"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
          />
          <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <path
            d="M20 10 A10 10 0 0 1 30 20 A10 10 0 0 1 20 30 A10 10 0 0 1 10 20 A10 10 0 0 1 20 10"
            stroke="currentColor"
            strokeWidth="0.25"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-motif)" />
    </svg>
  );
}
