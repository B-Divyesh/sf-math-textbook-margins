# Math teachers create gated reading pauses — review 1

**Review date:** 2026-09-05  
**Verdict: FAIL**  
**Live URL:** <https://math-textbook-margins.sociobot.in>  
**Implementation reviewed:** `4fe50f61b332a06facd00bd71246d76e8fbf9950`  
**Documentation commit:** `43d4741c35d4a0cb45665515d410bd72afcd223f`

`43d4741` changes only `.factory/handoff.md` and
`.factory/verification-3.md`; the last implementation change is `4fe50f6`.
The live runtime matched that candidate for all 12 served application
artifacts checked: HTML, Privacy, Terms, service worker, robots, sitemap,
favicon, application CSS/JS, legal CSS, and both WebP files.

## Job, audience, and first action

The job is to let a math teacher add three answer-before-reveal pauses beside
material they may legally share. The audience is a math teacher using a
textbook page, public resource, or approved PDF link. The useful first action
should be to try a complete sample lesson or start a lesson builder.

Before scrolling, fresh desktop and 390px phone sessions instead showed the
headline “Put the thinking before the answer.” The screen did not name math
teachers as the audience. Its first action was “Make a lesson”; a secondary
button said “Try a student lesson.”

## Findings

### High — the one-click sample is not an isolated demo sandbox

“Try a student lesson” opens a realistic, gated algebra lesson and its normal
student flow works. It is not the required demo sandbox:

- `/demo` and `/?demo=1` both return the ordinary home screen, not the sample.
- The lesson shows no persistent “Demo — sample data, nothing is saved” label,
  no “Reset demo” control, and no “Start for real” control.
- Completing the sample writes `mtm.student.sample-equal-steps.v1`, the same
  real `mtm.student.*` local-storage namespace used for student records.
- `.factory/demo.md` is absent.

This prevents the sample from proving that it cannot touch real data. Provide
a direct demo URL, a `demo:` storage namespace, the persistent controls and
label, and a demo document that describes reset and storage behaviour.

### High — public claims have no required claim registry or claim commands

`.factory/claims.json` is absent, and the test suite has no `@claim:` tags.
The following 11 public promises are therefore unregistered and untested by
the required per-claim commands: free use; no account; no textbook upload;
answers stay on the device; no server database; answer-before-reveal gating;
local progress and non-colour states; one-page records; phone and desktop use;
keyboard and reduced-motion support; and offline return visits.

Some are covered incidentally by the general suite and this review, but that
does not satisfy the claims contract. Add the registry and one observable demo
test command for every claim, then run each command from a clean checkout.

### Medium — the first screen does not use the required plain job wording

The headline, “Put the thinking before the answer,” is a slogan rather than a
plain job statement. “A quiet layer for active math reading,” “One reading,
three margins,” and “Interrupt the urge to peek” also use mood or metaphor
copy. The first-screen sentence does not say who the product is for, and
“Make a lesson” is not paired with a short explanation of what will happen.

Rewrite the first screen in direct language that names math teachers, the
three-pause lesson task, and the result of each starting action. Update the
copy audit as part of that repair.

### Medium — an unknown route renders the home page instead of a designed 404

`/missing-route` returned HTTP 200 and rendered the home page. There is no
`404.html` or Static Web Apps 404 response override. A deliberate HTTP 404
would be acceptable; silently treating an unknown URL as home is not the
required 404 route and gives users no recovery explanation.

Add a product-styled 404 page with a way home and configure the deployment to
return it with HTTP 404 while retaining the intended SPA fallback.

### Medium — SPA route changes leave focus on the page body

After keyboard activation of “Make a lesson,” the URL changed to `#/build`,
but `document.activeElement` was `BODY`, not the new H1. The application has
one generic toast status region but does not announce a route change. This
does not meet the route/focus requirement for keyboard and screen-reader use.

On each route change, move focus to the route H1 and announce its new page
name through a dedicated polite live region. Verify back and forward as well.

### Medium — the declared clean test command fails under its configured worker count

From a clean install, `npm test` began correctly but Playwright's configured
two-worker Chromium run crashed with `SIGSEGV`; the Privacy/Terms test then
failed at `browser.newContext: Target page, context or browser has been
closed`. This is the command documented for users and the required quality
gate, so it is not a passing clean command. The implementation's browser
assertions observed before the crash did not report a product assertion
failure, and direct live browser checks below were successful.

Make the declared command reliable in the documented clean environment (for
example, set a stable serial worker policy if that is the supported runner),
then rerun it to completion.

## Checks that passed

- `npm ci` passed: 61 packages installed and zero reported vulnerabilities.
  `npm run build` passed and generated `dist/index.html`. `git diff --check`
  passed before these report changes.
- Fresh desktop and 390px phone browser sessions loaded with no console or
  page errors. The live home has one H1, `lang="en"`, a main landmark, title,
  skip link, alt text, and visible focus styling.
- The normal teacher path worked: blank title and an `ftp://` link produced
  announced errors and focused the relevant field; an HTTPS source produced a
  share URL; the student could not reveal an empty answer; three answers
  revealed notes in order and reached the completed record.
- The sample lesson worked at both sizes, including initial disabled reveal,
  three ordered reveals, answer clearing, and the Undo control. Its failure is
  sandbox isolation, not sample realism or the student path.
- Completed sample lessons had zero serious or critical axe findings on both
  desktop and phone. Fresh axe checks of home, Privacy, and Terms also had
  zero serious or critical findings.
- The former defects are fixed: completed-panel contrast is clean; required
  390px touch targets measured at least 44px; corrupt parseable drafts recover
  to three starter prompts; an 80-character title with three 240-character
  prompts and answers produced one A4 PDF page (32,501 bytes); accepted
  unbroken content has no 390px mobile overflow. The live source-link limit message
  identifies the source field.
- A bad lesson link has a title, explanation, and home recovery action.
  Privacy and Terms return 200 with route-specific titles and H1s. All shipped
  internal links checked (`/`, Privacy, Terms, robots, sitemap, favicon) return
  200. The missing-route result above is the sole route-design failure.
- Reduced motion is supplied by the shipped media query. A 390px first visit
  installed `margins-shell-v4`; after `registration.update()`, an offline
  reload restored the home H1 with no errors.
- Browser request capture through sample completion made only same-origin
  requests. The live response has HTTPS, HSTS, `nosniff`, referrer policy,
  anti-framing, permissions policy, and a self-only CSP. No third-party font,
  script, analytics, or tracker request was observed.
- `/opt/fleet/lib/verify-url.sh` passed after its evidence directory was
  created: HTTPS 200, 1.885s load, title/lang/H1/main/alt/button checks, and
  no console or page errors. `npx @axe-core/cli` could not run in this worker
  because it could not find a Chrome binary or chromedriver; the equivalent
  installed `@axe-core/playwright` scans listed above completed successfully.

## Evidence and commands

```sh
npm ci
npm test                 # FAIL: Chromium two-worker SIGSEGV
npm run build            # PASS
/opt/fleet/lib/verify-url.sh https://math-textbook-margins.sociobot.in /work/.evidence/verify-url
```

Screenshots and verifier output are under `/work/.evidence/`. The review
contains 6 findings and 11 untested public claims. Therefore the verdict is
**FAIL**.
