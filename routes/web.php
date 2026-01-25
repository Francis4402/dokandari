<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MessagesController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\StoreController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/products', [ProductsController::class, 'index'])->name('dashboard.products');
    Route::get('/dashboard/categories', [CategoriesController::class, 'index'])->name('dashboard.categories');
    Route::get('/dashboard/stores', [StoreController::class, 'index'])->name('dashboard.store');
    Route::get('/dashboard/orders', [OrdersController::class, 'index'])->name('dashboard.orders');
    Route::get('/dashboard/customers', [CustomersController::class, 'index'])->name('dashboard.customers');
    Route::get('/dashboard/shipping', [ShippingController::class, 'index'])->name('dashboard.shipping');
    Route::get('/dashboard/payments', [PaymentController::class, 'index'])->name('dashboard.payment');
    Route::get('/dashboard/messages', [MessagesController::class, 'index'])->name('dashboard.messages');
    Route::get('/dashboard/analytics', [AnalyticsController::class, 'index'])->name('dashboard.analytics');

    Route::get('/dashboard/products/productform', [ProductsController::class, 'create'])->name('dashboard.createproduct');
    Route::get('/dashboard/stores/storeform', [StoreController::class, 'create'])->name('dashboard.createstore');
});



// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
