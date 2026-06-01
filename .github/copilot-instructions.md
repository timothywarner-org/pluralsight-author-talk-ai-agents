# Copilot Instructions — AI Skill Path Picker

> **These instructions govern every contribution Copilot (Coding Agent or PR Reviewer) makes to this repository.** They are the team's quality bar. They were written once and apply forever, until edited here.

This file is read by:

- **GitHub Copilot Coding Agent** when an issue is assigned to `@copilot` and Copilot opens a draft PR.
- **GitHub Copilot Code Review** when Copilot is requested as a reviewer on any PR.
- Claude Code's `.claude/agents/*` subagents (they reference this file in their role contracts).

If a guideline below conflicts with the issue description, ask for clarification rather than guessing.

---

## 1. Project context

This is a static, dependency-free demo web app called the **AI Skill Path Picker**. It was built as the demo surface for the Pluralsight Author Talk on M365 Copilot, Claude Code, and GitHub Copilot. It has three pages:

- `app/public/index.html` — list of learning paths
- `app/public/enroll.html` — enrollment form
- `app/public/confirm.html` — confirmation page

Shared scripts live under `app/public/scripts/`. Styles live under `app/public/styles/`. Tests live under `tests/` and are written with `@playwright/test`.

**There is no backend.** Enrollment data is stored in `sessionStorage` for the lifetime of the browser tab. Do not add network calls, third-party telemetry, or analytics SDKs.

## 2. Code style

- **Vanilla JavaScript only.** No frameworks, no transpilers, no bundlers. If a change appears to require React, Vue, or a build step, stop and open a discussion in the issue first.
- **Two-space indentation. Single quotes for JS strings. Double quotes for HTML attributes.** Match the existing style of the file you are editing.
- **Functions before usage.** Hoist with `function` declarations rather than `const fn = () => {}` at module top level.
- **No `var`.** Use `const` by default, `let` only when reassignment is required.
- **JSDoc on any exported function** that is reachable from another file.
- **Comments explain `why`, not `what`.** The code already shows what.

## 3. Accessibility — non-negotiable

- Every interactive element (`<button>`, `<a>` styled as a button, custom controls) has a meaningful **`aria-label`** when its visible text is not self-explanatory.
- Form inputs always have a `<label>` with a `for` attribute matching the input `id`.
- Color is **never** the only signal. Error states use icon + text. Success states use icon + text.
- Keyboard navigation works on every interactive element. Tab order is logical. `:focus` styles are visible.
- Test pages with `npx --yes @axe-core/cli` before opening the PR if accessibility was touched.

## 4. Security

- **Never hardcode secrets, tokens, API keys, or URLs containing credentials.** Reject any such code in review.
- All user-supplied strings rendered to the DOM go through `textContent`, never `innerHTML`. The only exception is the confirmation page rendering message which is currently using `innerHTML` for the empty-state — flag this in any review.
- `sessionStorage` is acceptable for non-sensitive UI state only. Never store PII, tokens, or credentials there.
- Use `rel="noopener noreferrer"` on any external link with `target="_blank"`.
- Validate every input on the client (the server doesn't exist, so client-side is the only line).

## 5. Testing — every PR must pass

- Every new feature lands with at least one Playwright spec in `tests/`.
- Specs use `data-testid="..."` selectors. Never select by CSS class or text content — those are too brittle.
- Page Object Models live under `tests/pages/` when a flow touches more than one page.
- Run `npm test` from `app/` before opening the PR. Paste the passing summary into the PR description.
- Do not skip or `.only` any test. Reviewer will reject PRs that ship `.only`.

## 6. Commit and PR hygiene

- Commit messages follow Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
- One logical change per PR. Mixed-concern PRs (e.g., a feature + a refactor) get split before merge.
- PR description includes: **what changed**, **why**, **how to test**, and **screenshots** if UI changed.
- Link the originating issue with `Closes #N`.
- Draft PRs are fine. Mark ready for review only when CI is green.

## 7. What Copilot Coding Agent should NOT do without asking

- Add a new dependency (anything beyond `@playwright/test` requires a discussion).
- Change the build/dev command in `package.json`.
- Modify `.github/workflows/*`.
- Modify this file (`copilot-instructions.md`).
- Touch `.claude/agents/*` or `.claude/skills/*` — those are governed separately.

---

*Last updated by the human maintainer. If you (an AI agent) believe a guideline here is wrong, leave a comment in your PR rather than silently violating it.*
