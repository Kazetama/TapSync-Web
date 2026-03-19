import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type SiswaFilters, type SiswaOptions, type SiswaPagination } from '@/types/siswa';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody,TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { Search, FileDown, UserPlus, FilterX, Edit2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Manajemen Siswa', href: '/admin/siswa' },
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
                { preserveState: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [search, kelas, jurusan, angkatan]);

    const resetFilter = () => {
        setSearch('');
        setKelas('');
        setJurusan('');
        setAngkatan('');
    };

    const handleExport = () => {
        const params = new URLSearchParams({ search, kelas, jurusan, angkatan }).toString();
        window.location.href = `/admin/siswa/export?${params}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Siswa" />
            
            <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Database Siswa</h1>
                        <p className="text-sm text-muted-foreground">Kelola data murid, foto, dan integrasi kartu RFID.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handleExport} className="hidden sm:flex items-center gap-2">
                            <FileDown className="h-4 w-4" /> Export Excel
                        </Button>
                    </div>
                </div>

                <Card className="border-none bg-muted/30 shadow-none">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                            <div className="relative md:col-span-4">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari NIS atau nama..."
                                    className="pl-9 bg-white dark:bg-neutral-950"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            
                            <div className="md:col-span-2">
                                <Select value={kelas || "all"} onValueChange={(val) => setKelas(val === "all" ? "" : val)}>
                                    <SelectTrigger className="bg-white dark:bg-neutral-950">
                                        <SelectValue placeholder="Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kelas</SelectItem>
                                        {options.kelas.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-3">
                                <Select value={jurusan || "all"} onValueChange={(val) => setJurusan(val === "all" ? "" : val)}>
                                    <SelectTrigger className="bg-white dark:bg-neutral-950">
                                        <SelectValue placeholder="Jurusan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Jurusan</SelectItem>
                                        {options.jurusan.map((j) => <SelectItem key={j} value={j}>{j}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-2">
                                <Select value={angkatan || "all"} onValueChange={(val) => setAngkatan(val === "all" ? "" : val)}>
                                    <SelectTrigger className="bg-white dark:bg-neutral-950">
                                        <SelectValue placeholder="Angkatan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Angkatan</SelectItem>
                                        {options.angkatan.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-1">
                                <Button variant="ghost" size="icon" onClick={resetFilter} title="Reset Filter">
                                    <FilterX className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[80px] text-center">Profil</TableHead>
                                <TableHead className="font-semibold">NIS</TableHead>
                                <TableHead className="font-semibold">Nama Lengkap</TableHead>
                                <TableHead className="font-semibold">Kelas & Jurusan</TableHead>
                                <TableHead className="font-semibold">RFID Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {siswas.data.length > 0 ? (
                                siswas.data.map((siswa) => (
                                    <TableRow key={siswa.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="flex justify-center">
                                            <Avatar className="h-10 w-10 border">
                                                <AvatarImage src={`/storage/${siswa.foto}`} alt={siswa.nama} />
                                                <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                    {siswa.nama.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{siswa.nis}</TableCell>
                                        <TableCell className="font-medium">{siswa.nama}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">Kelas {siswa.kelas}</div>
                                            <div className="text-xs text-muted-foreground uppercase">{siswa.jurusan}</div>
                                        </TableCell>
                                        <TableCell>
                                            {siswa.rfid_uid ? (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                                    <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-600"></span>
                                                    Terhubung
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                                                    Belum Registrasi
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/admin/siswa/${siswa.id}/edit`} className="flex items-center gap-2">
                                                    <Edit2 className="h-3 w-3" /> Edit
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        Data siswa tidak ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </AppLayout>
    );
}