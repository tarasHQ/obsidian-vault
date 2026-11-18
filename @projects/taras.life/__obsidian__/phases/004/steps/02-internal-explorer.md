---
status: implemented
state: full
---

[← PLAN](../_plan_004.md)

## Description

Replace the community Explorer with a focused internal, build-time navigation component. Preserve the complete desktop sidebar. On mobile, retain a simple sticky top bar containing the site title, Search, and theme controls; a floating button opens only the navigation/widgets region as a full-viewport, non-modal panel from the right. Render every widget once and keep Search outside the moving panel. The existing main-column `header` layout slot is not used for this change.

## High-Level

### List of related files or folders
- `quartz/components/README.md`, `quartz/styles/README.md`, `quartz/plugins/emitters/README.md`, `quartz/util/README.md` — read the relevant local documentation before source.
- `quartz/components/explorerNavigation.ts` and its test — implemented Step 01 model; consume rather than redesign it.
- `quartz/components/types.ts`, `quartz/components/frames/DefaultFrame.tsx`, its new focused test, `quartz/components/frames/FullWidthFrame.tsx`, `quartz/components/frames/MinimalFrame.tsx` — component/resource contracts, two left-sidebar regions, and sidebar-free frame boundaries.
- `quartz/plugins/loader/config-loader.ts`, `quartz/plugins/loader/config-loader.test.ts`, `quartz/plugins/loader/types.ts`, `quartz/plugins/quartz-plugins.schema.json`, `quartz.config.yaml` — core-component placement, grouping, and a small explicit left-sidebar-region annotation.
- `quartz/plugins/pageTypes/dispatcher.ts`, `quartz/plugins/pageTypes/dispatcher.test.ts`, `quartz/plugins/emitters/componentResources.ts` — page-data handoff and resource collection.
- `quartz/components/scripts/spa.inline.ts`, `quartz/components/scripts/themeContract.ts` — navigation lifecycle and independent theme behavior.
- `quartz/styles/base.css`, `quartz/styles/theme.css`, `quartz/util/path.ts`, `quartz/components/pages/404.tsx` — responsive grid, palette, published links, and 404 root-prefix precedent.
- `node_modules/@quartz-community/search/README.md`, `node_modules/@quartz-community/search/dist/components/index.js` — existing Search remains active; its overlay is nested in the sidebar.
- `package.json`, `package-lock.json`, `__obsidian__/docs/DEV_COMMANDS.md` — dependency removal and existing checks. Read `__obsidian__/docs/DEV_RULES.md` before implementation.

Known documentation gap: `quartz/plugins/pageTypes/` currently lacks a local README. This was reported during review; creating it is not an additional deliverable of this step. The loader README remains an explicit task below.

### Intended outcome
- Each page whose resolved frame/layout renders Explorer in the left slot contains the complete flat Explorer, correct destinations/current-section indication, and only the SVG definitions it uses. Sidebar-free frames and explicitly cleared left slots render no Explorer or sidebar controls.
- Desktop/tablet above 800px retain the complete visible left sidebar: site title, Search/theme toolbar, Explorer, and future widgets. Explorer has no folding heading.
- At 800px and below, retain the familiar sticky top bar with site title and Search/theme toolbar. A compact lower-right floating button opens only the navigation/widgets region as a full-width, full-height panel sliding from right to left over a translucent blurred background.
- Every widget is rendered once. All remain in the left layout slot: explicitly annotated top controls stay stationary; ordinary left-slot widgets belong to the panel by default. No second mobile registration, mobile Search copy, or browser-time reparenting.
- Existing Search and theme switching keep working. Search's trigger and overlay are outside the moving/hidden panel. This is a simple always-sticky mobile bar, not the deferred scroll-aware header; the existing main-column `header` slot remains unchanged.
- The local component README explains icon selection and the accepted stale-markup/full-rebuild watch-mode limitation.

### Local invariants
- Step 01 owns discovery, labels, sorting, source identity, published slugs, and absent-versus-supplied icon metadata. No second navigation registry, parser, fetch, tree builder, or browser-side list construction.
- Root `index.md` is Home. Immediate-folder `_<folder-name>.md` entries are the only section links; deeper navigation remains page content. Preserve Step 01's case-insensitive entry convention and its processed-title exception.
- An absent icon selection receives `folder-closed`; a supplied unusable/unknown value receives **no icon**. No implicit special Home icon and no folder-name-to-icon rules.
- Selected local SVG geometry only; no icon dependency, runtime SVG ingestion, sprite request, or icon-loading script. Namespace and deduplicate definitions per page; CSS owns shared presentation.
- Explorer owns the list. A separate sidebar controller owns the mobile navigation/widgets panel. The default frame supplies two structural regions; this must not become a widget framework or couple future widgets to Explorer.
- Preserve sidebar-free frames and explicitly cleared left slots. An empty default-frame left-sidebar container must occupy no mobile grid space. The populated top region remains a normal sticky bar; only the separate panel moves and may be hidden when closed.
- Top-region ownership is explicit layout metadata, not a priority threshold, package-name guess, DOM inspection, or assumption about the first N components. Unannotated left components default to panel contents; the floating toggle/backdrop are a separate internal controls category. Preserve existing priority/group order within each region and reject a left Flex group spanning regions.
- Mobile is non-modal: no native dialog, focus trap/restore system, background inertness, or page-scroll lock. Accessibility-specific work/tests and a no-JavaScript mobile fallback are explicitly outside the agreed scope. Retain ordinary links/buttons; do not remove existing widgets' behavior or attributes.
- Panel interaction is a toggle button plus Escape, with navigation/desktop-width reset. Search handles its own Escape first when active. The slide is an animation, not a finger-swipe gesture requirement. The open panel covers the mobile top bar; its fixed toggle remains available and Search can still appear above it. Full viewport coverage leaves no outside dismissal area.
- Accept watch-mode partial rebuilds leaving stale Explorer on unchanged pages. Document a fresh full build, not invalidation machinery.

### Should NOT be done in this step
- Implement a calendar, scroll-up/down controls, or a scroll-aware hide/reveal header. Do not move top controls into the main-column `header` slot or change their desktop placement.
- Create or edit vault entry pages or synced `content/`; assign their frontmatter selections through the Step 03 vault-authoring workflow.
- Add a modal, custom focus management, gesture handling, a navigation-validation subsystem, or speculative virtual-page tracking.
- Redesign/fork Search, relocate its overlay with browser code, change installed package files, add packages, or overhaul the frame/loader/resource system. The bounded changes are explicit region metadata and two default-frame wrappers; no new layout slot or overlay-management framework.
- Treat automated checks as browser proof. Perform a narrow layout/Search browser smoke check early in this step; comprehensive browsing, visual refinement, and phone/Safari confirmation remain Step 03 work.

---

## Implementation Approach

### Selected mechanism and why

1. **Internal Explorer:** `Explorer.tsx` consumes `buildExplorerNavigation(allFiles)`, resolves trusted icon selections, and renders links/highlighting plus an in-page SVG definitions block. Its constructor attaches `styles/explorer.css`; it needs no browser navigation/highlighting script.
2. **Explicit regions, not a new header slot:** add optional `leftSidebarRegion: "top"` to a plugin's existing layout declaration and to core placement metadata. Omission means ordinary panel content. Mark site title, Search, and the core ThemeToggle as top; retain Search/theme's existing toolbar group. Carry this classification onto resolved `QuartzComponent` values. The internal floating-controls placement uses a separate `"panel-controls"` classification, not an author-facing option. Grouping preserves one classification per group and fails clearly on mixed-region left groups.
3. **Small default-frame split:** `DefaultFrame.tsx` partitions the resolved left components by metadata. Its one `.left.sidebar` contains a `.left-sidebar-top` wrapper, a `.left-sidebar-panel` wrapper, and floating controls as siblings. Each component is rendered once. Desktop shows both content regions vertically as one sidebar; mobile makes the outer sidebar a sticky top bar while only the panel becomes fixed and slides. The top wrapper contains the title followed by the existing Search/theme toolbar, so it can switch from desktop column to mobile row without duplicating widgets.
4. **Independent controls and conventional panel animation:** `LeftSidebarControls.tsx` renders only the mobile toggle and empty backdrop, attaches `styles/left-sidebar.css` and its browser entry, and operates on its enclosing `.left.sidebar`. Controls are rendered outside the panel by the frame. Animate the panel with `transform: translateX(100%)` closed to `translateX(0)` open. It may be visibility-hidden when closed, with an appropriate closing transition. Neither Search nor the floating toggle is inside that transformed/hidden element. Do not transform, filter, contain, or visibility-hide their shared outer sidebar or the top-region ancestor.
5. **Separate background:** the empty viewport-fixed backdrop owns translucent theme-aware wash and modest blur, behind the open panel and toggle. The open full-viewport panel covers the top bar. Keep the top region free of a separate stacking context that traps Search below the panel; Search's overlay must remain above panel/toggle. Respect Search's existing inline ancestor z-index management. The panel scrolls; the document is not locked.
6. **Existing loader integration:** add Explorer at left priority 50 and controls at left priority 60 beside ThemeToggle; controls use the internal classification. Continue passing core placements into default and all page-type builds, and apply explicit slot clearing after rebuilding as today. Remove community Explorer wiring and the obsolete mobile-only spacer. The new local CSS explicitly owns mobile stickiness formerly supplied by community Explorer.

Moving components wholesale into the existing main-column `header` slot would also change desktop placement and would not itself create a full-width sticky mobile bar. Duplicating desktop/mobile Search, browser-time widget relocation, splitting/forking Search, and moving just its overlay introduce unnecessary lifecycle or maintenance work. The selected structural split preserves the existing desktop and mobile top-control experience while removing Search from the moving panel. The rejected whole-sidebar workaround required unusual offscreen/ancestor rules and left focus restoration to an offscreen Search button uncertain; that mechanism is superseded, not retained alongside the split. A native-dialog/custom-modal approach still conflicts with the chosen non-modal scope.

### Data flow and integration points
- `allFiles` → Step 01 entries → exact icon-key resolution + current source-path comparison → SSR list and deduplicated SVG definitions.
- Link destinations use entries' actual published `slug`, not their source filenames. Current-section membership uses source `relativePath`, not URL prefixes that may differ from folders.
- Layout declarations/core placements → priority/group resolution with left-region metadata → default frame's top/panel/control partitions → one SSR rendering of every widget. The complete left layout remains one `QuartzComponent[]`; no new frame API slot is added.
- Default-frame top region contains title and toolbar; panel contains Explorer and ordinary future widgets; controls/backdrop sit outside the panel. Sidebar-free full-width/minimal frames emit none of these left-slot components. An explicitly cleared left slot stays empty and gains no empty wrappers or toggle; its remaining outer container is removed from mobile layout. A layout with top controls but no panel content has no floating menu button.
- One browser script registers a `nav` initializer. Each page instance binds the toggle, Escape, `prenav`, and width-change behavior and registers cleanup with `window.addCleanup`. No list/data fetching, widget initialization, navigation replacement, DOM reparenting, or body-scroll manipulation.

### Decisive verified facts
- `explorerNavigation.ts` exports `buildExplorerNavigation()` and `ExplorerNavigationEntry { kind, relativePath, slug, label, icon }`; icon is `{ supplied: false } | { supplied: true; value: unknown }`.
- `DefaultFrame.tsx` currently maps `left` directly inside one `<div class="left sidebar">` and renders the container even when `left` is empty. There is no separate core mobile header tree. `base.css` makes the sidebar a horizontal mobile grid row; the installed community Explorer CSS also makes that ancestor sticky on mobile and overlays only its own Explorer contents. Removing the package requires local ownership of the retained top bar's stickiness.
- `Header.tsx` renders the main-column `header` slot, currently unused by YAML. `DefaultFrame.tsx` places it inside `.center > .page-header`; it is not the current mobile top bar and is not automatically viewport-wide or sticky.
- `config-loader.ts::loadQuartzLayout()` already creates one internal ThemeToggle placement and passes `coreComponents` into every `buildLayoutForEntries()` call, including page-type overrides. The toolbar group's effective priority is 35; title is 10. The mobile-only spacer at 25 becomes unnecessary when the top controls get their own responsive wrapper. `resolveGroups()` builds Flex wrappers, and `Flex.tsx` forwards member resources; region metadata must survive the same wrapping without losing resources or mutating shared package component instances.
- `dispatcher.ts::collectComponents()` includes resolved left-slot components; `componentResources.ts` collects their CSS/scripts and deduplicates resource strings. Resource collection is broader than a particular frame's rendered markup: globally available resources do not imply that every page renders Explorer or controls. No registry entry, barrel export, frame resource API, or extra package is required for these core components.
- `spa.inline.ts` dispatches `prenav`, runs/clears cleanup callbacks, morphs the destination body, then dispatches `nav`. It dispatches initial `nav` too. SSR highlight/definitions are replaced with destination markup; do not preserve Explorer DOM with `data-persist`.
- `path.ts::normalizeRelativeURLs()` selects only empty, `./`, or `../` hrefs. Fragment-only SVG references such as `href="#tl-explorer-icon-stone"` are not rebased.
- `resolveRelative(current, target)` is re-exported from the installed utils package and uses `pathToRoot(current)` plus `simplifySlug(target)`. Existing `pages/404.tsx` uses `/` during serve and the configured base URL pathname in production because a 404 may be served at unknown URL depth.
- Installed Search `dist/components/index.js` renders trigger and `.search-container` together inside `.search`, with no supported split-component API. The overlay is `position: fixed`, `left: 0`, `top: 0`, `100vw × 100vh`, hidden with `display: none` until `.active`. Opening optionally raises the closest `.sidebar` inline z-index to `9999`, adds `.active`, and focuses the input; closing removes `.active`, clears that inline z-index, and calls `.focus()` on its Search button without `preventScroll`. Its document-level Ctrl/Cmd+K shortcut does not require a visible trigger. Keeping both in the stationary top region removes the former offscreen-button situation, but actual scrolling, focus, and layering still require browser checks. Do not patch Search, fight its stacking behavior, or add another shortcut handler.
- CLI CSS imports are text resources. `tsx --test` is not the CLI resource loader; a renderer test importing component CSS needs a small local bundling setup rather than assuming Node can import CSS.
- Browser layering, sticky-bar/panel interaction, transform animation, phone scrolling/viewport behavior, and SVG reuse after repeated SPA navigation are **not verified** by these source facts. Perform the narrow layout/Search smoke check in this step before relying on the structure; Step 03 owns comprehensive browsing and refinement.

---

## Tasks

### 01 — Local icon definitions and selection

#### `quartz/components/explorerIcons.tsx` — create
- [ ] Maintain an explicit, typed registry of the six keys below, each using a 24×24 viewBox and the user-supplied geometry. Store trusted JSX geometry, not raw SVG from frontmatter. Retain a concise source comment identifying the supplied Lucide icons; do not import an icon library.
- [ ] Export a small resolver accepting `ExplorerNavigationEntry["icon"]`: absent → `folder-closed`; supplied exact known string → that key; everything else → no selection. Use an own-key membership check so inherited object names are not mistaken for keys. No trimming, aliases, fallback for invalid input, or folder-specific mapping.
- [ ] Keep shared presentation out of the geometry: width/height, `fill`, stroke color/width, caps, and joins belong to CSS; remove the copied `lucide`, `preview-icon`, and redundant root SVG attributes. Rect positions/dimensions/radii and path coordinates remain geometry.

Approved keys and intended vault selections (assign frontmatter in Step 03):

| Key             | Intended use                                              |
| --------------- | --------------------------------------------------------- |
| `stone`         | `@system` entry: `icon: stone`                            |
| `workflow`      | `@projects` entry: `icon: workflow`                       |
| `notebook`      | `@journal` entry: `icon: notebook`                        |
| `map`           | `@atlas/_@atlas` entry: `icon: map`                       |
| `folder-closed` | Default for absent selections; also explicitly selectable |
| `house`         | Homepage: `icon: house`                                   |

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

<!-- map -->
<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/>
<path d="M15 5.764v15"/>
<path d="M9 3.236v15"/>

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
- [ ] On mobile let Explorer occupy its natural height inside the navigation/widgets panel's scroll area; do not create a second mobile list or panel.

### 03 — Two-region sidebar, mobile controls, and lifecycle

#### `quartz/components/frames/DefaultFrame.tsx` — modify
- [ ] Partition resolved `left` components using explicit `leftSidebarRegion` metadata: `"top"` → `.left-sidebar-top`, omitted → `.left-sidebar-panel`, internal `"panel-controls"` → siblings outside both wrappers. Retain the existing `.left.sidebar` outer container and original component props. Render each component once and preserve relative priority order within each region.
- [ ] Emit top/panel wrappers only when their component arrays are nonempty. Emit floating controls only when there are panel components; top-only layouts need no empty menu. With `left: []`, leave the outer sidebar empty so mobile `:empty` handling works. Do not insert replacement widgets or infer regions from rendered DOM.
- [ ] Leave the main-column `header` slot and center/right/footer mappings unchanged. Do not modify sidebar-free frames, add a new frame slot, or use duplicate desktop/mobile trees.

#### `quartz/components/LeftSidebarControls.tsx` — create
- [ ] Render an empty background element and one compact floating toggle container/button, using distinct `left-sidebar-*` names. The button has menu/close graphics switched by the enclosing sidebar's open state. Simple local inline geometry and shared CSS are sufficient; do not couple the controller to Explorer's icon registry.
- [ ] Attach `styles/left-sidebar.css` and `scripts/left-sidebar.inline.ts` using the existing component resource fields/import convention. Return a stable component instance from the constructor.
- [ ] Controls/background are fixed and out of layout on mobile, hidden on desktop. The frame places them outside the transformed panel, so the button stays lower-right and viewport-positioned. Leave room for future vertical controls without implementing them.
- [ ] Do not render sidebar widgets or add a second Search/theme instance. Bind to the closest `.left.sidebar` and require its panel; Search remains inside the separate top region.

#### `quartz/components/scripts/leftSidebar.ts` and `quartz/components/scripts/left-sidebar.inline.ts` — create
- [ ] Keep testable setup/cleanup in a plain TypeScript module; the `.inline.ts` entry only imports it and registers initialization on `nav`. Do not use stringified function bodies or a new resource-loading convention.
- [ ] Per `nav`, find the controls, enclosing sidebar, and panel; if any is absent, do nothing. Bind one page-instance controller and start closed. Use one sidebar-scoped class such as `is-mobile-open` as the state source, not storage or independent boolean state that can drift from the DOM.
- [ ] Toggle only at mobile width (`matchMedia("(max-width: 800px)")`). Toggle class/graphics through the DOM/CSS; do not re-render widgets.
- [ ] Escape closes an open panel **unless its Search overlay is active**, in which case leave the panel state unchanged and let Search handle Escape first. Evaluate that guard before Search's close handler removes its active class (for example, with a capture-phase key listener), so one Escape does not accidentally close both. No focus handling or dialog semantics. Ordinary Search click/shortcut behavior stays owned by Search.
- [ ] `prenav` immediately closes the sidebar before body replacement. A media-query change to desktop also closes it. Return/register cleanup that removes page-instance click, key, `prenav`, and media listeners and clears the open class. The document-level `nav` registration remains installed once per script load.
- [ ] Register page-instance cleanup with `window.addCleanup`. Repeated navigation/resize/open-close cycles must not accumulate listeners. Do not depend on `render` without an actual in-place sidebar replacement requirement.
- [ ] Never intercept navigation, call `window.location`, construct links, fetch Explorer data, lock body/html scrolling, or initialize other widgets.

#### `quartz/components/styles/left-sidebar.css` — create
- [ ] Scope to the default-frame left sidebar with the new regions; top-only layouts must still receive appropriate top-bar presentation. Do not alter right-sidebar or sidebar-free frames.
- [ ] Above 800px retain existing outer sticky sidebar dimensions/placement. Lay out `.left-sidebar-top` as a column and `.left-sidebar-panel` as the remaining flexible column, with `min-height: 0` where needed so Explorer can scroll. Preserve title/toolbar/Explorer spacing and avoid wrapper-induced overflow. Hide controls/background; mobile state does not influence desktop layout.
- [ ] At 800px and below, make the outer sidebar an explicitly sticky, top-aligned, content-height container with visible overflow. Its top region becomes a horizontal title + toolbar bar with theme-derived background, page-aligned inset, and modest padding. Do not rely on removed community Explorer CSS for stickiness. No scroll-direction logic.
- [ ] Make only `.left-sidebar-panel` fixed, full viewport width and height (viewport-height fallback plus dynamic viewport height), positioned at top/left zero and translated from `100%` closed to `0` open. Use a short transform transition and coordinated visibility transition so closed panel contents are not interactive or tabbable. Never apply hiding/transform/filter/containment to the outer sidebar or top region. No persistent `will-change` trickery.
- [ ] Panel contents form a stretch-aligned vertical column with border-box padding, gaps, and vertical overflow. Prevent flex shrinking to fit a long widget list; mobile Explorer has natural height inside the panel's single scroll area. Reserve bottom padding for the button and safe area. Do not lock document scrolling.
- [ ] Keep backdrop and toggle viewport-fixed as panel siblings, not descendants. Show/fade the empty backdrop only while open, behind panel content, with theme-derived translucency and modest blur on that element alone. The full-viewport panel covers the sticky top bar; its background should allow the intended blurred backdrop treatment. No separate bottom filler strip or device-specific workaround.
- [ ] Position the toggle lower-right with safe-area-aware spacing and menu/close graphics switched by the open class. Use component CSS for SVG presentation.
- [ ] Establish explicit layering: ordinary page/popovers < sidebar presentation; within the sidebar, top-bar content < backdrop/panel < toggle < Search overlay. Do not create a separate stacking context on the top wrapper that traps Search below the panel. Respect Search's temporary ancestor inline `z-index: 9999`; never override it with `!important` or clear it from sidebar code.
- [ ] Search stays viewport-fixed and independent of the panel's transform/visibility. Preserve its own display toggle, shortcut, focus, and cleanup behavior. No observer, extra shortcut handler, widget reparenting, or package patch. Stop and discuss a failed bounded integration rather than adding workarounds.

#### Early layout/Search browser checkpoint — before completing the step
- [ ] Once frame, metadata, registration, and initial CSS/controller are connected, ask the user to preview a full build. Check desktop placement, mobile sticky title/Search/theme, panel open/close, Search via click, Ctrl/Cmd+K with the panel closed/open, Escape ordering, Search dismissal from a scrolled page, and result navigation.
- [ ] This is a small architectural smoke check, not final visual approval or complete Step 03 browsing. Record returned observations; if Search positioning, focus, sticky layout, or panel stacking fails, stop and discuss before building more on the structure.

### 04 — Explicit region metadata, registration, and obsolete integration removal

#### `quartz/components/types.ts`, `quartz/plugins/loader/types.ts`, `quartz/plugins/quartz-plugins.schema.json` — modify
- [ ] Add optional `leftSidebarRegion: "top" | "panel-controls"` to `QuartzComponent`; omission means ordinary panel content. This is layout classification, not a resource field or initialization system.
- [ ] Add optional `leftSidebarRegion: "top"` to plugin layout declarations and their existing JSON schema. The internal `"panel-controls"` value is not an author-facing YAML option. Document that the field is meaningful only for left-slot placement; do not add slots or responsive component copies.

#### `quartz/plugins/loader/config-loader.ts` — modify
- [ ] In `loadQuartzLayout()`, dynamically import/instantiate Explorer and LeftSidebarControls alongside ThemeToggle, once per layout construction. Give useful display names for inspection/tests.
- [ ] Add Explorer at left priority 50 with default panel classification; controls at left priority 60 with internal `"panel-controls"` classification; mark ThemeToggle `"top"` while retaining its toolbar group/priority. Continue passing core placements into default and every page-type build. Preserve explicit slot clearing and unrelated override semantics.
- [ ] Carry region metadata through `CoreComponentPlacement`, `buildLayoutForEntries()`, and `resolveGroups()`. Use a small non-mutating component wrapper where annotation is needed; forward props and CSS/before/after resources. Do not mutate shared cached external components or rely on display names/package identity. Apply classification after display/condition wrapping so it reaches the final resolved component.
- [ ] For left-slot groups, compare members' effective regions (omission = panel), preserve a homogeneous group's region on its Flex wrapper, and throw a clear configuration error for mixed-region membership. Keep sorting, group priority, Flex layout, and resource forwarding. Do not impose region behavior on unrelated slots.
- [ ] Keep Explorer/controls out of the external registry/package-loading path. No barrel export, generic layout framework, or new frame/resource API is needed.

#### `quartz.config.yaml` — modify
- [ ] Remove the active `@quartz-community/explorer` entry, including its options/layout. Remove the `@quartz-community/spacer` mobile-only entry used to separate controls in the former mobile row.
- [ ] Leave title and Search in their left positions and retain the toolbar group. Add `leftSidebarRegion: top` to title and Search declarations; ThemeToggle's matching annotation comes from its core placement. Do not use the existing `header` slot or add mobile copies. The spacer package need not be uninstalled as part of this replacement.

#### `quartz/styles/base.css` — modify
- [ ] Remove the community Explorer-only mobile compatibility block (`.sidebar.left:has(.explorer)` header wash/inset and `.explorer .explorer-content` background).
- [ ] Retain the mobile grid's left-sidebar row for the sticky top bar; do not apply the superseded whole-sidebar plan's row removal. Keep center/right/footer behavior intact. The fixed panel, backdrop, and toggle add no in-flow height. Avoid padding intended for the former spacer/header treatment; component CSS owns the compact bar.
- [ ] At 800px and below, remove a default frame's empty `.left.sidebar` from layout with a scoped `display: none` rule. Keep this strictly an empty-container exception, never hiding a populated sidebar/Search ancestor. The named row remains for populated top bars; for an empty sidebar, collapse/remove its mobile track and associated gap if necessary using a default-frame empty-state selector. Do not leave an implicit track, empty-row gap, padding, or overflow; confirm in browser review. Desktop stays unchanged.
- [ ] Leave general desktop sidebar dimensions, breakpoints, theme/background implementation, and unrelated typography alone. Region/panel styling belongs to the component stylesheet, not another community `.explorer` compatibility block.

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
- [ ] No controls/sidebar/panel → safe no-op. Verify controller does not set document/body overflow, invoke navigation, fetch data, or take keyboard focus. Exercise Search's active-to-closed change during Escape so panel state remains unchanged on that keypress. Stub tests do not claim actual CSS viewport/blur/Search rendering verification.

#### `quartz/components/frames/DefaultFrame.test.tsx` — create
- [ ] Render the actual frame with stub widgets using `preact-render-to-string`; inspect focused HTML structure, not whole-page snapshots. Top-marked title and toolbar occur once inside the top wrapper; default Explorer/future widgets once inside the panel; controls outside both. Header/right/footer mapping remains independent.
- [ ] Empty `left` produces an empty outer sidebar, no wrappers or controls. Top-only left produces no panel or floating toggle. Panel-only content is not dropped. Region partitioning preserves order and original props without calling a widget twice. These assertions do not prove CSS stickiness/viewport behavior.

#### `quartz/plugins/loader/config-loader.test.ts`, `quartz/plugins/pageTypes/dispatcher.test.ts` — extend only where needed
- [ ] Verify top metadata on plugin/core placements, default panel classification, annotation surviving display/condition wrappers, homogeneous toolbar grouping, clear mixed-region-group failure, unchanged priorities, and no mutation of shared cached components. Resource fields survive annotation/group wrapping and remain collected once for default/page-type layouts. Use existing stub-component helpers, not plugin installation/network tests.
- [ ] Cover explicitly cleared `left: []` remaining empty with no Explorer/controls reinserted. Reuse existing override tests where sufficient; this checks layout data, not CSS grid behavior.
- [ ] Reuse existing grouping/collection tests where they establish unchanged behavior. The site build is the real configuration/schema/resource-loading integration check; do not add redundant assertions over hardcoded source text.

### 06 — Documentation and verification handoff

- Verification: the user reported `npm run check`, `npm test`, and `npm run build` green after the final 404-link and test-fixture fixes. No command output was supplied. The user previously reported the mobile button and menu are present and work, and accepted that as sufficient for this step; no more detailed browser checks were reported.
- Generated HTML inspection: the built default-frame homepage and 404 each contain one Explorer list, matching icon references/definitions, one toggle, and the title/Search/theme widgets. The 404 Home link is `/`; a generated sidebar-free or explicitly cleared-left page was not inspected.
- Step 03 browser handoff: check desktop/tablet placement; mobile stickiness, full-viewport slide/blur and bar coverage; long-panel scrolling, safe areas and browser chrome; resize, navigation/back/forward, three themes, icons after repeated SPA navigation, missing entries and 404 links. On a default frame with an explicitly cleared left slot, check for mobile gaps, implicit tracks and horizontal overflow.
- Search remains unconfirmed in the browser: click the top-bar trigger with the panel closed, and use Ctrl/Cmd+K with it closed and open. Check overlay stacking, Escape ordering and preserved panel state, result navigation, and dismissal from a scrolled page without unexpected scrolling or an unusable toggle. Stop and discuss failures rather than adding custom Search/focus machinery.

#### `quartz/components/README.md` — modify
- [ ] Document Explorer's model → SSR rendering/icon flow, supported keys/default-versus-invalid behavior, and how to add one trusted local geometry entry. Include the intended frontmatter examples, noting these do not hardcode folder mappings.
- [ ] Document independent sidebar controls, the two left-sidebar regions, one rendering per widget, and the 800px boundary: complete sidebar on desktop; sticky title/Search/theme bar plus separate sliding navigation/widgets panel on mobile. Explain explicit top classification, default panel membership for future widgets, the internal controls category, and homogeneous group requirements. Search remains outside the transformed panel; no main-column `header` placement, duplicate Search, or browser-time reparenting.
- [ ] Explain the accepted watch limitation explicitly: entry additions/deletions, label/icon changes, or destination changes can leave unchanged pages with stale baked Explorer markup. A browser refresh alone does not regenerate them. Stop the watcher and start a fresh `npx quartz build --serve` for a full initial preview build, or run the normal full `npm run build`; then reload the page. No invalidation subsystem is added.
- [ ] Distinguish the narrow layout/Search smoke check performed in this step from comprehensive Step 03 browsing. Neither component tests nor successful compilation prove browser behavior; report only observed results.

#### `quartz/plugins/loader/README.md` — create
- [ ] This relevant local module currently lacks a README. Use the shared README template during implementation and keep it concise: YAML/plugin/layout responsibilities, core priority/grouping, optional left-region classification and group consistency, per-page-type rebuilding/slot clearing, and the Explorer/controls/theme entry point. No phase diary or exhaustive unrelated loader internals.

#### Verification and Step 03 handoff
- [ ] Ask the user to run focused tests, formatting for changed files, then `npm run check`, `npm test`, and `npm run build`. Use the existing commands; report only returned outcomes. Do not claim commands were run by the assistant.
- [ ] Inspect generated representative default-frame HTML with an enabled left slot as needed to confirm the real build contains one list, the used symbols/references, ordinary links, a floating control, and the existing widgets once. Sidebar-free frames and explicitly cleared left slots must render no Explorer or controls; globally collected resources are not evidence of rendered markup. No authored entry pages are required to be created here; meaningful inclusion cases are covered by fixtures until Step 03.
- [ ] Record early smoke-check outcomes and remaining Step 03 uncertainty: desktop/tablet unchanged; mobile sticky top bar; full-viewport panel/right-to-left animation/blur and coverage of the bar; scrolling a long panel; phone safe areas/browser chrome; open/close/resizing; navigation/back/forward; all three themes; referenced icons after repeated SPA navigation; missing-entry and 404 links.
- [ ] Include a default-frame layout with an explicitly cleared left slot in Step 03's mobile browser review: at 800px and below, its empty sidebar must leave no gap, implicit grid tracks, or horizontal overflow. Layout-data/HTML assertions alone do not prove CSS behavior.
- [ ] Explicitly include Search by clicking the sticky top-bar trigger with the panel closed, plus Ctrl/Cmd+K with the panel both closed and open. Search must appear above the panel/toggle; dismissing it preserves panel state, and result navigation leaves no stranded open panel. From a scrolled page, open/dismiss Search and verify no unexpected page/bar scrolling and a usable floating toggle. These checks start at the early checkpoint and are repeated during Step 03's broader review. Preserve Search's focus behavior; stop and discuss failures rather than adding custom focus management.
- [ ] Keep scroll-aware header behavior, moving controls to the main-column `header` slot, calendar, and extra floating buttons deferred. Stop and discuss if the split requires a Search rewrite, browser-time widget relocation, or more machinery than described.
