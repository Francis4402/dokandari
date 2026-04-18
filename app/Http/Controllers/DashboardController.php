<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use App\Models\Products;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index() {

        $orders = Orders::get();

        $totalUsers = User::count();

        return Inertia::render('dashboard/DashboardHome', [
            'totalUsers' => $totalUsers,
            'orders' => $orders
        ]);
    }

}
