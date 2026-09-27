# 👟 Panduan Pemisahan Mesh + Optimasi di Blender (OTOMATIS + MANUAL)

## 📍 File terkait:
  - Script Blender Python → [shoe_configurator_toolkit.py](file:///d:/Project/shoesshop/tools/blender/shoe_configurator_toolkit.py)
  - Folder aset GLB mentah → `d:\Project\shoesshop\3D Assets\`

---

## ⚙️ LANGKAH 0 — Instalasi Blender 4.x (Sekali saja)

Blender **BELUM TERINSTALL** di PC Anda (berdasarkan pengecekan PATH). Install dulu:

1. Download dari https://www.blender.org/download/ — pilih **Blender 4.2 LTS** (paling stabil untuk addon/glTF impor/exporter).
2. Install dengan setting DEFAULT.
3. Jika Blender tidak terdeteksi di Command Prompt nanti, tambahkan folder `bin` Blender ke PATH Windows:
   - Contoh lokasi: `C:\Program Files\Blender Foundation\Blender 4.2\`
4. **Verifikasi:** Buka Blender → pastikan tampilan splash screen Blender 4.x muncul → klik **General** (template Default).

---

## 🚀 LANGKAH 1 — Jalankan Script Toolkit (2 cara, PILIH SALAH SATU)

### Cara A (Cepat — Run via Text Editor — **REKOMENDASI**)
1. Buka Blender.
2. Klik menu **Scripting** (di workspace selector atas, sebelah Layout/Modeling/Animation).
3. Klik tombol **Open** (panel Text Editor) → browse ke:
   `d:\Project\shoesshop\tools\blender\shoe_configurator_toolkit.py`
4. Klik tombol **▶ Run Script** (tombol segitiga di header Text Editor) → panel info bawah harus menampilkan:
   ```
   ✅ Shoe Configurator Toolkit terload.
      Buka 3D View → tekan N → Tab 'Shoe Toolkit'
   ```
5. Kembali ke workspace **Layout** / **Modeling** → di panel **3D Viewport** tekan tombol **N** (jika sidebar kanan tidak muncul) → klik tab **Shoe Toolkit**.

---

### Cara B (Permanen — Install sebagai Add-on — opsional)
1. `Edit > Preferences > Add-ons > Install...` → pilih file `shoe_configurator_toolkit.py` → centang checkbox untuk enable.
2. Simpan preferensi.
3. Tab "Shoe Toolkit" akan selalu muncul di sidebar 3D View setiap kali buka Blender.

---

## 🧪 LANGKAH 2 — Jalankan Pipeline Full Otomatis (1 tombol!)

1. **Di tab Shoe Toolkit:**
   - **Input GLB:** Klik folder icon → pilih `leather boot 3d model.glb`
     (path: `D:\Project\shoesshop\3D Assets\leather boot 3d model.glb`)
   - **Output Directory:** Pastikan `D:\Project\shoesshop\3D Assets` (default sudah benar)
   - **Output File Name:** `leather-boot-optimized`
   - **Decimate Ratio:** **0.5** (mulai dari ini, hasil masih bagus; bisa di-adjust nanti)
   - **Checklist:**
     - ✅ WebP Textures
     - ✅ Draco Compression (WAJIB!)
     - ✅ Apply Modifiers

2. **Klik tombol MERAH:** **🔥 RUN FULL PIPELINE (Step 1-6)**

3. **Proses yang berjalan otomatis:**
   ```
   [import]  Muat .glb → hapus default kamera/lampu
   [split]   Pisahkan mesh per material slot (jika >1 material)
   [rename]  Cocokkan nama material → mesh_* (lihat RENAME_RULES dibawah)
   [center]  Apply transform → center ke world origin (0,0,0)
   [decimate] Kurangi polycount 50% per mesh
   [export]  Export GLB → WebP textures + Draco → file output 3-7MB
   ```

4. **Buka System Console untuk lihat REPORT DETAIL:**
   - Menu **Window → Toggle System Console** (jendela CMD hitam baru).
   - Disana akan tercetak laporan:
     ```
     === RENAMED ===
       DefaultMaterial_leather_001                 → mesh_upper             mat:leather_brown
       SoleMaterial                                → mesh_sole              mat:black_rubber_sole
       Lace01                                      → mesh_laces             mat:nylon_black
     === SKIPPED (rename manual!) ===
       RandomName_XYZ                              (4210 verts, mat:unknown_metal)
     === DECIMATE REPORT (verts) ===
       mesh_upper                              245,000 → 122,500 (50%)
       mesh_sole                                98,000 →  49,000 (50%)
     ```

---

## 🧹 LANGKAH 3 — Verifikasi & Perbaikan Manual (untuk SKIPPED / salah rename)

> **CATATAN:** Heuristic rename TIDAK PERNAH 100% akurat untuk model artist lain. Wajib cek!

1. **Lihat Outliner (panel kanan atas Blender):**
   - Pastikan semua objek bernama `mesh_*` (contoh: `mesh_upper`, `mesh_sole`, `mesh_laces`, dst).
   - Jika masih ada nama random / objek yang **tidak ter-rename** (karena material tidak match keyword):
     - Klik objek itu di Outliner / klik di 3D View.
     - Lihat dia **bagian apa** (untuk memastikan: klik **H** untuk hide → bagian mana yang hilang dari viewport → itu dia! Klik **Alt+H** untuk unhide kembali).
     - Kembali ke panel **Shoe Toolkit** → dropdown **"Rename to (manual)"** → pilih kategori.
     - Klik **[ 3b. Rename Selected → ]**.
2. **Jika ada 2 bagian yang SALAH digabung (misal `mesh_upper` ikut ter-select ke `mesh_sole`):**
   - Pilih mesh gabungan itu → tekan **Tab** (Edit Mode).
   - Pilih Face Select mode.
   - Klik satu wajah bagian yang SALAH → `Ctrl+L` (Select Linked) → semua wajah bagian itu ke-select.
   - Tekan **`P`** → **Selection** → objek baru dibuat.
   - Rename objek baru sesuai kategori (pilih di Outliner → panel Shoe Toolkit → Rename Selected).
3. **Jika ada bagian YANG HILANG (tidak ada di Outliner):**
   - Kemungkinan materialnya ke-rename salah atau cuma ada 1 material untuk seluruh sepatu → Anda harus pisahkan **100% manual**:
     - Masuk Edit Mode → seleksi per area (gunakan Box Select `B`, Circle `C`, Lasso `Ctrl-LMB-Drag`).
     - Setiap area selesai dipilih → `P` > Selection → rename.

---

## 🧩 Daftar Nama Mesh Target (Wajib Semua Ada Minimal 80%)

| Nama Objek di Blender | Bagian | Wajib Ada? |
|---|---|---|
| `mesh_upper` | Kulit bagian atas (seluruh badan utama sepatu) | ✅ WAJIB |
| `mesh_sole` | Sol luar (bagian yang menyentuh tanah) | ✅ WAJIB |
| `mesh_insole` | Sol dalam / alas kaki | ⚙️ Sebaiknya ada |
| `mesh_laces` | Tali sepatu (jika model tidak punya tali — skip) | ⚙️ Bila ada |
| `mesh_tongue` | Lidah sepatu dibawah tali | ⚙️ Bila ada |
| `mesh_hardware` | Buckle, logam, ring besi, zipper, eyelet | ⚙️ Bila ada |
| `mesh_stitching` | Jahitan (jika terpisah mesh) | 🟢 Opsional |
| `mesh_heel` | Counter tumit belakang, jika separate | 🟢 Opsional |
| `mesh_toe_cap` | Ujung sepatu depan, jika separate | 🟢 Opsional |
| `mesh_lining` | Lapisan dalam sepatu | 🟢 Opsional |

---

## 🎯 LANGKAH 4 — Fine-tuning Decimate (jika hasil model jelek / terlalu gemuk)

### Jika file output MASIH BESAR (>10MB):
- Buka Blender file `..._working.blend` (bila Anda simpan project) ATAU jalankan ulang pipeline dengan:
  - **Decimate Ratio → 0.35**
  - Export, cek ukuran.
- Jika polycount berkurang drastis tapi model "berlubang" / hancur:
  - Pilih mesh yang hancur → Properties panel (obeng) → Modifier → Add Modifier → Decimate → mode **"Planar"** untuk bagian yang flat (sol), atau **"Collapse" ratio 0.6** → Apply secara INDIVIDUAL.
  - Export ulang.

### Jika file output SUDAH KECIL tapi ada cacat visual:
- Nyalakan **Wireframe Overlay**: 3D Viewport → atas kanan → klik ikon kotak garis (atau `Shift+Z` > Wireframe, `Z` toggle mode).
- Lihat bagian kulit yang teksturnya terdistorsi → biasanya mesh tersebut UV-nya hancur kalo Decimate terlalu agresif → Naikin ratio untuk mesh_upper (misal 0.7 untuk upper, 0.4 untuk sole — apply terpisah).

---

## 💾 LANGKAH 5 — Simpan Hasil + Copy ke Folder Public Laravel

1. Setelah export, Anda punya file:
   ```
   D:\Project\shoesshop\3D Assets\leather-boot-optimized.glb  (target 3-8MB)
   ```
2. **Backup file .blend project (SANGAT DIANJURKAN):**
   - `File > Save As` → simpan sebagai `leather-boot-working.blend` di folder 3D Assets — biar kalo mau edit tinggal buka lagi tanpa ulang dari awal.
3. **Jalankan ulang untuk Chelsea Boot:**
   - Ganti **Input GLB** → `chelsea boot 3d model.glb`
   - Ganti **Output File Name** → `chelsea-boot-optimized`
   - Klik **🔥 RUN FULL PIPELINE**
   - Lakukan langkah 3 (verifikasi rename) di atas untuk model kedua.
4. **Copy ke public Laravel** (setelah project Laravel di-Fase-1 nanti):
   ```
   Copy:
     3D Assets\leather-boot-optimized.glb → public\3d-assets\leather-boot-optimized.glb
     3D Assets\chelsea-boot-optimized.glb → public\3d-assets\chelsea-boot-optimized.glb
   ```

---

## 🔍 Verifikasi Akhir (Checklist sebelum lanjut ke Fase 3 coding)

- [ ] ✅ Outliner: semua mesh bernama `mesh_*` (tidak ada nama random / default seperti "Cube.001")
- [ ] ✅ Kamera & Lampu default TIDAK ADA di Outliner
- [ ] ✅ Semua object origin berada di geometry (tidak melayang)
- [ ] ✅ Model menghadap ke arah **sumbu -Y** (depan viewport = depan kamera nanti)
- [ ] ✅ Posisi model duduk di Y=0 (tidak terbang / terbenam)
- [ ] ✅ File output .glb **< 10 MB** (ideal < 7 MB)
- [ ] ✅ Drag-drop file .glb ke https://gltf.report/ → tidak ada error merah, tampilan 3D sempurna, bisa di-rotate normal
- [ ] ✅ Di glTF report: Mesh count ≥ 3, Material count sesuai ekspektasi

---

## 🆘 Troubleshooting Umum

| Gejala | Penyebab | Solusi |
|---|---|---|
| **Tombol Run Script error merah** | Python script dicorrupt / versi Blender terlalu lama | Pastikan Blender ≥4.0. Jika error `unknown class` → tutup Blender, buka ulang, Run Script lagi. |
| **Export error "Draco tidak support UVs"** | Ada mesh tanpa UV map | Tambahkan UV Lightmap Pack: pilih mesh → Edit Mode → Select All → `U` → Lightmap Pack → OK. Ulang export. |
| **Hasil import model "hitam semua"** | Normal vector kebalik | Pilih mesh → Edit Mode → Select All → `Shift+N` (Recalculate Outside). Simpan project, export ulang. |
| **Nama mesh tidak ke-rename sama sekali (All SKIPPED)** | Material model pakai nama aneh yang tidak match RENAME_RULES | Buka script → edit array `RENAME_RULES` di baris atas → tambahkan keyword material Anda → save → Run Script ulang. |
| **System Console tidak terbuka** | Di Windows: `Window > Toggle System Console` | Jika tetap tidak, buka CMD luar, lalu jalankan blender dari CMD: `"C:\Program Files\Blender Foundation\Blender 4.2\blender.exe"` — log akan tampil di CMD tersebut. |

---

## 🔗 Langkah Selanjutnya Setelah Blender Selesai:
Kembali ke implementation plan [3d_shoe_configurator_plan.md](file:///d:/Project/shoesshop/.trae/documents/3d_shoe_configurator_plan.md) → lanjut ke **Fase 1: Scaffold Laravel + Inertia** sampai **Fase 4: Frontend 3D Configurator** (kita integrasikan file `.glb` yang sudah jadi ke Canvas React-Three-Fiber).
