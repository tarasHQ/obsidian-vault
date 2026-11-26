---
status: implemented
state: condensed
---

[← PLAN](../_plan_005.md)

## Description

Make closed folds available to native browser Find and reveal folded ancestors of navigation destinations while preserving existing same-page navigation and history behavior.

## Implementation Summary

- **Fold state and browser reveal** — Closed folds use `hidden="until-found"`; browser-triggered reveals synchronize each affected control while leaving the browser to reveal the content. Nested folds remain independent and unrelated folds stay closed.
- **Navigation and print** — Fragment navigation reveals destination ancestors before normal scrolling, while Back/Forward reveals without an explicit scroll. Existing same-page history and outdated-navigation safeguards remain in place; print styling includes closed content without changing on-screen choices.
- **Verification** — The existing nested-ancestor test was adapted without adding a broader test suite. The developer reported that checks, build, browser navigation, nested Find, spacing, and print-preview checks were all a go; these were not independently run by the assistant.
- **Later integration** — Marker-derived defaults and their initialization, including direct-load and navigation ordering, remain deferred to Step 04. Search and copied-content integration remain later work.
