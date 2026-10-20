<?php

namespace Tests\Feature;

use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StorefrontRoutesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(ProductSeeder::class);
    }

    public function test_storefront_pages_are_available(): void
    {
        $this->get('/')->assertRedirect('/sketch/home');
        $this->get('/sketch')->assertRedirect('/sketch/home');

        $routes = [
            '/sketch/home',
            '/sketch/shop',
            '/sketch/custom',
            '/sketch/sizing',
            '/sketch/cart',
            '/sketch/our-story',
            '/products',
        ];

        foreach ($routes as $route) {
            $this->get($route)->assertOk();
        }
    }

    public function test_each_configured_model_has_product_and_customization_pages(): void
    {
        foreach (['boots', 'chelsea', 'pantofel', 'docmart', 'loafers'] as $slug) {
            $this->get("/sketch/shop/{$slug}")->assertOk();
            $this->get("/sketch/custom/{$slug}")->assertOk();
            $this->get("/sketch/custom/{$slug}/preview")->assertOk();
        }
    }

    public function test_database_backed_products_are_available(): void
    {
        $this->get('/products/leather-boot')->assertOk();
        $this->get('/products/chelsea-boot')->assertOk();
    }

    public function test_unknown_product_and_model_slugs_return_not_found(): void
    {
        foreach ([
            '/products/unknown-model',
            '/sketch/shop/unknown-model',
            '/sketch/custom/unknown-model',
            '/sketch/custom/unknown-model/preview',
        ] as $route) {
            $this->get($route)->assertNotFound();
        }
    }
}
