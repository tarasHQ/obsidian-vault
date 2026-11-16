---
status: ready
state: full
---

[← PLAN](../_plan_004.md)

## Description

Prepare the build-time navigation model for the internal Explorer. Discover the site's top-level section entries from Quartz page data, preserving the distinction between authored titles and the configured frontmatter transformer's automatic fallback. The next step will consume this model to render and register the Explorer.

## High-Level

### List of related files or folders

- `__obsidian__/phases/004/_plan_004.md` — phase-wide decisions and exploration.
- `__obsidian__/phases/004/_reflections/initial-reflection.md` — agreed behavior and remaining details.
- `__obsidian__/phases/004/ideas/parking.md` — locked decisions supersede earlier notes.
- `quartz/components/README.md`, `quartz/components/types.ts` — component conventions and page-data props.
- `quartz/processors/README.md`, `quartz/processors/parse.ts` — parsing order and worker constraints.
- `quartz/plugins/pageTypes/dispatcher.ts`, `quartz/plugins/vfile.ts` — processed page data passed to components.
- `quartz/plugins/loader/config-loader.ts`, `quartz.config.yaml` — transformer configuration and ordering.
- `node_modules/@quartz-community/note-properties/README.md`, `node_modules/@quartz-community/note-properties/dist/index.js` — configured frontmatter behavior; inspect the installed version rather than modifying it.
- `quartz/util/path.ts`, `quartz/util/path.test.ts` — existing slug and relative-link utilities and tests.

Read the relevant local module READMEs before inspecting or modifying their code. Follow `__obsidian__/docs/DEV_RULES.md` before writing code.

### Intended outcome

- A focused internal model consumes the processed page data available to a Quartz component and identifies the root `index.md` homepage and matching entry pages in immediate subfolders of the content root.
- A folder's entry is `_<folder-name>.md` inside that folder, matched case-insensitively while preserving all other characters. Nested entries and ordinary notes are not Explorer sections.
- Each section carries its source-relative path, actual Quartz published slug, display label, and optional icon-selection information needed by the rendering step. Section labels use an authored frontmatter title when present; otherwise remove `.md` and the convention's first underscore from the entry filename. Sort by the displayed label, with `Home` at the bottom.
- Authored-title information survives the configured transformer's filename-stem fallback, including when the authored title happens to equal that fallback. No mutable module-level state is used: parsing may run in workers.
- Icon metadata is presentation only. When absent, the later renderer uses the default icon; an unrecognized or unusable value results in no icon. Do not make icon metadata affect entry inclusion.
- Focused tests exercise discovery, labels and ordering, actual slugs, and the authored-title distinction through the relevant real parsing/transformer path. Keep tests proportionate to meaningful behavior.

### Local invariants

- Build a local Quartz feature, not a separately packaged plugin or independent plugin build.
- The folder structure is the navigation source of truth; there is no separately maintained navigation map, hierarchy override, or dedicated navigation-validation system.
- Match existing source-relative paths; use actual published slugs rather than deriving URLs from filenames. Do not add speculative virtual-page tracking.
- The configured `@quartz-community/note-properties` transformer currently supplies a filename-stem title fallback on its legacy frontmatter-parsing path. Comparing the resulting title to the filename cannot reliably establish whether it was authored. Preserve or reliably recover the distinction using the actual configured parsing behavior; do not assume that a second YAML parser is semantically identical without verification.
- The component receives processed page data through `allFiles`; the dispatcher also includes generated pages. Apply the agreed naming convention rather than adding special tracking for hypothetical generated-page collisions.
- No authored title means the Explorer filename fallback, not the transformer's underscored stem. Treat missing and empty titles consistently with the configured transformer; preserve an explicitly authored nonempty title even when it equals the stem.
- No new watch invalidation machinery: unchanged pages may retain stale baked Explorer markup until a full rebuild. Step 02 will document this where the Explorer is described.

### Should NOT be done in this step

- Render or register the new Explorer, remove the community Explorer, create SVG assets, or implement styling, mobile interaction, active-state UI, or SPA behavior; those belong to Step 02.
- Create vault entry pages or assume edits to synced `content/` write back to the vault; entry authorship and the user's practical browsing review belong to Step 03.
- Build a navigation-validation system, speculative virtual-page tracking, browser-side list construction, or partial-rebuild invalidation.
- Add broad speculative tests or change unrelated frontmatter behavior.

---

## Tasks

- [ ] Inspect the configured parsing and transformer sequence, including title normalization and arbitrary `icon` metadata. Select a minimal internal way to retain or reliably recover authored-title information before it is lost; account for YAML/frontmatter semantics, configured text transforms, worker parsing, and VFile data typing. If the viable approach would alter a locked decision or requires disproportionate infrastructure, stop and discuss it first.
- [ ] Implement the internal navigation model using the component's processed page-data contract. Recognize only the agreed source-relative paths, retain actual slugs and icon selection, apply the label fallback, sort by displayed label, and place Home last. Keep the model independent of rendering and browser behavior.
- [ ] Add focused tests for representative matching and non-matching paths, punctuation/case and nested exclusions, authored versus fallback titles—including an authored title equal to the stem—display-label sorting, Home placement, and preservation of actual slugs and icon metadata. Exercise the configured transformer integration for title provenance rather than testing only invented fixtures.
- [ ] Run the applicable checks and tests, report the results and any limitations, and leave the existing Explorer functional until Step 02 replaces it.
- [ ] Update the phase plan with phase-level knowledge only if implementation reveals a durable change; do not copy step-level implementation details into it.

---
