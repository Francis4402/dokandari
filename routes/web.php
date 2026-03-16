<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MessagesController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\SocialiteController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\TrackOrderController;
use App\Http\Controllers\WishlistController;
use App\Models\Categories;
use App\Models\Comment;
use App\Models\Products;
use App\Models\Review;
use App\Models\wishlist;
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
    $categories = Categories::all();
    $products = Products::with('store')
            ->orderBy('created_at', 'desc')
            ->paginate(20);
    $reviews = Review::all();
    $wishlist = Wishlist::where('user_id', auth()->id())->paginate(12);


    $productIds = $products->pluck('id')->toArray();

    // Get ratings for all products
    $ratings = Comment::whereIn('product_id', $productIds)
        ->whereNotNull('rating')
        ->select('product_id', 'rating')
        ->get();

    $productRatings = [];
    foreach ($products as $product) {
        $productRatingData = $ratings->where('product_id', $product->id);
        $averageRating = $productRatingData->avg('rating') ?? 0;
        $ratingCount = $productRatingData->count();

        $productRatings[$product->id] = [
            'average' => round($averageRating, 1),
            'count' => $ratingCount
        ];
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'categories' => $categories,
        'products' => $products,
        'wishlist' => $wishlist,
        'productRatings' => $productRatings,
        'reviews' => $reviews,
    ]);
});

Route::middleware(['auth', 'role:superadmin'])->group(function () {
    Route::get('/dashboard/categories', [CategoriesController::class, 'index'])->name('dashboard.categories');
    Route::post('/dashboard/categories', [CategoriesController::class, 'store'])->name('dashboard.storecategory');
    Route::delete('/dashboard/categories/{id}', [CategoriesController::class, 'destroy'])->name('dashboard.deletecategory');
    Route::get('/dashboard/customers', [CustomersController::class, 'index'])->name('dashboard.customers');
    Route::put('/dashboard/categories/update/{id}', [CategoriesController::class, 'update'])->name('dashboard.updatecategory');

    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy'])
    ->name('contacts.destroy');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/dashboard/categories', [CategoriesController::class, 'index'])->name('dashboard.categories');
    Route::post('/dashboard/categories', [CategoriesController::class, 'store'])->name('dashboard.storecategory');
    Route::delete('/dashboard/categories/{id}', [CategoriesController::class, 'destroy'])->name('dashboard.deletecategory');
    Route::get('/dashboard/customers', [CustomersController::class, 'index'])->name('dashboard.customers');
    Route::put('/dashboard/categories/update/{id}', [CategoriesController::class, 'update'])->name('dashboard.updatecategory');

    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy'])
    ->name('contacts.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/products', [ProductsController::class, 'index'])->name('dashboard.products');

    Route::get('/dashboard/stores', [StoreController::class, 'index'])->name('dashboard.store');
    Route::get('/dashboard/orders', [OrdersController::class, 'dashboardIndex'])->name('dashboard.orders');
    Route::get('/dashboard/shipping', [ShippingController::class, 'index'])->name('dashboard.shipping');
    Route::get('/dashboard/payments', [PaymentController::class, 'index'])->name('dashboard.payment');

    Route::get('/dashboard/messages', [MessagesController::class, 'index'])->name('dashboard.messages');

    Route::get('/contacts/{contact}', [ContactController::class, 'show'])->name('contacts.show');

    Route::post('/contacts/{contact}/read', [ContactController::class, 'markSingleAsRead'])
    ->name('contacts.mark-single-read');

    Route::post('/contacts/{contact}/star', [ContactController::class, 'toggleStar'])
    ->name('contacts.toggle-star');


    Route::get('/dashboard/analytics', [AnalyticsController::class, 'index'])->name('dashboard.analytics');


    Route::get('/dashboard/products/productform', [ProductsController::class, 'create'])->name('dashboard.createproduct');
    Route::get('/dashboard/stores/storeform', [StoreController::class, 'create'])->name('dashboard.createstore');

    Route::post('/dashboard/products/store', [ProductsController::class, 'store'])->name('products.store');
    Route::delete('/dashboard/products/{id}', [ProductsController::class, 'destroy'])->name('dashboard.deleteproduct');

    Route::post('/dashboard/stores/store', [StoreController::class, 'store'])->name('stores.store');
    Route::delete('/dashboard/store/{id}', [StoreController::class, 'destroy'])->name('dashboard.deletestore');

    Route::get('/dashboard/products/{id}/edit', [ProductsController::class, 'edit'])->name('dashboard.productedit');
    Route::put('/dashboard/products/update/{slug}', [ProductsController::class, 'update'])->name('dashboard.updateproduct');

    Route::get('/dashboard/store/{name}/edit', [StoreController::class, 'edit'])->name('dashboard.storeedit');
    Route::put('/dashboard/store/update/{store}', [StoreController::class, 'update'])->name('dashboard.storeupdate');

    Route::get('/checkout', [OrdersController::class, 'checkout'])->name('checkout');

    Route::post('/orders', [OrdersController::class, 'store'])->name('orders.store');

    Route::get('/orders/{order}/confirmation', [OrdersController::class, 'confirmation'])->name('orders.confirmation');

    Route::get('/orders/{order}', [OrdersController::class, 'show'])->name('orders.show');

    Route::delete('/dashboard/orders/{id}', [OrdersController::class, 'destroy'])->name('orders.delete');

    Route::post('/post/contact', [ContactController::class, 'store'])->name('contact.store');

    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');

    Route::post('/wishlist/toggle/{product}', [WishlistController::class, 'toggle'])->name('wishlist.toggle');

    Route::get('/wishlist/check/{product}', [WishlistController::class, 'check'])->name('wishlist.check');

    Route::post('/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::put('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
});



Route::get('/stores', [StoreController::class, 'storeroute'])->name('stores.index');
Route::get('/stores/{id}', [StoreController::class, 'show'])->name('stores.show');

Route::get('/track-order', [TrackOrderController::class, 'index'])->name('trackorder.index');
Route::get('/contactus', [ContactController::class, 'index'])->name('contact.index');
Route::get('/products', [ProductsController::class, 'products'])->name('products.index');

Route::get('/products/{id}', [ProductsController::class, 'show'])->name('products.details');

Route::get('/cart', [CustomersController::class, 'cartpage'])->name('cart.index');

Route::get('/products/{product}/comments', [CommentController::class, 'getProductComments']);

Route::get('/hotdeals', [ProductsController::class, 'hotdeals'])->name('products.hotdeals');

Route::controller(SocialiteController::class)->group(function () {
    Route::get('/auth/google', 'redirectToGoogle')->name('auth.google');
    Route::get('/auth/google-callback', 'googleAuthentication')->name('auth.google-callback');
});


Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');


// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
