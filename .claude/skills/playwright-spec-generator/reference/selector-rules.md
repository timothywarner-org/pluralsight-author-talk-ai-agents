# Selector Rules

The single most common reason Playwright suites become unmaintainable is undisciplined selectors. This file is the law for selectors in this repo. Read it before writing or reviewing a spec.

## The one rule

**Use `data-testid` attributes. Always. No exceptions.**

```js
// ✅ Good
await page.getByTestId('submit-enroll').click();

// ❌ Bad — CSS class
await page.locator('.cta').click();

// ❌ Bad — text content
await page.getByText('Confirm enrollment').click();

// ❌ Bad — tag selector
await page.locator('button[type=submit]').click();

// ❌ Bad — nth-child
await page.locator('.path-card:nth-child(2) a').click();
```

## Why

| Selector type | Breaks when | Breaks at the rate of |
|---|---|---|
| `data-testid` | An engineer deliberately renames the testid | Approximately once a year |
| CSS class | Designer renames a class | Approximately once a sprint |
| Text content | Copywriter changes a button label | Approximately once a month |
| Tag selector | Someone adds a sibling element | Approximately once a week |
| `nth-child` | Layout reorders | Constantly |

`data-testid` is the only selector designed to be a stable contract between the app and the tests. Every other selector is incidental layout that will change for reasons unrelated to the test's intent.

## Naming conventions

- **Kebab-case.** `submit-enroll`, not `submitEnroll` or `submit_enroll`.
- **Action-or-target prefix.** Buttons start with the action (`submit-`, `cancel-`, `enroll-`). Inputs end with `-input` (`full-name-input`, `email-input`). Selects end with `-select`. Display elements end with what they show (`confirm-name`, `confirm-email`).
- **No layout words.** `header-button` is bad — if it moves to the footer, the testid lies. `submit-enroll` survives any layout change.

## When a needed control has no testid

**STOP. Do not fall back to a CSS class.** The procedure in `SKILL.md` says: ask the main agent to add the testid to the HTML first.

This rule has saved more flaky-test debugging hours than any other.

## How to inventory what testids exist

Before writing any selector, run:

```bash
node .claude/skills/playwright-spec-generator/scripts/scan-testids.mjs app/public
```

The output is a markdown table of every testid in the codebase and which HTML file(s) it lives in. If the control you need isn't on the list, see the section above.

## Edge case: when there are many of the same kind

For lists, use a parent testid + a per-item testid that includes the data identity:

```html
<section data-testid="path-list">
  <article data-testid="path-card-claude-code-pro">...</article>
  <article data-testid="path-card-genai-foundations">...</article>
</section>
```

```js
// ✅ Good
await page.getByTestId('path-card-claude-code-pro')
          .getByTestId('enroll-claude-code-pro')
          .click();
```

Never `:nth-child(2)`. The list order will change.
