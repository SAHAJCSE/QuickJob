import React from 'react';
import { Job } from '../types';
import { CompanyLogo } from './CompanyLogo';

interface SavedJobsViewProps {
  jobs: Job[];
  savedJobIds: string[];
  appliedJobIds: string[];
  onSelectJob: (job: Job) => void;
  onToggleSave: (jobId: string, e: React.MouseEvent) => void;
  onApplyJob: (job: Job, e: React.MouseEvent) => void;
}

export const SavedJobsView: React.FC<SavedJobsViewProps> = ({
  jobs,
  savedJobIds,
  appliedJobIds,
  onSelectJob,
  onToggleSave,
  onApplyJob,
}) => {
  const savedJobs = jobs.filter((job) => savedJobIds.includes(job.id));

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-8 pb-28 bg-[#F5F6FA]">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-[#16171D]">Saved Jobs</h1>
        <p className="text-xs text-gray-500 font-medium mt-1">
          {savedJobs.length} bookmarked {savedJobs.length === 1 ? 'job' : 'jobs'} saved to your profile
        </p>
      </header>

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 mt-4 shadow-xs">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <svg className="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 className="text-sm font-bold text-slate-800">No saved jobs yet</h3>
          <p className="text-xs text-slate-400 mt-1">Tap the bookmark icon on any job card to save it here for later.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {savedJobs.map((job) => {
            const isApplied = appliedJobIds.includes(job.id);
            let cardBgClass = 'bg-white border border-slate-100';
            if (job.cardTheme === 'peach') cardBgClass = 'bg-[#FDE8BF] border border-amber-200/40';
            else if (job.cardTheme === 'mint') cardBgClass = 'bg-[#D9F8DB] border border-emerald-100/50';

            return (
              <article
                key={job.id}
                onClick={() => onSelectJob(job)}
                className={`${cardBgClass} rounded-3xl p-4 shadow-xs cursor-pointer active:scale-[0.99] transition`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CompanyLogo type={job.logoType} />
                    <div>
                      <h2 className="text-sm font-bold text-[#14151B]">{job.title}</h2>
                      <p className="text-xs text-gray-700 font-medium mt-0.5">{job.company} • {job.salary}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Remove from Saved"
                    onClick={(e) => onToggleSave(job.id, e)}
                    className="text-[#14151B] p-1 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3.5 pt-1">
                  <div className="flex items-center gap-1.5">
                    {job.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-white/70 text-gray-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => onApplyJob(job, e)}
                    className={`px-3.5 py-1 text-[11px] font-bold rounded-full active:scale-95 transition-transform ${
                      isApplied ? 'bg-[#181A20] text-white' : 'bg-[#D2F843] text-[#14151B]'
                    }`}
                  >
                    {isApplied ? 'Applied ✓' : 'Apply'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
