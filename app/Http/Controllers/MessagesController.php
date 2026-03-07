<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessagesController extends Controller
{
    public function index(Request $request) {
        $query = Contact::query();

        if ($request->filter === 'unread') {
            $query->where('is_read', false);
        } elseif ($request->filter === 'starred') {
            $query->where('is_starred', true);
        }

        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('subject', 'like', "%{$search}%")
                ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $contacts = $query->latest()->paginate(20);
        $unreadCount = Contact::where('is_read', false)->count();

        return Inertia::render('dashboard/messages/index', [
            'contacts' => $contacts,
            'unreadCount' => $unreadCount,
            'filters' => $request->only(['filter', 'search']),
        ]);
    }
}
