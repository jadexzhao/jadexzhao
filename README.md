# jadexzhao

**Live site:** [jadexzhao.github.io/jadexzhao](https://jadexzhao.github.io/jadexzhao/)

Jade Zhao · Informatics @ Indiana University (Luddy). The public site is a hire-facing portfolio: software she can show, accessibility and clinic work, and Digital Humans research at a high level.

Classroom notes live on [matchaxmoxie](https://matchaxmoxie.github.io/matchaxmoxie/). Campus writing lives on [zhao-langxi](https://zhao-langxi.github.io/zhao-langxi/). LinkedIn: [zhao-langxi](https://www.linkedin.com/in/zhao-langxi/).

## Run the site locally

```bash
cd briefcase
python3 -m http.server 8765
# http://127.0.0.1:8765/
```

GitHub Pages publishes `briefcase/` as the site root, plus `duck-farm/` at `/jadexzhao/duck-farm/`.

## What is in this repository

| Path                          | What it is                                        |
| ----------------------------- | ------------------------------------------------- |
| `briefcase/`                  | Live HTML/CSS/JS portfolio                        |
| `briefcase/bm25.html`         | Case study for the Python search                  |
| `bm25-notes-search/`          | Implemented BM25 ranker (stdlib only)             |
| `duck-farm/`                  | Personal Vite demo                                |
| `online-ordering-system/`     | Practice scaffold. Not the Potstickers order path |
| `full-stack-web-features/`    | Practice scaffold                                 |
| `adaptive-learning-platform/` | Unverified starter. Not a deployed ML product     |
| `data-validation-pipeline/`   | Archived concept. No pipeline source              |

A physical `archive/` folder has been planned and not moved yet. Read each project README before treating a folder as shipped software.

This repository is public. It does not yet have a root licence file, so do not call the portfolio “open source.” Vendor licences stay with those files.

## Implemented code to open first

```bash
cd bm25-notes-search
python3 search.py . "tokenize index rank markdown" --top 3
```

## Local quality checks

Dev-only. Lives in `tools/portfolio-qa/`. See that README for Playwright, axe-core, html-validate, and Lighthouse commands. Do not point those tools at `briefcase/nashville-acc.html` or `briefcase/portfolio-shell.css` when fixing.

## Résumé

[resume.pdf](https://jadexzhao.github.io/jadexzhao/resume.pdf)
