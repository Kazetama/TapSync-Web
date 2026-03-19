import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Save, Loader2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Absensi', href: '/admin/absensi' },
    { title: 'Pengaturan Waktu', href: '/admin/absensi/settings' },
];

interface SettingsProps {
    settings: {
        absen_masuk_mulai: string;
        absen_masuk_batas: string;
        absen_masuk_selesai: string;
        absen_pulang_mulai: string;
        absen_pulang_selesai: string;
    };
}

export default function Settings({ settings }: SettingsProps) {
    const { data, setData, post, processing } = useForm({
        absen_masuk_mulai: settings.absen_masuk_mulai || '06:00',
        absen_masuk_batas: settings.absen_masuk_batas || '07:15',
        absen_masuk_selesai: settings.absen_masuk_selesai || '08:00',
        absen_pulang_mulai: settings.absen_pulang_mulai || '15:00',
        absen_pulang_selesai: settings.absen_pulang_selesai || '17:00',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/absensi/settings');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Absensi" />

            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Konfigurasi Jam Sekolah</h1>
                    <p className="text-muted-foreground">Atur waktu operasional untuk sistem absensi RFID.</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-blue-600" /> Jendela Absen Masuk
                            </CardTitle>
                            <CardDescription>
                                Tentukan kapan siswa boleh mulai scan masuk dan kapan dianggap terlambat.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="masuk_mulai">Pukul Mulai</Label>
                                <Input 
                                    id="masuk_mulai" 
                                    type="time" 
                                    value={data.absen_masuk_mulai} 
                                    onChange={e => setData('absen_masuk_mulai', e.target.value)} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="masuk_batas">Batas Tepat Waktu</Label>
                                <Input 
                                    id="masuk_batas" 
                                    type="time" 
                                    value={data.absen_masuk_batas} 
                                    onChange={e => setData('absen_masuk_batas', e.target.value)} 
                                />
                                <p className="text-[10px] text-muted-foreground">Lewat dari jam ini dianggap Terlambat.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="masuk_selesai">Tutup Absen Masuk</Label>
                                <Input 
                                    id="masuk_selesai" 
                                    type="time" 
                                    value={data.absen_masuk_selesai} 
                                    onChange={e => setData('absen_masuk_selesai', e.target.value)} 
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-green-600" /> Jendela Absen Pulang
                            </CardTitle>
                            <CardDescription>
                                Tentukan kapan siswa boleh melakukan scan pulang.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="pulang_mulai">Pukul Mulai Pulang</Label>
                                <Input 
                                    id="pulang_mulai" 
                                    type="time" 
                                    value={data.absen_pulang_mulai} 
                                    onChange={e => setData('absen_pulang_mulai', e.target.value)} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pulang_selesai">Tutup Absen Pulang</Label>
                                <Input 
                                    id="pulang_selesai" 
                                    type="time" 
                                    value={data.absen_pulang_selesai} 
                                    onChange={e => setData('absen_pulang_selesai', e.target.value)} 
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing} className="min-w-[150px]">
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
