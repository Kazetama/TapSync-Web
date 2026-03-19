<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/absensi/papan', function () {
    return Inertia::render('attendance-board');
})->name('absensi.papan');

Route::middleware(['auth', 'user'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/web/superadmin.php';
require __DIR__.'/web/admin.php';
