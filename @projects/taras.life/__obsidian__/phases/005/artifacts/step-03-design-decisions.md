# Step 03 — Navigation and reveal: design decisions

[Phase plan](../_plan_005.md) · [Phase reflection](../_reflections/initial-reflection.md) · [Folding README](../../../../quartz/features/folding/README.md) · [SPA router](../../../../quartz/components/scripts/spa.inline.ts)

## Scope and decisions

- Closed folds use `hidden="until-found"` instead of the current `fold-closed` / `display: none` mechanism. Do not add browser-support detection or a compatibility fallback.
- For browser-triggered reveals, `beforematch` synchronizes the affected control's visual and accessible state; let the browser remove `hidden`. The supplied research says removing it in the handler can interfere with nested reveals. Necessary nested ancestors should open without opening unrelated folds.
- Folds opened by browser Find remain open until the reader closes them or leaves the page.
- Print includes closed content without changing on-screen fold choices. Use print CSS and verify the result; the supplied research identifies `content-visibility` as important, but cross-browser print behavior remains unverified here.
- Same-page fragment clicks reveal necessary ancestors before scrolling and preserve unrelated fold choices. Same-page Back/Forward preserves the displayed page and unrelated fold choices, revealing necessary ancestors without explicitly scrolling.
- On a cross-page SPA navigation, reveal a fragment's necessary ancestors before a normal navigation scroll. For cross-page Back/Forward, reveal them without forcing a scroll. Use existing browser/router position behavior where practical; exact restoration is not guaranteed.
- Do not persist reader fold choices or introduce a general scroll-restoration system. Do not add special SPA handling for text-fragment links in this step.

## Existing implementation and handoff

The same-page click and history paths already call the shared reveal function in [folding.ts](../../../../quartz/features/folding/folding.ts). The router tracks the displayed page using [spaRoute.ts](../../../../quartz/components/scripts/spaRoute.ts), conservatively comparing origin, exact pathname and query while ignoring the fragment. The implementation also guards against an outdated in-flight navigation replacing a newer history destination. Update the shared reveal function for the new hiding mechanism while preserving the agreed same-page behavior.

The developer reported that browser behavior worked and three checks passed, but did not specify the checks. These results were not independently verified during this discussion. The existing cross-page SPA path scrolls before its final `nav` event and does not yet call the reveal helper. Current pages generate folds open; the current Folding `nav` handler resets them open.

**Deferred to the marker step:** marker-derived author defaults and fresh-page initialization, including direct-load and navigation ordering when defaults can be closed. Do not implement marker interpretation or preemptively redesign that initialization here. Normal content currently cannot fully demonstrate cross-page navigation into an author-default closed fold; complete that integration when markers are implemented. Search results and previews, popovers and other copied-content integration are separate later work.

## Verification and documentation

- No browser-testing framework or exhaustive browser matrix. Be conservative with new automated tests: adapt existing tests where necessary; add a focused test only for a concrete risk where worthwhile.
- Manually check nested browser Find and control state, representative same-page and cross-page navigation, Back/Forward, and printing. These are proposed checks, not reported results.
- Update the Folding README to describe the shared reveal function and behavior implemented by this step; its existing statement that all destination revealing is future work is already partly stale.
- Verify actual layout with hidden-until-found: wrappers may retain visible box spacing. Avoid adding extra wrappers or sizing rules without a demonstrated need.

## Research and uncertainties

The developer supplied web-model research, including the [HTML hidden attribute and ancestor-revealing algorithm](https://html.spec.whatwg.org/multipage/interaction.html#the-hidden-attribute), [MDN `beforematch`](https://developer.mozilla.org/en-US/docs/Web/API/Element/beforematch_event), and [Chrome's hidden-until-found guidance](https://developer.chrome.com/docs/css-ui/hidden-until-found). Its browser test claims and current compatibility details were not independently verified in this conversation. Browser-specific limitations are accepted without a fallback; do not promise uniform native Find behavior.

For Writing Steps: work out the concrete state synchronization and cross-page reveal ordering against the actual code, without silently implementing the deferred author-default lifecycle. Print behavior and browser-triggered nested revealing require the proportionate manual checks above. Avoid adopting sample code from the research that assumes control associations not established by this codebase.
