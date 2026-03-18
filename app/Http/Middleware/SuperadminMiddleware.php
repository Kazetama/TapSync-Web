<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SuperadminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        if ($user->usertype !== 'superadmin') {
            return redirect()->route(
                match ($user->usertype) {
                    'admin' => 'admin.dashboard',
                    'user' => 'dashboard',
                    default => 'dashboard',
                }
            );
        }

        return $next($request);
    }
}
