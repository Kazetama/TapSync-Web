import { Head, Link, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type AbsensiPagination } from '@/types/absensi';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Data Absensi', href: '/admin/absensi' },
];

interface IndexProps {
    logs: AbsensiPagination;
    filters: {
        tanggal?: string;
    };
}

export default function Index({ logs, filters }: IndexProps) {
    const [tanggal, setTanggal] = useState(filters.tanggal || new Date().toISOString().split('T')[0]);

    useEffect(() => {
        router.get(
            '/admin/absensi',
            { tanggal },
            { preserveState: true, replace: true }
        );
    }, [tanggal]);

    const getStatusVariant = (status: string | null) => {
        if (status === 'Tepat Waktu' || status === 'Hadir') return 'default';
        if (status === 'Terlambat') return 'destructive';
        return 'secondary';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Absensi Siswa" />

            <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Riwayat Kehadiran</h1>
                        <p className="text-sm text-muted-foreground">Monitor absensi masuk dan pulang siswa secara real-time.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input 
                                type="date" 
                                className="pl-9 w-[180px]" 
                                value={tanggal} 
                                onChange={e => setTanggal(e.target.value)} 
                            />
                        </div>
                    </div>
                </div>

                <Card className="overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-semibold">Siswa</TableHead>
                                <TableHead className="font-semibold text-center">Tanggal</TableHead>
                                <TableHead className="font-semibold text-center">Jam Masuk</TableHead>
                                <TableHead className="font-semibold text-center">Status Masuk</TableHead>
                                <TableHead className="font-semibold text-center">Jam Pulang</TableHead>
                                <TableHead className="font-semibold text-center">Status Pulang</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.data.length > 0 ? (
                                logs.data.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{log.siswa?.nama}</div>
                                                    <div className="text-xs text-muted-foreground">NIS: {log.siswa?.nis}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center text-sm">{log.tanggal}</TableCell>
                                        <TableCell className="text-center">
                                            {log.jam_masuk ? (
                                                <div className="flex items-center justify-center gap-1 text-sm">
                                                    <Clock className="h-3 w-3 text-muted-foreground" /> {log.jam_masuk.substring(0, 5)}
                                                </div>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {log.status_masuk ? (
                                                <Badge variant={getStatusVariant(log.status_masuk)} className="text-[10px] px-2 py-0">
                                                    {log.status_masuk}
                                                </Badge>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {log.jam_pulang ? (
                                                <div className="flex items-center justify-center gap-1 text-sm">
                                                    <Clock className="h-3 w-3 text-muted-foreground" /> {log.jam_pulang.substring(0, 5)}
                                                </div>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {log.status_pulang ? (
                                                <Badge variant="outline" className="text-[10px] px-2 py-0 border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                                    Hadir
                                                </Badge>
                                            ) : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        Tidak ada data absensi untuk tanggal ini.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* Simple Pagination Control Area */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Menampilkan {logs.data.length} dari {logs.total} data</p>
                    <div className="flex gap-2">
                        {logs.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                asChild={!!link.url}
                                disabled={!link.url}
                            >
                                {link.url ? (
                                    <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ) : (
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                )}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
