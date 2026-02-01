<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Http\Requests\UpdateProductsRequest;
use App\Models\Categories;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Products::where('user_id', auth()->id())->get();
        $store = Store::where('user_id', auth()->id())->first();

        return Inertia::render('dashboard/products/index', [
            'products' => $products,
            'store' => $store,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $store = Store::where('user_id', auth()->id())->first();
        $categories = Categories::all();
        return Inertia::render('dashboard/forms/CreateProductForm', [
            'store' => $store,
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $store = Store::where('user_id', auth()->id())->first();

        if (!$store) {
            return redirect()->back()->withErrors([
                'store_id' => 'You need to create a store first before adding products.'
            ]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'regular_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'description' => 'required|string',
            'inStock' => 'boolean',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'images' => 'max:5',
        ]);

        $product = new Products();
        $product->user_id = auth()->id();
        $product->store_id = $store->id;
        $product->name = $validated['name'];
        $product->slug = Str::slug($validated['name']) . '-' . time();
        $product->category = $validated['category'];
        $product->quantity = (int) $validated['quantity'];
        $product->regular_price = (float) $validated['regular_price'];
        $product->sale_price = isset($validated['sale_price']) ? (float) $validated['sale_price'] : null;
        $product->description = $validated['description'];
        $product->inStock = $request->boolean('inStock', true);
        $product->rating = 0.0;

        if ($request->hasFile('images')) {
            $images = [];
            $path = public_path('product_images');

            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }

            foreach ($request->file('images') as $index => $file) {
                // Generate unique filename
                $filename = 'product_' . time() . '_' . $index . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();

                $manager = new ImageManager(new Driver());
                $img = $manager->read($file->getRealPath());

                // Resize and optimize
                $img->scale(width: 800);
                $img->save($path . '/' . $filename, quality: 85);

                $images[] = $filename;
            }

            $product->images = json_encode($images);
        } else {
            $product->images = json_encode([]);
        }

        $product->save();
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        $product = Products::where('slug', $slug)->firstOrFail();
        $store = Store::where('id', $product->store_id)->first();

        return Inertia::render('productdetails/index', [
            'product' => $product,
            'store' => $store,
        ]);
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Products $products)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductsRequest $request, Products $products)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $product = Products::findOrFail($id);

        if ($product->images) {
            $images = json_decode($product->images, true);

            if (is_array($images)) {
                foreach ($images as $imagePath) {

                    $filename = basename($imagePath);
                    $fullPath = public_path('product_images/' . $filename);

                    if (File::exists($fullPath)) {
                        File::delete($fullPath);
                    }
                }
            }
        }

        $product->delete();
    }

    public function products() {
        $products = Products::orderBy('created_at', 'desc')->get();

        return Inertia::render('products/index', [
            'products' => $products,
        ]);
    }
}
