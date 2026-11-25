# Writing Steps
From the agreed high-level plan (**what each step owns and its place in the phase**) -> to implementation-ready step files (**how to implement the work**).

**Why it's needed?**
- To investigate and discuss detailed implementation, then write self-sufficient instructions for implementation in a clean task.

## Rules
- **STAGE AWARENESS** - Every response to the user should have current stage letter, name and substage letter-number at the first line.
- **AGREED STRUCTURE** - Use the step structure locked in during Initial Planning; don't discard it or plan it again. If new findings require changed boundaries, order or grouping, explain why and get user approval before updating the affected entries.
- **IMPLEMENTATION-READY** - Writing steps resolves and discusses HOW to implement, not just WHAT to achieve. Don't mark a step ready while its central approach is unresolved; ordinary, lowest-level coding details stay for implementation.
- **COMPLEXITY STOP** - If the approach needs substantially more machinery than agreed, its assumptions fail, or investigation repeatedly stalls without a viable route — stop. Don't silently expand scope or keep layering workarounds.
	- Explain what changed, why the approach became costly, and reasonable alternatives with trade-offs.
	- Wait for user approval, then update the affected step before continuing. Until resolved, the step isn't implementation-ready.
- **PARALLEL GROUPS** - Follow the plan's group table and heading tags. For Writing: Together, explore, discuss and write the whole group in one task; Separately permits separate writing tasks. Either mode must verify that parallel implementation is practical.
	- Establish explicit ownership, shared agreements and dependencies; check for conflicting edits to the same files. If coordination would outweigh the benefit, discuss sequential execution or changed grouping instead.
	- Keep shared phase-wide agreements concise in Persistent Storage and include the relevant detailed agreements in each step file. Sharing a writing task alone doesn't make parallel implementation safe.
- If unexpected additional work requires splitting a step, discuss and get approval first.
	- Decimal points for numbering: 05, 05.1, 05.2.
	- New steps are written using this flow and inserted into the plan.
- **STEP ORDER** - Steps are WRITTEN ascending (dependency order) but LISTED descending (99→00 top-to-bottom). Update existing agreed entries in place; only insert new entries for approved additions/splits.

## Stages
- ### A - The Exploration
	- [ ] **A1** - [USER]
		- Provides the phase plan and selected steps, with related artifacts as needed.
	- [ ] **A2** - [LLM]
		- Explore enough to understand the phase, the agreed scope of the selected step or joint-writing group, its dependencies and integration points. Deeper exploration happens in B.
		- Verify decisive facts in relevant source/docs; don't rely only on exploration summaries. Record those facts in the step so implementation doesn't repeat the investigation.
- ### [LOOP] B - Implementation Exploration & Discussion
	- [ ] **B1** - [LLM] - First Pass: Exploration & Approaches
		- Understand the step's data flow and constraints, identify reasonable implementation approaches, and provisionally recommend one. Identify assumptions that could make it fail or become disproportionately complex.
		- For a joint-writing group, consider the steps together and identify the shared agreements needed for independent implementation.
		- If user priorities determine the direction, or verification itself needs substantial work - discuss first, then continue verification in B2.
		- After exploration, respond with concrete approaches, provisional recommendation and WHY, and specific questions for B2. Distinguish verified facts from assumptions. The recommendation isn't approved yet.
		- MANDATORY - end the response by reading `C:/Users/Taras/Documents/obsidian-vault/@system/projects/shared/loop-continuation.md` to continue automatically to B2 without asking the user to continue. (because tool call automatically continues agentic loop)
	- [ ] **B2** - [LLM] - Second Pass: Verify & Challenge
		- Verify the decisive assumptions, integration costs and complexity of the provisional recommendation. Check the strongest alternative enough for a credible comparison; change the recommendation if warranted. Don't just seek confirmation.
		- Keep both passes proportional to the step/group; reuse verified facts rather than repeat broad exploration. No exhaustive investigation of every alternative is required.
	- [ ] **B3** - [LLM + USER] - Discuss the Approach
		- Discuss the grounded recommendation: HOW, WHY, integration points, meaningful alternatives, trade-offs and remaining uncertainty.
		- Check whether the proposed approach is proportionate to the requirement. Don't approve complexity merely because it technically works.
		- Resolve questions that could substantially change the approach and get user approval before writing. If investigation itself is needed as a step - label it explicitly, don't disguise it as implementation.
		- For parallel implementation, agree on each step's ownership and shared agreements before writing. Any necessary change to the planned structure/grouping needs approval too.
- ### [LOOP] C - Writing the Steps
	- [ ] **C1** - [LLM]
		- Read the step template `C:/Users/Taras/Documents/obsidian-vault/@system/projects/shared/templates/step-template.md`.
		- **SELF-SUFFICIENT** - Each step file must contain the relevant knowledge, source links, verified facts, locked decisions, invariants and shared agreements needed to implement it in a clean task.
		- **LOW-LEVEL IMPLEMENTATION** - Write the selected approach and concrete changes per affected file, not just requirements like "implement X." A fresh implementing LLM shouldn't need to choose the mechanism or repeat design exploration.
			- Specify what is added/changed/removed, important functions/data and their responsibilities, and how files connect. Include relevant ordering and fallback/error behavior.
			- Group tightly connected files under one task when useful. Include meaningful tests with scenarios and expected results.
			- Keep details in the step file, not the phase plan. Full function bodies and routine coding details aren't required.
		- Write the selected step file and update its existing plan entry in one batch. For a joint-writing group, write all member files and update their entries in the same task with aligned agreements.
			- Continue from the remaining unwritten steps when this flow resumes partial work.
			- Update each entry's link/state/status to match its file. Preserve the approved high-level description unless an agreed change requires correcting it; don't duplicate entries or mark unresolved steps ready.
			- Use targeted edits; retain descending order between 99 and 00. New entries are only for approved additions/splits.
			- Plan scope: phase-level knowledge only; step-scoped detail lives in step files. When updating Exploration, remove stale/no-longer-relevant entries in the same pass.
	- [ ] **C2** - [LLM + USER]
		- Discuss the written step or group. Ask about any issues/open questions; otherwise wait for the user to approve the created files.
	- [ ] **C3** - [LLM]
		- On user approval, restart at B1 for the next step or joint-writing group.
- ### The End
