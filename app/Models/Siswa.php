<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    use HasFactory;
    
    protected $table = 'siswas';

    protected $fillable = [
        'rfid_uid',
        'nis',
        'nama',
        'jenis_kelamin',
        'kelas',
        'jurusan',
        'angkatan',
        'alamat',
        'no_hp_siswa',
        'no_hp_ortu',
        'foto',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%");
            });
        })
        ->when($filters['kelas'] ?? null, function ($query, $kelas) {
            $query->where('kelas', $kelas);
        })
        ->when($filters['jurusan'] ?? null, function ($query, $jurusan) {
            $query->where('jurusan', $jurusan);
        })
        ->when($filters['angkatan'] ?? null, function ($query, $angkatan) {
            $query->where('angkatan', $angkatan);
        });
    }

    public function setRfidUidAttribute($value)
    {
        $this->attributes['rfid_uid'] = $value ? strtoupper($value) : null;
    }
}