import { useEffect, useRef } from 'react';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useLocationStore } from '@/lib/store/locationStore';
import { calculatePrayerTimes } from './calculate';

export function useNotificationScheduler() {
  const { notificationsEnabled, notificationOffset, calculationMethod, madhab } = useSettingsStore();
  const { lat, lng } = useLocationStore();
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Clear all existing timeouts on cleanup or re-run
    const clearTimeouts = () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };

    clearTimeouts();

    // If notifications are disabled or location is missing, do nothing
    if (!notificationsEnabled || lat === null || lng === null) {
      return;
    }

    // Double check if the browser supports notifications and if permission is granted
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
        // Calculate when the notification should fire
        const notifyTime = new Date(prayer.time.getTime() - notificationOffset * 60 * 1000);
        const delay = notifyTime.getTime() - now.getTime();

        // If the notification time is in the future (up to 24h away)
        if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
          const timeoutId = setTimeout(() => {
            try {
              new Notification(`Upcoming Prayer: ${prayer.name}`, {
                body: `${prayer.name} is in ${notificationOffset} minutes.`,
                // Safely fallback if icon doesn't exist, browsers handle this
                icon: '/icon.png', 
              });
            } catch (e) {
              // Silently fail on strict browsers like iOS Safari if not in PWA mode
              console.warn('Failed to display notification', e);
            }
          }, delay);
          timeoutsRef.current.push(timeoutId);
        }
      });
    };

    // Schedule for today and tomorrow to cover midnight rollovers
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    scheduleForDate(today);
    scheduleForDate(tomorrow);

    return clearTimeouts;
  }, [notificationsEnabled, notificationOffset, calculationMethod, madhab, lat, lng]);
}
