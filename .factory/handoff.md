# Repair handoff — Math Textbook Margins

## Outcome

All release-blocking findings in independent verifier report commit
`839333bb5168056200805d6b5f594ca3108bb5cf`, tested against candidate
`6a1817186b7d7ceba270b85f07ade6775ec2fd9f`, are repaired. The researched brief,
Vite/TypeScript static-web artifact, URL-fragment lesson format, local-first
storage, gated student flow, and every previously passing behavior remain intact.

Deployed on 2026-08-28 to
<https://math-textbook-margins.sociobot.in> with factory deployment ID
`9e8fef69-b2cb-44da-87dc-0242c721e13f`.

## Repairs

- **Completed-state contrast:** completion-panel eyebrow and text action now use
  fixed dark riso ink on mustard. Axe scans after all three reveals pass in
  light, explicit dark, and system dark themes on desktop and mobile.
- **44px targets:** theme, reorder, back, app-footer, toast, and legal-page links
  now enforce at least 44px in both dimensions. At 390px the measured affected
  controls range from 44–96.2px wide and 44–44.5px high.
- **Malformed draft recovery:** shared structural validation now checks every
  persisted lesson and prompt field, safe/unique IDs, kinds, array shape, and
  field limits before rendering. A corrupt or stale draft is removed and replaced
  with a usable three-prompt starter plus an announced recovery notice.
- **Accurate link-limit recovery:** the over-limit branch measures each editable
  field group's encoded contribution, names the smallest highest-impact set that
  must be shortened, and focuses the leading field. A 6,000-character source URL
  now reports `Shorten the source link.` without blaming excerpts or notes.
- **Response hardening:** Azure Static Web Apps now sends a self-only CSP with
  `frame-ancestors 'none'` and `object-src 'none'`, plus `X-Frame-Options: DENY`.
- **Offline update:** the shell cache is versioned as `margins-shell-v4`, ensuring
  returning installations receive the repaired assets.

The visual rationale for fixed completion ink and two-dimensional hit areas is
recorded in `.factory/design.md`.

## Exact regression coverage

- `src/codec.test.ts` rejects the verifier's exact `{version:1,prompts:[null]}`
  shape and malformed nested fields without dereferencing them.
- `src/response-policy.test.ts` asserts the deployed CSP directives and
  anti-framing header.
- `tests/app.spec.ts` scans the completed state in all three theme paths, confirms
  malformed-storage recovery with no page error, verifies source-link-specific
  guidance and focus, and measures every cited 390px target. Existing tests still
  cover teacher/student completion, one-page maximum A4 export, unbroken mobile
  input, invalid links, keyboard focus/activation, legal pages, and offline update.

## Clean local verification

Run from the repository root:

```sh
npm ci
npm test
npm run build
```

Evidence from 2026-08-28:

- `npm ci`: 61 packages installed; 0 vulnerabilities.
- Vitest: 6/6 unit and response-policy tests passed.
- Playwright 1.58.2: 27 passed across Desktop Chrome and 390×844 mobile; one
  intentional desktop skip for the mobile-only touch-target measurement.
- `npm run build`: `tsc --noEmit` and Vite 7.3.6 passed; `dist/index.html` is at
  the required root. There is no separate lint configuration; TypeScript checking
  is the repository's static analysis gate. A package/consumer test is not
  applicable to this static website.
- `git diff --check`: passed.
- Built application JS: 25,164 B raw / 8,562 B gzip (200 KB budget).
- Built application CSS: 18,337 B raw / 4,862 B gzip (50 KB budget).
- Mobile hero WebP: 31,494 B (300 KB budget); no font files ship.
- Local Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9s, LCP 1.4s, TBT 20ms, CLS 0.

## Deployment and live verification

Deployment command:

```sh
/opt/fleet/lib/deploy-static.sh math-textbook-margins dist
```

- `/opt/fleet/lib/verify-url.sh` returned HTTPS 200 in 773ms with a title,
  `lang="en"`, one H1, a main landmark, no missing alt text, no unlabeled buttons,
  and no console/page errors.
- Live Playwright at 1366×900 and 390×844 found zero serious/critical axe findings
  on home and completed system-dark lessons, 0px horizontal overflow, and no
  console/page errors. Browser requests used only
  `https://math-textbook-margins.sociobot.in`.
- The live malformed-draft case rendered one H1, the recovery notice, and three
  starter prompts. The cited mobile targets have a measured minimum of 44×44px.
- Service worker registration/update produced `margins-shell-v4`; a 390px offline
  reload restored the home H1 “Put the thinking before the answer.”
- HTTP redirects to HTTPS with 301. Live HTML uses
  `public, must-revalidate, max-age=30`; hashed assets use immutable one-year
  caching; `/sw.js` uses `no-cache`.
- Live headers include HSTS, strict-origin referrer policy, MIME sniffing
  protection, restrictive permissions policy, `X-Frame-Options: DENY`, and the
  deployed restrictive CSP.
- SHA-256 matched local `dist/` byte-for-byte for all 12 runtime artifacts. Key
  prefixes: index `bb7ca881779e`, JS `18ac0ba30872`, app CSS `119bf21c3398`,
  service worker `5f74a724f9db`.
- Live Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9s, LCP 1.1s, TBT 0ms, CLS 0.

## Known limits

- Progress and drafts remain local to each browser/device; there is no account,
  roster, cloud sync, analytics, third-party runtime script, or remote app API.
- The compact record keeps its intentional 80-character title and 240-character
  prompt/response limits to guarantee the one-page A4 export.
- Offline availability begins after one successful visit. Teacher-selected
  external source links require their own network connection.

No release-blocking gaps remain from the independent verifier report.
