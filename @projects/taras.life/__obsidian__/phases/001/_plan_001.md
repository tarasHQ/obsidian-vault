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
- #### Plan
- #### Nuances

---
---
---

## Steps
%%Rendered by dataview for the user%%
```dataviewjs
await cJS(c => c.PlanStepsList.renderSteps(dv, this.container));
```