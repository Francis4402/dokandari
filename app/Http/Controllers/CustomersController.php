<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\wishlist;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomersController extends Controller
{
    public function index() {
        $users = User::all();

        return Inertia::render('dashboard/customers/index', [
            'customers' => $users,
        ]);
    }

    public function cartPage()
    {
        $user = Auth::user();
        $wishlist = wishlist::where('user_id', auth()->id())->paginate(12);
        return Inertia::render('cartpage/index', [
            'auth' => ['user' => $user],
            'wishlist' => $wishlist
        ]);
    }
}
