<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use App\Models\OrderItems;
use App\Models\Products;
use App\Models\Store;
use Enan\PathaoCourier\Facades\PathaoCourier;
use Enan\PathaoCourier\Requests\PathaoOrderRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
    try {
        Log::info('Order request received:', $request->all());

        $validated = $request->validate([
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|max:20',
            'recipient_address' => 'required|string|min:10',
            'recipient_city' => 'required|integer',
            'recipient_zone' => 'required|integer',
            'recipient_area' => 'required|integer',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'subtotal' => 'required|numeric',
            'delivery_charge' => 'required|numeric',
            'total' => 'required|numeric',
            'amount_to_collect' => 'required|numeric',
            'item_quantity' => 'required|integer',
            'item_weight' => 'required|numeric|min:0.1',
            'item_description' => 'required|string',
            'store_name' => 'required|string',
            'order_number' => 'required|string|unique:orders',
            'merchant_order_id' => 'required|string',
            'payment_method' => 'required|in:cash_on_delivery,bikash',
            'shipping_method' => 'required|in:pathao',
            'delivery_type' => 'required|integer|in:12,48',
            'item_type' => 'required|integer|in:1,2',
            'coupon_code' => 'nullable|string',
            'discount_amount' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'tracking_number' => 'nullable|string',
            'special_instruction' => 'nullable|string',
            'customer_name' => 'nullable|string',
            'customer_email' => 'nullable|email',
        ]);

        $user = Auth::user();
        if (!$user) return back()->withErrors(['error' => 'User not authenticated']);

        $firstProduct = Products::find($validated['items'][0]['product_id']);
        if (!$firstProduct) return back()->withErrors(['error' => 'Product not found']);

        // Stock validation
        foreach ($validated['items'] as $item) {
            $product = Products::find($item['product_id']);
            if (!$product) return back()->withErrors(['error' => "Product not found: {$item['product_id']}"]);
            if ($product->quantity < $item['quantity']) {
                return back()->withErrors(['error' => "Insufficient stock for: {$product->name}"]);
            }
        }

        $store = Store::find($firstProduct->store_id);
        if (!$store) return back()->withErrors(['error' => 'Store not found']);

        // Create order
        $order = Orders::create([
            'user_id' => $user->id,
            'store_id' => $store->id,
            'merchant_order_id' => $validated['merchant_order_id'],
            'order_number' => $validated['order_number'],
            'sender_name' => $store->name,
            'sender_phone' => $store->phone ?? $store->mobile ?? '',
            'recipient_name' => $validated['recipient_name'],
            'recipient_phone' => $validated['recipient_phone'],
            'recipient_address' => $validated['recipient_address'],
            'recipient_city' => $validated['recipient_city'],
            'recipient_zone' => $validated['recipient_zone'],
            'recipient_area' => $validated['recipient_area'],
            'delivery_type' => $validated['delivery_type'],
            'item_type' => $validated['item_type'],
            'special_instruction' => $validated['special_instruction'] ?? $validated['notes'] ?? null,
            'item_quantity' => $validated['item_quantity'],
            'item_weight' => $validated['item_weight'],
            'amount_to_collect' => $validated['amount_to_collect'],
            'item_description' => $validated['item_description'],
            'store_name' => $validated['store_name'],
            'subtotal' => $validated['subtotal'],
            'delivery_charge' => $validated['delivery_charge'],
            'total' => $validated['total'],
            'coupon_code' => $validated['coupon_code'] ?? null,
            'discount_amount' => $validated['discount_amount'] ?? 0,
            'tracking_number' => $validated['tracking_number'] ?? null,
            'shipping_method' => $validated['shipping_method'],
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'pending',
            'order_status' => 'pending',
            'notes' => $validated['notes'] ?? null,
            'items' => json_encode($validated['items']),
        ]);

        // Create order items & update stock
        foreach ($validated['items'] as $item) {
            $product = Products::find($item['product_id']);
            if ($product) {
                OrderItems::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_image' => $this->getFirstImage($product->images),
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $item['price'] * $item['quantity'],
                ]);
                $product->decrement('quantity', $item['quantity']);
            }
        }

        // Pathao API integration
        if ($validated['shipping_method'] === 'pathao' && $store->pathao_store_id) {
            try {
                $pathaoRequest = new PathaoOrderRequest();
                $pathaoRequest->merge([
                    'store_id' => $store->pathao_store_id,
                    'merchant_order_id' => $order->order_number,
                    'sender_name' => $store->name,
                    'sender_phone' => $store->phone ?? $store->mobile,
                    'recipient_name' => $validated['recipient_name'],
                    'recipient_phone' => $validated['recipient_phone'],
                    'recipient_address' => $validated['recipient_address'],
                    'recipient_city' => $validated['recipient_city'],
                    'recipient_zone' => $validated['recipient_zone'],
                    'recipient_area' => $validated['recipient_area'],
                    'delivery_type' => $validated['delivery_type'],
                    'item_type' => $validated['item_type'],
                    'special_instruction' => $validated['special_instruction'] ?? '',
                    'item_quantity' => $validated['item_quantity'],
                    'item_weight' => $validated['item_weight'],
                    'amount_to_collect' => $validated['amount_to_collect'],
                    'item_description' => $validated['item_description'],
                ]);

                $response = \Enan\PathaoCourier\Facades\PathaoCourier::CREATE_ORDER($pathaoRequest);

                if (!empty($response['data'])) {
                    $order->update([
                        'pathao_order_id' => $response['data']['order_id'] ?? null,
                        'pathao_consignment_id' => $response['data']['consignment_id'] ?? null,
                        'pathao_response' => json_encode($response),
                        'tracking_number' => $response['data']['consignment_id'] ?? $order->tracking_number,
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('Pathao error:', ['order_id' => $order->id, 'message' => $e->getMessage()]);
                $order->update(['pathao_response' => json_encode(['error' => $e->getMessage()])]);
            }
        }

        return redirect()->route('orders.confirmation', $order->id)
            ->with('success', 'Order placed successfully!');

    } catch (\Illuminate\Validation\ValidationException $e) {
        return back()->withErrors($e->errors())->withInput();
    } catch (\Exception $e) {
        Log::error('Order failed:', ['message' => $e->getMessage()]);
        return back()->withErrors(['error' => 'Failed to place order: ' . $e->getMessage()])->withInput();
    }
}


    public function confirmation(Orders $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['orderItems', 'store', 'user']);

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

    private function getFirstImage($images): string
    {
        if (is_string($images)) {
            try {
                $decoded = json_decode($images, true);
                if (is_array($decoded) && !empty($decoded)) {
                    return $decoded[0];
                }
                return $images;
            } catch (\Exception $e) {
                return $images;
            }
        }
        return is_array($images) && !empty($images) ? $images[0] : '';
    }
}
