<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$MODELS = [
    ['slug' => 'boots',        'name' => 'Boots 6"',        'desc' => 'Classic high-top daily boots',  'price' => 1250000, 'icon' => 'fa-boot',     'color' => '#4a2c1a', 'image' => '/assets/images/products/boots/boots.jpeg',            'gallery' => ['/assets/images/products/boots/front-side.jpeg', '/assets/images/products/boots/out-side.jpeg', '/assets/images/products/boots/back-side.jpeg'], 'type' => 'casual', 'glb' => '/3d-assets/leather-boot-optimized.glb'],
    ['slug' => 'chelsea',      'name' => 'Chelsea Boots',    'desc' => 'Easy-on elastic panel boots',  'price' => 980000,  'icon' => 'fa-shoe-prints', 'color' => '#1a1a1a', 'image' => '/assets/images/products/chelsea-boots/chelsea-pair-glossy-black.jpeg', 'gallery' => ['/assets/images/products/chelsea-boots/front-side.jpeg', '/assets/images/products/chelsea-boots/out-side.jpeg', '/assets/images/products/chelsea-boots/back-side.jpeg'], 'type' => 'formal', 'glb' => '/3d-assets/chelsea-boot-optimized.glb'],
    ['slug' => 'pantofel',     'name' => 'Pantofel',         'desc' => 'Formal leather oxfords',       'price' => 875000,  'icon' => 'fa-briefcase', 'color' => '#0f0f0f', 'image' => '/assets/images/products/pantofel/PANTOFEL.jpeg',       'gallery' => ['/assets/images/products/pantofel/front-side.jpeg', '/assets/images/products/pantofel/out-side.jpeg', '/assets/images/products/pantofel/back-side.jpeg'], 'type' => 'formal', 'glb' => null],
    ['slug' => 'docmart',      'name' => 'Docmart 8-Eye',   'desc' => 'Iconic chunky sole boots',     'price' => 1325000, 'icon' => 'fa-shoe-forms','color' => '#2a2a2a', 'image' => '/assets/images/products/docmart/docmart.jpeg',        'gallery' => ['/assets/images/products/docmart/front-side.jpeg', '/assets/images/products/docmart/out-side.jpeg', '/assets/images/products/docmart/back-side.jpeg'], 'type' => 'casual', 'glb' => null],
    ['slug' => 'loafers',      'name' => 'Loafers',         'desc' => 'Slip-on penny loafers',        'price' => 795000,  'icon' => 'fa-mug-hot',  'color' => '#5c3a1e', 'image' => '/assets/images/products/loafers/loafers.jpeg',         'gallery' => ['/assets/images/products/loafers/front-side.jpeg', '/assets/images/products/loafers/out-side.jpeg', '/assets/images/products/loafers/back-side.jpeg'], 'type' => 'formal', 'glb' => null],
];

$CUSTOM_ELEMENTS = [
    ['slug' => 'kulit',          'label' => 'Kulit Upper',     'icon' => 'fa-cowhide',    'defaults' => [['n' => 'Full Grain Coklat', 'p' => 0, 'c' => '#4a2c1a'], ['n' => 'Full Grain Hitam', 'p' => 25000, 'c' => '#1a1a1a'], ['n' => 'Pull-Up Burgundy', 'p' => 75000, 'c' => '#5e1f1f']]],
    ['slug' => 'benang-kulit',   'label' => 'Benang Jahit Upper', 'icon' => 'fa-wand-magic-sparkles', 'defaults' => [['n' => 'Match Kulit', 'p' => 0], ['n' => 'Kontras Putih', 'p' => 10000, 'c' => '#ffffff'], ['n' => 'Kontras Tan', 'p' => 10000, 'c' => '#b38247']]],
    ['slug' => 'benang-outsole', 'label' => 'Benang Jahit Outsole', 'icon' => 'fa-diagram-project', 'defaults' => [['n' => 'Standar Coklat', 'p' => 0], ['n' => 'Heavy Copper', 'p' => 15000, 'c' => '#b87333'], ['n' => 'Kontras Kuning', 'p' => 10000, 'c' => '#f0c040']]],
    ['slug' => 'eyelet',         'label' => 'Eyelet Logam',   'icon' => 'fa-screwdriver-wrench', 'defaults' => [['n' => 'Silver Nikel', 'p' => 0, 'c' => '#c0c0c0'], ['n' => 'Brass Gold', 'p' => 35000, 'c' => '#b8860b'], ['n' => 'Black PVD', 'p' => 45000, 'c' => '#2a2a2a']]],
    ['slug' => 'panel-chelsea',  'label' => 'Panel Chelsea',  'icon' => 'fa-angles-left-right', 'defaults' => [['n' => 'Elastis Hitam', 'p' => 0, 'c' => '#1a1a1a'], ['n' => 'Elastis Coklat', 'p' => 20000, 'c' => '#4a2c1a'], ['n' => 'Leather Gusset', 'p' => 60000]]],
    ['slug' => 'tali',           'label' => 'Tali Sepatu',    'icon' => 'fa-link',      'defaults' => [['n' => 'Waxed Coklat', 'p' => 0, 'c' => '#4a2c1a'], ['n' => 'Flat Hitam', 'p' => 0, 'c' => '#1a1a1a'], ['n' => 'Paracord OD', 'p' => 25000, 'c' => '#556b2f']]],
    ['slug' => 'storm-welt',     'label' => 'Storm Welt',     'icon' => 'fa-water',     'defaults' => [['n' => 'Tidak Ada', 'p' => 0], ['n' => 'Standar Welt (WR)', 'p' => 85000], ['n' => 'Triple Welt (Premium)', 'p' => 150000]]],
    ['slug' => 'outsole',        'label' => 'Outsole',        'icon' => 'fa-shoe-prints','defaults' => [['n' => 'Karet Hitam', 'p' => 0, 'c' => '#1a1a1a'], ['n' => 'Kulit Dress Coklat', 'p' => 125000, 'c' => '#6b3a0d'], ['n' => 'Commando Lug', 'p' => 150000, 'c' => '#2a2a2a']]],
];

$EXPEDISI = [
    ['name' => 'JNE Reguler',       'etd' => '3-4 hari',   'price' => 18000],
    ['name' => 'AnterAja Reguler',  'etd' => '2-3 hari',   'price' => 16000],
    ['name' => 'ID Express',        'etd' => '1-2 hari',   'price' => 28000],
    ['name' => 'SiCepat REG',       'etd' => '2-3 hari',   'price' => 17000],
    ['name' => 'Pos Indonesia Reg', 'etd' => '4-6 hari',   'price' => 13000],
];

Route::middleware('inertia')->prefix('sketch')->name('sketch.')->group(function () use ($MODELS, $CUSTOM_ELEMENTS, $EXPEDISI) {
    Route::get('/', function () {
        return Inertia::location(route('sketch.home'));
    })->name('index');

    Route::get('/home', function () use ($MODELS) {
        return Inertia::render('Sketch/Home', [
            'models' => $MODELS,
        ]);
    })->name('home');

    Route::get('/shop', function () use ($MODELS) {
        return Inertia::render('Sketch/Shop', [
            'presets' => array_map(fn($m) => [
                ...$m,
                'preset_variants' => [
                    ['n' => 'Classic ' . $m['name'], 'p' => $m['price']],
                    ['n' => 'Heritage Edition', 'p' => $m['price'] + 180000],
                    ['n' => 'Daily Pack + Care Kit', 'p' => $m['price'] + 250000],
                ],
            ], $MODELS),
        ]);
    })->name('shop');

    Route::get('/shop/{slug}', function ($slug) use ($MODELS) {
        $p = collect($MODELS)->firstWhere('slug', $slug) ?: $MODELS[0];
        return Inertia::render('Sketch/ProductDetail', [
            'product' => [
                ...$p,
                'highlights' => ['Full Grain Leather', 'Goodyear Welt', 'Water Repellent', 'Anti-slip Outsole', '12 Bulan Garansi Jahitan'],
                'sizes' => [39, 40, 41, 42, 43, 44, 45],
                'lead_time' => '± 7 hari',
            ],
        ]);
    })->name('product-detail');

    Route::get('/custom', function () use ($MODELS) {
        return Inertia::render('Sketch/ChooseModel', [
            'models' => $MODELS,
        ]);
    })->name('choose-model');

    Route::get('/custom/{slug}', function ($slug) use ($MODELS, $CUSTOM_ELEMENTS) {
        $m = collect($MODELS)->firstWhere('slug', $slug) ?: $MODELS[0];
        return Inertia::render('Sketch/Customizer', [
            'model' => $m,
            'elements' => $CUSTOM_ELEMENTS,
        ]);
    })->name('customizer');

    Route::get('/custom/{slug}/preview', function ($slug) use ($MODELS, $CUSTOM_ELEMENTS) {
        $m = collect($MODELS)->firstWhere('slug', $slug) ?: $MODELS[0];
        return Inertia::render('Sketch/CustomizerPreview', [
            'model' => $m,
            'elements' => $CUSTOM_ELEMENTS,
            'lead_time' => '± 7 hari kerja',
            'garansi' => '3 hari (video unboxing wajib)',
        ]);
    })->name('customizer-preview');

    Route::get('/sizing', function () use ($MODELS) {
        return Inertia::render('Sketch/Sizing', [
            'chart' => [
                ['size' => 39, 'insole_cm' => '24.5', 'recommended_for' => 'Panjang kaki 23.8 – 24.2 cm'],
                ['size' => 40, 'insole_cm' => '25.2', 'recommended_for' => 'Panjang kaki 24.5 – 24.9 cm'],
                ['size' => 41, 'insole_cm' => '26.0', 'recommended_for' => 'Panjang kaki 25.3 – 25.7 cm'],
                ['size' => 42, 'insole_cm' => '26.8', 'recommended_for' => 'Panjang kaki 26.1 – 26.5 cm'],
                ['size' => 43, 'insole_cm' => '27.6', 'recommended_for' => 'Panjang kaki 26.9 – 27.3 cm'],
                ['size' => 44, 'insole_cm' => '28.4', 'recommended_for' => 'Panjang kaki 27.7 – 28.1 cm'],
                ['size' => 45, 'insole_cm' => '29.2', 'recommended_for' => 'Panjang kaki 28.5 – 28.9 cm'],
            ],
            'next_url' => route('sketch.cart'),
        ]);
    })->name('sizing');

    Route::get('/cart', function () use ($MODELS, $EXPEDISI) {
        $m = $MODELS[0];
        return Inertia::render('Sketch/Cart', [
            'items' => [
                [
                    'id' => 1,
                    'type' => 'custom',
                    'name' => 'Custom ' . $m['name'],
                    'variant_summary' => 'Kulit Hitam + Lug Sole + Brass Eyelet + Welt Premium',
                    'size' => 42,
                    'qty' => 1,
                    'base_price' => $m['price'],
                    'add_ons' => 235000,
                    'unit_total' => $m['price'] + 235000,
                ],
                [
                    'id' => 2,
                    'type' => 'preset',
                    'name' => $MODELS[2]['name'] . ' (Preset)',
                    'variant_summary' => 'Classic Edition (Hitam)',
                    'size' => 41,
                    'qty' => 1,
                    'base_price' => $MODELS[2]['price'],
                    'add_ons' => 0,
                    'unit_total' => $MODELS[2]['price'],
                ],
            ],
            'subtotal' => ($m['price'] + 235000) + $MODELS[2]['price'],
        ]);
    })->name('cart');

    Route::get('/checkout', function () use ($MODELS, $EXPEDISI) {
        $subtotal = ($MODELS[0]['price'] + 235000) + $MODELS[2]['price'];
        return Inertia::render('Sketch/Checkout', [
            'expedisi' => $EXPEDISI,
            'payment_rules' => [
                'dp_pct' => 50,
                'pelunasan_trigger' => 'Setelah sepatu jadi (via dashboard order, dikabarin WA)',
                'methods' => ['QRIS', 'Virtual Account (BCA, BRI, BNI, Mandiri)'],
            ],
            'subtotal' => $subtotal,
            'ongkir_default' => 18000,
            'alamat_default' => [
                'penerima' => 'Rafie (Contoh)',
                'hp' => '0812-xxxx-xxxx',
                'alamat' => 'Jl. Contoh No. 123, Kel. Contoh, Kec. Contoh, Kota Depok, Jawa Barat 164xx',
                'catatan' => 'Rumah 2 lantai, pagar coklat, seberang warung tegal',
            ],
        ]);
    })->name('checkout');

    Route::get('/account/orders', function () use ($MODELS) {
        return Inertia::render('Sketch/OrderDashboard', [
            'orders' => [
                [
                    'id' => 'INV/20261005/0001',
                    'tgl' => '2026-10-05',
                    'items' => [
                        ['n' => 'Custom ' . $MODELS[0]['name'], 'size' => 42, 'qty' => 1, 'price' => $MODELS[0]['price'] + 235000],
                    ],
                    'produksi' => [
                        ['label' => 'Konfirmasi DP',        'status' => 'done'],
                        ['label' => 'Pemotongan Pola',     'status' => 'active'],
                        ['label' => 'Jahit Upper',          'status' => 'pending'],
                        ['label' => 'Goodyear Welt',        'status' => 'pending'],
                        ['label' => 'Finishing + QC',       'status' => 'pending'],
                        ['label' => 'Selesai Produksi ➜ Pelunasan', 'status' => 'pending'],
                        ['label' => 'Packing & Kirim',      'status' => 'pending'],
                    ],
                    'estimasi' => '± 7 hari (sampai 12 Okt 2026)',
                    'tagihan' => [
                        'total' => $MODELS[0]['price'] + 235000 + 18000,
                        'dp' => round(($MODELS[0]['price'] + 235000 + 18000) * 0.5),
                        'lunas' => false,
                        'pelunasan_sisa' => round(($MODELS[0]['price'] + 235000 + 18000) * 0.5),
                    ],
                    'garansi' => ['claimable' => true, 'sampai' => '2027-10-05', 'syarat' => 'Wajib video unboxing, ongkir retur = buyer'],
                ],
                [
                    'id' => 'INV/20260920/0088',
                    'tgl' => '2026-09-20',
                    'items' => [
                        ['n' => $MODELS[2]['name'] . ' Preset', 'size' => 41, 'qty' => 1, 'price' => $MODELS[2]['price']],
                    ],
                    'produksi' => [
                        ['label' => 'Konfirmasi DP',        'status' => 'done'],
                        ['label' => 'Pemotongan Pola',     'status' => 'done'],
                        ['label' => 'Jahit Upper',          'status' => 'done'],
                        ['label' => 'Goodyear Welt',        'status' => 'done'],
                        ['label' => 'Finishing + QC',       'status' => 'done'],
                        ['label' => 'Selesai Produksi ➜ Pelunasan', 'status' => 'done'],
                        ['label' => 'Packing & Kirim',      'status' => 'done'],
                    ],
                    'estimasi' => 'Selesai 27 Sep 2026 — Sudah diterima',
                    'tagihan' => [
                        'total' => $MODELS[2]['price'] + 13000,
                        'dp' => round(($MODELS[2]['price'] + 13000) * 0.5),
                        'lunas' => true,
                        'pelunasan_sisa' => 0,
                    ],
                    'garansi' => ['claimable' => true, 'sampai' => '2027-09-27', 'syarat' => 'Wajib video unboxing, ongkir retur = buyer'],
                ],
            ],
        ]);
    })->name('orders');

    Route::get('/our-story', function () {
        return Inertia::render('Sketch/OurStory');
    })->name('our-story');
});
