<?php

namespace App\Http\Controllers;

use App\Models\wishlist;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function privacypolicy()
    {
        $wishlist = wishlist::where('user_id', auth()->id())->paginate(12);
        return Inertia::render('privacypolicy/index', [
            'wishlist' => $wishlist
        ]);
    }

    public function termsandconditions()
    {
        $wishlist = wishlist::where('user_id', auth()->id())->paginate(12);
        return Inertia::render('termscondition/index', [
            'wishlist' => $wishlist
        ]);
    }
}
