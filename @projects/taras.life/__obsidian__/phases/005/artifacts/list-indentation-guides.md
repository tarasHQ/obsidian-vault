# List indentation guides

[← Phase plan](../_plan_005.md) · [Folding feature](../../../quartz/features/folding/README.md)

## Purpose and outcome

Step 04.5 was implemented directly, without a separate implementation step: show a guide beside a list item's foldable content and let readers click it to close the parent fold. The developer tried the result, adjusted the colors, and accepted the current approach.

## Decisions and why

- **Parent-based, not a separate control for each child:** the guide represents the content belonging to its parent item. Clicking it has a clear meaning: close the same whole region as the parent's arrow. That region can include paragraphs and other blocks as well as nested lists; a guide also appears for foldable content without a nested list.
- **Keep the existing arrow:** the guide disappears when its content is closed, so the arrow remains the way to reopen it. The arrow is also the keyboard-accessible control; the guide is an additional pointer convenience, not a replacement.
- **Start at the foldable content, after the entire parent label:** a wrapped label therefore pushes the start of the line down. The developer accepted this Obsidian-like behavior. Starting consistently just below the bullet would require different positioning and careful handling of wrapped text, headings, checkboxes and other label types; a fixed upward offset would not reliably handle different label heights.
- **Center the pointer target on the line:** both sides of the visible line are clickable, rather than only the space to one side. This is a convenience, but nearby text, controls and nested guides should still be checked for interference.
- **Use theme-specific guide colors:** the developer tuned colors in `quartz/styles/theme.css`; the guide uses the accent color on hover. The guide is hidden in print, alongside fold controls.
- **Lists only:** guides belong to list-item folds, not heading folds. Heading and list folding remain separate.

The initial discussion contrasted a continuous child-list guide with a parent guide. For a simple nested list these can look identical; the meaningful distinction is whether the line represents only the list or the parent's entire foldable region. The latter makes the chosen click behavior clearer, but is not inherently easier to align.

## Implementation and verification

- `quartz/features/folding/foldingTree.ts` adds a guide inside each list fold body; `folding.inline.ts` maps a guide click to that body's existing control.
- `quartz/features/folding/folding.css` positions the guide and centered pointer target; `foldingTree.test.ts` checks representative generated list structures. Theme colors live in `quartz/styles/theme.css`.
- The developer accepted the appearance and interaction. Automated checks and build were **not confirmed in this task**; the assistant could not run them. There is no automated browser test for guide hit areas or clicks. Check nested lists, text selection, links, task checkboxes, mobile layouts and print if further changes affect the geometry.
- Step 04 marker defaults and later copied-content integration are separate work; coordinate with them rather than assuming their behavior was settled by this artifact.
