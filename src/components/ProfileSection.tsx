import { SchoolConfig } from '../types';
import { 
  Compass, 
  Target, 
  HeartHandshake, 
  Sparkles, 
  Quote, 
  CheckCircle,
  Shield,
  Lightbulb,
  Users2
} from 'lucide-react';

interface ProfileSectionProps {
  school: SchoolConfig;
}

export function ProfileSection({ school }: ProfileSectionProps) {
  const missions = [
    {
      title: 'Menyelenggarakan Pendidikan Berbasis Adab & Karakter Qur’ani',
      description: 'Menumbuhkan kecintaan terhadap Al-Qur’an dan membentuk kepribadian mulia dalam kehidupan sehari-hari.',
    },
    {
      title: 'Mengembangkan Pembelajaran Riset, Sains & Teknologi Terpadu',
      description: 'Membekali siswa dengan kurikulum adaptif, kemampuan coding, robotika, dan riset ilmiah kompetitif.',
    },
    {
      title: 'Mempersiapkan Siswa Menembus Perguruan Tinggi Terbaik & Kedinasan',
      description: 'Pendampingan intensif SNBP, UTBK SNBT, dan persiapan tes fisik/psikotes sekolah kedinasan.',
    },
    {
      title: 'Meningkatkan Keterampilan Bahasa Internasional & Komunikasi',
      description: 'Mengintegrasikan bahasa Inggris dan Arab aktif untuk memperluas cakrawala berpikir global.',
    },
    {
      title: 'Membangun Kepedulian Sosial, Jiwa Kepemimpinan & Cinta Tanah Air',
      description: 'Melatih kepemimpinan melalui organisasi santun, aksi sosial kemasyarakatan, dan kepramukaan.',
    },
  ];

  const coreValues = [
    {
      name: 'Religius & Berakhlak',
      desc: 'Menjadikan nilai spiritual dan keteladanan sebagai pondasi utama berpikir dan bertindak.',
      icon: Sparkles,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      name: 'Integritas Tinggi',
      desc: 'Jujur, disiplin, berani bertanggung jawab, dan memegang teguh komitmen moral.',
      icon: Shield,
      color: 'text-teal-700 bg-teal-50 border-teal-200'
    },
    {
      name: 'Inovatif & Kreatif',
      desc: 'Pantang menyerah dalam memecahkan masalah dengan ide baru dan pemanfaatan teknologi.',
      icon: Lightbulb,
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      name: 'Kemandirian & Tangguh',
      desc: 'Memiliki daya juang tinggi (adversity quotient), siap menghadapi tantangan zaman.',
      icon: Target,
      color: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      name: 'Kolaboratif & Peduli',
      desc: 'Mampu bersinergi dalam tim dan memiliki empati tinggi terhadap sesama manusia.',
      icon: Users2,
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200'
    },
  ];

  return (
    <section id="profil" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Sambutan Kepala Sekolah */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Foto Kepala Sekolah */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-48 h-56 sm:w-56 sm:h-64 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-emerald-950">
                <img
                  src={school.headmasterPhoto}
                  alt={school.headmasterName}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent"></div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {school.headmasterName}
                </h3>
                <p className="text-xs font-semibold text-emerald-700">
                  {school.headmasterTitle}
                </p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  NIP. {school.headmasterNip}
                </p>
              </div>
            </div>

            {/* Kutipan & Sambutan */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                <Quote className="w-4 h-4 text-emerald-600 rotate-180" />
                <span>Sambutan Resmi Kepala Sekolah</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                "Menyiapkan Pemimpin Peradaban Masa Depan yang Cerdas Berilmu dan Kokoh Beriman"
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed italic border-l-4 border-emerald-600 pl-4 py-1 bg-emerald-50/40 rounded-r-lg">
                "{school.headmasterQuote}"
              </p>

              <div className="text-slate-600 text-sm leading-relaxed space-y-3 pt-2">
                <p>
                  Selamat datang kepada para orang tua, wali murid, dan generasi muda calon peserta didik di lingkungan {school.name}. Kami berkomitmen menghadirkan ekosistem sekolah yang aman, inklusif, dan sarat dengan stimulasi intelektual serta pembiasaan ibadah harian.
                </p>
                <p>
                  Melalui sistem pendaftaran PPDB Online ini, kami menjamin kemudahan akses, objektivitas seleksi, serta transparansi penuh bagi seluruh lapisan masyarakat yang mempercayakan amanah pendidikan putera-puterinya bersama kami.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Pendidikan Karakter Teruji
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Tenaga Pendidik S2 & Bersertifikasi
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Lingkungan Sekolah Nyaman & Asri
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Visi & Misi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Visi (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-2xl p-8 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Compass className="w-40 h-40" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700 text-xs font-semibold text-amber-300">
                <Compass className="w-3.5 h-3.5" />
                <span>Visi Utama Lembaga</span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-white">
                Visi Sekolah {school.academicYear}
              </h3>

              <div className="p-5 rounded-xl bg-emerald-950/50 border border-emerald-700/50 backdrop-blur-sm">
                <p className="text-base sm:text-lg font-medium text-emerald-100 leading-relaxed font-['Playfair_Display',serif] italic">
                  "Terwujudnya Generasi Cendekia yang Berakhlak Qur’ani, Unggul dalam IPTEK, Berjiwa Pemimpin, dan Mandiri Berdaya Saing Global."
                </p>
              </div>

              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Visi ini menjadi kompas seluruh penyelenggaraan kurikulum akademik, kegiatan kesiswaan, pembinaan ekstrakurikuler, dan interaksi sosial harian di kampus {school.name}.
              </p>
            </div>
          </div>

          {/* Misi (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              <Target className="w-4 h-4 text-emerald-600" />
              <span>Misi Strategis</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              5 Pilar Misi Pendidikan
            </h3>

            <div className="space-y-4">
              {missions.map((misi, idx) => (
                <div key={idx} className="flex items-start gap-3.5 pb-3.5 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                      {misi.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {misi.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Panca Nilai Karakter (Core Values) */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <span>Karakter Pelajar Cendekia</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Nilai Utama & Budaya Sekolah
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Lima pilar nilai yang ditanamkan dalam keseharian siswa melalui pembiasaan rutin, keteladanan guru, dan program mentoring berkala.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {coreValues.map((val) => {
              const IconComp = val.icon;
              return (
                <div key={val.name} className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all space-y-2.5">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${val.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {val.name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
