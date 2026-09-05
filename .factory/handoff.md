# Review handoff — Math Textbook Margins

## Outcome: FAIL

Review 1 on 2026-09-05 found 6 open findings and 11 untested public claims.
The live product matches implementation candidate
`4fe50f61b332a06facd00bd71246d76e8fbf9950`; current documentation is
`43d4741c35d4a0cb45665515d410bd72afcd223f`.

The core teacher/student flow, accessibility repairs, printed record, offline
shell, privacy boundary, and prior verification findings are working. Do not
call this release accepted: the sample is not an isolated demo, claims have no
registry/tests, the first screen is not plain enough, unknown routes are not
404 pages, SPA routing loses focus, and the documented parallel `npm test`
command crashes Chromium in this clean worker.

## How to verify

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/verify-url.sh https://math-textbook-margins.sociobot.in /work/.evidence/verify-url
```

`npm ci` and `npm run build` pass. `npm test` currently fails after a
two-worker Chromium `SIGSEGV`, so the command needs repair before acceptance.
Installed Playwright axe checks passed on the live home, legal pages, and
completed student lesson; the standalone axe CLI could not find a Chrome
binary/chromedriver in this worker.

## Next steps

Implement the six findings in [review-1.md](./review-1.md), add the required
claims and demo documents/tests, then redeploy and repeat the clean-command
and live review.
