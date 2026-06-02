const { expect } = require('@playwright/test');

class EnrollPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.getByTestId('full-name-input');
    this.emailInput = page.getByTestId('email-input');
    this.roleSelect = page.getByTestId('role-select');
    this.newsletterCheckbox = page.getByTestId('newsletter-checkbox');
    this.submitButton = page.getByTestId('submit-enroll');
    this.formError = page.getByTestId('form-error');
  }

  async fillName(name) {
    await this.nameInput.fill(name);
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async selectRole(role) {
    await this.roleSelect.selectOption(role);
  }

  async toggleNewsletter() {
    await this.newsletterCheckbox.click();
  }

  async submit() {
    await this.submitButton.click();
  }

  async expectErrorContaining(text) {
    await expect(this.formError).toContainText(text);
  }
}

module.exports = { EnrollPage };
