# Step 04 — Visible comments and marker defaults: design decisions

[Phase plan](../_plan_005.md) · [Phase reflection](../_reflections/initial-reflection.md) · [Step 03](../steps/03-navigation-and-reveal.md) · [Folding README](../../../../quartz/features/folding/README.md) · [SPA router](../../../../quartz/components/scripts/spa.inline.ts)

## Scope

Keep visible comments and marker defaults together as one step: both depend on preserving and distinguishing Obsidian comments during content processing. Keep the comment-processing and folding changes reviewable; do not treat this note as an implementation-ready step.

## Ordinary comments

- Publish ordinary Obsidian comments without the `%%` delimiters, as self-contained, styled inline-formatted content rather than full block Markdown. Preserve supported inline formatting and links, including bold, Markdown links, Obsidian wikilinks, highlights, and strikethrough; verify their final processing.
- Heading and list syntax inside comments is ordinary text, not headings or lists: for example, `##` and `-` remain visible, with no heading styling, navigation, embedding, or folding. This replaces the earlier decision to make comment-contained headings participate in the page's heading hierarchy.
- Apply the comment treatment on top of the underlying inline styling: initially **80% of the corresponding normal font size and 50% opacity** in light, dark, and dark-low modes. No border or background. Check appearance and readability visually; these values are starting points.
- Determine and discuss how multi-line comments preserve line and blank-line spacing before finalizing the implementation approach.

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

- Add automated checks for comment and marker processing, including inline and multi-line comments, inline formatting and links, literal heading and list syntax inside comments, marker placement and exact spelling, code examples, and disconnected marker interpretation.
- Use manual visual checks for the rest: the comment treatment in all three themes and representative folding/navigation behavior, including direct links into nested closed folds, fresh SPA views, Back/Forward, and unrelated folds. No new browser-testing framework or exhaustive browser matrix is required by this decision.

## Verified context and writing-step questions

- `quartz/processors/parse.ts` runs the configured Markdown transformers before converting to HTML. The enabled Obsidian plugin uses its default **legacy** parser; its public option types expose `comments` but not the underlying parser's comment-retention options. The exact processing approach and its behavior in the configured legacy path still need investigation; do not assume disabling `comments` preserves parsed comment contents.
- Determine how to expose and style the legacy parser's inline-parsed comment contents early enough for links, searchable content, and other relevant transforms. The legacy block-comment tokenizer also parses its body as inline content, so block reparsing is no longer required by the revised decision. Verify formatting and multi-line spacing; preserve normal headings outside comments and transclusion extraction in `quartz/components/renderPage.tsx`.
- Check the installed micromorph and router timing when writing the step: micromorph returns a promise and the current router does not await it. The inspected implementation appears to apply patches synchronously before its internal awaits, but the required reveal-before-scroll ordering should not rest on an unexamined assumption.
- User-supplied web research reports that initial fragment revealing and `beforematch` can occur before DOM-ready listeners, and reports differing native `hidden="until-found"` support. It cites the [HTML ancestor-revealing algorithm](https://html.spec.whatwg.org/multipage/interaction.html#ancestor-revealing-algorithm), [HTML fragment scrolling](https://html.spec.whatwg.org/multipage/browsing-the-web.html#scroll-to-the-fragment), and [Mozilla bug 2081502](https://bugzilla.mozilla.org/show_bug.cgi?id=2081502). These live sources and browser behavior were not independently verified in this discussion; the research supports reconciliation and conditional correction, not guarantees about every browser.
- Exact marker-adjacent edge cases beyond the agreed rule, and concrete processing and rendering mechanisms, remain for step writing. Surface any new result-affecting decisions rather than silently expanding the agreed syntax or scope.
