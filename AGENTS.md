# AGENTS.md

Routing and completion contract for any agent working in this
repository. The product this site documents is itself an agent
harness — hold the repo to the standard it sells.

## What this is

The single-page marketing site for
[github.com/d-o-hub/do-harness](https://github.com/d-o-hub/do-harness):
Next.js 16 (App Router, Turbopack, standalone output) and Tailwind
v4. One page, ten sections, no CMS, no database, no
server state beyond a cached GitHub star fetch.

## Commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Dev server on `:3000` |
| `bun run build` | Production build (standalone; copies static + public into `.next/standalone/`) |
| `bun run start` | Run the standalone production server (`PORT` env selects the port) |
| `bun run lint` | ESLint — must exit with **zero warnings** |
| `bunx tsc --noEmit` | Typecheck — must exit with **zero errors** (no filters; `skills/` is excluded in tsconfig) |

## Repository map

- `src/app/` — `layout.tsx` (metadata, fonts, theme provider),
  `page.tsx` (section composition + GitHub star fetch with 1h
  revalidate + JSON-LD SoftwareApplication), `globals.css` (**all
  design tokens**), `not-found.tsx` (branded 404, same tokens),
  `robots.ts`, `sitemap.ts`, `icon.svg`.
- `src/components/site/` — one file per section or diagram; no
  shared UI kit. `use-loop-stage.ts` is the shared animation
  infrastructure.
- `scripts/og.html` — source of truth for `public/og.png`.
- `scripts/qa-prod.sh` — one-shot production QA sweep.
- `DESIGN.md` — the design token reference: full color/typography/
  shape/motion inventory with values, semantic rules, and the
  extension checklist. Keep it in sync with `globals.css`.
- `PRODUCT.md` — the captured product record (impeccable
  product-schema 1): confirmed primary users, purpose, positioning,
  operating context, and the evidence-discipline absences future work
  must not fabricate. Owned by the impeccable init flow; update it
  when product truth changes, never silently.
- `DEPLOY.md` — deploy checklist and post-deploy verification.
- `.impeccable/config.json` — impeccable workflow default captured by
  init: `"buildPath": "code"` (landing/showcase surfaces build
  code-first; design comps are not generated). `.impeccable/live/` is
  gitignored machine-local state.
- `.github/workflows/ci.yml` — CI on push/PR runs the definition-of-done
  gates (lint, typecheck) plus the static export
  (`bun run build:pages`), an actionlint check on the workflow YAMLs,
  and `bun test` over `tests/export.test.ts`, which smoke-checks the
  exported artifact in `out/` (basePath URLs, robots/sitemap, branded
  404, release marker format). Keep it in sync when a gate changes.
- `.agents/skills/impeccable/` — external design skill pack
  (impeccable v4.8.0): 24 design commands plus a 62-rule slop
  detector. Copilot integration lives in `.github/` (agents, hooks,
  a second skill copy), a Codex hook in `.codex/`. The 21MB engine
  binaries are gitignored; the launcher re-downloads them
  checksum-verified on first run, or restore with
  `npx impeccable install`. Detector:
  `.agents/skills/impeccable/scripts/impeccable detect <target>`.
  It reads `PRODUCT.md` and `DESIGN.md` as brand context, so keep both
  files current.
- `worklog.md` — append-only task log; every finished task appends
  a `Task ID` entry (Agent, Task, Work Log, Stage Summary).

## Hard rules (breaking any of these fails review)

1. **Facts come from the README only.** Never invent commands,
   numbers, or behavior. README facts in play: exit codes 0 / 1 / 2,
   3-strike sensor halt, `verify --record` writes beats to
   `agent_state.db`, VACUOUS beats an empty pass.
2. **Copy rules.** No em/en dashes anywhere. No buzzwords
   (seamless, robust, leverage, elevate, unlock, streamline…).
   Buttons are verb + object. Every sentence makes a checkable
   claim; if it can't be checked against the README, cut it.
3. **One accent, semantic only.** `--signal` green is the product's
   own verdict color (exit 0 GREEN). It never appears decoratively.
   `--destructive` red appears only for failure states.
4. **Shape lock.** Cards/images 12px radius (`--radius`), buttons
   10px, chips full-pill. Z-index scale is 40 (nav) / 50 (overlay) /
   60 (toast) and nothing else.
5. **Motion rules.** Every timer and interval sits behind
   `useVisibilityGate()` — nothing ticks offscreen or in a hidden
   tab. Under reduced motion every diagram renders its completed
   static state, never a blank. Animated transcript heights are
   reserved up front (rows × line-height + padding) so nothing
   jumps. Scroll reveals are `once: true`.
6. **Accessibility.** Animated diagrams are `role="img"` with a
   descriptive `aria-label`; their moving transcript is
   `aria-hidden` and the same facts exist in visible prose. Keep
   the skip link, `:focus-visible` rings, and 44px touch targets.
7. **The page ships zero images.** No `<img>`, no `next/image`, no
   `url()` bitmaps. Diagrams are DOM + CSS; the logo is inline SVG.
   The only bitmaps in the repo are `public/og.png` (social card)
   and `src/app/icon.svg` — both outside the page flow.
8. **Tokens only.** Colors come from the OKLCH variables in
   `globals.css`; never hardcode a hex. Both light and dark themes
   must be verified for any visual change.

## Definition of done

- `bun run lint` and `bunx tsc --noEmit` exit 0.
- `bun run build` succeeds.
- Browser sweep (see the site-verify skill): zero console errors,
  `scrollWidth === innerWidth` at 1440 / 768 / 390, animations
  verified cycling in light **and** dark.
- `worklog.md` has the new Task ID entry.
- CI (`.github/workflows/ci.yml`) runs the same gates on push; a
  change that breaks it locally breaks it there too.

## Skills

- `.agents/skills/site-design/` — token inventory, copy rules, OG
  image regeneration.
- `.agents/skills/site-motion/` — the animation and diagram system.
- `.agents/skills/site-verify/` — verification workflow, browser
  recipes, and known screenshot gotchas.
