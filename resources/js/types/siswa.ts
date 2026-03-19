export interface Siswa {
    id: number;
    nis: string;
    nama: string;
    jenis_kelamin: string;
    kelas: string;
    jurusan: string;
    angkatan: string;
    rfid_uid: string | null;
    alamat: string | null;
    no_hp_siswa: string | null;
    no_hp_ortu: string | null;
    foto: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface SiswaFilters {
    search?: string;
    kelas?: string;
    jurusan?: string;
    angkatan?: string;
}

export interface SiswaOptions {
    kelas: string[];
    jurusan: string[];
    angkatan: string[];
}

export interface SiswaPagination {
    data: Siswa[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
