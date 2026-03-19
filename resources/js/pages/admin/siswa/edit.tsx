import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Siswa } from '@/types/siswa';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import {Save, User, BookOpen, Phone, Camera, Loader2, CreditCard } from 'lucide-react';

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

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (isScanning) {
            interval = setInterval(async () => {
                try {
                    const response = await fetch('/api/rfid/latest');
                    if (response.ok) {
                        const dataResponse = await response.json();
                        if (dataResponse.success && dataResponse.rfid_uid) {
                            setData('rfid_uid', dataResponse.rfid_uid);
                            setIsScanning(false);
                            if (interval) clearInterval(interval);
                        }
                    }
                } catch (error) {
                    console.error('Error polling RFID:', error);
                }
            }, 2000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isScanning, setData]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/siswa/${siswa.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Siswa - ${siswa.nama}`} />

            <div className="p-6 max-w-5xl mx-auto space-y-6">
                
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Informasi Siswa</h1>
                        <p className="text-sm text-muted-foreground">Pastikan data sesuai dengan dokumen resmi sekolah.</p>
                    </div>
                    <Badge variant={data.is_active ? "default" : "secondary"}>
                        {data.is_active ? "Akun Aktif" : "Akun Nonaktif"}
                    </Badge>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-900/10 shadow-none">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2 text-lg">
                                <CreditCard className="h-5 w-5" /> Kredensial Kartu RFID
                            </CardTitle>
                            <CardDescription className="text-blue-700/80 dark:text-blue-300/80">
                                Klik tombol scan lalu tap kartu fisik pada alat untuk input otomatis.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Input
                                        value={data.rfid_uid}
                                        onChange={e => setData('rfid_uid', e.target.value.toUpperCase())}
                                        placeholder="UID Kartu (Otomatis/Manual)"
                                        className="font-mono text-lg h-12 uppercase bg-white dark:bg-neutral-950 border-blue-200"
                                    />
                                    {isScanning && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                        </div>
                                    )}
                                </div>
                                <Button 
                                    type="button" 
                                    onClick={() => setIsScanning(true)}
                                    disabled={isScanning}
                                    className={`h-12 px-6 ${isScanning ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {isScanning ? 'Menunggu Kartu...' : 'Scan Kartu'}
                                </Button>
                            </div>
                            {errors.rfid_uid && <p className="text-sm text-destructive">{errors.rfid_uid}</p>}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" /> Data Akademik
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nis">Nomor Induk Siswa (NIS)</Label>
                                            <Input id="nis" value={data.nis} onChange={e => setData('nis', e.target.value)} />
                                            {errors.nis && <p className="text-xs text-destructive">{errors.nis}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="angkatan">Angkatan</Label>
                                            <Input id="angkatan" value={data.angkatan} onChange={e => setData('angkatan', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nama">Nama Lengkap</Label>
                                        <Input id="nama" value={data.nama} onChange={e => setData('nama', e.target.value)} />
                                        {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Jenis Kelamin</Label>
                                            <Select value={data.jenis_kelamin} onValueChange={val => setData('jenis_kelamin', val)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="L">Laki-laki</SelectItem>
                                                    <SelectItem value="P">Perempuan</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="kelas">Kelas</Label>
                                            <Input id="kelas" value={data.kelas} onChange={e => setData('kelas', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="jurusan">Jurusan / Program Studi</Label>
                                        <Input id="jurusan" value={data.jurusan} onChange={e => setData('jurusan', e.target.value)} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Phone className="h-4 w-4" /> Kontak & Alamat
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="hp_siswa">No. HP Siswa</Label>
                                            <Input id="hp_siswa" value={data.no_hp_siswa} onChange={e => setData('no_hp_siswa', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hp_ortu">No. HP Orang Tua</Label>
                                            <Input id="hp_ortu" value={data.no_hp_ortu} onChange={e => setData('no_hp_ortu', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="alamat">Alamat Tinggal</Label>
                                        <Textarea id="alamat" rows={3} value={data.alamat} onChange={e => setData('alamat', e.target.value)} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Camera className="h-4 w-4" /> Pas Foto
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center gap-4">
                                    <div className="relative group">
                                        <div className="h-32 w-32 rounded-xl border-2 border-dashed border-muted-foreground/20 overflow-hidden bg-muted flex items-center justify-center">
                                            {siswa.foto ? (
                                                <img src={`/storage/${siswa.foto}`} className="h-full w-full object-cover" alt="Profile" />
                                            ) : (
                                                <User className="h-12 w-12 text-muted-foreground/40" />
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl pointer-events-none">
                                            <Camera className="text-white h-6 w-6" />
                                        </div>
                                    </div>
                                    <Input 
                                        type="file" 
                                        className="cursor-pointer" 
                                        onChange={e => setData('foto', e.target.files ? e.target.files[0] : null)} 
                                    />
                                    <p className="text-[10px] text-muted-foreground text-center">Format: JPG, PNG. Maks: 2MB</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Pengaturan Akun</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <Label>Status Aktif</Label>
                                            <p className="text-[11px] text-muted-foreground">Izinkan akses RFID</p>
                                        </div>
                                        <Switch 
                                            checked={data.is_active} 
                                            onCheckedChange={val => setData('is_active', val)} 
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Button variant="ghost" asChild>
                            <Link href="/admin/siswa">Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="min-w-[150px] bg-neutral-950 dark:bg-white dark:text-black">
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Simpan Perubahan
                        </Button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}