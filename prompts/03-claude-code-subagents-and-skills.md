# Prompt 3 — Create Claude Code Subagents and Skills

Use this with **Claude Code** in your terminal, pointed at this repository. You'll create the three subagents (`test-writer`, `qa-reviewer`, `security-reviewer`) and the `playwright-spec-generator` Skill that drives the agentic loop in the demo.

> The agent ladder doesn't end at no-code. This rung is code-level agent orchestration with subagents, Skills, and context discipline.

---

## Prompt 3A — Create the three subagents (if starting from scratch)

If the `.claude/agents/` folder isn't already populated, paste this into Claude Code:

```
You are setting up the Claude Code agent fleet for this repository, which is
the AI Skill Path Picker demo app for a Pluralsight Author Talk.

Create three subagents under .claude/agents/, each as a separate markdown
file with YAML frontmatter. The frontmatter MUST include:
- name (lowercase, hyphenated)
- description (one paragraph — when to invoke this agent)
- tools (comma-separated list — give each agent the minimum tools needed)
- model: sonnet

Subagent 1 — test-writer.md
  Role: writes Playwright end-to-end specs for the app.
  Tools: Read, Write, Edit, Bash, Glob, Grep
  Behavior:
    - Reads .github/copilot-instructions.md before writing.
    - Uses data-testid selectors only.
    - Writes a Page Object Model under tests/pages/ when the flow spans
      multiple pages.
    - Outputs one .spec.js file plus a handoff message to qa-reviewer.
    - Does NOT run the tests itself.

Subagent 2 — qa-reviewer.md
  Role: adversarial reviewer for specs produced by test-writer.
  Tools: Read, Bash, Glob, Grep
  Behavior:
    - Runs the spec with `npx playwright test`.
    - Audits selectors, independence, waits, coverage, honesty.
    - Returns either APPROVED or REJECTED with line-level defects.
    - Does NOT edit specs. Kicks back to test-writer.

Subagent 3 — security-reviewer.md
  Role: static security review of pending changes.
  Tools: Read, Glob, Grep, Bash
  Behavior:
    - Scans for hardcoded secrets, XSS surface, sensitive data in client
      storage, external link safety, dependency risk.
    - Returns findings ranked BLOCKER / HIGH / MEDIUM / LOW / INFO.
    - Does NOT auto-fix. Reports verdict: BLOCK / CONDITIONAL / APPROVE.

After creating all three files, list them with `ls .claude/agents/` and
confirm each one passes a basic YAML parse.
```

---

## Prompt 3B — Create the Playwright Skill

After the subagents exist, create the Skill that `test-writer` will invoke as its procedural recipe:

```
Create a Skill under .claude/skills/playwright-spec-generator/SKILL.md.

The Skill is a step-by-step recipe for generating a Playwright spec from a
described user flow. It must include:

1. Frontmatter with name and description (the description must explain when
   to invoke this Skill — it triggers any time a Playwright test is needed
   for the AI Skill Path Picker app).

2. A "When to use" and "When NOT to use" section.

3. A six-step Procedure:
   - Step 1: Read .github/copilot-instructions.md and the playwright.config.js
   - Step 2: Identify the data-testid surface in the HTML pages the flow
     touches. If a needed control has no data-testid, STOP and ask the main
     agent to add one.
   - Step 3: Draft the Page Object (if the flow spans pages).
   - Step 4: Draft the spec using a provided skeleton.
   - Step 5: Run the spec with `npx playwright test`.
   - Step 6: Hand off to qa-reviewer with the protocol "SPEC WRITTEN: <file>".

4. An "Anti-patterns to refuse" section listing the specific patterns the
   spec must NOT contain (page.waitForTimeout, CSS class selectors,
   getByText, test.only, etc.).

Reference this Skill by name from test-writer.md so the subagent knows to
invoke it as its working procedure.
```

---

## Prompt 3C — The headline demo prompt (this is what runs on stage)

Once the subagents and Skill exist, this is the one prompt that runs the entire 18-minute agentic-loop beat in the talk:

```
Generate Playwright end-to-end smoke tests for the /enroll flow in this
repository.

Coverage required:
  Happy path
    - Land on index.html
    - Click "Enroll" on the "Claude Code for Professional Developers" path
    - Fill the form with valid data
    - Submit
    - Land on confirm.html
    - Confirm all four fields render correctly

  Negative paths
    - Submit empty form → expect error banner
    - Submit invalid email → expect error banner
    - Submit without selecting a role → expect error banner

Use the test-writer subagent for spec generation.
Use the qa-reviewer subagent for adversarial review BEFORE committing.
If qa-reviewer rejects, route back to test-writer with the defect list.
Continue the loop until qa-reviewer APPROVES.
Then run the security-reviewer subagent against the final spec and the
sessionStorage handling in scripts/enroll.js.

Stop and report after all three agents have signed off.
```

That single prompt drives the entire loop. Narrate while it runs.

---

## Prompt 3D — Context discipline (the bit nobody talks about)

While the loop is running, drop this into a side panel as a slide:

```
The four moves that keep an agentic loop honest:

1. /context        — see what's in the window right now.
2. /compact        — when usage > 60%, force a summarization.
3. Subagent boundaries — each subagent gets a clean window. That's the
                         single biggest reason long loops succeed.
4. CLAUDE.md       — repository-level memory that survives every compact.

Skip these and your loop will get smarter for ten minutes, then drift,
then start fabricating selectors. Context discipline is the difference
between a demo and a system.
```

That's the takeaway slide for Beat 2.
