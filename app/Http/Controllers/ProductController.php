<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::wherePublished(true)
            ->select(['id', 'slug', 'name', 'base_price', 'thumbnail'])
            ->latest()
            ->get();

        return Inertia::render('Product/Index', [
            'products' => $products,
        ]);
    }

    public function show(string $slug): Response
    {
        $product = Product::where('slug', $slug)
            ->wherePublished(true)
            ->with('customizationOptions')
            ->firstOrFail();

        $groupedOptions = [];
        foreach ($product->customizationByCategory() as $cat => $opts) {
            $groupedOptions[$cat] = array_map(fn ($o) => [
                'id'              => $o->id,
                'name'            => $o->name,
                'display_name'    => $o->display_name,
                'mesh_target'     => $o->mesh_target,
                'price_addition'  => (int) $o->price_addition,
                'hex_color'       => $o->hex_color,
                'roughness'       => $o->roughness,
                'metalness'       => $o->metalness,
                'texture_path'    => $o->texture_path,
                'sort_order'      => (int) $o->sort_order,
                'is_default'      => (bool) $o->is_default,
            ], $opts);
        }

        return Inertia::render('Product/Show', [
            'product' => [
                'id'              => $product->id,
                'slug'            => $product->slug,
                'name'            => $product->name,
                'description'     => $product->description,
                'base_price'      => (int) $product->base_price,
                'thumbnail'       => $product->thumbnail,
                'glb_model_path'  => $product->glb_model_path,
            ],
            'category_labels' => \App\Models\CustomizationOption::CATEGORIES,
            'customization_options' => $groupedOptions,
        ]);
    }
}
