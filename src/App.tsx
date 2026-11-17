/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  SchoolConfig, 
  Applicant, 
  NewsItem, 
  ScheduleItem, 
  ProgramItem, 
  FaqItem 
} from './types';
import { 
  getStoredSchoolConfig, 
  saveSchoolConfig, 
  getStoredApplicants, 
  saveApplicants,
  getStoredNews,
  saveNews,
  getStoredSchedules,
  saveSchedules,
  getStoredPrograms,
  savePrograms,
  getStoredFaqs,
  saveFaqs,
  getStoredAdminPassword,
  saveAdminPassword,
  getAdminSessionAuth,
  setAdminSessionAuth,
  DEFAULT_ADMIN_PASSWORD
} from './utils/storage';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProfileSection } from './components/ProfileSection';
import { ProgramsSection } from './components/ProgramsSection';
import { NewsSection } from './components/NewsSection';
import { PpdbSection } from './components/PpdbSection';
import { CheckStatusSection } from './components/CheckStatusSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PpdbFormModal } from './components/PpdbFormModal';
import { RegistrationCardModal } from './components/RegistrationCardModal';
import { AdminGuideDrawer } from './components/AdminGuideDrawer';
import { AdminPage } from './components/AdminPage';
import { AdminLoginModal } from './components/AdminLoginModal';

import { FileText, CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [school, setSchool] = useState<SchoolConfig>(getStoredSchoolConfig);
  const [applicants, setApplicants] = useState<Applicant[]>(getStoredApplicants);
  const [news, setNews] = useState<NewsItem[]>(getStoredNews);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(getStoredSchedules);
  const [programs, setPrograms] = useState<ProgramItem[]>(getStoredPrograms);
  const [faqs, setFaqs] = useState<FaqItem[]>(getStoredFaqs);

  // Authentication & Admin View State
  const [adminPassword, setAdminPassword] = useState<string>(getStoredAdminPassword);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(getAdminSessionAuth);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [isAdminPageActive, setIsAdminPageActive] = useState<boolean>(false);

  // Modals & Panels State
  const [isPpdbFormOpen, setIsPpdbFormOpen] = useState(false);
  const [isAdminGuideOpen, setIsAdminGuideOpen] = useState(false);
  const [isRegistrationCardOpen, setIsRegistrationCardOpen] = useState(false);
  const [activeApplicantForCard, setActiveApplicantForCard] = useState<Applicant | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save changes to storage whenever state updates
  useEffect(() => {
    saveSchoolConfig(school);
  }, [school]);

  useEffect(() => {
    saveApplicants(applicants);
  }, [applicants]);

  useEffect(() => {
    saveNews(news);
  }, [news]);

  useEffect(() => {
    saveSchedules(schedules);
  }, [schedules]);

  useEffect(() => {
    savePrograms(programs);
  }, [programs]);

  useEffect(() => {
    saveFaqs(faqs);
  }, [faqs]);

  // Request to open Admin Page (requires authentication)
  const handleRequestAdminAccess = () => {
    if (isAdminAuthenticated) {
      setIsAdminPageActive(true);
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  // Successful login in AdminLoginModal
  const handleSuccessAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setAdminSessionAuth(true);
    setIsAdminLoginModalOpen(false);
    setIsAdminPageActive(true);
    setToastMessage('Autentikasi berhasil! Selamat datang di Dashboard Admin.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Update Admin Password
  const handleUpdatePassword = (newPw: string) => {
    setAdminPassword(newPw);
    saveAdminPassword(newPw);
    setToastMessage('Kata sandi admin berhasil diperbarui!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reset Admin Password to Default
  const handleResetPasswordToDefault = () => {
    setAdminPassword(DEFAULT_ADMIN_PASSWORD);
    saveAdminPassword(DEFAULT_ADMIN_PASSWORD);
    setToastMessage('Kata sandi admin diatur ulang ke default (admin123)');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Logout / Lock Admin Dashboard
  const handleLogoutAdmin = () => {
    setIsAdminPageActive(false);
    setIsAdminAuthenticated(false);
    setAdminSessionAuth(false);
    setToastMessage('Sesi admin telah dikunci.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenPpdbForm = () => {
    setIsPpdbFormOpen(true);
  };

  const handleOpenAdminGuide = () => {
    setIsAdminGuideOpen(true);
  };

  const handleOpenCheckStatus = () => {
    const el = document.getElementById('cek-status');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitSuccess = (newApplicant: Applicant) => {
    const updated = [newApplicant, ...applicants];
    setApplicants(updated);
    setIsPpdbFormOpen(false);
    setActiveApplicantForCard(newApplicant);
    setIsRegistrationCardOpen(true);

    setToastMessage(`Pendaftaran Berhasil! Nomor Anda: ${newApplicant.registrationNumber}`);
    setTimeout(() => {
      setToastMessage(null), 6000;
    });
  };

  const handlePrintCard = (applicant: Applicant) => {
    setActiveApplicantForCard(applicant);
    setIsRegistrationCardOpen(true);
  };

  const handleUpdateSchoolConfig = (newConfig: SchoolConfig) => {
    setSchool(newConfig);
  };

  const handleUpdateApplicantStatus = (id: string, newStatus: Applicant['status'], notes?: string) => {
    setApplicants(prev =>
      prev.map(a => {
        if (a.id === id) {
          return {
            ...a,
            status: newStatus,
            verificationNotes: notes || a.verificationNotes || `Status diperbarui menjadi ${newStatus}`
          };
        }
        return a;
      })
    );
  };

  const handleAddManualApplicant = (newApplicant: Applicant) => {
    setApplicants(prev => [newApplicant, ...prev]);
    setToastMessage(`Pendaftar manual berhasil ditambahkan: ${newApplicant.registrationNumber}`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Jika halaman admin aktif, tampilkan Dedicated Admin Dashboard Page
  if (isAdminPageActive) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-800">
        <AdminPage
          school={school}
          onUpdateSchool={handleUpdateSchoolConfig}
          applicants={applicants}
          onUpdateApplicantStatus={handleUpdateApplicantStatus}
          onAddManualApplicant={handleAddManualApplicant}
          news={news}
          onUpdateNews={setNews}
          schedules={schedules}
          onUpdateSchedules={setSchedules}
          programs={programs}
          onUpdatePrograms={setPrograms}
          faqs={faqs}
          onUpdateFaqs={setFaqs}
          onPrintCard={handlePrintCard}
          onBackToWebsite={handleLogoutAdmin}
          currentPassword={adminPassword}
          onUpdatePassword={handleUpdatePassword}
        />

        {/* Modal Cetak Kartu dari Admin */}
        <RegistrationCardModal
          isOpen={isRegistrationCardOpen}
          onClose={() => setIsRegistrationCardOpen(false)}
          applicant={activeApplicantForCard}
          school={school}
        />
      </div>
    );
  }

  // Tampilan Halaman Publik Utama Sekolah
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-900 text-white shadow-xl border border-emerald-700 text-xs sm:text-sm animate-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-emerald-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        school={school}
        onOpenPpdbForm={handleOpenPpdbForm}
        onOpenCheckStatus={handleOpenCheckStatus}
        onOpenAdminGuide={handleOpenAdminGuide}
        onOpenAdminPage={handleRequestAdminAccess}
      />

      {/* Main Sections */}
      <main className="flex-1">
        <HeroSection
          school={school}
          onOpenPpdbForm={handleOpenPpdbForm}
          onOpenCheckStatus={handleOpenCheckStatus}
        />

        <ProfileSection school={school} />

        <ProgramsSection />

        <PpdbSection
          school={school}
          schedules={schedules}
          onOpenPpdbForm={handleOpenPpdbForm}
          onOpenCheckStatus={handleOpenCheckStatus}
        />

        <CheckStatusSection
          school={school}
          allApplicants={applicants}
          onPrintCard={handlePrintCard}
          onOpenPpdbForm={handleOpenPpdbForm}
        />

        <NewsSection news={news} />

        <ContactSection school={school} faqs={faqs} />
      </main>

      {/* Footer */}
      <Footer
        school={school}
        onOpenPpdbForm={handleOpenPpdbForm}
        onOpenCheckStatus={handleOpenCheckStatus}
        onOpenAdminGuide={handleOpenAdminGuide}
        onOpenAdminPage={handleRequestAdminAccess}
      />

      {/* Floating Action Button (Mobile Only) */}
      <div className="no-print fixed bottom-5 right-5 z-30 sm:hidden">
        <button
          onClick={handleOpenPpdbForm}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-700 text-white font-bold text-xs shadow-xl hover:bg-emerald-800 active:scale-95 transition-all border-2 border-amber-300/60"
        >
          <FileText className="w-4 h-4 text-amber-300" />
          <span>Daftar PPDB</span>
        </button>
      </div>

      {/* PPDB Registration Form Modal */}
      <PpdbFormModal
        isOpen={isPpdbFormOpen}
        onClose={() => setIsPpdbFormOpen(false)}
        school={school}
        allApplicants={applicants}
        onSubmitSuccess={handleSubmitSuccess}
      />

      {/* Official Printable Registration Card Modal */}
      <RegistrationCardModal
        isOpen={isRegistrationCardOpen}
        onClose={() => setIsRegistrationCardOpen(false)}
        applicant={activeApplicantForCard}
        school={school}
      />

      {/* Admin, School Customizer & Google Sheets Guide Drawer */}
      <AdminGuideDrawer
        isOpen={isAdminGuideOpen}
        onClose={() => setIsAdminGuideOpen(false)}
        school={school}
        onUpdateSchool={handleUpdateSchoolConfig}
        applicants={applicants}
        onUpdateApplicantStatus={handleUpdateApplicantStatus}
      />

      {/* Admin Password Confirmation / Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        currentPassword={adminPassword}
        onSuccessLogin={handleSuccessAdminLogin}
        onResetPasswordToDefault={handleResetPasswordToDefault}
        school={school}
      />

    </div>
  );
}
