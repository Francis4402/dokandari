<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Store;
use App\Http\Requests\UpdateStoreRequest;
use App\Models\Products;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stores = Store::where('user_id', auth()->id())->get();
        return Inertia::render('dashboard/store/index', [
            'stores' => $stores
        ]);
    }

    public function storeroute() {
        $stores = Store::all();
        return Inertia::render('stores/index', [
            'stores' => $stores
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
       return Inertia::render('dashboard/forms/CreateStoreForm');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:stores,name',
            'storetype' => 'required|string',
            'license' => 'nullable|string',
            'address' => 'required|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp'
        ]);

        DB::beginTransaction();

        try {
            // Create store first
            $store = Store::create([
                'user_id' => auth()->id(),
                'name' => $validated['name'],
                'storetype' => $validated['storetype'],
                'license' => $validated['license'] ?? null,
                'address' => $validated['address'],
                'logo' => null
            ]);

            // Handle logo if provided
            if ($request->hasFile('logo')) {
                $logo = $request->file('logo');

                // Store in temp location first
                $tempPath = $logo->storeAs('temp', 'store_' . $store->id . '_' . time(), 'public');

                // Process image
                $manager = new ImageManager(new Driver());
                $img = $manager->read(storage_path('app/public/' . $tempPath));
                $img->scaleDown(width: 800);

                // Save to final location
                $filename = 'store_' . $store->id . '_' . time() . '.webp';
                $finalPath = public_path('store_images/' . $filename);
                $img->save($finalPath, quality: 85);

                // Update store
                $store->update(['logo' => $filename]);

                // Clean up temp file
                Storage::disk('public')->delete($tempPath);
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();

            // Clean up any uploaded files
            if (isset($finalPath) && file_exists($finalPath)) {
                @unlink($finalPath);
            }
            if (isset($tempPath)) {
                Storage::disk('public')->delete($tempPath);
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Store $store)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Store $store)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStoreRequest $request, Store $store)
    {
        //
    }

    public function destroy($id)
    {
        $store = Store::findOrFail($id);


        if ($store->logo && file_exists(public_path('store_images/' . $store->logo))) {
            @unlink(public_path('store_images/' . $store->logo));
        }


        $products = Products::where('store_id', $store->id)->get();

        foreach ($products as $product) {

            if ($product->images) {
                $images = json_decode($product->images, true);
                    if (is_array($images)) {
                        foreach ($images as $image) {
                            if ($image && file_exists(public_path('product_images/' . $image))) {
                                @unlink(public_path('product_images/' . $image));
                            }
                        }
                    } else {
                        if (file_exists(public_path('product_images/' . $product->images))) {
                            @unlink(public_path('product_images/' . $product->images));
                    }
                }
            }


            $product->delete();
        }


        $store->delete();
    }
}
