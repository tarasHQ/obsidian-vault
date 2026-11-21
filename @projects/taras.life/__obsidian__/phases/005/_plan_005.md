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
- 

## Exploration
%%Contains related exploratory knowledge to make initial exploration in the task more efficient.%%

- ### Links To Related files
  %%Format is a link inside inline codeblock [file-size-in-kb-from-explore-tool] - 1-2 sentence description of files contents and how it's related to the whole phase.%%
	- ##### Created Files
		- 
	- ##### Modified Files
		- 
	- ##### Deleted Files
		- 
	- ##### Context Files
		- `__obsidian__/docs/AGENTS.md` - entry point to the project for LLMs.
		- `__obsidian__/phases/005/_reflections/initial-reflection.md` - phase discussion, agreed direction, recommendations, and unresolved questions for the feature foundation, Folding, Search, and navigation.
		- `quartz/plugins/loader/README.md` - current configuration and layout-loading boundary; consult before investigating the temporary feature wiring.
		- `quartz/components/README.md` - current component, theme, and sidebar contracts relevant to the feature migrations.
		- `quartz/components/scripts/README.md` - browser entry points and component resource conventions.
		- `quartz/plugins/emitters/README.md` - component resource collection and stylesheet assembly.
		- `quartz/components/frames/README.md` - shared frame and sidebar-region responsibilities.
- ### Exploration Tips
  %%Free form. Concise. For more precise exploration. Goal is to avoid misleading/wrong/inefficient exploration. Optional. Should be really concise though %%
	- The loader remains the temporary connection point; code-based site configuration is a later direction, not a Phase 005 configuration rewrite.
	- Move Explorer, Theme, and mobile sidebar controls as coherent feature clusters; shared frames, Head, SPA navigation, and the global theme palette remain outside them. Preserve resources, placement, behavior, and test discovery.
	- Folding and Search are later blocks; their integration choices and open questions remain in the reflection.

---
---
---

## Steps


### ◎ [99 - End Of The Phase](./steps/99-end.md) 
**READY**
Finalize the phase — meta-reflection on what worked, long-term knowledge extracted so plan info can safely die-off, frontmatter set, phase archived.

### Drafted Steps Recommendation

- **04 — Move mobile sidebar controls:** Relocate the controls, browser behavior, styles, and existing tests together; preserve their integration with the shared frame and loader.
- **03 — Move Theme:** Relocate the toggle, initialization and switching contract, styles, and existing tests; preserve Head's early initialization and the global palette.
- **02 — Move Explorer:** Relocate its component, navigation logic, icons, styles, and existing tests; preserve placement and resources.
- **01 — Establish the feature boundary:** Document feature ownership and entry points, keeping the existing loader as the temporary connection point without a new configuration system.

Folding and Search steps are intentionally deferred to their own planning discussions.

### ◎ [00 - Start Of The Phase](./steps/00-start.md) 
**READY**
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




