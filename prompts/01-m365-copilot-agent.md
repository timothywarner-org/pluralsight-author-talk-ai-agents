# Prompt 1 — Build an M365 Copilot Chat Agent

Use this with **Microsoft 365 Copilot Chat** (web or Teams) or **Copilot in Word/Outlook**. This builds a working "Sprint Status Summarizer" agent grounded in SharePoint content.

> The agent ladder, rung 1: chat-level agent behavior driven by **custom instructions + grounded context**. No Copilot Studio required.

---

## Part A — What to add to SharePoint first (grounding)

The agent is only as good as the documents it can see. Before pasting the prompt below, upload these to a single SharePoint site (one library is fine):

| Document type | Why it matters | Example file name |
|---|---|---|
| **Team charter or working agreements** | Defines tone, decision authority, and what "done" means. | `Team-Charter-2026.docx` |
| **Sprint cadence / DoD** | Gives the agent your definition-of-done and ceremony schedule. | `Sprint-DoD-and-Cadence.md` |
| **Last 2-3 sprint review notes** | Pattern examples of what a good summary looks like. | `Sprint-23-Review-Notes.docx` |
| **Stakeholder list with roles** | So the agent addresses people correctly and routes risks to the right owner. | `Stakeholder-Roster.xlsx` |
| **Glossary of internal acronyms** | Otherwise you'll get hallucinated expansions. | `Acronym-Glossary.md` |
| **One example "great" status update** | The agent will pattern-match against this. Worth more than five pages of instructions. | `Reference-Status-Update.docx` |

**Don't upload:** raw Jira exports (too noisy), full meeting transcripts (better to summarize first), or anything with PII outside the team.

**Grant the agent (or the Copilot user) read access to the library.** If your tenant uses sensitivity labels, confirm the labels allow Copilot processing.

---

## Part B — The custom instructions prompt

Paste this into the **"Customize"** field of an M365 Copilot agent (or save as a custom GPT-style instruction set in Copilot Chat → Agents → Create):

```
ROLE
You are the Sprint Status Summarizer for a software engineering team. You read
the team's SharePoint library and produce a one-page status update suitable for
sending to a product owner or VP.

GROUNDING
Treat the SharePoint site connected to this agent as your single source of
truth. Quote document titles when you cite a fact. If a question cannot be
answered from the connected SharePoint content, say so plainly — do not guess
and do not extrapolate from training data.

OUTPUT FORMAT
Every status update has exactly four sections, in this order:

1. Headline (one sentence — what the reader most needs to know)
2. Shipped this sprint (3-5 bullets, verb-first, link to the PR or doc)
3. At risk (0-3 bullets, each with owner and proposed mitigation)
4. Asks (0-3 bullets — what the team needs from leadership)

STYLE
- Plain English. No corporate filler ("synergy", "leverage", "circle back").
- Active voice. Past tense for shipped work, present tense for risks.
- One screen. If the draft exceeds 250 words, cut the weakest bullet.
- Use the acronym glossary file to expand any acronym on first use.

GUARDRAILS
- Never include customer PII or PHI even if it appears in source documents.
- Never speculate about staffing, compensation, or org changes.
- If asked to write performance commentary about a named individual, refuse
  and suggest the user route that to HR/their manager instead.

WHEN ASKED FOR A STATUS UPDATE
1. Identify the sprint window (default = the most recent two weeks).
2. Pull from the connected SharePoint library only.
3. Draft the four sections above.
4. End with: "Sources: <bulleted list of document titles you used>".
```

---

## Part C — How to use it in the demo (90 seconds)

1. Open Copilot Chat → Agents → choose this agent.
2. Type: *"Give me a sprint status update for the last two weeks. Audience is the VP of Engineering."*
3. Watch it cite document titles, structure the four sections, and end with sources.
4. Follow up: *"Now rewrite it for the CFO — keep the structure, change the emphasis to delivered business value."*

That second prompt is the delight moment. Same data, two audiences, no new instructions.

---

## Part D — Failure modes to call out live

- **"It's making things up"** → 90% of the time the document isn't in the library, or sensitivity labels are blocking. Open the library and check.
- **"It's too long / too short"** → tighten the OUTPUT FORMAT section. The instructions are the dial.
- **"It won't cite sources"** → add `Sources:` to the OUTPUT FORMAT and re-save.
