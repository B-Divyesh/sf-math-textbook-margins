# Verification handoff — Math Textbook Margins

## Independent verification 2 verdict: FAIL

Candidate `6a1817186b7d7ceba270b85f07ade6775ec2fd9f` was independently tested from a
clean checkout on 2026-08-28 against
<https://math-textbook-margins.sociobot.in>. The deployment matches all 12 checked
runtime files byte-for-byte, and install, tests, production build, representative
teacher/student flows, one-page maximum export, privacy/network checks, offline
reload, and performance budgets pass.

Release remains blocked by fresh evidence:

- **High:** the completed lesson has serious axe contrast failures in light and
  dark themes (`Margin complete` 3.52:1 light / 1.01:1 dark; dark
  `Clear my answers` 1.56:1).
- **Medium:** multiple 390 px controls/links are smaller than the required 44 by
  44 CSS px (theme button 36.3 px wide, move buttons about 38.5 px wide, and
  back/footer/legal links 16–26.3 px high).
- **Medium:** a parseable malformed local draft blanks the builder with
  `Cannot read properties of null (reading 'id')` and offers no recovery.
- **Low:** the over-limit lesson-link error can advise shortening excerpt/reveal
  notes when an oversized source URL is responsible.
- **Low hardening:** CSP/frame-embedding protection is absent; other required
  response and caching policies are present.

Full commands, measurements, passing evidence, hashes, and remediation are in
[`.factory/verification-2.md`](./verification-2.md). Product source was not
modified during verification.

## Prior repair handoff

## Release-blocker repairs

This repair addresses every finding in independent verification report `a849a26dde235fbe0394025eb6f8c44444d5d122` against candidate `9408de2fb309aabd9cc190be16b9417cb53a9a70`.

- **Contrast:** dark home now keeps the risograph reading band on `night` instead of a light paper token, preserving contrast for the mustard eyebrow and coral folios in both system and explicit dark themes. The mustard builder handoff uses dark ink for its small eyebrow in every theme.
- **One-page record:** printable lesson fields are now product-limited, not just styled: title 80 characters; each of up to three prompts and learner responses 240. The builder and student labels explain the reason before entry, shared-link decode validation enforces title/prompt caps, and maximum accepted content was PDF-verified as exactly one A4 page.
- **390 px overflow:** learner-controlled title, prompt, directions, source title/excerpt, and print response content use robust break opportunities so unbroken identifiers and notation wrap instead of widening the page.
- **Update safety:** the shell cache is versioned as `margins-shell-v3`, so existing installations receive the repaired hashed assets during service-worker update.

The researched brief, static Vite/TypeScript artifact class, local-first storage, URL lesson format, gated progression, and existing source/privacy behavior are unchanged. `.factory/design.md` now records the dark-band contrast treatment and print-boundary rationale.

## Regression coverage

`tests/app.spec.ts` adds exact browser regressions for:

- serious/critical axe findings on system-dark home and system/explicit dark plus light builder;
- word-separated title, three prompts, and three responses at every accepted print boundary, asserting one `/Type /Page` A4 PDF;
- 80-character unbroken title and 240-character unbroken prompt at the 390 × 844 project, asserting no horizontal overflow;
- keyboard skip-link focus and Enter activation of the theme control;
- `margins-shell-v3` cache creation, update check, and offline shell reload.

`src/codec.test.ts` verifies shared lesson links reject values beyond the printable title and prompt limits.

## Verification before deployment

Run from the repository root:

```sh
npm ci
npm test
npm run build
```

Evidence from 2026-08-28:

- Clean `npm ci`: 61 packages installed; 0 vulnerabilities.
- `npm test`: 4 Vitest codec/security tests and 20 Playwright tests passed in 39.7 s. The browser suite runs both Desktop Chrome and the 390 × 844 mobile project, including teacher/student gating, validation recovery, print PDF, dark/light axe, keyboard, legal pages, service-worker update, and offline reload.
- `npm run build`: TypeScript `--noEmit` and Vite 7.3.6 passed; `dist/index.html` is at the required root.
- Axe coverage in Playwright found zero serious or critical violations for home, builder (system-dark, explicit dark, and light), normal student lesson, Privacy, and Terms.
- Local Lighthouse 12.8.2 mobile simulation against the production build: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **1.0 s**, LCP **1.5 s**, TBT **0 ms**, CLS **0**.
- Built static budgets: application JS 23,400 B raw / 8,050 B gzip; application CSS 17,944 B raw / 4,790 B gzip; mobile hero 31,494 B. All meet the static-product budgets.
- `git diff --check` passed. There is no separate lint script; TypeScript checking is part of `npm run build`.

## Deployment and post-deploy verification

Deploy with the factory static work order:

```sh
/opt/fleet/lib/deploy-static.sh math-textbook-margins dist
```

Deployed 2026-08-28 with `/opt/fleet/lib/deploy-static.sh math-textbook-margins dist` (Azure deployment ID `bf195c10-b762-4035-a6b5-e70ece65ed0f`) to <https://math-textbook-margins.sociobot.in>.

- Factory `verify-url.sh` returned HTTPS 200. Desktop page load was 697 ms with no console/page errors; it found a title, `lang="en"`, one H1, a main landmark, zero images missing `alt`, and zero unlabeled buttons.
- A live Playwright check at 1366 × 900 and 390 × 844 found 0 px home overflow, no console/page errors, only the first-party origin in browser requests, and zero serious/critical axe findings on home, system-dark home, and system-dark builder in both viewports.
- The live service worker created `margins-shell-v3`; `registration.update()` completed and an offline reload at 390 px showed “Put the thinking before the answer.”
- SHA-256 matched local `dist/` for index, Privacy, Terms, service worker, robots, sitemap, favicon, both application CSS files, application JS, and both generated hero WebP assets.
- Live response policy: HTML uses `public, must-revalidate, max-age=30`; hashed assets use `public, max-age=31536000, immutable`; `/sw.js` uses `no-cache`. HTTPS responses include HSTS with subdomains/preload, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, and a restrictive camera/microphone/geolocation Permissions-Policy. A CSP header remains a non-blocking hardening opportunity noted by the independent verifier.

## Known limits

- The compact record intentionally caps printable text to keep a completed three-pause lesson on one A4 page. Teachers can link to richer source material and use concise prompts; the app does not upload or host it.
- Progress stays local to each browser/device. There is no account, roster, cloud sync, LMS integration, analytics, third-party runtime script, or remote application API.
- Offline availability begins after one successful online visit installs the shell. Teacher-selected external source links require their own network connection.
