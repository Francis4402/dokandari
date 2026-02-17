<?php

use App\Http\Controllers\PathaoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/pathao/cities', [PathaoController::class, 'cities']);
Route::get('/pathao/zones/{city_id}', [PathaoController::class, 'zones']);
Route::get('/pathao/areas/{zone_id}', [PathaoController::class, 'areas']);

Route::post('/pathao/calculate-price', [PathaoController::class, 'calculatePrice']);

Route::get('/pathao/getpathaostore', [PathaoController::class, 'getStores'])->name('pathao.store');
