'use client';

import { useNotificationScheduler } from '@/lib/prayer/useNotificationScheduler';

export function NotificationScheduler() {
  useNotificationScheduler();
  return null;
}
