# Add three math pauses before explanations — verification 4

**Work order:** `math-textbook-margins-verify-4`  
**Verdict:** **FAIL**  
**Finding count:** 1  
**Untested claim count:** 0  
**Implementation reviewed:** `e5c250d57306e505c80b6986a5dde44185a294d3`  
**Documentation base:** `834c179b5e87f3fe46bb4c80d35b265095dc2a51`  
**Live URL:** <https://math-textbook-margins.sociobot.in>  
**Date:** 2026-09-06

## Verdict

**FAIL.** The released site matches the implementation candidate and the core
teacher and student flows work. All 11 declared claims pass their individual
commands. One moderate accessibility defect remains in every completed lesson,
so this release does not meet the work order's zero-findings requirement.

No product code was changed during this verification.

## Job, audience, and first action

Before scrolling in fresh 1440×900 desktop and 390×844 phone contexts:

- Job: add three math pauses before explanations.
- Audience: math teachers who want students to write before each explanation.
- First action: **Try it with sample data**, followed by “Open a complete
  algebra lesson.”

The same screen shows the three required facts: free to use, no account or
textbook upload, and answers stay in this browser. The wording is direct and the
sample action is visible without scrolling at both sizes.

## Finding

### Medium — completed lessons have duplicate “Teacher note” landmarks

After all three sample responses are revealed, each note is rendered as a
`section` with the same `aria-label="Teacher note"`. These sections become three
region landmarks with identical accessible names. A screen-reader user browsing
landmarks cannot tell which prompt each note belongs to.

Fresh axe 4.10.2 scans report `landmark-unique` with moderate impact in all four
independent completed states:

- 1440×900 light mode;
- 1440×900 system dark mode;
- 1440×900 explicitly selected dark mode;
- 390×844 light mode.

The current repository helper filters axe results to serious and critical
impact, so the 27-test suite passes while this moderate violation remains. Make
the region names unique to their prompt, or remove the unnecessary region
landmarks, and make the completed-state regression reject every axe violation.

Evidence: `/work/.evidence/verification-4/completed-axe.json`.

## Clean checkout and declared claims

- `npm ci`: PASS — 61 packages installed; 0 reported vulnerabilities.
- `npm test`: PASS — 6 Vitest checks, production build, and 27 serial Chromium
  checks in 48.1 seconds.
- `npm run build`: PASS — TypeScript and Vite completed; `dist/index.html`
  exists.
- `git diff --check`: PASS before report edits.
- Node `v22.23.2`; npm `10.9.8`; Playwright is pinned to `1.58.2`.

Every command in `.factory/claims.json` was run separately from the documented
clean setup and passed with exactly one matching browser test:

| Claim | Result |
| --- | --- |
| `free-use` | PASS |
| `no-account` | PASS |
| `no-textbook-upload` | PASS |
| `answers-local` | PASS |
| `no-server-database` | PASS |
| `answer-before-reveal` | PASS |
| `local-progress-states` | PASS |
| `one-page-record` | PASS |
| `phone-desktop` | PASS |
| `keyboard-reduced-motion` | PASS |
| `offline-return` | PASS |

Landing, learner, legal, and README statements were cross-checked against the
registry. The privacy statements are exercised by the local-answer and
no-server request checks. No claim is missing, false, incomplete, or untested.
The command log is
`/work/.evidence/verification-4/claim-commands.log`.

## Live functional evidence

- The first-screen job, audience, action, supporting explanation, and facts are
  present on desktop and phone with no horizontal overflow.
- The one-click `/demo` contains a realistic three-prompt algebra lesson. Reveal
  is disabled until an answer is written; three responses unlock notes in order
  and reach the completed answer record.
- The banner remains present and says “Demo — sample data, nothing is saved.”
  Demo work uses `demo:mtm.student.sample-equal-steps.v1`.
- A seeded real key, `mtm.student.sample-equal-steps.v1`, remained byte-for-byte
  unchanged through demo completion and reset. Reset removed all `demo:` keys.
  Start for real also removed demo keys and opened `/#/build`.
- The completed sample generated exactly one A4 PDF page.
- Clear cancel preserved the record; confirmed clear removed it; Undo restored
  it.
- A teacher lesson was created and previewed. Blank title and `ftp://` source
  input focused the relevant invalid field. An oversized source link named and
  focused that field. A malformed share link showed its recovery page.
- Parseable corrupt draft data recovered to the usable three-prompt builder.
- Keyboard checks reached the skip link, activated reveal with Space, restored
  dialog focus, and focused/announced route headings on navigation and Back.
  Reduced-motion animation duration was `1e-06s`.
- All visible phone demo links and buttons measured at least 44×44 CSS px.
- Privacy and Terms return 200 with their own titles and H1s. An unknown route
  returns the designed page with HTTP 404. Chromium's corresponding 404 resource
  message is expected evidence, not a product error.
- Crawled HTTP links returned 200, including the external `sociobot.in` link.

## Privacy, offline, deployment, and performance

- A complete demo, clear, and undo flow made only four same-origin GET requests.
  It made no data-changing request and no analytics, tracker, font CDN, or
  third-party runtime request.
- A fresh phone context installed `margins-shell-v5`, completed a worker update,
  and reopened `/demo` offline. An answer survived the offline reload and an edit
  made offline survived a second reload.
- `/opt/fleet/lib/verify-url.sh` passed live in 822 ms: HTTPS 200, descriptive
  title, `lang="en"`, one H1, main landmark, image alt text, labeled buttons,
  and no normal-load errors.
- Seventeen served runtime artifacts matched the local candidate build by
  SHA-256, including all HTML, JS, CSS, images, service worker, robots, and
  sitemap files. The later documentation commit changes only
  `.factory/handoff.md` and does not require a new product image.
- Response headers include HSTS, `nosniff`, referrer policy, anti-framing,
  permissions policy, and a self-only CSP.
- Initial app JS is 26,683 bytes raw / 8.92 kB gzip; CSS is 19,509 bytes raw /
  5.03 kB gzip; the mobile hero is 31,494 bytes. All are within budget.
- Fresh live Lighthouse 13.4.1 mobile scores: Performance 100, Accessibility
  100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0.
  Lighthouse checks the initial route and does not exercise the completed-state
  landmark defect.

This is a static local-first product. Backend tenant isolation, server restart
persistence, health, and 429/`Retry-After` checks do not apply. The brief does
not benefit from an AI step: teachers author the prompts and notes, and the
required learner export is present without a network service.

## Earlier finding disposition

| Earlier finding | Current disposition |
| --- | --- |
| Completed-state and dark-theme contrast | Fixed; no serious or critical axe results in completed light or dark states. |
| Maximum accepted record used two A4 pages | Fixed; accepted boundary and sample records produce one page. |
| Unbroken accepted text overflowed on phone | Fixed; regression passes and live phone overflow is 0. |
| Mobile controls were below 44×44 px | Fixed; regression and live measurements pass. |
| Structurally corrupt local draft blanked the builder | Fixed; live recovery restores three prompts. |
| Oversized-link advice named the wrong fields | Fixed; the source-link boundary message is specific and focuses the field. |
| CSP and anti-framing were absent | Fixed in live response headers. |
| Sample used real student storage | Fixed; separate `demo:` namespace, reset, and real-data isolation pass. |
| Claims registry and per-claim commands were missing | Fixed; all 11 commands pass independently. |
| First screen used slogan and metaphor copy | Fixed with plain job, audience, result, and first action. |
| Unknown routes rendered home | Fixed with a designed HTTP 404. |
| SPA navigation lost focus and announcement | Fixed for forward and Back navigation. |
| Documented `npm test` was unstable | Fixed by the serial browser policy; the clean command passed. |

## Evidence

Evidence is under `/work/.evidence/verification-4/`, including live desktop and
phone screenshots, the completed sample screenshot and PDF, claim-command log,
live artifact hashes, browser results, axe details, privacy/recovery results,
URL verifier output, and Lighthouse JSON.

Required remediation is limited to the completed note landmark names and a
regression that rejects the moderate violation. Re-run the clean gates, all
claim commands, completed desktop/phone axe scans, and live artifact comparison
after deployment.
