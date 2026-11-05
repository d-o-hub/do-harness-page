import type { MetadataRoute } from 'next'

/* Both this file and robots.ts derive their absolute URLs from
   NEXT_PUBLIC_SITE_URL, falling back to localhost for dev: the
   same convention src/app/layout.tsx uses for metadataBase. Set
   the env var to the production origin at deploy time and both
   routes resolve correctly with no code change. */

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
