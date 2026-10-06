<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomizationOption extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'price_addition' => 'integer',
        'sort_order'     => 'integer',
        'is_default'     => 'boolean',
    ];

    public const CATEGORIES = [
        'material_upper' => 'Kulit Upper',
        'sole'           => 'Sol Luar',
        'insole'         => 'Sol Dalam',
        'laces'          => 'Tali Sepatu',
        'hardware'       => 'Aksesoris Logam',
        'stitching'      => 'Warna Jahitan',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getCategoryLabelAttribute(): string
    {
        return self::CATEGORIES[$this->category] ?? $this->category;
    }
}
