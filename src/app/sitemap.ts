import { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * sitemap.xml — auto-served at /sitemap.xml by Next.js.
 *
 * Audit PSP-016: previously missing entirely. Lists all 6 crawlable
 * routes. /dev/theme is intentionally excluded (dev-only). /api/* is
 * excluded (not for indexing).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/welcome', '/qibla', '/weather', '/settings', '/contact'];
  const now = new Date();
  return routes.map((r) => ({
    url: `${SITE.siteUrl}${r}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: r === '' ? 1 : 0.7,
  }));
}
