---
status: waiting
state: full
reviewedAtStep: "03"
---

[← PLAN](../_plan_001.md)

## Description
Originally this step defined a validated YAML options contract (D2/D3). During step-03 discussion the user rejected that approach: a curated, validated surface for values that are frozen anyway costs ~7 code touchpoints per new key (type, validation branch, defaults machinery, curated-key list, alias list, consumption, tests) and is machinery for nothing on a private, single-site, identity-frozen plugin. **Decision revised mid-step: configuration is code (D2′).** All embed-facing values become compile-time constants in the plugin; the YAML options block is removed; the factory rejects any supplied options as a residual fail-loud guard. D3 is retired — with no runtime options contract there is nothing to validate — keeping only a one-time empirical proof of the residual guard. Step scope shrank accordingly; the step keeps its filename for link stability.

## High-Level

### Intended outcome
- `src/remark42-config.ts` is the single configuration SSOT: `REMARK42_HOST`, `REMARK42_SITE_ID`, `REMARK42_THREAD_BASE_URL` (frozen per D4, rationale in its JSDoc), `REMARK42_NO_FOOTER`, `REMARK42_CUSTOM_PROPERTIES`, `REMARK42_CONFIG_PASSTHROUGH` (merged last by step 05).
- The `quartz.config.yaml` plugin entry carries `layout` only — no `options` block. Quartz passes `undefined` to the factory (verified in `buildLayoutForEntries`: absent/empty options → `undefined`).
- The factory is typed for no meaningful options and throws with a message naming the constants file if an options block is ever supplied again — accidental reintroduction of YAML configuration fails the build instead of being ignored.
- Generated HTML contract unchanged from step 02 (byte-identical behaviour preserved).

### Local invariants
- `REMARK42_THREAD_BASE_URL` is frozen; changing it is a D4-level event. The rationale (threads keyed by page URL → silent orphaning of comment history) lives in the constant's JSDoc, replacing YAML visibility as the carrier of that knowledge.
- `theme` and `components` remain reserved for step 06; loader-control fields (`__colors__`, `styles`, `onReveal`) remain step 05's serialization concern. Neither group may be added to the passthrough constant ad hoc.
- No validation code exists: no spec table, no unknown-key rejection, no documented-key allowlist, no schema. Compile-time typing is the only guard on values.

### Should NOT be done in this step
- Serialization of constants into `remark_config` / iframe params (step 05).
- Theme or embed-loading decisions (step 06).
- Tests / README (step 07), styling (step 08), new Remark42 features of any kind.
- Modification of Quartz's loader.

## Discussion & Reflections

1. **The fail mechanism** *(superseded in intent by D2′; the mechanism question survives only for the residual guard)*. Quartz catches plugin instantiation errors and continues, so "throw and hope" is not a plan. Resolved from source inspection: the component factory during layout construction (`buildLayoutForEntries → componentRegistry.instantiate`) has no local catch; module-import errors can be swallowed by `componentLoader`; render-time errors reach `trace()` → `process.exit(1)`. The residual guard throws at the factory — the same verified-candidate throw point — and step 05 of this doc proves its exit empirically once, closing D3's original open question.
2. **Where defaults live** *(moot under D2′; recorded for the loader-behaviour knowledge)*. Recommendation (a) was built on a false premise and disproven: `manifest.defaultOptions` is never merged for component-only plugins — `buildLayoutForEntries` passes only `{...entry.options, ...tsOverrides}` to the factory. Defaults became code constants under the original plan; under D2′ everything is a constant anyway.
3. **Typo detection inside the passthrough** *(superseded by D2′)*. The 15-key documented-key allowlist (`docs/remark42/docs/configuration/frontend/_index.md`) was resolved to (c) per user input, then dropped entirely: it was the most rot-prone list and only produced non-fatal warnings. Accepted consequence: a typo'd passthrough key is silently ignored by Remark42 — which is Remark42's own behaviour for unknown keys.
4. **Is `threadBaseUrl` an option at all?** *(resolved (a) originally; moot under D2′, rationale carried)*. Remark42 keys threads by the page URL handed to the widget: `id → ${threadBaseUrl}/${id}` → widget `url` → storage key. Deriving from site `baseUrl` would orphan the entire comment history on a domain change. The value is now a constant whose JSDoc carries the frozen-URL invariant — the visibility concern moved from YAML into code documentation.
5. **USER INPUT (decision of record):** "Hardcode everything." Driven by: values never change (D4 freezes the URL; host/siteId mirror `/etc/remark42.env`), fail-loud becomes free at compile time, the multi-place maintenance problem disappears, and the D1 workflow already requires an explicit plugin rebuild for any change.

_Reflection:_ (optional — compact notes from the user)

## Implementation [WRITTEN AT THE STEP 03]

### 01 - Create The Configuration SSOT
- [x] Add `src/remark42-config.ts` with domain-prefixed constants: `REMARK42_HOST`, `REMARK42_SITE_ID`, `REMARK42_THREAD_BASE_URL`, `REMARK42_NO_FOOTER`, `REMARK42_CUSTOM_PROPERTIES`, `REMARK42_CONFIG_PASSTHROUGH`. File header explains the configuration-is-code decision and the D1 rebuild workflow; the thread-URL constant's JSDoc carries the frozen-URL rationale; a local scalar type constrains passthrough/custom-property values.
- [x] Document the reserved groups in the passthrough constant's JSDoc: `theme`/`components` (step 06), loader-control fields (step 05). No validation code, no spec table, no allowlist.
- [x] Do not wire the not-yet-consumed constants (`no_footer`, `custom_properties`, passthrough) into the component — step 05 owns their serialization. No unused imports in `index.tsx`.

### 02 - Rewire The Component Factory
- [x] Replace the step-02 `Remark42Options` type and presence guard: the factory is typed `QuartzComponentConstructor<Record<string, unknown> | undefined>` and throws on any supplied options, with the error naming the constants file and the rebuild requirement. No-options factory call sites remain valid (loader passes `undefined`).
- [x] Use the three consumed constants (`REMARK42_HOST`, `REMARK42_SITE_ID`, `REMARK42_THREAD_BASE_URL`) directly at their usage sites. Leave `comment-id`, opt-out behaviour, thread URL construction, markup, CSS and the placeholder browser script unchanged — step 04 and 05 own those.
- [x] Keep the `remark42-config.js` import specifier (tsc/NodeNext + esbuild-compatible, since `dist/` is committed).

### 03 - Remove The YAML Options Block
- [ ] Delete the `options:` block from the `remark42` entry in `quartz.config.yaml`; keep `source`, `enabled` and the `layout` block untouched.

### 04 - Rebuild And Check The Package
- [ ] Explicitly rebuild the plugin (`npm run build` inside `custom-plugins/remark42/`) and include the regenerated tracked `dist/` in the step's changes. Site generation must not compile the plugin automatically.
- [ ] Run `npm run check` and `npm test`; fix failures attributable to this change without rewriting unrelated files. Use actual package scripts, not the command reference's pre-step-02 hook descriptions.

### 05 - Verify The Build And The Residual Fail-Loud Path
- [ ] Run bare `npx quartz build` and inspect freshly generated `remark42-shell-test.html`: thread URL and container contract unchanged; a non-commentable page has no container. A successful exit alone is not proof.
- [ ] One-time residual proof (closes D3's mechanism question): temporarily add an options block (e.g. `host: bad`) to the `remark42` YAML entry, run bare `npx quartz build`, capture the non-zero exit code and the diagnostic naming the constants file, then restore the exact no-options state. If the build does not abort, stop and discuss — do not patch Quartz or move the throw without approval.
- [ ] Record what actually ran, its result and any pending checks. This session has no shell tool; user-run output is required for empirical verification. Do not mark unexecuted checks complete or claim a deployment was verified.

### 06 - Record Deviations And Downstream Handoff
- [ ] Record implementation deviations and verification results below, keeping source inspection distinct from observed build results.
- [ ] Handoffs: step 05 consumes all six constants and owns merge order (curated win, passthrough merged last, loader-control fields handled before query serialization); step 06 owns `theme`/`components`; step 07 replaces the planned option-regression suites with constants-contract material and drops the allowlist mention; step 08 fills `REMARK42_CUSTOM_PROPERTIES`.

## Decisions For Completion
- **D2′ (configuration is code)** and **D3 retirement** are already recorded in the phase plan — the step's main artifact is confirming they hold in implementation.
- The empirically demonstrated residual-guard exit: closes D3's original open throw-point question.
- `remark42-config.ts` as SSOT naming/shape: candidate for the plugin README (step 07).
- USER INPUT: during Completion Run #1, decide which items to retain in the phase plan, hand off to the README, or remove.

## Caught Implementation Deviations
- Preparation replaced the validated-options contract with D2′ (configuration is code). Discussions 2–3 of the original step are superseded, not implemented; Discussion 1 survives only as the residual-guard verification.
- None from implementation yet.

## Steps Alignment Check
- Preparation reviewed steps 04–08 against the revised contract: step 04 (identity) is unaffected — it operates on frontmatter, not options; step 05's serialization now consumes constants instead of validated options (merge-order ownership unchanged); step 06's theme/embed ownership unchanged; step 07's planned option tests need re-scoping at that step. Post-implementation review is still pending.

## Completion Flow

### Run #1
- [ ] Review `Decisions For Completion` with the user. The user decides what belongs in the phase plan, what is handed off to module documentation, and what can be removed.
- [ ] Apply the approved extractions and remove the decisions block. Keep verification evidence and caught deviations available for later steps.
- [ ] Confirm implementation, required checks and downstream alignment are complete. Only then set `status: implemented`; retain `state: full` until condensation.
- [ ] **STOP.** Do not perform Run #2 in the same pass.

### Run #2
- [ ] Condense the step into a short record of what was built, actual verification, caught implementation deviations and downstream handoffs.
- [ ] Remove obsolete discussion, temporary investigation notes and the execution checklist without losing load-bearing decisions or pending limitations.
- [ ] Set `state: condensed`; update `reviewedAtStep` only for a meaningful whole-step review.
