export type LogoType = 'apple' | 'github' | 'spotify' | 'figma' | 'airbnb';
export type CardTheme = 'lavender' | 'peach' | 'mint' | 'white';

export interface Job {
  id: string;
  title: string;
  company: string;
  logoType: LogoType;
  logoBg?: string;
  cardTheme: CardTheme;
  salary: string;
  location: string;
  tags: string[];
  description: string;
  requirements: string[];
  postedTime: string;
  isPopular?: boolean;
  isRecentlyAdded?: boolean;
  jobCountText?: string; // e.g. "15 Jobs" for category banners
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  title: string;
  location: string;
  isOpenToOpportunities: boolean;
  cvFileName: string;
  cvFileSize: string;
  cvUploadedDate: string;
  skills: string[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  salary: string;
  appliedDate: string;
  status: 'Applied' | 'Reviewing' | 'Interview Scheduled' | 'Offer';
  coverLetter?: string;
}

export type NavTab = 'home' | 'saved' | 'tracker' | 'profile';
export type ActiveScreen = 'onboarding' | 'home' | 'search' | 'details' | 'profile' | 'tracker' | 'saved';
