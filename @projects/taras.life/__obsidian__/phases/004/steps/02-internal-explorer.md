---
status: ready
state: full
---

[← PLAN](../_plan_004.md)

## Description

Replace the community Explorer with a focused internal, build-time navigation component. Separately provide mobile presentation for the **whole left sidebar**: a floating button opens a full-viewport, non-modal panel from the right. Preserve the existing desktop sidebar and keep widgets independent of Explorer.

## High-Level

### List of related files or folders
- `quartz/components/README.md`, `quartz/styles/README.md`, `quartz/plugins/emitters/README.md`, `quartz/util/README.md` — read the relevant local documentation before source.
- `quartz/components/explorerNavigation.ts` and its test — implemented Step 01 model; consume rather than redesign it.
- `quartz/components/types.ts`, `quartz/components/frames/DefaultFrame.tsx`, `quartz/components/frames/FullWidthFrame.tsx`, `quartz/components/frames/MinimalFrame.tsx` — component/resource contracts and frame boundaries.
- `quartz/plugins/loader/config-loader.ts`, `quartz/plugins/loader/config-loader.test.ts`, `quartz.config.yaml` — existing core-component placement and layout grouping.
- `quartz/plugins/pageTypes/dispatcher.ts`, `quartz/plugins/pageTypes/dispatcher.test.ts`, `quartz/plugins/emitters/componentResources.ts` — page-data handoff and resource collection.
- `quartz/components/scripts/spa.inline.ts`, `quartz/components/scripts/themeContract.ts` — navigation lifecycle and independent theme behavior.
- `quartz/styles/base.css`, `quartz/styles/theme.css`, `quartz/util/path.ts`, `quartz/components/pages/404.tsx` — responsive grid, palette, published links, and 404 root-prefix precedent.
- `node_modules/@quartz-community/search/README.md`, `node_modules/@quartz-community/search/dist/components/index.js` — existing Search remains active; its overlay is nested in the sidebar.
- `package.json`, `package-lock.json`, `__obsidian__/docs/DEV_COMMANDS.md` — dependency removal and existing checks. Read `__obsidian__/docs/DEV_RULES.md` before implementation.

Known documentation gap: `quartz/plugins/pageTypes/` currently lacks a local README. This was reported during review; creating it is not an additional deliverable of this step. The loader README remains an explicit task below.

### Intended outcome
- Each page whose resolved frame/layout renders Explorer in the left slot contains the complete flat Explorer, correct destinations/current-section indication, and only the SVG definitions it uses. Sidebar-free frames and explicitly cleared left slots render no Explorer or sidebar controls.
- Desktop/tablet above 800px retain a visible left sidebar and an Explorer without a folding heading.
- At 800px and below, remove the permanent mobile sidebar/header row. A compact lower-right floating button opens the **same sidebar contents, rendered once**, as a full-width, full-height panel sliding from right to left over a translucent blurred background.
- Site title, Search/theme toolbar, and Explorer remain in the left layout slot and are all inside that mobile panel. A later widget added to this slot appears there without a second mobile registration.
- Existing Search and theme switching keep working. Moving Search and possibly the theme toggle to a future scroll-aware top header is not part of this step.
- The local component README explains icon selection and the accepted stale-markup/full-rebuild watch-mode limitation.

### Local invariants
- Step 01 owns discovery, labels, sorting, source identity, published slugs, and absent-versus-supplied icon metadata. No second navigation registry, parser, fetch, tree builder, or browser-side list construction.
- Root `index.md` is Home. Immediate-folder `_<folder-name>.md` entries are the only section links; deeper navigation remains page content. Preserve Step 01's case-insensitive entry convention and its processed-title exception.
- An absent icon selection receives `folder-closed`; a supplied unusable/unknown value receives **no icon**. No implicit special Home icon and no folder-name-to-icon rules.
- Selected local SVG geometry only; no icon dependency, runtime SVG ingestion, sprite request, or icon-loading script. Namespace and deduplicate definitions per page; CSS owns shared presentation.
- Explorer owns the list. A separate sidebar controller owns mobile sidebar presentation and interaction; it must not become a widget framework or couple future widgets to Explorer.
- Preserve sidebar-free frames and explicitly cleared left slots. An empty default-frame left-sidebar container must occupy no mobile grid space; this is distinct from the offscreen, populated sidebar whose Search and floating control must remain usable.
- Mobile is non-modal: no native dialog, focus trap/restore system, background inertness, or page-scroll lock. Accessibility-specific work/tests and a no-JavaScript mobile fallback are explicitly outside the agreed scope. Retain ordinary links/buttons; do not remove existing widgets' behavior or attributes.
- Panel interaction is a toggle button plus Escape, with navigation/desktop-width reset. The slide is an animation, not a finger-swipe gesture requirement. Full viewport coverage leaves no outside dismissal area.
- Accept watch-mode partial rebuilds leaving stale Explorer on unchanged pages. Document a fresh full build, not invalidation machinery.

### Should NOT be done in this step
- Implement a calendar, scroll-up/down controls, a scroll-aware top header, or relocate Search/theme controls.
- Create or edit vault entry pages or synced `content/`; assign their frontmatter selections through the Step 03 vault-authoring workflow.
- Add a modal, custom focus management, gesture handling, a navigation-validation subsystem, or speculative virtual-page tracking.
- Redesign Search, change installed package files, add packages, or overhaul the frame/loader/resource system.
- Treat automated checks as browser proof. Practical browsing, visual refinement, and phone/Safari confirmation belong to Step 03.

---

## Implementation Approach

### Selected mechanism and why

1. **Internal Explorer:** `Explorer.tsx` consumes `buildExplorerNavigation(allFiles)`, resolves trusted icon selections, and renders links/highlighting plus an in-page SVG definitions block. Its constructor attaches `styles/explorer.css`; it needs no browser navigation/highlighting script.
2. **Separate sidebar controls:** `LeftSidebarControls.tsx` is a second internal component in the left slot. It renders only the mobile floating toggle and background element, attaches `styles/left-sidebar.css` and its browser script, and operates on its enclosing `.left.sidebar`. It renders no widget copies and does not wrap/reparent widgets. The existing default frame can remain unchanged.
3. **Existing loader placement:** add both constructors to `loadQuartzLayout()`'s `coreComponents` beside ThemeToggle: Explorer at left priority 50, controls at left priority 60, neither in the toolbar group. The same placements already feed default and per-page-type layouts. Remove active community Explorer wiring and the now-unnecessary mobile-only spacer entry.
4. **Mobile panel without transformed ancestors:** move the existing `.left.sidebar` between `left: 100%` and `left: 0` using fixed positioning and a short CSS position transition. Do not use transform, translate, filter, backdrop-filter, containment, or related `will-change` on the sidebar or a widget ancestor. Keep its closed contents offscreen rather than applying `display: none`, `visibility: hidden`, `opacity: 0`, `hidden`, or `inert` to that ancestor. This deliberately lets its fixed-position Search overlay and floating toggle remain viewport-positioned when the sidebar is closed.
5. **Isolated blur:** the background element is itself fixed to the viewport and owns the translucent theme-aware wash and backdrop blur. It sits behind sidebar content within the sidebar's stacking context and is shown only while the panel is open. Filtering an empty background sibling does not filter or change the positioning of Search. The panel scrolls; the underlying document is not locked.

The rejected native-dialog/custom-modal approach conflicts with the user's non-modal choice and adds unwanted focus behavior. Duplicating desktop/mobile widget lists would complicate Search and future calendars. Transforming the whole sidebar is a tempting animation shortcut, but creates a containing block for its fixed Search overlay. Position animation is proportionate for one small panel and avoids a Search relocation or package patch.

### Data flow and integration points
- `allFiles` → Step 01 entries → exact icon-key resolution + current source-path comparison → SSR list and deduplicated SVG definitions.
- Link destinations use entries' actual published `slug`, not their source filenames. Current-section membership uses source `relativePath`, not URL prefixes that may differ from folders.
- When its left slot is enabled, default-frame `.left.sidebar` contains the configured title, toolbar, Explorer, and controls once. CSS changes that sidebar's mobile presentation. Sidebar-free full-width/minimal frames emit no Explorer or controls and gain no mobile menu. An explicitly cleared left slot stays empty; the default frame's remaining empty sidebar container is removed from mobile layout without changing widget mapping.
- One browser script registers a `nav` initializer. Each page instance binds the toggle, Escape, `prenav`, and width-change behavior and registers cleanup with `window.addCleanup`. No list/data fetching, widget initialization, navigation replacement, or body-scroll manipulation.

### Decisive verified facts
- `explorerNavigation.ts` exports `buildExplorerNavigation()` and `ExplorerNavigationEntry { kind, relativePath, slug, label, icon }`; icon is `{ supplied: false } | { supplied: true; value: unknown }`.
- `DefaultFrame.tsx` maps `left` directly inside one `<div class="left sidebar">` and renders the container even when `left` is empty. There is no separate core mobile header tree. `base.css` makes that sidebar a horizontal mobile grid row; the community Explorer independently overlays only its own content.
- `config-loader.ts::loadQuartzLayout()` already creates one internal ThemeToggle placement and passes `coreComponents` into every `buildLayoutForEntries()` call, including page-type overrides. The toolbar group's effective priority is 35; title is 10. The mobile-only spacer currently sits at 25 and is unnecessary for a vertical mobile panel.
- `dispatcher.ts::collectComponents()` includes resolved left-slot components; `componentResources.ts` collects their CSS/scripts and deduplicates resource strings. Resource collection is broader than a particular frame's rendered markup: globally available resources do not imply that every page renders Explorer or controls. No registry entry, barrel export, frame resource API, or extra package is required for these core components.
- `spa.inline.ts` dispatches `prenav`, runs/clears cleanup callbacks, morphs the destination body, then dispatches `nav`. It dispatches initial `nav` too. SSR highlight/definitions are replaced with destination markup; do not preserve Explorer DOM with `data-persist`.
- `path.ts::normalizeRelativeURLs()` selects only empty, `./`, or `../` hrefs. Fragment-only SVG references such as `href="#tl-explorer-icon-stone"` are not rebased.
- `resolveRelative(current, target)` is re-exported from the installed utils package and uses `pathToRoot(current)` plus `simplifySlug(target)`. Existing `pages/404.tsx` uses `/` during serve and the configured base URL pathname in production because a 404 may be served at unknown URL depth.
- Installed Search `dist/components/index.js` renders `.search-container` inside `.search`. It is `position: fixed`, `left: 0`, `top: 0`, `100vw × 100vh`, hidden with `display: none` until `.active`. Its open handler raises the closest `.sidebar` inline z-index to `9999`, adds `.active`, and focuses its input; closing removes `.active`, clears that inline z-index, and calls `.focus()` on its Search button without a `preventScroll` option. With the sidebar closed, that button is offscreen; the effect of restoring focus on page/sidebar scrolling is not browser-verified. Its Ctrl/Cmd+K handler is on `document` and does not require a visible trigger. Do not fight this stacking behavior or add another Search shortcut handler.
- CLI CSS imports are text resources. `tsx --test` is not the CLI resource loader; a renderer test importing component CSS needs a small local bundling setup rather than assuming Node can import CSS.
- Browser layering, position animation, phone scrolling/viewport behavior, and SVG reuse after repeated SPA navigation are **not verified** by these source facts. Step 03 must exercise them.

---

## Tasks

### 01 — Local icon definitions and selection

#### `quartz/components/explorerIcons.tsx` — create
- [ ] Maintain an explicit, typed registry of the five keys below, each using a 24×24 viewBox and the user-supplied geometry. Store trusted JSX geometry, not raw SVG from frontmatter. Retain a concise source comment identifying the supplied Lucide icons; do not import an icon library.
- [ ] Export a small resolver accepting `ExplorerNavigationEntry["icon"]`: absent → `folder-closed`; supplied exact known string → that key; everything else → no selection. Use an own-key membership check so inherited object names are not mistaken for keys. No trimming, aliases, fallback for invalid input, or folder-specific mapping.
- [ ] Keep shared presentation out of the geometry: width/height, `fill`, stroke color/width, caps, and joins belong to CSS; remove the copied `lucide`, `preview-icon`, and redundant root SVG attributes. Rect positions/dimensions/radii and path coordinates remain geometry.

Approved keys and intended vault selections (assign frontmatter in Step 03):

| Key | Intended use |
| --- | --- |
| `stone` | `@system` entry: `icon: stone` |
| `workflow` | `@projects` entry: `icon: workflow` |
| `notebook` | `@journal` entry: `icon: notebook` |
| `folder-closed` | Default for absent selections; also explicitly selectable |
| `house` | Homepage: `icon: house` |

Preserve this supplied geometry:

```xml
<!-- stone -->
<path d="M11.264 2.205A4 4 0 0 0 6.42 4.211l-4 8a4 4 0 0 0 1.359 5.117l6 4a4 4 0 0 0 4.438 0l6-4a4 4 0 0 0 1.576-4.592l-2-6a4 4 0 0 0-2.53-2.53z"/>
<path d="M11.99 22 14 12l7.822 3.184"/>
<path d="M14 12 8.47 2.302"/>

<!-- workflow -->
<rect width="8" height="8" x="3" y="3" rx="2"/>
<path d="M7 11v4a2 2 0 0 0 2 2h4"/>
<rect width="8" height="8" x="13" y="13" rx="2"/>

<!-- notebook -->
<path d="M2 6h4"/>
<path d="M2 10h4"/>
<path d="M2 14h4"/>
<path d="M2 18h4"/>
<rect width="16" height="20" x="4" y="2" rx="2"/>
<path d="M16 2v20"/>

<!-- folder-closed -->
<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
<path d="M2 10h20"/>

<!-- house -->
<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
<path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
```

### 02 — Build-time Explorer rendering

#### `quartz/components/Explorer.tsx` — create
- [ ] Follow the internal constructor pattern. Return a stateless `QuartzComponent` and attach `styles/explorer.css`. Do not attach a browser list/highlight script.
- [ ] Call `buildExplorerNavigation(allFiles)` once per component render. Resolve each entry's icon once, collect distinct used keys, and render a single definitions SVG containing `<symbol id="tl-explorer-icon-<key>" viewBox="0 0 24 24">…</symbol>` per used key.
- [ ] Render one list, in the model's order. Links contain optional `<svg class="explorer-icon"><use href="#tl-explorer-icon-<key>" /></svg>` and escaped label text. Invalid selections omit SVG entirely; use a consistent icon column so labels stay aligned. Do not copy geometry into every row or include unused registry symbols.
- [ ] Keep the definitions SVG zero-sized/out of layout using CSS, not a `display: none` ancestor. Keep it within the component so destination definitions are part of the normal SPA body replacement.
- [ ] Ordinary link href: `resolveRelative(fileData.slug, entry.slug)`. For `fileData.slug === "404"`, join the simplified target slug to `/` in serve mode or `new URL("https://" + (cfg.baseUrl ?? "example.com")).pathname` in production, following the existing 404 precedent. Do not use the unknown browser URL depth or invent destinations from source paths.
- [ ] Mark the active row with a component-scoped class during SSR. Home is active only for root `index.md`, case-insensitively. A section is active if the current source path begins with that entry's actual first folder segment followed by `/`; this includes the entry itself, nested Markdown notes, and a `.base` source in that folder. Respect actual source folder identity; do not lowercase all folder paths or match `A` against `AB`.
- [ ] Missing current source identity, unrelated root notes, the generated 404, or folders without an entry → no active row. Do not default them to Home and do not add synthetic page tracking. Missing navigation entries → no fabricated links; the sidebar's other widgets/controls still work.
- [ ] Do not add a visible Explorer title/fold control, per-page data persistence, global memoization, or mutation of `allFiles`.

#### `quartz/components/styles/explorer.css` — create
- [ ] Own flat list layout, icon/label columns, hover/current-section indication, spacing, and scrolling within the desktop sidebar's remaining space. Use existing theme variables; distinguish active rows with background/shape as well as text treatment. No new palette literals.
- [ ] Define icon size and shared Lucide presentation (`fill: none`, `stroke: currentColor`, width 2, round caps/joins). Override inherited global SVG fill as necessary. Keep definition geometry and presentation separate.
- [ ] On mobile let Explorer occupy its natural height inside the whole sidebar's scroll area; do not create a second mobile panel or duplicated list.

### 03 — Whole-sidebar mobile controls and lifecycle

#### `quartz/components/LeftSidebarControls.tsx` — create
- [ ] Render an empty background element and one compact floating toggle container/button, using distinct `left-sidebar-*` names. The button has menu/close graphics switched by the enclosing sidebar's open state. Simple local inline geometry and shared CSS are sufficient; do not couple the controller to Explorer's icon registry.
- [ ] Attach `styles/left-sidebar.css` and `scripts/left-sidebar.inline.ts` using the existing component resource fields/import convention. Return a stable component instance from the constructor.
- [ ] Controls/background are fixed and out of layout on mobile, hidden on desktop. The button remains visible in its lower-right viewport position when its sidebar parent is offscreen. Leave room for future vertical controls without implementing them.
- [ ] Do not render the sidebar widgets, add a second Search/theme instance, or change the default frame's widget mapping. The controller binds to its closest `.left.sidebar`.

#### `quartz/components/scripts/leftSidebar.ts` and `quartz/components/scripts/left-sidebar.inline.ts` — create
- [ ] Keep testable setup/cleanup in a plain TypeScript module; the `.inline.ts` entry only imports it and registers initialization on `nav`. Do not use stringified function bodies or a new resource-loading convention.
- [ ] Per `nav`, find the controls and enclosing sidebar; if absent, do nothing. Bind one page-instance controller and start closed. Use one sidebar-scoped class such as `is-mobile-open` as the state source, not storage or independent boolean state that can drift from the DOM.
- [ ] Toggle only at mobile width (`matchMedia("(max-width: 800px)")`). Toggle class/graphics through the DOM/CSS; do not re-render widgets.
- [ ] Escape closes an open sidebar **unless its Search overlay is active**, in which case let Search handle Escape first. No focus handling or dialog semantics. Ordinary Search click/shortcut behavior stays owned by Search.
- [ ] `prenav` immediately closes the sidebar before body replacement. A media-query change to desktop also closes it. Return/register cleanup that removes page-instance click, key, `prenav`, and media listeners and clears the open class. The document-level `nav` registration remains installed once per script load.
- [ ] Register page-instance cleanup with `window.addCleanup`. Repeated navigation/resize/open-close cycles must not accumulate listeners. Do not depend on `render` without an actual in-place sidebar replacement requirement.
- [ ] Never intercept navigation, call `window.location`, construct links, fetch Explorer data, lock body/html scrolling, or initialize other widgets.

#### `quartz/components/styles/left-sidebar.css` — create
- [ ] Scope sidebar presentation to the existing default-frame left sidebar with these controls; do not alter right-sidebar or sidebar-free frame behavior.
- [ ] At mobile width replace the inherited horizontal-row styling with a fixed, full-viewport vertical sidebar: `left: 100%` closed → `left: 0` open, full viewport width, viewport-height fallback plus dynamic viewport height, border-box padding, vertical overflow, stretch alignment, and gaps suitable for the existing widgets. Override inherited mobile `height: unset`, padding, and flex-row behavior explicitly. Prevent flex shrink from squeezing the list/widgets to fit instead of scrolling.
- [ ] Animate position for opening/closing. **No transformed/filtered/contained widget ancestor and no whole-sidebar display/visibility/opacity hiding**, including in closed styles. No lasting `will-change` optimization that silently creates a containing block. This is essential to the installed Search integration, not a stylistic preference.
- [ ] Keep backdrop and toggle fixed to the viewport. Show/fade the empty backdrop only while open, behind the content, with theme-derived translucency and a modest blur on that element alone. Do not put `backdrop-filter` on `.sidebar.left` itself. No separate bottom filler strip or device-specific viewport workaround.
- [ ] Reserve bottom content padding for the button and safe area. Position the button lower-right with safe-area-aware spacing, menu graphic closed and close graphic open. Use component CSS for SVG presentation.
- [ ] Set a sidebar stacking level above ordinary content/popovers, with the toggle above its background/content but **below Search's own overlay within the sidebar**. Respect Search's temporary ancestor inline `z-index: 9999`; do not override it with `!important` or reset it from sidebar code.
- [ ] Do not clip or suppress the viewport-fixed `.search-container.active` while the menu is closed. Search's existing `display` toggle and document shortcut must work without a second shortcut, observer, DOM reparenting, or package patch. If implementation reveals that this bounded approach fails, stop and discuss rather than layering workarounds or bringing forward the future header.
- [ ] Above 800px hide controls/background and retain the existing sticky, visible desktop sidebar; mobile open state must not influence desktop layout.

### 04 — Layout registration and obsolete integration removal
ask the user to delete files.

#### `quartz/plugins/loader/config-loader.ts` — modify
- [ ] In `loadQuartzLayout()`, dynamically import/instantiate Explorer and LeftSidebarControls alongside the existing ThemeToggle, once per layout construction. Give useful display names for inspection/tests.
- [ ] Add left priority 50 and left priority 60 core placements respectively, with no group/display wrapper. Continue passing the same core placement list into default and every page-type `buildLayoutForEntries()` call. Preserve ThemeToggle's toolbar membership and all existing override semantics, including explicitly cleared slots.
- [ ] Keep these out of the external registry/package-loading path. No new YAML schema/options or component barrel export is needed.

#### `quartz.config.yaml` — modify
- [ ] Remove the active `@quartz-community/explorer` entry, including its options/layout. Remove the `@quartz-community/spacer` mobile-only entry used to separate controls in the former mobile row.
- [ ] Leave title, Search, and the existing toolbar group in their left positions. Do not create a top-header slot configuration or move theme controls now. The spacer package need not be uninstalled as part of this Explorer replacement.

#### `quartz/styles/base.css` — modify
- [ ] Remove the community Explorer-only mobile compatibility block (`.sidebar.left:has(.explorer)` header wash/inset and `.explorer .explorer-content` background).
- [ ] For the default mobile grid, remove the obsolete in-flow left-sidebar/header row and its associated row count; the populated, controlled left sidebar is now fixed. Keep the center, right/sidebar, and footer layout behavior intact. Preserve modest top spacing for page content now that the header row is gone; do not retain its former spacer/header height.
- [ ] At 800px and below, add a default-frame-scoped rule that removes an empty `.left.sidebar` from layout with `display: none`. The default frame still emits this container when a page-type override explicitly clears `left`; it must not create implicit grid tracks or leave residual padding after `grid-sidebar-left` is removed. This exception applies only to the empty container, never to a populated closed sidebar or a Search/widget ancestor. Keep frame mapping and desktop behavior unchanged.
- [ ] Leave general desktop sidebar dimensions, breakpoints, theme/background implementation, and unrelated typography alone. Sidebar-specific panel styles belong to the new component stylesheet, not a replacement `.explorer` compatibility block.

#### `package.json`, `package-lock.json` — modify through npm
- [ ] Remove the direct `@quartz-community/explorer` dependency using the package manager and review the lockfile change; no hand-edited/truncated dependency records. The implementing assistant has no terminal access and must ask the user to run the applicable npm removal command and return the outcome.
- [ ] Do not edit `node_modules`, reinstall unrelated plugins, or remove generic Explorer translations/vendor reference documentation merely because it mentions the old feature.

### 05 — Focused automated coverage

#### `quartz/components/explorerIcons.test.ts` — create
- [ ] Absent selection → default; each approved key → itself; unknown/empty/whitespace/case-different strings, inherited object key names, null/false/number/object/array → no icon. These selections never change entry inclusion.

#### `quartz/components/Explorer.test.ts` — create
- [ ] Exercise the actual component's SSR output using `preact-render-to-string` and the existing `hast-util-from-html` parser for focused structural assertions, not whole-document snapshots.
- [ ] Since the component imports CSS, bundle it locally in this test with the already-installed esbuild (`bundle`, Node/ESM, automatic Preact JSX, `.css: text`, no output artifacts), then import its output for rendering. It has no inline browser script import, so no custom inline loader is needed. Keep this test-local; do not create a general test framework, add a dependency, or change production loaders.
- [ ] Fixtures include sections, Home, a deeper excluded entry, a custom published slug unrelated to its folder, shared default icons, explicit selections, an invalid icon, and labels containing HTML-significant characters. Expect Step 01 order, correct escaped text/destinations, and no fetched/client-built navigation.
- [ ] Shared icon → one namespaced symbol and multiple references; unused icons → no symbol; invalid selection → no SVG for that row; every reference resolves within the rendered fragment.
- [ ] Current entry, nested note, similarly prefixed sibling folder, source folder with an unrelated published slug, root homepage, unrelated root note, missing source identity, 404, and a section `.base` source → expected active row or none. Assert one list, not duplicate desktop/mobile lists.
- [ ] Nested-page links and Home use the Quartz helper; 404 links use `/` during serve and a configured production base pathname at arbitrary request depth. Navigation inclusion remains unchanged when the current page has no matching section.

#### `quartz/components/scripts/leftSidebar.test.ts` — create
- [ ] Test the real plain-module controller with minimal event/media/element stubs, not a browser emulator or a mock reimplementation of its state logic.
- [ ] Mobile toggle twice → open then closed; desktop toggle → no opening; Escape closes open state, except active Search is left to Search.
- [ ] `prenav`, desktop-width change, and cleanup each clear open state. Cleanup removes listeners. Repeated setup/cleanup followed by one click → one transition, not duplicate handling.
- [ ] No controls/sidebar → safe no-op. Verify controller does not set document/body overflow, invoke navigation, fetch data, or take keyboard focus. Stub tests do not claim actual CSS viewport/blur/Search rendering verification.

#### `quartz/plugins/loader/config-loader.test.ts`, `quartz/plugins/pageTypes/dispatcher.test.ts` — extend only where needed
- [ ] Cover the selected integration mechanism: independent Explorer/controls core placements retain priority order around title/toolbar components, and resolved default/page-type left components are included once in resource collection. Use the existing helpers/stub-component style; do not turn this into plugin installation/network tests.
- [ ] Cover an explicitly cleared `left: []` slot remaining empty in a resolved default-frame layout, with no Explorer/controls reinserted. Reuse existing override tests where sufficient; this checks layout data, not the resulting CSS grid.
- [ ] Reuse existing core-placement/grouping/collection tests where they already establish the behavior. The site build is the actual configuration/resource-loading integration check; do not add redundant assertions over hardcoded source text.

### 06 — Documentation and verification handoff

#### `quartz/components/README.md` — modify
- [ ] Document Explorer's model → SSR rendering/icon flow, supported keys/default-versus-invalid behavior, and how to add one trusted local geometry entry. Include the intended frontmatter examples, noting these do not hardcode folder mappings.
- [ ] Document the independent sidebar-controls module, whole-sidebar single rendering, 800px presentation boundary, existing title/Search/theme placement, and the Search constraint behind position animation/separate blur. Future widgets own their lifecycle and simply use the left layout slot.
- [ ] Explain the accepted watch limitation explicitly: entry additions/deletions, label/icon changes, or destination changes can leave unchanged pages with stale baked Explorer markup. A browser refresh alone does not regenerate them. Stop the watcher and start a fresh `npx quartz build --serve` for a full initial preview build, or run the normal full `npm run build`; then reload the page. No invalidation subsystem is added.
- [ ] Note that practical browser verification remains a Step 03 obligation, not a claimed result of component tests.

#### `quartz/plugins/loader/README.md` — create
- [ ] This relevant local module currently lacks a README. Use the shared README template during implementation and keep it concise: YAML/plugin/layout responsibilities, core component placement through priority/grouping, per-page-type rebuilding, and the Explorer/controls/theme entry point. Avoid turning it into a phase diary or documenting unrelated loader internals exhaustively.

#### Verification and Step 03 handoff
- [ ] Ask the user to run focused tests, formatting for changed files, then `npm run check`, `npm test`, and `npm run build`. Use the existing commands; report only returned outcomes. Do not claim commands were run by the assistant.
- [ ] Inspect generated representative default-frame HTML with an enabled left slot as needed to confirm the real build contains one list, the used symbols/references, ordinary links, a floating control, and the existing widgets once. Sidebar-free frames and explicitly cleared left slots must render no Explorer or controls; globally collected resources are not evidence of rendered markup. No authored entry pages are required to be created here; meaningful inclusion cases are covered by fixtures until Step 03.
- [ ] Record any remaining visual/browser uncertainty for Step 03: desktop/tablet unchanged; mobile full viewport/right-to-left animation/blur; scrolling a long sidebar; phone safe areas and browser chrome; open/close/resizing; navigation/back/forward; all three themes; referenced icons after repeated SPA navigation; missing-entry and 404 links.
- [ ] Include a default-frame layout with an explicitly cleared left slot in Step 03's mobile browser review: at 800px and below, its empty sidebar must leave no gap, implicit grid tracks, or horizontal overflow. Layout-data/HTML assertions alone do not prove CSS behavior.
- [ ] Explicitly include Search from an open panel and Ctrl/Cmd+K from a closed panel, dismissing Search back to the correct sidebar state, and result navigation without stranded panel state. From a page scrolled below the top with the panel closed, open and dismiss Search; verify that its existing focus restoration does not unexpectedly move the page or sidebar, and that the floating control remains usable when reopening the panel. These are required practical checks, not speculative package fixes to implement in advance; preserve Search's behavior and stop to discuss any failure rather than adding custom focus management.
- [ ] Keep the future scroll-aware top header, Search/theme relocation, calendar, and extra floating buttons deferred. Stop and discuss if the selected approach requires a Search rewrite, widget relocation, or more machinery than this step describes.
