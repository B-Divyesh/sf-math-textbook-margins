# Math Textbook Margins

Math Textbook Margins is a free, local-first lesson wrapper for math teachers. It places up to three active-recall pauses beside a textbook page, public resource, or school-approved PDF link: students predict, sketch a step, and check a misconception before each teacher note is revealed.

Live product: <https://math-textbook-margins.sociobot.in>

## Who it is for

Teachers who already have legal learning material but want a lightweight alternative to a separate worksheet or LMS quiz. The app does not upload, host, or extract textbook content.

## What v1 does

- Builds a three-pause lesson with a source link or short permitted excerpt.
- Encodes the lesson into a shareable URL; no account or server database is needed.
- Gates every teacher note until the student has written a response.
- Saves student progress locally and distinguishes states with symbols, labels, borders, and color.
- Prints a compact one-page answer record or saves it through the browser’s “Save as PDF” option.
- Works on phone and desktop, supports keyboard use and reduced motion, and caches the application shell for return visits offline.
- Provides standalone [privacy](./privacy/index.html) and [terms](./terms/index.html) pages.

## Develop

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. No environment variables or external services are required at runtime.

## Test and build

Playwright 1.58.2 is pinned. In the factory image its Chromium browser is preinstalled; elsewhere, run `npx playwright install chromium` once.

```sh
npm test
npm run build
```

`npm test` runs codec unit tests, a production TypeScript/Vite build, desktop and 390px browser flows, and axe serious/critical accessibility checks. The exact deploy command is `npm run build`; its output is `dist/`, with `dist/index.html` at the root.

To inspect the production build:

```sh
npm run preview
```

## Privacy and content boundaries

Drafts and answers use browser local storage. Lesson content lives inside the URL fragment, which browsers do not send as part of an HTTP request, but anyone receiving the link can read it. Do not put confidential student information in a lesson. Only link to or quote material you are permitted to share.

## Project notes

The product brief is in [`.factory/brief.json`](./.factory/brief.json), the visual and asset provenance record is in [`.factory/design.md`](./.factory/design.md), and release verification is in [`.factory/handoff.md`](./.factory/handoff.md).

## License

MIT. See [LICENSE](./LICENSE).
