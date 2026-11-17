import { SchoolConfig } from '../types';
import { 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  HeartHandshake,
  ShieldCheck,
  ChevronUp,
  Lock
} from 'lucide-react';
import { createWhatsAppUrl } from '../utils/storage';

interface FooterProps {
  school: SchoolConfig;
  onOpenPpdbForm: () => void;
  onOpenCheckStatus: () => void;
  onOpenAdminGuide: () => void;
  onOpenAdminPage: () => void;
}

export function Footer({ 
  school, 
  onOpenPpdbForm, 
  onOpenCheckStatus, 
  onOpenAdminGuide,
  onOpenAdminPage 
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const waPanitiaUrl = createWhatsAppUrl(
    school.whatsapp,
    `Halo Panitia PPDB ${school.name}, saya ingin konsultasi pendaftaran online.`
  );

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 border border-emerald-700">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {school.name}
                </h3>
                <p className="text-xs text-emerald-400 font-medium">
                  {school.accreditation}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              {school.slogan}. Mendidik generasi cerdas berilmu, berakhlaqul karimah, dan berwawasan global dengan kurikulum terpadu nasional dan keagamaan.
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>NPSN: {school.npsn}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>Jenjang: {school.level}</span>
            </div>
          </div>

          {/* Quick Links Nav (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Tautan Navigasi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#beranda" className="hover:text-emerald-400 transition-colors">Beranda Utama</a>
              </li>
              <li>
                <a href="#profil" className="hover:text-emerald-400 transition-colors">Profil & Sambutan Kepala Sekolah</a>
              </li>
              <li>
                <a href="#program" className="hover:text-emerald-400 transition-colors">Program Unggulan & Ekstrakurikuler</a>
              </li>
              <li>
                <a href="#berita" className="hover:text-emerald-400 transition-colors">Berita & Pengumuman</a>
              </li>
              <li>
                <a href="#ppdb" className="hover:text-emerald-400 transition-colors">Alur & Syarat PPDB {school.academicYear}</a>
              </li>
              <li>
                <a href="#kontak" className="hover:text-emerald-400 transition-colors">Lokasi & Kontak Sekretariat</a>
              </li>
            </ul>
          </div>

          {/* PPDB Action Links & Helpdesk (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Layanan PPDB Online
            </h4>
            <div className="space-y-2">
              <button
                onClick={onOpenPpdbForm}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-800 text-xs font-bold text-emerald-200 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Buka Formulir Pendaftaran</span>
                <span className="text-[10px] text-amber-300 font-mono">ONLINE</span>
              </button>

              <button
                onClick={onOpenCheckStatus}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Cek Status Verifikasi & Hasil Seleksi</span>
                <span className="text-[10px] text-emerald-400">CEK NISN</span>
              </button>

              <button
                onClick={onOpenAdminPage}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer shadow-sm"
              >
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-950" />
                  Halaman Khusus Admin & Pengelola
                </span>
                <span className="text-[10px] text-slate-950 font-mono bg-amber-300 px-1 rounded">TERKUNCI</span>
              </button>

              <button
                onClick={onOpenAdminGuide}
                className="w-full text-left px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-medium text-slate-400 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Panduan Google Sheets & Script</span>
                <span className="text-[10px] text-slate-500">INFO</span>
              </button>
            </div>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Hotline: {school.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Email: {school.email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {school.name}. Hak Cipta Dilindungi Undang-Undang.
          </div>

          <div className="flex items-center gap-4">
            <span>Sistem Informasi PPDB Terintegrasi Google Sheets</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Kembali ke atas"
              aria-label="Kembali ke atas"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
