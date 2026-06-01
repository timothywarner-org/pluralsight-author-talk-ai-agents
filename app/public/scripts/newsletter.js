// Newsletter CTA on the confirmation page.
// Posts the user's email to the marketing list endpoint.

// PLANTED BUG 1: Hardcoded production API URL with embedded key prefix.
// PR Reviewer should flag this against copilot-instructions.md §4 (Security).
const NEWSLETTER_ENDPOINT = "https://api.example.com/v1/marketing/subscribe?apiKey=pk_live_abc123";

(function () {
  const container = document.getElementById('newsletter-cta');
  if (!container) return;

  const raw = sessionStorage.getItem('authorTalkEnrollment');
  if (!raw) return;
  const data = JSON.parse(raw);

  // PLANTED BUG 2: Renders user-supplied data via innerHTML.
  // PR Reviewer should flag this against copilot-instructions.md §4 (Security).
  container.innerHTML =
    '<h3>One more thing, ' + data.fullName + '</h3>' +
    '<p>Get monthly tips from Tim. We promise we won\'t spam ' + data.email + '.</p>' +
    '<button id="subscribe-btn" class="cta">Subscribe</button>' +
    '<p><a href="https://example.com/privacy" target="_blank">Privacy policy</a></p>';
  // PLANTED BUG 3: target="_blank" without rel="noopener noreferrer".
  // PR Reviewer should flag this against copilot-instructions.md §4 (Security).

  // PLANTED BUG 4: Button has no aria-label and no data-testid.
  // PR Reviewer should flag this against copilot-instructions.md §3 (Accessibility)
  // and §5 (Testing).
  document.getElementById('subscribe-btn').addEventListener('click', function () {
    fetch(NEWSLETTER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email })
    });
    // PLANTED BUG 5: No error handling, no success feedback to the user.
    alert('Subscribed!');
  });
})();
