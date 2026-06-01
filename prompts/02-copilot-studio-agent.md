# Prompt 2 — Build a Copilot Studio Declarative Agent

Use this with **Copilot Studio** (https://copilotstudio.microsoft.com) → **Create → New agent → Configure manually**. Builds a "Release Notes Generator" declarative agent published to Microsoft 365 Copilot.

> The agent ladder, rung 2: a no-code agent with persistent knowledge sources, starter prompts, and a publish-to-org button.

---

## Part A — Pre-flight

Have these ready before you click Create:

- **A SharePoint folder or library** with the last 6 months of release notes (markdown, docx, or PDF — Studio handles all three).
- **A team Loop page or OneNote** with your release-notes voice guide, if one exists.
- **Two or three example release notes** that you would call "best in class." Studio's knowledge ingestion will pattern-match against these.

---

## Part B — The build prompt

Studio offers a "Describe your agent" field on the **Overview** tab. Paste this:

```
Create an agent named "Release Notes Author" for an internal product
engineering team. The agent reads from a SharePoint library of past release
notes and writes new release notes in the team's voice.

The agent should:
- Read merged pull requests, JIRA issues, and prior release notes from the
  connected SharePoint folder.
- Group changes into four categories: New features, Improvements, Bug fixes,
  Breaking changes.
- Write in the team's voice: customer-facing, plain language, no internal
  jargon, no ticket numbers in the public copy.
- Include a one-paragraph headline at the top for the changelog homepage.
- End with an "Upgrade notes" section that lists any required migration steps.

The agent should refuse to:
- Speculate about unreleased features.
- Name specific engineers in the public release notes.
- Generate marketing copy or pricing claims.
```

Studio will turn that into instructions + a starter agent. Edit further in the **Instructions** field.

---

## Part C — Manual configuration (the parts Studio won't auto-fill)

After the agent is generated, set these by hand:

### Knowledge

- **Add SharePoint** → paste the URL of your release-notes library. Studio crawls and indexes within a few minutes.
- **Add Web search** → ON. Scoped to your public docs site only (Studio lets you whitelist domains).
- **Turn off Public web search** if your release notes contain anything pre-announcement.

### Starter prompts

Paste these four into the **Starter prompts** section (they appear as chips in the chat UI):

1. "Draft release notes for sprint 23 from the merged PRs and Jira items."
2. "Rewrite the latest draft for the public changelog page (plainer language)."
3. "List breaking changes from the last 90 days that need a migration guide."
4. "Compare this draft against the last three releases for tone consistency."

### Actions (optional but high-impact)

If your team has a Power Automate flow that posts to Confluence or a static-site generator, add it as a **Custom action**. Studio will let the agent invoke it from chat with one click — that's how "draft release notes" becomes "post release notes."

---

## Part D — Publish

- **Test** in the right-hand pane until the four starter prompts all return clean output.
- **Publish** → choose **Microsoft 365** as the channel.
- Tenant admin must approve before it appears in users' Copilot agent list. Tell the admin in advance.

---

## Part E — Where this hands off to Foundry (the one-line name-drop)

This is where you say in the talk:

> "If you need code-level control over the model, schema-enforced outputs, your own model routing, or tool calls that hit private endpoints, the next rung is Microsoft Foundry Agents. Same conceptual model — instructions, knowledge, actions — but you're writing Python or C# instead of clicking. We won't demo it today. Pluralsight has a path on it."

That's the entire Foundry mention. Don't open a portal. Don't write code. Twenty seconds, then move on to Claude Code.
