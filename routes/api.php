<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Registration\SiswaController;
use App\Http\Controllers\Api\RfidScanController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'Bisa Cuy Yakali Gak Bisa!',
    ]);
});

Route::post('/siswas', [SiswaController::class, 'store']);

// RFID Scanning Routes
Route::post('/rfid/scan', [RfidScanController::class, 'scan']);
Route::get('/rfid/latest', [RfidScanController::class, 'latest']);
Route::get('/rfid/status', [RfidScanController::class, 'status']);
Route::post('/rfid/heartbeat', [RfidScanController::class, 'heartbeat']);
