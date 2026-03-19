import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type SiswaFilters, type SiswaOptions, type SiswaPagination } from '@/types/siswa';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Siswa',
        href: '/admin/siswa',
    },
];

interface IndexProps {
    siswas: SiswaPagination;
    filters: SiswaFilters;
    options: SiswaOptions;
}

export default function Index({ siswas, filters, options }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [kelas, setKelas] = useState(filters.kelas || '');
    const [jurusan, setJurusan] = useState(filters.jurusan || '');
    const [angkatan, setAngkatan] = useState(filters.angkatan || '');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(
                '/admin/siswa',
                { search, kelas, jurusan, angkatan },
                {
                    preserveState: true,
                    replace: true,
                }
            );
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, kelas, jurusan, angkatan]);

    const handleExport = () => {
        const params = new URLSearchParams({ search, kelas, jurusan, angkatan }).toString();
        window.location.href = `/admin/siswa/export?${params}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Siswa" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

                {/* --- BAGIAN BAWAH: TABEL DATA --- */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border bg-white p-6 shadow-sm dark:bg-neutral-900 md:min-h-min">
                    
                    {/* Header Tabel, Search & Tombol Aksi */}
                    <div className="mb-6 space-y-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Daftar Siswa</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleExport}
                                    className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-700 dark:hover:bg-green-600"
                                >
                                    Export Excel
                                </button>
                            </div>
                        </div>

                        {/* Filter Bar */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Cari nama atau NIS..."
                                    className="w-full rounded-md border border-neutral-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:focus:border-neutral-500"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <select
                                className="w-full rounded-md border border-neutral-200 bg-white py-2 px-3 text-sm focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                value={kelas}
                                onChange={(e) => setKelas(e.target.value)}
                            >
                                <option value="">Semua Kelas</option>
                                {options.kelas.map((k) => (
                                    <option key={k} value={k}>{k}</option>
                                ))}
                            </select>

                            <select
                                className="w-full rounded-md border border-neutral-200 bg-white py-2 px-3 text-sm focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                value={jurusan}
                                onChange={(e) => setJurusan(e.target.value)}
                            >
                                <option value="">Semua Jurusan</option>
                                {options.jurusan.map((j) => (
                                    <option key={j} value={j}>{j}</option>
                                ))}
                            </select>

                            <select
                                className="w-full rounded-md border border-neutral-200 bg-white py-2 px-3 text-sm focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                value={angkatan}
                                onChange={(e) => setAngkatan(e.target.value)}
                            >
                                <option value="">Semua Angkatan</option>
                                {options.angkatan.map((a) => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Struktur Tabel */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-neutral-600 dark:text-neutral-300">
                            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                <tr>
                                    {/* 2. Tambahkan Header untuk Foto */}
                                    <th className="px-4 py-3 w-16 text-center">Profil</th> 
                                    <th className="px-4 py-3">NIS</th>
                                    <th className="px-4 py-3">Nama Lengkap</th>
                                    <th className="px-4 py-3">Kelas / Jurusan</th>
                                    <th className="px-4 py-3">Status RFID</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {siswas.data.length > 0 ? (
                                    siswas.data.map((siswa) => (
                                        <tr key={siswa.id} className="border-b border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800/50">
                                            
                                            {/* 3. Render Foto atau Inisial Nama (Fallback) */}
                                            <td className="px-4 py-3">
                                                {siswa.foto ? (
                                                    <img 
                                                        src={`/storage/${siswa.foto}`} 
                                                        alt={`Foto ${siswa.nama}`} 
                                                        className="h-10 w-10 rounded-full object-cover border border-neutral-200 shadow-sm dark:border-neutral-700"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 shadow-sm dark:bg-blue-900/50 dark:text-blue-300">
                                                        {siswa.nama.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">{siswa.nis}</td>
                                            <td className="px-4 py-3">{siswa.nama}</td>
                                            <td className="px-4 py-3">{siswa.kelas} - {siswa.jurusan}</td>
                                            <td className="px-4 py-3">
                                                {siswa.rfid_uid ? (
                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                                        Terhubung
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                                        Belum Ada Kartu
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link href={`/admin/siswa/${siswa.id}/edit`} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Edit</Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        {/* Ubah colSpan dari 5 menjadi 6 karena ada tambahan kolom foto */}
                                        <td colSpan={6} className="py-8 text-center text-neutral-500">
                                            Belum ada data siswa.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                </div>
            </div>
        </AppLayout>
    );
}