<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use App\Models\OrderItems;
use App\Models\Products;
use App\Models\Store;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrdersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Orders::where('user_id', Auth::id())
            ->with('orderItems')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('orders/Index', [
            'orders' => $orders
        ]);
    }

    public function dashboardIndex()
    {
        $store = Store::where('user_id', Auth::id())->first();

        $orders = Orders::where('store_id', $store->id)
        ->with('orderItems')
        ->orderBy('created_at', 'desc')
        ->get();

        return Inertia::render('dashboard/orders/index', [
            'orders' => $orders,
        ]);
    }


    public function checkout() {
        $user = Auth::user();

        $store = Store::first();

        return Inertia::render('orders/Checkout', [
            'user' => $user,
            'store' => $store,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'subtotal' => 'required|numeric|min:0',
            'shipping' => 'required|numeric|min:0',
            'tax' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'item_count' => 'required|integer|min:1',
            'payment_method' => 'required|in:cash_on_delivery,bikash',
        ]);


        try {
            $user = Auth::user();
            $items = $validated['items'];

            foreach ($items as $itemData) {
                $product = Products::find($itemData['product_id']);

                if (!$product) {
                    return back()->withErrors(['error' => 'Product not found: ' . $itemData['product_id']]);
                }

                if ($product->quantity < $itemData['quantity']) {
                    return back()->withErrors(['error' => 'Insufficient stock for: ' . $product->name]);
                }
            }

            $firstProduct = Products::find($items[0]['product_id']);
            $store = Store::find($firstProduct->store_id);

            if (!$store) {
                return back()->withErrors(['error' => 'Store not found']);
            }


            $orderNumber = $this->generateOrderNumber();

            $order = Orders::create([
                'user_id' => $user->id,
                'store_id' => $store->id,
                'store_name' => $store->name,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'customer_address' => $validated['customer_address'],
                'order_number' => $orderNumber,
                'subtotal' => $validated['subtotal'],
                'shipping' => $validated['shipping'],
                'tax' => $validated['tax'],
                'discount' => 0,
                'total' => $validated['total'],
                'payment_method' => $validated['payment_method'] ?? 'cash_on_delivery',
                'payment_status' => 'pending',
                'order_status' => 'pending',
                'notes' => $validated['notes'] ?? null,
            ]);


            foreach ($items as $itemData) {
                $product = Products::find($itemData['product_id']);

                if ($product) {
                    $images = json_decode($product->images, true);
                    $firstImage = is_array($images) && !empty($images) ? $images[0] : $product->images;

                    OrderItems::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_image' => $firstImage,
                        'quantity' => $itemData['quantity'],
                        'price' => $itemData['price'],
                        'total' => $itemData['price'] * $itemData['quantity'],
                    ]);


                    $product->decrement('quantity', $itemData['quantity']);
                }
            }

            return redirect()->route('orders.confirmation', $order);

        } catch (\Exception $e) {

            return back()->withErrors(['error' => 'Failed to place order. Please try again.'])->withInput();
        }
    }


    public function confirmation(Orders $order) {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['orderItems', 'store']);

        return Inertia::render('orders/Confirmation', [
            'order' => $order
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $order = Orders::with('orderItems')->findOrFail($id);

        $store = Store::find($order->store_id);

        return Inertia::render('orders/Show', [
            'order' => $order,
            'store' => $store
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Orders $orders)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Orders $orders)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,confirmed,processing,shipped,delivered,cancelled',
        ]);

        $orders->update([
            'order_status' => $validated['status'],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $orders = Orders::where('id', $id)->first();

        $orders->delete();
    }


    private function generateOrderNumber()
    {
        $prefix = 'ORD';
        $date = date('Ymd');

        $lastOrder = Orders::where('order_number', 'like', $prefix . $date . '%')
            ->orderBy('order_number', 'desc')
            ->first();

        if ($lastOrder) {
            $lastNumber = intval(substr($lastOrder->order_number, -4));
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }

        return $prefix . $date . $newNumber;
    }
}
