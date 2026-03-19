<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttendanceSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            'absen_masuk_mulai' => '06:00',
            'absen_masuk_batas' => '07:15',
            'absen_masuk_selesai' => '08:30',
            'absen_pulang_mulai' => '15:00',
            'absen_pulang_selesai' => '17:00',
        ];

        foreach ($settings as $key => $value) {
            \App\Models\Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
