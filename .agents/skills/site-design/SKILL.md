# Skill: site-design

Design system, copy rules, and brand-asset regeneration for the
do-harness landing page. Use when adding or editing any section,
writing copy, touching tokens, or regenerating the social card.

## Theme: "instrument report"

Light-first engineering-instrument language: off-white paper, ink
text, one signal green tied to the product's verdict colors. All
colors are OKLCH CSS variables defined in `src/app/globals.css`
(`:root` light, `.dark` dark). Never hardcode a hex — use tokens.

**The complete token reference lives in `DESIGN.md`** (repo root):
full light+dark color tables, typography scale with measured usage,
shape, spacing, z-index, motion, and the extension checklist. Read
it before touching any visual change; the table below is the
fast-moving subset.

### Token inventory

| Token | Light | Role |
| --- | --- | --- |
| `--background` | 0.982 0.004 130 | Page paper |
| `--foreground` | 0.225 0.012 155 | Ink |
| `--card` | 0.992 0.003 130 | Card surface |
| `--muted` / `--muted-foreground` | 0.958 / 0.43 | Quiet fills / secondary text |
| `--border` | 0.905 0.01 145 | Hairlines |
| `--signal` | 0.53 0.115 152 | The one accent — product verdict GREEN |
| `--signal-ink` | 0.4 0.095 152 | Signal-colored text |
| `--signal-tint` | 0.952 0.024 152 | Signal washes, chips, active edges |
| `--destructive` | 0.577 0.245 27 | Failure states only (RED, ✗, halt) |

- `--signal` is **semantic**: it is the color of `exit 0 · GREEN`.
  Never use it decoratively (no green buttons-for-contrast, no green
  links). `--destructive` appears only for failure.
- Shape lock: cards/images `--radius` (12px), buttons 10px, chips
  full-pill. Z-index scale 40 (nav) / 50 (overlay) / 60 (toast).
- Fonts: Space Grotesk (`--font-sans`) for display + body,
  JetBrains Mono (`--font-mono`) for all data, commands, verdicts,
  kickers. Both load via `next/font` in `layout.tsx`.
- Motion tokens: `--ease-out-strong` cubic-bezier(0.23,1,0.32,1),
  `--ease-swing`. Easing is never `ease-in`.

## Copy rules

- No em dashes (U+2014) or en dashes (U+2013) anywhere. Use commas,
  colons, or split the sentence.
- No buzzwords: seamless, robust, leverage, elevate, unlock,
  streamline, empower, supercharge, "game-changing", "cutting-edge".
- Buttons: verb + object ("Run the verification pass", not "Learn
  more").
- Every sentence makes a checkable claim, sourced from the
  do-harness README. If it can't be checked, cut it. Concrete over
  abstract: `exit 0 · GREEN` beats "reliable outcomes".
- Kickers (mono, uppercase, tracked) exist to label diagrams — at
  most two per page region.

## Regenerating the OG image

`public/og.png` (1200×630) is rendered from `scripts/og.html`, which
hardcodes the light-theme token values and pulls Space Grotesk /
JetBrains Mono from Google Fonts.

1. Edit `scripts/og.html` (headline, subline, loop stages, chips).
   Layout is fixed: top wordmark row, 88px headline, mono subline,
   bottom stage row + verdict chips.
2. Render:
   ```sh
   agent-browser set viewport 1200 630
   agent-browser open "$(pwd)/scripts/og.html"
   agent-browser screenshot "$(pwd)/public/og.png"
   ```
3. Verify: PNG is exactly 1200×630 (`file public/og.png`), no wrapped
   chips (all chips are `white-space: nowrap` for a reason), text
   legible at ~600px wide.
4. Keep the file under ~150 KB.

`layout.tsx` carries the matching `og:image:alt`; update it in the
same change if the image's story changes.
