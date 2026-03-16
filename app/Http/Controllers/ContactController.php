<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateContactRequest;
use App\Models\wishlist;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $wishlist = wishlist::where('user_id', auth()->id())->paginate(12);
        return Inertia::render('contactus/index', [
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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:40',
            'email'   => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:400',
        ]);

        try {
            $contact = Contact::create([
                'user_id'    => Auth::id(),
                'name'       => $validated['name'],
                'email'      => $validated['email'],
                'subject'    => $validated['subject'],
                'message'    => $validated['message'],
                'is_read'    => false,
                'is_starred' => false,
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Message sent successfully!',
                    'contact' => $contact,
                ]);
            }

            return redirect()->back()->with('success', 'Message sent successfully!');

        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send message: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to send message');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        if (!$contact->is_read) {
            $contact->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

            $contact->refresh();
        }

        return Inertia::render('ContactUs/Show', [
            'contact' => $contact,
        ]);
    }

    public function toggleRead(Contact $contact)
    {
        $contact->update([
            'is_read' => !$contact->is_read,
            'read_at' => !$contact->is_read ? now() : null
        ]);

        return redirect()->back();
    }

    public function toggleStar(Contact $contact)
    {
        $contact->update([
            'is_starred' => !$contact->is_starred
        ]);

        return redirect()->back();
    }

    public function markSingleAsRead(Contact $contact)
    {
        $contact->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return redirect()->back();
    }

    public function markAsRead(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contacts,id'
        ]);

        Contact::whereIn('id', $request->ids)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);

        return redirect()->back()->with('success', 'Messages marked as read');
    }

    public function markAsUnread(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contacts,id'
        ]);

        Contact::whereIn('id', $request->ids)
            ->update([
                'is_read' => false,
                'read_at' => null
            ]);

        return redirect()->back();
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Contact $contact)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContactRequest $request, Contact $contact)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        $contact->delete();

        return redirect()->back();
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contacts,id'
        ]);

        Contact::whereIn('id', $request->ids)->delete();

        return redirect()->back();
    }
}
