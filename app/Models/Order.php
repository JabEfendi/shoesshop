<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'number', 'user_id', 'status', 'payment_status', 'payment_method', 'shipping_method',
        'shipping_price', 'subtotal', 'total', 'dp_amount', 'recipient_name', 'phone',
        'address', 'city', 'postal_code', 'notes',
    ];

    protected function casts(): array
    {
        return ['shipping_price' => 'integer', 'subtotal' => 'integer', 'total' => 'integer', 'dp_amount' => 'integer'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
