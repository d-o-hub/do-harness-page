# Skill: site-verify

How to prove a change is done on this repo. Run the static gates
first; only then spend browser time. Use after every code change.

## Static gates (all must exit 0)

```sh
bun run lint          # zero warnings
bunx tsc --noEmit     # zero errors, whole repo (skills/ excluded in tsconfig)
bun run build         # production build; / and /robots.txt and /sitemap.xml prerender
```

## Production QA sweep: `scripts/qa-prod.sh`

Boots the standalone server on `:3100`, checks everything, shuts
down. **Run it as one process** (`scripts/qa-prod.sh`): the sandbox
reaps background servers between tool calls, so start-then-check in
separate commands always fails with connection refused. Rebuild
first if you changed code (`bun run build`).

What it asserts: zero page errors, zero console output,
`scrollWidth === innerWidth` at 1440 / 768 / 390, og:image +
twitter:card + canonical present, init tree and RED terminal
advance samples, hero loop stage advance, and it captures
`scripts/tour-desktop-light.png`, `tour-desktop-dark.png`,
`tour-mobile-light.png`.

## agent-browser recipes

- **Overflow**: `agent-browser eval "document.documentElement.scrollWidth + ' vs ' + window.innerWidth"` — the two numbers must match at every viewport.
- **Animation is live**: sample a counter twice with a sleep
  between. Init tree rows: count `.grid` children whose className
  contains `justify-between`. Terminal lines: count children of
  `div[aria-hidden="true"]` inside the `[aria-label^="Terminal
  replay"]` panel. Hero stages: read the `[aria-pressed="true"]`
  button's aria-label.
- **Dark theme**: `agent-browser set media dark` (and back to light).
- **Visibility gating**: an offscreen diagram frozen at its SSR
  state is correct behavior. Scroll it into view, wait ~1s, then
  sample.

### Selector gotcha

Diagram panels contain several `aria-hidden` nodes: the window-chrome
dots are `span[aria-hidden]`, the transcript is
`div[aria-hidden="true"]`. `querySelector('[aria-hidden]')` silently
matches a dot and returns 0 children — always target
`div[aria-hidden="true"]`.

### Full-page screenshot gotchas (both bit once)

1. `Reveal` wrappers are `once: true` and only fire on real
   intersection. A full-page capture never intersects them, so
   everything below the fold renders blank. Warm the page up first
   (see `warmup()` in `scripts/qa-prod.sh`).
2. `html { scroll-behavior: smooth }` turns stepped
   `window.scrollTo` calls into constantly restarted animations —
   the warmup silently never reaches the bottom. The warmup sets
   `document.documentElement.style.scrollBehavior = 'auto'` for the
   pass and restores it after. Keep that override.

## Post-deploy verification

From `DEPLOY.md`: four curls (`/og.png` 200 image/png, og:image +
canonical absolute URLs, robots Sitemap line, sitemap `<loc>`), then
paste the URL into a social composer once. All of it resolves from
`NEXT_PUBLIC_SITE_URL`; it falls back to `http://localhost:3000`.

## Worklog

Append, never rewrite: a `Task ID` entry with Agent, Task, Work
Log, and Stage Summary. Log what was verified, not just what was
written — the sweep results belong in the entry.
