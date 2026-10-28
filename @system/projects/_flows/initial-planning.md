# Initial Planning
Description
**Why it's needed? **

## Stages
- ### A - Exploration
	- Preparing to have all information needed at the checkpoint
	  
- ### B - Stop at the Checkpoint





### initial planning
- the thing of this is that it's should go wide before going narrow. Which means it has to be at least 2-step conversation. 
- Oh. oh. this shit needs additional folder. for sure. Here's what I think
	- it wasn't meaningless because of its idea being stupid. It was meaningless because I got an nuclear warhead and named it as dynamite stick. 
	- So.  that's the key thing where everything gets bad in current flow. And where you put unnecessary constraints on LLM too. 
- You start to plan. With that plugin for example. You start to go into "recommended" too soon. Instead, you should prioritize order and go wide. Through docs. 
- #### specifics. 
	- ##### First step - Categorization of the Issue
		- #1 - I want to write a plugin. Give me categories on this. 
			- Returns: implementation, deploying, location, integration. 
		- #2 - Write down each category with you recommendation and 2 additional options in separate file according to the provided template.
			- Template frames this findings as mere suggestion. And has internal rules that allow broad options,. Like basically it's like a big prompt
			- Returns: a set of files on each main category about what you want to do. 
	- ##### Second Step - You go WIDE
		- ==🟡HUGE INSIGHT - You were saying that it gets boring when you wait for LLMs response, and because of that it's slow and boring. This flow of wide then narrow - provides you with lots of options. You can run 5 tasks in parallel on each file. And then have an hour of focused work on each one==
		- #1 - You attach each document. It's self-contained. All you have to do is attach it + maybe agents and llm.md? 
			- Returns: 
				- 3-5 high-level, architectural, radically different options. (unbiased) that autoregressive property of llm could be helpful.
					- each one have description how it's useful and what's its cost. Also it would have description in simple terms, in case I won't understand it. 
				- THEN we have scores on each one. 
					- so previous unbiased tokens will less affect that first high level block and scoring. 
				- NOW we have recommended option with 3 choices of low level implementation with table, score and recommendation at the bottom. 
		- #2 - You either choose or discuss further on each task on each document.
			- Returns:
				- a set of locked categorical decisions. 
	- ##### Third Step - You go NARROW
		- #1 new task - Category by category. What is needed to be locked in plan - the rest locked in steps. 
			- ### Styling
				- 1
				- 2
				- 3
			- ### Coding client-side
				- step 1 
				- step 2
				- step 3
			- ### Deployment
				- step 1
				- step 2 
				- step 3
		- #2 
	- ##### Forth Step - Delegating to Next Flows
		- making sure nothing is forgotten. 