<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        if ($user->usertype !== 'admin') {
            return redirect()->route(
                match ($user->usertype) {
                    'superadmin' => 'superadmin.dashboard',
                    'user' => 'dashboard',
                    default => 'dashboard',
                }
            );
        }

        return $next($request);
    }
}
