---
status: waiting
state: full
---

[← PLAN](../_plan_002.md)

## Description
%%What this step is about, in 2-4 sentences%%
Removes Quartz scaffolding machinery: the 4 CLI template yamls and the entire `create` CLI path ([C13] lean: full removal — repo is the site, not a distribution). **Scope expanded mid-step (user decision):** all remaining git/upstream CLI machinery dies too — `upgrade`/`update`, `sync`, `restore` commands with their handlers, orphaned helpers and constants — leaving the CLI with `build` (+ `plugin *`, `tui`). Tier-3 items (deprecated plugin aliases, external plugin-install subsystem) were considered and **explicitly dropped by the user — do not resurrect, do not park**.

## High-Level

### List of related files or folders
%%which are useful for context%%
- `quartz/cli/templates/` — 4 template yamls. Code references gone; physical deletion (`git rm -r`) pending user shell (first pass).
- `quartz/cli/handlers.js` — `handleCreate()` (~250 lines) deleted in first pass. Next: `handleUpgrade()`, `handleSync()`, `handleRestore()`, and `resolveContentPath()` (whose only consumers are the dying handlers) + import sweep after each cut.
- `quartz/bootstrap-cli.mjs` — yargs registration home (NOT `args.js`): `create` registration removed in first pass; next: `upgrade`/`update`, `sync`, `restore` registrations + handler imports.
- `quartz/cli/args.js` — `CreateArgv` deleted (first pass); `SyncArgv` orphans once `sync` dies → delete.
- `quartz/cli/plugin-data.js` — first pass removed create-flow exports + dead exports; **no further cuts** — lockfile/source/manifest family stays load-bearing for `plugin-git-handlers.js` regardless of the Tier-3 drop.
- `quartz/cli/helpers.js` — first pass removed `escapePath`, `exitIfCancel`, async `symlinkOrCopy`; **`symlinkOrCopySync` KEPT** (load-bearing: local plugin linking in `plugin-git-handlers.js` — user raised the concern, grep confirmed 4 call sites). Next: `stashContentFolder`, `popContentFolder`, `gitPull` die with sync/upgrade/restore → file reduces to `symlinkOrCopySync` alone.
- `quartz/cli/constants.js` — after tiers: `UPSTREAM_NAME`, `QUARTZ_SOURCE_REPO`, `QUARTZ_SOURCE_BRANCH`, `ORIGIN_NAME`, `contentCacheFolder` die; `version`, `fp`, `cacheFile`, `cwd` stay (build consumes).
- `quartz/cli/helpers.test.js` — async `symlinkOrCopy` suite removed; `symlinkOrCopySync` suite kept intact.
- `quartz/cli/plugin-git-handlers.js` — untouched except verifying it keeps what it needs (`symlinkOrCopySync`, lockfile family, `handlePluginRestore`/`handlePluginCheck` definitions stay — they are also the hidden deprecated alias targets).

### Intended outcome
- **First pass (code done, gate pending):** templates + `create` path gone end-to-end; no orphaned helpers/exports left behind.
- **Tiers:** CLI surface = `build` + `plugin *` + `tui` only; zero upstream-sync or git-content-stash machinery; every orphaned helper, constant, and argv group swept in the same pass.

### Local invariants
%%(if any)%%
- **Full-rogue scope justification** (unchanged), expanded per in-session user decision: all three git commands confirmed unused by the user ("all 3 green") — removing user-facing CLI commands is acceptable because this repo is a vendored fork with zero upstream-merge intent and no script/CI/hook invocations (verified by grep for `create`; same check repeated for `upgrade`/`update` — zero hits).
- **`restore` dies by dependency, never alone**: it restores `content/` from the cache that only `sync`/`upgrade` create; if those die, `restore` restores from nothing. All three go together.
- **`symlinkOrCopySync` stays** — external-plugin local linking depends on it; do not sweep it with the sync machinery even though it lives in the same file.
- **No theme-related deletions here** — templates died as whole files; no re-doing step 03/04 surgery.

### Should NOT be done in this step
- No READMEs/AGENTS.md updates (step 06 — decisions recorded there per [C5]/[C8]).
- **Tier-3 dropped by user decision**: deprecated `plugin restore/update/check/resolve` aliases, the external plugin-install subsystem (lockfile, `.quartz/plugins/`, git-sourced plugin machinery), and `plugin-data.js` lockfile functions stay. No parking entry — deliberately dropped, not deferred.
- No dependency removal beyond what the sweep proves orphaned (e.g. check `@clack/prompts` still has consumers — `plugin-git-handlers.js` likely — before noting anything; dep decisions belong to a deliberate audit, note-only).

---

## Tasks
- [x] 05.1 — Scope verification (first pass): yargs registration located in `bootstrap-cli.mjs` (`create` → `handleCreate`, unique); `plugin-data.js` exports classified (create-flow: `createConfigFromTemplate`, `updateGlobalConfig`; load-bearing: `readPluginsJson`/`writePluginsJson`/`extractPluginName`/`LOCKFILE_PATH` + lockfile family via `plugin-git-handlers.js`); no `quartz.config.default.yaml`/`quartz.plugins.default.json` exist on disk (fallback paths dormant, shared with build loader — kept); zero `quartz create` invocations in scripts/CI/hooks/package.json. Deviations surfaced & approved by user: full `CreateArgv` deletion; `escapePath`/`exitIfCancel`/async `symlinkOrCopy` deletion with `symlinkOrCopySync` kept; dead exports (`configExists`, `updateGlobalConfig`, `PLUGINS_JSON_PATH`, `DEFAULT_PLUGINS_JSON_PATH`) removed.
- [x] 05.2 — `TEMPLATES_DIR` + template plumbing removed from `plugin-data.js`; physical `git rm -r quartz/cli/templates` pending user shell (sole remaining first-pass artifact).
- [x] 05.3 — `handleCreate()` + `create` registration removed; import sweep done in `handlers.js` (`intro`/`select`/`text`/`outro`, `rm`, `CreateArgv`, `escapePath`, `symlinkOrCopy`, `exitIfCancel`, `handlePluginResolve`, create-only `plugin-data` imports; only `LOCKFILE_PATH` remains from it).
- [x] 05.4 — `plugin-data.js`: `createConfigFromTemplate`, `createConfigFromDefault` (+ private `readDefaultPluginsJson`/`resolveDefaultConfigPath`), `updateGlobalConfig`, `configExists`, `PLUGINS_JSON_PATH`/`DEFAULT_PLUGINS_JSON_PATH` removed; load-bearing surface untouched; no dangling imports.
- [x] 05.5 — Orphaned default-config files: none exist; fallback paths kept (build-loader parity), recorded.
- [x] 05.6 (partial) — Residue grep clean for all first-pass identifiers (`handleCreate`, `CreateArgv`, `createConfigFrom*`, `updateGlobalConfig`, `configExists`, `TEMPLATES_DIR`, `escapePath`, `exitIfCancel`, `symlinkOrCopy` exact-word, `"create"` command string). **Gate `npm run check && npm run build` PENDING user shell.**
- [ ] 05.7 — Tier 1: remove `upgrade`/`update` command registration + `handleUpgrade()` + its exclusive imports in `handlers.js` (`LOCKFILE_PATH` import, `handlePluginRestore`/`handlePluginCheck` imports — the functions themselves stay in `plugin-git-handlers.js`); delete constants `UPSTREAM_NAME`, `QUARTZ_SOURCE_REPO` from `constants.js`.
- [ ] 05.8 — Tier 2: remove `sync` + `restore` registrations, `handleSync()`, `handleRestore()`, `resolveContentPath()`, and `SyncArgv` from `args.js`.
- [ ] 05.9 — Tier 2 sweep: delete `stashContentFolder`, `popContentFolder`, `gitPull` from `helpers.js`; delete `QUARTZ_SOURCE_BRANCH`, `ORIGIN_NAME`, `contentCacheFolder` from `constants.js`; verify `@clack/prompts` consumers before noting any dep finding; residue grep.
- [ ] 05.10 — Gate: `npm run check && npm run build` green (covers first pass + tiers); final grep: no `handleUpgrade|handleSync|handleRestore|resolveContentPath|UPSTREAM_NAME|QUARTZ_SOURCE|ORIGIN_NAME|contentCacheFolder|stashContentFolder|popContentFolder|gitPull|SyncArgv` outside allowed sites; CLI help shows `build`/`plugin`/`tui` only.
