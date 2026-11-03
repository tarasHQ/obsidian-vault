# Initial Planning
From initial refined reflection(**what** I want to do) -> to properly explored, brainstormed high level plan (**how** to do it on high-level without focusing on code too much)

**Why it's needed?**
- To explore all possibilities of implementation, so user can lock-in the optimal one.

## Rules
- **STAGE AWARENESS** - Every response to the user should have current stage letter, name and substage letter-number at the first line.

## Stages
- ### A - The Exploration
	- [ ] **A1** - [USER]
		- Provides LLM with artifacts that will be used in the scope of this flow
		- Artifacts can be anything. Reflections, ideas, plans, implementation steps, etc.
	- [ ] **A2** - [LLM] 
		- LLM starts thorough exploration. 
		- Goal of exploration is to be ready to list many possibilities of implementation of user's artifacts. 
- ### B - Creating Big Picture
	- [ ] **B1** - [LLM] - **Response #1**
		- Using `write` tool. 
		- Writes a temporary self-reflective exploration of all implementation possibilities in a temporary `.md`  file inside `artifacts/implementation-possibilities-xxxx`, where last 4 digits are random [a-z0-9] to avoid duplication. 
		- Format is nested lists of questions and possible explanations (no answers/recommendations)
		- Goal is to prepare context for the real answer in the next turn.
	- [ ] **B2** - [LLM] - **Response #2**
		- No writing/editing.
		- LLM lists 5 to 10 of the most **(reasonable, high-level, radical, architectural)** implementation possibilities for of provided user's artifacts.
			- But you must include in consideration that user won't read previous artifact (it's for your exploratory brainstorming), so you have to explain everything properly, from the scratch.
		- Those points may cover categories:
			- More streamlined code %%(high level, not like a scope of the function)%%
			- Reduced lines of code %%(high level, not like a scope of the function)%%
			- Avoiding writing unnecessary files
			- More performant or secure code
			- Missed blind spots/edge cases
			- "High Reward" preemptive refactorings
			- Better long-term decisions
			- Other, not listed high-impact categories.
		- **FORMAT of every point**
			- **Name** - `[CATEGORY] Name-of-the-point`
			- **Benefit** - a paragraph on how this point is beneficial
			- **Complexity** - a paragraph or less about how complex is this point
			- **Closed Advantageous Doors** - bulleted list of others paths that will get closed/hard to mover/transfer to if this point will be accepted. 
			- **Description In Simpler Terms** - a paragraph of ELI5 description about this point. Goal is to preemptively explain it in simpler terms too, so if user didn't understand the point - he won't have have to start separate discussion, he'll just read the last block where everything is described in a format that is more understandable 
- ### C - The Discussion
	- [ ] **C1** - [LLM + USER]
		- User will respond for clarification
		- Goal of the discussion is to refine ideas/possibilities/artifacts based on user feedback. 
		- Discussion goes until the user is approved moving to the next stage. 
- ### D - Filling Out the Plan and Drafting the Steps
	- [ ] **D1** - [LLM + USER]
		- LLM fills out the `_plan_xxx.md`'s **exploration section** with concise related links/tips on exploration for future tasks on this plan based on experience with current exploration.
		- Between 00 and 99 steps - inserts ### Drafted Steps Recommendation block, with suggested order/granularity of steps as simple bulleted list with one point per list (will be deleted when actual steps arrive)
	- [ ] **D2** - [LLM + USER]
		- Through user's approval - LLM updates user's artifacts to be aligned with locked-in decisions/refining from current flow-task. 
- ### The End