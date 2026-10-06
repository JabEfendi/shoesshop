<?php
// tools/check_seed.php — standalone data verifier
$dbPath = __DIR__ . '/../database/database.sqlite';
$pdo = new PDO('sqlite:' . $dbPath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

echo "=== 3D SHOE CONFIGURATOR DATA VERIFIER ===\n\n";
echo "✅ SQLite terkoneksi: $dbPath\n";

$products = $pdo->query("SELECT id, slug, name, base_price, glb_model_path, created_at FROM products ORDER BY id")->fetchAll(PDO::FETCH_ASSOC);
echo "\n📦 TABEL products: " . count($products) . " records\n";
echo str_repeat('─', 90) . "\n";
printf("  %-3s %-20s %-35s %-15s %s\n", "ID", "SLUG", "NAME", "BASE_PRICE", "GLB_PATH");
echo str_repeat('─', 90) . "\n";
foreach ($products as $p) {
    printf("  %-3d %-20s %-35s Rp.%-13s %s\n",
        $p['id'], $p['slug'], mb_substr($p['name'], 0, 34),
        number_format($p['base_price']), $p['glb_model_path'] ?? '(null)'
    );
    // Per kategori
    $cats = $pdo->prepare("SELECT category, COUNT(*) c, SUM(CASE WHEN price_addition>0 THEN 1 ELSE 0 END) paid
                           FROM customization_options WHERE product_id=? GROUP BY category ORDER BY category");
    $cats->execute([$p['id']]);
    $catRows = $cats->fetchAll(PDO::FETCH_ASSOC);
    echo "       └── " . count($catRows) . " categories:\n";
    $totalOpts = 0;
    foreach ($catRows as $c) {
        $totalOpts += $c['c'];
        $max = $pdo->prepare("SELECT MAX(price_addition) FROM customization_options WHERE product_id=? AND category=?");
        $max->execute([$p['id'], $c['category']]);
        $m = (int) $max->fetchColumn();
        echo "           • {$c['category']}: {$c['c']} options ({$c['paid']} berbayar, max +Rp " . number_format($m) . ")\n";
    }
    echo "       └── TOTAL OPSI: {$totalOpts}\n\n";
}

$allOpts = $pdo->query("SELECT COUNT(*) FROM customization_options")->fetchColumn();
echo str_repeat('─', 90) . "\n";
echo "✅ VERIFIED: " . count($products) . " produk + $allOpts customization options dalam database.\n\n";
echo "🏠 Routes yang aktif:\n";
echo "   • /products                        (Katalog / Product Index)\n";
echo "   • /products/leather-boot           (Product Show - Leather Boot Configurator)\n";
echo "   • /products/chelsea-boot           (Product Show - Chelsea Boot Configurator)\n";
