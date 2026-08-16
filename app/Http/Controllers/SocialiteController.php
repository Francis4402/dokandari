<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
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

    public function googleAuthentication(Request $request)
    {
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
            } else if (!$user->google_id) {
                $user->update(['google_id' => $googleUser->id]);
            }

            Auth::login($user);

            $request->session()->regenerate();

            return redirect()->intended('/');

        } catch (\Exception $e) {
            Log::error('Google Login Error: ' . $e->getMessage());

            return redirect('/')
                ->with('error', 'Google authentication failed. Please try again.');
        }
    }
}
