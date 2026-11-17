---
ctime: 2026-11-16 10:40
isIntegrated: false
---

[← Project](../../_project.md)

# P 004 - Structure & Explorer
%%[Internal User Link to Template]([T]plan.md) LLMs should ignore both the link and the paths it hints on%%

## Description & Meaning
%%A few sentences about rough direction of the plan, just to get initial constraints on brainstorming. Visions will sustain meaning in the user through the whole process of planning and implementation%%

> [!summary]  
> ### Description
> Build a focused, internal Explorer and update the vault structure to support it. The Explorer is a flat map of top-level entry pages; those pages use generic Dataview listings to provide deeper navigation. Create entry pages where needed as one step of this phase. More specific and visually refined pages are future work.
> 
>  
> ### Visions
> > [!success] 
> > Vision on success. What about implementing these goals pulls you into enthusiasm? 
>
> > [!failure] 
> > Vision on failure. What if you fail to implement this? Is there something negative that pushes you into action?

## Documents
%%Dataview query for user. Renders list of documents from phase's inner folders. %%

```dataview
TABLE WITHOUT ID
  map(filter(rows.file, (f) => startswith(f.folder, this.file.folder + "/_reflections")), (f) => f.link) AS "Reflections",
  map(filter(rows.file, (f) => startswith(f.folder, this.file.folder + "/ideas")), (f) => f.link) AS "Ideas",
  map(filter(rows.file, (f) => startswith(f.folder, this.file.folder + "/artifacts")), (f) => f.link) AS "Artifacts"
FROM ""
WHERE startswith(file.folder, this.file.folder + "/") AND file.path != this.file.path
SORT file.name ASC
GROUP BY true
```

---

## Persistent Storage
%%Bullet list only for important high-level things that MUST persists between steps. AS CONCISE AS POSSIBLE. %%
- Root homepage: `index.md`. A folder entry page is `_<folder-name>.md` inside that folder; matching is case-insensitive and otherwise includes all characters (e.g. `@system/_@system.md`).
- Explorer is a build-time, flat list of matching entry pages in immediate subfolders of the content root only; deeper entry pages are reached through page content. Use the existing processed title as the section label; if it is missing, empty, or identical to the entry filename stem, use the filename without its extension and first underscore. An explicitly authored title equal to that stem follows the same fallback; do not distinguish title provenance. Sort entries alphabetically by displayed label and place the homepage as `Home` at the bottom.
- An optional entry-page frontmatter icon selects a locally maintained SVG; use a default SVG when no icon is specified, and no icon for an unrecognized or unusable selection. Keep only selected icons in the project rather than shipping an entire icon library.
- Bake the complete Explorer and used icon definitions into each page whose resolved frame/layout renders Explorer; preserve sidebar-free frames and explicitly cleared left slots. Define each icon once per page and reuse it by namespaced ID; style icons in shared theme-aware CSS. No separate Explorer/icon fetch or browser-side list construction; browser code may handle mobile interaction. Check SPA behavior through practical browsing after implementation.
- Desktop keeps an always-visible Explorer without a folding heading. On mobile, a compact lower-right floating button opens the **whole left sidebar**, rendered once, as a full-viewport non-modal panel sliding in from the right with a translucent blurred background. Remove the permanent mobile sidebar/header row; title, Search, and theme controls remain in the sidebar for now. The sidebar shell owns this presentation independently of Explorer, so future left-slot widgets appear there too. No focus-management/accessibility-specific work, page-scroll lock, gesture handling, or no-JavaScript fallback; extra floating buttons and a future scroll-aware top header/Search relocation are out of scope.
- Vault structure is the navigation SSOT. Quartz Syncer renders Dataview queries to HTML before syncing content to Quartz; the user has already verified this works. Generic entry-page listings provide deeper navigation.
- Own a focused internal Quartz component rather than adapt or package the community Explorer. Beyond optional title and icon presentation metadata, no explicit navigation map, hierarchy overrides, or dedicated navigation-validation system; add capabilities later only if needed.
- Highlight the current top-level section's entry, including when viewing that entry itself; highlight `Home` on the homepage.
- Accept existing watch-mode partial rebuild behavior: unchanged pages can retain stale baked Explorer markup after entry changes, additions, or deletions. Document this limitation and the full-rebuild remedy in the relevant local README; do not add invalidation machinery for it.

## Exploration
%%Contains related exploratory knowledge to make initial exploration in the task more efficient.%%

- ### Context Files
	- `__obsidian__/docs/AGENTS.md` - project instructions and module README conventions.
	- `__obsidian__/phases/004/steps/02-internal-explorer.md` - selected component/sidebar implementation and supplied Lucide geometry; latest mobile decisions supersede the older content-width, Explorer-only menu direction.
	- `__obsidian__/phases/004/_reflections/initial-reflection.md`, `__obsidian__/phases/004/ideas/parking.md` - historical direction and decisions; mobile ownership/width and accessibility notes there are superseded by this plan and Step 02.
	- `quartz/components/README.md`, `quartz/plugins/loader/config-loader.ts`, `quartz.config.yaml` - component conventions, internal layout placement, and current community Explorer registration.
	- `quartz/components/explorerNavigation.ts`, `quartz/components/types.ts`, `quartz/plugins/pageTypes/dispatcher.ts` - navigation model and processed page-data handoff.
	- `quartz/build.ts`, `quartz/cli/handlers.js` - full and watch build behavior; partial rendering does not refresh every page's baked Explorer.
	- `quartz/components/frames/DefaultFrame.tsx`, `quartz/components/scripts/spa.inline.ts`, `quartz/styles/base.css` - single left-sidebar rendering, SPA lifecycle, and responsive layout; the old mobile header row and community Explorer overrides are replacement points.
	- `node_modules/@quartz-community/search/README.md`, `node_modules/@quartz-community/search/dist/components/index.js` - current Search overlay is nested inside the sidebar; preserve its fixed positioning and shortcut until a separate future relocation.
	- `node_modules/@quartz-community/note-properties/README.md`, `node_modules/@quartz-community/note-properties/dist/index.js` - installed frontmatter transformer; supplies a filename-stem title when the authored title is missing or empty.
- ### Exploration Tips
	- Match existing page data's source-relative paths and use Quartz's published slugs for links. Current generated 404 and `.base` page paths do not match the entry convention; don't add speculative virtual-page tracking.
	- Reuse existing parsed title and icon metadata. Accept the identical-to-filename title fallback rather than introducing provenance tracking, additional parsing, or a separate registry; keep tests focused.
	- Watch rebuilds may leave stale Explorer copies on unchanged pages; document the full-rebuild remedy rather than adding invalidation machinery.
	- Trust the already-verified Dataview/Syncer workflow. Determine vault authorship and needed entries with the user rather than assuming synced `content/` is the authoring source.
	- Step 03 owns practical browser review: navigation/back/forward, repeated mobile sidebar use, desktop/mobile resizing, themes, icon references, phone scrolling, and Search both from the open panel and its shortcut with the panel closed. Source inspection and automated checks are not browser proof.

---
---
---

## Steps


### ◎ [STEP 99 - End Of The Phase](./steps/99-end.md) - READY
Finalize the phase — meta-reflection on what worked, long-term knowledge extracted so plan info can safely die-off, frontmatter set, phase archived.

### Remaining Step — Draft Structure
- **03 — Vault entry pages and end-to-end review:** Determine needed generic Dataview entry pages and their vault-authoring workflow with the user; apply title/icon selections, verify synced output, and browse navigation, whole-sidebar mobile interaction, existing Search, themes, and SPA history together.

### ◎ [STEP 02 - Internal Explorer & Mobile Sidebar](./steps/02-internal-explorer.md) - READY
Consume the existing model to render the internal Explorer with selected local icons and current-section indication. Present the whole left sidebar as one non-modal full-viewport mobile panel, remove community Explorer wiring, preserve existing widgets, and document the accepted watch-mode limitation. Practical browser review remains in Step 03.

### %%◉ [STEP 01 - Explorer Navigation Model](./steps/01-explorer-navigation-model.md) - IMPLEMENTED
Implemented the build-time navigation model for the internal Explorer, including entry discovery, labels, ordering, destinations, and icon selections. The implementation was reviewed and passed automated verification.%%

### ◎ [STEP 00 - Start Of The Phase](./steps/00-start.md) - READY
The flow is to start the planning in the right state of mind and with the properly prepared phase



%%
### Info On Steps
- `state` - state of the step's contents
	- `condensed` or `◉` - after implementation's completion flow, state was condensed to be token-efficient. 
	- `full` or `◎` - high level and implementation blocks are written and step is ready for implementation.
	- `high-level` or `○` - only top high-level block is written and implementation block is not
	- `placeholder` - minimal file to just hold the place until there's time to do high-level/implementation blocks
- `status` - `ready/postponed/implemented/skipped` - self-explanatory statuses.
%%

---
---
---

## Meta-Plan Reflection
%%Plan structure, navigation, planning workflows, exploration, execution. Meta stuff. To improve meta plan%%
### User-issues
- 
### LLM-issues
- Where LLM had troubles with this "system of projects"? (if it had any)
	- 




