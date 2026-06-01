# Spec Anatomy

What a good Playwright spec looks like in this repository. Copy and adapt.

## The shape

Every spec file has five parts, always in this order:

1. **Header comment** — what flow this spec covers, in one sentence.
2. **Imports** — `@playwright/test` first, then page objects.
3. **`test.describe`** — one per spec file, named after the user-visible flow.
4. **Happy path test(s)** — what success looks like.
5. **Negative path test(s)** — what failure looks like, and how the app handles it.

## Annotated example — `enroll-form-validation.spec.js`

```js
// tests/enroll-form-validation.spec.js
// Covers: client-side validation on the /enroll form.
//
// Why this exists: the app has no backend. Client-side validation is the
// ONLY line of defense for the data going into sessionStorage. If this
// breaks, the confirmation page renders garbage.

const { test, expect } = require('@playwright/test');
const { EnrollPage } = require('./pages/Enroll.page');

test.describe('Enroll form validation', () => {
  // -------- happy path --------

  test('happy path: valid input advances to confirm.html', async ({ page }) => {
    const enroll = new EnrollPage(page);
    await enroll.goto('claude-code-pro');

    await enroll.fillName('Tim Warner');
    await enroll.fillEmail('tim@example.com');
    await enroll.selectRole('tech-lead');
    await enroll.submit();

    await expect(page).toHaveURL(/confirm\.html$/);
  });

  // -------- negative paths --------

  test('rejects empty name', async ({ page }) => {
    const enroll = new EnrollPage(page);
    await enroll.goto('claude-code-pro');

    await enroll.fillEmail('tim@example.com');
    await enroll.selectRole('tech-lead');
    await enroll.submit();

    await enroll.expectErrorContaining('full name');
    await expect(page).not.toHaveURL(/confirm\.html$/);
  });

  test('rejects malformed email', async ({ page }) => {
    const enroll = new EnrollPage(page);
    await enroll.goto('claude-code-pro');

    await enroll.fillName('Tim Warner');
    await enroll.fillEmail('not-an-email');
    await enroll.selectRole('tech-lead');
    await enroll.submit();

    await enroll.expectErrorContaining('valid work email');
  });

  test('rejects missing role', async ({ page }) => {
    const enroll = new EnrollPage(page);
    await enroll.goto('claude-code-pro');

    await enroll.fillName('Tim Warner');
    await enroll.fillEmail('tim@example.com');
    await enroll.submit();

    await enroll.expectErrorContaining('select your role');
  });
});
```

## Why this shape

### One `describe` per file

Multiple `describe` blocks in one file is a signal you should have written multiple files. The qa-reviewer subagent will flag it.

### Tests are independent

Each test does its own `goto()`. None depends on a side effect from another. Playwright runs in parallel by default; ordering dependencies break under parallelism.

### Negative tests assert the bad thing AND the absence of the good thing

```js
await enroll.expectErrorContaining('full name');         // bad thing visible
await expect(page).not.toHaveURL(/confirm\.html$/);      // good thing absent
```

A negative test that only checks the error banner can pass even if the form ALSO advanced — which would be a real bug. Always assert both halves.

### No `waitForTimeout`, ever

Playwright's `expect(...)` retries until the assertion passes or the timeout elapses. That IS your wait. `page.waitForTimeout(1000)` is a code smell that means "I don't know what I'm waiting for."

### Test names complete the sentence "Given X, when Y, then Z"

```js
test('rejects malformed email', ...);    // ✅ clear from the name alone
test('test 2', ...);                      // ❌ what
test('email validation works', ...);      // ❌ for what value of "works"?
```

## Checklist before handoff

When the test-writer subagent finishes a spec, it should be able to honestly tick every box:

- [ ] Header comment explains what the file covers.
- [ ] One `test.describe`, named after the user-visible flow.
- [ ] At least one happy-path test, at least one negative-path test.
- [ ] Every selector is a `data-testid`.
- [ ] Page Objects used where the flow spans more than one page.
- [ ] No `page.waitForTimeout`.
- [ ] No `.only`, no `.skip`, no commented-out tests.
- [ ] `npx playwright test ../tests/<file>.spec.js` passes locally.

If any box is unticked, hand off to qa-reviewer is premature.
