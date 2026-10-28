## Templates
- Should be inside the SSOT shared folder linked by absolute paths. Same as `LLM.md`.
	- So `LLM.md` becomes a hub that will contain links to those files.
- 


## Plugins
- ### Dataview
	- #### JS
		- `require()`, `path`, `app.vault.adapter.getBasePath()` - have issues on iOS. So avoid those in scripts.
		- JS is parsed to quartz a bit poorly. So prefer native dataview queries for now. 

## Templater
- #### General
	- **Master Template** - to have everything in one place, including Templater's templates, I'm using master template inside templater folder, to invoke list of project templates in current folder. This also allows to avoid bloating vault-wide templates with projects-related ones, which there will be plenty of.
- #### JS
	- **Config at the top** - all configurable values should be at the top CFG const, so it's easy to configure scripts.
	- **<> Tags Ban** - Don't use `<>` tags inside js comments (templater js), to mark some adjustable value it breaks markdown rendering after those tags in obsidian.

## Decisions
- **Templates should be self-documenting**
	- **Reason**: Avoid duplication. Like flow, you write it down here, and then there's like 80% of what is in the plan template
- **Obsidian Dataview shouldn't be used to pull up steps** ~~Dataview should be used to pull up steps~~
	- **Reasons**: Inline steps, temp steps, future steps placeholders, etc. Dataview limits this significantly. 
		- **REVIEW**: Each one could be easily created as templated file and a name can be used to move them automatically in the order. Plus of the file-based is that it allows to painless expansion of the implementation, when it gets unexpectedly complex.
			- **Pushback** - llm can't execute dataviewjs... so you need to either use native dataview queries + serializer or don't use dataview at all. Like it needs those descriptions of each step to see the whole picture without reading all the steps. 
				- **Still good** - Very big and distinct rule to ask explore tool to read all steps and list which ones is related to current one, which one should be read, stuff like that. It's even better than just brief description that means little to to LLM
	- **UPD DECISION**: Quartz parses dataview poorly. LLMs can't read dataviewjs nor queries. Serialization is expensive and adds more headache. And you have to update stuff in the plan anyway. So. No