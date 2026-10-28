## Description
Every single flow in `_flows` must adhere to these rules to be of high quality. 

==TODO: - Examples per each rule, to make it more practical==

## Rules
- **Repeatable**
	- Means using a template. So current flow of LLM.md acting as hub + absolute links is good.
- **Read-only**
	- if all tasks will write summary or something - it will bloat it. 
- **Sequential**
	- Expected. Structure. Which means you don't have to think about "optimal order of execution". Makes it very action-oriented.
- **Identifiable Steps**
	- Number, not bullet. Name. Not description. 
	- It feels like these make "probability anchors" for LLM. Harder to miss/ignore/hallucinate, because "meaning" attached to it. It's not like one bullet point among 50 others. 
	- Don't use words/numbers that overlap with projects. Steps/phases/01/001/ those terms from the plan template. Like instead of numbers - use letters. ABC. Instead of steps - use stages OR chunks OR actions OR etc. Make flow distinct from the execution of the flow. 
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