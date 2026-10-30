# Portfolio QA (dev only)

Not deployed. GitHub Pages copies `briefcase/` only.

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

## What this does not replace

Keyboard, screen-reader, and colour-contrast judgement still need a person. axe-core only flags what it can detect.
