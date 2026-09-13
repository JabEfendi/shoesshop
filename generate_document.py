import sys
sys.path.insert(0, r'd:\Project\SHOESshop\pylibs')

import os
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib import colors
from reportlab.lib.colors import HexColor, white, black, Color
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Image, KeepTogether, HRFlowable, ListFlowable, ListItem
)
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Circle
from reportlab.graphics.charts.barcharts import HorizontalBarChart
from reportlab.graphics import renderPDF

# ============================================================
# KONFIGURASI DOKUMEN
# ============================================================
OUTPUT_PATH = r'd:\Project\SHOESshop\Dokumen_Moodboard_dan_SDLC_Sepatu_Kulit.pdf'

doc = SimpleDocTemplate(
    OUTPUT_PATH,
    pagesize=A4,
    topMargin=2 * cm,
    bottomMargin=2 * cm,
    leftMargin=2 * cm,
    rightMargin=2 * cm,
    title="Moodboard & SDLC - Website Sepatu Kulit Custom",
    author="Tim Pengembang SHOESshop"
)

# ============================================================
# DEFINISI WARNA GLOBAL
# ============================================================
NAVY = HexColor('#1B2A4A')
CHARCOAL = HexColor('#2C2C2C')
WARM_BROWN = HexColor('#5C4033')
GOLD = HexColor('#C9A962')
CREAM = HexColor('#F7F3EC')
LIGHT_GRAY = HexColor('#F4F4F4')
MEDIUM_GRAY = HexColor('#999999')
DARK_GRAY = HexColor('#333333')
ACCENT_GREEN = HexColor('#4A7C59')
ACCENT_RUST = HexColor('#B7410E')
ACCENT_BLUE = HexColor('#3A7CA5')

# ============================================================
# STYLE PARAGRAF
# ============================================================
styles = getSampleStyleSheet()

def create_styles():
    s = {}

    s['CoverTitle'] = ParagraphStyle(
        'CoverTitle', parent=styles['Title'],
        fontName='Helvetica-Bold', fontSize=36, leading=42,
        textColor=white, alignment=TA_CENTER, spaceAfter=6 * mm
    )
    s['CoverSubtitle'] = ParagraphStyle(
        'CoverSubtitle', parent=styles['Normal'],
        fontName='Helvetica', fontSize=16, leading=22,
        textColor=HexColor('#E0D5C0'), alignment=TA_CENTER, spaceAfter=20 * mm
    )
    s['CoverMeta'] = ParagraphStyle(
        'CoverMeta', parent=styles['Normal'],
        fontName='Helvetica', fontSize=12, leading=18,
        textColor=HexColor('#C0B8A8'), alignment=TA_CENTER
    )

    s['H0'] = ParagraphStyle(
        'H0', parent=styles['Title'],
        fontName='Helvetica-Bold', fontSize=28, leading=34,
        textColor=NAVY, alignment=TA_LEFT, spaceAfter=8 * mm, spaceBefore=4 * mm
    )
    s['H1'] = ParagraphStyle(
        'H1', parent=styles['Heading1'],
        fontName='Helvetica-Bold', fontSize=22, leading=28,
        textColor=NAVY, alignment=TA_LEFT, spaceAfter=6 * mm, spaceBefore=10 * mm
    )
    s['H2'] = ParagraphStyle(
        'H2', parent=styles['Heading2'],
        fontName='Helvetica-Bold', fontSize=17, leading=22,
        textColor=WARM_BROWN, alignment=TA_LEFT, spaceAfter=4 * mm, spaceBefore=6 * mm
    )
    s['H3'] = ParagraphStyle(
        'H3', parent=styles['Heading3'],
        fontName='Helvetica-Bold', fontSize=13, leading=17,
        textColor=CHARCOAL, alignment=TA_LEFT, spaceAfter=2 * mm, spaceBefore=4 * mm
    )
    s['Body'] = ParagraphStyle(
        'Body', parent=styles['Normal'],
        fontName='Helvetica', fontSize=11, leading=16,
        textColor=DARK_GRAY, alignment=TA_JUSTIFY, spaceAfter=3 * mm
    )
    s['BodyBold'] = ParagraphStyle(
        'BodyBold', parent=s['Body'],
        fontName='Helvetica-Bold'
    )
    s['Bullet'] = ParagraphStyle(
        'Bullet', parent=s['Body'],
        leftIndent=8 * mm, bulletIndent=3 * mm, spaceAfter=2 * mm
    )
    s['BulletBold'] = ParagraphStyle(
        'BulletBold', parent=s['Bullet'],
        fontName='Helvetica-Bold'
    )
    s['Caption'] = ParagraphStyle(
        'Caption', parent=styles['Normal'],
        fontName='Helvetica-Oblique', fontSize=9, leading=13,
        textColor=MEDIUM_GRAY, alignment=TA_CENTER, spaceAfter=4 * mm
    )
    s['Tag'] = ParagraphStyle(
        'Tag', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=9, leading=12,
        textColor=white, alignment=TA_CENTER
    )
    s['PhaseTitle'] = ParagraphStyle(
        'PhaseTitle', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=14, leading=18,
        textColor=white, alignment=TA_LEFT
    )
    s['PhaseMeta'] = ParagraphStyle(
        'PhaseMeta', parent=styles['Normal'],
        fontName='Helvetica', fontSize=10, leading=14,
        textColor=HexColor('#E8E0D0'), alignment=TA_LEFT
    )
    s['TableCell'] = ParagraphStyle(
        'TableCell', parent=styles['Normal'],
        fontName='Helvetica', fontSize=9.5, leading=13,
        textColor=DARK_GRAY, alignment=TA_LEFT
    )
    s['TableCellBold'] = ParagraphStyle(
        'TableCellBold', parent=s['TableCell'],
        fontName='Helvetica-Bold', textColor=NAVY
    )
    s['QuoteBox'] = ParagraphStyle(
        'QuoteBox', parent=styles['Normal'],
        fontName='Helvetica-Oblique', fontSize=11, leading=16,
        textColor=CHARCOAL, alignment=TA_CENTER,
        leftIndent=6 * mm, rightIndent=6 * mm, spaceAfter=4 * mm, spaceBefore=4 * mm
    )
    s['TOCEntry'] = ParagraphStyle(
        'TOCEntry', parent=styles['Normal'],
        fontName='Helvetica', fontSize=12, leading=22,
        textColor=DARK_GRAY, leftIndent=4 * mm
    )
    s['TOCSection'] = ParagraphStyle(
        'TOCSection', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=13, leading=24,
        textColor=NAVY
    )
    s['PageNumber'] = ParagraphStyle(
        'PageNumber', parent=styles['Normal'],
        fontName='Helvetica', fontSize=9,
        textColor=MEDIUM_GRAY, alignment=TA_RIGHT
    )

    return s

STY = create_styles()

# ============================================================
# HELPER FUNCTIONS
# ============================================================
story = []

def add_spacer(h=5):
    story.append(Spacer(1, h * mm))

def add_hr(color=MEDIUM_GRAY, thickness=0.5, space_before=3, space_after=3):
    add_spacer(space_before)
    story.append(HRFlowable(width="100%", thickness=thickness, color=color, lineCap='round'))
    add_spacer(space_after)

def bullet_list(items, bold_prefix=False):
    flow_items = []
    for it in items:
        sty = STY['BulletBold'] if bold_prefix else STY['Bullet']
        txt = it
        flow_items.append(ListItem(Paragraph(txt, STY['Bullet'])))
    story.append(ListFlowable(flow_items, bulletType='bullet', start='\u2022',
                              leftIndent=8 * mm, bulletFontSize=10, bulletColor=GOLD))
    add_spacer(1)

def numbered_list(items):
    for i, it in enumerate(items, 1):
        story.append(Paragraph(f"<b>{i}.</b>  {it}", STY['Bullet']))
    add_spacer(1)

# ============================================================
# 1. COVER PAGE
# ============================================================
def build_cover():
    # Buat background cover pakai table
    W = A4[0] - 4 * cm

    cover_data = [
        [Spacer(1, 38 * mm)],
        [Paragraph("MOODBOARD & SDLC", STY['CoverTitle'])],
        [Paragraph("Dokumen Perancangan Website", STY['CoverSubtitle'])],
        [Paragraph("E-Commerce & Custom Leather Shoes", STY['CoverSubtitle'])],
        [add_hr_cover()],
        [Paragraph("Klien: Foot Fashion - Brand Sepatu Kulit", STY['CoverMeta'])],
        [Paragraph("Target Pasar: Gen Z & Millennials (Pria)", STY['CoverMeta'])],
        [Paragraph("Positioning: Daily Casual Leather", STY['CoverMeta'])],
        [Spacer(1, 22 * mm)],
        [Paragraph(f"Tanggal: {datetime.now().strftime('%d %B %Y')}", STY['CoverMeta'])],
        [Paragraph("Versi 1.0", STY['CoverMeta'])],
        [Spacer(1, 10 * mm)],
    ]
    cover_tbl = Table(cover_data, colWidths=[W])
    cover_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), NAVY),
        ('LEFTPADDING', (0, 0), (-1, -1), 15 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 15 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 4 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4 * mm),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('ROUNDEDCORNERS', [3 * mm, 3 * mm, 3 * mm, 3 * mm]),
    ]))

    # Tambahkan border emas luar (TANPA rowHeights fix, biar menyesuaikan isi)
    outer_data = [[cover_tbl]]
    outer_tbl = Table(outer_data, colWidths=[W + 2 * mm])
    outer_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), GOLD),
        ('LEFTPADDING', (0, 0), (-1, -1), 1 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 1 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 1 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1 * mm),
    ]))

    story.append(Spacer(1, 0))
    story.append(outer_tbl)
    story.append(PageBreak())

def add_hr_cover():
    tbl = Table([['']], colWidths=[60 * mm], rowHeights=[0.5 * mm])
    tbl.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), GOLD)]))
    return tbl

# ============================================================
# 2. TABLE OF CONTENTS
# ============================================================
def build_toc():
    story.append(Paragraph("DAFTAR ISI", STY['H0']))
    add_hr(GOLD, 1.5, 0, 6)

    toc_entries = [
        ("BAGIAN 1: PENDAHULUAN", True),
        ("1.1 Latar Belakang Proyek", False),
        ("1.2 Tujuan Dokumen", False),
        ("1.3 Ringkasan Kebutuhan Utama", False),
        ("BAGIAN 2: MOODBOARD DESIGN (3 PILIHAN)", True),
        ("2.1 Moodboard A — Modern Industrial Minimalist", False),
        ("2.2 Moodboard B — Warm Heritage Classic", False),
        ("2.3 Moodboard C — Urban Street Craft", False),
        ("2.4 Perbandingan & Rekomendasi", False),
        ("BAGIAN 3: SDLC (SOFTWARE DEVELOPMENT LIFE CYCLE)", True),
        ("3.1 Gambaran Umum SDLC 7 Fase", False),
        ("3.2 Fase 1 — Inisiasi & Perencanaan", False),
        ("3.3 Fase 2 — Analisis Kebutuhan", False),
        ("3.4 Fase 3 — Desain Sistem & UI/UX", False),
        ("3.5 Fase 4 — Pengembangan (Development)", False),
        ("3.6 Fase 5 — Pengujian (Testing)", False),
        ("3.7 Fase 6 — Implementasi & Peluncuran", False),
        ("3.8 Fase 7 — Pemeliharaan & Pengembangan Lanjutan", False),
        ("3.9 Linimasa Proyek & Milestone", False),
        ("3.10 Manajemen Risiko", False),
        ("BAGIAN 4: PENUTUP", True),
        ("4.1 Ringkasan Keseluruhan", False),
        ("4.2 Langkah Selanjutnya (Next Steps)", False),
    ]

    for title, is_section in toc_entries:
        style = STY['TOCSection'] if is_section else STY['TOCEntry']
        if is_section:
            add_spacer(2)
        story.append(Paragraph(title, style))

    story.append(PageBreak())

# ============================================================
# HELPER: Color Swatch Drawing
# ============================================================
def color_swatch_row(palette, width_mm=160):
    """
    palette: list of (hex_color, label_name)
    """
    n = len(palette)
    w = (width_mm * mm) / n
    h = 14 * mm
    d = Drawing(width_mm * mm, h + 8 * mm)
    x = 0
    for i, (hex_c, name) in enumerate(palette):
        c = HexColor(hex_c)
        d.add(Rect(x, 8 * mm, w, h, fillColor=c, strokeColor=white, strokeWidth=0.5))
        # Label
        is_dark = (c.red * 0.299 + c.green * 0.587 + c.blue * 0.114) < 0.5
        text_col = white if is_dark else HexColor('#222222')
        d.add(String(x + w / 2, 13 * mm, hex_c,
                     textAnchor='middle', fontSize=7.5,
                     fontName='Helvetica-Bold', fillColor=text_col))
        d.add(String(x + w / 2, 2 * mm, name,
                     textAnchor='middle', fontSize=8,
                     fontName='Helvetica', fillColor=DARK_GRAY))
        x += w
    return d

# ============================================================
# HELPER: UI Mock Card (Hero Preview mini)
# ============================================================
def ui_mock_card(title_tag, sub_text, bg_hex, accent_hex, text_hex, width_mm=160, height_mm=55):
    w = width_mm * mm
    h = height_mm * mm
    d = Drawing(w, h)
    # Background card
    d.add(Rect(0, 0, w, h, fillColor=HexColor(bg_hex), strokeColor=MEDIUM_GRAY,
               strokeWidth=0.5, rx=2 * mm, ry=2 * mm))

    # Navigation bar mini
    d.add(Rect(0, h - 9 * mm, w, 9 * mm,
               fillColor=HexColor(bg_hex), strokeColor=None,
               rx=2 * mm, ry=2 * mm))
    d.add(Line(0, h - 9 * mm, w, h - 9 * mm, strokeColor=MEDIUM_GRAY, strokeWidth=0.3))

    # Logo box
    d.add(Rect(4 * mm, h - 7.2 * mm, 14 * mm, 5.4 * mm,
               fillColor=HexColor(accent_hex), rx=1 * mm, ry=1 * mm, strokeColor=None))

    # Menu items
    for i, m_txt in enumerate(['HOME', 'SHOP', 'CUSTOM', 'OUR STORY']):
        d.add(String(22 * mm + i * 18 * mm, h - 5.8 * mm, m_txt,
                     textAnchor='start', fontSize=7, fontName='Helvetica-Bold',
                     fillColor=HexColor(text_hex)))

    # Hero title
    d.add(String(8 * mm, h - 22 * mm, title_tag,
                 textAnchor='start', fontSize=14, fontName='Helvetica-Bold',
                 fillColor=HexColor(text_hex)))

    # Hero subtitle
    d.add(Line(8 * mm, h - 26 * mm, 30 * mm, h - 26 * mm,
               strokeColor=HexColor(accent_hex), strokeWidth=1))
    for li_idx, line in enumerate(sub_text):
        d.add(String(8 * mm, h - 32 * mm - li_idx * 4 * mm, line,
                     textAnchor='start', fontSize=7.5, fontName='Helvetica',
                     fillColor=HexColor(text_hex)))

    # CTA Button
    d.add(Rect(8 * mm, 6 * mm, 28 * mm, 8 * mm,
               fillColor=HexColor(accent_hex), rx=1 * mm, ry=1 * mm, strokeColor=None))
    d.add(String(22 * mm, 9 * mm, "EXPLORE NOW",
                 textAnchor='middle', fontSize=8, fontName='Helvetica-Bold',
                 fillColor=white))

    # Preview image placeholder (kanan)
    ph_x = w - 50 * mm
    c_accent = HexColor(accent_hex)
    # Lighten: campur dengan putih 90% untuk efek "low opacity" yang aman
    light_fill = Color(
        c_accent.red * 0.10 + 0.90,
        c_accent.green * 0.10 + 0.90,
        c_accent.blue * 0.10 + 0.90
    )
    d.add(Rect(ph_x, 8 * mm, 42 * mm, 32 * mm,
               fillColor=light_fill,
               strokeColor=c_accent, strokeWidth=0.7,
               rx=2 * mm, ry=2 * mm))
    d.add(String(ph_x + 21 * mm, 23 * mm, "PRODUCT",
                 textAnchor='middle', fontSize=8, fontName='Helvetica-Bold',
                 fillColor=c_accent))
    d.add(String(ph_x + 21 * mm, 19 * mm, "PREVIEW",
                 textAnchor='middle', fontSize=8, fontName='Helvetica-Bold',
                 fillColor=c_accent))

    return d

# ============================================================
# 3. BAGIAN 1: PENDAHULUAN
# ============================================================
def build_intro():
    story.append(Paragraph("BAGIAN 1: PENDAHULUAN", STY['H0']))
    add_hr(NAVY, 1.5, 0, 8)

    # 1.1 Latar Belakang
    story.append(Paragraph("1.1 Latar Belakang Proyek", STY['H1']))
    story.append(Paragraph(
        "Dokumen ini disusun sebagai panduan resmi untuk perancangan dan pengembangan "
        "<b>Website E-Commerce &amp; Sepatu Kulit Custom</b> milik brand Foot Fashion. "
        "Proyek ini bertujuan membangun platform daring yang memungkinkan pembeli untuk "
        "tidak hanya membeli sepatu kulit yang sudah tersedia, tetapi juga <b>merancang "
        "sendiri detail sepatu</b> mulai dari motif kulit, warna benang jahit, bentuk "
        "outsole, hingga aksen kecil lainnya — semuanya dapat dipantau secara visual "
        "sebelum proses pemesanan dimulai.",
        STY['Body']
    ))
    story.append(Paragraph(
        "Proyek ini dikerjakan dengan prinsip <i>craftsmanship</i> (keahlian tangan) "
        "yang dijunjung tinggi, di mana setiap pasang sepatu diproduksi secara teliti "
        "dalam rentang waktu sekitar 1 minggu per pesanan.",
        STY['Body']
    ))

    # 1.2 Tujuan Dokumen
    story.append(Paragraph("1.2 Tujuan Dokumen", STY['H1']))
    numbered_list([
        "<b>Menyediakan 3 pilihan moodboard visual</b> agar tim klien dapat memilih arah "
        "desain antarmuka (UI) yang paling sesuai dengan karakter brand dan target pasar "
        "Gen Z/Millennials pria.",
        "<b>Menyusun SDLC (Software Development Life Cycle) yang terstruktur</b> dalam "
        "7 fase lengkap, beserta durasi, deliverable, milestone, dan manajemen risiko — "
        "sehingga alur pengerjaan jelas, terukur, dan dapat dipantau bersama.",
        "<b>Menjadi acuan bersama</b> antara tim pengembang dan klien sebelum memasuki "
        "tahap desain sistem (database, API) dan pemrograman — agar meminimalkan "
        "kesalahpahaman dan revisi besar di tengah jalan."
    ])

    # 1.3 Ringkasan Kebutuhan Utama
    story.append(Paragraph("1.3 Ringkasan Kebutuhan Utama", STY['H1']))
    story.append(Paragraph(
        "Berikut adalah ringkasan kebutuhan inti proyek berdasarkan dua dokumen analisis "
        "kebutuhan sebelumnya:",
        STY['Body']
    ))

    # Tabel Ringkasan
    data = [
        [Paragraph("<b>ASPEK</b>", STY['TableCellBold']),
         Paragraph("<b>DETAIL KEBUTUHAN</b>", STY['TableCellBold'])],
        [Paragraph("Model Produk", STY['TableCell']),
         Paragraph("5 model custom: <b>Boots, Chelsea Boots, Pantofel (Oxford), Docmart, Loafers</b>", STY['TableCell'])],
        [Paragraph("Elemen Kustomisasi", STY['TableCell']),
         Paragraph("8 elemen (berbeda tiap model): motif kulit sapi, warna benang jahitan kulit &amp; outsole, warna eyelet, panel elastis (Chelsea), tali sepatu, storm welt, bentuk outsole", STY['TableCell'])],
        [Paragraph("Visualisasi", STY['TableCell']),
         Paragraph("Target: <b>3D 360° interaktif</b>. Alternatif realistis (MVP): <b>2D layer bertumpuk</b>", STY['TableCell'])],
        [Paragraph("Skema Harga", STY['TableCell']),
         Paragraph("<b>Base Price per model</b> + tambahan harga per opsi elemen yang dipilih", STY['TableCell'])],
        [Paragraph("Produk Non-Custom", STY['TableCell']),
         Paragraph("Varian desain <b>pre-set (bukan stok fisik)</b> — preset desain dari kanvas customizer yang sama", STY['TableCell'])],
        [Paragraph("Sistem Ukuran", STY['TableCell']),
         Paragraph("Unggah <b>gambar/jejak telapak kaki</b> + size chart standar (EU/US/UK → cm) sebagai opsi cepat", STY['TableCell'])],
        [Paragraph("Pembayaran", STY['TableCell']),
         Paragraph("<b>DP 50%</b> saat Pre-Order → Pelunasan 50% saat sepatu selesai. Gateway: QRIS &amp; Virtual Account", STY['TableCell'])],
        [Paragraph("Pengiriman", STY['TableCell']),
         Paragraph("JNE, AnterAja, ID Express, SiCepat, Pos Indonesia Reguler (ongkir real-time via API)", STY['TableCell'])],
        [Paragraph("Tracking Produksi", STY['TableCell']),
         Paragraph("5 tahapan progres: <b>Pola/Cutting → Jahit/Stitching → Soling → QC → Delivery</b> (1 minggu)", STY['TableCell'])],
        [Paragraph("Target Audiens", STY['TableCell']),
         Paragraph("<b>Gen Z &amp; Millennials Pria</b> (20–35 tahun) — fleksibel ke berbagai gaya hidup (formal, smart casual, streetwear)", STY['TableCell'])],
        [Paragraph("Positioning", STY['TableCell']),
         Paragraph("<b>Daily Casual Leather</b> — karakter brand jelas, produk multifungsi lintas gaya", STY['TableCell'])],
        [Paragraph("Halaman Khusus", STY['TableCell']),
         Paragraph("<b>Craftsmanship / Brand Story</b> — halaman storytelling proses pembuatan &amp; nilai pengrajin", STY['TableCell'])],
    ]
    tbl = Table(data, colWidths=[40 * mm, 120 * mm], repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('BACKGROUND', (0, 1), (-1, -1), white),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, HexColor('#FAF9F6')]),
        ('GRID', (0, 0), (-1, -1), 0.4, HexColor('#D4CFC5')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 3 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3 * mm),
    ]))
    story.append(tbl)

    add_spacer(3)
    story.append(Paragraph(
        "<i>Catatan: Detail teknis seperti matriks elemen × model dan price list lengkap "
        "perlu disusun oleh klien sebelum memasuki Fase Desain Sistem.</i>",
        STY['Body']
    ))

    story.append(PageBreak())

# ============================================================
# 4. BAGIAN 2: MOODBOARD
# ============================================================
def build_moodboard_header():
    story.append(Paragraph("BAGIAN 2: MOODBOARD DESIGN (3 PILIHAN)", STY['H0']))
    add_hr(NAVY, 1.5, 0, 4)
    story.append(Paragraph(
        "Moodboard adalah <b>papan suasana visual</b> yang berisi kombinasi warna, tipografi, "
        "gaya elemen antarmuka, dan arah fotografi — gambaran awal seperti apa tampilan "
        "website nantinya. Berikut disiapkan <b>3 (tiga) opsi moodboard</b> yang berbeda "
        "namun tetap sesuai niche <b>daily casual leather untuk Gen Z/Millennials pria</b>. "
        "Klien dapat memilih salah satu yang paling sesuai, atau menggabungkan elemen dari "
        "beberapa moodboard.",
        STY['Body']
    ))
    add_spacer(3)

    # Tabel perbandingan ringkas 3 moodboard
    story.append(Paragraph("Ringkasan 3 Opsi Moodboard", STY['H2']))
    data = [
        [Paragraph("<b>OPSI</b>", STY['TableCellBold']),
         Paragraph("<b>NAMA MOOD</b>", STY['TableCellBold']),
         Paragraph("<b>KESAN UTAMA</b>", STY['TableCellBold']),
         Paragraph("<b>COCOK UNTUK</b>", STY['TableCellBold'])],
        [Paragraph("A", STY['TableCellBold']),
         Paragraph("Modern Industrial Minimalist", STY['TableCell']),
         Paragraph("Bersih, maskulin, tegas, high-end", STY['TableCell']),
         Paragraph("Smart casual — formal modern, kantor, meeting", STY['TableCell'])],
        [Paragraph("B", STY['TableCellBold']),
         Paragraph("Warm Heritage Classic", STY['TableCell']),
         Paragraph("Hangat, nyaman, otentik, bernostalgia", STY['TableCell']),
         Paragraph("Craftmanship & heritage — nilai tradisi, artisan", STY['TableCell'])],
        [Paragraph("C", STY['TableCellBold']),
         Paragraph("Urban Street Craft", STY['TableCell']),
         Paragraph("Energetik, muda, berani, street-ready", STY['TableCell']),
         Paragraph("Streetwear & Gen Z — casual, boots culture", STY['TableCell'])],
    ]
    tbl = Table(data, colWidths=[14 * mm, 42 * mm, 48 * mm, 56 * mm], repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), CHARCOAL),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('BACKGROUND', (0, 1), (-1, -1), white),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [CREAM, white]),
        ('GRID', (0, 0), (-1, -1), 0.4, HexColor('#CFC8BA')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 3 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3 * mm),
    ]))
    story.append(tbl)
    story.append(PageBreak())


def mood_detail_A():
    """Moodboard A — Modern Industrial Minimalist"""
    # Section banner
    banner_data = [[
        Paragraph("MOODBOARD A", STY['PhaseTitle']),
        Paragraph("Estimasi pengerjaan UI: 10–12 hari", STY['PhaseMeta'])
    ]]
    banner = Table(banner_data, colWidths=[120 * mm, 40 * mm], rowHeights=[12 * mm])
    banner.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), NAVY),
        ('BACKGROUND', (1, 0), (1, 0), HexColor('#253555')),
        ('LEFTPADDING', (0, 0), (-1, -1), 5 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5 * mm),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
    ]))
    story.append(banner)
    add_spacer(4)

    story.append(Paragraph("Modern Industrial Minimalist", STY['H1']))
    story.append(Paragraph(
        "Moodboard dengan dasar warna <b>biru tua keabu-abuan (navy)</b>, aksen <b>kuning "
        "emas metalik</b>, dan latar <b>putih keabu-abuan</b>. Kesan yang muncul: <b>bersih, "
        "maskulin, berkelas, namun tetap sederhana</b> — tidak berlebihan. Tipografi tebal dan "
        "spasi yang lapang (whitespace) memberikan rasa mewah tanpa perlu ornamen rumit. "
        "Sangat cocok untuk menonjolkan model <b>Pantofel Oxford, Chelsea Boots formal</b>, dan "
        "gaya smart casual kantor / business meeting.",
        STY['Body']
    ))

    # Palette
    story.append(Paragraph("Palette Warna", STY['H2']))
    palette_A = [
        ('#1B2A4A', 'Midnight Navy'),
        ('#334155', 'Slate Charcoal'),
        ('#C9A962', 'Brass Gold'),
        ('#F7F3EC', 'Ivory Cream'),
        ('#FFFFFF', 'Pure White'),
    ]
    story.append(color_swatch_row(palette_A))
    add_spacer(6)

    # Tipografi
    story.append(Paragraph("Tipografi", STY['H2']))
    tipografi_data = [
        [Paragraph("<b>JENIS</b>", STY['TableCellBold']),
         Paragraph("<b>REKOMENDASI FONT</b>", STY['TableCellBold']),
         Paragraph("<b>PENGGUNAAN</b>", STY['TableCellBold']),
         Paragraph("<b>CONTOH</b>", STY['TableCellBold'])],
        [Paragraph("Heading", STY['TableCell']),
         Paragraph("<b>Inter Bold / Bebas Neue</b> — sans-serif tebal, modern", STY['TableCell']),
         Paragraph("Judul halaman, nama produk, tombol utama", STY['TableCell']),
         Paragraph("<font size='15'><b>BOLD &amp; STRONG</b></font>", STY['TableCell'])],
        [Paragraph("Body", STY['TableCell']),
         Paragraph("<b>Inter Regular / Roboto</b> — terbaca, bersih", STY['TableCell']),
         Paragraph("Deskripsi produk, informasi, harga", STY['TableCell']),
         Paragraph("<font size='10'>The quick brown fox jumps over the lazy leather craftsman.</font>", STY['TableCell'])],
        [Paragraph("Accent", STY['TableCell']),
         Paragraph("<b>Playfair Display (scattered)</b> — serif tipis", STY['TableCell']),
         Paragraph("Tagline craftsmanship, quote pengrajin", STY['TableCell']),
         Paragraph("<font size='11'><i>Handcrafted since day one.</i></font>", STY['TableCell'])],
    ]
    tbl = Table(tipografi_data, colWidths=[25 * mm, 50 * mm, 42 * mm, 43 * mm], repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, CREAM]),
        ('GRID', (0, 0), (-1, -1), 0.4, HexColor('#CFC8BA')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 3 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3 * mm),
    ]))
    story.append(tbl)
    add_spacer(4)

    # UI Mockup
    story.append(Paragraph("Contoh Tampilan Antarmuka (Hero Section)", STY['H2']))
    story.append(ui_mock_card(
        "CRAFT YOUR PAIR",
        ["Custom sepatu kulit premium — setiap detail,", "sesuai gaya Anda. Handcrafted in 7 days."],
        bg_hex='#F7F3EC', accent_hex='#1B2A4A', text_hex='#1B2A4A'
    ))
    add_spacer(3)
    story.append(Paragraph(
        "<i>Gambar di atas: contoh mini preview hero section dengan latar cream, "
        "tombol navigasi navy, dan aksen garis emas untuk kesan high-end.</i>",
        STY['Caption']
    ))

    # Photography & Style
    story.append(Paragraph("Gaya Fotografi &amp; Elemen Pendukung", STY['H2']))
    bullet_list([
        "<b>Foto produk:</b> Lighting low-key (kontras tinggi), latar polos abu-abu tua atau putih matte — fokus tajam ke tekstur kulit &amp; detail jahitan.",
        "<b>Foto model:</b> Pose natural, bukan over-pose. Setting industrial (bata ekspos, lantai beton, rak besi) atau kantor modern. Wardrobe: kemeja putih, blazer tipis, celana chino.",
        "<b>Ikon:</b> Outline tipis (stroke-based), monokrom — gaya besi/tukang kunci.",
        "<b>Shape keseluruhan:</b> Kotak-kotak tegas dengan sedikit sudut membulat (rounded corners 2–4 mm). Garis pembatas tipis daripada bayangan tebal.",
        "<b>Halaman Craftsmanship:</b> Foto close-up tangan pengrajin memotong kulit, mesin jahit tua, benang dan peralatan — semua dengan lighting lembut warm-tone."
    ], True)

    # Tag
    add_spacer(2)
    tag_row = Table([[
        Paragraph("#SmartCasual", STY['Tag']),
        Paragraph("#HighEndMinimal", STY['Tag']),
        Paragraph("#IndustrialVibe", STY['Tag']),
        Paragraph("#FormalReady", STY['Tag']),
    ]], colWidths=[40 * mm, 40 * mm, 40 * mm, 40 * mm], rowHeights=[8 * mm])
    tag_row.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), NAVY),
        ('BACKGROUND', (1, 0), (1, 0), HexColor('#334155')),
        ('BACKGROUND', (2, 0), (2, 0), GOLD),
        ('BACKGROUND', (3, 0), (3, 0), CHARCOAL),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 2 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 2 * mm),
    ]))
    story.append(tag_row)
    story.append(PageBreak())


def mood_detail_B():
    """Moodboard B — Warm Heritage Classic"""
    banner_data = [[
        Paragraph("MOODBOARD B", STY['PhaseTitle']),
        Paragraph("Estimasi pengerjaan UI: 10–12 hari", STY['PhaseMeta'])
    ]]
    banner = Table(banner_data, colWidths=[120 * mm, 40 * mm], rowHeights=[12 * mm])
    banner.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), WARM_BROWN),
        ('BACKGROUND', (1, 0), (1, 0), HexColor('#7A5A47')),
        ('LEFTPADDING', (0, 0), (-1, -1), 5 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5 * mm),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
    ]))
    story.append(banner)
    add_spacer(4)

    story.append(Paragraph("Warm Heritage Classic", STY['H1']))
    story.append(Paragraph(
        "Moodboard dengan nuansa <b>bumi (earth tone)</b> yang hangat: cokelat kulit, krem "
        "tua, hijau forest, dan aksen <b>kuning mustard/emas pudar</b>. Kesan yang muncul: "
        "<b>nyaman, otentik, bernostalgia, dan penuh nilai perajin</b>. Tipografi serif klasik "
        "dan tekstur kertas/kulit di detail kecil membuat brand terasa sudah ada sejak lama "
        "serta terpercaya. Sangat cocok untuk menonjolkan sisi <b>craftsmanship, brand story, "
        "dan sepatu model Chelsea Boots, Pantofel klasik, serta Loafer smart casual.</b>",
        STY['Body']
    ))

    # Palette
    story.append(Paragraph("Palette Warna", STY['H2']))
    palette_B = [
        ('#5C4033', 'Saddle Brown'),
        ('#A47148', 'Cognac Tan'),
        ('#C9A962', 'Antique Gold'),
        ('#4A7C59', 'Forest Green'),
        ('#F3E9D2', 'Paper Cream'),
    ]
    story.append(color_swatch_row(palette_B))
    add_spacer(6)

    # Tipografi
    story.append(Paragraph("Tipografi", STY['H2']))
    tipografi_data = [
        [Paragraph("<b>JENIS</b>", STY['TableCellBold']),
         Paragraph("<b>REKOMENDASI FONT</b>", STY['TableCellBold']),
         Paragraph("<b>PENGGUNAAN</b>", STY['TableCellBold']),
         Paragraph("<b>CONTOH</b>", STY['TableCellBold'])],
        [Paragraph("Heading", STY['TableCell']),
         Paragraph("<b>Playfair Display Bold / Cormorant Garamond</b> — serif klasik", STY['TableCell']),
         Paragraph("Judul, nama model sepatu, sub-heading brand story", STY['TableCell']),
         Paragraph("<font size='14'><b><i>Classic Heritage</i></b></font>", STY['TableCell'])],
        [Paragraph("Body", STY['TableCell']),
         Paragraph("<b>Lora Regular / Source Serif 4</b> — serif terbaca", STY['TableCell']),
         Paragraph("Paragraf deskripsi, detail produk, artikel", STY['TableCell']),
         Paragraph("<font size='10'>Setiap jahitan dirajut pengrajin dengan cinta sejak tahun ini berdiri.</font>", STY['TableCell'])],
        [Paragraph("Accent", STY['TableCell']),
         Paragraph("<b>Caveat / Dancing Script</b> — tulisan tangan", STY['TableCell']),
         Paragraph("Quote pengrajin, tanda tangan, catatan personal", STY['TableCell']),
         Paragraph("<font size='12'><i>— Dibuat dengan tangan, bukan mesin massal.</i></font>", STY['TableCell'])],
    ]
    tbl = Table(tipografi_data, colWidths=[25 * mm, 50 * mm, 42 * mm, 43 * mm], repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), WARM_BROWN),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#F3E9D2'), white]),
        ('GRID', (0, 0), (-1, -1), 0.4, HexColor('#B8A88A')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 3 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3 * mm),
    ]))
    story.append(tbl)
    add_spacer(4)

    # UI Mockup
    story.append(Paragraph("Contoh Tampilan Antarmuka (Hero Section)", STY['H2']))
    story.append(ui_mock_card(
        "DIBUAT DENGAN TANGAN",
        ["Sepatu kulit warisan pengrajin — tak lekang oleh waktu.", "Setiap pasang, sebuah cerita."],
        bg_hex='#F3E9D2', accent_hex='#5C4033', text_hex='#3D2817'
    ))
    add_spacer(3)
    story.append(Paragraph(
        "<i>Gambar di atas: contoh mini preview hero section dengan background paper-cream, "
        "warna saddle-brown yang hangat, dan kesan lembut seperti membaca buku tua.</i>",
        STY['Caption']
    ))

    # Photography
    story.append(Paragraph("Gaya Fotografi &amp; Elemen Pendukung", STY['H2']))
    bullet_list([
        "<b>Foto produk:</b> Lighting warm &amp; lembut (golden hour / lampu kuning). Latar kayu tua, kain linen, atau background tekstur kulit sapi asli. Foto sedikit vignette di pinggir.",
        "<b>Foto model:</b> Setting rumah klasik (kursi kulit, perpustakaan, dinding bata merah tua), atau outdoor sore hari. Wardrobe: knit sweater, tweed blazer, celana kain cokelat, kemeja flanel.",
        "<b>Ikon:</b> Gaya hand-drawn / garis-garis kasar seperti coretan pensil. Pakai texture noise/kertas tipis di background halaman.",
        "<b>Shape keseluruhan:</b> Sudut tumpul / sangat membulat (rounded corners 6–12 mm). Bayangan lembut di kartu produk. Bisa pakai pola hias kecil (pattern) seperti anyaman kulit atau jahitan sebagai background section.",
        "<b>Halaman Craftsmanship:</b> Ini <b>bintangnya moodboard B</b>. Susun seperti buku dokumenter — foto urut proses pembuatan (pemilihan kulit → cutting → stitching → finishing) diselingi quote pengrajin."
    ], True)

    add_spacer(2)
    tag_row = Table([[
        Paragraph("#Heritage", STY['Tag']),
        Paragraph("#EarthTone", STY['Tag']),
        Paragraph("#Craftsmanship", STY['Tag']),
        Paragraph("#ClassicVibe", STY['Tag']),
    ]], colWidths=[40 * mm, 40 * mm, 40 * mm, 40 * mm], rowHeights=[8 * mm])
    tag_row.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), WARM_BROWN),
        ('BACKGROUND', (1, 0), (1, 0), HexColor('#A47148')),
        ('BACKGROUND', (2, 0), (2, 0), GOLD),
        ('BACKGROUND', (3, 0), (3, 0), ACCENT_GREEN),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(tag_row)
    story.append(PageBreak())


def mood_detail_C():
    """Moodboard C — Urban Street Craft"""
    banner_data = [[
        Paragraph("MOODBOARD C", STY['PhaseTitle']),
        Paragraph("Estimasi pengerjaan UI: 9–11 hari", STY['PhaseMeta'])
    ]]
    banner = Table(banner_data, colWidths=[120 * mm, 40 * mm], rowHeights=[12 * mm])
    banner.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), CHARCOAL),
        ('BACKGROUND', (1, 0), (1, 0), HexColor('#444444')),
        ('LEFTPADDING', (0, 0), (-1, -1), 5 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5 * mm),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
    ]))
    story.append(banner)
    add_spacer(4)

    story.append(Paragraph("Urban Street Craft", STY['H1']))
    story.append(Paragraph(
        "Moodboard dengan nuansa <b>anak muda perkotaan</b>: dasar hitam arang / abu pekat, "
        "akson <b>berani (orange rust, teal elektrik, atau putih cerah)</b>, dan layout yang "
        "asimetris. Kesan yang muncul: <b>energetik, muda, berani, dan siap jalan</b>. "
        "Tipografi sans-serif geometris dengan bobot besar diselingi font display "
        "experiment (condensed / bold). Sangat cocok untuk model <b>Boots, Docmart, dan "
        "Loafers gaya streetwear / workwear / oversized — tepat sasaran ke Gen Z.</b>",
        STY['Body']
    ))

    # Palette
    story.append(Paragraph("Palette Warna", STY['H2']))
    palette_C = [
        ('#1A1A1A', 'Charcoal Black'),
        ('#2C2C2C', 'Graphite Dark'),
        ('#B7410E', 'Rust Orange'),
        ('#3A7CA5', 'Electric Teal'),
        ('#FFFFFF', 'Pure White'),
    ]
    story.append(color_swatch_row(palette_C))
    add_spacer(6)

    # Tipografi
    story.append(Paragraph("Tipografi", STY['H2']))
    tipografi_data = [
        [Paragraph("<b>JENIS</b>", STY['TableCellBold']),
         Paragraph("<b>REKOMENDASI FONT</b>", STY['TableCellBold']),
         Paragraph("<b>PENGGUNAAN</b>", STY['TableCellBold']),
         Paragraph("<b>CONTOH</b>", STY['TableCellBold'])],
        [Paragraph("Display", STY['TableCell']),
         Paragraph("<b>Oswald / Anton / Archivo Black</b> — ultra tebal, condensed", STY['TableCell']),
         Paragraph("Headline besar, tagline utama, nama seri sepatu", STY['TableCell']),
         Paragraph("<font size='15'><b>STREET. READY.</b></font>", STY['TableCell'])],
        [Paragraph("Body", STY['TableCell']),
         Paragraph("<b>Space Grotesk / DM Sans</b> — modern sans-serif", STY['TableCell']),
         Paragraph("Isi informasi produk, deskripsi, dan tulisan panjang", STY['TableCell']),
         Paragraph("<font size='10'>Built for the city — tough, agile, and uncompromised.</font>", STY['TableCell'])],
        [Paragraph("Accent", STY['TableCell']),
         Paragraph("<b>JetBrains Mono</b> — monospace (opsional)", STY['TableCell']),
         Paragraph("Kode model produk, harga, tag batch produksi", STY['TableCell']),
         Paragraph("<font size='11'><b>SKU: BT-RST-007 / BATCH #42</b></font>", STY['TableCell'])],
    ]
    tbl = Table(tipografi_data, colWidths=[25 * mm, 50 * mm, 42 * mm, 43 * mm], repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), CHARCOAL),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#F2F2F2'), white]),
        ('GRID', (0, 0), (-1, -1), 0.4, HexColor('#999999')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 3 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3 * mm),
    ]))
    story.append(tbl)
    add_spacer(4)

    # UI Mockup
    story.append(Paragraph("Contoh Tampilan Antarmuka (Hero Section)", STY['H2']))
    story.append(ui_mock_card(
        "BUILT FOR THE STREETS",
        ["Sepatu custom yang sekeras perjalanan Anda.", "Drop 07 — limited batch."],
        bg_hex='#EDEDED', accent_hex='#B7410E', text_hex='#1A1A1A'
    ))
    add_spacer(3)
    story.append(Paragraph(
        "<i>Gambar di atas: contoh mini preview hero section dengan kontras kuat, "
        "aksen rust-orange yang berani, dan gaya tipografi tegas untuk karakter muda.</i>",
        STY['Caption']
    ))

    # Photography
    story.append(Paragraph("Gaya Fotografi &amp; Elemen Pendukung", STY['H2']))
    bullet_list([
        "<b>Foto produk:</b> Lighting keras (high contrast) seperti foto editorial majalah fashion. Latar beton, gerbang besi, pagar kawat, atau alley perkotaan. Sudut foto dinamis (low angle, dutch angle).",
        "<b>Foto model:</b> Pose santai keren. Setting outdoor cityscape (troktoan beton, bawah jembatan, dinding grafiti kosong). Wardrobe: oversized tee/hoodie, jeans sobek, workwear jacket, topi snapback.",
        "<b>Ikon:</b> Geometris &amp; chunky — seperti stiker/stampel. Bisa pakai efek distro (garus, tinta aus) di beberapa area.",
        "<b>Shape keseluruhan:</b> Sudut tajam (no radius / 1–2 mm). Kartu produk pakai <i>outline stroke tebal</i>. Grid asimetris di halaman beranda (satu gambar besar, 3 gambar kecil).",
        "<b>Halaman Craftsmanship:</b> Gaya dokumenter street-style — foto grainy/noisy seperti kamera analog. Fokus ke pengrajin muda yang sedang bekerja dengan musik atau suasana workshop yang 'grunge'."
    ], True)

    add_spacer(2)
    tag_row = Table([[
        Paragraph("#StreetWear", STY['Tag']),
        Paragraph("#GenZReady", STY['Tag']),
        Paragraph("#BootCulture", STY['Tag']),
        Paragraph("#UrbanCraft", STY['Tag']),
    ]], colWidths=[40 * mm, 40 * mm, 40 * mm, 40 * mm], rowHeights=[8 * mm])
    tag_row.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), CHARCOAL),
        ('BACKGROUND', (1, 0), (1, 0), ACCENT_RUST),
        ('BACKGROUND', (2, 0), (2, 0), ACCENT_BLUE),
        ('BACKGROUND', (3, 0), (3, 0), NAVY),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(tag_row)
    story.append(PageBreak())


def build_moodboard_comparison():
    """Perbandingan & rekomendasi"""
    story.append(Paragraph("2.4 Perbandingan &amp; Rekomendasi", STY['H1']))
    story.append(Paragraph(
        "Setiap moodboard memiliki kelebihan di segmen pasar berbeda. Berikut perbandingan "
        "akhir berdasarkan 5 dimensi penilaian:",
        STY['Body']
    ))

    data = [
        [Paragraph("<b>DIMENSI</b>", STY['TableCellBold']),
         Paragraph("<b>A. Modern Industrial</b>", STY['TableCellBold']),
         Paragraph("<b>B. Warm Heritage</b>", STY['TableCellBold']),
         Paragraph("<b>C. Urban Street</b>", STY['TableCellBold'])],
        [Paragraph("Daya tarik Gen Z", STY['TableCell']),
         Paragraph("★★★☆☆ (cukup)", STY['TableCell']),
         Paragraph("★★☆☆☆ (kurang)", STY['TableCell']),
         Paragraph("★★★★★ (sangat kuat)", STY['TableCell'])],
        [Paragraph("Daya tarik Millennial / Formal", STY['TableCell']),
         Paragraph("★★★★★ (sangat kuat)", STY['TableCell']),
         Paragraph("★★★★☆ (kuat)", STY['TableCell']),
         Paragraph("★★☆☆☆ (kurang)", STY['TableCell'])],
        [Paragraph("Kesesuaian Craftsmanship", STY['TableCell']),
         Paragraph("★★★☆☆ (perlu effort)", STY['TableCell']),
         Paragraph("★★★★★ (paling cocok)", STY['TableCell']),
         Paragraph("★★★☆☆ (perlu effort)", STY['TableCell'])],
        [Paragraph("Kemudahan Implementasi UI", STY['TableCell']),
         Paragraph("★★★★☆ (cepat)", STY['TableCell']),
         Paragraph("★★★☆☆ (sedang)", STY['TableCell']),
         Paragraph("★★★★★ (paling cepat)", STY['TableCell'])],
        [Paragraph("Konversi untuk model sepatu", STY['TableCell']),
         Paragraph("Pantofel, Chelsea", STY['TableCell']),
         Paragraph("Loafer, Chelsea, Pantofel", STY['TableCell']),
         Paragraph("Boots, Docmart", STY['TableCell'])],
    ]
    tbl = Table(data, colWidths=[38 * mm, 40 * mm, 40 * mm, 42 * mm], repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), CHARCOAL),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('BACKGROUND', (0, 1), (0, -1), HexColor('#F7F3EC')),
        ('GRID', (0, 0), (-1, -1), 0.4, HexColor('#CFC8BA')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 3 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3 * mm),
    ]))
    story.append(tbl)
    add_spacer(5)

    # Rekomendasi
    story.append(Paragraph("Rekomendasi Tim Pengembang", STY['H2']))
    quote_box = Table([[Paragraph(
        "<b>Mengingat positioning brand adalah <i>Daily Casual Leather</i> (bisa masuk lintas gaya hidup) "
        "dan target pasar gabungan Gen Z + Millennials — <font color='#C9A962'>kami merekomendasikan "
        "Moodboard A (Modern Industrial Minimalist) sebagai dasar utama,</font> lalu mengambil 2–3 elemen "
        "pelengkap dari Moodboard B &amp; C:</b><br/><br/>"
        "• Dari B: palet warna <b>cokelat cognac (#A47148)</b> sebagai warna sekunder + tipografi serif "
        "untuk halaman Craftsmanship &amp; Brand Story<br/>"
        "• Dari C: gaya foto dinamis (low angle, urban) untuk model Boots/Docmart + font Oswald "
        "untuk headline section model street",
        STY['Body']
    )]], colWidths=[160 * mm])
    quote_box.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HexColor('#FAF7F1')),
        ('BOX', (0, 0), (-1, -1), 2, GOLD),
        ('LEFTPADDING', (0, 0), (-1, -1), 7 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5 * mm),
    ]))
    story.append(quote_box)

    add_spacer(3)
    story.append(Paragraph(
        "Opsi ini disebut sebagai <b>Hybrid Mood (A + B + C lite)</b> — yang mencakup semua model "
        "sepatu (formal sampai street) dan semua target usia. Keputusan akhir sepenuhnya berada di "
        "tangan klien.",
        STY['Body']
    ))

    # Box untuk client pilih
    add_spacer(3)
    pilih_box = Table([[Paragraph(
        "<b>KOTAK PILIHAN KLIEN</b><br/><br/>"
        "☐  Moodboard A — Modern Industrial Minimalist<br/>"
        "☐  Moodboard B — Warm Heritage Classic<br/>"
        "☐  Moodboard C — Urban Street Craft<br/>"
        "☐  Hybrid Mood (Rekomendasi: A + elemen B &amp; C)<br/>"
        "☐  Lainnya: ___________________________<br/><br/>"
        "Tanggal konfirmasi: ____ / ____ / __________  |  Tanda tangan: ____________________",
        STY['Body']
    )]], colWidths=[160 * mm])
    pilih_box.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), white),
        ('BOX', (0, 0), (-1, -1), 1, NAVY),
        ('LEFTPADDING', (0, 0), (-1, -1), 7 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5 * mm),
    ]))
    story.append(pilih_box)
    story.append(PageBreak())

# ============================================================
# 5. BAGIAN 3: SDLC
# ============================================================
def build_sdlc_header():
    story.append(Paragraph("BAGIAN 3: SDLC (SOFTWARE DEVELOPMENT LIFE CYCLE)", STY['H0']))
    add_hr(NAVY, 1.5, 0, 4)
    story.append(Paragraph(
        "SDLC adalah siklus hidup pengembangan perangkat lunak — serangkaian tahapan "
        "terstruktur yang harus dilewati agar proyek website selesai tepat waktu, sesuai "
        "anggaran, dan sesuai kebutuhan klien. Untuk proyek sepatu kulit custom ini, "
        "kami menerapkan <b>SDLC 7 Fase</b> dengan model <b>Incremental (MVP bertahap)</b>, "
        "artinya:</p>",
        STY['Body']
    ))
    bullet_list([
        "<b>Fase 1 (MVP Launch):</b> Website sudah bisa dijalan-ketahui (pakai 2D layer untuk customizer, sizing manual by admin) — toko online sudah bisa menerima pesanan.",
        "<b>Fase 2 (V2 — Enhancement):</b> Menambahkan fitur premium seperti 3D 360°, algoritma sizing otomatis dari foto, dan integrasi WhatsApp API.",
    ], True)

    # Diagram 7 fase
    add_spacer(3)
    story.append(Paragraph("Gambaran 7 Fase SDLC", STY['H2']))
    story.append(sdlc_diagram())
    add_spacer(4)

    story.append(PageBreak())


def sdlc_diagram():
    """Gambar 7 kotak fase berurutan horizontal"""
    phases = [
        ("1", "Inisiasi &\nPerencanaan", NAVY),
        ("2", "Analisis\nKebutuhan", HexColor('#334155')),
        ("3", "Desain\nSistem & UI", WARM_BROWN),
        ("4", "Pengembangan", GOLD),
        ("5", "Pengujian", ACCENT_GREEN),
        ("6", "Implementasi\n& Launch", ACCENT_BLUE),
        ("7", "Pemeliharaan\n& Lanjutan", CHARCOAL),
    ]
    n = len(phases)
    W = 160 * mm
    gap = 2 * mm
    box_w = (W - (n - 1) * gap - 4 * mm) / n
    box_h = 36 * mm

    d = Drawing(W, box_h + 18 * mm)

    x = 2 * mm
    for i, (num, txt, col) in enumerate(phases):
        # Box
        d.add(Rect(x, 12 * mm, box_w, box_h,
                   fillColor=col, strokeColor=None, rx=1.5 * mm, ry=1.5 * mm))
        # Number circle
        cx = x + box_w / 2
        d.add(Circle(cx, box_h + 12 * mm - 6 * mm, 5 * mm,
                     fillColor=white, strokeColor=col, strokeWidth=1.2))
        d.add(String(cx, box_h + 12 * mm - 8 * mm, num,
                     textAnchor='middle', fontSize=11, fontName='Helvetica-Bold',
                     fillColor=col))
        # Text
        lines = txt.split('\n')
        for li, line in enumerate(lines):
            d.add(String(cx, 32 * mm - li * 5 * mm, line,
                         textAnchor='middle', fontSize=8.5, fontName='Helvetica-Bold',
                         fillColor=white))
        # Arrow (kecuali yang terakhir)
        if i < n - 1:
            ax = x + box_w + gap / 2
            ay = 12 * mm + box_h / 2
            d.add(Line(x + box_w, ay, x + box_w + gap, ay,
                       strokeColor=MEDIUM_GRAY, strokeWidth=1))
            # Arrow head
            d.add(Line(x + box_w + gap, ay, x + box_w + gap - 1.2 * mm, ay - 1 * mm,
                       strokeColor=MEDIUM_GRAY, strokeWidth=1))
            d.add(Line(x + box_w + gap, ay, x + box_w + gap - 1.2 * mm, ay + 1 * mm,
                       strokeColor=MEDIUM_GRAY, strokeWidth=1))
        x += box_w + gap

    return d


def sdlc_phase_table(data_rows, accent_color):
    """Tabel detail fase.
    data_rows: list of (label, content)
    """
    table_data = []
    for label, content in data_rows:
        table_data.append([
            Paragraph(f"<b>{label}</b>", STY['TableCellBold']),
            Paragraph(content, STY['TableCell'])
        ])
    tbl = Table(table_data, colWidths=[34 * mm, 126 * mm])
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), HexColor('#F7F3EC')),
        ('ROWBACKGROUNDS', (0, 0), (-1, -1), [white, HexColor('#FCFAF6')]),
        ('GRID', (0, 0), (-1, -1), 0.4, HexColor('#E5DFD2')),
        ('BOX', (0, 0), (-1, -1), 1.2, accent_color),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 3 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3 * mm),
    ]))
    story.append(tbl)
    add_spacer(3)


def phase_banner(num, name, durasi, color):
    data = [[
        Paragraph(f"FASE {num}  —  {name}", STY['PhaseTitle']),
        Paragraph(f"⏱  Durasi: {durasi}", STY['PhaseMeta'])
    ]]
    tbl = Table(data, colWidths=[120 * mm, 40 * mm], rowHeights=[11 * mm])
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), color),
        ('BACKGROUND', (1, 0), (1, 0), color),
        ('LEFTPADDING', (0, 0), (-1, -1), 5 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5 * mm),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
    ]))
    story.append(tbl)
    add_spacer(4)


def build_phase_1():
    phase_banner(1, "INISIASI & PERENCANAAN", "3–5 hari kerja", NAVY)
    story.append(Paragraph(
        "Fase pertama: menyamakan persepsi, menentukan skala proyek, dan menyusun "
        "dokumen perjanjian kerja sama (SOW — Statement of Work).",
        STY['Body']
    ))
    sdlc_phase_table([
        ("Tujuan Utama",
         "Memastikan kedua belah pihak (pengembang &amp; klien) memahami skala, "
         "batasan, tujuan bisnis, dan biaya proyek sebelum pekerjaan teknis dimulai."),
        ("Aktivitas Utama",
         "1. Pertemuan kickoff (tatap muka / daring) untuk menjelaskan alur SDLC<br/>"
         "2. Konfirmasi pilihan moodboard visual dari Bagian 2<br/>"
         "3. Penyusunan rincian anggaran &amp; jadwal pembayaran termin<br/>"
         "4. Penandatanganan SOW &amp; DP proyek awal<br/>"
         "5. Setup environment proyek (repositori kode, group komunikasi, folder shared drive)"),
        ("Output / Deliverable",
         "• Dokumen SOW (Statement of Work) yang ditandatangani<br/>"
         "• Timeline proyek versi final<br/>"
         "• Rincian anggaran &amp; termin pembayaran"),
        ("Pihak Terlibat",
         "Klien (owner brand), Tim Pengembang (project manager + lead dev)"),
        ("Risiko &amp; Mitigasi",
         "<b>Risiko:</b> Moodboard tidak disetujui dalam 1 putaran → <b>Mitigasi:</b> batasi "
         "maksimal 2x revisi moodboard (perubahan minor setelah itu dianggap change request)."),
    ], NAVY)


def build_phase_2():
    phase_banner(2, "ANALISIS KEBUTUHAN", "5–7 hari kerja", HexColor('#334155'))
    story.append(Paragraph(
        "Fase ini mengubah jawaban-jawaban klien dari dokumen kebutuhan menjadi daftar "
        "spesifikasi fungsional dan non-fungsional yang <b>jelas, terukur, dan dapat "
        "diverifikasi</b>.",
        STY['Body']
    ))
    sdlc_phase_table([
        ("Tujuan Utama",
         "Menyusun dokumen <b>SRS (Software Requirements Specification)</b> — acuan tunggal "
         "untuk tim desain dan pengembang."),
        ("Aktivitas Utama",
         "1. Meminta &amp; memfinalisasi <b>matriks elemen kustomisasi × 5 model sepatu</b><br/>"
         "2. Meminta &amp; memverifikasi <b>price list lengkap</b> (base price + semua varian)<br/>"
         "3. Workshop klarifikasi pertanyaan lanjutan (jenis 3D: photogrammetry vs CGI; "
         "mekanisme sizing foto kaki; daftar ekspedisi final; refund DP dll.)<br/>"
         "4. Penentuan stack teknologi (framework frontend, backend, DB, hosting)<br/>"
         "5. Penyusunan use-case diagram &amp; user flow (alur pembeli &amp; admin)"),
        ("Output / Deliverable",
         "• Dokumen SRS versi 1.0 (dengan lampiran matriks &amp; price list)<br/>"
         "• Diagram User Flow (custom flow, checkout flow, admin dashboard flow)<br/>"
         "• Daftar Use Case (functional &amp; non-functional requirements)<br/>"
         "• Keputusan stack teknologi"),
        ("Pihak Terlibat",
         "Klien (owner + desainer/marketing jika ada), Sistem Analis, Lead Backend"),
        ("Dependensi Kritis",
         "<b>TANPA MATRIKS ELEMEN × MODEL DAN PRICE LIST LENGKAP — FASE 3 (DESAIN SISTEM) "
         "TIDAK BISA DIMULAI.</b> Ini adalah bottleneck terbesar yang harus didorong oleh klien."),
    ], HexColor('#334155'))


def build_phase_3():
    phase_banner(3, "DESAIN SISTEM & UI/UX", "10–14 hari kerja", WARM_BROWN)
    story.append(Paragraph(
        "Di sini semua 'blueprint' dibuat — arsitektur perangkat lunak, struktur database, "
        "dan desain visual antarmuka pengguna untuk setiap halaman.",
        STY['Body']
    ))
    sdlc_phase_table([
        ("Tujuan Utama",
         "Menghasilkan desain yang implementable (bisa langsung dikoding tanpa revisi "
         "desain lagi di tengah development)."),
        ("Sub-Fase 3A — Desain Arsitektur &amp; Database",
         "• Perancangan Entity Relationship Diagram (ERD): User, Product, "
         "CustomComponent, MaterialColor, Order, Payment, ProductionStatus, Sizing, dll.<br/>"
         "• Perancangan API endpoints (RESTful)<br/>"
         "• Pemilihan infrastruktur hosting (contoh: VPS / Supabase / cPanel)<br/>"
         "• Integrasi pihak ketiga: Payment Gateway (Midtrans/Xendit), "
         "Ongkir API (RajaOngkir/Biteship), Email (SMTP)"),
        ("Sub-Fase 3B — Desain UI/UX",
         "• Low-fidelity Wireframe (sketsa) semua halaman: landing page, katalog, "
         "halaman customizer, cart, checkout, user dashboard (tracking status), "
         "halaman craftsmanship, admin dashboard (AdminLTE 3 Industrial)<br/>"
         "• High-fidelity Mockup (warna penuh sesuai moodboard terpilih)<br/>"
         "• Prototype klik (Figma) untuk demo interaksi<br/>"
         "• UI Style Guide (warna, typography scale, spacing, komponen tombol/card/form)"),
        ("Output / Deliverable",
         "• Dokumen System Design (ERD + API spec + arsitektur diagram)<br/>"
         "• Full UI Mockup + Prototype Figma (dengan 1x revisi batch)<br/>"
         "• UI Style Guide untuk acuan developer"),
        ("Milestone",
         "Setelah mockup disetujui → ini titik <b>GO/NO-GO</b> sebelum masuk coding. "
         "Revisi desain setelah fase ini akan memengaruhi timeline + biaya."),
    ], WARM_BROWN)
    story.append(PageBreak())


def build_phase_4():
    phase_banner(4, "PENGEMBANGAN (DEVELOPMENT)", "35–45 hari kerja (Fase MVP)", GOLD)
    story.append(Paragraph(
        "Fase terpanjang — di mana semua desain diubah menjadi kode yang berfungsi. "
        "Untuk manajemen risiko, fase ini dibagi menjadi 2 gelombang (Incremental MVP).",
        STY['Body']
    ))

    # Tabel milestones pengembangan
    data = [
        [Paragraph("<b>MINGGU</b>", STY['TableCellBold']),
         Paragraph("<b>FOKUS PENGEMBANGAN</b>", STY['TableCellBold']),
         Paragraph("<b>PROGRESS (%)</b>", STY['TableCellBold'])],
        [Paragraph("Minggu 1", STY['TableCell']),
         Paragraph("Setup project, scaffolding frontend + backend, integrasi DB, "
                   "sistem autentikasi (login/register user &amp; admin)", STY['TableCell']),
         Paragraph("10%", STY['TableCellBold'])],
        [Paragraph("Minggu 2", STY['TableCell']),
         Paragraph("Modul Admin Dashboard (CRUD: produk base, material warna, elemen customizer, "
                   "price list) — menggunakan tema <b>Industrial AdminLTE 3.x</b>", STY['TableCell']),
         Paragraph("25%", STY['TableCellBold'])],
        [Paragraph("Minggu 3", STY['TableCell']),
         Paragraph("Halaman publik: Landing Page + Katalog + Halaman Craftsmanship/Brand Story "
                   "(sesuai moodboard terpilih)", STY['TableCell']),
         Paragraph("40%", STY['TableCellBold'])],
        [Paragraph("Minggu 4", STY['TableCell']),
         Paragraph("<b>Customizer Engine (2D Layer MVP)</b> — preview visual bertumpuk (PNG/SVG), "
                   "harga dinamis realtime, validasi outsole per kelompok model, penyimpanan desain ke cart", STY['TableCell']),
         Paragraph("60%", STY['TableCellBold'])],
        [Paragraph("Minggu 5", STY['TableCell']),
         Paragraph("Shopping Cart, Sizing (upload foto kaki + size chart), Checkout Flow "
                   "(ongkir API), halaman User Dashboard (profil, pesanan)", STY['TableCell']),
         Paragraph("78%", STY['TableCellBold'])],
        [Paragraph("Minggu 6", STY['TableCell']),
         Paragraph("Payment Gateway (QRIS + VA) dengan skema <b>DP 50% — Pelunasan 50%</b>, "
                   "sistem update status produksi 5 tahap, notifikasi email otomatis", STY['TableCell']),
         Paragraph("92%", STY['TableCellBold'])],
        [Paragraph("Minggu 7", STY['TableCell']),
         Paragraph("Bugfix internal, optimasi performa, integrasi akhir semua modul, "
                   "penyiapan konten &amp; produk pertama", STY['TableCell']),
         Paragraph("100% (MVP)", STY['TableCellBold'])],
    ]
    tbl = Table(data, colWidths=[22 * mm, 106 * mm, 32 * mm], repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), GOLD),
        ('TEXTCOLOR', (0, 0), (-1, 0), CHARCOAL),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, CREAM]),
        ('GRID', (0, 0), (-1, -1), 0.4, HexColor('#CFC8BA')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 3 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3 * mm),
    ]))
    story.append(tbl)
    add_spacer(3)

    sdlc_phase_table([
        ("Catatan Fase V2 (Setelah MVP Launch)",
         "Jika klien setuju dan budget tersedia, dilanjutkan: <b>3D 360° Interaktif</b> "
         "(via photogrammetry / CGI), <b>algoritma sizing otomatis dari foto kaki</b> "
         "(estimasi 20–30 hari tambahan), dan <b>WhatsApp Business API</b> untuk notifikasi pelunasan."),
        ("Output / Deliverable",
         "• Source code lengkap (frontend + backend + database)<br/>"
         "• Website staging (untuk internal testing sebelum live)<br/>"
         "• Dokumentasi teknis (README, API docs, cara deploy)"),
        ("Komunikasi",
         "Laporan progress <b>setiap Jumat sore</b> via grup chat (ringkasan mingguan) + "
         "demo staging 2 minggu sekali (Week 3 &amp; Week 6)."),
    ], GOLD)
    story.append(PageBreak())


def build_phase_5():
    phase_banner(5, "PENGUJIAN (TESTING)", "7–10 hari kerja", ACCENT_GREEN)
    story.append(Paragraph(
        "Fase memastikan semua fitur berjalan sesuai SRS — tidak ada bug kritis yang "
        "mengganggu pengalaman pembeli dan alur bisnis.",
        STY['Body']
    ))
    sdlc_phase_table([
        ("Jenis Pengujian",
         "1. <b>Functional Testing:</b> uji setiap use case (registrasi, tambah ke cart, custom design, "
         "bayar DP, update status, dll.)<br/>"
         "2. <b>Customizer Validation Test:</b> uji semua kombinasi valid &amp; invalid "
         "(batasan outsole per kelompok)<br/>"
         "3. <b>Payment Flow Test:</b> simulasi DP 50%, pelunasan, expired payment, gagal bayar<br/>"
         "4. <b>Cross-Browser &amp; Device Testing:</b> Chrome, Safari, Edge — desktop, tablet, "
         "HP Android &amp; iPhone<br/>"
         "5. <b>UAT (User Acceptance Test):</b> pengujian oleh klien sendiri dengan daftar checklist<br/>"
         "6. <b>Performance Test:</b> load waktu customizer (pastikan &lt; 3 detik di jaringan 4G)"),
        ("Output / Deliverable",
         "• Bug report sheet (tertangani per severity: Blocker → Critical → Minor)<br/>"
         "• Laporan hasil UAT yang ditandatangani klien (tanda menyetujui masuk launch)<br/>"
         "• Checklist penutupan testing"),
        ("Risiko",
         "Jika ditemukan bug blocker (contoh: payment gagal di HP) — fase ini otomatis "
         "diperpanjang 2–3 hari tanpa biaya tambahan (selama bug berasal dari kesalahan "
         "tim developer, bukan change request)."),
    ], ACCENT_GREEN)


def build_phase_6():
    phase_banner(6, "IMPLEMENTASI & PELUNCURAN", "2–3 hari kerja", ACCENT_BLUE)
    story.append(Paragraph(
        "Momen yang dinantikan: website resmi 'dinyalakan' dan dapat diakses publik. "
        "Fase ini juga termasuk masa <b>pemantauan 3 hari pasca-launch (warranty period)</b>.",
        STY['Body']
    ))
    sdlc_phase_table([
        ("Aktivitas (H-1 / Hari Persiapan)",
         "• Deploy kode dari staging ke production server<br/>"
         "• Konfigurasi domain, SSL (HTTPS), dan email resmi<br/>"
         "• Input data produk &amp; katalog awal (dibantu admin)<br/>"
         "• Final sanity check seluruh halaman"),
        ("Aktivitas (Hari-H Launch Day)",
         "• Soft launch ke 10–20 tester internal (teman/keluarga) untuk simulasi transaksi<br/>"
         "• Monitor log error dan payment secara realtime<br/>"
         "• Pengumuman resmi (sosial media + WhatsApp broadcast)"),
        ("Aktivitas (H+1 s/d H+3 Warranty)",
         "• Responsif menangani bug kecil atau komplain user pertama<br/>"
         "• Pelatihan manual admin via GMeet/call (cara update status produksi, kelola produk, "
         "handle klaim garansi 3 hari)<br/>"
         "• Penyerahan asset final: sumber kode, database, kredensial (dokumen ringkas)"),
        ("Output / Deliverable",
         "• Website LIVE (dapat diakses domain resmi)<br/>"
         "• Dokumen Manual Admin + Video Panduan Singkat<br/>"
         "• Serah terima asset &amp; kredensial (dengan berita acara)"),
    ], ACCENT_BLUE)


def build_phase_7():
    phase_banner(7, "PEMELIHARAAN & PENGEMBANGAN LANJUTAN", "Berkelanjutan (paket opsional)", CHARCOAL)
    story.append(Paragraph(
        "Website yang sudah live bukanlah titik akhir — justru titik awal perbaikan dan "
        "peningkatan berdasarkan feedback pengguna nyata.",
        STY['Body']
    ))
    sdlc_phase_table([
        ("Pemeliharaan Rutin (Opsional Bulanan)",
         "• Update patch keamanan framework &amp; library<br/>"
         "• Backup database harian/mingguan + restore test<br/>"
         "• Monitoring uptime server<br/>"
         "• Kuota 3–5 jam per bulan untuk perbaikan bug minor / penyesuaian kecil"),
        ("Pengembangan Fitur V2 (Terpisah)",
         "• Customizer 3D 360° (photogrammetry atau CGI)<br/>"
         "• Algoritma sizing otomatis dari foto kaki<br/>"
         "• Integrasi WhatsApp Business API untuk notifikasi<br/>"
         "• Sistem review &amp; rating produk<br/>"
         "• Integrasi marketplace (Tokopedia/Shopee via API)<br/>"
         "• Dashboard analytics untuk owner (penjualan per model, material terlaris)"),
        ("Model Biaya",
         "• <b>Retainer bulanan</b> untuk maintenance rutin<br/>"
         "• <b>Per-Fitur</b> (satuan) untuk penambahan fitur baru — dibuat SOW tersendiri<br/>"
         "• Garansi bug bawaan developer: <b>30 hari gratis</b> sejak tanggal launch"),
    ], CHARCOAL)
    story.append(PageBreak())


def build_timeline():
    """Linimasa proyek & milestone"""
    story.append(Paragraph("3.9 Linimasa Proyek &amp; Milestone", STY['H1']))
    story.append(Paragraph(
        "Berikut adalah ringkasan linimasa total untuk <b>MVP Launch (Fase 1–6)</b> — "
        "di luar fase pemeliharaan dan pengembangan V2. Waktu dalam hari kerja "
        "(Senin–Jumat, di luar hari libur nasional).",
        STY['Body']
    ))

    data = [
        [Paragraph("<b>MILESTONE</b>", STY['TableCellBold']),
         Paragraph("<b>DARI FASE</b>", STY['TableCellBold']),
         Paragraph("<b>DURASI</b>", STY['TableCellBold']),
         Paragraph("<b>TANDA SELESAI</b>", STY['TableCellBold']),
         Paragraph("<b>TERMIN PEMBAYARAN</b>", STY['TableCellBold'])],
        [Paragraph("M1 — Kickoff Disetujui", STY['TableCell']),
         Paragraph("Fase 1", STY['TableCell']),
         Paragraph("3–5 hari", STY['TableCell']),
         Paragraph("SOW ditandatangani + DP proyek", STY['TableCell']),
         Paragraph("<b>Termin 1: 20%</b> (DP Proyek)", STY['TableCellBold'])],
        [Paragraph("M2 — SRS Final", STY['TableCell']),
         Paragraph("Fase 2", STY['TableCell']),
         Paragraph("5–7 hari", STY['TableCell']),
         Paragraph("Matriks + Price list + SRS disetujui", STY['TableCell']),
         Paragraph("—", STY['TableCellBold'])],
        [Paragraph("M3 — UI Mockup Disetujui", STY['TableCell']),
         Paragraph("Fase 3", STY['TableCell']),
         Paragraph("10–14 hari", STY['TableCell']),
         Paragraph("Prototype Figma disetujui (GO/NO-GO)", STY['TableCell']),
         Paragraph("<b>Termin 2: 25%</b>", STY['TableCellBold'])],
        [Paragraph("M4 — Demo Staging Pertengahan", STY['TableCell']),
         Paragraph("Fase 4 (Minggu 3)", STY['TableCell']),
         Paragraph("Week 1–3 dev", STY['TableCell']),
         Paragraph("Demo fitur admin + halaman publik berjalan", STY['TableCell']),
         Paragraph("—", STY['TableCellBold'])],
        [Paragraph("M5 — Staging Siap Test", STY['TableCell']),
         Paragraph("Fase 4 (Akhir)", STY['TableCell']),
         Paragraph("Week 4–7 dev", STY['TableCell']),
         Paragraph("Semua modul MVP terintegrasi di staging", STY['TableCell']),
         Paragraph("<b>Termin 3: 25%</b>", STY['TableCellBold'])],
        [Paragraph("M6 — UAT Disetujui", STY['TableCell']),
         Paragraph("Fase 5", STY['TableCell']),
         Paragraph("7–10 hari", STY['TableCell']),
         Paragraph("Checklist UAT ditandatangani klien", STY['TableCell']),
         Paragraph("—", STY['TableCellBold'])],
        [Paragraph("M7 — WEBSITE LIVE", STY['TableCell']),
         Paragraph("Fase 6", STY['TableCell']),
         Paragraph("2–3 hari", STY['TableCell']),
         Paragraph("Soft launch + hard launch publik", STY['TableCell']),
         Paragraph("<b>Termin 4: 30%</b> (Pelunasan)", STY['TableCellBold'])],
    ]
    tbl = Table(data, colWidths=[40 * mm, 25 * mm, 20 * mm, 38 * mm, 37 * mm], repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, CREAM]),
        ('GRID', (0, 0), (-1, -1), 0.4, HexColor('#CFC8BA')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 3 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3 * mm),
    ]))
    story.append(tbl)
    add_spacer(5)

    # Summary total
    summary_data = [[
        Paragraph(
            "<b>Total Durasi MVP (estimasi):</b><br/>"
            "<font size='12'>3–5  +  5–7  +  10–14  +  35–45  +  7–10  +  2–3  =  "
            "<font color='#C9A962' size='14'><b>62–84 hari kerja</b></font>  "
            "(± 3–4 bulan kalender)</font>",
            STY['Body']
        )
    ]]
    summary_box = Table(summary_data, colWidths=[160 * mm])
    summary_box.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HexColor('#FAF7F1')),
        ('BOX', (0, 0), (-1, -1), 1.5, GOLD),
        ('LEFTPADDING', (0, 0), (-1, -1), 7 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 4 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4 * mm),
    ]))
    story.append(summary_box)
    story.append(PageBreak())


def build_risk_management():
    """3.10 Manajemen Risiko"""
    story.append(Paragraph("3.10 Manajemen Risiko", STY['H1']))
    story.append(Paragraph(
        "Untuk meminimalkan hambatan, berikut daftar risiko yang paling mungkin muncul "
        "bersama strategi mitigasi dan pihak yang bertanggung jawab:",
        STY['Body']
    ))

    data = [
        [Paragraph("<b>NO</b>", STY['TableCellBold']),
         Paragraph("<b>RISIKO</b>", STY['TableCellBold']),
         Paragraph("<b>DAMPAK</b>", STY['TableCellBold']),
         Paragraph("<b>MITIGASI</b>", STY['TableCellBold']),
         Paragraph("<b>PENANGGUNG</b>", STY['TableCellBold'])],
        [Paragraph("1", STY['TableCell']),
         Paragraph("Matriks elemen × model &amp; price list dari klien terlambat diterima", STY['TableCell']),
         Paragraph("🔴 Tinggi", STY['TableCell']),
         Paragraph("Tetapkan deadline tegas di M2 (SRS); jika lewat → timeline bergeser otomatis sesuai keterlambatan", STY['TableCell']),
         Paragraph("Klien + PM", STY['TableCell'])],
        [Paragraph("2", STY['TableCell']),
         Paragraph("Aset foto produk &amp; 3D model belum siap saat masuk customizer", STY['TableCell']),
         Paragraph("🟠 Sedang", STY['TableCell']),
         Paragraph("MVP launch pakai placeholder / foto sample dulu; foto asli masuk sebagai update konten gratis setelah launch", STY['TableCell']),
         Paragraph("Klien", STY['TableCell'])],
        [Paragraph("3", STY['TableCell']),
         Paragraph("Revisi desain UI muncul saat fase development (sudah lewat M3)", STY['TableCell']),
         Paragraph("🔴 Tinggi", STY['TableCell']),
         Paragraph("Tetapkan batas revisi: 1x batch di fase 3; setelah itu perubahan = change request (biaya + waktu tambah)", STY['TableCell']),
         Paragraph("Kedua belah pihak", STY['TableCell'])],
        [Paragraph("4", STY['TableCell']),
         Paragraph("Payment Gateway / akun merchant belum diverifikasi saat launch", STY['TableCell']),
         Paragraph("🟠 Sedang", STY['TableCell']),
         Paragraph("Pendaftaran merchant (Midtrans/Xendit) dimulai di FASE 2, bukan menunggu akhir; fallback: manual VA", STY['TableCell']),
         Paragraph("Klien + DevOps", STY['TableCell'])],
        [Paragraph("5", STY['TableCell']),
         Paragraph("Pesanan menumpuk → estimasi 1 minggu per PO tidak realistis", STY['TableCell']),
         Paragraph("🟡 Rendah", STY['TableCell']),
         Paragraph("Tambahkan perhitungan <b>estimasi dinamis</b> berdasarkan antrian di dashboard (fitur minor setelah MVP)", STY['TableCell']),
         Paragraph("Tim Pengembang", STY['TableCell'])],
        [Paragraph("6", STY['TableCell']),
         Paragraph("Klaim retur/size 3 hari mengganggu operasional tim", STY['TableCell']),
         Paragraph("🟡 Rendah", STY['TableCell']),
         Paragraph("Buat form klaim baku di dashboard user + upload video unboxing wajib; tentukan SLA handle klaim (max 1×24 jam)", STY['TableCell']),
         Paragraph("Klien (CS)", STY['TableCell'])],
        [Paragraph("7", STY['TableCell']),
         Paragraph("Bug saat launch hari", STY['TableCell']),
         Paragraph("🟠 Sedang", STY['TableCell']),
         Paragraph("Soft launch internal 1 hari sebelum hard launch; tim standby on-call 24 jam di minggu pertama", STY['TableCell']),
         Paragraph("Tim Pengembang", STY['TableCell'])],
        [Paragraph("8", STY['TableCell']),
         Paragraph("Sizing dari foto kaki salah → komplain buyer", STY['TableCell']),
         Paragraph("🟠 Sedang", STY['TableCell']),
         Paragraph("MVP pakai <b>verifikasi manual oleh admin</b> sebelum produksi; size chart standar + panduan foto kaki yang benar di UI", STY['TableCell']),
         Paragraph("Klien + Admin", STY['TableCell'])],
    ]
    tbl = Table(data, colWidths=[10 * mm, 42 * mm, 20 * mm, 55 * mm, 33 * mm], repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), CHARCOAL),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, HexColor('#FAFAFA')]),
        ('GRID', (0, 0), (-1, -1), 0.4, HexColor('#CFC8BA')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('ALIGN', (2, 0), (2, -1), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 2 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 2 * mm),
    ]))
    story.append(tbl)

    story.append(PageBreak())

# ============================================================
# 6. BAGIAN 4: PENUTUP
# ============================================================
def build_closure():
    story.append(Paragraph("BAGIAN 4: PENUTUP", STY['H0']))
    add_hr(NAVY, 1.5, 0, 6)

    story.append(Paragraph("4.1 Ringkasan Keseluruhan", STY['H1']))
    story.append(Paragraph(
        "Dokumen ini mencakup dua fondasi penting proyek website sepatu kulit custom:",
        STY['Body']
    ))
    numbered_list([
        "<b>Moodboard Design (Bagian 2)</b> — 3 (tiga) pilihan arah visual (Modern Industrial, "
        "Warm Heritage, Urban Street) beserta rekomendasi Hybrid Mood untuk mengakomodasi "
        "lintas target pasar Gen Z + Millennials dan lintas model sepatu (formal–street).",
        "<b>SDLC 7 Fase (Bagian 3)</b> — mulai dari inisiasi (3–5 hari) sampai website live "
        "(total estimasi <b>62–84 hari kerja ± 3–4 bulan kalender</b> untuk MVP), beserta 7 "
        "poin manajemen risiko, 7 milestone dengan termin pembayaran 4 tahap (20% – 25% – "
        "25% – 30%)."
    ])

    story.append(Paragraph(
        "Dengan mengikuti dokumen ini, kedua belah pihak memiliki acuan tertulis yang jelas "
        "sehingga risiko miss-komunikasi, scope creep, dan keterlambatan dapat ditekan "
        "seminimal mungkin.",
        STY['Body']
    ))

    story.append(Paragraph("4.2 Langkah Selanjutnya (Next Steps)", STY['H1']))
    story.append(Paragraph(
        "Setelah menerima dokumen ini, berikut urutan langkah yang sebaiknya dijalankan "
        "secara bertahap:",
        STY['Body']
    ))

    next_steps = [
        [Paragraph("<b>LANGKAH</b>", STY['TableCellBold']),
         Paragraph("<b>URAIAN KEGIATAN</b>", STY['TableCellBold']),
         Paragraph("<b>DEADLINE (REKOMENDASI)</b>", STY['TableCellBold'])],
        [Paragraph("1", STY['TableCell']),
         Paragraph("<b>Klien memilih &amp; menandatangani pilihan moodboard</b> di halaman 2.4 "
                   "(bisa menambahkan catatan minor perpaduan elemen)", STY['TableCell']),
         Paragraph("3 hari setelah dokumen diterima", STY['TableCell'])],
        [Paragraph("2", STY['TableCell']),
         Paragraph("<b>Pertemuan Kickoff tatap muka / GMeet</b> — bahas SOW, termin, timeline, "
                   "dan klarifikasi pertanyaan lanjutan yang tersisa", STY['TableCell']),
         Paragraph("1 minggu setelah moodboard disetujui", STY['TableCell'])],
        [Paragraph("3", STY['TableCell']),
         Paragraph("Klien membayar <b>Termin 1 (20% DP Proyek)</b> &amp; menandatangani SOW — "
                   "proyek resmi dimulai", STY['TableCell']),
         Paragraph("H+1 setelah kickoff", STY['TableCell'])],
        [Paragraph("4", STY['TableCell']),
         Paragraph("Sambil menunggu, <b>klien mempersiapkan:</b> matriks elemen × model, "
                   "price list lengkap, foto produk sample, dan materi brand story", STY['TableCell']),
         Paragraph("Selama Fase 1 &amp; Fase 2", STY['TableCell'])],
        [Paragraph("5", STY['TableCell']),
         Paragraph("Fase 2 (Analisis) dimulai → finalisasi SRS sebagai fondasi teknis", STY['TableCell']),
         Paragraph("Segera setelah SOW ditandatangani", STY['TableCell'])],
    ]
    tbl = Table(next_steps, colWidths=[15 * mm, 100 * mm, 45 * mm], repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), GOLD),
        ('TEXTCOLOR', (0, 0), (-1, 0), CHARCOAL),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, CREAM]),
        ('GRID', (0, 0), (-1, -1), 0.4, HexColor('#CFC8BA')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 3 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3 * mm),
    ]))
    story.append(tbl)

    add_spacer(6)

    # Closing quote
    quote_tbl = Table([[Paragraph(
        "<font color='#5C4033' size='14'><i><b>\"Sepatu yang baik mengantarkanmu ke tempat yang baik. "
        "Semoga proyek ini menjadi awal yang baik untuk perjalanan brand kita.\"</b></i></font>"
        "<br/><br/>— Tim Pengembang SHOESshop",
        STY['QuoteBox']
    )]], colWidths=[160 * mm])
    quote_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HexColor('#FAF7F1')),
        ('LINEBEFOREDECOR', (0, 0), (0, -1), 3, GOLD),
        ('LEFTPADDING', (0, 0), (-1, -1), 10 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 6 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6 * mm),
    ]))
    story.append(quote_tbl)

    add_spacer(6)

    # Tanda tangan
    sign_data = [
        [Paragraph("<b>Disetujui oleh:</b>", STY['BodyBold']),
         Paragraph("<b>Dibuat oleh:</b>", STY['BodyBold'])],
        [Paragraph("Klien / Pemilik Brand", STY['Body']),
         Paragraph("Tim Pengembang SHOESshop", STY['Body'])],
        [Spacer(1, 18 * mm), Spacer(1, 18 * mm)],
        [Paragraph("_________________________", STY['Body']),
         Paragraph("_________________________", STY['Body'])],
        [Paragraph("Nama Lengkap: _______________", STY['Body']),
         Paragraph("Nama Lengkap: _______________", STY['Body'])],
        [Paragraph("Tanggal: ____ / ____ / ______", STY['Body']),
         Paragraph("Tanggal: ____ / ____ / ______", STY['Body'])],
    ]
    sign_tbl = Table(sign_data, colWidths=[80 * mm, 80 * mm])
    sign_tbl.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 2 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2 * mm),
        ('LEFTPADDING', (0, 0), (-1, -1), 5 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5 * mm),
    ]))
    story.append(sign_tbl)

    # Footer page
    add_spacer(10)
    add_hr(MEDIUM_GRAY, 0.3, 0, 2)
    story.append(Paragraph(
        "<i>Dokumen ini bersifat rahasia dan hanya diperuntukkan bagi pihak yang terlibat "
        "dalam proyek SHOESshop Foot Fashion. Dilarang memperbanyak atau membagikan isi "
        "dokumen tanpa izin tertulis dari kedua belah pihak.</i>",
        STY['Caption']
    ))


# ============================================================
# HALAMAN NOMOR
# ============================================================
def add_page_number(canvas, doc):
    canvas.saveState()
    page_num = canvas.getPageNumber()
    if page_num > 1:
        text = f"Halaman {page_num}"
        canvas.setFont('Helvetica', 9)
        canvas.setFillColor(MEDIUM_GRAY)
        canvas.drawRightString(A4[0] - 2 * cm, 1.1 * cm, text)
        # Header line tipis
        canvas.setStrokeColor(HexColor('#E5DFD2'))
        canvas.setLineWidth(0.3)
        canvas.line(2 * cm, A4[1] - 1.6 * cm, A4[0] - 2 * cm, A4[1] - 1.6 * cm)
        canvas.setFont('Helvetica-Oblique', 8)
        canvas.setFillColor(MEDIUM_GRAY)
        canvas.drawString(2 * cm, A4[1] - 1.4 * cm,
                          "Moodboard & SDLC - Website Sepatu Kulit Custom v1.0")
    canvas.restoreState()

# ============================================================
# EXECUTE
# ============================================================
def main():
    # COVER
    build_cover()
    # TOC
    build_toc()
    # INTRO
    build_intro()
    # MOODBOARD
    build_moodboard_header()
    mood_detail_A()
    mood_detail_B()
    mood_detail_C()
    build_moodboard_comparison()
    # SDLC
    build_sdlc_header()
    build_phase_1()
    build_phase_2()
    build_phase_3()
    build_phase_4()
    build_phase_5()
    build_phase_6()
    build_phase_7()
    build_timeline()
    build_risk_management()
    # CLOSING
    build_closure()

    # BUILD DOC
    doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
    print(f"✅ PDF berhasil dibuat: {OUTPUT_PATH}")
    size_kb = os.path.getsize(OUTPUT_PATH) / 1024
    print(f"   Ukuran file: {size_kb:.1f} KB")


if __name__ == '__main__':
    main()
