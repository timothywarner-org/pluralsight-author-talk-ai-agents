const { expect } = require('@playwright/test');

class HomePage {
  constructor(page) {
    this.page = page;
    this.pathList = page.getByTestId('path-list');
  }

  async goto() {
    await this.page.goto('/');
  }

  async enrollIn(pathId) {
    await this.page.getByTestId(`enroll-${pathId}`).click();
  }

  async expectPathListVisible() {
    await expect(this.pathList).toBeVisible();
  }
}

module.exports = { HomePage };
