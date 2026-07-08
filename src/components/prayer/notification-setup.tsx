'use client';

import * as React from 'react';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { cn } from '@/lib/utils';
import { Bell, BellOff, AlertCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export function NotificationSetup() {
  const { notificationsEnabled, setNotificationsEnabled, notificationOffset, setNotificationOffset } = useSettingsStore();
  const [isSupported, setIsSupported] = React.useState<boolean>(true);
  const [permissionState, setPermissionState] = React.useState<NotificationPermission>('default');
  const [showDeniedHelp, setShowDeniedHelp] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSupported(false);
      return;
    }
    setPermissionState(Notification.permission);
  }, []);

  // SET-014: detect desync — user enabled notifications but browser
  // permission was revoked via site settings.
  const desync = notificationsEnabled && permissionState !== 'granted';

  const handleToggle = async () => {
    if (typeof Notification === 'undefined') return;
    if (!notificationsEnabled) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
        setPermissionState('granted');
      } else if (Notification.permission !== 'denied') {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            setNotificationsEnabled(true);
            setPermissionState('granted');
          } else {
            setPermissionState(permission);
          }
        } catch (error) {
          console.warn('Notification permission request failed', error);
        }
      } else {
        // SET-013: replaced blocking alert() with an inline help panel.
        setShowDeniedHelp(true);
        setPermissionState('denied');
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  // SET-017: test notification button so users can verify the feature.
  const handleTestNotification = () => {
    if (typeof Notification === 'undefined') return;
    if (!notificationsEnabled || Notification.permission !== 'granted') return;
    try {
      new Notification('Miqaat test', {
        body: 'Prayer notifications are working correctly.',
        icon: '/icon',
      });
    } catch (e) {
      console.warn('Test notification failed', e);
    }
  };

  if (!isSupported) {
    return (
      <div className="flex flex-col space-y-2 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive/80 text-sm">
        <div className="flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          Not Supported
        </div>
        <p>Your browser or device does not support notifications.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5 pr-4">
          <h4 className="font-medium text-foreground">Status</h4>
          <p className="text-sm text-muted-foreground leading-snug">
            Receive a native browser alert before each prayer time. Reminders fire while Miqaat is open in a foreground tab; install as a PWA for the most reliable experience.
          </p>
        </div>
        <button
          role="switch"
          aria-checked={notificationsEnabled}
          aria-label="Prayer notifications"
          onClick={handleToggle}
          className={cn(
            'relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 whitespace-nowrap overflow-hidden',
            notificationsEnabled
              ? 'text-primary-foreground shadow-md'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          {notificationsEnabled && (
            <motion.div
              className="absolute inset-0 bg-primary -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
          {notificationsEnabled ? (
            <>
              <Bell className="w-4 h-4" aria-hidden="true" />
              Enabled
            </>
          ) : (
            <>
              <BellOff className="w-4 h-4" aria-hidden="true" />
              Disabled
            </>
          )}
        </button>
      </div>

      {/* SET-014: desync warning */}
      {desync && (
        <div role="alert" className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-medium">Browser permission revoked</p>
            <p className="mt-1">Notifications are enabled in settings but blocked by your browser. Click the toggle to re-request permission.</p>
          </div>
        </div>
      )}

      {/* SET-013: inline denied-permission help (replaces native alert) */}
      {showDeniedHelp && (
        <div role="alert" className="p-3 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-sm space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-medium">Notifications are blocked</p>
              <p className="mt-1 text-muted-foreground">
                To re-enable, open your browser&apos;s site settings for this page and allow notifications, then click the toggle again.
              </p>
              <ul className="mt-2 text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
                <li>Chrome/Edge: click the lock icon in the address bar → Site settings → Notifications → Allow</li>
                <li>Safari: Preferences → Websites → Notifications → find this site → Allow</li>
                <li>Firefox: click the lock icon → Clear permissions, then reload</li>
              </ul>
            </div>
          </div>
          <button
            onClick={() => setShowDeniedHelp(false)}
            className="text-xs underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-foreground">Offset Time</h4>
          {/* SET-017: test notification button */}
          {notificationsEnabled && permissionState === 'granted' && (
            <button
              onClick={handleTestNotification}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1"
              aria-label="Send a test notification"
            >
              <Send className="w-3 h-3" aria-hidden="true" />
              Test
            </button>
          )}
        </div>
        <div
          className={cn(
            'relative flex p-1.5 rounded-2xl transition-all duration-300 backdrop-blur-md border border-border/50 shadow-sm',
            notificationsEnabled ? 'bg-muted/40' : 'bg-muted/20 opacity-50 pointer-events-none',
          )}
          role="radiogroup"
          aria-label="Minutes before reminder"
          aria-disabled={!notificationsEnabled}
        >
          {([5, 10, 15] as const).map((offset) => (
            <button
              key={offset}
              role="radio"
              aria-checked={notificationOffset === offset}
              tabIndex={notificationOffset === offset ? 0 : -1}
              onClick={() => setNotificationOffset(offset)}
              disabled={!notificationsEnabled}
              className={cn(
                'relative flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary z-10',
                notificationOffset === offset
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {notificationOffset === offset && (
                <motion.div
                  layoutId="notificationOffsetIndicator"
                  className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-sm"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              {offset} min
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
