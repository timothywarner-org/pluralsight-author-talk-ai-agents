# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is the companion repository for Tim Warner's Pluralsight Author Talk on **M365 Copilot, Claude Code, and GitHub Copilot**. It is not a product. It is a **demo surface**: a deliberately tiny app plus a set of agent definitions, prompts, and security traps that exist to be shown live on stage.

The talk has three beats, and most files map to one of them:

1. **The Agent Ladder** - M365 Copilot Chat to Copilot Studio (prompts only, no code here).
2. **The Headliner** - Claude Code subagents writing Playwright specs against this app (`.claude/`, `app/tests/`).
3. **The Fleet** - GitHub Copilot Coding Agent and PR Reviewer governed by one instructions file, plus the GitHub-native security trio (`.github/`, `demo/`).

Because it is a teaching artifact, **some things here are broken or vulnerable on purpose**. Read "Intentional landmines" below before you fix anything.

## Commands

All app and test commands run from the `app/` directory, not the repo root.

```bash
cd app
npm install                 # installs @playwright/test (the only real dependency)
npm run dev                 # serves app/public at http://localhost:3000 via `serve`
npm run test:install        # one-time: playwright install --with-deps chromium
npm test                    # runs `npx --yes playwright test` over every spec in app/tests/ (no separate dev server needed - Playwright's webServer config starts `npx --yes serve public -l 3000` itself)
```

Run a single spec (from `app/`):

```bash
npx playwright test tests/<flow>.spec.js --reporter=list
```

Specs live under **`app/tests/`** (the canonical location - `playwright.config.js` sets `testDir: './tests'`, which resolves relative to `app/`). The one real spec today is `app/tests/enrollment-flow.spec.js`. The repo-root `tests/` directory is vestigial (it holds only a `.gitkeep`); do not put specs there.

There is **no build step, no lint config, no bundler**. The app is vanilla HTML/CSS/JS served as static files. Do not add one without a discussion in the issue.

## Architecture

**The app (`app/public/`)** is three static pages wired together by `sessionStorage`, with no backend:

- `index.html` lists four learning paths (cards carry `data-path-id` and `data-testid`).
- `enroll.html` + `scripts/enroll.js` validate a form client-side and stash the result under the `authorTalkEnrollment` key in `sessionStorage`.
- `confirm.html` + `scripts/confirm.js` read that key back and render it.

The whole data flow is **path card → enroll form → sessionStorage → confirm page**. There is no network call anywhere. If a change appears to need one, stop - the app has no server by design.

**Not app code:** `agent.html`, `WHAT_IS_AN_AGENT.md`, and `images/agent.png` at the repo root are a standalone "What Is An Agent" full-viewport image showcase (conceptual talk content). They are **not part of `app/public/`** and the Playwright specs do not touch them.

**The agent fleet (`.claude/`)** is the heart of Beat 2 and the part most relevant to you as Claude Code:

- `.claude/agents/` defines three subagents - `test-writer`, `qa-reviewer`, `security-reviewer` - each a markdown file with YAML frontmatter declaring its `name`, `description`, `tools`, and `model`.
- The **handoff contract is real and load-bearing**: `test-writer` writes a spec and returns `SPEC WRITTEN / COVERAGE / HANDOFF TO: qa-reviewer`. It never runs the tests. `qa-reviewer` runs them and either approves or returns a structured critique. Respect this chain - don't have one agent do another's job.
- `.claude/skills/playwright-spec-generator/` is the procedure `test-writer` follows. It ships executable helpers (`scripts/scan-testids.mjs`, `scripts/new-spec.mjs`) and reference docs (`reference/*.md`). Use the scripts; don't hand-roll what they already do.
- `.claude/skills/parallel-spec-fleet/SKILL.md` is the `/parallel-spec-fleet` orchestration skill. It fans out `test-writer` across **N flows concurrently**, pipes each spec to `qa-reviewer`, and runs `security-reviewer` against the `confirm.js` `innerHTML` landmine in the same parallel wave. Its stage-handout reading copy lives at `prompts/parallel-spec-fleet.md`. Edit the **`.claude/` copy**, not the prompts copy.

**The quality bar (`.github/copilot-instructions.md`)** is the single source of truth for code style, accessibility, security, and testing. It governs human contributors, GitHub Copilot, AND the Claude subagents (they reference it in their role contracts). When in doubt about a convention, that file wins.

## The one rule the subagents enforce above all others

**Selectors are `data-testid` only.** Never CSS classes, never text content, never tag or `:nth-child` selectors. If a control you need to test has no `data-testid`, the correct move is to **add the attribute to the HTML**, not to fall back to a brittle selector. Run `node .claude/skills/playwright-spec-generator/scripts/scan-testids.mjs app/public` to inventory what exists. The `qa-reviewer` will reject a spec that breaks this.

## Intentional landmines (do NOT "fix" these)

This repo plants defects on purpose so the live demo has something to find. Touching them silently breaks the talk.

| Landmine | Where | Why it exists |
|---|---|---|
| **Known-vulnerable npm deps** | `app/package.json` `dependencies` block (lodash 4.17.11, axios 0.21.0, etc.) | Populates the Dependabot tab with real CVEs. **None are imported by the app.** The `_dependency_note` field documents this. Do not upgrade them or run `npm install` expecting them to be used. |
| **Planted CodeQL bug** | `demo/codeql-bait/` | Gives CodeQL code scanning a finding to surface on stage. |
| **Planted secrets** | `demo/secret-scanning-trap/` | Fake-but-realistic credentials that trip GitHub secret scanning. Every value is fake; none grant real access. |
| **Python secret trap** | `secret-scanning-test.py` (repo ROOT) | A second secret trap alongside `demo/secret-scanning-trap/`. A Python Anthropic Messages API console demo that hardcodes a fake (currently empty-string) Anthropic-style API key so GitHub Advanced Security secret scanning has a pattern to flag. Every value is fake. Do not "fix" it. |
| **`innerHTML` empty-state** | `app/public/scripts/confirm.js` (the empty-state render) | The single XSS-shaped smell the `security-reviewer` subagent and Copilot PR Reviewer are meant to catch. `copilot-instructions.md` section 4 calls it out explicitly. |

If you are asked to harden the repo for real, confirm first whether the target is a landmine. Fixing one is sometimes the *point* of a demo (e.g., showing remediation), but never do it silently.

## House style (from copilot-instructions.md, the parts you'll hit most)

- Vanilla JS, two-space indent, single quotes in JS, double quotes in HTML attributes.
- `function` declarations hoisted before use; no `var`; `const` by default.
- All user-supplied strings go to the DOM via `textContent`, never `innerHTML` (the confirm.js empty-state is the one flagged exception).
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`).
- A subagent must not touch `.github/`, `.claude/`, or `prompts/` - those are governed separately from app code.

## A note on the desktop.ini files

This repo lives on a Google Drive path on Windows. The `desktop.ini` files scattered around are Drive/Windows junk, gitignored, and safe to ignore. Don't read them, don't delete them, don't commit them.
