---
target: the homepage
total_score: 31
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 1
target_identity: "file:/home/z/my-project/src/app/page.tsx"
target_fingerprint: "sha256:c1ee8bd43c203014538a52bcc891440a12199f2a6bd2980037bad0d51c2f23f7"
target_path: /home/z/my-project/src/app/page.tsx
timestamp: 2026-11-15T18-09-53Z
slug: src-app-page-tsx
---
# Design Critique — do-harness landing page (src/app/page.tsx)

## Design Specificity Verdict

Strongly authored for this product, not category-interchangeable. The visual grammar is built out of the product's own contract: green exists only where a verdict exists (exit chips, sensor checks, loop-back edge, focus ring), the primary button is deliberately ink, RED is reserved for the terminal replay, and the diagrams are DOM+CSS command rows instead of stock screenshots. The RED-to-GREEN terminal replay ("a failing run is data") is a composition decision only a verification harness could make honestly. Weakest specificity point: the Bento grid ("What init scaffolds") is the one section that could be lifted into any devtool site unchanged.

**Deterministic scan**: source scan clean (exit 0). Rendered scans at 1440x900 and 390x844 each report 6 findings, and every one matches the project's documented intentional set: tiny-text x2 (11px code-context chrome, DESIGN.md's stated floor), pulsing-dot x2 (aria-hidden live indicators with motion-reduce guards), overused-font (Space Grotesk is the declared brand face), em-dash-overuse (false positive — the 14 hits are `--record`/`--strict` CLI flags, the SSR text contains zero real em-dashes). Net new detector findings: 0. The detector cannot see the interaction-feedback and reachability gaps below — the LLM review caught those. Browser overlay injection succeeded (mutation verified, console groups read); CLI detect-on-URL scans stand as authoritative evidence.

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Live caption bound to active stage; pin states via aria-pressed; verified live |
| 2 | Match System / Real World | 4 | Real commands, real exit codes, checkable claims; VACUOUS defined, not hand-waved |
| 3 | User Control and Freedom | 3 | Pin/resume (6s) good; loops can't be permanently stopped; no pause affordance |
| 4 | Consistency and Standards | 4 | Token/shape/z discipline across both themes; one 24px chip deviation ("one-time") |
| 5 | Error Prevention | 4 | sha256 + "Read install.sh", pinned source install, --force warning, honest Windows path |
| 6 | Recognition Rather Than Recall | 3 | Stage labels persist, but 15+ named artifacts must be recalled at point of use |
| 7 | Flexibility and Efficiency | n/a | Single-visit marketing page; no repeated expert task to accelerate |
| 8 | Aesthetic and Minimalist Design | 3.5 | Color/shape minimalism excellent; information volume at the ceiling (31 elements at 11px, 7-cell bento) |
| 9 | Error Recognition & Recovery | 2.5 | CopyButton fails silently (clipboard blocked -> no feedback, no fallback) — the only reachable error state is invisible |
| 10 | Help and Documentation | 3 | Docs links woven into flow; nothing says what to do when init/verify fails |
| **Total** | | **31/36** | **Good (86%)** |

## Overall Impression

This is the strongest state the page has been in: composition, trust architecture, and the motion story hold together with no detector-visible defects left. The remaining issues are not visual — they are interaction feedback (copy failure, degraded checksum) and reachability (24px targets, no mobile install entry). One batch of harden work plus one layout decision would close everything above P2.

## What's Working

1. **Verdict-semantic color system without leaks** — canvas-sampled probes confirm green appears only on verdict surfaces and the ink button holds in both themes; the design language literally is the product's claim.
2. **The RED terminal replay** — server-renders the completed transcript (no-JS parity), height reserved (zero CLS), rewinds once, holds GREEN with a blinking cursor; aria pattern correct (role="img" + prose parity). Failure-as-evidence with real craft.
3. **Install trust architecture** — four methods with honest constraints ("Node 18 and up", "npm cannot carry the win32 package name"), sha256 with copy button, "Read install.sh before running it", MIT/built-in-the-open ending. The evidence discipline is enforced in the copy; zero buzzwords found.

## Priority Issues

1. **[P1] 24x24 "Pin stage" number badges are the only touch/keyboard way to pin a diagram stage.** Verified: `size-6` button at how-it-works.tsx:194 — the repo's own rule is 44px touch targets, and 24px buttons are not the documented inline-text exception. Keyboard users must hit a 24px target; mobile users will mis-tap. Fix: keep the 24px visual, expand the hit area to >=44px with padding or an ::after hit-slop. Suggested command: $impeccable harden.
2. **[P2] CopyButton fails silently when the clipboard is blocked.** Verified: `const ok = await copyText(command); if (!ok) return` — the textarea fallback exists inside copyText, but when both paths fail (Safari private mode, hardened browsers) the user gets zero feedback and no manual-select guidance, on a page whose entire conversion is copy-paste. Fix: on failure, select the row text and show a "press Ctrl-C" state, or an inline error chip. Suggested command: $impeccable harden.
3. **[P2] No persistent install entry on mobile.** The sticky nav (burger / GitHub / theme) carries no Install link; the primary action lives at ~y386 and the CTA command row ~10,000px down a 12.7-screen page. A distracted scroller has no thumb-reachable route back to install. Fix: compact "Install" text link in the mobile header, or a bottom sticky bar after the hero. Suggested command: $impeccable layout.
4. **[P2] The degraded checksum state is silent.** When the server fetch fails, getInstallScriptChecksum returns null and the sha256 row vanishes with no explanation — the supply-chain promise is stated but unproven at the exact moment it matters. Fix: render an explicit degraded line ("checksum unavailable right now — verify with shasum -a 256 after download"). Suggested command: $impeccable harden.
5. **[P3] Working-memory load in the Bento grid.** 7 chunks in one grid (above the <=4 ideal) with 11px mono sublabels and artifact names (audit-chain, error signatures, DORA metrics) that are never re-glossed at point of use. Fix: merge cells to 4-5 and rewrite bodies to reuse terms defined in thesis/how. Suggested command: $impeccable distill.

## Persona Red Flags

**Jordan (first-timer)**: the first sentence packs "feedforward guides" + "feedback sensors", both undefined until thesis — two abstractions before any payoff. The pin affordance on the hero loop is undiscoverable (native title tooltip only; nothing on touch). Bento copy ("audit-chain recomputes the hash chain") has no first-timer gloss. Copy confirmation itself is good ("Copied" + live region).

**Riley (stress tester)**: the sha256 is a page-load snapshot (1h revalidate) of a main-branch script while `curl | sh` fetches live bytes — within a revalidate window the printed hash can lag the piped bytes, and the row presents it without an "as of" nuance. Version 0.3.0 appears only in the Source method with no currency anchor. Otherwise copy and UI promises check out consistently across thesis/how/install/CI; refresh mid-flow replays cleanly.

**Casey (distracted mobile)**: 24px pin badges (mis-taps); nothing sticky re-offers install after the hero; page is 12.7 screens at 390x844 and the last full screen before page end is footer-only. Slow-connection story is genuinely strong: zero images, SSR proofs, zero horizontal overflow at 390/768.

## Minor Observations

- Dark themeColor declares #151b16 (rgb 21,27,22) but the page renders oklch(0.168 0.01 155) ~ rgb(13,18,15) — browser chrome tint is visibly lighter than the page in dark mode.
- "one-time" chip is 24px; every other chip is 28px.
- Brand link href="#top" with no id="top" in the DOM — works only via the spec's fragment fallback; fragile.
- The "Exit codes" card (thesis) has no anchor — the product's core contract is not deep-linkable.
- 31 elements at 11px is DESIGN.md-sanctioned but heavy; uppercase + 0.14em tracking at 11px is at the edge.
- CTA primary button is "Read the adoption guide" (external) while the command sits in a .cmd row — arguably correct, but it inverts weight against "the CLI is the interface."

## Questions to Consider

- VACUOUS is the one claim competitors can't copy — so why is it the quietest verdict on the page (gray row, one CI sentence)?
- Two animated loops teach the same four stages with different grammars ~1,400px apart. If one diagram could pin-expand its stage's artifacts, would the how section shrink and teach more?
- Does the ink-button-first hierarchy at the CTA quietly contradict "the CLI is the interface"? Should the command row be the primary object?
