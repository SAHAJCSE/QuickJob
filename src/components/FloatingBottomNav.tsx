import React from 'react';
import { NavTab } from '../types';

interface FloatingBottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  savedCount?: number;
  appliedCount?: number;
}

export const FloatingBottomNav: React.FC<FloatingBottomNavProps> = ({
  activeTab,
  onTabChange,
  savedCount = 0,
  appliedCount = 0,
}) => {
  return (
    <div className="absolute bottom-5 inset-x-5 z-40 pointer-events-none">
      <nav
        aria-label="Bottom Dock Navigation"
        className="bg-white/95 backdrop-blur-md h-16 rounded-full px-5 flex items-center justify-between shadow-[0_12px_32px_-4px_rgba(30,27,56,0.12)] border border-slate-100 pointer-events-auto"
      >
        {/* Tab 1: Home */}
        <button
          type="button"
          aria-label="Home Tab"
          onClick={() => onTabChange('home')}
          className="relative w-12 h-12 flex items-center justify-center transition-transform active:scale-95"
        >
          {activeTab === 'home' ? (
            <div className="w-10 h-10 bg-[#CEF839] rounded-full flex items-center justify-center shadow-[0_6px_18px_-2px_rgba(206,248,57,0.45)]">
              <svg className="w-5 h-5 fill-[#18181B]" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
          ) : (
            <svg className="w-5 h-5 fill-none stroke-slate-400 hover:stroke-slate-700 stroke-[2.2]" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          )}
        </button>

        {/* Tab 2: Saved / Bookmarks */}
        <button
          type="button"
          aria-label="Saved Jobs Tab"
          onClick={() => onTabChange('saved')}
          className="relative w-12 h-12 flex items-center justify-center transition-transform active:scale-95"
        >
          {activeTab === 'saved' ? (
            <div className="w-10 h-10 bg-[#CEF839] rounded-full flex items-center justify-center shadow-[0_6px_18px_-2px_rgba(206,248,57,0.45)]">
              <svg className="w-5 h-5 fill-[#18181B]" viewBox="0 0 24 24">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
          ) : (
            <div className="relative">
              <svg className="w-5 h-5 fill-none stroke-slate-400 hover:stroke-slate-700 stroke-[2.2]" viewBox="0 0 24 24">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              {savedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-app-lime bg-[#CEF839] text-[#18181B] rounded-full text-[9px] font-extrabold flex items-center justify-center border border-white">
                  {savedCount}
                </span>
              )}
            </div>
          )}
        </button>

        {/* Tab 3: Application Tracker / Chat */}
        <button
          type="button"
          aria-label="Tracker Tab"
          onClick={() => onTabChange('tracker')}
          className="relative w-12 h-12 flex items-center justify-center transition-transform active:scale-95"
        >
          {activeTab === 'tracker' ? (
            <div className="w-10 h-10 bg-[#CEF839] rounded-full flex items-center justify-center shadow-[0_6px_18px_-2px_rgba(206,248,57,0.45)]">
              <svg className="w-5 h-5 stroke-[#18181B] fill-none stroke-[2.5]" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ) : (
            <div className="relative">
              <svg className="w-5 h-5 fill-none stroke-slate-400 hover:stroke-slate-700 stroke-[2.2]" viewBox="0 0 24 24">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {appliedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center border border-white">
                  {appliedCount}
                </span>
              )}
            </div>
          )}
        </button>

        {/* Tab 4: Profile */}
        <button
          type="button"
          aria-label="Profile Tab"
          onClick={() => onTabChange('profile')}
          className="relative w-12 h-12 flex items-center justify-center transition-transform active:scale-95"
        >
          {activeTab === 'profile' ? (
            <div className="w-10 h-10 bg-[#CEF839] rounded-full flex items-center justify-center shadow-[0_6px_18px_-2px_rgba(206,248,57,0.45)]">
              <svg className="w-5 h-5 fill-[#18181B]" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          ) : (
            <svg className="w-5 h-5 fill-none stroke-slate-400 hover:stroke-slate-700 stroke-[2.2]" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </button>
      </nav>
    </div>
  );
};
