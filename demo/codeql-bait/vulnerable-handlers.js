// vulnerable-handlers.js
// INTENTIONALLY VULNERABLE -- planted to trigger CodeQL alerts for a live talk demo.
// Do NOT import this file from any real code path. It exists only so the
// code scanning tab has something to display.
//
// Each function below carries a comment naming the CodeQL query it should fire.

'use strict';

const crypto = require('node:crypto');

// ─────────────────────────────────────────────────────────────────────────────
// 1. Code injection -- query: js/code-injection
//
// Passes user-controlled input directly to eval(). Classic RCE on the server,
// arbitrary JS in the browser. CodeQL traces the taint from req.body.expression
// to the eval() call.
// ─────────────────────────────────────────────────────────────────────────────
function handleCalculator(req, res) {
  const expression = req.body.expression;
  const result = eval(expression); // BUG: code injection
  res.send({ result });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. DOM-based XSS -- query: js/xss-through-dom
//
// Renders untrusted input via innerHTML without sanitization. Same anti-pattern
// as the planted bug in the newsletter PR. Doing it here too so CodeQL fires
// on main without needing the PR to merge.
// ─────────────────────────────────────────────────────────────────────────────
function renderGreeting(name) {
  const el = document.getElementById('greeting');
  el.innerHTML = '<h1>Hello ' + name + '</h1>'; // BUG: XSS
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Prototype pollution -- query: js/prototype-pollution-utility
//
// Recursive merge that walks user-controlled keys including __proto__.
// CodeQL flags this as a sink for prototype pollution.
// ─────────────────────────────────────────────────────────────────────────────
function deepMerge(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = target[key] || {};
      deepMerge(target[key], source[key]); // BUG: walks __proto__
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Server-side regex injection -- query: js/regex-injection
//
// User-controlled string compiled directly into a RegExp. Catastrophic
// backtracking territory (ReDoS) AND lets the user change the matching
// semantics of the search.
// ─────────────────────────────────────────────────────────────────────────────
function searchProducts(req, res) {
  const pattern = req.query.q;
  const re = new RegExp(pattern); // BUG: regex injection
  const matches = PRODUCT_NAMES.filter((p) => re.test(p));
  res.send({ matches });
}

const PRODUCT_NAMES = ['Widget', 'Gadget', 'Doohickey'];

// ─────────────────────────────────────────────────────────────────────────────
// 5. Clear-text storage of sensitive data -- query: js/clear-text-storage-of-sensitive-data
//
// Writes a password to localStorage in plaintext. CodeQL's heuristic
// recognizes the variable name "password" as sensitive.
// ─────────────────────────────────────────────────────────────────────────────
function rememberCredentials(username, password) {
  window.localStorage.setItem('username', username);
  window.localStorage.setItem('password', password); // BUG: clear-text storage
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Insecure randomness -- query: js/insecure-randomness
//
// Math.random() used to mint what's clearly a security token. CodeQL flags
// any flow from Math.random into a sink with a security-flavored name.
// ─────────────────────────────────────────────────────────────────────────────
function generateSessionToken() {
  let token = '';
  for (let i = 0; i < 32; i += 1) {
    token += Math.floor(Math.random() * 16).toString(16); // BUG: weak randomness
  }
  return token;
}

// A correct version would be:
//   return crypto.randomBytes(16).toString('hex');
// Left commented to keep the bait active.
void crypto;

// ─────────────────────────────────────────────────────────────────────────────
// 7. Open redirect / URL redirection from remote source -- query:
//    js/server-side-unvalidated-url-redirection
//
// Redirects to a URL pulled straight from the query string. Phishing payload.
// ─────────────────────────────────────────────────────────────────────────────
function handleRedirect(req, res) {
  const target = req.query.next;
  res.redirect(target); // BUG: open redirect
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. Hard-coded credentials -- query: js/hardcoded-credentials
//
// Embedded credential in source. Doubles as a teaching example for the
// secret-scanning side of the demo.
// ─────────────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'P@ssw0rd-Demo-2026!'; // BUG: hardcoded credential

function checkAdminPassword(input) {
  return input === ADMIN_PASSWORD;
}

module.exports = {
  handleCalculator,
  renderGreeting,
  deepMerge,
  searchProducts,
  rememberCredentials,
  generateSessionToken,
  handleRedirect,
  checkAdminPassword
};
