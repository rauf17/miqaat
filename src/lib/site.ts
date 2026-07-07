/**
 * Centralized site configuration.
 *
 * Single source of truth for repo URL, contact email, and other
 * identity-sensitive values that were previously hardcoded in 4+
 * places (and drifted — see audit MKT-002). Import from here instead
 * of inlining URLs.
 */
export const SITE = {
  /** Real GitHub repository URL. */
  repoUrl: 'https://github.com/ammarasad2005/miqaat',
  /** Clone URL (with .git suffix). */
  repoCloneUrl: 'https://github.com/ammarasad2005/miqaat.git',
  /** Project contact email. */
  contactEmail: 'connect2rauf17@gmail.com',
  /** Live deployment URL (used for metadataBase, OG URLs, sitemap). */
  siteUrl: 'https://miqaat-two.vercel.app',
} as const;
