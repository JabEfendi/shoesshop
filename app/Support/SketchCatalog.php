<?php

namespace App\Support;

class SketchCatalog
{
    public const MODELS = [
        'boots' => ['slug' => 'boots', 'name' => 'Boots 6"', 'price' => 1250000],
        'chelsea' => ['slug' => 'chelsea', 'name' => 'Chelsea Boots', 'price' => 980000],
        'pantofel' => ['slug' => 'pantofel', 'name' => 'Pantofel', 'price' => 875000],
        'docmart' => ['slug' => 'docmart', 'name' => 'Docmart 8-Eye', 'price' => 1325000],
        'loafers' => ['slug' => 'loafers', 'name' => 'Loafers', 'price' => 795000],
    ];

    public const CUSTOMIZATION_OPTIONS = [
        'kulit' => [['n' => 'Full Grain Coklat', 'p' => 0], ['n' => 'Full Grain Hitam', 'p' => 25000], ['n' => 'Pull-Up Burgundy', 'p' => 75000]],
        'benang-kulit' => [['n' => 'Match Kulit', 'p' => 0], ['n' => 'Kontras Putih', 'p' => 10000], ['n' => 'Kontras Tan', 'p' => 10000]],
        'benang-outsole' => [['n' => 'Standar Coklat', 'p' => 0], ['n' => 'Heavy Copper', 'p' => 15000], ['n' => 'Kontras Kuning', 'p' => 10000]],
        'eyelet' => [['n' => 'Silver Nikel', 'p' => 0], ['n' => 'Brass Gold', 'p' => 35000], ['n' => 'Black PVD', 'p' => 45000]],
        'panel-chelsea' => [['n' => 'Elastis Hitam', 'p' => 0], ['n' => 'Elastis Coklat', 'p' => 20000], ['n' => 'Leather Gusset', 'p' => 60000]],
        'tali' => [['n' => 'Waxed Coklat', 'p' => 0], ['n' => 'Flat Hitam', 'p' => 0], ['n' => 'Paracord OD', 'p' => 25000]],
        'storm-welt' => [['n' => 'Tidak Ada', 'p' => 0], ['n' => 'Standar Welt (WR)', 'p' => 85000], ['n' => 'Triple Welt (Premium)', 'p' => 150000]],
        'outsole' => [['n' => 'Karet Hitam', 'p' => 0], ['n' => 'Kulit Dress Coklat', 'p' => 125000], ['n' => 'Commando Lug', 'p' => 150000]],
    ];

    public static function model(string $slug): array
    {
        abort_unless(isset(self::MODELS[$slug]), 404);

        return self::MODELS[$slug];
    }

    public static function customLine(string $slug, array $selection, int $size): array
    {
        $model = self::model($slug);
        $chosen = [];
        $addOns = 0;

        foreach (self::CUSTOMIZATION_OPTIONS as $element => $options) {
            $index = (int) ($selection[$element] ?? 0);
            abort_if(! isset($options[$index]), 422, 'Pilihan kustomisasi tidak valid.');
            $option = $options[$index];
            $chosen[$element] = $option['n'];
            $addOns += $option['p'];
        }

        return [
            'id' => (string) str()->uuid(),
            'type' => 'custom',
            'model_slug' => $slug,
            'name' => 'Custom '.$model['name'],
            'variant_summary' => implode(' + ', $chosen),
            'configuration' => $chosen,
            'size' => $size,
            'qty' => 1,
            'base_price' => $model['price'],
            'add_ons' => $addOns,
            'unit_total' => $model['price'] + $addOns,
        ];
    }

    public static function presetLine(string $slug, int $size): array
    {
        $model = self::model($slug);

        return [
            'id' => (string) str()->uuid(),
            'type' => 'preset',
            'model_slug' => $slug,
            'name' => $model['name'].' (Preset)',
            'variant_summary' => 'Classic Edition',
            'configuration' => [],
            'size' => $size,
            'qty' => 1,
            'base_price' => $model['price'],
            'add_ons' => 0,
            'unit_total' => $model['price'],
        ];
    }
}
