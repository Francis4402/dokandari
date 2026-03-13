<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Http\Requests\UpdateReviewRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;


class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
            $request->validate([
                'product_id' => 'required|exists:products,id',
            ]);

            $userId = Auth::id();

            // Check if user has already reviewed this product
            $existingReview = Review::where('user_id', $userId)
                ->where('product_id', $request->product_id)
                ->first();

            if ($userId && $existingReview) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already reviewed this product',
                    'reviewed' => true,
                    'count' => Review::where('product_id', $request->product_id)->count(),
                ], 400);
            }

            // Create new review
            Review::create([
                'product_id' => $request->product_id,
                'user_id'    => $userId,
            ]);

            $message = $userId ? 'Product reviewed successfully' : 'Product reviewed as guest';

            $count = Review::where('product_id', $request->product_id)->count();

            return response()->json([
                'success'  => true,
                'message'  => $message,
                'reviewed' => true,
                'count'    => $count,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error processing review: ' . $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show()
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Review $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReviewRequest $request, Review $review)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        //
    }
}
