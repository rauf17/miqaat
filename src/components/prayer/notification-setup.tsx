'use client';

import * as React from 'react';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { cn } from '@/lib/utils';
import { Bell, BellOff, AlertCircle } from 'lucide-react';

export function NotificationSetup() {
  const { notificationsEnabled, setNotificationsEnabled, notificationOffset, setNotificationOffset } = useSettingsStore();
  const [isSupported, setIsSupported] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSupported(false);
    }
  }, []);

  const handleToggle = async () => {
    if (!notificationsEnabled) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      } else if (Notification.permission !== 'denied') {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            setNotificationsEnabled(true);
          }
        } catch (error) {
          console.warn('Notification permission request failed', error);
        }
      } else {
        // If denied, maybe show an alert or just rely on the UI state not changing
        alert('Notifications are blocked by your browser settings. Please enable them to use this feature.');
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="flex flex-col space-y-2 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive/80 text-sm">
        <div className="flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4" />
          Not Supported
        </div>
        <p>Your browser or device does not support background notifications.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4 rounded-2xl border border-border bg-card">
      <div className="flex items-start justify-between">
        <div className="space-y-1 pr-4">
          <h4 className="font-heading font-medium text-foreground">Prayer Reminders</h4>
          <p className="text-sm text-muted-foreground leading-snug">
            Receive browser notifications before each prayer time.
          </p>
        </div>
        <button
          onClick={handleToggle}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap",
            notificationsEnabled 
              ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" 
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
        >
          {notificationsEnabled ? (
            <>
              <Bell className="w-3.5 h-3.5" />
              Enabled
            </>
          ) : (
            <>
              <BellOff className="w-3.5 h-3.5" />
              Disabled
            </>
          )}
        </button>
      </div>

      <div 
        className={cn(
          "flex p-1 rounded-xl transition-all duration-300", 
          notificationsEnabled ? "bg-muted/50" : "bg-muted/20 opacity-50 pointer-events-none"
        )} 
        role="radiogroup" 
        aria-label="Minutes before reminder"
      >
        {([5, 10, 15] as const).map((offset) => (
          <button
            key={offset}
            role="radio"
            aria-checked={notificationOffset === offset}
            onClick={() => setNotificationOffset(offset)}
            disabled={!notificationsEnabled}
            className={cn(
              "flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              notificationOffset === offset 
                ? "bg-card shadow-sm text-foreground ring-1 ring-border" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {offset} min
          </button>
        ))}
      </div>
    </div>
  );
}
