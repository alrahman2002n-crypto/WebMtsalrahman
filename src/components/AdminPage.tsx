import { useState, ChangeEvent, FormEvent, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  CartesianGrid 
} from 'recharts';
import { 
  SchoolConfig, 
  Applicant, 
  NewsItem, 
  ScheduleItem, 
  ProgramItem, 
  FaqItem 
} from '../types';
import { 
  ArrowLeft, 
  Sliders, 
  Users, 
  Newspaper, 
  Calendar, 
  HelpCircle, 
  Database, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Download, 
  CheckCircle2, 
  Search, 
  Printer, 
  MessageSquare, 
  Lock, 
  Unlock, 
  X, 
  FileCode, 
  Copy, 
  Check, 
  GraduationCap, 
  Eye, 
  Clock, 
  AlertTriangle,
  UserPlus,
  BarChart3,
  TrendingUp,
  Activity,
  Award,
  BookMarked,
  ShieldAlert,
  Layers,
  Globe,
  Upload,
  Image as ImageIcon,
  MapPin
} from 'lucide-react';
import { createWhatsAppUrl, generateRegistrationNumber, processImageUpload } from '../utils/storage';
import { AdminSummaryDashboard } from './AdminSummaryDashboard';
import { AdminDeployGuide } from './AdminDeployGuide';

interface AdminPageProps {
  school: SchoolConfig;
  onUpdateSchool: (config: SchoolConfig) => void;
  applicants: Applicant[];
  onUpdateApplicantStatus: (id: string, status: Applicant['status'], notes?: string) => void;
  onAddManualApplicant: (applicant: Applicant) => void;
  news: NewsItem[];
  onUpdateNews: (news: NewsItem[]) => void;
  schedules: ScheduleItem[];
  onUpdateSchedules: (schedules: ScheduleItem[]) => void;
  programs: ProgramItem[];
  onUpdatePrograms: (programs: ProgramItem[]) => void;
  faqs: FaqItem[];
  onUpdateFaqs: (faqs: FaqItem[]) => void;
  onPrintCard: (applicant: Applicant) => void;
  onBackToWebsite: () => void;
  currentPassword?: string;
  onUpdatePassword?: (newPassword: string) => void;
}

export function AdminPage({
  school,
  onUpdateSchool,
  applicants,
  onUpdateApplicantStatus,
  onAddManualApplicant,
  news,
  onUpdateNews,
  schedules,
  onUpdateSchedules,
  programs,
  onUpdatePrograms,
  faqs,
  onUpdateFaqs,
  onPrintCard,
  onBackToWebsite,
  currentPassword = 'admin123',
  onUpdatePassword,
}: AdminPageProps) {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'summary' | 'applicants' | 'school' | 'news' | 'schedules' | 'faqs' | 'sheets' | 'deploy'>('summary');

  // School form edit state
  const [schoolForm, setSchoolForm] = useState<SchoolConfig>(school);
  const [schoolSaveNotice, setSchoolSaveNotice] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [pwSaveNotice, setPwSaveNotice] = useState(false);

  // Applicant search & filters
  const [applicantSearch, setApplicantSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [trackFilter, setTrackFilter] = useState('Semua');
  const [selectedApplicantDetail, setSelectedApplicantDetail] = useState<Applicant | null>(null);

  // 1. Enrollment Path Chart Data (Applicants per Track)
  const pathChartData = useMemo(() => {
    const counts: Record<string, number> = {
      'Prestasi': 0,
      'Tahfidz Al-Qur\'an': 0,
      'Reguler': 0,
      'Afirmasi': 0,
    };
    applicants.forEach(a => {
      const track = a.path || 'Reguler';
      counts[track] = (counts[track] || 0) + 1;
    });

    const colors: Record<string, string> = {
      'Prestasi': '#d97706', // amber-600
      'Tahfidz Al-Qur\'an': '#059669', // emerald-600
      'Reguler': '#2563eb', // blue-600
      'Afirmasi': '#9333ea', // purple-600
    };

    return Object.entries(counts).map(([name, count]) => ({
      name,
      pendaftar: count,
      color: colors[name] || '#059669',
      persentase: applicants.length > 0 ? Math.round((count / applicants.length) * 100) : 0,
    }));
  }, [applicants]);

  // 2. Application Status Chart Data (Applicants per Status)
  const statusChartData = useMemo(() => {
    const counts: Record<string, number> = {
      'Menunggu Verifikasi': 0,
      'Sedang Ditinjau': 0,
      'Lolos Verifikasi': 0,
      'Diterima': 0,
      'Berkas Perlu Dilengkapi': 0,
    };
    applicants.forEach(a => {
      const st = a.status || 'Menunggu Verifikasi';
      counts[st] = (counts[st] || 0) + 1;
    });

    return [
      { name: 'Menunggu Verifikasi', shortName: 'Menunggu', count: counts['Menunggu Verifikasi'], color: '#f59e0b' },
      { name: 'Sedang Ditinjau', shortName: 'Ditinjau', count: counts['Sedang Ditinjau'], color: '#3b82f6' },
      { name: 'Lolos Verifikasi', shortName: 'Lolos', count: counts['Lolos Verifikasi'], color: '#0d9488' },
      { name: 'Diterima', shortName: 'Diterima', count: counts['Diterima'], color: '#059669' },
      { name: 'Berkas Perlu Dilengkapi', shortName: 'Perlu Lengkapi', count: counts['Berkas Perlu Dilengkapi'], color: '#e11d48' },
    ];
  }, [applicants]);

  // 3. Application Timeline Over Time
  const timelineChartData = useMemo(() => {
    const dateMap: Record<string, { date: string; displayDate: string; harian: number; lolos: number; diterima: number; menunggu: number }> = {};

    applicants.forEach(a => {
      let rawDate = '2026-01-10';
      if (a.createdAt) {
        const match = a.createdAt.match(/(\d{4}-\d{2}-\d{2})/) || a.createdAt.match(/(\d{1,2}\s+[A-Za-z]+)/);
        if (match) {
          rawDate = match[1];
        } else {
          rawDate = a.createdAt.slice(0, 10);
        }
      }

      if (!dateMap[rawDate]) {
        dateMap[rawDate] = {
          date: rawDate,
          displayDate: rawDate.replace('2026-', '').replace(/^0/, ''),
          harian: 0,
          lolos: 0,
          diterima: 0,
          menunggu: 0,
        };
      }

      dateMap[rawDate].harian += 1;
      if (a.status === 'Diterima') dateMap[rawDate].diterima += 1;
      else if (a.status === 'Lolos Verifikasi') dateMap[rawDate].lolos += 1;
      else dateMap[rawDate].menunggu += 1;
    });

    const sortedDates = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
    let runningTotal = 0;

    return sortedDates.map(item => {
      runningTotal += item.harian;
      return {
        ...item,
        kumulatif: runningTotal,
      };
    });
  }, [applicants]);

  // 4. Major Preferences
  const majorChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    applicants.forEach(a => {
      const simplified = a.major.split('(')[0].trim();
      counts[simplified] = (counts[simplified] || 0) + 1;
    });
    return Object.entries(counts).map(([name, total]) => ({
      name,
      total,
      persen: applicants.length > 0 ? Math.round((total / applicants.length) * 100) : 0,
    })).sort((a, b) => b.total - a.total);
  }, [applicants]);

  // Manual Applicant Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    fullName: '',
    nisn: '',
    nik: '',
    birthPlace: '',
    birthDate: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    religion: 'Islam',
    path: 'Reguler' as Applicant['path'],
    major: 'MIPA (Ilmu Pengetahuan Alam & Riset)',
    schoolOrigin: '',
    fatherName: '',
    motherName: '',
    whatsapp: '',
    address: '',
    notes: 'Pendaftar luring / offline di sekretariat sekolah'
  });

  // News Modal (Add / Edit)
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState<Partial<NewsItem>>({
    title: '',
    category: 'Pengumuman PPDB',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    readTime: '3 menit baca',
    excerpt: '',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    author: 'Panitia PPDB',
    content: [''],
    featured: false
  });

  // Schedule Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingScheduleStep, setEditingScheduleStep] = useState<number | null>(null);
  const [scheduleForm, setScheduleForm] = useState<ScheduleItem>({
    step: schedules.length + 1,
    title: '',
    period: '',
    description: '',
    badge: 'Jadwal PPDB',
    isCurrent: false
  });

  // FAQ Modal
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqForm, setFaqForm] = useState<FaqItem>({
    category: 'Persyaratan & Jalur',
    question: '',
    answer: ''
  });

  // Copy script state
  const [copiedScript, setCopiedScript] = useState(false);

  // Statistics calculation
  const totalApplicants = applicants.length;
  const waitingApplicants = applicants.filter(a => a.status === 'Menunggu Verifikasi').length;
  const reviewingApplicants = applicants.filter(a => a.status === 'Sedang Ditinjau').length;
  const verifiedApplicants = applicants.filter(a => a.status === 'Lolos Verifikasi').length;
  const acceptedApplicants = applicants.filter(a => a.status === 'Diterima').length;

  // Filter applicants
  const filteredApplicants = applicants.filter(a => {
    const matchesQuery = 
      a.fullName.toLowerCase().includes(applicantSearch.toLowerCase()) ||
      a.registrationNumber.toLowerCase().includes(applicantSearch.toLowerCase()) ||
      a.nisn.includes(applicantSearch) ||
      a.schoolOrigin.toLowerCase().includes(applicantSearch.toLowerCase());
    
    const matchesStatus = statusFilter === 'Semua' || a.status === statusFilter;
    const matchesTrack = trackFilter === 'Semua' || a.path === trackFilter;

    return matchesQuery && matchesStatus && matchesTrack;
  });

  // Save School Config
  const handleSaveSchool = (e: FormEvent) => {
    e.preventDefault();
    onUpdateSchool(schoolForm);
    setSchoolSaveNotice(true);
    setTimeout(() => setSchoolSaveNotice(false), 2500);
  };

  const handleHeadmasterPhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploadError(null);
    setIsUploadingPhoto(true);
    try {
      const dataUrl = await processImageUpload(file, 720);
      setSchoolForm(prev => ({ ...prev, headmasterPhoto: dataUrl }));
    } catch (err: any) {
      setPhotoUploadError(err?.message || 'Gagal mengunggah foto.');
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleGoogleMapsInputChange = (rawValue: string) => {
    const trimmed = rawValue.trim();
    const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
    const extractedUrl = iframeMatch ? iframeMatch[1] : trimmed;
    setSchoolForm(prev => ({ ...prev, googleMapsEmbedUrl: extractedUrl }));
  };

  const handleGenerateMapFromAddress = () => {
    const query = [schoolForm.name, schoolForm.address, schoolForm.district, schoolForm.city, schoolForm.province]
      .filter(Boolean)
      .join(', ');
    const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    setSchoolForm(prev => ({ ...prev, googleMapsEmbedUrl: embedUrl }));
  };

  // Submit Manual Applicant
  const handleManualApplicantSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!manualForm.fullName || !manualForm.nisn || !manualForm.whatsapp) {
      alert('Nama, NISN, dan Nomor WhatsApp wajib diisi.');
      return;
    }

    const regNum = generateRegistrationNumber(applicants);
    const newApp: Applicant = {
      id: `app-${Date.now()}`,
      registrationNumber: regNum,
      fullName: manualForm.fullName.trim(),
      nisn: manualForm.nisn.trim(),
      nik: manualForm.nik.trim() || '3175000000000000',
      birthPlace: manualForm.birthPlace.trim() || 'Jakarta',
      birthDate: manualForm.birthDate || '2009-01-01',
      gender: manualForm.gender,
      religion: manualForm.religion,
      path: manualForm.path,
      major: manualForm.major,
      schoolOrigin: manualForm.schoolOrigin.trim() || 'SMP Pendaftar',
      address: manualForm.address.trim() || 'Alamat pendaftar offline',
      fatherName: manualForm.fatherName.trim() || '-',
      fatherJob: '-',
      motherName: manualForm.motherName.trim() || '-',
      motherJob: '-',
      whatsapp: manualForm.whatsapp.trim(),
      parentIncome: 'Rp 3.000.000 - Rp 5.000.000',
      status: 'Lolos Verifikasi',
      verificationNotes: manualForm.notes || 'Pendaftaran diverifikasi di sekretariat',
      createdAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
    };

    onAddManualApplicant(newApp);
    setIsManualModalOpen(false);
    setManualForm({
      fullName: '',
      nisn: '',
      nik: '',
      birthPlace: '',
      birthDate: '',
      gender: 'Laki-laki',
      religion: 'Islam',
      path: 'Reguler',
      major: 'MIPA (Ilmu Pengetahuan Alam & Riset)',
      schoolOrigin: '',
      fatherName: '',
      motherName: '',
      whatsapp: '',
      address: '',
      notes: ''
    });
  };

  // News Actions
  const handleOpenAddNews = () => {
    setEditingNewsId(null);
    setNewsForm({
      title: '',
      category: 'Pengumuman PPDB',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime: '3 menit baca',
      excerpt: '',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
      author: 'Panitia PPDB',
      content: [''],
      featured: false
    });
    setIsNewsModalOpen(true);
  };

  const handleOpenEditNews = (item: NewsItem) => {
    setEditingNewsId(item.id);
    setNewsForm({ ...item });
    setIsNewsModalOpen(true);
  };

  const handleSaveNews = (e: FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.excerpt) {
      alert('Judul dan ringkasan berita wajib diisi.');
      return;
    }

    if (editingNewsId) {
      const updated = news.map(n => n.id === editingNewsId ? ({ ...n, ...newsForm } as NewsItem) : n);
      onUpdateNews(updated);
    } else {
      const newItem: NewsItem = {
        id: `news-${Date.now()}`,
        title: newsForm.title || 'Pengumuman Sekolah',
        category: newsForm.category as any || 'Pengumuman PPDB',
        date: newsForm.date || 'Hari ini',
        readTime: newsForm.readTime || '3 menit',
        excerpt: newsForm.excerpt || '',
        imageUrl: newsForm.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
        author: newsForm.author || 'Admin Sekolah',
        content: Array.isArray(newsForm.content) ? newsForm.content : [newsForm.excerpt || ''],
        featured: newsForm.featured || false
      };
      onUpdateNews([newItem, ...news]);
    }
    setIsNewsModalOpen(false);
  };

  const handleDeleteNews = (id: string) => {
    if (confirm('Yakin ingin menghapus berita ini?')) {
      onUpdateNews(news.filter(n => n.id !== id));
    }
  };

  // Schedule Actions
  const handleOpenEditSchedule = (item: ScheduleItem) => {
    setEditingScheduleStep(item.step);
    setScheduleForm({ ...item });
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = (e: FormEvent) => {
    e.preventDefault();
    if (editingScheduleStep !== null) {
      const updated = schedules.map(s => s.step === editingScheduleStep ? scheduleForm : s);
      onUpdateSchedules(updated);
    } else {
      onUpdateSchedules([...schedules, scheduleForm]);
    }
    setIsScheduleModalOpen(false);
  };

  // FAQ Actions
  const handleSaveFaq = (e: FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) return;
    onUpdateFaqs([...faqs, faqForm]);
    setIsFaqModalOpen(false);
    setFaqForm({ category: 'Persyaratan & Jalur', question: '', answer: '' });
  };

  const handleDeleteFaq = (index: number) => {
    if (confirm('Hapus tanya jawab ini?')) {
      onUpdateFaqs(faqs.filter((_, idx) => idx !== index));
    }
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = ['No. Registrasi', 'Nama Lengkap', 'NISN', 'NIK', 'Jalur', 'Jurusan', 'Asal Sekolah', 'No. WhatsApp', 'Status', 'Catatan'];
    const rows = filteredApplicants.map(a => [
      `"${a.registrationNumber}"`,
      `"${a.fullName}"`,
      `"${a.nisn}"`,
      `"${a.nik}"`,
      `"${a.path}"`,
      `"${a.major}"`,
      `"${a.schoolOrigin}"`,
      `"${a.whatsapp}"`,
      `"${a.status}"`,
      `"${a.verificationNotes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Rekap_PPDB_${school.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const googleScriptCode = `/**
 * GOOGLE APPS SCRIPT WEBHOOK PPDB
 * Simpan di Google Sheets: Ekstensi > Apps Script
 */
var SHEET_NAME = "Data_PPDB_2026";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["Waktu", "No. Pendaftaran", "Jalur", "Jurusan", "Nama Lengkap", "NISN", "NIK", "TTL", "JK", "Agama", "Alamat", "Asal Sekolah", "Ayah", "Pekerjaan Ayah", "Ibu", "Pekerjaan Ibu", "WhatsApp", "Penghasilan", "Status", "Catatan"]);
      sheet.getRange(1, 1, 1, 20).setFontWeight("bold").setBackground("#059669").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }
    var data = {};
    if (e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch(err) { data = e.parameter || {}; }
    } else { data = e.parameter || {}; }
    var timestamp = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
    var regNumber = data.registrationNumber || ("PPDB-2026-" + Math.floor(1000 + Math.random() * 9000));
    sheet.appendRow([timestamp, regNumber, data.path || "-", data.major || "-", data.fullName || "-", "'" + (data.nisn || "-"), "'" + (data.nik || "-"), (data.birthPlace || "") + ", " + (data.birthDate || ""), data.gender || "-", data.religion || "-", data.address || "-", data.schoolOrigin || "-", data.fatherName || "-", data.fatherJob || "-", data.motherName || "-", data.motherJob || "-", "'" + (data.whatsapp || "-"), data.parentIncome || "-", "Menunggu Verifikasi", "Terdaftar dari web"]);
    return ContentService.createTextOutput(JSON.stringify({ status: "success", registrationNumber: regNumber })).setMimeType(ContentService.MimeType.JSON);
  } finally { lock.releaseLock(); }
}`;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Admin Topbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-extrabold shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Dashboard Admin & Pengelola PPDB
                </h1>
                <span className="hidden sm:inline px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  T.A. {school.academicYear}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">
                {school.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title="Kembali ke Tampilan Website Sekolah"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Lihat Website Sekolah</span>
            </button>

            <button
              onClick={onBackToWebsite}
              className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        
        {/* Summary Dashboard Component (Total Applicants, Total Verified, Total Pending, etc.) */}
        <AdminSummaryDashboard
          applicants={applicants}
          school={school}
          activeStatusFilter={statusFilter}
          onSelectStatusFilter={(status) => {
            setStatusFilter(status);
            setActiveTab('applicants');
          }}
          onNavigateToApplicants={() => setActiveTab('applicants')}
        />

        {/* Tab Controls Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-xs flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'summary', label: 'Ringkasan & Grafik Analitik', icon: BarChart3 },
            { id: 'applicants', label: 'Data Pendaftar PPDB', icon: Users, badge: applicants.length },
            { id: 'school', label: 'Profil & Info Sekolah', icon: Sliders },
            { id: 'news', label: 'Kelola Berita & Warta', icon: Newspaper, badge: news.length },
            { id: 'schedules', label: 'Jadwal & Gelombang', icon: Calendar },
            { id: 'faqs', label: 'Kelola FAQ', icon: HelpCircle },
            { id: 'sheets', label: 'Google Sheets API', icon: Database },
            { id: 'deploy', label: 'Publikasi Web & Video', icon: Globe, badge: '🎬 Video' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-emerald-950 text-amber-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 0: DASHBOARD RINGKASAN & GRAFIK ANALITIK (RECHARTS) */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            
            {/* Header Banner */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-emerald-100 text-emerald-800">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Ringkasan Visualisasi Data & Analitik PPDB
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Pantau perkembangan jumlah pendaftar per jalur masuk, sebaran status berkas, dan grafik tren pendaftaran secara langsung.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('applicants')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Kelola Pendaftar</span>
                </button>
                <button
                  onClick={handleExportCsv}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ekspor Laporan</span>
                </button>
              </div>
            </div>

            {/* Quick Insights Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/40 border border-amber-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Jalur Terfavorit</span>
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-lg font-black text-slate-900 mt-1">
                  {pathChartData.reduce((prev, curr) => curr.pendaftar > prev.pendaftar ? curr : prev, pathChartData[0])?.name || 'Prestasi'}
                </div>
                <div className="text-xs text-amber-700 font-medium mt-0.5">
                  {pathChartData.reduce((prev, curr) => curr.pendaftar > prev.pendaftar ? curr : prev, pathChartData[0])?.pendaftar || 0} pendaftar ({pathChartData.reduce((prev, curr) => curr.pendaftar > prev.pendaftar ? curr : prev, pathChartData[0])?.persentase || 0}%)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Rasio Kelulusan</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-lg font-black text-slate-900 mt-1">
                  {totalApplicants > 0 ? Math.round((acceptedApplicants / totalApplicants) * 100) : 0}% Diterima
                </div>
                <div className="text-xs text-emerald-700 font-medium mt-0.5">
                  {acceptedApplicants} dari {totalApplicants} pendaftar telah diterima
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/40 border border-teal-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">Peminatan Terbanyak</span>
                  <BookMarked className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-lg font-black text-slate-900 mt-1">
                  {majorChartData[0]?.name || 'MIPA'}
                </div>
                <div className="text-xs text-teal-700 font-medium mt-0.5">
                  {majorChartData[0]?.total || 0} peminat ({majorChartData[0]?.persen || 0}% total)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100/40 border border-rose-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Perlu Tindak Lanjut</span>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-lg font-black text-slate-900 mt-1">
                  {statusChartData.find(s => s.shortName === 'Perlu Lengkapi')?.count || 0} Berkas
                </div>
                <div className="text-xs text-rose-700 font-medium mt-0.5">
                  Hubungi orang tua untuk melengkapi berkas
                </div>
              </div>
            </div>

            {/* ROW 1: DUA GRAFIK UTAMA (JALUR & STATUS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* GRAFIK 1: Pendaftar per Jalur Pendaftaran (7 cols) */}
              <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-700" />
                      <span>Jumlah Pendaftar per Jalur Masuk</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Distribusi calon siswa berdasarkan pilihan jalur PPDB
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Total: {totalApplicants} Siswa
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pathChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 11, fill: '#475569' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={false}
                      />
                      <YAxis 
                        allowDecimals={false} 
                        tick={{ fontSize: 11, fill: '#475569' }} 
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          borderRadius: '8px', 
                          border: 'none', 
                          color: '#fff', 
                          fontSize: '11px',
                          padding: '8px 12px'
                        }}
                        formatter={(value: any) => [`${value} Pendaftar`, 'Jumlah']}
                        labelStyle={{ fontWeight: 'bold', color: '#fcd34d', marginBottom: '2px' }}
                      />
                      <Bar dataKey="pendaftar" radius={[6, 6, 0, 0]}>
                        {pathChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Sub-indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                  {pathChartData.map(item => (
                    <div key={item.name} className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                        <span className="font-semibold text-slate-700 truncate text-[11px]">{item.name}</span>
                      </div>
                      <div className="font-bold text-slate-900 mt-1 font-mono text-sm">
                        {item.pendaftar} <span className="text-[10px] font-normal text-slate-500">({item.persentase}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GRAFIK 2: Sebaran Status Verifikasi Berkas (5 cols) */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-teal-700" />
                        <span>Sebaran Status Verifikasi</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Status pemeriksaan berkas pendaftar saat ini
                      </p>
                    </div>
                  </div>

                  <div className="h-52 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusChartData.filter(s => s.count > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={48}
                          outerRadius={75}
                          paddingAngle={4}
                          dataKey="count"
                          nameKey="name"
                        >
                          {statusChartData.map((entry, index) => (
                            <Cell key={`cell-status-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#0f172a', 
                            borderRadius: '8px', 
                            border: 'none', 
                            color: '#fff', 
                            fontSize: '11px',
                            padding: '8px 12px'
                          }}
                          formatter={(value: any, name: any) => [`${value} Siswa`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Status Legend Breakdown */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  {statusChartData.map(st => {
                    const pct = totalApplicants > 0 ? Math.round((st.count / totalApplicants) * 100) : 0;
                    return (
                      <div key={st.name} className="flex items-center justify-between text-slate-700 py-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: st.color }}></span>
                          <span className="text-[11px] font-medium">{st.name}</span>
                        </div>
                        <div className="font-mono text-xs font-bold text-slate-900">
                          {st.count} <span className="text-[10px] text-slate-400 font-normal">({pct}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* ROW 2: TREN PENDAFTARAN SEPANJANG WAKTU (TIMELINE) & PILIHAN PEMINATAN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* GRAFIK 3: Tren Pendaftaran Sepanjang Waktu (8 cols) */}
              <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span>Tren Pendaftaran Sepanjang Waktu</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Pertumbuhan jumlah akumulasi pendaftaran dan aktivitas verifikasi per tanggal
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                      <span className="w-3 h-1.5 rounded-full bg-emerald-600"></span>
                      Kumulatif
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-800 font-medium">
                      <span className="w-3 h-1.5 rounded-full bg-blue-600"></span>
                      Harian
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorKumulatif" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#059669" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorHarian" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="displayDate" 
                        tick={{ fontSize: 11, fill: '#475569' }}
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={false}
                      />
                      <YAxis 
                        allowDecimals={false} 
                        tick={{ fontSize: 11, fill: '#475569' }}
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          borderRadius: '8px', 
                          border: 'none', 
                          color: '#fff', 
                          fontSize: '11px',
                          padding: '8px 12px'
                        }}
                        labelStyle={{ fontWeight: 'bold', color: '#fcd34d', marginBottom: '4px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="kumulatif" 
                        stroke="#059669" 
                        strokeWidth={2.5}
                        fillOpacity={1} 
                        fill="url(#colorKumulatif)" 
                        name="Total Akumulasi"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="harian" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorHarian)" 
                        name="Pendaftar Baru"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>ℹ️ Data grafik diperbarui otomatis secara real-time setiap kali pendaftaran baru masuk.</span>
                  <span className="font-semibold text-emerald-800">Status Pendaftaran: Aktif</span>
                </div>
              </div>

              {/* GRAFIK 4: Pilihan Peminatan / Jurusan (4 cols) */}
              <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-700" />
                    <span>Pilihan Jurusan Peminatan</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Minat program studi calon peserta didik baru
                  </p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={majorChartData} 
                      layout="vertical" 
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={85} 
                        tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          borderRadius: '8px', 
                          border: 'none', 
                          color: '#fff', 
                          fontSize: '11px',
                          padding: '6px 10px'
                        }}
                        formatter={(val: any) => [`${val} Siswa`, 'Peminat']}
                      />
                      <Bar dataKey="total" fill="#0d9488" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1 pt-1 text-[11px] text-slate-600">
                  {majorChartData.map(m => (
                    <div key={m.name} className="flex justify-between items-center py-0.5">
                      <span className="font-medium truncate">{m.name}:</span>
                      <span className="font-bold text-slate-900 font-mono">{m.total} siswa ({m.persen}%)</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 1: DATA PENDAFTAR PPDB */}
        {activeTab === 'applicants' && (
          <div className="space-y-4">
            {/* Filter Bar & Action Header */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <div className="relative min-w-[240px] flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={applicantSearch}
                    onChange={(e) => setApplicantSearch(e.target.value)}
                    placeholder="Cari nama, NISN, no registrasi, asal sekolah..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs py-2 px-3 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Sedang Ditinjau">Sedang Ditinjau</option>
                  <option value="Lolos Verifikasi">Lolos Verifikasi</option>
                  <option value="Diterima">Diterima</option>
                  <option value="Berkas Perlu Dilengkapi">Berkas Perlu Dilengkapi</option>
                </select>

                <select
                  value={trackFilter}
                  onChange={(e) => setTrackFilter(e.target.value)}
                  className="text-xs py-2 px-3 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Semua">Semua Jalur</option>
                  <option value="Prestasi">Prestasi</option>
                  <option value="Tahfidz Al-Qur'an">Tahfidz Al-Qur'an</option>
                  <option value="Reguler">Reguler</option>
                  <option value="Afirmasi">Afirmasi</option>
                </select>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsManualModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <UserPlus className="w-4 h-4 text-amber-300" />
                  <span>Tambah Pendaftar Offline</span>
                </button>

                <button
                  onClick={handleExportCsv}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Ekspor Excel/CSV</span>
                </button>
              </div>
            </div>

            {/* Applicants Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="p-3.5">No. Registrasi</th>
                      <th className="p-3.5">Nama Calon Siswa</th>
                      <th className="p-3.5">NISN / Asal Sekolah</th>
                      <th className="p-3.5">Jalur & Jurusan</th>
                      <th className="p-3.5">Kontak WhatsApp</th>
                      <th className="p-3.5">Status Verifikasi</th>
                      <th className="p-3.5 text-center">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplicants.length > 0 ? (
                      filteredApplicants.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-emerald-800">
                            {app.registrationNumber}
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{app.fullName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">Daftar: {app.createdAt}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-mono text-slate-700">{app.nisn}</div>
                            <div className="text-[11px] text-slate-500">{app.schoolOrigin}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-slate-800 block">{app.path}</span>
                            <span className="text-[10px] text-slate-500 line-clamp-1">{app.major}</span>
                          </td>
                          <td className="p-3.5 font-mono">
                            <a
                              href={createWhatsAppUrl(
                                app.whatsapp,
                                `Halo ${app.fullName}, Panitia PPDB ${school.name} mengonfirmasi bahwa berkas pendaftaran Anda (${app.registrationNumber}) telah kami periksa.`
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 hover:underline"
                            >
                              <MessageSquare className="w-3 h-3 text-emerald-600" />
                              <span>{app.whatsapp}</span>
                            </a>
                          </td>
                          <td className="p-3.5">
                            <select
                              value={app.status}
                              onChange={(e) => onUpdateApplicantStatus(app.id, e.target.value as any)}
                              className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-emerald-600"
                            >
                              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                              <option value="Sedang Ditinjau">Sedang Ditinjau</option>
                              <option value="Lolos Verifikasi">Lolos Verifikasi</option>
                              <option value="Diterima">Diterima</option>
                              <option value="Berkas Perlu Dilengkapi">Berkas Perlu Dilengkapi</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setSelectedApplicantDetail(app)}
                                className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Lihat Detail Biodata"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onPrintCard(app)}
                                className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Cetak Kartu Registrasi"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          Tidak ada data pendaftar yang cocok dengan filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFIL & INFO SEKOLAH */}
        {activeTab === 'school' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Pengaturan Data Sekolah & Pengumuman PPDB
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seluruh perubahan langsung aktif di seluruh landing page dan formulir pendaftaran.
                </p>
              </div>
              {schoolSaveNotice && (
                <div className="px-3 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Pengaturan Berhasil Disimpan!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveSchool} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                
                <div className="lg:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Nama Resmi Sekolah</label>
                  <input
                    type="text"
                    value={schoolForm.name}
                    onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Jenjang Sekolah</label>
                  <input
                    type="text"
                    value={schoolForm.level}
                    onChange={(e) => setSchoolForm({ ...schoolForm, level: e.target.value })}
                    placeholder="SMA / MA / SMK"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="lg:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Slogan / Sub-Nama</label>
                  <input
                    type="text"
                    value={schoolForm.subName}
                    onChange={(e) => setSchoolForm({ ...schoolForm, subName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Tahun Ajaran PPDB</label>
                  <input
                    type="text"
                    value={schoolForm.academicYear}
                    onChange={(e) => setSchoolForm({ ...schoolForm, academicYear: e.target.value })}
                    placeholder="2026/2027"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">NPSN</label>
                  <input
                    type="text"
                    value={schoolForm.npsn}
                    onChange={(e) => setSchoolForm({ ...schoolForm, npsn: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Akreditasi</label>
                  <input
                    type="text"
                    value={schoolForm.accreditation}
                    onChange={(e) => setSchoolForm({ ...schoolForm, accreditation: e.target.value })}
                    placeholder="Akreditasi A (Unggul)"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Sisa Kuota / Total Kuota</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={schoolForm.quotaRemaining}
                      onChange={(e) => setSchoolForm({ ...schoolForm, quotaRemaining: parseInt(e.target.value) || 0 })}
                      title="Sisa Kuota"
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-mono"
                    />
                    <input
                      type="number"
                      value={schoolForm.totalQuota}
                      onChange={(e) => setSchoolForm({ ...schoolForm, totalQuota: parseInt(e.target.value) || 0 })}
                      title="Total Kuota"
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">No. WhatsApp Hotline Panitia</label>
                  <input
                    type="text"
                    value={schoolForm.whatsapp}
                    onChange={(e) => setSchoolForm({ ...schoolForm, whatsapp: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Telepon Kantor</label>
                  <input
                    type="text"
                    value={schoolForm.phone}
                    onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Email Resmi</label>
                  <input
                    type="email"
                    value={schoolForm.email}
                    onChange={(e) => setSchoolForm({ ...schoolForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="lg:col-span-3 space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Alamat Lengkap</label>
                  <input
                    type="text"
                    value={schoolForm.address}
                    onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Peta Lokasi Google Maps */}
                <div className="lg:col-span-3 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="font-bold text-slate-700 uppercase flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-700" />
                      <span>Peta Lokasi Sekolah (Google Maps)</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateMapFromAddress}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs w-fit"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Cari Peta Otomatis dari Alamat Sekolah</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-7 space-y-1.5">
                      <input
                        type="text"
                        value={schoolForm.googleMapsEmbedUrl}
                        onChange={(e) => handleGoogleMapsInputChange(e.target.value)}
                        placeholder="Tempel link Embed Google Maps (https://www.google.com/maps/embed?...) atau kode <iframe>..."
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        <strong>Cara Termudah:</strong> Klik tombol hijau di kanan atas untuk membuat peta otomatis sesuai Nama &amp; Alamat Sekolah, atau buka Google Maps → cari sekolah Anda → klik <strong>Bagikan (Share)</strong> → pilih tab <strong>Sematkan peta (Embed a map)</strong> → klik <strong>Salin HTML</strong> lalu tempel langsung ke kotak di atas.
                      </p>
                    </div>

                    <div className="md:col-span-5 h-36 rounded-xl overflow-hidden border border-slate-300 bg-slate-200">
                      <iframe
                        title="Pratinjau Peta Google"
                        src={
                          schoolForm.googleMapsEmbedUrl && schoolForm.googleMapsEmbedUrl.trim().length > 0
                            ? schoolForm.googleMapsEmbedUrl
                            : `https://maps.google.com/maps?q=${encodeURIComponent(
                                `${schoolForm.name}, ${schoolForm.address}, ${schoolForm.city}`
                              )}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                        }
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Info Kepala Sekolah */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Nama Kepala Sekolah</label>
                  <input
                    type="text"
                    value={schoolForm.headmasterName}
                    onChange={(e) => setSchoolForm({ ...schoolForm, headmasterName: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">NIP Kepala Sekolah</label>
                  <input
                    type="text"
                    value={schoolForm.headmasterNip}
                    onChange={(e) => setSchoolForm({ ...schoolForm, headmasterNip: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="lg:col-span-3 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="font-bold text-slate-700 uppercase flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-700" />
                      <span>Foto Kepala Sekolah</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs w-fit">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingPhoto ? 'Memproses Foto...' : 'Upload Foto dari Komputer / HP'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/*"
                        onChange={handleHeadmasterPhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Thumbnail Preview */}
                    <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-emerald-950 shrink-0 flex items-center justify-center">
                      {schoolForm.headmasterPhoto ? (
                        <img
                          src={schoolForm.headmasterPhoto}
                          alt={schoolForm.headmasterName}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    {/* URL / Path Input */}
                    <div className="flex-1 w-full space-y-1.5">
                      <input
                        type="text"
                        value={schoolForm.headmasterPhoto}
                        onChange={(e) => setSchoolForm({ ...schoolForm, headmasterPhoto: e.target.value })}
                        placeholder="Tempel link URL foto (https://...) atau /images/kepsek.jpg"
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                      {photoUploadError && (
                        <p className="text-xs text-rose-600 font-semibold">{photoUploadError}</p>
                      )}
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Anda dapat langsung <strong>Upload Foto</strong> dari perangkat (JPG/PNG, otomatis dikompresi) atau menempelkan tautan URL gambar online / path file di folder <code className="bg-slate-200 px-1 rounded font-mono">public/</code>. Jangan lupa klik <strong>Simpan Perubahan Sekolah</strong> di bawah.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3 space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Kutipan Sambutan Kepala Sekolah</label>
                  <textarea
                    rows={2}
                    value={schoolForm.headmasterQuote}
                    onChange={(e) => setSchoolForm({ ...schoolForm, headmasterQuote: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Sekolah</span>
                </button>
              </div>
            </form>

            {/* Keamanan & Ganti Kata Sandi Admin */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Keamanan Akses & Kata Sandi Admin</h4>
                    <p className="text-xs text-slate-500">Ubah kata sandi untuk melindungi dashboard dari akses yang tidak berwenang.</p>
                  </div>
                </div>
                {pwSaveNotice && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md border border-emerald-200">
                    Kata Sandi Berhasil Diperbarui!
                  </span>
                )}
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newPasswordInput || newPasswordInput.trim().length < 4) {
                    alert('Kata sandi minimal 4 karakter.');
                    return;
                  }
                  if (onUpdatePassword) {
                    onUpdatePassword(newPasswordInput.trim());
                    setPwSaveNotice(true);
                    setTimeout(() => setPwSaveNotice(false), 3000);
                    setNewPasswordInput('');
                  }
                }} 
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-slate-200"
              >
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Kata Sandi Baru (Min. 4 Karakter)
                  </label>
                  <input
                    type="text"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Ketik kata sandi baru..."
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs font-mono bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="sm:self-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Perbarui Kata Sandi
                  </button>
                </div>
              </form>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>Kata Sandi Saat Ini: <code className="font-mono font-bold text-emerald-800">{currentPassword}</code></span>
                <span className="text-slate-400">Tersimpan aman di penyimpanan lokal peramban</span>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: KELOLA BERITA & PENGUMUMAN */}
        {activeTab === 'news' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Daftar Warta & Pengumuman Sekolah ({news.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Berita akan langsung tampil di beranda bagian warta sekolah.
                </p>
              </div>
              <button
                onClick={handleOpenAddNews}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Berita Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                  <div>
                    <img src={item.imageUrl} alt={item.title} className="w-full h-36 object-cover" />
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-bold text-emerald-800">{item.category}</span>
                        <span>{item.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 line-clamp-2 text-sm leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-3">
                        {item.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-end gap-2 mt-2">
                    <button
                      onClick={() => handleOpenEditNews(item)}
                      className="p-1.5 text-slate-600 hover:text-emerald-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Edit Berita"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNews(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Hapus Berita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: JADWAL & GELOMBANG */}
        {activeTab === 'schedules' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Tahapan & Jadwal Seleksi PPDB ({schedules.length} Tahap)
                </h3>
                <p className="text-xs text-slate-500">
                  Ubah periode waktu dan aktifkan tanda "Sedang Dibuka" pada gelombang yang berjalan.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {schedules.map((sch) => (
                <div key={sch.step} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                        {sch.step}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{sch.title}</h4>
                      {sch.isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                          Aktif Sekarang
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-emerald-800">{sch.period}</p>
                    <p className="text-xs text-slate-600">{sch.description}</p>
                  </div>

                  <button
                    onClick={() => handleOpenEditSchedule(sch)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                  >
                    Edit Jadwal
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FAQ */}
        {activeTab === 'faqs' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Daftar Pertanyaan yang Sering Diajukan (FAQ)
                </h3>
                <p className="text-xs text-slate-500">
                  Bantu orang tua siswa memahami alur berkas, beasiswa, dan biaya.
                </p>
              </div>
              <button
                onClick={() => setIsFaqModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah FAQ</span>
              </button>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">{faq.category}</span>
                    <h4 className="text-sm font-bold text-slate-900">{faq.question}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteFaq(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                    title="Hapus FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: GOOGLE SHEETS */}
        {activeTab === 'sheets' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Integrasi Google Sheets & Webhook Otomatis
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Setiap formulir pendaftaran yang masuk akan otomatis dicatat sebagai baris baru di spreadsheet Google Anda.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                URL Google Apps Script Web App
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={schoolForm.googleScriptUrl}
                  onChange={(e) => setSchoolForm({ ...schoolForm, googleScriptUrl: e.target.value })}
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  className="flex-1 p-2.5 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-600"
                />
                <button
                  onClick={handleSaveSchool}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Simpan URL
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                {schoolForm.googleScriptUrl ? '✅ Webhook aktif' : '⚠️ Masih menggunakan penyimpanan browser lokal.'}
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase">
                  Kode Google Apps Script (`code.gs`)
                </span>
                <button
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(googleScriptCode);
                      setCopiedScript(true);
                      setTimeout(() => setCopiedScript(false), 2000);
                    }
                  }}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Tersalin!' : 'Salin Kode Script'}</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs max-h-64 overflow-y-auto">
                <pre>{googleScriptCode}</pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PANDUAN PUBLIKASI / DEPLOY WEBSITE */}
        {activeTab === 'deploy' && (
          <AdminDeployGuide school={school} />
        )}

      </div>

      {/* MODAL: DETAIL PENDAFTAR */}
      {selectedApplicantDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold font-mono text-emerald-800">{selectedApplicantDetail.registrationNumber}</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedApplicantDetail.fullName}</h3>
                <p className="text-xs text-slate-500">Asal: {selectedApplicantDetail.schoolOrigin}</p>
              </div>
              <button
                onClick={() => setSelectedApplicantDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
              <div><span className="text-slate-400 block">NISN:</span><strong>{selectedApplicantDetail.nisn}</strong></div>
              <div><span className="text-slate-400 block">NIK:</span><strong>{selectedApplicantDetail.nik}</strong></div>
              <div><span className="text-slate-400 block">TTL & JK:</span><span>{selectedApplicantDetail.birthPlace}, {selectedApplicantDetail.birthDate} ({selectedApplicantDetail.gender})</span></div>
              <div><span className="text-slate-400 block">Agama:</span><span>{selectedApplicantDetail.religion}</span></div>
              <div><span className="text-slate-400 block">Jalur:</span><strong className="text-emerald-800">{selectedApplicantDetail.path}</strong></div>
              <div><span className="text-slate-400 block">Peminatan:</span><strong>{selectedApplicantDetail.major}</strong></div>
              <div className="col-span-2"><span className="text-slate-400 block">Alamat:</span><span>{selectedApplicantDetail.address}</span></div>
              <div><span className="text-slate-400 block">Ayah:</span><span>{selectedApplicantDetail.fatherName}</span></div>
              <div><span className="text-slate-400 block">Ibu:</span><span>{selectedApplicantDetail.motherName}</span></div>
              <div className="col-span-2"><span className="text-slate-400 block">WhatsApp:</span><strong className="font-mono">{selectedApplicantDetail.whatsapp}</strong></div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  onPrintCard(selectedApplicantDetail);
                  setSelectedApplicantDetail(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Cetak Kartu Registrasi</span>
              </button>
              <button
                onClick={() => setSelectedApplicantDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH PENDAFTAR MANUAL (OFFLINE) */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Input Pendaftar Offline / Walk-In</h3>
                <p className="text-xs text-slate-500">Untuk calon siswa yang mendaftar langsung di kampus</p>
              </div>
              <button onClick={() => setIsManualModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualApplicantSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  value={manualForm.fullName}
                  onChange={(e) => setManualForm({ ...manualForm, fullName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NISN (10 Digit) *</label>
                  <input
                    type="text"
                    value={manualForm.nisn}
                    onChange={(e) => setManualForm({ ...manualForm, nisn: e.target.value.replace(/[^0-9]/g, '') })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">WhatsApp Ortu/Siswa *</label>
                  <input
                    type="text"
                    value={manualForm.whatsapp}
                    onChange={(e) => setManualForm({ ...manualForm, whatsapp: e.target.value.replace(/[^0-9]/g, '') })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jalur Masuk</label>
                  <select
                    value={manualForm.path}
                    onChange={(e) => setManualForm({ ...manualForm, path: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Prestasi">Prestasi</option>
                    <option value="Tahfidz Al-Qur'an">Tahfidz Al-Qur'an</option>
                    <option value="Reguler">Reguler</option>
                    <option value="Afirmasi">Afirmasi</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pilihan Peminatan</label>
                  <select
                    value={manualForm.major}
                    onChange={(e) => setManualForm({ ...manualForm, major: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="MIPA (Ilmu Pengetahuan Alam & Riset)">MIPA</option>
                    <option value="IPS (Ilmu Sosial & Kewirausahaan)">IPS</option>
                    <option value="Kejuruan Rekayasa Perangkat Lunak & AI">Rekayasa Perangkat Lunak</option>
                    <option value="Bilingual Cambridge Science Class">Bilingual Cambridge</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Asal Sekolah (SMP/MTs)</label>
                <input
                  type="text"
                  value={manualForm.schoolOrigin}
                  onChange={(e) => setManualForm({ ...manualForm, schoolOrigin: e.target.value })}
                  placeholder="SMP Asal Siswa"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Panitia</label>
                <input
                  type="text"
                  value={manualForm.notes}
                  onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg"
                >
                  Simpan & Terbitkan No. Registrasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT BERITA */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingNewsId ? 'Edit Berita' : 'Tambah Berita Baru'}
              </h3>
              <button onClick={() => setIsNewsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Berita *</label>
                <input
                  type="text"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori</label>
                  <select
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Pengumuman PPDB">Pengumuman PPDB</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Kegiatan Siswa">Kegiatan Siswa</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal</label>
                  <input
                    type="text"
                    value={newsForm.date}
                    onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">URL Gambar Banner</label>
                <input
                  type="text"
                  value={newsForm.imageUrl}
                  onChange={(e) => setNewsForm({ ...newsForm, imageUrl: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ringkasan Singkat (Excerpt) *</label>
                <textarea
                  rows={2}
                  value={newsForm.excerpt}
                  onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Isi Berita Lengkap</label>
                <textarea
                  rows={4}
                  value={Array.isArray(newsForm.content) ? newsForm.content.join('\n\n') : ''}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value.split('\n\n') })}
                  placeholder="Tuliskan isi berita di sini (pisahkan paragraf dengan baris kosong)..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg"
                >
                  Simpan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT JADWAL */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Jadwal PPDB</h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Tahapan *</label>
                <input
                  type="text"
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Periode Tanggal *</label>
                <input
                  type="text"
                  value={scheduleForm.period}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, period: e.target.value })}
                  placeholder="Contoh: 10 Januari - 28 Februari 2026"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Tahapan</label>
                <textarea
                  rows={2}
                  value={scheduleForm.description}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={scheduleForm.isCurrent}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, isCurrent: e.target.checked })}
                  className="h-4 w-4 text-emerald-600 rounded"
                />
                <span className="font-bold text-slate-800">Sedang Dibuka / Berjalan Sekarang</span>
              </label>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH FAQ */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Tambah Pertanyaan & Jawaban (FAQ)</h3>
              <button onClick={() => setIsFaqModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Kategori</label>
                <input
                  type="text"
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  placeholder="Misal: Biaya & Beasiswa, Persyaratan"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pertanyaan *</label>
                <input
                  type="text"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="Contoh: Apakah ada beasiswa prestasi?"
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Jawaban *</label>
                <textarea
                  rows={3}
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Jawaban resmi dari panitia sekolah..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg"
                >
                  Simpan FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
