#!/usr/bin/env python3
"""LinkedIn Featured PDFs: software engineering writeup standard (Jade Zhao, Jul 2026).

Proof layer from own Professional dashboard screenshots (Downloads, Jul 12 2026):
  IMG_4703.PNG  account A · Jun 12–Jul 11 · 83.7K views / 1.7K interactions / +814 / 314 shared
  IMG_4704.PNG  account B · Jun 12–Jul 11 · 107.1K views / 7.6K interactions / +343 / 145 shared
Stock reach (stated): 250k / 150k on creative + entrepreneur accounts.
"""

from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

JADE = HexColor("#00a86b")
JADE_DEEP = HexColor("#007a4d")
INK = HexColor("#1a1a1a")
MUTED = HexColor("#555555")
RULE = HexColor("#d8d8d8")
SOFT = HexColor("#f3f9f6")
SOFT_LINE = HexColor("#cfe8db")
PAPER = HexColor("#fafafa")

OUT = Path.home() / "Downloads"
SRC = Path(__file__).resolve().parent

FONT = "Times-Roman"
FONT_BOLD = "Times-Bold"
FONT_ITALIC = "Times-Italic"

for path, name, bold_name in [
    ("/System/Library/Fonts/Supplemental/Times New Roman.ttf", "TNR", "TNR-Bold"),
    ("/Library/Fonts/Times New Roman.ttf", "TNR", "TNR-Bold"),
]:
    p = Path(path)
    if p.exists():
        try:
            pdfmetrics.registerFont(TTFont("TNR", str(p)))
            bold = p.parent / "Times New Roman Bold.ttf"
            if not bold.exists():
                bold = Path("/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf")
            if bold.exists():
                pdfmetrics.registerFont(TTFont("TNR-Bold", str(bold)))
                FONT, FONT_BOLD = "TNR", "TNR-Bold"
            italic = Path("/System/Library/Fonts/Supplemental/Times New Roman Italic.ttf")
            if italic.exists():
                pdfmetrics.registerFont(TTFont("TNR-Italic", str(italic)))
                FONT_ITALIC = "TNR-Italic"
            break
        except Exception:
            pass

# --- math from Jul 12 2026 Professional dashboard screenshots ---
WINDOW = "Jun 12 – Jul 11"
ACCT_A = {
    "label": "account A",
    "views": "83.7K",
    "interactions": "1.7K",
    "new_followers": "814",
    "shared": "314",
}
ACCT_B = {
    "label": "account B",
    "views": "107.1K",
    "interactions": "7.6K",
    "new_followers": "343",
    "shared": "145",
}
STOCK = ("250k", "150k")


def wrap_text(c, text, font, size, max_width):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if c.stringWidth(trial, font, size) <= max_width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_doc_chrome(c, width, height, doc_type, title, subtitle):
    """Top bar + doc type stamp + title. Looks like an internal writeup, not a flyer."""
    c.setFillColor(JADE)
    c.rect(0, height - 0.18 * inch, width, 0.18 * inch, fill=1, stroke=0)

    # left jade spine
    c.rect(0, 0, 0.12 * inch, height, fill=1, stroke=0)

    y = height - 0.48 * inch
    c.setFillColor(JADE)
    c.setFont(FONT_BOLD, 8)
    c.drawString(0.7 * inch, y, doc_type.upper())

    y -= 0.28 * inch
    c.setFillColor(INK)
    c.setFont(FONT_BOLD, 22)
    c.drawString(0.7 * inch, y, title)

    y -= 0.26 * inch
    c.setFillColor(MUTED)
    c.setFont(FONT_ITALIC if FONT_ITALIC else FONT, 10.5)
    c.drawString(0.7 * inch, y, subtitle)

    y -= 0.18 * inch
    c.setStrokeColor(JADE)
    c.setLineWidth(1.4)
    c.line(0.7 * inch, y, width - 0.7 * inch, y)
    return y - 0.28 * inch


def draw_footer(c, width, note="swe writeup template · LinkedIn Featured"):
    c.setStrokeColor(RULE)
    c.setLineWidth(0.5)
    c.line(0.7 * inch, 0.52 * inch, width - 0.7 * inch, 0.52 * inch)
    c.setFillColor(MUTED)
    c.setFont(FONT, 8.5)
    c.drawString(0.7 * inch, 0.32 * inch, f"Jade Zhao  ·  {note}  ·  Jul 2026")
    c.setFillColor(JADE)
    c.setFont(FONT_BOLD, 8.5)
    c.drawRightString(width - 0.7 * inch, 0.32 * inch, "#00a86b")


def draw_section(c, x, y, label):
    c.setFillColor(JADE)
    c.setFont(FONT_BOLD, 8.5)
    c.drawString(x, y, label.upper())
    return y - 0.2 * inch


def draw_para(c, x, y, text, max_w, size=10.5, leading=14.5, color=INK):
    c.setFillColor(color)
    c.setFont(FONT, size)
    for line in wrap_text(c, text, FONT, size, max_w):
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_bullets(c, x, y, items, max_w, size=10.5, leading=14.5):
    for item in items:
        c.setFillColor(JADE)
        c.circle(x + 3, y + 3, 2.0, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont(FONT, size)
        lines = wrap_text(c, item, FONT, size, max_w - 14)
        for i, line in enumerate(lines):
            c.drawString(x + 14, y, line)
            y -= leading
        y -= 2
    return y


def draw_metric_strip(c, x, y, width, cells):
    """Horizontal numbers-first strip. cells = [(value, label), ...]"""
    n = len(cells)
    gap = 8
    cell_w = (width - gap * (n - 1)) / n
    h = 0.72 * inch
    for i, (val, lab) in enumerate(cells):
        cx = x + i * (cell_w + gap)
        c.setFillColor(SOFT)
        c.roundRect(cx, y - h + 0.12 * inch, cell_w, h, 4, fill=1, stroke=0)
        c.setStrokeColor(SOFT_LINE)
        c.setLineWidth(0.8)
        c.roundRect(cx, y - h + 0.12 * inch, cell_w, h, 4, fill=0, stroke=1)
        c.setFillColor(JADE)
        c.setFont(FONT_BOLD, 16)
        c.drawCentredString(cx + cell_w / 2, y - 0.18 * inch, val)
        c.setFillColor(MUTED)
        c.setFont(FONT, 8)
        c.drawCentredString(cx + cell_w / 2, y - 0.4 * inch, lab)
    return y - h - 0.08 * inch


def draw_pma_block(c, x, y, max_w, title, problem, motion, artifact):
    """problem → motion → artifact: the software engineering documentation unit."""
    y = draw_section(c, x, y, title)

    # tinted card
    # measure roughly then draw after? easier: fixed structure with short text
    start_y = y
    # draw content first into temp? just draw inline with left labels

    rows = [
        ("problem", problem),
        ("motion", motion),
        ("artifact", artifact),
    ]
    # soft background estimate
    # we'll draw bg after computing end; for simplicity draw line-by-line without bg card

    for tag, body in rows:
        c.setFillColor(JADE)
        c.setFont(FONT_BOLD, 9)
        c.drawString(x, y, tag)
        tag_w = c.stringWidth(tag, FONT_BOLD, 9)
        c.setFillColor(INK)
        c.setFont(FONT, 10)
        lines = wrap_text(c, body, FONT, 10, max_w - tag_w - 16)
        for i, line in enumerate(lines):
            indent = tag_w + 12 if i == 0 else tag_w + 12
            c.drawString(x + indent, y, line)
            y -= 13.5
        y -= 4

    # left accent tick beside the block
    c.setStrokeColor(JADE)
    c.setLineWidth(2)
    c.line(x - 8, start_y + 4, x - 8, y + 8)
    return y - 6


def draw_insights_table(c, x, y, max_w, rows, caption):
    """Transcribed Professional dashboard math."""
    y = draw_section(c, x, y, "30-day motion · professional dashboard")
    c.setFillColor(MUTED)
    c.setFont(FONT_ITALIC if FONT_ITALIC else FONT, 9)
    c.drawString(x, y, caption)
    y -= 0.2 * inch

    headers = ["account", "views", "interactions", "new followers", "content shared"]
    col_w = [max_w * 0.18, max_w * 0.18, max_w * 0.22, max_w * 0.24, max_w * 0.18]
    row_h = 0.28 * inch

    # header row
    c.setFillColor(JADE)
    c.rect(x, y - row_h + 0.08 * inch, max_w, row_h, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont(FONT_BOLD, 8.5)
    cx = x + 6
    for i, h in enumerate(headers):
        c.drawString(cx, y - 0.1 * inch, h)
        cx += col_w[i]
    y -= row_h

    for ri, row in enumerate(rows):
        bg = SOFT if ri % 2 == 0 else PAPER
        c.setFillColor(bg)
        c.rect(x, y - row_h + 0.08 * inch, max_w, row_h, fill=1, stroke=0)
        c.setStrokeColor(RULE)
        c.setLineWidth(0.4)
        c.line(x, y - row_h + 0.08 * inch, x + max_w, y - row_h + 0.08 * inch)
        vals = [
            row["label"],
            row["views"],
            row["interactions"],
            row["new_followers"],
            row["shared"],
        ]
        cx = x + 6
        for i, v in enumerate(vals):
            c.setFillColor(JADE if i > 0 else INK)
            c.setFont(FONT_BOLD if i > 0 else FONT, 10 if i > 0 else 9.5)
            c.drawString(cx, y - 0.1 * inch, v)
            cx += col_w[i]
        y -= row_h

    # total row
    c.setFillColor(INK)
    c.rect(x, y - row_h + 0.08 * inch, max_w, row_h, fill=1, stroke=0)
    totals = ["both (sum)", "~190.8K", "~9.3K", "1,157", "459"]
    cx = x + 6
    c.setFillColor(white)
    for i, v in enumerate(totals):
        c.setFont(FONT_BOLD, 9.5)
        c.drawString(cx, y - 0.1 * inch, v)
        cx += col_w[i]
    y -= row_h + 0.12 * inch

    c.setFillColor(MUTED)
    c.setFont(FONT, 8.5)
    note = (
        "source: own Professional dashboard screenshots (IMG_4703, IMG_4704), "
        "Jul 12 2026. green arrows on views / interactions / new followers. "
        "transcribed into this table (not a platform pitch)."
    )
    for line in wrap_text(c, note, FONT, 8.5, max_w):
        c.drawString(x, y, line)
        y -= 11
    return y - 6


def pdf_overview():
    path = OUT / "linkedin-featured-jade-zhao-overview.pdf"
    c = canvas.Canvas(str(path), pagesize=letter)
    width, height = letter
    x = 0.7 * inch
    max_w = width - 1.4 * inch

    y = draw_doc_chrome(
        c,
        width,
        height,
        "swe writeup · overview",
        "jade zhao",
        "numbers first  ·  who / where / proof  ·  one-pager",
    )

    # numbers first
    y = draw_section(c, x, y, "stock reach (stated)")
    y = draw_metric_strip(
        c,
        x,
        y,
        max_w,
        [
            (STOCK[0], "account reach"),
            (STOCK[1], "account reach"),
            ("serveit", "engagement tools"),
            ("50+", "uta students"),
        ],
    )
    y -= 0.06 * inch

    y = draw_section(c, x, y, f"30-day motion ({WINDOW})")
    y = draw_metric_strip(
        c,
        x,
        y,
        max_w,
        [
            ("~191K", "views (both)"),
            ("~9.3K", "interactions"),
            ("1,157", "new followers"),
            ("459", "pieces shared"),
        ],
    )
    y -= 0.04 * inch

    y = draw_section(c, x, y, "who")
    y = draw_para(
        c,
        x,
        y,
        "i grew up in my family's chinese restaurant. you learn pretty fast when something "
        "actually works and when it doesn't. that restaurant-kid wiring still shows up... "
        "actor and entrepreneur on the side of the same person who ships product. "
        "informatics @ iu luddy (may 2027), first-gen, hudson & holland, dean's list. "
        "spring 2026 at complutense madrid.",
        max_w,
        size=10,
        leading=13.5,
    )
    y -= 0.1 * inch

    y = draw_section(c, x, y, "lanes (headline)")
    y = draw_bullets(
        c,
        x,
        y,
        [
            "actor & entrepreneur · informatics @ iu luddy",
            "software engineering intern @ early-stage startup (nyc) · serveit · fase map",
            "python, typescript, react, sql, postgresql · open to relocation",
        ],
        max_w,
        size=10,
    )
    y -= 0.08 * inch

    y = draw_section(c, x, y, "where the work lives")
    y = draw_bullets(
        c,
        x,
        y,
        [
            "serveit clinic: website team lead, wcag nonprofit builds staff can maintain",
            "early-stage startup (nyc): demo sandboxes, integration prototypes, python automation, handoff docs",
            "fase map + uta: mentor apprenticeship ops, teaching support for 50+ students",
            "portfolio: jadexzhao.github.io · github @jadexzhao · school ig @zhao.langxi",
        ],
        max_w,
        size=10,
    )
    y -= 0.06 * inch

    c.setFillColor(MUTED)
    c.setFont(FONT, 8.5)
    for line in wrap_text(
        c,
        "proof layer: 250k / 150k stock + Professional dashboard motion transcribed from "
        "IMG_4703 + IMG_4704 (own accounts). full table on the actor & entrepreneur pin.",
        FONT,
        8.5,
        max_w,
    ):
        c.drawString(x, y, line)
        y -= 11

    draw_footer(c, width, "overview · set the standard, not a brochure")
    c.save()
    return path


def pdf_build_ship():
    path = OUT / "linkedin-featured-build-ship.pdf"
    c = canvas.Canvas(str(path), pagesize=letter)
    width, height = letter
    x = 0.7 * inch
    max_w = width - 1.4 * inch

    y = draw_doc_chrome(
        c,
        width,
        height,
        "swe writeup · build & ship",
        "build & ship",
        "problem → motion → artifact  ·  the unit every swe writeup should use",
    )

    # how to read this doc
    y = draw_section(c, x, y, "how to read this")
    y = draw_para(
        c,
        x,
        y,
        "this is the template. for each lane: state the problem in plain language, "
        "show the motion you actually ran, name the artifact someone else can open. "
        "numbers when you have them. no deal-room theater.",
        max_w,
        size=10,
        leading=13.5,
        color=MUTED,
    )
    y -= 0.1 * inch

    y = draw_pma_block(
        c,
        x,
        y,
        max_w,
        "01 · software engineering intern · early-stage startup (nyc)",
        "pilots need working software, not just slides.",
        "jun–jul 2026, hybrid nyc. scoped technical requirements from discovery calls, "
        "demo sandboxes / poc environments / integration prototypes. "
        "python for onboarding automation.",
        "handoff docs when pilots moved to production. company acquired during internship.",
    )

    y = draw_pma_block(
        c,
        x,
        y,
        max_w,
        "02 · serveit clinic · iu luddy",
        "bloomington nonprofits need sites staff can update without calling a developer every time.",
        "website team lead since jan 2024 (part-time). wcag 2.1 builds. engagement tools "
        "for community partners. python/postgresql etl with validation on community partner data.",
        "live nonprofit sites + maintainable handoffs. clinic: serveit.luddy.indiana.edu.",
    )

    y = draw_pma_block(
        c,
        x,
        y,
        max_w,
        "03 · fase map · student life · uta",
        "first-year students and mentors need clearer day-to-day ops than a one-off workshop.",
        "coordinate fase mentor apprenticeship: canvas, mentor training, ops. uta for 50+ students. "
        "study resources when the lecture didn't land. leadership/career programming at iu luddy.",
        "canvas content, mentor training materials, campus programming with student life partners.",
    )

    y = draw_section(c, x, y, "also shipping")
    y = draw_para(
        c,
        x,
        y,
        "family restaurant ordering site still live (clover). portfolio at jadexzhao.github.io. "
        "creative reach proof (250k / 150k + 30-day dashboard math) lives on the actor & entrepreneur pin.",
        max_w,
        size=10,
        leading=13.5,
    )

    draw_footer(c, width, "build & ship · problem → motion → artifact")
    c.save()
    return path


def pdf_actor_entrepreneur():
    path = OUT / "linkedin-featured-actor-entrepreneur.pdf"
    c = canvas.Canvas(str(path), pagesize=letter)
    width, height = letter
    x = 0.7 * inch
    max_w = width - 1.4 * inch

    y = draw_doc_chrome(
        c,
        width,
        height,
        "swe writeup · creative lane · proof",
        "actor & entrepreneur",
        "identity, not a fake employer  ·  stock reach + 30-day dashboard math",
    )

    y = draw_section(c, x, y, "identity")
    y = draw_para(
        c,
        x,
        y,
        "actor and entrepreneur live in the headline and about... same person who ships product. "
        "no invented film credits, no fake reel list. restaurant-kid wiring, campus soft lane, "
        "and building things people can actually use. informatics @ iu luddy on the other side of the same day.",
        max_w,
        size=10,
        leading=13.5,
    )
    y -= 0.1 * inch

    # stock reach big
    y = draw_section(c, x, y, "stock reach (stated)")
    box_h = 0.85 * inch
    c.setFillColor(SOFT)
    c.roundRect(x, y - box_h + 0.12 * inch, max_w, box_h, 5, fill=1, stroke=0)
    c.setStrokeColor(JADE)
    c.setLineWidth(2.5)
    c.line(x, y - box_h + 0.12 * inch, x, y + 0.12 * inch)

    c.setFillColor(JADE)
    c.setFont(FONT_BOLD, 32)
    c.drawString(x + 0.22 * inch, y - 0.28 * inch, STOCK[0])
    slash_x = x + 0.22 * inch + c.stringWidth(STOCK[0], FONT_BOLD, 32) + 10
    c.setFillColor(MUTED)
    c.setFont(FONT, 20)
    c.drawString(slash_x, y - 0.2 * inch, "/")
    c.setFillColor(JADE)
    c.setFont(FONT_BOLD, 32)
    c.drawString(slash_x + 16, y - 0.28 * inch, STOCK[1])

    c.setFillColor(INK)
    c.setFont(FONT, 10)
    c.drawString(
        x + 0.22 * inch,
        y - 0.55 * inch,
        "already on creative / entrepreneur accounts. stated stock. not a platform name drop.",
    )
    y -= box_h + 0.12 * inch

    # transcribed math table
    y = draw_insights_table(
        c,
        x,
        y,
        max_w,
        [ACCT_A, ACCT_B],
        f"window {WINDOW} · two own Professional dashboards · proof layer for the creative lane",
    )
    y -= 0.08 * inch

    y = draw_section(c, x, y, "handles & brand")
    y = draw_bullets(
        c,
        x,
        y,
        [
            "school / campus ig: @zhao.langxi (赵郎溪)... madrid, film, campus soft lane",
            "jade green #00a86b across banner, featured accents, portfolio chips",
            "optional brand / food lane @matchaxmoxie",
            "entrepreneurship signal: family restaurant site with clover ordering, still live",
        ],
        max_w,
        size=10,
    )
    y -= 0.06 * inch

    y = draw_section(c, x, y, "why this pin exists")
    y = draw_para(
        c,
        x,
        y,
        "so visitors see creative reach with receipts: stock 250k / 150k, then the 30-day motion "
        "from the dashboards. identity only. pair with portfolio (jadexzhao.github.io) if you want "
        "a second soft pin.",
        max_w,
        size=10,
        leading=13.5,
    )

    draw_footer(c, width, "creative lane · math from own dashboards")
    c.save()
    return path


def write_tex_mirrors():
    """Plain .tex mirrors for local editing (Personal/ only)."""
    common = r"""% LinkedIn Featured · software engineering writeup standard (local source)
% PDFs in ~/Downloads built via reportlab (generate_featured_pdfs.py)
% Proof: IMG_4703 + IMG_4704 Professional dashboard, Jul 12 2026
\documentclass[11pt,letterpaper]{article}
\usepackage[margin=0.7in]{geometry}
\usepackage{xcolor}
\usepackage{booktabs}
\definecolor{jade}{HTML}{00A86B}
\usepackage{times}
\pagestyle{empty}
\begin{document}
"""
    foot = r"""
\vspace*{\fill}
\noindent\textcolor{gray}{\footnotesize Jade Zhao · swe writeup · LinkedIn Featured · Jul 2026}
\hfill\textcolor{jade}{\footnotesize \#00a86b}
\end{document}
"""

    files = {
        "linkedin-featured-jade-zhao-overview.tex": r"""
{\color{jade}\footnotesize\bfseries SWE WRITEUP · OVERVIEW}\\[0.4em]
{\color{jade}\LARGE\bfseries jade zhao}\\[0.25em]
{\large\itshape numbers first · who / where / proof · one-pager}\\[0.5em]
{\color{jade}\rule{\textwidth}{1.4pt}}

\section*{stock reach (stated)}
{\color{jade}\Large\bfseries 250k} / {\color{jade}\Large\bfseries 150k}
\quad serveit engagement tools · 50+ uta

\section*{30-day motion (Jun 12 -- Jul 11)}
both accounts (Professional dashboard): $\sim$191K views · $\sim$9.3K interactions · 1{,}157 new followers · 459 shared

\section*{who}
i grew up in my family's chinese restaurant. that restaurant-kid wiring still shows up...
actor and entrepreneur on the side of the same person who ships product.
informatics @ iu luddy (may 2027), first-gen, hudson \& holland, dean's list.
spring 2026 at complutense madrid.

\section*{lanes}
\begin{itemize}
\item actor \& entrepreneur · informatics @ iu luddy
\item software engineering intern @ early-stage startup (nyc) · serveit · fase map
\item python, typescript, react, sql, postgresql · open to relocation
\end{itemize}

\section*{where the work lives}
\begin{itemize}
\item serveit clinic: website team lead, wcag nonprofit builds
\item early-stage startup (nyc): demo sandboxes, integration prototypes, handoff docs
\item fase map + uta: mentor apprenticeship, teaching support for 50+ students
\item portfolio: jadexzhao.github.io · @zhao.langxi
\end{itemize}
"""
        + foot,
        "linkedin-featured-build-ship.tex": r"""
{\color{jade}\footnotesize\bfseries SWE WRITEUP · BUILD \& SHIP}\\[0.4em]
{\color{jade}\LARGE\bfseries build \& ship}\\[0.25em]
{\large\itshape problem $\rightarrow$ motion $\rightarrow$ artifact}\\[0.5em]
{\color{jade}\rule{\textwidth}{1.4pt}}

\section*{how to read this}
for each lane: problem in plain language, motion you actually ran, artifact someone else can open.
numbers when you have them. no deal-room theater.

\section*{01 · software engineering intern · early-stage startup (nyc)}
\textbf{problem.} pilots need working software, not just slides.\\
\textbf{motion.} jun--jul 2026, hybrid nyc. scoped requirements from discovery calls, demo sandboxes / poc environments / integration prototypes. python for onboarding automation.\\
\textbf{artifact.} handoff docs when pilots moved to production. company acquired during internship.

\section*{02 · serveit clinic · iu luddy}
\textbf{problem.} nonprofits need sites staff can update without a developer on call.\\
\textbf{motion.} website team lead since jan 2024. wcag 2.1 builds. engagement tools for community partners. python/postgresql etl.\\
\textbf{artifact.} live nonprofit sites + maintainable handoffs.

\section*{03 · fase map · student life · uta}
\textbf{problem.} first-years and mentors need clearer day-to-day ops.\\
\textbf{motion.} fase mentor apprenticeship ops. uta for 50+ students. campus leadership/career programming.\\
\textbf{artifact.} canvas content, mentor training materials, campus programming.

\section*{also shipping}
family restaurant ordering site still live · portfolio at jadexzhao.github.io
"""
        + foot,
        "linkedin-featured-actor-entrepreneur.tex": r"""
{\color{jade}\footnotesize\bfseries SWE WRITEUP · CREATIVE LANE · PROOF}\\[0.4em]
{\color{jade}\LARGE\bfseries actor \& entrepreneur}\\[0.25em]
{\large\itshape identity, not a fake employer · stock + 30-day dashboard math}\\[0.5em]
{\color{jade}\rule{\textwidth}{1.4pt}}

\section*{identity}
actor and entrepreneur live in the headline and about... same person who ships product.
no invented film credits.

\section*{stock reach (stated)}
{\color{jade}\Huge\bfseries 250k} / {\color{jade}\Huge\bfseries 150k}\\[0.2em]
already on creative / entrepreneur accounts.

\section*{30-day motion · professional dashboard}
window Jun 12 -- Jul 11. source: own screenshots IMG\_4703, IMG\_4704 (Jul 12 2026).

\begin{tabular}{@{}lllll@{}}
\toprule
account & views & interactions & new followers & content shared \\
\midrule
account A & 83.7K & 1.7K & 814 & 314 \\
account B & 107.1K & 7.6K & 343 & 145 \\
\midrule
both (sum) & $\sim$190.8K & $\sim$9.3K & 1{,}157 & 459 \\
\bottomrule
\end{tabular}

\section*{handles \& brand}
\begin{itemize}
\item school ig @zhao.langxi (赵郎溪)
\item jade green \#00a86b
\item optional brand lane @matchaxmoxie
\item family restaurant ordering site (honest entrepreneurship signal)
\end{itemize}
"""
        + foot,
    }

    for name, body in files.items():
        (SRC / name).write_text(common + body, encoding="utf-8")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    paths = [pdf_overview(), pdf_build_ship(), pdf_actor_entrepreneur()]
    write_tex_mirrors()
    for p in paths:
        print(p)
