import React from 'react';
import { Job, UserProfile } from '../types';
import { CompanyLogo } from './CompanyLogo';

interface HomeViewProps {
  jobs: Job[];
  userProfile: UserProfile;
  savedJobIds: string[];
  appliedJobIds: string[];
  onSelectJob: (job: Job) => void;
  onToggleSave: (jobId: string, e: React.MouseEvent) => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  onApplyJob: (job: Job, e: React.MouseEvent) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  jobs,
  userProfile,
  savedJobIds,
  appliedJobIds,
  onSelectJob,
  onToggleSave,
  onOpenSearch,
  onOpenProfile,
  onApplyJob,
}) => {
  const popularJobs = jobs.filter((j) => j.isPopular);
  const recentlyAdded = jobs.filter((j) => j.isRecentlyAdded);

  // Recommended jobs based on user's profile skills
  const recommendedJobs = jobs.filter((job) =>
    userProfile.skills.some((skill) => {
      const s = skill.toLowerCase();
      return (
        job.title.toLowerCase().includes(s) ||
        job.tags.some((t) => t.toLowerCase().includes(s)) ||
        job.description.toLowerCase().includes(s)
      );
    })
  );

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pt-6 pb-28 px-5 bg-[#F2F1F8]">
      {/* Top Navigation Header */}
      <header className="flex items-center justify-between mt-1 mb-5">
        {/* Grid Menu Button */}
        <button
          type="button"
          aria-label="Menu"
          onClick={onOpenSearch}
          className="w-11 h-11 bg-[#18181B] rounded-2xl flex items-center justify-center text-white shadow-sm hover:opacity-90 active:scale-95 transition-transform"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <rect height="6" rx="2" width="6" x="4" y="4"></rect>
            <rect height="6" rx="2" width="6" x="14" y="4"></rect>
            <rect height="6" rx="2" width="6" x="4" y="14"></rect>
            <rect height="6" rx="2" width="6" x="14" y="14"></rect>
          </svg>
        </button>

        {/* User Profile Pill */}
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 bg-[#18181B] text-white pl-4 pr-1.5 py-1.5 rounded-full cursor-pointer hover:bg-black active:scale-95 transition shadow-sm"
        >
          <span className="text-xs font-semibold tracking-tight">{userProfile.name.split(' ')[0]}</span>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-200 border border-white/20 flex items-center justify-center shrink-0">
            <img
              alt={userProfile.name}
              className="w-full h-full object-cover"
              src={userProfile.avatarUrl}
            />
          </div>
        </div>
      </header>

      {/* Greeting Section */}
      <section className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#18181B] leading-snug">
          Wellcome {userProfile.name.split(' ')[0]} !!
        </h1>
        <p className="text-[#8E8E9A] text-[13px] font-normal mt-1">
          The bettar way to find your fancy job here
        </p>
      </section>

      {/* Search and Filter Bar */}
      <section className="mb-7 flex items-center gap-2.5">
        <div className="relative flex-1" onClick={onOpenSearch}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8E8E9A]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7"></circle>
              <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
            </svg>
          </div>
          <input
            readOnly
            onClick={onOpenSearch}
            className="w-full h-12 bg-white/90 border-0 rounded-full pl-11 pr-4 text-xs font-medium text-[#18181B] placeholder-[#8E8E9A] cursor-pointer shadow-sm tracking-tight"
            placeholder="Search location here..."
            type="text"
          />
        </div>

        {/* Filter Sliders Button */}
        <button
          type="button"
          aria-label="Filter"
          onClick={onOpenSearch}
          className="w-12 h-12 bg-[#CEF839] text-[#18181B] rounded-2xl flex items-center justify-center shadow-[0_6px_18px_-2px_rgba(206,248,57,0.45)] active:scale-95 transition-transform"
        >
          <svg className="w-5 h-5 stroke-current" fill="none" strokeLinecap="round" strokeWidth="2.2" viewBox="0 0 24 24">
            <line x1="4" x2="20" y1="7" y2="7"></line>
            <circle cx="9" cy="7" fill="#18181B" r="2.5"></circle>
            <line x1="4" x2="20" y1="17" y2="17"></line>
            <circle cx="15" cy="17" fill="#18181B" r="2.5"></circle>
          </svg>
        </button>
      </section>

      {/* Popular Jobs Section */}
      <section className="mb-7">
        <div className="flex items-center justify-between mb-3.5 px-0.5">
          <h2 className="text-base font-bold text-[#18181B] tracking-tight">Popular Jobs</h2>
        </div>

        {/* Horizontal Snap Carousel */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2 pt-1 snap-x">
          {popularJobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            const cardBgClass =
              job.cardTheme === 'lavender'
                ? 'bg-[#BFB9FA]'
                : job.cardTheme === 'peach'
                ? 'bg-[#FDE7C9]'
                : job.cardTheme === 'mint'
                ? 'bg-[#D8F7D9]'
                : 'bg-white';

            return (
              <article
                key={job.id}
                onClick={() => onSelectJob(job)}
                className={`snap-start min-w-[290px] max-w-[290px] ${cardBgClass} rounded-3xl p-5 flex flex-col justify-between shadow-sm cursor-pointer relative overflow-hidden transition-transform duration-200 active:scale-[0.98] border border-black/5`}
              >
                {/* Header: Logo, Title, Salary, Bookmark */}
                <div className="flex items-start gap-3.5 mb-4">
                  <CompanyLogo type={job.logoType} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-extrabold text-[#18181B] leading-tight truncate">{job.title}</h3>
                    <p className="text-xs font-bold text-[#18181B]/80 mt-0.5">{job.salary}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Bookmark"
                    onClick={(e) => onToggleSave(job.id, e)}
                    className="text-[#18181B]/60 hover:text-[#18181B] p-1.5 transition-colors"
                  >
                    <svg
                      className={`w-5 h-5 ${isSaved ? 'fill-[#18181B] stroke-[#18181B]' : 'fill-none stroke-current stroke-[2.2]'}`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </button>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {job.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-bold text-[#18181B] bg-white/80 backdrop-blur-xs shadow-2xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* RECOMMENDED FOR YOU SECTION */}
      {recommendedJobs.length > 0 && (
        <section className="mb-7">
          <div className="flex items-center justify-between mb-3.5 px-0.5">
            <div>
              <h2 className="text-base font-bold text-[#18181B] tracking-tight">Recommended for You</h2>
              <p className="text-xs text-[#8E8E9A] font-semibold mt-0.5">Matched to skills: {userProfile.skills.slice(0, 3).join(', ')}</p>
            </div>
            <button
              onClick={onOpenProfile}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Edit Skills
            </button>
          </div>

          <div className="space-y-4">
            {recommendedJobs.slice(0, 3).map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              const isApplied = appliedJobIds.includes(job.id);

              return (
                <article
                  key={`rec-${job.id}`}
                  onClick={() => onSelectJob(job)}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-indigo-100 flex flex-col gap-4 cursor-pointer active:scale-[0.99] transition relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-[#ECE9FD] text-indigo-900 text-[10px] font-extrabold px-3 py-1 rounded-bl-xl border-l border-b border-indigo-200">
                    98% Match
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3.5">
                      <CompanyLogo type={job.logoType} />
                      <div>
                        <h3 className="text-base font-extrabold text-[#18181B] leading-tight">{job.title}</h3>
                        <p className="text-xs font-bold text-[#8E8E9A] mt-0.5">{job.company} • {job.salary}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Save Job"
                      onClick={(e) => onToggleSave(job.id, e)}
                      className="text-[#8E8E9A] hover:text-[#18181B] p-1.5 transition-colors mr-[70px]"
                    >
                      <svg
                        className={`w-5 h-5 ${isSaved ? 'fill-[#18181B] stroke-[#18181B]' : 'fill-none stroke-current stroke-[2.2]'}`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {job.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-[#18181B] text-xs font-bold px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => onApplyJob(job, e)}
                      className={`font-bold text-xs px-4 py-2 rounded-full transition shadow-xs active:scale-95 ${
                        isApplied
                          ? 'bg-slate-900 text-white'
                          : 'bg-[#CEF839] text-[#18181B] hover:brightness-95'
                      }`}
                    >
                      {isApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Recently Added Section */}
      <section>
        <div className="flex items-center justify-between mb-3.5 px-0.5">
          <h2 className="text-base font-bold text-[#18181B] tracking-tight">Recently Added</h2>
          <button
            onClick={onOpenSearch}
            className="text-xs font-bold text-[#8E8E9A] hover:text-[#18181B] transition"
          >
            See All
          </button>
        </div>

        <div className="space-y-4">
          {recentlyAdded.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            const isApplied = appliedJobIds.includes(job.id);

            if (job.jobCountText) {
              return (
                <article
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="bg-[#D8F7D9] rounded-3xl p-5 flex items-center justify-between shadow-xs cursor-pointer hover:brightness-[0.99] active:scale-[0.99] transition"
                >
                  <div className="flex items-center gap-3.5">
                    <CompanyLogo type={job.logoType} />
                    <div>
                      <h3 className="text-base font-extrabold text-[#18181B] leading-tight">{job.title}</h3>
                      <p className="text-xs font-bold text-[#18181B]/80 mt-0.5">{job.jobCountText}</p>
                    </div>
                  </div>
                  <div className="text-[#18181B]/50 pr-1">
                    <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </div>
                </article>
              );
            }

            return (
              <article
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4 cursor-pointer active:scale-[0.99] transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <CompanyLogo type={job.logoType} />
                    <div>
                      <h3 className="text-base font-extrabold text-[#18181B] leading-tight">{job.title}</h3>
                      <p className="text-xs font-bold text-[#8E8E9A] mt-0.5">{job.salary}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Save Job"
                    onClick={(e) => onToggleSave(job.id, e)}
                    className="text-[#8E8E9A] hover:text-[#18181B] p-1.5 transition-colors"
                  >
                    <svg
                      className={`w-5 h-5 ${isSaved ? 'fill-[#18181B] stroke-[#18181B]' : 'fill-none stroke-current stroke-[2.2]'}`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </button>
                </div>

                {/* Footer Tags & Apply Button */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {job.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100/90 text-[#18181B] text-xs font-bold px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => onApplyJob(job, e)}
                    className={`font-bold text-xs px-4 py-2 rounded-full transition shadow-xs active:scale-95 ${
                      isApplied
                        ? 'bg-slate-900 text-white'
                        : 'bg-[#CEF839] text-[#18181B] hover:brightness-95'
                    }`}
                  >
                    {isApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
