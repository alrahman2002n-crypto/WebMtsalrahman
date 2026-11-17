import { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  Copy, 
  Check, 
  Rocket, 
  Server, 
  ShieldCheck, 
  Terminal, 
  CheckCircle2, 
  AlertCircle,
  FileCode,
  FolderGit2,
  Sparkles,
  Link2,
  Play,
  Film,
  Tv
} from 'lucide-react';
import { SchoolConfig } from '../types';
import { DeployVideoPlayerModal } from './DeployVideoPlayerModal';

interface AdminDeployGuideProps {
  school: SchoolConfig;
}

export function AdminDeployGuide({ school }: AdminDeployGuideProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeDeployMethod, setActiveDeployMethod] = useState<'vercel' | 'netlify' | 'github' | 'cloudflare'>('vercel');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleCopy = (id: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2200);
    }
  };

  const githubActionWorkflow = `name: Deploy PPDB Website to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Application
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white p-6 sm:p-7 rounded-2xl shadow-sm border border-emerald-900/40 relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
              <Rocket className="w-3.5 h-3.5" />
              <span>Panduan Go-Live & Publikasi Online</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>Tersedia Video Tutorial Interaktif</span>
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Cara Mempublikasikan Website PPDB & Sekolah ke Internet
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Aplikasi website ini adalah aplikasi web modern berbasis Vite + React. Seluruh aset statis dapat dibangun (<code className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">npm run build</code>) dan dihosting secara <strong>100% Gratis</strong> di berbagai cloud provider terpercaya dengan sertifikat SSL (HTTPS) resmi.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Putar Video Panduan Interaktif (5 Menit)</span>
            </button>
            <span className="text-xs text-slate-400">
              Disertai simulasi animasi layar & narator suara otomatis
            </span>
          </div>
        </div>
      </div>

      {/* Featured Video Tutorial Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
            <Tv className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Video Walkthrough</span>
              <span className="text-[11px] text-slate-400">• Durasi 05:00</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">5 Bab Lengkap</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white">
              Tonton Simulasi Langkah Demi Langkah Deploy Website
            </h4>
            <p className="text-xs text-slate-300 max-w-xl">
              Mulai dari perintah terminal <code className="text-amber-300 font-mono">npm run build</code>, import Vercel / Netlify Drag & Drop, integrasi Google Sheets, hingga pasang domain resmi sekolah <code className="text-emerald-300 font-mono">.sch.id</code>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsVideoModalOpen(true)}
          className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 text-xs font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Buka Pemutar Video</span>
        </button>
      </div>

      {/* Pre-flight Checklist */}
      <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
          <h4 className="font-bold text-slate-900 text-sm">
            Checklist Penting Sebelum Website Dipublikasikan (Pre-Launch)
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-amber-200/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block">Webhook Google Sheets</strong>
              <span>Pastikan URL Google Apps Script sudah dimasukkan di tab Google Sheets API agar formulir pendaftar langsung tercatat.</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-amber-200/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block">Nomor WhatsApp Panitia</strong>
              <span>Pastikan nomor WhatsApp (<code className="font-mono text-emerald-800">{school.whatsapp}</code>) aktif dan dapat menerima pesan dari calon wali murid.</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-amber-200/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block">Ganti Kata Sandi Admin</strong>
              <span>Ubah kata sandi bawaan (<code className="font-mono">admin123</code>) di tab Profil Sekolah untuk menjaga keamanan data.</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-amber-200/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block">Jadwal & Kuota Kursi</strong>
              <span>Pastikan tanggal gelombang pendaftaran dan sisa kuota kursi ({school.quotaRemaining} / {school.totalQuota}) sudah akurat.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Publishing Methods Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Method Picker Navigation */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase px-2">Pilih Layanan Hosting:</span>
          
          <button
            onClick={() => setActiveDeployMethod('vercel')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeDeployMethod === 'vercel'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>▲ Vercel</span>
            <span className="text-[10px] px-1 rounded bg-amber-400 text-slate-950 font-bold">Paling Mudah</span>
          </button>

          <button
            onClick={() => setActiveDeployMethod('netlify')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeDeployMethod === 'netlify'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🌐 Netlify</span>
            <span className="text-[10px] text-teal-400">Drag & Drop</span>
          </button>

          <button
            onClick={() => setActiveDeployMethod('github')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeDeployMethod === 'github'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>GitHub Pages</span>
          </button>

          <button
            onClick={() => setActiveDeployMethod('cloudflare')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeDeployMethod === 'cloudflare'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Cloudflare Pages</span>
          </button>
        </div>

        {/* Method 1: VERCEL */}
        {activeDeployMethod === 'vercel' && (
          <div className="p-6 space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Deploy ke Vercel (Rekomendasi Utama - Proses 2 Menit)</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vercel menyediakan bandwidth besar, CDN global otomatis, HTTPS SSL gratis, dan integrasi continuous deployment dari GitHub.
                </p>
              </div>
              <a 
                href="https://vercel.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                <span>Buka Vercel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <strong className="text-slate-900 text-xs uppercase tracking-wider block">Langkah-Langkah:</strong>
                <ol className="list-decimal list-inside space-y-2 text-slate-700">
                  <li>Unggah (push) kode proyek ini ke akun GitHub sekolah Anda (misal nama repositori: <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono">ppdb-sekolah</code>).</li>
                  <li>Buka <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold underline">Vercel.com</a> lalu masuk menggunakan akun GitHub Anda.</li>
                  <li>Klik tombol biru <strong>"Add New..." &gt; "Project"</strong>.</li>
                  <li>Pilih repositori GitHub sekolah Anda, lalu klik <strong>"Import"</strong>.</li>
                  <li>Vercel akan secara otomatis mendeteksi Framework <strong>Vite</strong>:
                    <ul className="list-disc list-inside pl-4 mt-1 text-slate-600 space-y-0.5">
                      <li>Build Command: <code className="bg-slate-200 px-1 py-0.2 rounded font-mono">npm run build</code></li>
                      <li>Output Directory: <code className="bg-slate-200 px-1 py-0.2 rounded font-mono">dist</code></li>
                      <li>Install Command: <code className="bg-slate-200 px-1 py-0.2 rounded font-mono">npm install</code></li>
                    </ul>
                  </li>
                  <li>Klik tombol biru <strong>"Deploy"</strong>.</li>
                  <li>Tunggu sekitar 30 - 60 detik. Website sekolah Anda kini langsung aktif di domain gratis (contoh: <code className="text-emerald-800 font-bold font-mono">https://ppdb-sekolah.vercel.app</code>)!</li>
                </ol>
              </div>

              {/* Alternative: Deploy via Vercel CLI */}
              <div className="p-4 rounded-xl bg-slate-950 text-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>Opsi Cepat: Deploy Langsung dari Terminal / Komputer Anda</span>
                  </span>
                  <button
                    onClick={() => handleCopy('cli-vercel', 'npx vercel --prod')}
                    className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-white"
                  >
                    {copiedId === 'cli-vercel' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'cli-vercel' ? 'Tersalin' : 'Salin Perintah'}</span>
                  </button>
                </div>
                <pre className="font-mono text-xs text-emerald-400 bg-slate-900 p-2.5 rounded-lg overflow-x-auto">
npx vercel --prod
                </pre>
                <p className="text-[11px] text-slate-400">
                  Jalankan perintah ini di folder proyek komputer Anda. Ikuti panduan di layar untuk login dan website langsung terpublikasi.
                </p>
              </div>

              {/* Troubleshooting 404 NOT_FOUND */}
              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Solusi Jika Muncul Error &quot;404: NOT_FOUND&quot; Setelah Deploy di Vercel:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700">
                  <li>
                    <strong>Cek Struktur Folder di GitHub (Penyebab Paling Sering):</strong> Pastikan file <code className="bg-white px-1 rounded border border-rose-200 font-mono">package.json</code>, <code className="bg-white px-1 rounded border border-rose-200 font-mono">index.html</code>, dan <code className="bg-white px-1 rounded border border-rose-200 font-mono">vercel.json</code> berada langsung di halaman utama (root) repositori GitHub, <strong>bukan</strong> di dalam sub-folder. Jika berada di dalam sub-folder (misalnya <code className="font-mono">ppdb-app/package.json</code>), buka <strong>Vercel &gt; Settings &gt; Build and Deployment &gt; Root Directory</strong> lalu isi nama sub-folder tersebut.
                  </li>
                  <li>
                    <strong>Cek Framework &amp; Output Directory di Vercel:</strong> Masuk ke menu <strong>Settings &gt; Build and Deployment</strong> pada proyek Vercel Anda, pastikan:
                    <ul className="list-disc list-inside pl-4 mt-1 text-slate-600">
                      <li>Framework Preset: <strong>Vite</strong></li>
                      <li>Build Command: <code className="bg-white px-1 rounded border border-rose-200 font-mono">npm run build</code></li>
                      <li>Output Directory: <code className="bg-white px-1 rounded border border-rose-200 font-mono">dist</code></li>
                    </ul>
                  </li>
                  <li>
                    <strong>Redeploy:</strong> Setelah memperbaiki pengaturan di atas, buka tab <strong>Deployments</strong> di Vercel, klik titik tiga pada deploy terakhir, lalu pilih <strong>Redeploy</strong>.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Method 2: NETLIFY */}
        {activeDeployMethod === 'netlify' && (
          <div className="p-6 space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Deploy ke Netlify (Bisa Tanpa Git / Cukup Drag & Drop Folder)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cocok untuk staf tata usaha atau operator yang ingin mempublikasikan situs tanpa harus menguasai Git.
                </p>
              </div>
              <a 
                href="https://app.netlify.com/drop" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hidden sm:flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800"
              >
                <span>Netlify Drop</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2">
                <strong className="text-teal-950 font-bold block">Cara 1: Metode Drag & Drop (Paling Instan)</strong>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                  <li>Buka terminal komputer Anda di folder proyek ini lalu jalankan perintah:
                    <div className="my-1.5 flex items-center justify-between bg-slate-950 text-emerald-400 font-mono text-xs p-2 rounded-lg">
                      <span>npm run build</span>
                      <button 
                        onClick={() => handleCopy('cmd-build', 'npm run build')}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedId === 'cmd-build' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </li>
                  <li>Perintah ini akan membuat folder baru bernama <strong>`dist`</strong> yang berisi seluruh file website yang siap tayang.</li>
                  <li>Buka peramban ke halaman: <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-teal-700 font-bold underline">app.netlify.com/drop</a>.</li>
                  <li>Tarik (drag) folder <strong>`dist`</strong> dari komputer Anda dan lepaskan di area kotak Netlify.</li>
                  <li>Dalam hitungan detik, Netlify akan memberikan alamat URL online langsung (contoh: <code className="font-mono text-teal-900 font-bold">https://ppdb-cendekia.netlify.app</code>).</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <strong className="text-slate-900 font-bold block">Cara 2: Sambungkan Repository GitHub ke Netlify</strong>
                <p className="text-slate-600 text-xs">
                  Sama seperti Vercel, masuk ke Netlify &gt; Add new site &gt; Import an existing project &gt; GitHub &gt; Pilih repositori &gt; Klik Deploy site. Setiap Anda mengubah kode di GitHub, Netlify otomatis memperbarui website Anda.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Method 3: GITHUB PAGES */}
        {activeDeployMethod === 'github' && (
          <div className="p-6 space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900">
                Deploy ke GitHub Pages (Gratis Selamanya dari Repositori Sekolah)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Menggunakan fitur bawaan GitHub Actions untuk build otomatis setiap kali ada update.
              </p>
            </div>

            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-slate-700">
                <li>Buka repository GitHub sekolah Anda di peramban.</li>
                <li>Klik tab <strong>Settings</strong> &gt; pilih menu <strong>Pages</strong> di bilah kiri.</li>
                <li>Di bagian <strong>Build and deployment &gt; Source</strong>, pilih <strong>"GitHub Actions"</strong>.</li>
                <li>Buat file baru di repositori Anda di path: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-slate-900">.github/workflows/deploy.yml</code>.</li>
                <li>Salin kode workflow GitHub Actions di bawah ini dan simpan ke file tersebut:</li>
              </ol>

              <div className="relative rounded-xl overflow-hidden bg-slate-950 text-slate-200 border border-slate-800">
                <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400">.github/workflows/deploy.yml</span>
                  <button
                    onClick={() => handleCopy('gh-workflow', githubActionWorkflow)}
                    className="flex items-center gap-1 text-xs text-amber-300 hover:text-white"
                  >
                    {copiedId === 'gh-workflow' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'gh-workflow' ? 'Kode Disalin!' : 'Salin Kode Workflow'}</span>
                  </button>
                </div>
                <pre className="p-4 font-mono text-xs overflow-x-auto max-h-64 text-slate-300">
                  {githubActionWorkflow}
                </pre>
              </div>

              <p className="text-xs text-slate-600">
                Setelah commit file tersebut, GitHub Actions akan otomatis menjalankan build dan menerbitkan website Anda di <code className="font-mono text-emerald-800 font-bold">https://username-sekolah.github.io/nama-repo/</code>.
              </p>
            </div>
          </div>
        )}

        {/* Method 4: CLOUDFLARE PAGES */}
        {activeDeployMethod === 'cloudflare' && (
          <div className="p-6 space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900">
                Deploy ke Cloudflare Pages (Tercepat & Perlindungan Anti-DDoS Tanpa Batas)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Sangat disarankan jika website pendaftaran diakses oleh ribuan calon siswa secara bersamaan saat hari pembukaan pendaftaran.
              </p>
            </div>

            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>Daftar akun gratis di <a href="https://pages.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold underline">Cloudflare Pages</a>.</li>
              <li>Klik <strong>"Create an application"</strong> &gt; pilih tab <strong>"Pages"</strong> &gt; <strong>"Connect to Git"</strong>.</li>
              <li>Pilih repositori GitHub sekolah Anda.</li>
              <li>Pada pengaturan build:
                <ul className="list-disc list-inside pl-4 mt-1 text-slate-600">
                  <li>Framework preset: <strong>Vite</strong></li>
                  <li>Build command: <code className="bg-slate-100 px-1 py-0.2 rounded font-mono">npm run build</code></li>
                  <li>Build output directory: <code className="bg-slate-100 px-1 py-0.2 rounded font-mono">dist</code></li>
                </ul>
              </li>
              <li>Klik <strong>Save and Deploy</strong>. Selesai!</li>
            </ol>
          </div>
        )}

      </div>

      {/* Custom Domain Guide (sch.id / id / com) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
            Cara Menghubungkan Domain Resmi Sekolah (Misal: ppdb.sekolah.sch.id)
          </h4>
        </div>
        
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Agar website tampak profesional dan terpercaya, Anda dapat menyambungkan subdomain resmi sekolah Anda tanpa biaya hosting tambahan:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[11px]">1</span>
            <strong className="block text-slate-900">Tambahkan Domain di Vercel / Netlify</strong>
            <p className="text-slate-600">
              Buka menu <strong>Settings &gt; Domains</strong> pada dashboard proyek Vercel/Netlify Anda. Masukkan nama domain, contoh: <code className="font-mono text-emerald-800">ppdb.bintangcendekia.sch.id</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[11px]">2</span>
            <strong className="block text-slate-900">Atur DNS di Registrar Domain</strong>
            <p className="text-slate-600">
              Buka panel DNS domain sekolah Anda (di Rumahweb, Niagahoster, Cloudflare, dll.). Tambahkan record baru:
              <br />
              • Type: <strong>CNAME</strong>
              <br />
              • Name / Host: <strong>ppdb</strong>
              <br />
              • Target: <strong>cname.vercel-dns.com</strong>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[11px]">3</span>
            <strong className="block text-slate-900">SSL Aktif Otomatis</strong>
            <p className="text-slate-600">
              Vercel atau Netlify akan secara otomatis menerbitkan sertifikat SSL gembok hijau HTTPS resmi gratis dalam 5-15 menit setelah DNS terhubung.
            </p>
          </div>
        </div>
      </div>

      {/* Share & Promotion Tips */}
      <div className="p-5 rounded-2xl bg-emerald-950 text-white space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Tips Penyebaran Informasi PPDB ke Masyarakat</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Setelah website online, bagikan tautan website Anda ke grup WhatsApp komite sekolah, media sosial resmi (Instagram/Facebook/TikTok sekolah), dan cetak QR Code di banner/brosur PPDB di depan gerbang sekolah yang langsung mengarah ke formulir online ini!
        </p>
      </div>

      {/* Deploy Interactive Video Player Modal */}
      <DeployVideoPlayerModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        school={school}
      />

    </div>
  );
}
