import { useState } from 'react';
import { ProgramItem } from '../types';
import { initialPrograms } from '../data/initialData';
import { 
  Microscope, 
  BookOpen, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  School, 
  CheckCircle2, 
  Sparkles,
  Layers
} from 'lucide-react';

export function ProgramsSection() {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = [
    'Semua',
    'Akademik Unggulan',
    'Karakter & Keagamaan',
    'Ekstrakurikuler',
    'Fasilitas Kampus',
  ];

  const filteredPrograms = activeCategory === 'Semua' 
    ? initialPrograms 
    : initialPrograms.filter((p) => p.category === activeCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Microscope': return <Microscope className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Globe': return <Globe className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'School': return <School className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section id="program" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Program Sekolah & Fasilitas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Kurikulum Holistik & Fasilitas Berstandar Unggul
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Memadukan pembinaan kecerdasan spiritual, penguasaan sains modern, keahlian teknologi informatika, serta pengembangan minat bakat siswa secara seimbang.
            </p>
          </div>

          {/* Interactive Filter Segmented Control */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white text-emerald-800 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Icon & Category */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center border border-emerald-200/60 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                    {getIcon(prog.icon)}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {prog.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {prog.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {prog.description}
                </p>

                {/* Highlights */}
                <div className="mt-4 pt-4 border-t border-slate-200/60 space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Keunggulan Program:
                  </div>
                  {prog.highlights.map((hl, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom tag note */}
              <div className="mt-6 pt-3 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Dibimbing Mentor Khusus</span>
                <span className="text-emerald-700 font-medium">Aktif Tiap Semester</span>
              </div>
            </div>
          ))}
        </div>

        {/* Fasilitas Kampus Highlights Bar */}
        <div className="p-6 rounded-2xl bg-emerald-950 text-white flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <h4 className="text-lg font-bold text-white">
              Ingin Meninjau Fasilitas Kampus Secara Langsung?
            </h4>
            <p className="text-xs text-emerald-200/80 max-w-xl">
              Sekolah membuka program <em>School Tour</em> setiap hari Sabtu (09.00 - 12.00 WIB) bagi calon pendaftar dan orang tua siswa.
            </p>
          </div>
          <a
            href="#kontak"
            className="px-5 py-2.5 text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shrink-0"
          >
            Jadwalkan Kunjungan Kampus
          </a>
        </div>

      </div>
    </section>
  );
}
