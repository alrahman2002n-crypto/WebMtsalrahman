import { useState } from 'react';
import { SchoolConfig, FaqItem } from '../types';
import { initialFaqs } from '../data/initialData';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronDown, 
  HelpCircle, 
  MessageSquare,
  Building2,
  ExternalLink
} from 'lucide-react';
import { createWhatsAppUrl } from '../utils/storage';

interface ContactSectionProps {
  school: SchoolConfig;
  faqs?: FaqItem[];
}

export function ContactSection({ school, faqs = initialFaqs }: ContactSectionProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const waPanitiaUrl = createWhatsAppUrl(
    school.whatsapp,
    `Halo Panitia PPDB ${school.name}, saya ingin menanyakan jadwal dan persyaratan pendaftaran.`
  );

  return (
    <section id="kontak" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Pusat Bantuan & Lokasi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hubungi Panitia & Sekretariat PPDB
          </h2>
          <p className="text-sm text-slate-500">
            Kami siap mendampingi proses pendaftaran putera-puteri Anda baik secara daring maupun luring di kampus sekolah.
          </p>
        </div>

        {/* 2 Column: Kontak & Maps Embed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Info Card (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-md">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Sekretariat Pendaftaran
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {school.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Ruang Layanan Informasi Terpadu Lantai 1 Gedung Utama
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Alamat Lengkap:</span>
                  <span>{school.address}, {school.district}, {school.city}, {school.province}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Jam Operasional Layanan:</span>
                  <span>Senin - Jumat: 08.00 - 15.30 WIB</span>
                  <span className="block text-slate-400">Sabtu: 08.00 - 13.00 WIB (Hari Libur/Minggu Tutup)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Telepon Kantor:</span>
                  <span>{school.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Email Resmi:</span>
                  <span>{school.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <a
                href={waPanitiaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Langsung WhatsApp Panitia</span>
              </a>
            </div>
          </div>

          {/* Google Maps Embed (7 cols) */}
          <div className="lg:col-span-7 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-xs h-96 sm:h-[420px] relative">
            <iframe
              title={`Peta Lokasi ${school.name}`}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.342296564619!2d106.87189!3d-6.34965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec3119198f39%3A0x6b77469a47895e63!2sCibubur%2C%20Ciracas%2C%20East%20Jakarta%20City%2C%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
            
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-700 font-semibold shadow-xs flex items-center gap-1.5">
              <span>{school.city}</span>
              <ExternalLink className="w-3 h-3 text-emerald-700" />
            </div>
          </div>

        </div>

        {/* FAQ Accordion Section */}
        <div className="space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Informasi Tambahan Seputar PPDB
            </h3>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm hover:text-emerald-800 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-700' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
