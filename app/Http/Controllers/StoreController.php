<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Orders;
use Illuminate\Http\Request;
use App\Models\Store;
use App\Models\Products;
use App\Models\wishlist;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
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
        $products = Products::whereIn('store_id', $stores->pluck('id'))->get();
        $orders = Orders::whereIn('store_id', $stores->pluck('id'))->get();
        return Inertia::render('dashboard/store/index', [
            'stores' => $stores,
            'products' => $products,
            'orders' => $orders
        ]);
    }

    public function storeroute() {
        $stores = Store::all();
        $wishlist = wishlist::where('user_id', auth()->id())->paginate(12);
        return Inertia::render('stores/index', [
            'stores' => $stores,
            'wishlist' => $wishlist
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
            'license' => 'nullable|string|max:24',
            'address' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'national_id' => 'required|string|unique:stores,national_id|min:10|max:10',
            'mobile' => 'required|string|unique:stores,mobile|min:11|max:11',
        ]);

        try {

            $user = Auth::user();

            if (!$user) {
                throw new \Exception('User not authenticated');
            }

            // Create store first
            $store = Store::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'email' => $user->email,
                'storetype' => $validated['storetype'],
                'license' => $validated['license'] ?? null,
                'address' => $validated['address'],
                'national_id' => $validated['national_id'],
                'mobile' => $validated['mobile'],
                'logo' => null
            ]);

            if ($request->hasFile('logo')) {

                $logo = $request->file('logo');

                $extension = $logo->getClientOriginalExtension();

                $filename = 'store_' . $store->id . '_' . time() . '_' . Str::random(8) . '.' . $extension;

                $directory = 'store_logos';
                $filePath = $directory . '/' . $filename;

                $manager = new ImageManager(new Driver());
                $img = $manager->read($logo->getRealPath());

                $img->scaleDown(width: 800);


                Storage::disk('public')->put(
                    $filePath,
                    (string) $img->encode()
                );

                $store->update(['logo' => $filePath]);
            }

            $store->save();

        } catch (\Exception) {
            DB::rollBack();

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

        $products = Products::where('store_id', $store->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $wishlist = wishlist::where('user_id', auth()->id())->paginate(12);

        // Get store ratings
        $storeRatings = Comment::where('store_id', $store->id)
            ->whereNull('product_id')
            ->whereNotNull('rating')
            ->get();

        $averageRating = $storeRatings->avg('rating') ?? 0;
        $reviewCount = $storeRatings->count();

        // Get product ratings for all products in this store
        $productIds = $products->pluck('id')->toArray();
        $productRatings = Comment::whereIn('product_id', $productIds)
            ->whereNotNull('rating')
            ->select('product_id', 'rating')
            ->get();

        // Calculate average ratings for each product
        $productRatingsData = [];
        foreach ($products as $product) {
            $productRatingData = $productRatings->where('product_id', $product->id);
            $averageProductRating = $productRatingData->avg('rating') ?? 0;
            $productReviewCount = $productRatingData->count();

            $productRatingsData[$product->id] = [
                'average' => round($averageProductRating, 1),
                'count' => $productReviewCount
            ];
        }

        $userStoreRating = null;

        if (auth()->check()) {
            $userRating = Comment::where('user_id', auth()->id())
                ->where('store_id', $store->id)
                ->whereNull('product_id')
                ->first();

            if ($userRating) {
                $userStoreRating = [
                    'id' => $userRating->id,
                    'rating' => $userRating->rating,
                    'comment' => $userRating->comment,
                ];
            }
        }

        return Inertia::render('storeproducts/index', [
            'store' => $store,
            'products' => $products,
            'wishlist' => $wishlist,
            'storeRating' => [
                'average' => round($averageRating, 1),
                'count' => $reviewCount,
            ],
            'productRatings' => $productRatingsData, // Add this
            'userStoreRating' => $userStoreRating,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $name)
    {
        $store = Store::where('name', $name)->first();

        return Inertia::render('dashboard/forms/StoreUpdateForm', [
            'store' => $store
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Store $store)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('stores', 'name')->ignore($store->id)
            ],
            'storetype' => 'required|string',
            'address' => 'required|string|max:255',
            'license' => [
                'nullable',
                'string',
                'max:24',
                Rule::unique('stores', 'license')->ignore($store->id)
            ],
            'national_id' => [
                'required',
                'string',
                'digits:10',
                Rule::unique('stores', 'national_id')->ignore($store->id)
            ],
            'mobile' => [
                'required',
                'string',
                'digits:11',
                Rule::unique('stores', 'mobile')->ignore($store->id)
            ],
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'remove_logo' => 'nullable|in:true,false,0,1',
        ]);


        $removeLogo = in_array($validated['remove_logo'] ?? 'false', ['true', '1', 1, true], true);

        if ($request->hasFile('logo')) {

            $path = public_path('store_images');

            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }

            // Delete old logo
            if ($store->logo && file_exists(public_path('store_images/' . $store->logo))) {
                @unlink(public_path('store_images/' . $store->logo));
            }

            $file = $request->file('logo');


            $extension = $file->getClientOriginalExtension();

            $filename = 'store_' . $store->id . '_' . time() . '_' . Str::random(8) . '.' . $extension;

            $manager = new ImageManager(new Driver());
            $img = $manager->read($file->getRealPath());

            $img->scaleDown(width: 800);


            $img->save($path . '/' . $filename);

            $validated['logo'] = $filename;

        } elseif ($removeLogo) {

            if ($store->logo && file_exists(public_path('store_images/' . $store->logo))) {
                @unlink(public_path('store_images/' . $store->logo));
            }

            $validated['logo'] = null;

        } else {
            unset($validated['logo']);
        }


        $store->update([
            'name' => $validated['name'],
            'storetype' => $validated['storetype'],
            'address' => $validated['address'],
            'license' => $validated['license'],
            'mobile' => $validated['mobile'],
            'national_id' => $validated['national_id'],
        ]);


        if (isset($validated['logo'])) {
            $store->logo = $validated['logo'];
            $store->save();
        }
    }

    public function destroy(int $id)
    {
        $store = Store::findOrFail($id);


        if ($store->logo && Storage::disk('public')->exists($store->logo)) {
            Storage::disk('public')->delete($store->logo);
        }


        $products = Products::where('store_id', $store->id)->get();

        foreach ($products as $product) {

            if ($product->images) {
                $images = json_decode($product->images, true);

                if (is_array($images)) {

                    foreach ($images as $image) {
                        if ($image && Storage::disk('public')->exists($image)) {
                            Storage::disk('public')->delete($image);
                        }
                    }
                } else {

                    if ($product->images && Storage::disk('public')->exists($product->images)) {
                        Storage::disk('public')->delete($product->images);
                    }
                }
            }


            $product->delete();
        }


        $store->delete();
    }
}
