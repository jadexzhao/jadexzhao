# Jade Zhao

**Live site:** [jadexzhao.github.io/jadexzhao](https://jadexzhao.github.io/jadexzhao/)

Informatics student at Indiana University (Luddy). I build software you can open, inspect, and hand off: Python search, accessible web work, and static sites that have to survive real use.

This repository is the hire-facing door. It answers what I have built and what I can contribute.

Classroom notes live on [matchaxmoxie](https://matchaxmoxie.github.io/matchaxmoxie/). Photographs and days live on [zhao-langxi](https://zhao-langxi.github.io/zhao-langxi/). LinkedIn: [zhao-langxi](https://www.linkedin.com/in/zhao-langxi/).

## Open this first

```bash
cd bm25-notes-search
python3 search.py fixtures "tokenize index rank markdown" --top 3
python3 -m unittest discover -s tests -v
```

Stdlib only. No API keys. Case study: [bm25.html](https://jadexzhao.github.io/jadexzhao/bm25.html).

## What this site is

HTML, CSS, and a little JavaScript in [`briefcase/`](briefcase/). GitHub Pages publishes that folder as the site root. Featured work on the homepage is one implemented programme, one research summary, and one live restaurant site:

| Work | Kind | Evidence |
| --- | --- | --- |
| [BM25 notes search](bm25-notes-search/) | Implemented Python | `bm25.py`, `search.py`, unit tests |
| [Digital Humans](https://jadexzhao.github.io/jadexzhao/digital-humans.html) | Student research lead | Public summary only. No launch claim. |
| [Potstickers](https://github.com/jadexzhao/pstickers24) | Family restaurant site | Separate repo. Clover for orders. |

Accessibility cases, including Town of Nashville, live in the [work archive](https://jadexzhao.github.io/jadexzhao/projects/). Employer-facing introduction: [ABOUT.md](ABOUT.md). How the site is built: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). What is shipped vs practice: [docs/PROJECTS.md](docs/PROJECTS.md).

## Run the portfolio locally

```bash
cd briefcase
python3 -m http.server 8765
# http://127.0.0.1:8765/
```

`duck-farm/` is a Vite demo at `/jadexzhao/duck-farm/`. See that folder's README to run it.

## Local quality checks

Dev-only. Lives in [`tools/portfolio-qa/`](tools/portfolio-qa/). Playwright, axe-core, html-validate, and Lighthouse commands are documented there.

Do not point those tools at `briefcase/nashville-acc.html` or `briefcase/portfolio-shell.css` when fixing. Those files are frozen.

## Licence

This repository is public. It does not have a root licence file, so do not call the portfolio open source. Vendor licences stay with those files.

## Résumé

[resume.pdf](https://jadexzhao.github.io/jadexzhao/resume.pdf) · `jlzhao@iu.edu`
