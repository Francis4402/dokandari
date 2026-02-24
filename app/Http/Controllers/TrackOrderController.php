<?php

namespace App\Http\Controllers;

use App\Models\TrackOrder;
use App\Http\Requests\StoreTrackOrderRequest;
use App\Http\Requests\UpdateTrackOrderRequest;
use App\Models\wishlist;
use Inertia\Inertia;

class TrackOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $wishlist = wishlist::where('user_id', auth()->id())->paginate(12);
        return Inertia::render('trackorders/index', [
            'wishlist' => $wishlist
        ]);
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
    public function store(StoreTrackOrderRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TrackOrder $trackOrder)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TrackOrder $trackOrder)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTrackOrderRequest $request, TrackOrder $trackOrder)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TrackOrder $trackOrder)
    {
        //
    }
}
