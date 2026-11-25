---
status: implemented
state: condensed
---

[← PLAN](../_plan_005.md)

## Description

Implement general Folding for heading sections and list items as a foundation for later marker, navigation, and Search integration.

## Implementation Summary

- **Folding structure** — Adds initially open heading-section and list-item folds after transclusions are assembled. Nested folds retain independent temporary states, and a heading used as a list label receives one list-item control.
- **Interaction and presentation** — Uses separate keyboard-operable buttons with expanded state and rotating chevrons; fresh SPA views start open and closed content remains available in print. The current heading placement is accepted for now; further visual refinement and hover behavior are deferred.
- **Verification** — Structural tests cover heading and list boundaries, task and heading labels, and non-text first blocks. The developer reports the current browser checks, `npm run check`, `npm test`, and `npm run build` are green.
- **Later integration** — Marker-derived defaults, revealing linked destinations, and Search, popover, and copied-content integration remain phase work outside this step.
