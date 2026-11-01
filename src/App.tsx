import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { ActiveScreen, Job, JobApplication, NavTab, UserProfile } from './types';
import { INITIAL_JOBS } from './data/jobs';
import {
  getSavedJobIds,
  toggleSavedJobId,
  getJobApplications,
  addJobApplication,
  getUserProfile,
  saveUserProfile,
} from './utils/storage';

import { OnboardingView } from './components/OnboardingView';
import { HomeView } from './components/HomeView';
import { SearchJobView } from './components/SearchJobView';
import { JobDetailsView } from './components/JobDetailsView';
import { ProfileView } from './components/ProfileView';
import { SavedJobsView } from './components/SavedJobsView';
import { ApplicationTrackerView } from './components/ApplicationTrackerView';
import { FloatingBottomNav } from './components/FloatingBottomNav';
import { AICoverLetterModal } from './components/AICoverLetterModal';
import { AuthView } from './components/AuthView';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('onboarding');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [jobs] = useState<Job[]>(INITIAL_JOBS);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(getUserProfile());
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isMobileFrameMode, setIsMobileFrameMode] = useState<boolean>(true);

  // Load persisted state and listen to Firebase auth changes
  useEffect(() => {
    setSavedJobIds(getSavedJobIds());
    setApplications(getJobApplications());
    setUserProfile(getUserProfile());

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const updatedProf: UserProfile = {
          ...userProfile,
          name: user.displayName || userProfile.name,
          avatarUrl: user.photoURL || userProfile.avatarUrl,
        };
        setUserProfile(updatedProf);
        saveUserProfile(updatedProf);
      }
    });

    return () => unsubscribe();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleToggleSave = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleSavedJobId(jobId);
    setSavedJobIds(updated);
    const job = jobs.find((j) => j.id === jobId);
    const isNowSaved = updated.includes(jobId);
    triggerToast(
      isNowSaved
        ? `Saved "${job?.title || 'Job'}" to bookmarks`
        : `Removed "${job?.title || 'Job'}" from saved`
    );
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setActiveScreen('details');
  };

  const handleOpenApplyModal = (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setApplyingJob(job);
  };

  const handleSubmitApplication = (coverLetter: string) => {
    if (!applyingJob) return;

    const newApp = addJobApplication({
      jobId: applyingJob.id,
      jobTitle: applyingJob.title,
      company: applyingJob.company,
      salary: applyingJob.salary,
      status: 'Reviewing',
      coverLetter,
    });

    setApplications((prev) => [newApp, ...prev]);
    setApplyingJob(null);
    triggerToast(`Application submitted for ${applyingJob.title} at ${applyingJob.company}!`);
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'home') setActiveScreen('home');
    else if (tab === 'saved') setActiveScreen('saved');
    else if (tab === 'tracker') setActiveScreen('tracker');
    else if (tab === 'profile') setActiveScreen('profile');
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    saveUserProfile(updated);
  };

  const handleAuthSuccess = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    saveUserProfile(updatedProfile);
    setShowAuthModal(false);
    triggerToast(`Welcome ${updatedProfile.name.split(' ')[0]}! Signed in successfully.`);
  };

  const appliedJobIds = applications.map((a) => a.jobId);

  // Render current active screen body
  const renderScreenContent = () => {
    if (showAuthModal) {
      return (
        <AuthView
          onSuccess={handleAuthSuccess}
          onCancel={() => setShowAuthModal(false)}
        />
      );
    }

    switch (activeScreen) {
      case 'onboarding':
        return (
          <OnboardingView
            onStart={() => setActiveScreen('home')}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        );

      case 'home':
        return (
          <HomeView
            jobs={jobs}
            userProfile={userProfile}
            savedJobIds={savedJobIds}
            appliedJobIds={appliedJobIds}
            onSelectJob={handleSelectJob}
            onToggleSave={handleToggleSave}
            onOpenSearch={() => setActiveScreen('search')}
            onOpenProfile={() => {
              setActiveTab('profile');
              setActiveScreen('profile');
            }}
            onApplyJob={(job, e) => handleOpenApplyModal(job, e)}
          />
        );

      case 'search':
        return (
          <SearchJobView
            jobs={jobs}
            savedJobIds={savedJobIds}
            appliedJobIds={appliedJobIds}
            onBack={() => setActiveScreen('home')}
            onSelectJob={handleSelectJob}
            onToggleSave={handleToggleSave}
            onApplyJob={(job, e) => handleOpenApplyModal(job, e)}
          />
        );

      case 'details':
        return (
          <JobDetailsView
            job={selectedJob || jobs[0]}
            isSaved={savedJobIds.includes((selectedJob || jobs[0]).id)}
            isApplied={appliedJobIds.includes((selectedJob || jobs[0]).id)}
            onBack={() => setActiveScreen('home')}
            onToggleSave={handleToggleSave}
            onOpenApplyModal={(job) => handleOpenApplyModal(job)}
          />
        );

      case 'profile':
        return (
          <ProfileView
            userProfile={userProfile}
            applications={applications}
            savedCount={savedJobIds.length}
            onBack={() => setActiveScreen('home')}
            onOpenTracker={() => {
              setActiveTab('tracker');
              setActiveScreen('tracker');
            }}
            onOpenSaved={() => {
              setActiveTab('saved');
              setActiveScreen('saved');
            }}
            onUpdateProfile={handleUpdateProfile}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        );

      case 'saved':
        return (
          <SavedJobsView
            jobs={jobs}
            savedJobIds={savedJobIds}
            appliedJobIds={appliedJobIds}
            onSelectJob={handleSelectJob}
            onToggleSave={handleToggleSave}
            onApplyJob={(job, e) => handleOpenApplyModal(job, e)}
          />
        );

      case 'tracker':
        return (
          <ApplicationTrackerView
            applications={applications}
            onBack={() => setActiveScreen('home')}
          />
        );

      default:
        return <HomeView jobs={jobs} userProfile={userProfile} savedJobIds={savedJobIds} appliedJobIds={appliedJobIds} onSelectJob={handleSelectJob} onToggleSave={handleToggleSave} onOpenSearch={() => setActiveScreen('search')} onOpenProfile={() => setActiveScreen('profile')} onApplyJob={(job, e) => handleOpenApplyModal(job, e)} />;
    }
  };

  const showFloatingNav = !showAuthModal && activeScreen !== 'onboarding' && activeScreen !== 'details';

  return (
    <div className="min-h-screen bg-[#E4E3EC] flex flex-col justify-between items-center p-0 md:p-6 select-none font-sans text-slate-900">
      {/* Top Header Bar */}
      <div className="w-full max-w-[420px] md:max-w-4xl flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-600 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Job Finder App</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileFrameMode(!isMobileFrameMode)}
            className="bg-white/80 backdrop-blur-xs hover:bg-white px-3 py-1 rounded-full border border-slate-300 shadow-2xs transition font-medium"
          >
            {isMobileFrameMode ? 'Expand Canvas' : 'Mobile View'}
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div
        className={`w-full bg-[#F2F1F8] relative flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 ${
          isMobileFrameMode
            ? 'max-w-[393px] h-[100dvh] md:h-[852px] md:rounded-[48px] border-0 md:border-[8px] md:border-[#18181B]'
            : 'max-w-4xl min-h-[852px] rounded-3xl border border-slate-300'
        }`}
      >
        {/* iOS Top Status Bar Area */}
        <div className="pt-3 px-7 flex justify-between items-center z-30 shrink-0 text-xs font-semibold text-slate-800 bg-transparent">
          <span className="tracking-tight">9:41</span>
          <div className="flex items-center space-x-1.5">
            {/* Signal Icon */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.22 19.58 10.56 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 2c3.87 0 7 3.13 7 7s-3.13 7-7 7-7-3.13-7-7 3.13-7 7-7z"></path>
            </svg>
            {/* Wifi Icon */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98A16.88 16.88 0 0 0 12 4zm0 3.5c3.53 0 6.78 1.34 9.24 3.53L12 19.3 2.76 11.03C5.22 8.84 8.47 7.5 12 7.5z"></path>
            </svg>
            {/* Battery Icon */}
            <div className="w-5 h-2.5 border border-slate-700 rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-slate-800 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="absolute top-10 inset-x-6 z-50 bg-[#18181B] text-white px-4 py-2.5 rounded-full text-xs font-bold text-center shadow-xl animate-fade-in flex items-center justify-center gap-2">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Render Active Screen Content */}
        <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          {renderScreenContent()}
        </div>

        {/* Floating Bottom Nav Bar */}
        {showFloatingNav && (
          <FloatingBottomNav
            activeTab={activeTab}
            onTabChange={handleTabChange}
            savedCount={savedJobIds.length}
            appliedCount={applications.length}
          />
        )}

        {/* iOS Home Indicator Bar */}
        <div className="h-5 w-full flex items-center justify-center shrink-0 pb-1 z-40 bg-transparent pointer-events-none">
          <div className="w-32 h-1 bg-slate-400/60 rounded-full"></div>
        </div>
      </div>

      {/* AI Cover Letter Generator Modal */}
      {applyingJob && (
        <AICoverLetterModal
          job={applyingJob}
          userProfile={userProfile}
          onClose={() => setApplyingJob(null)}
          onSubmitApplication={handleSubmitApplication}
        />
      )}
    </div>
  );
}
