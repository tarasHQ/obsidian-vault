%%=====================================================================
FLOW: _initial-planning.md
=====================================================================
WHAT:    Stage 1 of a phase. Converts the user's raw intent into
         (1) high-level plan content and (2) a step division sketch.
WHO:     LLM, when starting high-level planning of a phase.
SSOT:    This file is the only source of this flow. Never summarize
         or copy it into other files.
STATUS:  First draft (iteration-01). The flow-file format is being
         tested on this file — refine here, not elsewhere.
=====================================================================%%

# Initial Planning

%%The most important and hardest stage of a phase (Issue #4). Quality of everything downstream inherits from it. Two core disciplines: never leave high-level, and never dump walls of text on the user (Issue #7).%%

## Flow Shape

	00-start checks → scope lock → explore + draft → discussion loop → dissolution → exit

## 01 — Entry Conditions
- [ ] `00-start.md` checklist of the phase is fully completed (mindset, related docs, ideas, code familiarization)
- [ ] Phase's `_plan.md` exists and contains the user's raw input

Completion: both checked. If not — stop and go back. Do not compensate with improvisation.

## 02 — Scope Lock
- Stay high-level for the whole flow. No implementation details, no exact file structures, no code snippets.
- Allowed depth: what exists, what will change, what the outcome is, how the work splits into steps.
- If a detail forces itself — write one line into `_planning-draft.md` and move on. Do not expand it in conversation.

## 03 — Exploration & Draft
- [ ] Explore the codebase (explore tool, token-efficient passes) for every area the phase touches.
- [ ] Write all findings, options and open questions into `artifacts/_planning-draft.md` as they appear — not into the conversation, not into the plan.

Offload rule (Issue #7): if exploration outgrows the current task or context gets heavy — capture the state into `_planning-draft.md` and continue in a fresh task. The draft file is the memory, not the conversation.

%%`_planning-draft.md` is kept after dissolution. It is never referenced or maintained afterwards.%%

## 04 — Discussion Loop
- Move in short exchange units: LLM raises one point → user responds → next point. Never a wall of text.
- Include an issues-seeking pass: before locking the plan, LLM actively looks for problems, risks and unknowns in the emerging plan and presents them as points — not as solutions.
- Each point ends either with a resolved answer or as an explicit open item captured in `_planning-draft.md`.

