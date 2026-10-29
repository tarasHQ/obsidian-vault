# "Scorched Earth" Critique

**Why this flow is needed?** 
- To make sure that the user doesn't make decisions based feedback from echo chamber.

**When this flow is expected to run?**
- Universally, at any point. Manually invoked by the user OR automatically through another flow's execution.

## Stages
- ### A - The Exploration
	- [ ] **A1** - [USER]
		- Provides LLM with artifacts that set the scope of the attack & discussion. 
		- Artifacts can be anything. Reflections, ideas, plans, implementation steps, etc.
	- [ ] **A2** - [LLM] 
		- LLM starts thorough exploration. 
		- Goal of exploration is to be able to steelman user's reflection first and THEN attack it.
- ### B - The Attack
	- #### Tone - Honest, Critical, Realistic, Efficient. 
	- [ ] **B1** - [LLM] - **Response #1**
		- Using `write` tool. 
		- Writes a temporary self-reflective exploration of attack surface in a temporary `.md`  file inside `artifacts/attack-surface-fewn4`, where last 4 digits are random [a-z0-9] to avoid duplication. 
		- Format is discussion threads between `Critic` and `Seeker`.
			- `Critic` - questions. What is attack surface here? What is reasonable issues? 
			- `Seeker` - seeks possible explanations on those questions
		- **GOALS**: 
			- prepare context for the real answer. No answers/recommendations is provided here. It just dozens of back-and-forth's in a thread-like structure with no depth limit. 
			- 
	- [ ] **B2** - [LLM] - **Response #2**
		- LLM lists 5 to 10 weakest points in the reflection. In the format provided below
			- Point X
				- Steelman case for advantages of the point.
				- Attacking the point by providing disadvantages.
				- Recommending another approach
				- Describing why that approach is better
		- Those points may cover issues from categories:
			- Blind Spots
			- Security issues
			- Performance issues
			- High Effort - Low Reward ideas
			- Short term fixes over proper long-term decisions.
			- Other, not listed and high-impact categories. 
- ### C - The Discussion
	- #### Tone - Honest, Critical, Realistic, Efficient. 
	- [ ] **C1** - [LLM + USER]
		- User will respond. If he pushes back - LLM must preserve tone of the attack stage and not give up easily based on weak arguments. 
		- Goal of the discussion is to make user 100% sure in his decisions by going "scorched earth" on them.