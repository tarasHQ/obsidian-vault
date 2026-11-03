---
status: waiting
state: full
---

[← PLAN](../_plan_002.md)

## Description
%%What this step is about, in 2-4 sentences%%
The closing step: decision persistence + the phase's real verification. All READMEs are written here, ONCE, against the final picture ([C15] — per-step stub-writing was rejected), because only now does the end state exist to document. Then the end-loaded verification ([C12]): multiple independent LLM semantic review runs of the final CSS against `public-legacy/` — every selector/variable accounted for (present, intentionally removed, or explained) — plus the [C9] acceptance checklist and the manual smoke. This step is the phase's proof of success, not paperwork.

## High-Level

### List of related files or folders
%%which are useful for context%%
- `quartz/styles/README.md` — CREATED (does not exist yet; only `quartz/static/fonts/` and `custom-plugins/remark42/` have READMEs today). Deep dive: SCSS removal rationale, consolidation shape, theming flattening incl. SSOT driver, `--titleFont` outcome (**STAYS** — revised [C2]: page-title plugin consumes it; record why, not why it died), templates decision ([C13] full removal).
- Stub READMEs (CREATED): `quartz/util/`, `quartz/plugins/emitters/`, `quartz/cli/`, `quartz/processors/` (touched in 02.1 → included). Each captures only that module's phase-002 decisions.
- `__obsidian__/docs/AGENTS.md` — update §01.1 (SCSS/Lightning CSS line → plain CSS toolchain), §01.3 removed-plugins-style table pattern extended with the new removals (scss toolchain, theming generation, Google Fonts, quartz-fonts, templates/create-flow), Tech Stack CSS entry.
- `public-legacy/` — reference source for the semantic review (NOT a byte-diff baseline). Contains test pages (markdown-test, remark-comments-load-test, remark42-shell-test) — use them for remark42 theming coverage.
- Step 01 artifacts — `sass-expanded-oracle.*` and `dead-css-checklist.md` feed the review's "intentionally removed" bookkeeping; the orphan-alias list from 02.6 is the accepted-delta ledger.
- `C:/Users/Taras/Documents/obsidian-vault/@system/projects/shared/templates/readme-template.md` — format template for all READMEs written here.

### Intended outcome
- Every touched submodule carries its decisions in a README; AGENTS.md reflects the final architecture (no drift per its §99.4).
- Semantic review verdict recorded: every selector and custom property from the pre-phase CSS is accounted for.
- [C9] acceptance criteria all pass (checked item by item, recorded).
- User completes the manual smoke on the live `npm run build` output.

### Local invariants
%%(if any)%%
- **READMEs document the FINAL state** — no migration diaries, no "we used to have scss" history beyond a one-line rationale; AGENTS.md §99.3 rules apply (what belongs in durable docs).
- **Review is semantic, multi-run, independent** — each review run must produce its own accounting of selectors/variables; convergence between runs is the signal, single-run confidence is not ([C12]).
- **Stub READMEs stay stubs** — phase-002 decisions only; deeper docs live in `quartz/styles/README.md` ([C8]). readme-template.md is the format source for all of them.
- AGENTS.md §02.1 stays unchanged — "every logical module" convention remains broader than practice for untouched modules; accepted deliberately, documented as such ([C8]).

### Should NOT be done in this step
- No code changes — any defect the review or smoke finds goes back to the owning step as a fix, then returns here for re-verification.
- No new scope items discovered mid-review get implemented here — capture in `ideas/parking.md` instead.
- No vendored `docs/` edits (upstream reference material, standing rule).

---

## Tasks
- [ ] 06.1 — Write `quartz/styles/README.md` (deep dive, per readme-template.md): SCSS removal rationale (vendored fork, dead machinery tax), consolidation shape (base.css = variables-absorbed + syntax + callouts; why physical consolidation beat JS concatenation/`@import` bundling — [C10]), theming flattening incl. SSOT driver and both-palettes-stay decision, the consumed-custom-property set (9 palette + 4 font vars) and the orphan-alias removal, `--titleFont` stays (page-title consumer), `@layer quartz-base` arrangement, css-text loader invariant.
- [ ] 06.2 — Write stub READMEs: `quartz/util/` (what remains of theme.ts and why), `quartz/plugins/emitters/` (simplified assembly, layer composition, no font fetching), `quartz/cli/` (no create flow, no sass tooling — and why), `quartz/processors/` (`.css` stub contract).
- [ ] 06.3 — AGENTS.md updates: §01.1 toolchain lines (SCSS → plain CSS, Lightning CSS unchanged), removed-items table pattern extended, §01.2/§99 cross-references checked. One session, no drift.
- [ ] 06.4 — Multi-run semantic CSS review ([C12] — the real verification):
	- N independent runs (N ≥ 2; more if runs disagree) comparing final CSS (`base.css`, `custom.css`, `popover.css` + component CSS in `public/`) against `public-legacy/` CSS bundles.
	- Each run outputs a full accounting: every selector and custom property → present / intentionally removed (with ledger reference: orphan aliases, dead-CSS checklist items, pruned Sass vars) / explained delta (mixin expansion artifacts, minifier ordering, hash churn).
	- Deliverable: review artifact under `__obsidian__/phases/002/artifacts/` with all runs' verdicts; unresolved discrepancies = blockers back to owning steps.
- [ ] 06.5 — [C9] acceptance checklist, item by item (recorded):
	- Zero `.scss` files in repo.
	- Zero sass-related deps (direct or transitive) in lockfile.
	- Core stylesheet contains only consumed custom properties (grep-verified per-variable — re-run the 02.6 grep as final proof).
	- Google Fonts machinery grep empty (`googleFontHref|googleFontSubsetHref|processGoogleFonts|fontOrigin|cdnCaching`).
	- Templates/create-flow grep empty (from 05.6).
- [ ] 06.6 — Manual smoke (user, on live build output): dark toggle flips all surfaces (incl. Shiki both themes), Remark42 widget theming follows, fonts render correct (Atkinson/JetBrains, weights 400/600), popovers + search behave, light-mode outdoor readability spot-check. Record results; failures route back to owning steps.
