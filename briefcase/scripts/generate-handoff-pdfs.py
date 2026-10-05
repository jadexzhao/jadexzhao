#!/usr/bin/env python3
"""Regenerate briefcase/handoffs/*.pdf (reportlab). Priority SOP + checklist."""

from __future__ import annotations

import shutil
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    Image,
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "handoffs"
PAGES_BASE = "https://jadexzhao.github.io/jadexzhao"
MATCHA_OUT = Path("/Users/jadexzhao/Documents/matchaxmoxie/site/handoffs")
PFP = ROOT / "assets" / "site-pfp.jpg"

INK = HexColor("#1a1a1a")
MUTED = HexColor("#4a5560")
ACCENT = HexColor("#4a90c4")
RULE = HexColor("#c3d4de")
WARN_BG = HexColor("#f7f1e8")
BOX_BG = HexColor("#f4f8fb")

LAST_CHECKED = "October 2026"
START_HERE = (
    "Use only an account you have permission to use. If you do not know which account to use, "
    "or cannot sign in, stop and ask the named account owner. Never share or write down a "
    "password or sign-in code."
)

# --- Priority SOP sheets (Email, Meta, Google Reviews) ---

SOP_SHEETS = [
    {
        "slug": "email",
        "platform": "Email (Google Workspace / Gmail)",
        "what": "Your organisation's email account. It may also control access to other Google services.",
        "owners": [
            "Account owner / admin: ____________________",
            "Backup admin: ____________________",
            "Recovery email / phone is controlled by: ____________________",
        ],
        "owner_note": (
            "Prefer a second Super Admin for Workspace. Do not share one mailbox login with every staff member. "
            "Never put the password on this sheet."
        ),
        "steps": [
            "Sign in with the organisation email and its normal sign-in method (mail.google.com or the Gmail app).",
            "Need a new employee? An administrator creates a separate user account. Do not give everyone the same mailbox login.",
            "Someone cannot sign in? Try the normal password-reset process first. Personal Gmail uses Google Account recovery. Work accounts may need an admin.",
            "Need to change someone's access? The administrator manages that person in Google Admin (or Gmail settings for delegates).",
            "Someone leaves? Remove or suspend their access in your offboarding process.",
            "Never write the password here. Store credentials in your approved password manager only.",
        ],
        "help": [
            ("Delegate a Gmail mailbox", "https://support.google.com/mail/answer/138350"),
            (
                "Recover admin access (Google Workspace)",
                "https://knowledge.workspace.google.com/admin/users/recovering-administrator-access-to-your-account",
            ),
            (
                "Recover a Google Account or Gmail (personal; work may need admin)",
                "https://support.google.com/accounts/answer/7682439",
            ),
        ],
        "warnings": [
            "If nobody knows who the administrator is, find who originally set up Google Workspace (often the owner or their IT helper).",
            "US help links. Your region may show different wording.",
        ],
        "do_not": [
            "Do not write passwords, MFA codes, or recovery answers on this sheet.",
            "Do not share one personal Gmail password across the team.",
        ],
    },
    {
        "slug": "meta-facebook",
        "platform": "Meta (Facebook / Instagram)",
        "what": "The organisation's Facebook Page and, often, its connected Instagram account.",
        "owners": [
            "Business / Page owner: ____________________",
            "Primary person with full control: ____________________",
            "Agency / volunteer access: ____________________",
        ],
        "owner_note": (
            "Assign staff via Meta Business Suite with individual Facebook accounts. "
            "Never share a personal Facebook password. Full control can add people, remove people (including you), or delete the Page."
        ),
        "steps": [
            "Do not share someone's personal Facebook password.",
            "Open business.facebook.com and sign in with the profile that has Page access. Check the right Page is selected.",
            "The person with full control gives other people the access they need.",
            "Give ordinary helpers task or partial access when that is enough.",
            "Use full control only for people who must manage access or settings.",
            "To reply to a review or message: open Inbox, pick Reviews or Messages, write a short calm reply, then Send or Post.",
            "When someone leaves, remove their Page / business access. If Instagram is linked, check that access too.",
        ],
        "help": [
            (
                "Add people and assign a business asset",
                "https://www.facebook.com/business/help/2169003770027706",
            ),
            (
                "About Facebook Page access",
                "https://www.facebook.com/business/help/152071822895768",
            ),
            (
                "Give, edit or remove Facebook Page access",
                "https://www.facebook.com/help/187316341316631",
            ),
        ],
        "warnings": [
            "Full control is powerful. Someone with full control can remove you or delete the Page.",
            "If you cannot see reviews, make sure you are toggled into the Business Page, not your personal profile.",
        ],
        "do_not": [
            "Do not share personal Facebook credentials across the team.",
            "Do not delete negative feedback unless it violates community standards.",
            "Do not offer money or free items in exchange for removing a negative review.",
            "Never put passwords or MFA codes on this sheet.",
        ],
    },
    {
        "slug": "google-reviews",
        "platform": "Google Reviews / Google Business Profile",
        "what": "The Google listing customers see in Google Search and Google Maps.",
        "owners": [
            "Primary owner: ____________________",
            "Backup owner: ____________________",
            "Review responder: ____________________",
        ],
        "owner_note": (
            "Google listing is not the same as the organisation Gmail password. "
            "Add staff with their own Google Accounts as Manager when that is enough. Never put the password on this sheet."
        ),
        "steps": [
            "Open business.google.com and sign in with the Google account that manages the listing. Confirm the right location.",
            "Check People and access to see who has access. Keep the business owner as primary owner.",
            "Add staff or helpers using their own Google Accounts. Prefer Manager for day-to-day reply work.",
            "To answer a review: open Read reviews (or Reviews), click Reply, write a short polite answer, then post.",
            "Keep hours, phone, address, website, and photos current.",
            "If a review violates Google's policies, use Google's reporting process rather than inventing a delete path.",
        ],
        "help": [
            (
                "Manage Business Profile owners and managers",
                "https://support.google.com/business/answer/3403100",
            ),
            ("Manage customer reviews", "https://support.google.com/business/answer/3474050"),
            ("Edit your Business Profile", "https://support.google.com/business/answer/3038177"),
        ],
        "warnings": [
            "Google listing ≠ Google email account. The Business Profile is managed by Google Accounts.",
            "US help links. Your region may show different wording.",
        ],
        "do_not": [
            "Do not share the primary owner's Google password with every helper.",
            "Do not write passwords or recovery codes on this sheet.",
        ],
    },
]

SIMPLE_SHEETS = [
    {
        "slug": "apple-notes",
        "title": "Apple Notes handoff",
        "for_whom": "For the person who will open, write, and find notes on iPhone or iPad after the builder leaves.",
        "why": "Notes can be hard to find if they are saved under a different Apple Account or folder.",
        "steps": [
            "Open the Notes app on the iPhone (or iPad).",
            "Tap a folder, then tap a note in the list to open it.",
            "To make a new note, tap the compose button (pencil in a square), type, then tap Done.",
            "To find a note, pull down on the list for Search, then type a word from the note.",
            "To pin a note, swipe right on it and tap Pin.",
            "To share, open the note, tap the share icon, then choose how to send a copy or invite someone.",
        ],
        "write_down": [
            "Which Apple ID / device holds the notes.",
            "Which folder the day-to-day notes live in.",
            "Who to ask if iCloud Notes will not sync.",
            "Never put the password on this sheet.",
        ],
        "help": [
            ("Notes User Guide for Mac", "https://support.apple.com/guide/notes/welcome/mac"),
            (
                "Create and edit notes on Mac",
                "https://support.apple.com/guide/notes/create-and-edit-notes-not9474646a9/mac",
            ),
        ],
    },
    {
        "slug": "google-drive",
        "title": "Google Drive handoff",
        "for_whom": "For the person who will find files, share links, and check access after the builder leaves.",
        "why": "Files can be hard to find when they are in a different Google Account. Viewer access is safer when someone only needs to look.",
        "steps": [
            "Open drive.google.com and sign in with the same Google account that owns the files.",
            "To find a file, use the search box at the top, then open the result.",
            "To share, right-click the file (or select it and click Share). Add an email, or choose Copy link.",
            "Check the role: Viewer, Commenter, or Editor. Viewer is enough for most handoffs.",
            "Open Share again later to see who has access. Remove someone if they should not keep the file.",
        ],
        "write_down": [
            "The Google account that owns the Drive files.",
            "Where the main folder lives (name or Shared drive).",
            "Who should stay as Editor vs Viewer.",
            "Never put the password on this sheet.",
        ],
        "help": [
            ("How to use Google Drive", "https://support.google.com/drive/answer/2424384"),
            ("Share files from Google Drive", "https://support.google.com/drive/answer/2494822"),
        ],
    },
    {
        "slug": "canva",
        "title": "Canva handoff",
        "for_whom": "For the person who will make a simple post or flyer in Canva after the builder leaves.",
        "why": "A design is not ready to use until it is downloaded or shared with the right person.",
        "steps": [
            "Open canva.com and sign in with the account that owns the designs.",
            "Click Create a design. Search for Instagram post or Flyer, then open a size that fits.",
            "Pick a template, or start blank. Click text to edit. Click a picture to replace it.",
            "When it looks right, click Share, then Download. PNG for posts. PDF for a printable flyer.",
            "To send the design, use Share and invite them, or download the file and send the download.",
        ],
        "write_down": [
            "The Canva account email that owns the brand folder.",
            "Where finished downloads should be saved.",
            "Who posts the finished file.",
            "Never put the password on this sheet.",
        ],
        "help": [
            ("Canva Help Center", "https://www.canva.com/help/"),
            ("Editing and designing", "https://www.canva.com/help/editing-designing/"),
        ],
    },
    {
        "slug": "linkedin",
        "title": "LinkedIn handoff",
        "for_whom": "For the person who will edit profile basics and share a post after the builder leaves.",
        "why": "A saved draft is not public until you choose Post. Check that you are using the correct account.",
        "steps": [
            "Open linkedin.com (or the LinkedIn app) and sign in.",
            "Open your profile (your photo or Me, then View profile).",
            "Edit the basics: photo, headline, and About. Keep the words plain and true.",
            "To share a post, go Home. Click Start a post. Type a short update. Click Post.",
            "Check who can see the post before you publish.",
        ],
        "write_down": [
            "Which LinkedIn account owns the profile or Page.",
            "Who is allowed to post in public.",
            "The public profile URL if you use it on other sites.",
            "Never put the password on this sheet.",
        ],
        "help": [
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
    },
    {
        "slug": "google-calendar",
        "title": "Google Calendar handoff",
        "for_whom": "For the person who will create events and share a calendar after the builder leaves.",
        "why": "Events may stay private if the calendar is owned by a different account or has not been shared.",
        "steps": [
            "Open calendar.google.com and sign in with the Google account that owns the calendar.",
            "To create an event, click Create (or click an empty time slot). Add a title, date, and time, then Save.",
            "Optional: add guests by email if they need an invite.",
            "To share a whole calendar, find it under My calendars. Open the three dots, then Settings and sharing.",
            "Under Shared with, add a person by email and choose what they can see. Send.",
        ],
        "write_down": [
            "The Google account that owns the calendar.",
            "The calendar name under My calendars.",
            "Who should see details vs free/busy only.",
            "Never put the password on this sheet.",
        ],
        "help": [
            ("Create an event", "https://support.google.com/calendar/answer/37114"),
            ("Share your calendar", "https://support.google.com/calendar/answer/37082"),
        ],
    },
    {
        "slug": "yelp",
        "title": "Yelp for Business handoff",
        "for_whom": "For the person who will keep the Yelp page accurate and reply to reviews after the builder leaves.",
        "why": "A business page must be claimed before an owner can manage it. Having an account does not always mean it has access.",
        "steps": [
            "Open biz.yelp.com and sign in with the owner account.",
            "Check you are on the right location.",
            "Update hours, address, phone, or photos in business info, then Save.",
            "Open Reviews. To reply, click Respond under that review, type a short reply, then send.",
            "If the page is not claimed yet, start at biz.yelp.com/claim and finish verification.",
        ],
        "write_down": [
            "The Yelp for Business owner login email.",
            "The business location name on Yelp.",
            "Who is allowed to reply in public.",
            "Never put the password on this sheet.",
        ],
        "help": [
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
    },
    {
        "slug": "youtube",
        "title": "YouTube Studio handoff",
        "for_whom": "For the person who will upload and publish videos in YouTube Studio after the builder leaves.",
        "why": "Videos can stay private if the wrong channel is selected or the visibility setting is not changed.",
        "steps": [
            "Open studio.youtube.com and sign in with the Google account that owns the channel.",
            "Check the channel name at the top. Switch if needed.",
            "Click Create, then Upload videos. Choose the video file.",
            "Add a title and short description. Answer the audience question.",
            "On Visibility, choose Public, Unlisted, Private, or Schedule. Then Publish, Save, or Schedule.",
            "To find an old video later, open Content and search by title.",
        ],
        "write_down": [
            "The Google account / channel that owns the uploads.",
            "Default visibility (Public, Unlisted, or Private).",
            "Who is allowed to Publish.",
            "Never put the password on this sheet.",
        ],
        "help": [
            ("YouTube Help", "https://support.google.com/youtube/"),
            ("Upload YouTube videos", "https://support.google.com/youtube/answer/57407"),
        ],
    },
    {
        "slug": "tiktok",
        "title": "TikTok handoff",
        "for_whom": "For the person who will record or upload a short video and post it after the builder leaves.",
        "why": "Check which profile is selected before posting. A video left as a draft is not published.",
        "steps": [
            "Open the TikTok app and sign in with the account that owns the business profile.",
            "Tap Profile and check the username before you post.",
            "Tap the + button in the middle of the bottom bar.",
            "Hold the red button to record, or tap Upload to pick a video from your phone.",
            "On the edit screen, add text or sound if you want. Tap Next.",
            "Write a short caption. Check visibility. Tap Post.",
        ],
        "write_down": [
            "The TikTok username that should post.",
            "Whether posts should be public (Everyone).",
            "Who is allowed to Post vs only draft.",
            "Never put the password on this sheet.",
        ],
        "help": [
            ("TikTok Support", "https://support.tiktok.com/en/"),
            (
                "Uploading a video",
                "https://support.tiktok.com/en/using-tiktok/creating-videos/uploading-a-video",
            ),
        ],
    },
]


def styles() -> dict:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "JTitle",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=17,
            textColor=ACCENT,
            spaceAfter=2,
        ),
        "meta": ParagraphStyle(
            "JMeta",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            textColor=MUTED,
            spaceAfter=6,
        ),
        "h2": ParagraphStyle(
            "JH2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=ACCENT,
            spaceBefore=6,
            spaceAfter=3,
        ),
        "body": ParagraphStyle(
            "JBody",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=13,
            textColor=INK,
            spaceAfter=3,
        ),
        "li": ParagraphStyle(
            "JLi",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=13,
            textColor=INK,
            spaceAfter=3,
        ),
        "link": ParagraphStyle(
            "JLink",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=11,
            textColor=INK,
            spaceAfter=1,
        ),
        "foot": ParagraphStyle(
            "JFoot",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=7.5,
            leading=9.5,
            textColor=MUTED,
            spaceBefore=4,
        ),
        "warn": ParagraphStyle(
            "JWarn",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=10.5,
            textColor=INK,
        ),
        "center": ParagraphStyle(
            "JCenter",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=13,
            textColor=ACCENT,
            alignment=TA_CENTER,
            spaceAfter=4,
        ),
        "mapbox": ParagraphStyle(
            "JMap",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            textColor=INK,
            alignment=TA_CENTER,
        ),
    }


def _box(text: str, st: ParagraphStyle, bg=WARN_BG) -> Table:
    t = Table([[Paragraph(text, st)]], colWidths=[7.1 * inch])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), bg),
                ("BOX", (0, 0), (-1, -1), 0.5, RULE),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return t


def _numbered(items: list[str], s: dict) -> ListFlowable:
    return ListFlowable(
        [
            ListItem(Paragraph(x, s["li"]), leftIndent=10, value=str(i))
            for i, x in enumerate(items, 1)
        ],
        bulletType="1",
        start="1",
        leftIndent=16,
        bulletFontName="Helvetica-Bold",
        bulletFontSize=9,
        bulletColor=ACCENT,
    )


def _bullets(items: list[str], s: dict) -> ListFlowable:
    return ListFlowable(
        [ListItem(Paragraph(x, s["li"]), leftIndent=6) for x in items],
        bulletType="bullet",
        leftIndent=12,
        bulletFontName="Helvetica",
        bulletFontSize=9,
        bulletColor=RULE,
    )


def make_sop_pdf(item: dict, s: dict) -> Path:
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"handoff-{item['slug']}.pdf"
    doc = SimpleDocTemplate(
        str(path),
        pagesize=letter,
        leftMargin=0.55 * inch,
        rightMargin=0.55 * inch,
        topMargin=0.45 * inch,
        bottomMargin=0.45 * inch,
        title=f"{item['platform']} handoff",
        author="Jade Zhao",
    )
    story = []
    story.append(Paragraph(f"Account handoff · {item['platform']}", s["title"]))
    story.append(
        Paragraph(
            f"Last checked: {LAST_CHECKED} · Managed by: ____________________ "
            f"(organisation fills this in)",
            s["meta"],
        )
    )
    story.append(Paragraph("<b>What this is</b>", s["h2"]))
    story.append(Paragraph(item["what"], s["body"]))
    story.append(Paragraph("<b>Who owns the login?</b>", s["h2"]))
    story.append(_bullets(item["owners"], s))
    story.append(Paragraph(item["owner_note"], s["body"]))
    story.append(Paragraph("<b>Before you start</b>", s["h2"]))
    story.append(Paragraph(START_HERE, s["body"]))
    story.append(Paragraph("<b>Steps to follow</b>", s["h2"]))
    story.append(_numbered(item["steps"], s))
    story.append(Spacer(1, 4))
    story.append(
        _box(
            "If the screen looks different, stop before changing settings. Use the official help "
            "link below or ask the account owner for help.",
            s["warn"],
        )
    )
    story.append(Paragraph("<b>Official help</b> (US links; region may differ)", s["h2"]))
    for label, url in item["help"]:
        story.append(
            Paragraph(
                f'{label}: <link href="{url}" color="#4a90c4"><u>{url}</u></link>',
                s["link"],
            )
        )
    if item.get("warnings"):
        story.append(Spacer(1, 4))
        story.append(Paragraph("<b>Warning / troubleshooting</b>", s["h2"]))
        story.append(_box("<br/>".join(f"• {w}" for w in item["warnings"]), s["warn"]))
    if item.get("do_not"):
        story.append(Paragraph("<b>Do not</b>", s["h2"]))
        story.append(_bullets(item["do_not"], s))
    html_url = f"{PAGES_BASE}/handoff-{item['slug']}.html"
    story.append(Paragraph("<b>Longer guide</b>", s["h2"]))
    story.append(
        Paragraph(
            f'<link href="{html_url}" color="#4a90c4"><u>{html_url}</u></link>',
            s["link"],
        )
    )
    story.append(
        Paragraph(
            "Footer: Who owns this account? ____________________ · Backup: ____________________ · "
            "Credentials live in the password manager only · When someone leaves, remove their access · "
            f"When something is wrong, use Official help above · Last checked: {LAST_CHECKED} · "
            "Checked by: ____________________ · Jade Zhao · independent guide, not affiliated with the platform · "
            "Never put the password on this sheet.",
            s["foot"],
        )
    )
    doc.build(story)
    return path


def make_simple_pdf(item: dict, s: dict) -> Path:
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"handoff-{item['slug']}.pdf"
    doc = SimpleDocTemplate(
        str(path),
        pagesize=letter,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
        title=item["title"],
        author="Jade Zhao",
    )
    story = [
        Paragraph(item["title"], s["title"]),
        Paragraph(f"Jade Zhao · handoff sheet · Last checked: {LAST_CHECKED}", s["meta"]),
        Paragraph(item["for_whom"], s["body"]),
        Paragraph("<b>Before you start</b>", s["h2"]),
        Paragraph(START_HERE, s["body"]),
        Paragraph("<b>Why this matters</b>", s["h2"]),
        Paragraph(item["why"], s["body"]),
        Paragraph("<b>Steps to follow</b>", s["h2"]),
        _numbered(item["steps"], s),
        Spacer(1, 4),
        _box(
            "If the screen looks different, stop before changing settings. Use the official help "
            "link below or ask the account owner for help.",
            s["warn"],
        ),
        Spacer(1, 4),
        Paragraph("<b>Write this down</b>", s["h2"]),
        _bullets(item["write_down"], s),
        Paragraph("<b>Official help</b>", s["h2"]),
    ]
    for label, url in item["help"]:
        story.append(
            Paragraph(
                f'{label}: <link href="{url}" color="#4a90c4"><u>{url}</u></link>',
                s["link"],
            )
        )
    html_url = f"{PAGES_BASE}/handoff-{item['slug']}.html"
    story.append(Paragraph("<b>Longer guide (with video)</b>", s["h2"]))
    story.append(
        Paragraph(
            f'<link href="{html_url}" color="#4a90c4"><u>{html_url}</u></link>',
            s["link"],
        )
    )
    story.append(
        Paragraph(
            f"Last checked: {LAST_CHECKED}. Write down who owns the login. Never put the password on this sheet.",
            s["foot"],
        )
    )
    doc.build(story)
    return path


def _header_with_photo(title: str, subtitle: str, s: dict) -> Table:
    """Title block + Jade Zhao site-pfp.jpg (alt text conceptually: Jade Zhao)."""
    left = [
        Paragraph(title, s["title"]),
        Paragraph(subtitle, s["meta"]),
        Paragraph(
            f"Last checked: {LAST_CHECKED} · Managed by: ____________________ "
            f"(organisation fills this in)",
            s["meta"],
        ),
        Paragraph("Prepared by Jade Zhao", s["meta"]),
    ]
    if PFP.exists():
        img = Image(str(PFP), width=0.72 * inch, height=0.72 * inch)
        return Table(
            [[left, img]],
            colWidths=[6.2 * inch, 0.9 * inch],
        )
    return Table([[left]], colWidths=[7.1 * inch])


def make_checklist_pdf(s: dict) -> Path:
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / "handoff-checklist.pdf"
    doc = SimpleDocTemplate(
        str(path),
        pagesize=letter,
        leftMargin=0.55 * inch,
        rightMargin=0.55 * inch,
        topMargin=0.45 * inch,
        bottomMargin=0.45 * inch,
        title="Digital Account Handoff Checklist",
        author="Jade Zhao",
    )
    story = []
    hdr = _header_with_photo(
        "DIGITAL ACCOUNT HANDOFF CHECKLIST",
        "Small Business &amp; Nonprofit",
        s,
    )
    hdr.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
            ]
        )
    )
    story.append(hdr)
    story.append(
        Paragraph(
            "Organisation: ____________________ · Prepared for: ____________________ · "
            "Date: ____________________ · Prepared by: ____________________",
            s["body"],
        )
    )
    story.append(Paragraph("<b>1. Who owns each account?</b>", s["h2"]))
    platforms = [
        "Email",
        "Facebook / Instagram",
        "Google Business Profile",
        "Wix",
        "WordPress",
        "Square",
        "Toast",
        "DoorDash",
    ]
    header = [
        Paragraph("<b>Platform</b>", s["li"]),
        Paragraph("<b>Account owner</b>", s["li"]),
        Paragraph("<b>Backup</b>", s["li"]),
        Paragraph("<b>Access checked</b>", s["li"]),
    ]
    rows = [header]
    for p in platforms:
        rows.append(
            [
                Paragraph(p, s["li"]),
                Paragraph("_______________", s["li"]),
                Paragraph("_______________", s["li"]),
                Paragraph("☐", s["li"]),
            ]
        )
    table = Table(rows, colWidths=[1.9 * inch, 2.0 * inch, 2.0 * inch, 1.2 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), BOX_BG),
                ("GRID", (0, 0), (-1, -1), 0.4, RULE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]
        )
    )
    story.append(table)
    story.append(Paragraph("<b>2. Where are credentials?</b>", s["h2"]))
    story.append(
        Paragraph(
            "Password manager name: ____________________ · Vault / folder: ____________________ · "
            "Who can open it: ____________________",
            s["body"],
        )
    )
    story.append(
        _box(
            "<b>DO NOT</b> write passwords, MFA codes, recovery codes, payment cards, "
            "or security answers on this sheet.",
            s["warn"],
        )
    )
    story.append(Paragraph("<b>3. Check access</b>", s["h2"]))
    story.append(
        _bullets(
            [
                "☐ The organisation owns the account (not a former staffer's personal login).",
                "☐ At least two trusted people can get in (owner + backup).",
                "☐ Staff use individual accounts or roles where the platform allows it.",
                "☐ Former people are removed.",
                "☐ A backup admin / co-owner is named above.",
                "☐ Recovery email / phone is current (stored in the password manager).",
                "☐ 2FA is on for owner accounts where possible.",
                "☐ An official help link is bookmarked for each live platform.",
            ],
            s,
        )
    )
    story.append(Paragraph("<b>4. When someone leaves</b>", s["h2"]))
    story.append(
        _numbered(
            [
                "Remove their access on every platform they used.",
                "Change shared passwords only if a shared login was unavoidable (then stop sharing).",
                "Transfer ownership if they were the only owner.",
                "Update the table in section 1.",
                "Confirm recovery contacts still work.",
                "Tell the team who the new owner / backup is.",
            ],
            s,
        )
    )
    story.append(Paragraph("<b>5. If something goes wrong</b>", s["h2"]))
    story.append(
        _numbered(
            [
                "Do not create a brand-new account first. That often makes ownership worse.",
                "Find who is listed as owner / admin on this checklist.",
                "Use that platform's official recovery or help link.",
                "If a work account needs an admin, contact the backup admin.",
                "Write what you tried (no passwords) and who you asked.",
            ],
            s,
        )
    )
    story.append(Paragraph("<b>6. Important rule</b>", s["h2"]))
    story.append(
        _box(
            "<b>OWN THE ACCOUNT. DON'T OWN THE PASSWORD.</b><br/>"
            "The organisation should control who has access. People get roles on their own logins. "
            "Passwords live in a password manager, never on this paper.",
            s["warn"],
        )
    )
    story.append(
        Paragraph(
            f"Last full review: ____________________ · Next review: ____________________ · "
            f"Last checked: {LAST_CHECKED} · Checked by: ____________________",
            s["foot"],
        )
    )
    story.append(
        Paragraph(
            "Jade Zhao · independent guide · Longer guides: "
            f'<link href="{PAGES_BASE}/handoffs.html" color="#4a90c4"><u>{PAGES_BASE}/handoffs.html</u></link> · '
            "Coming next: Who owns what map (handoff-who-owns-what.pdf).",
            s["foot"],
        )
    )
    doc.build(story)
    return path


def make_who_owns_what_pdf(s: dict) -> Path:
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / "handoff-who-owns-what.pdf"
    doc = SimpleDocTemplate(
        str(path),
        pagesize=letter,
        leftMargin=0.6 * inch,
        rightMargin=0.6 * inch,
        topMargin=0.5 * inch,
        bottomMargin=0.5 * inch,
        title="Who Owns What",
        author="Jade Zhao",
    )
    story = []
    hdr = _header_with_photo(
        "Who owns what? · Account map",
        "Small business &amp; nonprofit",
        s,
    )
    hdr.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
            ]
        )
    )
    story.append(hdr)
    story.append(
        Paragraph(
            "Fill the owner blank under each box. Arrows show common links. "
            "Never put passwords on this sheet.",
            s["body"],
        )
    )
    boxes = [
        ("Email / domain", "Owner: ________"),
        ("Website (Wix / WP)", "Owner: ________"),
        ("Google listing", "Owner: ________"),
        ("Meta / social", "Owner: ________"),
        ("POS (Square / Toast)", "Owner: ________"),
        ("DoorDash", "Owner: ________"),
    ]
    cells = []
    for title, owner in boxes:
        cells.append(
            Paragraph(f"<b>{title}</b><br/>{owner}", s["mapbox"]),
        )
    row1 = Table([[cells[0], cells[1], cells[2]]], colWidths=[2.3 * inch] * 3, hAlign="CENTER")
    row2 = Table([[cells[3], cells[4], cells[5]]], colWidths=[2.3 * inch] * 3, hAlign="CENTER")
    for t in (row1, row2):
        t.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), BOX_BG),
                    ("BOX", (0, 0), (0, 0), 0.8, ACCENT),
                    ("BOX", (1, 0), (1, 0), 0.8, ACCENT),
                    ("BOX", (2, 0), (2, 0), 0.8, ACCENT),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ]
            )
        )
    story.append(row1)
    story.append(Paragraph("↓ domain / site often points here ↓", s["center"]))
    story.append(row2)
    story.append(Spacer(1, 8))
    story.append(
        _box(
            "Common links: Email domain → website DNS · Website → Google listing website field · "
            "Google listing ↔ Meta location tags · POS menu / hours → DoorDash (if integrated, change hours in POS first).",
            s["warn"],
            BOX_BG,
        )
    )
    story.append(
        Paragraph(
            f"Use with the Digital Account Handoff Checklist. Last checked: {LAST_CHECKED}. "
            "Jade Zhao · independent guide.",
            s["foot"],
        )
    )
    doc.build(story)
    return path


def mirror_packet_pdfs() -> None:
    """Copy checklist + map into matchaxmoxie so both hubs share the front of the packet."""
    if not MATCHA_OUT.parent.exists():
        return
    MATCHA_OUT.mkdir(parents=True, exist_ok=True)
    for name in ("handoff-checklist.pdf", "handoff-who-owns-what.pdf"):
        src = OUT / name
        if src.exists():
            shutil.copy2(src, MATCHA_OUT / name)
            print(f"mirrored {MATCHA_OUT / name}")


def main() -> None:
    s = styles()
    for item in SOP_SHEETS:
        path = make_sop_pdf(item, s)
        print(f"wrote {path} ({path.stat().st_size} bytes)")
    for item in SIMPLE_SHEETS:
        path = make_simple_pdf(item, s)
        print(f"wrote {path} ({path.stat().st_size} bytes)")
    path = make_checklist_pdf(s)
    print(f"wrote {path} ({path.stat().st_size} bytes)")
    path = make_who_owns_what_pdf(s)
    print(f"wrote {path} ({path.stat().st_size} bytes)")
    mirror_packet_pdfs()


if __name__ == "__main__":
    main()
