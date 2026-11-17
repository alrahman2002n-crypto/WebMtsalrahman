import { useState } from 'react';
import { SchoolConfig, Applicant } from '../types';
import { 
  Printer, 
  X, 
  Copy, 
  Check, 
  MessageSquare, 
  GraduationCap, 
  Sparkles, 
  Calendar, 
  QrCode,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { createWhatsAppUrl } from '../utils/storage';

interface RegistrationCardModalProps {
  applicant: Applicant | null;
  school: SchoolConfig;
  isOpen: boolean;
  onClose: () => void;
}

export function RegistrationCardModal({ applicant, school, isOpen, onClose }: RegistrationCardModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !applicant) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyNumber = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(applicant.registrationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const waPanitiaUrl = createWhatsAppUrl(
    school.whatsapp,
    `Halo Panitia PPDB ${school.name}, saya telah berhasil mendaftar online atas nama: ${applicant.fullName} dengan Nomor Pendaftaran: ${applicant.registrationNumber}. Mohon info jadwal verifikasi selanjutnya.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Controls Bar (Hidden on print) */}
        <div className="no-print bg-slate-900 text-white p-4 sm:px-6 flex items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm text-emerald-300">
              Pendaftaran Berhasil! Simpan & Cetak Bukti Ini
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Registration Card */}
        <div id="printable-registration-card" className="p-6 sm:p-8 bg-white text-slate-900 space-y-6">
          
          {/* Formal School Letterhead (KOP SURAT RESMI) */}
          <div className="border-b-4 border-double border-slate-900 pb-4 text-center relative">
            <div className="flex items-center justify-between gap-4">
              {/* Logo Lembaga */}
              <div className="w-16 h-16 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold shrink-0 border border-emerald-950">
                <GraduationCap className="w-10 h-10" />
              </div>

              {/* Teks Kop Surat */}
              <div className="flex-1 text-center">
                <h4 className="text-xs uppercase tracking-widest text-slate-600 font-semibold">
                  PANITIA PENERIMAAN PESERTA DIDIK BARU (PPDB)
                </h4>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
                  {school.name}
                </h2>
                <p className="text-xs text-slate-700 font-medium">
                  {school.subName} · {school.accreditation}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {school.address}, {school.city}, {school.province} | Telp: {school.phone} | WA: {school.whatsapp}
                </p>
              </div>

              {/* QR Code Icon / Stamp Area */}
              <div className="w-16 h-16 border border-slate-300 rounded-lg p-1 hidden sm:flex flex-col items-center justify-center shrink-0 bg-slate-50">
                <QrCode className="w-10 h-10 text-slate-800" />
                <span className="text-[8px] font-mono font-bold text-slate-500">VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Judul Dokumen & Nomor Pendaftaran */}
          <div className="text-center space-y-1">
            <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-slate-900 underline underline-offset-4 decoration-2 decoration-emerald-700">
              KARTU BUKTI PENDAFTARAN PPDB T.A. {school.academicYear}
            </h3>
            <div className="inline-flex items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-600">Nomor Registrasi:</span>
              <span className="px-3 py-1 rounded-md bg-emerald-100 text-emerald-900 font-mono font-extrabold text-sm sm:text-base border border-emerald-300">
                {applicant.registrationNumber}
              </span>
            </div>
          </div>

          {/* Grid Foto & Biodata */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2 items-start">
            
            {/* Foto Calon Siswa (3 cols) */}
            <div className="sm:col-span-3 flex flex-col items-center text-center">
              <div className="w-32 h-44 border-2 border-slate-400 rounded-lg overflow-hidden bg-slate-100 shadow-xs flex items-center justify-center">
                {applicant.photoUrl ? (
                  <img
                    src={applicant.photoUrl}
                    alt={applicant.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-3 text-slate-400">
                    <GraduationCap className="w-10 h-10 mx-auto text-slate-400" />
                    <span className="text-[10px] block mt-2 font-medium">Pas Foto 3x4 Calon Siswa</span>
                  </div>
                )}
              </div>
              <div className="mt-2 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                STATUS: {applicant.status}
              </div>
            </div>

            {/* Biodata Tabel (9 cols) */}
            <div className="sm:col-span-9">
              <table className="w-full text-xs text-slate-800 border-collapse">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 font-bold text-slate-600 w-36">Nama Lengkap Siswa</td>
                    <td className="py-1.5 w-3">:</td>
                    <td className="py-1.5 font-extrabold text-slate-950 text-sm uppercase">{applicant.fullName}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 font-bold text-slate-600">NISN / NIK</td>
                    <td className="py-1.5">:</td>
                    <td className="py-1.5 font-mono">{applicant.nisn} / {applicant.nik}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 font-bold text-slate-600">Tempat, Tgl Lahir</td>
                    <td className="py-1.5">:</td>
                    <td className="py-1.5">{applicant.birthPlace}, {applicant.birthDate} ({applicant.gender})</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 font-bold text-slate-600">Asal Sekolah</td>
                    <td className="py-1.5">:</td>
                    <td className="py-1.5 font-medium">{applicant.schoolOrigin}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 font-bold text-slate-600">Jalur Pendaftaran</td>
                    <td className="py-1.5">:</td>
                    <td className="py-1.5 font-bold text-emerald-800">{applicant.path}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 font-bold text-slate-600">Peminatan / Jurusan</td>
                    <td className="py-1.5">:</td>
                    <td className="py-1.5 font-semibold">{applicant.major}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 font-bold text-slate-600">Orang Tua / Wali</td>
                    <td className="py-1.5">:</td>
                    <td className="py-1.5">Ayah: {applicant.fatherName} | Ibu: {applicant.motherName}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 font-bold text-slate-600">WhatsApp Terdaftar</td>
                    <td className="py-1.5">:</td>
                    <td className="py-1.5 font-mono">{applicant.whatsapp}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-bold text-slate-600 align-top">Alamat Domisili</td>
                    <td className="py-1.5 align-top">:</td>
                    <td className="py-1.5 leading-relaxed">{applicant.address}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          {/* Petunjuk Verifikasi Berkas Fisik */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-700 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Petunjuk Tahap Verifikasi & Uji Observasi:</span>
            </div>
            <ol className="list-decimal list-inside space-y-0.5 text-[11px] leading-relaxed text-slate-600">
              <li>Cetak kartu bukti pendaftaran ini rangkap 2 (dua) sebagai syarat masuk ke lokasi observasi sekolah.</li>
              <li>Bawa berkas fisik asli (Fotokopi KK, Akta Kelahiran, Rapor Semester 1-5, dan Piagam bagi jalur prestasi).</li>
              <li>Waktu pelaksanaan tes observasi diinformasikan secara berkala melalui menu <strong>Cek Status PPDB</strong> di website resmi.</li>
            </ol>
          </div>

          {/* Area Tanda Tangan Resmi */}
          <div className="grid grid-cols-2 gap-8 pt-4 text-center text-xs">
            <div className="space-y-12">
              <div>
                <p className="text-slate-500">Calon Siswa / Orang Tua Wali,</p>
              </div>
              <div>
                <p className="font-bold text-slate-900 underline underline-offset-2">({applicant.fullName})</p>
                <p className="text-[10px] text-slate-500">Tanda Tangan & Nama Terang</p>
              </div>
            </div>

            <div className="space-y-12 relative">
              <div>
                <p className="text-slate-500">{school.city}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="text-slate-700 font-semibold">Ketua Panitia PPDB,</p>
              </div>
              <div>
                {/* Simulated Stamp Badge */}
                <div className="absolute bottom-4 right-1/4 w-20 h-20 rounded-full border-2 border-dashed border-emerald-600/50 text-emerald-800 flex items-center justify-center rotate-[-12deg] pointer-events-none opacity-40">
                  <div className="text-[7px] font-bold text-center uppercase">PANITIA PPDB TERVERIFIKASI</div>
                </div>
                <p className="font-bold text-slate-900 underline underline-offset-2">(Panitia PPDB {school.name})</p>
                <p className="text-[10px] text-slate-500">NIP. 19820315 200501 1 002</p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Action Controls (Hidden on print) */}
        <div className="no-print bg-slate-50 p-4 sm:p-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyNumber}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin No. Pendaftaran'}</span>
            </button>

            <a
              href={waPanitiaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Konfirmasi via WhatsApp</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Cetak Sekarang</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Selesai
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
