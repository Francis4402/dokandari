<?php

namespace App\Http\Controllers;

use App\Models\ReplayMessages;
use App\Http\Requests\StoreReplayMessagesRequest;
use App\Http\Requests\UpdateReplayMessagesRequest;
use Illuminate\Support\Facades\Auth;

class ReplayMessagesController extends Controller
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
    public function store(StoreReplayMessagesRequest $request)
    {
        $request->validate([
            'contact_id' => 'required|exists:contacts,id',
            'message' => 'required|string'
        ]);

        $reply = ReplayMessages::create([
            'user_id' => Auth::id(),
            'contact_id' => $request->contact_id,
            'message' => $request->message
        ]);


        $reply->load('user');


        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'reply' => $reply,
                'message' => 'Reply sent successfully'
            ]);
        }

        return back()->with('success', 'Reply sent successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(ReplayMessages $replayMessages)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ReplayMessages $replayMessages)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReplayMessagesRequest $request, ReplayMessages $replayMessages)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ReplayMessages $replayMessages)
    {
        //
    }
}
