<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Siswa\SiswaControllers;
use Inertia\Inertia;

Route::middleware(['auth', 'redirect.usertype', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');

        Route::get('siswa/export', [SiswaControllers::class, 'export'])->name('siswa.export');
        Route::resource('siswa', SiswaControllers::class)->names('siswa');
    });
