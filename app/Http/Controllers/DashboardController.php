<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index() {

        $ordersAll = Orders::get();

        $totalUsers = User::count();

        return Inertia::render('dashboard/DashboardHome', [
            'totalUsers' => $totalUsers,
            'orders' => $ordersAll
        ]);
    }

}
