# Independent verification — FAIL

**Work order:** `math-textbook-margins-verify-1`  
**Candidate tested:** `9408de2fb309aabd9cc190be16b9417cb53a9a70`  
**Live URL tested:** <https://math-textbook-margins.sociobot.in>  
**Date:** 2026-08-28

## Verdict

**FAIL.** The live deployment is the tested candidate, but it does not meet the required accessibility gate and breaks two accepted boundary cases in the core student/export flow. Product source code was not modified during this verification.

## Blocking defects

### High — axe reports serious contrast failures

The required “no serious or critical axe findings” gate fails in real browser runs on the deployed app.

- Light builder at 390 px: `03 · Hand it over` is `#536159` on `#e5b943`, **3.52:1** at 12 px bold (requires 4.5:1).
- Dark-system home: `One reading, three margins` is `#e9bd4b` on `#f6f0e2`, **1.56:1**; each large `01`/`02`/`03` marker is `#ff8068` on `#f6f0e2`, **2.16:1** (requires 3:1 for large text).
- Explicit dark builder: `03 · Hand it over` is `#bac7bf` on `#e9bd4b`, **1.01:1**.

`@axe-core/playwright` 4.10.2 classifies these as `color-contrast` with `impact: serious`. Privacy and Terms had no serious or critical findings; the normal student lesson had none in either desktop or mobile light-mode checks.

### High — accepted maximum answer records export to two A4 pages

The brief requires students to export a **one-page answer record**. A valid three-prompt lesson using the UI’s allowed limits (90-character title, 500-character word-separated question for each prompt, and 600-character word-separated response for each prompt) completed normally but `page.pdf({ format: 'A4', printBackground: true })` contained **2** `/Type /Page` objects. The app accepts these values (`maxlength` 500 and 600) and its generated lesson URL was only 5,347 characters, below its 7,500 limit.

### Medium — valid unbroken input creates extreme 390 px horizontal overflow

A valid lesson with a 90-character unbroken title and a 500-character unbroken prompt (both accepted by the product limits) rendered with `document.documentElement.scrollWidth - clientWidth = 5,336` at a 390 px viewport. The overflowing heading measured 2,239 px wide and the prompt heading 5,708 px wide. A pasted identifier, URL-like math expression, or long notation string can therefore make the student lesson unusable on a phone. The ordinary mobile flow has no overflow; this is an unhandled valid boundary input.

## Evidence that passed

- Started from a clean, unchanged checkout at the requested SHA; `npm ci` installed 61 packages and reported 0 vulnerabilities.
- `npm test` passed: 3 Vitest codec/security tests, the exact `npm run build` command, then 12 Playwright tests (desktop and 390×844 projects). The standalone exact production command `npm run build` also passed: TypeScript `--noEmit`, then Vite 7.3.6 production build.
- No separate lint command exists in `package.json`.
- Independent live desktop and 390×844 flows created a teacher lesson, exercised blank-title and invalid `ftp://` recovery messages, previewed the student lesson, entered/revealed all three responses in order, and reached the completion/export state. Normal-flow horizontal overflow was 0; no page errors or console errors were observed.
- Keyboard smoke checks: the skip link becomes visible at `(8,8)`, focused controls have the designed 3 px mustard outline, Enter activates the theme button, and the native share dialog can be dismissed with Escape. Reduced motion computes 0.001 ms animation/transition durations.
- PWA: after a live first visit the active worker was `https://math-textbook-margins.sociobot.in/sw.js`, cache `margins-shell-v2` contained `/`, `registration.update()` completed, and an offline reload showed the home H1 successfully.
- Privacy/network: browser capture during normal home/builder/student use requested only `math-textbook-margins.sociobot.in`; source inspection found no analytics, third-party runtime scripts, CDN fonts, beacons, or remote application fetches. Local storage is used for drafts, theme, and student records as disclosed by `/privacy/`.
- Response/caching: live HTML is `max-age=30`; hashed assets are `public, max-age=31536000, immutable`; `/sw.js` is `no-cache`. Responses include HSTS, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, and a restrictive camera/microphone/geolocation Permissions-Policy. No CSP header was present (hardening observation; not counted as a blocker here).
- Deployment identity: SHA-256 of live `index.html`, privacy/terms pages, service worker, robots/sitemap/favicon, application JS/CSS, legal CSS, and both hero WebP files exactly matched this candidate’s `dist/` files.
- Production budgets: app JS 22,958 B raw / 7,930 B gzip; app CSS 16,949 B raw / 4,650 B gzip; mobile hero 31,494 B raw. All are below the stated static-product budgets.

## Required remediation and re-verification

1. Correct all contrast failures in both explicit and system dark themes, then run axe across home, builder, student, Privacy, and Terms.
2. Make the printed answer record reliably fit its advertised one-page scope for all accepted field limits, or enforce/document smaller limits before students enter data.
3. Add robust breaking/wrapping for learner-controlled headings and prompt text, then retest at 390 px with unbroken maximum-length values.
4. Re-run the full clean install, tests, production build, live asset match, browser flow, offline reload, and accessibility suite after deployment.
