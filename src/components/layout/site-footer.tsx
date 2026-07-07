'use client';

import { LogoMark } from '@/components/brand/logo-mark';

/**
 * Footer branding block. The actual navigation dock used to live here,
 * but has been lifted out into `FloatingNav` (mounted once in the root
 * layout) so it can be `position: fixed` to the viewport and persist
 * across route changes for a smooth active-indicator animation.
 *
 * SiteFooter now renders only the Miqaat wordmark / attribution line.
 */
export function SiteFooter() {
  return (
    <footer className="relative py-12 md:py-16 px-6 border-t border-border/10 w-full mt-12 bg-background/50">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center gap-3">
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
    </footer>
  );
}
