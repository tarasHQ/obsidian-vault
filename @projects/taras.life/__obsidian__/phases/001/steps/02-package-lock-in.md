---
status: waiting
state: high-level
reviewedAtStep: ""
---

[← PLAN](../_plan_001.md)

## Description
The plugin is deleted and rebuilt as a new package: the old source, tests and compile path (`dist/`, `build.mjs`, `prebuild`) all disappear, and what remains is a tree that is honest about itself — published types only, declared dependencies, no compilation anywhere. It is the skeleton the render and runtime steps then fill in.

## High-Level

### Intended outcome
- The old tree is gone: `src/`, `test/`, `build.mjs`, `dist/`, `src/browser-script.d.ts`, and the `dist/` line in the package `.gitignore`.
- `src/index.ts` is the entry; root `prebuild` and `build:local-plugins` are deleted; no command anywhere compiles this plugin.
- The plugin imports `QuartzComponent` as a type from `@quartz-community/types`; no file references `../../../quartz`; the temporary `types`/`typeRoots` workaround is gone from its `tsconfig`.
- Root `npm run check` typechecks the plugin too, so a plugin type error fails the same command that gates the rest of the repo (today the root check stays green while the plugin is broken).
- `custom-plugins/README.md` no longer lists deviations this step closed.

### Local invariants
- Erasable-only TypeScript and explicit `.ts` import specifiers — otherwise Node cannot load the entry at runtime.
- Behaviour is unchanged: the same note renders the same markup. This step is plumbing only.
- The `quartz` manifest in `package.json` stays the SSOT for category, components and defaults.
- The component's registered name stays `remark42`: `quartz.config.yaml` refers to it in `layout` and in the `byPageType` exclusions, so renaming it silently detaches the plugin from every page.
- No dependency may be relied upon unless it is declared *and* resolvable at runtime from the plugin's location.

### Should NOT be done in this step
- Any change to options, identity, render or runtime behaviour.
- The plugin README rewrite (step 07).
- Styling.

## Discussion & Reflections

1. **How `preact` is resolved once `dist/` is gone.** The component needs `h()` at runtime, imported from wherever Node can find it.
   - (a) Rely on the repo-root `node_modules` ancestor lookup and document it — zero config, but exactly the fragility the old README complained about.
   - (b) Declare `preact` in the plugin's own `package.json` and install it there — honest, but risks a second copy of Preact rendering VNodes made by the host's copy.
   - (c) Make the plugin an npm workspace and declare its dependencies there — real dependency graph, one install, one copy.
   - **Recommend (c)**, with an explicit check that only one Preact instance ends up loaded. Note this must not change `source:` in `quartz.config.yaml`.

2. **Where plugin typechecking runs.**
   - (a) Only inside root `tsc --noEmit` — one command, but a nested project can fall outside the root `include`.
   - (b) A second `npm run check:plugin` that root `check` invokes — explicit, one extra script.
   - (c) A CI-only job — fails later than necessary.
   - **Recommend (b).**

3. **How tightly to guard "no host imports, no Node builtins".**
   - (a) Nothing; rely on review.
   - (b) Two `grep` guards inside the plugin's test script.
   - (c) A test that parses imports in `src/`.
   - **Recommend (b)** — it is precisely the invariant the old README's deviation table exists to protect.

4. **What replaces the temporary Windows junction note.**
   - (a) Keep it as-is.
   - (b) Verify whether the loader now creates a junction by itself and drop the note.
   - (c) Replace it with "delete `.quartz/plugins/<name>` if it is a copy, not a link".
   - **Recommend (b)**, falling back to (c) if the loader still degrades to copying.

5. **Entry point and `exports` shape.** The loader tries `exports["."]` first, then `module`/`main`, then a fixed list that includes `src/index.ts`; components are resolved separately through a `./components` subpath.
   - (a) Declare nothing and let the fallback list find `src/index.ts` — least config, but the resolution is implicit.
   - (b) Declare `"."` and `"./components"`, both pointing at `./src/index.ts` — explicit and stable, though a `types` target can only point at source now.
   - (c) Declare only `"."` and let components fall back to `${name}/components`.
   - **Recommend (b)**, with the README stating that `types` resolves to TypeScript source because nothing is emitted.

_Reflection:_ (optional — compact notes from the user)
