#!/usr/bin/env python3
"""Add Official help + Download PDF sections to briefcase handoff HTML pages."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

HELP = {
    "email": [
        ("Sign in to Gmail", "https://support.google.com/mail/answer/8494"),
        ("Reply to messages in Gmail", "https://support.google.com/mail/answer/6585"),
        ("Refine searches in Gmail", "https://support.google.com/mail/answer/7190"),
    ],
    "apple-notes": [
        ("Notes User Guide for Mac", "https://support.apple.com/guide/notes/welcome/mac"),
        (
            "Create and edit notes on Mac",
            "https://support.apple.com/guide/notes/create-and-edit-notes-not9474646a9/mac",
        ),
    ],
    "google-drive": [
        ("How to use Google Drive", "https://support.google.com/drive/answer/2424384"),
        ("Share files from Google Drive", "https://support.google.com/drive/answer/2494822"),
    ],
    "google-reviews": [
        ("Google Business Profile Help", "https://support.google.com/business/"),
        ("Manage customer reviews", "https://support.google.com/business/answer/3474050"),
        ("Tips to get more reviews", "https://support.google.com/business/answer/3474122"),
    ],
    "meta-facebook": [
        ("Meta Business Help Center", "https://www.facebook.com/business/help"),
        (
            "Add people and assign a business asset",
            "https://www.facebook.com/business/help/2169003770027706",
        ),
    ],
    "canva": [
        ("Canva Help Center", "https://www.canva.com/help/"),
        ("Editing and designing", "https://www.canva.com/help/editing-designing/"),
    ],
    "linkedin": [
        ("LinkedIn Help", "https://www.linkedin.com/help/linkedin"),
        (
            "Control your public LinkedIn profile",
            "https://www.linkedin.com/help/linkedin/answer/a528139",
        ),
        (
            "Find your LinkedIn public profile URL",
            "https://www.linkedin.com/help/linkedin/answer/a522735",
        ),
    ],
    "google-calendar": [
        ("Create an event", "https://support.google.com/calendar/answer/37114"),
        ("Share your calendar", "https://support.google.com/calendar/answer/37082"),
    ],
    "yelp": [
        ("Yelp Support Center", "https://www.yelp-support.com/"),
        (
            "How do I respond to reviews",
            "https://www.yelp-support.com/article/How-do-I-respond-to-reviews",
        ),
        (
            "How do I update my business information",
            "https://www.yelp-support.com/article/How-do-I-update-my-business-information",
        ),
    ],
    "youtube": [
        ("YouTube Help", "https://support.google.com/youtube/"),
        ("Upload YouTube videos", "https://support.google.com/youtube/answer/57407"),
    ],
    "tiktok": [
        ("TikTok Support", "https://support.tiktok.com/en/"),
        (
            "Uploading a video",
            "https://support.tiktok.com/en/using-tiktok/creating-videos/uploading-a-video",
        ),
    ],
}

TITLES = {
    "email": "Email",
    "apple-notes": "Apple Notes",
    "google-drive": "Google Drive",
    "google-reviews": "Google Reviews",
    "meta-facebook": "Meta",
    "canva": "Canva",
    "linkedin": "LinkedIn",
    "google-calendar": "Google Calendar",
    "yelp": "Yelp",
    "youtube": "YouTube",
    "tiktok": "TikTok",
}


def help_section(slug: str) -> str:
    items = "\n".join(
        f'          <li><a href="{url}" rel="noopener noreferrer">{label}</a>'
        f'<br><span class="muted">{url}</span></li>'
        for label, url in HELP[slug]
    )
    return f"""      <section class="page-section" id="official-help" aria-labelledby="help-heading">
        <h2 id="help-heading">Official help</h2>
        <p>Beginner docs from the product itself. Open these if a button name moved.</p>
        <ul>
{items}
        </ul>
      </section>

"""


def pdf_section(slug: str) -> str:
    title = TITLES[slug]
    fname = f"handoff-{slug}.pdf"
    return f"""      <section class="page-section" id="pdf" aria-labelledby="pdf-heading">
        <h2 id="pdf-heading">PDF</h2>
        <p>The same steps, for someone who wants a file.</p>
        <p class="hero-cta">
          <a class="btn" href="handoffs/{fname}" download="{fname}">Download the {title} PDF</a>
        </p>
      </section>

"""


def patch_page(path: Path) -> None:
    slug = path.name.removeprefix("handoff-").removesuffix(".html")
    if slug not in HELP:
        raise SystemExit(f"unknown slug: {slug}")
    text = path.read_text(encoding="utf-8")

    # Refresh TOC links
    toc_old = re.search(
        r'(<nav class="case-toc" aria-label="Page sections">)(.*?)(</nav>)',
        text,
        re.S,
    )
    if toc_old:
        toc = (
            '<nav class="case-toc" aria-label="Page sections">\n'
            '        <a href="#who">Who</a>\n'
            '        <a href="#steps">Steps</a>\n'
            '        <a href="#official-help">Official help</a>\n'
            '        <a href="#pdf">PDF</a>\n'
            '        <a href="#video">Video</a>\n'
            "      </nav>"
        )
        text = text[: toc_old.start()] + toc + text[toc_old.end() :]

    # Remove prior injected blocks if re-running
    text = re.sub(
        r'\s*<section class="page-section" id="official-help".*?</section>\s*',
        "\n",
        text,
        flags=re.S,
    )
    text = re.sub(
        r'\s*<section class="page-section" id="pdf".*?</section>\s*',
        "\n",
        text,
        flags=re.S,
    )

    insert = help_section(slug) + pdf_section(slug)
    # Insert before Video section
    marker = '<section class="page-section" id="video"'
    if marker not in text:
        raise SystemExit(f"no video section in {path}")
    text = text.replace(marker, insert + "      " + marker, 1)
    path.write_text(text, encoding="utf-8")
    print(f"patched {path.name}")


def patch_index() -> None:
    path = ROOT / "handoffs.html"
    text = path.read_text(encoding="utf-8")
    # Under each case-section, ensure a PDF download line exists after the handoff page link.
    mapping = [
        ("email", "Email"),
        ("apple-notes", "Apple Notes"),
        ("google-drive", "Google Drive"),
        ("google-reviews", "Google Reviews"),
        ("meta-facebook", "Meta"),
        ("canva", "Canva"),
        ("linkedin", "LinkedIn"),
        ("google-calendar", "Google Calendar"),
        ("yelp", "Yelp"),
        ("youtube", "YouTube"),
        ("tiktok", "TikTok"),
    ]
    for slug, label in mapping:
        pdf_line = (
            f'          <p><a href="handoffs/handoff-{slug}.pdf" '
            f'download="handoff-{slug}.pdf">Download the {label} PDF</a></p>'
        )
        # Remove existing download line for this slug if present
        text = re.sub(
            rf'\s*<p><a href="handoffs/handoff-{re.escape(slug)}\.pdf"[^>]*>.*?</a></p>\s*',
            "\n",
            text,
        )
        # Insert after the handoff page link paragraph
        pattern = rf'(<p><a href="handoff-{re.escape(slug)}\.html">[^<]*handoff</a></p>)'
        if not re.search(pattern, text):
            # google-reviews has a longer label
            pattern = rf'(<p><a href="handoff-{re.escape(slug)}\.html">[^<]+</a></p>)'
        m = re.search(pattern, text)
        if not m:
            raise SystemExit(f"could not find handoff link for {slug}")
        text = text[: m.end()] + "\n" + pdf_line + text[m.end() :]

    # Note about PDFs in standfirst if missing
    if "PDF of the same steps" not in text:
        text = text.replace(
            "Short steps. Beginner videos you can watch.",
            "Short steps. A PDF of the same steps on each guide. Beginner videos you can watch.",
            1,
        )
    path.write_text(text, encoding="utf-8")
    print("patched handoffs.html")


def main() -> None:
    for path in sorted(ROOT.glob("handoff-*.html")):
        patch_page(path)
    patch_index()


if __name__ == "__main__":
    main()
