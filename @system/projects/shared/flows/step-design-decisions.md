# Step Design Decisions
From the agreed step scope -> to discussed decisions about the result, grounded in enough project investigation to judge practical trade-offs.

**Why it's needed?**
- To prevent the LLM from silently making choices about behavior, appearance and other details the user wants to control.
- To weigh the value of each choice against its implementation and maintenance cost before committing to it.

## Rules
- **STAGE AWARENESS** - Every response to the user should have current stage letter, name and substage letter-number at the first line.
- **AGREED STRUCTURE** - Use the plan's locked-in step scope, order and parallel groups. For Writing: Together, discuss the whole group together and align shared decisions; Separately permits separate tasks. Get user approval before changing step boundaries, order or grouping.
- **USER CONTROL** - Surface result-affecting choices even when low-level; don't silently decide them because they seem minor. The user may explicitly delegate categories of decisions; record that delegation. Don't ask about routine details within delegated categories.
- **PRACTICAL DECISIONS** - Explore relevant code when needed to judge feasibility, effort and integration. Distinguish verified facts from assumptions; compare benefit and cost, including simpler alternatives. If reliable cost estimates require substantial investigation, discuss whether that work is worthwhile first.
- **FOCUSED DISCUSSION** - Discuss small related groups of decisions, not a large questionnaire. Keep an internal checklist of areas to cover and adapt to user feedback. Don't repeat questions already decided; revisit an agreement if new evidence changes its trade-offs.
- **WEB RESEARCH** - When focused web research could materially change a decision, immediately provide one self-contained prompt in a codeblock for the user to paste into a web-capable model. Include necessary context only; request source links, evidence, uncertainty and conflicting guidance. Wait for the result, then assess it against the project; don't claim to have verified live sources without access. Research is optional when it wouldn't help.

## Stages
- ### A - Exploration
	- [ ] **A1** - [USER]
		- Provides the phase plan, selected step or joint-writing group, and related artifacts.
	- [ ] **A2** - [LLM]
		- Explore the agreed scope, dependencies and relevant source/docs enough to identify decisions and their practical constraints. Verify decisive facts in source/docs; use focused exploration to keep context lean without relying solely on summaries.
- ### [LOOP] B - Decisions and Discussion
	- [ ] **B1** - [LLM]
		- Identify decision areas, including behavior, appearance, interaction, edge cases and effects on existing behavior where relevant. Start with one small related group.
		- For each choice, explain reasonable options, their result, practical cost and trade-offs; recommend one with reasons. Make uncertainty explicit and investigate further when needed. Use the web-research rule when appropriate.
	- [ ] **B2** - [LLM + USER]
		- Discuss and agree on the group, including reasoning and any delegated decisions. Continue with the next group until the relevant areas are covered; don't infer approval or make unapproved choices.
		- For joint-writing groups, agree on shared behavior and ownership. If an option needs substantially more work than expected, discuss proportionate alternatives rather than silently expanding scope.
- ### C - Recording and Handoff
	- [ ] **C1** - [LLM + USER]
		- Compare the agreed scope against the decisions: identify gaps that would leave implementation inventing result-affecting behavior outside delegated categories. Resolve those gaps without expanding scope or reopening settled choices without new evidence.
		- Summarize the decisions, reasoning, delegated categories, relevant verified facts and remaining uncertainties. Resolve questions that prevent a meaningful handoff and obtain user approval before writing.
	- [ ] **C2** - [LLM]
		- Create or update a separate note under the phase's `artifacts/`, named `step-XX-design-decisions.md` for a step or `group-PX-design-decisions.md` for a joint-writing group. Check for an existing note and preserve relevant user content.
		- Include links to the phase plan and relevant sources; record agreed decisions and why, delegation, verified facts, useful research sources and explicitly labeled questions deferred to Writing Steps. Keep it concise and self-contained. Don't mark the step implementation-ready or put step-level detail in the plan.
	- [ ] **C3** - [LLM]
		- Provide a clean-task prompt in a codeblock for Writing Steps, linking `AGENTS.md`, `LLM.md`, the phase plan, the decision note and `C:/Users/Taras/Documents/obsidian-vault/@system/projects/shared/flows/writing-steps.md`. Identify the selected step or joint-writing group.
- ### The End
