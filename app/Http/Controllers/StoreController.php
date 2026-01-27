<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Store;
use App\Http\Requests\UpdateStoreRequest;
use App\Models\Products;
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
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp',
            'storetype' => 'required|string|max:255',
            'license' => 'string|max:10'
        ]);

        $store = new Store();

        $store->user_id = auth()->id();
        $store->name = $validated['name'];
        $store->storetype = $validated['storetype'];
        $store->license = $validated['license'] ?? null;

        if ($request->file('logo')) {
            $logo = $request->file('logo');

            $filename = time() . '_' . $logo->getClientOriginalName();
            $path = public_path('store_images/' . $filename);

            $manager = new ImageManager(new Driver());
            $img = $manager->read($logo->getPathname());
            $img->scaleDown(width: 800);
            $img->save($path, quality: 85);

            $store->logo = $filename;
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
        $store = Store::where('id', $id)->first();

        if($store->logo) {
            @unlink(public_path('store_images/'.$store->logo));
        }

        $products = Products::where('store_id', $store->id)->get();

        foreach ($products as $product) {
            if ($product->images) {
                @unlink(public_path('product_images/'.$product->images));
            }
        }

        Products::where('store_id', $store->id)->delete();

        $store->delete();
    }
}
