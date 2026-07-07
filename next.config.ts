import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PSP-028: remove the X-Powered-By header (minor security/SEO signal).
  poweredByHeader: false,
  // PSP-011: long-cache static assets. Chunk filenames are content-hashed
  // so they're safe to cache immutably. PNG textures get 24h with
  // must-revalidate so we can update them.
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "cache-control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.png",
        headers: [
          {
            key: "cache-control",
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },
    ];
  },
  // PSP-008: optimize package imports for tree-shaking.
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
};

export default nextConfig;
