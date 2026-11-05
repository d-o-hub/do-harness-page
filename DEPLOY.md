# Deploy checklist — do-harness landing page

Everything environment-specific is driven by one variable. No code
changes are needed between environments.

## 1. Set the site URL

```
NEXT_PUBLIC_SITE_URL=https://<production-origin>
```

This single variable drives, at build/run time:

| Consumer | File | What it produces |
| --- | --- | --- |
| `metadataBase` | `src/app/layout.tsx` | Absolute `og:image` / `twitter:image` URLs and the canonical link |
| Sitemap | `src/app/sitemap.ts` | `<loc>` in `/sitemap.xml` |
| Robots | `src/app/robots.ts` | `Sitemap:` line in `/robots.txt` |

Unset, everything falls back to `http://localhost:3000` — fine for
dev, wrong for production shares.

## 2. Build and run

Output mode is `standalone` (`next.config.ts`), so the build produces
a self-contained server:

```sh
bun run build      # next build + copies .next/static and public/ into .next/standalone/
bun run start      # NODE_ENV=production bun .next/standalone/server.js
```

`PORT` selects the listen port (default 3000). Any Node 18+ runtime
or container can run `.next/standalone/server.js` directly — no bun
requirement at runtime, `bunx next start` also works.

## 3. What the page needs at runtime

- `/` is statically prerendered and revalidates every hour (it fetch
  the GitHub star count; on API failure it silently renders without
  stars — no token required).
- Static assets: `/og.png` (1200×630, ~88 KB), `/logo.svg`,
  `/icon.svg`, `/robots.txt`, `/sitemap.xml`.
- No database, no secrets, no server-side state.

## 4. Post-deploy verification (2 minutes)

```sh
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" https://<origin>/og.png        # 200 image/png
curl -s https://<origin>/ | rg 'og:image|canonical'                                     # absolute prod URLs
curl -s https://<origin>/robots.txt                                                     # Sitemap: https://<origin>/sitemap.xml
curl -s https://<origin>/sitemap.xml | rg '<loc>'                                       # https://<origin>
```

Then paste the URL into the Twitter/Slack/LinkedIn composer once and
confirm the card renders the OG image.
