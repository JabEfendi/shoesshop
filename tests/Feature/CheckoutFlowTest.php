<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(ProductSeeder::class);
    }

    public function test_customer_can_add_custom_shoe_to_cart_and_create_order(): void
    {
        $this->post('/cart', [
            'type' => 'custom',
            'model_slug' => 'boots',
            'size' => 42,
            'selection' => ['kulit' => 1, 'outsole' => 2],
        ])->assertRedirect('/sketch/cart');

        $this->get('/sketch/cart')->assertOk()->assertSee('Custom Boots 6');

        $user = User::create(['name' => 'Rafie Test', 'email' => 'rafie@example.test', 'password' => 'password123']);

        $this->actingAs($user)->post('/checkout', [
            'recipient_name' => 'Rafie Test',
            'phone' => '081234567890',
            'address' => 'Jl. Test No. 1',
            'city' => 'Depok',
            'postal_code' => '16411',
            'shipping_method' => 'jne-regular',
            'payment_method' => 'qris',
        ])->assertRedirect('/sketch/account/orders');

        $order = Order::query()->sole()->first();
        $this->assertSame($user->id, $order->user_id);
        $this->assertSame(1425000, $order->subtotal);
        $this->assertSame(18000, $order->shipping_price);
        $this->assertSame(1443000, $order->total);
        $this->assertSame(721500, $order->dp_amount);
        $this->assertCount(1, $order->items);
        $this->assertSame('boots', $order->items->first()->model_slug);
        $this->assertSame([], $this->app['session']->get('cart.items', []));
    }

    public function test_checkout_requires_authentication_and_order_dashboard_is_private(): void
    {
        $this->get('/sketch/checkout')->assertRedirect('/login');
        $this->get('/sketch/account/orders')->assertRedirect('/login');
    }

    public function test_customer_can_register_and_access_private_order_dashboard(): void
    {
        $this->post('/register', [
            'name' => 'Customer Baru',
            'email' => 'customer@example.test',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertRedirect('/sketch/account/orders');

        $this->assertDatabaseHas('users', ['email' => 'customer@example.test']);
        $this->get('/sketch/account/orders')->assertOk();
    }

    public function test_cart_rejects_unknown_models_and_invalid_customization_values(): void
    {
        $this->post('/cart', ['type' => 'preset', 'model_slug' => 'unknown', 'size' => 42])->assertNotFound();

        $this->post('/cart', [
            'type' => 'custom', 'model_slug' => 'boots', 'size' => 42, 'selection' => ['kulit' => 99],
        ])->assertStatus(422);
    }
}
