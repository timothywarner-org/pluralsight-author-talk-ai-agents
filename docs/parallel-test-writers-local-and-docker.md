# Plan: Two parallel test-writer agents — local app + dockerized app

> Status: **proposed, not implemented.** This is a design doc saved for later execution.

## Context

The goal is to demonstrate **two `test-writer` subagents running in parallel** against the AI Skill Path Picker demo app: one covering the plain static app, one covering a **dockerized** version of the same app. Today the repo has **no Docker setup at all** (verified: no Dockerfile, no compose, no devcontainer). The existing Playwright config hardcodes `npx --yes serve public -l 3000` as its `webServer`, and only one spec exists (`enrollment-flow.spec.js`).

Decisions taken during planning:
- **Docker target:** create a real `Dockerfile` (+ optional compose) that serves `app/public` on port 3000, then a spec that runs against the container.
- **Agent split:** by flow / clean lanes. Agent A owns local-app coverage, Agent B owns container-specific coverage. Different files = safe true parallelism.

The payoff is a stage-ready demo: two agents fan out concurrently, write non-colliding specs, hand off to `qa-reviewer`, and prove the app behaves identically served by `serve` locally and by a container. This is the **parallel-spec-fleet** story, extended to a containerized environment.

## Why this is interesting for the talk (the Playwright angle)

Playwright earns its keep here in three distinct ways, and each maps to a lane:

| Use case | Lane | What it demonstrates |
|---|---|---|
| **DOM-level functional coverage** | Agent A (local) | `getByTestId` selectors, form validation guards, golden path — classic E2E. |
| **Environment parity / container smoke** | Agent B (Docker) | The *same* assertions pass whether the app is served by `serve` or by a container. Playwright's `baseURL` + `webServer` abstraction means the spec doesn't care how the bytes arrive. |
| **Reproducible CI runner** | both, in CI | The official `mcr.microsoft.com/playwright` image (already implied by `playwright.yml`) gives byte-identical browser binaries on any machine. |

The teachable moment: **Playwright tests are server-agnostic**. By swapping only the `webServer.command` (serve vs. `docker run`), the identical spec validates both delivery mechanisms. That is the parity argument containers exist to make.

## The one real design decision: how the container spec starts its server

Playwright's `webServer` is global per config run. To let Agent B's spec target a container **without breaking** Agent A's local `serve` flow, gate the server command on an env var. The existing default path (no env var) stays byte-for-byte identical.

**`app/playwright.config.js`** — change `webServer.command`:

```javascript
const USE_CONTAINER = process.env.APP_TARGET === 'container';

// ...
  webServer: {
    command: USE_CONTAINER
      ? 'docker run --rm -p 3000:3000 author-talk-app'   // image built in preflight
      : 'npx --yes serve public -l 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000   // bumped from 30s: container cold-start needs headroom
  },
```

Both specs still hit `http://localhost:3000`, so **no spec needs a different baseURL**. The container just *replaces* the server. This keeps Agent A and Agent B writing ordinary `getByTestId` specs with zero environment branching inside the test code. The smoke spec's job is to prove the *container serves the same app correctly* — extensionless `/confirm` routing, static assets, the golden path — not to test Docker internals.

> Trade-off flagged (technical debt): a single global `webServer` means you run the suite once per target (`APP_TARGET=container npm test` vs `npm test`). For this demo that is fine and is the clearest narration. A fuller solution (per-project `webServer`) is a Playwright feature but adds config noise that buries the lede on stage. Defer it.

## Files to create / modify

### New: `app/Dockerfile`
Minimal, production-honest, multi-line-commented (every line justifies *why*). Serve the **static `public/` only** — the app has no backend by design.

```dockerfile
# Pin a digest-stable slim base. node:20-alpine matches CI's Node 20.
FROM node:20-alpine

# WORKDIR keeps COPY targets explicit and avoids root-of-image clutter.
WORKDIR /app

# Copy only the static surface. The vulnerable deps in package.json are
# intentional Dependabot bait and are NOT imported - so we never npm install
# them into the image. The app is pure static HTML/CSS/JS.
COPY public ./public

# `serve` is the same server Playwright uses locally, so routing (including
# extensionless /confirm) behaves identically. -s would force SPA fallback;
# we deliberately omit it so 404s stay honest, matching local `serve`.
EXPOSE 3000
CMD ["npx", "--yes", "serve", "public", "-l", "3000"]
```

> Decision: reuse `serve` inside the container rather than nginx. Reason: **routing parity**. The whole point of the smoke spec is "same behavior as local"; using the identical server removes a confound (nginx would need its own rewrite rules to match `serve`'s extensionless routing, reintroducing the very bug class the repo's routing fix already solved).

### New (optional): `app/docker-compose.yml`
Convenience wrapper so the demo can say `docker compose up`:
```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
```

### New: `app/.dockerignore`
Keep the image lean and avoid leaking the landmine deps / Drive junk:
```
node_modules
tests
playwright-report
test-results
**/desktop.ini
package-lock.json
```

### Modify: `app/playwright.config.js`
The `USE_CONTAINER` gate above, plus `webServer.timeout` bump to 60s. No change to `testDir`, `baseURL`, or the existing chromium project.

### New spec (Agent A): `app/tests/enroll-validation.spec.js`
Negative-path coverage of the four `enroll.js` guard branches that **nothing currently tests** (verified in `enroll.js:37-52`): missing path, name < 2 chars, invalid email regex, missing role. Each asserts the error banner (`data-testid="form-error"`) is shown and **navigation is blocked** (URL still matches `/enroll/`). This is the highest-value local coverage gap.

### New spec (Agent B): `app/tests/container-smoke.spec.js`
Run only when `APP_TARGET=container`. Proves the container serves the real app:
- Home renders `path-list`.
- Extensionless `/confirm` routing resolves (the routing fix from commit `f07c1db`) — the container parity check.
- Golden path enroll → confirm renders correct `confirm-*` fields.
Uses `test.skip(process.env.APP_TARGET !== 'container', ...)` so it is inert in the default local run and only fires under the container target. `data-testid` selectors only.

## Agents and parallelism

Two `test-writer` agents dispatched **in a single message** (true parallel), per `.claude/rules/agents.md` and the parallel-spec-fleet pattern. Clean lanes = no file collision:

- **Agent A** → writes `tests/enroll-validation.spec.js` only. Prompt: local-app negative-path coverage; run `scan-testids.mjs` first; `getByTestId` only; happy path already covered, so focus on the four guard branches; end with the `SPEC WRITTEN / COVERAGE / HANDOFF TO: qa-reviewer` contract. Does **not** run tests.
- **Agent B** → writes `tests/container-smoke.spec.js` only, AND authors `Dockerfile` + `.dockerignore` + optional compose (it owns the container lane end to end). Same selector rules and handoff contract.

> Note on the handoff contract: per the subagent design, `test-writer` writes but does not run. `qa-reviewer` runs. So the agents produce the artifacts; the actual `npm test` / `APP_TARGET=container npm test` verification runs in the qa-reviewer step. Respect that chain rather than having a test-writer self-verify.

> House-rule guardrail: a subagent must not touch `.github/`, `.claude/`, or `prompts/`. The Dockerfile/compose/.dockerignore live under `app/`, so they are in-bounds for Agent B.

## Verification (end to end)

1. **Local lane (Agent A's spec):** from `app/`, `npm test`. Expect existing `enrollment-flow.spec.js` + new `enroll-validation.spec.js` all green; the four guard-branch assertions confirm navigation stays on `/enroll`.
2. **Build the image:** from `app/`, `docker build -t author-talk-app .` Expect a clean build, no `npm install` of the landmine deps.
3. **Container lane (Agent B's spec):** from `app/`, `APP_TARGET=container npm test`. Playwright spins up `docker run`, waits for `:3000`, runs `container-smoke.spec.js`. Expect extensionless `/confirm` to resolve and the golden path to render — parity proven.
4. **Manual sanity:** `docker run --rm -p 3000:3000 author-talk-app`, browse `http://localhost:3000`, click a path, enroll, land on `/confirm`. Confirm identical behavior to `npm run dev`.
5. **Landmines untouched:** confirm `package.json` vulnerable deps, `demo/` traps, and the `confirm.js` `innerHTML` empty-state are unchanged.

## Out of scope (deliberately)
- No nginx, no multi-stage build, no image-size optimization beyond `.dockerignore` (YAGNI for a demo).
- No new npm dependencies; no build step (the app is static by design).
- No edits to `.github/workflows/` — wiring the container lane into CI is a separate story.
- Not "fixing" any intentional landmine.
