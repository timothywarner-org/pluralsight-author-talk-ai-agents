# Learning Resources

Companion reading for the Pluralsight Author Talk on **M365 Copilot, Claude Code, and GitHub Copilot**. The talk is a 60-minute flyover. This file is the runway for everything you saw, organized the same way the talk is: by the three beats, with a foundations section first.

Every link below is either an official primary source or a hands-on lab. Pluralsight courses are flagged with **(Pluralsight)**. Free, no-login resources are flagged **(free)**. When two resources teach the same thing, the one listed first is the one to start with.

> **A note on durability.** Vendor docs move. If a deep link 404s, search the doc home page listed at the top of each section for the current path. The home pages are the stable anchors.

---

## Foundations - prompt and context engineering

Start here regardless of which tool you reach for. The agentic tools below all reward the same underlying skill: writing instructions a model can act on without you in the loop.

| Resource | Type | Why |
|---|---|---|
| [Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) | Docs (free) | The canonical primer, with a "prompting best practices" page for model-specific tuning. |
| [Context Engineering with MCP](https://www.oreilly.com/) | O'Reilly Live Training | Tim's live course on feeding agents the right context at the right time via the Model Context Protocol. Search the O'Reilly catalog for the next scheduled date. |
| [Model Context Protocol - Introduction](https://modelcontextprotocol.io/) | Docs (free) | What MCP is, why it exists, and how tools, resources, and prompts compose. The spec is readable in one sitting. |
| [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook) | Repo (free) | Runnable notebooks for tool use, structured output, RAG, and evaluation patterns. |

---

## Beat 1 - The Agent Ladder (M365 Copilot, Copilot Studio)

The lowest rung is a custom-instruction agent in M365 Copilot Chat. The next rung is a declarative agent built in Copilot Studio. The prompts that drive this beat live in [`prompts/01-m365-copilot-agent.md`](./prompts/01-m365-copilot-agent.md) and [`prompts/02-copilot-studio-agent.md`](./prompts/02-copilot-studio-agent.md).

**Doc home:** [Microsoft Copilot Studio documentation](https://learn.microsoft.com/en-us/microsoft-copilot-studio/)

| Resource | Type | Why |
|---|---|---|
| [Declarative agents for Microsoft 365 Copilot - overview](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-declarative-agent) | Docs (free) | The architecture of a declarative agent: instructions, knowledge, actions. Read this before you build one. |
| [Agent Builder in Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder) | Docs (free) | The no-code builder Tim used live. Fastest path from idea to running agent. |
| [Add knowledge sources to your declarative agent](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-add-knowledge) | Docs (free) | How to ground an agent in SharePoint and public content - the move that makes a custom agent actually useful. |
| [Introduction to tools for declarative agents in Copilot Studio](https://learn.microsoft.com/en-us/training/modules/introduction-copilot-studio-actions/) | Learn module (free) | Guided, hands-on. Pairs actions and connectors with a declarative agent. |
| [Microsoft Copilot Studio](https://app.pluralsight.com/profile/author/tim-warner) | **(Pluralsight)** | Tim's deeper Copilot Studio coverage. Check the author page for the current course list. |

---

## Beat 2 - The Headliner (Claude Code)

Subagents, Skills, plugins, and the agentic loop on real engineering work. This is the rung where the demo app in `app/` and the agent fleet in `.claude/` come alive. The prompts are in [`prompts/03-claude-code-subagents-and-skills.md`](./prompts/03-claude-code-subagents-and-skills.md).

**Doc home:** [Claude Code documentation](https://code.claude.com/docs/en/overview)

| Resource | Type | Why |
|---|---|---|
| [Create custom subagents](https://code.claude.com/docs/en/sub-agents) | Docs (free) | The exact mechanism behind `.claude/agents/` in this repo. Frontmatter fields, tool scoping, when to reach for a subagent. |
| [Extend Claude with skills](https://code.claude.com/docs/en/skills) | Docs (free) | What a Skill is and how it differs from a subagent. The `playwright-spec-generator` Skill in this repo is a worked example. |
| [Claude Code settings and configuration](https://code.claude.com/docs/en/settings) | Docs (free) | Hooks, permissions, allowed tools. The wiring that makes an agent fleet safe to let run. |
| [Claude Code best practices](https://code.claude.com/docs/en/best-practices) | Docs (free) | Anthropic's own field guide. Context discipline, the explore-plan-code-commit loop, and when to use plan mode. |
| [Building effective agents](https://www.anthropic.com/research/building-effective-agents) | Article (free) | The conceptual backbone: workflows vs agents, and why simple compositions beat clever frameworks. |
| [Claude Code: An Agentic Approach](https://app.pluralsight.com/profile/author/tim-warner) | **(Pluralsight)** | Tim's Claude Code coverage. See the author page for the current title and module list. |

**Practice in this very repo.** The fastest way to internalize Beat 2 is to run the loop yourself:

1. Start the app: `cd app && npm run dev`.
2. Ask Claude Code to test a flow (for example, the enroll form's validation).
3. Watch `test-writer` write a spec, then `qa-reviewer` run it and critique. The handoff contract is documented in [`CLAUDE.md`](./CLAUDE.md).

---

## Beat 3 - The Fleet (GitHub Copilot Coding Agent and PR Reviewer)

One instructions file governs every PR Copilot opens or reviews. In this repo that file is [`.github/copilot-instructions.md`](./.github/copilot-instructions.md). The same beat showcases the GitHub-native security trio (CodeQL, Dependabot, secret scanning), seeded with the intentional landmines documented in the [README](./README.md#security--supply-chain).

**Doc home:** [GitHub Copilot documentation](https://docs.github.com/copilot)

| Resource | Type | Why |
|---|---|---|
| [About custom agents (Copilot coding agent)](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-custom-agents) | Docs (free) | What the coding agent is and how it picks up an issue assigned to `@copilot`. |
| [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot) | Docs (free) | How `copilot-instructions.md` and `AGENTS.md` are read. The mechanism behind the hero file in this repo. |
| [Best practices for using Copilot to work on tasks](https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/best-practices-for-using-copilot-to-work-on-tasks) | Docs (free) | How to scope an issue so the coding agent succeeds instead of flailing. |
| [github/awesome-copilot](https://github.com/github/awesome-copilot) | Repo (free) | Community instruction files, agents, and configs. Steal the patterns. |

### Security and supply chain (the trio Beat 3 puts on screen)

**Doc home:** [GitHub code security documentation](https://docs.github.com/code-security)

| Resource | Type | Why |
|---|---|---|
| [About code scanning with CodeQL](https://docs.github.com/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql) | Docs (free) | What CodeQL does and how the `security-extended` suite differs from the default. |
| [About Dependabot](https://docs.github.com/code-security/dependabot/dependabot-alerts/about-dependabot-alerts) | Docs (free) | Alerts vs version updates vs security updates. The `app/package.json` bait in this repo triggers alerts. |
| [About secret scanning](https://docs.github.com/code-security/secret-scanning/introduction/about-secret-scanning) | Docs (free) | Detection, validity checks, and **push protection** - the platform-layer guarantee that blocks a secret at `git push`. |

---

## Where to go next

| You want to | Go to |
|---|---|
| Take a deeper course on any tool above | [Tim's Pluralsight author page](https://app.pluralsight.com/profile/author/tim-warner) |
| Catch a live workshop | [TechTrainerTim.com](https://techtrainertim.com) |
| Watch short, free walkthroughs | [YouTube - @TechTrainerTim](https://www.youtube.com/@TechTrainerTim) |
| Ask a question about this repo | [Discussions](../../discussions) |

Memento mori. Also, ship the PR.
