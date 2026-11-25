# Initial Planning
From existing scope (**what** to do) -> to a discussed and locked-in high-level plan (**how to divide and sequence the work**). Detailed implementation belongs to the Writing Steps flow.

**Why it's needed?**
- To structure the agreed work into digestible steps, ensure the user understands the execution, and prepare the phase for writing implementation-ready steps.

## Rules
- **STAGE AWARENESS** - Every response to the user should have current stage letter, name and substage letter-number at the first line.
- **STRUCTURING, NOT REFINING** - Work from the existing scope and decisions. Discuss ways to divide and sequence that work, not another list of improvements or additions. Surface contradictions or missing prerequisites that prevent a workable structure.
- **HIGH-LEVEL SCOPE** - The plan describes what, why, order and boundaries; code-level implementation belongs in step files. Step descriptions should be 1-4 useful paragraphs, not detailed implementation instructions.
- **PARALLEL GROUPS** - Structure steps for coherent, manageable implementation first. Mark a parallel group only where the work naturally separates and the benefit outweighs the added coordination.
	- Don't split or rearrange cohesive work merely to enable parallelism. If shared changes, dependencies or coordination would make execution harder, keep it sequential.
	- Mark whether grouped steps can be written separately or should be written together to align shared agreements before parallel implementation. Writing together doesn't by itself make parallel implementation safe; Writing Steps must verify feasibility.
	- If no groups are worthwhile, omit the parallel-group table and tags.
- **APPROVAL BEFORE WRITING** - Present and discuss all intended document changes before editing files. Don't silently add decisions or work during finalization.

## Stages
- ### A - Exploration
	- [ ] **A1** - [USER]
		- Provides the existing scope and related artifacts: reflections, ideas, decisions, plan, etc.
	- [ ] **A2** - [LLM]
		- Explore the relevant project docs/source, phase plan, `00-start.md` and `_project.md`.
		- Goal is to understand the scope, constraints, dependencies and integration points enough to propose a step structure. Verify decisive facts in relevant source/docs, not only exploration summaries.
- ### B - Drafting the Step Structure
	- [ ] **B1** - [LLM]
		- Respond with a provisional step sequence and explain HOW and WHY the structure fits the work. Discuss consequential alternative boundaries/orderings where useful; don't require multiple competing structures.
		- For each step: number, name, intended file link and 1-4 paragraphs describing its outcome, scope/boundaries, dependencies and important agreed constraints, as relevant.
		- **Requirements:**
			- Coherent, manageable steps: avoid combining loosely connected large tasks or requiring disproportionate exploration.
			- Clear ownership and sensible dependencies; avoid overlapping scope and unnecessary repeated redesign or rewriting.
			- Steps need not have equal workloads. Prefer meaningful progress where dependencies allow it.
		- Identify worthwhile parallel groups, if any, and whether each group should be written together or separately. Identify shared agreements that need coordination.
		- Identify specific uncertainties exposed by the proposed structure for the second exploration pass. Distinguish verified facts from assumptions.
		- MANDATORY - end the response by reading `C:/Users/Taras/Documents/obsidian-vault/@system/projects/shared/loop-continuation.md` to continue automatically to C1 without asking the user to continue.
- ### C - Further Exploration
	- [ ] **C1** - [LLM]
		- Investigate the specific questions exposed by the draft: verify facts affecting step boundaries, prerequisites, integration and practical parallel execution. Revise the structure where warranted, not merely confirm it.
		- Keep exploration proportional; reuse verified facts rather than repeat broad exploration.
		- Where independent research is useful, run up to 5 `explore` tools in parallel, with self-contained, evenly divided subtasks. Follow-ups are allowed.
- ### D - Listing the Proposed Plan
	- [ ] **D1** - [LLM]
		- No writing/editing of files is allowed.
		- Present a self-contained, grounded step structure in the same format as B1, including reasoning, dependencies, worthwhile parallel groups and decisions needing discussion.
		- Also propose the plan's Description (leave Visions to the user), concise Exploration entries, any high-value Persistent Storage entries, and the phase's `_project.md` entry/update.
		- Shared phase-wide agreements belong concisely in Persistent Storage; detailed agreements belong in step files when written. Don't fill storage for its own sake.
	- [ ] **D2** - [LLM] - Same Response
		- Include a response template inside a markdown codeblock: numbered step/decision names, each followed by an empty bullet for the user to fill. Separate entries with empty lines.
- ### E - Discussion and Locking In
	- [ ] **E1** - [LLM + USER]
		- Discuss and lock in the step boundaries, order, descriptions, parallel groups and other proposed document changes. Resolve questions affecting the structure, exploring further where necessary.
		- Ensure the user understands how implementation will proceed. Discuss remaining `00-start.md` checks, including those requiring the user's personal confirmation; don't infer answers or check them automatically.
		- Continue until the user approves the agreed structure and document changes before proceeding to F.
- ### F - Implementing and Completing Step 00
	- [ ] **F1** - [LLM] - Filling Out the Plan
		- Apply only the agreed changes to the phase plan:
			- Fill Description; leave Visions to the user.
			- Fill Exploration with concise related links/descriptions and useful tips. Keep it phase-scoped and remove stale entries in the same pass.
			- Add only important, agreed Persistent Storage entries.
			- Replace the insertion marker or obsolete draft recommendation with the locked-in step entries between 99 and 00, listed descending. Use the plan's heading/link format, `○` for high-level entries, and 1-4 paragraphs per step. Don't create step files or mark them implementation-ready.
			- If applicable, add `### Parallel Implementation Groups` above the step list: `Group | Steps | Writing | Start after`. Use P1, P2, etc.; list all member steps; Writing is Together or Separately; Start after lists implemented prerequisites. Add `[P1]`, etc. to member headings. The table defines the group; tags only identify membership.
	- [ ] **F2** - [LLM] - Completing Step 00
		- Complete the agreed `00-start.md` work, including ensuring the phase is listed in `_project.md` without duplicating an existing entry. Don't mark unresolved checklist items complete.
		- Apply the note-condensation and plan-alignment rules from **The Step Completion Flow** in `C:/Users/Taras/Documents/obsidian-vault/@system/projects/shared/flows/implementing-steps.md`.
		- Finalize and condense step 00 immediately, updating its status/state and plan entry in the same pass; no transient completed-but-uncondensed note. This handoff goes to writing steps, not directly to implementation.
	- [ ] **F3** - [LLM]
		- Provide a prompt inside a markdown codeblock to run Writing Steps in a clean task. Include links to `AGENTS.md`, `LLM.md`, the phase plan and `C:/Users/Taras/Documents/obsidian-vault/@system/projects/shared/flows/writing-steps.md`; identify the next step or joint-writing group.
- ### The End
