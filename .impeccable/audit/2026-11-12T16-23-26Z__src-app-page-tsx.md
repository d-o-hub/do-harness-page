---
target: the homepage (/)
method: $impeccable audit (web) — technical quality checks, evidence-measured
timestamp: 2026-11-12T16-23-26Z
score: 19
max: 20
p0: 0
p1: 0
p2: 0
p3: 2
target_path: /home/z/my-project/src/app/page.tsx
build: 07be341
---
# Audit — do-harness landing page (/)

Evidence: detector source+rendered scans, canvas-independent contrast math from the
exact token values in DESIGN.md (oklch→sRGB, WCAG relative luminance), computed-style
probes at 1440/768/390/320, 200% text zoom probe, DOM heading/landmark/keyboard
inventory, resource-transfer measurement, CSS-level reduced-motion guard review.
Tooling caveat: browser media emulation could not apply `prefers-reduced-motion`
(values silently ignored by agent-browser in this environment), so motion-reduce
guards were verified at the CSS level (three `@media (prefers-reduced-motion: reduce)`
blocks in globals.css) rather than behaviorally.

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 4 | All measured token pairs pass AA; most pass AAA (body 16.2:1, muted 7.6:1, chips 7.7:1) |
| 2 | Performance | 3 | 172KB gz JS; framer-motion still in 5 proof-panel components; `.flow-dot` animates `top` |
| 3 | Theming | 4 | Zero hard-coded colors outside the two sanctioned escapes; dark parity verified |
| 4 | Responsive Design | 4 | No overflow at 320/390/768/1440; zoom-safe cmd rows; 44px controls; inline-link exception applies |
| 5 | Implementation Integrity | 4 | Source scan exit 0; rendered findings = documented intentional set only |
| **Total** | | **19/20** | **Excellent (minor polish)** |

## Implementation Integrity Verdict

**Pass.** The implementation expresses a coherent, product-specific system: the
exit-code contract rendered as dl rows, chips, and terminal verdicts; a claim-bearing
trust bar where every label is checkable on the page or in the repo; aria-labels
carrying README-faithful facts; a 404 built as exit 1; and verify-ssr.sh asserting
14 SSR proof states so the static page carries the full evidence story. The detector's
five rendered findings (tiny-text ×2, pulsing-dot ×2, em-dash, overused-font) are all
previously triaged: code-context 11px chrome at the documented floor, intentional
live indicators, and two false positives (CLI flags counted as dashes; Space Grotesk
as deliberate brand).

## Executive Summary

- Audit Health Score: **19/20 (Excellent — minor polish)**
- Total issues: **2** (0 P0 / 0 P1 / 0 P2 / 2 P3)
- No blocking, major, or minor-severity issues found.
- Top issues: both P3 (see below).
- Recommended next steps: none required. The one remaining trust lever on the page
  is content, not implementation: the install section still cannot display the
  checksum it cites (the persona flag from the critique pass).

## Detailed Findings by Severity

### [P3] `.flow-dot` travel animates a layout property
- **Location**: `src/app/globals.css` (flow-dot keyframes, `to { top: 0 }`)
- **Category**: Performance
- **Impact**: Negligible in practice — a 7px absolutely-positioned dot inside a
  scoped diagram, one traversal per activation — but `top` triggers layout where
  `transform: translateY()` would not.
- **Recommendation**: Switch the keyframe to `transform` next time the component is
  touched. Not worth a standalone pass.
- **Suggested command**: `$impeccable optimize`

### [P3] framer-motion remains in five proof-panel components
- **Location**: `init-tree.tsx`, `loop-panel.tsx`, `use-loop-stage.ts`,
  `verdict-panel.tsx`, `sensor-cell.tsx`
- **Category**: Performance
- **Impact**: Part of the 172KB gz script transfer. The hero and reveal system were
  already de-framerred (CSS + IntersectionObserver); these five play once and hold,
  so they are the remaining migration candidates.
- **Recommendation**: Migrate to the same CSS/IO pattern when convenient; expected
  saving is tens of KB gz.
- **Suggested command**: `$impeccable optimize`

## Patterns & Systemic Issues

None. No repeated shortcuts: colors are tokenized everywhere, motion uses the two
easing tokens, controls reuse `.btn`/`.icon-btn`/`.chip`, and all initial-hidden
styles are scoped under `html.js` for no-JS parity.

## Positive Findings

1. **Contrast with headroom**: body ink on paper 16.2:1 light / 15.9:1 dark;
   muted-foreground 7.6-7.9:1 (AAA); signal-ink on signal-tint 7.7:1 / 8.3:1 (AAA).
   The semantic accent never drops below 7:1 in either theme.
2. **Textbook skip link**: `sr-only focus:not-sr-only focus:absolute z-50` — correct
   unfocused 1×1 state, visible top-left on focus.
3. **Reduced-motion guard trio** in globals.css: scroll-behavior auto, `.enter` /
   `[data-reveal]` frozen at their visible state, `.flow-dot` display:none.
4. **No-JS parity proven**: verify-ssr.sh 14/14 — static HTML carries terminal
   transcript, scaffold tree, sensor verdicts, zero inline `opacity:0`.
5. **Zoom resilience**: 200% text zoom leaves html overflow-free and 0 cmd rows with
   inner scroll (the critique's Riley flag is resolved).
6. **Lean interaction layer**: 0 `will-change` at rest; animations are
   transform/opacity except the flagged 7px dot; visibility-gated timers.
7. **Semantic structure**: H1×1 → H2×6 → H3×18 → H4×1 with no level skips; complete
   landmark set; `lang=en`; zero raster images; SVG logos carry `role="img"` +
   `aria-label`.

## Recommended Actions

None at P0-P2. If continued, in priority order:

1. **[P3] `$impeccable optimize`**: framer-motion → CSS/IO migration in the five
   proof-panel components; `.flow-dot` keyframe to `transform` while there.
2. **[Content, out of audit scope]**: display the real install.sh SHA-256 beside the
   shell install row (Jordan persona's remaining trust gap — the copy cites
   checksum verification but the page cannot show the value).
