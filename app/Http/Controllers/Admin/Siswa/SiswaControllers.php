<?php

namespace App\Http\Controllers\Admin\Siswa;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SiswaUpdateRequest; 
use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SiswaControllers extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'kelas', 'jurusan', 'angkatan']);

        $siswas = Siswa::query()
            ->filter($filters) 
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/siswa/index', [
            'siswas' => $siswas,
            'filters' => $filters,
            'options' => [
                'kelas' => Siswa::distinct()->pluck('kelas')->sort()->values(),
                'jurusan' => Siswa::distinct()->pluck('jurusan')->sort()->values(),
                'angkatan' => Siswa::distinct()->pluck('angkatan')->sort()->values(),
            ]
        ]);
    }

    public function export(Request $request)
    {
        $filters = $request->only(['search', 'kelas', 'jurusan', 'angkatan']);
        
        $query = Siswa::query()->filter($filters)->latest();

        $fileName = 'data_siswa_' . date('Y-m-d_His') . '.csv';
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        return response()->stream(function() use ($query) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF)); 

            fputcsv($file, ['NIS', 'Nama Lengkap', 'Jenis Kelamin', 'Kelas', 'Jurusan', 'Angkatan', 'RFID UID', 'No. HP Siswa', 'No. HP Ortu', 'Alamat', 'Status Aktif']);

            $query->chunk(100, function($siswas) use ($file) {
                foreach ($siswas as $siswa) {
                    fputcsv($file, [
                        $siswa->nis, $siswa->nama, $siswa->jenis_kelamin, $siswa->kelas,
                        $siswa->jurusan, $siswa->angkatan, $siswa->rfid_uid, 
                        $siswa->no_hp_siswa, $siswa->no_hp_ortu, $siswa->alamat,
                        $siswa->is_active ? 'Aktif' : 'Tidak Aktif'
                    ]);
                }
            });

            fclose($file);
        }, 200, $headers);
    }

    public function edit(Siswa $siswa)
    {
        return Inertia::render('admin/siswa/edit', [
            'siswa' => $siswa
        ]);
    }
    public function update(SiswaUpdateRequest $request, Siswa $siswa)
    {
        $validated = $request->validated();

        if ($request->hasFile('foto')) {
            if ($siswa->foto) {
                Storage::disk('public')->delete($siswa->foto);
            }
            $validated['foto'] = $request->file('foto')->store('fotos', 'public');
        } else {
            unset($validated['foto']);
        }

        $siswa->update($validated);

        return redirect()->route('admin.siswa.index')->with('success', 'Data siswa dan kartu RFID berhasil diperbarui!');
    }

    public function destroy(Siswa $siswa)
    {
        if ($siswa->foto) {
            Storage::disk('public')->delete($siswa->foto);
        }
        $siswa->delete();

        return redirect()->back()->with('success', 'Data siswa berhasil dihapus!');
    }
}