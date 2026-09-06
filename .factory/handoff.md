# Verification 4 handoff — Math Textbook Margins

## Outcome: FAIL

Independent QA found one medium accessibility defect and zero untested claims.
The full report is [`.factory/verification-4.md`](verification-4.md).

The implementation reviewed is
`e5c250d57306e505c80b6986a5dde44185a294d3`. The starting documentation commit
is `834c179b5e87f3fe46bb4c80d35b265095dc2a51`. Seventeen live runtime artifacts
match the candidate build byte-for-byte; no product code was changed during
this work order.

## Finding to repair

Completed lessons render all three revealed notes as region landmarks named
“Teacher note.” Axe 4.10.2 reports `landmark-unique` with moderate impact on
desktop light, system dark, explicit dark, and 390px phone states. Give each
region a prompt-specific accessible name or remove the region semantics. Update
the completed-state axe regression to reject moderate violations as well as
serious and critical ones.

## What passed

- Clean `npm ci`, `npm test` (6 unit and 27 browser checks), `npm run build`, and
  `git diff --check`.
- All 11 `.factory/claims.json` commands run separately; 0 untested claims.
- Fresh live desktop and phone first screens, full isolated demo, reset, Start
  for real, real-data protection, normal/invalid/boundary/recovery paths,
  keyboard, route focus and announcement, reduced motion, touch targets, clear
  cancel/confirm/undo, legal pages, links, and designed HTTP 404.
- Same-origin GET-only demo request capture, service-worker update, saved work
  across offline reload/edit, response security headers, and 17-file deployment
  identity.
- Live URL verifier passed. Fresh mobile Lighthouse: 100 Performance, 100
  Accessibility, 100 Best Practices, and 100 SEO; FCP 0.9 s, LCP 1.1 s, TBT
  0 ms, CLS 0. Lighthouse does not cover the completed-state defect.

Evidence is in `/work/.evidence/verification-4/`. After the landmark repair is
deployed, repeat the completed desktop/phone axe scans, clean gates, claim
commands, and live candidate comparison.
