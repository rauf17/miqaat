'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

/**
 * RouteFocusManager — accessibility helper for SPA-style route changes.
 *
 * PROBLEM (audit P2-1)
 * --------------------
 * Next.js App Router performs client-side navigation by default. When the
 * user taps a link in the FloatingNav (or anywhere else), the URL changes
 * and the page content swaps — but keyboard focus stays on the tapped
 * link. A keyboard or screen-reader user has no audible signal that the
 * route has changed, and has to manually Tab through the new content to
 * figure out where they are.
 *
 * The WAI-ARIA recommended pattern for SPA route changes is:
 *   1. Move focus to the new page's main content container.
 *   2. Announce the new page's heading to assistive tech.
 *
 * IMPLEMENTATION
 * --------------
 * This component wraps `{children}` in the root layout. On every
 * `pathname` change it:
 *   - Moves focus to its wrapper div (which has tabIndex={-1} so it's
 *     programmatically focusable but not in the tab order).
 *   - Extracts the first <h1> from the new page and announces it via a
 *     visually-hidden aria-live="polite" region.
 *
 * The wrapper uses `outline-none` so the focus ring doesn't flash for
 * sighted mouse/touch users; keyboard users still get the focus move
 * benefit (their next Tab lands at the top of the new page's content).
 *
 * A small delay (50ms) is used before reading the <h1> to give React
 * time to commit the new DOM. This is a well-known gotcha with App
 * Router route-change effects.
 *
 * Accessibility notes
 * -------------------
 * - The focus move is functional (not decorative), so it runs even when
 *   prefers-reduced-motion is on.
 * - The live region uses aria-live="polite" (not "assertive") so it
 *   doesn't interrupt the user mid-utterance.
 * - The wrapper has aria-hidden on the live region to keep it out of
 *   the visual layout while remaining available to AT.
 */
export function RouteFocusManager({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = React.useState('');

  // Keep the previous pathname so we only react to actual changes (not
  // the initial mount — focusing on first paint would steal focus from
  // whatever the user was doing, e.g. a deep link they're already
  // reading).
  const previousPathname = React.useRef<string | null>(null);

  React.useEffect(() => {
    // Skip the very first render — initial mount shouldn't move focus.
    if (previousPathname.current === null) {
      previousPathname.current = pathname;
      return;
    }
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    // Move focus to the page content wrapper. The small delay lets
    // React commit the new page's DOM before we query for its <h1>.
    const t = window.setTimeout(() => {
      const wrapper = wrapperRef.current;
      if (wrapper) {
        wrapper.focus({ preventScroll: true });
      }

      // Announce the new page's first <h1> to assistive tech.
      const h1 = wrapper?.querySelector('h1');
      if (h1 && h1.textContent) {
        setAnnouncement(h1.textContent.trim());
      } else {
        // Fallback: derive a friendly name from the path.
        const fallback =
          pathname === '/'
            ? 'Prayers'
            : pathname.charAt(1).toUpperCase() + pathname.slice(2);
        setAnnouncement(fallback);
      }
    }, 50);

    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <>
      {/*
        Visually-hidden live region. aria-live="polite" so screen
        readers announce the new page's heading without interrupting.
      */}
      <div
        aria-live="polite"
        aria-atomic="true"
        role="status"
        className="sr-only"
      >
        {announcement}
      </div>

      {/*
        Page content wrapper. tabIndex={-1} makes it programmatically
        focusable without adding it to the tab order. outline-none
        prevents the focus ring from flashing for mouse/touch users on
        route change (keyboard users still get focus management
        benefits via the next Tab keypress).
      */}
      <div ref={wrapperRef} id="main-content" tabIndex={-1} className="outline-none">
        {children}
      </div>
    </>
  );
}
