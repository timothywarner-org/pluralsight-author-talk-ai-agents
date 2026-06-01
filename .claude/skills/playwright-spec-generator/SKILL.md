---
name: playwright-spec-generator
description: Procedural recipe for generating a Playwright end-to-end spec from a described user flow. Use whenever Claude Code is asked to write a Playwright test for the AI Skill Path Picker app — the test-writer subagent invokes this Skill as its working procedure. Produces a single .spec.js file plus an optional Page Object Model, both following the repository's data-testid-only selector rule. Ships with executable helpers under scripts/ and reference docs under reference/.
---

# Playwright Spec Generator

A repeatable recipe for going from "test this flow" to a passing, idiomatic Playwright spec — without reinventing the wheel each time.

## Skill layout

```
.claude/skills/playwright-spec-generator/
├── SKILL.md                          ← you are here
├── scripts/
│   ├── scan-testids.mjs              ← inventory every data-testid in the app
│   └── new-spec.mjs                  ← scaffold a new spec file
└── reference/
    ├── selector-rules.md             ← the law for selectors
    ├── page-object-patterns.md       ← POM examples to copy
    └── spec-anatomy.md               ← what a good spec looks like end-to-end
```

The procedure below tells you when to read each reference file and when to run each script. Don't reinvent — use the tools.

## When to use this Skill

- The user (or main agent) describes a user flow and asks for end-to-end coverage.
- A new feature has shipped without tests and needs a regression net.
- A bug has been reported and you need a failing spec that reproduces it before fixing.

## When NOT to use this Skill

- The change is unit-testable without a browser. Write a plain `*.test.js` instead.
- The flow requires a real backend. This app has none — push back on the user.

## Procedure

### Step 1 — Read the conventions

Before writing anything, read in this order:

1. `.github/copilot-instructions.md` sections 3 and 5 (accessibility, testing).
2. `reference/selector-rules.md` — the law for selectors.
3. `reference/spec-anatomy.md` — what a good spec looks like.
4. `reference/page-object-patterns.md` — only if the flow touches more than one page.

### Step 2 — Inventory the data-testid surface

Before drafting a single selector, run:

```bash
node .claude/skills/playwright-spec-generator/scripts/scan-testids.mjs app/public
```

The output is a markdown table of every `data-testid` in the codebase. If the control you need is NOT on the list:

> **Stop.** Ask the main agent to add a `data-testid` to the relevant element in the HTML. Do NOT fall back to a CSS class, text content, or tag selector. Ever. See `reference/selector-rules.md`.

### Step 3 — Scaffold the spec file

```bash
node .claude/skills/playwright-spec-generator/scripts/new-spec.mjs <flow-name-kebab-case>
```

Example:

```bash
node .claude/skills/playwright-spec-generator/scripts/new-spec.mjs enroll-form-validation
```

This writes `tests/<flow-name>.spec.js` with the canonical skeleton — header comment, one `describe`, one happy-path test, one negative-path test, no Playwright anti-patterns. The script refuses to overwrite an existing file.

### Step 4 — Draft the Page Object (if needed)

If the flow touches more than one page, create or extend a POM under `tests/pages/`. Copy the pattern from `reference/page-object-patterns.md`. The rules:

- One file per page, PascalCase + `.page.js`.
- Methods are verbs that describe user intent (`fillName`, `submit`, `expectErrorContaining`).
- Locators are properties, not methods.
- Selectors are `data-testid` only.

### Step 5 — Replace TODOs with real drivers

Open the spec file. Replace the `throw new Error('TODO: ...')` blocks with real flow drivers using:

- Page Object methods if a POM exists.
- `page.getByTestId('...')` calls if not.

Forbidden patterns (see `reference/selector-rules.md` and `reference/spec-anatomy.md`):

- `page.waitForTimeout(...)`
- CSS class selectors
- Text-content selectors
- `.only`, `.skip`, commented-out blocks
- `expect(true).toBe(true)` filler

### Step 6 — Run the spec

```bash
cd app
npx playwright test ../tests/<flow>.spec.js --reporter=list
```

If the spec fails, fix the SPEC — do not patch the application to make a test green. If the spec reveals an application bug, add a comment block at the top of the spec describing the bug and hand off to the main agent.

### Step 7 — Hand off

When the spec passes and matches the checklist at the bottom of `reference/spec-anatomy.md`, return exactly this message to the main agent:

```
SPEC WRITTEN: tests/<filename>.spec.js
COVERAGE: <one-line summary>
HANDOFF TO: qa-reviewer
```

The main agent routes to the `qa-reviewer` subagent for adversarial review before commit.

## Anti-patterns the qa-reviewer will reject

Pulled from `reference/selector-rules.md` and `reference/spec-anatomy.md` — keep them in one place here so you don't have to chase them:

- `page.waitForTimeout(...)` — use `expect(...).toBeVisible({ timeout })` instead.
- `page.locator('.cta')` — CSS class selectors are brittle.
- `page.getByText('Enroll')` — text changes break tests for the wrong reason.
- `page.locator(':nth-child(...)')` — layout reorder breaks the test.
- `test.only(...)` or `test.skip(...)` in committed code — never.
- Importing helpers from a `node_modules` library that isn't already in `package.json`.
- A negative test that only asserts the error banner. Must ALSO assert the success state did not occur.
- One file with multiple `test.describe` blocks. Split into multiple files.

## Quickref

| Need | Tool |
|---|---|
| List every testid in the app | `scripts/scan-testids.mjs` |
| Scaffold a new spec | `scripts/new-spec.mjs <flow-name>` |
| Selector rules | `reference/selector-rules.md` |
| Page Object patterns | `reference/page-object-patterns.md` |
| What a good spec looks like | `reference/spec-anatomy.md` |
