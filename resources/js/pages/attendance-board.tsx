import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { User, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface AttendanceData {
    nama: string;
    foto: string | null;
    kelas: string;
    jurusan: string;
    status: string;
    waktu: string;
    type: 'MASUK' | 'PULANG';
    timestamp: number;
}

export default function AttendanceBoard() {
    const [latest, setLatest] = useState<AttendanceData | null>(null);
    const [lastTimestamp, setLastTimestamp] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const poll = async () => {
            try {
                const response = await fetch('/api/attendance/latest');
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data.timestamp !== lastTimestamp) {
                        setLatest(result.data);
                        setLastTimestamp(result.data.timestamp);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch latest attendance:', error);
            }
        };

        const interval = setInterval(poll, 2000);
        return () => clearInterval(interval);
    }, [lastTimestamp]);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden flex flex-col">
            <Head title="Papan Absensi Real-time" />

            {/* Header */}
            <header className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <Clock className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">TapSync Dashboard</h1>
                        <p className="text-slate-400 text-sm">Papan Informasi Kehadiran Real-time</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-mono font-bold text-blue-400 tracking-widest">
                        {currentTime.toLocaleTimeString('id-ID', { hour12: false })}
                    </p>
                    <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">
                        {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-8 relative">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                {latest ? (
                    <div className="w-full max-w-5xl bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-500 flex flex-col md:flex-row gap-12 items-center">
                        {/* Student Image */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative w-64 h-80 md:w-80 md:h-[450px] bg-slate-800 rounded-[2rem] overflow-hidden border-2 border-white/10 shadow-inner">
                                {latest.foto ? (
                                    <img src={latest.foto} alt={latest.nama} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-500">
                                        <User className="w-24 h-24 mb-4 opacity-20" />
                                        <span className="text-sm font-medium uppercase tracking-widest">Foto Tidak Tersedia</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Type Badge */}
                            <div className={`absolute -top-4 -right-4 px-6 py-2 rounded-full font-bold text-sm tracking-widest shadow-xl border ${
                                latest.type === 'MASUK' 
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                                : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                            }`}>
                                {latest.type}
                            </div>
                        </div>

                        {/* Student Info */}
                        <div className="flex-1 text-center md:text-left space-y-8">
                            <div>
                                <h2 className="text-slate-400 text-lg font-medium uppercase tracking-[0.2em] mb-2">Siswa Terdeteksi</h2>
                                <h3 className="text-5xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 leading-tight">
                                    {latest.nama}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 transition hover:bg-white/[0.07]">
                                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Kelas</p>
                                    <p className="text-2xl font-semibold text-white">{latest.kelas}</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 transition hover:bg-white/[0.07]">
                                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Jurusan</p>
                                    <p className="text-2xl font-semibold text-white">{latest.jurusan}</p>
                                </div>
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 transition hover:bg-emerald-500/[0.15]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <p className="text-emerald-500/80 text-sm font-bold uppercase tracking-widest">Status</p>
                                    </div>
                                    <p className="text-2xl font-black text-emerald-400">{latest.status}</p>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 transition hover:bg-blue-500/[0.15]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock className="w-4 h-4 text-blue-400" />
                                        <p className="text-blue-500/80 text-sm font-bold uppercase tracking-widest">Waktu</p>
                                    </div>
                                    <p className="text-2xl font-black text-blue-400">{latest.waktu}</p>
                                </div>
                            </div>

                            <p className="text-slate-500 text-sm font-medium italic">
                                * Data otomatis diperbarui setiap kali kartu ditempelkan.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center animate-pulse">
                        <div className="w-32 h-32 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                            <AlertCircle className="w-16 h-16 text-slate-700" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-400 tracking-wider">Menunggu Tap Kartu...</h2>
                        <p className="text-slate-600 mt-2 max-w-md mx-auto">
                            Silakan tempelkan kartu RFID pada alat untuk melihat informasi siswa dan status absensi.
                        </p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="px-8 py-6 border-t border-slate-900 bg-slate-900/30 backdrop-blur-sm text-center">
                <p className="text-slate-500 font-medium text-sm">
                    &copy; {new Date().getFullYear()} TapSync Attendance System &bull; Digitalizing Presence
                </p>
            </footer>

            <style>{`
                @keyframes pulse-gentle {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }
                .animate-pulse-gentle {
                    animation: pulse-gentle 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
