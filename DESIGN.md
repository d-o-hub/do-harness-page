# DESIGN.md

Design tokens for the do-harness landing page. The source of truth
is `src/app/globals.css`; this document is the readable mirror. Change
both in the same commit. The theme is called **"instrument report"**:
off-white paper, ink text, mono data, and one semantic signal green
tied to the product's own verdict colors.

## 1. How tokens flow

```
:root / .dark        raw OKLCH custom properties
@theme inline        maps them to Tailwind v4 theme names
Tailwind utilities   bg-background, text-muted-foreground, rounded-xl...
component classes    .btn, .chip, .cmd, .flow-* (defined in globals.css)
```

- Dark mode is class based: `.dark` on `<html>`, toggled by
  next-themes (system default plus manual toggle). The `@custom-variant
  dark` line makes `dark:` utilities work with that class.
- Components never hardcode colors. The only sanctioned hex escapes
  are the two `themeColor` values in `layout.tsx` (browser chrome
  approximations of the backgrounds) and the OKLCH mirror inside
  `scripts/og.html` (a static image source cannot read CSS variables).

## 2. Color tokens

All values are OKLCH `lightness chroma hue`. The neutral band keeps a
green undertone (hue 130 to 155) so the page reads slightly warm next
to the signal green; pure gray would look dead on this palette.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--background` | `oklch(0.982 0.004 130)` | `oklch(0.168 0.01 155)` | Page paper |
| `--foreground` | `oklch(0.225 0.012 155)` | `oklch(0.936 0.008 140)` | Ink |
| `--card` / `--card-foreground` | `oklch(0.992 0.003 130)` / ink | `oklch(0.205 0.011 155)` / ink | Card surface |
| `--popover` / `--popover-foreground` | same as card | same as card | Menus, tooltips |
| `--primary` / `--primary-foreground` | ink / paper | paper / dark paper | Primary button fill |
| `--secondary` / `--secondary-foreground` | `oklch(0.958 0.007 140)` / ink | `oklch(0.245 0.012 155)` / paper | Secondary fill |
| `--muted` / `--muted-foreground` | `oklch(0.958 0.007 140)` / `oklch(0.43 0.016 152)` | `oklch(0.245 0.012 155)` / `oklch(0.72 0.014 150)` | Quiet fills / secondary text |
| `--accent` / `--accent-foreground` | same as secondary | same as secondary | Hover washes |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | Failure states only |
| `--border` / `--input` | `oklch(0.905 0.01 145)` | `oklch(0.3 0.012 152)` | Hairlines / input edges |
| `--ring` | `oklch(0.53 0.115 152)` | `oklch(0.72 0.13 152)` | Focus ring color |
| `--signal` | `oklch(0.53 0.115 152)` | `oklch(0.72 0.13 152)` | The one accent |
| `--signal-ink` | `oklch(0.4 0.095 152)` | `oklch(0.79 0.11 152)` | Signal-colored text |
| `--signal-tint` | `oklch(0.952 0.024 152)` | `oklch(0.26 0.032 152)` | Signal washes, chips, active edges |

### Semantic rules

- `--signal` is the color of `exit 0 · GREEN`, the product's own
  verdict. It never appears decoratively: no green buttons, no green
  links, no green section headings. Legitimate uses: verdict chips,
  pass marks, the focus ring, selection background, the loop-back
  connector in diagrams, active stage highlights.
- `--destructive` appears only for failure states: exit 1, ✗ marks,
  halt strips, the 404 chip.
- `--primary` is ink, not green. The primary button is black on paper
  (paper on dark), which keeps green exclusive to verdicts.

## 3. Typography

| Family | Variable | Stack | Used for |
| --- | --- | --- | --- |
| Space Grotesk | `--font-sg` | `--font-sans` | Display, body, UI |
| JetBrains Mono | `--font-jb` | `--font-mono` | Commands, data, verdicts, kickers |

Both load via `next/font` in `layout.tsx` with `display: swap`. Body
enables `font-feature-settings: "ss01"` (Space Grotesk's alternate
glyph set).

### Scale (measured usage, not aspirations)

| Role | Size | Tracking | Notes |
| --- | --- | --- | --- |
| Hero display | `clamp(2.75rem, 7vw, 4.5rem)` | `-0.025em` | `leading` ~1.05 |
| CTA display | `clamp(2.25rem, 4.5vw, 3.5rem)` | `-0.025em` | `leading` 1.08, closing statement |
| Section heading | `clamp(1.9rem, 3.4vw, 2.9rem)` | `-0.02em` | thesis, how, bento, install, compliance |
| Card heading | `text-3xl` / `md:text-4xl` | `-0.02em` | 404 page |
| Lead / body | `text-lg`, `leading-relaxed` | default | `text-muted-foreground` for prose |
| Kicker | mono `text-[12px]`, `uppercase` | `0.14em` | Labels diagrams only, max two per region |
| Mini kicker | mono `text-[11px]`, `uppercase` | `0.14em` | Cell-level labels inside diagram panels (11px is the legibility floor) |
| Mono data | mono `text-[13px]` | default | Terminal lines, cmd rows |
| Flow label | mono `text-[11px]` | `0.01em` | `.flow-label`, masks the line it interrupts |

Headings are always `font-semibold` with `text-balance`; body
paragraphs get `text-pretty`.

## 4. Shape

`--radius: 0.75rem` (12px) drives the whole scale through `@theme`:

| Derived token | Value | Used by |
| --- | --- | --- |
| `--radius-sm` | 8px | `.cmd` rows (via `calc(--radius - 4px)`) |
| `--radius-md` | 10px | Buttons, `.icon-btn` (via `calc(--radius - 2px)`) |
| `--radius-lg` | 12px | `rounded-lg`, cards |
| `--radius-xl` | 16px | `rounded-xl` panels |
| pill | `9999px` | `.chip`, verdict chips, the `.flow-dot` |

Cards and images are `rounded-lg` or `rounded-xl` (12 or 16px),
buttons 10px, chips full pill. Elevation is `shadow-sm` only; the
palette carries depth, shadows do not.

## 5. Spacing and layout

| Convention | Value |
| --- | --- |
| Container | `max-w-[1200px]`, `px-5 md:px-8` |
| Section rhythm | `py-20 md:py-28` |
| Grid gutters | `gap-12`, `lg:gap-8` on 12-column grids |
| Anchor offset | `scroll-mt-24` on every `aria-labelledby` section (clears the sticky nav) |
| Page frame | `min-h-svh flex flex-col`, footer pushed naturally |
| Touch targets | 44px minimum (`.btn`, `.icon-btn` are `h-11`; the how-it-works stage badges stay 24px visually and reach 44px through an `after:-inset-2.5` hit-slop — no visible geometry change) |
| Mobile nav | Persistent `Install` text link (mono 13px, `h-11`, `md:hidden`) beside the icons, so the primary action is one tap away without opening the burger |

## 6. Z-index scale

Three rungs, nothing else:

| Value | Owner |
| --- | --- |
| 40 | Sticky nav |
| 50 | Overlays (mobile menu, skip link) |
| 60 | Toasts |

The traveling `.flow-dot` uses `z-index: 1`, scoped inside its
diagram, and never collides with page chrome.

## 7. Motion

### Tokens

| Token | Value |
| --- | --- |
| `--ease-out-strong` | `cubic-bezier(0.23, 1, 0.32, 1)` |
| `--ease-swing` | `cubic-bezier(0.77, 0, 0.175, 1)` |

`ease-in` and `transition: all` are banned. Component transitions use
`150ms var(--ease-out-strong)`.

### Durations in play

| Duration | Owner |
| --- | --- |
| 150ms | Button and icon-button transitions |
| 300ms | `animate-in fade-in` row entrances (init tree) |
| 300ms (staggered 70ms) | Hero entrance (`.enter`, CSS keyframe on first paint) |
| 400ms | Scroll reveals (`Reveal`, IntersectionObserver release) |
| 1.4s + 0.25s delay | `.flow-dot` edge travel |
| 9s / 24s linear, infinite | `spin-continuous` rotations (loop badges / verdict ring) |
| 2200ms | `STAGE_MS` stage advance (use-loop-stage.ts) |
| 6000ms | `RESUME_MS` pinned-stage resume |

### Non-negotiable guards

- Every timer sits behind `useVisibilityGate()`: nothing ticks
  offscreen or in a hidden tab.
- Every continuous animation is CSS on compositor-only properties:
  the `.flow-dot` wrapper translates with `transform` (the span is a
  `calc(100% - 8px)` invisible wrapper; the dot is its `::after`, so
  translating 100% reproduces the old `left: calc(100% - 8px)`
  endpoint without animating layout), and the `spin-continuous`
  keyframes rotate the loop badges and the verdict ring. No JS-driven
  animation remains: framer-motion was removed from the dependency
  tree in the optimize pass.
- `prefers-reduced-motion`: the `.flow-dot` is `display: none`,
  keyframe classes get `motion-reduce:animate-none`, scroll behavior
  goes `auto`, diagrams render their completed static state, pinning
  still works (color flips only). The reduced-motion flag in JS
  (use-reduced-motion.ts, a 1:1 matchMedia replacement for framer's
  `useReducedMotion`) only stops replay state machines from starting.
- No-JS parity: the bootstrap script in `layout.tsx` adds `html.js`
  before first paint; every initial-hidden style (`.enter`,
  `[data-reveal]`) is scoped under it. Without JS the page renders
  fully visible, proof panels included.
- Proof panels server-render their completed state (terminal
  transcript, scaffold tree, sensor verdict). With JS they rewind and
  play exactly once, then hold. Only the hero loop cycles.
- Scroll reveals (`Reveal` in reveal.tsx) release once, 80px inside
  the viewport, via IntersectionObserver; content is
  opacity-animated, never conditionally rendered.
- Animated transcript heights are reserved up front so nothing jumps.

## 8. Component classes

Defined in `globals.css` under `@layer components`:

| Class | Spec |
| --- | --- |
| `.btn` | `h-11`, `px-5`, radius 10px, `text-[15px] font-medium`, gap 0.5rem, `scale(0.97)` on press |
| `.btn-primary` | ink fill, paper text; hover mixes 86% primary with background (hover-capable pointers only) |
| `.btn-secondary` | paper fill, hairline border; hover: muted fill, border darkened 26% toward foreground |
| `.icon-btn` | 44px square, radius 10px, muted hover wash |
| `.chip` | 28px pill, hairline border, mono 12px |
| `.chip-tinted` | signal-tint fill, signal-ink text, no border |
| `.cmd` | mono 13px command row, muted fill, hairline border, radius 8px |
| `.flow-line` / `.flow-arrow` | diagram connectors at 34% muted-foreground |
| `.flow-label` | mono 11px label on background, masks the line it interrupts |
| `.flow-signal` | modifier: the loop-back edge renders in signal colors |
| `.flow-dot-*` | 7px signal dot with a 3px background halo, travels an edge once per activation; the span is an invisible transform-animated wrapper, the dot is `::after` |
| `.spin-continuous-9` / `-24` | linear infinite `rotate(360deg)`; badge gated on `stage >= 0`, verdict ring always on; both `motion-reduce:animate-none` |

Hover transforms exist only behind `@media (hover: hover) and
(pointer: fine)`.

Interaction feedback beyond the classes:

- **CopyButton** holds three states — `Copy`, `Copied` (1.6s), and `Copy
  failed` (4s). The failed state selects the row's `[data-copy-text]`
  content so a clipboard-blocked user can finish with Ctrl-C / Cmd-C, and
  announces that fallback through the same polite live region.
- **Install trust row** carries `fetched HH:MM UTC` in its kicker — the
  moment the server hashed the piped bytes. On fetch failure it renders an
  explicit `sha256 unavailable` line pointing at `shasum -a 256`, never a
  stale or invented hash.

## 9. Base layer

- `*` gets `border-border`, so hairlines theme automatically.
- `:focus-visible`: 2px `--signal` outline, 2px offset.
- `::selection`: signal-tint background, foreground text.
- `html` scrolls smooth; under reduced motion it switches to `auto`.

## 10. Dark theme parity

Every visual change is verified in both themes before it ships; a
token edit that only looks right in light is not done. `layout.tsx`
declares `themeColor` per scheme: `#f8f9f5` light, `#151b16` dark
(approximations of the two backgrounds). `scripts/og.html` hardcodes
the exact light-theme OKLCH values, so the social card stays on-palette.

## 11. Extending the tokens

1. Add the raw property to `:root` **and** `.dark` in globals.css.
   A token missing a dark value ships broken.
2. Register it in `@theme inline` if it needs a Tailwind utility
   (`--color-x` for `bg-x`/`text-x`).
3. Use it; never inline a hex or raw `oklch()` in a component.
4. Update this document and the token table in
   `.agents/skills/site-design/SKILL.md` in the same commit.
5. If the token encodes a semantic (success, failure), say so in its
   comment; semantics outlive implementations.
