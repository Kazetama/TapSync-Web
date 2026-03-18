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
}