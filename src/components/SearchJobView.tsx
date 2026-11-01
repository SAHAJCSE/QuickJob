import React, { useState, useEffect } from 'react';
import { Job } from '../types';
import { CompanyLogo } from './CompanyLogo';
import { getRecentSearches, addRecentSearch, clearRecentSearches } from '../utils/storage';

interface SearchJobViewProps {
  jobs: Job[];
  savedJobIds: string[];
  appliedJobIds: string[];
  onBack: () => void;
  onSelectJob: (job: Job) => void;
  onToggleSave: (jobId: string, e: React.MouseEvent) => void;
  onApplyJob: (job: Job, e: React.MouseEvent) => void;
}

export const SearchJobView: React.FC<SearchJobViewProps> = ({
  jobs,
  savedJobIds,
  appliedJobIds,
  onBack,
  onSelectJob,
  onToggleSave,
  onApplyJob,
}) => {
  const [query, setQuery] = useState('UI/UX');
  const [activeCategory, setActiveCategory] = useState<'Jobs' | 'Companies' | 'Salaries'>('Jobs');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const handleExecuteSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      const updated = addRecentSearch(searchQuery);
      setRecentSearches(updated);
    }
  };

  const handleClearSearches = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  // Filter jobs based on query and category
  const filteredJobs = jobs.filter((job) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    if (activeCategory === 'Jobs') {
      return (
        job.title.toLowerCase().includes(q) ||
        job.tags.some((t) => t.toLowerCase().includes(q)) ||
        job.description.toLowerCase().includes(q)
      );
    } else if (activeCategory === 'Companies') {
      return job.company.toLowerCase().includes(q);
    } else {
      return job.salary.toLowerCase().includes(q);
    }
  });

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-8 pb-24 bg-[#F5F6FA]">
      {/* Header */}
      <header className="flex items-center justify-between pt-1 pb-4">
        <button
          type="button"
          aria-label="Go Back"
          onClick={onBack}
          className="w-11 h-11 rounded-full bg-[#181A20] text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs"
        >
          <svg className="w-5 h-5 -ml-0.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <h1 className="text-xl font-bold tracking-tight text-[#16171D] mr-8">Search Job</h1>
        <div className="w-3"></div>
      </header>

      {/* Search Bar Section */}
      <section className="mt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteSearch(query);
          }}
          className="flex items-center gap-2.5"
        >
          <div className="flex-1 h-14 bg-white rounded-full flex items-center px-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100/70">
            <svg className="w-5 h-5 text-gray-400 shrink-0 mr-2.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => handleExecuteSearch(query)}
              placeholder="Search job title, skill..."
              className="w-full bg-transparent border-0 text-[#191A23] font-semibold text-[15px] focus:ring-0 p-0 placeholder-gray-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold px-1"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            aria-label="Filter Options"
            className="w-14 h-14 rounded-2xl bg-[#D2F843] flex items-center justify-center text-black shrink-0 transition-transform active:scale-95 shadow-xs"
          >
            <svg className="w-6 h-6" fill="none" stroke="#16171D" strokeLinecap="round" strokeWidth="2.2" viewBox="0 0 24 24">
              <line x1="4" x2="20" y1="8" y2="8"></line>
              <circle cx="8" cy="8" fill="#16171D" r="2.2"></circle>
              <line x1="4" x2="20" y1="16" y2="16"></line>
              <circle cx="16" cy="16" fill="#16171D" r="2.2"></circle>
            </svg>
          </button>
        </form>
      </section>

      {/* Category Pills */}
      <div className="flex items-center gap-2.5 mt-5">
        {(['Jobs', 'Companies', 'Salaries'] as const).map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 font-bold text-sm rounded-full transition-all active:scale-95 ${
                isActive
                  ? 'bg-[#D2F843] text-[#14151B] shadow-xs'
                  : 'bg-[#E8E9EF] text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Recent Searches Section (Last 5 searches) */}
      <section className="mt-6">
        <div className="flex items-center justify-between py-1">
          <span className="text-base font-bold text-[#14151B]">Recent searches</span>
          {recentSearches.length > 0 && (
            <button
              onClick={handleClearSearches}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {recentSearches.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {recentSearches.map((searchItem, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleExecuteSearch(searchItem)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition active:scale-95 ${
                  query.toLowerCase() === searchItem.toLowerCase()
                    ? 'bg-[#181A20] text-white border-[#181A20]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {searchItem}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 mt-1">No recent searches yet.</p>
        )}

        <p className="text-xs text-gray-500 font-medium mt-3">
          Search results showing for <span className="text-gray-900 font-bold">"{activeCategory}"</span>
          {query ? ` matching "${query}"` : ''}
        </p>
      </section>

      {/* Job Cards List */}
      <div className="mt-4 flex flex-col gap-3.5">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 mt-2">
            <p className="text-sm font-semibold text-gray-600">No jobs found matching your search.</p>
            <button
              onClick={() => {
                setQuery('');
                setActiveCategory('Jobs');
              }}
              className="mt-3 px-4 py-2 bg-[#D2F843] text-[#14151B] text-xs font-bold rounded-full"
            >
              Clear Filter
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            const isApplied = appliedJobIds.includes(job.id);

            let cardBgClass = 'bg-white border border-slate-100/80';
            if (job.cardTheme === 'peach') {
              cardBgClass = 'bg-[#FDE8BF] border border-amber-200/40';
            } else if (job.cardTheme === 'mint') {
              cardBgClass = 'bg-[#D9F8DB] border border-emerald-100/50';
            }

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
                      <p className="text-xs text-gray-600 font-medium mt-0.5">{job.salary}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Save Job"
                    onClick={(e) => onToggleSave(job.id, e)}
                    className="text-[#14151B] p-1 hover:opacity-75 transition-opacity"
                  >
                    <svg
                      className={`w-5 h-5 ${isSaved ? 'fill-current' : 'fill-none stroke-current stroke-[2]'}`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </button>
                </div>

                {/* Bottom Row: Tags & Apply */}
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
                      isApplied
                        ? 'bg-[#181A20] text-white'
                        : 'bg-[#D2F843] text-[#14151B]'
                    }`}
                  >
                    {isApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
