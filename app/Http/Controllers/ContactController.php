<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateContactRequest;
use App\Models\wishlist;
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
            'name' => 'required|string|max:40',
            'email' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:400',
        ]);

        $contact = new Contact();

        $contact = Contact::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'is_read' => false,
            'is_starred' => false,
        ]);


        $contact->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        // Mark as read when viewed
        if (!$contact->is_read) {
            $contact->update([
                'is_read' => true,
                'read_at' => now()
            ]);
        }

        return Inertia::render('ContactUs/Show', [
            'contact' => $contact
        ]);
    }

    public function toggleRead(Contact $contact)
    {
        $contact->update([
            'is_read' => !$contact->is_read,
            'read_at' => !$contact->is_read ? now() : null
        ]);

        return redirect()->back()->with('success', 'Read status updated');
    }

    public function toggleStar(Contact $contact)
    {
        $contact->update([
            'is_starred' => !$contact->is_starred
        ]);

        return redirect()->back()->with('success', 'Star status updated');
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

        return redirect()->back()->with('success', 'Messages marked as unread');
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

        return $contact;
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:contacts,id'
        ]);

        Contact::whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', 'Contacts deleted successfully');
    }
}
