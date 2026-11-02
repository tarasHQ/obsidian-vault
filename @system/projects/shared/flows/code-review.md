# Code Review
A task that is purely focused on quality of code of the implemented step. 

**Why it's needed?**
- Implementation flow usually have some additional explorations, discussion, rewrites/updates/etc, by the time it's done - context is too bloated for the proper code review. 
- This flow allows to maintain high quality of the written code by fully specializing on a single task. 

## Rules
- **STAGE AWARENESS** - Every response to the user should have current stage letter, name and substage letter-number at the first line.

## Stages
- ### A - The Exploration
	- [ ] **A1** - [USER]
		- Provides LLM with artifacts that will be used in the scope of this flow.
		- Artifacts can be anything. Reflections, ideas, plans, implementation steps, etc.
	- [ ] **A2** - [LLM] 
		- LLM starts thorough exploration. 
		- Goal of exploration is for LLM to know **WHAT** should've been implemented and **HOW** it was implemented, including its integration into the context of the phase.
- ### B - The Explanation Of Implementation
	- [ ] **B1** - [LLM] 
		- LLM responds to the user with a two-block response:
			1. proper explanation of implementation first
			2. Preemptive explanation in simpler terms, in case user won't understand something because of lack of knowledge/experience on the matter. 
		- The goal of this answer is to ensure the user has good knowledge of what was done. 
	- [ ] **B3** - [LLM]  - THE EXAM
		- LLM must ensure that user has proper knowledge of what was done on low and high levels. For that, after the explanation - LLM must do an exam for the user and proceed only if user scores 90% correct responses. 
		- Format of the exam
			- Goal isn't to catch the user on syntax technicalities, but to make sure he truly understand how things works in code and abstractly. 
			- Questions that accept written answer only. 
			- Expected answer should be under 2-3 sentences (not penalized if longer but correct). 
			- Amount of questions should be sufficient to cover the step.
- ### C - The Code Review
	-  **Tone** - Honest, Critical, Realistic, Efficient. 
	- [ ] **C1** - [LLM]
		- No writing/editing.
		- LLM lists 5 to 15 of the most **(reasonable, low-level, radical, architectural)** implementation possibilities for the implemented step.
		- Those points may cover categories:
			- More streamlined code
			- Reduced lines of code
			- Bugs
			- Missed handling edge cases
			- Code Smells
			- Quick and dirty solutions instead of proper ones
			- Avoiding writing unnecessary files
			- More performant or secure code
			- "High Reward" preemptive refactorings
			- Better long-term decisions
			- Other, not listed high-impact categories.
		- **FORMAT of every point**
			- **Name** - `[CATEGORY] Name-of-the-point`
			- **Benefit** - a paragraph on how this point is beneficial
			- **Complexity** - a paragraph or less about how complex is this point
			- **Closed Advantageous Doors** - bulleted list of others paths that will get closed/hard to mover/transfer to if this point will be accepted. 
			- **Description In Simpler Terms** - a paragraph of ELI5 description about this point. Goal is to preemptively explain it in simpler terms too, so if user didn't understand the point - he won't have have to start separate discussion, he'll just read the last block where everything is described in a format that is more understandable 
		- **THE LAST POINT**
			- At the end of the list llm adds the last point under which it lists minor issues. Like wrong/outdated comments, importing/exporting issues, typos, ordering of the code in files, and other minor issues that should be fixed, but that aren't big enough to be covered under points above.
- ### D - Action
	- [ ] **D1** - [LLM + USER]
		- Discussing the review
	- [ ] **D2** - [LLM]
		- Implementing locked-in points from review and fixing the code
	- [ ] **D3** - [LLM]
		- Making sure that the plan and steps are aligned with results of the current flow
- ### The End