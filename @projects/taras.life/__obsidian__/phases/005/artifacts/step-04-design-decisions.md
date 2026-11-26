# Step 04 — Visible comments and marker defaults: design decisions

[Phase plan](../_plan_005.md) · [Phase reflection](../_reflections/initial-reflection.md) · [Step 03](../steps/03-navigation-and-reveal.md) · [Folding README](../../../../quartz/features/folding/README.md) · [SPA router](../../../../quartz/components/scripts/spa.inline.ts)

## Scope

Keep visible comments and marker defaults together as one step: both depend on preserving and distinguishing Obsidian comments during content processing. Keep the comment-processing and folding changes reviewable; do not treat this note as an implementation-ready step.

## Ordinary comments

- Publish ordinary Obsidian comments as Markdown content without the `%%` delimiters, with a dedicated class for styling. Preserve normal content behavior, including links, formatting, and heading structure.
- Apply the comment treatment on top of the underlying Markdown styling: initially **80% of the corresponding normal font size and 50% opacity** in light, dark, and dark-low modes. No border or background. Check appearance and readability visually; these values are starting points.
- A heading inside a comment is an ordinary heading, including its folding and heading-navigation behavior. Its section continues to the next heading of the same or higher level even if the comment ends first; comment styling stops at the comment boundary. Do not accidentally constrain the heading's section to a comment wrapper.

## Marker interpretation

- The exact marker is `%% fold %%`, with one space on each side of `fold`. Whitespace before the marker is not required; whitespace after it is allowed. To affect a fold it must be at the end of a supported label, not followed by more label text.
- Supported labels are ordinary headings and bullet, numbered, or task list items with foldable content. A heading used as a list-item label controls the existing single list-item fold. Preserve the existing folding boundaries, including additional blocks in list items.
- With interpretation connected, an exact marker is hidden; when attached to a supported foldable label, it makes that fold initially closed. Exact marker comments that cannot apply remain hidden and have no folding effect. Marker-like text in inline or fenced code remains code, not an instruction.
- Folding remains enabled. Make marker interpretation easy to disconnect in code, without introducing a YAML switch. When disconnected, skip marker-specific handling: `%% fold %%` is rendered like any other ordinary comment, and eligible folds start open. Do not retain separate marker-specific hiding in that mode.
- Other eligible folds start open. Nested folds are independent, and reader choices are not persisted.

## Initialization and navigation

- Generate the author's fold defaults directly in page HTML at build time, including matching button state, so marked folds load closed rather than flashing open first.
- On a direct load with a fragment, reveal only the destination's closed ancestors and leave unrelated folds closed. Reconcile controls with the actual fold state so browser reveals that happened before the listener was installed are not undone. If site code must reveal remaining ancestors, a corrective scroll is appropriate; avoid an unnecessary second scroll when the browser already handled the target. Exact browser timing and positioning still require manual checks.
- For a fresh cross-page SPA view, incoming HTML supplies author defaults; reveal a fragment's ancestors after the page update and before the normal scroll. Remove the current late all-open `nav` reset rather than applying defaults after reveal. The installed micromorph implementation compares attributes, removes those absent in incoming HTML, and sets changed attributes on reused elements; separate author-default storage or a reset is not justified without contrary evidence.
- Preserve Step 03 behavior: same-page fragment navigation retains unrelated reader choices; same-page and cross-page Back/Forward reveal necessary ancestors without forcing a scroll. Retain existing safeguards against outdated navigation. Browser Find continues to use `hidden="until-found"` and `beforematch`; do not promise native Find support in every browser.
- Direct-load reconciliation must not become a fresh-page reset that re-closes a destination already revealed by the browser. Do not add reader-state storage, arbitrary delays, or a general scroll-restoration system.

## Verification

- Add automated checks for comment and marker processing, including representative inline and multi-block Markdown, heading and link behavior, marker placement and exact spelling, code examples, and disconnected marker interpretation.
- Use manual visual checks for the rest: the comment treatment in all three themes and representative folding/navigation behavior, including direct links into nested closed folds, fresh SPA views, Back/Forward, and unrelated folds. No new browser-testing framework or exhaustive browser matrix is required by this decision.

## Verified context and writing-step questions

- `quartz/processors/parse.ts` runs the configured Markdown transformers before converting to HTML. The enabled Obsidian plugin uses its default **legacy** parser; its public option types expose `comments` but not the underlying parser's comment-retention options. The exact processing approach and its behavior in the configured legacy path still need investigation; do not assume disabling `comments` preserves parsed comment contents.
- Determine how to preserve ordinary comment Markdown early enough for heading IDs, heading navigation, links, searchable content, and other relevant transforms, while supporting the agreed comment-style boundary and normal heading sections. Preserve transclusion extraction: `quartz/components/renderPage.tsx` selects heading sections from top-level parsed HTML before the folding tree transform runs.
- Check the installed micromorph and router timing when writing the step: micromorph returns a promise and the current router does not await it. The inspected implementation appears to apply patches synchronously before its internal awaits, but the required reveal-before-scroll ordering should not rest on an unexamined assumption.
- User-supplied web research reports that initial fragment revealing and `beforematch` can occur before DOM-ready listeners, and reports differing native `hidden="until-found"` support. It cites the [HTML ancestor-revealing algorithm](https://html.spec.whatwg.org/multipage/interaction.html#ancestor-revealing-algorithm), [HTML fragment scrolling](https://html.spec.whatwg.org/multipage/browsing-the-web.html#scroll-to-the-fragment), and [Mozilla bug 2081502](https://bugzilla.mozilla.org/show_bug.cgi?id=2081502). These live sources and browser behavior were not independently verified in this discussion; the research supports reconciliation and conditional correction, not guarantees about every browser.
- Exact marker-adjacent edge cases beyond the agreed rule, and concrete processing and rendering mechanisms, remain for step writing. Surface any new result-affecting decisions rather than silently expanding the agreed syntax or scope.
