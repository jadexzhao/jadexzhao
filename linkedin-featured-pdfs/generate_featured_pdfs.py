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
        "serveit · serveai · linkedin featured",
        "jade zhao",
        "nonprofit web lead · public-interest AI · May 2027",
    )

    y = draw_section(c, x, y, "headline")
    y = draw_para(
        c,
        x,
        y,
        "Informatics @ IU Luddy · ServeIT · Looking for SWE roles · May 2027",
        max_w,
        size=10.5,
        leading=14,
    )
    y -= 0.08 * inch

    y = draw_section(c, x, y, "about (paste-ready)")
    y = draw_para(
        c,
        x,
        y,
        "I'm proud of my ServeIT work at IU Luddy: accessible nonprofit web (WCAG 2.1), "
        "Python/PostgreSQL data pipelines, and partner handoffs that still work after the semester ends. "
        "ServeAI is ServeIT's public-interest AI track (PIT-UN): responsible generative AI tools and guides "
        "so community organizations can adopt AI without breaking trust or accessibility.",
        max_w,
        size=10,
        leading=13.5,
    )
    y -= 0.04 * inch
    y = draw_para(
        c,
        x,
        y,
        "That's the work I want more of: software that helps people who didn't ask for a developer on retainer.",
        max_w,
        size=10,
        leading=13.5,
    )
    y -= 0.04 * inch
    y = draw_para(
        c,
        x,
        y,
        "MAP is mostly mentor training, Canvas ops, and emails ... plus UTA support for 50+ students. ",
        max_w,
        size=10,
        leading=13.5,
    )
    y -= 0.04 * inch
    y = draw_para(
        c,
        x,
        y,
        "May 2027 · Informatics @ IU Luddy. Looking for software engineering roles. Open to Southern California.",
        max_w,
        size=10,
        leading=13.5,
    )
    y -= 0.08 * inch

    y = draw_section(c, x, y, "experience · serveit (lead this one)")
    y = draw_para(
        c,
        x,
        y,
        "Website Team Lead · ServeIT Clinic · Indiana University Luddy · Jan 2024 – Present",
        max_w,
        size=10,
        leading=13.5,
        color=INK,
    )
    y -= 0.02 * inch
    y = draw_para(
        c,
        x,
        y,
        "Lead nonprofit web delivery at IU Luddy's tech clinic. WCAG 2.1 builds, Python/PostgreSQL ETL, "
        "partner scoping, and maintainable handoffs. ServeAI: public-interest AI tooling and guides "
        "for community partners (PIT-UN track).",
        max_w,
        size=10,
        leading=13.5,
        color=MUTED,
    )
    y -= 0.06 * inch

    y = draw_section(c, x, y, "where the work lives")
    y = draw_bullets(
        c,
        x,
        y,
        [
            "ServeIT Clinic: serveit.luddy.indiana.edu",
            "ServeAI (PIT-UN track): serveit.luddy.indiana.edu/serve-ai",
            "Portfolio: jadexzhao.github.io/jadexzhao",
            "Resume: jlzhao.pages.iu.edu/resume.pdf",
            "IG: @zhao.langxi",
        ],
        max_w,
        size=10,
    )

    draw_footer(c, width, "ServeIT-first LinkedIn Featured")
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
        "01 · serveit clinic · iu luddy",
        "nonprofits need sites staff can update without a developer on call.",
        "website team lead since jan 2024. wcag 2.1 builds. engagement tools for community partners. "
        "python/postgresql etl. serveai (pit-un): public-interest ai guides for partners.",
        "live nonprofit sites + maintainable handoffs.",
    )

    y = draw_pma_block(
        c,
        x,
        y,
        max_w,
        "02 · fase map · student life · uta",
        "first-years and mentors need clearer day-to-day ops than a one-off workshop.",
        "mostly mentor training, canvas ops, and emails. uta for 50+ students. "
        "campus leadership programming with student life partners.",
        "canvas content, mentor training materials, matchaxmoxie teaching site.",
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
    """Skip overwriting .tex mirrors ... source of truth is edited .tex files in repo."""
    return


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    paths = [pdf_overview(), pdf_build_ship(), pdf_actor_entrepreneur()]
    write_tex_mirrors()
    for p in paths:
        print(p)
