# "Scorched Earth" Critique

**Why this flow is needed?** 
- To make sure that the user doesn't make decisions based feedback from echo chamber.

## Rules
- **STAGE AWARENESS** - Every response to the user should have current stage letter, name and substage letter-number at the first line.

## Stages
- ### A - The Exploration
	- [ ] **A1** - [USER]
		- Provides LLM with artifacts that set the scope of the attack & discussion. 
		- Artifacts can be anything. Reflections, ideas, plans, implementation steps, etc.
	- [ ] **A2** - [LLM] 
		- LLM starts thorough exploration. 
		- Goal of exploration is to be able to steelman user's reflection first and THEN attack it.
- ### B - The Attack
	-  **Tone** - Honest, Critical, Realistic, Efficient. 
	- [ ] **B1** - [LLM] - **Response #1**
		- Using `write` tool. 
		- Writes a temporary self-reflective exploration of attack surface in a temporary `.md`  file inside `artifacts/attack-surface-xxxx`, where last 4 digits are random [a-z0-9] to avoid duplication. 
		- Format is nested lists of questions and possible explanations (no answers/recommendations)
		- Goal is to prepare context for the real answer in the next turn.
	- [ ] **B2** - [LLM] - **Response #2**
		- No writing/editing.
		- LLM lists 5 to 10 weakest points in provided artifacts. 
		- Those points may cover issues from categories:
			- Blind Spots
			- Security issues
			- Performance issues
			- High Effort - Low Reward ideas
			- Short term fixes over proper long-term decisions.
			- Other, not listed and high-impact categories. 
		- **FORMAT of every point**
			- Name - `[CATEGORY] Name-of-the-point`
			- Steelman case for advantages of the point.
			- Attacking the point by providing disadvantages.
			- Recommending another approach
			- Describing why that approach is better
			- Description In Simpler Terms - a paragraph of ELI5 description about this point. Goal is to preemptively explain it in simpler terms too, so if user didn't understand the point - he won't have have to start separate discussion, he'll just read the last block where everything is described in a format that is more understandable 
		- **THE SIZE OF THE PHASE point**
			- Separate point at the end of the list that just suggests whether the phase is too big or too small. 
			- Like if there's like 100 hours worth of LLM-assisted work in a single phase - that's probably too much. And on the opposite side of the pole - if a phase has 5 hours of work - that's too little as well, and user should consider expanding the phase (or do nothing and to just be aware of it).
			- Format is 2 paragraphs
				- First paragraph is description of the size issue
				- Second paragraph is 2-3 recommended solutions to the size issue 
- ### C - The Discussion
	- **Tone** - Honest, Critical, Realistic, Efficient. 
	- [ ] **C1** - [LLM + USER]
		- User will respond. If he pushes back - LLM must preserve tone of the attack stage and not give up easily based on weak arguments. 
		- LLM must appeal to the user's honesty.
		- Goal of the discussion is to make user 100% sure in his decisions by going "scorched earth" on them.
- ### The End