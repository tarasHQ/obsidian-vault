<%*
// ================================================================
// TEMPLATE: Phase End Step Note (phases/NNN/steps/99-end.md)
//
// LLM RULE:
// DON'T USE <> TAGS in comments. It breaks further rendering of markdown in obsidian. 
//
// WHAT THIS DOES:
// Content template for the phase's deterministic LAST step note
// (phases/NNN/steps/99-end.md), created automatically by [T]phase.md.
//
// HARD GUARD:
// This template is NOT runnable manually. It only renders when invoked by
// [T]phase.md through the shared __phaseCaptureAuto context flag, which pins
// the exact target path. Any other invocation aborts deterministically.
//
// SELF-LOCATION:
// [T]phase.md places the note at its final path BEFORE rendering, so the phase
// number is derived from the note's own grandparent folder name (e.g. "004")
// to build the "[← PLAN](../_plan_NNN.md)" backlink — no flags or placeholders.
//
// PLACEHOLDER STATUS:
// The body below is a simple placeholder. Replace it with real content; keep
// the structure aligned with the SSOT step template in PLANNING.md, but with a
// finalization flavor (meta-planning reflection, project index finalization,
// safe die-off verification).
// ================================================================

// ================================================================
// 0. CONFIG — the single place to adjust names / paths / prompts.
//    NOTE: autoCaptureContext must match [T]phase.md, [T]ideas.md and
//    [T]reflections.md — it is the shared exact-path-scoped guard context.
// ================================================================
const CFG = {
    // --- Guard context (hard guard: [T]phase.md is the only allowed caller)
    autoCaptureContext: "__phaseCaptureAuto",

    // --- Navigation (relative to the note's final location steps/ inside phases/NNN/)
    backlinkToPlanPrefix: "[← PLAN](../_plan_",
    backlinkToPlanSuffix: ".md)",

    // --- UX / environment
    ctimeFormat: "YYYY-MM-DD HH:mm",
};

// Hard guard: only [T]phase.md may render this template, for the exact target path.
const autoContext = window[CFG.autoCaptureContext];
if (autoContext?.targetPath !== tp.config.target_file.path) {
    new Notice("'[T]step-end' is not runnable manually — it is created by [T]phase.md only.");
    return;
}

// Phase number comes from the note's final location: phases/NNN/steps/99-end.md
const phaseNumber = tp.config.target_file.parent.parent.name;
-%>
---
ctime: <% tp.file.creation_date(CFG.ctimeFormat) %>
isIntegrated: false
status: waiting
state: placeholder
reviewedAtStep: ""
---

%%[internal link for user to template](_static/templater/project/[T]step-end), llm should completely ignore this line%%

<% CFG.backlinkToPlanPrefix %><% phaseNumber %><% CFG.backlinkToPlanSuffix %>

## Description

The flow to start the planning in the best state of mind. 
**Importance shouldn't be understated** 
- It looks very simple and obvious right NOW, but when your perspective is shifted - you don't see it that way.
- Without proper following of these rules - you'll end up stranded in the desert. 
- And overwhelmed on top of it - this is how you start the race you're meant to lose. 

## Checklists
- [ ] **Reflecting on the phase**
     %%What worked and what didn't. Meta-level reflection to refine the workflow%%
- [ ] **Making sure the information from the plan can safely die-off**
     %%If nothing should be long-term extracted into module readme's or project-wide/future ideas %%
- [ ] **Making sure frontmatter is set properly**
- [ ] **Asking user to move the phase into /phases/archived/**
      %%So no done phases are bloating phases/ folder%%
- [ ] **Reflecting completion of the phase in the `_project.md`**
      %%Status. Enveloping whole name in `~~` strikethrough tags %%