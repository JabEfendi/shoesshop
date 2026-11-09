<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Design extends Model
{
    use HasFactory;

    protected $fillable = ['signature', 'model_slug', 'configuration'];

    protected function casts(): array
    {
        return ['configuration' => 'array'];
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
