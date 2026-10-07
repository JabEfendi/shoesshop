import pypdfium2 as pdfium
import os

PDF = r"d:\Project\shoesshop\output\pdf\PANDUAN_BLENDER_MANUAL_SPLIT_OPSI_A.pdf"
OUT_DIR = r"d:\Project\shoesshop\output\pdf\_preview"
os.makedirs(OUT_DIR, exist_ok=True)

doc = pdfium.PdfDocument(PDF)
print(f"Total pages: {len(doc)}")

# Render halaman 1 (Cover), 2 (TOC), 3 (Pendahuluan), 6 (Split Leather), 10 (Export/DB), 13 (Swatch Test), 15 (Akhir)
pages_to_render = [0, 1, 2, 5, 9, 12, min(len(doc) - 1, 14)]
for i in sorted(set(pages_to_render)):
    if i >= len(doc):
        continue
    page = doc[i]
    pil_image = page.render(scale=2).to_pil()
    out = os.path.join(OUT_DIR, f"page-{i+1:02d}.png")
    pil_image.save(out)
    print(f"Rendered page {i+1:02d} -> {out} ({pil_image.size[0]}x{pil_image.size[1]})")

print("DONE.")
