import { useState, ChangeEvent, FormEvent } from 'react';
import { SchoolConfig, Applicant } from '../types';
import { 
  X, 
  Copy, 
  Check, 
  Settings, 
  FileCode, 
  BookOpen, 
  Database, 
  Globe, 
  Search, 
  Sliders, 
  Download, 
  Save, 
  CheckCircle2, 
  ExternalLink,
  Table,
  RefreshCw,
  FileEdit,
  Image,
  Calendar,
  Newspaper,
  CheckCircle,
  HelpCircle,
  Lock,
  ShieldCheck,
  BarChart3,
  Upload
} from 'lucide-react';
import { processImageUpload } from '../utils/storage';

interface AdminGuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolConfig;
  onUpdateSchool: (newConfig: SchoolConfig) => void;
  applicants: Applicant[];
  onUpdateApplicantStatus: (id: string, newStatus: Applicant['status'], notes?: string) => void;
}

export function AdminGuideDrawer({
  isOpen,
  onClose,
  school,
  onUpdateSchool,
  applicants,
  onUpdateApplicantStatus
}: AdminGuideDrawerProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'update-guide' | 'script' | 'guide' | 'data'>('update-guide');
  const [copiedScript, setCopiedScript] = useState(false);
  const [saveAlert, setSaveAlert] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Form state for school config
  const [editConfig, setEditConfig] = useState<SchoolConfig>(school);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  if (!isOpen) return null;

  const handleConfigChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleHeadmasterPhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploadError(null);
    setIsUploadingPhoto(true);
    try {
      const dataUrl = await processImageUpload(file, 720);
      setEditConfig(prev => ({ ...prev, headmasterPhoto: dataUrl }));
    } catch (err: any) {
      setPhotoUploadError(err?.message || 'Gagal mengunggah foto.');
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleSaveConfig = (e: FormEvent) => {
    e.preventDefault();
    onUpdateSchool(editConfig);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 2500);
  };

  const googleScriptCode = `/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT: BACKEND DATABASE PPDB ONLINE KE GOOGLE SHEETS
 * ==============================================================================
 * Petunjuk:
 * 1. Buka Google Sheets Anda di https://sheets.google.com
 * 2. Klik menu: Ekstensi (Extensions) > Apps Script
 * 3. Hapus seluruh isi kode lama, lalu TEMPELKAN (Paste) kode di bawah ini.
 * 4. Klik icon Simpan (Ctrl+S).
 * 5. Klik tombol biru "Terapkan" (Deploy) > "Deployment baru" (New deployment).
 * 6. Pilih jenis: "Aplikasi Web" (Web app).
 * 7. Pada 'Akses' (Who has access), pilih: "Siapa saja" (Anyone) -> SANGAT PENTING!
 * 8. Klik "Terapkan", izinkan izin akses Google, lalu Salin URL Aplikasi Web-nya.
 * 9. Tempelkan URL tersebut ke tab 'Kustomisasi Sekolah' di website ini.
 * ==============================================================================
 */

var SHEET_NAME = "Data_PPDB_2026";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    var headers = [
      "Waktu Pendaftaran", "No. Pendaftaran", "Jalur Pendaftaran",
      "Pilihan Jurusan/Program", "Nama Lengkap Siswa", "NISN", "NIK",
      "Tempat, Tgl Lahir", "Jenis Kelamin", "Agama", "Alamat Lengkap",
      "Asal Sekolah", "Nama Ayah", "Pekerjaan Ayah", "Nama Ibu",
      "Pekerjaan Ibu", "No. WhatsApp Aktif", "Penghasilan Ortu",
      "Status Verifikasi", "Catatan Petugas"
    ];

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#059669").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    var timestamp = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
    var regNumber = data.registrationNumber || ("PPDB-2026-" + Math.floor(1000 + Math.random() * 9000));

    var newRow = [
      timestamp,
      regNumber,
      data.path || "-",
      data.major || "-",
      data.fullName || "-",
      "'" + (data.nisn || "-"),
      "'" + (data.nik || "-"),
      (data.birthPlace || "") + ", " + (data.birthDate || ""),
      data.gender || "-",
      data.religion || "-",
      data.address || "-",
      data.schoolOrigin || "-",
      data.fatherName || "-",
      data.fatherJob || "-",
      data.motherName || "-",
      data.motherJob || "-",
      "'" + (data.whatsapp || "-"),
      data.parentIncome || "-",
      "Menunggu Verifikasi",
      "Terdaftar online via website"
    ];

    sheet.appendRow(newRow);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data pendaftaran berhasil tersimpan di Google Sheets!",
      registrationNumber: regNumber
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`;

  const copyScriptToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(googleScriptCode);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  const exportApplicantsToCsv = () => {
    const headers = ['No. Pendaftaran', 'Nama Lengkap', 'NISN', 'Jalur', 'Jurusan', 'Asal Sekolah', 'No. WhatsApp', 'Status', 'Catatan'];
    const rows = applicants.map(a => [
      `"${a.registrationNumber}"`,
      `"${a.fullName}"`,
      `"${a.nisn}"`,
      `"${a.path}"`,
      `"${a.major}"`,
      `"${a.schoolOrigin}"`,
      `"${a.whatsapp}"`,
      `"${a.status}"`,
      `"${a.verificationNotes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_PPDB_${school.academicYear.replace('/', '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="bg-slate-900 text-white p-5 sm:px-6 flex items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Panel Pengelola Sekolah & Panduan Integrasi
              </h2>
              <p className="text-xs text-slate-400">
                Kustomisasi Sekolah, Kode Google Apps Script, Deploy GitHub Pages & Rekap Pendaftar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('update-guide')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              activeTab === 'update-guide' 
                ? 'bg-white text-emerald-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5 text-emerald-700" />
            <span>Panduan Update Website</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              activeTab === 'settings' 
                ? 'bg-white text-emerald-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-700" />
            <span>Kustomisasi Sekolah</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              activeTab === 'script' 
                ? 'bg-white text-emerald-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kode Google Apps Script (`code.gs`)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              activeTab === 'guide' 
                ? 'bg-white text-emerald-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-700" />
            <span>Panduan Deploy & SEO</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              activeTab === 'data' 
                ? 'bg-white text-emerald-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-teal-700" />
            <span>Daftar Pendaftar ({applicants.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB: PANDUAN LENGKAP UPDATE WEBSITE */}
          {activeTab === 'update-guide' && (
            <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
              
              {/* Header Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white space-y-2 shadow-sm">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-800 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Panduan Pengelola & Operator Sekolah</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Panduan Praktis Memperbarui Informasi di Website Ini
                </h3>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  Aplikasi ini dirancang sangat fleksibel. Anda dapat memperbarui informasi umum secara instan tanpa coding (No-Code), atau mengubah konten permanen (Berita, Jadwal, FAQ) langsung melalui file data yang rapi.
                </p>
              </div>

              {/* METODE 0: HALAMAN KHUSUS ADMIN DENGAN KONFIRMASI PASSWORD */}
              <div className="p-5 rounded-xl border-2 border-amber-400 bg-amber-50/60 space-y-3">
                <div className="flex items-center gap-2 text-slate-950 font-extrabold text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold shrink-0">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                  <h4>Portal Admin Terproteksi & Dashboard Ringkasan Statistik</h4>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Untuk keamanan data pendaftar dan kemudahan operator sekolah, tersedia <strong>Halaman Khusus Admin</strong> yang dilindungi konfirmasi kata sandi:
                </p>
                <ul className="space-y-1.5 text-slate-800 text-xs">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong>Keamanan Password:</strong> Klik tombol kuning <em>"Halaman Admin"</em> di pojok atas atau footer. Sistem akan menampilkan layar konfirmasi kata sandi. Password awal bawaan adalah: <code className="px-1.5 py-0.5 bg-amber-200 text-slate-950 rounded font-mono font-bold">admin123</code>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <span><strong>Visualisasi Interaktif (Recharts):</strong> Dashboard admin menyajikan grafik jumlah pendaftar per jalur (Reguler, Prestasi, Tahfidz, Afirmasi), diagram persentase status verifikasi, dan tren akumulasi pendaftaran dari waktu ke waktu.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong>Manajemen Lengkap:</strong> Edit berita, jadwal gelombang, tanya jawab (FAQ), cetak kartu pendaftar, input pendaftar offline/walk-in, ubah status seleksi, dan ubah kata sandi admin kapan saja.</span>
                  </li>
                </ul>
              </div>

              {/* METODE 1: UPDATE INSTAN TANPA CODING (NO-CODE) */}
              <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <h4>Cara Update Data Sekolah Secara Cepat (Tanpa Perlu Coding)</h4>
                </div>
                <p className="text-slate-600">
                  Untuk mengubah data profil sekolah, nomor kontak WhatsApp panitia, alamat, nama kepala sekolah, atau link Google Sheets:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700 pl-1">
                  <li>Klik tombol tab <strong>"Kustomisasi Sekolah"</strong> di atas panel ini.</li>
                  <li>Ubah kolom yang diinginkan (misal: Nama Sekolah, Nomor WhatsApp Panitia, Sisa Kuota, atau Alamat).</li>
                  <li>Klik tombol hijau <strong>"Simpan Pengaturan Sekolah"</strong> di bagian bawah form.</li>
                  <li>Perubahan langsung aktif dan tersimpan di sistem, serta otomatis muncul pada <em>Kartu Bukti Pendaftaran</em> pendaftar baru!</li>
                </ol>
              </div>

              {/* METODE 2: UPDATE BERITA, JADWAL & PROGRAM */}
              <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4 shadow-xs">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <h4>Cara Menambah Berita Baru, Jadwal Gelombang, dan Jurusan</h4>
                </div>
                <p className="text-slate-600">
                  Seluruh konten sekolah (Berita, Jadwal PPDB, Ekstrakurikuler, dan FAQ) tersimpan terpusat di satu file yang sangat rapi: <code className="bg-slate-100 text-slate-900 px-2 py-0.5 rounded font-mono text-xs">/src/data/initialData.ts</code>.
                </p>

                {/* Sub-A: Tambah Berita */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                      <Newspaper className="w-4 h-4 text-emerald-700" />
                      A. Menambah Berita atau Pengumuman Baru
                    </span>
                    <button
                      onClick={() => {
                        const snippet = `{\n  id: 'news-\${Date.now()}',\n  title: 'Judul Pengumuman Baru Anda',\n  category: 'Pengumuman PPDB', // atau 'Prestasi', 'Akademik', 'Kegiatan Siswa'\n  date: '28 Februari 2026',\n  readTime: '3 menit baca',\n  excerpt: 'Ringkasan singkat berita 1-2 kalimat.',\n  imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',\n  author: 'Panitia PPDB 2026',\n  content: [\n    'Paragraf pertama isi pengumuman lengkap.',\n    'Paragraf kedua kelanjutan informasi.'\n  ]\n}`;
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(snippet);
                          setCopiedSnippet('news');
                          setTimeout(() => setCopiedSnippet(null), 2000);
                        }
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSnippet === 'news' ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSnippet === 'news' ? 'Tersalin!' : 'Salin Contoh Berita'}</span>
                    </button>
                  </div>
                  <p className="text-slate-600 text-xs">
                    Buka <code className="font-mono text-emerald-800">src/data/initialData.ts</code>, cari variabel <code className="font-mono font-bold">initialNews</code>, lalu tambahkan objek berita baru di dalam tanda kurung siku <code className="font-mono">[ ... ]</code>.
                  </p>
                </div>

                {/* Sub-B: Update Jadwal Gelombang */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                      <Calendar className="w-4 h-4 text-amber-700" />
                      B. Mengubah Jadwal & Tanggal Gelombang PPDB
                    </span>
                    <button
                      onClick={() => {
                        const snippet = `{\n  step: 1,\n  title: 'Gelombang 1: Jalur Prestasi & Tahfidz',\n  period: '10 Januari - 28 Februari 2026',\n  description: 'Pendaftaran khusus bagi pemilik sertifikat kejuaraan atau hafalan Al-Quran.',\n  badge: 'Gelombang 1 (Sedang Dibuka)',\n  isCurrent: true,\n}`;
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(snippet);
                          setCopiedSnippet('schedule');
                          setTimeout(() => setCopiedSnippet(null), 2000);
                        }
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSnippet === 'schedule' ? <Check className="w-3 h-3 text-amber-700" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSnippet === 'schedule' ? 'Tersalin!' : 'Salin Contoh Jadwal'}</span>
                    </button>
                  </div>
                  <p className="text-slate-600 text-xs">
                    Cari variabel <code className="font-mono font-bold text-amber-800">initialSchedules</code> di file tersebut untuk mengubah periode tanggal, nama gelombang, dan deskripsi tahap seleksi. Ubah <code className="font-mono">isCurrent: true</code> pada gelombang yang sedang aktif.
                  </p>
                </div>

                {/* Sub-C: Tanya Jawab FAQ */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                      <HelpCircle className="w-4 h-4 text-blue-700" />
                      C. Menambah Tanya Jawab (FAQ) Baru
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs">
                    Cari variabel <code className="font-mono font-bold text-blue-800">initialFaqs</code> di file yang sama, lalu tambahkan pertanyaan dan jawaban baru untuk membantu calon pendaftar memahami aturan biaya, beasiswa, dan berkas.
                  </p>
                </div>
              </div>

              {/* METODE 3: CARA GANTI FOTO & GAMBAR */}
              <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <h4>Cara Mengganti Foto Kepala Sekolah & Suasana Sekolah</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <strong className="text-slate-900 block font-semibold">Opsi A: Menggunakan URL Gambar Online (Mudah)</strong>
                    <p>
                      Unggah foto asli sekolah ke Google Drive (set izin <em>Siapa saja dengan link</em>), ImgBB, atau Cloudinary, lalu tempelkan link URL gambarnya ke field <code className="font-mono">headmasterPhoto</code> atau <code className="font-mono">imageUrl</code>.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <strong className="text-slate-900 block font-semibold">Opsi B: Memasukkan File ke Folder Proyek</strong>
                    <p>
                      Simpan file gambar di dalam folder <code className="font-mono">public/images/</code> (misal: <code className="font-mono">public/images/kepala-sekolah.jpg</code>), lalu panggil di kode cukup dengan <code className="font-mono">"/images/kepala-sekolah.jpg"</code>.
                    </p>
                  </div>
                </div>
              </div>

              {/* METODE 4: CARA MENERAPKAN PERUBAHAN KE LIVE HOSTING */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0">4</span>
                  <h4>Cara Mempublikasikan Perubahan ke Website Publik</h4>
                </div>
                <div className="space-y-2 text-slate-600">
                  <p>
                    Jika website Anda sudah terhubung ke <strong>Vercel, Netlify, atau GitHub Pages</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    <li><strong>Melalui GitHub Web (Tanpa Install Apapun):</strong> Buka repository GitHub sekolah Anda melalui browser, klik file <code className="font-mono">src/data/initialData.ts</code>, klik ikon pensil (Edit), edit teks yang diinginkan, lalu klik tombol hijau <strong>Commit changes</strong>. Vercel/Netlify akan otomatis mendeteksi dan memperbarui website live dalam waktu kurang dari 1 menit!</li>
                    <li><strong>Melalui Terminal / VSCode:</strong> Jalankan perintah:
                      <div className="my-1.5 p-2.5 rounded-lg bg-slate-900 text-amber-300 font-mono text-xs">
                        git add . && git commit -m "Update informasi PPDB 2026" && git push
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          )}

          {/* TAB 1: KUSTOMISASI SEKOLAH */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveConfig} className="space-y-5">
              {saveAlert && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Perubahan data sekolah berhasil disimpan dan aktif di seluruh tampilan web!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nama Resmi Sekolah
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editConfig.name}
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Slogan / Sub-Nama
                  </label>
                  <input
                    type="text"
                    name="subName"
                    value={editConfig.subName}
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    NPSN & Akreditasi
                  </label>
                  <input
                    type="text"
                    name="accreditation"
                    value={editConfig.accreditation}
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    URL Google Apps Script Web App (Tujuan Pengiriman Form)
                  </label>
                  <input
                    type="url"
                    name="googleScriptUrl"
                    value={editConfig.googleScriptUrl}
                    onChange={handleConfigChange}
                    placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500">
                    Bila dikosongkan, website akan menggunakan sistem penyimpanan lokal browser otomatis (aman untuk testing & demonstrasi).
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    WhatsApp Panitia PPDB
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={editConfig.whatsapp}
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Telepon Kantor
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={editConfig.phone}
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nama Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    name="headmasterName"
                    value={editConfig.headmasterName}
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    NIP Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    name="headmasterNip"
                    value={editConfig.headmasterNip}
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tahun Ajaran PPDB
                  </label>
                  <input
                    type="text"
                    name="academicYear"
                    value={editConfig.academicYear}
                    onChange={handleConfigChange}
                    placeholder="2026/2027"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Sisa Kuota / Total Kuota
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="quotaRemaining"
                      value={editConfig.quotaRemaining}
                      onChange={handleConfigChange}
                      title="Sisa Kuota"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                    <input
                      type="number"
                      name="totalQuota"
                      value={editConfig.totalQuota}
                      onChange={handleConfigChange}
                      title="Total Kuota"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Foto Kepala Sekolah
                    </label>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingPhoto ? 'Memproses...' : 'Upload Foto'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/*"
                        onChange={handleHeadmasterPhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-16 rounded-lg overflow-hidden border border-slate-200 bg-emerald-950 shrink-0 flex items-center justify-center">
                      {editConfig.headmasterPhoto ? (
                        <img
                          src={editConfig.headmasterPhoto}
                          alt={editConfig.headmasterName}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <Image className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        name="headmasterPhoto"
                        value={editConfig.headmasterPhoto}
                        onChange={handleConfigChange}
                        placeholder="https://... atau /images/kepala-sekolah.jpg"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                      {photoUploadError && (
                        <p className="text-[11px] text-rose-600 font-semibold">{photoUploadError}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Kutipan Sambutan Resmi Kepala Sekolah
                  </label>
                  <textarea
                    rows={2}
                    name="headmasterQuote"
                    value={editConfig.headmasterQuote}
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Alamat Lengkap Sekolah
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editConfig.address}
                    onChange={handleConfigChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan Sekolah</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: KODE GOOGLE APPS SCRIPT */}
          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    Kode Apps Script Siap Pasang di Google Sheet
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Salin kode di bawah ini lalu tempelkan di menu Ekstensi &gt; Apps Script pada spreadsheet sekolah Anda.
                  </p>
                </div>
                <button
                  onClick={copyScriptToClipboard}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedScript ? 'Kode Disalin!' : 'Salin Kode Script'}</span>
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-200 font-mono text-xs p-4 max-h-96 overflow-y-auto">
                <pre>{googleScriptCode}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: PANDUAN DEPLOY & SEO */}
          {activeTab === 'guide' && (
            <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
              
              {/* Panduan 1: Google Sheets */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-700" />
                  <span>1. Cara Menghubungkan Formulir Web ke Google Sheets (Gratis Tanpa Biaya Server)</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1">
                  <li>Buka <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-semibold underline">Google Sheets</a> baru dengan akun Google sekolah Anda.</li>
                  <li>Beri nama sheet tersebut, misalnya: <em>PPDB SMA Bintang Cendekia 2026</em>.</li>
                  <li>Klik menu <strong>Ekstensi (Extensions)</strong> &gt; pilih <strong>Apps Script</strong>.</li>
                  <li>Hapus teks bawaan <code>function myFunction() ...</code>, lalu tempelkan seluruh kode dari tab <strong>Kode Google Apps Script</strong> di panel ini.</li>
                  <li>Klik tombol simpan (ikon disket).</li>
                  <li>Klik tombol biru <strong>Terapkan (Deploy)</strong> di pojok kanan atas &gt; pilih <strong>Deployment baru (New deployment)</strong>.</li>
                  <li>Pilih jenis (roda gigi): <strong>Aplikasi Web (Web App)</strong>.</li>
                  <li>Pada kolom <em>Akses (Who has access)</em>, ubah menjadi: <strong>Siapa saja (Anyone)</strong>.</li>
                  <li>Klik <strong>Terapkan</strong>, berikan izin akun Google Anda, lalu salin <strong>URL Aplikasi Web</strong> yang dihasilkan (berakhiran <code>/exec</code>).</li>
                  <li>Kembali ke website ini, buka tab <strong>Kustomisasi Sekolah</strong>, tempelkan URL tersebut ke kolom <em>URL Google Apps Script</em>, lalu klik Simpan. Selesai! Formulir sekarang otomatis menulis data ke sheet Anda.</li>
                </ol>
              </div>

              {/* Panduan 2: Deploy GitHub Pages */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-700" />
                  <span>2. Panduan Deploy Website ke GitHub Pages / Vercel (Hosting Gratis Cepat)</span>
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-1">
                  <li><strong>Metode Vercel / Netlify (Paling Mudah - 1 Menit):</strong> Sambungkan repository GitHub sekolah Anda ke <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-blue-700 font-semibold underline">Vercel</a> atau <a href="https://netlify.com" target="_blank" rel="noreferrer" className="text-blue-700 font-semibold underline">Netlify</a>. Build command adalah <code>npm run build</code> dan output directory <code>dist</code>. Otomatis aktif dengan sertifikat HTTPS gratis!</li>
                  <li><strong>Metode GitHub Pages:</strong> Tambahkan workflow <code>.github/workflows/deploy.yml</code> atau deploy folder <code>dist</code> ke branch <code>gh-pages</code>.</li>
                  <li><strong>Custom Domain Sekolah:</strong> Anda dapat menghubungkan domain resmi seperti <code>ppdb.bintangcendekia.sch.id</code> secara gratis dengan mengatur DNS CNAME ke Vercel/GitHub Pages.</li>
                </ul>
              </div>

              {/* Panduan 3: Manajemen Spreadsheet Real-time */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-teal-700" />
                  <span>3. Cara Mengelola Data Masuk & Verifikasi Status di Spreadsheet</span>
                </h4>
                <p className="text-slate-600">
                  Setiap kali ada pendaftar yang menekan "Kirim Pendaftaran", data langsung bertambah sebagai baris baru pada tab <code>Data_PPDB_2026</code>. Panitia dapat mengubah kolom <strong>Status Verifikasi</strong> secara langsung (misalnya diubah menjadi <em>"Lolos Verifikasi"</em> atau <em>"Diterima"</em>) serta menambahkan catatan pada kolom <strong>Catatan Petugas</strong>.
                </p>
              </div>

              {/* Panduan 4: Optimasi SEO */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Search className="w-4 h-4 text-amber-700" />
                  <span>4. Tips Mengoptimalkan SEO Dasar Sekolah di Google</span>
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-1">
                  <li>Pastikan nama kota, kecamatan, dan jenjang (misal: "PPDB SMA Jakarta Timur 2026/2027") tercantum pada judul dan slogan sekolah.</li>
                  <li>Daftarkan profil sekolah di <strong>Google Business Profile (Google Maps)</strong> dengan tautan ke website ini untuk meningkatkan peringkat pencarian lokal.</li>
                  <li>Bagikan tautan kartu pendaftaran dan website di grup WhatsApp alumni SMP/MTs sasaran serta media sosial Instagram/Facebook sekolah.</li>
                </ul>
              </div>

            </div>
          )}

          {/* TAB 4: DAFTAR PENDAFTAR (MINI ADMIN TABLE) */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Data Pendaftar PPDB yang Masuk ({applicants.length} Calon Siswa)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Ubah status secara langsung di sini untuk simulasi verifikasi real-time calon siswa.
                  </p>
                </div>
                <button
                  onClick={exportApplicantsToCsv}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ekspor Data ke Excel/CSV</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white shadow-xs">
                <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="p-3">No. Pendaftaran</th>
                      <th className="p-3">Nama Siswa</th>
                      <th className="p-3">NISN</th>
                      <th className="p-3">Jalur & Jurusan</th>
                      <th className="p-3">WhatsApp</th>
                      <th className="p-3">Ubah Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applicants.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 font-mono font-bold text-emerald-800">{a.registrationNumber}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{a.fullName}</div>
                          <div className="text-[10px] text-slate-400">{a.schoolOrigin}</div>
                        </td>
                        <td className="p-3 font-mono text-slate-600">{a.nisn}</td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-800">{a.path}</span>
                          <span className="block text-[10px] text-slate-500 line-clamp-1">{a.major}</span>
                        </td>
                        <td className="p-3 font-mono text-slate-600">{a.whatsapp}</td>
                        <td className="p-3">
                          <select
                            value={a.status}
                            onChange={(e) => onUpdateApplicantStatus(a.id, e.target.value as any)}
                            className="text-xs p-1 rounded border border-slate-300 bg-white font-medium focus:ring-1 focus:ring-emerald-600"
                          >
                            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                            <option value="Sedang Ditinjau">Sedang Ditinjau</option>
                            <option value="Lolos Verifikasi">Lolos Verifikasi</option>
                            <option value="Diterima">Diterima</option>
                            <option value="Berkas Perlu Dilengkapi">Berkas Perlu Dilengkapi</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
