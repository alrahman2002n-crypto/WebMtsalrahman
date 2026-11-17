import { useState } from 'react';
import { NewsItem } from '../types';
import { initialNews } from '../data/initialData';
import { 
  Newspaper, 
  ArrowRight, 
  Calendar, 
  Clock, 
  X, 
  Share2,
  Check
} from 'lucide-react';

interface NewsSectionProps {
  news?: NewsItem[];
}

export function NewsSection({ news = initialNews }: NewsSectionProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = (newsItem: NewsItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${newsItem.title} - Baca di Website Resmi Sekolah`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="berita" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              <Newspaper className="w-4 h-4 text-emerald-600" />
              <span>Kabar Sekolah Terkini</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Berita, Prestasi & Pengumuman PPDB
            </h2>
            <p className="text-sm text-slate-500">
              Informasi resmi kegiatan kesiswaan, kejuaraan akademik, serta panduan teknis PPDB 2026/2027.
            </p>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.featured && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-emerald-700 text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                      Pengumuman Utama
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  {/* Unboxed Metadata Discipline */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-emerald-800">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {item.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedNews(item)}
                  className="w-full py-2 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Image Header */}
            <div className="relative h-64 sm:h-72 w-full bg-slate-900">
              <img
                src={selectedNews.imageUrl}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup Berita"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Unboxed Metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-emerald-800 uppercase tracking-wider">{selectedNews.category}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {selectedNews.date}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {selectedNews.readTime}
                </span>
                <span aria-hidden="true">·</span>
                <span>Oleh {selectedNews.author}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {selectedNews.title}
              </h2>

              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-4">
                {selectedNews.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => handleShare(selectedNews)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? 'Tautan Disalin!' : 'Bagikan Info'}</span>
                </button>

                <button
                  onClick={() => setSelectedNews(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
