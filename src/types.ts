export interface SchoolConfig {
  name: string;
  subName: string;
  level: string; // e.g. "SMA / MA" atau "SMK" atau "SMP"
  slogan: string;
  npsn: string;
  accreditation: string;
  address: string;
  district: string;
  city: string;
  province: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  googleMapsEmbedUrl: string;
  headmasterName: string;
  headmasterTitle: string;
  headmasterNip: string;
  headmasterQuote: string;
  headmasterPhoto: string;
  academicYear: string;
  registrationOpen: boolean;
  quotaRemaining: number;
  totalQuota: number;
  googleScriptUrl: string; // Google Apps Script Web App URL
}

export interface Applicant {
  id: string;
  registrationNumber: string;
  path: 'Prestasi' | 'Reguler' | 'Tahfidz Al-Qur\'an' | 'Afirmasi';
  major: string;
  fullName: string;
  nisn: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  religion: string;
  address: string;
  schoolOrigin: string;
  fatherName: string;
  fatherJob: string;
  motherName: string;
  motherJob: string;
  whatsapp: string;
  parentIncome: string;
  photoUrl?: string;
  status: 'Menunggu Verifikasi' | 'Sedang Ditinjau' | 'Lolos Verifikasi' | 'Diterima' | 'Berkas Perlu Dilengkapi' | 'Tidak Memenuhi Syarat';
  verificationNotes?: string;
  interviewDate?: string;
  createdAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'Pengumuman PPDB' | 'Prestasi' | 'Akademik' | 'Kegiatan Siswa';
  date: string;
  readTime: string;
  excerpt: string;
  content: string[];
  imageUrl: string;
  author: string;
  featured?: boolean;
}

export interface ProgramItem {
  id: string;
  title: string;
  category: 'Akademik Unggulan' | 'Karakter & Keagamaan' | 'Ekstrakurikuler' | 'Fasilitas Kampus';
  description: string;
  highlights: string[];
  icon: string;
}

export interface ScheduleItem {
  step: number;
  title: string;
  period: string;
  description: string;
  badge: string;
  isCurrent?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}
