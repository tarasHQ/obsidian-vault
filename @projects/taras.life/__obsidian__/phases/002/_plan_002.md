---
ctime: 2026-10-31 23:16
isIntegrated: false
---

[← Project](../../_project.md)

# P 002 - Removing SCSS, Theming, Fonts plugin
%%[Internal User Link to Template]([T]plan.md) LLMs should ignore both the link and the paths it hints on%%

## Description & Meaning
%%A few sentences about rough direction of the plan, just to get initial constraints on brainstorming. Goals and visions that will sustain meaning in the user through the whole process of planning and implementation. Written by the user for the user.%%

> [!summary]  
> ### Description
> Remove redundant stuff and reduce cognitive complexity of the project. First sweep includes scss, fonts, themes. Don't maintain what you don't need. 
>  
> ### Visions
> > [!success] 
> > Vision on success. What about implementing these goals pulls you into enthusiasm? 
> > Reduced cognitive load from working on quartz. When I do styling - I don't have to work with "unknown" scss files, when I work with fonts - I don't have to go through the plugin I don't use or google fonts code while everything is self-hosted. It's streamlined and light. And more fun to work with
>
> > [!failure] 
> > Vision on failure. What if you fail to implement this? Is there something negative that pushes you into action?
> > With fonts it's minor inconvenience. While with scss/themes - it'll probably be a minor PIA to deal with. I'll have to learn saas, to know what I'm doing, which will be done for nothing, since the project is perfectly fine without saas features. And themes too, I don't want them neither plan to have them. Dark/light switch is all I need. So why should I maintain redundant code? 

## Documents
%%Dataviewjs snippet that renders list of documents from phase's inner folders%%

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

## Exploration
- %%Scoped by a phase it is in. %%
- %%Contains related exploratory knowledge to make initial exploration in the task more efficient.%%
- %%After each major workflow block - LLM shares its wins and losses in exploration in here. So further planning / implementation tasks in future would be more efficient in exploration part.%%
- ### Links To Related files
  %%Format is a link inside inline codeblock - 1-2 sentence description of files contents and how it's related to the whole phase.%%
	- ##### Created
		- 
	- ##### Modified
		- 
	- ##### Deleted
		- 
	- ##### Context
		- `__obsidian__/docs/AGENTS.md` - entry point to the project for LLMs.
- ### Universal Tips
  %%Phase scoped. Free form. Concise. For more precise exploration. Goal is to avoid misleading/wrong/inefficient exploration. Optional. Should be really concise though. Filled only through LLM's experience. %%
	- 

---
---
---

## Steps


### ◉ [STEP 99 - End Of The Phase](./steps/99-end.md) - READY
Finalize the phase — meta-reflection on what worked, long-term knowledge extracted so plan info can safely die-off, frontmatter set, phase archived.



### ◉ [STEP 00 - Start Of The Phase](./steps/00-start.md) - READY
The flow is to start the planning in the right state of mind and with the properly prepared phase



%%
### Info On Steps
- `status` - `ready/postponed/implemented/skipped` - self-explanatory statuses.
- `state` - state of the step's contents
	- `placeholder` - minimal file to just hold the place until there's time to do high-level/implementation blocks
	- `high-level` or `○` - only top high-level block is written and implementation block is not
	- `full` or `◎` - high level and implementation blocks are written and step is ready for implementation.
	- `condensed` or `◉` - after implementation's completion flow, state was condensed to be token-efficient. 
%%

---
---
---

## Meta-Plan Reflection
%%Plan structure, navigation, planning workflows, exploration, execution. Meta stuff. To improve meta plan%%
### User-issues
- 
### LLM-issues
- 