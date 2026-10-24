---
status: waiting
state: high-level
reviewedAtStep: ""
---

[← PLAN](../_plan_001.md)

## Description
Makes the rewrite defensible long-term: tests that fail when a locked decision regresses, a plugin README that is the single source of truth, and removal of the stale planning artifacts the README replaces.

## High-Level

### Intended outcome
- Tests cover the decisions that would otherwise rot silently: no-container no-op, single-instance lifecycle, viewport gating, thread-URL construction, id validation, options validation, container markup.
- Tests import the source directly. With no `dist/`, they cannot pass against stale output — a class of false green disappears by construction.
- A plugin README that answers, without reading code: what this is, the frontmatter contract, the option table, the loading behaviour, "there is no build step and here is why", how to verify locally, how to upgrade Remark42 (re-capture the fixture), and how to roll back.
- Stale artifacts removed: `PLAN.md`, `REMARK42.md`, the shell test note, and the `custom-plugins/README.md` rows this phase falsified.
- `AGENTS.md` matches reality: `id` as the comment key, no build step for local plugins, and the scope freeze.

### Local invariants
- Tests never touch the network and never require a build step.
- They run under the repo's existing runner, so "green" means the same thing everywhere.
- Documenting Remark42 is a link, not a copy — the vendored docs stay the reference.

### Should NOT be done in this step
- Visual polish (step 08).
- Any new behaviour or feature.
- Re-deciding anything already locked in the plan.

## Discussion & Reflections

1. **Test file shape.** The current tests load `dist/`, which will no longer exist.
   - (a) Keep `.mjs` tests and load source through a TypeScript loader — works, but an odd mix.
   - (b) Write `.ts` tests that import `../src/*.ts` directly and run under the repo's existing runner.
   - (c) Split into two suites, one per half of the plugin.
   - **Recommend (b).**

2. **Is the plugin suite part of root `npm test`?**
   - (a) Stays separate via `npm --prefix … test`.
   - (b) Included in root `test`, so the repo's green means the plugin is green.
   - (c) CI-only.
   - **Recommend (b)** — otherwise a broken plugin is "green".

3. **What happens to the old planning artifacts.**
   - (a) Delete `PLAN.md` and `REMARK42.md` now — their own header says they are safe to delete once this plan is executed.
   - (b) Move them into `artifacts/` and delete at phase close.
   - (c) Keep them.
   - **Recommend (a).**

4. **How far the `AGENTS.md` update goes.**
   - (a) Only the Remark42 section.
   - (b) Remark42 section plus the "local plugins have no build step" rule.
   - (c) Leave `AGENTS.md` alone.
   - **Recommend (b)** — both are architectural invariants now, and section 99 exists precisely to prevent drift.

_Reflection:_ (optional — compact notes from the user)
