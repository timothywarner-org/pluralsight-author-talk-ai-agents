# Parallel Spec Fleet

> **Reading copy for the talk.** The live, invokable skill is the source of truth
> at `.claude/skills/parallel-spec-fleet/SKILL.md`. Invoke it in Claude Code with
> `/parallel-spec-fleet`. Make edits to the `.claude/` copy, not this one — this
> file is a stage handout and is not auto-discovered as a skill.

A one-command orchestration that puts **multiple subagents to work at the same time** against this app, then funnels their output through the real handoff contract. Built for the live Author Talk: it makes the fleet visible.

## What this skill is for

- **The demo:** show three subagents (`test-writer`, `qa-reviewer`, `security-reviewer`) working concurrently, not single-file.
- **The work:** generate and verify Playwright coverage for several flows of the AI Skill Path Picker in one pass instead of one flow at a time.

## What this skill is NOT for

- A single flow. For one spec, just invoke `test-writer` directly and let it run `playwright-spec-generator`.
- Anything needing a backend. This app has none — there is no network call anywhere.

## The cast (read their contracts before dispatching)

| Subagent | Job | Never does |
|---|---|---|
| `test-writer` | Writes ONE `.spec.js` per flow via the `playwright-spec-generator` skill. `data-testid` selectors only. | Run tests. |
| `qa-reviewer` | Runs a spec, audits it, returns `APPROVED` or `REJECTED` with line-cited defects. | Edit specs. |
| `security-reviewer` | Hunts the `confirm.js` `innerHTML` smell and similar issues. | Touch app behavior. |

The handoff strings are load-bearing. `test-writer` ends with `SPEC WRITTEN / COVERAGE / HANDOFF TO: qa-reviewer`. `qa-reviewer` ends with `APPROVED` or `REJECTED / HANDOFF TO: test-writer`. Do not let one agent do another's job.

## Procedure

### Step 0 — Preflight

1. Confirm the dev server is up at `http://localhost:3000`. If not, ask Tim to run `cd app; npm run dev` in a separate terminal (or `! npm run dev` in-session).
2. Inventory the selector surface ONCE so every `test-writer` shares the same ground truth:
   ```bash
   node .claude/skills/playwright-spec-generator/scripts/scan-testids.mjs app/public
   ```
   Keep this table; pass it to each `test-writer` so none of them re-scan or hallucinate selectors.

### Step 1 — Pick the flows to fan out

Default fleet (three flows, all backed by real `data-testid`s):

| Flow | testids it exercises | Crosses pages? |
|---|---|---|
| `enroll-happy-path` | path card → `full-name-input`, `email-input`, `role-select`, `selected-path`, `submit-enroll` → `confirm-*`, `confirmation` | Yes (needs a POM) |
| `enroll-form-validation` | `enroll-form`, `email-input`, `form-error` (and assert NO navigation to confirm) | No |
| `path-selection-carryover` | the four `enroll-*` cards on `index.html` → `selected-path` on enroll | Yes |

Let Tim override the list. If he names a flow whose control has no `data-testid`, that is the teaching moment — the dispatched `test-writer` will STOP and ask to add the attribute. Do not paper over it.

### Step 2 — Fan OUT test-writer (the parallel beat)

Dispatch one `test-writer` subagent **per flow, in a single message with multiple Agent tool calls** so they run concurrently. This is the visible parallelism — three agents drafting three specs at once.

Each dispatch prompt must include:
- The flow name and a plain-language description of the journey.
- The shared `data-testid` table from Step 0.
- The instruction: "Follow the `playwright-spec-generator` skill. Selectors are `data-testid` only. Do not run the tests. Return your `SPEC WRITTEN / COVERAGE / HANDOFF TO: qa-reviewer` line."

Collect each agent's handoff line. If any `test-writer` halts asking for a missing testid, surface that to Tim verbatim — it is a feature of the demo, not a failure.

### Step 3 — Pipe each spec to qa-reviewer (concurrent verify)

As specs land, dispatch one `qa-reviewer` per spec — again **concurrently**, one message, multiple Agent calls. Each reviewer runs its own spec:
```bash
cd app && npx playwright test ../tests/<flow>.spec.js --reporter=list
```
and returns `APPROVED` or `REJECTED` with line-cited defects.

Use a pipeline mindset, not a barrier: a spec that finishes review first does not wait for its siblings. If a spec is `REJECTED`, route the defect list back to a fresh `test-writer` for that one flow only — leave the approved specs alone.

### Step 4 — Run security-reviewer in parallel (independent track)

In the SAME parallel wave as Step 2 or Step 3 (it has no dependency on the specs), dispatch `security-reviewer` against the app's known smell:
```
Review app/public/scripts/confirm.js for DOM-injection / XSS-shaped issues.
Report severity and cite file:line. Do not edit app behavior.
```
It should surface the empty-state `innerHTML` render. This proves the fleet does more than one KIND of work at once: authoring, verifying, and securing.

### Step 5 — Synthesize the board

Report a single status table back to Tim:

| Flow / track | Subagent chain | Status |
|---|---|---|
| enroll-happy-path | test-writer → qa-reviewer | APPROVED / REJECTED |
| enroll-form-validation | test-writer → qa-reviewer | … |
| path-selection-carryover | test-writer → qa-reviewer | … |
| confirm.js security | security-reviewer | finding(s) |

Only after every chain reads APPROVED (and the security finding is acknowledged) is the branch ready to commit.

## Guardrails

- **Parallel where independent, sequential where dependent.** test-writer instances are independent (fan out). A given spec's qa-reviewer depends on that spec existing (per-flow chain). security-reviewer is independent of all of them.
- **Do not let a subagent cross lanes.** test-writer never runs tests; qa-reviewer never edits; security-reviewer never changes behavior.
- **Do not fix landmines silently.** The `confirm.js` `innerHTML`, the vulnerable `dependencies`, the CodeQL bait, and the planted secrets are intentional. Surface, never auto-remediate, unless Tim explicitly asks for a remediation demo.
- **Selectors are `data-testid` only.** This is the rule the whole fleet defends.

## Quickref

| Need | Move |
|---|---|
| Inventory selectors once | `scan-testids.mjs app/public` |
| Fan out authors | N× `test-writer` in ONE message |
| Verify concurrently | N× `qa-reviewer` in ONE message |
| Security track | 1× `security-reviewer`, same wave |
| Re-author on reject | fresh `test-writer` for that flow only |
