# LLM.md
%%Hub of the planning system.%%

## Description of `./__obsidian__/`
- ### Why it exists?
	- Main goal is **to reduce cognitive load**. The project gets complex, lots of things to think about, track, improve, fix, implement, plan, etc. The more efficient cognitive load is - the **higher productivity**, the **higher quality** of plans and implementation.
	- On top of it I have **sync**, which allows me to have access to this folder on all my devices for quick edits/ideas/reflections.˜
	- SSOT for **unprocessed ideas/reflections**, more implementable and doable things are extracted into README's of specific module of codebase. But long-term/unprocessed things have SSOT, which helps with cognitive load as well, because I don't have to think where to reflect, where to save, how to transfer to pc, do I need it saved or can I delete it, etc.
	- And last but not least - **phase-based development**, that further is decomposed into steps with carrying-in/hand-off blocks allow to avoid reading/re-reading/maintaining a lot of outdated and unnecessary information. Phase's plan captures static long-term abstract things, steps have short-term implementation-related things separated into clean and isolated execution blocks.
	  
- ### Structure
	- `_reflections/`- My project-wide reflections
	- `artifacts/` - Storage for additional files/images/sounds/etc. scoped for the whole plan. 
	- `ideas/` - Quick capture of random ideas that I don't want to process or integrate into codebase module's README.md files.
		- `phases/` 
			- `XXX/` - Number of a phase, e.g. `003/` or `052/`
				- `_reflections/` - My phase-scoped reflections. 
				- `artifacts/` - Storage for additional files/images/sounds/etc. scoped to the phase only.
					- `_exploration.md` - Phase-scoped exploration notes (links to related files, tips). Created at phase birth, updated during step completion flow.
			- `ideas/` - For phase-scoped idea capture, to process them later.  
				- `steps/` - Implementation steps files
					- `_step-template.md` - Phase-scoped SSOT template for new steps, copied from `=step-xx.md` at phase birth with `|PHASE_NUMBER|` substituted
				- `_plan.md` - High-level plan of the current phase, also is an entry to the phase
	- `/_project.md` - Project's entry point. Overview of phases + reflections & ideas

## Flows
%%Flows are modular and offloaded — read a flow only when entering its stage, keep it out of context otherwise.%%
- ### [Initial Planning](./_flows/initial-planning.md)
	- [Absolute link for LLMs](C:\Users\Taras\Documents\obsidian-vault\@system\projects\_flows\_initial-planning.md) 
	- Stage 1 of a phase: user's raw intent → high-level plan + step division sketch. Read when starting the high-level planning of a phase.



---

---

---

# Archive

%%Content below is the pre-restructure version, kept verbatim. It is being rearranged
into the new structure over time — do not treat it as current guidance where it
contradicts the sections above.%%

# Planning
SSOT of plans, reflections, idea capturing, phases and implementation flows of all of that. 



## Step-by-Step Workflow
- #### 1. High-level planning
  %%Creating the initial skeleton of the phase%%
	1. [User] Running template of phase creation
	2. [User] Reflecting on the the upcoming phase to get the whole scope of the problem
	3. [User] Filling up the phase's plan (goals, visions, high-level points, etc.)
	4. [User] Checking `00-start.md` step
	5. [LLM + User] Generating LLM's block of high level planning + steps division **(no details on steps yet)**
- #### 2. Low-level planning loop
  %%Starting the loop focused on creation of steps contents%%
	1. [LLM] You can use the same `explore` flow from the implementation block below, if we're planning the step in the middle of the phase. If we starting from the scratch - obviously there's nothing to explore. 
	2. [LLM + User] Creating a step and writing the initial top block of the step until `implementation` block
	3. [LLM + User] Refining that block until it can be locked-in
	4. [LLM + User] Writing bottom block of the step from `implementation` block onwards
	5. Repeat until all steps are created.
- #### 3. Implementation of the steps
  %%Loop of implementation of a step until all steps are implemented%%
	1. [LLM + User] Starting step implementation task
	2. [LLM] Using `explore` tool for token efficient familiarization with all steps to figure out:
		1. structure of steps
		2. what they implemented/will implement
		3. which step files are very relative and worth to be read fully to meaningfully enrich the context of current step.
	3. [LLM + User] Going through completion of the step checklist. 
	4. [LLM + User] Removing completion of the step checklist. 
	5. [LLM + User] Proceeding to the next step.
	6. Repeat until all steps are completed.
	7. == SHOULD BE IN THE STEP COMPLETION FLOW ==
	8. [LLM + User] Refining plans/reflecting/implementations as we go through the step
	9. [LLM + User] Writing down `Caught Implementation Deviations`
		1. 
	10. [LLM + User] Checking that further steps are still aligned.
- #### 4. Finalization of the phase
	1. [LLM + User] Executing last step `99-END.md`

## Steps - Templates & Rules 
%%These are mostly generated by LLM, so we need separate block to handle these%%
### Rules
- #### General
	- File names in **lower-case**, e.g. `05-subscription-manager-refactor.md`
	- Steps can be further subdivided by decimal. e.g. `05.5-subsciprtion-manager-refactor-2.md`
- #### Frontmatter
	- `status` - `waiting/postponed/implemented/skipped` - self-explanatory statuses.
	- `state` - state of the step's contents
		- `placeholder` - minimal file to just hold the place until there's time to do high-level/implementation blocks
		- `high-level` - meaning only top high-level block is written and implementation block is not
		- `full` - high level and implementation blocks are written and step is ready for implementation.
		- `condensed` - after completion flow, state was condensed to be token-efficient. 
	- `reviewedAtStep` - quoted step identifier of the last meaningful review, e.g. `"03.5"`.
		- Creation counts when the document is meaningfully reviewed; later edits alone do not update this property.
		- Review means checking the whole step for accuracy and alignment with the phase. Update explicitly, never from file modification time.
		- Leave empty until reviewed. Missing or empty values are displayed as `—`.
- #### Contents Description
	- ##### Description
		- One paragraph of what this step is doing in simple words, so if user forget about it, it's easy to understand it.
	- ##### High-Level
		- Intended outcome - what we should get at the end of the step and how it should work
		- Local invariants - not high-level enough to be in the plan, but worth to be locked-in in the step.
		- Should NOT be done in this step - 
	- ##### Discussions & Reflections
		- LLM rarely one shots all the right decisions. So this section should allow user and LLM to communicate and evaluate all options for the step. 
		- Contents
			- list of key decisions and/or issues and/or improvements in a free form. description of the issue/improvement first, then 3 options to address it (quick and easy, proper and long-term, optimal balance)
		- For reflections - it's purely reminder for user that he can have compact reflection under that block as well.
	- ##### Implementation
		- There's no limits on amount of tasks or subtasks of each task. 
		- `Written at the step |xx|` used as ref. point to see how far current step is from its creation to see whether we should re-evaluate it because of the risk of the drift.
		- Task number should be an integer e.g. `01`, but for unexpected in-between we can use decimal number e.g. `01.1`
		- Task name - 3-10 words that describe what the task does
		- Subtask description is a piece of information 
	- ##### Completion Flow
		- Decisions. Figure out what needs to be extracted. 
