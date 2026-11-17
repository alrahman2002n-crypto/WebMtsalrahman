import { SchoolConfig } from '../types';
import { 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  Award, 
  Users, 
  BookOpenCheck, 
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';

interface HeroSectionProps {
  school: SchoolConfig;
  onOpenPpdbForm: () => void;
  onOpenCheckStatus: () => void;
}

export function HeroSection({ school, onOpenPpdbForm, onOpenCheckStatus }: HeroSectionProps) {
  return (
    <section id="beranda" className="relative bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28">
      {/* Background Subtle Geometric Pattern & Glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-600 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966910_1px,transparent_1px),linear-gradient(to_bottom,#05966910_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Announcement kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-xs font-semibold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Penerimaan Peserta Didik Baru (PPDB) T.A. {school.academicYear}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Mewujudkan Generasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">Berakhlak Qur’ani</span>, Unggul dalam Sains & Teknologi.
            </h1>

            {/* Slogan & subhead */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
              Selamat datang di portal resmi <strong className="text-white font-semibold">{school.name}</strong>. Lembaga pendidikan modern berakreditasi unggul yang memadukan kedalaman spiritual, riset sains terapan, dan keahlian digital masa depan.
            </p>

            {/* Action CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={onOpenPpdbForm}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 active:scale-[0.98] rounded-xl shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
              >
                <span>Daftar PPDB Sekarang</span>
                <ArrowRight className="w-5 h-5 text-slate-900" />
              </button>

              <button
                onClick={onOpenCheckStatus}
                className="flex items-center justify-center gap-2 px-5 py-3.5 text-base font-semibold text-white bg-slate-800/80 hover:bg-slate-700/80 active:scale-[0.98] border border-slate-700 rounded-xl transition-all cursor-pointer backdrop-blur-sm"
              >
                <Search className="w-4 h-4 text-emerald-400" />
                <span>Cek Status Pendaftaran</span>
              </button>

              <a
                href="#ppdb"
                className="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                <CalendarCheck className="w-4 h-4 text-emerald-400" />
                <span>Lihat Alur & Syarat</span>
              </a>
            </div>

            {/* High Trust Micro Bulletins */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Kurikulum Merdeka Plus</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Beasiswa Bebas SPP 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Form Terhubung Google Sheets</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual & Interactive Badge Card (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main School Atmosphere Image */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/20 shadow-2xl shadow-emerald-950/50 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop"
                  alt="Kegiatan Belajar Siswa Sekolah Cendekia"
                  className="w-full h-80 sm:h-96 object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                
                {/* Overlay Card Data */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      Status Pendaftaran
                    </span>
                    <span className="text-xs font-bold text-amber-300 font-mono">
                      Gelombang 1 Buka
                    </span>
                  </div>
                  <p className="text-sm font-medium text-white">
                    Jalur Prestasi Rapor, Tahfidz Al-Qur'an & Afirmasi Berprestasi
                  </p>
                  <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                    <span>Sisa Kuota: {school.quotaRemaining} Siswa</span>
                    <span className="text-emerald-300 font-semibold">Bebas Uang Pendaftaran</span>
                  </div>
                </div>
              </div>

              {/* Floating Stat Card - Left Side */}
              <div className="absolute -top-4 -left-4 sm:-left-6 p-3.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-emerald-500/30 shadow-xl hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Akreditasi Unggul</div>
                  <div className="text-[11px] text-emerald-400">Nilai A (97) BAN-S/M</div>
                </div>
              </div>

              {/* Floating Stat Card - Right Bottom */}
              <div className="absolute -bottom-5 -right-4 sm:-right-6 p-3.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-amber-500/30 shadow-xl hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <BookOpenCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">98% Masuk PTN</div>
                  <div className="text-[11px] text-amber-300">SNBP & SNBT 2025/2026</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 4 Bottom Highlight Metric Strip */}
        <div className="mt-14 pt-8 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">100%</div>
            <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">Lulus Ujian Nasional & Asesmen</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Tingkat kelulusan prima</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">45+</div>
            <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">Medali Olimpiade & Sains</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Tingkat Nasional & Provinsi</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-mono">3-5 Juz</div>
            <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">Target Hafalan Tahfidz</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Metode mutqin bersanad</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">240</div>
            <div className="text-xs sm:text-sm font-medium text-slate-300 mt-1">Total Kuota Penerimaan</div>
            <div className="text-[11px] text-slate-500 mt-0.5">8 Rombel @ 30 siswa</div>
          </div>
        </div>

      </div>
    </section>
  );
}
