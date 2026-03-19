import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
    Users, 
    Wifi, 
    WifiOff,
    Venus, 
    Mars, 
    Activity,
    Clock
} from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
];

interface DashboardProps {
    totalSiswa: number;
    totalLakiLaki: number;
    totalPerempuan: number;
}

export default function Dashboard({ totalSiswa, totalLakiLaki, totalPerempuan }: DashboardProps) {
    const [rfidStatus, setRfidStatus] = useState({ is_online: false, last_seen: 'Never' });
    
    const lakiPersen = totalSiswa > 0 ? (totalLakiLaki / totalSiswa) * 100 : 0;
    const perempuanPersen = totalSiswa > 0 ? (totalPerempuan / totalSiswa) * 100 : 0;

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch('/api/rfid/status');
                if (response.ok) {
                    const data = await response.json();
                    setRfidStatus(data);
                }
            } catch (error) {
                console.error('Error fetching RFID status:', error);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            
            <div className="p-6 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                    <p className="text-muted-foreground">Monitoring sistem kartu RFID dan data siswa secara real-time.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="overflow-hidden border-2 transition-all hover:border-primary/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Status Perangkat</CardTitle>
                            {rfidStatus.is_online ? 
                                <Wifi className="h-4 w-4 text-green-500" /> : 
                                <WifiOff className="h-4 w-4 text-red-500" />
                            }
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <div className="text-2xl font-bold">
                                    {rfidStatus.is_online ? 'Sistem Aktif' : 'Terputus'}
                                </div>
                                <Badge variant={rfidStatus.is_online ? "default" : "destructive"} className="animate-pulse">
                                    {rfidStatus.is_online ? 'Live' : 'Offline'}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {rfidStatus.last_seen}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                            <Users className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalSiswa}</div>
                            <p className="text-xs text-muted-foreground">Siswa terdaftar di database</p>
                        </CardContent>
                    </Card>

                    <Card className="transition-all hover:shadow-md border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Laki-laki</CardTitle>
                            <Mars className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalLakiLaki}</div>
                            <Progress value={lakiPersen} className="h-1.5 mt-2 bg-blue-100" />
                        </CardContent>
                    </Card>

                    <Card className="transition-all hover:shadow-md border-l-4 border-l-pink-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Perempuan</CardTitle>
                            <Venus className="h-4 w-4 text-pink-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalPerempuan}</div>
                            <Progress value={perempuanPersen} className="h-1.5 mt-2 bg-pink-100" />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-7">
                    <Card className="col-span-4 transition-all">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Aktivitas Terbaru
                            </CardTitle>
                            <CardDescription>
                                Menampilkan log aktivitas tapping RFID hari ini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
                                <p className="text-muted-foreground italic text-sm">Grafik aktivitas akan muncul di sini (Gunakan Recharts)</p>
                           </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Distribusi Gender</CardTitle>
                            <CardDescription>Analisis proporsi siswa</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2"><Mars className="h-4 w-4" /> Laki-laki</span>
                                    <span className="font-semibold">{lakiPersen.toFixed(1)}%</span>
                                </div>
                                <Progress value={lakiPersen} className="h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2"><Venus className="h-4 w-4" /> Perempuan</span>
                                    <span className="font-semibold">{perempuanPersen.toFixed(1)}%</span>
                                </div>
                                <Progress value={perempuanPersen} className="h-2" />
                            </div>
                            <Separator />
                            <div className="bg-muted/30 p-4 rounded-lg">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Data ini diambil secara otomatis berdasarkan klasifikasi jenis kelamin yang tersimpan pada tabel <code className="bg-muted px-1">siswas</code>.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}