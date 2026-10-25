---
status: waiting
state: full
reviewedAtStep: "03"
---

[← PLAN](../_plan_001.md)

## Description
Defines the only way the site is allowed to configure the plugin, and makes misconfiguration impossible to ignore. It closes the option surface to a handful of validated keys with a single escape hatch, and puts the defaults in plugin code so the site config only states what differs. (Defaults were originally planned for the manifest; disproven during step research — the Quartz loader never merges `defaultOptions` into component-only plugins — see Discussion 2.)

## High-Level

### Intended outcome
- A closed surface: `host`, `siteId`, `threadBaseUrl`, `no_footer` (default `true`), `custom_properties` (default `{}`), plus `config` merged last.
- A deliberately broken option stops the build with a message naming the key, the expected type and where it came from — a mechanism that has been *verified* to abort, not assumed to. The selected throw point is the component factory during layout construction; its non-zero build exit must still be demonstrated. Module-import errors can be swallowed. Render-time errors reach `trace()`, which exits on the main thread, but validation belongs before rendering (Discussion 1).
- Passthrough values stay scalar, because they are URL-encoded into the iframe `src`.
- `quartz.config.yaml` reads at a glance: no option is present that merely restates a default.

### Local invariants
- `host` is always explicit and absolute. The module's hardcoded fallback (`https://comments.taras.life`) must never be the reason comments work.
- Validation runs once per build, not per rendered page.
- `no_footer` and `custom_properties` are passed through unchanged into the embed configuration.
- Unknown keys inside `config` are allowed — they are for Remark42's future options — and must not shadow curated keys.

### Should NOT be done in this step
- New Remark42 features of any kind.
- Styling or theme work.
- Frontmatter / identity changes (step 04).
- Runtime loading logic (step 06).

## Discussion & Reflections

1. **The fail mechanism.** Quartz catches plugin instantiation errors and continues, so "throw and hope" is not a plan.
   - (a) `console.error` plus a visible message on the page — always visible locally, but a broken deploy can still ship.
   - (b) Throw at module import time — earliest possible, but some loader paths catch import errors.
   - (c) Throw inside the component factory, which runs while the layout is built — likely uncaught, but later.
   - **Recommend:** break one option on purpose, observe all three, then keep the earliest throw that really aborts `quartz build`. Report back if none does.
   - User input: I need to fail loud and hard here. If plugin has issues - it should fail early so it doesn't moves broken into the deployment.
   - **Resolved: (c) — selected from source inspection; empirical proof pending.** `buildLayoutForEntries → componentRegistry.instantiate` has no local catch around the factory call. The registry caches successful instances by constructor/options, avoiding repeated validation across page-type layouts. Module-import errors can be swallowed by the component-only import catch and `componentLoader`. **Correction to the initial research:** a render-time error caught by `runEmitter` calls `trace()`, which invokes `process.exit(1)` on the main thread; it does not merely log and continue. Configuration is evaluated during module loading, so do not assume the factory error passes through `buildQuartz()`'s catch. Verify the actual CLI exit and diagnostic with a deliberately invalid option before calling this mechanism proven.

2. **Where defaults live.**
   - (a) Manifest `defaultOptions` only — SSOT, but the plugin breaks if a default is missing there.
   - (b) Code constants only — works standalone, but the surface is invisible from YAML.
   - (c) Both — two places to keep in sync.
   - **Recommend (a)**, plus a startup assertion that every curated key has a default.
   - **Resolved: (b') — recommendation (a) was built on a false premise and is disproven.** Verified in `buildLayoutForEntries`: the component factory receives only `{...entry.options, ...tsOverrides}` — **`manifest.defaultOptions` is never merged for component-only plugins** (merging exists only for processing-plugin factories and the optional `init()` hook, which itself runs inside a swallowed catch). So manifest defaults would be inert decoration. Defaults live as code constants in `src/remark42-options.ts` (domain-prefixed concern name per DEV_RULES); the "startup assertion" is compile-time: a `CuratedDefaults` type forces every optional curated key into the defaults table, and required keys carry no default by construction. YAML states only what differs — invariant satisfied.

1. **Typo detection inside the passthrough.**
   - (a) Accept anything — flexible, typos are silently ignored by Remark42.
   - (b) Warn on passthrough keys that resemble curated ones.
   - (c) Maintain an allowlist of documented Remark42 keys and warn on anything outside it — safer, but rots as Remark42 evolves.
   - **Recommend (b).**
   - User input - c seems to be safer. if it evolves - it breaks and can be fixed in minutes. Also we curate only those that are used, which is not much. 
   - **Resolved: (c), per user input.** Allowlist = the 15 documented `remark_config` keys from the vendored docs (`docs/remark42/docs/configuration/frontend/_index.md`): `host`, `site_id`, `url`, `components`, `max_shown_comments`, `max_last_comments`, `theme`, `page_title`, `locale`, `show_email_subscription`, `show_telegram_subscription`, `show_rss_subscription`, `simple_view`, `no_footer`, `custom_properties`. Unknown `config` keys → one grouped `console.warn` (non-fatal, they're for Remark42's future). A `config` key that shadows a curated key → throw (escape hatch may not silently override the contract).

1. **Is `threadBaseUrl` an option at all?**
   - (a) Explicit option — portable, and the frozen-URL invariant is visible.
   - (b) Derived from the site's `baseUrl` — less config, couples the plugin to site identity.
   - (c) No option, always the current site URL — breaks the frozen-URL invariant if the domain ever changes.
   - **Recommend (a).**
   - I'm not sure what this is. We need to discuss it and its consequences.
   - **Resolved: (a), after explanation.** Remark42 keys comment threads by the page URL handed to the widget: `frontmatter id → \`${threadBaseUrl}/${id}\` → widget's `url` param → Remark42's storage key`. Deriving from site `baseUrl` means a domain change silently orphans the entire comment history (old threads stay under old URLs, new URLs start empty, nothing warns). Explicit required option (no default — a default would hide the frozen-URL decision, D4) makes the invariant visible in YAML. User accepted.

_Reflection:_ (optional — compact notes from the user)

## Implementation [WRITTEN AT THE STEP 03]

### 01 - Define The Validated Options Boundary
- [ ] Add `src/remark42-options.ts` as the cohesive home for option types, defaults, validation and resolution. Use a domain-prefixed name, documented declarations and explicit exported return types; no new dependency or host-source imports.
- [ ] Model required `host`, `siteId` and `threadBaseUrl`; optional `no_footer`, `custom_properties` and `config`. Validate incoming runtime values rather than trusting the TypeScript annotation.
- [ ] Keep defaults in code only: `no_footer: true`, `custom_properties: {}`, and an empty passthrough when `config` is omitted. Use a compile-time completeness check for the defaulted fields; do not duplicate defaults in the manifest or YAML.
- [ ] Keep validated options available to later component/runtime work without serializing them yet. Step 05 owns browser delivery; step 06 owns runtime behavior.

### 02 - Implement Validation And Safe Passthrough
- [ ] Reject a missing/non-object options block, arrays, null and unknown top-level keys. Required strings must be non-empty; `host` and `threadBaseUrl` must be absolute HTTPS URLs without a trailing slash. Reject invalid values instead of silently rewriting identity-bearing configuration.
- [ ] Validate `no_footer` as a boolean. Validate `custom_properties` as a plain object with scalar values; preserve supplied keys and values without CSS design or property-name filtering.
- [ ] Validate `config` as a plain object whose values are strings, booleans or finite numbers. Reject null, arrays, nested objects and other values that cannot safely satisfy the scalar contract. Apply the same scalar-value rule to `custom_properties`, which is transported separately from iframe query parameters.
- [ ] Reject `config` keys that duplicate curated names or their Remark42 aliases: `host`, `siteId`, `site_id`, `threadBaseUrl`, `url`, `no_footer`, `custom_properties` and `config`. A passthrough `url` must never replace the identity-derived thread URL.
- [ ] Reserve `theme` for Quartz theme synchronization and `components` for the embed-only loading contract. Account for loader-control fields consumed before query serialization (`__colors__`, `styles`, `onReveal`) rather than treating them as ordinary future scalar options.
- [ ] Keep the documented-key allowlist beside validation, with its source reference: `docs/remark42/docs/configuration/frontend/_index.md`. Unknown, non-reserved scalar keys remain allowed and produce one grouped warning per resolution; do not turn the allowlist into a hard gate for future Remark42 options.
- [ ] Preserve the phase's merge-last rule for `config`: validate and reject collisions first, then merge passthrough into embed-facing configuration. Keep plugin names (`siteId`, `threadBaseUrl`) separate from their embed-facing representation; do not invent a page URL or theme here.
- [ ] Errors must name the offending option path, expected shape and the Remark42 options block in `quartz.config.yaml` (or the supplied constructor options). Do not claim an exact source location that Quartz does not provide.

### 03 - Integrate At Component Construction
- [ ] Replace the scaffold's presence guard with a single resolver call inside the `Remark42` factory. Do not validate at module import, in an optional `init()` hook or inside per-page rendering.
- [ ] Use validated `host`, `siteId` and `threadBaseUrl` in the existing scaffold. Leave `comment-id`, opt-out behavior, thread URL construction, markup, CSS and the placeholder browser script unchanged.
- [ ] Keep `quartz.config.yaml` limited to its existing three required settings; add no entries that merely restate defaults. Do not modify Quartz's loader.

### 04 - Rebuild And Check The Package
- [ ] Explicitly rebuild with `npm run build:plugins`; include the generated changes to the already tracked `dist/` output. Site generation must not compile the plugin automatically.
- [ ] Run `npm run check` and `npm test`; fix failures attributable to this change without rewriting unrelated files. The existing command reference contains pre-step-02 descriptions, so use the actual package scripts rather than its obsolete hook instructions.
- [ ] Perform focused development checks of defaults, bad types, top-level typos, reserved aliases, non-scalar passthrough and grouped unknown-key warnings. Permanent option regression suites remain step 07's responsibility.

### 05 - Demonstrate The Actual Build Failure
- [ ] Temporarily make `host` invalid in the real Remark42 YAML options block and run bare `npx quartz build`, not only the root build wrapper. Capture the non-zero exit code and diagnostic naming `host` and its expected type/source; a log message alone is not proof.
- [ ] Restore the exact valid setting even if the experiment fails. If the build succeeds with invalid options, stop and discuss the observed path; do not substitute an import-time throw or patch Quartz without approval.
- [ ] Repeat a representative failure through `npm run build`, confirming that the normal deployment command also rejects the misconfiguration. An unrelated freshness/type failure is not evidence that options validation works.
- [ ] Restore valid configuration and obtain a successful build. Inspect freshly generated `remark42-shell-test.html` for the existing thread URL and container contract, and a non-commentable page for absence of the container. Do not accept only an exit code as proof of component loading.
- [ ] Record what actually ran, its result and any pending checks. This session has no shell tool; user-run output is required for empirical verification. Do not mark unexecuted checks complete or claim a deployment was verified.

### 06 - Record Deviations And Downstream Handoff
- [ ] Record implementation deviations and verified failure behavior below, keeping source inspection distinct from observed build results.
- [ ] Review steps 04–08 against the implemented contract. Preserve step 04's identity/encoding work, step 05's serialization ownership and step 06's theme/embed ownership; carry the reserved-key and defaults contract into step 07's test/doc work.
- [ ] Prepare decision-extraction candidates for Completion Run #1. The plugin README is currently absent; step 07 owns its template and user-authored documentation. Do not create finished README prose in this step.

## Decisions For Completion
- Defaults in code, not manifest `defaultOptions`: candidate for a concise phase-level nuance because later steps depend on this loader behavior.
- The empirically demonstrated validation/exit mechanism: candidate to close D3's open question once verification has actually passed.
- Exact validation, reserved keys and allowlist policy: module-level documentation/test material for step 07, not a second detailed options table in the phase plan.
- USER INPUT: During Completion Run #1, decide which items to retain in the phase plan, hand off to the README, or remove.

## Caught Implementation Deviations
- None from implementation yet. Preparation corrected the initial render-error claim and selected a domain-prefixed options filename.

## Steps Alignment Check
- Preparation reviewed steps 04–06 in full and the remaining steps through focused exploration. Their identity, serialization, runtime, test and styling boundaries remain applicable. Post-implementation review is still pending.

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
