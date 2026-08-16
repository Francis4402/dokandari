<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class HandleDomains
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $currentDomain = $request->getHost();

        Inertia::share([
            'currentDomain' => $currentDomain,
            'baseUrl' => $request->getSchemeAndHttpHost(),
        ]);

        return $next($request);
    }
}
