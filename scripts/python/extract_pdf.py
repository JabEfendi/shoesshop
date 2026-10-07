import sys
sys.path.insert(0, r'd:\Project\SHOESshop\pylibs')

import pdfplumber

files = [
    r'd:\Project\SHOESshop\Dokumen Pertanyaan & jawaban Kebutuhan Website Sepatu Kulit (done).pdf',
    r'd:\Project\SHOESshop\Rangkuman_dan_Pertanyaan_Lanjutan_Website_Sepatu_Kulit.pdf'
]

output_text = ""

for f in files:
    output_text += f"\n{'='*80}\n"
    output_text += f"FILE: {f.split(chr(92))[-1]}\n"
    output_text += f"{'='*80}\n\n"
    try:
        with pdfplumber.open(f) as pdf:
            for i, page in enumerate(pdf.pages):
                output_text += f"--- Halaman {i+1} ---\n\n"
                text = page.extract_text()
                if text:
                    output_text += text + "\n\n"
                tables = page.extract_tables()
                for ti, table in enumerate(tables):
                    output_text += f"[Tabel {ti+1}]:\n"
                    for row in table:
                        output_text += " | ".join([str(c) if c else "" for c in row]) + "\n"
                    output_text += "\n"
    except Exception as e:
        output_text += f"ERROR membaca file: {e}\n"

with open(r'd:\Project\SHOESshop\extracted_content.txt', 'w', encoding='utf-8') as out:
    out.write(output_text)

print("Ekstraksi selesai. Hasil disimpan ke extracted_content.txt")
print(f"Total karakter: {len(output_text)}")
