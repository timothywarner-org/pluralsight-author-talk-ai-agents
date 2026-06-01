# Secret Scanning Trap

> **EVERY VALUE IN THIS FOLDER IS A FAKE TEST CREDENTIAL PLANTED INTENTIONALLY TO TRIGGER GITHUB SECRET SCANNING ALERTS FOR A LIVE TALK DEMO.**
> **NONE OF THESE ARE REAL.** None of them grant access to any real account, key, or service. They are canonical example values used in vendor documentation, padded with `EXAMPLE` / `FAKE` / `0000` markers, or random sentinel bytes.

## Why this folder exists

The Pluralsight Author Talk includes Beat 3 — **GitHub Copilot Coding Agent + PR Reviewer + the security trio (CodeQL, Dependabot, Secret Scanning)**. To demo the Security tab convincingly, the repo needs visible secret scanning alerts. This folder is the trap that produces them.

## What's in here

| File | Provider | Pattern |
|---|---|---|
| [`legacy-aws-config.js`](./legacy-aws-config.js) | AWS | `AKIA…` access key + 40-char secret pair |
| [`legacy-github-pat.env`](./legacy-github-pat.env) | GitHub | `ghp_…` classic personal access token |
| [`legacy-slack-bot.json`](./legacy-slack-bot.json) | Slack | `xoxb-…` bot token |
| [`legacy-stripe.env`](./legacy-stripe.env) | Stripe | `sk_live_…` secret key |
| [`legacy-google-maps.js`](./legacy-google-maps.js) | Google | `AIza…` API key |
| [`legacy-npm.npmrc`](./legacy-npm.npmrc) | npm | `npm_…` access token |

Each file imitates the kind of artifact a junior engineer leaves behind: an old `.env`, a forgotten config file, an `.npmrc` that escaped a `.gitignore`. These are the highest-fidelity teaching surfaces because they look exactly like the real thing.

## For the live talk

1. Open **https://github.com/timothywarner-org/pluralsight-author-talk-ai-agents/security/secret-scanning** in the browser.
2. Each file above will appear as one or more alerts.
3. Click one alert. Show:
   - **Detected pattern** (which partner regex matched).
   - **Validity check** result (GitHub asks the partner if the key is currently live).
   - **Locations** — which commit, which line.
   - **Remediation guidance** — built-in.

Then narrate: *"This is what happens before a human ever sees the code. If push protection had been on at the moment of the original push, the developer would have been blocked at `git push` and never landed the secret. That's the platform-layer guarantee."*

## Cleanup

After the talk, delete the branch this folder lives on, or `git filter-repo` the secrets out of history. For now they stay — they are the demo.
