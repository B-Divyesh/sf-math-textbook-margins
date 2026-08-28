# Independent verification 2 — FAIL

**Work order:** `math-textbook-margins-verify-2`  
**Candidate tested:** `6a1817186b7d7ceba270b85f07ade6775ec2fd9f`  
**Live URL tested:** <https://math-textbook-margins.sociobot.in>  
**Date:** 2026-08-28

## Verdict

**FAIL.** The live deployment now matches the candidate and the previous print,
overflow, and builder-contrast defects are repaired. However, the core completed
student state still has serious axe color-contrast failures in both themes. The
mobile UI also misses the contract's 44 by 44 CSS pixel target minimum, and a
malformed local draft can blank the builder. No product source was changed during
this verification.

## Defects by severity

### High — completed lesson has serious axe contrast failures

Fresh `@axe-core/playwright` 4.10.2 scans after revealing all three prompts found
`color-contrast` violations with `impact: serious` at both 1366 by 900 and 390 by
844:

- Light mode: `.finish > div > .eyebrow` (`Margin complete`) is `#536159` on
  `#e5b943`, **3.52:1**, at 12 px bold; 4.5:1 is required.
- Dark mode: the same label is `#bac7bf` on `#e9bd4b`, **1.01:1**.
- Dark mode: `#clear-record` (`Clear my answers`) is `#f6f0e2` on `#e9bd4b`,
  **1.56:1**, at 16 px desktop / 17 px mobile bold.

The repository test scans the student lesson before completion, so its axe checks
do not cover this state. Home, builder, share dialog, normal student, broken-link,
empty-builder, undo-toast, Privacy, and Terms states had no serious or critical
axe findings in the independent scans.

### Medium — mobile interactive targets are smaller than 44 by 44 CSS px

At a 390 by 844 viewport, measured element bounds violate the supplied
accessibility and design contracts:

- Theme button: **36.3 by 44.3 px**.
- Builder move buttons: **38.5–38.6 by 44.3–44.4 px**.
- Builder `← Home`: **69 by 26.3 px**.
- App footer links: Privacy **45.9 by 21.7 px** and Terms **38.1 by 21.7 px**.
- Legal-page links are only **16–19 px** high.

These controls remain keyboard-operable, but the required touch-target minimum is
not met.

### Medium — malformed local draft crashes the builder with no recovery

With `mtm.teacher-draft.v1` set to parseable but structurally invalid JSON
`{"version":1,"prompts":[null]}`, reloading `/#/build` produced an empty `#app`,
zero H1 elements, and the page error `Cannot read properties of null (reading
'id')`. Invalid JSON is recovered, but `loadDraft()` only checks `version` and
whether `prompts` is an array; stale or corrupted structured data has no in-app
recovery path.

### Low — oversized-link recovery advice can identify the wrong fields

A syntactically valid source URL of about 7,020 characters crosses the 7,500
character lesson-link cap. The app correctly blocks creation, but says only
`Shorten the excerpt or reveal notes`, even though the source-link field caused
the error.

### Low — response-policy hardening opportunity

HTTPS, HSTS, referrer policy, MIME sniffing protection, and a restrictive
Permissions-Policy are present. Neither `Content-Security-Policy` (including
`frame-ancestors`) nor `X-Frame-Options` is present. This did not cause the FAIL
verdict but leaves script-injection and clickjacking defense dependent on correct
application escaping.

## Clean checkout and repository gates

- Started from a clean `main` checkout exactly at the requested SHA; the initial
  working tree had no changes and matched `origin/main`.
- Runtime: Node `v22.23.2`, npm `10.9.8`.
- `npm ci`: 61 packages installed, 0 vulnerabilities.
- `npm test`: PASS — 4 Vitest tests, the TypeScript/production build, and all 20
  Playwright tests across desktop and 390 by 844 passed in 55.0 seconds.
- Standalone exact `npm run build`: PASS — `tsc --noEmit` and Vite 7.3.6;
  `dist/index.html` exists at the required root.
- No lint script exists. Type checking is part of `npm run build`.
- `git diff --check`: PASS before documentation changes.

## Functional and boundary evidence

- Created a representative three-pause algebra lesson with source link, permitted
  excerpt, instructions, prompts, and reveal notes. The share dialog held focus,
  Escape closed it and restored focus to `Create student link`, and the generated
  lesson reopened from its URL fragment.
- Blank title was blocked and focused with the browser validation message. An
  `ftp://` source was blocked by the app's alert text and focus moved to the source
  field. A too-long lesson was blocked. A malformed shared lesson showed the
  recovery page.
- Student gating showed only the current pause, kept Reveal disabled for empty or
  whitespace input, and exposed pauses in order. State copy progressed through
  `To do`, `Answered`, `Revealed`, and `Locked`; completion exposed print and clear
  actions. Progress survived reload.
- Clear cancel preserved answers; confirmed clear reset them; Undo restored them.
  The export control invoked browser print.
- Independent maximum accepted case — 80-character title, three 240-character
  prompts, three 240-character word-separated answers, and an 80-character name —
  exported as exactly one A4 PDF page (32,814 bytes). A 390 px unbroken 80-character
  title plus 240-character prompt had 0 px horizontal overflow.
- Lesson strings resembling HTML/script payloads rendered as text rather than DOM.
- Keyboard-only smoke completed the sample: Tab reached skip link, wordmark, theme,
  both primary actions, each response, and each Reveal button; Space revealed all
  three prompts. Focus uses a 3 px designed outline plus contrasting box shadow.
- With reduced motion, sampled transition and animation durations computed to
  `0.000001s`; mobile normal and boundary layouts had no horizontal overflow.
- No console errors or uncaught page errors occurred in normal desktop/mobile
  flows. The only page error above was intentionally induced by malformed storage.

## Privacy, network, PWA, and deployment evidence

- Browser capture through teacher creation and student completion observed only
  `https://math-textbook-margins.sociobot.in`; no analytics, trackers, CDN fonts,
  or third-party runtime requests occurred. The lesson fragment never appeared in
  a network request. Draft, theme, and student record data remained in local
  storage as disclosed by `/privacy/`.
- Live service worker `margins-shell-v3` installed, `registration.update()`
  completed, and a 390 px offline reload restored the home shell and H1.
- `/opt/fleet/lib/verify-url.sh` passed locally and live. Live load was 1,061 ms,
  with title, `lang="en"`, one H1, a main landmark, no missing image alt text, no
  unlabeled buttons, and no console/page errors.
- HTTP redirects to HTTPS with 301. Live HTML uses
  `public, must-revalidate, max-age=30`; hashed JS/CSS uses
  `public, max-age=31536000, immutable`; `/sw.js` uses `no-cache`.
- Responses include HSTS `max-age=10886400; includeSubDomains; preload`,
  `Referrer-Policy: strict-origin-when-cross-origin`,
  `X-Content-Type-Options: nosniff`, and
  `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- SHA-256 matched local `dist/` byte-for-byte for all 12 runtime artifacts checked:
  index, Privacy, Terms, service worker, robots, sitemap, favicon, application JS,
  both CSS bundles, and both hero WebP files. Key hashes:
  `index.html` `10d74e3e…056d`, app JS `bdaac0e4…9e7a`, app CSS
  `ace79991…e56d`, and `sw.js` `cc49dc70…bfc2`.

## Performance and product-contract evidence

- Initial application JS: **23,400 B raw / 8,050 B gzip** (budget 200 KB).
- Initial application CSS: **17,944 B raw / 4,790 B gzip** (budget 50 KB).
- Mobile hero WebP: **31,494 B** (budget 300 KB). No font files ship.
- Lighthouse 12.8.2 mobile, local production build: Performance **99**,
  Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.0 s, LCP
  1.3 s, TBT 120 ms, CLS 0.
- Lighthouse live: **100 / 100 / 100 / 100**; FCP 0.8 s, LCP 1.1 s, TBT 0 ms,
  CLS 0. Lighthouse audits the initial route and therefore does not contradict the
  completed-state axe failure.
- README, MIT LICENSE, Privacy, Terms, researched brief, product-specific design
  thesis, original-art provenance, and generated-imagery disclosure are present.

## Required remediation before PASS

1. Give every completion-panel text/control color at least 4.5:1 contrast in light,
   explicit dark, and system dark themes; add axe coverage after all prompts are
   revealed.
2. Increase all mobile interactive hit areas to at least 44 by 44 CSS px, including
   header, reorder, back, footer, and legal links.
3. Validate persisted teacher drafts structurally before rendering and recover to
   a usable starter/error state when stored data is malformed.
4. Make the over-limit message point to whichever field(s) caused the link to
   exceed the cap, then rerun clean tests and live verification.
