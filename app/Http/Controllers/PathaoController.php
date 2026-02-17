<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Enan\PathaoCourier\Facades\PathaoCourier;
use Enan\PathaoCourier\Requests\PathaoOrderPriceCalculationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PathaoController extends Controller
{
    public function cities()
    {
        $cities = PathaoCourier::GET_CITIES();
        return response()->json($cities);
    }

    public function zones($city_id)
    {
        $zones = PathaoCourier::GET_ZONES($city_id);
        return response()->json($zones);
    }

    public function areas($zone_id)
    {
        $areas = PathaoCourier::GET_AREAS($zone_id);
        return response()->json($areas);
    }


    public function calculatePrice(Request $request)
    {
        try {
            Log::info('📦 Price calculation request:', [
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'data' => $request->all()
            ]);

            $validated = $request->validate([
                'store_id' => 'required|integer',
                'sender_city' => 'required|integer',
                'recipient_city' => 'required|integer',
                'recipient_zone' => 'required|integer',
                'recipient_area' => 'required|integer',
                'item_type' => 'required|integer|in:1,2',
                'item_weight' => 'required|numeric|min:0.5',
                'item_quantity' => 'required|integer|min:1',
                'amount_to_collect' => 'required|numeric|min:0',
                'delivery_type' => 'required|integer|in:12,48',
            ]);

            Log::info('✅ Validation passed:', $validated);

            // Create Pathao price request
            $priceRequest = new PathaoOrderPriceCalculationRequest();
            $priceRequest->merge($validated);

            // Call Pathao API
            $response = PathaoCourier::GET_PRICE_CALCULATION($priceRequest);

            Log::info('✅ Pathao price calculation success:', (array) $response);

            return response()->json($response);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('❌ Validation failed:', $e->errors());
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ Pathao price calculation failed:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to calculate price',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getStores(Request $request)
    {
        $pathoStore = PathaoCourier::GET_STORES(1, $request);

        return response()->json($pathoStore);
    }

}
