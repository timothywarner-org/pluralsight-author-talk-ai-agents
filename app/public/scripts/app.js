// Shared helpers used by every page.
// Kept intentionally tiny and dependency-free.

const PATH_CATALOG = {
  'genai-foundations': 'Generative AI Foundations',
  'claude-code-pro': 'Claude Code for Professional Developers',
  'github-copilot-fleet': 'GitHub Copilot: Coding Agent & PR Reviewer',
  'm365-copilot-everyday': 'M365 Copilot Every Day'
};

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function pathTitleFromId(id) {
  return PATH_CATALOG[id] || 'Unknown path';
}

// Expose on window so other scripts on the page can pick them up.
window.AuthorTalk = {
  getQueryParam,
  pathTitleFromId,
  PATH_CATALOG
};
