import type { MetadataRoute } from 'next'

/* Generated robots.txt. The explicit social-crawler entries carry
   over from the previous static file; the Sitemap line resolves
   against NEXT_PUBLIC_SITE_URL (localhost fallback in dev). The URL
   is joined as a relative path so subpath origins keep the path —
   new URL('/sitemap.xml', base) would drop it (GitHub Pages serves
   from /<repo>/, so the joined form is the safe one). */

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

/* GitHub Pages export (output: "export") requires metadata routes to
   declare themselves static. */
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ['Googlebot', 'Bingbot', 'Twitterbot', 'facebookexternalhit'],
        allow: '/',
      },
      { userAgent: '*', allow: '/' },
    ],
    sitemap: new URL(
      'sitemap.xml',
      BASE.endsWith('/') ? BASE : `${BASE}/`,
    ).toString(),
  }
}
