<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\CustomizationOption;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $leather = Product::updateOrCreate(['slug' => 'leather-boot'], [
            'name'           => 'Premium Leather Boot 6"',
            'description'    => 'Sepatu boot kulit premium dengan konstruksi Goodyear welt, tahan air ringan, dan nyaman untuk penggunaan sehari-hari maupun outdoor ringan.',
            'base_price'     => 1250000,
            'thumbnail'      => '/assets/images/products/boots/v2/boots.jpeg',
            'glb_model_path' => '/3d-assets/leather-boot-optimized.glb',
            'published'      => true,
        ]);

        $chelsea = Product::updateOrCreate(['slug' => 'chelsea-boot'], [
            'name'           => 'Chelsea Boot Kulit Pull-Up',
            'description'    => 'Model Chelsea boot klasik dengan panel elastis di samping, easy on/off, cocok untuk gaya smart casual dan formal.',
            'base_price'     => 980000,
            'thumbnail'      => '/assets/images/products/chelsea-boots/chelsea-pair-glossy-black.jpeg',
            'glb_model_path' => '/3d-assets/chelsea-boot-optimized.glb',
            'published'      => true,
        ]);

        $options = [
            'leather-boot' => [
                'material_upper' => [
                    ['kulit-coklat-tua',   'Kulit Coklat Tua (Dark Brown)',  'mesh_upper',     0,      '#4a2c1a', 0.85, 0.05],
                    ['kulit-coklat-muda',  'Kulit Coklat Muda (Tan)',        'mesh_upper',     0,      '#8b5a2b', 0.80, 0.05],
                    ['kulit-hitam-full',   'Kulit Hitam Full Grain',         'mesh_upper',     25000,  '#1a1a1a', 0.75, 0.10],
                    ['kulit-oak-burgundy', 'Kulit Burgundy Oak',             'mesh_upper',     75000,  '#5e1f1f', 0.80, 0.05],
                    ['kulit-suede-taupe',  'Suede Taupe Matte',              'mesh_upper',     50000,  '#8e8376', 1.00, 0.00],
                ],
                'sole' => [
                    ['sole-karet-hitam',   'Sol Karet Hitam Standar',        'mesh_sole',      0,      '#1a1a1a', 0.60, 0.00],
                    ['sole-kulit-coklat',  'Sol Kulit Coklat (Dress)',       'mesh_sole',      125000, '#6b3a0d', 0.50, 0.10],
                    ['sole-crepe-beige',   'Sol Crepe Beige (Wedges)',       'mesh_sole',      85000,  '#d8c49a', 0.95, 0.00],
                    ['sole-commando',      'Sol Commando Lug (Tactical)',    'mesh_sole',      150000, '#2a2a2a', 0.70, 0.02],
                ],
                'insole' => [
                    ['insole-eva-standar', 'Insole EVA Standar',             'mesh_insole',    0,      '#2b2b2b', 0.80, 0.00],
                    ['insole-kulit',       'Insole Kulit Premium',           'mesh_insole',    45000,  '#8b5a2b', 0.70, 0.10],
                    ['insole-memory',      'Insole Memory Foam Ortho',       'mesh_insole',    95000,  '#3e4b5c', 0.90, 0.00],
                ],
                'laces' => [
                    ['laces-waxed-coklat', 'Tali Waxed Coklat Tua',          'mesh_laces',     0,      '#4a2c1a', 0.45, 0.10],
                    ['laces-flat-hitam',   'Tali Flat Hitam',                'mesh_laces',     0,      '#1a1a1a', 0.55, 0.00],
                    ['laces-bulat-tan',    'Tali Bulat Tan Natural',         'mesh_laces',     15000,  '#b38247', 0.75, 0.02],
                    ['laces-paracord-od',  'Tali Paracord Olive Drab',       'mesh_laces',     25000,  '#556b2f', 0.90, 0.00],
                ],
                'hardware' => [
                    ['hw-nikel-silver',    'Eyelet Nikel Silver',            'mesh_hardware',  0,      '#c0c0c0', 0.30, 0.85],
                    ['hw-gold-brass',      'Eyelet Kuning Brass',            'mesh_hardware',  35000,  '#b8860b', 0.35, 0.75],
                    ['hw-black-pvd',       'Eyelet Black PVD Matte',         'mesh_hardware',  45000,  '#2a2a2a', 0.55, 0.60],
                    ['hw-antik-perak',     'Eyelet Perak Antik',             'mesh_hardware',  60000,  '#7a7a7a', 0.60, 0.65],
                ],
                'stitching' => [
                    ['stitch-match',       'Benang Jahit Match (Sama Kulit)','mesh_stitching', 0,      null,     null, null],
                    ['stitch-contrast-tan','Benang Jahit Kontras Tan',       'mesh_stitching', 10000,  '#b38247', null, null],
                    ['stitch-putih',       'Benang Jahit Putih (Bold)',      'mesh_stitching', 10000,  '#ffffff', null, null],
                    ['stitch-hitam',       'Benang Jahit Hitam (Kontras Kuat)','mesh_stitching',10000,  '#1a1a1a', null, null],
                ],
            ],
            'chelsea-boot' => [
                'material_upper' => [
                    ['kulit-hitam-full',   'Kulit Hitam Full Grain',         'mesh_upper',     0,      '#1a1a1a', 0.75, 0.10],
                    ['kulit-coklat-tua',   'Kulit Coklat Tua',               'mesh_upper',     0,      '#4a2c1a', 0.85, 0.05],
                    ['kulit-mahogany',     'Kulit Mahogany Pull-Up',         'mesh_upper',     60000,  '#5c1f1f', 0.70, 0.05],
                ],
                'sole' => [
                    ['sole-karet-hitam',   'Sol Karet Hitam (Chelsea)',      'mesh_sole',      0,      '#1a1a1a', 0.60, 0.00],
                    ['sole-leather-dress', 'Sol Kulit Dress Coklat',         'mesh_sole',      140000, '#6b3a0d', 0.50, 0.10],
                ],
                'insole' => [
                    ['insole-kulit',       'Insole Kulit (Chelsea Premium)', 'mesh_insole',    0,      '#8b5a2b', 0.70, 0.10],
                    ['insole-memory',      'Insole Memory Foam',             'mesh_insole',    75000,  '#3e4b5c', 0.90, 0.00],
                ],
                'hardware' => [
                    ['hw-black-pvd',       'Pull Tab Black PVD',             'mesh_hardware',  0,      '#2a2a2a', 0.55, 0.60],
                    ['hw-gold-brass',      'Pull Tab Brass Gold',            'mesh_hardware',  30000,  '#b8860b', 0.35, 0.75],
                ],
            ],
        ];

        foreach ([$leather, $chelsea] as $product) {
            $list = $options[$product->slug] ?? [];
            foreach ($list as $category => $rows) {
                $sort = 0;
                foreach ($rows as $idx => $row) {
                    [$name, $display, $mesh, $price, $hex, $rough, $metal] = array_pad($row, 8, null);
                    CustomizationOption::updateOrCreate(
                        ['product_id' => $product->id, 'category' => $category, 'name' => $name],
                        [
                            'display_name'   => $display,
                            'mesh_target'    => $mesh,
                            'price_addition' => $price,
                            'hex_color'      => $hex,
                            'roughness'      => $rough,
                            'metalness'      => $metal,
                            'sort_order'     => $sort++,
                            'is_default'     => $idx === 0,
                        ]
                    );
                }
            }
        }
    }
}
