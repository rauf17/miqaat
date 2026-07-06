'use client';

import * as React from 'react';

interface LiveCountdownProps {
  targetTime: Date;
  className?: string;
}

function formatTimeLeft(diffMs: number): string {
  if (diffMs <= 0) return '00:00:00';
  
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Isolated countdown component that updates its own state every second
 * without re-rendering parent components.
 */
export function LiveCountdown({ targetTime, className }: LiveCountdownProps) {
  const [timeLeft, setTimeLeft] = React.useState(() => 
    Math.max(0, targetTime.getTime() - Date.now())
  );

  React.useEffect(() => {
    const tick = () => setTimeLeft(Math.max(0, targetTime.getTime() - Date.now()));
    tick(); // immediate update
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [targetTime]);

  return (
    <span className={className}>
      {formatTimeLeft(timeLeft)} remaining
    </span>
  );
}
