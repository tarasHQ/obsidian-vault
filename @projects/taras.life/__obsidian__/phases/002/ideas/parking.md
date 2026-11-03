---
ctime: 2026-10-31 23:16
isIntegrated: false
---

[← Plan](../_plan.md)

## Phase 002 parking

- **[From step-02 code review] Explicit `Features.Nesting` in Lightning CSS transforms** — DECLINED by user (implicit lowering verified against fresh build). If a Lightning CSS upgrade ever changes default lowering behavior for `include: Features.MediaQueries`, built output may silently ship raw nesting to old targets. Cheap revisit: add `Features.Nesting` to the three `transform()` calls in `componentResources.ts`.
- **[From step-02 code review] `quartz/static/fonts/README.md` describes the dead SCSS pipeline** — references `.scss` sources that die in this phase. Fix during step 06 docs sweep (READMEs written once there).
- **[From step-02 code review] Cross-file heading-weight coupling** — `base.css` `font-weight: revert` + unlayered `custom.css` heading pin (600) are load-bearing as a pair; both carry comments now, but the styles README (step 06) should explain the mechanism once.

