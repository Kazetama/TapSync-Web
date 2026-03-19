<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\Setting;
use App\Models\Siswa;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AttendanceController extends Controller
{
    public function scan(Request $request)
    {
        $uid = $request->input('uid');

        if (!$uid) {
            return response()->json(['success' => false, 'message' => 'UID required'], 400);
        }

        $siswa = Siswa::where('rfid_uid', $uid)->first();

        if (!$siswa) {
            return response()->json(['success' => false, 'message' => 'Kartu tidak terdaftar'], 404);
        }

        if (!$siswa->is_active) {
            return response()->json(['success' => false, 'message' => 'Akun siswa tidak aktif'], 403);
        }

        $now = Carbon::now();
        $today = $now->toDateString();
        $currentTime = $now->toTimeString();

        $settings = Setting::all()->pluck('value', 'key');

        // Defaults to have these keys available if seeder didn't run properly
        $masukMulai = $settings['absen_masuk_mulai'] ?? '06:00';
        $masukBatas = $settings['absen_masuk_batas'] ?? '07:15';
        $masukSelesai = $settings['absen_masuk_selesai'] ?? '08:30';
        $pulangMulai = $settings['absen_pulang_mulai'] ?? '15:00';
        $pulangSelesai = $settings['absen_pulang_selesai'] ?? '17:00';

        $isCheckInTime = $currentTime >= $masukMulai && $currentTime <= $masukSelesai;
        $isCheckOutTime = $currentTime >= $pulangMulai && $currentTime <= $pulangSelesai;

        $absensi = Absensi::firstOrNew([
            'siswa_id' => $siswa->id,
            'tanggal' => $today,
        ]);

        if ($isCheckInTime) {
            if ($absensi->jam_masuk) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sudah absen masuk',
                    'nama' => $siswa->nama
                ]);
            }

            $status = ($currentTime <= $masukBatas) ? 'Tepat Waktu' : 'Terlambat';
            $absensi->jam_masuk = $currentTime;
            $absensi->status_masuk = $status;
            $absensi->save();

            $attendanceData = [
                'nama' => $siswa->nama,
                'foto' => $siswa->foto ? asset('storage/' . $siswa->foto) : null,
                'kelas' => $siswa->kelas,
                'jurusan' => $siswa->jurusan,
                'status' => $status,
                'waktu' => $currentTime,
                'type' => 'MASUK',
                'timestamp' => now()->timestamp
            ];
            Cache::put('latest_attendance', $attendanceData, 60);

            return response()->json([
                'success' => true,
                'message' => 'Absen Masuk: ' . $status,
                'nama' => $siswa->nama,
                'status' => $status,
                'time' => $currentTime
            ]);
        }

        if ($isCheckOutTime) {
            if ($absensi->jam_pulang) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sudah absen pulang',
                    'nama' => $siswa->nama
                ]);
            }

            $absensi->jam_pulang = $currentTime;
            $absensi->status_pulang = 'Hadir';
            $absensi->save();

            $attendanceData = [
                'nama' => $siswa->nama,
                'foto' => $siswa->foto ? asset('storage/' . $siswa->foto) : null,
                'kelas' => $siswa->kelas,
                'jurusan' => $siswa->jurusan,
                'status' => 'Hadir',
                'waktu' => $currentTime,
                'type' => 'PULANG',
                'timestamp' => now()->timestamp
            ];
            Cache::put('latest_attendance', $attendanceData, 60);

            return response()->json([
                'success' => true,
                'message' => 'Absen Pulang Berhasil',
                'nama' => $siswa->nama,
                'time' => $currentTime
            ]);
        }

        if ($currentTime > $pulangSelesai) {
             return response()->json([
                'success' => false,
                'message' => 'Waktu absen berakhir',
                'nama' => $siswa->nama
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => 'Bukan waktunya absen',
            'nama' => $siswa->nama
        ]);
    }

    public function latest()
    {
        $data = Cache::get('latest_attendance');
        if (!$data) {
            return response()->json(['success' => false, 'message' => 'No recent attendance'], 404);
        }
        return response()->json(['success' => true, 'data' => $data]);
    }
}
