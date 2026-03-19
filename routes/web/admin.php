<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Siswa\SiswaControllers;
use App\Models\Siswa;
use Inertia\Inertia;

Route::middleware(['auth', 'redirect.usertype', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('admin/dashboard', [
                'totalSiswa' => Siswa::count(),
                'totalLakiLaki' => Siswa::where('jenis_kelamin', 'L')->count(),
                'totalPerempuan' => Siswa::where('jenis_kelamin', 'P')->count(),
            ]);
        })->name('dashboard');

        Route::get('siswa/export', [SiswaControllers::class, 'export'])->name('siswa.export');
        Route::resource('siswa', SiswaControllers::class)->names('siswa');
    });
