---
status: waiting
state: full
reviewedAtStep: "02"
---

[← PLAN](../_plan_001.md)

## Description
The plugin is being written **from scratch**. The previous implementation was moved to `custom-plugins/remark42-old/` and is kept only as a reference folder — it is not configured, not imported, not built, and nothing is transcribed from it; it is deleted at step 07 once the new plugin is verified. This step establishes the new package at `custom-plugins/remark42`: TypeScript/TSX source, declared dependencies, an explicit build, committed `dist/`, and exports pointing to built JavaScript, following Quartz's documented compiled-plugin model. Site generation consumes that output rather than compiling the plugin. Later render and runtime steps fill it in.

## High-Level

### Intended outcome
- A new package exists at `custom-plugins/remark42`, authored from scratch. `custom-plugins/remark42-old/` stays untouched and unreferenced until step 07 deletes it.
- `quartz.config.yaml` already names `./custom-plugins/remark42`. Git does not track empty directories, so a clean checkout has no such path and `installPlugin` throws `Local plugin path does not exist`. This step must therefore land as **one atomic commit**: the package, its committed `dist/`, and the config that points at it.
- `fixtures/` and its provenance README are copied into the new package here, because step 06 needs the fixture and step 07 deletes the old folder.
- `dist/` is committed and no longer ignored. Package exports `"."` and `"./components"` point to built JavaScript. The `./identity` and `./runtime` subpath exports are dropped — they existed only so the old tests could import them as separate entries.
- An explicit plugin build compiles the component and the browser resource. Retain the esbuild-based build; the rationale and the rejected alternative are in Discussion 6.
- Root site generation no longer relies on a `prebuild` hook compiling Remark42. Keep an explicit developer-facing plugin-build command and decide the permanent root script shape here. Step 01 was superseded; no loading evidence is assumed from it.
- Establish a reproducible generated-output check that rebuilds and fails on changed, missing or newly generated untracked output. Wire the packaging guard into the root quality/CI gates; step 07 adds final regression coverage and usage documentation.
- Verify a clean checkout containing the matching committed `dist/`: install dependencies, then build the site and inspect newly generated component markup without compiling the plugin first. Include bare Quartz/preview smoke checks in this package verification, not a separate spike; do not let tests or quality gates rebuild the plugin before this particular check.
- Check the user's normal Workers deployment uses that committed output without an extra plugin compilation. Record the deployed revision, actual dashboard build command, supported Node/npm versions, and deployed component markup. Package/component rendering is the criterion here; the completed browser widget comes in step 06. Carry verified deployment requirements into step 07.
- The plugin imports `QuartzComponent` as a type from `@quartz-community/types`; no file references `../../../quartz`; the temporary `types`/`typeRoots` workaround is gone from its `tsconfig`.
- Root `npm run check` typechecks the plugin too, so a plugin type error fails the same command that gates the rest of the repo.
- `.github/workflows/ci.yaml` already runs `build` → `check` → a separate `npm --prefix custom-plugins/remark42 run typecheck` → `test`. Fold the typecheck into root `check` and drop the duplicate CI step in the same commit.
- Do not assume `custom-plugins/README.md` exists; exploration found no parent README. The plugin README rewrite remains step 07's responsibility.

### Local invariants
- Quartz loads compiled JavaScript, never plugin TypeScript/TSX source. The emitted modules and browser-resource imports must resolve correctly from the linked package.
- Rebuild after source edits and before verification or committing; a source edit is not automatically reflected in `dist/`. Do not promise plugin hot reload unless verified.
- **Nothing is copied from `remark42-old` except `fixtures/`.** The old folder is a behavioural reference — what the DOM contract looks like, what the served loader does — not a source of code.
- **Steps 02–05 do not produce a working widget; step 06 does.** Step 02's render is a minimal, freshly written implementation of the *current* DOM contract (`<section class="remark42-comments">`, `div#remark42`, the same `data-*` attributes, the static status line) reading the current `comment-id` frontmatter key. It exists so deployed HTML does not change until steps 04–05 deliberately reshape it; steps 03–05 replace it. It is a scaffold, not carried-over legacy.
- The `quartz` manifest in `package.json` stays the SSOT for category, components and defaults.
- The component's registered name stays `remark42`: `quartz.config.yaml` refers to it in `layout` and in the `byPageType` exclusions, so renaming it silently detaches the plugin from every page.
- No dependency may be relied upon unless it is declared *and* resolvable at runtime from the plugin's location.
- Exactly one Preact instance must resolve from both the plugin entry and the host. `.npmrc` sets `legacy-peer-deps=true`, so a `peerDependencies` entry is inert — it installs nothing and validates nothing. The guarantee has to be an explicit check, not a declaration.

### Should NOT be done in this step
- Any change to options, identity, render or runtime behaviour (steps 03–06).
- The plugin README rewrite (step 07).
- Styling (step 08).
- Deleting `custom-plugins/remark42-old/` (step 07).

## Discussion & Reflections

1. **How the compiled component shares Preact with Quartz.** `.npmrc` has `legacy-peer-deps=true`, so a `peerDependencies` entry is inert: it cannot fail if the host drops Preact, and it cannot create a duplicate either. Choose the install mechanism, then guard the outcome independently.
   - (a) npm workspace + `preact` as a normal dependency matching the root's `^11.0.1`, so npm dedupes to one hoisted copy. Honest graph, one install, one extra lockfile entry.
   - (b) No workspace; rely on ancestor lookup from `custom-plugins/remark42/dist/`. Zero config — and exactly the fragility the old README complained about.
   - (c) Workspace + `peerDependencies`. Looks correct, is inert; worst of both.
   - **Locked: (a)**, plus an explicit single-copy check inside `verify:dist`: `createRequire` from the root `package.json` and from the plugin entry must resolve `preact/jsx-runtime` to the same realpath, or the gate fails. This must not change `source:` in `quartz.config.yaml`.
   - Implementation detail: declare the workspace as the explicit path `custom-plugins/remark42`, **not** `custom-plugins/*`. `custom-plugins/remark42-old/package.json` still declares `"name": "quartz-local-remark42"`; a glob fails `npm install` on a duplicate workspace name and installs a dead reference package.

2. **Where plugin typechecking runs.** CI already has a dedicated step, so this is about not leaving two sources of truth.
   - (a) Add plugin sources to the root `tsconfig.json` `include` — one program, but mixes two build targets and demotes the plugin's own tsconfig.
   - (b) A `check:plugin` script that root `check` invokes — explicit, one extra script.
   - (c) Keep only the separate CI step — local `npm run check` stays green while the plugin is broken.
   - **Recommend (b)**, and delete the now-redundant CI step.

3. **How tightly to guard "no host imports, no Node builtins".**
   - (a) Nothing; rely on review.
   - (b) Two `grep` guards inside the plugin's test script, scoped to `src/`.
   - (c) A test that parses imports in `src/`.
   - **Locked: (b), implemented as a Node script instead of `grep`.** npm runs scripts through `cmd.exe` on Windows, so a `grep`-based guard is a portability bug. A dependency-free `scripts/check-imports.mjs` that reads `src/**` and inspects import specifiers gives the same guarantee on both platforms. Scoping matters: the build script and tests legitimately use `node:` builtins; only `src/` must stay clean.

4. **What replaces the temporary Windows junction note.** Verified in `quartz/plugins/loader/gitLoader.ts`: `linkLocalPlugin` tries `symlink`, falls back to `junction` on Windows `EPERM`, then to a copy; and `installPlugin` removes any pre-existing non-symlink entry, so a stale copy self-heals on the next build.
   - (a) Keep it as-is.
   - (b) Drop it — the loader creates the junction itself.
   - (c) Replace it with "delete `.quartz/plugins/<name>` if it is a copy, not a link" — unnecessary, the loader already replaces copies.
   - **Recommend (b).**

5. **Entry point and `exports` shape.** Verified: `getPluginEntryPoint` and `getPluginSubpathEntry` read `exports[<key>]` as a string **or** as `exports[<key>].import`, so the conditional-object form is safe. Declare `"."` and `"./components"` explicitly, pointing to compiled `dist/` JavaScript; they may share one entry. Declarations are optional — nothing in the repo consumes the package's types, so emit them only if they stay cheap.

6. **Build tooling and freshness check.** The documented model requires prepared output, not a particular bundler.
   - (a) Retain the small esbuild build.
   - (b) Adopt Quartz's documented tsup template.
   - **Recommend (a).** The docs' `inlineScriptPlugin` does not exist anywhere in this repo; the only real `.inline.ts` handler is `"inline-script-loader"` inside `quartz/cli/handlers.js`, and that convention mistypes imports (TypeScript sees the module, the bundler substitutes a string). Adopting tsup would mean adding a toolchain *and* hand-writing the same esbuild plugin. Keep the explicit virtual-module shim: four lines, and type-honest.
   - In either case also cover: reproducible output (esbuild is deterministic here), and the `.prettierignore` entry `custom-plugins/remark42/dist/` whose "third-party code" comment stops being true once `dist/` is first-party.

7. **Verification scope — moved from superseded step 01.** Check the package actually built here. One clean-checkout build/render check plus ordinary bare-command/preview and production smoke checks is sufficient; no throwaway probe, network baseline, fixture diff or loader patch is a prerequisite. Record failures honestly rather than treating a green build with a missing component as a pass. Note that CI's `npm run build` becomes the clean-checkout proof for free once `prebuild` stops compiling the plugin.

8. **Sequencing — the deployment window is unavoidable now.** The new package is written from scratch, so the widget only works again at step 06, while `quartz.config.yaml` already names the new path.
   - (a) Commit 02–06 on a branch and merge once the widget works; `main` keeps its current deploy.
   - (b) Merge incrementally with the new plugin `enabled: false` until step 06; `main` shows no comments area for the whole phase.
   - (c) Point the config back at `remark42-old` until step 06; contradicts "reference only" and leaves two plugin paths alive.
   - **Locked: none of them.** The user accepts `main` being broken during the phase. Work lands directly on `main`; between this step and step 06 the deployed site is simply missing its comment area. No branch, no `enabled: false`, no second plugin path.

9. **Fixture ownership.** `fixtures/` lives in the old folder today, but step 07 deletes it and step 06 needs it. Copy `fixtures/` and its provenance README into the new package in this step, and leave the old copy in place so the reference folder stays self-contained until removal.

10. **Small open detail.** Root `package.json` carries an `allowScripts` map (`esbuild`, `@parcel/watcher`, `workerd`). **Verified: dead config.** No `@lavamoat/allow-scripts` is installed, npm ignores unknown root keys, and no file in the repo reads it; the three lifecycle scripts it names run regardless. Leave it untouched and add nothing to it.

11. **What `npm run build` does about the plugin.** The user wants one command surface — building the site should include the plugin, and `check` should include it too. That collides with this step's own requirement that site generation must not compile the plugin.
   - (a) `build` = verify freshness read-only (~1 s), fail if `src/` and `dist/` disagree, then `npx quartz build`.
   - (b) `build` = compile the plugin, then build the site. Literally "build with the plugin", but it reintroduces the `prebuild` hook this step removes, makes committed `dist/` vestigial, and breaks if Workers Builds ever runs with `NODE_ENV=production` (esbuild is a devDependency).
   - **Locked: (a).** The site always contains a correct plugin and the committed artifact is the one that ships; the only cost is one explicit `npm run build:plugins` after editing plugin source — which needs a Quartz process restart anyway, since plugin hot reload does not exist here.

_Reflection:_ (optional — compact notes from the user)

- USER INPUT:

## Implementation [WRITTEN AT THE STEP |02|]

> Between task 02 and task 07 the repository cannot run `npm run build`: `quartz.config.yaml` points at a plugin directory that has no loadable entry yet. That is expected inside this step, not a regression to chase.

### 01 - Decommission The Reference Folder From Active Tooling
- [ ] Delete `custom-plugins/remark42-old/test/`. Those three `*.test.mjs` files are picked up by the root `tsx --test` discovery and import `../dist/*.js`, which the move removed — they keep `npm test` and CI red for the whole phase. The runtime reference for step 06 is the fixture, not these tests.
- [ ] Copy `fixtures/` and its provenance `README.md` into `custom-plugins/remark42/fixtures/` (step 06 needs it, step 07 deletes the old folder). Leave the old copy in place so the reference folder stays self-contained.
- [ ] Confirm `quartz.config.yaml` never mentions `remark42-old`, and that after the deletion `npm run check` and `npm test` no longer trip over the old folder.
- [ ] Leave `remark42-old/package.json` as-is; it only matters as a workspace-name collision, which task 02 prevents by not using a glob.

### 02 - Workspace And Dependency Ownership
- [ ] Add `"workspaces": ["custom-plugins/remark42"]` to the root `package.json`.
- [ ] Create `custom-plugins/remark42/package.json`: `name: quartz-local-remark42`, `private: true`, `version`, `type: "module"`, `description`.
- [ ] Re-author the `quartz` manifest from the documented shape — `category: component`, one component `Remark42` registered under `remark42`, `defaultEnabled: false`, `quartzVersion` — because the manifest is metadata, not old code. It must keep producing the same registered name.
- [ ] `dependencies: { "preact": "^11.0.1" }` and `devDependencies: { "@quartz-community/types": "^1.0.0", "esbuild": "^0.28.2" }`, matching the root ranges so npm hoists one copy of each. `preact` is a real `dependency` only because `.npmrc` makes `peerDependencies` inert; the enforced guarantee is task 08's single-copy check.
- [ ] Run `npm install` at the root; confirm `node_modules/quartz-local-remark42` is a symlink to the plugin directory and that `node_modules` still contains exactly one `preact`.
- [ ] Commit the regenerated `package-lock.json` (CI installs with `npm ci`, so lockfile drift is a hard failure).

### 03 - Plugin TypeScript Project
- [ ] `custom-plugins/remark42/tsconfig.json`: `extends: "../../tsconfig.json"`, `noEmit: true`, `incremental: false`, `include: ["src/**/*.ts", "src/**/*.tsx"]`, `exclude: ["dist"]`.
- [ ] No `types` / `typeRoots` workaround — it existed only because the old source imported `quartz/components/types` and dragged `crypto` in. Confirm the plugin typechecks with root defaults only.
- [ ] Confirm `@quartz-community/types` resolves under `moduleResolution: "bundler"` from the plugin directory without any path alias.

### 04 - Throwaway Render Scaffold
- [ ] `src/index.tsx`: `export const Remark42: QuartzComponentConstructor<Remark42Options | undefined>`, importing `QuartzComponent` and `QuartzComponentConstructor` as **types** from `@quartz-community/types` (never a value import — the package must not appear in emitted output).
- [ ] Read `host`, `siteId`, `threadBaseUrl` from options and `comment-id` from frontmatter. Render `null` when `frontmatter.comments === false` or when the id is not a non-empty string. No validation, normalisation or duplicate-ID policy in this step — step 03 owns options and step 04 owns identity; a deliberately minimal version keeps the scaffold honest.
- [ ] Reproduce the current DOM contract byte-for-byte: `<section class="remark42-comments" aria-label="Comments">`, `<h2>Comments</h2>`, `div#remark42` carrying `data-comment-id`, `data-remark42-host`, `data-remark42-site-id`, `data-remark42-url`, `data-remark42-title`, and `<p role="status">Loading comments…</p>`.
- [ ] Thread URL for now is `${threadBaseUrl}/${id}`; D4 freezes that shape, and step 04 is where the final identity rules land.
- [ ] Keep the existing single-line `Component.css` rule for the section so the deployed stylesheet does not shift. New styling is step 08.

### 05 - Browser Resource Pipeline Placeholder
- [ ] `src/browser.ts`: a deliberately trivial, side-effect-free bootstrap. Its only job is to prove the resource travels through the loader as a string; it must not try to load Remark42. The real runtime is step 06.
- [ ] `src/browser-script.d.ts`: declare the `remark42:browser` virtual module with a string default export.
- [ ] `Component.afterDOMLoaded = browserScript`.
- [ ] Confirm the placeholder runs site-wide without throwing on pages that have no container (it is emitted on every page).

### 06 - esbuild Build Script
- [ ] `build.mjs`, pass 1: bundle `src/browser.ts` with `platform: "browser"`, `format: "iife"`, `minify: true`, `write: false`, producing the script text.
- [ ] `build.mjs`, pass 2: bundle `src/index.tsx` as a single entry with `platform: "node"`, `format: "esm"`, `packages: "external"`, `jsx: "automatic"`, `jsxImportSource: "preact"`, and an esbuild plugin that resolves `remark42:browser` to pass 1's text as a string module.
- [ ] Keep only the `index` entry: the old `identity` and `runtime` entries and their subpath exports are gone.
- [ ] Accept an output-directory override (env var or argv) so task 08 can build into a temp directory without touching the working tree.
- [ ] Assert the emitted `dist/index.js` contains the browser script as a string literal and no `node:` imports.

### 07 - Package Surface And Committed Output
- [ ] `exports`: `"."` and `"./components"` both point to `"./dist/index.js"`; add `"./package.json"`. The loader accepts both the string and the `{ import }` form, so the simplest one wins.
- [ ] Delete `custom-plugins/remark42/.gitignore` (or at least its `/dist/` rule) so the output can be tracked; the root `.gitignore` has no matching rule.
- [ ] Build once and `git add` `custom-plugins/remark42/dist/`.
- [ ] Update the stale comment in `.prettierignore`: `custom-plugins/remark42/dist/` is first-party generated output now, not captured third-party code. It stays ignored so generated bytes are never reformatted.

### 08 - `verify:dist` Freshness Gate
- [ ] `scripts/verify-dist.mjs`, dependency-free, doing four things in order:
  - build into `os.tmpdir()` via task 06's output override;
  - diff the result against `custom-plugins/remark42/dist/` file-by-file and report **changed**, **missing** and **extra** files, exiting non-zero on any;
  - assert every file under `dist/` is git-tracked (`git ls-files`), which is what catches a build that stops emitting a file;
  - resolve `preact/jsx-runtime` with `createRequire` from the root `package.json` and from the plugin entry and fail if the realpaths differ.
- [ ] Run it twice in a row and confirm byte-identical output, so the gate cannot fail for nondeterministic reasons.
- [ ] Expose it as the plugin script `verify:dist`; root `plugin:fresh` wraps it.
- [ ] Confirm the failure message names the offending files and the one command that fixes them.

### 09 - Import Guards
- [ ] `scripts/check-imports.mjs`: walk `src/**`, extract every import/export-from specifier, and fail on (a) any specifier pointing at `quartz/` or escaping `src/`, and (b) any Node builtin, both `node:*` and bare names (`fs`, `path`, `url`, `crypto`, `os`, `process`, `child_process`).
- [ ] Scope it to `src/` only — `build.mjs`, `scripts/` and tests legitimately use Node builtins.
- [ ] Plugin script `check` = `node scripts/check-imports.mjs && tsc --project tsconfig.json`, so guards and types share one entry point.

### 10 - Root Script Surface
- [ ] Delete `prebuild`. Its `npx quartz plugin install` is a no-op against `quartz.lock.json` (`{"plugins":{}}`) and the CLI build installs enabled local plugins itself; the other half was the plugin compilation this step removes.
- [ ] Delete `build:local-plugins`; add `build:plugins` = `npm run build --workspaces --if-present`.
- [ ] Add `plugin:fresh` = `npm run --workspace quartz-local-remark42 run verify:dist`.
- [ ] Add `check:types` = `tsc --noEmit && npm run --workspace quartz-local-remark42 run check`, and `check:format` = `npx prettier . --check`.
- [ ] `check` = `check:types && check:format && plugin:fresh` — so a plugin type error, a formatting miss and a stale `dist/` all fail the same command that gates the repo.
- [ ] `build` = `npm run plugin:fresh && npx quartz build` (decision 11a).
- [ ] Confirm bare `npx quartz build` still works with no npm hook involved; it is the documented invocation and must never require a plugin compile.

### 11 - CI Alignment
- [ ] `.github/workflows/ci.yaml`: delete the now-duplicated "Check Remark42 types" step.
- [ ] Replace the comment that claims the npm prebuild hook compiles local plugins, and order the remaining steps so `check` and `test` fail before the slower `build`.
- [ ] Confirm CI's `npm run build` is now the clean-checkout proof: `npm ci` installs, `dist/` comes from the commit, nothing compiles the plugin.

### 12 - Clean-Checkout Verification
- [ ] From a tree with `node_modules`, `.quartz/` and `public/` removed: `npm ci` → `npm run build`. It must succeed without compiling the plugin.
- [ ] Inspect generated HTML for a note carrying `comment-id`: the scaffold markup must match the DOM contract exactly, and the emitted hashed script must be referenced.
- [ ] Repeat with bare `npx quartz build` and `npx quartz build --serve` on the same tree; both must resolve the component through `.quartz/plugins/remark42`.
- [ ] Record which hashed JS file the bootstrap landed in, and whether `--serve`'s minified emission changes it (production writes component scripts verbatim).
- [ ] Judge by the HTML, not the exit status: `componentLoader` swallows import failures behind `Plugin "remark42" declares components but failed to load them`, so a green build is not evidence that the component rendered.

### 13 - Deployment Verification
- [ ] Deploy through the normal flow — push to `main`, Workers Builds, no previews.
- [ ] From the build log record: the actual dashboard build command, the Node and npm versions in effect, whether `NODE_ENV` is production, and the deployed revision.
- [ ] Fetch the deployed page and confirm the container markup is present and the bootstrap is served, with no plugin compilation in the log.
- [ ] Note honestly that the widget itself does nothing until step 06; this check is packaging and rendering only.
- [ ] Carry the recorded requirements into step 07's documentation.

### 14 - Atomic Commit
- [ ] Land everything as one commit: the new package, the copied `fixtures/`, committed `dist/`, the workspace and lockfile changes, the root scripts, the CI edit, the `.prettierignore` comment, and the `remark42-old/test/` deletion.
- [ ] Verify that commit alone is sufficient for a clean checkout: `npm ci && npm run check && npm test && npm run build`. The phase's `main` is knowingly broken for the widget until step 06; packaging must not be the reason.

## Completion Flow
### Run #1
- Resolve Discussion items: they are locked above; if implementation contradicts one, fix the implementation or record the deviation explicitly.
- Confirm frontmatter `status`, `state: condensed`, and `reviewedAtStep`.
- STOP.
### Run #2
- Condense to token-efficient form: collapse each task into what was actually built, drop the temp-dir/reproducibility reasoning that now lives in code comments, and keep the verified deployment facts (build command, Node/npm versions, `NODE_ENV`).
