<?php

namespace App\Http\Controllers\Api\Registration;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Exception;

class SiswaController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'rfid_uid' => ['required', 'string', 'min:4', 'max:50', 'unique:siswas,rfid_uid'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal, RFID mungkin sudah terdaftar.',
                'errors'  => $validator->errors()
            ], 422);
        }

        // Store in cache for polling (in case student edit is open)
        Cache::put('last_rfid_tap', $request->rfid_uid, 60);

        DB::beginTransaction();
        try {
            $siswa = Siswa::create([
                'rfid_uid'  => $request->rfid_uid,
                'nama'      => 'Siswa Baru', 
                'is_active' => true,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Kartu RFID berhasil didaftarkan.',
                'data'    => [
                    'id'       => $siswa->id,
                    'rfid_uid' => $siswa->rfid_uid,
                    'status'   => $siswa->is_active ? 'Aktif' : 'Non-Aktif',
                    'created_at' => $siswa->created_at->format('Y-m-d H:i:s'),
                ]
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Error saat registrasi RFID: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan internal server.',
                'error'   => config('app.debug') ? $e->getMessage() : 'Internal Error'
            ], 500);
        }
    }
}