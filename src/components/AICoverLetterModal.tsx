import React, { useState } from 'react';
import { Job, UserProfile } from '../types';

interface AICoverLetterModalProps {
  job: Job;
  userProfile: UserProfile;
  onClose: () => void;
  onSubmitApplication: (coverLetter: string) => void;
}

export const AICoverLetterModal: React.FC<AICoverLetterModalProps> = ({
  job,
  userProfile,
  onClose,
  onSubmitApplication,
}) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job.title,
          company: job.company,
          salary: job.salary,
          location: job.location,
          userProfile,
          notes: customNotes,
        }),
      });

      const data = await res.json();
      if (data.success && data.coverLetter) {
        setCoverLetter(data.coverLetter);
      } else {
        setCoverLetter(
          data.fallbackLetter ||
            `Dear ${job.company} Hiring Team,\n\nI am writing to express my enthusiastic interest in the ${job.title} role. With extensive experience in product design, design systems, and mobile interfaces, I am confident in adding immediate value to your team.\n\nSincerely,\n${userProfile.name}`
        );
      }
    } catch (err: any) {
      console.error('Failed to generate cover letter:', err);
      setCoverLetter(
        `Dear ${job.company} Hiring Manager,\n\nI am excited to submit my application for the ${job.title} role. My expertise in ${userProfile.skills.join(
          ', '
        )} aligns directly with your requirements.\n\nBest regards,\n${userProfile.name}`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLetter = coverLetter || `Applied to ${job.title} at ${job.company}.`;
    onSubmitApplication(finalLetter);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
      <div
        className="w-full max-w-[400px] bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#CEF237]">AI Application Assistant</span>
            <h3 className="text-sm font-bold truncate">Apply for {job.title}</h3>
            <p className="text-[11px] text-slate-300 font-medium">{job.company} • {job.salary}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-left flex-1">
          {/* AI Generation Trigger Box */}
          <div className="bg-[#ECE9FD] p-3.5 rounded-2xl border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-indigo-600 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
                AI Cover Letter Generator
              </span>
              <span className="text-[10px] bg-white text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[11px] text-indigo-900/80 mb-3">
              Craft a tailored cover letter using your profile skills ({userProfile.skills.slice(0, 3).join(', ')}) matched to {job.company}'s requirements.
            </p>

            <textarea
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Optional: Add specific highlights or achievements for this job..."
              className="w-full text-xs p-2.5 bg-white rounded-xl border border-indigo-200/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2.5"
              rows={2}
            />

            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="w-full py-2.5 bg-[#18181B] text-[#CEF237] font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-black transition disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-[#CEF237]" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating with Gemini AI...
                </>
              ) : (
                <>
                  <span>Generate Personal Cover Letter</span>
                </>
              )}
            </button>
          </div>

          {/* Letter Editor */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Cover Letter Preview & Edits:
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Your cover letter will appear here, or you can write a custom note to the recruiter..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800 min-h-[140px]"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-2.5 text-xs font-bold text-[#18181B] bg-[#CEF237] rounded-full shadow-md hover:brightness-95 active:scale-95 transition"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
};
