# Email register templates

Three Outlook-safe HTML emails plus a standalone **US / UK register translation** case study page.

- Case study page (portfolio): [us / uk — a register translation](../register-translation.html) · live: https://jadexzhao.github.io/jadexzhao/register-translation.html
- Companion copy in this folder: `register-translation.html`

## Outlook email samples

| File | Register | Site that matches |
|---|---|---|
| `business-casual.html` | Default for recruiters / hiring managers | [briefcase](https://jadexzhao.github.io/jadexzhao/) |
| `professional.html` | Formal UK hedging / first contact | [IU Pages](https://jlzhao.pages.iu.edu/) |
| `iu-gear.html` | Brand / community identity first | [matchaxmoxie](https://matchaxmoxie.github.io/matchaxmoxie/) |

## UK-facing portfolio note

This portfolio uses UK spelling and letter conventions where it matters (colour, favourite, organise, centre; day/month/year dates; Kind regards; Yours sincerely when named / Yours faithfully when unnamed). Business casual stays slightly more indirect with light small talk before the ask. Professional leans on understatement. **IU gear has no UK equivalent** for US campus spirit-wear — it stays in the set as a cultural-translation case: the format does not map onto UK conventions, and knowing that is part of the skill.

## Visual tokens (from the email HTML)

| Register | Page / card | Type | Accent |
|---|---|---|---|
| Business casual | Outer `#f4f1ea`, white card, ~8px radius | Arial / Helvetica | Blue `#378ADD` (JZ chip) |
| Professional | White, border `#dddddd` | Georgia / Times New Roman | Navy `#0c447c` (“Correspondence”) |
| IU gear | Outer `#f5efef`, white card | Bold Arial | Crimson `#990000` |

## Outlook constraints

- Tables + **inline** CSS only (Word engine in Outlook).
- Solid `background-color` — no gradient shorthand as the only style.
- Web-safe fonts; custom webfonts are optional extras.
- ~600px nested table width.
- Prefer HTML entities for middot / ndash / CJK when encoding is flaky.
