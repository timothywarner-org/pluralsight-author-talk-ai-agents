<!--
Thanks for opening a PR.

This template applies to humans AND AI agents. If you're @copilot, the
quality bar in .github/copilot-instructions.md governs your work — read
it before filling this out.
-->

## What changed

<!-- One paragraph. What did this PR change from the user's point of view? -->

## Why

<!-- One paragraph. What problem does this solve? Link the issue. -->

Closes #

## How to test

<!--
Step-by-step instructions a reviewer can follow on their machine.
For UI changes, include screenshots or a short clip below.
-->

1. ``cd app && npm run dev``
2.
3.

## Screenshots

<!-- For UI changes. Delete this section otherwise. -->

## Checklist

- [ ] Linked to an issue with `Closes #N`.
- [ ] Followed the conventions in `.github/copilot-instructions.md`.
- [ ] Added or updated Playwright specs in `tests/`.
- [ ] Used `data-testid` selectors only.
- [ ] `npm test` from `app/` passes locally.
- [ ] No new dependencies (or, if added, discussed in the issue first).
- [ ] No `.only`, `.skip`, or commented-out tests.
- [ ] Conventional Commit message (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`).
- [ ] PR is **one logical change**. Refactors and features are separate PRs.

## For reviewers

- Request **`copilot-pull-request-reviewer`** as a reviewer if not already attached.
- Look first at the diff against `.github/copilot-instructions.md` (sections 3, 4, 5). Anything that violates those is a blocker.
