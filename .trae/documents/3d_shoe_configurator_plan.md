# 3D Shoe Custom Configurator Implementation Plan

## Repository Research

**Kondisi Proyek Saat Ini (tanggal 2026-09-26):**
- Folder `d:\Project\shoesshop` **BELUM ADA project Laravel** (tidak ditemukan `artisan`, `composer.json`, `package.json`, `vite.config.js`). Jadi semua harus di-scaffold dari awal.
- Sudah ada 2 aset 3D format `.glb` (GLTF Binary) di folder `3D Assets/`:
  - `chelsea boot 3d model.glb` — **66.5 MB**
  - `leather boot 3d model.glb` — **65.4 MB**
- Sudah ada folder gambar referensi per tipe sepatu: `BOOTS/`, `CHELSEA BOOTS/`, `DOCMART/`, `LOAFERS/`, `PANTOFEL/`
- User profile: Fullstack Developer, preferensi tema **Industrial AdminLTE 3.x**, pakai **Laravel + React (Inertia)**, kebutuhan 3D level **Kompleks (Custom Configurator)** — user bisa pilih sol, tali, material/ warna, hitung harga real-time.

**Kesimpulan Riset:**
Plan ini akan memandu dari **0 (scaffold project kosong)** sampai **halaman produk dengan 3D Configurator yang fungsional**, termasuk persiapan aset di Blender.

---

## Files and Modules

| Path | Expected Change |
|---|---|
| (new) seluruh root proyek Laravel | Scaffold Laravel 11 + Breeze Inertia React |
| `composer.json` | Require `laravel/breeze --dev` (scaffold auth + Inertia) |
| `package.json` | Tambah dependensi: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` (opsional) |
| `public/3d-assets/*.glb` | Copy + optimize file aset 3D kesini dari `3D Assets/` |
| `resources/js/Components/ShoeConfigurator/index.jsx` | NEW: Halaman utama Canvas 3D + Panel Configurator (tema AdminLTE) |
| `resources/js/Components/ShoeConfigurator/ShoeModel.jsx` | NEW: Komponen load `.glb`, expose mesh per-bagian |
| `resources/js/Components/ShoeConfigurator/ConfiguratorPanel.jsx` | NEW: Panel UI (card AdminLTE) untuk pilih warna, material, sol, tali |
| `resources/js/Components/ShoeConfigurator/useShoeStore.js` | NEW: State management (Zustand) harga + pilihan user |
| `resources/js/Pages/Product/Show.jsx` | NEW: Halaman detail produk yang mengintegrasikan ShoeConfigurator |
| `routes/web.php` | Tambah route `/products/{slug}` yang merender halaman Show |
| `app/Http/Controllers/ProductController.php` | NEW: Controller handle data produk, variant, harga |
| `app/Models/Product.php`, `ProductVariant.php`, `CustomizationOption.php` | NEW: Model untuk data produk, varian material, harga |
| `database/migrations/*_create_products_tables.php` | NEW: Migration skema produk + opsi custom |
| `database/seeders/ProductSeeder.php` | NEW: Seeder data default (sepatu kulit + opsi custom untuk demo) |
| `resources/js/app.jsx` | Tambah `<Head>` link ke CSS AdminLTE/Bootstrap Industrial |

---

## Implementation Steps (Dependency Order)

### Fase 0 — Instalasi Toolchain (Sekali Setup)
1. **Install Blender 4.x** (gratis, untuk optimasi mesh): https://www.blender.org/download/
2. **Pastikan sudah terinstall:**
   - PHP 8.2+ + Composer
   - Node.js 18+ + npm
   - Database (MySQL/MariaDB atau SQLite untuk demo)

---

### Fase 1 — Scaffold Project Laravel + Inertia React
3. **Buat project Laravel baru di `shoesshop/`:**
   ```bash
   cd d:\Project\shoesshop
   composer create-project laravel/laravel:^11.0 .
   ```
4. **Install Laravel Breeze (starter kit Inertia React):**
   ```bash
   composer require laravel/breeze --dev
   php artisan breeze:install react
   ```
5. **Install dependensi NPM + library 3D:**
   ```bash
   npm install
   npm install three @react-three/fiber @react-three/drei zustand
   # opsional (efek premium):
   npm install @react-three/postprocessing
   ```
6. **Setup environment file:** Copy `.env.example` → `.env`, atur `DB_CONNECTION`, jalankan `php artisan key:generate`
7. **Verifikasi scaffolding:**
   ```bash
   php artisan serve        # backend
   npm run dev              # vite dev server (terminal terpisah)
   ```
   Buka `http://localhost:8000` — pastikan halaman welcome Inertia React muncul.

---

### Fase 2 — Persiapan & Optimasi Aset 3D (di Blender) — KRITIS
> **Mengapa perlu?** Saat ini file `.glb` 65MB terlalu besar. Untuk loading web < 3 detik, targetkan **< 10MB per model**. Selain itu, mesh harus **dipisahkan per bagian** agar bisa diganti warna/material secara individual.

#### A. Pemisahan Mesh Per-Bagian di Blender (Langkah demi Langkah)
8. Buka Blender → `File > Import > glTF 2.0 (.glb/.gltf)` → pilih `leather boot 3d model.glb`.
9. Di **Outliner** (panel kanan atas), expand objek sepatu. Anda akan lihat daftar mesh (mungkin cuma 1 objek besar bernama `Mesh` / `Shoe`).
10. **Mode Edit** (tekan `Tab`) → aktifkan **Face Select** mode.
11. **Pilih bagian SOL (outsole):**
    - Klik satu wajah di bagian sol → tekan `Ctrl+L` (Select Linked) → semua wajah sol akan terpilih.
    - Jika `Select Linked` ke-select seluruh sepatu (karena meshnya masih nyambung), pilih manual dengan `Box Select (B)` atau `C` (Circle Select), sambil sembunyikan bagian lain (`H` untuk hide, `Alt+H` untuk unhide).
12. Setelah bagian sol terpilih sempurna → tekan **`P`** → pilih **"Selection"**. Ini akan memisahkan jadi objek baru.
13. Di Outliner, **rename objek baru** tersebut menjadi `mesh_sole` (PENTING: nama ini akan dipakai di kode JSX).
14. Ulangi langkah 11-13 untuk bagian-bagian berikut (nama standar yang direkomendasikan):
    | Bagian | Nama Objek di Blender | Kegunaan di Configurator |
    |---|---|---|
    | Bagian atas kulit utama | `mesh_upper` | Ganti warna & material kulit |
    | Sol luar | `mesh_sole` | Pilih varian sol (karet, kulit, dll) + harga tambahan |
    | Sol dalam (insole) | `mesh_insole` | Pilih bahan insole |
    | Tali sepatu | `mesh_laces` | Pilih warna tali, tipe tali (bulat/datar) |
    | Lidah sepatu | `mesh_tongue` | Ganti material/ warna lidah |
    | Buckle / hiasan | `mesh_hardware` | Pilih warna besi (silver/gold/black) |
    | Jahitan (jika ada mesh terpisah) | `mesh_stitching` | Ganti warna benang |
15. **Periksa ulang Outliner:** Pastikan setiap objek punya nama yang benar dan **tidak ada mesh yang duplikat/tertinggal**.
16. **Pusatkan Origin Point per Objek:** Pilih semua objek → `Ctrl+Shift+Alt+C` → *Origin to Geometry*.
17. **Centering seluruh model:** Pilih semua → `Ctrl+A` → *All Transforms* → lalu pilih semua → `Shift+S` → *Selection to Cursor* (world origin). Pastikan sumbu Z positif = atas. Rotasi model menghadap ke sumbu **-Y** (depan kamera).

#### B. Optimasi Ukuran File di Blender
18. **Decimate Geometry (kurangi polycount):**
    - Pilih 1 objek (misal `mesh_upper`) → Tab **Modifier Properties** → Add Modifier → **Decimate**
    - Pilih mode **Collapse** → atur **Ratio** sampai model masih terlihat bagus (coba 0.5 dulu, turunkan perlahan). Cek jumlah Face di header Info (atas). Target total seluruh sepatu: **30.000 - 80.000 face** (untuk web).
    - Klik **Apply** setelah puas.
    - Ulangi untuk SEMUA objek (lebih agresif di bagian sol, insole — kurang detail di belakang).
19. **Hapus Objek/Lampu/Kamera Default:** Di Outliner, hapus `Camera` dan `Light` (tidak perlu, kita set lighting nanti di drei). Sisakan ONLY mesh sepatu.
20. **Bake Material jadi Texture Atlas (jika material masih prosedural):**
    - Jika material pakai node kompleks, bake jadi texture PNG 2K (1024 atau 2048). Jangan pakai 4K — terlalu besar.
21. **Export ke GLB:**
    - `File > Export > glTF 2.0`
    - **Format:** `glTF Binary (.glb)`
    - **Include:** Hanya centang ✓ **Selection** (jika sudah pilih semua mesh) — pastikan "Camera" dan "Punctual Lights" **TIDAK** dicentang.
    - **Transform:** ✓ **+Y Up** (default, biarkan)
    - **Geometry:** ✓ **Apply Modifiers**, ✓ **UVs**, ✓ **Normals**
    - **Material:** ✓ **Export Materials**, **Image Format: WebP** (auto compress texture 50-70% lebih kecil dari PNG/JPG). Jika WebP tidak tersedia, pilih JPEG Quality 85.
    - **Compression:** ✓ **Draco** (sangat krusial! Potong ukuran 60-80% tanpa kehilangan detail yang terlihat).
22. Simpan dengan nama: `leather-boot-optimized.glb` ke folder `3D Assets/` (backup dulu file asli!).
23. **Cek hasil ukuran file:** Harusnya sekarang **< 10 MB** (ideal 3-7 MB). Jika masih >15MB, ulangi Decimate dengan Ratio lebih kecil, atau turunkan resolusi texture jadi 1K.
24. Ulangi seluruh langkah 8-23 untuk `chelsea boot 3d model.glb`.

---

### Fase 3 — Backend Laravel (Database + Controller)
25. **Buat Model + Migration + Seeder:**
    - `Product` (id, slug, name, base_price, default_thumbnail, description, glb_model_path)
    - `CustomizationOption` (id, product_id, category: enum['sole','laces','material_upper','hardware','insole'], name, display_name, price_addition, hex_color nullable, mesh_target)
    - Contoh isi: `category='sole', name='karet_hitam', price_addition=50000, mesh_target='mesh_sole'`
    - `OrderCustomization` (untuk simpan pilihan user saat checkout — opsional, bisa dibuat nanti)
26. **Jalankan migration + seeder:**
    ```bash
    php artisan migrate
    php artisan make:seeder ProductSeeder
    # Isi seeder dengan 2 produk (leather boot + chelsea boot) beserta 10+ opsi customisasi
    php artisan db:seed --class=ProductSeeder
    ```
27. **Buat `ProductController.php`** — method `show($slug)` yang mengambil:
    - Data produk (base_price, path .glb)
    - Semua `CustomizationOption` dikelompokkan per `category`
    - Return ke Inertia page `Product/Show` dengan data tersebut.
28. **Tambah route di `routes/web.php`:**
    ```php
    Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');
    ```
29. **Copy aset 3D yang sudah dioptimize:** Paste `leather-boot-optimized.glb` & `chelsea-boot-optimized.glb` ke folder **`public/3d-assets/`** (bisa diakses via URL `/3d-assets/leather-boot-optimized.glb`).

---

### Fase 4 — Frontend React 3D Configurator
30. **Setup state management (Zustand) di `useShoeStore.js`:**
    - State: `basePrice`, `selectedSole`, `selectedLaces`, `selectedUpperMaterial`, `selectedHardware`
    - Computed: `totalPrice = basePrice + sum(price_addition dari semua selected option)`
    - Actions: `setOption(category, option)`, `resetAll()`
31. **Buat `ShoeModel.jsx`** (Komponen 3D):
    - Pakai `useGLTF('/3d-assets/leather-boot-optimized.glb')` untuk load model.
    - Traverse `scene.traverse()` untuk menyimpan referensi setiap mesh ke `useRef` berdasarkan nama (`mesh_sole`, `mesh_upper`, dst).
    - Pakai `useEffect` untuk update material/ warna setiap kali state dari `useShoeStore` berubah:
      - Ubah `material.color.set(hex_color)` untuk ganti warna
      - Ubah `material.roughness` / `material.metalness` untuk ganti jenis material (kulit matte/kulit glossy/logam)
      - Swap `material.map` (texture) jika varian punya texture berbeda
    - Return `<primitive object={scene} {...props} />`
32. **Buat `ConfiguratorPanel.jsx` (UI AdminLTE Industrial):**
    - Wrap dalam `<div className="card">` + `<div className="card-header bg-dark text-white">` + `<h3 className="card-title">Customize Your Shoes</h3>` (nuansa Industrial AdminLTE).
    - Setiap kategori (`Upper Material`, `Sole`, `Laces`, `Hardware`) → buat `<div className="form-group">`:
      - Label tebal
      - Grid pilihan warna/material (bisa pakai swatch warna bulat `input type="color"` atau thumbnail gambar). Kalau ada texture berbeda, tampilkan preview 64x64 px.
      - Di samping setiap opsi: tampilkan label `+ Rp. X.XXX` jika ada tambahan harga.
    - **Bagian bawah panel (card-footer):**
      - Tampilkan **Base Price** (coret tipis) + daftar tambahan harga per kategori → **TOTAL PRICE** dengan font besar & bold warna industrial (kuning/ oranye).
      - Tombol: `<button className="btn btn-lg btn-warning btn-block">` **ADD TO CART** + `<button className="btn btn-lg btn-outline-dark btn-block">SAVE DESIGN / SHARE`
33. **Buat `ShoeConfigurator/index.jsx` (Canvas + Panel layout):**
    - Layout **row (2 kolom)** khas AdminLTE:
      - **Kiri (col-md-8 / col-lg-9):** Card tinggi 80vh yang berisi `<Canvas>` React Three Fiber.
        - Konfigurasi Canvas: `shadows`, `camera={{ position: [0, 1.8, 4.2], fov: 35 }}` (realistis, level mata manusia).
        - Lighting: `<ambientLight intensity={0.4}/>` + `<directionalLight position={[5,10,5]} intensity={1.2} castShadow shadow-mapSize={2048}>` + 1-2 `pointLight` untuk highlight detail kulit.
        - Environment (realistis): `<Environment preset="studio" />` atau `preset="city"` (dari drei) — otomatis bikin material kulit terlihat glossy natural tanpa banyak setup cahaya.
        - Ground shadow tipis: `<ContactShadows opacity={0.4} scale={10} blur={2.5} far={4} />` (dari drei — lebih murah daripada shadow map beneran).
        - Interaksi user: `<OrbitControls enablePan={false} minDistance={2.5} maxDistance={8} minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI/2 - 0.05} />` (tidak bisa lihat bawah sepatu terlalu jauh). Target target lookAt ke (0, 0.8, 0).
        - Auto-rotate demo: tambahkan `<AutoRotate />` dari drei jika user tidak melakukan interaksi selama 3 detik (opsional untuk wow effect landing).
      - **Kanan (col-md-4 / col-lg-3):** `<ConfiguratorPanel>`
34. **Buat halaman `Pages/Product/Show.jsx`:**
    - Bungkus dengan layout default (header AdminLTE, sidebar, footer — sesuaikan dengan project scaffold Breeze nanti).
    - Terima props `{ product, customizationOptions }` dari Controller.
    - Tampilkan breadcrumb: `Home > Products > {product.name}`
    - Tampilkan nama produk (h1), deskripsi produk.
    - Panggil komponen `<ShoeConfigurator product={product} options={customizationOptions} />`.
35. **Integrasi tema AdminLTE CSS:** Di `resources/js/app.jsx` atau Bootstrap app, import CSS Bootstrap 4.x + AdminLTE 3.x:
    - Gunakan CDN `https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css` + font Roboto/Montserrat untuk nuansa Industrial.
    - Pastikan card-header `bg-dark`, tombol `btn-warning` + shadow tebal sesuai tema.

---

### Fase 5 — Testing & Validasi
36. **Unit Check 1 — Load Model:** Buka `/products/leather-boot` → model harus muncul dalam <5 detik (koneksi internet normal). Tidak ada error console WebGL.
37. **Unit Check 2 — Interaksi:** Drag kiri-kanan (rotate), drag kanan (pan), scroll (zoom). Semua berjalan smooth 60fps.
38. **Unit Check 3 — Configurator:** Klik setiap opsi di panel kanan → mesh terkait di model 3D **SEGERA** berubah warna/material (tidak ada delay > 200ms). Harga total di card-footer bertambah otomatis.
39. **Unit Check 4 — Mobile (Responsivitas):** Kecilkan viewport jadi 375px (iPhone SE) → layout otomatis jadi 1 kolom (Canvas di atas, Panel di bawah). Ukuran Canvas menyesuaikan, tidak overflow horizontal.
40. **Performance Check:** Buka Chrome DevTools → Performance → record selama 1 menit interaksi rotate. FPS stabil di atas 40. Memory usage < 500MB.
41. **Build Test:**
    ```bash
    npm run build
    # Pastikan tidak ada error compile. Cek ukuran bundle.js: harusnya < 800KB (three gziped ~150KB + drei ~100KB).
    ```

---

## Dependencies and Considerations

- **Laravel 11.x + Inertia.js + React 18+** (wajib — core stack)
- **Three.js** — engine WebGL low-level (rendering 3D)
- **@react-three/fiber (R3F)** — binding React ke Three.js, membuat 3D bisa di-declare seperti JSX biasa, state management auto-sync
- **@react-three/drei** — helper abstraksi R3F yang sudah battle-tested: `OrbitControls`, `useGLTF`, `Environment`, `ContactShadows`, `AutoRotate`. Ini PENTING — tanpanya Anda harus menulis 500+ baris kode boilerplate untuk controls, lighting PBR, dll.
- **zustand** — state management minimal (3KB) untuk sync pilihan user antara Panel UI dan Komponen 3D. Jangan pakai Redux — overkill. Bisa ganti dengan React Context, tapi Zustand lebih ringan dan tidak trigger re-render tidak perlu.
- **@react-three/postprocessing (opsional)** — efek `EffectComposer` dengan SMAA (anti-aliasing lebih smooth daripada native) + `SSAO` (bikin lekukan kulit tampak lebih 3D). Hanya aktifkan jika FPS masih 60.
- **Pertimbangan khusus untuk AdminLTE:** React Three Fiber Canvas harus ditempatkan dalam container dengan **tinggi explicit (px / vh)**, bukan `height:100%`. Jangan lupa set `position: relative` di parent card.
- **Cross-origin untuk Draco Loader:** drei's `useGLTF` otomatis handle Draco. Jika offline, pastikan folder `/draco-gltf/` tersedia di public — biasanya drei include CDN by default.
- **Asumsi Penting:** User bisa buka Blender dan handle operasi dasar (select, move, rename objek). Jika tidak, bagian Fase 2 bisa didelegasikan ke orang yang bisa Blender, atau saya bisa buatkan script Node.js untuk semi-automate optimasi (namun pemisahan mesh per bagian TETAP harus manual di Blender, tidak bisa 100% otomatis karena setiap model struktur mesh beda).

---

## Validation

Setelah seluruh langkah dijalankan, validasi end-to-end berikut:
1. **✅ URL dapat diakses:** `http://localhost:8000/products/leather-boot` menampilkan halaman dengan layout AdminLTE.
2. **✅ 3D Model render sempurna:** Tidak ada mesh hilang, tidak ada texture hitam/abu-abu (kecuali emang desainnya).
3. **✅ Semua kontrol UI work:** Setiap kategori configurator punya minimal 2 opsi yang bisa dipilih, mesh yang dituju berubah visual.
4. **✅ Kalkulasi harga benar:** Base Rp 800.000 + Sol kulit tambah Rp 100.000 + Tali waxed tambah Rp 25.000 = TOTAL Rp 925.000 (sesuai seeder).
5. **✅ Tidak ada error di:** Console browser (`F12` → tab Console), Terminal `npm run dev`, Terminal `php artisan serve`.
6. **✅ Mobile-friendly:** Chrome DevTools Device Mode iPhone 12 Pro — semua tombol di panel bisa ditekan (ukuran sentuh minimal 44x44px).
7. **✅ Build production lolos:** `npm run build` exit code 0, tidak ada warning kritis.

---

## Risiko dan Mitigasi

| Risiko | Kemungkinan | Dampak | Handling |
|---|---|---|---|
| Polycount hasil Decimate terlalu rendah → model jelek/berlubang | Sedang | Visual buruk | Selalu **backup file .blend** sebelum Apply modifier. Decimate bertahap (0.8 → 0.6 → 0.5), cek tiap tahap. Jika bagian hancur, gunakan tool Remesh atau manual edit poly. |
| Nama mesh di Blender salah ketik (misal `meshh_sole`) → JSX tidak bisa temukan mesh | Tinggi | Configurator tidak bisa ganti material | Di `ShoeModel.jsx`, tambahkan `console.log('Available meshes:', [...])` pas development — print semua nama mesh yang ditemukan. Jadi kalo salah ketik langsung kelihatan. |
| Loading 3D pertama kali lama meskipun sudah optimize | Sedang | User kabur | Tambah loading overlay dengan progress bar pakai `useProgress` dari drei. Tampilkan "Loading 3D Model... 42%" dengan spinner Industrial. |
| FPS drop di device low-end (HP 2020 kebawah) | Sedang | Lag parah | Tambah toggle "Performance Mode" di panel — saat aktif, matikan `ContactShadows`, matikan `postprocessing`, turunkan `pixelRatio` Canvas ke `[1, 1.5]`. Drei punya hook `usePerformanceMonitor` untuk auto detect & throttle. |
| Material tidak apply benar (texture stretch) | Sedang | Warna aneh | Pastikan UV Unwrap di Blender sudah rapi sebelum export. Di JSX, saat swap material, pastikan juga assign `material.needsUpdate = true` setelah ubah property. |
| Draco compression tidak kebaca di Safari iOS lama | Rendah | Model blank putih | drei `useGLTF` sudah include fallback. Jika masih error, sediakan 1 file non-draco (lebih besar 2x) sebagai fallback via user agent detection. |

---

## Estimasi File Created (Total ~15-20 files baru)
Setelah plan ini dijalankan, file baru yang akan dibuat (diluar vendor dan node_modules):
- Backend: 3 Models, 3 Migrations, 1 Controller, 1 Seeder, + route edit
- Frontend: 4 Komponen React (index.jsx, ShoeModel.jsx, ConfiguratorPanel.jsx, useShoeStore.js) + 1 Halaman Inertia + 1 Edit App bootstrap
- Aset: 2 file `.glb` optimized di `public/3d-assets/`
