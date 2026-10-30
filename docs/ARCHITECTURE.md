# jadexzhao · how the portfolio is built

Source of truth for the live site. Older planning notes under `briefcase/PORTFOLIO-*.md` are local-only and superseded.

**Door job:** Hire-facing proof of software, accessibility work, and human-centred AI research.  
**Not:** Coursework hub (matchaxmoxie) · personal journal (zhao-langxi).

## Live surfaces

| URL | Source |
| --- | --- |
| https://jadexzhao.github.io/jadexzhao/ | `briefcase/` copied to Pages root |
| `/projects/` | `briefcase/projects/index.html` |
| `/duck-farm/` | Vite build of `duck-farm/dist/` |
| `/resume.pdf` | `briefcase/resume.pdf` |

GitHub Pages source is **GitHub Actions**, not a branch folder. Workflow: [`.github/workflows/pages.yml`](../.github/workflows/pages.yml).

Deploy triggers on push to `main` when `briefcase/**`, `duck-farm/**`, or the workflow file change.

## Site map (implemented)

| Page | File | Role |
| --- | --- | --- |
| Home | `briefcase/index.html` | Selected work: BM25, Digital Humans, Potstickers |
| Work | `briefcase/projects/index.html` | Editorial archive. Data also in `projects.json` |
| Garden | `briefcase/field-notes.html` | Maintained notes |
| Experience | `briefcase/experience.html` | Clinic and employment first, then campus roles |
| About | `briefcase/about.html` | Employer-facing biography |
| Case pages | `bm25.html`, `digital-humans.html`, `potstickers.html`, `nashville-acc.html`, `accessibility.html`, … | Evidence pages |
| Photography | `briefcase/photography.html` | Original pictures used on this door |

Nav on every garden page: Home · Work · Garden · Experience · About · Résumé.

## Stack

- Static HTML / CSS / JS. No application server.
- Shared look: `portfolio-shell.css` (frozen) + `garden-shell.css` (editable)
- Optional enhancement: `vendor/work-enhance.js` and PhotoSwipe on pages that need a lightbox
- Project metadata: `briefcase/projects/projects.json` (hire slice). Private master inventory is local-only: `briefcase/PROJECT-INVENTORY.md` (gitignored)

UK English in public copy. Ranges use "to". No em dash in Jade-facing text.

## Frozen files

Do not restyle or auto-format these when fixing the rest of the garden:

| File | SHA-256 lock |
| --- | --- |
| `briefcase/nashville-acc.html` | `1d74de977d8e967dec9bbc36648b4ce4284cc4a7574c356dd575a20c32bbb3ec` |
| `briefcase/portfolio-shell.css` | `6d6d01e354a01b5526fb57ad4a56a21b8ffad8a71175655cdde14f7b76a8d5ff` |

Nashville stays process and scope. Client findings stay with the partner.

## Local preview

```bash
cd briefcase
python3 -m http.server 8765
```

Duck farm (separate Vite app):

```bash
cd duck-farm
npm install
npm run dev
```

Production `base` for duck-farm is `/jadexzhao/duck-farm/`. The Actions job fails the build if that path is missing from `dist/index.html`.

## Quality checks (dev only)

See [`tools/portfolio-qa/README.md`](../tools/portfolio-qa/README.md).

| Check | Command (from the documented folder) | Status |
| --- | --- | --- |
| BM25 unit tests | `python3 -m unittest discover -s tests -v` in `bm25-notes-search/` | Implemented |
| Playwright nav / a11y | `npm test` in `tools/portfolio-qa/` | Implemented |
| html-validate | listed HTML files, local config | Implemented |
| Lighthouse | local lab baseline only | Implemented; not a ship certificate |
| lychee | `README.md` in CI (`fail: false`) | Advisory |

Do not treat a skipped tool as a pass.

## What is not in this architecture

- No root licence (do not call the repo open source)
- No backend on Pages
- No IU Pages (retired)
- No clinical / Institutional Review Board material
- Practice folders at repo root are not the live site (see [PROJECTS.md](PROJECTS.md))
