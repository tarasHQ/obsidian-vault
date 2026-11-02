---
status:
state:
reviewedAtStep:
---

[← PLAN](../_plan_|PHASE_NUMBER|.md)

## Description
TODO

## High-Level

### List of related files or folders
%%which are useful for context%%
- 

### Intended outcome
- 

### Local invariants
%%(if any)%%
- 

### Should NOT be done in this step
- 

---

## Tasks
%%Contains list of tasks. Example of format to be used is in completion flow section%%


=== TO BE REMOVED WHEN TEMPLATE IS USED, DO NOT KEEP ===
%%used only as hints on how steps work/filled%%

## Frontmatter
- `status` - `waiting/postponed/implemented/skipped` - self-explanatory statuses.
- `state` - state of the step's contents
	- `placeholder` - minimal file to just hold the place until there's time to do high-level/implementation blocks
	- `high-level` - meaning only top high-level block is written and implementation block is not
	- `full` - high level and implementation blocks are written and step is ready for implementation.
	- `condensed` - after completion flow, state was condensed to be token-efficient. 
- `reviewedAtStep` - quoted step identifier of the last meaningful review, e.g. `"03.5"`.
	- Creation counts when the document is meaningfully reviewed; later edits alone do not update this property.
	- Review means checking the whole step for accuracy and alignment with the phase. Update explicitly, never from file modification time.
	- Leave empty until reviewed. Missing or empty values are displayed as `—`.