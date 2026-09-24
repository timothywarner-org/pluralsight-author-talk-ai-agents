const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/Home.page');
const { EnrollPage } = require('./pages/Enroll.page');

test('smoke: learner can enroll via page objects', async ({ page }) => {
  const home = new HomePage(page);
  const enroll = new EnrollPage(page);

  await home.goto();
  await home.expectPathListVisible();
  await home.enrollIn('claude-code-pro');

  await enroll.fillName('Dana Scully');
  await enroll.fillEmail('dana.scully@woodgrovebank.com');
  await enroll.selectRole('tech-lead');
  await enroll.toggleNewsletter();
  await enroll.submit();

  await expect(page).toHaveURL(/\/confirm$/);
  await expect(page.getByTestId('confirmation')).toBeVisible();
  await expect(page.getByTestId('confirm-path')).toHaveText(
    'Claude Code for Professional Developers'
  );
});
