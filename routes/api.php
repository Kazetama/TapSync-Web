<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Registration\SiswaController;

Route::get('/test', function() {
    return response()->json([
        'message' => 'Bisa Cuy Yakali Gak Bisa!',
    ]);
});

Route::post('/siswas', [SiswaController::class, 'store']);
