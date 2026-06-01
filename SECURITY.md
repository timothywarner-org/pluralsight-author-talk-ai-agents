# Security Policy

This is a public demo repository for a Pluralsight Author Talk. It intentionally contains a deliberate-but-clearly-labeled planted bug in PR #5 so the GitHub Copilot PR Reviewer has something to find on stage. Apart from that, please report any real vulnerability you find.

## Reporting a vulnerability

- **Preferred:** open a **private security advisory** under the Security tab. GitHub will route it to the maintainer without disclosing details publicly.
- **Fallback:** email `tim-warner@pluralsight.com` with the subject line `SECURITY: <repo name>`.

Please do **not** open a public issue for a real vulnerability.

## What's enabled on this repo

| Control | Purpose |
|---|---|
| **CodeQL code scanning** | Static analysis on every push, PR, and weekly schedule. See `.github/workflows/codeql.yml`. |
| **Secret scanning** | GitHub-native pattern detection for credentials, tokens, API keys. Enabled by default on public repos. |
| **Push protection** | Blocks pushes that contain detected secrets. Enabled at the repo level. |
| **Dependabot version updates** | Weekly PRs for npm and GitHub Actions dependencies. See `.github/dependabot.yml`. |
| **Dependabot security updates** | Auto-PRs for known-vulnerable dependencies. Enabled at the repo level. |
| **Branch protection on `main`** | (Recommended — configure per org policy.) Require status checks + at least one review before merge. |

## The planted bug — for talk demos only

PR #5 (`feat: add newsletter CTA on confirmation page`) intentionally violates several rules in `.github/copilot-instructions.md` so that the GitHub Copilot PR Reviewer has something to find live on stage. The violations include:

- A hardcoded fake API key (`pk_live_abc123`) — picked because it matches the Stripe publishable-key pattern that GitHub secret scanning recognizes.
- User-supplied data rendered via `innerHTML` (XSS surface).
- `target="_blank"` without `rel="noopener noreferrer"`.
- A button missing `aria-label` and `data-testid`.
- A new `request` dependency added without approval.

That PR will be closed without merge after the talk.
