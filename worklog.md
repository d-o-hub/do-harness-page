# Worklog

---
Task ID: 1
Agent: main (Z.ai)
Task: Build landing page for github.com/d-o-hub/do-harness following the design-taste skill rules (anti-slop, motion, interaction states, pre-flight).

Work Log:
- Fetched do-harness README (install methods, commands, hooks, sensors, packs, exit codes, compliance).
- Loaded design-taste skill: SKILL.md, anti-slop.md, core-rules.md, motion.md, pre-flight.md, design-systems.md, interaction-states.md.
- Design Read: OSS devtool landing for engineers running AI agents; light-first engineering-instrument language (off-white paper, ink, one signal green tied to the product's GREEN/RED verdicts, mono data). Dials: VARIANCE 7 / MOTION 5 / DENSITY 4.
- Initialized fullstack Next.js 16 env (Tailwind v4, shadcn present, framer-motion, lucide-react).
- Generated 3 editorial product photos (harness-hero 864x1152, harness-macro 1024x1024, harness-coil 1344x768) into public/.

Stage Summary:
- Plan: tokens in globals.css (OKLCH, dual theme), fonts Space Grotesk + JetBrains Mono, sections: nav / hero / logo strip / thesis+exit-codes / how-it-works / bento / install / compliance / cta / footer.
- Copy rules: zero em/en dashes, no banned buzzwords, verb+object buttons, real facts only from README (exit codes 0/1/2, 3-strike halt, 4 packs, 3 hooks, 3 CI cadences).

---
Task ID: 1 (completion)
Agent: main (Z.ai)
Task: Build, audit, and browser-verify the do-harness landing page.

Work Log:
- Built tokens: OKLCH palette (green-tinted neutrals, one signal green accent = product verdict color), radius lock (cards 12 / buttons 10 / chips pill), easing tokens cubic-bezier(0.23,1,0.32,1), z-scale 40/50/60, dual theme via next-themes (system default + manual toggle).
- Fonts: Space Grotesk (display+body) + JetBrains Mono (data/code) via next/font.
- Sections: sticky nav (accessible mobile disclosure, GitHub star count via ISR fetch with graceful null), hero (staggered load, 2-col asymmetric, min-h-svh page frame), simple-icons logo strip (self-hosted SVGs, currentColor), thesis + real exit-code panel, feedforward/feedback split, 7-cell bento with image + tinted variation, install section with working copy buttons (clipboard + fallback + aria-live), compliance, CTA with copy chip, footer with real repo/docs links. Skip link + focus-visible rings + 44px targets throughout.
- Pre-flight audit: zero U+2014/U+2013, no transition:all / scale(0) / ease-in / magic z-index, no banned buzzwords, no fake numbers, eyebrow count 2 (<= budget), no duplicate CTA intents, logo wall logo-only.
- Fixed during review: lucide mounted-state lint error (CSS dark: variant instead), install command clipping (restacked rows, code wrap in narrow panel), compliance.tsx class= typo.
- Agent-browser verification: desktop 1440 + mobile 390, light + dark themes, real-scroll reveals fire (full-page screenshot opacity artifact identified as IO-not-triggered, not a bug), copy button success state, mobile menu open/close/navigation, focus ring visible, smooth scroll + scroll-mt anchors, footer natural push. dev.log clean (200s, no hydration/runtime errors). Lint clean.

Stage Summary:
- Deliverable: single-route Next.js 16 landing page at src/app/page.tsx + src/components/site/*, images in public/ (3 generated editorial photos).
- Star count renders only when the GitHub API is reachable (sandbox blocks it; degrades to icon-only, no fake number).

---
Task ID: 2
Agent: main (Z.ai)
Task: Add a technical how-it-works diagram to the do-harness landing page (closed-loop architecture, every viewport).

Work Log:
- Re-researched the do-harness README for technical accuracy: init scaffold outputs, AGENTS.md contract, skills progressive disclosure, task board, trace add, verify sensor suite + flags, exit codes 0/1/2, --record beats with 3-strike halt, hooks (pre-commit/commit-msg/pre-push), CI --strict --evidence, libSQL agent_state.db with append-only workflow_events, distill/learn --draft loop.
- Rewrote src/components/site/how-it-works.tsx as a technical loop diagram: entry strip ($ do-harness init, dashed, one-time) + 4 stage cards (01 Feedforward, 02 Agent execution, 03 Feedback sensors, 04 State and learning) rendered as a 2x2 clockwise loop on desktop (pure CSS grid, arrow cells between cards, center hub with RotateCw badge) and a vertical stack with labeled down arrows plus a green loop-back strip on mobile. Facts only from README; mono terms with one-line explanations; exit-code chips (0 GREEN tinted, 1 RED, 2 config error neutral); "enforced at" footer strip in card 03; fig. 1 caption + docs/adoption.md link.
- Added connector CSS to globals.css (.flow-line/.flow-arrow/.flow-label + .flow-signal variant) using theme tokens so lines, arrowheads, and labels track light/dark automatically; labels mask the line fieldset-legend style.
- Fixed name collision: local ArrowUp component vs lucide ArrowUp import (renamed to FlowArrowUp).
- Fixed React DOM nesting error: EXIT_CODES fragment was a dd nested inside the StageCard dd (replaced with span).
- Hunted a pre-existing horizontal overflow: document scrollWidth 770 at 390 viewport, 782 at 768. Root cause: sr-only live region inside CopyButton is position:absolute with no positioned ancestor; its containing block sits above the .cmd scroll container, so it escapes the clip and lands at static position x~770. Fix: added relative to the CopyButton button class. One fix cleared all instances (install rows, wire-it-in, CI, CTA); scrollWidth now equals viewport at 390/768/1440.
- Verified via agent-browser: full-page screenshots at 1440/768/390, light + dark; zero overlap, arrows attach edge-to-edge, labels legible, chips wrap correctly, loop-back strip reads well in both themes. Fresh console clean (no errors, no hydration warnings). Lint clean. No em/en dashes, no banned buzzwords.

Stage Summary:
- Deliverable: how-it-works section is now a technical closed-loop diagram (feedforward -> agent execution -> feedback sensors -> state/learning -> back), responsive 2x2 loop at lg+, vertical stack below lg.
- Standalone shareable export: download/do-harness-how-it-works.png (light, 1440px).
- Overflow fix landed in copy-button.tsx benefits every section with copyable commands.


---
Task ID: 3
Agent: main (Z.ai)
Task: Restore the animation + image-free work after a sandbox state rollback; add interactive stage pinning (recommendation 3).

Work Log:
- Found the project rolled back to the pre-animation state after the session recycle: the 3 editorial photos were back in public/, hero/bento/cta referenced them via next/image, the animation components were gone, and the worklog lost its later entries. This is why the user's preview showed images again.
- Rebuilt globals.css additions: .flow-dot traveling-dot keyframes (x/x-rev/y/y-rev) + prefers-reduced-motion display:none guard, after the existing Task 2 connector classes (.flow-line/.flow-arrow/.flow-label/.flow-signal survived the rollback).
- New shared hook src/components/site/use-loop-stage.ts: useInteractiveLoop(count) cycles stages every 2.2s and supports pinning - pin(stage) stops the advance, arms a 6s resume timer; the interval skips while pinned, and the cycle resumes from the pinned stage. Idle state -1 matches SSR (clean hydration); under prefers-reduced-motion the interval never starts but pinning still flips highlight colors (no motion).
- New src/components/site/loop-panel.tsx (hero): live 2x2 architecture ring (01 guides, 02 agent, 03 sensors, 04 state) with traveling dot, spinning hub, and a caption line explaining the active stage. Nodes are real buttons: mouseenter/focus/click pins the stage; aria-pressed communicates state.
- New src/components/site/sensor-cell.tsx (bento): 5-sensor suite on a 620ms tick machine, each sensor pulses then checks off, "exit 0 · GREEN" chip lands, cycle restarts; reduced motion folds reduce into the all-pass frame at render (no setState in effect).
- New src/components/site/verdict-panel.tsx (cta): rotating dashed signal ring around a green check with "$ do-harness verify" and "exit 0 · GREEN"; static under reduced motion.
- Rewrote how-it-works.tsx: trimmed text (2-sentence intro, 1-clause init strip, 1 term + 1 line per card), animated loop (active card highlight, signal edges, traveling dots, spinning hub), cycling EXPLAIN caption bound to the stage machine. Stage number badges are real buttons (click/focus pins); card mouseenter pins. Hub spin guarded with reduce so a pinned stage under reduced motion never spins.
- hero.tsx / bento.tsx / cta.tsx: Image imports and photo markup replaced by LoopPanel / SensorCell / VerdictPanel. Deleted public/harness-hero.png, harness-macro.png, harness-coil.png.
- Verified: lint clean; tsc clean for site sources. agent-browser at 1440/768/390, light + dark: document.images.length === 0 (page is fully image-free), scrollWidth equals viewport at all three widths, console + page errors clean. Pin behavior verified with real input: hero hover-pin on "Stage 02: agent" held its caption for 3s then resumed to the next stage after ~6s idle; how-it-works click-pin on the "Pin stage 02" badge did the same; screenshot captured the pinned state (card 02 tinted, green edge, traveling dot).

Stage Summary:
- The preview now shows only animations and explanations: zero <img> elements ship in the page. Hero = explorable loop ring, how-it-works = technical loop diagram with cycling explanations, bento = live sensor suite, cta = live verdict.
- The loop is interactive per recommendation 3: hover, click, or keyboard-focus pins a stage and pauses the cycle; it resumes from the pinned stage after 6 seconds idle.

---
Task ID: 4
Agent: main (Z.ai)
Task: Complete recommendation 1 (RED terminal in thesis) and recommendation 2 (visibility gating for every clock); permanently settle the "preview shows images" report.

Work Log:
- Image audit: grep of src/ found zero <Image>/<img>/next-image references; the only hit was scripts/page-render.html (an old dev-server HTML snapshot, not served). The three harness-*.png files were still sitting in public/ unreferenced; deleted them, so public/ now ships only logo.svg + robots.txt. Live DOM check at 1440 after a fresh load: 0 <img>, 0 svg <image>, 0 url() background images, and performance resource entries contain no png/jpg/webp/avif at all. Any remaining photos in the user's preview are browser cache; a hard refresh shows the animation-only page.
- Recommendation 2: added useVisibilityGate() to use-loop-stage.ts. One `live` flag fed by an IntersectionObserver on the diagram root (callers attach the returned containerRef) plus a document visibilitychange listener. Intervals in useInteractiveLoop and SensorCell are torn down while `live` is false and re-armed on return, so nothing ticks offscreen or in a hidden tab. containerRef wired into LoopPanel root, HowItWorks container, SensorCell root.
- Recommendation 1: new src/components/site/red-terminal.tsx, mounted in thesis.tsx as a full-width second grid row (prose left col-span-4, terminal right col-span-8). Scripted terminal replays the README failure loop: three `verify --record` runs failing on `test` (exit 1, strikes 1-3), the halt line, then the fixed run landing `exit 0 · GREEN`. Tones: cmd prompt muted, pass/fail marks signal-ink/destructive, strike counters muted, halt strip bg-destructive/10, GREEN strip bg-signal-tint. Timeout-chain driver gated by the same visibility hook; body height reserved at 312px (14 rows x 20px + padding) so the card never jumps; reduced motion renders the completed transcript statically; role="img" with a descriptive label, transcript aria-hidden (the prose carries the facts for AT). Fixed a duplicate-key bug (repeated command lines) by keying on index; shortened the halt line after the 390px check showed a wrap risk.
- Verified: lint clean, tsc clean for site sources. agent-browser: terminal frozen at 1 line while below the fold, 10 lines 5s after scrolling into view, cycling past the full 13-line transcript; click-pin on a hero node held for 3s and resumed after ~6s idle; halt + GREEN strips screenshot-verified in light and dark; 14 transcript rows fit the reserved box at 390 (last row bottom 581 vs box bottom 597); zero console errors/warnings; zero horizontal overflow at 1440/768/390.

Stage Summary:
- The page is now provably image-free at the network level and every animated diagram pauses its clock when offscreen or when the tab is hidden (recommendation 2), the thesis section shows the RED loop as a live terminal (recommendation 1), and the explorable pin from recommendation 3 carries over.

---
Task ID: 5
Agent: main (Z.ai)
Task: Complete the remaining recommendations: 4 (animated init file tree) and 6 (OG social image). Recommendation 5 (shared clock) was already satisfied by the shared use-loop-stage hook.

Work Log:
- Re-verified the exact init scaffold list against the README before drawing anything: do-harness.toml, AGENTS.md, USE_RESTRICTIONS.md, plans/invariants.json, .agents/skills/ (harness + skill-creator), .gitignore entries, and the libSQL state at .do-harness/agent_state.db.
- New src/components/site/init-tree.tsx, replacing the static init strip in how-it-works.tsx. The command row ($ do-harness init + one-time chip) stays; the file list below now assembles itself: rows land every 240ms, hold for 10 steps, and the scaffold replays. Rows use invisible placeholders so the reserved height (132px mobile / 66px sm+ two-column) never jumps; annotations sit right-aligned and hide below sm. Gated by useVisibilityGate (pauses offscreen / hidden tab); reduced motion renders the full tree statically with animate-in disabled. Rows are aria-hidden inside a role="img" panel whose label enumerates the real scaffold paths.
- Recommendation 6: built scripts/og.html using the exact site tokens (OKLCH palette, Space Grotesk + JetBrains Mono via Google Fonts, signal green, tinted chips) and rendered it to public/og.png (1200x630) with agent-browser. Content: wordmark + repo path, headline "Agents that prove their work." with prove in signal green, mono subline "feedforward guides in / feedback verdicts out / exit 0 or it is not done", the four loop stages with 03 sensors highlighted and a signal arrow, plus the exit 0 GREEN / exit 1 RED verdict chips. Fixed a first-render bug where the verdict chips wrapped their text (white-space: nowrap + tighter gaps).
- Wired metadata in src/app/layout.tsx: metadataBase from NEXT_PUBLIC_SITE_URL (falls back to http://localhost:3000 for dev), openGraph images with 1200x630 /og.png + alt text, and twitter summary_large_image card.
- Verified: lint clean, tsc clean for site sources. Live meta tags confirmed (og:image, og:image:alt, twitter:card). Init-tree cycle sampled over time (1 row, 4 rows, 6 rows, hold), screenshot-verified in light and dark; the how-it-works loop still cycles with stage highlights and traveling dots. Mobile 390: single-column tree, annotations hidden, zero horizontal overflow. Console and page errors clean.

Stage Summary:
- All six improvement items are now done: RED terminal (1), visibility gating (2), explorable pin (3), init file tree (4), shared clock (5), OG image (6).
- Deploy note: set NEXT_PUBLIC_SITE_URL to the production origin so og:image resolves to an absolute shareable URL.

---
Task ID: 6
Agent: main (Z.ai)
Task: Deploy readiness — production build proof, env-driven SEO routes (sitemap + robots), canonical, and a production-mode QA sweep with a full-page screenshot tour.

Work Log:
- First re-verified the claimed-complete Task 5 state end to end (init tree cycling at 1440/390, og.png serving, meta present) before adding anything; found and documented that the summary had mislabeled recommendations 4+6 as pending when they were already shipped.
- SEO hardening: new src/app/sitemap.ts and src/app/robots.ts (MetadataRoute), both deriving absolute URLs from NEXT_PUBLIC_SITE_URL with the localhost:3000 fallback, same convention as layout.tsx metadataBase. robots keeps the explicit social-crawler entries (Googlebot/Bingbot/Twitterbot/facebookexternalhit) from the old static file and adds the Sitemap line; deleted public/robots.txt so the generated route wins.
- Added page-level canonical (alternates.canonical './') in src/app/page.tsx; first edit landed mid-import-block and was restructured so imports stay contiguous.
- Production build: bun run build clean (7/7 static pages; /robots.txt and /sitemap.xml generated as static routes, / prerendered with 1h revalidate).
- Production QA sweep (scripts/qa-prod.sh — one process, because the sandbox reaps background servers between tool calls): standalone server on :3100, zero page errors, zero console output, zero horizontal overflow at 1440/768/390, meta verified (og:image, twitter:card, twitter:image, canonical), init tree 4→6 rows, RED terminal 3→7 lines (diagnosed a false alarm first: querySelector('[aria-hidden]') matched the window-chrome dot spans, not the transcript; div[aria-hidden] is the correct selector), hero loop Stage 02→03.
- Full-page screenshot tour scripts/tour-desktop-light.png, tour-desktop-dark.png, tour-mobile-light.png. First captures showed blank sections below the fold: full-page capture never intersects the once:true Reveal wrappers (artifact, not a bug). Warmup pass added to the script; first warmup silently failed because html { scroll-behavior: smooth } kept restarting interrupted scrollTo animations — fixed with an explicit scrollBehavior:'auto' override during the pass. Final tour shows all eight sections rendered in light, dark, and 390px mobile.
- Wrote DEPLOY.md: the one env var, what consumes it, standalone build/run commands, runtime needs (no db/secrets, star fetch degrades gracefully), and a 4-curl post-deploy verification recipe.

Stage Summary:
- The landing page is deploy-ready: production build verified, SEO routes (sitemap/robots/canonical/OG) all derive from NEXT_PUBLIC_SITE_URL, and the prod-mode QA tour proves every animation, section, and viewport works outside dev mode.
- To ship: set NEXT_PUBLIC_SITE_URL, bun run build, run the standalone server (or any Node 18+ container), then run the DEPLOY.md verification curls.

---
Task ID: 7
Agent: main (Z.ai)
Task: Codebase cleanup, then AGENTS.md and .agents/skills/ agent skills for the repo.

Work Log:
- Evidence-based inventory first: the site imports none of the template stack — zero usage of src/components/ui (44 shadcn components), src/hooks, src/lib/db.ts (prisma), src/lib/utils.ts, src/app/api (hello-world route), prisma/, db/custom.db, examples/websocket (the source of the pre-existing tsc errors), mini-services/ (empty), tests/ (sandbox runtime scripts), components.json, and tailwind.config.ts (dead v3 config: no @config directive, references hsl vars that no longer exist).
- Deleted: all of the above plus dev debris — 21 scripts/*.png screenshots, page-render.html, crop_how.py, diag-terminal.sh, dev.log, server-qa.log, tsconfig.tsbuildinfo, and the stale .next/ (its dev-generated validator still referenced the removed api route). Kept scripts/og.html (OG source) and scripts/qa-prod.sh (QA sweep). Sandbox infra untouched: .zscripts, tool-results, skills/, upload/, download/, Caddyfile, .env.
- package.json rewritten: name do-harness-landing v1.0.0, db:* scripts dropped, 58 direct dependencies removed (60 with transitive). Kept: next/react/react-dom, framer-motion, lucide-react, next-themes (theme-provider + nav), simple-icons (logo-strip), tw-animate-css (globals.css), sharp (future image optimization).
- tsconfig.json: skills/ added to exclude (system library, not project code — eslint already ignored it). .gitignore: added .zscripts/, tool-results/, upload/, download/, scripts/*.png. bun.lock resynced.
- Result: bunx tsc --noEmit and bun run lint now pass the WHOLE repo with zero errors/warnings — no output filters needed for the first time in the project. Net diff: 117 files changed, 17 insertions, 7457 deletions.
- AGENTS.md: routing/completion contract — what the repo is, commands, repository map, 8 hard rules (README-only facts, copy rules, semantic signal green, shape lock, motion gating, accessibility, zero-images, tokens-only), definition of done, skill index.
- .agents/skills/: site-design (OKLCH token inventory with light values, semantic accent + shape locks, copy rules, OG regeneration procedure via scripts/og.html), site-motion (useVisibilityGate/useInteractiveLoop API with exact constants STAGE_MS 2200 / RESUME_MS 6000, the three patterns: script terminal, step-machine grid with placeholder-reserved heights, stage loop panels; shared rules and the aria-hidden selector gotcha), site-verify (static gates, qa-prod.sh single-process requirement, agent-browser recipes, full-page warmup gotchas: once:true Reveal + smooth-scroll override, post-deploy curls, worklog convention).
- Verified the cleaned codebase end to end: bun run build clean (5 routes), qa-prod.sh FAIL=0 — zero console errors, zero overflow at 1440/768/390, RED terminal 3→7 lines, hero loop Stage 02→03, tour screenshots in light/dark/mobile identical in behavior to pre-cleanup.

Stage Summary:
- The repo now contains exactly what the landing page ships: src/app + src/components/site, two purposeful scripts, public/og.png, AGENTS.md, DEPLOY.md, and three agent skills — nothing else. Full-repo tsc and lint are clean with no filters, and the production QA sweep is green.
