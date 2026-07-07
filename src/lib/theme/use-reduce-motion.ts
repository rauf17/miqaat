'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { useSettingsStore } from '@/lib/store/settingsStore';

/**
 * Unified reduced-motion hook.
 *
 * Resolves the cross-cutting gap identified in audit Theme 1: the
 * codebase had two independent sources of "reduced motion" truth that
 * didn't agree — `useSettingsStore().reduceMotion` (user-toggled) and
 * `useReducedMotion()` from framer-motion (OS-level `prefers-reduced-motion`).
 * Different components consulted different sources, so users who enabled
 * either signal got partial relief at best.
 *
 * This hook ORs both signals. Returns `true` if EITHER the OS preference
 * OR the Settings toggle is on. Also mirrors the combined value to
 * `document.documentElement.dataset.reduceMotion` so CSS animations
 * (which can't read React state) can match on `[data-reduce-motion="true"]`.
 *
 * Usage:
 *   const reduce = useReduceMotion();
 *   transition={reduce ? { duration: 0 } : { type: 'spring', ... }}
 *
 * CSS companion (in globals.css):
 *   @media (prefers-reduced-motion: reduce) {
 *     *, *::before, *::after {
 *       animation-duration: 0.01ms !important;
 *       transition-duration: 0.01ms !important;
 *     }
 *   }
 *   [data-reduce-motion='true'] *,
 *   [data-reduce-motion='true'] *::before,
 *   [data-reduce-motion='true'] *::after {
 *     animation-duration: 0.01ms !important;
 *     transition-duration: 0.01ms !important;
 *   }
 */
export function useReduceMotion(): boolean {
  const osPrefersReducedMotion = useReducedMotion();
  const settingsReduceMotion = useSettingsStore((s) => s.reduceMotion);
  const reduce = Boolean(osPrefersReducedMotion) || Boolean(settingsReduceMotion);

  // Mirror to <html data-reduce-motion="true"> so CSS animations can
  // match. This runs as a layout effect to avoid a flash of motion on
  // first paint.
  useEffect(() => {
    const html = document.documentElement;
    if (reduce) {
      html.dataset.reduceMotion = 'true';
    } else {
      delete html.dataset.reduceMotion;
    }
  }, [reduce]);

  return reduce;
}
