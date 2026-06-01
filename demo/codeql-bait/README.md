# CodeQL Bait

> **EVERY FILE IN THIS FOLDER IS INTENTIONALLY VULNERABLE.**
> Planted to populate the GitHub code scanning tab with visible CodeQL alerts for a live talk demo. The code is never imported by the running app — it sits here only so CodeQL has something to find.

## Why this folder exists

Beat 3 of the Pluralsight Author Talk needs a populated **Security tab**: real secret scanning alerts (see `demo/secret-scanning-trap/`), real Dependabot alerts (see vulnerable dependencies in `app/package.json`), and real **CodeQL alerts**. This folder produces the third.

## What's in here

| File | Demonstrates |
|---|---|
| [`vulnerable-handlers.js`](./vulnerable-handlers.js) | JavaScript anti-patterns CodeQL's `security-extended` query suite flags: code injection via `eval`, DOM XSS via `innerHTML`, prototype pollution, regex injection, clear-text storage of secrets, weak randomness for tokens, and open redirect. |

## For the live talk

1. Open **https://github.com/timothywarner-org/pluralsight-author-talk-ai-agents/security/code-scanning** in the browser.
2. Filter by `severity:high` or `severity:critical` to show the spicy ones.
3. Click a finding — show:
   - The exact line.
   - CodeQL's data-flow explanation (source → sink).
   - The CWE link and remediation guidance.
4. Then narrate: *"This isn't a linter. CodeQL traces taint from a user-controlled source to a dangerous sink across the entire program. That's why it catches things a code reviewer misses on the third PR of the day."*

## Cleanup

After the talk, delete this folder or move it to a separate teaching repo.
