<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\Categories;
use App\Models\Comment;
use App\Models\Store;
use App\Models\wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'subcategory' => 'required|string',
            'quantity' => 'required|integer|min:0',
            'regular_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'description' => 'required|string',
            'inStock' => 'boolean',
            'color' => 'nullable|max:20',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'images' => 'max:5',
            'item_weight' => 'required|numeric',
        ]);

        $product = new Products();
        $product->user_id = auth()->id();
        $product->store_id = $store->id;
        $product->name = $validated['name'];
        $product->slug = Str::slug($validated['name']) . '-' . time();
        $product->category = $validated['category'];
        $product->subcategory = $validated['subcategory'];
        $product->quantity = (int) $validated['quantity'];
        $product->regular_price = (float) $validated['regular_price'];
        $product->sale_price = isset($validated['sale_price']) ? (float) $validated['sale_price'] : null;
        $product->description = $validated['description'];
        $product->color = json_encode($validated['color'] ?? []);
        $product->inStock = $request->boolean('inStock', true);
        $product->item_weight = $validated['item_weight'];

        if ($request->hasFile('images')) {
            $images = [];

            $directory = 'product_images';

            foreach ($request->file('images') as $index => $file) {

                $extension = $file->getClientOriginalExtension();


                $filename = 'product_' . time() . '_' . $index . '_' . Str::random(10) . '.' . $extension;

                $filePath = $directory . '/' . $filename;

                $manager = new ImageManager(new Driver());
                $img = $manager->read($file->getRealPath());

                $img->scale(width: 800);

                $encodedImage = (string) $img->encodeByExtension($extension, quality: 85);

                Storage::disk('public')->put($filePath, $encodedImage);

                $images[] = $filePath;
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
        $product = Products::with('store')
            ->where('slug', $slug)
            ->firstOrFail();

        $store = Store::where('id', $product->store_id)->first();

        $wishlist = Wishlist::where('user_id', auth()->id())
            ->paginate(12);

        // Get comments with user data
        $comments = Comment::with('user')
            ->where('product_id', $product->id)
            ->latest()
            ->get()
            ->map(function ($comment) {
                return [
                    'id' => (string) $comment->id,
                    'user_id' => (string) $comment->user_id,
                    'product_id' => (string) $comment->product_id,
                    'store_id' => (string) $comment->store_id,
                    'comment' => $comment->comment,
                    'rating' => $comment->rating,
                    'created_at' => $comment->created_at,
                    'updated_at' => $comment->updated_at,
                    'user' => $comment->user ? [
                        'id' => $comment->user->id,
                        'name' => $comment->user->name,
                        'images' => $comment->user->images ?? '',
                        'email' => $comment->user->email,
                        'role' => $comment->user->role ?? 'user',
                        'email_verified_at' => $comment->user->email_verified_at ?? '',
                    ] : null,
                ];
            });

        // Calculate average rating and review count
        $ratings = $comments->filter(function($comment) {
            return $comment['rating'] !== null;
        });

        $averageRating = $ratings->count() > 0
            ? $ratings->avg('rating')
            : 0;

        $reviewCount = $ratings->count();

        // Get user's existing review if logged in
        $userReview = null;
        if (auth()->check()) {
            $userReview = Comment::where('user_id', auth()->id())
                ->where('product_id', $product->id)
                ->first();
        }

        return Inertia::render('productdetails/index', [
            'product' => $product,
            'store' => $store,
            'wishlist' => $wishlist,
            'comments' => $comments,
            'averageRating' => $averageRating,
            'reviewCount' => $reviewCount,
            'userReview' => $userReview ? [
                'id' => $userReview->id,
                'comment' => $userReview->comment,
                'rating' => $userReview->rating,
            ] : null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($slug)
    {
        $store = Store::where('user_id', auth()->id())->first();
        $categories = Categories::all();
        $products = Products::where('slug', $slug)->first();
        return Inertia::render('dashboard/forms/ProductUpdateForm', [
            'product' => $products,
            'store' => $store,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $slug)
    {
        $product = Products::where('slug', $slug)->firstOrFail();

        // ✅ Validate
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'subcategory' => 'required|string',
            'quantity' => 'required|integer|min:0',
            'regular_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'description' => 'required|string',
            'inStock' => 'boolean',
            'color' => 'nullable|max:20',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            'images' => 'max:5',
            'images_to_remove' => 'nullable|string',
            'item_weight' => 'required|numeric',
        ]);

        // ✅ Update normal fields (exclude images)
        $product->update(collect($validated)->except([
            'images',
            'images_to_remove',
        ])->toArray());

        $existingImages = json_decode($product->images, true) ?? [];

        $imagesToRemove = json_decode($request->images_to_remove, true) ?? [];

        if (!empty($imagesToRemove)) {
            foreach ($imagesToRemove as $imagePath) {
                if (Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }

                $existingImages = array_values(array_diff($existingImages, [$imagePath]));
            }
        }

        if ($request->hasFile('images')) {
            $directory = 'product_images';

            foreach ($request->file('images') as $index => $file) {
                // Get original extension
                $extension = $file->getClientOriginalExtension();

                // Generate unique filename
                $filename = 'product_' . time() . '_' . $index . '_' . Str::random(10) . '.' . $extension;

                $filePath = $directory . '/' . $filename;

                $manager = new ImageManager(new Driver());
                $img = $manager->read($file->getRealPath());

                // Resize and optimize
                $img->scale(width: 800);

                $encodedImage = (string) $img->encodeByExtension($extension, quality: 85);

                // Save to storage
                Storage::disk('public')->put($filePath, $encodedImage);

                $existingImages[] = $filePath;
            }
        }

        // ✅ Save final images array
        $product->images = json_encode(array_values($existingImages));
        $product->save();
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
                    Storage::disk('public')->delete($imagePath);
                }
            }
        }

        $product->delete();
    }

    public function products() {
        $products = Products::with('store')
            ->orderBy('created_at', 'desc')
            ->get();

        $wishlist = wishlist::where('user_id', auth()->id())->paginate(12);

        return Inertia::render('products/index', [
            'products' => $products,
            'wishlist' => $wishlist
        ]);
    }
}
