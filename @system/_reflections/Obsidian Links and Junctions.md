---
ctime: 2026-10-23 19:38
isIntegrated: false
---


###### Meta-reflection (On completion)
%%Awareness to avoid repeating friction or to improve what works%%
%%issues/friction/inconvenience. Also sometimes I reflect on high cost-low reward topic/issue. I need to be aware of those.%%

---

## Problems & Goals
%% To prevent drift from the initial target and ending the reflection without answering on what it was about%%
- Any links in symlinked project's folders are not reliable and can break 
- I need to figure out a way to handle links that won't cause me any issues down the line.

## Insights
%%Condense insights to keep them actionable and easy to review%%
- 

---

## Raw
%%Free-form reflection with no rules or structure%% 
- BTW. It gets worse. Not only on moving symlinked folder, but also on moving phase - links will get broken too. So any folder/file movement will break them. which is critical. Because I could do without moving symlinked folder, but without movement at all - no. 
- Ok. So what are my options?
- **Not using symlinks**
	- Big thing with symlinks is that I can add/edit codebase's documents from the phone. So it's convenient to like work in bed until I fall asleep (if I need to read docs, I write down some ideas.) Or if PC is off. Sync makes this very entertaining. and without the friction. 
	- And symlinks (or junctions) allow to have automatic integration into the codebase. PC gets on. Obsidian opens at startup - everything is synced.
	- ---
	- Now if I drop symlinks. Value of sync decreases. It's a bit PIA to capture thoughts. 
	- But I'm not using the phone obsidian that often anyways. But that's because framework is WIP. So you're focused on the meta level, not on real things. 
- **using relative links vault-wide**
	- Looks bad, reads bad, LLM can get confused. But that's because I don't know how my knowledge system would work .Because if it'll be using links a lot - that's one thing. If it'll be separate notes with indexes - another thing. 
	- I'll need to google it
	- ---
	- What would it look like ideally? 
		- I use current logic. Shortest path. And completely offload the need to control links to the obsidian. 
- **discarding idea of links**
	- It's sound idea for the framework links. But what if I would want to have a step reference some file from ideas/? I would need a link. For LLMs and for me. So I can't just drop links alltogether
---
- Ok. I can't NOT use links. I can't use relative links, and I can't drop symlinks. 
- Ok, what if we reverse it? 
	- symlink target will be not the project's obsidian folder, but obsidian' vault's folder? Like yeah, there's issue with following symlinks for my llm project, but maybe it'll be doable to fix. 
	- the issue though, is that you'll have to always use system-wide ripgrep to reference those. 
	- so it has its own issues... 
---
- What else is left? Yeah... not much. Maybe I can use plugin to disable link updates in specific folders? 

---

- I found solution. Disable autoupdates BUT  it doesn't disable tracking. I need to update links rarely. I mean when that logic needs to be invoked. So. I just keep it in the manual mode. Disable/hide/minimalize button to enable auto update. To not press accidentally. (through css). And will handle those links manually. When stuff in project changes - I don't update links. But when I move stuff in obsidian vault - I update links "j"
