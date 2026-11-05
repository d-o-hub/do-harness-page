import type { MetadataRoute } from 'next'

/* Generated robots.txt. The explicit social-crawler entries carry
   over from the previous static file; the Sitemap line resolves
   against NEXT_PUBLIC_SITE_URL (localhost fallback in dev). */

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ['Googlebot', 'Bingbot', 'Twitterbot', 'facebookexternalhit'],
        allow: '/',
      },
      { userAgent: '*', allow: '/' },
    ],
    sitemap: new URL('/sitemap.xml', BASE).toString(),
  }
}
