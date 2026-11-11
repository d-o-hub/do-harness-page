---
target: the homepage
total_score: 28
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:/home/z/my-project/src/app/page.tsx"
target_fingerprint: "sha256:c396a44c9d775c063fbbc0921e0a687f26ecf5fefb425d13eb521406dd17fc42"
target_path: /home/z/my-project/src/app/page.tsx
timestamp: 2026-11-11T16-39-27Z
slug: src-app-page-tsx
---
# Critique — do-harness landing page (/)

Method: dual-agent (A: agent-45f9d87e · B: agent-d4a0dba5)

## Design Health Score
28/32 (Good, 87.5%) — n/a: #7 Flexibility/Efficiency (one-visit persuade page), #10 Help/Documentation (docs deferred to repo quickstarts).
| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of System Status | 4 | Live captions, running→pass, copied feedback |
| 2 | Match System / Real World | 4 | Exit codes, hooks, CI vocabulary native |
| 3 | User Control and Freedom | 3 | Terminal/sensor cycles unpausable; loop pinnable |
| 4 | Consistency and Standards | 3 | Exit 2 named four ways across the page |
| 5 | Error Prevention | 4 | Checksum caveat, honest VACUOUS, --force guard |
| 6 | Recognition Rather Than Recall | 3 | Init tree wipes rows mid-read on replay |
| 7 | Flexibility and Efficiency | n/a | One-visit persuade page |
| 8 | Aesthetic and Minimalist Design | 4 | Disciplined tokens; reserved-height void noted |
| 9 | Error Recovery | 3 | Excellent 404; no on-page errors exist |
| 10 | Help and Documentation | n/a | Docs deferred to repo quickstarts |

## Design Specificity Verdict
Authored for do-harness, not a template: exit-code contract as dl rows/chips/terminal verdicts, loop-back edge as the only green connector, aria-labels carrying README-faithful facts, 404 as exit 1, "a check that cannot fail proves nothing". Weakest specificity: generic simple-icons trust bar, GitHub icon ×4.
Deterministic scan: source clean (exit 0); desktop 1440×900 = 16 warnings + 5 advisories; mobile 390×844 = 13 warnings + 5 advisories; all findings render-time. Overlay injection succeeded in-page (console: 6 anti-pattern buckets); no user-visible tab exists in this environment. FPs: em-dash-overuse (counts CLI flags; 0 real em-dashes), tiny-text on 11px terminal window chrome (code context), overused-font Space Grotesk (deliberate brand choice).

## Overall Impression
Unusually honest for its category; reads instantly. Biggest opportunity: the page undercuts its own thesis in two places — proof panels are vacuous until JS hydrates, and trust dips exactly at the conversion step (install command clips, copy button hides past horizontal scroll).

## What's Working
1. Verdict-color discipline (green = verdicts only, red = failure only).
2. Diagrams as product truth: real commands, pinnable stages, reserved heights, genuine a11y guards.
3. Voice: candor calibrated to a DevEx buyer; nothing fabricated.

## Priority Issues
1. [P1] Shell install row loses its Copy button (button past initial scroll; cargo line clipped on mobile; no hash shown, no link to install.sh). Fix: pin Copy outside the scrollable span, shorten display URL, link the script. → $impeccable polish
2. [P1] Proof panels hollow without JS (RedTerminal 1 line in 312px box; InitTree 0 of 6 rows; SensorCell "running"; Reveal opacity:0 blanks sections until hydration). Fix: server-render completed states, animate via opacity/clip. → $impeccable harden
3. [P2] Exit 2 has four names; dl numeral "1" painted text-signal-ink (pass color). Fix: standardize 0 GREEN / 1 RED / 2 VACUOUS; numeral 1 destructive or neutral. → $impeccable clarify
4. [P2] InitTree replays forever under a "one-time" chip; three concurrent tickers in one viewport. Fix: play once and hold; RESUME_MS for replay-on-demand. → $impeccable animate
5. [P3] Micro-typography: 10px functional labels (undersized-ui-text ×10, detector floor 11px); inconsistent command-row wrap behavior. Fix: 11px mini-kickers; one wrap behavior via overflow-wrap anywhere. → $impeccable typeset

## Persona Red Flags
- Jordan (skeptical senior engineer): curl | sh with no script link or checksum; exit-2 drift; --version 0.3.0 pin vs floating npx — no canonical install.
- Riley (stress tester): JS-off/slow-3G voids; Reveal opacity:0 until hydration; 200% zoom forces invisible horizontal scrolls in .cmd rows. Dark-flip clean.
- Casey (mobile, one thumb): Copy button off-screen; clipped cargo line; hero CTAs inconsistent widths; 44px targets hold.

## Minor Observations
Theme-toggle aria-label silent on resulting theme; nav links float between logo and icons; compliance band tint nearly invisible; 404 page is a gem.

## Questions to Consider
1. The exit-code table paints "1" in the pass color — what does that teach a buyer auditing verdict discipline?
2. The page sells proof but its proof panels are VACUOUS until JavaScript runs — would the harness pass the static page?
3. Would you paste curl | sh from a page that hides the URL behind horizontal scroll?

## Run Notes
Target slug: src-app-page-tsx. Ignore list: none (first run). Assessment independence: dual isolated sub-agents. CLI detector: source exit 0; desktop exit 2 (16w/5a); mobile exit 2 (13w/5a); engine binary present. Browser: puppeteer Chrome 156.0.8078.47 via IMPECCABLE_BROWSER (URL scans) + agent-browser 0.42.0 (overlay). Overlay injection: mutation preflight passed, detect.js injected, console captured (5 of 6 lines; rg filter dropped one). Live-server: started :8401, stopped with --keep-inject; layout.tsx mtime unchanged, no injection remnants. Site server :3102 killed in-call via trap. Temp files: /tmp/critique-b/*.json kept for polish reference. Screenshots: /tmp/critique-a/ (hero-viewport, desktop-light, desktop-dark, mobile-light).
