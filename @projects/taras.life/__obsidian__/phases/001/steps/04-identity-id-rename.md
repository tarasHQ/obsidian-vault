---
status: waiting
state: high-level
reviewedAtStep: ""
---

[← PLAN](../_plan_001.md)

## Description
Renames the note-level `comment-id` frontmatter key to `id`, and makes every identity error loud instead of silent. The rename must be invisible to Remark42: the thread URL is built from the *value*, so the same note keeps the same thread and every existing comment stays where it is.

## High-Level

### Intended outcome
- `id` is the single key to a thread; the same note produces the same URL before and after the rename.
- Bad ids — non-string, empty, whitespace-only, `.`/`..` — stop the build and name the offending note.
- Duplicate ids stop the build too, because two notes sharing a thread is silent data mixing.
- `comments: false` remains the explicit opt-out; a note with neither key renders no container at all.
- The existing test note, any real note, and the vault-side note are all migrated to `id`.

### Local invariants
- Thread URL format is frozen: `${threadBaseUrl}/${encodeURIComponent(id)}`.
- There is never a fallback to the page URL — that would orphan comments on the next rename.
- The plugin treats `id` as content-owned data: it trims and encodes, never rewrites.
- Only content pages participate; other page types stay excluded by layout.

### Should NOT be done in this step
- Redirects from `/comments/<id>` to real note pages.
- Any change to the URL scheme.
- Counters or last-comments.
- Anything about how the widget loads.

## Discussion & Reflections

1. **Failure policy for a bad id.**
   - (a) Render nothing, silently — today's behaviour; a note quietly never gets comments.
   - (b) Console warning — visible in build logs, easy to scroll past.
   - (c) Fail the build naming the note.
   - **Recommend (c)**, consistent with D3.
   - User input: a - those ids would never be done by hand. it'll be 8+ characters uuid-like string done programmatically. 

1. **Character policy for `id`.**
   - (a) Any non-empty string — maximum freedom, can produce unreadable URLs.
   - (b) Slug-like `[a-z0-9-]+` — predictable, typeable URLs, rejects some legitimate note names.
   - (c) Any string, warn on non-slug.
   - **Recommend (b)** for new ids, with a recorded note for the existing one.
   - user input - b is fine. like j12v09ffa20. But I don't get about typeable URLs. I thought that those are only for internal remark42 references, and notes real urls would be different, no?
      - another point is about length. like full uuid may be too distracting to stay as frontmatter property, so maybe we need 10 chars, or 8chars? or something else timestamp-based so chance of duplication is low?

1. **The vault side of the rename.** Content is synced from Obsidian, so a repo-only rename can be overwritten by the next sync.
   - (a) Treat the repo as SSOT and hope the sync doesn't clobber it — risky.
   - (b) The user renames the key in the vault note as part of this step; the repo follows.
   - (c) Support both keys for a transition period — safe, but leaves permanent dual-key code.
   - **Recommend (b).**
   - User input - ignore this. There's no notes with id besides current test one. So nothing to rename yet. And when vault will start to sync - then I'll rename it. 

1. **Where duplicate detection runs.**
   - (a) Once per published-metadata array, as today.
   - (b) On every render — simple but wasteful.
   - (c) Once at build start over all parsed files.
   - **Recommend (a)**, now failing instead of warning.
   - chances is so low though. But chance to copy a note and forget to update ID - is really high. I think that the main thing here - is to just think on how to attach comments to notes. Properly. like is id the best way? Maybe there's something automatic that doesn't require user attention? or obsidian templates. 

_Reflection:_ (optional — compact notes from the user)

### Locked decisions (at implementation)
1. **Charset locked**: validation enforces `^[a-z0-9-]+$`; no length rule in code. The user figures out id generation on the Obsidian side to fit the constraint; the recommended shape (e.g. a 10-char random base36 string) goes into the step-07 plugin README, not the validator.
2. **`comments: false` exempts the page entirely**: the id is inert — no validation and no duplicate detection. Absent id → render nothing. Neither is ever an error.
3. **Aggregated single throw**: one scan collects every violation (invalid ids + duplicate groups) and throws one error naming every offending note.
4. **Mechanism correction to discussion item 4**: per-render scan replaces the old cache-by-`allFiles`-identity scan. The `checkedFiles` cache is module-level mutable state — forbidden under the concurrent build-time rendering rule (DEV_RULES) — and its purpose (avoid repeated *warnings*) is void once the scan *throws*: the first throw ends the build. Semantics preserved: effectively once per published set.
5. **"Typeable URLs" concern dismissed**: `/comments/<id>` is an internal Remark42 storage key, never a visited page (no redirects, D6); note URLs are ordinary slugs. Charset validation exists for URL-segment safety (dot segments) and vault grep-ability, not readability.

---

## Implementation [WRITTEN AT THE STEP |04|]

### 01 - Creating thread-identity module
- [x] New `custom-plugins/remark42/src/thread-identity.ts` — fresh code, nothing transcribed from remark42-old (D8); DEV_RULES anatomy: file-header JSDoc, `type` shapes only, explicit return types on exports, no `any`, `as` only after a runtime check (`asRecord`).
- [x] `checkThreadId(value: unknown): ThreadIdCheck` — non-throwing classification: `absent` / `valid` (trimmed) / `invalid` with a human-readable problem; invalid when non-string, empty/whitespace-only, `.`/`..`, or outside `^[a-z0-9-]+$`.
- [x] `buildThreadUrl(id, threadBaseUrl)` → `${threadBaseUrl}/${encodeURIComponent(id)}` — frozen format (D4), no other transformation.
- [x] `scanThreadIdIssues(pages)` over the published set: skips `comments: false` and absent ids; collects every invalid id with its page name; groups valid ids and reports duplicate groups; deterministic (sorted) result — failure text must not depend on render order.
- [x] `formatThreadIdIssues(issues)` — one aggregated `[Remark42]` error text: page name(s) + problem per line.
- [x] Structural `CommentablePage` type with `unknown` fields — host-provided `allFiles` is untrusted boundary data, narrowed by runtime checks, not casts.

### 02 - Wiring component to `id` with fail-loud scan
- [x] `src/index.tsx`: frozen thread base hoisted to local const `THREAD_BASE_URL` next to the other config literals (D2′ SSOT comment updated); `url` built via `buildThreadUrl`.
- [x] Component reads `frontmatter["id"]`; per-render `scanThreadIdIssues(allFiles ?? [])` before any render — one aggregated throw on any issue (component render errors reach `trace()` → exit 1, proven at step 03).
- [x] Absent id → `null`; valid id → container. Own-page invalid is unreachable (the scan includes this page) — defensive `null` return with a comment.
- [x] Header/component JSDoc updated: identity rules are implemented here, not "step 04".
- [x] No `build.mjs` changes: the relative import is inlined by the esbuild bundle; existing post-build assertions still hold.

### 03 - Migrating the test note
- [x] `content/remark42-shell-test.md`: `comment-id: "remark42-shell-test"` → `id: "remark42-shell-test"` (same value; nothing else in the repo carries the old key — vault side deferred to first real sync).

### 04 - Rebuilding plugin and running the gates
- [ ] `npm run build:plugins` (regenerates committed `dist/`) → `npm run check` (includes `plugin:fresh`) → `npm test` → `npx quartz build`.
- [ ] If `dist/` changed, commit it with the step (D1 workflow).

### 05 - Verifying the rename is invisible to Remark42
- [ ] Inspect built `remark42-shell-test.html`: `remark_config.url` byte-identical (`https://taras.life/comments/remark42-shell-test`), DOM contract unchanged, exactly one container.
- [ ] `index.html` / `404.html` render no container.

### 06 - Verifying fail-loud paths empirically
- [ ] Temporary notes: empty id, whitespace-only id, `.`, `..`, non-slug (`abc_def`), non-string id (unquoted number), a duplicate pair → build exits non-zero and the single aggregated error names every offending note.
- [ ] `comments: false` + invalid id → build passes, no container.
- [ ] Remove temp notes → build green again.

### 07 - Completion flow
- [ ] Run #1 / Run #2 per the Completion Flow section; record caught deviations; alignment check for the step 05–07 handoffs.

## Completion Flow
### Run #1
- Decisions: confirm nothing further needs extracting into the plan or a module README (plugin README is step 07's deliverable); remove the Discussion decision residue.
- Frontmatter: `status: implemented`, `reviewedAtStep: "04"`.
- USER CHECKPOINT. Stop the loop and report to the user, before proceeding to Run #2.
### Run #2
- Condense the step into a step-03-style record: what was built, verification evidence, caught deviations, handoffs to steps 05–07; `state: condensed`.
