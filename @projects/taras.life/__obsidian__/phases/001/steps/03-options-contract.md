---
status: in-progress
state: condensed
reviewedAtStep: ""
---

[← PLAN](../_plan_001.md)

## Description
Defines the only way the site is allowed to configure the plugin, and makes misconfiguration impossible to ignore. It closes the option surface to a handful of validated keys with a single escape hatch, and puts the defaults in plugin code so the site config only states what differs. (Defaults were originally planned for the manifest; disproven during step research — the Quartz loader never merges `defaultOptions` into component-only plugins — see Discussion 2.)

## High-Level

### Intended outcome
- A closed surface: `host`, `siteId`, `threadBaseUrl`, `no_footer` (default `true`), `custom_properties` (default `{}`), plus `config` merged last.
- A deliberately broken option stops the build with a message naming the key, the expected type and where it came from — a mechanism that has been *verified* to abort, not assumed to. The verified throw point is the component factory; module-import and render-time throws are swallowed by the loader/emitters (Discussion 1).
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
   - **Resolved: (c) — verified from loader source before implementation.** `buildLayoutForEntries → componentRegistry.instantiate` (config-loader.ts) has **no catch** on its path; the throw propagates to `build.ts`'s top-level catch → `trace()` → `process.exit(1)`. Factory is cached per-options by the registry, so validation runs once per build (invariant satisfied). Counter-evidence recorded: (b) is swallowed twice — componentLoader catch ("declares components but failed to load them") and the component-only import catch; render-time throws are caught by `runEmitter` in `processors/emit.ts` and the build **continues** — silently shipping the break. Empirical break-test still required in verification.

2. **Where defaults live.**
   - (a) Manifest `defaultOptions` only — SSOT, but the plugin breaks if a default is missing there.
   - (b) Code constants only — works standalone, but the surface is invisible from YAML.
   - (c) Both — two places to keep in sync.
   - **Recommend (a)**, plus a startup assertion that every curated key has a default.
   - **Resolved: (b') — recommendation (a) was built on a false premise and is disproven.** Verified in `buildLayoutForEntries`: the component factory receives only `{...entry.options, ...tsOverrides}` — **`manifest.defaultOptions` is never merged for component-only plugins** (merging exists only for processing-plugin factories and the optional `init()` hook, which itself runs inside a swallowed catch). So manifest defaults would be inert decoration. Defaults live as code constants in `src/options.ts`; the "startup assertion" is compile-time: a `CuratedDefaults` type forces every optional curated key into the defaults table, and required keys carry no default by construction. YAML states only what differs — invariant satisfied.

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
