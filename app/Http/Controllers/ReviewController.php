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

            Review::create([
                'product_id' => $request->product_id,
                'user_id' => Auth::id(),
            ]);

            $count = Review::where('product_id', $request->product_id)->count();

            return response()->json([
                'success' => true,
                'message' => 'View recorded',
                'count' => $count,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error recording view: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function status(string $id)
    {
        $count = Review::where('product_id', $id)->count();

        return response()->json([
            'count' => $count,
        ]);
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
