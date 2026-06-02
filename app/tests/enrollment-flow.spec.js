const { test, expect } = require('@playwright/test');

test('learner can enroll and return home from the completion screen', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('path-list')).toBeVisible();
  await page.getByTestId('enroll-claude-code-pro').click();

  await expect(page.getByTestId('selected-path')).toContainText(
    'Claude Code for Professional Developers'
  );

  await page.getByTestId('full-name-input').fill('Dana Scully');
  await page.getByTestId('email-input').fill('dana.scully@woodgrovebank.com');
  await page.getByTestId('role-select').selectOption('tech-lead');
  await page.getByTestId('newsletter-checkbox').check();
  await page.getByTestId('submit-enroll').click();

  await expect(page).toHaveURL(/\/confirm$/);
  await expect(page.getByRole('heading', { name: "You're enrolled." })).toBeVisible();
  await expect(page.getByTestId('confirm-path')).toHaveText(
    'Claude Code for Professional Developers'
  );
  await expect(page.getByTestId('confirm-name')).toHaveText('Dana Scully');
  await expect(page.getByTestId('confirm-email')).toHaveText(
    'dana.scully@woodgrovebank.com'
  );
  await expect(page.getByTestId('confirm-role')).toHaveText('Tech Lead');

  await page.getByTestId('back-home').click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId('path-list')).toBeVisible();
});

test('completion screen still offers a home button when enrollment data is missing', async ({
  page
}) => {
  await page.goto('/confirm.html');

  await expect(page.getByText('No enrollment found.')).toBeVisible();
  await page.getByTestId('back-home').click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId('path-list')).toBeVisible();
});
