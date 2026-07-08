import { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * robots.txt — auto-served at /robots.txt by Next.js.
 *
 * Audit PSP-017: previously missing entirely. Allows all crawling of
 * user-facing routes, blocks /api/* (server endpoints) and /dev/*
 * (debug pages).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dev/'],
    },
    sitemap: `${SITE.siteUrl}/sitemap.xml`,
  };
}
