---
status: ready
state: full
---

[← PLAN](../_plan_005.md)

## Description

Make closed folds available to native browser Find and reveal folded ancestors of navigation destinations, preserving the existing same-page navigation and history behavior.

## High-Level

### List of related files or folders
- `quartz/features/folding/README.md` — Folding ownership and entry points; update alongside the implementation.
- `quartz/features/folding/folding.ts`, `folding.inline.ts`, `folding.css`, `foldingTree.ts` — existing state, browser events, styles, and generated structure.
- `quartz/features/folding/folding.test.ts` — existing nested ancestor reveal test.
- `quartz/components/scripts/spa.inline.ts`, `spaRoute.ts`, `spaRoute.test.ts` — router and same-page identity behavior.
- `__obsidian__/phases/005/artifacts/step-03-design-decisions.md` — approved decisions and research record.

### Intended outcome
- Closed content uses `hidden="until-found"` so browsers that support it can find and reveal it. Its control reflects browser-triggered reveals; folds opened by Find stay open until closed or the page is left.
- Fragment navigation reveals the necessary closed ancestors without opening unrelated folds. Normal navigation scrolls as before; Back/Forward does not introduce explicit scrolling.
- Printing includes closed content without changing the on-screen fold choices.

### Local invariants
- Preserve the existing same-page fragment click, history and in-flight navigation safeguards. Reader fold choices are temporary; do not persist them.
- Reveal only fold ancestors of the actual destination, not unrelated folds. Nested heading and list folds retain independent states.
- No browser-support detection or compatibility fallback for `hidden="until-found"`; native Find behavior is not promised to be uniform across browsers.
- Existing generated folds start open. Keep the current fresh-view `nav` reset; marker-derived defaults and their initialization ordering are explicitly deferred.

### Should NOT be done in this step
- Interpret `%% fold %%` markers, initialize author defaults, or preemptively redesign fresh-page/direct-load initialization. Step 04 owns those concerns and must integrate closed defaults with navigation ordering.
- Add special SPA handling for text-fragment links, a general scroll-restoration system, browser-test framework, or exhaustive browser matrix.
- Implement Search, popovers, or copied-content integration.

---

## Implementation Approach

- **Current structure:** `foldingTree.ts` produces initially open `.fold-content` divs and buttons. For headings, the button's parent heading is followed by its fold body; for list items, the button's closest `li` has the fold body as a direct child. `folding.ts` already resolves a button to its body for both shapes. Reuse this relationship to find the control associated with a body; do not assume IDs or change generated markup.
- **State changes:** Separate updating a button's `aria-expanded` and `aria-label` from changing its body's visibility. Reader clicks and programmatic ancestor reveals update both, setting `hidden="until-found"` when closed and removing `hidden` when opened. `revealFoldAncestors(target)` walks the target's closed fold bodies and opens each associated control/body without scrolling, leaving unrelated folds alone.
- **Browser reveal:** A delegated `beforematch` handler identifies the event's actual target as a fold body, finds its associated button, and updates only that button's expanded state and label. The browser removes `hidden`. Do not call the normal open operation from this handler: removing `hidden` during the event may interfere with nested native reveals. Each browser-revealed ancestor should receive its own event and have its own control synchronized; verify nested behavior manually rather than assuming uniform browser support.
- **Router ordering:** In `spa.inline.ts`, `revealFragment` already decodes the fragment safely, locates its target, and calls the shared reveal function. Same-page clicks call it before scrolling and pushing history; same-page `popstate` calls it without scrolling. Different-page navigation currently runs `micromorph`, then scrolls, then dispatches `nav`. Call `revealFragment` after the body is patched and before any normal fragment scroll; also call it for cross-page Back/Forward without explicitly scrolling. Retain existing no-fragment scroll behavior and history/version logic.
- **Deferred lifecycle:** The current `nav` listener opens every fold after a fresh SPA transition, and generated content is open. Do not change that reset here to anticipate markers. Consequently, real author-default closed destinations cannot be fully verified until Step 04 handles initialization, direct loads and navigation ordering.
- **Print and layout:** Replace the old display-based hiding and print override. Start with a print-only `content-visibility: visible` override for closed fold bodies and hide controls in print; check actual print output and adjust the print rule if necessary. Verify whether hidden bodies leave unwanted spacing before adding extra wrappers or sizing rules.

---

## Tasks

### 01 — Fold state and native reveal

#### `quartz/features/folding/folding.ts` — modify
- [ ] Extract or add a shared control-state operation that sets `aria-expanded` and the existing `Collapse section` / `Expand section` labels without changing body visibility. Have `setExpanded` use it and set `hidden="until-found"` on close or remove `hidden` on open.
- [ ] Provide a body-to-control lookup based on the existing button-to-body association, handling both heading and list structures and safely doing nothing when no matching control exists. Reuse it for browser events and ancestor revealing rather than introducing a second, conflicting association.
- [ ] Update `revealFoldAncestors` to find fold bodies closed with `hidden="until-found"`, including a target that is itself such a body, and open each associated ancestor through `setExpanded`. Continue walking outward even if an association is missing; leave unrelated folds unchanged.

#### `quartz/features/folding/folding.inline.ts` — modify
- [ ] Keep the delegated click behavior and fresh-view `nav` reset using `setExpanded`.
- [ ] Add one delegated `beforematch` listener. Act only when the event's actual target is a `.fold-content` body marked `hidden="until-found"`; find its matching control and update only the control's expanded state and label. Do not remove `hidden` in this handler. A bubbled event must not cause an outer body's control to be updated for the inner body.

#### `quartz/features/folding/folding.css` — modify
- [ ] Remove `.fold-closed` / `display: none` hiding and its old print `display` override. Let the browser handle `hidden="until-found"` on screen.
- [ ] Add a print-only override making closed fold bodies' `content-visibility` visible, retaining the print rule hiding controls. Verify print and spacing as described below; avoid speculative layout machinery.

#### `quartz/features/folding/folding.test.ts` — modify
- [ ] Adapt the existing nested-ancestor test and its lightweight element shim to the new attribute: both ancestor bodies become open and their controls expanded; an unrelated closed body remains closed. Keep tests focused; add another automated test only for a concrete risk encountered during implementation.

### 02 — Cross-page navigation and documentation

#### `quartz/components/scripts/spa.inline.ts` — modify
- [ ] After `micromorph` patches the destination body, resolve and reveal the fragment with the existing `revealFragment` helper for both normal and Back/Forward navigation. For normal navigation, scroll to the returned target when there is a fragment; otherwise retain the top scroll. For Back/Forward, reveal without explicitly scrolling.
- [ ] Preserve same-page click and `popstate` paths, `isSameSpaPage` identity, `historyVersion`, pending-history handling, and history updates. Preserve safe behavior for malformed or missing fragment targets; do not add text-fragment-specific handling.

#### `quartz/features/folding/README.md` — modify
- [ ] Document `folding.ts` and its shared ancestor-reveal function, the new hidden-until-found / browser reveal behavior, navigation integration and print intent. Remove the stale claim that all destination revealing is future work; clearly retain marker defaults and copied-content integration as later work.

### 03 — Verification
- [ ] Run the project's applicable checks and build; report actual results. Do not claim browser verification without performing it.
- [ ] In a supporting browser, close several nested folds and use Find on text inside the innermost one. Confirm the necessary content becomes visible, **every** opened ancestor's chevron, `aria-expanded`, and label match, unrelated folds stay closed, and Find-opened folds stay open until the reader closes them or leaves the page. Check both heading and list fold relationships where practical.
- [ ] Check same-page fragment clicks and Back/Forward: destination ancestors open, unrelated reader choices survive, and history traversal does not add explicit scrolling. Check representative cross-page fragment navigation and Back/Forward, including that normal navigation reveals before scrolling and history navigation does not force a scroll. Exact history position restoration is not guaranteed.
- [ ] Because generated pages currently start open, use a temporary, clearly identified browser/development setup if needed to exercise a closed cross-page destination at the relevant point after the body patch. Remove temporary changes afterward. Do not claim this validates real marker-default initialization; repeat that integration in Step 04.
- [ ] Inspect closed folds for unwanted retained spacing. Check print preview with closed, including nested, content: all intended content prints, controls do not, and on-screen choices remain unchanged after returning. Record browser-specific limitations or failures rather than claiming unverified consistency.
- [ ] No extra automated suite or broad browser matrix; adapt existing tests and add only a focused test for a concrete worthwhile risk.

## Approval record

The implementation approach, including per-ancestor button synchronization for native nested Find, was approved during Writing Steps. The [decision note](../artifacts/step-03-design-decisions.md) remains the record of scope and prior decisions.
