# Skill: site-motion

The animation and diagram system of the landing page. Use when
touching any animated component, adding a diagram, or changing
timing. Every rule here exists because breaking it shipped a real
bug once.

## The architecture

All motion runs through **one shared clock infrastructure** in
`src/components/site/use-loop-stage.ts`:

- `useVisibilityGate()` returns `{ containerRef, live }`. Attach
  `containerRef` to the diagram's root element. `live` is a single
  flag fed by an IntersectionObserver on that root **and** a
  document `visibilitychange` listener. Every interval or timeout
  chain must be gated by it: `if (reduce || !live) return` inside
  the effect, with `[reduce, live]` in the dependency array. Effects
  tear down while hidden and re-arm on return — nothing ticks
  offscreen or in a hidden tab.
- `useInteractiveLoop(count)` returns `{ stage, pin, reduce,
  containerRef }`. `stage` starts at **-1 (idle)** to match the
  server render (hydration stays clean; the diagram is static until
  the first tick). It advances every `STAGE_MS` (2200ms). `pin(s)`
  freezes the machine on stage `s` and resumes `RESUME_MS` (6000ms)
  after the last pin. Pinning works under reduced motion (it only
  flips highlight colors).

## Pattern 1: script terminal (`red-terminal.tsx`)

A replayed transcript driven by a timeout chain.

- `SCRIPT` is `{ text, tone, hold }[]`; `tone` ∈ `cmd | body |
  strike | halt | pass`; `hold` is how long the line stays before
  advancing. The chain wraps to line 1 after the last hold.
- `step` starts at **1** (SSR shows exactly one line — no hydration
  mismatch). `visible = reduce ? LINES : step`.
- **Reserve the body height up front**: `h-[312px]` = lines × 20px
  leading + `py-4`. Recompute whenever the script changes, or the
  card jumps and can clip its last row.
- Tone rendering: `cmd` splits a muted `$` prompt; body marks ✓ in
  `text-signal-ink` / ✗ in `text-destructive`; `halt` gets a
  `bg-destructive/10` strip; `pass` gets `bg-signal-tint`.
- The panel is `role="img"` with a narrative `aria-label`; the
  transcript div is `aria-hidden` (the neighboring prose carries the
  facts). Key lines by index — command lines repeat, so `key={text}`
  collides.

## Pattern 2: step machine grid (`init-tree.tsx`)

Rows landing one by one on an interval, then holding, then replaying.

- `step` starts at **0** (SSR shows all placeholders); cycle length
  is `FILES.length + HOLD_STEPS`.
- Unrendered rows are **invisible placeholders** (not omitted), so
  the reserved height (`h-[132px]` mobile = 6 rows × 22px,
  `sm:h-[66px]` = 3 rows two-column) never changes.
- Rows animate in with `animate-in fade-in duration-300
  motion-reduce:animate-none`; annotations hide below `sm`.

## Pattern 3: stage loop panels (`loop-panel.tsx`,
`how-it-works.tsx`, `sensor-cell.tsx`, `verdict-panel.tsx`)

Stage highlights, traveling dots, and captions ride
`useInteractiveLoop`. Edges mount a `.flow-dot` only while their
edge is active (so reduced-motion users never see it move; the media
query hides the class entirely). Interactive pinning: real
`<button>`s with `aria-pressed`, pinned via hover/focus/click.

## Shared rules

- `Reveal` (`reveal.tsx`): `whileInView` with `once: true, margin:
  '-80px'`; under reduced motion it crossfades opacity only. Never
  gate content behind a reveal that requires JS to become visible
  for SEO-critical text — it's opacity, not conditional rendering.
- CSS keyframes live in `globals.css` (`@layer components`): the
  `flow-*` classes and `flow-travel-*` keyframes. Anything
  continuous gets a `motion-reduce:animate-none` or a media-query
  kill switch.
- Adding an animated section: reuse the hooks above, reserve all
  animated heights, add the `role="img"` + prose pairing, then run
  the site-verify sweep (offscreen freeze is a feature, not a bug:
  if lines don't advance, scroll the panel into view first).
