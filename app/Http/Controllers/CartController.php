<?php

namespace App\Http\Controllers;

use App\Support\SketchCatalog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request): Response
    {
        $items = array_values($request->session()->get('cart.items', []));

        return Inertia::render('Sketch/Cart', ['items' => $items, 'subtotal' => $this->subtotal($items)]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', 'in:preset,custom'],
            'model_slug' => ['required', 'string'],
            'size' => ['required', 'integer', 'between:39,45'],
            'selection' => ['nullable', 'array'],
        ]);

        $item = $data['type'] === 'custom'
            ? SketchCatalog::customLine($data['model_slug'], $data['selection'] ?? [], $data['size'])
            : SketchCatalog::presetLine($data['model_slug'], $data['size']);

        $cart = $request->session()->get('cart.items', []);
        $cart[$item['id']] = $item;
        $request->session()->put('cart.items', $cart);

        return redirect()->route('sketch.cart')->with('success', 'Produk ditambahkan ke keranjang.');
    }

    public function update(Request $request, string $item)
    {
        $data = $request->validate(['qty' => ['required', 'integer', 'between:1,10']]);
        $cart = $request->session()->get('cart.items', []);
        abort_unless(isset($cart[$item]), 404);
        $cart[$item]['qty'] = $data['qty'];
        $request->session()->put('cart.items', $cart);

        return back();
    }

    public function destroy(Request $request, string $item)
    {
        $cart = $request->session()->get('cart.items', []);
        unset($cart[$item]);
        $request->session()->put('cart.items', $cart);

        return back()->with('success', 'Produk dihapus dari keranjang.');
    }

    private function subtotal(array $items): int
    {
        return array_sum(array_map(fn (array $item) => $item['unit_total'] * $item['qty'], $items));
    }
}
