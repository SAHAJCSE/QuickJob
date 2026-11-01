import React, { useState } from 'react';
import { JobApplication } from '../types';

interface ApplicationTrackerViewProps {
  applications: JobApplication[];
  onBack: () => void;
}

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  applications,
}) => {
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  const getStatusBadge = (status: JobApplication['status']) => {
    switch (status) {
      case 'Interview Scheduled':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Reviewing':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Offer':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      default:
        return 'bg-blue-100 text-blue-800 border border-blue-200';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-8 pb-28 bg-[#F2F4F8]">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-[#181A20]">Application Tracker</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          {applications.length} submitted applications tracked in real-time
        </p>
      </header>

      <div className="space-y-3.5">
        {applications.map((app) => (
          <div
            key={app.id}
            onClick={() => setSelectedApp(selectedApp?.id === app.id ? null : app)}
            className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100/70 cursor-pointer hover:border-slate-300 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#181A20]">{app.jobTitle}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{app.company} • {app.salary}</p>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadge(app.status)}`}>
                {app.status}
              </span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Applied {app.appliedDate}</span>
              <span className="text-indigo-600 font-bold hover:underline">
                {selectedApp?.id === app.id ? 'Hide Cover Letter ▲' : 'View Cover Letter ▼'}
              </span>
            </div>

            {selectedApp?.id === app.id && app.coverLetter && (
              <div className="mt-3 p-3 bg-slate-50 rounded-2xl text-xs text-slate-700 whitespace-pre-wrap border border-slate-200/60 animate-fade-in">
                <p className="font-bold text-slate-900 mb-1 text-[11px] uppercase tracking-wider">Submitted Cover Letter:</p>
                {app.coverLetter}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
