---
ctime: 2026-10-28 18:26
isIntegrated: false
---

###### Meta-reflection (On completion)
%%Awareness to avoid repeating friction or to improve what works%%
%%issues/friction/inconvenience. Also sometimes I reflect on high cost-low reward topic/issue. I need to be aware of those.%%

---

## Problems & Goals
%% To prevent drift from the initial target and ending the reflection without answering on what it was about%%
- I don't know how flows should look like so I would be motivated to use them. 
- Like right now it feels like as if it's a bit burden maybe? But that's because LLM wrote that one flow. It's stupid. I need something done by me.

## Insights
%%Condense insights to keep them actionable and easy to review%%
- 

---

## Raw
%%Free-form reflection with no rules or structure%% 
- Ok. here we go. 
- So the issue is that I don't feel like those flows are worth it. BUT. 
- Without them - I'm at mercy of LLM. No structure. No routine. No nothing. Chaos. Which makes me overwhelmed. This is an issue. I can't have high speed situation if I'm overwhelmed. 
- ### Apply flow to current "task"
	- I'm not sure it's applicable because it's meant to be written by me mostly. 
	- But let's try anyways. 
	- So, what's the issue right now? 
		- Yesterday I wrote a plan that was too high-level. When implementation started - lots of additional work popped up. Including current workflows. Like I wrote those in theory. But in practice I have nothing. 
		- So, the workflow I would use, that initial planning + steps drafting. It would've helped. Nah. It's stupid. I can't fit current task in honest flow. 
- ### Focus on the flow
	- #### Properties
		- **Repeatable**
			- Means using a template. So current flow of LLM.md acting as hub + absolute links is good.
		- **Read-only**
			- if all tasks will write summary or something - it will bloat it. 
		- **Sequential**
			- Expected. Structure. Which means you don't have to think about "optimal order of execution". Makes it very action-oriented.
		- **Identifiable Steps**
			- Number, not bullet. Name. Not description. 
			- It feels like these make "probability anchors" for LLM. Harder to miss/ignore/hallucinate, because "meaning" attached to it. It's not like one bullet point among 50 others. 
		- **Reliable**
			- If I would have to fight LLM to keep up with flows - it would be an issue. 
			- So the flow must have another kind of "anchors", to, both - make sure LLM follows the flow AND increase probability of LLM to follow the flow. 
				- like simple big rule for LLMs at the start of the flow like 
					- "on each response write the step of the flow you're executing."
					- "You must execute each step separately and report on its completion to the user"
		- **Explicit**
			- Ties into reliability. If the flow is implicit, not a bit verbose - LLM will forget about it. Or importance of the flow will be reduced. 
		- **Controllable Chaos. NOT Overwhelming Tyranny**
			- As in life. LLMs are chaotic systems. You can't place/expect strict order following. Instead you must at least not fight with it OR, at the very best, make it into a win. 
				- Practically though?
	- #### Flow
		- You combine those properties into a file then? 
		- rule at the start. Explicit. Each response should contain feedback towards execution of the flow. 
		- So, I can lock that. The issue I had - is that I confused two things. flow itself and content of specific flow. Flow itself is solved in block above. Like you ==should extract it and put it inside `_flows/` as  `_rules.md`==-  Whatever you create, if it's aligned with those rules - that flow will likely to be better than without those rules. And they're restrictive but also permissive at the same time, so it's not trying to work against LLM's nature. 

- ### initial planning
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
- ### Reflection
	- With plugins. it would've been nice if it mentioned radical high gain changes. Like it was very restricted. 90% of such changes would probably be easily discar
- ### Riding the Chaos
	- Is it possible? Or it's just BS quote? 
	- Well. What is positive nature of chaos? Potential. Upward transformation. Treasure. Adventure. 
		- Ok. here's the thing. The more orderly you are - the bigger capacity to confront the chaos. Seems like. Because you're not like constantly being teared apart my 1000 minor things. 
		- How flows themselves would handle Chaos? 
	- So by that I see some external evaluator or something. 
	- But my project have minimal abilities yet. I have to manage this within what I have in my grasp.
	- Well, I have explore tool. Won't be hard to create additional one. That can be more interactive. I already have functionality for interactivity. It can be done in an hour or less. 
	- #### The New Tool
		- So, this may be interesting if done properly. It's limiting, and the project isn't a main target. But it's a huge waste of the potential. Like it's literally 2 heads better than 1. Considering that I can have more than 2 too. 
		- But is that touching the flow or not? It's chaos - it has potential, but it won't be easy. '
		- Do I need it? What capabilities this posses?
			- Evaluation
			- Verification
			- Side tasks
		- What would be the issue in my flow? 
		- Like take initial planning for example. It's kinda sequential task. I can't plan step 4 if step 1 isn't planned. 
		- I really start to doubt that this branch of thought is worth it. 
		- ##### Code review.
			-  That's it. Implementation of steps is a flow in itself. And code logic is kinda big cognitive load. So you can have a tool that is focused solely on code review. It will reduce issues that stem from you or LLM missing some pieces. 
				- Because current context will be bloated for proper code review, but also it is good for task finalization. So there's that.
		- what else? The issue with planning is that it's like proper discussion i//debate. you have a topic to discuss. Then you bring 5 arguments and the other side brings 5 arguments. Now you discuss 10 things. Then it's a 100. 
			- So this hints on think-through subtasks. 
			- Imagine previous task with fonts
			- but wait, how it's different from branching and then going back with context handoff? Code review is kinda low-effort if you just prepare a prompt. 
		- Like if my project was more complete, then sure - huge advantage. But at this point - nah. 
		- So I will stop this branch of thought. 
		- Or leave it open when I'll work on flows. So if there will be situation where this idea can be inserted naturally - then we'll use it. 
