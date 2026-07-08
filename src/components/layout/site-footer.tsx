import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { LogoMark } from '@/components/brand/logo-mark';
import { SITE } from '@/lib/site';

/**
 * Footer for the Miqaat app shell.
 *
 * Mounted once in the root `app/layout.tsx` (next to `FloatingNav`) so
 * it renders automatically on every route — pages no longer opt in.
 *
 * Hosts the *demoted* navigation links — destinations that are too
 * low-frequency to earn bottom-dock real estate but still need a
 * sensible home. Per the IA audit:
 *   - About   → /welcome  (one-time marketing/landing page)
 *   - Contact → /contact  (very-low-frequency support contact)
 *   - Source  → GitHub     (external link, visually marked as such)
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
            href={SITE.repoUrl}
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
