# Independent verification 3 — PASS

**Work order:** `math-textbook-margins-verify-3`

**Candidate:** `4fe50f61b332a06facd00bd71246d76e8fbf9950`

**Live URL:** <https://math-textbook-margins.sociobot.in>
**Date:** 2026-08-28

## Verdict

**PASS.** The live static site is byte-for-byte the candidate production build
for all 12 shipped runtime artifacts checked. It fulfils the brief's useful
teacher-to-student flow: a teacher can build a legal-material wrapper, students
must answer before each of the three notes is revealed, progress survives in the
browser, and the completed record can be printed/saved. No release defects were
found.

## Defects by severity

None found.

## Clean-checkout gates

- Started at the requested SHA on clean `main`; Node `v22.23.2`, npm `10.9.8`.
- `npm ci`: PASS — 61 packages installed, 0 vulnerabilities.
- Vitest: PASS — 6/6 codec and response-policy tests.
- Type check and exact production build: PASS — `npm run build` ran
  `tsc --noEmit` and Vite 7.3.6; `dist/index.html` was produced.
- Playwright 1.58.2, serial rerun: PASS — 27 passed, 1 intentional
  mobile-only skip, 0 unexpected (81.9 s). This suite covers desktop and
  390×844 flows, completed-state axe scans in light/dark/system-dark, builder
  recovery, URL limits, one-page A4 export, mobile overflow/targets, keyboard,
  and offline shell reload.
- A preceding parallel Playwright invocation had 26 passed / 1 skipped before
  Chromium headless-shell itself exited with `SIGSEGV` while creating the
  desktop keyboard-test context. It emitted no product assertion failure; the
  exact serial rerun above passed every runnable test. This is recorded as a
  container-browser instability, not a product defect.
- No lint script is provided. TypeScript checking is the repository's static
  analysis gate. `git diff --check` passed before documentation changes.

## Independent functional evidence

- On live desktop, created a representative lesson with title, source label,
  HTTPS owned-material link, permitted excerpt, directions, and three prompts.
  The share dialog presented a fragment-only student URL; Escape closed it and
  restored focus to its invoking control. The student route reopened with the
  source as an outbound link rather than copied textbook content.
- Blank title and an `ftp://` link were rejected with an announced error and
  focus on the relevant field. A malformed `#/lesson/` URL showed the recovery
  page. Parseable corrupt local draft `{version:1,prompts:[null]}` was removed
  and replaced with the usable three-prompt starter without page errors.
- Student gating kept Reveal disabled for an empty response; three written
  answers revealed three notes in order and reached `Margin complete`.
  The state labels/symbols remain distinct (`To do`, `Answered`, `Revealed`,
  `Locked`) rather than relying on colour.
- Independently exercised a 1366×900 light lesson and a 390×844 dark lesson:
  zero horizontal overflow, zero console/page errors, and zero serious/critical
  axe 4.10.2 findings on both home and completed lesson states.
- Keyboard-only smoke reached the skip link and completed all three reveals
  with Space. The focused export button computed to a `3px solid` focus outline
  plus contrasting shadow. Reduced-motion behaviour is supplied by the shipped
  media query; the app contains no looping motion.
- The repository tests additionally verified accepted 80-character titles and
  240-character prompt/answer limits print as one A4 page, unbroken mobile
  input does not overflow, all cited 390px touch targets are at least 44px,
  clear/undo works, and progress is retained after reload.

## Privacy, PWA, deployment, and security

- Live request capture during home/student completion saw only
  `https://math-textbook-margins.sociobot.in`; no analytics, tracking, CDN font,
  or third-party runtime request occurred. The lesson is in the fragment and
  therefore was not sent as an HTTP request. Observed local storage used only
  the disclosed `mtm.teacher-draft.v1` / `mtm.theme` keys in the builder flow
  (student records use the disclosed local-first record key).
- Service worker cache `margins-shell-v4` installed, `registration.update()`
  completed, and a 390px offline reload restored the home shell and its H1.
- `/opt/fleet/lib/verify-url.sh` passed live: HTTPS 200 in 808 ms, title,
  `lang=en`, one H1, main landmark, zero missing image alts, zero unlabeled
  buttons, and zero console/page errors.
- HTTP redirects to HTTPS with 301. Live HTML is `public, must-revalidate,
  max-age=30`; hashed assets are `public, max-age=31536000, immutable`; `/sw.js`
  is `no-cache`. Headers include HSTS, `strict-origin-when-cross-origin`,
  `nosniff`, `X-Frame-Options: DENY`, restrictive Permissions-Policy, and a
  self-only CSP with `frame-ancestors 'none'` and `object-src 'none'`.
- SHA-256 matched local `dist/` to live for all 12 runtime files: root, Privacy,
  Terms, service worker, robots, sitemap, favicon, app JS/CSS, legal CSS, and
  both hero WebP assets. App JS hash: `18ac0ba3…999aa3`; app CSS:
  `119bf21c…7270c136`; service worker: `5f74a724…2e04369`.

## Performance and content-contract evidence

- Application JS: 25,164 B raw / 8,562 B gzip (≤200 KB budget). Application
  CSS: 18,337 B raw / 4,862 B gzip (≤50 KB). Mobile hero WebP: 31,494 B
  (≤300 KB). No webfont files ship.
- Live mobile Lighthouse 13.4.1: Performance **100**, Accessibility **100**,
  Best Practices **100**, SEO **100**; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0.
- README, MIT license, Privacy and Terms pages, researched brief,
  product-specific design thesis, asset provenance, generated-art disclosure,
  accessible non-colour state cues, and the no-upload/no-hosting textbook
  boundary are present.

## Verification commands

```sh
npm ci
npm test
npm run build
npx playwright test --workers=1
/opt/fleet/lib/verify-url.sh https://math-textbook-margins.sociobot.in <evidence-dir>
```
