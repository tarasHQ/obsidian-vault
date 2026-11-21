
# Phase 005 — Initial reflection

This document consolidates the discussion before refining, critique, and detailed planning. It is not an implementation report or a finalized step plan. No implementation or browser verification was performed during the discussion.

- **Decisions / direction** capture what the developer requested or accepted.
- **Recommendations** capture the proposed engineering approach; details still need refinement.
- **Open questions** must not silently become assumptions during implementation.
- **Code findings** come from inspection of the current repository and the supplied Search source, not from executed tests.

## 1. Foundation: feature structure and a bounded migration

### Why this became part of the phase

Folding and Search expose an existing organizational problem. Related components, helpers, browser scripts, styles, and tests are scattered between the flat `quartz/components/` directory and its `scripts/` and `styles/` subdirectories. Adding substantial new functionality there would increase the amount of code that later needs reorganizing.

The desired direction is to keep each complete site's feature together: its component, relevant logic, browser behavior, styles, tests, and concise local README. The structure should help a solo developer understand and change one feature without repeatedly following unrelated directories.

There are two separate problems to address:

1. **File ownership:** keep a feature's related files together.
2. **Site wiring:** make it clear where features are enabled, constructed, placed in the layout, and connected to content processing and browser resources.

Moving files alone solves only the first problem. Conversely, this does not justify building a new general-purpose plugin framework.

### What Explorer's current wiring actually does

The concern was that Explorer had been monkey-patched into Quartz. Inspection found explicit integration rather than runtime replacement of another component:

- `quartz/plugins/loader/config-loader.ts` directly constructs Explorer, ThemeToggle, and LeftSidebarControls.
- Those core placements enter the same priority, grouping, and sidebar-region pipeline used by plugin components.
- They are not installed by overriding the component registry. Their resources are discoverable through the page layouts and the existing resource collector.
- Their placements are currently defined in loader code, while installed Search is configured and placed through YAML.

The existing machinery is usable. The less satisfactory boundary is that the general loader knows which particular site features to construct and where they go. That should be separated from its general job of sorting, grouping, and validating layout entries.

### Chosen sequencing direction

Three approaches were considered:

1. Keep both organizational styles indefinitely and migrate gradually.
2. Implement Folding and Search first, then reorganize everything in another phase.
3. Put a few bounded foundation steps at the beginning of Phase 005, migrate the relevant existing features, and build the new work on that foundation.

**Direction: option 3.** Avoid both immediate rework and a whole-repository renovation.

Temporary unmoved files are acceptable. Permanent competing rules for new work are not. There should be one architectural convention, even while unrelated older code remains where it is.

### Target organization: features versus shared rendering pieces

Recommended top-level distinction:

- `quartz/features/` — complete local features, including any build-time processing and browser behavior they own.
- `quartz/components/` — shared rendering pieces and page structure, such as Head, Body, Flex, frames, and page components.
- `quartz/styles/` — global palette, typography, layout, and shared content styles.

These are complementary responsibilities, not old and new architectures that both need a compatibility layer.

Illustrative structure; exact folder and file names are not locked:

```text
quartz/
  features/
    explorer/
      README.md
      Explorer.tsx
      navigation.ts
      icons.tsx
      explorer.css
      ...tests
    theme/
      README.md
      ThemeToggle.tsx
      themeContract.ts
      theme-toggle.css
      ...tests
    sidebar/
      README.md
      LeftSidebarControls.tsx
      browser behavior and entry point
      left-sidebar.css
      ...tests
    search/
      README.md
      Search.tsx
      engine.ts
      matching.ts
      preview.ts
      controller.ts
      search.inline.ts
      search.css
      ...tests
    folding/
      README.md
      transform.ts
      markers.ts
      browser.ts
      folding.inline.ts
      folding.css
      ...tests
  components/
    Head.tsx
    Body.tsx
    Flex.tsx
    ...shared pieces
    frames/
    pages/
  styles/
    theme.css
    ...global styles
```

A feature need not render a standalone Preact component to belong here. Folding also transforms generated content; the theme includes early initialization used by Head, not just a toggle button.

Do not manufacture every illustrated file. Split by meaningful responsibility, not by a quota of modules. Small shared components do not all need individual directories. Shared SPA navigation and general browser utilities need not be moved into arbitrary feature folders merely to empty `components/scripts/`.

### Module boundaries that make the folders useful

- Features should expose small, intentional entry points rather than allowing consumers to reach into their event handlers or internal state. The current loader may construct and connect features, but feature internals should not depend on the loader or read its YAML configuration.
- Build-time and browser entry points should remain separate. A browser import must not accidentally pull Markdown-processing or other build-only code into the browser bundle through a catch-all export file. Use direct entry points suited to each feature, not a mandatory identical file structure; briefly document intended consumers in the feature README.
- A feature may contain both kinds of code without requiring its own npm package, committed build output, or independent build system.
- Reuse the existing component, transformer, layout, and resource APIs. Do not introduce automatic feature discovery, another registry, or an event framework without a concrete need.
- Existing community plugins can remain supported. Owning this site's features locally does not require replacing the plugin system or packaging every local feature as a plugin.

### Site wiring and configuration

**Revised direction after refinement:** the long-term preference is explicit site configuration in code instead of YAML-based configuration and automatic plugin discovery. Replacing the current configuration system is deferred; it is not a deliverable of this foundation.

For this phase, keep the existing loader as the temporary connection point. In particular, do not require a new site-composition module just to move its existing feature construction and placement instructions elsewhere. The later configuration rewrite can inspect those instructions in the loader. A small helper is acceptable if a concrete integration needs it, but do not introduce a general assembly or registration system.

Keep the current configuration path working and make only the connections this phase needs. Avoid investing in a broader YAML configuration model that is expected to be retired, and do not introduce competing editable switches. Folding is always enabled for this site; marker interpretation should be easy to disable in code, ideally by commenting out a single line, rather than adding YAML settings. Its exact connection and processing order remain to be designed.

Content processing needs deliberate ordering. Marker interpretation cannot simply be appended to the end of the transformer list if the comments have already been removed.

The current system supports directly constructed local transformers and component resources; separate plugin packaging is not a prerequisite. The integration still needs a concrete design, without making feature internals depend on the loader or scattering unnecessary one-off wiring.

### Styles and the three-mode theme

**Keep palette and font values in `quartz/styles/theme.css`.** Moving theme behavior into a feature folder must not move or duplicate the visual source of truth.

- Feature CSS consumes global custom properties, such as `--dark`, `--light`, and `--darkgray`, instead of declaring separate palettes.
- These are palette slot names; `--dark` is not a command to use dark mode.
- The root theme attribute selects the light, dark, and dark-low values. Most feature CSS should work through those values without separate mode-specific styles.
- A folder does not automatically scope CSS. Feature-owned selectors still need to avoid unintended effects on other content.
- Preserve selectors, stylesheet assembly, and behavior during organizational moves. Do not combine relocation with an unrelated visual redesign.
- Plain CSS remains the project convention. Adopting Search must not reintroduce Sass.

Theme behavior also has a broader contract: a stored reader choice wins; the OS preference seeds the initial choice; Head initializes the mode before paint; the toggle cycles modes and announces changes. Moving files must preserve those semantics and the delegated listener's behavior across page navigation.

### Proposed foundation work at the front of the phase

#### Foundation A — Set the convention and connection point

Define and document the feature/shared-infrastructure boundary and intentional feature entry points. Retain the current loader as the temporary connection point, without requiring an intermediate site-composition module. Determine only the configuration and wiring needed for this phase; do not design a broader YAML interface or speculative framework.

#### Foundation B — Move the relevant existing feature clusters

Recommended scope:

- Explorer: component, navigation model, icon definitions, styles, and tests.
- Theme: toggle, shared initialization/switching contract, styles, and tests; update Head's imports without changing its initialization timing.
- Mobile sidebar controls: component, browser behavior, styles, and tests, because they participate in the same local layout wiring.

These moves should preserve behavior. Update real consumers and import paths, preserve placement metadata and attached resources, and move each cluster coherently. Explorer owns its component, navigation model, icons, CSS and tests; Theme owns its toggle, initialization/switching contract, toggle CSS and tests; Sidebar owns its controls, browser setup and entry point, CSS and tests. Shared Head, the default frame, SPA navigation, shared event types and global `theme.css` stay outside those feature folders and remain consumers or shared infrastructure. Check actual imports and consumers during the moves. Do not leave duplicate implementations or compatibility files at old paths just to avoid updating imports. Any actual external compatibility requirement needs evidence.

#### Foundation C — Adopt Search locally

Bring the supplied maintainable source into the established feature structure, initially preserving its capabilities and using the existing content index and search engine. The detailed Search work is covered in section 3.

Separate the local baseline from intentional matching/folding behavior changes so regressions can be attributed to the right change. Its responsibilities can be separated without introducing dozens of tiny files.

After this foundation, implement the Folding feature and its marker support, then integrate revealing with Search and navigation. Design their shared boundary before implementation; they do not need to be implemented as completely isolated projects.

### What does not belong in this foundation

- Migrating every component and script just to make all directories uniform.
- Redesigning the community plugin loader or SPA router.
- Removing all potentially dead code, styles, or dependencies.
- Changing theme behavior or palette values.
- Redesigning Search's interface, adding speculative filters, or implementing passage-level indexing.

If the foundation expands into a general loader redesign or a whole-repository migration, split that larger work into another phase instead of making Folding wait for it.

### Migration constraints and verification

- `.inline.ts` is a filename-based browser-entry convention, not a requirement to remain under `components/scripts/`. Preserve that convention where it is needed.
- Imported CSS becomes a component resource through the existing build. Preserve component resource attachments, wrapper metadata, grouping, and page-layout resource discovery.
- The theme contract intentionally exports values from an ordinary `.ts` module; do not turn it into an inline-script entry point merely for symmetry.
- Update imports and existing test paths, and verify that relocated tests are still discovered. No tests or builds have been run during this discussion.
- Keep existing checks meaningful rather than adding an elaborate new testing system just for a file move.
- Each logical feature should have a concise README. Existing documentation needs to point to the new owners. Missing `quartz/plugins/README.md` and `quartz/plugins/transformers/README.md` were noted during exploration; determine the final module boundaries before creating documentation for unused locations.
- Update architectural guidance when the feature boundary or JavaScript-support policy changes; avoid filling AGENTS.md with temporary migration notes.c

### Foundation questions for refining and critique

- How can always-enabled Folding and easily disabled marker interpretation be connected with minimal code wiring, including the required processing order, without introducing YAML settings?
- Which existing files truly belong to Explorer, Theme, or Sidebar, and which remain shared infrastructure? Keep feature internals independent of the temporary configuration loader.
- Are the proposed first migrations enough, or is there another tightly related dependency that must move with them?
- Can each migration remain behavior-preserving and independently reviewable?
- What exact feature entry points keep browser imports free of build-time code?

## 2. Folding: preserve an axis of structure, not just add a visual toggle

### Meaning and desired experience

Folding is a major axis of structure in the vault. It allows substantial detail to live in a note without exposing everything at once. Without it, long notes such as the project file become cluttered walls of text and lose much of their intended organization.

The website should feel close to the vault in this respect:

- What the author intended to start folded starts folded.
- Readers can open detail they want and close content they do not need.
- Nested structure remains understandable and manageable on desktop and mobile.
- Folded content remains discoverable through navigation and search rather than becoming effectively inaccessible.

This is website behavior for published content, not a rewrite of the Obsidian plugin or a requirement to synchronize website readers' choices back into notes.

### Clarification about the Obsidian markers

The markers come from a **custom Obsidian plugin** that persists folding state into the note, rather than keeping it only in the application's state. This makes the author's fold state portable between sessions and devices and gives the note an additional structural dimension.

Do not describe the marker as native Obsidian syntax or infer its exact rules from the website implementation.

The described intended coverage includes headings and ordinary bullet, numbered, and task list items. The developer's explanation also contained an 'only headings' phrase, so confirm the exact plugin behavior against real notes or its source before locking the parser's supported placements. The agreed website scope is not headings-only.

**Marker evidence:** the accessible `foldstate-dev` plugin writes trailing `%% fold %%` and recognizes headings and bullet/numbered list-item lines, including task items, with whitespace variations and repeated trailing markers. It asks the editor for an actual foldable range; a recognized marker does not itself prove a range exists. The plugin identifies itself as a test clone, so confirm its relationship to the author's current plugin before treating its exact rules as definitive. The plan also uses `%% folding %%`; that is not evidence that both spellings need support. Below, `%% fold %%` is shorthand for the intended marker.

### Core scope and agreed behavior

- Make all eligible ordinary headings and list items foldable, whether or not they have a marker.
- A marker means that eligible fold **starts closed**. Other eligible folds start open.
- Support independent nested folds. Closing and reopening a parent should not indiscriminately open all nested children.
- Support headings inside list items without duplicate arrows or incorrect boundaries.
- Use a small arrow/button on the left whose appearance reflects the current open/closed state. Do not make the entire heading the toggle.
- Preserve normal text selection, links, list numbering, and task-checkbox behavior. The fold button must not compete with those controls.
- Support keyboard use, usable mobile tap targets, and state information for assistive technology.
- Work across initial page loads and the site's SPA navigation, not only immediately after a full load.
- Reveal necessary closed parents when navigation or search targets content inside them. The cross-feature design is covered in section 3.
- Do not persist reader fold choices. Reloading restores the author's defaults.

The discussion rejected a folding-specific requirement to keep every section accessible without JavaScript. The site-wide warning and support-policy decision below replace that requirement; do not silently reintroduce it as a mandatory fallback.

### Fold boundaries

#### Ordinary headings

Recommended Obsidian-like rule: a heading folds the following content up to the next heading of the same or higher level, including lower-level subsections. The heading itself remains visible.

```md
## Parent %% fold %%

This starts hidden.

### Child

This is also inside Parent.

## Next section

This is outside Parent.
```

Only meaningful folds should receive a control. An empty heading with no foldable content does not need a nonfunctional arrow.

The implementation must establish boundaries within the correct content container, not flatten every heading in the document into one global sequence.

#### List items

The item's label stays visible while its nested content is hidden. Folding one item must not affect its following siblings.

```md
- Parent %% fold %%
  - Child
    - Grandchild
- Next item
```

Numbered and task lists need the same general behavior while retaining numbering and checkbox semantics.

List items can contain more than sublists: additional paragraphs, code blocks, quotes, and other blocks need a deliberate boundary rule. Recommendation: fold the item's additional content, not just its child bullets. The exact treatment of a multiline label and additional blocks remains to be refined using real examples.

#### Headings inside list items

This is a central case, not an edge case to postpone. The project file frequently uses patterns such as:

```md
- #### IDEAS
  - ###### Scroll Restoration %% fold %%
    - Details...
```

The visible label is both a Markdown heading and part of a list item. Naively applying two independent folding systems could create duplicate controls or extend a heading fold beyond the intended item.

Recommended direction: provide one fold control for that label and respect its list-item containment. Verify the detailed precedence and boundaries for more complicated combinations rather than applying that as an untested shortcut.

### Separate the folding engine from marker-derived defaults

The proposed two-stage approach is sound as a separation of responsibilities:

1. **General folding:** determine boundaries, produce controls/structure, operate nested folds, and expose a way to reveal a target's closed parents.
2. **Marker interpretation:** recognize the author's markers and supply initial closed states.

The second part can be a small module inside the Folding feature. It does not need its own package or independent build system.

The implementation sequence may establish the general behavior first and then add marker defaults, but both need to be designed together. The folding system must have a clear way to receive initial state, and marker information must survive long enough to be used.

**Decision: Folding is always enabled for this site.** Do not add a Folding on/off switch or YAML settings for it.

Marker interpretation should be easy to disable in code, ideally by commenting out a single line where it is connected. Its precise connection and processing order remain to be designed; avoid creating configuration machinery for it.

- Disabling marker support leaves ordinary folding working, with eligible content initially open.
- Stopping the use of markers should not break existing pages or require removing the folding system.
- Ordinary comments remain visible regardless of whether marker interpretation is connected.
- **Open:** when interpretation is disconnected, decide whether marker-looking comments remain hidden or are displayed as ordinary comments. Do not silently decide this by accident.

### Separate block: preserve comments through Quartz Syncer

**Developer-confirmed finding:** Quartz Syncer strips comments before notes reach the website. The source `__obsidian__/_project.md` contains active fold markers while its current `content/` copy lacks them; the files also differ in other respects, so that comparison alone does not establish exactly when the change occurred.

**Direction:** fork Quartz Syncer as a separate block of work and disable comment stripping so ordinary comments and fold markers reach `content/`. Establish a maintainable custom-plugin workflow rather than editing only the installed bundle. The installed artifact is under `C:/Users/Taras/Documents/obsidian-vault/.obsidian/plugins/quartz-syncer/`; the maintainable source and fork workflow still need to be located and planned. This is a publishing-plugin change, separate from the custom fold-state plugin that writes the markers.

Preserving comments means their contents enter the website repository. The developer accepts this. Comments are not private and must not be relied on as an access-control mechanism.

### Visible ordinary comments and marker processing

**Decision:** ordinary Obsidian comments are website content. Display their contents without the `%%` delimiters and attach a dedicated CSS class, such as `obsidian-comment`, so they can be styled. Preserve their intended Markdown structure; inline and multi-block comments may need different suitable HTML structures. The exact rendering technique and behavior of complex comment contents remain to be designed.

Fold markers are different: when interpreted on supported labels, they provide an initial closed state and are not displayed as ordinary comment text. Marker-like examples in inline or fenced code remain code, not instructions.

**Current pipeline constraint:** the enabled Obsidian-flavored Markdown transformer currently removes parsed `%% ... %%` comment nodes during Markdown processing. The Syncer fork alone cannot make comments visible or markers usable: website processing must also change. Coordinate marker recognition and ordinary-comment rendering before any existing removal would discard their contents; do not assume that simply disabling a setting automatically provides the desired rendering.

- Confirm actual authoring-plugin syntax and placement, and decide how unsupported or nonfoldable marker locations behave.
- Preserve heading IDs, author links, and content text needed for search and other transforms.
- Fold controls and marker-processing artifacts should not pollute searchable content; ordinary visible comment content is part of the published page.
- Do not assume a global text replacement is sufficient. Content parsing can use workers, so avoid shared mutable build-time state that assumes one page is processed at a time.

### Temporary reader state and page lifecycle

**Decision:** do not store reader fold choices in localStorage, sessionStorage, or another persistence mechanism. A freshly loaded page, including fresh content fetched through SPA navigation, starts from the author's defaults; a full reload also restores them. If the browser restores an existing document as it was, its temporary view may remain without adding storage to recreate it.

Details still to design:

- When initial closed state is applied and how to avoid an unnecessary flash of expanded content or scroll movement.
- How reveal requests interact with initialization so opening a target is not immediately undone by reapplying defaults.
- How setup and cleanup avoid duplicate handlers across navigation, including morphing and back/forward paths.

These lifecycle questions are not permission to add reader-state persistence. Search's temporary handoff of a query to a destination page is a separate mechanism, discussed in section 3.

### Fold controls, icons, and page size

Many foldable lines can exist on one page. Avoid repeating elaborate SVG geometry for every control without considering the resulting markup size.

Current Explorer approach: it defines each selected icon once per generated page using SVG symbols, then individual links reference those definitions with `<use>`. This is per-page reuse, not one external sprite shared across every page.

Possible lightweight options for folds include:

- One simple reusable SVG definition and compact references.
- A CSS-drawn arrow whose orientation follows state.
- Another comparably lightweight approach if it is simpler and meets appearance/accessibility needs.

Choose an implementation during planning; a separate mechanism-comparison exercise is not required. Do not import a full icon system merely to draw one arrow, and do not assume page-size growth is catastrophic without checking the actual output. The button still needs an accessible purpose, visible keyboard focus, and correct expanded/collapsed state regardless of the drawing technique.

**Print decision:** include all content in printouts, regardless of the current on-screen fold states.

The dedicated arrow is preferable to making heading text clickable because labels may contain links or be selected/copied. Its mobile hit area can be larger than the visible glyph without obscuring adjacent content.

### JavaScript requirement: warning and explicit support policy

**Requested scope:** bring the existing project idea for a site-wide JavaScript-required warning into Phase 005. This is not an Explorer-only or Folding-only warning.

Desired behavior:

- When JavaScript is unavailable, show a clear, closable, nonmodal notice that the website requires JavaScript and may not work correctly without it. A prominent stripe at the top is a suitable direction; the rest of the page need not be blocked.
- Closing the warning must itself work without JavaScript.
- Record in `AGENTS.md` that the site does not commit to a non-JavaScript fallback, so every feature discussion does not reopen that requirement.
- Update the existing project idea when the warning is delivered so it no longer appears as unimplemented future work.

Constraints to resolve before implementation:

- A normal JavaScript-powered close button cannot satisfy this requirement.
- Choose a suitable native HTML/CSS mechanism and ensure dismissal is keyboard-operable without JavaScript. The notice is nonmodal; do not imply that it blocks background interaction.
- A warning for disabled/unavailable JavaScript is not automatically detection of every runtime or network failure. Be clear about what is detected.
- No current `<noscript>` warning was found during exploration.

The policy removes a required no-JavaScript fallback; it does not require deliberately hiding content that could remain readable. Handling unexpected script failures remains a separate quality/trade-off discussion, not an assumed promise of full fallback support.

The warning should be implemented as its own focused change, not entangled with file moves or Search adoption.

### Verification scope remains open

The developer declined a prescribed verification block or proof gate during this refinement. Do not introduce a required test suite, browser-testing framework, or formal verification plan on that basis. No Folding tests or manual browser checks were run during this discussion; existing tests for other features are not evidence that Folding works.

### Folding questions for refining and critique

- What exact marker syntax and line placements does the custom Obsidian plugin produce?
- What are the precise content boundaries for mixed headings, lists, paragraphs, code blocks, and task items?
- Where is Quartz Syncer's maintainable source, and how should the fork be maintained and delivered?
- How should ordinary comments be rendered with their own class while retaining inline and block structure? What happens to marker-looking comments when interpretation is disconnected?
- How should the agreed fresh-view and browser-restoration behavior be implemented across navigation and morphing?
- Which initial-render technique avoids distracting expansion/collapse while preserving correct reveal ordering?
- What minimal interface lets Search, links, and TOC reveal a target without depending on Folding internals?
- Which arrow implementation is simplest and sufficiently compact?
- What native HTML/CSS mechanism makes the nonmodal no-JavaScript notice dismissible by keyboard without JavaScript?
- How can print output include all folded content without changing the reader's on-screen choices?

## 3. Search and navigation: make hidden destinations discoverable and reachable

### Why Search ownership is being considered

The developer is open to writing local plugins or making Search a core/local feature if that is justified by the immediate integration and likely future needs. The aim is not to rewrite Search merely because customization is possible.

Folding exposes an existing limitation: the installed Search component attempts to locate and scroll to a match after navigation, but it does not carry a precise result location or provide a public hook to reveal folded parents first. An outside workaround would depend on its internal markup and timing.

**Recommended direction:** adopt and adapt the Search component locally, retain FlexSearch as the search engine, and retain the existing content index initially. Fit it into the feature structure established in section 1.

This remains a build-time/static-assets architecture with browser search. It requires no search server, Worker runtime handler, or change to assets-only hosting.

### Three distinct parts of Search

| Part | Current responsibility | Direction for this phase |
| --- | --- | --- |
| Content index | Build-time page text and metadata serialized to JSON | Keep initially |
| FlexSearch | Browser-side matching and ordering of pages | Keep |
| Search feature | UI, query handling, results, previews, and destination revealing | Own locally and adapt |

Owning the component is not the same as writing a search engine or introducing a new indexing format.

### Inspected sources and limitations of the evidence

- Installed package: `node_modules/@quartz-community/search`, version `1.0.3`.
- Developer-supplied maintainable source: `C:/Users/Taras/Dev/_other/quartz/search-main`, also declaring `1.0.3`.
- The matching version is not proof of byte-for-byte equivalence. Inspect actual source behavior while adopting it; some README claims differ from the current site's implementation.
- Before the source directory was supplied, installed artifacts provided bundled JavaScript and source maps, not a clean standalone original browser controller. The supplied source removes the need to reconstruct maintainable code from that bundle.
- These findings come from reading source and configuration. They are not verified browser outcomes or test results.

Useful source paths:

- External `src/components/Search.tsx` — component markup, options, and resource attachments.
- External `src/components/scripts/search.inline.ts` — browser controller and matching logic.
- External `src/components/styles/search.scss` — source stylesheet.
- External `test/search.test.ts` — small factory/resource smoke-test suite.
- Installed `dist/components/index.js` — actual bundled implementation inspected before the source was supplied.
- `quartz.config.yaml` — current enabled Search and ContentIndex plugin entries.
- `quartz/components/scripts/spa.inline.ts` — page replacement, history/hash handling, cleanup, and navigation events.

### Current content index and data flow

The current site enables the community Search component and `@quartz-community/content-index` emitter. Search is placed in the left sidebar's stationary top toolbar through YAML. There is no existing local core Search implementation to switch to.

The Description transformer produces `file.data.text` from the processed HTML tree. The ContentIndex emitter serializes page-level text and metadata to `static/contentIndex.json`. Page rendering supplies the `fetchData` promise used by browser Search.

The content index is whole-page data, not an index of individual headings or paragraphs. HAST trees, heading IDs, and block-reference information are available elsewhere in the pipeline, but this index path does not currently turn them into passage records.

Folding should not remove hidden text from the index. It changes visibility, not whether that content belongs to the page. Confirm that newly generated controls/labels do not contaminate the text used for search.

A documentation caveat: the supplied Search README says Quartz core emits the content index by default. In this repository, the inspected implementation is supplied by the enabled community ContentIndex emitter; core provides supporting resource/data plumbing. Do not remove that emitter based on the external README's statement. It also currently serves sitemap/RSS responsibilities, so changing it later needs a broader dependency review.

### What current Search does when returning and opening a result

1. It loads the page-level content index and builds a FlexSearch document index with title, content, and tag fields.
2. It finds matching pages and displays up to eight results, with snippets and up to five tags per result.
3. It supports text queries, tag mode, tag suggestions, keyboard controls, and an optional desktop preview. Mixed text/tag queries filter text results by the requested tags.
4. A result link points to the page URL, not a matching heading or block fragment.
5. For an ordinary result activation, it writes the parsed text query, or tag text when appropriate, to `sessionStorage` under `search-term`.
6. After page navigation/render, the controller reads and removes that key and schedules a DOM scan in `requestAnimationFrame`.
7. It finds a candidate containing the stored query, temporarily highlights the range, and scrolls it into view.

This temporary query handoff is not persistence of reader fold choices. Those remain explicitly nonpersistent.

### Matching rules are currently inconsistent

#### Matching pages versus locating a destination

FlexSearch performs token-based page matching. The later destination scan searches for the **entire stored query as one case-insensitive substring**.

A page can therefore be returned by Search without containing that exact contiguous phrase. In that case, the destination scan may not find a passage to reveal. This is a consequence of the inspected algorithms, not a browser test result.

The scan checks selected headings first and body elements second, stopping at the first suitable candidate. It is not a precise indexed location and not simply the first occurrence in document reading order.

The selectors include headings and body elements under `.popover-hint`, plus a narrower set directly under `article`. A matching list item can contain substantial descendant text. When adapting the code, identify the actual matched text location rather than assuming the first matching container is the right fold target.

#### Destination highlighting and cleanup

The current controller maps character offsets into text nodes, creates a DOM Range, and tries to surround the match with a `.search-scroll-target` span. It then calls `scrollIntoView` with centered, smooth scrolling. If wrapping throws, it scrolls the candidate element instead.

The temporary highlight fades after roughly two seconds and is removed about one second later. The implementation replaces that span with its text when cleaning up. A local implementation must preserve links and formatting and handle matches spanning nested markup safely; the current implementation is not a behavior to copy without evaluating that requirement.

The saved query is consumed before the scan. If no suitable match is found, it is not retained for another attempt. Title-only and tag-only results need deliberate behavior rather than an assumption that the same phrase must be present in the article body.

#### Preview matching is a separate path

Previews fetch the selected page, parse its HTML, normalize relative URLs, and clone `.popover-hint` content into the Search preview. Fetched content is cached by slug. The supplied controller has a response token to avoid applying stale preview responses and debounces preview updates.

Its highlighter uses individual query words plus certain combinations of those words, unlike the destination's full-query substring scan. It highlights text-node matches, then selects a highlight for preview scrolling by longest highlighted text. Result snippets have their own formatting/highlighting path as well.

Therefore the result snippet, preview, and opened page are not guaranteed to point at the same passage. A local feature should establish consistent matching rules rather than merely insert a fold-opening call into unrelated algorithms.

### Current interaction/lifecycle details worth preserving or evaluating

- Search listens to both Quartz `nav` and `render` events. Its initializer runs cleanup, awaits index loading and UI setup, then attempts destination revealing.
- It retains the search index across page navigation and reinstalls page UI listeners. Review asynchronous initialization and cleanup deliberately; do not assume registering more listeners solves ordering.
- Normal clicks and Enter hand off the search term. Modified mouse clicks skip the ordinary save/close behavior. New-tab behavior therefore needs an explicit decision if reliable passage revealing there is desired; the current page-only URL does not encode a match.
- The source includes incremental index additions through `content-index-updated`. Determine whether this site needs that capability before retaining or removing it; it is not a pre-scroll integration hook.
- Opening/closing, focus return, Escape behavior, tag suggestions, and arrow/Tab/Enter result navigation are real responsibilities, not incidental code to discard during a move.
- Existing sidebar behavior interacts with Search and Escape. Preserve that integration when adopting Search locally.

### Why not leave the package untouched and add a patch script?

The installed public options are `enablePreview` and `fieldPriority`. No documented callback or emitted 'match found / before scroll' event was found at the destination reveal point.

An external script could observe Search's temporary highlights or other internal DOM changes and open folds after noticing them. That would couple Folding to internal markup and to scrolling already requested by Search; preview handling would require another path. It would also leave the matching inconsistencies unresolved.

A locally maintained plugin with a proper hook is possible, but it adds packaging overhead for a site-specific interface feature. Given the repository's direction and lack of upstream-mergeability goals, a local feature is the recommended fit. This is not an argument to replace all community plugins.

### Local Search adoption: useful internal boundaries

The supplied component is small, but its browser controller is around 32 KB and owns indexing, query parsing, tag suggestions, results, previews, highlighting, navigation, and lifecycle cleanup. Merely copying it into a directory would not make those responsibilities clear.

Recommended separations, with exact files still open:

- **Engine/query logic:** index initialization, query parsing, tag filtering, and result selection.
- **Matching:** choose a passage and identify text to highlight using consistent rules.
- **Preview:** fetch/cache page content and present the selected result in its own container.
- **Controller:** connect controls, keyboard/focus behavior, results, and page lifecycle.
- **Build-time component and feature CSS:** render the shell and attach browser resources.

Keep the existing experience initially. Avoid changing ranking, interaction, and presentation unnecessarily during adoption. Make intentional matching and reveal changes separately reviewable.

The source imports FlexSearch and Quartz utilities/types. The root project does not currently declare FlexSearch as a direct dependency because the installed plugin bundles it. Source adoption must declare the dependencies it actually uses rather than relying on that hidden bundle or copying generated code.

Use the project's existing types, helpers, locale facilities, and browser conventions where suitable. Do not copy the plugin's separate build system, full locale collection, test runner, and packaging just because they are in the source repository.

The source stylesheet is SCSS but already uses shared Quartz color/font variables. Adapt it to plain CSS and the current theme contract without reintroducing Sass or independent palettes.

The supplied package is MIT-licensed. Preserve the appropriate copyright/license attribution for adopted code.

### One shared contract: reveal the destination before scrolling

Desired sequence:

1. Establish the actual target passage, heading, block, or text location.
2. Open all folded ancestors necessary to make it visible.
3. Apply any search-specific highlighting.
4. Scroll after visibility/layout has been updated.

Search should know how to locate a passage. Folding should know how to expose its closed parents. Navigation should coordinate reaching a linked target. Neither Search nor the router should manipulate Folding's private state or arrow classes directly.

A small direct function/interface may be sufficient. Do not introduce a general event bus unless there is an actual need. It must also behave sensibly when marker interpretation is disabled; Folding itself remains enabled.

For independent nested folds, reveal only the ancestors necessary to reach the target rather than expanding every fold on the page or all children of a parent.

### General navigation belongs in this phase's integration design

Search is only one way to arrive at hidden content. The same revealing behavior is required for ordinary heading links and TOC destinations, including multiple nested folds.

Cover:

- Direct page loads with a heading/block fragment.
- Links from another page through SPA navigation.
- Same-page fragment navigation and TOC clicks.
- Browser back/forward where fragments or restored pages are involved.
- Search selection and search previews.

Current router finding: SPA navigation replaces the body and handles its URL/hash scrolling before dispatching `nav`. A Folding listener that only reacts afterward can be too late for the original scroll attempt. Coordinate initialization/revealing with the actual scroll boundary; this does not imply rewriting the whole router.

Search also has its own later reveal attempt after asynchronous setup. Avoid fixing this with arbitrary timeouts or relying on an undocumented listener-registration order.

These are destination-revealing changes, not a general navigation redesign. The separate project idea about pre-paint scroll restoration and image layout shifts is not automatically included. Folding adds its own layout effects, but that does not justify importing the entire scroll-restoration feature into this phase.

### Preview and copied content need an explicit scope

Search previews and link popovers are copies of page content inside different containers. **Decision:** start each copy from author defaults, then open the folded ancestors necessary to reveal its chosen destination. Revealing, highlighting, scrolling, and any interactive fold controls must operate inside that copy, not on the underlying article. This does not require a general preview or popover redesign.

Still to decide how controls are initialized and how copied IDs and nested content are scoped without confusing page-level target lookup. Preserve existing whole-page, heading-section, and block embeds as well: `renderTranscludes` selects heading sections from the target tree's top-level headings, so introducing folding wrappers too early could affect extraction. Decide processing order or otherwise preserve that behavior; the implementation is not yet selected.

### Browser Find is a separate investigation

Ctrl/Cmd+F is browser functionality, not site Search. Indexing hidden text in FlexSearch does not make it discoverable to browser Find, and changing site Search does not automatically fix native Find.

Its behavior depends on how content is hidden and on the browser. Investigate the available native reveal behavior and trade-offs while choosing the fold implementation. Do not promise automatic unfolding in every browser or assume that all hiding techniques are equivalent.

The desired outcome is that folding does not make important content unnecessarily undiscoverable. Any accepted browser limitations should be explicit. This requires browser verification; no such verification has happened yet.

### Future improvements: distinguish useful foundations from speculative scope

| Idea | Relationship to this work |
| --- | --- |
| Reliably reveal a match under nested folds | Immediate requirement; needs coordinated matching/revealing/scrolling |
| Consistent preview and destination passage | Immediate recommended improvement to current matching behavior |
| Search within a folder/section or additional tag controls | Possible later enhancement; no new engine necessarily required |
| Show the matching heading/breadcrumb beside a result | Likely needs more structured content/location data |
| Several distinct passage results from one long note | A separate passage-selection/indexing design, not just the current page results |
| Share a link to a particular result passage or open it reliably in a new tab | Needs a suitable destination contract, not only a consumed sessionStorage query |
| Recently opened pages and bookmarks | Independent navigation features that can reuse destination handling; not reasons to rewrite Search now |
| Calendar/journal interval navigation | Independent discovery feature; no automatic Search requirement |
| Doing Now/live data | Independent feature unless a later explicit searchability requirement is made |
| Markdown/PDF download and copy controls | Independent page utilities, not a reason to expand this Search task |
| Ancestor-entry-page navigation | Separate planned navigation feature that can reuse general navigation, not required for Folding |

The project includes ideas for recently opened pages (possibly the last 20, stored locally), bookmarks, a journal calendar, and upward navigation to underscore-named entry pages. These do not need to be built into Search now. Their local storage is unrelated to the decision not to persist reader fold states.

No additional concrete future requirements for alias search, transclusion search, or block-reference search were established by the focused planning exploration. Do not invent a roadmap from the mere presence of those Markdown features.

**Important boundary:** finding a useful passage after selecting a page does not automatically require passage-level indexing. Start with the existing page-level data. Revisit the index if there is a real need for multiple independent passage results, matching-heading metadata, or reliably addressable result locations.

### Cost and verification of local ownership

Owning Search means owning keyboard/focus behavior, mobile layout, query/tag semantics, asynchronous preview fetching, safe highlighting, and cleanup across page navigation. The benefit is deliberate integration rather than patches against inaccessible internals; the cost is ongoing maintenance.

Current tests do not cover this integration:

- `quartz/components/scripts/search.test.ts` tests a copied encoder/tokenizer. It does not exercise the installed Search component, destination reveal, or its UI.
- The supplied plugin's small test suite checks factory/options/resource attachments, not actual matching, previews, folding, or browser navigation.
- The root project uses Node tests; no browser automation framework was found in the inspected root configuration. Do not silently add one as a prerequisite.

Recommended focus, subject to the developer's unresolved testing preference:

- Small focused checks for query parsing, matching rules, and target selection where those can be tested without a browser.
- Preserve useful existing checks rather than assuming copied tests validate the adopted implementation.
- Manually exercise title-only results, tags, multiword/noncontiguous matches, nested folded matches, previews, normal/modified clicks, same-page links, TOC, repeated SPA navigation, keyboard focus, and mobile layout.
- Verify that highlighting cleanup preserves existing markup and that stale asynchronous work does not affect a new page or preview.

### Search/navigation questions for refining and critique

- What matching rule best reconciles token-based page results with a useful destination passage, including title-only and tag-only matches?
- What is the smallest consistent matching/highlighting implementation for snippets, previews, and destinations without rewriting ranking?
- What should happen when a returned page has no suitable body passage to reveal?
- How should Search's temporary navigation handoff behave for new tabs and failed/interrupted navigation? Is exact new-tab passage navigation required now or deferred?
- At what concrete lifecycle point are initial fold states applied and target ancestors revealed before router/Search scrolling?
- How are the agreed preview and popover defaults, destination revealing, and controls scoped to each copied container?
- Which native browser Find behavior can the chosen fold markup support, and which limitations are acceptable?
- Which current Search capabilities should remain unchanged during adoption, and which unused packaging/runtime features can be left out with evidence?
- Can the phase retain the current page index and UI while solving nested revealing, postponing structured passage indexing and new discovery features?
