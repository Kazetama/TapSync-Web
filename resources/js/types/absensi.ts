import { type Siswa } from './siswa';

export interface Absensi {
    id: number;
    siswa_id: number;
    tanggal: string;
    jam_masuk: string | null;
    jam_pulang: string | null;
    status_masuk: string | null;
    status_pulang: string | null;
    keterangan: string | null;
    siswa?: Siswa;
    created_at?: string;
    updated_at?: string;
}

export interface AbsensiPagination {
    data: Absensi[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
