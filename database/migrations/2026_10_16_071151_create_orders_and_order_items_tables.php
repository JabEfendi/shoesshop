<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('awaiting_payment');
            $table->string('payment_status')->default('pending');
            $table->string('payment_method');
            $table->string('shipping_method');
            $table->unsignedInteger('shipping_price');
            $table->unsignedInteger('subtotal');
            $table->unsignedInteger('total');
            $table->unsignedInteger('dp_amount');
            $table->string('recipient_name');
            $table->string('phone', 30);
            $table->text('address');
            $table->string('city');
            $table->string('postal_code', 12);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('model_slug');
            $table->string('name');
            $table->text('variant_summary');
            $table->json('configuration')->nullable();
            $table->unsignedTinyInteger('size');
            $table->unsignedSmallInteger('quantity')->default(1);
            $table->unsignedInteger('base_price');
            $table->unsignedInteger('add_ons')->default(0);
            $table->unsignedInteger('unit_total');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
