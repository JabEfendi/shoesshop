# -*- coding: utf-8 -*-
"""
Panduan Lengkap Opsi A: Split Manual Blender UI -> Integrasi Web ShoeShop 3D Configurator
Generated: ShoeShop 3D Project
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table,
    TableStyle, PageBreak, KeepTogether, ListFlowable, ListItem,
    NextPageTemplate,
)
from reportlab.pdfgen import canvas

# ----------------------------------------------------------------------------
# THEME COLORS (Industrial / ShoeShop 3D)
# ----------------------------------------------------------------------------
BG_DARK   = HexColor("#1f2937")
ACCENT    = HexColor("#d97706")
ACCENT2   = HexColor("#f59e0b")
TABLE_HDR = HexColor("#1f2937")
TABLE_ALT = HexColor("#f3f4f6")
TABLE_BRD = HexColor("#9ca3af")
OK_GREEN  = HexColor("#047857")
WARN_RED  = HexColor("#b91c1c")
LIGHT_BG  = HexColor("#fff7ed")
INFO_BLUE = HexColor("#1d4ed8")

OUTPUT_PATH = r"d:\Project\shoesshop\output\pdf\PANDUAN_BLENDER_MANUAL_SPLIT_OPSI_A.pdf"

# ----------------------------------------------------------------------------
# FONT / STYLES
# ----------------------------------------------------------------------------
_styles = getSampleStyleSheet()

def s(name, **kw):
    base = kw.pop("base", "BodyText")
    # Try custom style first (globals S_xxx), fallback to builtin stylesheet
    parent = globals().get("S_" + base)
    if parent is None:
        try:
            parent = _styles[base]
        except KeyError:
            raise KeyError(f"Style base '{base}' not found.")
    p = ParagraphStyle(name, parent=parent, **kw)
    globals()["S_" + name] = p
    return p

s("Title1", base="Title", fontSize=34, leading=40, textColor=BG_DARK,
  alignment=TA_LEFT, fontName="Helvetica-Bold", spaceAfter=6)
s("Subtitle", fontSize=15, leading=20, textColor=ACCENT,
  alignment=TA_LEFT, fontName="Helvetica-Bold", spaceAfter=22)
s("CoverMeta", fontSize=11, leading=15, textColor=BG_DARK,
  alignment=TA_LEFT, fontName="Helvetica", spaceAfter=2)
s("Chapter", base="Heading1", fontSize=20, leading=26, textColor=white,
  fontName="Helvetica-Bold", spaceBefore=4, spaceAfter=10,
  backColor=BG_DARK, borderPadding=(8, 10, 8, 10))
s("Section", base="Heading2", fontSize=15, leading=20, textColor=BG_DARK,
  fontName="Helvetica-Bold", spaceBefore=12, spaceAfter=6,
  borderWidth=0, leftIndent=0)
s("Sub", base="Heading3", fontSize=12, leading=16, textColor=ACCENT,
  fontName="Helvetica-Bold", spaceBefore=6, spaceAfter=4)
s("Body", base="BodyText", fontSize=10.5, leading=15, textColor=BG_DARK,
  fontName="Helvetica", alignment=TA_JUSTIFY, spaceAfter=4)
s("BodyBold", base="Body", fontName="Helvetica-Bold")
s("Bullet", base="Body", leftIndent=18, bulletIndent=4, spaceAfter=2,
  bulletFontName="Helvetica-Bold", bulletColor=ACCENT)
s("StepTitle", fontSize=12, leading=16, textColor=white,
  fontName="Helvetica-Bold", backColor=ACCENT, borderPadding=(5, 8, 5, 8),
  spaceBefore=10, spaceAfter=6)
s("StepBody", base="Body", leftIndent=6)
s("Tip", base="Body", backColor=LIGHT_BG, borderColor=ACCENT, borderWidth=0.6,
  borderPadding=(6, 8, 6, 8), leftIndent=2, spaceBefore=4, spaceAfter=6,
  textColor=BG_DARK)
s("Warn", base="Body", backColor=HexColor("#fef2f2"), borderColor=WARN_RED,
  borderWidth=0.6, borderPadding=(6, 8, 6, 8), leftIndent=2,
  spaceBefore=4, spaceAfter=6, textColor=BG_DARK)
s("Info", base="Body", backColor=HexColor("#eff6ff"), borderColor=INFO_BLUE,
  borderWidth=0.6, borderPadding=(6, 8, 6, 8), leftIndent=2,
  spaceBefore=4, spaceAfter=6, textColor=BG_DARK)
s("Code", base="Body", fontName="Courier", fontSize=9.5, leading=13,
  backColor=HexColor("#111827"), textColor=HexColor("#fbbf24"),
  borderPadding=(8, 10, 8, 10), leftIndent=0, spaceAfter=4)
s("FooterStyle", fontSize=8.5, leading=11, textColor=HexColor("#4b5563"),
  alignment=TA_RIGHT, fontName="Helvetica-Oblique")
s("TocItem", base="Body", fontSize=11, leading=17, leftIndent=10,
  fontName="Helvetica")
s("TocH1", base="TocItem", fontName="Helvetica-Bold", fontSize=12, leftIndent=0)
s("CoverLine", fontSize=1, leading=1, backColor=ACCENT, textColor=ACCENT,
  spaceBefore=8, spaceAfter=14)


def _cell_styles():
    ts = TableStyle([
        ("BACKGROUND",  (0, 0), (-1, 0), TABLE_HDR),
        ("TEXTCOLOR",   (0, 0), (-1, 0), white),
        ("FONTNAME",    (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",    (0, 0), (-1, 0), 9.5),
        ("BOTTOMPADDING",(0, 0), (-1, 0), 7),
        ("TOPPADDING",  (0, 0), (-1, 0), 7),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING",(0, 0), (-1, -1), 7),
        ("GRID",        (0, 0), (-1, -1), 0.35, TABLE_BRD),
        ("VALIGN",      (0, 0), (-1, -1), "TOP"),
        ("FONTNAME",    (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE",    (0, 1), (-1, -1), 9.5),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, TABLE_ALT]),
        ("TOPPADDING",  (0, 1), (-1, -1), 5),
        ("BOTTOMPADDING",(0, 1), (-1, -1), 5),
    ])
    return ts


def table(rows, widths=None, extras=None):
    t = Table(rows, colWidths=widths, repeatRows=1, hAlign="LEFT")
    ts = _cell_styles()
    if extras:
        for cmd, *args in extras:
            ts.add(cmd, *args)
    t.setStyle(ts)
    return t


def para(s):
    return [Paragraph(line, S_Body) if line.strip() else Spacer(1, 2)
            for line in s.strip().splitlines()]


def steps(lines):
    """lines: list of (step_number_title, body_text)"""
    items = []
    for title, body in lines:
        items.append(Paragraph(title, S_StepTitle))
        for ln in body.strip().splitlines():
            if ln.strip():
                items.append(Paragraph(ln, S_StepBody))
    return items


# ----------------------------------------------------------------------------
# PAGE TEMPLATES / HEADER & FOOTER
# ----------------------------------------------------------------------------
PAGE_W, PAGE_H = A4
MARGIN_L, MARGIN_R = 2.2 * cm, 1.8 * cm
MARGIN_T, MARGIN_B = 2.4 * cm, 2.0 * cm

def _on_page(c: canvas.Canvas, doc):
    c.saveState()
    # Header bar
    c.setFillColor(BG_DARK)
    c.rect(0, PAGE_H - 1.0 * cm, PAGE_W, 1.0 * cm, fill=1, stroke=0)
    c.setFillColor(ACCENT)
    c.rect(0, PAGE_H - 1.05 * cm, PAGE_W, 0.05 * cm, fill=1, stroke=0)
    # Header text
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(ACCENT2)
    c.drawString(MARGIN_L, PAGE_H - 0.68 * cm, "SHOESHOP 3D CONFIGURATOR")
    c.setFont("Helvetica", 9)
    c.setFillColor(white)
    c.drawRightString(PAGE_W - MARGIN_R, PAGE_H - 0.68 * cm,
                      "Panduan Opsi A - Split Manual Blender UI")
    # Footer
    c.setFillColor(ACCENT)
    c.rect(0, MARGIN_B - 0.4 * cm, PAGE_W, 0.05 * cm, fill=1, stroke=0)
    c.setFont("Helvetica-Oblique", 8.5)
    c.setFillColor(HexColor("#6b7280"))
    c.drawString(MARGIN_L, MARGIN_B - 0.33 * cm,
                 "d:\\Project\\shoesshop | Rev. 1.0 | 6 Oktober 2026")
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(BG_DARK)
    c.drawRightString(PAGE_W - MARGIN_R, MARGIN_B - 0.33 * cm,
                      f"Halaman {doc.page}")
    c.restoreState()

def _on_cover(c: canvas.Canvas, doc):
    c.saveState()
    # Top accent block
    c.setFillColor(BG_DARK)
    c.rect(0, PAGE_H * 0.62, PAGE_W, PAGE_H * 0.38, fill=1, stroke=0)
    c.setFillColor(ACCENT)
    c.rect(0, PAGE_H * 0.61, PAGE_W, 0.18 * cm, fill=1, stroke=0)
    # Left vertical stripe
    c.setFillColor(ACCENT)
    c.rect(0, 0, 0.6 * cm, PAGE_H * 0.61, fill=1, stroke=0)
    # Title (inside dark top block)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 32)
    c.drawString(2.0 * cm, PAGE_H - 4.0 * cm, "PANDUAN LENGKAP")
    c.setFillColor(ACCENT2)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(2.0 * cm, PAGE_H - 5.3 * cm,
                 "OPSI A - Split Manual Blender UI")
    c.setFillColor(HexColor("#f9fafb"))
    c.setFont("Helvetica", 12)
    c.drawString(2.0 * cm, PAGE_H - 6.6 * cm,
                 "Pipeline: Edit Object Names Blender -> Export GLB -> Integrasi Web Live")
    c.setFillColor(HexColor("#9ca3af"))
    c.setFont("Helvetica-Oblique", 11)
    c.drawString(2.0 * cm, PAGE_H - 7.4 * cm,
                 "ShoeShop 3D Configurator - Laravel / React Three Fiber")

    # Project meta block (below title, still dark bg area)
    meta = [
        ("Proyek",        "ShoeShop 3D Configurator"),
        ("Versi Panduan", "Rev. 1.0"),
        ("Tanggal",       "6 Oktober 2026"),
        ("Target User",   "Tim Desain / 3D Artist (Blender)"),
        ("Waktu Estimasi", "~10 menit / model + 2 menit update DB"),
    ]
    c.setFillColor(HexColor("#111827"))
    c.rect(2.0 * cm, PAGE_H - 14.5 * cm, 15.5 * cm, 5.6 * cm, fill=1, stroke=0)
    c.setStrokeColor(ACCENT)
    c.setLineWidth(0.7)
    c.rect(2.0 * cm, PAGE_H - 14.5 * cm, 15.5 * cm, 5.6 * cm, fill=0, stroke=1)
    y = PAGE_H - 15.3 * cm
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(ACCENT2)
    c.drawString(2.5 * cm, y, "INFORMASI PROYEK")
    y -= 0.9 * cm
    c.setFont("Helvetica", 10)
    c.setFillColor(white)
    for k, v in meta:
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(HexColor("#d1d5db"))
        c.drawString(2.5 * cm, y, f"{k}:")
        c.setFont("Helvetica", 10)
        c.setFillColor(white)
        c.drawString(5.8 * cm, y, v)
        y -= 0.7 * cm

    # Footer cover
    c.setFillColor(ACCENT)
    c.rect(0, MARGIN_B - 0.4 * cm, PAGE_W, 0.05 * cm, fill=1, stroke=0)
    c.setFont("Helvetica-Oblique", 8.5)
    c.setFillColor(HexColor("#6b7280"))
    c.drawString(MARGIN_L, MARGIN_B - 0.33 * cm,
                 "d:\\Project\\shoesshop | Rev. 1.0")
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(BG_DARK)
    c.drawRightString(PAGE_W - MARGIN_R, MARGIN_B - 0.33 * cm,
                      f"Halaman {doc.page}")
    c.restoreState()


class MyDoc(BaseDocTemplate):
    def __init__(self, *a, **kw):
        super().__init__(*a, **kw)
        frame_cover = Frame(MARGIN_L, MARGIN_B,
                             PAGE_W - MARGIN_L - MARGIN_R,
                             PAGE_H - MARGIN_T - MARGIN_B,
                             id="cover")
        frame_body = Frame(MARGIN_L, MARGIN_B,
                           PAGE_W - MARGIN_L - MARGIN_R,
                           PAGE_H - MARGIN_T - MARGIN_B,
                           id="body")
        self.addPageTemplates([
            PageTemplate(id="Cover", frames=[frame_cover], onPage=_on_cover),
            PageTemplate(id="Body",  frames=[frame_body],  onPage=_on_page),
        ])

doc = MyDoc(OUTPUT_PATH, pagesize=A4,
            leftMargin=MARGIN_L, rightMargin=MARGIN_R,
            topMargin=MARGIN_T, bottomMargin=MARGIN_B,
            title="Panduan Opsi A - Split Manual Blender UI -> ShoeShop 3D",
            author="ShoeShop 3D Configurator",
            subject="Pipeline Blender ke Web Live")

# =============================================================================
# 1. COVER PAGE
# =============================================================================
story = []
# Cover is auto-rendered by _on_cover canvas for page 1, just page break to Body TOC
story.append(NextPageTemplate("Body"))
story.append(PageBreak())

# =============================================================================
# 2. DAFTAR ISI
# =============================================================================
story.append(Paragraph("DAFTAR ISI", S_Chapter))
story.append(Spacer(1, 4))

toc_rows = [
    ["1", "Pendahuluan - Apa itu Opsi A & Alur Kerja",                                     "4"],
    ["2", "Persiapan Awal - Peralatan & Path FBX Source",                                 "4"],
    ["3", "TABEL WAJIB: Konvensi Nama Object Blender <-> mesh_target DB",                  "5"],
    ["4", "BAB 1: Tutorial Blender UI - Leather Boot (12 Langkah Detail)",                 "6"],
    ["",   " 4.1 Import FBX (Step 1-8)",                                                  "6"],
    ["",   " 4.2 Apply Transform (Step 9 - WAJIB)",                                       "7"],
    ["",   " 4.3 Select & Split Per-Bagian (Step 10)",                                    "7"],
    ["",   " 4.4 Verifikasi Outliner (Step 11)",                                          "8"],
    ["",   " 4.5 Export GLB (Step 12 - KRITIS!)",                                         "8"],
    ["5", "BAB 2: Tutorial Blender UI - Chelsea Boot + Panel Elastic",                    "9"],
    ["6", "BAB 3: Cara Masukkan GLB ke Website (3 Cara)",                                 "10"],
    ["",   " 6.1 Cara 1 (Paling Mudah): Kirim Nama File ke Chatbot",                      "10"],
    ["",   " 6.2 Cara 2: Update DB via Script PHP Sendiri",                               "11"],
    ["",   " 6.3 Cara 3: Update DB via Artisan Tinker",                                   "12"],
    ["7", "BAB 4: Test Precision Swatch (5 Test Case Wajib)",                             "13"],
    ["8", "BAB 5: Tabel Tips & FAQ Trik Detail Kecil (Bila Masalah)",                     "14"],
    ["9", "BAB 6: Langkah Setelah Export Selesai & Rollback (Bila Salah)",                "15"],
    ["",   " Format Reply Chat untuk Proses Otomatisasi",                                 "15"],
]
toc_tbl_rows = [[Paragraph(r[0], S_TocH1 if r[0] != "" else S_TocItem),
                 Paragraph(r[1], S_TocH1 if r[0] != "" else S_TocItem),
                 Paragraph(r[2], S_TocH1 if r[0] != "" else S_TocItem)]
                for r in toc_rows]
t = Table(toc_tbl_rows, colWidths=[1.0 * cm, 13.4 * cm, 1.4 * cm])
t.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("LINEBELOW", (0, 0), (-1, 0), 0.5, ACCENT),
    ("LINEBELOW", (0, 3), (-1, 3), 0.3, HexColor("#e5e7eb")),
    ("LINEBELOW", (0, 9), (-1, 9), 0.3, HexColor("#e5e7eb")),
    ("LINEBELOW", (0, 13), (-1, 13), 0.3, HexColor("#e5e7eb")),
    ("LINEBELOW", (0, 17), (-1, 17), 0.3, HexColor("#e5e7eb")),
    ("LEFTPADDING",  (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING",   (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING",(0, 0), (-1, -1), 4),
    ("BACKGROUND", (0, 1), (-1, 2), LIGHT_BG),
    ("BACKGROUND", (0, 4), (-1, 8), HexColor("#eff6ff")),
    ("BACKGROUND", (0, 10), (-1, 12), HexColor("#ecfdf5")),
    ("BACKGROUND", (0, 14), (-1, 14), HexColor("#fef9c3")),
    ("BACKGROUND", (0, 16), (-1, 18), HexColor("#fef2f2")),
]))
story.append(t)
story.append(Spacer(1, 14))
story.append(Paragraph(
    "<b>Catatan Penting:</b> Panduan ini diformat untuk Blender 5.2 LTS (sudah terinstall di PC ini)."
    " Nama object di Outliner Blender HARUS sama persis dengan Tabel di Bagian 3 agar swatch presisi"
    " per-bagian bekerja. Kesalahan ejaan = warnai seluruh badan (fallback).",
    S_Tip))
story.append(PageBreak())

# =============================================================================
# BAB 1 - PENDAHULUAN
# =============================================================================
story.append(Paragraph("BAB 1 - PENDAHULUAN: APA ITU OPSI A & ALUR KERJA", S_Chapter))
story.append(Paragraph("1.1 Mengapa Opsi A (Manual Blender UI)?", S_Section))
story.append(Paragraph(
    "Script split otomatis Toolkit v0.3 menggunakan heuristik geometri (ukuran polygon & ketinggian z) untuk memisahkan "
    "1 mesh watertight Tripo menjadi 8 bagian. Namun tekstur 4K kamu sudah memiliki batasan warna yang sangat jelas "
    "(contoh: toe cap oranye moc toe vs upper coklat tua di leather boot, panel elastic hitam vs kulit ular glossy di "
    "chelsea boot), sehingga pemisahan manual via Blender UI hasilnya 100% presisi.", S_Body))

story.append(Paragraph("1.2 Alur Kerja Ringkas", S_Section))
story.append(Paragraph(
    "Opsi A TIDAK memerlukan sambungan real-time antara Blender dan Web. Pipeline sangat sederhana:", S_Body))
steps_flow = [
    ("LANGKAH 1 - EDIT DI BLENDER UI",
     "Import FBX polos -> Apply transform Ctrl+A x3 -> Circle Select sesuai area warna -> P (Separate Selection) ->"
     " Rename object ke nama standard (Tabel Bagian 3) -> Select All object."),
    ("LANGKAH 2 - EXPORT GLB DARI BLENDER",
     "File -> Export -> glTF 2.0 (.glb) -> Centang [Selected Objects, Embed Textures, Y Up, Apply Modifiers, Tangents] ->"
     " Simpan langsung ke folder: d:\\Project\\shoesshop\\public\\3d-assets\\leather-boot-MANUAL-v1.glb."),
    ("LANGKAH 3 - UPDATE DB (1 KLIK / 30 DETIK)",
     " Jalankan script PHP helper (disediakan BAB 3) atau chat nama file -> DB products.glb_model_path terupdate."),
    ("LANGKAH 4 - RELOAD BROWSER = LIVE!",
     " Ctrl + Shift + R (Hard Refresh) di Chrome/Edge -> model 3D baru otomatis muncul, swatch presisi langsung berfungsi."),
]
for ttl, body in steps_flow:
    story.append(Paragraph(ttl, S_StepTitle))
    story.append(Paragraph(body, S_StepBody))
story.append(Spacer(1, 6))

story.append(Paragraph("1.3 Target Akhir", S_Section))
story.append(Paragraph(
    "Setelah mengikuti panduan ini, klik swatch <b>Kulit Hitam Full Grain</b> hanya akan mengubah warna mesh_upper"
    " (kulit badan) saja. Toe cap, sole karet, eyelet logam, dan laces TETAP warna asli. Price breakdown menambahkan"
    " Rp 25.000 presisi sesuai option DB. Jika ingin toe cap juga bisa di-swatch terpisah -> pisahkan jadi object"
    " mesh_toe_cap sendiri.", S_Body))
story.append(PageBreak())

# =============================================================================
# BAB 2 - PERSIAPAN AWAL
# =============================================================================
story.append(Paragraph("BAB 2 - PERSIAPAN AWAL", S_Chapter))
story.append(Paragraph("2.1 Daftar Alat Yang Sudah Tersedia di PC Ini", S_Section))
tools_rows = [
    ["No", "Nama Alat", "Versi / Path", "Status"],
    ["1",  "Blender 5.2 LTS", "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe", "TERINSTAL"],
    ["2",  "Source FBX Leather Boot Polos (single watertight mesh)",
           "d:\\Project\\shoesshop\\3D Assets\\leather+boot+3d+model+polos\\tripo_convert_a6fcbedd-*.fbx", "SIAP"],
    ["3",  "Source PBR Textures Leather (.fbm folder)",
           "sama seperti diatas, folder .fbm berisi 5 map 4K basecolor/normal/metallic/roughness/rm", "SIAP - AUTOLOAD"],
    ["4",  "Source FBX Chelsea Boot Polos",
           "d:\\Project\\shoesshop\\3D Assets\\chelsea+boot+3d+model+polos\\tripo_convert_3c93559e-*.fbx", "SIAP"],
    ["5",  "Source PBR Textures Chelsea (.fbm folder)", "sama seperti diatas", "SIAP - AUTOLOAD"],
    ["6",  "Folder Web Public output GLB", "d:\\Project\\shoesshop\\public\\3d-assets\\", "SIAP (sudah di-create)"],
    ["7",  "SQLite Database + kolom glb_model_path", "d:\\Project\\shoesshop\\database\\database.sqlite (ProductSeeder)", "SIAP"],
    ["8",  "PHP Runtime", "PHP CLI (Laravel artisan / update-glb-manual.php)", "SIAP"],
]
story.append(table(tools_rows, widths=[0.9*cm, 4.7*cm, 9.0*cm, 2.2*cm]))
story.append(Spacer(1, 10))

story.append(Paragraph("2.2 Persiapan Mental & Waktu", S_Section))
story.append(Paragraph(
    "Total waktu pengerjaan 1 model = <b>~10 menit</b>. 2 model = ~20 menit. Hasilnya presisi abadi, tidak akan berubah"
    " sampai kamu edit object lagi di Blender. Jika nanti kamu ingin menambah model baru (Oxford / Loafer / Sneaker) ->"
    " ulangi panduan ini untuk file FBX model baru.", S_Body))

story.append(Paragraph("2.3 Pembersihan Scene Sebelum Mulai (PENTING!)", S_Section))
story.append(Paragraph(
    "Hindari sisa object lampu / kamera / cube default masuk ke export GLB. Lakukan:", S_Body))
clean_rows = [
    ["1", "Buka Blender -> klik General"],
    ["2", "Outliner (kanan atas pohon object): klik Cube -> X -> Delete"],
    ["3", "Klik Light -> X -> Delete"],
    ["4", "Klik Camera -> TIDAK USAH DIHAPUS (tidak ke-export GLB)."],
    ["5", "Jika kamu baru selesai edit model sebelumnya, simpan file .blend terlebih dahulu, lalu File -> New -> General"
          " untuk scene bersih."],
]
story.append(table(clean_rows, widths=[0.8*cm, 15.8*cm]))
story.append(PageBreak())

# =============================================================================
# BAB 3 - TABEL WAJIB: KONVENSI NAMA OBJECT
# =============================================================================
story.append(Paragraph("BAB 3 - TABEL WAJIB: KONVENSI NAMA OBJECT (EJAAN PERSIS!)", S_Chapter))
story.append(Paragraph(
    "Kolom <b>Nama Object Blender</b> = nama yang kamu ketik saat tekan F2 rename object di Outliner. Kolom"
    " <b>mesh_target DB</b> = kolom CustomizationOption.mesh_target yang sudah di-setup di DB. Klik swatch di website"
    " -> match exact lowercase nama object -> HANYA ubah 1 mesh itu (presisi!). Tidak match = warnai seluruh badan.",
    S_Warn))
story.append(Spacer(1, 6))

name_rows = [
    ["#", "Nama Object Blender (F2 rename)", "mesh_target DB (CustomizationOption)",
     "Contoh Area di 3D", "Leather", "Chelsea"],
    ["1", "mesh_upper",       "material_upper",   "Kulit badan utama (coklat / kulit ular glossy)", "WAJIB", "WAJIB"],
    ["2", "mesh_toe_cap",     "material_toe_cap", "Ujung kaki oranye moc toe (pisah jika mau di-swatch)", "OPSIONAL", "-"],
    ["3", "mesh_sole",        "sole",             "Sol karet bawah hitam gerigi lug / karet hitam", "WAJIB", "WAJIB"],
    ["4", "mesh_insole",      "material_insole",  "Sol dalam (atas sole, jarang terlihat)", "DIANJURKAN", "DIANJURKAN"],
    ["5", "mesh_laces",       "laces",            "Tali sepatu kulit coklat / nilon hitam", "WAJIB", "-"],
    ["6", "mesh_hardware",    "hardware",         "Eyelet logam 6-8 biji (silver/brass) / Pull Tab Chelsea", "WAJIB", "WAJIB"],
    ["7", "mesh_welt",        "material_welt",    "Cincin tipis kuning diantara upper-sole (Goodyear welt)", "WAJIB", "WAJIB"],
    ["8", "mesh_stitching",   "material_stitching", "Benang jahit putih/kuning di garis jahitan", "DIANJURKAN", "DIANJURKAN"],
    ["9", "mesh_panel_chelsea","material_panel",  "Panel elastic hitam memanjang di SISI KIRI & KANAN (khusus Chelsea!)", "-", "WAJIB"],
]
story.append(table(name_rows,
    widths=[0.6*cm, 4.0*cm, 3.7*cm, 5.7*cm, 1.3*cm, 1.3*cm]))
story.append(Spacer(1, 6))
story.append(Paragraph(
    "⚡ Tips Cepat: Jika di Blender object list kamu terdeteksi 7/9 tidak masalah (yang WAJIB harus ada, DIANJURKAN"
    " lebih bagus, OPSIONAL jika dipisahkan). Script web fallback otomatis untuk object yang missing.",
    S_Tip))
story.append(PageBreak())

# =============================================================================
# BAB 4 - LEATHER BOOT TUTORIAL BLENDER UI (12 LANGKAH)
# =============================================================================
story.append(Paragraph("BAB 4 - TUTORIAL BLENDER UI: LEATHER BOOT (12 LANGKAH)", S_Chapter))

# 4.1 Step 1-8: Import FBX
story.append(Paragraph("4.1 Import FBX Source Polos (Step 1 - 8)", S_Section))
import_steps = [
    ("STEP 1: Buka Blender 5.2 LTS",
     "Double klik shortcut di Desktop, atau cari via Start Menu -> Blender 5.2 LTS."),
    ("STEP 2: New Scene General",
     "Klik tile General pada screen start. Jika sudah terbuka scene kosong, lanjut."),
    ("STEP 3: Bersihkan Cube + Light",
     "Outliner panel kanan atas -> klik Cube -> X -> Delete. Klik Light -> X -> Delete."),
    ("STEP 4: Menu Import FBX",
     "Menu bar ATAS: File -> Import -> FBX (.fbx). Jangan pilih menu lain (import OBJ / gltf salah format)."),
    ("STEP 5: Navigasi Path Source Leather",
     "File Browser: buka d:\\Project\\shoesshop\\3D Assets\\leather+boot+3d+model+polos\\"
     " -> pilih file tripo_convert_a6fcbedd-XXXX-XXXX-XXXX-XXXXXXXXXXXX.fbx (size 60-100MB) -> JANGAN pilih file JPEG/PNG."),
    ("STEP 6: Centang Opsi Import (Kanan Bawah)",
     "Panel kanan bawah import options: PASTI centang [✓] Custom Normals, [✓] Image Search (auto tarik textures dari .fbm)."
     " Uncheck [ ] Automatic Bone Orientation (karena object static, tanpa rig)."),
    ("STEP 7: Klik Import FBX",
     "Klik tombol biru IMPORT FBX di pojok kanan bawah browser import."),
    ("STEP 8: Tunggu 3-5 Detik & Verify Single Object",
     "Viewport munculkan sepatu kulit 3D dengan tekstur coklat base. Outliner: hanya 1 object bernama tripo_node_xxx"
     " (single watertight mesh dari Tripo). Klik kanan object di Outliner -> Rename sementara jadi boot_temp -> Enter."),
]
for t, b in import_steps:
    story.append(Paragraph(t, S_StepTitle))
    for line in b.strip().splitlines():
        if line.strip():
            story.append(Paragraph(line, S_StepBody))

# 4.2 Step 9: Apply Transforms
story.append(Paragraph("4.2 Apply All Transform (Step 9 - JANGAN DILIWATKAN!)", S_Section))
story.append(Paragraph(
    "Jika dilewatkan, setelah export GLB ke web posisi origin bisa terbang (model ada di luar kamera / bingkai putih)."
    " Koordinat tidak akan cocok dengan viewer R3F.", S_Warn))
story.append(Paragraph(
    "Outliner: klik object boot_temp (outline jadi ORANYE = object aktif).", S_Body))
keyboard_rows = [
    ["1", "Tekan tombol keyboard CTRL + A", "Menu pop-up -> klik LOCATION"],
    ["2", "Tekan tombol keyboard CTRL + A LAGI", "Menu pop-up -> klik ROTATION"],
    ["3", "Tekan tombol keyboard CTRL + A LAGI", "Menu pop-up -> klik SCALE"],
]
story.append(table(keyboard_rows, widths=[0.9*cm, 5.2*cm, 10.5*cm]))

# 4.3 Step 10: Select & Split
story.append(Paragraph("4.3 Select & Split Per-Bagian (Step 10 - Inti Pekerjaan)", S_Section))
story.append(Paragraph(
    "Pemisahan dilakukan di Edit Mode (klik TAB). Karena tekstur sudah punya pembatas warna jelas -> MUDAH!", S_Body))

story.append(Paragraph("4.3.1 Tombol Shortcut Penting (Hafalkan / Buka di Monitor Samping)", S_Sub))
shortcut_rows = [
    ["Kombinasi", "Fungsi", "Waktu Pakai"],
    ["TAB", "Toggle Object Mode <-> Edit Mode", "Mulai / selesai edit"],
    ["C", "Circle Select mode (drag lingkaran select area muka)", "Pilih setiap bagian"],
    ["Mouse Scroll Up/Down", "Saat Circle Select: kecil/besar radius lingkaran", "Select detail / bulk"],
    ["P", "Menu Separate (pisah jadi object baru)", "Setelah seleksi selesai"],
    ["P -> Selection", "Opsi Separate yang paling aman (hanya memisahkan terpilih)", "HITAM / selalu pilih ini"],
    ["Ctrl + L", "Select Linked (pilih 1 face -> otomatis select semua benang stitching dalam 1ms!)", "Stitching / benang2 terhubung"],
    ["Alt + A", "Select None (unselect semua muka / reset pilihan)", "Jika salah select"],
    ["Shift + Drag Circle", "Unselect subset (kurangi pilihan)", "Kebetulan kelebihan pilih area"],
    ["Z", "Menu Shading / Toggle Wireframe", "Lihat bagian dalam tersembunyi (insole / stitching dalam)"],
    ["F2 (Object Mode)", "Rename object (di Outliner juga bisa klik object -> F2)", "Setelah separate object baru"],
]
story.append(table(shortcut_rows, widths=[3.2*cm, 9.2*cm, 4.2*cm]))
story.append(Spacer(1, 6))

story.append(Paragraph("4.3.2 Urutan Pemisahan (Dianjurkan: Sulit -> Gampang)", S_Sub))
story.append(Paragraph(
    "Saya sarankan pisahkan DARI YANG TERKECIL / TERJELAS (stitching, eyelet hardware, laces, panel chelsea, welt)"
    " -> insole, sole, toe cap -> sisanya otomatis = upper. Sehingga bagian terbesar (upper) terakhir tinggal sisa."
    " Pola untuk SETIAP BAGIAN selalu sama:", S_Body))
story.append(Paragraph(
    "<b>Urut Pola (Ulangi per bagian):</b> 1) Edit Mode, Face Select -> 2) Circle Select area warna target ->"
    " 3) Alt+Click Face jika ada area kecil yang missed -> 4) P (Separate) -> Selection -> 5) TAB Object Mode ->"
    " 6) Klik object baru di Outliner -> F2 rename ke nama standard (Tabel Bab 3) -> 7) Kembali ke object sisa boot_temp"
    " -> TAB Edit Mode lagi, ulangi.", S_Tip))

separate_seq_rows = [
    ["Bagian ke-", "Nama Object Target", "Cara Pilih Cepat (Tips Pakai Warna Terlihat di Viewport)"],
    ["1", "mesh_stitching", "Pilih 1 muka kecil benang putih di jahitan upper -> CTRL + L -> auto select SEMUA benang"
                             " connected. Cek Z Wireframe bila ada benang di dalam yang belum ke-select. P -> Selection."],
    ["2", "mesh_hardware (eyelet logam)", "Circle Select kecil (scroll kecil radius) pada 6-8 bulatan eyelet logam"
                                            " di sisi tali sepatu. Shift drag untuk hapus select yang terlalu lebar."
                                            " Pilih BOTH sisi kiri dan kanan eyelet sekaligus. P -> Selection."],
    ["3", "mesh_laces (tali sepatu)", "Circle Select tali coklat menembus eyelet dari atas kebawah. 6-8 helai tali."
                                       " Jika bagian upper kulit ke-select, Shift drag unselect. P -> Selection."],
    ["4", "mesh_welt (kuning tipis diantara)", "Lingkari seleksi area tipis diantara upper-sole berwarna kuning muda."
                                                 " Pilih sepanjang perimeter sepatu (gunakan Wireframe Z bila perlu)."
                                                 " P -> Selection."],
    ["5", "mesh_toe_cap (opsional oranye moc)", "Ujung kaki warna oranye MUDA terlihat jelas batasnya dengan coklat tua"
                                                  " upper. Cricle Select area oranye. P -> Selection."],
    ["6", "mesh_insole (sol dalam)", "Lihat dari atas (Ctrl + 7 = Top View). Select bagian dalam rata sol yang tampak"
                                      " di dalam upper, bertekstur kulit dalam. P -> Selection."],
    ["7", "mesh_sole (karet gerigi bawah)", "Flip kamera bawah (Ctrl + 8 = Bottom View). Select SEMUA karet hitam"
                                              " gerigi lug termasuk heel. HATI-HATI jangan sampai welt ikut. P -> Selection."],
    ["8", "mesh_upper (kulit badan - SISA OTOMATIS!)", "SISA object boot_temp sekarang OTOMATIS = mesh_upper. Klik object"
                                                        " boot_temp -> F2 -> rename mesh_upper -> Enter. ✅ SELESAI SPLIT."],
]
story.append(table(separate_seq_rows, widths=[1.6*cm, 3.6*cm, 11.4*cm]))
story.append(PageBreak())

# 4.4 Step 11: Outliner Verify
story.append(Paragraph("4.4 Verifikasi Outliner (Step 11)", S_Section))
story.append(Paragraph(
    "Keluar ke Object Mode (TAB keluar dari Edit Mode). Lihat panel kanan atas Outliner tree. Centang checklist:"
    " Jumlah object ideal = 7 (tanpa toe cap) atau 8 (dengan toe cap opsional).", S_Body))
checklist_rows = [
    ["[ ]", "mesh_upper",       "✅ YA / SELALU WAJIB"],
    ["[ ]", "mesh_sole",        "✅ YA"],
    ["[ ]", "mesh_laces",       "✅ YA"],
    ["[ ]", "mesh_hardware",    "✅ YA"],
    ["[ ]", "mesh_welt",        "✅ YA"],
    ["[ ]", "mesh_stitching",   "disarankan"],
    ["[ ]", "mesh_insole",      "disarankan"],
    ["[ ]", "mesh_toe_cap",     "opsional moc toe oranye"],
]
story.append(table(checklist_rows, widths=[1.0*cm, 4.2*cm, 11.4*cm]))

story.append(Paragraph(
    "⚠️ Jika masih ada object bernama boot_temp sisa 0 polygon: Klik object tersebut di Outliner -> X -> Delete"
    " (hapus object kosong supaya tidak ke-export).", S_Warn))

# 4.5 Step 12: Export GLB
story.append(Paragraph("4.5 Export GLB ke Folder Public Web (Step 12 - KRITIS BANGET!)", S_Section))
story.append(Paragraph(
    "Salah centang disini = TEXTURES 4K HILANG di web (model jadi putih plastik). Ikuti dengan teliti:", S_Warn))

export_checklist = [
    ("EXPORT STEP 1: SELECT ALL OBJECTS",
     "Di Object Mode, tekan tombol keyboard A = SELECT ALL. Outliner: semua 7-8 object berwarna BIRU ter-select (atau drag"
     " mouse dari object paling atas ke paling bawah di Outliner)."),
    ("EXPORT STEP 2: Menu Export glTF 2.0",
     "Menu bar ATAS: File -> Export -> glTF 2.0 (.glb/.gltf). JANGAN EXPORT FORMAT LAIN."),
    ("EXPORT STEP 3: Navigasi Save Path + Nama File",
     "File Save As bar paling bawah: ketik PATH WAJIB INI (copy paste untuk menghindari salah ketik):"),
    ("EXPORT STEP 3 PATH LEATHER:", ""),
]
for t, b in export_checklist[:3]:
    story.append(Paragraph(t, S_StepTitle))
    if b: story.append(Paragraph(b, S_StepBody))
story.append(Paragraph(
    'd:\\Project\\shoesshop\\public\\3d-assets\\leather-boot-MANUAL-v1.glb',
    S_Code))
story.append(Paragraph(
    "⚠️ Pastikan path di atas TERNAVIGASI dengan benar di file browser export (bukan di folder user / documents)."
    " File extension HARUS .glb (jangan .gltf / .gltf separate textures).", S_Warn))

story.append(Paragraph("EXPORT STEP 4: Panel Kanan Bawah = CENTANG SESUAI TABEL (PALING PENTING!)", S_StepTitle))
export_opt_rows = [
    ["Group Option", "Sub Option", "Nilai / Action", "Status Centang"],
    ["General", "Selected Objects", "Hanya object yang dipilih di-select", "✅✅✅ WAJIB 100%"],
    ["General (Format)", "Format", "glTF Binary (.glb)", "✅ (bukan separate / embedded gambar)"],
    ["Include", "✓ Custom Properties", "Data object (mesh name) ikut export", "✅"],
    ["Include", "✓ Cameras / ✓ Lights", "OFF / UNCHECKED", "❌ JANGAN dicentang (viewer R3F punya lighting sendiri)"],
    ["Transform", "+Y Up", "Scaling 1.00 default (tidak ubah)", "✅ DEFAULT (sesuai THREE.js +Y)"],
    ["Geometry", "Normals", "ON (default)", "✅"],
    ["Geometry", "Tangents", "✅ ON (Aktifkan)", "✅ WAJIB agar normal map pori kulit bekerja"],
    ["Geometry", "UVs", "ON (default)", "✅"],
    ["Geometry", "Loose Edges / Loose Points", "OFF", "❌"],
    ["Materials", "Export -> Principled BSDF", "Default (Pakai nama ini)", "✅"],
    ["Materials", "Textures -> EMBED", "Embed Textures (masukkan 4K ke GLB file)", "✅✅✅ PALING PENTING, TIDAK BOLEH TERLEWAT!"],
    ["Data", "Apply Modifiers", "✅ ON", "✅"],
    ["Data", "Mesh Quantization / Compression", "OFF (biarkan nanti post-process website)", "❌"],
]
story.append(table(export_opt_rows,
    widths=[2.5*cm, 4.2*cm, 6.2*cm, 3.9*cm]))
story.append(Spacer(1, 6))

story.append(Paragraph("EXPORT STEP 5: Klik Export + Verify Size GLB", S_StepTitle))
story.append(Paragraph(
    "Klik tombol EXPORT GLTF 2.0 (biru tua) pojok kanan bawah. Tunggu 5-12 detik (4K textures sedang di-embed). Buka"
    " Windows Explorer ke folder d:\\Project\\shoesshop\\public\\3d-assets\\ -> Cek file leather-boot-MANUAL-v1.glb:"
    " <b>Size = 80 MB - 110 MB (normal)</b>. Jika ukuran < 15 MB = textures TIDAK ke-embed, ulangi Export Step 4 dan"
    " pastikan [✓] Embed Textures dicentang!", S_Warn))
story.append(PageBreak())

# =============================================================================
# BAB 5 - CHELSEA BOOT TUTORIAL BLENDER UI
# =============================================================================
story.append(Paragraph("BAB 5 - TUTORIAL BLENDER UI: CHELSEA BOOT + PANEL ELASTIC", S_Chapter))
story.append(Paragraph(
    "Ulangi 100% langkah BAB 4 (Step 1-12) PERSIS! Sumber FBX diganti ke folder Chelsea, dan di Step 10 (Select & Split)"
    " kamu TAMBAH 1 bagian khusus yaitu mesh_panel_chelsea.", S_Info))

story.append(Paragraph("5.1 Source FBX Chelsea (Step 5 Import)", S_Section))
story.append(Paragraph(
    "Import FBX path berikut:", S_Body))
story.append(Paragraph(
    'd:\\Project\\shoesshop\\3D Assets\\chelsea+boot+3d+model+polos\\tripo_convert_3c93559e-2171-4beb-8a67-9af2dd80e37f.fbx',
    S_Code))

story.append(Paragraph("5.2 Step 10: Tambah Object mesh_panel_chelsea", S_Section))
story.append(Paragraph(
    "Setelah selesai pisahkan mesh_laces (atau sebelum mesh_upper sisa):", S_Body))
panel_rows = [
    ["Urutan Panel", "Langkah Kerja Persis"],
    ["1", "Pastikan Edit Mode (TAB), Face Select, object aktif = object sisa boot_temp_chelsea."],
    ["2", "Lihat SISI KANAN sepatu chelsea -> area BERPOLA KAIN ELASTIC HITAM MEMANJANG VERTIKAL (bukan kulit ular glossy)."
         " Bentuknya oval memanjang = ciri khas chelsea untuk easy on / off tanpa tali."],
    ["3", "Circle Select (C) -> radius medium -> seleksi panel elastic hitam sisi KANAN. Shift drag untuk kurangi seleksi"
         " bila upper kulit ular ikut ke-select."],
    ["4", "Putar kamera (klik tengah mouse drag) ke SISI KIRI sepatu -> TAHAN SHIFT sambil Circle Select lagi panel"
         " elastic hitam sisi KIRI. Sekarang KEDUA sisi panel kiri+kanan ke-select sekaligus."],
    ["5", "Tekan P -> menu Separate -> klik Selection. Object baru terbuat di Outliner."],
    ["6", "TAB ke Object Mode -> klik object baru di Outliner -> tekan F2 -> KETIK PERSIS: <b>mesh_panel_chelsea</b> -> Enter."],
    ["7", "Lanjutkan ke mesh_welt / mesh_insole / mesh_sole / mesh_upper sisa otomatis seperti urutan BAB 4."],
]
story.append(table(panel_rows, widths=[2.4*cm, 14.2*cm]))

story.append(Paragraph("5.3 Outliner Verifikasi Chelsea (8 Object Ideal)", S_Section))
ver_chelsea_rows = [
    ["[ ]", "mesh_upper",          "✅ Kulit ular glossy (badan utama chelsea)"],
    ["[ ]", "mesh_sole",           "✅ Karet bawah hitam"],
    ["[ ]", "mesh_hardware",       "✅ Pull tab logam belakang chelsea"],
    ["[ ]", "mesh_welt",           "✅ Tipis kuning diantara upper-sole"],
    ["[ ]", "mesh_stitching",      "✅ Benang jahitan"],
    ["[ ]", "mesh_insole",         "✅ Sol dalam"],
    ["[ ]", "mesh_panel_chelsea",  "✅ WAJIB ADA! Sisi kiri + kanan elastic hitam"],
    ["[ ]", "mesh_laces",          "❌ Hapus jika ada (chelsea tidak punya tali, FBX polos chelsea tidak punya laces)"],
]
story.append(table(ver_chelsea_rows, widths=[1.0*cm, 4.2*cm, 11.4*cm]))

story.append(Paragraph("5.4 Export GLB Chelsea", S_Section))
story.append(Paragraph(
    "Select All (A) -> File Export glTF 2.0. Nama file WAJIB:", S_Body))
story.append(Paragraph(
    'd:\\Project\\shoesshop\\public\\3d-assets\\chelsea-boot-MANUAL-v1.glb',
    S_Code))
story.append(Paragraph(
    "Verify size: 80 - 100 MB. < 20 MB = textures gagal embed -> ulangi export centang Embed Textures.", S_Warn))
story.append(PageBreak())

# =============================================================================
# BAB 6 - CARA MASUKKAN KE WEBSITE (3 CARA)
# =============================================================================
story.append(Paragraph("BAB 6 - CARA MASUKKAN FILE GLB KE WEBSITE (3 PILIHAN)", S_Chapter))
story.append(Paragraph(
    "Export GLB sudah berada di folder public/3d-assets -> tinggal update kolom <b>products.glb_model_path</b> di"
    " SQLite database. Terdapat 3 pilihan, pilih yang paling nyaman untuk kamu:", S_Body))

story.append(Paragraph("6.1 Cara 1 - PALING MUDAH & REKOMENDASI: Kirim Nama File ke Chatbot", S_Section))
story.append(Paragraph(
    "TIDAK USAH INSTALL APA-APUN / TIDAK USAH BUKA TERMINAL. Cukup balas chat saya dengan format dibawah, saya otomatis"
    " mengerjakan SEMUA dalam < 2 menit:", S_Tip))
reply_format = [
    "✅ LEATHER EXPORT DONE: leather-boot-MANUAL-v1.glb (XX.XX MB)",
    "✅ CHELSEA EXPORT DONE: chelsea-boot-MANUAL-v1.glb (YY.YY MB)",
    "",
    "🎯 OPSI TAMBAHAN (pilih salah satu atau beberapa):",
    "  [ ] Saya mau kamu test 5 precision swatch di UI browser + screenshot bukti",
    "  [ ] Saya mau tambahkan category toe cap (material_toe_cap) agar moc toe oranye bisa di-swatch terpisah",
    "  [ ] Saya mau aktifkan shader PBR Extended (Sheen + Clearcoat + SSS 0.08) agar lebih realistis",
    "  [ ] Saya mau compress GLB ke ~25MB dengan Draco / meshopt supaya load lebih cepat",
]
story.append(Paragraph("\n".join(reply_format), S_Code))
story.append(Paragraph(
    "Setelah kamu kirim chat di atas, saya akan:", S_Body))
auto_do = [
    "1. Update 2 baris DB Product (leather-boot & chelsea-boot) kolom glb_model_path via script PHP helper.",
    "2. Verify via HEAD request static files served 200 OK (Laravel Vite) + file size sesuai.",
    "3. Buka browser ke /products/leather-boot -> tunggu load GLB -> cek snapshot footer mesh names detected.",
    "4. Buka browser ke /products/chelsea-boot -> cek mesh_panel_chelsea terdeteksi di list.",
    "5. Jalankan 5 precision swatch test sesuai BAB 7 + screenshot bukti visual.",
    "6. Cek math price breakdown exact Rp. (contoh leather: 1.250.000 + 25k + 45k + 150k = 1.470.000)",
]
for i, line in enumerate(auto_do, 1):
    story.append(Paragraph(line, S_Bullet, bulletText=f"✔[{i}]"))

story.append(Paragraph("6.2 Cara 2 - UPDATE DB VIA SCRIPT PHP SENDIRI (30 DETIK)", S_Section))
story.append(Paragraph(
    "Jika kamu ingin belajar cara update DB sendiri tanpa chatbot:", S_Body))

phpsteps = [
    ("PHP STEP 1: Buat File update-glb-manual.php",
     "Buka File Explorer d:\\Project\\shoesshop\\. Klik kanan area kosong -> New -> Text Document -> namakan"
     " <b>update-glb-manual.php</b> (pastikan ekstensi .php bukan .txt -> ubah di folder options View -> centang File Name Extensions)."),
    ("PHP STEP 2: Copy Paste Script Berikut (bila nama file kamu = MANUAL-v1.glb tidak usah edit apa-apa):", ""),
]
for t, b in phpsteps:
    story.append(Paragraph(t, S_StepTitle))
    if b: story.append(Paragraph(b, S_StepBody))

phpcode = r'''<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
use App\Models\Product;

$map = [
    'leather-boot' => '/3d-assets/leather-boot-MANUAL-v1.glb',
    'chelsea-boot' => '/3d-assets/chelsea-boot-MANUAL-v1.glb',
];

foreach ($map as $slug => $path) {
    $p = Product::where('slug', $slug)->first();
    if ($p) {
        $p->glb_model_path = $path;
        $p->save();
        $fullPath = public_path() . $path;
        $sizeMB = file_exists($fullPath)
            ? round(filesize($fullPath) / 1048576, 2) . ' MB'
            : 'FILE NOT FOUND (cek ejaan path!)';
        echo "✅ [OK] $slug -> $path ($sizeMB)\n";
    } else {
        echo "❌ [FAIL] Slug $slug TIDAK ADA di tabel products\n";
    }
}
echo "=== SELESAI. HAPUS FILE INI SETELAH SELESAI. ===";
'''
story.append(Paragraph(phpcode, S_Code))

phpsteps2 = [
    ("PHP STEP 3: Save File + Run di Terminal",
     "Save file (Ctrl+S di Notepad). Buka PowerShell / CMD di folder d:\\Project\\shoesshop -> ketik perintah:"),
    ("PHP STEP 4: Hapus File Sementara (Keamanan!)",
     "Setelah lihat output ✅ OK 2 baris -> hapus file update-glb-manual.php (jangan dibiarkan di production webroot)."),
    ("PHP STEP 5: Hard Refresh Browser",
     "Chrome/Edge -> buka URL http://127.0.0.1:8000/products/leather-boot -> tekan CTRL + SHIFT + R (Hard Refresh clear cache)."
     " Tunggu 45-60 detik untuk load GLB 90MB."),
]
for t, b in phpsteps2:
    story.append(Paragraph(t, S_StepTitle))
    story.append(Paragraph(b, S_StepBody))
story.append(Paragraph(
    'php update-glb-manual.php',
    S_Code))
story.append(PageBreak())

story.append(Paragraph("6.3 Cara 3 - UPDATE DB VIA ARTISAN TINKER (1 Line Per Product)", S_Section))
story.append(Paragraph(
    "Alternatif jika kamu lebih suka Laravel native Tinker CLI (bukan file PHP terpisah):", S_Body))
story.append(Paragraph(
    "Jalankan terminal:", S_Body))
story.append(Paragraph(
    "php artisan tinker",
    S_Code))
story.append(Paragraph(
    "Setelah masuk shell PsySH, paste 2 perintah ini berturut-turut (copy paste 1 baris, enter, lanjut baris berikutnya):",
    S_Body))
tinkercode = r"""
App\Models\Product::where('slug','leather-boot')->update(['glb_model_path'=>'/3d-assets/leather-boot-MANUAL-v1.glb']);

App\Models\Product::where('slug','chelsea-boot')->update(['glb_model_path'=>'/3d-assets/chelsea-boot-MANUAL-v1.glb']);
"""
story.append(Paragraph(tinkercode, S_Code))
story.append(Paragraph(
    "Exit tinker dengan ketik exit -> Enter. Lanjut ke PHP STEP 5 (Hard Refresh).", S_Tip))
story.append(PageBreak())

# =============================================================================
# BAB 7 - TEST PRECISION SWATCH (5 TEST CASE WAJIB)
# =============================================================================
story.append(Paragraph("BAB 7 - TEST PRECISION SWATCH (5 TEST CASE WAJIB!)", S_Chapter))
story.append(Paragraph(
    "Bagian ini akan memverifikasi pipeline berjalan 100% benar. Sebelum test, pastikan model 3D sudah ter-render di"
    " browser (tidak berputar loading, mesh names di bawah canvas 3D muncul). Logic swatch presisi per-bagian ada di"
    " ShoeModel.jsx baris 94-101: exact match `mesh_target` DB dengan Object Name Blender (lowercase trim). Jika object"
    " nama salah = fallback ke allMeshes (warnai SELURUH badan sepatu) -> TEST GAGAL.", S_Warn))
story.append(Spacer(1, 4))

test_headers = ["#", "Produk", "Klik Swatch", "Yang HANYA BERUBAH (Expected)",
                "Price Tambah", "TOTAL Expected"]
test_rows = [
    test_headers,
    ["1", "Leather", "Kulit Hitam Full Grain",
     "mesh_upper (kulit badan) coklat -> HITAM. Toe cap oranye, sole, eyelet, laces TETAP WARNA ASLI!",
     "+Rp 25.000", "Rp 1.275.000"],
    ["2", "Leather", "Sol Commando Lug Tactical",
     "mesh_sole berubah texture karet gerigi lug kasar. Kulit upper TETAP!",
     "+Rp 150.000", "Rp 1.425.000"],
    ["3", "Leather", "Aksesoris Kuning Brass Gold",
     "mesh_hardware (eyelet 6-8 biji) silver -> KUNING metal glossy kilau. Upper tetap!",
     "+Rp 35.000", "Rp 1.460.000"],
    ["4", "Chelsea", "Panel Coklat Elastic (jika ada kategori panel)",
     "mesh_panel_chelsea (sisi kiri+kanan) berubah coklat / warna lain. Kulit badan atas (ular glossy) TETAP!",
     "+Rp 20.000 (contoh)", "Rp 1.000.000"],
    ["5", "Leather / Chelsea", "BUTTON RESET DESAIN (Reset Configuration)",
     "Semua warna kembali DEFAULT HARI PERTAMA. Semua highlight card active hilang.",
     "Rp 0 (kembali base)", "Rp 1.250.000 (leather) / Rp 980.000 (chelsea)"],
]
story.append(table(test_rows,
    widths=[0.7*cm, 1.9*cm, 4.6*cm, 6.3*cm, 2.1*cm, 2.0*cm]))
story.append(Spacer(1, 8))

story.append(Paragraph("Cara Melihat Hasil Test Secara Pasti (Selain Visual)", S_Section))
story.append(Paragraph(
    "Di bawah tombol Tambah ke Keranjang, ada section <b>Harga Breakdown</b> dengan format label persis:"
    " <i>Nama Swatch (mesh_target)</i>. Contoh: <b>Kulit Hitam Full Grain (material_upper)</b> = swatch ini BENAR-BENAR"
    " hanya mengenai object mesh_upper. Jika label tidak ada tulisan (material_upper) di kurung = fallback allMeshes"
    " / mesh_target di CustomizationOption belum ter-setup (kasus option lawas sebelum named mesh).", S_Tip))
story.append(Paragraph(
    "Contoh Breakdown Leather Setelah 3 Swatch Berhasil (MATH EXACT):\n"
    "  Harga Dasar Rp 1.250.000\n"
    "  + Eyelet Black PVD Matte (hardware) +Rp 45.000\n"
    "  + Kulit Hitam Full Grain (material_upper) +Rp 25.000\n"
    "  + Sol Commando Lug Tactical (sole) +Rp 150.000\n"
    "  = TOTAL Rp 1.470.000 ✅ (1.250.000 + 45k + 25k + 150k = 1.470.000 PAS)",
    S_Code))
story.append(PageBreak())

# =============================================================================
# BAB 8 - TIPS & FAQ TABEL
# =============================================================================
story.append(Paragraph("BAB 8 - TIPS & FAQ TRIK DETAIL KECIL (BILA MENGALAMI MASALAH)", S_Chapter))
story.append(Paragraph(
    "Kumpulan solusi cepat untuk masalah yang paling sering muncul saat split manual / integrasi web:", S_Body))
faq_rows = [
    ["#", "MASALAH / PERTANYAAN", "SOLUSI CEPAT"],
    ["1", "Setelah export GLB ke web: model TERBANG / hilang / di luar layar putih. Sementara GLB split script otomatis lama muncul normal.",
     "PASTIKAN BAB 4 -> STEP 9 APPLY TRANSFORM Ctrl+A (Location, Rotation, Scale) dijalankan SEBELUM memisahkan object."
     " LALU: di Export options Transform -> Y Up biarkan default (1.00). Viewer R3F sudah menghitung groundY otomatis via bbox."],
    ["2", "Klik swatch KULIT HITAM malah SELURUH BADAN jadi hitam (bukan cuma upper). Harusnya hanya mesh_upper.",
     "Periksa: a) Snapshot Footer DOM (list mesh names terdeteksi) = apakah ada nama mesh_upper? Jika TIDAK ADA = rename di Blender salah / tidak ke-export."
     " b) Apakah ejaan BENAR? mesh_upper bukan meshupper / mesh_Upper / Mesh_Upper. CASE SENSITIVE TRIMMED lower di store!"],
    ["3", "Render di web terlihat PUTIH / PLATIK. Tekstur 4K pori kulit, normal map, karet tidak muncul. Sampai toe cap oranye tidak ada.",
     "EXPORT STEP 4 -> [✓] EMBED TEXTURES WAJIB DICENTANG! Bila file GLB cuma 7-20MB = textures tidak masuk."
     " Verifikasi size: leather 80-110MB normal. Bila size kecil tapi centang sudah -> cek Blender Shading Editor -> Image Texture baseColor tidak Fake User X."],
    ["4", "Normal map efek pori kulit tidak se-detail preview Tripo di screenshot.",
     "Export Geometry -> TANGENTS = ON (default ON tapi jika manual OFF -> pori hilang). Lalu: Viewer kita sudah ter-setup snapshot 15 fields PBR"
     " (ShoeModel.jsx L49-L65) + m.normalScale.set(1,1) + ACES tone mapping -> pori harusnya terlihat. Jangan lupa: model diputar & lihat samping dengan cahaya sunset!"],
    ["5", "Ingin moc toe oranye LEATHER BISA di-swatch WARNA sendiri (pisah dari upper).",
     "Di Step 10 urutan ke-5: pisahkan toe cap oranye jadi object sendiri mesh_toe_cap. Setelah kamu report nama file MANUAL-v1"
     " ke chatbot -> saya otomatis TAMBAHKAN 4 CustomizationOption di DB kategori material_toe_cap (misal: Natural oranye default,"
     " Black Full Grain +Rp 20k, White Patent +Rp 30k, Red Cherry +Rp 25k) dengan mesh_target=mesh_toe_cap. Tinggal click!",
    ],
    ["6", "BLUNDER SPLIT PARAH! Ingin KEMBALI KE AWAL (ROLLBACK) ke split script otomatis v0.3.1 yang sudah terverifikasi render.",
     "JANGAN PANIK! Cukup chat pesan: <b>ROLLBACK LEATHER</b> atau <b>ROLLBACK CHELSEA</b> atau <b>ROLLBACK KEDUA</b>."
     " Saya akan restore DB products.glb_model_path ke leather-boot-polos-parts.glb (91.31MB) / chelsea-boot-polos-parts.glb (89.06MB)"
     " (hasil split otomatis toolkit v0.3.1 yang 100% render OK). Kamu bisa coba lagi split manual besok tanpa merusak website yang live!"],
    ["7", "Ukuran GLB export 90MB terlalu besar. Loadingnya 60 detik & ERR_ABORTED StrictMode double fetch.",
     "Non-blocking step: Saya jalankan post-process compress `npx gltf-transform optimize --compress meshopt --texture webp`"
     " target ~22-25MB (75% pengurangan). Setelah size kecil -> StrictMode ERR_ABORTED hilang. Chat: <b>COMPRESS GLB MANUAL</b>!"],
    ["8", "Chelsea boot: lupa pisahkan mesh_panel_chelsea, panel elastic & kulit ular masih 1 object mesh_upper.",
     "TIDAK USAH ulangi dari awal export leather. Buka kembali file .blend chelsea yang kamu simpan sebelum export (jika sudah terlanjur ditutup,"
     " Step 1-13 chelsea ulangi ~10 menit saja). Select Edit Mode -> select side panel elastic -> P -> Selection -> rename mesh_panel_chelsea -> Re-Export."],
    ["9", "Perlukah menyimpan file .blend project per model?",
     "AMAT DISARANKAN! Setelah selesai Split & sebelum Export GLB: File -> Save As ->"
     " d:\\Project\\shoesshop\\3D Assets\\_blender_projects\\leather-boot-manual-split-v1.blend (create folder jika belum ada)."
     " Nanti jika ingin menambah detail, hanya perlu buka file .blend, edit object, re-export GLB tanpa pisah ulang dari nol!"],
    ["10", "Seleksi sering kebanyakan / termasuk area yang tidak diinginkan.",
     "Tips: 1) Zoom area target SEMAXIMAL sebelum Circle Select. 2) Setelah rough select -> masuk Wireframe Z untuk cek bagian dalam"
     " ke-select atau tidak -> Shift Drag untuk unselect subset. 3) Stitching & Hardware = selalu gunakan Ctrl+L Select Linked dari 1 face."],
]
story.append(table(faq_rows, widths=[0.6*cm, 6.2*cm, 9.8*cm],
    extras=[
        ("BACKGROUND", (0, 6), (-1, 6), HexColor("#fef2f2")),  # row 6 = rollback warning
        ("BACKGROUND", (0, 5), (-1, 5), HexColor("#fff7ed")),  # toe cap = accent
    ]))
story.append(PageBreak())

# =============================================================================
# BAB 9 - SETELAH EXPORT SELESAI + ROLLBACK
# =============================================================================
story.append(Paragraph("BAB 9 - SETELAH EXPORT SELESAI, FORMAT REPLY, & ROLLBACK", S_Chapter))
story.append(Paragraph("9.1 Checklist Sebelum Mengirim Hasil ke Chatbot / Upload", S_Section))
before_send_rows = [
    ["#", "Checklist Item", "OK / BELUM"],
    ["1", "File GLB Leather tersimpan di public/3d-assets dengan nama persis leather-boot-MANUAL-v1.glb", "[  ]"],
    ["2", "Size file GLB Leather = 80 - 110 MB (artinya textures 4K embedded)", "[  ]"],
    ["3", "File GLB Chelsea tersimpan di public/3d-assets dengan nama persis chelsea-boot-MANUAL-v1.glb", "[  ]"],
    ["4", "Size file GLB Chelsea = 80 - 100 MB", "[  ]"],
    ["5", "Object di Blender Outliner leather ada minimal 7 parts: mesh_upper, mesh_sole, mesh_laces, mesh_hardware, mesh_welt, mesh_stitching, mesh_insole (+ toe cap opsional)", "[  ]"],
    ["6", "Object Chelsea ada minimal 7 parts TERMASUK mesh_panel_chelsea (elastic side)", "[  ]"],
    ["7", "Project Blender disimpan di folder 3D Assets/_blender_projects/ (untuk edit nanti tanpa mulai dari 0)", "[  ]"],
]
story.append(table(before_send_rows, widths=[0.6*cm, 11.8*cm, 2.2*cm]))

story.append(Paragraph("9.2 Format Reply Chat (Copy Paste untuk Proses Otomatisasi)", S_Section))
story.append(Paragraph(
    "Setelah semua checklist OK, copy paste pesan dibawah dan kirim ke chat saya. Proses update DB + test swatch UI browser"
    " + screenshot bukti DILAKUKAN SAYA OTOMATIS (< 5 menit):", S_Tip))
story.append(Paragraph(
    "\n".join([
        "=====================================================",
        "✅ LEATHER EXPORT DONE: leather-boot-MANUAL-v1.glb",
        "   - Size   : 9X.XX MB",
        "   - Object :  mesh_upper, mesh_sole, mesh_laces, mesh_hardware, mesh_welt, mesh_stitching, mesh_insole",
        "                (+ mesh_toe_cap if any)",
        "",
        "✅ CHELSEA EXPORT DONE: chelsea-boot-MANUAL-v1.glb",
        "   - Size   : 8X.XX MB",
        "   - Object :  mesh_upper, mesh_sole, mesh_hardware, mesh_welt, mesh_stitching, mesh_insole, mesh_panel_chelsea",
        "",
        "🎯 OPSI LANJUTAN (beri tanda centang):",
        "   [X] Test 5 precision swatch di browser + screenshot bukti",
        "   [ ] Tambah Category material_toe_cap (jika dipisahkan)",
        "   [ ] Aktifkan Shader PBR Extended (Sheen + Clearcoat + SSS)",
        "   [ ] Compress GLB ke ~25MB Draco / meshopt",
        "=====================================================",
    ]),
    S_Code))

story.append(Spacer(1, 10))
story.append(Paragraph("9.3 Rollback Cepat Jika Hasil Tidak Sesuai (30 Detik)", S_Section))
story.append(Paragraph(
    "Hanya perlu chat pesan ini -> saya otomatis restore DB ke split otomatis toolkit v0.3.1 (render sudah 100% terverifikasi):",
    S_Warn))
rollback_rows = [
    ["Pesan Chat Rollback", "Efek Setelah Dijalankan"],
    ["ROLLBACK LEATHER", "Restore leather-boot.glb_model_path -> /3d-assets/leather-boot-polos-parts.glb (split script, 7 parts, 91MB)"],
    ["ROLLBACK CHELSEA", "Restore chelsea-boot.glb_model_path -> /3d-assets/chelsea-boot-polos-parts.glb (split script, 8 parts panel_chelsea, 89MB)"],
    ["ROLLBACK KEDUA", "Jalankan keduanya sekaligus. Web kembali 100% seperti sebelum kamu lakukan Opsi A manual."],
]
story.append(table(rollback_rows, widths=[6.2*cm, 10.4*cm]))
story.append(Spacer(1, 18))

story.append(Paragraph("AKHIR DOKUMEN PANDUAN OPSI A", S_Chapter))
story.append(Paragraph(
    "Jika kamu mengikuti seluruh langkah dengan teliti, swatch presisi per-bagian akan bekerja 100%. Kesalahan paling umum:"
    " lupa Apply Transform (model terbang di viewer), salah ejaan nama object (warnai seluruh badan = fallback),"
    " lupa centang Embed Textures (model putih plastik). Ketiga masalah itu sudah ada solusinya di BAB 8 FAQ Tabel. "
    "Semua code reference dari pipeline viewer bisa kamu telusuri:", S_Body))
ref_rows = [
    ["Nama File", "Path (klik di VSCode / File Explorer)", "Fungsi"],
    ["shoe_configurator_toolkit.py",
     "d:\\Project\\shoesshop\\tools\\blender\\shoe_configurator_toolkit.py",
     "Script split otomatis v0.3 (referensi jika mau upgrade), tidak dipakai untuk Opsi A."],
    ["ShoeModel.jsx",
     "d:\\Project\\shoesshop\\resources\\js\\components\\shoeconfigurator\\ShoeModel.jsx",
     "Logic viewer R3F + swatch precision mesh_target match (L94-L101), groundY manual positioning (L138-L152), PBR snapshot 15 fields (L49-L65)."],
    ["useShoeStore.js",
     "d:\\Project\\shoesshop\\resources\\js\\components\\shoeconfigurator\\useShoeStore.js",
     "Zustand store: initFromProps sync DB product.glb_model_path ke store glbModelPath (L35-L45), setOption, resetAll, totalPrice Rupiah formatter."],
    ["ShoeConfigurator/index.jsx",
     "d:\\Project\\shoesshop\\resources\\js\\components\\shoeconfigurator\\ShoeConfigurator\\index.jsx",
     "Parent: HEAD check path GLB exists -> fallback optimized -> render ShoeConfiguratorCanvas -> report mesh names list di footer DOM snapshot [e15]."],
    ["database.sqlite",
     "d:\\Project\\shoesshop\\database\\database.sqlite",
     "Tabel Product (slug, base_price, glb_model_path) dan CustomizationOption (mesh_target column presisi per-bagian)."],
]
story.append(table(ref_rows, widths=[4.0*cm, 7.2*cm, 5.4*cm]))
story.append(Spacer(1, 10))
story.append(Paragraph(
    "<b>Selamat berkarya! 🎯 Tinggal balas chat saya dengan format hasil export, saya lanjutkan otomatis dari sini.</b>",
    S_Tip))

# =============================================================================
# RUN BUILD
# =============================================================================
doc.build(story)
print(f"\n✅ PDF BERHASIL GENERATED:\n   Path: {OUTPUT_PATH}\n")
import os
sz = os.path.getsize(OUTPUT_PATH) / 1024
print(f"   Size: {sz:.1f} KB")
