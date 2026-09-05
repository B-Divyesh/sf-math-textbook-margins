# Math Textbook Margins

Math Textbook Margins helps math teachers add three answer-before-reveal pauses to a lesson link or permitted excerpt. Students predict, sketch a step, and check an idea before each teacher note opens.

Try the complete algebra sample: <https://math-textbook-margins.sociobot.in/demo>

## Who it is for

Math teachers using a textbook page, public resource, or school-approved PDF link. The product does not host or extract textbook content.

## What it does

- Free to use. No account or textbook upload is needed.
- Creates one shareable lesson link with up to three prompts.
- Keeps answers and progress in the learner’s browser.
- Uses named symbols and borders as well as color for lesson states.
- Prints a one-page answer record within the documented input limits.
- Works on phone and desktop with keyboard controls and reduced motion.
- Caches the shell for a return visit offline.

The sample uses the `demo:` local-storage namespace. Resetting it removes only sample state. Starting for real discards sample state before opening the lesson builder.

## Run locally

Requires Node.js 20 or newer. Playwright 1.58.2 is pinned. Install Chromium once outside the factory image with `npx playwright install chromium`.

```sh
npm ci
npm test
npm run build
```

`npm test` runs unit checks, a production build, and serial desktop and 390px browser checks. Serial browser execution is deliberate because the clean worker can crash Chromium when it creates concurrent contexts. The production output is `dist/`, with `dist/index.html` at its root.

To run locally:

```sh
npm run dev
```

To inspect the production output:

```sh
npm run preview
```

## Verify public claims

Every public claim is listed in [`.factory/claims.json`](.factory/claims.json). From the clean setup above, run its declared `npm test -- --grep @claim:<id>` command. Each command starts from `/demo` and checks an observable outcome.

## Deploy

The factory deploys this static product from `dist/` to its product subdomain. The deploy configuration is [public/staticwebapp.config.json](public/staticwebapp.config.json); it keeps the demo route, legal pages, security headers, and the designed 404 response.

## Privacy and content limits

Lesson prompts are encoded in the share-link fragment. Browsers do not send fragments in HTTP requests, but anyone with the link can read its contents. Do not put student names or confidential material in a lesson. Use only source links and excerpts you may share.

Read the standalone [privacy policy](privacy/index.html) and [terms](terms/index.html).

## Project records

The researched brief is in [`.factory/brief.json`](.factory/brief.json), the visual and asset provenance record is in [`.factory/design.md`](.factory/design.md), and the release handoff is in [`.factory/handoff.md`](.factory/handoff.md).

## License

MIT. See [LICENSE](LICENSE).
