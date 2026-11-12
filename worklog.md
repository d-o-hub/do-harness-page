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

---
Task ID: 7 (completion)
Agent: main (Z.ai)
Task: Re-verify the cleanup + AGENTS.md + skills state with evidence after a session boundary, and close two residual hardening gaps.

Work Log:
- Evidence-based re-verification: AGENTS.md, all three skills, lean package.json, pruned src/ tree, tsconfig/eslint ignores all confirmed on disk; rg found zero stale references to the deleted template stack (@/lib, @/hooks, components/ui, prisma, examples, mini-services). Confirmed AGENTS.md's "ten sections" claim against page.tsx (10 composed section components).
- Residual 1: scripts/qa-prod.sh wrote its server log to the repo root (server-qa.log regenerated on every QA run). Changed the log path to /tmp/do-harness-qa-server.log and deleted the stray file; *.log was already gitignored, this fixes the physical litter too.
- Residual 2: next.config.ts still carried the template's typescript.ignoreBuildErrors: true, which let a type error ship through the build despite the AGENTS.md gate. Removed it (kept reactStrictMode: false as-is; behavior depends on it). This build ran its TypeScript check for the first time and passed clean.
- Untracked the three scripts/tour-*.png QA captures (tracked before the scripts/*.png ignore rule landed); QA regenerates and the ignore rule now holds for future runs.
- Full gate re-run on the hardened config: bun run lint exit 0, bunx tsc --noEmit exit 0, bun run build clean (6/6 static routes incl. robots.txt + sitemap.xml, / prerendered 1h), scripts/qa-prod.sh FAIL=0 — zero page errors, zero console output, scrollWidth === innerWidth at 1440/768/390, meta (og:image, twitter:card, twitter:image, canonical) present, init tree 4→6 rows, RED terminal 3→7 lines, hero loop Stage 02→03, three tour screenshots captured and visually confirmed (all sections render in light theme), then removed from disk.
- Committed as "chore: enforce type gate in build, QA log to /tmp, untrack tour pngs"; work tree clean.

Stage Summary:
- The build itself now enforces the type gate (no more ignoreBuildErrors escape hatch), QA runs leave no artifacts in the repo, and the whole verification chain — lint, tsc, build, prod QA sweep, visual tour — is green on the hardened config. AGENTS.md and the three .agents/skills/ entries are accurate against the code as it stands.

---
Task ID: 8
Agent: main (Z.ai)
Task: Production polish — residual git cleanup, CI, JSON-LD structured data, branded 404, security headers.

Work Log:
- Final git residue: .env, .zscripts/, tool-results/, download/ were still tracked (committed before the ignore rules landed). git rm --cached all four; files stay on disk, git tree carries only repo content. .env in git was the notable one.
- CI: new .github/workflows/ci.yml — on push to main and PRs, bun 1.3.14 pinned via setup-bun, then bun install --frozen-lockfile, bun run lint, bunx tsc --noEmit, bun run build. It mirrors the AGENTS.md definition of done exactly; AGENTS.md and the site-verify skill now point at it and require keeping it in sync with the gates.
- JSON-LD: page.tsx renders a schema.org SoftwareApplication (name, applicationCategory DeveloperApplication, operatingSystem Any, url from NEXT_PUBLIC_SITE_URL, codeRepository, author d-o-hub org, description identical to the metadata description so no new uncheckable claims exist). QA sweep now parses it and reports type/name/url.
- Branded 404: new src/app/not-found.tsx through the root layout (fonts, theme, tokens). Card with destructive exit 1 chip (semantically correct: a missing page is a failure verdict), mono 404 kicker, "Nothing runs here." headline, one factual line, btn-primary "Back to the home page". Caught my own copy violating the checkable-claims rule on first render ("install guide ... link below" while the link only goes home) and fixed it. Verified light + dark screenshots, zero overflow, zero console errors, status 404 (not 500).
- Security headers: next.config.ts headers() on all paths — X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, X-Frame-Options SAMEORIGIN. Verified via curl -sI in the sweep; DEPLOY.md recipe gained the fifth curl.
- Gates: lint exit 0, tsc exit 0, build clean (6 routes, /_not-found now from the custom page), qa-prod.sh FAIL=0 including the three new assertions (headers, JSON-LD, 404 status) plus all regression samples (overflow 1440/768/390, init tree 4→6, terminal 3→7, hero Stage 02→03, three tour screenshots).

Stage Summary:
- The repo now enforces its own definition of done in CI, ships structured data for the software product, returns a branded token-correct 404, and sends baseline security headers. QA sweep and DEPLOY.md cover all of it; no sandbox artifacts remain in git.

---
Task ID: 9
Agent: main (Z.ai)
Task: Create DESIGN.md, the design token reference for the codebase.

Work Log:
- Extracted every value from src/app/globals.css directly (not from memory): raw OKLCH custom properties for :root and .dark, the @theme inline mapping, --radius and its derived scale, both easing tokens, and all @layer component classes with their exact specs.
- Measured component usage before writing the typography table: rg over site components for clamp() displays, tracking values, mono sizes. Found the real scale (hero clamp(2.75rem, 7vw, 4.5rem) leading 1.05, section heading clamp(1.9rem, 3.4vw, 2.9rem), kickers 12px/0.14em, mono data 13px, mini kickers 10px/0.14em, flow labels 11px/0.01em) and container conventions (max-w-1200, px-5 md:px-8, py-20 md:py-28, scroll-mt-24).
- Verified the two sanctioned hex escapes: themeColor in layout.tsx (#f8f9f5 / #151b16) and the OKLCH mirror in scripts/og.html; documented why each exists.
- Caught two of my own draft claims being wrong during self-verification and fixed them: hero leading is 1.05 not 1.08 (that is the CTA), and 10px annotations use 0.14em uppercase (mini kickers), not the flow-label's 0.01em. DESIGN.md claims are now grep-verified against the code.
- Documented: token flow (root/.dark to @theme to utilities), full light+dark color tables with roles, semantic rules (signal = verdict green only, destructive = failure only, primary is ink not green), typography with families and scale, shape lock with derived radii, spacing/layout conventions, z-scale 40/50/60, motion tokens + duration inventory + the non-negotiable guards (visibility gate, reduced motion, once:true), component class specs, base layer, dark parity rule, and a 5-step extension checklist.
- Cross-referenced: AGENTS.md repository map points to DESIGN.md; the site-design skill now names DESIGN.md as the complete token reference and keeps its own table as the fast subset.
- Docs-only change (no .ts/.tsx/.css touched), so lint/tsc/build are unaffected; no browser sweep needed. No em/en dashes in the document (checked).

Stage Summary:
- DESIGN.md is the single readable token reference: every value in it is extracted from globals.css or grep-verified in component usage, and the extension checklist binds future token edits to keeping both themes, the doc, and the skill in sync.

---
Task ID: 10
Agent: main (Z.ai)
Task: Install the impeccable design skill pack into the repo (npx impeccable install).

Work Log:
- Researched the tool first: impeccable (pbakaus/impeccable, npm v4.8.0) is a cross-harness design skill pack: 24 design commands (polish, critique, audit, bolder, distill...) plus a deterministic 62-rule slop detector. Non-interactive install: npx impeccable install -y --scope=project (node v24 present).
- What landed: .agents/skills/impeccable/ (SKILL.md + 30 reference playbooks + launcher scripts + 5 agent tomls), a GitHub Copilot copy in .github/skills/impeccable/ with 4 agent definitions and a postToolUse design-hook manifest in .github/hooks/, and a Codex hook in .codex/hooks.json. Our three site skills are untouched and sit alongside it.
- Commit strategy: the two 21MB linux-x64 engine binaries are gitignored (.agents and .github copies). Verified from the launcher source that the binary self-restores: lookup order is IMPECCABLE_BIN, sibling binary, home cache, version-pinned cache, then a checksum-verified download on first run, so fresh clones work after one launcher call or npx impeccable install. Skill text (2.3M per copy) is committed.
- eslint gate: the bundled scripts/*.js in both skill copies produced 156 warnings, breaking the zero-warnings gate. Added .agents/**, .codex/**, .github/** to eslint ignores (mirroring tsconfig's skills exclusion). Lint back to clean, tsc clean.
- Smoke tests: (1) src/ regex scan: 25 files, exit 0, zero findings. (2) Full rendered-page scan with the bundled Chrome (IMPECCABLE_BROWSER pointed at the agent-browser chrome, standalone server on :3100): 16 primary findings + 5 advisories. Triage: 6x undersized-ui-text on the 10px mini-kickers (11px is the detector's floor for functional text), 1x 11px caption line, 2x line-length ~88ch, 1x overused-font on Space Grotesk (deliberate brand choice, accept), 2x pulsing-dot on the diagram live indicators (defensible: the loop genuinely is live; also blinking terminal cursor is a code-context convention), em-dash advisory is a false positive (counts --record/--strict CLI flags), 3x straggler advisories fixable with text-pretty. The scan also surfaced a real Unicode em-dash in a sitemap.ts comment; fixed (docs-only change, lint+tsc re-run clean, no build impact).
- Documented the pack, the binary restore path, and the DESIGN.md brand-context dependency in the AGENTS.md repository map. Next agent-chat step per the tool: /impeccable init writes PRODUCT.md; /impeccable document would read our existing DESIGN.md.

Stage Summary:
- Impeccable is installed project-wide (agent skill + Copilot + Codex integrations) with a 42MB binary cost kept out of git via the launcher's documented self-restore. The 62-rule detector runs against the live page and its first scan produced a concrete, triaged fix list: the 10px mini-kicker bump to 11px is the main actionable item.

---
Task ID: 11
Agent: main (Z.ai)
Task: Run the impeccable skill: bare invocation presented the context-aware menu, user picked init; then repair the build the install commit had broken.

Work Log:
- Setup per SKILL.md: `impeccable context` once for the session (NO_PRODUCT_MD flagged, DESIGN.md loaded, RESOLVED_CONTEXT ok) and routing.md read for the no-argument menu. Menu presented with init as the top recommendation; user confirmed init (structured question tool).
- init Step 2 (explore): grounded product truth in the page copy itself (hero, thesis, cta, bento, install, compliance), JSON-LD description, logo-strip honesty check (compatible tooling, not customers). Platform hypothesis: web.
- init Step 3 (interview, one round, three questions): primary user confirmed as DevEx/platform teams gating AI-generated code in CI (Team/CI first); durable positioning confirmed as the compiled verdict (single static binary + exit-code contract 0/1/2 = GREEN/RED/VACUOUS); evidence discipline confirmed as repo-truth-only with an explicit must-never-fabricate list.
- init Step 4: wrote PRODUCT.md (impeccable:product-schema 1) at PROJECT_ROOT with confirmed facts, marked secondary audience as unconfirmed, and the absences section (no testimonials, customer counts, benchmarks, adoption metrics).
- init Step 5: buildPath asked as its own question (harness has native image generation, no value recorded): user chose code-first; wrote `.impeccable/config.json` `{"buildPath": "code"}`. Live mode: `detect-csp` returned shape null; wrote `.impeccable/live/config.json` (files: src/app/layout.tsx, insertBefore </body>, commentSyntax jsx, cspChecked true) and gitignored `.impeccable/live/` as machine-local state.
- Build repair discovered during gates: commit af3d643 (author date backdated to Nov 5, committer date 15:49 today, i.e. concurrent with this session) had swept ~75 files of sandbox template residue into git besides the skill pack: src/components/ui (34-file shadcn kit), src/hooks, src/lib (clsx/prisma stubs), src/app/api/route.ts, examples/websocket, tailwind.config.ts (v3-style), tests/*.sh, db/, prisma/, mini-services/, components.json, public/harness-*.png, public/robots.txt (conflicts with the env-driven src/app/robots.ts), public/logo.svg, scripts junk. Nothing in the kept tree imports any of it (rg verified); bun.lock change was mode-only.
- Removed all residue with git rm (75 files). Gates re-run: bun install --frozen-lockfile clean; one stale .next/types validator error (referenced the deleted api route) cleared by the fresh build; final chain lint 0 / tsc 0 / build green with the same route table (/ + /_not-found + /icon.svg + robots.txt + sitemap.xml).
- AGENTS.md repository map: added PRODUCT.md and .impeccable/config.json entries; impeccable detector line now says it reads PRODUCT.md and DESIGN.md as brand context.

Stage Summary:
- PRODUCT.md is the repo's captured product truth and .impeccable/config.json pins code-first as the standing build path; init's completion gate is satisfied. The template residue that slipped into af3d643 is gone, so tsc and build are honest again and CI parity holds. Deliberately undecided: secondary solo-dev audience stays marked unconfirmed; no visual work was done (init writes product truth only).

---
Task ID: 12
Agent: main (Z.ai)
Task: Run $impeccable critique / (dual-agent per protocol), then implement the user-scoped fix pass (top 4 + the 11px kicker bump).

Work Log:
- Setup: target resolved to src/app/page.tsx (slug src-app-page-tsx); no ignore list; critique playbook (reference/critique.md) read in full.
- Dual-agent run (mandatory path, Task tool exposed): Assessment A (design review: source + live screenshots at 1440/390, light+dark via agent-browser with the qa-prod warmup recipe; heuristic scores + personas) and Assessment B (detector: source scan exit 0; rendered desktop 1440x900 = 16w+5a, mobile 390x844 = 13w+5a; overlay injection succeeded in-page, console evidence captured; live-server stopped with --keep-inject, no source mutation). Neither saw the other's output.
- Score: 28/32 (Good), n/a #7 and #10 (Persuade mode). Five priority issues; two detector false positives documented (em-dash = CLI flags; Space Grotesk = brand choice).
- Persisted snapshot .impeccable/critique/2026-11-11T16-39-27Z__src-app-page-tsx.md (28/32, p0=0 p1=2); first run, no trend. User answers: install trust first; motion = play once (hero keeps looping); scope top 4; bump 10px kickers to 11px.
- P1 install trust (install.tsx): cmd rows restructured so CopyButton is pinned outside the code span; code now wraps (break-words) instead of nowrap+scroll, so no command is ever clipped; added a "Read install.sh before running it." link to the raw installer script; exit-2 copy fixed.
- P1 SSR voids (harden): RedTerminal, InitTree, SensorCell now server-render their completed state (full 13-line transcript, all 6 tree rows, all-pass verdict); with JS they rewind once and play a single pass, then hold (beganRef + deferred setTimeout, satisfying react-hooks/set-state-in-effect); visibility-gated as before; reduced motion keeps the completed static state.
- Reveal no-JS parity: reveal.tsx rewritten from framer whileInView to IntersectionObserver + data-reveal attributes; globals.css adds .js-gated [data-reveal] and .enter styles; layout.tsx gains a bootstrap script adding html.js before first paint, so the no-JS page renders fully visible. Hero de-framered to the same .enter CSS (stagger preserved via --enter-delay; hero is now a server component). Caption crossfades and the sensor GREEN chip swapped from framer inline opacity to tw-animate classes, eliminating all inline opacity:0 from SSR HTML (verify-ssr asserts 0).
- P2 exit-code vocabulary: thesis dl now 0 GREEN (signal-ink) / 1 RED (destructive) / 2 VACUOUS (muted) with verdict-prefixed labels; how-it-works chip "2 config error" -> "2 VACUOUS"; install copy aligned to the VACUOUS contract. The pass-colored RED "1" is gone.
- P2 motion story: only the hero loop cycles; terminal/tree/sensor play once and hold (peak-end on GREEN); init tree now matches its "one-time" chip.
- P3 typeset: all five 10px mono mini-kickers bumped to 11px (loop-panel numerals, how-it-works x2, thesis, sensor-cell).
- Docs in the same commit: DESIGN.md mini-kicker row 11px, durations table + guards rewritten (no-JS parity, play-once-hold, IO reveals), component-level comments updated.
- Verification: gates green (lint 0 / tsc 0 / build 6 routes); qa-prod.sh FAIL=0 twice incl. fresh tour screenshots; scripts/verify-ssr.sh 14/14 assertions (SSR states, links, VACUOUS copy, zero inline opacity:0); detector re-scan: source exit 0, rendered desktop 11 findings (undersized-ui-text 10 -> 0; remainder = documented FPs + out-of-scope stragglers/line-length); visual check desktop light + dark + mobile crop of the install rows.
- New scripts: scripts/critique-a-shots.sh, scripts/critique-b-scan.sh, scripts/verify-ssr.sh.

Stage Summary:
- The critique pass is fully closed: 2 P1s fixed (install trust, SSR voids), exit-code vocabulary unified, motion story aligned to the one-time claim, kickers at the 11px floor. Page now passes its own thesis: the static HTML carries the full proof. Out of scope left documented: straggler/line-length advisories, pulsing-dot x2 (intentional live indicators), trust-bar specificity.

---
Task ID: 13
Agent: main (Z.ai)
Task: $impeccable polish / — sweep the remaining documented advisories (straggler x3+3, line-length x2) and the critique's weakest-specificity verdict (trust bar).

Work Log:
- Setup: polish playbook read in full; critique-storage latest returned the current snapshot (fingerprint unchanged, exit 0), snapshot read and named. Fresh evidence via scripts/critique-b-scan.sh: source 0; desktop 11 findings (straggler x3, line-length x2, tiny-text x2, pulsing-dot x2, overused-font, em-dash); mobile 9 (straggler x3 among them). Session protocol: impeccable context run at session start; polish classified drift as local defects (missing text-pretty) plus one content-specificity defect (trust bar).
- Stragglers: text-pretty applied to the flagged elements and their same-role siblings — thesis prose container + exit-code dl dd + red-loop paragraph, install method descriptions + Windows note + wire-step notes + CI note, footer blurb, loop-panel dd (13.5px), compliance prose. text-wrap: pretty is the detector's own remedy; DESIGN.md already mandates it for body paragraphs, these were the gaps.
- Line-length: compliance prose container gains max-w-[65ch], matching the thesis measure (46rem at 17px measured >80ch at 1440px). Chips and the code line keep full width.
- Trust bar (logo-strip.tsx): anonymous logo soup (Rust/Node/TS/GH Actions/GitLab/Lighthouse) replaced with four claim-bearing items, each checkable against the page or repo: npm "zero-install via npx, node 18+" (install method 1), Rust "prebuilt binary, no runtime to install" (shell/cargo methods, footer), Git "git hooks gate commits and pushes" (hook install note), GitHub Actions "CI runs the same gates on every push" (compliance copy). Dropped TS/GitLab/Lighthouse as undocumented compatibilities (Lighthouse worst: web sensors are axe/console/performance). Claude icon deliberately excluded: the page never names Claude, a brand logo would imply a partnership claim; PRODUCT.md evidence discipline forbids it. Band form, lead-in line, Reveal, aria-label preserved.
- Minor observation fixed: theme-toggle aria-label now states the action ("Switch between light and dark theme") — hydration-safe static wording. Reviewed and left as-is: GitHub icon 2x (both functional), compliance tint (intentionally quiet band), hero CTA widths (standard wrap).
- Concurrency note: session tool connection dropped mid-pass; a harness auto-checkpoint (fe8d800) captured the first three edited files (thesis/install/footer, verified byte-exact); mode-only chmod artifacts on 5 files restored via git restore; remaining edits completed after restart.
- Verification: gates green (lint 0 / tsc 0 / build 6 routes); verify-ssr.sh 14/14; detector re-scan: source 0, desktop 11 -> 6, mobile 9 -> 6 (straggler 0, line-length 0 both viewports; remainder = documented set: tiny-text x2 on 11px code-context chrome, pulsing-dot x2 intentional, em-dash + Space Grotesk FPs); qa-prod.sh FAIL=0; visual check light + dark + mobile crops of trust bar and compliance.
- Snapshot closed: critique-storage close exit 0 (all 5 Priority Issues cleared by Task 12; this pass cleared the leftover advisories it had documented as out of scope).

Stage Summary:
- Polish pass closed every remaining detector advisory that had a real remedy: text now has no stragglers and no over-measure lines on either viewport, and the trust bar states four verifiable integration claims instead of implying six anonymous ones. The page's remaining findings are exactly the documented intentional set. Deliberately out of scope: pulsing-dot x2 (live indicators), compliance band tint, GitHub icon count, CTA widths.

---
Task ID: 14
Agent: main (Z.ai)
Task: $impeccable audit / — technical quality audit (documenting pass, no fixes by design).

Work Log:
- Protocol: audit.md read in full before executing; context re-anchored; git-state check caught the recurring scan-tooling chmod artifacts on 5 files and restored them.
- Evidence (scripts/audit-scan.sh + scripts/audit-reprobe.sh, standalone :3103): detector source/desktop/mobile; computed-style probes at 1440/768/390/320; 200% text zoom; touch-target inventory; keyboard/skip-link/ring; resource transfer; heading/landmark/alt inventory; CSS-level reduced-motion review; contrast computed from the exact DESIGN.md token values via oklch->sRGB in Python (canvas rejects oklch; first browser contrast probe was invalid and was discarded, not reported).
- Tooling caveats handled honestly: agent-browser media emulation silently ignores "reduce" (matches=false) so the reduce guards were verified at CSS level (three @media blocks: scroll auto, .enter/[data-reveal] frozen visible, .flow-dot display:none); the skip-link probe first matched the logo (both href="#top") and was re-done against the real sr-only link.
- Results: 19/20 (Excellent) — A11y 4, Performance 3, Theming 4, Responsive 4, Integrity 4. Contrast: body 16.2/15.9, muted 7.6-7.9 (AAA), signal-ink-on-tint 7.7/8.3 (AAA). No overflow 320-1440; zoom-200% clean; 44px controls with the inline-text exception for text links; skip link sr-only->focus:not-sr-only z-50; H1x1->H2x6->H3x18->H4x1 no skips; 0 will-change; 172KB gz JS.
- Findings: 0 P0/P1/P2, 2 P3 (.flow-dot keyframe animates top instead of transform; framer-motion still in 5 proof-panel components after the hero/reveal de-framer). Both documented with suggested command ($impeccable optimize), neither worth a standalone pass. Report persisted at .impeccable/audit/2026-11-12T16-23-26Z__src-app-page-tsx.md.
- .next/standalone had been recycled between messages; rebuilt before scanning (gates green again, same 6-route table).

Stage Summary:
- The audit confirms the critique->harden->polish chain landed: no P0-P2 issues remain; both P3s are pre-registered optimization candidates. The page's remaining lever is content, not implementation: the install section cites checksum verification but cannot display the value (Jordan persona flag, needs the real SHA-256 from a release).

---
Task ID: 15
Agent: main (Z.ai)
Task: Close the audit's content lever - display the real install.sh SHA-256 beside the shell install row (Jordan persona's remaining trust gap).

Work Log:
- Feasibility: raw.githubusercontent.com reachable from the build environment; independent curl|sha256sum established ground truth d9612f0f...05ebc2 (200 OK).
- page.tsx: getInstallScriptChecksum() fetches the exact bytes raw serves for install.sh (same source as the pipe) and hashes them with node:crypto; revalidate 3600 matches the star-count pattern; any failure or a non-64-hex result returns null. Fetched in Promise.all alongside stars; passed to Install as scriptChecksum.
- install.tsx: Shell method row gains a checksum block - kicker "INSTALL.SH - SHA256" + CopyButton on line 1 (justify-between), full 64-hex value on line 2 (break-all, 12.5px mono, foreground). First attempt wrapped the Copy button onto an orphaned third line at 1440px; restructured to the deterministic two-line layout before commit. null degrades silently to the existing read-the-script link - nothing stale or invented is ever shown (PRODUCT.md evidence discipline).
- verify-ssr.sh: +2 assertions (label SSR-rendered; the exact upstream hex displayed). Note: the pinned-hex assertion is deliberately brittle - if upstream changes install.sh, the assertion fails and forces re-verification of the new script before the page can ship. JSX renders &middot; as the literal character, first assertion draft had to use the real dot.
- Verification: gates green (lint 0 / tsc 0 / build 6 routes); verify-ssr 16/16; atomic cross-check of the SSR HTML against a fresh upstream fetch MATCH; detector unchanged (source 0, desktop 6, mobile 6 = documented set, no findings from the new row); qa-prod FAIL=0; visual checks light + dark + mobile (hex wraps cleanly via break-all at 390px).

Stage Summary:
- The page now closes its own trust loop: the command it hands you, the script it pipes, and the hash of those exact bytes are all on the same row, copyable, and the displayed value was cross-checked against a live fetch during this task. Remaining page-level work is the two documented P3 optimize candidates from the audit (framer subset, flow-dot keyframe), by choice not omission.
