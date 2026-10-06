<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedInteger('base_price')->default(0);
            $table->string('thumbnail')->nullable();
            $table->string('glb_model_path')->nullable();
            $table->boolean('published')->default(true);
            $table->timestamps();
        });

        Schema::create('customization_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->enum('category', [
                'material_upper','sole','insole','laces','hardware','stitching'
            ]);
            $table->string('name');
            $table->string('display_name');
            $table->string('mesh_target')->comment('Nama mesh di Blender / .glb, misal mesh_upper');
            $table->unsignedInteger('price_addition')->default(0);
            $table->string('hex_color', 7)->nullable();
            $table->float('roughness', 2, 2)->nullable()->comment('PBR 0=glossy 1=matte');
            $table->float('metalness', 2, 2)->nullable()->comment('PBR 0=dielectric 1=metal');
            $table->string('texture_path')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_default')->default(false);
            $table->timestamps();
            $table->index(['product_id','category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customization_options');
        Schema::dropIfExists('products');
    }
};
