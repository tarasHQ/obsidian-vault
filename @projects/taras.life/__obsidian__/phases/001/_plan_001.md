---
ctime: 2026-10-24 17:08
isIntegrated: false
---

[← Project](../../_project.md)

# Phase 001 - Remark42 plugin rewrite

## Description & Meaning
%%A few sentences about rough direction of the plan, just to get initial constraints on brainstorming. Goals and visions that will sustain meaning in the user through the whole process of planning and implementation%%

> [!summary]  
> ### Description
> Plugin was vibecoded. It accumulates a lot of "temporary" code around it that doesn't follow established standards and best practices. The goal of this plan is to rewrite it properly. And as the secondary goal - to gain more knowledge about how quarts/plugins/remark42 works. 
>  
> ### Goals
> #### Completion Goal #1 - Plugin is properly rewritten and locked in
>  
> #### Completion Goal #2 - README for the plugin is in the place and also properly written.
> 
> ### Visions
> > [!success] 
> > It's blocking further development of the website. If you don't do it - it'll cause issues with everything else you do, which will also add cognitive load to that and make it harder. When you do that - many doors will open to more interesting and rewarding things.
>
> > [!failure] 
> > It'll nag me constantly. Builds would be in the wrong flow. I'll have to make workarounds. If new plugins arrive - it'll be PIA with them as well. So it's not important to do now, but if we take 1 month down the line - it'll suck out 10x energy than I'll spend on rewriting it properly right now. 

## Documents
%%Dataviewjs snippet that renders list of documents from phase's inner folders%%

```dataviewjs
await cJS(c => c.RenderReflectionHelpers.renderColumns(dv, this.container));
```


## High Level Planning
%%A place to have all high-level things that must persists through all steps.%%

### User-input
%%Goal is to keep user input raw and untouched, so it won't drift away between many tasks. Among many options can include: order of implementation, rules, nuances, wishes, open questions, features, invariants, etc.%%
- We need to rewrite the plugin so that it is aligned with quartz plugin flow.
- My additions
	- **`no_footer`**: true - to hide footer with links to remark42. - for remark frontend config. 
	- custom_properties: {} - after we're done, to play with css a bit, to make it look nicer maybe. But it'll be like the last step before ending the phase
- It must be very well written, so I can lock it down long term. No performance issues too. 
- I'm a bit curious about how to load it. Like I want to each page load be quick. Performance and reliability is the top priority. 

---

### LLM-input 
%%Where LLM allowed to create, maintain. research and persist high-level information that needs to be persisted independently from steps-scope%%
- #### Decisions
	- **D1 — No build step (locked).** The plugin entry is `src/index.ts`, imported directly by Node's native type-stripping; the component is written in `h()`; `build.mjs`, `dist/`, `build:local-plugins` and `prebuild` are all deleted. Every invocation path (`npm run build`, `npx quartz build`, `--serve`, Workers Builds) becomes identical.
		- Rules this imposes: erasable-only TypeScript (no `enum`, `namespace`, parameter properties), internal imports written with explicit `./x.ts` specifiers, Node ≥ 22.18 everywhere the site builds.
		- Defined fallback if any path fails: keep `dist/` and patch the local branch of `quartz/plugins/loader/gitLoader.ts` to build unconditionally. Only D1's implementation changes; steps 02–08 keep their scope.
	- **D1a — No size guardrails.** No byte-budget test, no size note in the plugin README, no minification step. Accepted because the browser bootstrap is small and growth would be explicit.
	- **D2 — Options contract.** Curated keys (`host`, `siteId`, `threadBaseUrl`, `no_footer` default `true`, `custom_properties` default `{}`) plus a `config: {}` escape hatch merged last. Rationale: passthrough values are URL-encoded into the iframe `src`, so they must stay scalar.
	- **D3 — Bad options fail the build.** No in-page error box, no silent skip. Open sub-question carried into step 03: verify which throw point actually aborts the build (module import vs component factory vs render), because `quartz/plugins/loader/config-loader.ts` catches and swallows per-plugin instantiation errors.
	- **D4 — Identity.** `comment-id` → `id` (final name). Thread URL frozen as `${threadBaseUrl}/${id}` = `https://taras.life/comments/<id>`. No page-URL fallback. `comments: false` is the explicit opt-out. The key rename does not orphan threads, because the URL derives from the value, not the key.
	- **D5 — Loading behaviour.** Viewport gating with a preload margin (~600px `rootMargin`). No container → no Remark42 request. Our bootstrap ships site-wide and must be a hard no-op without a container.
	- **D6 — Scope frozen.** Counters, last-comments, notifications, extra OAuth and `/comments/<id>` redirects are out of this phase. Counters and last-comments are permanently out.
	- **D7 — Styling boundary.** The widget lives in a cross-origin iframe, so our CSS cannot reach it. Styling = container CSS + `custom_properties` (creation-time only) + theme selection. Instance-level Remark42 theming on the LXC is the future path for anything deeper — recorded for later exploration, not part of this phase.
- #### Plan
	- Steps, in implementation order:
		- `01-loading-topology-spike` — prove D1 on every invocation path plus a Workers preview deploy; compare the captured fixture with the live module; record the network baseline. Decides D1's fallback if it fails.
		- `02-package-lock-in` — self-contained package: community types, no host imports, `.ts` entry, removal of `dist`/`prebuild`/`build.mjs`, tightened tsconfig, root guards.
		- `03-options-contract` — D2 + D3: curated keys and passthrough, defaults, validation that really fails the build.
		- `04-identity-id-rename` — D4.
		- `05-render-component` — build-time component in `h()`: container markup, data contract, `css`, bootstrap injection.
		- `06-browser-runtime` — D5: visibility gating, ownership of the module's import-time side effects, SPA lifecycle, theme, error and timeout handling.
		- `07-tests-and-docs` — regression tests, plugin README as SSOT, deletion of `PLAN.md`/`REMARK42.md`/the test note, AGENTS.md sync.
		- `08-visual-polish` — D7.
	- Rule: step 01 is a spike with a pre-agreed fallback; everything after it is written against the topology it proves.
	- Rule: `__obsidian__/phases/001/artifacts/README.md` and `custom-plugins/README.md` are planning inputs, not SSOT. The plugin's own `README.md` becomes SSOT at step 07.
- #### Nuances
	- **Runtime import is plain Node `import()`** inside the CLI process — no TS/JSX loader is registered. `.ts` works only via Node's native type-stripping; `.tsx` throws `ERR_UNKNOWN_FILE_EXTENSION`. `.node-version` pins 22.22; Cloudflare Workers Builds' Node version must be confirmed in step 01.
	- **`prebuild`'s first half was dead code.** `npx quartz plugin install` reads `quartz.lock.json`, which is `{"plugins": {}}` — remark42 was never installed by it. `build:local-plugins` was the only load-bearing part.
	- **`afterDOMLoaded` is site-wide.** All components' script strings are collected into `Set`s and emitted as hashed files loaded on every page, regardless of frontmatter. The bootstrap's cost is therefore per page view and it must be inert without a container.
	- **Emission asymmetry.** Production writes component scripts byte-for-byte (no minifier); `--serve` joins and minifies them with esbuild. Component CSS is always minified by Lightning CSS inside `@layer quartz-base`.
	- **`embed.mjs` has import-time side effects.** It calls `createInstance(window.remark_config)` and dispatches `REMARK42::ready`; its `destroy` deletes `window.REMARK42.changeTheme` and `.destroy`. It reads `window.remark_config.host` with a hardcoded fallback of `https://comments.taras.life`. The rewrite must own the `REMARK42` global deliberately and never depend on that fallback.
	- **Widget topology.** `embed.mjs` (~7 KB) creates a cross-origin `<iframe>` to `${host}/web/iframe.html?<params>`; `remark.mjs` (~60 KB) runs inside that frame, isolated from our page's main thread. Scalar config travels as query params; `custom_properties` is merged with `__colors__` and JSON-stringified into the iframe `name` attribute — creation-time only, matching the docs' "read once at load".
	- **`@quartz-community/types` is a runtime package**, so imports must be `import type`. Its `QuartzComponent` has no `displayName`, `head` or `content`; `css`/`beforeDOMLoaded`/`afterDOMLoaded` are `string | string[]`.
	- **`componentLoader` hides the real import error** behind `Plugin "<name>" declares components but failed to load them` — every resolution failure presents identically.
	- **Capture rule.** The fixture is re-captured on every Remark42 upgrade (`fixtures/README.md`); the vendored docs do not state a Remark42 version.
	- **No instance-level theming API exists.** Remark42 documents no server-side theme, custom-CSS or branding hook; `theme`, `locale` and `no_footer` are client-side only and no server default theme exists. The only routes past the iframe boundary are `REMARK_WEB_ROOT` (same-named files win over embedded ones, but the directory replaces the whole frontend and must be re-synced every upgrade), `SIMPLE_VIEW` (minimizes the UI only), and Caddy-layer injection into the served frontend (undocumented, upgrade-fragile). Recorded for step 08; out of scope for this phase.

---
---
---

## Steps
%%Rendered by dataview for the user%%
```dataviewjs
await cJS(c => c.PlanStepsList.renderSteps(dv, this.container));
```