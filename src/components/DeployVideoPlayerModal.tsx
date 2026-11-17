import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Film, 
  ExternalLink, 
  Copy, 
  Check, 
  Terminal, 
  Globe, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  FileText,
  Tv,
  ArrowRight
} from 'lucide-react';
import { SchoolConfig } from '../types';

interface DeployVideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolConfig;
}

interface VideoChapter {
  id: number;
  title: string;
  subtitle: string;
  durationSec: number; // Duration of this scene in seconds
  timestamp: string;
  narratorText: string;
  iconName: 'terminal' | 'vercel' | 'netlify' | 'sheets' | 'domain';
  summaryPoints: string[];
}

const CHAPTERS: VideoChapter[] = [
  {
    id: 1,
    title: 'Langkah 1: Persiapan & Build Project',
    subtitle: 'Menjalankan perintah npm run build untuk menghasilkan folder dist',
    durationSec: 15,
    timestamp: '00:00 - 00:45',
    narratorText: 'Halo Bapak Ibu pengelola sekolah! Pada video ini kita akan belajar mempublikasikan website PPDB ke internet secara gratis. Langkah pertama adalah menjalankan perintah npm run build pada terminal komputer Anda. Perintah ini akan mengompilasi seluruh kode React menjadi folder dist yang berisi file HTML, CSS, dan Javascript siap pakai.',
    iconName: 'terminal',
    summaryPoints: [
      'Buka terminal pada folder proyek aplikasi sekolah',
      'Ketik perintah: npm run build lalu tekan Enter',
      'Vite akan mengompilasi kode dalam 2-5 detik',
      'Folder dist telah berhasil dibuat dan siap diunggah'
    ]
  },
  {
    id: 2,
    title: 'Langkah 2: Publikasi Otomatis ke Vercel',
    subtitle: 'Hosting gratis, SSL otomatis, dan performa super cepat',
    durationSec: 18,
    timestamp: '00:45 - 01:50',
    narratorText: 'Langkah kedua, kita menggunakan Vercel, platform hosting gratis terbaik untuk aplikasi Vite React. Cukup buka vercel.com, masuk menggunakan akun GitHub sekolah Anda, klik tombol Add New Project, pilih repositori website PPDB, lalu tekan tombol Deploy. Dalam waktu kurang dari satu menit, website Anda sudah aktif dengan sertifikat keamanan SSL gratis!',
    iconName: 'vercel',
    summaryPoints: [
      'Buka situs vercel.com dan login dengan GitHub',
      'Klik tombol "Add New Project" di Dashboard',
      'Pilih repository website PPDB sekolah Anda',
      'Klik "Deploy" - Website langsung online dalam 30 detik!'
    ]
  },
  {
    id: 3,
    title: 'Langkah 3: Alternatif Netlify Drag & Drop',
    subtitle: 'Upload folder dist langsung tanpa install software apapun',
    durationSec: 16,
    timestamp: '01:50 - 02:45',
    narratorText: 'Jika Anda tidak ingin menghubungkan GitHub, Anda bisa menggunakan Netlify Drop. Cukup buka app.netlify.com/drop di browser, lalu tarik atau drag and drop folder dist dari laptop Anda langsung ke layar browser. Website sekolah langsung aktif secara instan dan Anda mendapatkan alamat web gratis.',
    iconName: 'netlify',
    summaryPoints: [
      'Buka app.netlify.com/drop di browser Anda',
      'Buka file explorer komputer, cari folder "dist"',
      'Tarik dan jatuhkan (drag & drop) folder ke kotak Netlify',
      'Website langsung aktif dan siap dibagikan ke calon siswa'
    ]
  },
  {
    id: 4,
    title: 'Langkah 4: Hubungkan Google Sheets API',
    subtitle: 'Pastikan data formulir calon siswa masuk ke spreadsheet',
    durationSec: 18,
    timestamp: '02:45 - 03:55',
    narratorText: 'Langkah keempat sangat penting! Buka Google Sheets pendaftaran sekolah, buka menu Ekstensi, pilih Apps Script, lalu tempel kode backend yang ada di tab Google Sheets API. Klik Terapkan sebagai Aplikasi Web, dan salin URL webhook ke pengaturan website ini agar setiap formulir pendaftar otomatis tersimpan aman di Google Drive sekolah.',
    iconName: 'sheets',
    summaryPoints: [
      'Buka Google Sheets penampung data pendaftar',
      'Buka Ekstensi -> Apps Script dan pasang kode backend',
      'Deploy sebagai "Web App" dengan akses "Anyone"',
      'Salin URL Web App dan tempel di Tab Google Sheets Admin'
    ]
  },
  {
    id: 5,
    title: 'Langkah 5: Pasang Domain Resmi Sekolah',
    subtitle: 'Menggunakan domain resmi .sch.id atau .com agar profesional',
    durationSec: 20,
    timestamp: '03:55 - 05:00',
    narratorText: 'Langkah terakhir untuk tampilan yang profesional adalah memasang domain resmi sekolah, misalnya nama sekolah dot sch dot id. Pada dashboard Vercel atau Netlify, buka menu Settings lalu Domains. Masukkan nama domain Anda, lalu buka panel DNS di penyedia domain Anda dan tambahkan CNAME Record ke Vercel DNS. Selamat, website PPDB resmi sekolah Anda telah mengudara!',
    iconName: 'domain',
    summaryPoints: [
      'Di dashboard Vercel/Netlify, klik menu Settings -> Domains',
      'Ketik domain resmi sekolah Anda (misal: ppdb.sekolah.sch.id)',
      'Buka panel DNS penyedia domain (Rumahweb, Niagahoster, dll)',
      'Buat CNAME record mengarah ke cname.vercel-dns.com'
    ]
  }
];

export function DeployVideoPlayerModal({ isOpen, onClose, school }: DeployVideoPlayerModalProps) {
  const [activeTab, setActiveTab] = useState<'player' | 'script' | 'external'>('player');
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressSec, setProgressSec] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentChapter = CHAPTERS[currentChapterIndex];
  const totalVideoDuration = CHAPTERS.reduce((acc, chap) => acc + chap.durationSec, 0);

  // Calculate global elapsed time across all chapters
  const globalElapsedSec = CHAPTERS.slice(0, currentChapterIndex).reduce((acc, c) => acc + c.durationSec, 0) + progressSec;

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Web Speech API Voice synthesis
  const speakNarrator = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!voiceEnabled) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = playbackSpeed * 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore audio synthesis errors gracefully
    }
  };

  const stopVoice = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopVoice();
    } else {
      setIsPlaying(true);
      if (voiceEnabled) {
        speakNarrator(currentChapter.narratorText);
      }
    }
  };

  // Handle Scene changes
  const jumpToChapter = (index: number) => {
    stopVoice();
    setCurrentChapterIndex(index);
    setProgressSec(0);
    if (isPlaying && voiceEnabled) {
      speakNarrator(CHAPTERS[index].narratorText);
    }
  };

  // Playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      return;
    }

    const intervalTime = 1000 / playbackSpeed;
    playTimerRef.current = setInterval(() => {
      setProgressSec((prev) => {
        const next = prev + 1;
        if (next >= currentChapter.durationSec) {
          // Advance to next chapter
          if (currentChapterIndex < CHAPTERS.length - 1) {
            setCurrentChapterIndex((idx) => idx + 1);
            if (voiceEnabled) {
              speakNarrator(CHAPTERS[currentChapterIndex + 1].narratorText);
            }
            return 0;
          } else {
            // Video ended
            setIsPlaying(false);
            stopVoice();
            return currentChapter.durationSec;
          }
        }
        return next;
      });
    }, intervalTime);

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, currentChapterIndex, playbackSpeed, currentChapter.durationSec, voiceEnabled]);

  // Clean up audio on close
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      stopVoice();
      setProgressSec(0);
      setCurrentChapterIndex(0);
    }
  }, [isOpen]);

  const toggleVoice = () => {
    const nextVoice = !voiceEnabled;
    setVoiceEnabled(nextVoice);
    if (nextVoice && isPlaying) {
      speakNarrator(currentChapter.narratorText);
    } else {
      stopVoice();
    }
  };

  const handleCopyFullScript = () => {
    const fullScript = `🎬 NASKAH VIDEO TUTORIAL: CARA PUBLIKASI WEBSITE PPDB ${school.name.toUpperCase()} KE INTERNET
================================================================================
Dibuat untuk: Pengelola & Panitia PPDB ${school.name}
Estimasi Durasi Total: 05:00 Menit
Target Hosting: Vercel / Netlify (Gratis) + Google Sheets API

${CHAPTERS.map((c) => `
[${c.timestamp}] ${c.title}
--------------------------------------------------------------------------------
SUBTITLE / NARASI SUARA:
"${c.narratorText}"

POIN VISUAL LAYAR (SCREEN RECORDING):
${c.summaryPoints.map((pt) => `• ${pt}`).join('\n')}
`).join('\n')}

================================================================================
PENUTUP & CALL TO ACTION:
"Demikian panduan publikasi website PPDB online ini. Sekarang wali murid dan calon siswa baru dapat mengakses informasi pendaftaran kapan saja dan dari mana saja. Jangan lupa like, bagikan, dan subscribe untuk video tutorial pengelolaan sistem sekolah lainnya!"
`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullScript);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        ref={containerRef}
        className={`bg-slate-900 border border-slate-700/80 text-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 w-full ${
          isFullscreen 
            ? 'fixed inset-0 rounded-none z-50 h-full' 
            : 'max-w-5xl max-h-[92vh] h-full'
        }`}
      >
        
        {/* Modal Topbar */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider text-[10px]">
                  Video Panduan Interaktif
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">• Simulasi Audio-Visual</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                Panduan Publikasi Website PPDB {school.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switchers */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('player')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'player' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                Simulasi Video
              </button>
              <button
                onClick={() => setActiveTab('script')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'script' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                Naskah & Storyboard
              </button>
              <button
                onClick={() => setActiveTab('external')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'external' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                Video Tutorial Eksternal
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="sm:hidden flex items-center justify-around border-b border-slate-800 bg-slate-950 p-1.5 text-xs">
          <button
            onClick={() => setActiveTab('player')}
            className={`flex-1 py-1.5 text-center font-bold rounded-lg ${
              activeTab === 'player' ? 'bg-amber-400 text-slate-950' : 'text-slate-400'
            }`}
          >
            Simulasi Video
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`flex-1 py-1.5 text-center font-bold rounded-lg ${
              activeTab === 'script' ? 'bg-amber-400 text-slate-950' : 'text-slate-400'
            }`}
          >
            Naskah Video
          </button>
          <button
            onClick={() => setActiveTab('external')}
            className={`flex-1 py-1.5 text-center font-bold rounded-lg ${
              activeTab === 'external' ? 'bg-amber-400 text-slate-950' : 'text-slate-400'
            }`}
          >
            Video Eksternal
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto">
          
          {/* TAB 1: INTERACTIVE SIMULATION VIDEO PLAYER */}
          {activeTab === 'player' && (
            <div className="p-4 sm:p-6 space-y-4 max-w-5xl mx-auto">
              
              {/* THE VIDEO SCREEN CANVAS */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black border border-slate-700/80 shadow-2xl flex flex-col">
                
                {/* Simulated Video Top Header / Watermark */}
                <div className="px-4 py-2.5 bg-slate-950/80 backdrop-blur-xs border-b border-slate-800 flex items-center justify-between text-xs z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="font-mono text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                      REC • TUTORIAL PUBLIKASI PPDB
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <span className="font-mono">{currentChapter.timestamp}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">1080p HD</span>
                  </div>
                </div>

                {/* Simulated Screen Content per Chapter */}
                <div className="relative aspect-video min-h-[300px] sm:min-h-[420px] p-5 sm:p-8 flex flex-col justify-center items-center overflow-hidden">
                  
                  {/* Subtle Background Glow */}
                  <div className="absolute inset-0 bg-radial from-emerald-950/30 via-transparent to-transparent pointer-events-none"></div>

                  {/* SCENE 1: TERMINAL BUILD */}
                  {currentChapter.id === 1 && (
                    <div className="w-full max-w-xl bg-slate-950/90 rounded-xl border border-slate-700 shadow-2xl p-4 font-mono text-xs sm:text-sm text-slate-200 space-y-3 animate-in zoom-in-95 duration-300">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                          <span className="ml-2 text-slate-400 text-[11px]">terminal@sekolah: ~/ppdb-website</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold">BASH</span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <p className="text-slate-400">$ ls -la</p>
                        <p className="text-slate-300">&gt; package.json &nbsp; src/ &nbsp; index.html &nbsp; vite.config.ts</p>
                        <div className="pt-2 flex items-center gap-2 text-amber-300 font-bold">
                          <span>$</span>
                          <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            npm run build
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] pt-1">
                          vite v8.3.0 building for production...
                        </p>
                        <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[11px] space-y-0.5">
                          <p>✓ 142 modules transformed.</p>
                          <p>dist/index.html &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1.45 kB │ gzip: 0.65 kB</p>
                          <p>dist/assets/index.js &nbsp;&nbsp;&nbsp;&nbsp; 284.12 kB │ gzip: 82.11 kB</p>
                          <p className="font-bold text-emerald-400 pt-1">✓ built in 1.48s — folder &quot;dist/&quot; siap di-upload!</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCENE 2: VERCEL DEPLOY */}
                  {currentChapter.id === 2 && (
                    <div className="w-full max-w-xl bg-slate-950/95 rounded-xl border border-slate-700 shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-300">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-black border border-white/20 flex items-center justify-center font-black text-white text-xs">
                            ▲
                          </div>
                          <span className="font-bold text-sm text-white">Vercel Dashboard • New Project</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                          Ready to Deploy
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 text-[10px] block">Project Name</span>
                          <span className="font-bold text-white">ppdb-{school.name.toLowerCase().replace(/[^a-z0-9]/g, '')}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 text-[10px] block">Framework Preset</span>
                          <span className="font-bold text-amber-300">Vite (Auto Detected)</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/60 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">URL Domain Otomatis:</p>
                          <p className="text-[11px] font-mono text-emerald-400">https://ppdb-{school.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.vercel.app</p>
                        </div>
                        <span className="px-2 py-1 rounded bg-emerald-500 text-slate-950 font-black text-xs">
                          LIVE (SSL ✓)
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-400">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Hanya 1x Klik tombol Deploy, selesai!</span>
                      </div>
                    </div>
                  )}

                  {/* SCENE 3: NETLIFY DROP */}
                  {currentChapter.id === 3 && (
                    <div className="w-full max-w-xl bg-slate-950/95 rounded-xl border border-slate-700 shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-300">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Globe className="w-5 h-5 text-teal-400" />
                          <span className="font-bold text-sm text-white">app.netlify.com/drop</span>
                        </div>
                        <span className="text-xs text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800 font-mono">
                          Tanpa Terminal / Git
                        </span>
                      </div>

                      {/* Dropzone Simulation */}
                      <div className="border-2 border-dashed border-teal-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-teal-950/10 space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center animate-bounce">
                          <Globe className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-sm text-white">
                          Tarik (Drag) Folder <span className="text-amber-400 font-mono">dist</span> ke Area Ini
                        </h4>
                        <p className="text-xs text-slate-400 max-w-xs">
                          Netlify akan mengekstrak file HTML dan CSS secara otomatis dan membuatkan website publik dalam 10 detik.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Kecepatan Upload:</span>
                        <span className="text-emerald-400 font-bold font-mono">100% Selesai • Online</span>
                      </div>
                    </div>
                  )}

                  {/* SCENE 4: GOOGLE SHEETS API */}
                  {currentChapter.id === 4 && (
                    <div className="w-full max-w-xl bg-slate-950/95 rounded-xl border border-slate-700 shadow-2xl p-5 space-y-3 animate-in zoom-in-95 duration-300">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-emerald-600 flex items-center justify-center font-bold text-white text-[11px]">
                            GS
                          </div>
                          <span className="font-bold text-sm text-white">Google Sheets & Apps Script Setup</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                          Database Gratis
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">1. Salin script dari tab Google Sheets:</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[11px]">code.gs</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">2. Deploy sebagai Web App:</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-[11px]">Execute as: Me</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">3. Siapa yang dapat akses:</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 font-mono text-[11px]">Anyone (Siapa saja)</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs">
                        <span className="text-slate-400 text-[10px] block font-mono">Webhook URL Output:</span>
                        <p className="font-mono text-emerald-300 text-[11px] truncate">
                          https://script.google.com/macros/s/AKfycb.../exec
                        </p>
                      </div>
                    </div>
                  )}

                  {/* SCENE 5: CUSTOM DOMAIN */}
                  {currentChapter.id === 5 && (
                    <div className="w-full max-w-xl bg-slate-950/95 rounded-xl border border-slate-700 shadow-2xl p-5 space-y-3.5 animate-in zoom-in-95 duration-300">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <Globe className="w-5 h-5 text-amber-400" />
                          <span className="font-bold text-sm text-white">Konfigurasi DNS Domain Sekolah</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 text-xs font-bold">
                          Domain Resmi
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
                        <div className="grid grid-cols-3 gap-2 text-slate-400 font-mono text-[10px] pb-1 border-b border-slate-800">
                          <span>TIPE DNS</span>
                          <span>NAMA HOST / SUBDOMAIN</span>
                          <span>TARGET VALUE</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                          <span className="text-amber-300 font-bold">CNAME</span>
                          <span className="text-white">ppdb</span>
                          <span className="text-emerald-400 truncate">cname.vercel-dns.com</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-600/40 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Hasil Akhir:</span>
                          <h4 className="text-sm font-bold text-white">https://ppdb.{school.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.sch.id</h4>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>HTTPS Aktif</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Subtitle / Narration overlay in Video */}
                  <div className="absolute bottom-2 inset-x-4 p-2.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-center">
                    <p className="text-xs sm:text-sm text-slate-200 leading-snug font-medium">
                      &quot;{currentChapter.narratorText}&quot;
                    </p>
                  </div>
                </div>

                {/* Video Scrubber & Playback Controls Bar */}
                <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 space-y-2.5 z-10">
                  
                  {/* Progress scrubber line */}
                  <div className="space-y-1">
                    <div 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const pct = Math.max(0, Math.min(1, clickX / rect.width));
                        const targetChapterIdx = Math.min(CHAPTERS.length - 1, Math.floor(pct * CHAPTERS.length));
                        jumpToChapter(targetChapterIdx);
                      }}
                      className="h-2 w-full bg-slate-800 rounded-full cursor-pointer relative overflow-hidden group"
                    >
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-150 relative"
                        style={{ width: `${(globalElapsedSec / totalVideoDuration) * 100}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{formatTime(globalElapsedSec)}</span>
                      <span>Total: {formatTime(totalVideoDuration)}</span>
                    </div>
                  </div>

                  {/* Controls row */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    
                    {/* Left: Playback buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (currentChapterIndex > 0) jumpToChapter(currentChapterIndex - 1);
                        }}
                        disabled={currentChapterIndex === 0}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Adegan Sebelumnya"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>

                      <button
                        onClick={togglePlay}
                        className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-4 h-4 fill-current" />
                            <span className="text-xs">Jeda</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            <span className="text-xs">Putar</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          if (currentChapterIndex < CHAPTERS.length - 1) {
                            jumpToChapter(currentChapterIndex + 1);
                          }
                        }}
                        disabled={currentChapterIndex === CHAPTERS.length - 1}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Adegan Selanjutnya"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          stopVoice();
                          setCurrentChapterIndex(0);
                          setProgressSec(0);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Ulangi dari Awal"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Middle: Active Chapter Info */}
                    <div className="text-center hidden md:block">
                      <span className="text-xs font-bold text-amber-300 block">
                        {currentChapter.title}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {currentChapter.subtitle}
                      </span>
                    </div>

                    {/* Right: Audio toggle, Speed & Fullscreen */}
                    <div className="flex items-center gap-2">
                      {/* Audio Narration Toggle */}
                      <button
                        onClick={toggleVoice}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                          voiceEnabled 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="Aktifkan Narator Suara Otomatis (Bahasa Indonesia)"
                      >
                        {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{voiceEnabled ? 'Suara Aktif' : 'Suara'}</span>
                      </button>

                      {/* Speed selector */}
                      <select
                        value={playbackSpeed}
                        onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                        className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-lg border border-slate-700 focus:outline-hidden cursor-pointer"
                        title="Kecepatan Video"
                      >
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1.0x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                      </select>

                      {/* Fullscreen */}
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title={isFullscreen ? 'Keluar Fullscreen' : 'Fullscreen'}
                      >
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </button>
                    </div>

                  </div>
                </div>

              </div>

              {/* CHAPTER SELECTION CARDS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="font-bold text-slate-300">Daftar Bab & Adegan Video (Klik untuk Lompat):</span>
                  <span>{currentChapterIndex + 1} dari {CHAPTERS.length} Bab</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {CHAPTERS.map((chap, idx) => {
                    const isCurrent = idx === currentChapterIndex;
                    const isCompleted = idx < currentChapterIndex;
                    return (
                      <button
                        key={chap.id}
                        onClick={() => jumpToChapter(idx)}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                          isCurrent
                            ? 'bg-amber-400/10 border-amber-400/50 shadow-sm'
                            : isCompleted
                            ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isCurrent 
                              ? 'bg-amber-400 text-slate-950' 
                              : isCompleted 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            Bab {chap.id}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {chap.timestamp.split(' - ')[0]}
                          </span>
                        </div>
                        <h4 className={`text-xs font-bold line-clamp-1 ${
                          isCurrent ? 'text-amber-300' : 'text-slate-200'
                        }`}>
                          {chap.title.replace(`Langkah ${chap.id}: `, '')}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {chap.subtitle}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FULL VIDEO SCRIPT & STORYBOARD (FOR RECORDING / PRESENTATION) */}
          {activeTab === 'script' && (
            <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto">
              
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white text-base">
                    Naskah & Storyboard Rekaman Video Tutorial
                  </h3>
                  <p className="text-xs text-slate-400">
                    Gunakan panduan naskah ini jika panitia sekolah ingin merekam video tutorial berdurasi 5 menit untuk YouTube atau sosialisasi tim IT sekolah.
                  </p>
                </div>
                <button
                  onClick={handleCopyFullScript}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {copiedScript ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedScript ? 'Naskah Tersalin!' : 'Salin Seluruh Naskah'}</span>
                </button>
              </div>

              {/* Detailed Scene by Scene Storyboard */}
              <div className="space-y-4">
                {CHAPTERS.map((chap) => (
                  <div key={chap.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-xs">
                          Bab {chap.id}
                        </span>
                        <h4 className="font-bold text-sm text-white">{chap.title}</h4>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900">
                        Timestamp: {chap.timestamp}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {/* Narration script column */}
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                          🎙️ Naskah Narator (Voiceover):
                        </span>
                        <p className="text-slate-300 italic leading-relaxed">
                          &quot;{chap.narratorText}&quot;
                        </p>
                      </div>

                      {/* Screen Action Points column */}
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider block">
                          🖥️ Aksi Layar (Screen Recording):
                        </span>
                        <ul className="space-y-1 text-slate-300">
                          {chap.summaryPoints.map((pt, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-sky-400">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: CURATED EXTERNAL VIDEO TUTORIALS */}
          {activeTab === 'external' && (
            <div className="p-4 sm:p-6 space-y-4 max-w-4xl mx-auto">
              
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <h3 className="font-bold text-white text-base">
                  Rekomendasi Video Tutorial Praktik Resmi
                </h3>
                <p className="text-xs text-slate-400">
                  Berikut referensi video tutorial yang dapat langsung Anda tonton untuk melihat langkah klik per klik di platform penyedia hosting.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Video Card 1: Vercel Deploy */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-white text-slate-950 text-[10px] font-black uppercase">
                      ▲ Vercel
                    </span>
                    <span className="text-[11px] text-amber-400 font-bold">Durasi: ~4 Menit</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    Tutorial Deploy Aplikasi Vite React ke Vercel
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Panduan lengkap menghubungkan akun GitHub ke Vercel untuk deployment otomatis setiap kali ada perubahan data.
                  </p>
                  <a
                    href="https://vercel.com/docs/frameworks/vite"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors pt-1"
                  >
                    <span>Buka Panduan Resmi Vercel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Video Card 2: Netlify Drop */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-teal-500 text-slate-950 text-[10px] font-black uppercase">
                      🌐 Netlify
                    </span>
                    <span className="text-[11px] text-teal-400 font-bold">Durasi: ~2 Menit</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    Cara Drag & Drop Folder Website ke Netlify
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Sangat cocok bagi pemula yang tidak terbiasa dengan Git. Cukup seret folder dist dan website langsung live dalam hitungan detik.
                  </p>
                  <a
                    href="https://app.netlify.com/drop"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors pt-1"
                  >
                    <span>Kunjungi Netlify Drop Langsung</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Video Card 3: Google Apps Script Web App */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black uppercase">
                      📊 Google Sheets
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold">Durasi: ~5 Menit</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    Deploy Google Apps Script sebagai Web API
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Panduan membuat endpoint POST di Google Sheets agar formulir pendaftaran PPDB online langsung terisi otomatis secara real-time.
                  </p>
                  <a
                    href="https://developers.google.com/apps-script/guides/web"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors pt-1"
                  >
                    <span>Dokumentasi Web App Apps Script</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Video Card 4: Setting Domain .sch.id */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                      🏷️ Domain .SCH.ID
                    </span>
                    <span className="text-[11px] text-amber-400 font-bold">Durasi: ~3 Menit</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    Panduan CNAME DNS untuk Domain Resmi Sekolah
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Cara mengarahkan domain madrasah / sekolah dari registrar seperti Rumahweb, Niagahoster, atau DomaiNesia ke hosting Vercel.
                  </p>
                  <a
                    href="https://vercel.com/docs/projects/domains/add-a-domain"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors pt-1"
                  >
                    <span>Panduan Custom Domain Vercel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Tip: Klik tombol <strong>&quot;Suara Aktif&quot;</strong> pada player untuk mendengarkan narasi otomatis Bahasa Indonesia.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>

      </div>
    </div>
  );
}
