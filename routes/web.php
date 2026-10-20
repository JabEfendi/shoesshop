<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;

require __DIR__ . '/sketch.php';

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'create'])->name('login');
    Route::post('/login', [AuthController::class, 'store'])->name('login.store');
    Route::get('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/register', [AuthController::class, 'registerStore'])->name('register.store');
});
Route::post('/logout', [AuthController::class, 'destroy'])->middleware('auth')->name('logout');

Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::patch('/cart/{item}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{item}', [CartController::class, 'destroy'])->name('cart.destroy');
Route::get('/sketch/cart', [CartController::class, 'index'])->name('sketch.cart');
Route::get('/checkout', [CheckoutController::class, 'create'])->middleware('auth')->name('checkout.create');
Route::post('/checkout', [CheckoutController::class, 'store'])->middleware('auth')->name('checkout.store');
Route::get('/sketch/checkout', fn () => redirect()->route('checkout.create'))->middleware('auth')->name('sketch.checkout');
Route::get('/sketch/account/orders', [OrderController::class, 'index'])->middleware('auth')->name('sketch.orders');

Route::get('/', function () {
    return redirect()->route('sketch.home');
});

Route::middleware('inertia')->group(function () {
    Route::get('/products', [\App\Http\Controllers\ProductController::class, 'index'])
        ->name('products.index');

    Route::get('/products/{slug}', [\App\Http\Controllers\ProductController::class, 'show'])
        ->name('products.show');
});
