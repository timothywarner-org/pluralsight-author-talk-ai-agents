// Confirmation page — renders what we stashed in sessionStorage.

(function () {
  const raw = sessionStorage.getItem('authorTalkEnrollment');
  if (!raw) {
    document.querySelector('[data-testid="confirmation"]').innerHTML =
      '<p>No enrollment found. <a href="index.html">Start over.</a></p>';
    return;
  }
  const data = JSON.parse(raw);

  const PATH_CATALOG = {
    'genai-foundations': 'Generative AI Foundations',
    'claude-code-pro': 'Claude Code for Professional Developers',
    'github-copilot-fleet': 'GitHub Copilot: Coding Agent & PR Reviewer',
    'm365-copilot-everyday': 'M365 Copilot Every Day'
  };

  const ROLE_LABELS = {
    'developer': 'Developer',
    'devops': 'DevOps Engineer',
    'product-owner': 'Product Owner',
    'scrum-master': 'Scrum Master',
    'tech-lead': 'Tech Lead',
    'other': 'Other'
  };

  document.querySelector('[data-testid="confirm-path"]').textContent =
    PATH_CATALOG[data.pathId] || data.pathId;
  document.querySelector('[data-testid="confirm-name"]').textContent = data.fullName;
  document.querySelector('[data-testid="confirm-email"]').textContent = data.email;
  document.querySelector('[data-testid="confirm-role"]').textContent =
    ROLE_LABELS[data.role] || data.role;
})();
