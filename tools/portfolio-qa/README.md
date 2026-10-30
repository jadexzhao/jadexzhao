# Portfolio QA (dev only)

Not deployed. GitHub Pages copies `briefcase/` only. Site architecture: [`docs/ARCHITECTURE.md`](../../docs/ARCHITECTURE.md).

## Commands

From this folder, after `npm install` and `npx playwright install chromium`:

```bash
npm test
```

Link check from the repo root (requires `lychee`):

```bash
lychee --offline --no-progress \
  README.md briefcase/*.html briefcase/projects/index.html \
  --exclude-path briefcase/nashville-acc.html
```

`--offline` checks that local hrefs resolve. Add `--exclude 'https://www.linkedin.com/*'` for a live pass.

Format only non-protected files:

```bash
npx prettier --write ../../briefcase/index.html ../../briefcase/about.html \
  ../../briefcase/field-notes.html ../../briefcase/garden-shell.css \
  ../../briefcase/bm25.html ../../briefcase/design-experiments.html \
  ../../briefcase/projects/index.html ../../briefcase/projects/projects.json \
  ../../README.md
```

Never point Prettier at `nashville-acc.html` or `portfolio-shell.css`.

HTML validation (excludes Nashville). From this folder:

```bash
npx html-validate -c .htmlvalidate.json \
  ../../briefcase/index.html \
  ../../briefcase/about.html \
  ../../briefcase/field-notes.html \
  ../../briefcase/bm25.html \
  ../../briefcase/digital-humans.html \
  ../../briefcase/accessibility.html \
  ../../briefcase/design-experiments.html \
  ../../briefcase/matcha-story.html \
  ../../briefcase/experience.html \
  ../../briefcase/projects/index.html
```

The config turns off Prettier-vs-validator fights (`void-style`, lowercase `<!doctype html>`) and Shiki inline colour tokens. It does not mean the live site passed every HTML5 opinion.

Local Lighthouse baseline (needs `briefcase` served, usually `http://127.0.0.1:8765/`). One run, no upload, no GitHub Action:

```bash
npx lighthouse http://127.0.0.1:8765/ \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless --no-sandbox" \
  --output=json \
  --output-path=lighthouse-reports/home.json

npx lhci collect \
  --url=http://127.0.0.1:8765/ \
  --url=http://127.0.0.1:8765/about.html \
  --numberOfRuns=1 \
  --no-lighthouserc
```

Scores from localhost are a lab baseline. They are not GitHub Pages numbers. Do not treat 100 as a ship certificate.

Do not run `lhci autorun` until an assert config is agreed. Do not add a workflow yet.

## What this does not replace

Keyboard, screen-reader, and colour-contrast judgement still need a person. axe-core only flags what it can detect.
