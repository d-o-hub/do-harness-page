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
