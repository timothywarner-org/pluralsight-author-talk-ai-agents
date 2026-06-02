// Enrollment page logic.
// Reads ?path= from the URL, validates the form, and forwards to confirm.html.

(function () {
  const { getQueryParam, pathTitleFromId } = window.AuthorTalk;

  const pathId = getQueryParam('path');
  const tagline = document.querySelector('[data-testid="selected-path"]');
  if (tagline) {
    tagline.textContent = pathId
      ? `You're enrolling in: ${pathTitleFromId(pathId)}`
      : 'Pick a path from the home page first.';
  }

  const form = document.getElementById('enroll-form');
  const errorBanner = document.getElementById('form-error');

  function showError(msg) {
    errorBanner.textContent = msg;
    errorBanner.hidden = false;
  }

  function clearError() {
    errorBanner.textContent = '';
    errorBanner.hidden = true;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearError();

    const fullName = form.fullName.value.trim();
    const email = form.email.value.trim();
    const role = form.role.value;
    const newsletter = form.newsletter.checked;

    if (!pathId) {
      showError('No path selected. Return to the home page and pick one.');
      return;
    }
    if (fullName.length < 2) {
      showError('Please enter your full name.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      showError('Please enter a valid work email.');
      return;
    }
    if (!role) {
      showError('Please select your role.');
      return;
    }

    const payload = { pathId, fullName, email, role, newsletter };
    // In a real app this would POST to an API. For the demo we stash it
    // in sessionStorage so the confirmation page can render it.
    sessionStorage.setItem('authorTalkEnrollment', JSON.stringify(payload));
    window.location.href = 'confirm';
  });
})();
