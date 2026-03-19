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

        // Attendance
        Route::get('absensi', [\App\Http\Controllers\Admin\Attendance\AttendanceControllers::class, 'index'])->name('absensi.index');
        Route::get('absensi/settings', [\App\Http\Controllers\Admin\Attendance\AttendanceControllers::class, 'settings'])->name('absensi.settings');
        Route::post('absensi/settings', [\App\Http\Controllers\Admin\Attendance\AttendanceControllers::class, 'updateSettings'])->name('absensi.settings.update');
    });
