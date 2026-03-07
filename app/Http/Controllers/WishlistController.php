<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Products;
use App\Models\wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $wishlistItems = Wishlist::with('product.store')
            ->where('user_id', auth()->id())
            ->paginate(12);

        $products = [];
        foreach ($wishlistItems->items() as $item) {
            if ($item->product) {
                $products[] = $item->product;
            }
        }

        // Get all product IDs from wishlist
        $productIds = collect($products)->pluck('id')->toArray();


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

        $wishlistProducts = [
            'data' => $products,
            'current_page' => $wishlistItems->currentPage(),
            'last_page' => $wishlistItems->lastPage(),
            'per_page' => $wishlistItems->perPage(),
            'total' => $wishlistItems->total(),
            'productRatings' => $productRatings, // Add ratings to the data
        ];

        return Inertia::render('wishlist/index', [
            'wishlistProducts' => $wishlistProducts
        ]);
    }

    public function toggle(Request $request, $productId)
    {
        try {

            $user = Auth::user();

            if (!$user) {
                if ($request->wantsJson() || $request->header('X-Inertia')) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Please login to manage wishlist'
                    ], 401);
                }
                return redirect()->back()->withErrors(['message' => 'Please login to manage wishlist']);
            }

            // Find the product
            $product = Products::find($productId);


            if (!$product) {
                $errorMessage = 'Product not found';

                if ($request->wantsJson() || $request->header('X-Inertia')) {
                    return response()->json([
                        'success' => false,
                        'message' => $errorMessage
                    ], 404);
                }
                return redirect()->back()->withErrors(['message' => $errorMessage]);
            }

            // Check if item exists in wishlist
            $wishlistItem = Wishlist::where('user_id', $user->id)
                ->where('product_id', $productId)
                ->first();



            if ($wishlistItem) {
                // Remove from wishlist
                $wishlistItem->delete();
                $message = 'Product removed from wishlist';

            } else {
                // Add to wishlist
                Wishlist::create([
                    'user_id' => $user->id,
                    'product_id' => $productId
                ]);
                $message = 'Product added to wishlist';

            }

            // For Inertia requests
            if ($request->header('X-Inertia')) {

                return redirect()->back()->with('success', $message);
            }


            return redirect()->back()->with('success', $message);

        } catch (\Exception) {

            $errorMessage = 'Failed to update wishlist';

            if ($request->header('X-Inertia')) {
                return redirect()->back()->withErrors(['message' => $errorMessage]);
            }

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $errorMessage
                ], 500);
            }

            return redirect()->back()->withErrors(['message' => $errorMessage]);
        }
    }


    public function check($productId)
    {
        try {
            $isInWishlist = false;

            if (Auth::check()) {
                $isInWishlist = Wishlist::where('user_id', Auth::id())
                    ->where('product_id', $productId)
                    ->exists();
            }

            return response()->json([
                'success' => true,
                'isInWishlist' => $isInWishlist
            ]);
        } catch (\Exception) {

            return response()->json([
                'success' => false,
                'isInWishlist' => false,
                'message' => 'Error checking wishlist status'
            ], 500);
        }
    }
}
