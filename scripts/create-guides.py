"""Build the downloadable Kaeduas and ORUVI portfolio brand books.

Requires: pip install reportlab pillow
Run from repository root: python scripts/create-guides.py
"""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "downloads"
ART = ROOT / "public" / "design-work"
OUT.mkdir(parents=True, exist_ok=True)
W, H = A4
FONT = Path("/usr/share/fonts/truetype/dejavu")
pdfmetrics.registerFont(TTFont("BookSans", str(FONT / "DejaVuSans.ttf")))
pdfmetrics.registerFont(TTFont("BookSans-Bold", str(FONT / "DejaVuSans-Bold.ttf")))
pdfmetrics.registerFont(TTFont("BookSerif", str(FONT / "DejaVuSerif.ttf")))
pdfmetrics.registerFont(TTFont("BookMono", str(FONT / "DejaVuSansMono.ttf")))

INK = colors.HexColor("#0B0B0C")
CARBON = colors.HexColor("#141416")
GRAPHITE = colors.HexColor("#232327")
BONE = colors.HexColor("#F2F0EB")
MIST = colors.HexColor("#B9B9C0")
ASH = colors.HexColor("#8A8A92")
EMBER = colors.HexColor("#D9612F")
EMBER_DEEP = colors.HexColor("#9E3F1E")
ORUVI_INK = colors.HexColor("#183C34")
ORUVI_DEEP = colors.HexColor("#102B26")
ORUVI_CREAM = colors.HexColor("#F4EFDF")
ORUVI_ORANGE = colors.HexColor("#E65B3A")
ORUVI_LIME = colors.HexColor("#DCE989")
ORUVI_PALE = colors.HexColor("#E9DFC7")


def set_fill(c, color):
    c.setFillColor(color)


def strata(c, x, y, scale=1, color=BONE):
    c.setFillColor(color)
    for i in range(4):
        c.roundRect(x + (i % 2) * 9 * scale, y - i * 15 * scale,
                    48 * scale, 11 * scale, 1.1 * scale, fill=1, stroke=0)


def oruvi_mark(c, x, y, scale=1, color=ORUVI_INK):
    c.setStrokeColor(color)
    c.setLineWidth(1.5 * scale)
    c.circle(x + 19 * scale, y + 19 * scale, 18 * scale, fill=0, stroke=1)
    c.setFillColor(color)
    p = c.beginPath()
    p.moveTo(x + 8 * scale, y + 18 * scale)
    p.curveTo(x + 11 * scale, y + 34 * scale, x + 27 * scale, y + 37 * scale, x + 31 * scale, y + 27 * scale)
    p.curveTo(x + 28 * scale, y + 15 * scale, x + 18 * scale, y + 12 * scale, x + 8 * scale, y + 18 * scale)
    c.drawPath(p, fill=1, stroke=0)
    c.setStrokeColor(ORUVI_CREAM if color != ORUVI_CREAM else ORUVI_INK)
    c.setLineWidth(1 * scale)
    c.line(x + 9 * scale, y + 18 * scale, x + 29 * scale, y + 28 * scale)
    c.setFillColor(color)
    c.setFont("BookSans-Bold", 25 * scale)
    c.drawString(x + 48 * scale, y + 11 * scale, "ORUVI")


def base_page(c, dark=True, label="", page=1, total=8):
    c.setFillColor(INK if dark else ORUVI_CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    main = BONE if dark else ORUVI_INK
    mute = ASH if dark else colors.HexColor("#6D766A")
    accent = EMBER if dark else ORUVI_ORANGE
    c.setFillColor(accent)
    c.setFont("BookMono", 8)
    c.drawString(48, H - 43, label.upper())
    c.setStrokeColor(GRAPHITE if dark else colors.HexColor("#D7D0BE"))
    c.setLineWidth(.6)
    c.line(48, 38, W - 48, 38)
    c.setFillColor(mute)
    c.setFont("BookMono", 7)
    c.drawString(48, 24, "KAEDUAS  /  CREATIVE PRACTICE" if dark else "ORUVI  /  SELF-INITIATED SPEC CONCEPT")
    c.drawRightString(W - 48, 24, f"{page:02d}  /  {total:02d}")
    return main, mute, accent


def heading(c, title, x=48, y=None, size=28, color=BONE, max_width=None):
    y = y if y is not None else H - 112
    c.setFillColor(color)
    c.setFont("BookSans-Bold", size)
    lines = []
    for source_line in title.splitlines() or [title]:
        if not max_width or pdfmetrics.stringWidth(source_line, "BookSans-Bold", size) <= max_width:
            lines.append(source_line)
            continue
        # Keep headings deliberate; wrap at spaces.
        line = ""
        for word in source_line.split():
            trial = f"{line} {word}".strip()
            if pdfmetrics.stringWidth(trial, "BookSans-Bold", size) > max_width and line:
                lines.append(line)
                line = word
            else:
                line = trial
        if line:
            lines.append(line)
    for text_line in lines:
        c.drawString(x, y, text_line)
        y -= size * 1.22
    return y - size * .25


def para(c, text, x, y, width, *, dark=True, size=10, leading=16, color=None, font="BookSans"):
    color = color or (MIST if dark else ORUVI_INK)
    style = ParagraphStyle("p", fontName=font, fontSize=size, leading=leading,
                           textColor=color, spaceAfter=0, allowWidows=0, allowOrphans=0)
    p = Paragraph(text, style)
    _, h = p.wrap(width, H)
    p.drawOn(c, x, y - h)
    return y - h


def label(c, text, x, y, color=EMBER, size=8):
    c.setFillColor(color); c.setFont("BookMono", size); c.drawString(x, y, text.upper())


def rule(c, x, y, width, dark=True, color=None):
    c.setStrokeColor(color or (GRAPHITE if dark else colors.HexColor("#D7D0BE")))
    c.setLineWidth(.7); c.line(x, y, x + width, y)


def swatch(c, x, y, color, title, hex_value, dark=True, width=145, height=92):
    c.setFillColor(color); c.roundRect(x, y, width, height, 5, fill=1, stroke=0)
    fg = INK if color in (BONE, ORUVI_CREAM, ORUVI_LIME, ORUVI_PALE) else BONE
    c.setFillColor(fg); c.setFont("BookSans-Bold", 9); c.drawString(x + 10, y + 28, title)
    c.setFont("BookMono", 7); c.drawString(x + 10, y + 13, hex_value)


def image_contain(c, path, x, y, width, height, bg=None):
    if bg:
        c.setFillColor(bg); c.roundRect(x, y, width, height, 5, fill=1, stroke=0)
    img = ImageReader(str(path))
    iw, ih = img.getSize()
    scale = min(width / iw, height / ih)
    dw, dh = iw * scale, ih * scale
    c.drawImage(img, x + (width - dw) / 2, y + (height - dh) / 2,
                width=dw, height=dh, preserveAspectRatio=True, mask="auto")


def kaeduas_book(path):
    c = Canvas(str(path), pagesize=A4, pageCompression=1)
    c.setTitle("Kaeduas Creative Brand Guide — Version 02")
    c.setAuthor("Kaeduas · Qophe Junior Motsamai")
    # 01 Cover
    c.setFillColor(INK); c.rect(0, 0, W, H, fill=1, stroke=0)
    strata(c, 54, H - 95, 1.5, BONE)
    c.setFillColor(EMBER); c.setFont("BookMono", 9); c.drawString(54, H - 193, "CREATIVE BRAND GUIDE  /  VERSION 02")
    c.setFillColor(BONE); c.setFont("BookSans-Bold", 38); c.drawString(54, H - 264, "KAEDUAS")
    c.setFillColor(MIST); c.setFont("BookSerif", 20); c.drawString(54, H - 301, "Make every detail earn attention.")
    c.setStrokeColor(GRAPHITE); c.line(54, H - 335, W - 54, H - 335)
    for i, s in enumerate(["GRAPHIC DESIGN", "SOCIAL CONTENT STRATEGY", "GENERATIVE VIDEO"]):
        c.setFillColor(BONE if i == 0 else MIST); c.setFont("BookMono", 10)
        c.drawString(54, H - 374 - i * 25, s)
        c.setFillColor(EMBER); c.circle(41, H - 370 - i * 25, 2.2, fill=1, stroke=0)
    c.setFillColor(ASH); c.setFont("BookMono", 8); c.drawString(54, 56, "SOUTH AFRICA  /  WORKING WORLDWIDE  /  2026")
    c.showPage()
    # 02 Position
    main, mute, accent = base_page(c, True, "01 — Position", 2)
    # Set this headline explicitly to control its two-line composition.
    c.setFillColor(BONE); c.setFont("BookSans-Bold", 29)
    c.drawString(48, H - 112, "A creative practice,")
    c.drawString(48, H - 151, "with a clear point of view.")
    label(c, "The idea", 48, H - 209)
    para(c, "Kaeduas is the creative practice of Qophe Junior Motsamai. It brings graphic design, social content strategy and generative video together through one human-led process — from the first idea to the final, finished piece.", 48, H - 230, W - 96, size=12, leading=19)
    rule(c, 48, H - 355, W - 96)
    label(c, "The promise", 48, H - 389)
    c.setFillColor(EMBER); c.setFont("BookSerif", 25); c.drawString(48, H - 426, "Clear ideas. Considered craft.")
    c.drawString(48, H - 460, "Work made to connect.")
    para(c, "Small by design. Direct collaboration with the person shaping the work, without layers between the brief and the making.", 48, H - 509, 380, size=10.5, leading=17)
    c.showPage()
    # 03 Offers
    main, mute, accent = base_page(c, True, "02 — What we make", 3)
    heading(c, "Three ways to shape\na brand story.", size=28)
    rows = [
      ("01", "GRAPHIC DESIGN", "Visual identity and campaign design across digital, print, packaging, point-of-sale and retail environments."),
      ("02", "SOCIAL CONTENT STRATEGY", "Platform-aware ideas, hooks and adaptable formats that help a brand show up consistently and grow across social channels."),
      ("03", "GENERATIVE VIDEO", "Human-directed short-form films. Photography, live-action production, generated imagery, art direction and editing are selected for the brief."),
    ]
    y = H - 254
    for idx, title, body in rows:
        c.setFillColor(EMBER); c.setFont("BookMono", 9); c.drawString(48, y, idx)
        c.setFillColor(BONE); c.setFont("BookSans-Bold", 13); c.drawString(89, y, title)
        para(c, body, 89, y - 18, W - 150, size=9.5, leading=14)
        y -= 138
        rule(c, 89, y + 12, W - 137)
    c.setFillColor(ASH); c.setFont("BookSerif", 13); c.drawString(48, 109, "One clear brief. One considered response.")
    c.showPage()
    # 04 How we work
    base_page(c, True, "03 — The approach", 4)
    heading(c, "Human judgement.\nHands-on making.", size=29)
    para(c, "Generative tools are one material in the process — not the creative lead. The idea, direction, selection and finish stay in human hands.", 48, H - 205, W - 100, size=12, leading=19)
    steps = [
      ("01", "LISTEN", "Understand the audience, context and outcome the work needs to serve."),
      ("02", "SET DIRECTION", "Choose a visual route, tone and set of deliverables before production begins."),
      ("03", "MAKE", "Design, shoot, generate, write, build or combine the right methods for the brief."),
      ("04", "REFINE", "Review the work with care; adjust the details that change how it reads."),
      ("05", "HAND OVER", "Deliver finished assets in practical formats for the places they will appear."),
    ]
    y = H - 320
    for n, title, body in steps:
        c.setFillColor(EMBER); c.setFont("BookMono", 9); c.drawString(48, y, n)
        c.setFillColor(BONE); c.setFont("BookSans-Bold", 10); c.drawString(90, y, title)
        para(c, body, 196, y + 2, W - 244, size=8.5, leading=12)
        y -= 83
    c.showPage()
    # 05 Visual identity
    base_page(c, True, "04 — Visual identity", 5)
    heading(c, "The Strata mark,\nkept intact.", size=28)
    strata(c, 51, H - 250, 1.85, BONE)
    para(c, "The stepped mark is a recognisable part of Kaeduas. Keep its proportions, spacing and direction consistent. Use the supplied master artwork; do not redraw or decorate it.", 218, H - 207, W - 267, size=9.5, leading=15)
    label(c, "Core palette", 48, H - 367)
    swatch(c, 48, H - 487, INK, "INK", "#0B0B0C")
    swatch(c, 211, H - 487, BONE, "BONE", "#F2F0EB")
    swatch(c, 374, H - 487, EMBER, "EMBER", "#D9612F")
    swatch(c, 48, H - 600, CARBON, "CARBON", "#141416")
    swatch(c, 211, H - 600, MIST, "MIST", "#B9B9C0")
    para(c, "Ink and Bone carry the visual world. Ember is a deliberate accent — use it to focus attention, not fill every surface. Check contrast whenever text sits on colour.", 48, H - 634, W - 96, size=9.5, leading=15)
    c.showPage()
    # 06 Type and voice
    base_page(c, True, "05 — Type & voice", 6)
    heading(c, "Direct. Warm.\nNever padded.", size=29)
    label(c, "Type roles", 48, H - 213)
    c.setFillColor(BONE); c.setFont("BookSans-Bold", 23); c.drawString(48, H - 253, "Archivo")
    c.setFillColor(MIST); c.setFont("BookSerif", 20); c.drawString(48, H - 291, "Instrument Serif")
    c.setFillColor(ASH); c.setFont("BookMono", 10); c.drawString(48, H - 321, "JETBRAINS MONO  /  UTILITY LABELS")
    rule(c, 48, H - 348, W - 96)
    label(c, "Voice rules", 48, H - 380)
    voice = ["Lead with the point, not the preamble.", "Use plain language; explain craft without jargon.", "Be confident, not inflated.", "Keep headlines short enough to remember.", "Credit concept work honestly; never imply a client relationship that did not happen."]
    y = H - 418
    for line in voice:
        c.setFillColor(EMBER); c.circle(54, y + 3, 2.1, fill=1, stroke=0)
        c.setFillColor(MIST); c.setFont("BookSans", 10); c.drawString(68, y, line)
        y -= 36
    c.showPage()
    # 07 Application preview
    base_page(c, True, "06 — In use", 7)
    heading(c, "One identity.\nMade to live beyond the screen.", size=26)
    image_contain(c, ART / "kaeduas-applications-branded.jpg", 48, H - 465, W - 96, 272, CARBON)
    label(c, "KAEDUAS · STUDIO GOODS / APPLICATION STUDY", 48, H - 492, EMBER)
    para(c, "The strata identity carried onto studio apparel and a mailer. A self-initiated photographic mockup showing how the Kaeduas system can move into physical touchpoints.", 48, H - 516, W - 96, size=9.5, leading=14)
    rule(c, 48, 248, W - 96)
    label(c, "Application decisions", 48, 226)
    for x, title, body in [
      (48, "APPAREL", "A strong, simple mark on dark fabric."),
      (220, "PACKAGING", "Bone stock keeps the mailer quiet."),
      (392, "IDENTITY", "The Strata lockup stays intact."),
    ]:
        label(c, title, x, 197, EMBER, 7)
        para(c, body, x, 181, 145, size=7.5, leading=10)
    c.setFillColor(ASH); c.setFont("BookSerif", 11); c.drawString(48, 83, "The full system stays consistent from screen to object.")
    c.showPage()
    # 08 Close
    base_page(c, True, "07 — Commission a guide", 8)
    strata(c, 49, H - 126, 1.05, BONE)
    heading(c, "Make the brand\neasier to recognise.", y=H - 208, size=29)
    para(c, "A useful brand guide turns good creative decisions into a system your team can use. It can cover positioning, voice, logo use, type, colour and real applications — scoped to what your brand needs.", 48, H - 322, W - 96, size=11, leading=18)
    label(c, "Start a conversation", 48, H - 462)
    c.setFillColor(BONE); c.setFont("BookSans-Bold", 15); c.drawString(48, H - 494, "motsamai.main@gmail.com")
    c.setFillColor(EMBER); c.setFont("BookSans", 11); c.drawString(48, H - 521, "+27 67 236 3235  /  WhatsApp")
    rule(c, 48, H - 557, W - 96)
    para(c, "Prepared by Kaeduas · Qophe Junior Motsamai · South Africa · 2026", 48, H - 582, W - 96, size=8.5)
    c.showPage(); c.save()


def oruvi_book(path):
    c = Canvas(str(path), pagesize=A4, pageCompression=1)
    c.setTitle("ORUVI — Self-initiated Spec Concept Guide")
    c.setAuthor("Kaeduas · Qophe Junior Motsamai")
    # 01 Cover
    c.setFillColor(ORUVI_INK); c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(ORUVI_LIME); c.circle(W - 110, H - 152, 74, fill=1, stroke=0)
    oruvi_mark(c, 50, H - 106, 1.1, ORUVI_CREAM)
    c.setFillColor(ORUVI_CREAM); c.setFont("BookSans-Bold", 35); c.drawString(50, H - 280, "A LITTLE BRIGHTER.")
    c.setFillColor(ORUVI_LIME); c.setFont("BookSerif", 22); c.drawString(50, H - 318, "ORUVI  /  BOTANICAL SODA")
    c.setStrokeColor(ORUVI_LIME); c.line(50, H - 352, W - 50, H - 352)
    c.setFillColor(ORUVI_CREAM); c.setFont("BookMono", 9); c.drawString(50, H - 384, "SELF-INITIATED SPEC CONCEPT  /  BRAND GUIDE")
    image_contain(c, ART / "oruvi-packaging.jpg", 302, 93, 244, 370)
    c.setFillColor(ORUVI_CREAM); c.setFont("BookMono", 8); c.drawString(50, 62, "PORTFOLIO STUDY BY KAEDUAS  /  2026")
    c.showPage()
    # 02 Idea
    main, mute, accent = base_page(c, False, "01 — The idea", 2)
    c.setFillColor(ORUVI_ORANGE); c.setFont("BookMono", 8); c.drawString(48, H - 43, "01 — THE IDEA")
    c.setFillColor(ORUVI_INK); c.setFont("BookSans-Bold", 30); c.drawString(48, H - 115, "A pause with a little sparkle.")
    label(c, "What it is", 48, H - 164, ORUVI_ORANGE)
    para(c, "ORUVI is a self-initiated spec concept for a botanical soda brand: a bright, grown-up drink proposition built around grapefruit and buchu, for the in-between moments of a day.", 48, H - 185, W - 96, dark=False, size=11, leading=18)
    rule(c, 48, H - 278, W - 96, dark=False)
    label(c, "Positioning", 48, H - 310, ORUVI_ORANGE)
    c.setFillColor(ORUVI_INK); c.setFont("BookSerif", 20); c.drawString(48, H - 344, "An easy, bright break in a busy day.")
    para(c, "The concept lives between everyday refreshment and a small personal ritual — not a wellness promise, not a special-occasion drink.", 48, H - 375, W - 110, dark=False, size=10, leading=16)
    label(c, "For", 48, H - 459, ORUVI_ORANGE)
    para(c, "Curious, design-aware people looking for flavour, personality and a good-looking can they can pick up without overthinking it.", 48, H - 480, 230, dark=False, size=9.5, leading=15)
    label(c, "The promise", 319, H - 459, ORUVI_ORANGE)
    para(c, "Bright flavour, easy energy, a small change of pace. Never a health claim; never a lecture.", 319, H - 480, 225, dark=False, size=9.5, leading=15)
    c.showPage()
    # 03 identity and palette
    base_page(c, False, "02 — Identity", 3)
    c.setFillColor(ORUVI_ORANGE); c.setFont("BookMono", 8); c.drawString(48, H - 43, "02 — IDENTITY")
    c.setFillColor(ORUVI_INK); c.setFont("BookSans-Bold", 29); c.drawString(48, H - 110, "A seed mark. A lively wordmark.")
    oruvi_mark(c, 70, H - 226, 1.8, ORUVI_INK)
    para(c, "The simple seed inside a ring suggests a botanical starting point without illustrating a literal ingredient. The open, rounded geometry keeps the identity friendly and easy to recognise at small sizes.", 48, H - 276, W - 96, dark=False, size=10, leading=16)
    label(c, "Palette", 48, H - 378, ORUVI_ORANGE)
    swatch(c, 48, H - 505, ORUVI_INK, "BOTTLE GREEN", "#183C34", dark=False, width=116, height=93)
    swatch(c, 179, H - 505, ORUVI_CREAM, "WARM CREAM", "#F4EFDF", dark=False, width=116, height=93)
    swatch(c, 310, H - 505, ORUVI_ORANGE, "CITRUS", "#E65B3A", dark=False, width=116, height=93)
    swatch(c, 441, H - 505, ORUVI_LIME, "LEAF", "#DCE989", dark=False, width=106, height=93)
    para(c, "Use Bottle Green for structure, Warm Cream for breathing room, Citrus to create a focal point and Leaf as a sparing burst of energy. Do not use all accents at equal volume.", 48, H - 540, W - 96, dark=False, size=9.5, leading=15)
    c.showPage()
    # 04 voice
    base_page(c, False, "03 — Type & voice", 4)
    c.setFillColor(ORUVI_ORANGE); c.setFont("BookMono", 8); c.drawString(48, H - 43, "03 — TYPE & VOICE")
    c.setFillColor(ORUVI_INK); c.setFont("BookSans-Bold", 29); c.drawString(48, H - 112, "Playful, not childish.")
    c.setFillColor(ORUVI_INK); c.setFont("BookSans-Bold", 22); c.drawString(48, H - 174, "Archivo  /  headlines & labels")
    c.setFillColor(ORUVI_INK); c.setFont("BookSerif", 19); c.drawString(48, H - 209, "Instrument Serif  /  moments of warmth")
    rule(c, 48, H - 239, W - 96, dark=False)
    label(c, "Voice", 48, H - 273, ORUVI_ORANGE)
    for n,(a,b) in enumerate([
      ("Bright", "Light on its feet; never shouty."),
      ("Specific", "Talk about flavour, texture and the moment."),
      ("Unfussy", "No wellness promises, jargon or fake urgency."),
    ]):
        y = H - 322 - n * 86
        c.setFillColor(ORUVI_INK); c.setFont("BookSans-Bold", 15); c.drawString(48, y, a)
        c.setFillColor(colors.HexColor("#69746B")); c.setFont("BookSans", 10); c.drawString(190, y, b)
    c.setFillColor(ORUVI_ORANGE); c.setFont("BookSerif", 20); c.drawString(48, H - 608, "Open a little brighter.")
    para(c, "A sample line: “Take the long way.” Short enough for a can, a post, a poster or the first thing you notice from across a shop.", 48, H - 637, W - 96, dark=False, size=10, leading=16)
    c.showPage()
    # 05 digital and print
    base_page(c, False, "04 — Digital & print", 5)
    c.setFillColor(ORUVI_ORANGE); c.setFont("BookMono", 8); c.drawString(48, H - 43, "04 — DIGITAL & PRINT")
    c.setFillColor(ORUVI_INK); c.setFont("BookSans-Bold", 28); c.drawString(48, H - 108, "Give the idea room to land.")
    image_contain(c, ART / "oruvi-digital.jpg", 52, 304, 212, 345, ORUVI_LIME)
    image_contain(c, ART / "oruvi-print.jpg", 282, 304, 261, 345, ORUVI_INK)
    label(c, "Digital", 52, 280, ORUVI_ORANGE)
    label(c, "Print", 282, 280, ORUVI_ORANGE)
    para(c, "One strong thought. One flavour cue. Built for a thumb-first feed.", 52, 263, 212, dark=False, size=8.5, leading=12)
    para(c, "A photographic poster with confident hierarchy, readable at a glance and considered up close.", 282, 263, 260, dark=False, size=8.5, leading=12)
    c.showPage()
    # 06 pack
    base_page(c, False, "05 — Packaging", 6)
    c.setFillColor(ORUVI_ORANGE); c.setFont("BookMono", 8); c.drawString(48, H - 43, "05 — PACKAGING")
    c.setFillColor(ORUVI_INK); c.setFont("BookSans-Bold", 27); c.drawString(48, H - 109, "A distinctive can, easy to read.")
    image_contain(c, ART / "oruvi-packaging.jpg", 78, 100, 439, 580)
    c.setFillColor(ORUVI_INK); c.setFont("BookSerif", 14); c.drawString(48, 78, "Three colourways; one photographic product family.")
    c.showPage()
    # 07 in-store
    base_page(c, False, "06 — In store", 7)
    c.setFillColor(ORUVI_ORANGE); c.setFont("BookMono", 8); c.drawString(48, H - 43, "06 — IN STORE")
    c.setFillColor(ORUVI_INK); c.setFont("BookSans-Bold", 28); c.drawString(48, H - 109, "The brand, in the room.")
    image_contain(c, ART / "oruvi-point-of-sale.jpg", 48, H - 390, W - 96, 242, ORUVI_PALE)
    label(c, "Point-of-sale · counter display", 48, H - 414, ORUVI_ORANGE)
    image_contain(c, ART / "oruvi-retail-branded.jpg", 48, H - 678, W - 96, 242, ORUVI_PALE)
    label(c, "Retail activation · tasting experience", 48, H - 702, ORUVI_ORANGE)
    c.showPage()
    # 08 scope and disclosure
    base_page(c, False, "07 — Concept notes", 8)
    c.setFillColor(ORUVI_ORANGE); c.setFont("BookMono", 8); c.drawString(48, H - 43, "07 — CONCEPT NOTES")
    c.setFillColor(ORUVI_INK); c.setFont("BookSans-Bold", 29); c.drawString(48, H - 113, "One idea, carried through.")
    para(c, "The identity is designed to move between a social post, a printed poster, a can, a counter display and a small in-store experience without losing its voice.", 48, H - 159, W - 96, dark=False, size=11, leading=18)
    label(c, "The system", 48, H - 264, ORUVI_ORANGE)
    for i,(t,d) in enumerate([
      ("01 / RECOGNISE", "The seed symbol and ORUVI wordmark lead."),
      ("02 / READ", "Short copy and high contrast make the message quick."),
      ("03 / REMEMBER", "Citrus geometry and alternating colourways create rhythm."),
    ]):
        y=H-305-i*69
        c.setFillColor(ORUVI_INK); c.setFont("BookSans-Bold", 9); c.drawString(48,y,t)
        c.setFillColor(colors.HexColor("#69746B")); c.setFont("BookSans", 9); c.drawString(195,y,d)
    c.setFillColor(colors.HexColor("#F7E2DC")); c.roundRect(48, 80, W-96, 126, 5, fill=1, stroke=0)
    c.setFillColor(ORUVI_INK); c.setFont("BookSans-Bold", 10); c.drawString(64, 181, "SELF-INITIATED SPEC CONCEPT · NOT CLIENT WORK")
    para(c, "ORUVI and the product proposition are portfolio-only concept work, not a commissioned client project. The product is not on sale. Name, formulation, claims and trademark clearance would need to be resolved before any commercial use.", 64, 166, W-128, dark=False, size=8.5, leading=12, color=ORUVI_INK)
    c.showPage(); c.save()


kaeduas_book(OUT / "Kaeduas_Creative_Brand_Guide_v02.pdf")
oruvi_book(OUT / "ORUVI_Spec_Concept_Brand_Guide.pdf")
print("Created two portfolio brand guides in", OUT)
