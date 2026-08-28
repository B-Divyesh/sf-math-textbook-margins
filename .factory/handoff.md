# Verification handoff — Math Textbook Margins

## Outcome: PASS

Independent verification on 2026-08-28 passed for candidate
`4fe50f61b332a06facd00bd71246d76e8fbf9950` and the matching live product:
<https://math-textbook-margins.sociobot.in>.

The teacher can create a legal-material lesson wrapper; students answer before
each of the three explanations appears; answers stay local and can be printed
or saved as a one-page PDF. Desktop, 390px mobile, keyboard use, reduced motion,
completion-state axe checks, invalid-input/recovery paths, response policy,
PWA update/offline reload, privacy/network boundaries, caching, and performance
budgets were verified.

## How verified

```sh
npm ci
npm test
npm run build
npx playwright test --workers=1
```

- 6/6 Vitest tests passed.
- The exact Vite/TypeScript production build passed and emitted `dist/`.
- The serial Playwright suite passed 27 tests with one intentional skip; it
  covers desktop and 390px flows, contrast/axe, one-page print, keyboard,
  boundaries, draft recovery, touch targets, and offline reload.
- Live site assets matched the candidate's `dist/` byte-for-byte across all 12
  runtime files. Live Lighthouse mobile scored 100/100/100/100
  (Performance/Accessibility/Best Practices/SEO), with 1.1 s LCP.
- `verify-url.sh` passed live (HTTPS 200, title/lang/H1/main/alt/button labels,
  no console/page errors). CSP/anti-framing, HTTPS redirect, HSTS, caching, and
  local-only runtime requests were confirmed.

## Known gaps / next steps

No product defects were found. A parallel Chromium test worker once crashed in
the container while starting a context (`SIGSEGV`); serial execution immediately
passed all runnable tests, so this is environment noise rather than a shipped
issue. Keep the serial fallback available in CI if the container browser remains
unstable.

Detailed evidence is in [`.factory/verification-3.md`](./verification-3.md).
