import { SchoolConfig, Applicant } from '../types';
import { initialSchoolConfig, initialApplicants } from '../data/initialData';

const SCHOOL_CONFIG_KEY = 'ppdb_school_config_v1';
const APPLICANTS_KEY = 'ppdb_applicants_v1';

export function getStoredSchoolConfig(): SchoolConfig {
  try {
    const data = localStorage.getItem(SCHOOL_CONFIG_KEY);
    if (data) {
      return { ...initialSchoolConfig, ...JSON.parse(data) };
    }
  } catch (err) {
    console.warn('Failed to load school config from storage', err);
  }
  return initialSchoolConfig;
}

export function saveSchoolConfig(config: SchoolConfig): void {
  try {
    localStorage.setItem(SCHOOL_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save school config', err);
  }
}

export function getStoredApplicants(): Applicant[] {
  try {
    const data = localStorage.getItem(APPLICANTS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load applicants from storage', err);
  }
  return initialApplicants;
}

export function saveApplicants(applicants: Applicant[]): void {
  try {
    localStorage.setItem(APPLICANTS_KEY, JSON.stringify(applicants));
  } catch (err) {
    console.error('Failed to save applicants', err);
  }
}

const NEWS_KEY = 'ppdb_news_v1';
const SCHEDULES_KEY = 'ppdb_schedules_v1';
const PROGRAMS_KEY = 'ppdb_programs_v1';
const FAQS_KEY = 'ppdb_faqs_v1';

import { initialNews, initialPrograms, initialSchedules, initialFaqs } from '../data/initialData';
import { NewsItem, ProgramItem, ScheduleItem, FaqItem } from '../types';

export function getStoredNews(): NewsItem[] {
  try {
    const data = localStorage.getItem(NEWS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load news from storage', err);
  }
  return initialNews;
}

export function saveNews(news: NewsItem[]): void {
  try {
    localStorage.setItem(NEWS_KEY, JSON.stringify(news));
  } catch (err) {
    console.error('Failed to save news', err);
  }
}

export function getStoredSchedules(): ScheduleItem[] {
  try {
    const data = localStorage.getItem(SCHEDULES_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load schedules from storage', err);
  }
  return initialSchedules;
}

export function saveSchedules(schedules: ScheduleItem[]): void {
  try {
    localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
  } catch (err) {
    console.error('Failed to save schedules', err);
  }
}

export function getStoredPrograms(): ProgramItem[] {
  try {
    const data = localStorage.getItem(PROGRAMS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load programs from storage', err);
  }
  return initialPrograms;
}

export function savePrograms(programs: ProgramItem[]): void {
  try {
    localStorage.setItem(PROGRAMS_KEY, JSON.stringify(programs));
  } catch (err) {
    console.error('Failed to save programs', err);
  }
}

export function getStoredFaqs(): FaqItem[] {
  try {
    const data = localStorage.getItem(FAQS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load faqs from storage', err);
  }
  return initialFaqs;
}

export function saveFaqs(faqs: FaqItem[]): void {
  try {
    localStorage.setItem(FAQS_KEY, JSON.stringify(faqs));
  } catch (err) {
    console.error('Failed to save faqs', err);
  }
}

export function formatRupiah(value: string | number): string {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  }
  return value;
}

export function generateRegistrationNumber(existingApplicants: Applicant[]): string {
  const currentYear = new Date().getFullYear();
  const nextNum = existingApplicants.length + 1;
  const paddedNum = String(nextNum).padStart(4, '0');
  return `PPDB-${currentYear}-${paddedNum}`;
}

export function createWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
}

const ADMIN_PASSWORD_KEY = 'ppdb_admin_password_v1';
export const DEFAULT_ADMIN_PASSWORD = 'admin123';
const ADMIN_SESSION_KEY = 'ppdb_admin_session_auth';

export function getStoredAdminPassword(): string {
  try {
    const pw = localStorage.getItem(ADMIN_PASSWORD_KEY);
    if (pw && pw.trim().length > 0) return pw.trim();
  } catch (err) {
    console.warn('Failed to load admin password from storage', err);
  }
  return DEFAULT_ADMIN_PASSWORD;
}

export function saveAdminPassword(password: string): void {
  try {
    localStorage.setItem(ADMIN_PASSWORD_KEY, password);
  } catch (err) {
    console.error('Failed to save admin password', err);
  }
}

export function getAdminSessionAuth(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminSessionAuth(isAuth: boolean): void {
  try {
    if (isAuth) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch (err) {
    console.warn('Failed to set session auth', err);
  }
}
