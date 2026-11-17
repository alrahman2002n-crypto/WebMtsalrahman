import { useState, FormEvent } from 'react';
import { SchoolConfig } from '../types';
import { 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  X, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { DEFAULT_ADMIN_PASSWORD } from '../utils/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPassword: string;
  onSuccessLogin: () => void;
  onResetPasswordToDefault: () => void;
  school: SchoolConfig;
}

export function AdminLoginModal({
  isOpen,
  onClose,
  currentPassword,
  onSuccessLogin,
  onResetPasswordToDefault,
  school,
}: AdminLoginModalProps) {
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!inputPassword) {
      setErrorMsg('Silakan masukkan kata sandi admin.');
      return;
    }

    if (inputPassword === currentPassword) {
      setInputPassword('');
      setErrorMsg(null);
      setAttempts(0);
      onSuccessLogin();
    } else {
      setAttempts(prev => prev + 1);
      setErrorMsg('Kata sandi salah! Pastikan huruf besar/kecil sesuai.');
    }
  };

  const handleResetPassword = () => {
    if (confirm('Atur ulang kata sandi ke bawaan awal: "admin123"?')) {
      onResetPasswordToDefault();
      setInputPassword(DEFAULT_ADMIN_PASSWORD);
      setErrorMsg(null);
      alert('Kata sandi berhasil diatur ulang menjadi: admin123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header with Dark Green Theme */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-400/20">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Area Khusus Pengelola</span>
              </div>
              <h3 className="text-lg font-extrabold text-white">
                Konfirmasi Kata Sandi Admin
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            {school.name} · Masukkan kata sandi petugas untuk mengakses panel kontrol dan data pendaftar.
          </p>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in shake duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span>{errorMsg}</span>
                {attempts >= 2 && (
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="block mt-1 font-bold text-rose-700 underline text-[11px]"
                  >
                    Lupa kata sandi? Klik untuk reset ke default (admin123)
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Kata Sandi Admin / Petugas PPDB
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Toggle password"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Default Password Reminder */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Petunjuk Default:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Kata sandi standar awal adalah <code className="px-1.5 py-0.5 rounded bg-slate-200 font-mono font-bold text-emerald-900">admin123</code>. Anda dapat mengubahnya kapan saja di dalam tab Profil & Pengaturan setelah berhasil masuk.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>Verifikasi & Masuk</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>

          {/* Reset Helper */}
          <div className="pt-2 text-center border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-[11px] text-slate-400 hover:text-slate-700 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset kata sandi ke bawaan ({DEFAULT_ADMIN_PASSWORD})</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
