#!/bin/sh
# DEPRECATED: superseded by .github/workflows/deploy-pages.yml, which
# publishes the static export through the Actions Pages artifact pipeline
# on every push to main. This script is the legacy branch-based path
# (gh-pages branch + "Deploy from a branch" Pages source) and is kept only
# for history; running it would fight the Actions-published deployment.
# Build the static export and force-publish it to the gh-pages branch
# of the Pages repo. Push access comes from GITHUB_TOKEN (a PAT with
# repo scope) or from already-working git credentials; without either
# the final push fails with 403. One-time repo setup (not done here):
# Settings -> Pages -> Source: "Deploy from a branch", gh-pages /root.
set -eu
REPO="${REPO:-d-o-hub/do-harness-page}"

sh scripts/build-pages.sh

# .nojekyll is handled by build-pages.sh, so the out/ tree is ready
# to commit as-is.

cd out
git init -q
git checkout -q -b gh-pages
git add -A
git commit -qm "pages deploy: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"

if [ -n "${GITHUB_TOKEN:-}" ]; then
  git push -qf "https://x-access-token:${GITHUB_TOKEN}@github.com/${REPO}.git" gh-pages:gh-pages
else
  git push -qf "https://github.com/${REPO}.git" gh-pages:gh-pages
fi
cd ..
rm -rf out/.git

OWNER=${REPO%%/*}
NAME=${REPO#*/}
echo "gh-pages published -> https://${OWNER}.github.io/${NAME}/"
