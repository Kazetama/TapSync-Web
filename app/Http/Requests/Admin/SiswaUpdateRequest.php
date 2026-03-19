<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
class SiswaUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $siswaId = $this->route('siswa')->id;

        return [
            'rfid_uid' => 'nullable|string|max:255|unique:siswas,rfid_uid,' . $siswaId,
            'nis' => 'required|string|max:255|unique:siswas,nis,' . $siswaId,
            'nama' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:L,P',
            'kelas' => 'required|string|max:255',
            'jurusan' => 'required|string|max:255',
            'angkatan' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'no_hp_siswa' => 'nullable|string|max:20',
            'no_hp_ortu' => 'nullable|string|max:20',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', 
            'is_active' => 'boolean',
        ];
    }
}