<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\Categories;
use App\Models\Comment;
use App\Models\Store;
use App\Models\wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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
        $userId = auth()->id();

        $products = Products::where('user_id', $userId)->get();

        $store = Store::where('user_id', $userId)->first();

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
            'brand' => 'required|string',
            'quantity' => 'required|integer|min:0',
            'regular_price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'description' => 'required|string',
            'inStock' => 'boolean',
            'color' => 'nullable|max:20',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'images' => 'max:5',
            'item_weight' => 'required|numeric',
            'product_type' => 'required|in:regular,featured,trending,top-selling,new-arrival', // Added validation
        ]);

        $product = new Products();
        $product->user_id = auth()->id();
        $product->store_id = $store->id;
        $product->name = $validated['name'];
        $product->slug = Str::slug($validated['name']) . '-' . time();
        $product->category = $validated['category'];
        $product->subcategory = $validated['subcategory'];
        $product->brand = $validated['brand'];
        $product->quantity = (int) $validated['quantity'];
        $product->regular_price = (float) $validated['regular_price'];
        $product->sale_price = isset($validated['sale_price']) ? (float) $validated['sale_price'] : null;
        $product->description = $validated['description'];
        $product->color = json_encode($validated['color'] ?? []);
        $product->inStock = $request->boolean('inStock', true);
        $product->item_weight = $validated['item_weight'];
        $product->product_type = $validated['product_type'] ?? 'regular'; // Added product_type assignment

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

        // Clear cache for this user
        Cache::forget("user_products_" . auth()->id());

        return redirect()->route('dashboard.products')
            ->with('success', 'Product created successfully!');
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


        $ratings = $comments->filter(function($comment) {
            return $comment['rating'] !== null;
        });

        $averageRating = $ratings->count() > 0
            ? $ratings->avg('rating')
            : 0;

        $reviewCount = $ratings->count();

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

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'subcategory' => 'required|string',
            'brand' => 'required|string',
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
            'product_type' => 'required|in:regular,featured,trending,top-selling,new-arrival',
        ]);

        // Update product with validated data except images and images_to_remove
        $product->update(collect($validated)->except([
            'images',
            'images_to_remove',
        ])->toArray());

        // Explicitly set product_type
        $product->product_type = $validated['product_type'];

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

                $extension = $file->getClientOriginalExtension();

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

        $product->images = json_encode(array_values($existingImages));
        $product->save();

        // Cache clearing removed - no longer needed since we removed caching

        return redirect()->route('dashboard.products')
            ->with('success', 'Product updated successfully!');
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

    public function products(Request $request)
    {
        $userId = auth()->id();

        $query = Products::with(['store' => function ($query) {
                $query->select('id', 'name', 'storetype');
            }])
            ->withCount(['comments as rating_count' => function ($query) {
                $query->whereNotNull('rating');
            }])
            ->withAvg(['comments as average_rating' => function ($query) {
                $query->whereNotNull('rating');
            }], 'rating');

        if ($request->boolean('in_stock')) {
            $query->where('inStock', true)
                ->where('quantity', '>', 0);
        }

        // Filter by category
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Filter by product type
        if ($request->filled('product_type') && $request->product_type !== 'all') {
            if ($request->product_type === 'on-sale') {
                $query->whereNotNull('sale_price')
                    ->whereColumn('sale_price', '<', 'regular_price');
            } else {
                $query->where('product_type', $request->product_type);
            }
        }

        // Filter by brand
        if ($request->filled('brand') && $request->brand !== 'all') {
            $query->where('brand', $request->brand);
        }

        // Search by product name, description, brand, or category
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                ->orWhere('description', 'LIKE', "%{$search}%")
                ->orWhere('brand', 'LIKE', "%{$search}%")
                ->orWhere('category', 'LIKE', "%{$search}%");
            });
        }

        // Filter by price range — use the EFFECTIVE price (sale price if
        // present, otherwise regular price), matching the sort logic below.
        // Comparing regular_price and sale_price independently with OR let
        // out-of-range products slip through (e.g. regular_price=2000,
        // sale_price=50 would pass a min_price=1000 filter incorrectly).
        if ($request->filled('min_price')) {
            $query->whereRaw('COALESCE(sale_price, regular_price) >= ?', [(float) $request->min_price]);
        }

        if ($request->filled('max_price')) {
            $query->whereRaw('COALESCE(sale_price, regular_price) <= ?', [(float) $request->max_price]);
        }

        // Sort
        switch ($request->sort_by) {
            case 'price-low':
                $query->orderByRaw('COALESCE(sale_price, regular_price) ASC');
                break;
            case 'price-high':
                $query->orderByRaw('COALESCE(sale_price, regular_price) DESC');
                break;
            case 'rating':
                $query->orderByRaw('COALESCE(average_rating, 0) DESC');
                break;
            case 'date':
                $query->orderBy('created_at', 'DESC');
                break;
            case 'popularity':
                $query->orderBy('rating_count', 'DESC');
                break;
            default:
                $query->orderBy('created_at', 'DESC');
                break;
        }

        // Paginate with 12 items per page and preserve query-string filters
        $products = $query->paginate(12);
        $products->appends($request->query());

        // Get wishlist
        $wishlist = $userId ? Wishlist::where('user_id', $userId)->get() : collect();

        // Get unique categories for filters (from all products, so the
        // dropdown doesn't shrink just because "in stock only" is checked)
        $categories = Products::distinct()->pluck('category')->filter()->values()->toArray();

        // Get unique brands for filters
        $brands = Products::whereNotNull('brand')
            ->where('brand', '!=', '')
            ->distinct()
            ->pluck('brand')
            ->filter()
            ->values()
            ->toArray();

        // Get price range based on the effective price, across all products
        $minPrice = Products::selectRaw('MIN(COALESCE(sale_price, regular_price)) as min_price')->value('min_price') ?? 0;
        $maxPrice = Products::selectRaw('MAX(COALESCE(sale_price, regular_price)) as max_price')->value('max_price') ?? 10000;

        // Build product ratings
        $productRatings = [];
        foreach ($products as $product) {
            $productRatings[$product->id] = [
                'average' => round($product->average_rating ?? 0, 1),
                'count' => $product->rating_count ?? 0,
            ];
        }

        return Inertia::render('products/index', [
            'products' => $products,
            'wishlist' => $wishlist,
            'productRatings' => $productRatings,
            'filters' => [
                'categories' => $categories,
                'brands' => $brands,
                'min_price' => (int) $minPrice,
                'max_price' => (int) $maxPrice,
                'current' => [
                    'category' => $request->category ?? 'all',
                    'product_type' => $request->product_type ?? 'all',
                    'brand' => $request->brand ?? 'all',
                    'search' => $request->search ?? '',
                    'sort_by' => $request->sort_by ?? 'default',
                    'in_stock' => $request->boolean('in_stock', false),
                    'min_price_filter' => $request->min_price ? (int) $request->min_price : (int) $minPrice,
                    'max_price_filter' => $request->max_price ? (int) $request->max_price : (int) $maxPrice,
                ],
            ],
        ]);
    }

    public function hotdeals() {

        $products = Products::with('store')
            ->orderBy('created_at', 'desc')->paginate(20);


        $wishlist = Wishlist::where('user_id', auth()->id())
            ->paginate(12);


        $productIds = $products->pluck('id')->toArray();


        $ratings = Comment::whereIn('product_id', $productIds)
            ->whereNotNull('rating')
            ->select('product_id', 'rating')
            ->get();


        $productRatings = [];
        foreach ($products as $product) {
            $productRatingData = $ratings->where('product_id', $product->id);
            $averageRating = $productRatingData->avg('rating') ?? 0;
            $ratingCount = $productRatingData->count();

            $productRatings[$product->id] = [
                'average' => round($averageRating, 1),
                'count' => $ratingCount
            ];
        }

        return Inertia::render('hotdeals/index', [
            'products' => $products,
            'wishlist' => $wishlist,
            'productRatings' => $productRatings,
        ]);
    }

    public function newestproduct() {
        return Inertia::render('/');
    }

}
