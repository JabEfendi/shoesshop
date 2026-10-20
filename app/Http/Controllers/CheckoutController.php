<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    private const SHIPPING = [
        'jne-regular' => ['name' => 'JNE Reguler', 'etd' => '3-4 hari', 'price' => 18000],
        'anteraja-regular' => ['name' => 'AnterAja Reguler', 'etd' => '2-3 hari', 'price' => 16000],
        'id-express' => ['name' => 'ID Express', 'etd' => '1-2 hari', 'price' => 28000],
        'sicepat-reg' => ['name' => 'SiCepat REG', 'etd' => '2-3 hari', 'price' => 17000],
        'pos-reg' => ['name' => 'Pos Indonesia Reg', 'etd' => '4-6 hari', 'price' => 13000],
    ];

    public function create(Request $request): Response
    {
        $items = array_values($request->session()->get('cart.items', []));
        if ($items === []) {
            return Inertia::render('Sketch/Cart', ['items' => [], 'subtotal' => 0]);
        }

        $subtotal = $this->subtotal($items);

        return Inertia::render('Sketch/Checkout', [
            'expedisi' => array_map(fn (array $value, string $key) => ['id' => $key, ...$value], self::SHIPPING, array_keys(self::SHIPPING)),
            'payment_rules' => ['dp_pct' => 50, 'methods' => ['qris' => 'QRIS', 'virtual-account' => 'Virtual Account']],
            'subtotal' => $subtotal,
            'alamat_default' => ['penerima' => $request->user()->name, 'hp' => '', 'alamat' => '', 'kota' => '', 'kode_pos' => '', 'catatan' => ''],
        ]);
    }

    public function store(Request $request)
    {
        $items = array_values($request->session()->get('cart.items', []));
        if ($items === []) {
            return redirect()->route('sketch.cart')->with('error', 'Keranjang masih kosong.');
        }

        $data = $request->validate([
            'recipient_name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:1000'],
            'city' => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:12'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'shipping_method' => ['required', 'in:'.implode(',', array_keys(self::SHIPPING))],
            'payment_method' => ['required', 'in:qris,virtual-account'],
        ]);

        $subtotal = $this->subtotal($items);
        $shipping = self::SHIPPING[$data['shipping_method']];
        $total = $subtotal + $shipping['price'];

        $order = DB::transaction(function () use ($request, $data, $items, $subtotal, $shipping, $total) {
            $order = Order::create([
                ...$data,
                'number' => 'INV/'.now()->format('Ymd').'/'.str_pad((string) (Order::count() + 1), 5, '0', STR_PAD_LEFT),
                'user_id' => $request->user()->id,
                'shipping_price' => $shipping['price'],
                'subtotal' => $subtotal,
                'total' => $total,
                'dp_amount' => (int) ceil($total / 2),
                'status' => 'awaiting_payment',
                'payment_status' => 'pending',
            ]);

            foreach ($items as $item) {
                $order->items()->create([
                    'type' => $item['type'], 'model_slug' => $item['model_slug'], 'name' => $item['name'],
                    'variant_summary' => $item['variant_summary'], 'configuration' => $item['configuration'],
                    'size' => $item['size'], 'quantity' => $item['qty'], 'base_price' => $item['base_price'],
                    'add_ons' => $item['add_ons'], 'unit_total' => $item['unit_total'],
                ]);
            }

            return $order;
        });

        $request->session()->forget('cart.items');

        return redirect()->route('sketch.orders')->with('success', "Pesanan {$order->number} berhasil dibuat. DP menunggu pembayaran.");
    }

    private function subtotal(array $items): int
    {
        return array_sum(array_map(fn (array $item) => $item['unit_total'] * $item['qty'], $items));
    }
}
