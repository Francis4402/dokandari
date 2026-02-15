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
                'customer_name'          => 'required|string|max:255',
                'customer_phone'         => 'required|string|max:20',
                'customer_address'       => 'required|string|min:10',
                'customer_email'         => 'nullable|email|max:255',
                'recipient_phone_alt'    => 'nullable|string|max:20',
                'items'                  => 'required|array|min:1',
                'items.*.product_id'     => 'required|string',
                'items.*.quantity'       => 'required|integer|min:1',
                'items.*.price'          => 'required|numeric|min:0',
                'subtotal'               => 'required|numeric|min:0',
                'shipping'               => 'nullable|numeric|min:0',
                'tax'                    => 'nullable|numeric|min:0',
                'total'                  => 'required|numeric|min:0',
                'item_count'             => 'required|integer|min:1',
                'total_weight'           => 'nullable|numeric|min:0.1',
                'amount_to_collect'      => 'required|numeric|min:0',
                'payment_method'         => 'required|in:cash_on_delivery,bikash',
                'shipping_method'        => 'required|in:standard,pathao',
                'tracking_number'        => 'nullable|string',
                'estimated_delivery'     => 'nullable|date',
                'pathao_city'            => 'required_if:shipping_method,pathao|nullable|integer',
                'pathao_city_name'       => 'required_if:shipping_method,pathao|nullable|string',
                'pathao_zone'            => 'required_if:shipping_method,pathao|nullable|integer',
                'pathao_zone_name'       => 'required_if:shipping_method,pathao|nullable|string',
                'pathao_area'            => 'required_if:shipping_method,pathao|nullable|integer',
                'pathao_area_name'       => 'required_if:shipping_method,pathao|nullable|string',
                'pathao_delivery_charge' => 'required_if:shipping_method,pathao|nullable|numeric',
                'pathao_cod_charge'      => 'nullable|numeric',
                'pathao_total_charge'    => 'required_if:shipping_method,pathao|nullable|numeric',
                'coupon_code'            => 'nullable|string',
                'discount_amount'        => 'nullable|numeric|min:0',
                'notes'                  => 'nullable|string',
            ]);

            $user = Auth::user();
            if (!$user) {
                return back()->withErrors(['error' => 'User not authenticated']);
            }

            $firstItem    = $validated['items'][0];
            $firstProduct = Products::find($firstItem['product_id']);
            if (!$firstProduct) {
                return back()->withErrors(['error' => 'Product not found']);
            }

            foreach ($validated['items'] as $itemData) {
                $product = Products::find($itemData['product_id']);
                if (!$product) {
                    return back()->withErrors(['error' => 'Product not found: ' . $itemData['product_id']]);
                }
                if ($product->quantity < $itemData['quantity']) {
                    return back()->withErrors(['error' => 'Insufficient stock for: ' . $product->name]);
                }
            }

            $store = Store::find($firstProduct->store_id);
            if (!$store) {
                return back()->withErrors(['error' => 'Store not found']);
            }

            $totalWeight = $validated['total_weight'] ?? $this->calculateTotalWeight($validated['items']);
            $orderNumber = $this->generateOrderNumber();

            $order = Orders::create([
                'user_id'             => $user->id,
                'store_id'            => $store->id,
                'store_name'          => $store->name,
                'customer_name'       => $validated['customer_name'],
                'customer_phone'      => $validated['customer_phone'],
                'customer_email'      => $validated['customer_email'] ?? null,
                'recipient_name'      => $validated['customer_name'],
                'recipient_phone'     => $validated['customer_phone'],
                'recipient_phone_alt' => $validated['recipient_phone_alt'] ?? null,
                'recipient_address'   => $validated['customer_address'],
                'order_number'        => $orderNumber,
                'item_quantity'       => $validated['item_count'],
                'item_weight'         => $totalWeight,
                'item_description'    => 'Products order',
                'subtotal'            => $validated['subtotal'],
                'delivery_charge'     => $validated['shipping'] ?? 0,
                'cod_charge'          => $validated['pathao_cod_charge'] ?? 0,
                'total_charge'        => $validated['pathao_total_charge'] ?? ($validated['shipping'] ?? 0),
                'total'               => $validated['total'],
                'amount_to_collect'   => $validated['amount_to_collect'],
                'coupon_code'         => $validated['coupon_code'] ?? null,
                'discount_amount'     => $validated['discount_amount'] ?? 0,
                'payment_method'      => $validated['payment_method'],
                'payment_status'      => 'pending',
                'order_status'        => 'pending',
                'shipping_method'     => $validated['shipping_method'],
                'tracking_number'     => $validated['tracking_number'] ?? null,
                'estimated_delivery'  => $validated['estimated_delivery'] ?? null,
                'pathao_city_id'      => $validated['pathao_city'] ?? null,
                'pathao_city_name'    => $validated['pathao_city_name'] ?? null,
                'pathao_zone_id'      => $validated['pathao_zone'] ?? null,
                'pathao_zone_name'    => $validated['pathao_zone_name'] ?? null,
                'pathao_area_id'      => $validated['pathao_area'] ?? null,
                'pathao_area_name'    => $validated['pathao_area_name'] ?? null,
                'delivery_type'       => 48,
                'item_type'           => 2,
                'special_instruction' => $validated['notes'] ?? null,
                'notes'               => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $itemData) {
                $product = Products::find($itemData['product_id']);
                if ($product) {
                    $images     = json_decode($product->images, true);
                    $firstImage = is_array($images) && !empty($images) ? $images[0] : $product->images;

                    OrderItems::create([
                        'order_id'      => $order->id,
                        'product_id'    => $product->id,
                        'product_name'  => $product->name,
                        'product_image' => $firstImage,
                        'quantity'      => $itemData['quantity'],
                        'price'         => $itemData['price'],
                        'total'         => $itemData['price'] * $itemData['quantity'],
                    ]);

                    $product->decrement('quantity', $itemData['quantity']);
                }
            }

            $order->items = json_encode($validated['items']);
            $order->save();

            // ── Pathao ────────────────────────────────────────────────────────
            if ($validated['shipping_method'] === 'pathao') {
                try {
                    // Get pathao_store_id — crash loudly if missing so you know to fix it
                    $pathaoStoreId = $store->pathao_store_id;
                    if (!$pathaoStoreId) {
                        throw new \Exception(
                            'pathao_store_id is not set on store ID ' . $store->id .
                            '. Run: PathaoCourier::GET_STORES(1) in tinker to find your store ID, ' .
                            'then save it to the stores table.'
                        );
                    }

                    $pathaoRequest = new PathaoOrderRequest();
                    $pathaoRequest->merge([
                        'store_id'            => $pathaoStoreId,
                        'merchant_order_id'   => $order->order_number,
                        'sender_name'         => $store->name,
                        'sender_phone'        => $store->phone ?? $store->mobile,
                        'recipient_name'      => $validated['customer_name'],
                        'recipient_phone'     => $validated['customer_phone'],
                        'recipient_address'   => $validated['customer_address'],
                        'recipient_city'      => (int) $validated['pathao_city'],
                        'recipient_zone'      => (int) $validated['pathao_zone'],
                        'recipient_area'      => (int) $validated['pathao_area'],
                        'delivery_type'       => 48,
                        'item_type'           => 2,
                        'special_instruction' => $validated['notes'] ?? '',
                        'item_quantity'       => (int) $validated['item_count'],
                        'item_weight'         => (float) $totalWeight,
                        'amount_to_collect'   => (float) $validated['amount_to_collect'],
                        'item_description'    => 'Products order',
                    ]);

                    $pathaoResponse = PathaoCourier::CREATE_ORDER($pathaoRequest);
                    Log::info('✅ Pathao order created:', (array) $pathaoResponse);

                    if (!empty($pathaoResponse['data'])) {
                        $pathaoData = $pathaoResponse['data'];
                        $order->update([
                            'pathao_order_id'       => $pathaoData['order_id']       ?? null,
                            'pathao_consignment_id' => $pathaoData['consignment_id'] ?? null,
                            'pathao_order_status'   => $pathaoData['order_status']   ?? null,
                            'pathao_response'       => json_encode($pathaoResponse),
                            'tracking_number'       => $pathaoData['consignment_id'] ?? $order->tracking_number,
                        ]);
                    }

                } catch (\Exception $pathaoError) {
                    Log::error('❌ Pathao API error:', [
                        'order_id' => $order->id,
                        'message'  => $pathaoError->getMessage(),
                    ]);
                    $order->update([
                        'pathao_response' => json_encode(['error' => $pathaoError->getMessage()]),
                    ]);
                }
            }

            Log::info('✅ Order created:', [
                'order_id'     => $order->id,
                'order_number' => $order->order_number,
            ]);

            // ── THE KEY FIX ───────────────────────────────────────────────────
            // Do NOT check wantsJson() / ajax() / expectsJson() here.
            // Inertia's router.post() intercepts this redirect automatically
            // and navigates to the confirmation page. onSuccess fires after arrival.
            return redirect()->route('orders.confirmation', $order->id)
                ->with('success', 'Order placed successfully!');

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error:', $e->errors());
            // Inertia handles back()->withErrors() perfectly — shows errors on checkout page
            return back()->withErrors($e->errors())->withInput();

        } catch (\Exception $e) {
            Log::error('Order creation failed:', [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
            ]);
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
}
