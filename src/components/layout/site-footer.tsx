'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { LogoMark } from '@/components/brand/logo-mark';

/**
 * Footer for the Miqaat app shell.
 *
 * The primary navigation dock used to live here, but was lifted into
 * `FloatingNav` (mounted once in the root layout) so it could be
 * `position: fixed` to the viewport and persist across route changes
 * for a smooth active-indicator animation.
 *
 * This footer now hosts the *demoted* navigation links — destinations
 * that are too low-frequency to earn bottom-dock real estate but still
 * need a sensible home. Per the IA audit:
 *   - About   → /welcome  (one-time marketing/landing page)
 *   - Contact → /contact  (very-low-frequency support contact)
 *   - Source  → GitHub     (external link, visually marked as such)
 *
 * Note: with the P1-6 fix (lift SiteFooter into the root layout), this
 * component will render automatically on every page. For now, pages
 * that include it explicitly still work correctly.
 */
export function SiteFooter() {
  return (
    <footer className="relative py-12 md:py-16 px-6 border-t border-border/10 w-full mt-12 bg-background/50">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center gap-6">
        {/* Demoted navigation links */}
        <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <Link
            href="/welcome"
            className="text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            Contact
          </Link>
          <a
            href="https://github.com/rauf17/miqaat"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Miqaat source code on GitHub (opens in a new tab)"
            className="inline-flex items-center gap-1 text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            Source
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </nav>

        {/* Brand wordmark + attribution */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <LogoMark className="w-6 h-6 text-foreground/40" />
            <span className="font-brand font-semibold text-foreground/40 tracking-widest uppercase text-xs">
              Miqaat
            </span>
          </div>
          <p className="text-xs text-muted-foreground/40 text-center">
            Made with purpose. Open source &amp; privacy-first.
          </p>
        </div>
      </div>
    </footer>
  );
}
