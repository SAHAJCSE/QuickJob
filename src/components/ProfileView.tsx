import React, { useState } from 'react';
import { UserProfile, JobApplication } from '../types';

interface ProfileViewProps {
  userProfile: UserProfile;
  applications: JobApplication[];
  savedCount: number;
  onBack: () => void;
  onOpenTracker: () => void;
  onOpenSaved: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
  onOpenAuth?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  applications,
  savedCount,
  onBack,
  onOpenTracker,
  onOpenSaved,
  onUpdateProfile,
  onOpenAuth,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSkill, setIsEditingSkill] = useState(false);
  const [newSkillText, setNewSkillText] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Profile Edit Form State
  const [editName, setEditName] = useState(userProfile.name);
  const [editTitle, setEditTitle] = useState(userProfile.title);
  const [editLocation, setEditLocation] = useState(userProfile.location);
  const [editIsOpen, setEditIsOpen] = useState(userProfile.isOpenToOpportunities);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleSaveProfileForm = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...userProfile,
      name: editName,
      title: editTitle,
      location: editLocation,
      isOpenToOpportunities: editIsOpen,
    });
    setIsEditingProfile(false);
    triggerToast('Profile updated successfully');
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillText.trim()) return;
    const updatedSkills = [...userProfile.skills, newSkillText.trim()];
    onUpdateProfile({ ...userProfile, skills: updatedSkills });
    setNewSkillText('');
    setIsEditingSkill(false);
    triggerToast('Added new skill');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = userProfile.skills.filter((s) => s !== skillToRemove);
    onUpdateProfile({ ...userProfile, skills: updatedSkills });
    triggerToast('Removed skill');
  };

  const handleDownloadCV = () => {
    const element = document.createElement('a');
    const file = new Blob(
      [
        `CURRICULUM VITAE - ${userProfile.name.toUpperCase()}\nTitle: ${
          userProfile.title
        }\nLocation: ${userProfile.location}\nStatus: ${
          userProfile.isOpenToOpportunities ? 'Open to Opportunities' : 'Not Looking'
        }\n\nKey Skills:\n${userProfile.skills.map((s) => `- ${s}`).join('\n')}`,
      ],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = userProfile.cvFileName.replace('.pdf', '.txt');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast('CV downloaded');
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-3 pb-28 space-y-5 bg-[#F2F4F8]">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between py-1">
        <button
          type="button"
          aria-label="Go back"
          onClick={onBack}
          className="w-11 h-11 bg-[#181A20] rounded-full flex items-center justify-center text-white active:scale-95 transition-transform shadow-md"
        >
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M15.75 19.5L8.25 12l7.5-7.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>

        <h1 className="text-xl font-black tracking-tight text-[#181A20]">My Profile</h1>

        <button
          type="button"
          aria-label="Settings"
          onClick={() => setIsEditingProfile(true)}
          className="w-11 h-11 bg-[#181A20] rounded-full flex items-center justify-center text-white active:scale-95 transition-transform shadow-md"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path fillRule="evenodd" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" clipRule="evenodd" />
          </svg>
        </button>
      </nav>

      {/* Toast Alert */}
      {toastMsg && (
        <div className="bg-[#181A20] text-white px-4 py-2 rounded-2xl text-xs font-semibold text-center shadow-lg animate-fade-in">
          {toastMsg}
        </div>
      )}

      {/* Profile Hero Card */}
      <section className="bg-[#C5C7FA] rounded-3xl p-5 relative overflow-hidden shadow-xs">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/25 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center space-x-4 relative z-10">
          {/* Avatar with Frame */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-md flex items-start justify-center">
              <img
                alt={userProfile.name}
                className="w-full h-full object-cover object-top scale-110 translate-y-1"
                src={userProfile.avatarUrl}
              />
            </div>
            {userProfile.isOpenToOpportunities && (
              <span className="absolute bottom-0 right-1 w-4 h-4 bg-[#D4FF32] border-2 border-white rounded-full"></span>
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center space-x-1.5">
              <h2 className="text-xl font-black text-[#181A20] truncate">{userProfile.name}</h2>
              <span className="inline-flex items-center justify-center w-5 h-5 bg-[#181A20] text-white rounded-full text-[10px] font-bold">
                ✓
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-700 truncate mt-0.5">{userProfile.title}</p>
            <div className="flex items-center text-[11px] font-medium text-slate-600 mt-1">
              <svg className="w-3.5 h-3.5 mr-1 text-slate-700 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
              </svg>
              <span>{userProfile.location}</span>
            </div>
          </div>
        </div>

        {/* Hero Action Buttons */}
        <div className="mt-4 pt-3 border-t border-white/30 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-700">
            {userProfile.isOpenToOpportunities ? 'Open to opportunities' : 'Currently employed'}
          </span>
          <button
            type="button"
            onClick={() => setIsEditingProfile(true)}
            className="px-4 py-2 bg-[#D4FF32] text-[#181A20] font-black text-xs rounded-full shadow-[0_8px_20px_rgba(212,255,50,0.45)] active:scale-95 transition-transform flex items-center space-x-1.5"
          >
            <span>Edit Profile</span>
            <svg className="w-3.5 h-3.5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
        </div>
      </section>

      {/* Stats Trio Cards */}
      <section className="grid grid-cols-3 gap-3">
        {/* Stat 1: Applied */}
        <div
          onClick={onOpenTracker}
          className="bg-[#E5E7FC] p-3.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs cursor-pointer hover:bg-indigo-100 transition"
        >
          <span className="text-xl font-black text-[#181A20] leading-tight">{applications.length + 22}</span>
          <span className="text-[11px] font-bold text-slate-600 mt-1">Applied</span>
        </div>

        {/* Stat 2: Interviews */}
        <div
          onClick={onOpenTracker}
          className="bg-[#FFE2B3] p-3.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs cursor-pointer hover:bg-amber-200 transition"
        >
          <span className="text-xl font-black text-[#181A20] leading-tight">12</span>
          <span className="text-[11px] font-bold text-slate-700 mt-1">Interviews</span>
        </div>

        {/* Stat 3: Saved Jobs */}
        <div
          onClick={onOpenSaved}
          className="bg-[#D5F5DB] p-3.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs cursor-pointer hover:bg-emerald-200 transition"
        >
          <span className="text-xl font-black text-[#181A20] leading-tight">{savedCount}</span>
          <span className="text-[11px] font-bold text-slate-700 mt-1">Saved</span>
        </div>
      </section>

      {/* Resume Attachment Card */}
      <section className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100/70">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Attached Document</span>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Updated</span>
        </div>
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0 font-black text-xs">
              PDF
            </div>
            <div className="min-w-0 text-left">
              <h3 className="text-xs font-bold text-[#181A20] truncate">{userProfile.cvFileName}</h3>
              <p className="text-[10px] text-slate-400 font-medium">{userProfile.cvFileSize} • {userProfile.cvUploadedDate}</p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Download CV"
            onClick={handleDownloadCV}
            className="w-8 h-8 rounded-full bg-[#D4FF32] flex items-center justify-center text-[#181A20] shrink-0 active:scale-95 shadow-xs hover:brightness-95 transition"
          >
            <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
        </div>
      </section>

      {/* Profile Menu Items */}
      <section className="space-y-2.5">
        {/* Skills Pill Block */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100/70">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-[#181A20]">Key Expertise</h3>
            <button
              onClick={() => setIsEditingSkill(!isEditingSkill)}
              className="text-[11px] font-bold text-indigo-600 hover:underline"
            >
              {isEditingSkill ? 'Done' : 'Edit Skills'}
            </button>
          </div>

          {isEditingSkill && (
            <form onSubmit={handleAddSkill} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkillText}
                onChange={(e) => setNewSkillText(e.target.value)}
                placeholder="Add skill (e.g. Design Systems)..."
                className="flex-1 text-xs px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#181A20] text-white text-xs font-bold rounded-xl"
              >
                Add
              </button>
            </form>
          )}

          <div className="flex flex-wrap gap-1.5">
            {userProfile.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 flex items-center gap-1"
              >
                {skill}
                {isEditingSkill && (
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-500 font-bold ml-1 text-xs"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Menu Item: Job Preferences */}
        <button
          type="button"
          onClick={() => triggerToast('Preferences saved')}
          className="w-full bg-white rounded-2xl p-3.5 flex items-center justify-between shadow-xs active:bg-slate-50 transition-colors border border-slate-100/60 text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#D5F5DB] flex items-center justify-center text-slate-800">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-[#181A20] leading-tight">Job Preferences & Alerts</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Product Design • Full Time • $180k+</p>
            </div>
          </div>
          <svg className="w-4 h-4 text-slate-400 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>

        {/* Menu Item: Application History */}
        <button
          type="button"
          onClick={onOpenTracker}
          className="w-full bg-white rounded-2xl p-3.5 flex items-center justify-between shadow-xs active:bg-slate-50 transition-colors border border-slate-100/60 text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#E5E7FC] flex items-center justify-center text-indigo-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-[#181A20] leading-tight">Application Tracker</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {applications.length} submitted applications
              </p>
            </div>
          </div>
          <svg className="w-4 h-4 text-slate-400 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>

        {/* Menu Item: Account & Sign In (Firebase Auth) */}
        {onOpenAuth && (
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-full bg-[#181A20] text-white rounded-2xl p-3.5 flex items-center justify-between shadow-xs active:bg-black transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#D4FF32] flex items-center justify-center text-[#181A20] shrink-0 font-extrabold text-xs">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Account & Sign In</p>
                <p className="text-[10px] text-slate-300 font-medium mt-0.5">Firebase Google & Email Sign In</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-[#D4FF32] stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
        )}
      </section>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-[360px] bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 text-left">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#181A20]">Edit Profile Details</h3>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfileForm} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-slate-700">Open to Opportunities</span>
                <button
                  type="button"
                  onClick={() => setEditIsOpen(!editIsOpen)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    editIsOpen ? 'bg-[#D4FF32]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-slate-900 absolute top-0.5 transition-transform ${
                      editIsOpen ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#181A20] text-[#D4FF32] font-bold rounded-xl"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
