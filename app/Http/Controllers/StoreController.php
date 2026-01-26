<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Store;
use App\Http\Requests\UpdateStoreRequest;
use App\Models\Products;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
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
        return Inertia::render('dashboard/store/index');
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
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'storetype' => 'required|string|max:255',
            'license' => 'string|max:10'
        ]);

        $store = new Store();

        $store->user_id = auth()->id();
        $store->name = $validated['name'];
        $store->storetype = $validated['storetype'];
        $store->license = $validated['license'] ?? null;

        if ($request->hasFile('logo')) {
            $image = $request->file('logo');

            $filename = 'logo_' . time() . '_' . Str::random(8) . '.' . $image->extension();
            $path = public_path('store_images');

            // make sure directory exists
            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }

            // Resize if larger than 1MB
            if ($image->getSize() > 1048576) {
                $manager = new ImageManager(new Driver());
                $img = $manager->read($image->getRealPath());

                $img->scale(width: 800);

                $img->save($path . '/' . $filename);
            } else {
                $image->move($path, $filename);
            }

            // store relative path for frontend
            $store->logo = 'store_images/' . $filename;
        }

        $store->save();
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $store = Store::findOrFail($id);

        // First, delete all products and their images for this store
        $products = Products::where('store_id', $store->id)->get();

        foreach ($products as $product) {
            // Delete product images
            if ($product->images) {

                $images = json_decode($product->images, true);

                if (is_array($images)) {
                    foreach ($images as $image) {
                        if ($image) {
                            // Get the filename
                            $filename = basename($image);

                            // Path in public/product_images folder
                            $imagePath = public_path('product_images/' . $filename);

                            // Delete if exists
                            if (File::exists($imagePath)) {
                                File::delete($imagePath);
                            }
                        }
                    }
                }
            }

            // Delete the product record
            $product->delete();
        }

        // Now delete the store logo
        if ($store->logo) {
            $filename = basename($store->logo);
            $logoPath = public_path('store_images/' . $filename);

            if (File::exists($logoPath)) {
                File::delete($logoPath);
            }
        }

        // Finally, delete the store
        $store->delete();
    }
}
