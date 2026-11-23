#!/bin/sh
# Static export for GitHub Pages. next.config.ts switches to
# output:"export" + basePath /do-harness-page when PAGES_EXPORT=1,
# so this must run with that variable set — plain `bun run build`
# keeps producing the standalone server for the platform deploy.
# NEXT_PUBLIC_SITE_URL defaults to the Pages origin so metadataBase,
# og:image, sitemap and robots all resolve to the live subpath URL.
set -eu
NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://d-o-hub.github.io/do-harness-page}"
PAGES_EXPORT=1
export NEXT_PUBLIC_SITE_URL PAGES_EXPORT
bunx next build

# GitHub Pages must not run Jekyll (it would drop the _next/ tree).
touch out/.nojekyll
