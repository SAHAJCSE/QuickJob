import React, { useState } from 'react';
import { Job } from '../types';
import { CompanyLogo } from './CompanyLogo';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface JobDetailsViewProps {
  job: Job;
  isSaved: boolean;
  isApplied: boolean;
  onBack: () => void;
  onToggleSave: (jobId: string, e: React.MouseEvent) => void;
  onOpenApplyModal: (job: Job) => void;
}

export const JobDetailsView: React.FC<JobDetailsViewProps> = ({
  job,
  isSaved,
  isApplied,
  onBack,
  onToggleSave,
  onOpenApplyModal,
}) => {
  const [showDirectionsToast, setShowDirectionsToast] = useState(false);

  const handleGetDirections = () => {
    setShowDirectionsToast(true);
    setTimeout(() => setShowDirectionsToast(false), 3000);
  };

  // Helper to extract a numeric estimate from salary string for comparison chart
  const getSalaryBenchmarkData = (jobItem: Job) => {
    let offerVal = 250;
    if (jobItem.salary.includes('200k-500k')) offerVal = 350;
    else if (jobItem.salary.includes('180k-280k')) offerVal = 230;
    else if (jobItem.salary.includes('190k-340k')) offerVal = 265;
    else if (jobItem.salary.includes('1500')) offerVal = 180;
    else if (jobItem.salary.includes('500')) offerVal = 120;

    const medianVal = Math.round(offerVal * 0.82);
    const p25Val = Math.round(offerVal * 0.65);
    const p75Val = Math.round(offerVal * 1.08);

    const isAnnual = !jobItem.salary.includes('month');
    const unit = isAnnual ? 'k/yr' : 'k/yr eq.';

    return {
      chartData: [
        { label: '25th Pct', value: p25Val, isOffer: false },
        { label: 'Market Avg', value: medianVal, isOffer: false },
        { label: '75th Pct', value: p75Val, isOffer: false },
        { label: 'This Offer', value: offerVal, isOffer: true },
      ],
      pctDiff: Math.round(((offerVal - medianVal) / medianVal) * 100),
      offerVal,
      medianVal,
      unit,
    };
  };

  const benchmark = getSalaryBenchmarkData(job);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-white flex flex-col relative pb-28">
      {/* Top Bar / Curved Lavender Header */}
      <header
        className="relative bg-[#B9B4F8] pt-10 pb-16 px-6 flex-shrink-0"
        style={{
          borderBottomLeftRadius: '46% 28px',
          borderBottomRightRadius: '46% 28px',
        }}
      >
        {/* Navigation Row */}
        <nav aria-label="Main Navigation" className="flex items-center justify-between relative z-10">
          <button
            type="button"
            aria-label="Go Back"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#15161A] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            <svg className="w-5 h-5 -ml-0.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>

          <h1 className="text-[17px] font-bold text-[#15161A] tracking-tight">Job Details</h1>

          <button
            type="button"
            aria-label="Save Job"
            onClick={(e) => onToggleSave(job.id, e)}
            className="w-10 h-10 rounded-full bg-[#15161A] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            <svg
              className={`w-4 h-4 ${isSaved ? 'fill-[#CEF33D]' : 'fill-white'}`}
              viewBox="0 0 24 24"
            >
              <path d="M5 4a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 20V4z"></path>
            </svg>
          </button>
        </nav>

        {/* Central Circular Badge overlapping the curved header */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20">
          <div className="w-20 h-20 rounded-full bg-[#CEF33D] flex items-center justify-center shadow-lg border-[3.5px] border-white">
            <CompanyLogo type={job.logoType} className="w-10 h-10" iconClassName="w-7 h-7" bgOverride="bg-transparent text-[#15161A]" />
          </div>
        </div>
      </header>

      {/* Content Scroll Area */}
      <div className="flex-1 px-6 pt-12 space-y-6">
        {/* Job Heading */}
        <section className="text-center pt-2">
          <h2 className="text-2xl font-bold text-[#15161A] tracking-tight leading-tight">{job.title}</h2>
          <p className="text-xs font-semibold text-gray-700 mt-1 tracking-normal">{job.salary}</p>

          {/* Attribute Chips */}
          <div className="flex items-center justify-center gap-2.5 mt-4">
            {job.tags.map((tag, idx) => (
              <span key={idx} className="px-4 py-1.5 rounded-full text-[11px] font-medium text-gray-700 bg-[#F2F2F7]">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Job Description */}
        <section>
          <p className="text-[12.5px] leading-[1.65] text-[#80828D] font-normal text-left">
            {job.description}
          </p>
        </section>

        {/* SALARY DISTRIBUTION BENCHMARK CHART (Recharts Integration) */}
        <section className="bg-slate-50 rounded-3xl p-4 border border-slate-200/80 text-left space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-[#15161A] tracking-tight">Market Salary Comparison</h3>
              <p className="text-[10px] text-slate-500 font-medium">{job.title} in {job.location.split('(')[0].trim()}</p>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#CEF33D] text-[#15161A]">
              +{benchmark.pctDiff}% vs Avg
            </span>
          </div>

          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmark.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}k`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#15161A] text-white p-2 rounded-xl text-[10px] shadow-lg border border-slate-800">
                          <p className="font-bold">{data.label}</p>
                          <p className="text-[#CEF33D] font-mono font-bold">${data.value}k/yr</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={32}>
                  {benchmark.chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isOffer ? '#CEF33D' : '#15161A'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-2.5 bg-white rounded-2xl border border-slate-200/60 text-[11px] text-slate-600 font-medium leading-tight">
            This compensation offer is <strong className="text-slate-900">{benchmark.pctDiff}% higher</strong> than the regional market average of <strong className="text-slate-900">${benchmark.medianVal}k/yr</strong> for {job.title} roles.
          </div>
        </section>

        {/* Map Location Widget */}
        <section className="flex items-stretch gap-2.5 h-[84px]">
          {/* Map Graphic Box */}
          <div className="flex-1 bg-[#E8F3EE] rounded-2xl relative overflow-hidden border border-black/5 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 160 84">
              <rect fill="#EBF4EE" height="84" width="160"></rect>
              <path d="M-10,30 Q40,40 70,10 T180,20" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round"></path>
              <path d="M60,-10 L85,95" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round"></path>
              <path d="M-10,65 L170,45" stroke="#FFE5A3" strokeWidth="3.5" strokeLinecap="round"></path>
              <rect fill="#DCEDE3" height="24" rx="4" width="30" x="15" y="8"></rect>
              <rect fill="#D3EADA" height="32" rx="5" width="48" x="95" y="42"></rect>
              <rect fill="#E0F0E6" height="20" rx="3" width="35" x="105" y="8"></rect>
            </svg>

            {/* Map Pin Anchor */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-[#15161A] text-white flex items-center justify-center shadow-md border-2 border-white">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
                </svg>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 opacity-80"></div>
            </div>
          </div>

          {/* Get Direction Button */}
          <button
            type="button"
            aria-label="Get Map direction"
            onClick={handleGetDirections}
            className="w-[104px] bg-[#15161A] rounded-2xl flex flex-col items-center justify-center p-2 text-white active:scale-95 transition-transform group"
          >
            <div className="w-7 h-7 rounded-lg bg-transparent flex items-center justify-center mb-1">
              <svg className="w-5 h-5 text-[#CEF33D] fill-current" viewBox="0 0 24 24">
                <path d="M19.5 9.5l-6-6a1 1 0 00-1.41 0l-6 6a1 1 0 001.41 1.41L11 7.41V16a3 3 0 003 3h2a1 1 0 100-2h-2a1 1 0 01-1-1V7.41l3.59 3.59a1 1 0 001.41-1.41z"></path>
              </svg>
            </div>
            <span className="text-[10px] leading-tight text-center font-medium text-gray-200">
              Get<br />Map direction
            </span>
          </button>
        </section>

        {/* Directions Toast Notification */}
        {showDirectionsToast && (
          <div className="bg-emerald-900 text-emerald-100 p-3 rounded-xl text-xs font-medium animate-fade-in flex items-center justify-between shadow-md">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 fill-current text-emerald-300" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Directions loaded for {job.company} ({job.location})
            </span>
            <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded-full font-bold">12 mins</span>
          </div>
        )}

        {/* Requirements Section */}
        <section className="pt-1 pb-4">
          <h3 className="text-sm font-bold text-[#15161A] tracking-tight mb-2.5">Requirments</h3>
          <ul className="space-y-2">
            {job.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-[11.5px] leading-relaxed text-[#80828D]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#15161A] mt-1.5 flex-shrink-0"></span>
                <span>{req}</span>
              </li>
            ))}
            {/* Faded preview requirement item matching layout */}
            <li className="flex items-start gap-2.5 text-[11.5px] leading-relaxed text-gray-300 select-none opacity-40">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 flex-shrink-0"></span>
              <span>Minimum 2/5 Years Experience needed.</span>
            </li>
          </ul>
        </section>
      </div>

      {/* Floating Bottom Apply CTA */}
      <div className="absolute bottom-5 inset-x-0 px-6 z-30 pointer-events-none">
        <button
          type="button"
          onClick={() => onOpenApplyModal(job)}
          className="pointer-events-auto w-full max-w-[340px] mx-auto bg-[#CEF33D] hover:bg-[#c2e82e] text-[#15161A] font-bold text-sm py-3.5 px-6 rounded-full shadow-lg shadow-[#CEF33D]/30 border border-black/5 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <span>{isApplied ? 'Applied' : 'Apply Now'}</span>
          <svg className="w-4 h-4 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
            <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};
