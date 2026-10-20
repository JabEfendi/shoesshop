<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'type', 'model_slug', 'name', 'variant_summary', 'configuration', 'size', 'quantity', 'base_price', 'add_ons', 'unit_total'];

    protected function casts(): array
    {
        return ['configuration' => 'array', 'base_price' => 'integer', 'add_ons' => 'integer', 'unit_total' => 'integer'];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
