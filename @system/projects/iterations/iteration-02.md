## Possible Refinements
- **Format of the artifacts between refining reflection and steps implementation**
	- You basically offloaded walls of text in there, and created an abstraction that structures all of that nicely. BUT it would be even better if you could have more Order in those artifacts as well.
- **Template for the whole project**
	- Not hard really. Templater script similar to phase. pre-creates single `_project.md` + folders, and that's it.
- ### Additional exploration AFTER listing
	- In this case LLM listed a solution, but partially. Which means it kinda guessed it. So you probably should change ordering of stages in `initial-planning` (and maybe others too), so it does exploration, then writes to file brainstorming, THEN writes to another file list of ideas, THEN does exploration again on those ideas in multiple explore task and only THEN it lists the answer in a manner that is self-sufficient and doesn't rely on user knowledge about previous files.nd