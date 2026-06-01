# Page Object Patterns

Page Object Models (POMs) are how this repo keeps Playwright specs readable as the app grows. The SKILL.md procedure says: when a flow touches more than one page, write a POM.

This file shows the patterns. Copy and adapt.

## File layout

```
tests/
├── pages/
│   ├── Home.page.js
│   ├── Enroll.page.js
│   └── Confirm.page.js
├── smoke.spec.js
└── enroll-form-validation.spec.js
```

One file per page. PascalCase + `.page.js`. Default-export nothing; named-export the class.

## Anatomy of a Page Object

```js
// tests/pages/Enroll.page.js
const { expect } = require('@playwright/test');

class EnrollPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // Group locators at the top — single source of truth for selectors.
    this.fullNameInput = page.getByTestId('full-name-input');
    this.emailInput = page.getByTestId('email-input');
    this.roleSelect = page.getByTestId('role-select');
    this.newsletterCheckbox = page.getByTestId('newsletter-checkbox');
    this.submitButton = page.getByTestId('submit-enroll');
    this.errorBanner = page.getByTestId('form-error');
  }

  // Methods describe USER INTENT, not framework calls.
  async goto(pathId) {
    await this.page.goto(`/enroll.html?path=${pathId}`);
  }

  async fillName(name) {
    await this.fullNameInput.fill(name);
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async selectRole(role) {
    await this.roleSelect.selectOption(role);
  }

  async submit() {
    await this.submitButton.click();
  }

  // Assertions belong on the POM too — saves repetition in specs.
  async expectErrorContaining(text) {
    await expect(this.errorBanner).toBeVisible();
    await expect(this.errorBanner).toContainText(text);
  }
}

module.exports = { EnrollPage };
```

## Patterns to follow

### 1. Method names are verbs that match user intent

```js
// ✅ Good — describes what the user wants
await enroll.fillName('Tim');
await enroll.submit();

// ❌ Bad — leaks framework details into the spec
await page.locator('[data-testid=full-name-input]').fill('Tim');
await page.locator('[data-testid=submit-enroll]').click();
```

### 2. Compound actions belong on the POM

If three specs all need to fill name + email + role + submit, that's a method:

```js
async fillValidForm({ name, email, role }) {
  await this.fillName(name);
  await this.fillEmail(email);
  await this.selectRole(role);
  await this.submit();
}
```

### 3. Locators are properties, not methods

```js
// ✅ Good — accessible to ad-hoc assertions
await expect(enroll.submitButton).toBeDisabled();

// ❌ Bad — caller has to know it's async
await expect(await enroll.getSubmitButton()).toBeDisabled();
```

### 4. Assertions can live on the POM too

The classic pattern says "POMs are actions, specs hold assertions." That's fine for textbooks. In practice, repeating `expect(enroll.errorBanner).toBeVisible()` in fifteen specs is worse than `await enroll.expectErrorContaining(...)`.

## Patterns to refuse

### 1. POM methods that take Playwright Page directly

```js
// ❌ Bad — defeats the abstraction
async fillName(page, name) { ... }
```

The POM owns the `page`. Pass user data, never framework objects.

### 2. POMs that call other POMs

```js
// ❌ Bad
async submit() {
  await this.submitButton.click();
  this.confirmPage = new ConfirmPage(this.page);
}
```

Construct each POM in the spec. Each spec is in charge of its own flow.

### 3. Inheritance hierarchies

```js
// ❌ Bad — over-engineered for an app of any reasonable size
class BasePage { ... }
class EnrollPage extends BasePage { ... }
```

If three POMs share a method, extract a free function. Inheritance in test code is a smell.

## Using a POM in a spec

```js
// tests/smoke.spec.js
const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/Home.page');
const { EnrollPage } = require('./pages/Enroll.page');

test('happy path: enroll in Claude Code path', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();
  await home.enrollIn('claude-code-pro');

  const enroll = new EnrollPage(page);
  await enroll.fillValidForm({
    name: 'Tim Warner',
    email: 'tim@example.com',
    role: 'tech-lead'
  });

  await expect(page).toHaveURL(/confirm\.html$/);
});
```

Notice: the spec reads top-to-bottom like the user story. Framework noise stays in the POMs.
