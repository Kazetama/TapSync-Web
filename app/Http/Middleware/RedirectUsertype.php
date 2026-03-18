<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectUsertype
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        $dashboards = [
            'superadmin' => 'superadmin.dashboard',
            'admin' => 'admin.dashboard',
            'user' => 'dashboard',
        ];

        $usertype = $user->usertype;

        if (! isset($dashboards[$usertype])) {
            return redirect()->route('dashboard');
        }

        $targetRoute = $dashboards[$usertype];

        if ($usertype === 'superadmin') {
            return $next($request);
        }

        $restrictedPaths = match ($usertype) {
            'admin' => ['superadmin/*'],
            'user' => ['admin/*', 'superadmin/*'],
            default => [],
        };

        foreach ($restrictedPaths as $path) {
            if ($request->is($path)) {

                if ($request->routeIs($targetRoute)) {
                    break;
                }

                return redirect()->route($targetRoute);
            }
        }

        return $next($request);
    }
}
