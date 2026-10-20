<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = $request->user()->orders()->with('items')->latest()->get()->map(function (Order $order) {
            return [
                'id' => $order->number,
                'tgl' => $order->created_at->toDateString(),
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'items' => $order->items->map(fn ($item) => ['n' => $item->name, 'size' => $item->size, 'qty' => $item->quantity, 'price' => $item->unit_total])->all(),
                'tagihan' => ['total' => $order->total, 'dp' => $order->dp_amount, 'lunas' => $order->payment_status === 'paid', 'pelunasan_sisa' => $order->payment_status === 'paid' ? 0 : $order->total - $order->dp_amount],
            ];
        });

        return Inertia::render('Sketch/OrderDashboard', ['orders' => $orders]);
    }
}
