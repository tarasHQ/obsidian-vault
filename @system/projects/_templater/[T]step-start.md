<%*
// ================================================================
// TEMPLATE: Phase Start Step Note (phases/NNN/steps/00-start.md)
//
// LLM RULE:
// DON'T USE <> TAGS in comments. It breaks further rendering of markdown in obsidian. 
//
// WHAT THIS DOES:
// Content template for the phase's deterministic FIRST step note
// (phases/NNN/steps/00-start.md), created automatically by [T]phase.md.
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
// the structure aligned with the SSOT step template in PLANNING.md.
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
    new Notice("'[T]step-start' is not runnable manually — it is created by [T]phase.md only.");
    return;
}

// Phase number comes from the note's final location: phases/NNN/steps/00-start.md
const phaseNumber = tp.config.target_file.parent.parent.name;
-%>
---
ctime: <% tp.file.creation_date(CFG.ctimeFormat) %>
isIntegrated: false
status: waiting
state: placeholder
reviewedAtStep: ""
---

%%[internal link for user to template]([T]step-start.md), llm should completely ignore this line%%

<% CFG.backlinkToPlanPrefix %><% phaseNumber %><% CFG.backlinkToPlanSuffix %>

## Description
The flow to start the planning in the best state of mind. 
**Importance shouldn't be understated** 
- It looks very simple and obvious right NOW, but when your perspective is shifted - you don't see it that way.
- Without proper following of these rules - you'll end up stranded in the desert. 
- And overwhelmed on top of it - this is how you start the race you're meant to lose. 

## Checklists
- [ ] **Rename the phase in `_project.md`** 
- [ ] **Acknowledge if you're in elevated state of mind**
     %%If you do - everything you plan or execute will be suboptimal to say the least.%%
     %%And also chances of getting overwhelmed will skyrocket%%
- [ ] **Can your idea/plan fit into bite-sized phase?**
      %%if you have too much to do, you get stuck in single phase, lose sense of progress, get discouraged%%
- [ ] **Did you read related docs?**
      %%So you actually now what you're doing and won't be overwhelmed by it%%
      %%And you decisions will be good and aligned with optimal implementations%%
- [ ] **Did you read related ideas/artifacts/reflections?**
      %%It would be stupid to use them to capture stuff and then never read it%%
      %%To make sure you didn't forget some ideas you wrote before on current topic of the plan%%
- [ ] **Are you familiarized with the code(or other target of the plan) you're about to work with?**
      %%If you skip it - you instantly get overwhelmed because LLM will use names/logic/snippets you know nothing about%%
      %%Run a simple 15 minutes task and get familiarized - your executive capacity will thank you for it%%

## Checklist On Meta/Project
- [ ] **Make sure that the size of the phase is small, so you can easily evolve it, when it get suboptimal**