import { useState, useEffect } from 'react';
import { SchoolConfig } from '../types';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Phone, 
  MessageSquareText, 
  Settings, 
  FileText, 
  Search,
  Sparkles,
  Lock
} from 'lucide-react';
import { createWhatsAppUrl } from '../utils/storage';

interface NavbarProps {
  school: SchoolConfig;
  onOpenPpdbForm: () => void;
  onOpenCheckStatus: () => void;
  onOpenAdminGuide: () => void;
  onOpenAdminPage: () => void;
}

export function Navbar({ 
  school, 
  onOpenPpdbForm, 
  onOpenCheckStatus, 
  onOpenAdminGuide,
  onOpenAdminPage 
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Profil & Visi', href: '#profil' },
    { label: 'Program & Fasilitas', href: '#program' },
    { label: 'Berita', href: '#berita' },
    { label: 'PPDB 2026/2027', href: '#ppdb' },
    { label: 'Kontak', href: '#kontak' },
  ];

  const waHelpUrl = createWhatsAppUrl(
    school.whatsapp,
    `Halo Panitia PPDB ${school.name}, saya ingin menanyakan informasi pendaftaran siswa baru tahun ajaran ${school.academicYear}.`
  );

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* Top Bar Pengumuman & Kontak Cepat */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 border-b border-emerald-900/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              PPDB {school.academicYear} Telah Dibuka
            </span>
            <span className="hidden sm:inline text-emerald-400/60">·</span>
            <span className="hidden sm:inline text-emerald-200/80">
              Sisa Kuota: <strong className="text-white font-medium">{school.quotaRemaining} kursi</strong> dari {school.totalQuota}
            </span>
            <span className="hidden md:inline text-emerald-400/60">·</span>
            <span className="hidden md:inline text-emerald-300/90 font-mono text-[11px]">
              NPSN: {school.npsn}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto text-emerald-200/90">
            <a 
              href={`tel:${school.phone}`} 
              className="hidden lg:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{school.phone}</span>
            </a>
            <a 
              href={waHelpUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 hover:text-white transition-colors text-emerald-300"
            >
              <MessageSquareText className="w-3 h-3 text-emerald-400" />
              <span className="font-medium">WhatsApp Panitia</span>
            </a>
            
            <button
              onClick={onOpenAdminPage}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all text-[11px] shadow-xs cursor-pointer ml-1"
              title="Masuk ke Halaman Khusus Admin & Pengelola (Perlu Password)"
            >
              <Lock className="w-3 h-3 text-slate-950" />
              <span>Halaman Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`w-full transition-colors duration-200 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80' 
          : 'bg-white border-b border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & School Name */}
          <a href="#beranda" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-900 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-emerald-800 transition-colors leading-tight block">
                  {school.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium line-clamp-1">
                {school.accreditation} · {school.city}
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-emerald-700 hover:underline underline-offset-8 decoration-emerald-600 decoration-2 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenCheckStatus}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300/80 cursor-pointer"
            >
              <Search className="w-4 h-4 text-emerald-600" />
              <span>Cek Status</span>
            </button>

            <button
              onClick={onOpenPpdbForm}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Daftar PPDB</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={onOpenPpdbForm}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 rounded-lg"
            >
              Daftar
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2.5 shadow-xl">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-lg"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminPage();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm"
              >
                <Lock className="w-4 h-4 text-slate-950" />
                <span>Masuk ke Halaman Admin (Perlu Password)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCheckStatus();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  <Search className="w-4 h-4 text-emerald-600" />
                  <span>Cek Status</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminGuide();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200"
                >
                  <Settings className="w-4 h-4 text-emerald-700" />
                  <span>Panduan Sheet</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
