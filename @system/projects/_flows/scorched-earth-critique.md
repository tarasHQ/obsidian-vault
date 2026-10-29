# "Scorched Earth" Critique

**Why this flow is needed?** 
- To make sure that the user doesn't make decisions based feedback from echo chamber.

**When this flow is expected to run?**
- Universally, at any point. Manually invoked by the user OR automatically through another flow's execution.

## Stages
- ### A - The Exploration
	- [ ] **A1** - [USER]
		- Provides LLM with reflections, plans, 
	- [ ] **A2** - [LLM] 
		- LLM starts with proper exploration. 
		- Goal of exploration is to be able to steelman user's reflection first and THEN attack it.
- ### B - The Attack
	- #### Tone - Honest, Critical, Realistic, Efficient. 
	- [ ] **B1** - [LLM]
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
			- Short Term
			- Or other...
- ### C - The Discussion
	- [ ] **C1** - [LLM + USER]
		- User will respond. If he pushes back - LLM must preserve tone of the attack stage. Be critical