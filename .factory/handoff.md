# Repair handoff — Math Textbook Margins

## Outcome: released

The live product now serves implementation
`e5c250d57306e505c80b6986a5dde44185a294d3` at
<https://math-textbook-margins.sociobot.in>. This handoff is a later
documentation-only record; its documentation SHA is recorded in the final
release report and does not change the deployed runtime.

The job is to let a math teacher put three answer-before-reveal pauses beside
material they may legally share. It is for math teachers using textbook pages,
public resources, or approved PDF links. On the first screen, the first action
is **Try it with sample data**, which opens a complete algebra lesson.

## What changed

- Added a direct `/demo` and `?demo=1` sandbox with a realistic algebra lesson.
  It uses only `demo:` local-storage keys, shows the persistent required banner,
  resets only demo state, and discards demo state when starting for real.
- Added `.factory/demo.md`, `.factory/claims.json`, and outcome-based browser
  checks for all 11 visible product promises. The tests use the demo entry point,
  not implementation-string assertions.
- Rewrote the landing screen in direct language. The job, audience, first action,
  three facts, copy audit, and verb-first catalog description are now explicit.
- Removed the remaining decorative hero label so every visible label carries
  useful product information.
- Added a styled static `404.html`, real Azure Static Web Apps response override,
  route-specific metadata, `/demo` sitemap entry, Open Graph/Twitter metadata,
  an Apple touch image, and a 1200×630 social image derived from the recorded
  original hero art.
- Added a consistent header/footer to legal pages. Hash route changes now focus
  the new H1 and announce the page change to a dedicated polite live region.
- Made the documented browser command stable: one serial Chromium process with
  dedicated 390×844 contexts for phone checks instead of a second mobile browser
  project. This avoids the clean worker's repeatable second-browser SIGSEGV while
  retaining desktop and phone coverage.
- Preserved all earlier repairs: structural draft recovery, field-specific URL
  limit recovery, 44px targets, completed-state contrast, non-colour state cues,
  A4 record limits, overflow wrapping, local progress, security headers, and the
  offline shell.

## Verification

From the documented clean setup, `npm ci` installed 61 packages with zero
reported vulnerabilities. Then:

```sh
npm test       # PASS: 6 unit checks and 27 serial Playwright checks
npm run build  # PASS: dist/index.html exists
git diff --check
```

Every command listed in `.factory/claims.json` was also run individually and
passed: `free-use`, `no-account`, `no-textbook-upload`, `answers-local`,
`no-server-database`, `answer-before-reveal`, `local-progress-states`,
`one-page-record`, `phone-desktop`, `keyboard-reduced-motion`, and
`offline-return`.

The browser suite covers normal, invalid, boundary, recovery, keyboard,
reduced-motion, print, desktop, 390px, completed-lesson axe, demo isolation,
route focus/back navigation, and offline demo reload paths.

Live verification after deployment:

- `/opt/fleet/lib/verify-url.sh` passed at 1,869ms with title, `lang`, one H1,
  main landmark, image alt text, labeled buttons, and no normal-load errors.
- Fresh desktop and 390px phone contexts showed the same plain first screen.
  They confirmed demo progress stored only in `demo:mtm.student.sample-equal-steps.v1`,
  Reset demo removed it, and the seeded normal record was unchanged.
- Fresh final-release axe scans found zero violations on home and demo at both
  desktop and phone sizes. The broader route scan, builder/completed-lesson
  regression checks, and static 404 axe check also pass. Evidence is in
  `/work/.evidence/live-final-css/` and `/work/.evidence/live-final/`.
- The demo reopened offline after its first live visit. Request capture during
  the demo saw only the product origin. The only recorded browser resource error
  was the deliberate `/missing-route` HTTP 404 exercised by the route test.
- `/missing-route` now returns HTTP 404 with a titled, styled recovery page.
  Privacy and Terms have their own titles. Required internal static routes all
  returned HTTP 200.
- Live root, demo, and 404 checks returned the final build assets and expected
  status codes. The deployed app JS is 26,684 B raw / 8,920 B gzip; CSS is
  19,510 B raw / 5,030 B gzip; the mobile hero is 31,494 B.
- Lighthouse 13.4.1 final live mobile: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0. The JSON is
  `/work/.evidence/lighthouse-live-final-css.json`.

The first deploy wrapper rejected duplicate normalized `/demo` and `/demo/`
routes before upload. The redundant rule was removed in
`d1030e3`; the next deploy succeeded. The final deployment was the implementation
SHA listed above.

## Earlier finding disposition

| Earlier finding | Current disposition |
| --- | --- |
| Sample touched real student storage | Fixed with the separate `demo:` namespace and isolation regression. |
| No claim registry or claim commands | Fixed with 11 registered, individually-run outcome checks. |
| Slogan-led first screen | Fixed with plain job, audience, action, facts, and copy audit. |
| Unknown routes rendered home | Fixed with HTTP 404 response override and `404.html`. |
| Hash navigation lost focus | Fixed with H1 focus and polite route announcement; back navigation tested. |
| Documented test command crashed | Fixed by serial one-browser policy with dedicated mobile contexts. |
| Contrast, targets, corrupt draft, link advice, A4/overflow defects | Remain covered by the passing regression suite. |

## Known gaps and next steps

There are no known functional gaps in the researched free core. The brief is
free, so there is no paid offer, billing registration, or billing metadata file.
Teachers remain responsible for sharing only source material they may use, and
learners should not put confidential information in a share link.
