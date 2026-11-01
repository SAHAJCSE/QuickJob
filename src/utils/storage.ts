import { JobApplication, UserProfile } from '../types';
import { DEFAULT_USER_PROFILE } from '../data/jobs';

const SAVED_JOBS_KEY = 'job_finder_saved_jobs_v1';
const APPLICATIONS_KEY = 'job_finder_applications_v1';
const PROFILE_KEY = 'job_finder_user_profile_v1';

export const getSavedJobIds = (): string[] => {
  try {
    const data = localStorage.getItem(SAVED_JOBS_KEY);
    return data ? JSON.parse(data) : ['job-1', 'job-2']; // default bookmarks
  } catch (err) {
    return ['job-1', 'job-2'];
  }
};

export const saveSavedJobIds = (ids: string[]): void => {
  try {
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to save bookmarks to localStorage', err);
  }
};

export const toggleSavedJobId = (id: string): string[] => {
  const current = getSavedJobIds();
  const next = current.includes(id)
    ? current.filter((jobId) => jobId !== id)
    : [...current, id];
  saveSavedJobIds(next);
  return next;
};

export const getJobApplications = (): JobApplication[] => {
  try {
    const data = localStorage.getItem(APPLICATIONS_KEY);
    if (data) return JSON.parse(data);
    
    // Seed initial mock applications
    const initialApps: JobApplication[] = [
      {
        id: 'app-1',
        jobId: 'job-1',
        jobTitle: 'Product Designer',
        company: 'Apple',
        salary: '$200k-500k/year',
        appliedDate: 'Yesterday',
        status: 'Reviewing',
        coverLetter: 'Dear Apple Design Team,\n\nI am thrilled to apply for the Product Designer role...',
      },
      {
        id: 'app-2',
        jobId: 'job-5',
        jobTitle: 'Lead UI/UX Engineer',
        company: 'Figma',
        salary: '$180k-280k/year',
        appliedDate: '3 days ago',
        status: 'Interview Scheduled',
        coverLetter: 'Dear Figma Engineering,\n\nAs a long-time user and design tools enthusiast...',
      },
    ];
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(initialApps));
    return initialApps;
  } catch (err) {
    return [];
  }
};

export const addJobApplication = (app: Omit<JobApplication, 'id' | 'appliedDate'>): JobApplication => {
  const apps = getJobApplications();
  const newApp: JobApplication = {
    ...app,
    id: `app-${Date.now()}`,
    appliedDate: 'Just now',
  };
  const updated = [newApp, ...apps];
  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save application', err);
  }
  return newApp;
};

export const getUserProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : DEFAULT_USER_PROFILE;
  } catch (err) {
    return DEFAULT_USER_PROFILE;
  }
};

export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile', err);
  }
};

const RECENT_SEARCHES_KEY = 'job_finder_recent_searches_v1';

export const getRecentSearches = (): string[] => {
  try {
    const data = localStorage.getItem(RECENT_SEARCHES_KEY);
    return data ? JSON.parse(data) : ['UI/UX', 'Product Designer', 'Figma', 'React', 'Remote'];
  } catch (err) {
    return ['UI/UX', 'Product Designer', 'Figma', 'React', 'Remote'];
  }
};

export const addRecentSearch = (query: string): string[] => {
  const trimmed = query.trim();
  if (!trimmed) return getRecentSearches();
  const current = getRecentSearches().filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
  const updated = [trimmed, ...current].slice(0, 5);
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save recent search', err);
  }
  return updated;
};

export const clearRecentSearches = (): string[] => {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (err) {}
  return [];
};
