import { useState, ChangeEvent, FormEvent } from 'react';
import { SchoolConfig, Applicant } from '../types';
import { 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Users, 
  GraduationCap, 
  FileCheck, 
  Loader2, 
  AlertCircle,
  Upload,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { generateRegistrationNumber } from '../utils/storage';

interface PpdbFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolConfig;
  allApplicants: Applicant[];
  onSubmitSuccess: (newApplicant: Applicant) => void;
}

export function PpdbFormModal({
  isOpen,
  onClose,
  school,
  allApplicants,
  onSubmitSuccess
}: PpdbFormModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Jalur & Jurusan
    path: 'Prestasi' as 'Prestasi' | 'Reguler' | 'Tahfidz Al-Qur\'an' | 'Afirmasi',
    major: 'MIPA (Ilmu Pengetahuan Alam & Riset)',
    
    // Step 2: Data Calon Siswa
    fullName: '',
    nisn: '',
    nik: '',
    birthPlace: '',
    birthDate: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    religion: 'Islam',
    address: '',
    schoolOrigin: '',

    // Step 3: Data Orang Tua / Wali
    fatherName: '',
    fatherJob: '',
    motherName: '',
    motherJob: '',
    whatsapp: '',
    parentIncome: 'Rp 3.000.000 - Rp 5.000.000',

    // Step 4: Berkas & Pernyataan
    photoPreviewUrl: '',
    agreementConfirmed: false,
  });

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran foto maksimal 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoPreviewUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step: number): boolean => {
    setSubmitError(null);
    if (step === 1) {
      if (!formData.path || !formData.major) {
        setSubmitError('Silakan pilih Jalur Pendaftaran dan Pilihan Jurusan.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.fullName.trim()) {
        setSubmitError('Nama Lengkap calon siswa wajib diisi.');
        return false;
      }
      if (!formData.nisn.trim() || formData.nisn.length < 10) {
        setSubmitError('NISN wajib diisi lengkap 10 digit angka.');
        return false;
      }
      if (!formData.nik.trim() || formData.nik.length < 16) {
        setSubmitError('NIK wajib diisi lengkap 16 digit angka sesuai Kartu Keluarga.');
        return false;
      }
      if (!formData.birthPlace.trim() || !formData.birthDate) {
        setSubmitError('Tempat dan Tanggal Lahir wajib diisi.');
        return false;
      }
      if (!formData.address.trim()) {
        setSubmitError('Alamat lengkap tempat tinggal siswa wajib diisi.');
        return false;
      }
      if (!formData.schoolOrigin.trim()) {
        setSubmitError('Asal Sekolah (SMP/MTs) wajib diisi.');
        return false;
      }
    } else if (step === 3) {
      if (!formData.fatherName.trim() && !formData.motherName.trim()) {
        setSubmitError('Minimal salah satu nama orang tua (Ayah/Ibu) wajib diisi.');
        return false;
      }
      if (!formData.whatsapp.trim() || formData.whatsapp.length < 10) {
        setSubmitError('Nomor WhatsApp aktif wajib diisi (minimal 10 digit) untuk menerima verifikasi.');
        return false;
      }
    } else if (step === 4) {
      if (!formData.agreementConfirmed) {
        setSubmitError('Anda wajib mencentang pernyataan kebenaran data sebelum mengirim pendaftaran.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setSubmitError(null);
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const generatedRegNum = generateRegistrationNumber(allApplicants);
    const newApplicant: Applicant = {
      id: `app-${Date.now()}`,
      registrationNumber: generatedRegNum,
      path: formData.path,
      major: formData.major,
      fullName: formData.fullName.trim(),
      nisn: formData.nisn.trim(),
      nik: formData.nik.trim(),
      birthPlace: formData.birthPlace.trim(),
      birthDate: formData.birthDate,
      gender: formData.gender,
      religion: formData.religion,
      address: formData.address.trim(),
      schoolOrigin: formData.schoolOrigin.trim(),
      fatherName: formData.fatherName.trim() || '-',
      fatherJob: formData.fatherJob.trim() || '-',
      motherName: formData.motherName.trim() || '-',
      motherJob: formData.motherJob.trim() || '-',
      whatsapp: formData.whatsapp.trim(),
      parentIncome: formData.parentIncome,
      photoUrl: formData.photoPreviewUrl || undefined,
      status: 'Menunggu Verifikasi',
      verificationNotes: 'Formulir online berhasil diterima. Berkas sedang dalam antrean verifikasi panitia.',
      createdAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
    };

    // Kirim ke Google Apps Script Web App jika URL telah dipasang oleh pengelola sekolah
    if (school.googleScriptUrl && school.googleScriptUrl.trim().startsWith('http')) {
      try {
        await fetch(school.googleScriptUrl.trim(), {
          method: 'POST',
          mode: 'no-cors', // Penting untuk menghindari CORS blokir dari Apps Script Web App
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registrationNumber: generatedRegNum,
            path: formData.path,
            major: formData.major,
            fullName: formData.fullName,
            nisn: formData.nisn,
            nik: formData.nik,
            birthPlace: formData.birthPlace,
            birthDate: formData.birthDate,
            gender: formData.gender,
            religion: formData.religion,
            address: formData.address,
            schoolOrigin: formData.schoolOrigin,
            fatherName: formData.fatherName,
            fatherJob: formData.fatherJob,
            motherName: formData.motherName,
            motherJob: formData.motherJob,
            whatsapp: formData.whatsapp,
            parentIncome: formData.parentIncome,
            createdAt: newApplicant.createdAt,
          })
        });
        console.log('Successfully dispatched to Google Sheets Web App endpoint');
      } catch (scriptErr) {
        console.warn('Google Apps Script POST notice:', scriptErr);
        // Tetap lanjut menyimpan lokal agar calon pendaftar tidak kehilangan data
      }
    }

    // Simulasi delay realistis untuk feedback pengguna
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitSuccess(newApplicant);
    }, 900);
  };

  const steps = [
    { number: 1, title: 'Jalur & Jurusan', icon: GraduationCap },
    { number: 2, title: 'Data Calon Siswa', icon: User },
    { number: 3, title: 'Data Orang Tua', icon: Users },
    { number: 4, title: 'Foto & Verifikasi', icon: FileCheck },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header Modal */}
        <div className="bg-emerald-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Formulir PPDB Online {school.academicYear}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Pendaftaran Siswa Baru
            </h2>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              {school.name} · Silakan lengkapi tahapan berikut secara cermat
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
            aria-label="Tutup Formulir"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 sm:px-6">
          <div className="grid grid-cols-4 gap-2">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = currentStep === s.number;
              const isPast = currentStep > s.number;
              return (
                <div
                  key={s.number}
                  className={`flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-center sm:text-left p-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-emerald-100/70 text-emerald-950 font-bold' 
                      : isPast 
                      ? 'text-slate-600 font-medium' 
                      : 'text-slate-400'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    isActive 
                      ? 'bg-emerald-700 text-white' 
                      : isPast 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isPast ? <Check className="w-3.5 h-3.5" /> : s.number}
                  </div>
                  <span className="text-[11px] sm:text-xs line-clamp-1">
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Error Banner */}
          {submitError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* STEP 1: JALUR & JURUSAN */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Langkah 1: Pilihan Jalur & Minat Jurusan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tentukan jalur pendaftaran yang sesuai dengan keunggulan akademik atau non-akademik siswa.
                </p>
              </div>

              {/* Jalur Selector Cards */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pilih Jalur Pendaftaran <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'Prestasi', title: 'Jalur Prestasi', desc: 'Rapor rata-rata 85+ atau sertifikat kejuaraan resmi' },
                    { id: 'Tahfidz Al-Qur\'an', title: 'Jalur Beasiswa Tahfidz', desc: 'Hafalan Al-Qur’an minimal 3 Juz mutqin bersyahadah' },
                    { id: 'Reguler', title: 'Jalur Reguler', desc: 'Terbuka bagi seluruh lulusan SMP/MTs sederajat' },
                    { id: 'Afirmasi', title: 'Jalur Afirmasi', desc: 'Pemegang KIP/PKH/SKTM dari keluarga prasejahtera' },
                  ].map((track) => (
                    <label
                      key={track.id}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        formData.path === track.id
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="path"
                        value={track.id}
                        checked={formData.path === track.id}
                        onChange={handleChange}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-900">{track.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{track.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pilihan Jurusan */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pilihan Peminatan / Jurusan Utama <span className="text-rose-500">*</span>
                </label>
                <select
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                >
                  <option value="MIPA (Ilmu Pengetahuan Alam & Riset)">MIPA (Ilmu Pengetahuan Alam & Riset)</option>
                  <option value="IPS (Ilmu Sosial & Kewirausahaan)">IPS (Ilmu Sosial & Kewirausahaan)</option>
                  <option value="Kejuruan Rekayasa Perangkat Lunak & AI">Kejuruan Rekayasa Perangkat Lunak & AI</option>
                  <option value="Bilingual Cambridge Science Class">Bilingual Cambridge Science Class</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Peminatan akan dimatangkan lebih lanjut melalui tes pemetaan gaya belajar dan minat bakat.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: DATA CALON SISWA */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Langkah 2: Biodata Calon Siswa Baru
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Isikan data sesuai dengan Akta Kelahiran dan Kartu Keluarga yang berlaku.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama Lengkap */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nama Lengkap Siswa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Contoh: Muhammad Raihan Pratama"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                {/* NISN */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    NISN (10 Digit) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nisn"
                    maxLength={10}
                    value={formData.nisn}
                    onChange={(e) => setFormData(prev => ({ ...prev, nisn: e.target.value.replace(/[^0-9]/g, '') }))}
                    placeholder="Contoh: 0071234567"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Nomor Induk Siswa Nasional dari SMP asal</span>
                </div>

                {/* NIK */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    NIK KTP / Kartu Keluarga (16 Digit) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nik"
                    maxLength={16}
                    value={formData.nik}
                    onChange={(e) => setFormData(prev => ({ ...prev, nik: e.target.value.replace(/[^0-9]/g, '') }))}
                    placeholder="Contoh: 3175011204090001"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                {/* Tempat Lahir */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tempat Lahir <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleChange}
                    placeholder="Contoh: Jakarta"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                {/* Tanggal Lahir */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tanggal Lahir <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                {/* Jenis Kelamin */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Jenis Kelamin <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Laki-laki', 'Perempuan'].map((g) => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setFormData(prev => ({ ...prev, gender: g as any }))}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border cursor-pointer transition-all ${
                          formData.gender === g
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Agama */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Agama <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen Protestan">Kristen Protestan</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>

                {/* Asal Sekolah */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Asal Sekolah (SMP / MTs / Pesantren) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="schoolOrigin"
                    value={formData.schoolOrigin}
                    onChange={handleChange}
                    placeholder="Contoh: SMP Negeri 103 Jakarta / MTs Al-Azhar"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                {/* Alamat Lengkap */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Alamat Lengkap Tempat Tinggal <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Nama Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten, Kode Pos"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DATA ORANG TUA / WALI */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Langkah 3: Data Orang Tua / Wali Siswa
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Informasi kontak yang dapat dihubungi panitia untuk jadwal wawancara dan pengumuman.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama Ayah */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nama Ayah / Wali
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    placeholder="Contoh: Bambang Pratama"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Pekerjaan Ayah */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pekerjaan Ayah / Wali
                  </label>
                  <input
                    type="text"
                    name="fatherJob"
                    value={formData.fatherJob}
                    onChange={handleChange}
                    placeholder="Contoh: Karyawan Swasta / Wiraswasta"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Nama Ibu */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nama Ibu Kandung
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    placeholder="Contoh: Dewi Rahmawati"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Pekerjaan Ibu */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pekerjaan Ibu
                  </label>
                  <input
                    type="text"
                    name="motherJob"
                    value={formData.motherJob}
                    onChange={handleChange}
                    placeholder="Contoh: PNS / Guru / Ibu Rumah Tangga"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* No WhatsApp */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    No. WhatsApp Aktif Orang Tua / Siswa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value.replace(/[^0-9]/g, '') }))}
                    placeholder="Contoh: 081234567890 (Wajib aktif WhatsApp)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                  <span className="text-[11px] text-slate-500">
                    Notifikasi verifikasi dan link kartu ujian akan dikirimkan ke nomor ini.
                  </span>
                </div>

                {/* Rata-rata Penghasilan */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Rentang Penghasilan Gabungan Orang Tua per Bulan
                  </label>
                  <select
                    name="parentIncome"
                    value={formData.parentIncome}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="Kurang dari Rp 1.500.000">&lt; Rp 1.500.000</option>
                    <option value="Rp 1.500.000 - Rp 3.000.000">Rp 1.500.000 - Rp 3.000.000</option>
                    <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                    <option value="Rp 5.000.000 - Rp 10.000.000">Rp 5.000.000 - Rp 10.000.000</option>
                    <option value="Lebih dari Rp 10.000.000">&gt; Rp 10.000.000</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PAS FOTO & PERNYATAAN */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  Langkah 4: Unggah Pas Foto & Konfirmasi Pendaftaran
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Foto akan dicetak langsung pada Kartu Bukti Pendaftaran peserta.
                </p>
              </div>

              {/* Photo Upload Area */}
              <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 transition-colors bg-slate-50 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-24 h-32 rounded-lg border-2 border-slate-300 bg-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                  {formData.photoPreviewUrl ? (
                    <img
                      src={formData.photoPreviewUrl}
                      alt="Pas Foto Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2 text-slate-400">
                      <User className="w-8 h-8 mx-auto" />
                      <span className="text-[10px] block mt-1">Foto 3x4</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-xs">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pilih Berkas Foto Siswa</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Format file JPG / PNG, latar belakang merah atau biru, ukuran maksimal 2MB. (Opsional, foto juga dapat diserahkan saat verifikasi fisik).
                  </p>
                </div>
              </div>

              {/* Review Ringkasan Singkat */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2 text-xs">
                <div className="font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Ringkasan Data Pendaftaran</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700 pt-1">
                  <div>
                    <span className="text-slate-500 block">Jalur:</span>
                    <strong className="text-slate-900">{formData.path}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Peminatan:</span>
                    <strong className="text-slate-900 line-clamp-1">{formData.major}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">NISN:</span>
                    <strong className="font-mono text-slate-900">{formData.nisn || '-'}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block">Nama Siswa:</span>
                    <strong className="text-slate-900">{formData.fullName || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">WhatsApp:</span>
                    <strong className="font-mono text-slate-900">{formData.whatsapp || '-'}</strong>
                  </div>
                </div>
              </div>

              {/* Pernyataan Kebenaran Data */}
              <label className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer flex items-start gap-3 transition-colors">
                <input
                  type="checkbox"
                  name="agreementConfirmed"
                  checked={formData.agreementConfirmed}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                />
                <div className="text-xs text-slate-700 leading-relaxed">
                  Saya menyatakan dengan sesungguhnya bahwa seluruh isian data dan dokumen yang saya berikan adalah <strong>benar dan dapat dipertanggungjawabkan</strong>. Apabila di kemudian hari ditemukan pemalsuan data, saya bersedia menerima sanksi pembatalan kelulusan sesuai ketentuan yang berlaku.
                </div>
              </label>

              {school.googleScriptUrl ? (
                <div className="text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Formulir ini terhubung langsung ke Google Sheets resmi sekolah.</span>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Mode Penyimpanan Terpadu Aktif (Data tersimpan di sistem & dapat dicetak instan).</span>
                </div>
              )}
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                <span>Langkah Selanjutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-xl transition-all cursor-pointer shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Menyimpan ke Sistem...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Kirim & Terbitkan No. Pendaftaran</span>
                  </>
                )}
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
}
