<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('designs', function (Blueprint $table) {
            $table->id();
            $table->string('signature')->unique();
            $table->string('model_slug');
            $table->json('configuration');
            $table->timestamps();
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->foreignId('design_id')->nullable()->after('design_signature')->constrained('designs')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('design_id');
        });
        Schema::dropIfExists('designs');
    }
};
