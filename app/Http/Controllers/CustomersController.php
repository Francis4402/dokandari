<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomersController extends Controller
{
    public function index() {
        $users = User::all();

        return Inertia::render('dashboard/customers/index', [
            'customers' => $users
        ]);
    }
}
