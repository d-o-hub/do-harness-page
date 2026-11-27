# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary (confirmed): DevEx and platform teams gating AI-generated code across
repositories in CI. They adopt do-harness where agents write code and a merge
depends on proof, not a chat claim.

Secondary (implied by the CTA wording and adoption quickstarts, not separately
confirmed): individual developers running coding agents locally who want the
same verdict before pushing.

## Product Purpose

do-harness is a compiled agent-execution harness CLI. Feedforward guides shape
what the agent writes; feedback sensors verify what shipped. One command
(`init`) scaffolds the contract, the skills, the sensors, and the workspace;
agents and CI pass the same checks before code ships. Success is a workspace
that answers "done?" with an exit code: GREEN, RED, or VACUOUS.

## Positioning

The compiled verdict: a single static binary plus an exit-code contract
(0 pass, 1 fail, 2 vacuous workspace). A config-file-based neighboring harness
cannot truthfully copy this without re-architecting. VACUOUS is part of the
claim, not a footnote: a check that cannot fail reports VACUOUS rather than
green.

## Operating Context

- Coding agents (Claude Code, Codex, and similar) write code in a workspace;
  the harness wraps that loop.
- CI runs the same gates: the fast set on commit, the full suite on push.
- The repo dogfoods its own green path — CI runs `init` and the sensors on
  itself (see the compliance section copy, sourced from the repo).
- Per-ecosystem adoption lives in `docs/adoption.md` quickstarts upstream.

## Capabilities and Constraints

- Compiled CLI; prebuilt binaries for Linux, macOS, and Windows.
- Exit-code contract: 0 = pass, 1 = fail, 2 = vacuous workspace.
- `init` scaffolds contract, skills, sensors, and workspace in one command.
- Web-pack sensors: axe accessibility, console noise, performance.
- One command prints the mapping to OWASP Agentic Top 10 (2026), NIST AI RMF
  1.0, the EU AI Act, and SOC 2.
- This repository is the landing page only (Next.js 16, bun, standalone
  build). It must not make runtime claims beyond what the upstream CLI does.

## Brand Commitments

- Name: do-harness (GitHub org: d-o-hub).
- Incumbent theme "instrument report" (documented in DESIGN.md): instrument
  panel aesthetic, verdict colors are strictly semantic.
- Voice: plain declaratives; mono type for anything executable; no
  exclamation-mark marketing; every claim checkable against the repo.

## Evidence on Hand

- Public repo: https://github.com/d-o-hub/do-harness (star count and latest
  release tag fetched live by the page, 1h revalidate; a scheduled
  upstream-release workflow redeploys when the published page lags the newest
  tag).
- Dogfooded CI on the repo itself.
- Compliance mappings and adoption quickstarts as upstream repo docs.

Absences future work must not fabricate (confirmed): no testimonials, no
customer logos or counts, no benchmark numbers, no adoption metrics. The logo
strip lists compatible tooling, not customers.

## Product Principles

1. Proof over claims: every statement the page makes must be checkable in the
   upstream repo.
2. Verdict integrity: green means the checks passed and nothing else; failure
   is the only red.
3. The CLI is the interface: copy defers to exit codes, command output, and
   file trees as the source of truth.
4. Respect the operator: CI-first workflows, honest empty states, install
   paths a reader can verify on their own machine.

## Accessibility & Inclusion

Landing page: skip link, token-driven focus ring, `prefers-reduced-motion`
guards on every animation loop, semantic landmarks. Product: the web pack
ships axe accessibility as a sensor, so gated workspaces are checked for a11y
regressions by the harness itself.
