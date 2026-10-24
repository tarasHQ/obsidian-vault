# Developer Notes

## Applicability
1. DOES NOT APPLY TO `quartz/` AND OTHER `quartz`-RELATED CODE. 
2. Applies only to user code.

================================================================

## Coding Constitution

1. Code Quality & Craftsmanship
	- Always apply best long-term engineering practices; quick-and-dirty fixes and temporary hacks are strictly forbidden.
	- Code must be clear, well-structured, and self-documenting. Prioritize long-term maintainability over clever or concise one-liners.
2. Robustness & Defensive Programming
	- Handle errors explicitly at every boundary (network, file I/O, user input, external process execution).
	- Never swallow exceptions silently. Avoid brittle implicit assumptions about runtime state or data shapes.
	- Validate external and cross-boundary data using schema validation before processing.
3. Performance & Resource Hygiene
	- Write code that respects system resources: clean up event listeners, subscriptions, timers, and file handles.
4. Structured Logging & Observability
	- Place informative, structured logs at critical boundaries. Avoid logging every minor step.
	- Logs should provide actionable debugging context without polluting the console with redundant noise.
5. Pragmatic, Value-Driven Testing
	- Tests exist solely to reduce risk and protect non-trivial invariants over time — high test count/coverage is not a goal.
	- Never write tests that merely verify trivial getters, mirror obvious implementation details, or duplicate type checker guarantees.
	- Tests are code with ongoing maintenance cost. Redundant, brittle, or low-value tests should be refactored or deleted.
	- Do not write tests prematurely for volatile or newly introduced functionality before its design is settled, completed, and approved.
	- Propose new tests only when there is clear value: regression risks, complex algorithmic logic, or hard-to-verify edge cases.

================================================================

## Module Documentation Writing (`README.md`)

### Description
- High level described in `AGENTS.md`
- Dev must manually update `README.md` after changes (if needed). LLM must encourage dev to do so. 
- Purpose is to:
	- Reduce cognitive load on revisiting the module by providing high-level overview
	- Improve memory retention of codebase by forcing him to manually write and maintain `README.md`
	- Store nuances/quirks/minor todos
	- Explain controversial decisions

### Template [TODO]
- If user asks LLM to write it - LLM must only write template.

### Notes
- Keep concerns separated, avoid parent `README.md` going in details of submodules (it's the job for submodule's `README.md`)
- Write `README.md` as if next time you'll come back to its code will be in a month.
- Avoid using LLM for writing it, it's purpose is to be `for you - by you`. Better understanding and memory retention. 

================================================================

## Naming Conventions

> Examples intentionally removed: the template's examples named files from another codebase. To be supplied with this repo's real files — see TODO.

### 1. Never use standalone generic names. Prefix with domain or use a concrete noun.

### 2. The file name must match its primary exported symbol.

### 3. Module Entrypoints & Prefixes
- Publicly imported entities should carry their origin in the name, so call sites are unambiguous without checking import headers.

================================================================

## Documentation & JSDoc Standards

### 1. Mandatory JSDoc Docstrings (`/** ... */`)
Every exported or local declaration must have a docstring comment:
- File header describing purpose & responsibilities.
- Top-level functions & components.
- Top-level classes & class methods (public, private, static).
- Types and enums.
- *Exemption:* Plain constants/primitives (`const logger`, `const MAX_RETRIES = 5`) and inline closures (`items.map(...)`) do not require JSDoc.

### 2. JSDoc format
- If a JSDoc description consists of a single statement/sentence, it must be on one line.

### 3. No JSDoc Tags in TypeScript (@param, @returns, @type)
- In `.ts` and `.tsx` files (but not `js`/`mjs`), JSDoc tags (`@param`, `@returns`, `@type`, `@typedef`, etc.) are forbidden.

================================================================

## Imports & Exports Hygiene
- Zero barrels & dead exports: `export *` and re-export-only `index.ts` files are forbidden → direct file imports only. Export only what is immediately consumed, don't export "just in case".
	- Exception: a plugin's `src/index.ts(x)` loader entrypoint is required, not a barrel.

================================================================

## File Anatomy & Structure
- Section layout order:
  1. `/** File doc header */`
  2. `Imports block`
  3. `Local consts / let`
  4. `Exported config & types`
  5. `Exported classes, functions & components` (Public API)
  6. `Local classes`
  7. `// Local Functions` (private helpers & subcomponents)
  8. `// Local Types` (private types & local prop interfaces)
- Each section is separated by `// ===...`

================================================================

## Styling
- UI must be usable from small phone screens up to 4K displays (“universal UI”).
- UI must be reactive to size changes (tab can be widened or narrowed, stretched or shrunk), so layout must adapt to this.

================================================================

## TODO — sections still to be written

> Not rules. Placeholders for the rewrite; delete this section once the document is complete.

- **TypeScript conventions.** Open question: "prefer `type` over `interface`" was deleted because `custom-plugins/remark42/src/` already has 7 interfaces. Decide: enforce going forward only, or refactor them too.
- **Import grouping.** Actual convention is `3rd-party` → `@quartz-community/*` → relative. No path aliases exist (`tsconfig.json` has no `paths`), so the template's `#alias/*` scheme was removed.
- **Rendering model (highest-value gap).** Components are build-time SSR with no hydration: no `window`/`document`/timers/listeners at module scope or in render. Client code lives in `afterDOMLoaded` scripts and must tear down on SPA `prenav`.
- **Build concurrency.** No module-level mutable state; build state is threaded through `BuildCtx`.
- **Content pipeline boundary.** New markdown behaviour is a transformer in a local plugin, not an edit to `quartz/processors/`.
- **Formatting SSOT.** Prettier owns it: tabs, `tabWidth: 4`, `semi: false`, `printWidth: 120`, LF. Gates are `npm run check` (`tsc --noEmit` + `prettier --check`) and `npm test` (`tsx --test`).
- **Vendored patching exception.** §Applicability excludes `quartz/` — decide whether an explicit line is needed for when a patch is unavoidable (minimal, single place, no reformatting, no drive-by cleanups).
- **Local plugin boundary.** No host imports from `../../../quartz/**`; never reformat captured third-party code (`custom-plugins/remark42/fixtures/` is prettier-ignored for that reason).
- **Accessibility replacement wording.** The deleted rule ("do not write a11y code") contradicted working `aria-live`, `aria-label`, `role="status"`, `aria-hidden` in `spa.inline.ts` and `remark42/src/`. Needs wording that limits *new* a11y surface without mandating deletion of existing attributes.
- **Naming examples** using this repo's real files.
- **Testing specifics** — where tests live per module — and a one-line definition of done.
