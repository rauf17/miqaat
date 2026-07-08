import type { Metadata } from 'next';
import Link from 'next/link';
import { LogoMark } from '@/components/brand/logo-mark';

// MKT-012: added metadata so the 404 page has a branded title and
// isn't indexed by search engines.
export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
};

/**
 * Branded 404 page.
 *
 * Next.js renders this component whenever:
 *   - a route doesn't match anything in the app router, OR
 *   - the `notFound()` function is called from any server component
 *     (we use this for /dev/theme in production — see P1-3).
 *
 * Because this lives at the root of the app router, it inherits the
 * root layout — so the FloatingNav and SiteFooter appear here too,
 * giving the user an obvious path back into the app.
 */
export default function NotFound() {
  // MKT-012: added helpful links to likely destinations so users can
  // recover instead of bouncing.
  const destinations = [
    { href: '/', label: 'Prayers' },
    { href: '/qibla', label: 'Qibla' },
    { href: '/weather', label: 'Weather' },
    { href: '/welcome', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center relative z-10">
      <div className="flex flex-col items-center gap-6 max-w-md">
        <LogoMark className="w-12 h-12 text-primary" aria-hidden="true" />

        <div className="space-y-2">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Page not found
          </h1>
          <p className="text-muted-foreground font-sans leading-relaxed">
            The page you&rsquo;re looking for doesn&rsquo;t exist or may have
            moved. Try one of these destinations instead:
          </p>
        </div>

        <nav aria-label="Try one of these destinations" className="flex flex-wrap items-center justify-center gap-3">
          {destinations.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="px-4 py-2 rounded-full border border-border/50 bg-card/40 backdrop-blur-sm text-sm font-medium text-foreground hover:border-primary/50 hover:bg-card/60 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {d.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-medium shadow-[0_0_30px_var(--color-time-glow)] hover:shadow-[0_0_50px_var(--color-time-glow)] transition-all duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Return to Prayers
        </Link>
      </div>
    </main>
  );
}
