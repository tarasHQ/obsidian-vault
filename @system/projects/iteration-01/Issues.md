
## Meta-Plan Reflection
(llms should ignore this. it's for future phases/templates.)
### Issues

- **other**
	- 

- **plan**
	- Issue with high-level block. As a user it was hard to write initial thing. It should be kind prompt-like. Not like decisions/invariants. Just give the user free form. 
	- For llm's high level though - it gets big really quickly. 
	- High level - must contain links block, with related links, so I don't have to re-type them each time in each new task.
	- same as with steps - `status` and `state`? 
- 
- **planning.md**
	- too vague. implementation starts without discussion. llm dumps everything at once. no granularity or control. It's just a mess. Too vague for sure. You shouldn't have single bullet list for that. Each block should be separate, each point should be properly described. You need to have "completion conditions" on each block/loop to have clear stops.
		- **IMPORTANT**. Like it's not a joke, there must be **routine** to this, if it's different every time - you're getting overwhelmed.
		- Like that planning block must be hyper important and be the center of gravity for the whole task. 
		- Like it should have its own section in agents, to clarify its importance. 
	- **TLDR** - you lack routine in this. Process is chaotic and unpredictable. That's adds a lot of friction.
- `_project.md`
	- needs some automatic fetching I recon. 
	- but the issue is with LLMs getting understanding of this stuff... 
### What's good
- having SSOT on shared decisions/invariants/nuances/etc.
	- like with the notion that we now have remark42-old folder, I don't have to mention it in each step. SSOT for everything. Good. 
- Condensation logic - definitely good. 
- **Routine** - routine is super good. When you manage to have it - it reduces complexity and feeling overwhelmed by A LOT.

---

## High Level
- **getting overwhelmed**
	- The issue was too much issues. Like I explored stuff until 100k context, and then everything went apart. So what I had to do, is to use branches and slowly, step by step, explore all possibilities. And work on each one. Step by step.
## Low Level
- **steps**
	- I need additional status for canceled/discarded steps (like for tests, when I decided to not do it, or for 08, when I decided to do it in another phase)
	- takes lots of time to re-explore all stuff I did while I was writing initial step contents. So each step should have "comprehensive exploration" section where LLM leaves links/notes/tips about how to research everything on the topic quickly. without many loops of back and forth. 
	- Discussion and reflection - should have brief template as well, kinda like I had with kilo code. Autoregressive. Recommended choice. Explain in simple words. Also - I should add rule to automatically add at the end user input point. like `- USER INPUT: ` so I can type right away the answer
	- On each step. High level template. **DO WE ACTUALLY NEED IT?**, like with tests right now. I just got overfocused on that. I don't actually need them. 
	- Crucial. Make sure each step is optimally sized. So there's no like huge multi-hour step 01, while step 02 and 03 are done in 10 minutes. Step should be bite-sized. 
		- **ESPECIALLY FOR CONTEX**. This is the main measurement for whether step is small or big. (besides complexity), if we need to read 50k tokens worth of files before we even start the discussion - step is too big for sure. 
	- another big one. plan initial steps through artifacts. or in conversation. But not all at once. but one by one. 
		- like you write down somewhere top-level overview of planned steps. then do some exploration on implementations. write down description/high level. 
			- **KEY ISSUE - what if context is overfilled before all steps are written?**
- **tasks**
	- completion flow doesn't go as separate block. it's just another task at the end like `### 99 - completion flow`, so LLM won't repeat it.
- **artifacts**
	- maybe it makes more sense for llm to write its output into .md files? Like I'm repeating the same thing right now. First task was exploring 10 minutes about how quartz proposes to write plugins, and now, in a new task, I'm wasting another 5-10 minutes on the same damn issue. 
## Technical
- js html dataview block
	-  use icons for showing state of the step (full/high-level/condensed)
		- ○ ◎ ◉ or 🟢🔵🟡
	- inner scrollable container, so 20 steps won't make me scroll forever. Keep it compact. Show maybe last 4?
		- Though I'm not sure whether you need it. Maybe dataview selector is better for table at least? (cuz you can then parse it into website on build time)
	- **rendered list of steps** 
		- completed step should be much more dimmed
		- We need some minimal borders around both table and list.
- Navigation is kinds PIA. I have to switch between vscode and obsidian. 
	- the issue is that you get overwhelmed by the amount of docs and text.
		- Like right now one thing was changed - 5 docs were edited. I'm like not even want to do anything with it. There's just damn walls of text I don't care about. This fucking LLMs...