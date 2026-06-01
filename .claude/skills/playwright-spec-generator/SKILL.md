---
name: playwright-spec-generator
description: Procedural recipe for generating a Playwright end-to-end spec from a described user flow. Use whenever Claude Code is asked to write a Playwright test for the AI Skill Path Picker app — the test-writer subagent invokes this Skill as its working procedure. Produces a single .spec.js file plus an optional Page Object Model, both following the repository's data-testid-only selector rule.
---

# Playwright Spec Generator

A repeatable recipe for going from "test this flow" to a passing, idiomatic Playwright spec — without reinventing the wheel each time.

## When to use this Skill

- The user (or main agent) describes a user flow and asks for end-to-end coverage.
- A new feature has shipped without tests and needs a regression net.
- A bug has been reported and you need a failing spec that reproduces it before fixing.

## When NOT to use this Skill

- The change is unit-testable without a browser. Write a plain `*.test.js` instead.
- The flow requires a real backend. This app has none — push back on the user.

## Procedure

### Step 1 — Read the existing conventions

Before writing anything, read:

- `.github/copilot-instructions.md` (sections 3, 5 — accessibility and testing).
- `app/playwright.config.js` (so you know the baseURL and timeout settings).
- `tests/pages/*.js` if any exist (so your Page Object naming matches).
- One existing spec in `tests/` if any exist (so your style matches).

If none of those exist yet, you are writing the first spec — set the standard.

### Step 2 — Identify the data-testid surface

Open the HTML pages the flow touches. List every `data-testid` you see. If a control involved in the flow has NO `data-testid`, **stop**. Ask the main agent to add one to the HTML before continuing. Do NOT fall back to CSS class or text selectors.

### Step 3 — Draft the Page Object (if needed)

If the flow touches more than one page, create or extend `tests/pages/<PageName>.page.js`. Page Object methods are verbs that describe user intent, not implementation:

```js
// Good
await enrollPage.fillName('Tim');
await enrollPage.submit();
await enrollPage.expectErrorContaining('valid work email');

// Bad
await page.locator('[data-testid=full-name-input]').fill('Tim');
```

### Step 4 — Draft the spec

Use this skeleton:

```js
// tests/<flow>.spec.js
// Covers: <one-line description of the flow under test>

const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/Home.page');
const { EnrollPage } = require('./pages/Enroll.page');

test.describe('<flow name>', () => {
  test('happy path: <user outcome>', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.enrollIn('claude-code-pro');

    const enroll = new EnrollPage(page);
    await enroll.fillName('Tim Warner');
    await enroll.fillEmail('tim@example.com');
    await enroll.selectRole('tech-lead');
    await enroll.submit();

    await expect(page).toHaveURL(/confirm\.html$/);
    await expect(page.getByTestId('confirm-name')).toHaveText('Tim Warner');
  });

  test('negative path: <what should be rejected>', async ({ page }) => {
    // ...
  });
});
```

### Step 5 — Run the spec

```bash
cd app
npx playwright test ../tests/<file>.spec.js --reporter=list
```

If it fails, fix YOUR spec — do not patch the application code to make the test green. If the spec reveals an application bug, write a comment block at the top of the spec describing the bug and hand off to the main agent.

### Step 6 — Hand off

Return exactly:

```
SPEC WRITTEN: tests/<filename>.spec.js
COVERAGE: <one-line summary>
HANDOFF TO: qa-reviewer
```

## Anti-patterns to refuse

- `page.waitForTimeout(...)` — never. Use `expect(...).toBeVisible({ timeout })`.
- `page.locator('.cta')` — CSS class selectors are brittle.
- `page.getByText('Enroll')` — text changes break tests for the wrong reason.
- `test.only(...)` or `test.skip(...)` in committed code — never.
- Importing helpers from a `node_modules` library that isn't already in `package.json`.
