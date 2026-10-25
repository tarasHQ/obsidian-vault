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
