---
ctime: 2026-11-21 01:37
isIntegrated: false
---

[← Project](../../_project.md)

# P 005 - Site Structure, Search & Foldings
%%[Internal User Link to Template]([T]plan.md) LLMs should ignore both the link and the paths it hints on%%

## Description & Meaning
%%A few sentences about rough direction of the plan, just to get initial constraints on brainstorming. Goals and visions that will sustain meaning in the user through the whole process of planning and implementation%%

> [!summary]  
> ### Description
> Implement proper folding logic that also represents the custom `%% folding %%` tags in obsidian which are used to persist folding state between sessions/devices. 
> 
>  
> ### Visions
> > [!success] 
> > Website is close to my vault in its UX. It gets much more usable because what's intended to be folded - is folded. Or I/users can fold text they don't need to read. And through that reduce the cognitive load of the page. 
>
> > [!failure] 
> > If foldings aren't done - I lose a major axis of structure. Everything gets much more cluttered and bloated. It's just a mess. Like even current project file with ideas in it - unreadable wall of text. 

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
- General Folding and navigation revealing are complete with initially open, independent heading and list folds. Marker defaults, Search, and copied-content integration remain open.

## Exploration
%%Contains related exploratory knowledge to make initial exploration in the task more efficient.%%

- ### Links To Related files
  %%Format is a link inside inline codeblock [file-size-in-kb-from-explore-tool] - 1-2 sentence description of files contents and how it's related to the whole phase.%%
	- ##### Created Files
		- `quartz/features/folding/` — general Folding tree transform, browser behavior, styles, tests, and README.
	- ##### Modified Files
		- `quartz/plugins/pageTypes/dispatcher.ts` — connects Folding after page transforms for full and partial builds.
		- `quartz/plugins/emitters/componentResources.ts` — includes Folding browser behavior and styles.
		- `quartz/features/README.md` — lists the Folding feature.
	- ##### Deleted Files
		- 
	- ##### Context Files
		- `__obsidian__/docs/AGENTS.md` - entry point to the project for LLMs.
		- `__obsidian__/phases/005/_reflections/initial-reflection.md` - phase discussion, agreed direction, recommendations, and unresolved questions for the feature foundation, Folding, Search, and navigation.
		- `quartz/plugins/loader/README.md` - current configuration and layout-loading boundary; consult before investigating the temporary feature wiring.
		- `quartz/features/README.md` - local feature ownership and boundaries, with links to feature documentation.
		- `quartz/components/README.md` - shared rendering and page-structure boundaries.
		- `quartz/components/scripts/README.md` - shared browser entry points and resource conventions.
		- `quartz/plugins/emitters/README.md` - component resource collection and stylesheet assembly.
		- `quartz/components/frames/README.md` - shared frame and sidebar-region responsibilities.
		- `quartz/processors/README.md` - Markdown-to-HTML processing and worker constraints; consult before investigating comment and marker handling.
		- `quartz/components/renderPage.tsx` - section and block transclusion, relevant when introducing folding structure.
		- `C:/Users/Taras/Documents/obsidian-vault/.obsidian/plugins/quartz-syncer/` - installed Syncer artifact; locate maintainable source before planning its fork.
- ### Exploration Tips
  %%Free form. Concise. For more precise exploration. Goal is to avoid misleading/wrong/inefficient exploration. Optional. Should be really concise though %%
	- The loader remains the temporary connection point; code-based site configuration is a later direction, not a Phase 005 configuration rewrite.
	- Explorer, Theme, and mobile sidebar controls live in feature clusters; shared frames, Head, SPA navigation, and the global theme palette remain outside them.
	- General Folding and destination revealing are complete; Search and the remaining Folding integrations are later work.
	- Syncer now exports comments, and `%% fold %%` markers are present in `content/`. Website processing must show ordinary comment contents without delimiters and distinguish fold markers.
	- Fold structure must preserve section embeds and coordinate revealing with router scrolling; the router scrolls before its final `nav` event.

---
---
---

## Steps


### ◎ [99 - End Of The Phase](./steps/99-end.md) 
**READY**
Finalize the phase — meta-reflection on what worked, long-term knowledge extracted so plan info can safely die-off, frontmatter set, phase archived.

### %%◉ [03 - Navigation and reveal](./steps/03-navigation-and-reveal.md) - IMPLEMENTED
Made closed folds available to native browser Find and revealed destination ancestors during fragment navigation while preserving existing history behavior. The developer confirmed checks, browser behavior, and print preview were a go; marker defaults and their initialization remain later work.%%

### %%◉ [02 - General Folding](./steps/02-general-folding.md) - IMPLEMENTED
Implemented initially open, independent heading and list folds with separate controls. The developer confirmed browser checks and reported checks and build green; marker defaults, destination revealing, and copied-content integration remain later work.%%

### %%◉ STEP 01 - Local Feature Boundary - IMPLEMENTED
Established a boundary for complete local features and reorganized Explorer, Theme, and mobile sidebar controls into coherent clusters while preserving their existing behavior and shared page structure. Updated the boundary documentation; the existing loader remains the connection point. Checks and the rebuilt site's user experience were confirmed by the developer.%%

### Drafted Steps Recommendation
Draft structure only; exact boundaries and implementation details remain to be discussed in the writing-steps flow. Listed in reverse implementation order to match the phase plan.
- **06 — Search adoption and Folding integration:** Adopt Search locally, retain the existing engine and page-level index initially, and connect result and preview revealing to Folding.
- **05 — Popovers and copied content:** Apply author defaults and reveal destinations within each copy, independently of the underlying page.
- **04.5 — List indentation guides: IMPLEMENTED.** Clickable guides follow each list item's foldable content and close the parent fold; the arrow remains available to reopen it. Guides start after the full parent label, including wrapped labels. The developer accepted the appearance and interaction; automated checks have not been confirmed in this task.
- **04 — Visible comments and marker defaults:** Render ordinary Obsidian comments as content and interpret supported `%% fold %%` markers as initially closed folds. Decide during step writing whether these shared processing concerns warrant one step or two.
The site-wide JavaScript warning remains separate phase work. Syncer comment export is complete and does not need another implementation step. Intermediate milestones may not yet support every Search or popover interaction; implementation order need not dictate release grouping.

### %%◉ [00 - Start Of The Phase](./steps/00-start.md) - IMPLEMENTED
The flow is to start the planning in the right state of mind and with the properly prepared phase%%


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




