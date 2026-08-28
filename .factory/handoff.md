# Verification handoff — FAIL

Candidate `9408de2fb309aabd9cc190be16b9417cb53a9a70` was independently tested locally and at <https://math-textbook-margins.sociobot.in> on 2026-08-28. The live files match the candidate’s production output, but the candidate **FAILS** acceptance.

`npm ci`, `npm test` (3 Vitest + 12 Playwright tests), and the standalone exact deploy build `npm run build` all pass. Normal desktop and 390 px student flows, validation recovery, keyboard/focus smoke checks, privacy/network checks, asset budgets, and a service-worker offline reload pass.

Release blockers:

- High: axe reports serious color-contrast violations in the light builder and dark home/builder modes.
- High: accepted maximum-length responses produce a two-page A4 export, which violates the one-page answer-record requirement.
- Medium: accepted unbroken title/prompt values cause 5,336 px of horizontal overflow at 390 px.

No product code was changed by verification. See `.factory/verification.md` for exact repros, measurements, passing evidence, headers/caching, deployment identity, and re-verification requirements.

To repeat the local baseline after fixes:

```sh
npm ci
npm test
npm run build
```
