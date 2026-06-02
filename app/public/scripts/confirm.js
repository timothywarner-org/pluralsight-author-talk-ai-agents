// Confirmation page - renders what we stashed in sessionStorage.

(function () {
  const { pathTitleFromId } = window.AuthorTalk;
  const confirmation = document.querySelector('[data-testid="confirmation"]');
  const raw = sessionStorage.getItem('authorTalkEnrollment');

  if (!raw) {
    confirmation.innerHTML =
      '<p>No enrollment found.</p>' +
      '<a href="./" class="cta" data-testid="back-home">Back home</a>';
    return;
  }

  const ROLE_LABELS = {
    'developer': 'Developer',
    'devops': 'DevOps Engineer',
    'product-owner': 'Product Owner',
    'scrum-master': 'Scrum Master',
    'tech-lead': 'Tech Lead',
    'other': 'Other'
  };

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    confirmation.innerHTML =
      '<p>Enrollment details could not be read.</p>' +
      '<a href="./" class="cta" data-testid="back-home">Back home</a>';
    return;
  }

  document.querySelector('[data-testid="confirm-path"]').textContent =
    pathTitleFromId(data.pathId);
  document.querySelector('[data-testid="confirm-name"]').textContent = data.fullName;
  document.querySelector('[data-testid="confirm-email"]').textContent = data.email;
  document.querySelector('[data-testid="confirm-role"]').textContent =
    ROLE_LABELS[data.role] || data.role;
})();
