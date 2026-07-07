import Link from 'next/link';
import { LogoMark } from '@/components/brand/logo-mark';

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
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center relative z-10">
      <div className="flex flex-col items-center gap-6 max-w-md">
        <LogoMark className="w-12 h-12 text-primary" />

        <div className="space-y-2">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Page not found
          </h1>
          <p className="text-muted-foreground font-sans leading-relaxed">
            The page you&rsquo;re looking for doesn&rsquo;t exist or may have
            moved. Use the dock below to continue, or return to your prayer
            timeline.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-medium shadow-[0_0_30px_var(--color-time-glow)] hover:shadow-[0_0_50px_var(--color-time-glow)] transition-all duration-300 hover:scale-[1.02]"
        >
          Return to Prayers
        </Link>
      </div>
    </main>
  );
}
