---
status: implemented
state: condensed
---

[← PLAN](../_plan_005.md)

## Description

Make ordinary Obsidian comments visible as styled inline-formatted content and use supported `%% fold %%` markers to generate initially closed folds, while preserving unrelated reader choices during navigation.

## Implementation Summary

- **Comments and marker connection** — Ordinary Obsidian comments render without delimiters using their existing inline content. General comment processing is independent of folding; the folding-owned handler is explicitly connected to interpret exact fold markers.
- **Authored fold defaults** — Eligible heading and list labels ending in an exact marker generate initially closed, independent folds with matching controls. Markers are removed from the rendered content after folding is applied.
- **Navigation and initialization** — Direct loads synchronize controls from actual visibility and reveal closed destination ancestors when needed. SPA navigation waits for body updates and reconciles queued history and fragment destinations without resetting unrelated folds.
- **Documentation** — Updated the folding and processor READMEs to describe ownership, comment rendering, defaults, and navigation behavior.
- **Verification** — The developer reported the targeted tests, full checks, tests, and build green, and confirmed the guided navigation checks passed. Additional processing and transclusion tests originally proposed in this step were intentionally skipped at the developer's request; they are not verified by those results.
- **Temporary investigation** — The feasibility script and its generated output were reviewed but their deletion was not confirmed: `__obsidian__/phases/005/artifacts/step-04-comment-feasibility.mjs` and `__obsidian__/phases/005/artifacts/step-04-feasibility-output.txt`.
