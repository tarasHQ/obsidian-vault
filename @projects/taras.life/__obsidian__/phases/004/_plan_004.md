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
- Explorer is a build-time, flat list of matching entry pages in immediate subfolders of the content root only; deeper entry pages are reached through page content. An optional frontmatter title supplies the section label; otherwise use the filename without its extension and first underscore. Sort entries alphabetically by displayed label and place the homepage as `Home` at the bottom.
- An optional entry-page frontmatter icon selects a locally maintained SVG; use a default SVG when no icon is specified, and no icon for an unrecognized or unusable selection. Keep only selected icons in the project rather than shipping an entire icon library.
- Bake the complete Explorer and used icon definitions into each page's HTML. Define each icon once per page and reuse it by namespaced ID; style icons in shared theme-aware CSS. No separate Explorer/icon fetch or browser-side list construction; browser code may handle mobile interaction. Check SPA behavior through practical browsing after implementation.
- The original desktop direction is an always-visible Explorer without a heading that folds it. On mobile, use a compact floating button on the right, with room to later add scroll-up/down buttons as a vertical group. The menu opens from the right and fits its content rather than using a fixed percentage or pixel width. Choose suitable interaction and accessibility details during implementation and refine them based on testing; a no-JavaScript Explorer fallback is not required.
- Vault structure is the navigation SSOT. Quartz Syncer renders Dataview queries to HTML before syncing content to Quartz; the user has already verified this works. Generic entry-page listings provide deeper navigation.
- Own a focused internal Quartz component rather than adapt or package the community Explorer. Beyond optional title and icon presentation metadata, no explicit navigation map, hierarchy overrides, or dedicated navigation-validation system; add capabilities later only if needed.
- Highlight the current top-level section's entry, including when viewing that entry itself; highlight `Home` on the homepage.
- Accept existing watch-mode partial rebuild behavior: unchanged pages can retain stale baked Explorer markup after entry changes, additions, or deletions. Document this limitation and the full-rebuild remedy in the relevant local README; do not add invalidation machinery for it.

## Exploration
%%Contains related exploratory knowledge to make initial exploration in the task more efficient.%%

- ### Context Files
	- `__obsidian__/docs/AGENTS.md` - project instructions and module README conventions.
	- `__obsidian__/phases/004/_reflections/initial-reflection.md` - phase direction and remaining implementation choices.
	- `__obsidian__/phases/004/ideas/parking.md` - original notes and later locked decisions; the latter supersede conflicting earlier brainstorming.
	- `quartz/components/README.md`, `quartz/plugins/loader/config-loader.ts`, `quartz.config.yaml` - component conventions, internal layout placement, and current community Explorer registration.
	- `quartz/components/types.ts`, `quartz/plugins/pageTypes/dispatcher.ts`, `quartz/processors/parse.ts` - component page data, rendering, and source-path/slug assignment.
	- `quartz/build.ts`, `quartz/cli/handlers.js` - full and watch build behavior; partial rendering does not refresh every page's baked Explorer.
	- `quartz/components/scripts/spa.inline.ts`, `quartz/styles/base.css` - SPA lifecycle and responsive layout; base CSS includes community Explorer-specific mobile rules.
	- `node_modules/@quartz-community/note-properties/README.md`, `node_modules/@quartz-community/note-properties/dist/index.js` - installed frontmatter transformer; supplies a filename-stem title when the authored title is missing or empty.
	- `C:/Users/Taras/Dev/_other/quartz/explorer-main` - community Explorer reference only, not the intended implementation.
- ### Exploration Tips
	- Match existing page data's source-relative paths and use Quartz's published slugs for links. Current generated 404 and `.base` page paths do not match the entry convention; don't add speculative virtual-page tracking.
	- The configured frontmatter transformer supplies a missing title, so preserve or otherwise reliably determine whether it was authored before applying the Explorer's filename-derived fallback. Verify optional icon metadata; avoid low-value tests.
	- Watch rebuilds may leave stale Explorer copies on unchanged pages; document the full-rebuild remedy rather than adding invalidation machinery.
	- Trust the already-verified Dataview/Syncer workflow. Determine vault authorship and needed entries with the user rather than assuming synced `content/` is the authoring source.
	- After implementation, ask the user to browse navigation, back/forward, repeated mobile menu use, themes, icon references, and relevant edge cases; address issues found.

---
---
---

## Steps


### ◎ [STEP 99 - End Of The Phase](./steps/99-end.md) - READY
Finalize the phase — meta-reflection on what worked, long-term knowledge extracted so plan info can safely die-off, frontmatter set, phase archived.

### Remaining Steps — Draft Structure
- **03 — Vault entry pages and end-to-end review:** Determine needed generic Dataview entry pages and their vault-authoring workflow with the user; verify synced output and browse navigation, mobile interaction, themes, and SPA history together.
- **02 — Explorer component:** Consume the navigation model; render and register the internal Explorer, including selected local icons, responsive presentation, current-section indication, and interaction. Remove community Explorer wiring and document the watch-mode limitation.

### ◎ [STEP 01 - Explorer Navigation Model](./steps/01-explorer-navigation-model.md) - READY
Prepare and test build-time discovery, authored-title handling, displayed-label ordering, metadata, and actual published slugs for the internal Explorer.

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




