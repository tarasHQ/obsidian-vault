# Implementing Steps
Efficient and focused implementation of steps. 

**Why it's needed?**
- Implementation/execution of the plan is major part of the phase, and it needs separate focused attention and shouldn't be taken lightly. 
- Doing proper implementation is as important as planning it. 

## Rules
- **STAGE AWARENESS** - Every response to the user should have current stage letter, name and substage letter-number at the first line.
- **99-end.md** can be used also to accumulate phase specific end-phase-task. Checks/evaluations/"things to come back to when the phase is done"/tests/end-of-phase-discussions/etc.


---

## Stages
- ### A - The Exploration
	- [ ] **A1** - [USER]
		- Provides LLM with artifacts that will be used in the scope of this flow
		- Artifacts can be anything. Reflections, ideas, plans, implementation steps, etc.
	- [ ] **A2** - [LLM] 
		- LLM starts thorough exploration. 
		- Goal of exploration is to have all the knowledge related to implementing the current step both, in isolation and as integrated part of the phase.
- ### B - The Implementation
	- [ ] **B1** - [LLM]
		- Implementing the step.
		- If there's any missed open decisions or confusion - discussion with the user should be done first. 
		- If there's not open decisions/confusion - proceed to implementation.
- ### C - The Step Completion Flow
	- **C1** - [LLM] - Finalizing the Current Note
		- [ ] Setting up corresponding state and/or status
		- [ ] **Asking if the user will run Code Review flow and waiting for the answer** 
	- **C2** - [LLM] - Finalizing the Step In the Plan
		- In the List of Steps:
			- [ ] Settings an icon to corresponding frontmatter status of the step.  
			- [ ] Rewriting description from "what should've been implemented" to what "what was implemented"
			- [ ] Commenting the step inside single `%%comment-block%%`placing first `%%` tag right after the icon in heading, and placing second `%%` tag at the end of the new "implemented" step description.
				- This will render for user in smaller dimmed font, hence, signifying completion of the phase.
		- In Other Parts of the Plan:
			- [ ] Making sure plan does not contradict to what was done in the current step. Like situations when fact X in plan says one thing, but implemented fact X in the step does different thing. 
			- [ ] (Only if necessary) Updating exploration section.
	
	- **C3** - [LLM + USER] - Condensation of Current note
	  %%Goal is to shed all useless things, so this step can be token-efficiently read for context in the future. %%
		- [ ] It starts in separate clean task. DO NOT allow user to run condensation if other things were executed in current task. 
		- [ ] **LLM SHOULD ASK FOR USER APPROVAL BEFORE PROCEEDING**, in case other flows are still working on this step.
			- [ ] Additionally LLM should propose to the user to run a code review flow in parallel to this task.
		- If previous conditions are met:
			- [ ] Resolve temporary notes/open questions (if any) with the user. Ask him about what to do about them.
			- [ ] Remove temporary notes/investigations (if any)
			- [ ] Condense each task + subtasks to a single '- Task Name - Task Description in 1-3 sentences' bullet point
			- [ ] Remove completion flow block
			- [ ] Make sure note's frontmatter status/states is correct