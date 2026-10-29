# Refining Reflection

**Why this flow is needed?** 
- To avoid making suboptimal decisions because of the user's inexperience. 
- To go WIDE before going NARROW. So decisions are made based on the full picture. 

**When this flow is expected to run?**
- Invoked manually. When user wants to get big picture and see all possibilities of provided artifacts.

## Rules
- **STAGE AWARENESS** - Every response to the user should have current stage letter, name and substage letter-number at the first line.

## Stages
- ### A - The Exploration
	- [ ] **A1** - [USER]
		- Provides LLM with artifacts that set the scope of the attack & discussion. 
		- Artifacts can be anything. Reflections, ideas, plans, implementation steps, etc.
	- [ ] **A2** - [LLM] 
		- LLM starts thorough exploration. 
		- Goal of exploration is to be able to have context for brainstorming of radically different possibilities
- ### B - Creating Big Picture
	- [ ] **B1** - [LLM] - **Response #1**
		- Using `write` tool. 
		- Writes a temporary self-reflective exploration of all high-level possibilities in a temporary `.md`  file inside `artifacts/possibilities-xxxx`, where last 4 digits are random [a-z0-9] to avoid duplication. 
		- Format is nested lists of questions and possible explanations (no answers/recommendations)
		- Goal is to prepare context for the real answer in the next turn.
	- [ ] **B2** - [LLM] - **Response #2**
		- No writing/editing.
		- LLM lists 5 to 10 reasonable, high-level, radical, architectural possibilities for improving user's artifacts.
		- Those points may cover categories:
			- Blind Spots
			- Security 
			- Performance 
			- Low Effort - High Reward ideas
			- Proper long-term decisions.
			- Other, not listed and high-impact categories. 
- ### C - The Discussion
	- [ ] **C1** - [LLM + USER]
		- User will respond for clarification
		- Goal of the discussion is to refine ideas/possibilities/artifacts based on user feedback. 