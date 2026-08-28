# Handoff — Math Textbook Margins v1

## What shipped

- A complete teacher composing flow for a title, legal source link/label, optional permitted excerpt, directions, and up to three reorderable prompt/reveal pairs.
- A self-contained lesson link encoded in the URL fragment. Lesson links are validated for schema, size, safe identifiers, and `http(s)` source protocols.
- A gated student flow: each note remains locked until the learner writes a response; only then is the next prompt exposed.
- Local autosave for teacher drafts, student names, answers, reveal state, and theme preference. No account, remote database, analytics, or third-party runtime scripts.
- An A4 print / Save as PDF answer record; the browser suite verifies the normal three-prompt record is one page.
- Explicit empty, malformed-link, offline, completion, validation, and clear-with-undo states.
- Keyboard focus management, 44px targets, strong focus rings, labels/live regions, non-color progress symbols and labels, light/dark treatments, and reduced-motion behavior.
- A versioned service worker that discovers hashed Vite assets during installation and makes the shell available after the first visit.
- Standalone `/privacy/` and `/terms/` pages, MIT license, deployment headers/navigation fallback, robots file, and sitemap.
- Original risograph hero generated with the factory Azure image deployment. Source, prompt sidecars, provenance, and visual system are in `.factory/design.md`; shipped WebP variants are 88 KB and 32 KB.

## Run and verify

```sh
npm install
npm test
npm run build
npm run preview
```

The exact deploy build command is `npm run build`. Output lands in `dist/` with `dist/index.html` at its root.

Verification on 2026-08-28:

- Vitest: 3 codec/security tests passed.
- Playwright: desktop and 390×844 mobile flows cover home semantics, teacher-to-student lesson creation, answer gating, one-page PDF export, responsive overflow, malformed links, legal pages, and an offline reload.
- Axe in Playwright: no serious or critical violations on the home or student lesson views.
- Lighthouse 12.8.2, simulated mobile: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**.
- Lighthouse metrics: LCP **1.4 s**, TBT **0 ms**, CLS **0**. INP is not generated for a synthetic no-interaction navigation; the interaction suite responds synchronously and contains no long tasks.
- Production assets: initial JS **22.96 KB** raw / **7.93 KB** gzip; app CSS **16.95 KB** raw / **4.65 KB** gzip; mobile hero **31.5 KB**. All are below the product budgets.
- Visual review completed at desktop and 390px. Generated art has no readable words, brands, watermarks, people, or copyrighted page content.

## Known limits

- Lesson sharing is URL-based by design. Very long lesson data is rejected at 7,500 characters; v1 deliberately caps lessons at three pauses to preserve a compact one-page record.
- Progress is local to one browser/device and has no roster, cloud sync, or LMS integration.
- The tool links to external materials but never embeds, uploads, OCRs, or verifies them. Teachers remain responsible for permission and mathematical accuracy.
- Offline availability begins after one successful online visit installs the cached shell. External source links still require their own network access.

## Sensible next steps

- Pilot two real lessons and measure how many students submit the prediction before revealing the first note (the UI enforces this path; classroom submission measurement remains a teacher process).
- Add import/export of teacher-authored lesson JSON if educators need durable sharing beyond URL length constraints, while retaining the local-first privacy model.
