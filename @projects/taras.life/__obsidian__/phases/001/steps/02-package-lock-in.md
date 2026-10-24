---
status: waiting
state: high-level
reviewedAtStep: "01"
---

[← PLAN](../_plan_001.md)

## Description
Replace the old implementation with a self-contained package following Quartz's documented compiled-plugin model: TypeScript/TSX source, declared dependencies, an explicit build, committed `dist/`, and exports pointing to built JavaScript. Site generation consumes that output rather than compiling the plugin. This establishes the package skeleton that later render and runtime steps fill in.

## High-Level

### Intended outcome
- The old source and test implementation is replaced; generated output is rebuilt from the new skeleton, not carried over from the old plugin. Preserve the fixture and its provenance for the later runtime/test work.
- `dist/` is committed and no longer ignored. Package exports `"."` and `"./components"` point to built JavaScript, with declaration targets supplied where appropriate.
- An explicit plugin build compiles the component and browser resource. Choose and document the minimal maintainable build setup; the existing esbuild approach and Quartz's tsup template are candidates, not reasons to add tooling automatically.
- Root site generation no longer relies on a `prebuild` hook compiling Remark42. Keep an explicit developer-facing plugin-build command and decide the permanent root script shape here. Step 01 was superseded; no loading evidence is assumed from it.
- Establish a reproducible generated-output check that rebuilds and fails on changed, missing or newly generated untracked output. Wire the packaging guard into the root quality/CI gates; step 07 adds final regression coverage and usage documentation.
- Verify a clean checkout containing the matching committed `dist/`: install dependencies, then build the site and inspect newly generated component markup without compiling the plugin first. Include bare Quartz/preview smoke checks in this package verification, not a separate spike; do not let tests or quality gates rebuild the plugin before this particular check.
- Check the user's normal Workers deployment uses that committed output without an extra plugin compilation. Record the deployed revision, actual dashboard build command, supported Node/npm versions, and deployed component markup. Package/component rendering is the criterion here; the completed browser widget comes in step 06. Carry verified deployment requirements into step 07.
- The plugin imports `QuartzComponent` as a type from `@quartz-community/types`; no file references `../../../quartz`; the temporary `types`/`typeRoots` workaround is gone from its `tsconfig`.
- Root `npm run check` typechecks the plugin too, so a plugin type error fails the same command that gates the rest of the repo (today the root check stays green while the plugin is broken).
- Do not assume `custom-plugins/README.md` exists; exploration at step 01 found no parent README. The plugin README rewrite remains step 07's responsibility.

### Local invariants
- Quartz loads compiled JavaScript, never plugin TypeScript/TSX source. The emitted modules and browser-resource imports must resolve correctly from the linked package.
- Rebuild after source edits and before verification or committing; a source edit is not automatically reflected in `dist/`. Do not promise plugin hot reload unless verified.
- Behaviour is unchanged: the same note renders the same markup. This step is plumbing only.
- The `quartz` manifest in `package.json` stays the SSOT for category, components and defaults.
- The component's registered name stays `remark42`: `quartz.config.yaml` refers to it in `layout` and in the `byPageType` exclusions, so renaming it silently detaches the plugin from every page.
- No dependency may be relied upon unless it is declared *and* resolvable at runtime from the plugin's location.

### Should NOT be done in this step
- Any change to options, identity, render or runtime behaviour.
- The plugin README rewrite (step 07).
- Styling.

## Discussion & Reflections

1. **How the compiled component shares Preact with Quartz.** Keep Preact external to the plugin bundle and make its runtime ownership explicit; JSX compilation does not remove the dependency.
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

5. **Entry point and `exports` shape — decided by D1.** Declare both `"."` and `"./components"` explicitly, pointing to compiled `dist/` JavaScript; they may share the same entry. Add matching declaration targets where appropriate. Do not rely on source-entry fallbacks. TSX/JSX is allowed because the package is compiled.

6. **Build tooling and freshness check.** The documented model requires prepared output, not a particular bundler.
   - (a) Retain a small esbuild-based build, correcting dependency ownership and generated-output tracking.
   - (b) Adopt Quartz's tsup template, after checking what it adds and how browser scripts are imported as resources.
   - (c) Add a bespoke install/build mechanism in the Quartz loader.
   - **Recommend evaluating (a) against (b)** and choosing the simpler supported package setup; (c) is outside the agreed model. In either case, verify reproducible output and detect changed, deleted and untracked generated files.

7. **Verification scope — moved from superseded step 01.** Check the package actually built here, not an experimental copy of the old plugin. One clean-checkout build/render check plus ordinary bare-command/preview and production smoke checks is sufficient; no throwaway probe, network baseline, fixture diff or loader patch is a prerequisite. Record failures honestly rather than treating a green build with a missing component as a pass.

_Reflection:_ (optional — compact notes from the user)
