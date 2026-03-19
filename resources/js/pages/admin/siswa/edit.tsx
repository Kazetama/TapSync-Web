import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Siswa } from '@/types/siswa';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

interface EditProps {
    siswa: Siswa;
}

export default function Edit({ siswa }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Manajemen Siswa', href: '/admin/siswa' },
        { title: `Edit: ${siswa.nama}`, href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT', 
        rfid_uid: siswa.rfid_uid || '',
        nis: siswa.nis || '',
        nama: siswa.nama || '',
        jenis_kelamin: siswa.jenis_kelamin || 'L',
        kelas: siswa.kelas || '',
        jurusan: siswa.jurusan || '',
        angkatan: siswa.angkatan || '',
        alamat: siswa.alamat || '',
        no_hp_siswa: siswa.no_hp_siswa || '',
        no_hp_ortu: siswa.no_hp_ortu || '',
        foto: null as File | null, 
        is_active: siswa.is_active,
    });

    const [isScanning, setIsScanning] = useState(false);

    React.useEffect(() => {
        let interval: any;
        if (isScanning) {
            interval = setInterval(async () => {
                try {
                    const response = await fetch('/api/rfid/latest');
                    if (response.ok) {
                        const dataResponse = await response.json();
                        if (dataResponse.success && dataResponse.rfid_uid) {
                            setData('rfid_uid', dataResponse.rfid_uid);
                            setIsScanning(false);
                            clearInterval(interval);
                        }
                    }
                } catch (error) {
                    console.error('Error polling RFID:', error);
                }
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isScanning]);

    const handleScanClick = () => {
        setIsScanning(true);
        // Also clear any previous scan to avoid old data
        // fetch('/api/rfid/clear', { method: 'POST' }); // Optional
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/siswa/${siswa.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Siswa - ${siswa.nama}`} />

            <div className="mx-auto w-full max-w-5xl p-4">
                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900/50 dark:bg-blue-900/10">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100">Kredensial Kartu RFID</h2>
                                <p className="text-sm text-blue-700 dark:text-blue-300">Hubungkan kartu fisik mahasiswa ke sistem TapSync.</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleScanClick}
                                className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition-all ${isScanning ? 'animate-pulse bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {isScanning ? 'Menunggu Tap Kartu...' : 'Scan Kartu Sekarang'}
                            </button>
                        </div>
                        <div className="mt-4">
                            <input
                                id="rfid_uid"
                                type="text"
                                placeholder="Contoh: 046E5A22 (Bisa diketik manual atau via alat)"
                                value={data.rfid_uid}
                                onChange={(e) => {
                                    setData('rfid_uid', e.target.value.toUpperCase());
                                    if(e.target.value) setIsScanning(false);
                                }}
                                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 font-mono text-lg uppercase shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                            />
                            {errors.rfid_uid && <p className="mt-1 text-sm text-red-600">{errors.rfid_uid}</p>}
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">Data Akademik Utama</h2>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nomor Induk Siswa (NIS/NIM)</label>
                                    <input type="text" value={data.nis} onChange={e => setData('nis', e.target.value)} className="w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" />
                                    {errors.nis && <p className="text-sm text-red-600">{errors.nis}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nama Lengkap</label>
                                    <input type="text" value={data.nama} onChange={e => setData('nama', e.target.value)} className="w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" />
                                    {errors.nama && <p className="text-sm text-red-600">{errors.nama}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Jenis Kelamin</label>
                                        <select value={data.jenis_kelamin} onChange={e => setData('jenis_kelamin', e.target.value)} className="w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white">
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Angkatan</label>
                                        <input type="text" value={data.angkatan} onChange={e => setData('angkatan', e.target.value)} className="w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Kelas</label>
                                        <input type="text" value={data.kelas} onChange={e => setData('kelas', e.target.value)} className="w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Jurusan/Prodi</label>
                                        <input type="text" value={data.jurusan} onChange={e => setData('jurusan', e.target.value)} className="w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">Kontak & Alamat</h2>
                                <div className="flex flex-col gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">No. HP Siswa</label>
                                            <input type="text" value={data.no_hp_siswa} onChange={e => setData('no_hp_siswa', e.target.value)} className="w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">No. HP Ortu</label>
                                            <input type="text" value={data.no_hp_ortu} onChange={e => setData('no_hp_ortu', e.target.value)} className="w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Alamat Lengkap</label>
                                        <textarea rows={3} value={data.alamat} onChange={e => setData('alamat', e.target.value)} className="w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="flex flex-col gap-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Update Pas Foto</label>
                                        <div className="flex items-center gap-4">
                                            {siswa.foto && (
                                                <img src={`/storage/${siswa.foto}`} alt="Profile" className="h-16 w-16 rounded-md object-cover shadow-sm" />
                                            )}
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={e => setData('foto', e.target.files ? e.target.files[0] : null)} 
                                                className="block w-full text-sm text-neutral-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-neutral-800 dark:file:text-neutral-300" 
                                            />
                                        </div>
                                        {errors.foto && <p className="mt-1 text-sm text-red-600">{errors.foto}</p>}
                                    </div>

                                    <div className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
                                        <input 
                                            type="checkbox" 
                                            id="is_active" 
                                            checked={data.is_active} 
                                            onChange={e => setData('is_active', e.target.checked)} 
                                            className="h-5 w-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-900"
                                        />
                                        <div>
                                            <label htmlFor="is_active" className="font-medium text-neutral-900 dark:text-white">Status Akun Aktif</label>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Jika dimatikan, kartu RFID akan ditolak oleh alat.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <Link href="/admin/siswa" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                            Batal
                        </Link>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="rounded-md bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan Data'}
                        </button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}