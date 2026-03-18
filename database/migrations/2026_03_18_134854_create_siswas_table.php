<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('siswas', function (Blueprint $table) {
            $table->id();

            // Data IoT - Tetap Wajib (Sesuai Permintaan)
            $table->string('rfid_uid')->unique();

            // Data Akademik Utama - Sekarang Nullable
            $table->string('nis')->unique()->nullable();
            $table->string('nama')->nullable();
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable();
            $table->string('kelas')->nullable();
            $table->string('jurusan')->nullable();
            $table->string('angkatan')->nullable();

            // Data Kontak & Alamat - Nullable
            $table->text('alamat')->nullable();
            $table->string('no_hp_siswa')->nullable();
            $table->string('no_hp_ortu')->nullable();

            // Media & Status - Nullable
            $table->string('foto')->nullable();
            $table->boolean('is_active')->default(true)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswas');
    }
};