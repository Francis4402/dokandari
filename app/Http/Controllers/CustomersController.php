<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomersController extends Controller
{
    public function index() {
        $users = User::all();

        return Inertia::render('dashboard/customers/index', [
            'customers' => $users
        ]);
    }

    public function cartPage()
    {
        $user = Auth::user();

        return Inertia::render('cartpage/index', [
            'auth' => ['user' => $user]
        ]);
    }
}
