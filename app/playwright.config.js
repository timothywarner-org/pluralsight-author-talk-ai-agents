// Playwright configuration for the AI Skill Path Picker demo app.
// Subagents in .claude/agents/ will read this when generating specs.

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '../tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'npx --yes serve public -l 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
});
