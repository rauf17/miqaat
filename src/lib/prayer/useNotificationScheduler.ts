import { useEffect, useRef } from 'react';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useLocationStore } from '@/lib/store/locationStore';
import { calculatePrayerTimes } from './calculate';

/**
 * Prayer notification scheduler.
 *
 * P1 fixes applied (SET-003, SET-004, SET-010, SET-018):
 *  - Raised the 24h scheduling cap to 48h so prayers up to 2 days away
 *    are scheduled (the today+tomorrow loop already computes them).
 *  - Added a midnight-rollover re-schedule via a timeout aligned to
 *    the next midnight, so long-lived tabs re-schedule after the day
 *    rolls over.
 *  - Fixed the icon path from /icon.png (404) to /icon (the dynamic
 *    Next.js icon route that serves a valid PNG).
 *  - Edge case: if offset > minutes-until-prayer, fire an immediate
 *    "starting now" notification instead of silently dropping it.
 */
export function useNotificationScheduler() {
  const { notificationsEnabled, notificationOffset, calculationMethod, madhab } = useSettingsStore();
  const { lat, lng } = useLocationStore();
  // SET-009: use ReturnType<typeof setTimeout> instead of NodeJS.Timeout
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const midnightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearTimeouts = () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      if (midnightTimeoutRef.current !== null) {
        clearTimeout(midnightTimeoutRef.current);
        midnightTimeoutRef.current = null;
      }
    };

    clearTimeouts();

    if (!notificationsEnabled || lat === null || lng === null) {
      return;
    }

    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (Notification.permission !== 'granted') {
      return;
    }

    const scheduleForDate = (date: Date) => {
      const times = calculatePrayerTimes({ lat, lng, date, method: calculationMethod, madhab });
      const now = new Date();

      const prayers = [
        { name: 'Fajr', time: times.fajr },
        { name: 'Dhuhr', time: times.dhuhr },
        { name: 'Asr', time: times.asr },
        { name: 'Maghrib', time: times.maghrib },
        { name: 'Isha', time: times.isha },
      ];

      prayers.forEach((prayer) => {
        const notifyTime = new Date(prayer.time.getTime() - notificationOffset * 60 * 1000);
        const delay = notifyTime.getTime() - now.getTime();

        // SET-003: raised cap from 24h to 48h so tomorrow's prayers
        // (up to ~44h away) are actually scheduled.
        if (delay > 0 && delay < 48 * 60 * 60 * 1000) {
          const timeoutId = setTimeout(() => {
            try {
              new Notification(`Upcoming Prayer: ${prayer.name}`, {
                body: `${prayer.name} is in ${notificationOffset} minutes.`,
                // SET-010: /icon.png doesn't exist; /icon is the
                // dynamic Next.js route that serves a valid PNG.
                icon: '/icon',
              });
            } catch (e) {
              console.warn('Failed to display notification', e);
            }
          }, delay);
          timeoutsRef.current.push(timeoutId);
        } else if (delay <= 0 && delay > -notificationOffset * 60 * 1000) {
          // SET-018: prayer is within the offset window but the
          // notifyTime is in the past. Fire an immediate "starting
          // now" notification instead of silently dropping it.
          const timeoutId = setTimeout(() => {
            try {
              new Notification(`Prayer starting: ${prayer.name}`, {
                body: `${prayer.name} is starting now.`,
                icon: '/icon',
              });
            } catch (e) {
              console.warn('Failed to display notification', e);
            }
          }, 0);
          timeoutsRef.current.push(timeoutId);
        }
      });
    };

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    scheduleForDate(today);
    scheduleForDate(tomorrow);

    // SET-004: schedule a re-run at the next midnight so long-lived
    // tabs re-schedule after the day rolls over. The effect deps won't
    // change across midnight, so without this the schedule becomes
    // stale and tomorrow's prayers (now today's) are never scheduled.
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = nextMidnight.getTime() - Date.now() + 1000;
    midnightTimeoutRef.current = setTimeout(() => {
      // Trigger a re-schedule by toggling a no-op state. The cleanest
      // way is to re-run the effect — we do this by dispatching a
      // storage event that the settings store listens to (or just
      // re-run via a state tick). For simplicity, we reload the
      // effect by calling setState on a noop — but since this is a
      // hook, the parent component will re-render if we bump a tick.
      // Easiest reliable approach: window.location.reload() is too
      // heavy. Instead, we just re-schedule inline:
      const newToday = new Date();
      const newTomorrow = new Date();
      newTomorrow.setDate(newTomorrow.getDate() + 1);
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      scheduleForDate(newToday);
      scheduleForDate(newTomorrow);
    }, msUntilMidnight);

    return clearTimeouts;
  }, [notificationsEnabled, notificationOffset, calculationMethod, madhab, lat, lng]);
}
