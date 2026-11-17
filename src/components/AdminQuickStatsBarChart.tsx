import { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  BarChart2, 
  ArrowUpRight,
  TrendingUp,
  Info
} from 'lucide-react';
import { Applicant } from '../types';

interface AdminQuickStatsBarChartProps {
  applicants: Applicant[];
  onSelectStatus?: (status: string) => void;
  onNavigateToApplicants?: () => void;
}

export function AdminQuickStatsBarChart({
  applicants,
  onSelectStatus,
  onNavigateToApplicants
}: AdminQuickStatsBarChartProps) {
  // 1. Calculate the 3 primary requested metrics
  const totalApplicants = applicants.length;

  const totalAccepted = useMemo(() => {
    return applicants.filter(a => a.status === 'Diterima').length;
  }, [applicants]);

  const totalPending = useMemo(() => {
    return applicants.filter(a => a.status === 'Menunggu Verifikasi').length;
  }, [applicants]);

  // Percentage calculations relative to total applicants
  const acceptedPercentage = totalApplicants > 0 
    ? Math.round((totalAccepted / totalApplicants) * 100) 
    : 0;

  const pendingPercentage = totalApplicants > 0 
    ? Math.round((totalPending / totalApplicants) * 100) 
    : 0;

  // 2. Prepare data for the simple bar chart
  const chartData = [
    {
      id: 'total',
      name: 'Total Pendaftar',
      shortLabel: 'Total',
      count: totalApplicants,
      percentage: 100,
      fillColor: '#1e293b', // Slate 800
      hoverColor: '#0f172a',
      statusFilter: 'Semua',
      description: 'Seluruh berkas calon siswa yang telah masuk ke sistem'
    },
    {
      id: 'accepted',
      name: 'Diterima',
      shortLabel: 'Diterima',
      count: totalAccepted,
      percentage: acceptedPercentage,
      fillColor: '#059669', // Emerald 600
      hoverColor: '#047857',
      statusFilter: 'Diterima',
      description: 'Calon siswa yang telah dinyatakan lulus seleksi akhir'
    },
    {
      id: 'pending',
      name: 'Menunggu Verifikasi',
      shortLabel: 'Menunggu',
      count: totalPending,
      percentage: pendingPercentage,
      fillColor: '#d97706', // Amber 600
      hoverColor: '#b45309',
      statusFilter: 'Menunggu Verifikasi',
      description: 'Berkas baru yang belum divalidasi oleh panitia PPDB'
    }
  ];

  const handleBarClick = (entry: typeof chartData[0]) => {
    if (onSelectStatus) {
      onSelectStatus(entry.statusFilter);
    }
    if (onNavigateToApplicants) {
      onNavigateToApplicants();
    }
  };

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1 z-50">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <span 
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: data.fillColor }}
            />
            <span>{data.name}</span>
          </div>
          <div className="text-base font-extrabold text-white font-mono">
            {data.count} <span className="text-xs font-normal text-slate-300">calon siswa</span>
          </div>
          <div className="text-[11px] text-slate-300">
            Porsi: <strong>{data.percentage}%</strong> dari total pendaftar
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            {data.description}
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold pt-0.5">
            Klik untuk memfilter data ini
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-5">
      
      {/* Component Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Statistik Ringkas Pendaftaran
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Data
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Perbandingan jumlah total pendaftar, siswa diterima, dan berkas yang masih menunggu verifikasi
              </p>
            </div>
          </div>
        </div>

        {onNavigateToApplicants && (
          <button
            onClick={onNavigateToApplicants}
            className="self-start sm:self-center inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
          >
            <span>Lihat Tabel Pendaftar</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Content Grid: 3 Metric Cards + Simple Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        
        {/* LEFT COLUMN: 3 Summary Metric Cards (5 Cols) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
          
          {/* 1. Total Pendaftar */}
          <div 
            onClick={() => handleBarClick(chartData[0])}
            className="p-4 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white hover:border-slate-400 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  Total Pendaftar
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold">
                100%
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {totalApplicants}
              </span>
              <span className="text-xs text-slate-500 group-hover:text-slate-900 transition-colors flex items-center gap-0.5">
                <span>calon siswa</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </div>
          </div>

          {/* 2. Diterima */}
          <div 
            onClick={() => handleBarClick(chartData[1])}
            className="p-4 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-white hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-emerald-900">
                  Jumlah Diterima
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {acceptedPercentage}% dari Total
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-700 font-mono">
                {totalAccepted}
              </span>
              <span className="text-xs text-emerald-700 group-hover:text-emerald-900 transition-colors flex items-center gap-0.5">
                <span>lulus seleksi</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </div>
          </div>

          {/* 3. Menunggu Verifikasi */}
          <div 
            onClick={() => handleBarClick(chartData[2])}
            className="p-4 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50/50 to-white hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-amber-900">
                  Menunggu Verifikasi
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                {pendingPercentage}% Belum Ditinjau
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-600 font-mono">
                {totalPending}
              </span>
              <span className="text-xs text-amber-700 group-hover:text-amber-900 transition-colors flex items-center gap-0.5">
                <span>perlu diproses</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Simple Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
          
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
              <span>Grafik Batang Perbandingan Status</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Satuan: Jumlah Siswa
            </span>
          </div>

          {/* Recharts Simple Bar Chart */}
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 15, left: -15, bottom: 5 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length) {
                    handleBarClick(e.activePayload[0].payload);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  radius={[8, 8, 0, 0]} 
                  cursor="pointer"
                  barSize={48}
                >
                  {chartData.map((entry) => (
                    <Cell 
                      key={`cell-${entry.id}`} 
                      fill={entry.fillColor} 
                      className="transition-opacity hover:opacity-85"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Chart Footer / Legend Note */}
          <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-800" />
                <span>Total ({totalApplicants})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600" />
                <span>Diterima ({totalAccepted})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-600" />
                <span>Menunggu ({totalPending})</span>
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-slate-400">
              <Info className="w-3 h-3" />
              <span>Klik batang grafik untuk filter pendaftar</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
