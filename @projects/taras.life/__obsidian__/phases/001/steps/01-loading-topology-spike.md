---
status: waiting
#state: high-level
reviewedAtStep: ""
---

[← PLAN](../_plan_001.md)

## Description
Proves — before anything is rewritten — that the plugin can be loaded with no compilation step on every path that builds the site: `npm run build`, a bare `npx quartz build`, `npx quartz build --serve`, and a Cloudflare Workers build. Its job is to turn D1 from a documented bet into an observed fact, or to trigger D1's fallback while nothing else depends on the outcome.

## High-Level

### Intended outcome
- Evidence on the four things D1 assumes: Workers Builds' Node strips types; the loader resolves a `.ts` entry through the `.quartz/plugins/remark42` link; the component actually registers; the site renders with no manual step.
- A recorded network baseline for an opted-in page (our bootstrap → `embed.mjs` → iframe document → `remark.mjs`), with sizes, so later steps can tell a regression from a change.
- A verdict on whether the captured fixture still matches what production serves.
- Either "proceed with D1" or "activate D1 fallback", written into the plan's Decisions.

### Local invariants
- The step ends with the repository in a state that builds. Anything experimental is on a throwaway branch or fully reverted.
- No `quartz/` source edits here. The fallback is *chosen* in this step, not implemented.
- No spike code survives into step 02.

### Should NOT be done in this step
- Rewriting identity, options, render or runtime.
- Touching the plugin README or deleting old artifacts.
- Any styling work.

## Discussion & Reflections

1. **How to exercise "no build step".**
   - (a) Temporarily repoint the existing plugin's entry to a `.ts` file — fastest, but mixes real logic into an experiment.
   - (b) Add a throwaway `custom-plugins/spike` with a trivial `.ts` component and one YAML entry — isolated, and it takes the exact loader path any future local plugin takes; deletion is one line.
   - (c) Copy the plugin into a scratch directory and register that — isolated but duplicates content.
   - **Recommend (b).**

2. **Where to verify Workers behaviour.**
   - (a) Push a branch and use a non-production/preview build — safe, slower.
   - (b) Push to `main` and watch the production build — fast, but a broken plugin layout is briefly user-visible.
   - (c) Trust local Node only — meaningless for the risk being tested.
   - **Recommend (a).** If preview builds aren't available, read the Node version from a normal build log and decide before pushing.

3. **How much evidence counts as a baseline.**
   - (a) One manual DevTools capture, recorded here — free, subjective.
   - (b) A scripted capture committed as a fixture — repeatable, adds tooling nobody asked for.
   - (c) Reuse the existing fixture only — no real measurement.
   - **Recommend (a)**, plus a `curl` comparison for the fixture (item 4).

4. **Fixture drift.**
   - (a) Trust the capture — cheap, may misdescribe production.
   - (b) Diff served vs captured and re-capture on any difference — one command, keeps the runtime tests honest.
   - (c) Delete the fixture and test against the live site — tests then depend on the network.
   - **Recommend (b).**

_Reflection:_ (optional — compact notes from the user)
