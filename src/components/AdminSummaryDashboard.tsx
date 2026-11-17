import { useMemo } from 'react';
import { Applicant, SchoolConfig } from '../types';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Award, 
  Search, 
  AlertTriangle, 
  GraduationCap, 
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { AdminQuickStatsBarChart } from './AdminQuickStatsBarChart';

interface AdminSummaryDashboardProps {
  applicants: Applicant[];
  school: SchoolConfig;
  activeStatusFilter?: string;
  onSelectStatusFilter?: (status: string) => void;
  onNavigateToApplicants?: () => void;
}

export function AdminSummaryDashboard({
  applicants,
  school,
  activeStatusFilter,
  onSelectStatusFilter,
  onNavigateToApplicants
}: AdminSummaryDashboardProps) {
  // Metric calculations
  const totalApplicants = applicants.length;

  const totalPending = useMemo(() => {
    return applicants.filter(a => a.status === 'Menunggu Verifikasi').length;
  }, [applicants]);

  const totalReviewing = useMemo(() => {
    return applicants.filter(a => a.status === 'Sedang Ditinjau').length;
  }, [applicants]);

  const totalVerifiedOnly = useMemo(() => {
    return applicants.filter(a => a.status === 'Lolos Verifikasi').length;
  }, [applicants]);

  const totalAccepted = useMemo(() => {
    return applicants.filter(a => a.status === 'Diterima').length;
  }, [applicants]);

  // Combined verified count (Lolos Verifikasi + Diterima)
  const totalVerifiedCombined = totalVerifiedOnly + totalAccepted;

  const totalNeedRevision = useMemo(() => {
    return applicants.filter(a => a.status === 'Berkas Perlu Dilengkapi').length;
  }, [applicants]);

  // Percentage calculations
  const pendingPercentage = totalApplicants > 0 ? Math.round((totalPending / totalApplicants) * 100) : 0;
  const verifiedPercentage = totalApplicants > 0 ? Math.round((totalVerifiedCombined / totalApplicants) * 100) : 0;
  const acceptedPercentage = totalApplicants > 0 ? Math.round((totalAccepted / totalApplicants) * 100) : 0;
  const quotaUsed = Math.max(0, school.totalQuota - school.quotaRemaining);
  const quotaPercentage = school.totalQuota > 0 ? Math.min(100, Math.round((quotaUsed / school.totalQuota) * 100)) : 0;

  const handleCardClick = (status: string) => {
    if (onSelectStatusFilter) {
      onSelectStatusFilter(status);
    }
    if (onNavigateToApplicants) {
      onNavigateToApplicants();
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Metric Cards Grid in Simple Card Format */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        
        {/* 1. Total Applicants */}
        <div 
          onClick={() => handleCardClick('Semua')}
          className={`relative p-4 rounded-2xl bg-white border transition-all duration-200 shadow-xs group ${
            onSelectStatusFilter ? 'cursor-pointer hover:shadow-md hover:border-slate-400' : ''
          } ${activeStatusFilter === 'Semua' ? 'ring-2 ring-slate-800 border-slate-800' : 'border-slate-200'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Pendaftar
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {totalApplicants}
            </span>
            <span className="text-xs text-slate-500 font-medium">calon siswa</span>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Basis data pendaftaran</span>
            {onSelectStatusFilter && (
              <span className="text-slate-400 group-hover:text-slate-700 flex items-center gap-0.5 font-medium transition-colors">
                <span>Lihat semua</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* 2. Total Pending (Menunggu Verifikasi) */}
        <div 
          onClick={() => handleCardClick('Menunggu Verifikasi')}
          className={`relative p-4 rounded-2xl bg-white border transition-all duration-200 shadow-xs group ${
            onSelectStatusFilter ? 'cursor-pointer hover:shadow-md hover:border-amber-400' : ''
          } ${activeStatusFilter === 'Menunggu Verifikasi' ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/20' : 'border-amber-200/90'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
              <span>Menunggu Verifikasi</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 font-mono tracking-tight">
              {totalPending}
            </span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
              {pendingPercentage}%
            </span>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-amber-100 flex items-center justify-between text-[11px]">
            <span className="text-amber-800/80 font-medium">
              {totalPending > 0 ? 'Perlu tindakan panitia' : 'Semua telah ditinjau'}
            </span>
            {onSelectStatusFilter && (
              <span className="text-amber-600 group-hover:text-amber-800 flex items-center gap-0.5 font-bold transition-colors">
                <span>Periksa</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* 3. Total Verified (Lolos Verifikasi Berkas) */}
        <div 
          onClick={() => handleCardClick('Lolos Verifikasi')}
          className={`relative p-4 rounded-2xl bg-white border transition-all duration-200 shadow-xs group ${
            onSelectStatusFilter ? 'cursor-pointer hover:shadow-md hover:border-teal-400' : ''
          } ${activeStatusFilter === 'Lolos Verifikasi' ? 'ring-2 ring-teal-500 border-teal-500 bg-teal-50/20' : 'border-teal-200/90'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
              Total Terverifikasi
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:bg-teal-200 transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-teal-700 font-mono tracking-tight">
              {totalVerifiedCombined}
            </span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
              {verifiedPercentage}%
            </span>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-teal-100 flex items-center justify-between text-[11px]">
            <span className="text-teal-800/80 font-medium">
              {totalVerifiedOnly} lolos berkas · {totalAccepted} diterima
            </span>
            {onSelectStatusFilter && (
              <span className="text-teal-600 group-hover:text-teal-800 flex items-center gap-0.5 font-bold transition-colors">
                <span>Filter</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* 4. Sedang Ditinjau (In Review) */}
        <div 
          onClick={() => handleCardClick('Sedang Ditinjau')}
          className={`relative p-4 rounded-2xl bg-white border transition-all duration-200 shadow-xs group ${
            onSelectStatusFilter ? 'cursor-pointer hover:shadow-md hover:border-blue-400' : ''
          } ${activeStatusFilter === 'Sedang Ditinjau' ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/20' : 'border-blue-200/90'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
              Sedang Ditinjau
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Search className="w-4 h-4" />
            </div>
          </div>
          
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-700 font-mono tracking-tight">
              {totalReviewing}
            </span>
            <span className="text-xs text-blue-600 font-medium">berkas</span>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-blue-100 flex items-center justify-between text-[11px]">
            <span className="text-blue-800/80 font-medium">Validasi nilai & berkas</span>
            {onSelectStatusFilter && (
              <span className="text-blue-600 group-hover:text-blue-800 flex items-center gap-0.5 font-medium transition-colors">
                <span>Filter</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* 5. Siswa Diterima (Accepted) */}
        <div 
          onClick={() => handleCardClick('Diterima')}
          className={`relative p-4 rounded-2xl bg-white border transition-all duration-200 shadow-xs group ${
            onSelectStatusFilter ? 'cursor-pointer hover:shadow-md hover:border-emerald-400' : ''
          } ${activeStatusFilter === 'Diterima' ? 'ring-2 ring-emerald-600 border-emerald-600 bg-emerald-50/20' : 'border-emerald-200/90'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              Siswa Diterima
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <Award className="w-4 h-4" />
            </div>
          </div>
          
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono tracking-tight">
              {totalAccepted}
            </span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
              {acceptedPercentage}% total
            </span>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-emerald-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-800/80 font-medium">Lulus seleksi akhir</span>
            {onSelectStatusFilter && (
              <span className="text-emerald-700 group-hover:text-emerald-900 flex items-center gap-0.5 font-bold transition-colors">
                <span>Lihat</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* 6. Sisa Kuota & Kapasitas Sekolah */}
        <div className="relative p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Sisa Kuota PPDB
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-800 font-mono tracking-tight">
              {school.quotaRemaining}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              / {school.totalQuota} kursi
            </span>
          </div>

          {/* Quota Progress Bar */}
          <div className="mt-2.5 pt-2 space-y-1">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${quotaPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>{quotaUsed} terisi ({quotaPercentage}%)</span>
              <span className="text-emerald-700 font-semibold">Aktif</span>
            </div>
          </div>
        </div>

      </div>

      {/* Visual Status Proportion Bar & Quick Summary Ribbon */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="font-bold text-slate-700">Distribusi Status Pendaftar:</span>
          <span className="text-slate-500">
            {totalApplicants} calon siswa terdata di sistem
          </span>
        </div>

        {/* Proportion Bar */}
        <div className="flex-1 max-w-md hidden lg:flex items-center gap-1">
          <div 
            title={`Lolos & Diterima: ${totalVerifiedCombined} (${verifiedPercentage}%)`}
            className="h-2 rounded-l-full bg-teal-600 transition-all hover:opacity-80 cursor-help"
            style={{ width: `${Math.max(5, verifiedPercentage)}%` }}
          />
          <div 
            title={`Menunggu Verifikasi: ${totalPending} (${pendingPercentage}%)`}
            className="h-2 bg-amber-500 transition-all hover:opacity-80 cursor-help"
            style={{ width: `${Math.max(5, pendingPercentage)}%` }}
          />
          <div 
            title={`Sedang Ditinjau: ${totalReviewing}`}
            className="h-2 bg-blue-500 transition-all hover:opacity-80 cursor-help"
            style={{ width: `${Math.max(5, Math.round((totalReviewing / (totalApplicants || 1)) * 100))}%` }}
          />
          {totalNeedRevision > 0 && (
            <div 
              title={`Perlu Dilengkapi: ${totalNeedRevision}`}
              className="h-2 rounded-r-full bg-rose-500 transition-all hover:opacity-80 cursor-help"
              style={{ width: `${Math.max(5, Math.round((totalNeedRevision / (totalApplicants || 1)) * 100))}%` }}
            />
          )}
        </div>

        {/* Quick Legend Tags */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-600"></span>
            <span>Terverifikasi: <strong>{totalVerifiedCombined}</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Menunggu: <strong>{totalPending}</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Ditinjau: <strong>{totalReviewing}</strong></span>
          </span>
          {totalNeedRevision > 0 && (
            <span className="flex items-center gap-1.5 text-rose-700">
              <AlertTriangle className="w-3 h-3 text-rose-500" />
              <span>Perlu Perbaikan: <strong>{totalNeedRevision}</strong></span>
            </span>
          )}
        </div>
      </div>

      {/* Komponen Statistik Ringkas & Grafik Batang Sederhana (Total, Diterima, Menunggu) */}
      <AdminQuickStatsBarChart
        applicants={applicants}
        onSelectStatus={onSelectStatusFilter}
        onNavigateToApplicants={onNavigateToApplicants}
      />
    </div>
  );
}
