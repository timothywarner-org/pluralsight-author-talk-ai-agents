<p align="center">
  <img src="./images/banner.svg" alt="AI Agents in Practice — Pluralsight Author Talk by Tim Warner" width="100%">
</p>

<p align="center">
  <a href="https://techtrainertim.com"><img alt="TechTrainerTim.com" src="https://img.shields.io/badge/TechTrainerTim.com-0e1116?style=for-the-badge&logo=googlechrome&logoColor=58a6ff"></a>
  <a href="https://app.pluralsight.com/profile/author/tim-warner"><img alt="Pluralsight Author" src="https://img.shields.io/badge/Pluralsight-Author-F15B2A?style=for-the-badge&logo=pluralsight&logoColor=white"></a>
  <a href="https://mvp.microsoft.com/en-US/MVP/profile/tim-warner"><img alt="Microsoft MVP" src="https://img.shields.io/badge/Microsoft%20MVP-Azure%20AI-00BCF2?style=for-the-badge&logo=microsoft&logoColor=white"></a>
  <a href="https://www.youtube.com/@TechTrainerTim"><img alt="YouTube" src="https://img.shields.io/badge/YouTube-Subscribe-FF0000?style=for-the-badge&logo=youtube&logoColor=white"></a>
  <a href="https://www.linkedin.com/in/timothywarner/"><img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"></a>
</p>

<p align="center">
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/github/license/timothywarner-org/pluralsight-author-talk-ai-agents?style=flat-square"></a>
  <a href="../../actions/workflows/playwright.yml"><img alt="Playwright" src="https://img.shields.io/github/actions/workflow/status/timothywarner-org/pluralsight-author-talk-ai-agents/playwright.yml?label=Playwright&style=flat-square&logo=playwright"></a>
  <a href="../../actions/workflows/codeql.yml"><img alt="CodeQL" src="https://img.shields.io/github/actions/workflow/status/timothywarner-org/pluralsight-author-talk-ai-agents/codeql.yml?label=CodeQL&style=flat-square&logo=github"></a>
  <a href="../../security"><img alt="Security policy" src="https://img.shields.io/badge/security-policy-blueviolet?style=flat-square&logo=github"></a>
  <a href="../../issues"><img alt="Open issues" src="https://img.shields.io/github/issues/timothywarner-org/pluralsight-author-talk-ai-agents?style=flat-square"></a>
  <a href="../../pulls"><img alt="Open PRs" src="https://img.shields.io/github/issues-pr/timothywarner-org/pluralsight-author-talk-ai-agents?style=flat-square"></a>
  <a href="../../commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/timothywarner-org/pluralsight-author-talk-ai-agents?style=flat-square"></a>
</p>

---

# Pluralsight Author Talk — AI Agents Demo

The companion repository for Tim Warner's Pluralsight Author Talk on **M365 Copilot, Claude Code, and GitHub Copilot**. Fork it, clone it, install it, watch the agents work.

This repo is the **shared demo surface** for the three beats of the talk:

| Beat | Tool | What you'll see |
|---|---|---|
| 1 — The Agent Ladder | M365 Copilot Chat → Copilot Studio → (Foundry mention) | Custom-instruction agent grounded in SharePoint, declarative agent built live in 90 seconds, one-line name-drop of Foundry. |
| 2 — The Headliner | Claude Code | Subagent orchestration generating Playwright specs against this app, with context discipline. |
| 3 — The Fleet | GitHub Copilot Coding Agent + PR Reviewer | One `AGENTS.md` (here: `.github/copilot-instructions.md`) governs every PR Copilot opens or reviews. |

---

## Repo layout

```
.
├── agent.html                    # "What Is An Agent" full-viewport image showcase
├── WHAT_IS_AN_AGENT.md           # Conceptual top-of-funnel reading for that page
├── secret-scanning-test.py       # Intentional secret-scanning landmine (fake API key)
├── images/
│   └── agent.png                 # Hero image for agent.html
├── app/                          # The static demo web app
│   ├── public/
│   │   ├── index.html            # Browse learning paths
│   │   ├── enroll.html           # Enrollment form
│   │   ├── confirm.html          # Confirmation page
│   │   ├── scripts/              # Vanilla JS, no build step
│   │   └── styles/main.css
│   ├── tests/                    # Subagents write Playwright specs here (canonical)
│   │   └── enrollment-flow.spec.js
│   ├── package.json              # `npm run dev`, `npm test`
│   └── playwright.config.js      # testDir: ./tests (relative to app/)
├── tests/                        # Legacy/empty root dir (.gitkeep only); active specs live in app/tests/
├── .github/
│   ├── copilot-instructions.md   # The team quality bar — Beat 3's hero file
│   └── ISSUE_TEMPLATE/
├── .claude/
│   ├── agents/                   # test-writer, qa-reviewer, security-reviewer
│   └── skills/
│       ├── playwright-spec-generator/   # The single-flow Playwright recipe
│       └── parallel-spec-fleet/         # Fans the subagents across multiple flows at once
├── demo/                         # Beat 3 security props (intentional, labeled)
│   ├── codeql-bait/              # A planted bug for CodeQL to find on stage
│   └── secret-scanning-trap/     # Fake-but-realistic secrets for the Security tab
└── prompts/                      # Copy-paste prompts for each tool
    ├── 01-m365-copilot-agent.md
    ├── 02-copilot-studio-agent.md
    ├── 03-claude-code-subagents-and-skills.md
    └── parallel-spec-fleet.md    # Stage-handout reading for the /parallel-spec-fleet skill
```

---

## Quick start

```bash
git clone https://github.com/timothywarner-org/pluralsight-author-talk-ai-agents.git
cd pluralsight-author-talk-ai-agents/app
npm install              # installs @playwright/test (the only real dependency)
npm run dev              # serves public/ on http://localhost:3000 via serve
npm run test:install     # one-time: chromium install for Playwright
npm test                 # runs every spec in app/tests/
```

There is **no build step and no lint step**. The app has no backend. Enrollment data lives in `sessionStorage`. Nothing leaves the browser.

---

## Following along

- **New to the whole idea?** → start with [`agent.html`](./agent.html) and [`WHAT_IS_AN_AGENT.md`](./WHAT_IS_AN_AGENT.md), the "What Is An Agent" conceptual opener.
- **Want the prompts to recreate every demo?** → [`prompts/`](./prompts/)
- **Want the subagent definitions?** → [`.claude/agents/`](./.claude/agents/)
- **Want the Skill that drives the single-flow Playwright loop?** → [`.claude/skills/playwright-spec-generator/`](./.claude/skills/playwright-spec-generator/) (includes executable helpers under `scripts/` and reference docs under `reference/`)
- **Want to fan the subagents across multiple flows at once?** → [`.claude/skills/parallel-spec-fleet/`](./.claude/skills/parallel-spec-fleet/) (the `/parallel-spec-fleet` skill; stage-handout reading is [`prompts/parallel-spec-fleet.md`](./prompts/parallel-spec-fleet.md))
- **Want the quality bar that drives Copilot Coding Agent and PR Reviewer?** → [`.github/copilot-instructions.md`](./.github/copilot-instructions.md)
- **Want issues you can assign to `@copilot` to watch it work?** → check the [open issues](../../issues) tagged `copilot-ready`.
- **Want to keep learning after the talk?** → [`LEARNING_RESOURCES.md`](./LEARNING_RESOURCES.md) — courses, docs, labs, and reading for every tool covered.

## Security & supply chain

This repo runs the GitHub-native quality gates side-by-side. It's a live reference for what "table stakes" looks like on a 2026 repo:

| Control | Where it lives | What it does |
|---|---|---|
| **CodeQL code scanning** | [`.github/workflows/codeql.yml`](./.github/workflows/codeql.yml) | JS + Actions static analysis on push, PR, and weekly. `security-extended` query suite. |
| **Playwright CI** | [`.github/workflows/playwright.yml`](./.github/workflows/playwright.yml) | Runs every spec on push and PR. Uploads HTML reports as artifacts. |
| **Dependabot** | [`.github/dependabot.yml`](./.github/dependabot.yml) | Weekly grouped PRs for npm + GitHub Actions updates. |
| **Secret scanning** | Repo setting | GitHub-native credential detection. Enabled. |
| **Push protection** | Repo setting | Blocks pushes that contain detected secrets. Enabled. |
| **Security policy** | [`SECURITY.md`](./SECURITY.md) | How to report a real vulnerability. |

> **Heads up - this repo plants defects on purpose.** To make the Security tab worth showing on stage, several things here are deliberately broken and clearly labeled:
>
> - **`app/package.json`** pins **known-vulnerable** npm packages so the Dependabot tab fills with real CVE alerts. **None of those packages are imported by the app** — see the `_dependency_note` field. Do not upgrade them or `npm install` expecting them to be used.
> - **[`demo/codeql-bait/`](./demo/codeql-bait/)** holds a planted bug for CodeQL to surface.
> - **[`demo/secret-scanning-trap/`](./demo/secret-scanning-trap/)** holds fake-but-realistic credentials that trip secret scanning. **Every value is fake** and grants access to nothing.
> - **[`secret-scanning-test.py`](./secret-scanning-test.py)** is a second secret-scanning landmine - a Python Anthropic Messages API console demo that **intentionally hardcodes a fake, Anthropic-style API key** (currently an empty string) so GitHub Advanced Security has another credential pattern to flag. **Every value is fake** and grants access to nothing.
>
> If you fork this repo as a starting point, **delete `demo/`, delete `secret-scanning-test.py`, and reset `app/package.json`'s `dependencies` block** before you build anything real.

---

## About

Tim Warner is a Principal Staff Author at Pluralsight, a Microsoft MVP for Azure AI, and a 28-year enterprise technology instructor. He has built 200+ Pluralsight courses watched by over a million learners. Find him at [TechTrainerTim.com](https://techtrainertim.com) or on [Pluralsight](https://app.pluralsight.com/profile/author/tim-warner).

## License

MIT — see [LICENSE](./LICENSE).
