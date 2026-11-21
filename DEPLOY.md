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

`FORCE_PORT` selects the listen port (default 4000 — chosen because the
deploy runtime environment may already hold :3000 with its own agent;
the repo Caddyfile upstream matches). `scripts/publish.sh` and
`bun run start` set `FORCE_PORT=3000` for the sandbox front proxy,
which is hardwired to that port. Any Node 18+ runtime
or container can run `.next/standalone/server.js` directly — no bun
requirement at runtime, `bunx next start` also works.

## 3. GitHub Pages (static export, no server)

GitHub Pages serves files only, so this target builds with
`output: "export"` instead of `standalone`. The switch is
environment-driven in `next.config.ts` (`PAGES_EXPORT=1`), which also
pins `basePath: /do-harness-page` (Pages serves from a repo subpath)
and drops the `headers()` block (Pages cannot set custom headers).

```sh
bun run build:pages   # static export into out/ (NEXT_PUBLIC_SITE_URL
                      # defaults to https://d-o-hub.github.io/do-harness-page)
bun run deploy:pages  # build:pages + force-push out/ to the gh-pages branch
                      # of d-o-hub/do-harness-page (GITHUB_TOKEN or existing
                      # git credentials required)
```

One-time repo setup (already done for do-harness-page): Settings →
Pages → Source: "Deploy from a branch", branch `gh-pages`, folder
`/(root)`. The export includes a `.nojekyll` so the `_next/` tree is
served untouched.

Export-mode differences to know about:

- The page is fully prerendered at build time — the star count and the
  install-script checksum are frozen at the moment of the build; they
  refresh on the next `build:pages` run, not hourly.
- `src/app/api/route.ts` is exported as a static file; the route is a
  dead scaffold, nothing on the page calls it.
- Metadata (canonical, og:image, sitemap, robots) resolves against the
  Pages origin through the same `NEXT_PUBLIC_SITE_URL` variable — the
  robots sitemap join is subpath-safe (`/do-harness-page/sitemap.xml`).
- The platform deploy (`standalone`) and this target are independent;
  building one never disturbs the other.

## 4. What the page needs at runtime

- `/` is statically prerendered and revalidates every hour (it fetch
  the GitHub star count; on API failure it silently renders without
  stars — no token required).
- Static assets: `/og.png` (1200×630, ~88 KB), `/logo.svg`,
  `/icon.svg`, `/robots.txt`, `/sitemap.xml`.
- No database, no secrets, no server-side state.

## 5. Post-deploy verification (2 minutes)

```sh
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" https://<origin>/og.png        # 200 image/png
curl -s https://<origin>/ | rg 'og:image|canonical'                                     # absolute prod URLs
curl -s https://<origin>/robots.txt                                                     # Sitemap: https://<origin>/sitemap.xml
curl -s https://<origin>/sitemap.xml | rg '<loc>'                                       # https://<origin>
curl -sI https://<origin>/ | rg 'X-Content-Type|Referrer-Policy|X-Frame'                # security headers (next.config.ts, standalone only)
```

Then paste the URL into the Twitter/Slack/LinkedIn composer once and
confirm the card renders the OG image.
