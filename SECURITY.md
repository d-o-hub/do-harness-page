# Security Policy

## Scope

This repository is the marketing/landing site for
[d-o-hub/do-harness](https://github.com/d-o-hub/do-harness). It is a static
export published to GitHub Pages: no server-side state, no user input, no
database.

## Reporting a Vulnerability

Report issues with this site privately via GitHub's
[Security Advisories](https://github.com/d-o-hub/do-harness/security/advisories/new)
("Report a vulnerability" button) on the upstream do-harness repository, not
public issues. The same channel, SLA, and severity rubric defined in
[do-harness's Security Policy](https://github.com/d-o-hub/do-harness/blob/main/SECURITY.md)
apply here.

## What matters for a static site

- Content-injection vectors in rendered copy or fetched build-time data
  (GitHub stars, release tags).
- Supply-chain issues in build dependencies or pinned GitHub Actions.
- Metadata misuse (og:image URLs, sitemap/robots pointing at the wrong
  origin).
