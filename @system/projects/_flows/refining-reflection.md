# Refining Reflection
Description
**Why it's needed?** - describe

## Conditions to Run
- During completion/finalization of the step. 
- Manually by user. 


## Stages
- ### A - Exploration
	- Preparing to have all information needed at the checkpoint
	  
- ### B - Stop at the Checkpoint
	- LLM stops and asks the user to create a checkpoint and to allow to proceed to the next step. 
	  
- ### C1 - Improvement, Refinement, Broadening
	- ...
	- Updating reflection to its refined state
	- User reverts context of the task back to the checkpoint.
	  
- ### C2 - Defending Against the LLM's "Scorched Earth" Attack
	- 

## Rules
- todo

- A bit more compact flow. But the thing is - sometimes you don't know what you need. You write initial reflection. Then you need to defend it against LLM critique. Like you need LLM to go scorched earth on your reflection. ==HUGE==, because otherwise you're in your bubble. And it's damn hard to rely on honesty, because it's a finite resource. 
	- To not make things too complex - idea here is to just run separate task with simple flow before you go to planning.
		- But efficient one. you ask LLM to run exploration based on your reflection. The you make checkpoint. 
			- #1 - you discuss and refine reflection. with adding like "llm input at the bottom". Like (planning is about implementing reflection), this one is about figuring out what I want and need. 
			- #2 - then you revert to checkpoint, you attach refined reflection. And send LLM scorched earth on it. And try to defend it. with KEY RULE - LLM must appeal to my honesty. "Think about it honestly", "Be honest", etc. 
				- And you write that as defense block in the same reflection. 
	- Now you have not projection of your bubble. But something much more reliable and meaningful and honest. NOW you can plan it. 