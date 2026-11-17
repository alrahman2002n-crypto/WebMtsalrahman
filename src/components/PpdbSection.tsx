import { SchoolConfig, ScheduleItem } from '../types';
import { initialSchedules } from '../data/initialData';
import { 
  GraduationCap, 
  FileCheck2, 
  CalendarDays, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Award, 
  BookMarked, 
  Users, 
  ShieldAlert,
  Search,
  Sparkles
} from 'lucide-react';

interface PpdbSectionProps {
  school: SchoolConfig;
  schedules?: ScheduleItem[];
  onOpenPpdbForm: () => void;
  onOpenCheckStatus: () => void;
}

export function PpdbSection({ 
  school, 
  schedules = initialSchedules, 
  onOpenPpdbForm, 
  onOpenCheckStatus 
}: PpdbSectionProps) {
  const admissionTracks = [
    {
      title: 'Jalur Prestasi Akademik & Non-Akademik',
      badge: 'Beasiswa SPP s.d. 100%',
      icon: Award,
      desc: 'Bagi siswa berprestasi peringkat 1-5 di sekolah asal atau memiliki sertifikat juara minimal tingkat kota/kabupaten di bidang sains, seni, maupun olahraga.',
      requirements: ['Nilai Rapor semester 1-5 rata-rata min. 85', 'Sertifikat/Piagam kejuaraan resmi', 'Surat rekomendasi kepala sekolah asal']
    },
    {
      title: 'Jalur Beasiswa Tahfidz Al-Qur’an',
      badge: 'Bebas Biaya Pendidikan Penuh',
      icon: BookMarked,
      desc: 'Didedikasikan untuk para calon santri/siswa penghafal Al-Qur’an yang memiliki hafalan minimal 3 Juz mutqin dengan tajwid yang baik.',
      requirements: ['Hafalan minimal 3 Juz mutqin', 'Syahadah/Surat keterangan tahfidz', 'Lulus uji sima’an/tasmi’ panitia']
    },
    {
      title: 'Jalur Reguler & Minat Bakat',
      badge: 'Terbuka Umum',
      icon: Users,
      desc: 'Jalur seleksi terbuka untuk seluruh lulusan SMP/MTs/sederajat berdasarkan pemetaan potensi akademik dan minat bakat.',
      requirements: ['Lulusan SMP/MTs atau siswa aktif kelas IX', 'Memiliki NISN terdaftar di Kemendikbud', 'Mengikuti tes observasi minat & bakat']
    },
    {
      title: 'Jalur Afirmasi Keluarga Berdaya',
      badge: 'Bantuan Pendidikan Khusus',
      icon: ShieldAlert,
      desc: 'Memberikan kesempatan pendidikan berkualitas bagi siswa berpotensi tinggi dari keluarga prasejahtera atau yatim/piatu.',
      requirements: ['Kartu Indonesia Pintar (KIP) / PKH / SKTM', 'Rekomendasi dari wali kelas SMP asal', 'Komitmen belajar dan budi pekerti baik']
    }
  ];

  const documentRequirements = [
    { name: 'Nomor Induk Siswa Nasional (NISN)', note: '10 Digit aktif terdaftar di Pusdatin Kemendikbud' },
    { name: 'Fotokopi / Scan Kartu Keluarga (KK)', note: 'Minimal 1 tahun sebelum pendaftaran' },
    { name: 'Fotokopi / Scan Akta Kelahiran', note: 'Usia maksimal 21 tahun per 1 Juli 2026' },
    { name: 'Surat Keterangan Lulus (SKL) / Rapor', note: 'Semester 1 s.d. 5 yang telah dilegalisir' },
    { name: 'Pas Foto Berwarna Terbaru (3x4)', note: 'Latar merah/biru, berpakaian seragam rapi' },
    { name: 'Piagam / Sertifikat Kejuaraan', note: 'Wajib bagi pendaftar jalur prestasi / tahfidz' },
  ];

  return (
    <section id="ppdb" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pusat Informasi PPDB Online {school.academicYear}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Alur, Persyaratan & Formulir Pendaftaran Terpadu
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Daftarkan putera-puteri Anda secara online dari rumah. Seluruh data terdata secara otomatis dan dapat diverifikasi langsung melalui sistem kami.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenPpdbForm}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Isi Formulir Pendaftaran PPDB</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
            <button
              onClick={onOpenCheckStatus}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-emerald-700" />
              <span>Cek Status & Kelulusan</span>
            </button>
          </div>
        </div>

        {/* 4 Jalur Pendaftaran Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-700" />
              <span>Pilihan Jalur Masuk</span>
            </h3>
            <span className="text-xs text-slate-500">Pilih salah satu sesuai kualifikasi</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {admissionTracks.map((track) => {
              const IconComp = track.icon;
              return (
                <div
                  key={track.title}
                  className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-amber-700 block">
                        {track.badge}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                        {track.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {track.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200/80 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Ketentuan Berkas:
                    </div>
                    {track.requirements.map((req, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alur & Jadwal Pendaftaran Timeline */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-emerald-700" />
              <span>Jadwal & Alur Seleksi PPDB {school.academicYear}</span>
            </h3>
            <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Tahap 1 Sedang Berlangsung
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((item) => (
              <div
                key={item.step}
                className={`p-6 rounded-2xl border transition-all ${
                  item.isCurrent 
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600/30' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    item.isCurrent ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.step}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    item.isCurrent ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </h4>

                <div className="text-xs font-medium text-emerald-800 mt-1 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{item.period}</span>
                </div>

                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dokumen & Checklist Berkas */}
        <div className="p-8 rounded-2xl bg-slate-900 text-white space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <span>Dokumen Persyaratan Administrasi</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Berkas yang Perlu Disiapkan Sebelum Mendaftar
              </h3>
            </div>
            <button
              onClick={onOpenPpdbForm}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shrink-0"
            >
              Mulai Pendaftaran Online
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {documentRequirements.map((doc, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-white leading-snug">
                    {doc.name}
                  </h5>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {doc.note}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-between flex-wrap gap-3 text-xs text-emerald-200">
            <span>
              ℹ️ Seluruh berkas fisik asli hanya perlu diperlihatkan saat tahapan Verifikasi & Wawancara di Kampus Sekolah.
            </span>
            <span className="font-semibold text-amber-300">
              Pendaftaran Tidak Dipungut Biaya (Gratis)
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
