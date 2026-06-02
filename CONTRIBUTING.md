# Contributing

Thanks for your interest. This repo is the companion artifact for a Pluralsight Author Talk, so most contributions will come through one of three channels:

1. **AI agents** — `@copilot` (GitHub Copilot Coding Agent) and Claude Code subagents drive most changes here.
2. **Talk attendees** — fork the repo, try the prompts in `prompts/`, open issues with what you discover.
3. **Maintainers** — Tim Warner and any future co-maintainers.

Whichever channel you're in, the rules below apply.

## Before you contribute

1. **Read the quality bar.** [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) is the single source of truth for code style, accessibility, security, and testing expectations. It governs human and AI contributions equally.
2. **Pick an existing issue** or [open a new one](../../issues/new/choose). Issues labeled `copilot-ready` are safe to assign to `@copilot`.
3. **One logical change per PR.** Mixed-concern PRs get split before merge.
4. **Learning resources link only to Pluralsight courses and neutral primary sources** (vendor docs, official labs). Do not add links to competing training platforms in [`LEARNING_RESOURCES.md`](./LEARNING_RESOURCES.md).

## Local setup

```bash
git clone https://github.com/timothywarner-org/pluralsight-author-talk-ai-agents.git
cd pluralsight-author-talk-ai-agents/app
npm install
npm run dev          # http://localhost:3000
```

Tests:

```bash
npm run test:install # one-time: installs Chromium for Playwright
npm test
```

## Working on a change

### If you're a human

1. Branch from `main`. Branch names: `feat/<summary>`, `fix/<summary>`, `chore/<summary>`, `docs/<summary>`, `test/<summary>`.
2. Make the change.
3. Add or update Playwright specs in **`app/tests/`**. Use `data-testid` selectors only. See [`.claude/skills/playwright-spec-generator/reference/selector-rules.md`](./.claude/skills/playwright-spec-generator/reference/selector-rules.md).
4. Run `npm test` from `app/`. To run one spec, use `npx playwright test tests/<flow>.spec.js` from `app/`. Paste the passing summary into your PR description.
5. Open a PR using the template. Link the issue with `Closes #N`.

### If you're an AI agent

You operate under [`.github/copilot-instructions.md`](./.github/copilot-instructions.md). Specifically:

- Do not add a dependency without asking. The only approved dev dep is `@playwright/test`.
- Do not modify `.github/workflows/*`, `.claude/agents/*`, `.claude/skills/*`, or this file without explicit human approval.
- Every PR you open must include or update a Playwright spec for the change.
- The `playwright-spec-generator` Skill is the procedure for writing one spec. To cover several flows in a single pass, the **`parallel-spec-fleet`** Skill (`/parallel-spec-fleet` at [`.claude/skills/parallel-spec-fleet/`](./.claude/skills/parallel-spec-fleet/)) fans out `test-writer`, `qa-reviewer`, and `security-reviewer` concurrently.
- If the issue is ambiguous, raise a question in a comment rather than guessing.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add recently-viewed paths row
fix: handle missing path query param on enroll page
docs: update clone URL after org transfer
test: cover negative paths for enroll form
chore(deps): bump @playwright/test to 1.48.0
```

## PR requirements

- [ ] Linked to an issue with `Closes #N`.
- [ ] Description includes **what changed**, **why**, **how to test**, and **screenshots** for UI changes.
- [ ] CI green (Playwright + CodeQL).
- [ ] No new dependencies unless previously discussed.
- [ ] No `.only`, `.skip`, or commented-out tests.
- [ ] At least one reviewer approval. For UI changes, request the GitHub Copilot PR Reviewer too.

## Security

Found a real vulnerability? See [`SECURITY.md`](./SECURITY.md). Do **not** open a public issue.

## Code of conduct

By participating, you agree to the [Contributor Covenant](./CODE_OF_CONDUCT.md). Be kind. Disagree with ideas, not people.

## Questions

Open a [Discussion](../../discussions) or reach Tim at [TechTrainerTim.com](https://techtrainertim.com).
