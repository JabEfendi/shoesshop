<?php

use Illuminate\Support\Facades\Route;

require __DIR__ . '/sketch.php';

Route::get('/', function () {
    return redirect()->route('sketch.home');
});

Route::middleware('inertia')->group(function () {
    Route::get('/products', [\App\Http\Controllers\ProductController::class, 'index'])
        ->name('products.index');

    Route::get('/products/{slug}', [\App\Http\Controllers\ProductController::class, 'show'])
        ->name('products.show');
});
