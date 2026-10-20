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

