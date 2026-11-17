import { useState, FormEvent } from 'react';
import { SchoolConfig, Applicant } from '../types';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Printer, 
  MessageSquare, 
  UserCheck,
  CalendarCheck2,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { createWhatsAppUrl } from '../utils/storage';

interface CheckStatusSectionProps {
  school: SchoolConfig;
  allApplicants: Applicant[];
  onPrintCard: (applicant: Applicant) => void;
  onOpenPpdbForm: () => void;
}

export function CheckStatusSection({
  school,
  allApplicants,
  onPrintCard,
  onOpenPpdbForm
}: CheckStatusSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundApplicant, setFoundApplicant] = useState<Applicant | null>(null);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    setSearched(true);
    const result = allApplicants.find(
      (a) =>
        a.registrationNumber.toLowerCase() === query ||
        a.nisn.toLowerCase() === query ||
        a.fullName.toLowerCase() === query
    );
    setFoundApplicant(result || null);
  };

  const handleQuickLookup = (code: string) => {
    setSearchQuery(code);
    setSearched(true);
    const result = allApplicants.find(
      (a) =>
        a.registrationNumber.toLowerCase() === code.toLowerCase() ||
        a.nisn.toLowerCase() === code.toLowerCase()
    );
    setFoundApplicant(result || null);
  };

  const getStatusBadge = (status: Applicant['status']) => {
    switch (status) {
      case 'Diterima':
      case 'Lolos Verifikasi':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-700" />,
          title: status === 'Diterima' ? 'Selamat! Anda Dinyatakan DITERIMA' : 'Berkas LOLOS VERIFIKASI',
          desc: 'Data administrasi lengkap dan valid. Silakan ikuti tahapan selanjutnya sesuai jadwal.'
        };
      case 'Sedang Ditinjau':
      case 'Menunggu Verifikasi':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: <Clock className="w-5 h-5 text-amber-700" />,
          title: 'Status: SEDANG DALAM PROSES PENINJAUAN',
          desc: 'Panitia sedang melakukan pencocokan data rapor dan verifikasi berkas administrasi Anda.'
        };
      case 'Berkas Perlu Dilengkapi':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-300',
          icon: <AlertTriangle className="w-5 h-5 text-rose-700" />,
          title: 'Perhatian: BERKAS PERLU DILENGKAPI',
          desc: 'Terdapat catatan dokumen yang belum sesuai standar. Mohon segera hubungi panitia PPDB.'
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: <XCircle className="w-5 h-5 text-slate-600" />,
          title: 'Status: ' + status,
          desc: 'Silakan hubungi helpdesk panitia untuk konsultasi lanjutan.'
        };
    }
  };

  return (
    <section id="cek-status" className="py-20 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Portal Cek Status PPDB Online</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pantau Status Verifikasi & Hasil Seleksi
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Masukkan <strong>Nomor Pendaftaran</strong> (contoh: <code>PPDB-2026-0001</code>) atau <strong>NISN 10 Digit</strong> Anda untuk mengecek status berkas secara langsung.
          </p>
        </div>

        {/* Search Bar Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik No. Pendaftaran atau NISN..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Periksa Data</span>
            </button>
          </form>

          {/* Quick Click Demo Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
            <span>Contoh Uji Coba:</span>
            <button
              type="button"
              onClick={() => handleQuickLookup('PPDB-2026-0001')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-mono text-[11px] transition-colors border border-slate-200"
            >
              PPDB-2026-0001
            </button>
            <button
              type="button"
              onClick={() => handleQuickLookup('0089923412')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-mono text-[11px] transition-colors border border-slate-200"
            >
              0089923412 (Tahfidz)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLookup('PPDB-2026-0004')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-mono text-[11px] transition-colors border border-slate-200"
            >
              PPDB-2026-0004 (Perlu Lengkapi)
            </button>
          </div>
        </div>

        {/* Search Results Display */}
        {searched && (
          <div className="animate-in fade-in duration-300">
            {foundApplicant ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden space-y-6 p-6 sm:p-8">
                
                {/* Result Header & Status Banner */}
                {(() => {
                  const statusInfo = getStatusBadge(foundApplicant.status);
                  return (
                    <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${statusInfo.bg}`}>
                      <div className="shrink-0 mt-0.5">{statusInfo.icon}</div>
                      <div>
                        <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-wide">
                          {statusInfo.title}
                        </h4>
                        <p className="text-xs mt-0.5 leading-relaxed">
                          {statusInfo.desc}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Candidate Overview Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block font-medium">Nama Lengkap Siswa:</span>
                    <strong className="text-sm font-bold text-slate-900 uppercase">{foundApplicant.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">No. Pendaftaran:</span>
                    <strong className="text-sm font-bold font-mono text-emerald-800">{foundApplicant.registrationNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">NISN / Asal Sekolah:</span>
                    <span className="font-semibold">{foundApplicant.nisn} · {foundApplicant.schoolOrigin}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Jalur / Pilihan Jurusan:</span>
                    <span className="font-semibold text-emerald-900">{foundApplicant.path} · {foundApplicant.major}</span>
                  </div>
                </div>

                {/* Verification Note from Committee */}
                {foundApplicant.verificationNotes && (
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-1">
                    <span className="font-bold text-emerald-900 uppercase tracking-wider block">
                      Catatan Resmi Panitia PPDB:
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {foundApplicant.verificationNotes}
                    </p>
                  </div>
                )}

                {/* Interview / Observation Schedule if available */}
                {foundApplicant.interviewDate && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-center gap-3">
                    <CalendarCheck2 className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <span className="font-bold text-amber-900 block">Jadwal Observasi & Wawancara:</span>
                      <span className="text-slate-700">{foundApplicant.interviewDate}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <button
                    onClick={() => onPrintCard(foundApplicant)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-amber-300" />
                    <span>Cetak Ulang Kartu Pendaftaran</span>
                  </button>

                  <a
                    href={createWhatsAppUrl(
                      school.whatsapp,
                      `Halo Panitia PPDB ${school.name}, saya ${foundApplicant.fullName} (${foundApplicant.registrationNumber}) ingin menanyakan perihal status pendaftaran saya.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hubungi Panitia WhatsApp</span>
                  </a>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Data Pendaftaran Tidak Ditemukan
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Pastikan Anda memasukkan Nomor Pendaftaran atau NISN yang benar saat melakukan registrasi.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={onOpenPpdbForm}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Daftar Sekarang
                  </button>
                  <a
                    href={createWhatsAppUrl(
                      school.whatsapp,
                      `Halo Panitia PPDB ${school.name}, saya mencari nomor pendaftaran saya namun belum ditemukan.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Bantuan Panitia
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
