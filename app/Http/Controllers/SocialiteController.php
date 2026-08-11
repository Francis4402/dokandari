<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;


class SocialiteController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function googleAuthentication() {

        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('google_id', $googleUser->id)
                        ->orWhere('email', $googleUser->email)
                        ->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'images' => $googleUser->getAvatar(),
                    'google_id' => $googleUser->id,
                    'password' => Hash::make(uniqid()),
                ]);
            }

            Auth::login($user);

            return redirect('/');
        } catch (\Exception $e) {

            Log::error('Google Login Error: ' . $e->getMessage());

            return redirect('/')
                ->with('error', 'Google authentication failed. Please try again.');
        }

    }
}
