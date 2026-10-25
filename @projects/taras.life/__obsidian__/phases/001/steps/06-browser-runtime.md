---
status: waiting
state: high-level
reviewedAtStep: "01"
---

[← PLAN](../_plan_001.md)

## Description
Rewrites the browser half — the only part of the plugin a visitor pays for. It finds the container, waits until comments are about to be seen, loads Remark42 once, and keeps the widget correct across SPA navigation, theme changes, slow networks and failures without ever affecting the article itself.

## High-Level

### Intended outcome
- Zero Remark42 traffic until the container is within roughly 600px of the viewport; zero work at all on pages without a container.
- One module load per session and one live instance at a time, correct across `nav`/`prenav`, back/forward, and rapid navigation.
- The widget's light/dark matches the site's theme at the moment it appears, and follows later theme changes without a reload.
- Any failure — offline, 5xx, timeout, blocked — appears inside the container and is recoverable; the article is never affected.
- `window.REMARK42` and `window.remark_config` end up in a state we define, not whatever the module's import-time side effects leave behind.
- Validate assumptions about the served `embed.mjs` against the fixture copied into `custom-plugins/remark42/fixtures/` when implementing the runtime. A manual live comparison belongs here, not in a packaging spike; investigate drift and coordinate fixture/test updates with step 07.
- If an old-versus-new network comparison is useful, capture the previous widget from `custom-plugins/remark42-old/` before it is deleted at step 07: page/time/cache conditions, request chain, transfer and decoded sizes, and no-container traffic. This baseline is optional and not a prerequisite for starting the rewrite or establishing the package; no new capture tooling or byte-budget gate is required.

### Local invariants
- The browser receives a JavaScript resource string, not TypeScript or a Node module. Build-time compilation/bundling is allowed by D1; the shipped bootstrap has no static module imports or bundled runtime dependencies. Loading the external Remark42 module is deliberate and viewport-gated.
- Strict no-op without a container — no observers, no timers, no network.
- Per-page data comes only from the DOM; site-wide config is baked in at build time.
- Only `embed` is ever requested. No counter module, no last-comments module.
- Never re-render Quartz, never touch `window.location`, never assume a container's lifetime.

### Should NOT be done in this step
- Counters, last-comments, redirects, analytics.
- Styling inside the frame, or any theme design.
- Option parsing or validation (step 03).
- Markup changes (step 05).

## Discussion & Reflections

1. **Owning the import-time side effects.** The captured module auto-instantiates from `window.remark_config` and dispatches a ready event on import.
   - (a) Seed `window.remark_config` before importing and let the module bootstrap itself — least code, matches upstream expectations, leaves a global visible to everything else.
   - (b) Import with no global, clean up whatever the auto-run creates, then use the SPA API — more code, no lingering global.
   - (c) Defensively delete and reset globals around every import — paranoid and hard to reason about.
   - **Recommend (b)** if the auto-run is harmless without a container, otherwise (a) with the global documented.

2. **Gating technique.**
   - (a) IntersectionObserver with ~600px rootMargin — no traffic for most readers, a tiny delay for the rest.
   - (b) Load after `load` plus `requestIdleCallback` — simple, but every page pays the download and a TLS handshake.
   - (c) Load immediately — worst for performance, simplest code.
   - **Recommend (a).**

3. **Theme handoff.**
   - (a) Push `changeTheme` on each Quartz theme event and once after load.
   - (b) Read the computed background colour and map it to light/dark — robust to future themes, more fragile.
   - (c) Rely on Remark42's default — wrong half the time.
   - **Recommend (a).**

4. **Failure UX.**
   - (a) A message plus a retry control inside the container — explicit and user-controlled.
   - (b) Silent failure with a console error — invisible to readers and to you.
   - (c) Automatic retry loop — recovers from blips, can hammer a server that is down.
   - **Recommend (a).**

5. **Evidence moved from superseded step 01.** Native-TypeScript loading is no longer under investigation. Any baseline captured from `custom-plugins/remark42-old/` and any live-loader comparison serve concrete frontend decisions here, not proof of the standard package model. Automated regression tests stay network-free; preserve manual comparison provenance for step 07's fixture/upgrade instructions.
   - **Fixture fact correcting item 1's premise:** the captured auto-run is NOT harmless without a container — `createInstance` → `g()` throws `Remark42: Can't find root node.` when `#remark42` is absent. Under a gated dynamic import this is moot (import only after the container is confirmed present), but (b)'s "clean up whatever the auto-run creates" framing must be re-evaluated against this.
   - **Tension item 6 (from step 05):** the step-05 contract ships the `embed.mjs` module tag docs-verbatim and **eager**; D5 requires zero traffic before the container is near viewport. Resolving this likely means removing the static tag in favour of a gated dynamic `import()` — that is a markup change against the step-05 contract and must be recorded as a step-05 deviation + contract update here, not silently.

## Comprehensive Exploration [WRITTEN AT THE STEP 05, fresh context]

### Read first (in order)
1. `__obsidian__/docs/DEV_RULES.md` — § Rendering Model: `nav`/`prenav`/`themechange` semantics, `addCleanup`, site-wide script strings, subscribe-once rules. Non-negotiable for this step.
2. `custom-plugins/remark42/fixtures/remark42-v1.18.0-embed.mjs` — the loader contract: auto-bootstrap at import (`p()` → `g(window.remark_config)`), iframe reuse via `:scope > iframe[data-remark42-iframe]`, non-iframe container children wiped on `inited`, `destroy`/`changeTheme` on `window.REMARK42`, `REMARK42::ready` dispatched, `hash`/`hashchange` handling, 5s reveal timeout fallback. Also protocol-mismatch check on `host`.
3. `custom-plugins/remark42/src/index.tsx` header JSDoc — the locked step-05 markup contract (don't re-read step 05's file).
4. `custom-plugins/remark42/build.mjs` — how `src/browser.ts` becomes the embedded IIFE string (constraints on what the bootstrap source may import).

### Facts already established (no re-research needed)
- `afterDOMLoaded` strings ship site-wide, once per full page load, deduplicated; never re-executed on SPA nav → all route work driven by `nav`.
- Event reality: only `nav` (detail.url), `prenav`, `themechange` (detail.theme) fire; `themechange` does NOT fire on initial load — read `document.documentElement.getAttribute("saved-theme")` first, then subscribe.
- Cleanup order per nav: `prenav` → cleanups flushed → micromorph patches body → head patched → `nav`. `window.addCleanup` is a no-op when SPA is off — never depend on it for correctness.
- On SPA nav the runtime must re-read fresh config from `script#remark42-config` text (inline scripts don't re-execute); absent-id pages have no container at all — no-op must hold.
- Loader-control fields (`__colors__`, `styles`, `onReveal`) are destructured out before query serialization — they are not config keys; `theme`/`components` are reserved keys (D2′).
- Production emits per-script hashed files loaded via postscript orchestrator; `--serve` bundles monolithically (emission asymmetry, harmless).
- The current `src/browser.ts` is the step-02 placeholder (console.debug only) — full replacement target.

### Where to look for Quartz SPA internals
- `quartz/components/scripts/spa.inline.ts` (or equivalent) for `spaNavigate`, `addCleanup`, event dispatch order — read via `explore`, not full read.

### Suggested flow for the step (per planning discipline)
1. Discussion round on items 1–4 with the fixture facts on the table → lock decisions.
2. THEN write `## Implementation` block with the user.
3. Live-vs-fixture comparison once the runtime design is settled (optional old-widget capture before step 07 deletes `remark42-old/`).

_Reflection:_ (optional — compact notes from the user)
