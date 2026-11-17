---
status: implemented
state: full
---

[← PLAN](../_plan_004.md)

## Description

Implemented the build-time navigation model for the internal Explorer. It consumes Quartz's existing processed page data; no additional frontmatter parsing, provenance hook, transformer changes, or metadata registry is needed. Rendering and registration remain outside this step.

Implementation and code review are complete. The user reported the original verification commands green; verification of the review's subsequent test change and the remaining completion flow are pending. Keep this note full until the user approves condensation.

## High-Level

### Related files

- `quartz/components/explorerNavigation.ts` — pure discovery, labels, ordering, published slugs, and icon metadata.
- `quartz/components/explorerNavigation.test.ts` — focused model tests and integration through the shared Quartz file parser with the configured frontmatter transformer and checked-in options.
- `quartz/components/README.md`, `quartz/components/types.ts` — component conventions and processed page-data contract.
- `quartz/processors/README.md`, `quartz/processors/parse.ts`, `quartz/worker.ts` — existing parser shared by in-process and worker builds; unchanged.
- `quartz.config.yaml` — existing frontmatter configuration and community Explorer; unchanged.
- `__obsidian__/phases/004/_plan_004.md`, `__obsidian__/phases/004/ideas/parking.md`, `__obsidian__/phases/004/_reflections/initial-reflection.md` — phase decisions aligned with the approved simplification.

### Approved title simplification

The user approved reusing existing parsed frontmatter rather than recovering authored-title provenance. A missing or empty processed title, or one exactly equal to the source filename stem, uses the filename without its extension and first underscore. An explicitly authored title equal to the stem deliberately receives the same fallback. Other processed titles remain unchanged, including normalization already performed by the configured transformer.

This replaces the earlier requirement to distinguish an authored title equal to the filename stem from an automatic fallback. The discarded approaches—additional YAML parsing, a second transformer pass, dependency modification, and a separate metadata registry—were not implemented.

### Model contract

- `buildExplorerNavigation(allFiles)` consumes the same processed page-data contract available to a component and returns a fresh, ordered entry list without changing its input.
- Recognize the root `index.md` and only immediate-subfolder `_<folder-name>.md` entries, case-insensitively and with punctuation preserved. Nested entries and ordinary notes are excluded.
- Each entry carries its kind, existing source-relative path, actual published Quartz slug, displayed label, and icon-selection metadata. Links are not derived from filenames.
- Sort by displayed label using explicit English collation, break equal-label ties by source-relative path, and place Home last. Home always displays `Home`.
- Preserve `icon` as absent or supplied with its existing parsed value. No icon lookup or validation affects inclusion. The later renderer supplies the default only when absent and no icon for an unrecognized or unusable selection.
- No rendering, registration, SVG assets, styling, mobile interaction, active-state UI, SPA behavior, vault entry pages, navigation-validation system, speculative virtual-page tracking, or invalidation machinery was added.

## Tasks

- [x] Implement the model using existing parsed metadata and actual published slugs; keep the current Explorer functional.
- [x] Add focused tests for matching and nonmatching paths, case and punctuation, nested exclusions, displayed-title sorting, Home placement, slug preservation, and absent versus supplied icon metadata.
- [x] Add a real parser/transformer integration test for missing, empty, null, stem-equal, custom, and numeric titles plus icon metadata. The test reads the checked-in frontmatter options and calls `createFileParser` with `createMdProcessor`; it does not substitute a frontmatter parser.
- [x] Update the phase decisions to record the approved title simplification; keep implementation details in this step.
- [x] Run the original automated verification commands; the user reported all green.
- [x] Complete code review and apply the agreed test refinement; no production-code defects were found.
- [ ] Verify the review's subsequent test change and address any failures.
- [ ] Complete the remaining implementation flow; note condensation awaits user approval.

## Verification

- Code review found no production-code defects. The user approved adding a focused test for a processed title that differs from its filename stem only by case.
- Before that test was added, the user reported all five original commands below green. The assistant did not run them or inspect their output.
- The new test has not been executed or format-checked. The original green results do not verify this subsequent edit; rerun these commands in a shell-enabled session:

```sh
npx prettier quartz/components/explorerNavigation.ts quartz/components/explorerNavigation.test.ts --write
npx tsx --test quartz/components/explorerNavigation.test.ts
npm run check
npm test
npm run build
```

## Review and handoff

- Code review is complete; the agreed test refinement is in place and awaits verification. Continue the remaining implementation flow afterward. Do not condense this note without approval.
- The component's local README briefly documents the model and title exception, added at the user's request. Plugin, loader, and page-type module READMEs were absent during exploration; those modules were not modified.
- Existing watch-mode partial rebuild behavior remains accepted. Document stale baked markup and the full-rebuild remedy with the rendered Explorer in Step 02; no invalidation work belongs here.
- Practical browser verification remains in Step 03, after the new Explorer is rendered and the needed vault entries exist.
