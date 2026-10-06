<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'base_price' => 'integer',
        'published'  => 'boolean',
    ];

    public function customizationOptions(): HasMany
    {
        return $this->hasMany(CustomizationOption::class);
    }

    public function customizationByCategory(): array
    {
        return $this->customizationOptions
            ->groupBy('category')
            ->map(fn ($group) => $group->values()->all())
            ->toArray();
    }
}
