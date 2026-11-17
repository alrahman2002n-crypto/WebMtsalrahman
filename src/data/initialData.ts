import { SchoolConfig, Applicant, NewsItem, ProgramItem, ScheduleItem, FaqItem } from '../types';

export const initialSchoolConfig: SchoolConfig = {
  name: 'SMA Bintang Cendekia Mandiri',
  subName: 'Sekolah Unggulan Berbasis Karakter, Sains & Akhlak Mulia',
  level: 'SMA / MA Unggulan',
  slogan: 'Mencetak Generasi Berkarakter, Berakhlak Mulia, dan Berdaya Saing Global',
  npsn: '20194821',
  accreditation: 'Akreditasi A (Unggul · Skor 97/100)',
  address: 'Jl. Pendidikan Luhur No. 88, Cibubur, Ciracas',
  district: 'Ciracas',
  city: 'Jakarta Timur',
  province: 'DKI Jakarta 13720',
  phone: '(021) 8775-9201',
  whatsapp: '6281234567890',
  email: 'ppdb@bintangcendekia.sch.id',
  website: 'https://bintangcendekia.sch.id',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.342296564619!2d106.87189!3d-6.34965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjAnNTguNyJTIDEwNsKwNTInMTguOCJF!5e0!3m2!1sid!2sid!4v1620000000000!5m2!1sid!2sid',
  headmasterName: 'Drs. H. Ahmad Fauzi, M.Pd.',
  headmasterTitle: 'Kepala Sekolah SMA Bintang Cendekia',
  headmasterNip: '19740512 199903 1 004',
  headmasterQuote: 'Pendidikan bukan hanya tentang mengisi wadah kosong dengan angka dan rumus, melainkan menyalakan api keingintahuan, memperkokoh adab, serta membekali anak-anak kita dengan keberanian memimpin peradaban masa depan.',
  headmasterPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
  academicYear: '2026/2027',
  registrationOpen: true,
  quotaRemaining: 68,
  totalQuota: 240,
  googleScriptUrl: '', // Dapat diisi URL Google Apps Script Web App sekolah
};

export const initialApplicants: Applicant[] = [
  {
    id: 'app-001',
    registrationNumber: 'PPDB-2026-0001',
    path: 'Prestasi',
    major: 'MIPA (Ilmu Pengetahuan Alam & Riset)',
    fullName: 'Muhammad Raihan Pratama',
    nisn: '0071234567',
    nik: '3175011204090001',
    birthPlace: 'Jakarta',
    birthDate: '2009-04-12',
    gender: 'Laki-laki',
    religion: 'Islam',
    address: 'Jl. Lapangan Tembak No. 14, Cibubur, Jakarta Timur',
    schoolOrigin: 'SMP Negeri 103 Jakarta',
    fatherName: 'Ir. Bambang Pratama',
    fatherJob: 'Karyawan Swasta',
    motherName: 'Dewi Rahmawati, S.E.',
    motherJob: 'PNS',
    whatsapp: '081298765432',
    parentIncome: 'Rp 5.000.000 - Rp 10.000.000',
    status: 'Lolos Verifikasi',
    verificationNotes: 'Berkas lengkap dan terverifikasi. Nilai rata-rata rapor 91.5 memenuhi syarat jalur prestasi.',
    interviewDate: 'Sabtu, 14 Februari 2026 - Pukul 08.30 WIB (Ruang Rapat 1)',
    createdAt: '2026-01-15 09:14:00',
  },
  {
    id: 'app-002',
    registrationNumber: 'PPDB-2026-0002',
    path: 'Tahfidz Al-Qur\'an',
    major: 'MIPA (Ilmu Pengetahuan Alam & Riset)',
    fullName: 'Aisyah Nur Salsabila',
    nisn: '0089923412',
    nik: '3175026508090003',
    birthPlace: 'Bandung',
    birthDate: '2009-08-25',
    gender: 'Perempuan',
    religion: 'Islam',
    address: 'Jl. Raya Radar AURI Blok B No. 7, Cimanggis, Depok',
    schoolOrigin: 'MTs Negeri 1 Jakarta Selatan',
    fatherName: 'Ust. H. Ridwan Kamil, Lc.',
    fatherJob: 'Wiraswasta / Dai',
    motherName: 'Siti Aminah, S.Pd.I.',
    motherJob: 'Guru',
    whatsapp: '085712349876',
    parentIncome: 'Rp 3.000.000 - Rp 5.000.000',
    status: 'Diterima',
    verificationNotes: 'Lulus tes hafalan 5 Juz mutqin dengan predikat Mumtaz. Berhak atas beasiswa bebas SPP 100%.',
    interviewDate: 'Telah Selesai (Diterima)',
    createdAt: '2026-01-16 11:20:00',
  },
  {
    id: 'app-003',
    registrationNumber: 'PPDB-2026-0003',
    path: 'Reguler',
    major: 'IPS (Ilmu Sosial & Kewirausahaan)',
    fullName: 'Farel Adrian Wicaksono',
    nisn: '0075543219',
    nik: '3175041910090005',
    birthPlace: 'Bogor',
    birthDate: '2009-10-19',
    gender: 'Laki-laki',
    religion: 'Islam',
    address: 'Perum Cibubur Villa 2 Blok C-12, Ciracas',
    schoolOrigin: 'SMP Islam Terpadu Al-Ihsan',
    fatherName: 'Heri Wicaksono',
    fatherJob: 'Wiraswasta',
    motherName: 'Rina Yuliana',
    motherJob: 'Ibu Rumah Tangga',
    whatsapp: '081388776655',
    parentIncome: 'Rp 5.000.000 - Rp 10.000.000',
    status: 'Sedang Ditinjau',
    verificationNotes: 'Data dalam proses validasi sistem panitia PPDB Gelombang 1.',
    createdAt: '2026-01-20 14:45:00',
  },
  {
    id: 'app-004',
    registrationNumber: 'PPDB-2026-0004',
    path: 'Reguler',
    major: 'Kejuruan Rekayasa Perangkat Lunak & AI',
    fullName: 'Nabila Zahra Putri',
    nisn: '0081239874',
    nik: '3175065403090002',
    birthPlace: 'Jakarta',
    birthDate: '2009-03-14',
    gender: 'Perempuan',
    religion: 'Islam',
    address: 'Jl. Jambore Asri No. 42, Harjamukti',
    schoolOrigin: 'SMP Negeri 233 Jakarta',
    fatherName: 'Suryo Utomo',
    fatherJob: 'Karyawan Swasta',
    motherName: 'Endang Susilowati',
    motherJob: 'Wiraswasta',
    whatsapp: '081901234567',
    parentIncome: 'Rp 5.000.000 - Rp 10.000.000',
    status: 'Berkas Perlu Dilengkapi',
    verificationNotes: 'Mohon upload ulang atau serahkan legalisir fotokopi Kartu Keluarga terbaru ke sekretariat.',
    createdAt: '2026-01-22 16:10:00',
  }
];

export const initialNews: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Pendaftaran PPDB Tahun Ajaran 2026/2027 Resmi Dibuka: Kuota Terbatas & Fasilitas Beasiswa Penuh',
    category: 'Pengumuman PPDB',
    date: '10 Januari 2026',
    readTime: '3 menit baca',
    excerpt: 'SMA Bintang Cendekia Mandiri membuka pendaftaran peserta didik baru melalui jalur Prestasi, Tahfidz Al-Qur’an, Afirmasi, dan Jalur Reguler dengan kuota total 240 kursi.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    author: 'Panitia PPDB 2026',
    featured: true,
    content: [
      'Penerimaan Peserta Didik Baru (PPDB) Tahun Pelajaran 2026/2027 resmi dibuka secara daring mulai tanggal 10 Januari 2026. Calon pendaftar dapat mengakses sistem pendaftaran terpadu melalui website resmi tanpa perlu antre di sekolah.',
      'Kepala Sekolah menyatakan bahwa tahun ini sekolah menambah kuota beasiswa khusus bagi siswa penghafal Al-Qur’an minimal 3 Juz dan siswa yang pernah menjuarai kejuaraan sains tingkat kota/provinsi.',
      'Orang tua calon siswa diimbau untuk segera melengkapi berkas digital guna memperlancar proses verifikasi administrasi dan mendapatkan jadwal tes observasi secara tepat waktu.'
    ]
  },
  {
    id: 'news-2',
    title: 'Siswa SMA Bintang Cendekia Sabet Medali Emas Olimpiade Sains Nasional (OSN) 2026',
    category: 'Prestasi',
    date: '24 Januari 2026',
    readTime: '4 menit baca',
    excerpt: 'Dua siswa terbaik berhasil meraih medali emas pada cabang Informatika & Komputer serta Astronomi dalam ajang bergengsi tingkat nasional yang diselenggarakan Kemendikbudristek.',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
    author: 'Humas & Kesiswaan',
    content: [
      'Prestasi membanggakan kembali diukir oleh civitas akademika. Perwakilan sekolah berhasil mengalahkan ratusan finalis dari berbagai penjuru tanah air pada babak final Olimpiade Sains Nasional.',
      'Pembina olimpiade sekolah menjelaskan bahwa keberhasilan ini merupakan hasil dari pembinaan intensif program Klinik Sains Terpadu yang dijalankan setiap pekan.',
      'Sekolah berkomitmen memberikan penghargaan dana beasiswa pendidikan lanjutan bagi para peraih prestasi membanggakan ini.'
    ]
  },
  {
    id: 'news-3',
    title: 'Peluncuran Laboratorium Multimedia Coding & Kecerdasan Buatan (AI) Bekerja Sama dengan Industri',
    category: 'Akademik',
    date: '18 Januari 2026',
    readTime: '3 menit baca',
    excerpt: 'Mempersiapkan siswa menghadapi era revolusi digital, sekolah meresmikan ruang laboratorium multimedia baru yang dilengkapi perangkat komputasi modern dan kurikulum praktis.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
    author: 'Tim IT & Kurikulum',
    content: [
      'Sebagai respons terhadap kemajuan teknologi kecerdasan buatan, sekolah meresmikan ruang lab komputer multimedia modern dengan 40 unit PC berspesifikasi tinggi.',
      'Siswa akan mempelajari dasar logika pemrograman Python, perancangan antarmuka digital, dan penerapan AI etis yang dibimbing oleh praktisi industri teknologi terkemuka.'
    ]
  },
  {
    id: 'news-4',
    title: 'Kegiatan Kemah Bakti Pramuka Penegak Garuda dan Aksi Sosial Lingkungan 2026',
    category: 'Kegiatan Siswa',
    date: '5 Januari 2026',
    readTime: '2 menit baca',
    excerpt: 'Ratusan siswa kelas X dan XI mengikuti perkemahan kepramukaan untuk menanamkan jiwa kemandirian, kepemimpinan, toleransi, serta kepedulian terhadap kelestarian alam.',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
    author: 'Pembina Pramuka',
    content: [
      'Gugus Depan SMA Bintang Cendekia menggelar kegiatan Kemah Bakti selama 3 hari di kawasan Bumi Perkemahan Cibubur.',
      'Selain latihan kepemimpinan dan navigasi darat, siswa juga menyalurkan 250 paket sembako kepada warga sekitar dan melakukan penanaman 300 bibit pohon buah pelindung.'
    ]
  }
];

export const initialPrograms: ProgramItem[] = [
  {
    id: 'prog-1',
    title: 'Kelas Riset Sains & Olimpiade (OSN)',
    category: 'Akademik Unggulan',
    description: 'Program pendampingan intensif bagi siswa berbakat di bidang Matematika, Fisika, Biologi, Kimia, Astronomi, dan Informatika.',
    highlights: ['Bimbingan dosen & alumni medalis OSN', 'Akses lab sains modern standar universitas', 'Tryout olimpiade berkala & pendampingan lomba'],
    icon: 'Microscope'
  },
  {
    id: 'prog-2',
    title: 'Tahfidz Al-Qur’an & Adab Karakter',
    category: 'Karakter & Keagamaan',
    description: 'Membimbing siswa menghafal Al-Qur’an dengan metode mutqin, sanad bersambung, dan penguatan akhlaqul karimah harian.',
    highlights: ['Target mutqin 3 - 5 Juz selama studi', 'Uji komprehensif berkala & wisuda tahfidz', 'Pendampingan asatidz bersyahadah'],
    icon: 'BookOpen'
  },
  {
    id: 'prog-3',
    title: 'Bilingual Cambridge & English Debate',
    category: 'Akademik Unggulan',
    description: 'Penguatan kompetensi komunikasi bahasa internasional melalui Cambridge curriculum checkpoint dan klub debat bahasa Inggris.',
    highlights: ['Native speaker interaction sessions', 'TOEFL/IELTS preparation sejak kelas XI', 'Partisipasi Model United Nations (MUN)'],
    icon: 'Globe'
  },
  {
    id: 'prog-4',
    title: 'Teknologi Coding, Robotika & AI',
    category: 'Akademik Unggulan',
    description: 'Membekali siswa dengan keterampilan masa depan: pemrograman Python/Web, mikrokontroler Arduino/IoT, dan pemanfaatan AI cerdas.',
    highlights: ['Proyek akhir aplikasi siswa tiap semester', 'Kompetisi robotika nasional & pameran karya', 'Sertifikasi kompetensi digital internasional'],
    icon: 'Cpu'
  },
  {
    id: 'prog-5',
    title: 'Pramuka Garuda & Paskibra Sekolah',
    category: 'Ekstrakurikuler',
    description: 'Membentuk fisik yang tangguh, kedisiplinan tinggi, kepemimpinan organisasi, dan kesiapan seleksi sekolah kedinasan (Akpol, Akmil, IPDN).',
    highlights: ['Pelatih profesional purna paskibraka nasional', 'Persiapan seleksi masuk akademi kedinasan', 'Latihan baris berbaris dan survival teruji'],
    icon: 'ShieldCheck'
  },
  {
    id: 'prog-6',
    title: 'Fasilitas Kampus Cendekia Modern',
    category: 'Fasilitas Kampus',
    description: 'Lingkungan belajar ramah anak seluas 1,8 hektar dengan fasilitas terpadu untuk menunjang tumbuh kembang bakat siswa secara holistik.',
    highlights: ['Smart Class dengan proyektor interaktif & AC', 'Masjid Jami dua lantai berkapasitas 1.000 jamaah', 'Perpustakaan digital e-book & audio book'],
    icon: 'School'
  }
];

export const initialSchedules: ScheduleItem[] = [
  {
    step: 1,
    title: 'Gelombang 1: Jalur Prestasi & Tahfidz',
    period: '10 Januari - 28 Februari 2026',
    description: 'Pendaftaran khusus bagi pemilik sertifikat kejuaraan minimal tingkat kota/kabupaten atau hafalan Al-Qur’an minimal 3 Juz.',
    badge: 'Gelombang 1 (Sedang Dibuka)',
    isCurrent: true,
  },
  {
    step: 2,
    title: 'Gelombang 2: Jalur Reguler & Zonasi',
    period: '1 Maret - 30 April 2026',
    description: 'Pendaftaran umum terbuka untuk seluruh lulusan SMP/MTs/sederajat berdasarkan nilai rapor dan tes observasi potensi.',
    badge: 'Gelombang 2 (Akan Datang)',
  },
  {
    step: 3,
    title: 'Tes Observasi & Wawancara Bakat',
    period: 'Sabtu, 9 Mei 2026',
    description: 'Uji potensi akademik, pemetaan gaya belajar, dan wawancara kesiapan belajar calon siswa bersama orang tua.',
    badge: 'Tahap Seleksi',
  },
  {
    step: 4,
    title: 'Pengumuman Kelulusan Online',
    period: 'Jumat, 15 Mei 2026',
    description: 'Pengumuman resmi dapat dilihat langsung melalui portal Cek Status PPDB di website ini menggunakan No. Pendaftaran.',
    badge: 'Hasil Seleksi',
  },
  {
    step: 5,
    title: 'Daftar Ulang & Ukur Seragam',
    period: '18 - 25 Mei 2026',
    description: 'Penyerahan berkas fisik asli, konfirmasi komitmen, dan pengambilan kelengkapan seragam siswa baru.',
    badge: 'Registrasi Final',
  },
  {
    step: 6,
    title: 'Masa Pengenalan Lingkungan Sekolah (MPLS)',
    period: '13 - 15 Juli 2026',
    description: 'Kegiatan orientasi santun, edukatif, dan menyenangkan untuk mengenalkan budaya akademik dan organisasi sekolah.',
    badge: 'Tahun Ajaran Baru',
  }
];

export const initialFaqs: FaqItem[] = [
  {
    category: 'Persyaratan & Jalur',
    question: 'Apa saja dokumen yang wajib diunggah saat pendaftaran online?',
    answer: 'Dokumen utama yang perlu dipersiapkan antara lain: (1) NISN aktif terdaftar di Kemendikbud, (2) NIK dan No. Kartu Keluarga (KK), (3) Surat Keterangan Lulus (SKL) / Surat Keterangan Siswa Kelas IX, (4) Nilai Rapor semester 1 - 5, dan (5) Piagam Prestasi atau Sertifikat Tahfidz bagi yang mendaftar lewat jalur prestasi.'
  },
  {
    category: 'Biaya & Beasiswa',
    question: 'Apakah ada program beasiswa bebas biaya pendidikan?',
    answer: 'Ya! SMA Bintang Cendekia menyediakan Program Beasiswa Penuh (Bebas Biaya Pendidikan 100%) untuk penghafal Al-Qur’an minimal 5 Juz mutqin dan peraih Medali Emas/Perak OSN tingkat Nasional. Tersedia juga beasiswa afirmasi potongan SPP untuk calon siswa berprestasi dari keluarga prasejahtera.'
  },
  {
    category: 'Proses Pendaftaran',
    question: 'Bagaimana jika belum menerima ijazah kelulusan dari SMP/MTs asal?',
    answer: 'Calon siswa tetap bisa mendaftar dengan menggunakan Surat Keterangan Aktif Siswa Kelas IX atau Surat Keterangan Lulus (SKL) sementara dari kepala sekolah asal. Ijazah asli dapat disusulkan saat masa daftar ulang final.'
  },
  {
    category: 'Teknis & Sistem',
    question: 'Bagaimana cara memastikan formulir saya sudah berhasil terkirim?',
    answer: 'Setelah menekan tombol "Kirim Pendaftaran", sistem akan langsung menampilkan Nomor Pendaftaran resmi (contoh: PPDB-2026-0842) beserta tombol "Cetak Kartu Bukti Pendaftaran". Anda juga bisa mengecek status pendaftaran kapan saja pada menu "Cek Status PPDB".'
  },
  {
    category: 'Kontak Panitia',
    question: 'Ke mana saya dapat bertanya jika mengalami kendala saat mendaftar?',
    answer: 'Panitia PPDB siap melayani pertanyaan melalui Hotline WhatsApp resmi di nomor 0812-3456-7890 setiap hari kerja (Senin - Sabtu pukul 08.00 - 15.30 WIB) atau langsung datang ke Sekretariat PPDB di kampus sekolah.'
  }
];
