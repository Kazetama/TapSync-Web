<?php

namespace App\Http\Controllers\Admin\Attendance;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceControllers extends Controller
{
    public function index(Request $request)
    {
        $query = Absensi::with('siswa')->orderBy('tanggal', 'desc')->orderBy('jam_masuk', 'desc');

        if ($request->has('tanggal')) {
            $query->where('tanggal', $request->tanggal);
        } else {
            // Default to today
            $query->where('tanggal', now()->toDateString());
        }

        return Inertia::render('admin/absensi/index', [
            'logs' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only(['tanggal']),
        ]);
    }

    public function settings()
    {
        $settings = Setting::all()->pluck('value', 'key');
        
        return Inertia::render('admin/absensi/settings', [
            'settings' => $settings
        ]);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'absen_masuk_mulai' => 'required',
            'absen_masuk_batas' => 'required',
            'absen_masuk_selesai' => 'required',
            'absen_pulang_mulai' => 'required',
            'absen_pulang_selesai' => 'required',
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return back()->with('success', 'Pengaturan absensi berhasil diperbarui');
    }
}
